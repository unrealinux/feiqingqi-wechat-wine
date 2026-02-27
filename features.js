/**
 * 高级功能增强模块
 * - 布隆过滤器去重
 * - TF-IDF 文本分类
 * - 质量评分系统
 */

/**
 * 布隆过滤器实现 - 高效去重
 */
class BloomFilter {
  constructor(options = {}) {
    this.size = options.size || 100000;  // 位数组大小
    this.hashCount = options.hashCount || 7;  // 哈希函数数量
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8));
    this.itemsCount = 0;
  }

  /**
   * MurmurHash3 实现
   */
  _hash(str, seed = 0) {
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;
    const r1 = 15;
    const r2 = 13;
    const m = 5;
    const n = 0xe6546b64;

    let h = seed;
    const len = str.length;
    const nblocks = Math.floor(len / 4);

    for (let i = 0; i < nblocks; i++) {
      const k = str.charCodeAt(i * 4) |
        (str.charCodeAt(i * 4 + 1) << 8) |
        (str.charCodeAt(i * 4 + 2) << 16) |
        (str.charCodeAt(i * 4 + 3) << 24);

      k = Math.imul(k, c1);
      k = (k << r1) | (k >>> (32 - r1));
      k = Math.imul(k, c2);

      h ^= k;
      h = (h << r2) | (h >>> (32 - r2));
      h = Math.imul(h, m) + n;
    }

    const tail = str.charCodeAt(nblocks * 4) |
      (str.charCodeAt(nblocks * 4 + 1) << 8) |
      (str.charCodeAt(nblocks * 4 + 2) << 16) |
      (str.charCodeAt(nblocks * 4 + 3) << 24);

    if (tail) {
      h ^= tail;
      h = Math.imul(h, c1);
      h = (h << r1) | (h >>> (32 - r1));
      h = Math.imul(h, c2);
    }

    h ^= len;
    h ^= (h >>> 16);
    h = Math.imul(h, 0x85ebca6b);
    h ^= (h >>> 13);
    h = Math.imul(h, 0xc2b2ae35);
    h ^= (h >>> 16);

    return Math.abs(h);
  }

  /**
   * 计算多个哈希值
   */
  _getHashes(str) {
    const hashes = [];
    for (let i = 0; i < this.hashCount; i++) {
      hashes.push(this._hash(str, i));
    }
    return hashes;
  }

  /**
   * 添加元素
   */
  add(str) {
    const hashes = this._getHashes(str);
    for (const hash of hashes) {
      const index = hash % this.size;
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      this.bitArray[byteIndex] |= (1 << bitIndex);
    }
    this.itemsCount++;
  }

  /**
   * 检查元素是否存在
   */
  has(str) {
    const hashes = this._getHashes(str);
    for (const hash of hashes) {
      const index = hash % this.size;
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      if ((this.bitArray[byteIndex] & (1 << bitIndex)) === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 可能存在返回true
   */
  mightContain(str) {
    return this.has(str);
  }

  /**
   * 获取状态
   */
  getStatus() {
    let setBits = 0;
    for (const byte of this.bitArray) {
      setBits += this._countBits(byte);
    }
    return {
      itemsCount: this.itemsCount,
      size: this.size,
      setBits,
      fillRate: (setBits / this.size * 100).toFixed(2) + '%',
      estimatedFalsePositiveRate: this._estimateFPR().toFixed(4) + '%',
    };
  }

  _countBits(byte) {
    let count = 0;
    while (byte) {
      count += byte & 1;
      byte >>= 1;
    }
    return count;
  }

  _estimateFPR() {
    const k = this.hashCount;
    const m = this.size;
    const n = this.itemsCount;
    return Math.pow(1 - Math.exp(-k * n / m), k);
  }

  /**
   * 序列化
   */
  toJSON() {
    return {
      bitArray: Array.from(this.bitArray),
      size: this.size,
      hashCount: this.hashCount,
      itemsCount: this.itemsCount,
    };
  }

  /**
   * 反序列化
   */
  static fromJSON(data) {
    const filter = new BloomFilter({ size: data.size, hashCount: data.hashCount });
    filter.bitArray = new Uint8Array(data.bitArray);
    filter.itemsCount = data.itemsCount;
    return filter;
  }
}

/**
 * TF-IDF 文本分类器
 */
class TFIDFClassifier {
  constructor() {
    this.corpus = [];
    this.documents = new Map();
    this.vocabulary = new Map();
    this.idf = new Map();
    this.stopWords = new Set([
      '的', '是', '在', '和', '与', '或', '等', '了', '一个', '一些',
      '这个', '那个', '我们', '你们', '他们', '自己', '什么', '这', '那',
      '有', '没有', '就', '也', '都', '而', '及', '与', '着', '或',
      '一个', '一些', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    ]);
  }

  /**
   * 分词
   */
  tokenize(text) {
    // 简单中文分词（按字符）
    const tokens = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // 跳过空白字符和标点
      if (/[\s\u4e00-\u9fa5]/.test(char)) {
        tokens.push(char);
      }
    }
    return tokens;
  }

  /**
   * 预处理
   */
  preprocess(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 计算词频
   */
  getTermFrequency(tokens) {
    const tf = new Map();
    for (const token of tokens) {
      if (!this.stopWords.has(token) && token.length > 1) {
        tf.set(token, (tf.get(token) || 0) + 1);
      }
    }
    // 归一化
    const maxFreq = Math.max(...tf.values(), 1);
    for (const [term, freq] of tf) {
      tf.set(term, freq / maxFreq);
    }
    return tf;
  }

  /**
   * 添加文档
   */
  addDocument(docId, text, category = null) {
    const processed = this.preprocess(text);
    const tokens = this.tokenize(processed);
    const tf = this.getTermFrequency(tokens);

    this.documents.set(docId, { tf, category, tokens, text: processed });
    this.corpus.push(docId);

    // 更新词汇表
    for (const term of tf.keys()) {
      if (!this.vocabulary.has(term)) {
        this.vocabulary.set(term, new Set());
      }
      this.vocabulary.get(term).add(docId);
    }

    this._calculateIDF();
    return this;
  }

  /**
   * 计算 IDF
   */
  _calculateIDF() {
    const N = this.corpus.length;
    for (const [term, docs] of this.vocabulary) {
      const df = docs.size;
      this.idf.set(term, Math.log(N / (df + 1)) + 1);
    }
  }

  /**
   * 计算 TF-IDF 向量
   */
  getTFIDF(tokens) {
    const tf = this.getTermFrequency(tokens);
    const tfidf = new Map();

    for (const [term, tfValue] of tf) {
      const idfValue = this.idf.get(term) || 1;
      tfidf.set(term, tfValue * idfValue);
    }

    return tfidf;
  }

  /**
   * 分类文档
   */
  classify(text) {
    const processed = this.preprocess(text);
    const tokens = this.tokenize(processed);
    const tfidf = this.getTFIDF(tokens);

    // 按类别分组文档
    const categories = new Map();
    for (const [docId, doc] of this.documents) {
      if (doc.category) {
        if (!categories.has(doc.category)) {
          categories.set(doc.category, []);
        }
        categories.get(doc.category).push(doc);
      }
    }

    // 计算与每个类别的相似度
    const scores = new Map();
    for (const [category, docs] of categories) {
      let similarity = 0;
      for (const doc of docs) {
        const docTfidf = this.getTFIDF(doc.tokens);
        similarity += this._cosineSimilarity(tfidf, docTfidf);
      }
      scores.set(category, similarity / docs.length);
    }

    // 返回排序后的分类结果
    const results = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, score]) => ({ category, score }));

    return {
      category: results[0]?.category || '其他',
      scores: results,
    };
  }

  /**
   * 余弦相似度
   */
  _cosineSimilarity(vec1, vec2) {
    const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const term of allTerms) {
      const v1 = vec1.get(term) || 0;
      const v2 = vec2.get(term) || 0;
      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * 提取关键词
   */
  extractKeywords(text, topK = 10) {
    const processed = this.preprocess(text);
    const tokens = this.tokenize(processed);
    const tfidf = this.getTFIDF(tokens);

    return [...tfidf.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([term, score]) => ({ term, score }));
  }

  /**
   * 获取状态
   */
  getStatus() {
    const categories = new Set();
    for (const doc of this.documents.values()) {
      if (doc.category) categories.add(doc.category);
    }
    return {
      documentCount: this.documents.size,
      vocabularySize: this.vocabulary.size,
      categories: [...categories],
    };
  }
}

