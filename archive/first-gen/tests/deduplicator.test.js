const {
  ArticleDeduplicator,
  JaccardSimilarity,
  LevenshteinDistance
} = require('../deduplicator');

describe('Deduplicator', () => {
  let dedup;

  beforeEach(() => {
    // 默认 strategy='fuzzy'：链接 + 标题相似度 + 内容哈希全部生效
    dedup = new ArticleDeduplicator({ strategy: 'fuzzy', threshold: 0.8 });
  });

  describe('generateHash', () => {
    test('should produce identical hash for identical content', () => {
      expect(dedup.generateHash('波尔多红酒')).toBe(dedup.generateHash('波尔多红酒'));
    });

    test('should ignore case, punctuation and extra whitespace', () => {
      const a = dedup.generateHash('Bordeaux  Wine, 2020!');
      const b = dedup.generateHash('bordeaux wine 2020');
      expect(a).toBe(b);
    });

    test('should produce different hashes for different content', () => {
      expect(dedup.generateHash('波尔多红酒')).not.toBe(dedup.generateHash('勃艮第红酒'));
    });

    test('should not collapse all-Chinese content to the empty-string hash', () => {
      // 回归保护：旧实现用 [^\w\s] 清洗，会把纯中文洗成空串，
      // 导致所有中文文章都得到 md5('') 而互相判为重复
      const emptyHash = dedup.generateHash('');
      expect(dedup.generateHash('法国波尔多产区')).not.toBe(emptyHash);
      expect(dedup.generateHash('法国波尔多产区'))
        .not.toBe(dedup.generateHash('意大利托斯卡纳产区'));
    });
  });

  describe('extractTitleFeatures', () => {
    test('should keep latin words longer than 2 chars', () => {
      const features = dedup.extractTitleFeatures('The Best Wine Guide');
      expect(features.has('the')).toBe(true);
      expect(features.has('wine')).toBe(true);
      expect(features.has('guide')).toBe(true);
      expect(features.has('of')).toBe(false); // 长度为 2，被过滤
    });

    test('should tokenize Chinese titles into bigrams', () => {
      // 回归保护：旧实现会因 \w 不含汉字而返回空集合
      const features = dedup.extractTitleFeatures('波尔多红酒');
      expect(features.size).toBeGreaterThan(0);
      expect(features.has('波尔')).toBe(true);
      expect(features.has('尔多')).toBe(true);
    });

    test('should return empty set for empty input', () => {
      expect(dedup.extractTitleFeatures('').size).toBe(0);
      expect(dedup.extractTitleFeatures(null).size).toBe(0);
    });
  });

  describe('normalizeUrl', () => {
    test('should strip hash fragment', () => {
      expect(dedup.normalizeUrl('https://example.com/a#section')).toBe('https://example.com/a');
    });

    test('should drop utm_ tracking params but keep others', () => {
      const result = dedup.normalizeUrl('https://example.com/a?utm_source=x&id=7');
      expect(result).not.toContain('utm_source');
      expect(result).toContain('id=7');
    });

    test('should return original value for invalid url', () => {
      expect(dedup.normalizeUrl('not a url')).toBe('not a url');
    });
  });

  describe('isDuplicateLink', () => {
    test('should flag the same link twice', () => {
      expect(dedup.isDuplicateLink('https://example.com/a')).toBe(false);
      expect(dedup.isDuplicateLink('https://example.com/a')).toBe(true);
    });

    test('should treat utm variants as the same link', () => {
      expect(dedup.isDuplicateLink('https://example.com/a')).toBe(false);
      expect(dedup.isDuplicateLink('https://example.com/a?utm_source=wechat')).toBe(true);
    });

    test('should treat missing link as duplicate (invalid)', () => {
      expect(dedup.isDuplicateLink('')).toBe(true);
      expect(dedup.isDuplicateLink(null)).toBe(true);
    });
  });

  describe('isDuplicateTitle', () => {
    test('should flag an identical title', () => {
      expect(dedup.isDuplicateTitle('波尔多红酒指南')).toBe(false);
      expect(dedup.isDuplicateTitle('波尔多红酒指南')).toBe(true);
    });

    test('should flag a title contained in a longer one', () => {
      expect(dedup.isDuplicateTitle('波尔多红酒')).toBe(false);
      expect(dedup.isDuplicateTitle('波尔多红酒完全指南')).toBe(true);
    });

    test('should not flag unrelated titles', () => {
      expect(dedup.isDuplicateTitle('波尔多红酒指南')).toBe(false);
      expect(dedup.isDuplicateTitle('新西兰长相思入门')).toBe(false);
    });

    test('should treat empty title as duplicate (invalid)', () => {
      expect(dedup.isDuplicateTitle('')).toBe(true);
    });
  });

  describe('add', () => {
    test('should keep a unique article', () => {
      const result = dedup.add({ title: '波尔多红酒指南', content: '正文内容一', link: 'https://a.com/1' });
      expect(result).toEqual({ kept: true, reason: 'unique' });
    });

    test('should reject an article without title', () => {
      expect(dedup.add({ content: 'x' })).toEqual({ kept: false, reason: 'invalid_article' });
      expect(dedup.add(null)).toEqual({ kept: false, reason: 'invalid_article' });
    });

    test('should reject a duplicate link', () => {
      dedup.add({ title: '标题一', link: 'https://a.com/1' });
      expect(dedup.add({ title: '标题二', link: 'https://a.com/1' }))
        .toEqual({ kept: false, reason: 'duplicate_link' });
    });

    test('should reject a duplicate title', () => {
      dedup.add({ title: '波尔多红酒指南' });
      expect(dedup.add({ title: '波尔多红酒指南' }))
        .toEqual({ kept: false, reason: 'duplicate_title' });
    });

    test('should reject a duplicate content hash', () => {
      dedup.add({ title: '标题一', content: '完全一样的正文' });
      expect(dedup.add({ title: '标题二', content: '完全一样的正文' }))
        .toEqual({ kept: false, reason: 'duplicate_content' });
    });

    test('with strategy=exact, similar titles should be kept', () => {
      const exactDedup = new ArticleDeduplicator({ strategy: 'exact' });
      exactDedup.add({ title: '波尔多红酒' });
      // exact 策略不做标题相似度判定
      expect(exactDedup.add({ title: '波尔多红酒完全指南' }).kept).toBe(true);
    });
  });

  describe('process', () => {
    test('should deduplicate a batch and report stats', () => {
      const result = dedup.process([
        { title: '波尔多红酒指南', content: '正文一', link: 'https://a.com/1' },
        { title: '波尔多红酒指南', content: '正文二', link: 'https://a.com/2' }, // 标题重复
        { title: '新西兰长相思入门', content: '正文三', link: 'https://a.com/3' },
        { content: '正文四' } // 无 title -> invalid_article
      ]);

      expect(result.articles).toHaveLength(2);
      expect(result.stats.total).toBe(4);
      expect(result.stats.kept).toBe(2);
      expect(result.stats.removed).toBe(2);
      expect(result.stats.reasons.unique).toBe(2);
      expect(result.stats.reasons.duplicate_title).toBe(1);
      expect(result.stats.reasons.invalid_article).toBe(1);
    });

    test('should handle an empty array', () => {
      const result = dedup.process([]);
      expect(result.articles).toEqual([]);
      expect(result.stats.total).toBe(0);
      expect(result.stats.kept).toBe(0);
    });

    test('should be efficient on a large batch of distinct articles', () => {
      const articles = Array.from({ length: 300 }, (_, i) => ({
        title: `酒款${i}号评测`,
        content: `这是第${i}号酒款的独立评测正文`,
        link: `https://a.com/${i}`
      }));
      const result = dedup.process(articles);
      expect(result.stats.kept).toBe(300);
    });
  });

  describe('reset and stats', () => {
    test('should reset all internal state', () => {
      dedup.add({ title: '标题一', content: '正文一', link: 'https://a.com/1' });
      expect(dedup.getStats().processed).toBe(1);

      dedup.reset();

      const stats = dedup.getStats();
      expect(stats.processed).toBe(0);
      expect(stats.uniqueLinks).toBe(0);
      expect(stats.uniqueTitles).toBe(0);
      expect(stats.uniqueHashes).toBe(0);
      // 重置后同样的文章应重新被接受
      expect(dedup.add({ title: '标题一', content: '正文一', link: 'https://a.com/1' }).kept).toBe(true);
    });
  });
});

describe('similarity helpers', () => {
  test('JaccardSimilarity should compute intersection over union', () => {
    expect(JaccardSimilarity(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(1);
    expect(JaccardSimilarity(new Set(['a', 'b']), new Set(['c', 'd']))).toBe(0);
    expect(JaccardSimilarity(new Set(['a', 'b']), new Set(['a', 'c']))).toBeCloseTo(1 / 3);
  });

  test('JaccardSimilarity should return 0 for empty sets', () => {
    expect(JaccardSimilarity(new Set(), new Set(['a']))).toBe(0);
    expect(JaccardSimilarity(new Set(), new Set())).toBe(0);
  });

  test('LevenshteinDistance should count edit distance', () => {
    expect(LevenshteinDistance('kitten', 'kitten')).toBe(0);
    expect(LevenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(LevenshteinDistance('', 'abc')).toBe(3);
    expect(LevenshteinDistance('abc', '')).toBe(3);
  });
});
