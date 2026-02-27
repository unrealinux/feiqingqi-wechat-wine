/**
 * 文章质量评分系统
 * 多维度评估文章质量，用于排序和筛选
 */

class ArticleQualityScorer {
  constructor(options = {}) {
    this.weights = {
      relevance: options.relevanceWeight || 0.35,    // 相关性
      freshness: options.freshnessWeight || 0.25,    // 时效性
      completeness: options.completenessWeight || 0.20, // 完整性
      authority: options.authorityWeight || 0.15,    // 权威性
      engagement: options.engagementWeight || 0.05   // 互动性
    };
    
    // 红酒相关关键词
    this.wineKeywords = [
      '红酒', '葡萄酒', 'wine', '品酒', '酒庄', '产区',
      '葡萄', '干红', '干白', '起泡酒', '香槟', '酿酒',
      '赤霞珠', '梅洛', '霞多丽', '黑皮诺', '波尔多', '勃艮第'
    ];
  }

  /**
   * 计算相关性得分
   */
  scoreRelevance(article) {
    let score = 0;
    const text = `${article.title} ${article.content} ${article.tags?.join(' ')}`.toLowerCase();
    
    // 标题匹配
    const titleLower = (article.title || '').toLowerCase();
    for (const keyword of this.wineKeywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        score += 15;
      }
    }
    
    // 内容匹配
    for (const keyword of this.wineKeywords) {
      const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
      score += Math.min(matches * 2, 20);
    }
    
    // 标签匹配
    if (article.tags && article.tags.length > 0) {
      score += Math.min(article.tags.length * 3, 15);
    }
    
    // 来源相关性
    const wineSources = ['wine-world', 'winesinfo', 'decanter', 'vinepair'];
    if (article.source && wineSources.some(s => article.source.toLowerCase().includes(s))) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  /**
   * 计算时效性得分
   */
  scoreFreshness(article) {
    const pubDate = article.pubDate ? new Date(article.pubDate) : null;
    if (!pubDate || isNaN(pubDate.getTime())) {
      return 50; // 默认中等分数
    }
    
    const now = Date.now();
    const age = now - pubDate.getTime();
    const dayAge = age / (1000 * 60 * 60 * 24);
    
    // 24小时内: 100分
    // 1-3天: 90分
    // 3-7天: 70分
    // 7-14天: 50分
    // 14-30天: 30分
    // 30天以上: 10分
    
    if (dayAge <= 1) return 100;
    if (dayAge <= 3) return 90;
    if (dayAge <= 7) return 70;
    if (dayAge <= 14) return 50;
    if (dayAge <= 30) return 30;
    return 10;
  }

  /**
   * 计算完整性得分
   */
  scoreCompleteness(article) {
    let score = 0;
    
    // 标题长度 (5-50字: 20分)
    const titleLen = (article.title || '').length;
    if (titleLen >= 5 && titleLen <= 50) score += 20;
    else if (titleLen > 0) score += 10;
    
    // 内容长度 (500-5000字: 30分)
    const contentLen = (article.content || '').length;
    if (contentLen >= 500 && contentLen <= 5000) score += 30;
    else if (contentLen >= 100) score += 20;
    else if (contentLen > 0) score += 10;
    
    // 有摘要/描述 (15分)
    if (article.abstract || article.description) score += 15;
    
    // 有作者 (10分)
    if (article.author && article.author !== '未知') score += 10;
    
    // 有标签 (10分)
    if (article.tags && article.tags.length > 0) score += 10;
    
    // 有图片 (15分)
    if (article.thumbnail || article.image || article.images?.length > 0) score += 15;
    
    return Math.min(score, 100);
  }

  /**
   * 计算权威性得分
   */
  scoreAuthority(article) {
    let score = 40; // 基础分
    
    // 来源权威性
    const authoritativeSources = {
      'wine-world': 55,
      'decanter': 55,
      'wine-searcher': 50,
      'winesinfo': 45,
      '官方': 60,
      '中国': 45,
      '法国': 50
    };
    
    const source = (article.source || '').toLowerCase();
    for (const [key, value] of Object.entries(authoritativeSources)) {
      if (source.includes(key)) {
        score = Math.max(score, value);
        break;
      }
    }
    
    // 作者权威性
    const author = (article.author || '').toLowerCase();
    if (author.includes('博士') || author.includes('专家') || author.includes('-master')) {
      score += 15;
    }
    
    // 是否有原文链接
    if (article.link && !article.link.includes('example.com')) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  /**
   * 计算互动性得分 (基于已有数据)
   */
  scoreEngagement(article) {
    let score = 50; // 基础分
    
    // 如果有分享数、评论数等
    if (article.shares) score += Math.min(article.shares * 2, 20);
    if (article.comments) score += Math.min(article.comments * 3, 20);
    if (article.views) score += Math.min(Math.log10(article.views) * 5, 10);
    
    return Math.min(score, 100);
  }

  /**
   * 计算综合得分
   */
  score(article) {
    const relevance = this.scoreRelevance(article);
    const freshness = this.scoreFreshness(article);
    const completeness = this.scoreCompleteness(article);
    const authority = this.scoreAuthority(article);
    const engagement = this.scoreEngagement(article);
    
    const total = (
      relevance * this.weights.relevance +
      freshness * this.weights.freshness +
      completeness * this.weights.completeness +
      authority * this.weights.authority +
      engagement * this.weights.engagement
    );
    
    return {
      total: Math.round(total),
      breakdown: {
        relevance: Math.round(relevance),
        freshness: Math.round(freshness),
        completeness: Math.round(completeness),
        authority: Math.round(authority),
        engagement: Math.round(engagement)
      },
      weight: this.weights
    };
  }

  /**
   * 批量评分
   */
  scoreBatch(articles) {
    return articles
      .map(article => ({
        article,
        score: this.score(article)
      }))
      .sort((a, b) => b.score.total - a.score.total);
  }

  /**
   * 筛选高质量文章
   */
  filterHighQuality(articles, minScore = 60) {
    return this.scoreBatch(articles)
      .filter(item => item.score.total >= minScore)
      .map(item => item.article);
  }
}

module.exports = { ArticleQualityScorer };
