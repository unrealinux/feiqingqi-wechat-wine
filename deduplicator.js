/**
 * 智能去重模块
 * 支持多种去重策略：精确匹配、相似度检测、语义去重
 */

const crypto = require('crypto');
const { JaccardSimilarity, LevenshteinDistance } = require('./algorithms');

/**
 * 文章去重器
 */
class ArticleDeduplicator {
  constructor(options = {}) {
    this.strategy = options.strategy || 'exact'; // exact, fuzzy, semantic
    this.threshold = options.threshold || 0.8; // 相似度阈值
    this.seenLinks = new Set();
    this.seenTitles = new Set();
    this.seenHashes = new Set();
    this.articles = [];
  }

  /**
   * 生成内容哈希
   */
  generateHash(content) {
    const normalized = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return crypto.createHash('md5').update(normalized).digest('hex');
  }

  /**
   * 提取标题特征
   */
  extractTitleFeatures(title) {
    if (!title) return new Set();
    return new Set(
      title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2)
    );
  }

  /**
   * 检查是否为重复链接
   */
  isDuplicateLink(link) {
    if (!link) return true;
    const normalized = this.normalizeUrl(link);
    if (this.seenLinks.has(normalized)) {
      return true;
    }
    this.seenLinks.add(normalized);
    return false;
  }

  /**
   * 规范化URL
   */
  normalizeUrl(url) {
    try {
      const u = new URL(url);
      u.hash = '';
      u.search = [...u.searchParams.entries()]
        .filter(([k]) => !k.startsWith('utm_'))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      return u.toString();
    } catch {
      return url;
    }
  }

  /**
   * 检查标题是否重复
   */
  isDuplicateTitle(title, threshold = 0.7) {
    if (!title) return true;
    
    const normalized = title.toLowerCase().trim();
    const features = this.extractTitleFeatures(title);
    
    // 精确匹配
    if (this.seenTitles.has(normalized)) {
      return true;
    }

    // 相似度匹配
    for (const seen of this.seenTitles) {
      // 标题完全包含
      if (normalized.includes(seen) || seen.includes(normalized)) {
        return true;
      }

      // Jaccard相似度
      const seenFeatures = this.extractTitleFeatures(seen);
      const similarity = JaccardSimilarity(features, seenFeatures);
      
      if (similarity >= threshold) {
        return true;
      }
    }

    this.seenTitles.add(normalized);
    return false;
  }

  /**
   * 检查内容哈希是否重复
   */
  isDuplicateHash(content) {
    if (!content) return true;
    const hash = this.generateHash(content);
    if (this.seenHashes.has(hash)) {
      return true;
    }
    this.seenHashes.add(hash);
    return false;
  }

  /**
   * 添加文章并进行去重检查
   */
  add(article) {
    // 检查必填字段
    if (!article || !article.title) {
      return { kept: false, reason: 'invalid_article' };
    }

    // 策略1: 链接去重
    if (article.link && this.isDuplicateLink(article.link)) {
      return { kept: false, reason: 'duplicate_link' };
    }

    // 策略2: 标题去重
    if (this.isDuplicateTitle(article.title, this.threshold)) {
      return { kept: false, reason: 'duplicate_title' };
    }

    // 策略3: 内容哈希去重
    if (article.content && this.isDuplicateHash(article.content)) {
      return { kept: false, reason: 'duplicate_content' };
    }

    // 添加到列表
    this.articles.push(article);
    return { kept: true, reason: 'unique' };
  }

  /**
   * 批量处理文章
   */
  process(articles) {
    const results = {
      total: articles.length,
      kept: 0,
      removed: 0,
      reasons: {
        invalid_article: 0,
        duplicate_link: 0,
        duplicate_title: 0,
        duplicate_content: 0,
        unique: 0
      }
    };

    for (const article of articles) {
      const result = this.add(article);
      results.reasons[result.reason]++;
      if (result.kept) {
        results.kept++;
      } else {
        results.removed++;
      }
    }

    return {
      articles: this.articles,
      stats: results
    };
  }

  /**
   * 重置去重器
   */
  reset() {
    this.seenLinks.clear();
    this.seenTitles.clear();
    this.seenHashes.clear();
    this.articles = [];
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      processed: this.articles.length,
      uniqueLinks: this.seenLinks.size,
      uniqueTitles: this.seenTitles.size,
      uniqueHashes: this.seenHashes.size
    };
  }
}

/**
 * 简易Jaccard相似度计算
 */
function JaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Levenshtein距离计算
 */
function LevenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;
  
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  
  return dp[m][n];
}

module.exports = {
  ArticleDeduplicator,
  JaccardSimilarity,
  LevenshteinDistance
};
