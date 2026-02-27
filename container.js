/**
 * 依赖注入容器
 * 实现控制反转(IoC)模式，解耦模块间的依赖关系
 */

const { Logger, Redis, Database, LRUCache } = require('./utils');
const { GlobalErrorHandler, CircuitBreaker } = require('./errors');
const { RateLimiter, RequestQueue, RobotsTxt } = require('./rateLimit');
const config = require('./config');

class Container {
  constructor(options = {}) {
    this.config = options.config || config;
    this.services = new Map();
    this.logger = null;
    this.isInitialized = false;
  }

  /**
   * 初始化容器，注册所有服务
   */
  async init() {
    if (this.isInitialized) return;

    // 注册日志服务
    this.register('logger', () => new Logger());

    // 注册Redis服务
    this.register('redis', () => new Redis());

    // 注册数据库服务
    this.register('database', () => new Database());

    // 注册LRU缓存
    this.register('cache', () => new LRUCache(this.config.cache.lru));

    // 注册全局错误处理器
    this.register('errorHandler', () => {
      const logger = this.get('logger');
      return new GlobalErrorHandler(logger);
    });

    // 注册速率限制器
    this.register('rateLimiter', () => new RateLimiter(this.config.crawl.rateLimit));

    // 注册请求队列
    this.register('requestQueue', () => new RequestQueue({
      concurrency: this.config.crawl.maxConcurrent,
      interval: this.config.crawl.rateLimit.crawlDelay || 1000,
    }));

    // 注册RobotsTxt解析器
    this.register('robotsTxt', () => new RobotsTxt());

    // 注册断路器工厂
    this.register('circuitBreakerFactory', () => (name) => {
      const breakers = new Map();
      if (!breakers.has(name)) {
        breakers.set(name, new CircuitBreaker({ failureThreshold: 3, timeout: 60000 }));
      }
      return breakers.get(name);
    });

    this.isInitialized = true;
    console.log('容器初始化完成');
  }

  /**
   * 注册服务
   */
  register(name, factory) {
    this.services.set(name, { factory, instance: null });
  }

  /**
   * 获取服务（延迟初始化）
   */
  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`服务 ${name} 未注册`);
    }

    const service = this.services.get(name);
    if (!service.instance) {
      service.instance = service.factory(this);
    }
    return service.instance;
  }

  /**
   * 强制重新创建服务实例
   */
  recreate(name) {
    if (this.services.has(name)) {
      const service = this.services.get(name);
      service.instance = null;
    }
    return this.get(name);
  }

  /**
   * 检查服务是否存在
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * 获取所有服务状态
   */
  getStatus() {
    const status = {};
    for (const [name, service] of this.services) {
      status[name] = {
        registered: true,
        initialized: service.instance !== null,
      };
    }
    return status;
  }

  /**
   * 关闭容器，清理资源
   */
  async dispose() {
    const cleanupPromises = [];

    // 关闭Redis连接
    if (this.has('redis')) {
      cleanupPromises.push(this.get('redis').close().catch(() => {}));
    }

    // 关闭数据库连接
    if (this.has('database')) {
      cleanupPromises.push(this.get('database').close().catch(() => {}));
    }

    await Promise.all(cleanupPromises);
    console.log('容器资源已清理');
  }
}

/**
 * 依赖注入装饰器（用于类）
 */
function injectable(target) {
  target.prototype.__injectable__ = true;
  return target;
}

/**
 * 属性注入装饰器
 */
function inject(serviceName) {
  return function (target, propertyKey) {
    if (!target.__injections__) {
      target.__injections__ = {};
    }
    target.__injections__[propertyKey] = serviceName;
  };
}

/**
 * 创建带依赖注入的类实例
 */
function createInstance(Class, container) {
  const instance = new Class();
  
  // 处理属性注入
  if (instance.__injections__) {
    for (const [property, serviceName] of Object.entries(instance.__injections__)) {
      instance[property] = container.get(serviceName);
    }
  }
  
  return instance;
}

// 单例容器实例
let containerInstance = null;

/**
 * 获取单例容器
 */
function getContainer(options = {}) {
  if (!containerInstance) {
    containerInstance = new Container(options);
  }
  return containerInstance;
}

/**
 * 重置单例容器（用于测试）
 */
function resetContainer() {
  if (containerInstance) {
    containerInstance.dispose();
    containerInstance = null;
  }
}

module.exports = {
  Container,
  injectable,
  inject,
  createInstance,
  getContainer,
  resetContainer,
};