/**
 * 质量评分系统
 */
class QualityScorer {
  constructor() {
    this.weights = {
      length: 0.15,        // 内容长度
      relevance: 0.25,     // 相关性
      freshness: 0.15,     // 新鲜度
      authority: 0.20,     // 权威性
      completeness: 0.15,  // 完整性
      originality: 0.10,   // 原创性
    };
    
    this.wineKeywords = [
      '红酒', '葡萄酒', 'wine', '品酒', '酒庄', '产区',
      '葡萄', '干红', '干白', '起泡酒', '香槟',
      '酒标', '酒具', '酒窖', '年份', '单宁',
      '橡木桶', '发酵', '酿造', '酒体', '口感',
      '香气', '余味', '适饮期', '醒酒', '侍酒',
    ];
  }

  /**
   * 设置权重
   */
  setWeights(weights) {
    this.weights = { ...this.weights, ...weights };
  }

  /**
   * 评估文章质量
   */
  evaluate(article) {
    const scores = {
      length: this._scoreLength(article.content),
      relevance: this._scoreRelevance(article.title, article.content),
      freshness: this._scoreFreshness(article.pubDate),
      authority: this._scoreAuthority(article.source, article.author),
      completeness: this._scoreCompleteness(article),
      originality: this._scoreOriginality(article),
    };

    // 计算加权总分
    let totalScore = 0;
    for (const [factor, score] of Object.entries(scores)) {
      totalScore += score * (this.weights[factor] || 0);
    }

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      factors: Object.fromEntries(
        Object.entries(scores).map(([k, v]) => [k, Math.round(v * 100) / 100])
      ),
      grade: this._getGrade(totalScore),
      suggestions: this._getSuggestions(scores),
    };
  }

  /**
   * 长度评分 (0-1)
   */
  _scoreLength(content) {
    if (!content) return 0;
    const length = content.length;
    if (length < 100) return 0.2;
    if (length < 500) return 0.4;
    if (length < 1000) return 0.6;
    if (length < 3000) return 0.8;
    if (length < 8000) return 1.0;
    return 0.9; // 太长反而降低
  }

  /**
   * 相关性评分 (0-1)
   */
  _scoreRelevance(title, content) {
    const text = (title || '') + ' ' + (content || '');
    const textLower = text.toLowerCase();
    
    let matchCount = 0;
    for (const keyword of this.wineKeywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    return Math.min(matchCount / 5, 1);
  }

  /**
   * 新鲜度评分 (0-1)
   */
  _scoreFreshness(pubDate) {
    const now = new Date();
    const pub = pubDate instanceof Date ? pubDate : new Date(pubDate);
    const daysDiff = (now - pub) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 1) return 1.0;
    if (daysDiff <= 3) return 0.9;
    if (daysDiff <= 7) return 0.8;
    if (daysDiff <= 14) return 0.6;
    if (daysDiff <= 30) return 0.4;
    if (daysDiff <= 90) return 0.2;
    return 0.1;
  }

  /**
   * 权威性评分 (0-1)
   */
  _scoreAuthority(source, author) {
    let score = 0.5;

    // 来源权威性
    const authoritativeSources = [
      'wine-world', 'wine-world.com', '红酒世界',
      'wine spectator', 'wine advocate', 'decanter',
      '酒咔嚓', '品酒汇', '酒虫网',
    ];
    
    if (source) {
      for (const auth of authoritativeSources) {
        if (source.toLowerCase().includes(auth.toLowerCase())) {
          score += 0.2;
          break;
        }
      }
    }

    // 作者权威性
    if (author && author !== '未知' && author !== 'anonymous') {
      score += 0.2;
    }

    // mock数据降权
    if (source === 'mock') {
      score *= 0.5;
    }

    return Math.min(score, 1);
  }

  /**
   * 完整性评分 (0-1)
   */
  _scoreCompleteness(article) {
    let score = 0.5;

    if (article.title && article.title.length > 10) score += 0.1;
    if (article.content && article.content.length > 100) score += 0.1;
    if (article.pubDate) score += 0.1;
    if (article.source) score += 0.1;
    if (article.author && article.author !== '未知') score += 0.1;

    return score;
  }

  /**
   * 原创性评分 (0-1)
   */
  _scoreOriginality(article) {
    // 简单判断：如果内容中有大量重复字符，降低原创性
    const content = article.content || '';
    const uniqueRatio = new Set(content).size / content.length;
    
    if (uniqueRatio < 0.1) return 0.2;
    if (uniqueRatio < 0.3) return 0.5;
    if (uniqueRatio < 0.5) return 0.8;
    
    return 1.0;
  }

  /**
   * 评分等级
   */
  _getGrade(score) {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B+';
    if (score >= 0.6) return 'B';
    if (score >= 0.5) return 'C';
    return 'D';
  }

  /**
   * 获取改进建议
   */
  _getSuggestions(scores) {
    const suggestions = [];

    if (scores.length < 0.5) {
      suggestions.push('内容长度不足，建议增加更多详细内容');
    }
    if (scores.relevance < 0.5) {
      suggestions.push('内容与红酒主题相关性不够，建议选择更相关的文章');
    }
    if (scores.freshness < 0.5) {
      suggestions.push('文章时效性较差，建议优先选择更新的内容');
    }
    if (scores.authority < 0.5) {
      suggestions.push('来源权威性不足，建议选择更专业的红酒网站');
    }
    if (scores.completeness < 0.7) {
      suggestions.push('文章信息不完整，建议补充更多元数据');
    }

    return suggestions;
  }
}

module.exports = {
  BloomFilter,
  TFIDFClassifier,
  QualityScorer,
};
