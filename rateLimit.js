/**
 * 速率限制器
 * - 令牌桶算法实现
 * - 支持按域名/IP维度限流
 */

class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 60;  // 最大请求数
    this.windowMs = options.windowMs || 60000;    // 时间窗口（毫秒）
    this.buckets = new Map();
  }

  /**
   * 检查是否允许请求
   */
  tryAcquire(key) {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket || now - bucket.resetTime >= this.windowMs) {
      // 创建新的桶
      bucket = {
        tokens: this.maxRequests,
        resetTime: now + this.windowMs,
        lastRequest: now,
      };
      this.buckets.set(key, bucket);
    }

    if (bucket.tokens > 0) {
      bucket.tokens--;
      bucket.lastRequest = now;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: new Date(bucket.resetTime).toISOString(),
      };
    }

    // 计算等待时间
    const waitMs = bucket.resetTime - now;
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(bucket.resetTime).toISOString(),
      retryAfter: Math.ceil(waitMs / 1000),
    };
  }

  /**
   * 异步等待直到允许请求
   */
  async acquire(key) {
    const result = this.tryAcquire(key);
    
    if (result.allowed) {
      return result;
    }

    // 等待直到可以请求
    await new Promise(resolve => setTimeout(resolve, result.retryAfter * 1000));
    return this.tryAcquire(key);
  }

  /**
   * 重置指定key的限制
   */
  reset(key) {
    this.buckets.delete(key);
  }

  /**
   * 清空所有限制
   */
  clear() {
    this.buckets.clear();
  }

  /**
   * 获取状态
   */
  getStatus(key) {
    const bucket = this.buckets.get(key);
    if (!bucket) {
      return { available: true, remaining: this.maxRequests };
    }
    return {
      available: bucket.tokens > 0,
      remaining: bucket.tokens,
      resetAt: new Date(bucket.resetTime).toISOString(),
    };
  }
}

/**
 * 请求队列 - 控制并发和频率
 */
class RequestQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.interval = options.interval || 1000;  // 请求间隔（毫秒）
    this.queue = [];
    this.running = 0;
    this.lastRequestTime = 0;
  }

  /**
   * 添加请求到队列
   */
  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  /**
   * 处理队列
   */
  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    // 检查请求间隔
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.interval) {
      await new Promise(r => setTimeout(r, this.interval - timeSinceLastRequest));
    }

    const { fn, resolve, reject } = this.queue.shift();
    this.running++;
    this.lastRequestTime = Date.now();

    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process(); // 继续处理队列
    }
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      running: this.running,
      concurrency: this.concurrency,
    };
  }

  /**
   * 清空队列
   */
  clear() {
    const pending = this.queue.map(item => item.reject(new Error('Queue cleared')));
    this.queue = [];
    this.running = 0;
  }
}

/**
 * Robots.txt 解析器
 */
class RobotsTxt {
  constructor() {
    this.rules = new Map();
    this.sitemaps = [];
    this.crawlDelay = null;
  }

  /**
   * 从URL获取robots.txt并解析
   */
  async fetch(baseUrl) {
    try {
      const url = new URL('/robots.txt', baseUrl).href;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'WineArticleBot/1.0' },
      });

      if (!response.ok) {
        return true; // 无robots.txt，允许爬取
      }

      const text = await response.text();
      this.parse(text);
      return true;
    } catch (error) {
      console.warn(`获取robots.txt失败: ${baseUrl}`, error.message);
      return true; // 默认允许
    }
  }

  /**
   * 解析robots.txt内容
   */
  parse(content) {
    const lines = content.split('\n');
    let currentUserAgent = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [directive, value] = trimmed.split(':').map(s => s.trim());
      
      switch (directive.toLowerCase()) {
        case 'user-agent':
          currentUserAgent = value.toLowerCase();
          if (!this.rules.has(currentUserAgent)) {
            this.rules.set(currentUserAgent, { allowed: [], disallowed: [] });
          }
          break;
        
        case 'disallow':
          if (currentUserAgent) {
            const rules = this.rules.get(currentUserAgent);
            rules.disallowed.push(value);
          }
          break;
        
        case 'allow':
          if (currentUserAgent) {
            const rules = this.rules.get(currentUserAgent);
            rules.allowed.push(value);
          }
          break;
        
        case 'crawl-delay':
          this.crawlDelay = parseFloat(value);
          break;
        
        case 'sitemap':
          this.sitemaps.push(value);
          break;
      }
    }
  }

  /**
   * 检查URL是否允许爬取
   */
  canFetch(url, userAgent = 'winearticlebot') {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname + parsedUrl.search;

    // 获取匹配的规则
    let rules = this.rules.get(userAgent);
    if (!rules) {
      rules = this.rules.get('*');
    }
    if (!rules) {
      return { allowed: true, crawlDelay: this.crawlDelay };
    }

    // 检查disallow规则
    for (const pattern of rules.disallowed) {
      if (this.matchPattern(path, pattern)) {
        // 检查是否被allow覆盖
        for (const allowPattern of rules.allowed) {
          if (this.matchPattern(path, allowPattern)) {
            return { allowed: true, crawlDelay: this.crawlDelay };
          }
        }
        return { allowed: false, crawlDelay: this.crawlDelay };
      }
    }

    return { allowed: true, crawlDelay: this.crawlDelay };
  }

  /**
   * 简单的glob模式匹配
   */
  matchPattern(path, pattern) {
    if (!pattern || pattern === '/') return false;
    if (pattern === '/') return true;

    // 转换glob模式为正则
    const regex = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\$/, '\\$');
    
    return new RegExp(`^${regex}`, 'i').test(path);
  }
}

module.exports = {
  RateLimiter,
  RequestQueue,
  RobotsTxt,
};
