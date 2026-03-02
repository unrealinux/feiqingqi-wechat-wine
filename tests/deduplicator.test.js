const Deduplicator = require('../deduplicator');

describe('Deduplicator', () => {
  let dedup;

  beforeEach(() => {
    dedup = new Deduplicator({
      windowHours: 24,
      similarityThreshold: 0.8
    });
  });

  describe('exact deduplication', () => {
    test('should detect exact duplicate', () => {
      const articles = [
        { id: '1', title: '红酒新闻', url: 'https://example.com/1' },
        { id: '2', title: '红酒新闻', url: 'https://example.com/2' }
      ];
      
      const result = dedup.deduplicate(articles);
      expect(result.duplicates.length).toBe(1);
    });

    test('should keep first article of exact duplicates', () => {
      const articles = [
        { id: '1', title: '红酒新闻', url: 'https://example.com/1' },
        { id: '2', title: '红酒新闻', url: 'https://example.com/2' }
      ];
      
      const result = dedup.deduplicate(articles);
      expect(result.kept[0].id).toBe('1');
    });

    test('should not flag different articles as duplicates', () => {
      const articles = [
        { id: '1', title: '红酒新闻', url: 'https://example.com/1' },
        { id: '2', title: '葡萄酒评测', url: 'https://example.com/2' }
      ];
      
      const result = dedup.deduplicate(articles);
      expect(result.duplicates.length).toBe(0);
      expect(result.kept.length).toBe(2);
    });
  });

  describe('fuzzy deduplication', () => {
    test('should detect similar titles', () => {
      const articles = [
        { id: '1', title: '2026年红酒行业发展报告', url: 'https://example.com/1' },
        { id: '2', title: '2026年红酒行业发展趋势报告', url: 'https://example.com/2' }
      ];
      
      const result = dedup.deduplicate(articles);
      expect(result.duplicates.length).toBeGreaterThan(0);
    });

    test('should not flag dissimilar titles', () => {
      const articles = [
        { id: '1', title: '红酒与美食搭配指南', url: 'https://example.com/1' },
        { id: '2', title: '法国产区介绍', url: 'https://example.com/2' }
      ];
      
      const result = dedup.deduplicate(articles);
      expect(result.duplicates.length).toBe(0);
    });
  });

  describe('URL normalization', () => {
    test('should normalize similar URLs', () => {
      const url1 = 'https://example.com/article?id=123';
      const url2 = 'https://example.com/article?id=123&source=test';
      
      expect(dedup.normalizeUrl(url1)).toBe(dedup.normalizeUrl(url2));
    });

    test('should handle different protocols', () => {
      const http = dedup.normalizeUrl('http://example.com');
      const https = dedup.normalizeUrl('https://example.com');
      
      // Should be similar but not exact match
      expect(http).toContain('example.com');
    });
  });

  describe('content similarity', () => {
    test('should calculate content similarity', () => {
      const text1 = '这是一篇关于红酒的文章，包含丰富的酒评信息。';
      const text2 = '这是一篇关于红酒的文章，包含丰富的酒评信息。';
      
      const similarity = dedup.calculateSimilarity(text1, text2);
      expect(similarity).toBeGreaterThan(0.9);
    });

    test('should return low similarity for different content', () => {
      const text1 = '红酒是世界上最受欢迎的饮品之一。';
      const text2 = '今天的天气非常晴朗，适合外出游玩。';
      
      const similarity = dedup.calculateSimilarity(text1, text2);
      expect(similarity).toBeLessThan(0.3);
    });
  });

  describe('history tracking', () => {
    test('should add to history after deduplication', () => {
      const article = { id: '1', title: '测试文章', url: 'https://example.com/1' };
      
      dedup.addToHistory(article);
      
      expect(dedup.isInHistory('https://example.com/1')).toBe(true);
    });

    test('should check URL in history', () => {
      dedup.addToHistory({ url: 'https://example.com/article' });
      
      expect(dedup.isUrlDuplicated('https://example.com/article')).toBe(true);
      expect(dedup.isUrlDuplicated('https://example.com/new')).toBe(false);
    });

    test('should respect window hours', async () => {
      const dedup2 = new Deduplicator({ windowHours: 0 });
      
      dedup2.addToHistory({ 
        id: '1', 
        title: '测试', 
        url: 'https://example.com/1',
        timestamp: Date.now() - 1000
      });
      
      // Should be considered expired
      const isDup = dedup2.isUrlDuplicated('https://example.com/1');
      expect(isDup).toBe(false);
    });
  });

  describe('batch processing', () => {
    test('should process large batch efficiently', () => {
      const articles = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        title: `文章 ${i}`,
        url: `https://example.com/${i}`,
        content: `内容 ${i}`
      }));
      
      const result = dedup.deduplicate(articles);
      expect(result.kept.length).toBe(100);
    });

    test('should handle empty array', () => {
      const result = dedup.deduplicate([]);
      expect(result.kept).toEqual([]);
      expect(result.duplicates).toEqual([]);
    });
  });
});
