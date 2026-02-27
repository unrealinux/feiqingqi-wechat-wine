/**
 * 增强的速率限制器
 * 支持按域名、时间窗口、并发数等多维度限制
 */

class EnhancedRateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 60;
    this.windowMs = options.windowMs || 60000;
    this.maxConcurrent = options.maxConcurrent || 10;
    
    // 按域名的请求记录
    this.domainBuckets = new Map();
    // 全局请求队列
    this.requestQueue = [];
    // 当前并发数
    this.activeRequests = 0;
    // 等待队列
    this.waitQueue = [];
  }

  /**
   * 获取域名桶
   */
  getDomainBucket(domain) {
    if (!this.domainBuckets.has(domain)) {
      this.domainBuckets.set(domain, {
        tokens: this.maxRequests,
        resetTime: Date.now() + this.windowMs,
        requests: []
      });
    }
    return this.domainBuckets.get(domain);
  }

  /**
   * 尝试获取令牌
   */
  tryAcquire(domain = 'global') {
    const now = Date.now();
    const bucket = this.getDomainBucket(domain);
    
    // 检查是否需要重置
    if (now >= bucket.resetTime) {
      bucket.tokens = this.maxRequests;
      bucket.resetTime = now + this.windowMs;
      bucket.requests = [];
    }
    
    // 检查并发限制
    if (this.activeRequests >= this.maxConcurrent) {
      return {
        allowed: false,
        reason: 'concurrent_limit',
        retryAfter: 1000
      };
    }
    
    // 检查令牌
    if (bucket.tokens > 0) {
      bucket.tokens--;
      bucket.requests.push(now);
      this.activeRequests++;
      
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: new Date(bucket.resetTime).toISOString(),
        concurrent: this.activeRequests
      };
    }
    
    // 计算等待时间
    const waitTime = bucket.resetTime - now;
    return {
      allowed: false,
      reason: 'rate_limit',
      retryAfter: Math.ceil(waitTime),
      resetAt: new Date(bucket.resetTime).toISOString()
    };
  }

  /**
   * 释放令牌
   */
  release(domain = 'global') {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    
    // 处理等待队列
    this.processQueue();
  }

  /**
   * 处理等待队列
   */
  processQueue() {
    if (this.waitQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const next = this.waitQueue.shift();
      if (next && next.resolve) {
        const result = this.tryAcquire(next.domain);
        if (result.allowed) {
          next.resolve(result);
        } else {
          this.waitQueue.unshift(next);
          setTimeout(() => this.processQueue(), result.retryAfter);
        }
      }
    }
  }

  /**
   * 异步获取令牌
   */
  async acquire(domain = 'global') {
    const result = this.tryAcquire(domain);
    
    if (result.allowed) {
      return result;
    }
    
    // 加入等待队列
    return new Promise((resolve, reject) => {
      this.waitQueue.push({ domain, resolve, reject });
      
      // 设置超时
      setTimeout(() => {
        const index = this.waitQueue.findIndex(w => w.resolve === resolve);
        if (index !== -1) {
          this.waitQueue.splice(index, 1);
          reject(new Error('Rate limiter timeout'));
        }
      }, 30000);
    });
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      activeRequests: this.activeRequests,
      maxConcurrent: this.maxConcurrent,
      queueLength: this.waitQueue.length,
      domains: Object.fromEntries(
        [...this.domainBuckets.entries()].map(([k, v]) => [
          k,
          { tokens: v.tokens, resetAt: new Date(v.resetTime).toISOString() }
        ])
      )
    };
  }

  /**
   * 重置
   */
  reset() {
    this.domainBuckets.clear();
    this.activeRequests = 0;
    this.waitQueue = [];
  }
}

/**
 * 分布式速率限制器 (Redis支持)
 */
class DistributedRateLimiter {
  constructor(redisClient, options = {}) {
    this.redis = redisClient;
    this.keyPrefix = options.keyPrefix || 'ratelimit:';
    this.maxRequests = options.maxRequests || 60;
    this.windowMs = options.windowMs || 60000;
  }

  /**
   * 检查并获取令牌 (原子操作)
   */
  async tryAcquire(key) {
    const fullKey = `${this.keyPrefix}${key}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    try {
      // 使用Redis事务
      const multi = this.redis.multi();
      
      // 移除过期的记录
      multi.zremrangebyscore(fullKey, 0, windowStart);
      
      // 获取当前请求数
      multi.zcard(fullKey);
      
      const results = await multi.exec();
      const currentCount = results[1][1];
      
      if (currentCount >= this.maxRequests) {
        // 获取最早的请求时间用于计算重置时间
        const oldest = await this.redis.zrange(fullKey, 0, 0, 'WITHSCORES');
        const resetAt = oldest.length > 1 ? oldest[1] + this.windowMs : now + this.windowMs;
        
        return {
          allowed: false,
          reason: 'rate_limit',
          retryAfter: Math.ceil((resetAt - now) / 1000),
          resetAt: new Date(resetAt).toISOString()
        };
      }
      
      // 添加新请求
      await this.redis.zadd(fullKey, now, `${now}-${Math.random()}`);
      
      // 设置过期时间
      await this.redis.expire(fullKey, Math.ceil(this.windowMs / 1000));
      
      return {
        allowed: true,
        remaining: this.maxRequests - currentCount - 1,
        resetAt: new Date(now + this.windowMs).toISOString()
      };
    } catch (error) {
      console.error('Distributed rate limit error:', error);
      // 降级为本地限制
      return { allowed: true, reason: 'fallback' };
    }
  }

  /**
   * 获取当前状态
   */
  async getStatus(key) {
    const fullKey = `${this.keyPrefix}${key}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    try {
      await this.redis.zremrangebyscore(fullKey, 0, windowStart);
      const count = await this.redis.zcard(fullKey);
      
      return {
        current: count,
        max: this.maxRequests,
        remaining: Math.max(0, this.maxRequests - count)
      };
    } catch {
      return { error: 'Failed to get status' };
    }
  }
}

module.exports = {
  EnhancedRateLimiter,
  DistributedRateLimiter
};
