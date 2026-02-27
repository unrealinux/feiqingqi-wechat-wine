/**
 * 缓存管理器
 * 支持 TTL、大小限制、LRU 淘汰策略
 */

class CacheEntry {
  constructor(value, ttl) {
    this.value = value;
    this.createdAt = Date.now();
    this.ttl = ttl || 0;
    this.hits = 0;
    this.lastAccessed = this.createdAt;
  }

  isExpired() {
    if (this.ttl <= 0) return false;
    return Date.now() - this.createdAt > this.ttl;
  }

  touch() {
    this.hits++;
    this.lastAccessed = Date.now();
  }
}

class CacheManager {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000;        // 最大条目数
    this.maxMemory = options.maxMemory || 50 * 1024 * 1024;  // 最大内存(50MB)
    this.defaultTtl = options.defaultTtl || 3600000; // 默认1小时
    this.enableStats = options.enableStats !== false;
    
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0
    };
  }

  /**
   * 设置缓存
   */
  set(key, value, options = {}) {
    const ttl = options.ttl !== undefined ? options.ttl : this.defaultTtl;
    
    // 检查大小限制
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry = new CacheEntry(value, ttl);
    this.cache.set(key, entry);
    this.stats.sets++;

    if (this.enableStats) {
      this.updateMemoryUsage();
    }

    return this;
  }

  /**
   * 获取缓存
   */
  get(key, options = {}) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      if (options.onMiss) options.onMiss(key);
      return options.defaultValue !== undefined ? options.defaultValue : null;
    }

    if (entry.isExpired()) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.expirations++;
      return options.defaultValue !== undefined ? options.defaultValue : null;
    }

    entry.touch();
    this.stats.hits++;
    return entry.value;
  }

  /**
   * 检查缓存是否存在（未过期）
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.isExpired()) {
      this.cache.delete(key);
      this.stats.expirations++;
      return false;
    }
    return true;
  }

  /**
   * 删除缓存
   */
  delete(key) {
    const result = this.cache.delete(key);
    if (result) {
      this.updateMemoryUsage();
    }
    return result;
  }

  /**
   * 清空缓存
   */
  clear() {
    const count = this.cache.size;
    this.cache.clear();
    this.updateMemoryUsage();
    return count;
  }

  /**
   * LRU 淘汰
   */
  evictLRU() {
    let lruKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * 清理过期条目
   */
  cleanup() {
    let cleaned = 0;
    
    for (const [key, entry] of this.cache) {
      if (entry.isExpired()) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    this.stats.expirations += cleaned;
    return cleaned;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemory,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0
    };
  }

  /**
   * 更新内存使用
   */
  updateMemoryUsage() {
    try {
      const sample = JSON.stringify(Array.from(this.cache.entries()).slice(0, 10));
      const avgEntrySize = sample.length * 10;
      this.currentMemory = avgEntrySize * this.cache.size;
    } catch (e) {
      this.currentMemory = this.cache.size * 1000; // 估算
    }
  }

  /**
   * 获取 keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * 批量获取
   */
  mget(keys) {
    return keys.map(key => this.get(key));
  }

  /**
   * 批量设置
   */
  mset(entries) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    return this;
  }
}

/**
 * 带锁的缓存（防止击穿）
 */
class LockedCache extends CacheManager {
  constructor(options = {}) {
    super(options);
    this.locks = new Map();
    this.lockTimeout = options.lockTimeout || 5000;
  }

  /**
   * 获取缓存，支持回调加载
   */
  async getOrSet(key, loader, options = {}) {
    // 快速路径：缓存命中
    if (this.has(key)) {
      return this.get(key);
    }

    // 检查锁
    if (this.locks.has(key)) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (!this.locks.has(key)) {
            clearInterval(interval);
            if (this.has(key)) {
              resolve(this.get(key));
            } else {
              resolve(this.getOrSet(key, loader, options));
            }
          }
        }, 50);

        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('Lock timeout'));
        }, this.lockTimeout);
      });
    }

    // 加锁并加载
    this.locks.set(key, true);
    
    try {
      const value = await loader();
      this.set(key, value, options);
      return value;
    } finally {
      this.locks.delete(key);
    }
  }
}

/**
 * HTTP 响应缓存中间件
 */
class HttpCache {
  constructor(cache, options = {}) {
    this.cache = cache;
    this.options = {
      keyGenerator: options.keyGenerator || ((req) => req.url),
      ttl: options.ttl || 3600000,
      enabled: options.enabled !== false
    };
  }

  /**
   * 生成缓存 key
   */
  generateKey(req) {
    return this.options.keyGenerator(req);
  }

  /**
   * 检查是否应该缓存
   */
  shouldCache(req, res) {
    if (!this.options.enabled) return false;
    if (req.method !== 'GET') return false;
    if (res.statusCode !== 200) return false;
    
    const cacheControl = res.getHeader('cache-control');
    if (cacheControl && cacheControl.includes('no-cache')) return false;
    
    return true;
  }

  /**
   * 中间件函数
   */
  middleware() {
    return async (req, res, next) => {
      if (!this.options.enabled || req.method !== 'GET') {
        return next();
      }

      const key = this.generateKey(req);
      
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      // 拦截 res.json
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        if (res.statusCode === 200) {
          this.cache.set(key, data, { ttl: this.options.ttl });
        }
        return originalJson(data);
      };

      next();
    };
  }
}

module.exports = {
  CacheManager,
  LockedCache,
  HttpCache,
  CacheEntry
};
