const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { Redis: Ioredis } = require('ioredis');

/**
 * LRU缓存实现 - 内存缓存的淘汰策略
 */
class LRUCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.cache = new Map();
    this.ttl = options.ttl || 3600000; // 默认1小时
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttl = this.ttl) {
    // 如果key已存在，删除旧条目
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // 如果缓存已满，删除最老的条目（LRU）
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return null;
    }

    // 检查是否过期
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // 移动到末尾（更新为最近使用）
    this.cache.delete(key);
    this.cache.set(key, item);
    this.hits++;
    
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%',
    };
  }
}

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }

    this.logFile = path.join(this.logsDir, `${new Date().toISOString().split('T')[0]}.log`);
    this.queue = [];
    this.isWriting = false;
  }

  async _writeToFile(logString) {
    // 使用异步API写入
    try {
      await fsPromises.appendFile(this.logFile, logString);
    } catch (error) {
      console.error('写入日志失败:', error.message);
    }
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    const logString = JSON.stringify(logEntry) + '\n';
    
    console.log(`[${level.toUpperCase()}] ${message}`);
    
    // 异步写入文件，不阻塞主线程
    this._writeToFile(logString);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }
}

class Redis {
  constructor() {
    this.client = null;
    this.config = require('./config').redis;
    this.isConnected = false;
    this.usingMemoryFallback = true;
    // 使用LRU缓存替代简单的Map
    this.memoryCache = new LRUCache({ maxSize: 500, ttl: 3600000 });

    this.init();
  }

  init() {
    try {
      this.client = new Ioredis({
        host: this.config.host,
        port: this.config.port,
        keyPrefix: this.config.keyPrefix,
        retryStrategy: (times) => {
          if (times > 3) {
            this.isConnected = false;
            this.usingMemoryFallback = true;
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        connectTimeout: 5000,
        lazyConnect: true,
      });

      this.client.connect().catch(() => {
        this.isConnected = false;
        this.usingMemoryFallback = true;
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.usingMemoryFallback = false;
      });

      this.client.on('error', () => {
        this.isConnected = false;
        this.usingMemoryFallback = true;
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.usingMemoryFallback = true;
      });
    } catch (error) {
      this.isConnected = false;
      this.usingMemoryFallback = true;
    }
  }

  async get(key) {
    if (!this.isConnected && this.usingMemoryFallback) {
      return this.memoryCache.get(key);
    }
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.usingMemoryFallback = true;
      return this.memoryCache.get(key);
    }
  }

  async set(key, value, ttl = null) {
    const serialized = JSON.stringify(value);
    if (!this.isConnected && this.usingMemoryFallback) {
      this.memoryCache.set(key, serialized, ttl ? ttl * 1000 : null);
      return true;
    }
    try {
      if (ttl) await this.client.setex(key, ttl, serialized);
      else await this.client.set(key, serialized);
      return true;
    } catch (error) {
      this.usingMemoryFallback = true;
      this.memoryCache.set(key, serialized, ttl ? ttl * 1000 : null);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      return await this.client.exists(key);
    } catch (error) {
      return false;
    }
  }

  async keys(pattern) {
    if (!this.isConnected) return [];
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      return [];
    }
  }

  async hset(key, field, value) {
    if (!this.isConnected) return false;
    try {
      await this.client.hset(key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  async hget(key, field) {
    if (!this.isConnected) return null;
    try {
      const value = await this.client.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  async hgetall(key) {
    if (!this.isConnected && this.usingMemoryFallback) {
      const val = this.memoryCache.get(key);
      return val ? JSON.parse(val) : {};
    }
    try {
      const result = await this.client.hgetall(key);
      const parsed = {};
      for (const [field, value] of Object.entries(result)) {
        try {
          parsed[field] = JSON.parse(value);
        } catch {
          parsed[field] = value;
        }
      }
      return parsed;
    } catch (error) {
      return {};
    }
  }

  async lpush(key, value) {
    if (!this.isConnected) return false;
    try {
      await this.client.lpush(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  async lrange(key, start, stop) {
    if (!this.isConnected) return [];
    try {
      const results = await this.client.lrange(key, start, stop);
      return results.map(item => JSON.parse(item));
    } catch (error) {
      return [];
    }
  }

  async close() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
      } catch (error) {}
    }
    this.isConnected = false;
    this.usingMemoryFallback = true;
  }
}

class Database {
  constructor() {
    this.pool = null;
    this.config = require('./config').database;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      const mysql = require('mysql2/promise');
      this.pool = mysql.createPool({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      const connection = await this.pool.getConnection();
      connection.release();
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
    }
  }

  async query(sql, params = []) {
    if (!this.isConnected) return [];
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      return [];
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
    }
  }
}

class TextProcessor {
  static truncate(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  }

  static extractFirstSentence(text) {
    if (!text) return '';
    const match = text.match(/[^。！？.!?]+[。！？.!?]/);
    return match ? match[0] : text.slice(0, 100);
  }

  static removeHtmlTags(html) {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  static convertToPlainText(html) {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  static extractKeywords(text, maxKeywords = 10) {
    if (!text) return [];
    const stopWords = new Set([
      '的', '是', '在', '和', '与', '或', '等', '了', '一个', '一些',
      '这个', '那个', '我们', '你们', '他们', '自己', '什么',
    ]);
    const words = text.split(/\s+/);
    const wordCount = {};
    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 1 && !stopWords.has(cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    }
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  static generateExcerpt(text, length = 150) {
    const plainText = this.removeHtmlTags(text);
    return this.truncate(plainText, length);
  }

  static countWords(text) {
    if (!text) return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  static countChineseCharacters(text) {
    if (!text) return 0;
    return (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  }
}

class FileManager {
  static ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static async readJson(filePath) {
    try {
      const content = await fsPromises.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  static async writeJson(filePath, data) {
    try {
      await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }

  static async readMarkdown(filePath) {
    try {
      return await fsPromises.readFile(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  static async appendToFile(filePath, content) {
    try {
      await fsPromises.appendFile(filePath, content, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }

  static backupFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const backupPath = `${filePath}.${Date.now()}.bak`;
    try {
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    } catch (error) {
      return false;
    }
  }
}

module.exports = {
  Logger,
  Redis,
  Database,
  TextProcessor,
  FileManager,
  LRUCache,
};
