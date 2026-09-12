/**
 * Aggregator 接线测试
 *
 * 背景：deduplicator.js 与 quality-scorer.js 早已实现并有测试，但
 * aggregator.js **从未调用它们** —— README 承诺的「去重」实际从未生效。
 * 本文件守住刚接上的这条链路。
 */

const Aggregator = require('../aggregator');

/** 构造一篇内容足够长的文章（避免触发完整性维度的低分） */
function makeArticle(overrides = {}) {
  return {
    title: '波尔多红酒完全指南',
    link: 'https://example.com/a/1',
    content: '波尔多红酒的完整介绍，涵盖产区、品种与品鉴要点。'.repeat(8),
    tags: ['波尔多', '红酒'],
    source: 'decanter',
    pubDate: new Date().toISOString(),
    ...overrides
  };
}

describe('Aggregator 构造与默认选项', () => {
  test('默认策略为 fuzzy、阈值 0.8、不过滤', () => {
    const agg = new Aggregator();
    expect(agg.options.dedupStrategy).toBe('fuzzy');
    expect(agg.options.dedupThreshold).toBe(0.8);
    expect(agg.options.minQualityScore).toBe(0);
  });

  test('应接受自定义选项', () => {
    const agg = new Aggregator({ dedupStrategy: 'exact', minQualityScore: 60 });
    expect(agg.options.dedupStrategy).toBe('exact');
    expect(agg.options.minQualityScore).toBe(60);
  });
});

describe('Aggregator.deduplicate', () => {
  test('应移除重复文章并返回统计', () => {
    const agg = new Aggregator();
    const articles = [
      makeArticle(),
      makeArticle(),                              // 完全重复（标题/链接/内容均相同）
      makeArticle({
        title: '新西兰长相思入门',
        link: 'https://example.com/b/2',
        // 内容必须不同：内容哈希在 exact 与 fuzzy 下都会判重
        content: '新西兰马尔堡产区长相思的香气特征与配餐建议。'.repeat(8)
      })
    ];

    const { articles: kept, stats } = agg.deduplicate(articles);

    expect(stats.total).toBe(3);
    expect(stats.kept).toBe(2);
    expect(stats.removed).toBe(1);
    expect(kept).toHaveLength(2);
  });

  test('应把 URL 跟踪参数变体视为同一篇', () => {
    const agg = new Aggregator();
    const articles = [
      makeArticle({ link: 'https://example.com/a/1' }),
      makeArticle({ title: '另一标题', link: 'https://example.com/a/1?utm_source=wechat' })
    ];

    const { stats } = agg.deduplicate(articles);
    expect(stats.removed).toBe(1);
    expect(stats.reasons.duplicate_link).toBe(1);
  });

  test('【关键】每次调用必须使用全新去重器，不得跨批次误杀', () => {
    // 去重器内部累积「已见过」的链接/标题/哈希。
    // 若复用实例，第二次调用会把同一篇文章判为重复而丢弃 ——
    // 这是很隐蔽的跨批次误杀，因此单独立测试守住。
    const agg = new Aggregator();
    const batch = [makeArticle()];

    const first = agg.deduplicate(batch);
    const second = agg.deduplicate(batch);

    expect(first.stats.kept).toBe(1);
    expect(second.stats.kept).toBe(1);
    expect(second.stats.removed).toBe(0);
  });

  test('应遵循 strategy 选项', () => {
    const exact = new Aggregator({ dedupStrategy: 'exact' });
    const fuzzy = new Aggregator({ dedupStrategy: 'fuzzy' });
    // 标题相似但内容不同，以便单独考察标题相似度这一维度
    const articles = [
      makeArticle({ title: '波尔多红酒' }),
      makeArticle({
        title: '波尔多红酒完全指南',
        link: 'https://example.com/a/2',
        content: '另一篇内容完全不同的文章，用于隔离内容哈希的影响。'.repeat(8)
      })
    ];

    // exact 只做链接 + 内容哈希，相似标题不算重复
    expect(exact.deduplicate(articles).stats.kept).toBe(2);
    // fuzzy 额外做标题相似度（后者完全包含前者）
    expect(fuzzy.deduplicate(articles).stats.kept).toBe(1);
  });

  test('空数组应安全返回', () => {
    const agg = new Aggregator();
    const { articles, stats } = agg.deduplicate([]);
    expect(articles).toEqual([]);
    expect(stats.kept).toBe(0);
  });
});

describe('Aggregator.scoreQuality', () => {
  test('应按综合分降序排列', () => {
    const agg = new Aggregator();
    const articles = [
      { title: '短', content: '短', link: 'https://x/1' },
      makeArticle({ title: '法国波尔多红酒品鉴指南', link: 'https://x/2' }),
      { title: '中等长度的葡萄酒文章标题', content: '红酒内容'.repeat(30), link: 'https://x/3' }
    ];

    const { articles: scored } = agg.scoreQuality(articles);
    const totals = scored.map((a) => a.qualityScore);

    expect(totals).toEqual([...totals].sort((a, b) => b - a));
  });

  test('应把 qualityScore 与 qualityBreakdown 附加到文章上', () => {
    const agg = new Aggregator();
    const { articles } = agg.scoreQuality([makeArticle()]);

    expect(typeof articles[0].qualityScore).toBe('number');
    expect(articles[0].qualityScore).toBeGreaterThanOrEqual(0);
    expect(articles[0].qualityScore).toBeLessThanOrEqual(100);
    expect(Object.keys(articles[0].qualityBreakdown).sort()).toEqual(
      ['authority', 'completeness', 'engagement', 'freshness', 'relevance']
    );
  });

  test('默认不删除任何文章（静默丢内容比排序错误更危险）', () => {
    const agg = new Aggregator();
    const articles = [
      { title: '极短', content: 'x', link: 'https://x/1' },
      makeArticle({ link: 'https://x/2' })
    ];

    const { articles: kept, stats } = agg.scoreQuality(articles);
    expect(stats.filtered).toBe(0);
    expect(kept).toHaveLength(2);
  });

  test('显式设置 minQualityScore 时应过滤低分文章', () => {
    const agg = new Aggregator({ minQualityScore: 60 });
    const articles = [
      { title: '短', content: '短', link: 'https://x/1' },
      makeArticle({ title: '法国波尔多红酒品鉴指南', link: 'https://x/2' })
    ];

    const { articles: kept, stats } = agg.scoreQuality(articles);
    expect(stats.filtered).toBeGreaterThan(0);
    expect(kept.every((a) => a.qualityScore >= 60)).toBe(true);
  });

  test('统计信息应一致（total = kept + filtered）', () => {
    const agg = new Aggregator({ minQualityScore: 50 });
    const { stats } = agg.scoreQuality([
      { title: '短', content: '短', link: 'https://x/1' },
      makeArticle({ link: 'https://x/2' })
    ]);

    expect(stats.total).toBe(stats.kept + stats.filtered);
    expect(stats.avg).toBeGreaterThanOrEqual(stats.min);
    expect(stats.avg).toBeLessThanOrEqual(stats.max);
  });

  test('空数组应安全返回', () => {
    const agg = new Aggregator();
    const { articles, stats } = agg.scoreQuality([]);
    expect(articles).toEqual([]);
    expect(stats).toMatchObject({ total: 0, kept: 0, min: 0, max: 0, avg: 0 });
  });
});
