const { ArticleQualityScorer } = require('../quality-scorer');

describe('QualityScorer', () => {
  let scorer;

  let scorer;

  beforeEach(() => {
    scorer = new ArticleQualityScorer();
  });
    scorer = new QualityScorer();
  });

  describe('relevance scoring', () => {
    test('should score high for wine-related keywords', () => {
      const article = {
        title: '法国红酒品鉴与产区介绍',
        content: '本文介绍法国波尔多产区的红酒，包含详细的品酒笔记。'
      };
      
      const score = scorer.scoreRelevance(article);
      expect(score).toBeGreaterThan(0.7);
    });

    test('should score low for irrelevant content', () => {
      const article = {
        title: '今日天气',
        content: '今天天气晴朗，适合外出。'
      };
      
      const score = scorer.scoreRelevance(article);
      expect(score).toBeLessThan(0.3);
    });

    test('should return 0 for empty content', () => {
      const article = { title: '', content: '' };
      expect(scorer.scoreRelevance(article)).toBe(0);
    });
  });

  describe('freshness scoring', () => {
    test('should score high for recent articles', () => {
      const article = {
        publishedAt: new Date().toISOString()
      };
      
      const score = scorer.scoreFreshness(article);
      expect(score).toBeGreaterThan(0.9);
    });

    test('should score low for old articles', () => {
      const article = {
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const score = scorer.scoreFreshness(article);
      expect(score).toBeLessThan(0.3);
    });

    test('should handle missing publishedAt', () => {
      const article = {};
      const score = scorer.scoreFreshness(article);
      expect(score).toBe(0.5); // default score
    });
  });

  describe('completeness scoring', () => {
    test('should score high for complete articles', () => {
      const article = {
        title: '完整的文章标题',
        content: '这是一篇内容丰富的文章，包含多个段落和详细的论述。文章讨论了红酒的各个方面，从酿造工艺到品鉴技巧，从产区特色到配餐建议。',
        author: '张三',
        publishedAt: '2026-01-01',
        source: '葡萄酒杂志'
      };
      
      const score = scorer.scoreCompleteness(article);
      expect(score).toBeGreaterThan(0.7);
    });

    test('should score low for incomplete articles', () => {
      const article = {
        title: '短标题',
        content: '短内容'
      };
      
      const score = scorer.scoreCompleteness(article);
      expect(score).toBeLessThan(0.5);
    });

    test('should require minimum content length', () => {
      const article = {
        title: '标题',
        content: '内容太短'
      };
      
      const score = scorer.scoreCompleteness(article);
      expect(score).toBeLessThan(0.3);
    });
  });

  describe('authority scoring', () => {
    test('should score high for authoritative sources', () => {
      const article = {
        source: 'Decanter',
        author: '知名酒评家',
        url: 'https://www.decanter.com/article'
      };
      
      const score = scorer.scoreAuthority(article);
      expect(score).toBeGreaterThan(0.7);
    });

    test('should score low for unknown sources', () => {
      const article = {
        source: '未知网站',
        author: '网友'
      };
      
      const score = scorer.scoreAuthority(article);
      expect(score).toBeLessThan(0.5);
    });
  });

  describe('engagement scoring', () => {
    test('should consider engagement metrics', () => {
      const article = {
        likes: 100,
        comments: 50,
        shares: 30
      };
      
      const score = scorer.scoreEngagement(article);
      expect(score).toBeGreaterThan(0.6);
    });

    test('should return default for no metrics', () => {
      const article = {};
      const score = scorer.scoreEngagement(article);
      expect(score).toBe(0.5);
    });
  });

  describe('overall scoring', () => {
    test('should calculate weighted overall score', () => {
      const article = {
        title: '法国红酒品鉴指南',
        content: '这是一篇详细的法国红酒品鉴指南，介绍了波尔多、勃艮第等知名产区的红酒特点。文章包含了丰富的品酒笔记和专业的酒评分析。',
        author: '李四',
        publishedAt: new Date().toISOString(),
        source: 'Wine Spectator',
        likes: 200,
        comments: 50
      };
      
      const result = scorer.scoreArticle(article);
      
      expect(result.totalScore).toBeDefined();
      expect(result.totalScore).toBeGreaterThan(0.6);
      expect(result.scores.relevance).toBeDefined();
      expect(result.scores.freshness).toBeDefined();
      expect(result.scores.completeness).toBeDefined();
      expect(result.scores.authority).toBeDefined();
      expect(result.scores.engagement).toBeDefined();
    });

    test('should include breakdown in result', () => {
      const article = {
        title: '测试文章',
        content: '这是测试内容。'.repeat(10)
      };
      
      const result = scorer.scoreArticle(article);
      
      expect(result.breakdown).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });

    test('should provide recommendation based on score', () => {
      const goodArticle = {
        title: '优质红酒文章',
        content: '这是详细的红酒评测内容，包含品酒笔记、产区介绍、配餐建议等专业内容。'.repeat(10),
        author: '专业酒评家',
        publishedAt: new Date().toISOString(),
        source: 'Decanter'
      };
      
      const result = scorer.scoreArticle(goodArticle);
      expect(['highly_recommended', 'recommended', 'acceptable']).toContain(result.recommendation);
    });
  });

  describe('sorting and filtering', () => {
    test('should sort articles by score', () => {
      const articles = [
        { id: '1', title: '低质量', content: '短' },
        { id: '2', title: '法国红酒介绍', content: '这是详细的红酒评测内容。'.repeat(10) },
        { id: '3', title: '中等质量', content: '这是一篇中等的红酒文章。'.repeat(5) }
      ];
      
      const sorted = scorer.sortByQuality(articles);
      
      expect(sorted[0].id).toBe('2'); // highest score
      expect(sorted[2].id).toBe('1'); // lowest score
    });

    test('should filter by minimum score', () => {
      const articles = [
        { id: '1', title: '低质量', content: '短' },
        { id: '2', title: '法国红酒介绍', content: '这是详细的红酒评测内容。'.repeat(10) }
      ];
      
      const filtered = scorer.filterByQuality(articles, 0.5);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('2');
    });
  });
});
