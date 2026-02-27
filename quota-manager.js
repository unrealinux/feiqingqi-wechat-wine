/**
 * API配额管理器
 * 管理各种外部API的调用配额，防止超出限制
 */

class QuotaManager {
  constructor(options = {}) {
    this.quotas = new Map();
    this.storage = options.storage || new MemoryStorage();
    this.checkEnabled = options.checkEnabled !== false;
  }

  /**
   * 初始化配额配置
   */
  initQuotas(quotas) {
    for (const [name, config] of Object.entries(quotas)) {
      this.quotas.set(name, {
        name,
        limit: config.limit || 100,
        window: config.window || 'daily', // daily, hourly, minute
        used: 0,
        resetAt: this.calculateResetTime(config.window || 'daily'),
        ...config
      });
    }
  }

  /**
   * 计算重置时间
   */
  calculateResetTime(window) {
    const now = new Date();
    
    switch (window) {
      case 'minute':
        return new Date(now.getTime() + 60000);
      case 'hourly':
        return new Date(now.getTime() + 3600000);
      case 'daily':
      default:
        // 重置到明天0点
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }
  }

  /**
   * 检查配额是否足够
   */
  async canUse(name, amount = 1) {
    if (!this.checkEnabled) return { allowed: true };

    const quota = this.quotas.get(name);
    if (!quota) {
      // 未配置的API，默认允许
      return { allowed: true, quota: name };
    }

    // 检查是否需要重置
    await this.checkAndReset(name);

    const remaining = quota.limit - quota.used;
    
    if (remaining < amount) {
      return {
        allowed: false,
        reason: 'quota_exceeded',
        quota: quota.limit,
        used: quota.used,
        remaining: Math.max(0, remaining),
        resetAt: quota.resetAt
      };
    }

    return { allowed: true, remaining: remaining - amount };
  }

  /**
   * 使用配额
   */
  async use(name, amount = 1) {
    if (!this.checkEnabled) return true;

    const quota = this.quotas.get(name);
    if (!quota) return true;

    // 检查并重置
    await this.checkAndReset(name);

    quota.used += amount;
    
    // 持久化
    await this.storage.set(name, {
      used: quota.used,
      resetAt: quota.resetAt.getTime()
    });

    return true;
  }

  /**
   * 检查并重置配额
   */
  async checkAndReset(name) {
    const quota = this.quotas.get(name);
    if (!quota) return;

    const now = new Date();
    
    if (now >= quota.resetAt) {
      // 重置配额
      quota.used = 0;
      quota.resetAt = this.calculateResetTime(quota.window);
      
      // 持久化
      await this.storage.set(name, {
        used: 0,
        resetAt: quota.resetAt.getTime()
      });
    }
  }

  /**
   * 获取配额状态
   */
  async getStatus(name) {
    const quota = this.quotas.get(name);
    if (!quota) {
      return { configured: false };
    }

    await this.checkAndReset(name);

    return {
      configured: true,
      limit: quota.limit,
      used: quota.used,
      remaining: Math.max(0, quota.limit - quota.used),
      resetAt: quota.resetAt.toISOString(),
      window: quota.window
    };
  }

  /**
   * 获取所有配额状态
   */
  async getAllStatus() {
    const status = {};
    for (const name of this.quotas.keys()) {
      status[name] = await this.getStatus(name);
    }
    return status;
  }

  /**
   * 重置配额
   */
  async reset(name) {
    const quota = this.quotas.get(name);
    if (!quota) return false;

    quota.used = 0;
    quota.resetAt = this.calculateResetTime(quota.window);
    
    await this.storage.set(name, {
      used: 0,
      resetAt: quota.resetAt.getTime()
    });

    return true;
  }

  /**
   * 重置所有配额
   */
  async resetAll() {
    for (const name of this.quotas.keys()) {
      await this.reset(name);
    }
  }
}

/**
 * 内存存储
 */
class MemoryStorage {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key);
  }

  async set(key, value) {
    this.data.set(key, value);
  }

  async delete(key) {
    this.data.delete(key);
  }
}

/**
 * Redis存储
 */
class RedisStorage {
  constructor(redisClient, options = {}) {
    this.redis = redisClient;
    this.prefix = options.prefix || 'quota:';
  }

  getKey(name) {
    return `${this.prefix}${name}`;
  }

  async get(name) {
    const data = await this.redis.get(this.getKey(name));
    return data ? JSON.parse(data) : null;
  }

  async set(name, value) {
    await this.redis.set(
      this.getKey(name),
      JSON.stringify(value),
      'EX',
      86400 // 24小时过期
    );
  }

  async delete(name) {
    await this.redis.del(this.getKey(name));
  }
}

/**
 * 预定义的API配额配置
 */
const DEFAULT_QUOTAS = {
  // 聚合数据
  juhe: {
    limit: 50,
    window: 'daily',
    name: '聚合数据API'
  },
  // 天行数据
  tianapi: {
    limit: 100,
    window: 'daily',
    name: '天行数据API'
  },
  // OpenAI
  openai: {
    limit: 100,
    window: 'daily',
    name: 'OpenAI API'
  },
  // MiniMax
  minimax: {
    limit: 200,
    window: 'daily',
    name: 'MiniMax API'
  },
  // DeepSeek
  deepseek: {
    limit: 100,
    window: 'daily',
    name: 'DeepSeek API'
  }
};

/**
 * 便捷函数：创建配额管理器
 */
function createQuotaManager(redisClient) {
  const storage = redisClient 
    ? new RedisStorage(redisClient)
    : new MemoryStorage();
  
  const manager = new QuotaManager({ storage });
  manager.initQuotas(DEFAULT_QUOTAS);
  
  return manager;
}

module.exports = {
  QuotaManager,
  MemoryStorage,
  RedisStorage,
  DEFAULT_QUOTAS,
  createQuotaManager
};
