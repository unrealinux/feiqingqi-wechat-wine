const { ArticleQualityScorer } = require('../quality-scorer');

/**
 * 说明：本模块的五个维度均返回 0-100 分，综合得分按权重加权后仍在 0-100 区间。
 * （历史测试曾按 0-1 区间断言，与实现不符，属于测试与实现脱节。）
 */
describe('QualityScorer', () => {
  let scorer;

  beforeEach(() => {
    scorer = new ArticleQualityScorer();
  });

  describe('relevance scoring', () => {
    test('should score high for wine-related content', () => {
      const article = {
        title: '法国红酒品鉴与波尔多产区介绍',
        content: '本文介绍法国波尔多产区的红酒，包含详细的品酒笔记与酒庄走访记录。',
        tags: ['红酒', '波尔多'],
        source: 'decanter'
      };
      expect(scorer.scoreRelevance(article)).toBeGreaterThan(50);
    });

    test('should score low for irrelevant content', () => {
      const article = {
        title: '今日天气预报',
        content: '今天天气晴朗，气温适宜，适合外出散步。'
      };
      expect(scorer.scoreRelevance(article)).toBeLessThan(20);
    });

    test('should never exceed 100', () => {
      const article = {
        title: '红酒 葡萄酒 品酒 酒庄 产区 葡萄 干红 干白 起泡酒 香槟 酿酒 赤霞珠 梅洛 霞多丽 黑皮诺 波尔多 勃艮第',
        content: '红酒 葡萄酒 品酒 酒庄 产区 葡萄 干红 干白 起泡酒 香槟 酿酒'.repeat(20),
        tags: ['a', 'b', 'c', 'd', 'e', 'f'],
        source: 'decanter'
      };
      expect(scorer.scoreRelevance(article)).toBeLessThanOrEqual(100);
    });

    test('should give bonus for authoritative wine sources', () => {
      const base = { title: '波尔多红酒', content: '波尔多红酒介绍' };
      const withSource = { ...base, source: 'wine-world.com' };
      expect(scorer.scoreRelevance(withSource)).toBeGreaterThan(scorer.scoreRelevance(base));
    });
  });

  describe('freshness scoring', () => {
    test('should score 100 for articles published within a day', () => {
      expect(scorer.scoreFreshness({ pubDate: new Date().toISOString() })).toBe(100);
    });

    test('should score low for old articles', () => {
      const old = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
      expect(scorer.scoreFreshness({ pubDate: old })).toBeLessThanOrEqual(30);
    });

    test('should default to 50 when date is missing or invalid', () => {
      expect(scorer.scoreFreshness({})).toBe(50);
      expect(scorer.scoreFreshness({ pubDate: 'not-a-date' })).toBe(50);
    });

    test('should accept publishedAt and date as aliases for pubDate', () => {
      const now = new Date().toISOString();
      expect(scorer.scoreFreshness({ publishedAt: now })).toBe(100);
      expect(scorer.scoreFreshness({ date: now })).toBe(100);
    });
  });

  describe('completeness scoring', () => {
    test('should score high for complete articles', () => {
      const article = {
        title: '完整的文章标题示例',
        content: '内容'.repeat(400), // 800 字，落在 500-5000 区间
        author: '张三',
        tags: ['红酒'],
        thumbnail: 'https://example.com/cover.jpg'
      };
      expect(scorer.scoreCompleteness(article)).toBeGreaterThanOrEqual(85);
    });

    test('should score low for incomplete articles', () => {
      expect(scorer.scoreCompleteness({ title: '短标题', content: '短内容' })).toBeLessThan(40);
    });

    test('should penalize over-long titles', () => {
      const longTitle = '标题'.repeat(30); // 超过 50 字
      const withLongTitle = scorer.scoreCompleteness({ title: longTitle, content: '内容'.repeat(400) });
      const withGoodTitle = scorer.scoreCompleteness({ title: '合适的标题长度', content: '内容'.repeat(400) });
      expect(withLongTitle).toBeLessThan(withGoodTitle);
    });

    test('should not count placeholder author', () => {
      const withUnknown = scorer.scoreCompleteness({ title: '标题示例文本', author: '未知' });
      const withReal = scorer.scoreCompleteness({ title: '标题示例文本', author: '李四' });
      expect(withReal).toBeGreaterThan(withUnknown);
    });
  });

  describe('authority scoring', () => {
    test('should score high for authoritative sources', () => {
      const article = {
        source: 'decanter',
        author: '葡萄酒专家',
        link: 'https://www.decanter.com/article'
      };
      expect(scorer.scoreAuthority(article)).toBeGreaterThan(60);
    });

    test('should fall back to base score for unknown sources', () => {
      expect(scorer.scoreAuthority({ source: '未知网站', author: '网友' })).toBe(40);
    });

    test('should ignore example.com placeholder links', () => {
      const withPlaceholder = scorer.scoreAuthority({ link: 'https://example.com/a' });
      const withReal = scorer.scoreAuthority({ link: 'https://decanter.com/a' });
      expect(withReal).toBeGreaterThan(withPlaceholder);
    });
  });

  describe('engagement scoring', () => {
    test('should default to 50 without metrics', () => {
      expect(scorer.scoreEngagement({})).toBe(50);
    });

    test('should reward shares, comments and views', () => {
      const article = { shares: 10, comments: 10, views: 10000 };
      expect(scorer.scoreEngagement(article)).toBeGreaterThan(50);
    });

    test('should never exceed 100', () => {
      expect(scorer.scoreEngagement({ shares: 9999, comments: 9999, views: 10 ** 9 })).toBeLessThanOrEqual(100);
    });
  });

  describe('overall scoring', () => {
    test('should return total, breakdown and weights', () => {
      const result = scorer.score({
        title: '法国红酒品鉴指南',
        content: '内容'.repeat(300),
        author: '李四',
        pubDate: new Date().toISOString(),
        source: 'decanter'
      });

      expect(result.total).toBeGreaterThan(0);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(Object.keys(result.breakdown).sort()).toEqual(
        ['authority', 'completeness', 'engagement', 'freshness', 'relevance']
      );
      expect(result.weight).toEqual(scorer.weights);
    });

    test('weights should sum to 1', () => {
      const sum = Object.values(scorer.weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1);
    });

    test('should honor custom weights', () => {
      const relevanceOnly = new ArticleQualityScorer({ relevanceWeight: 1, freshnessWeight: 0, completenessWeight: 0, authorityWeight: 0, engagementWeight: 0 });
      const article = { title: '波尔多红酒品鉴', content: '波尔多红酒品鉴内容' };
      expect(relevanceOnly.score(article).total).toBe(Math.round(relevanceOnly.scoreRelevance(article)));
    });
  });

  describe('batch sorting and filtering', () => {
    test('scoreBatch should sort by total descending', () => {
      const articles = [
        { id: 'low', title: '短', content: '短' },
        { id: 'high', title: '法国红酒品鉴指南', content: '波尔多红酒'.repeat(200), author: '专家', source: 'decanter', pubDate: new Date().toISOString() },
        { id: 'mid', title: '中等质量的葡萄酒文章', content: '红酒内容'.repeat(100) }
      ];

      const sorted = scorer.scoreBatch(articles);
      expect(sorted).toHaveLength(3);
      expect(sorted[0].article.id).toBe('high');
      expect(sorted[2].article.id).toBe('low');
      expect(sorted[0].score.total).toBeGreaterThanOrEqual(sorted[1].score.total);
    });

    test('filterHighQuality should keep only articles above the threshold', () => {
      const articles = [
        { id: 'low', title: '短', content: '短' },
        { id: 'high', title: '法国红酒品鉴指南', content: '波尔多红酒'.repeat(200), author: '专家', source: 'decanter', pubDate: new Date().toISOString() }
      ];

      const filtered = scorer.filterHighQuality(articles, 60);
      expect(filtered.map(a => a.id)).toEqual(['high']);
    });

    test('filterHighQuality should return articles, not score wrappers', () => {
      const articles = [{ id: 'x', title: '法国红酒品鉴指南', content: '波尔多红酒'.repeat(200) }];
      const filtered = scorer.filterHighQuality(articles, 0);
      expect(filtered[0]).toHaveProperty('id', 'x');
      expect(filtered[0]).not.toHaveProperty('score');
    });
  });
});
