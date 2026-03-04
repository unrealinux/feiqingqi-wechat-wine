/**
 * 事件总线
 * 实现模块间的事件驱动解耦
 */

const { EventEmitter } = require('events');

class EventBus extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      // 是否记录日志
      logging: options.logging !== false,
      
      // 最大监听器数量
      maxListeners: options.maxListeners || 50,
      
      // 事件保留时间（毫秒）
      eventHistory: options.eventHistory !== false,
      historySize: options.historySize || 100
    };
    
    // 事件历史
    this.history = [];
    
    // 事件统计
    this.stats = {
      totalEvents: 0,
      byEvent: {}
    };
    
    // 设置最大监听器
    this.setMaxListeners(this.options.maxListeners);
  }

  /**
   * 发布事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   * @returns {boolean}
   */
  publish(event, data) {
    if (this.options.logging) {
      console.log(`[EventBus] 发布事件: ${event}`);
    }
    
    // 记录历史
    if (this.options.eventHistory) {
      this.recordEvent(event, data);
    }
    
    // 更新统计
    this.updateStats(event);
    
    // 同步触发
    super.emit(event, data);
    
    return true;
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} handler - 处理函数
   * @returns {Function} 取消订阅函数
   */
  subscribe(event, handler) {
    this.on(event, handler);
    
    if (this.options.logging) {
      console.log(`[EventBus] 订阅事件: ${event}`);
    }
    
    // 返回取消订阅函数
    return () => {
      this.off(event, handler);
      if (this.options.logging) {
        console.log(`[EventBus] 取消订阅: ${event}`);
      }
    };
  }

  /**
   * 订阅一次
   * @param {string} event - 事件名称
   * @param {Function} handler - 处理函数
   */
  subscribeOnce(event, handler) {
    this.once(event, handler);
  }

  /**
   * 发布事件（异步）
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  async publishAsync(event, data) {
    return new Promise((resolve) => {
      setImmediate(() => {
        this.publish(event, data);
        resolve();
      });
    });
  }

  /**
   * 中间件
   * @param {Function} middleware - 中间件函数
   */
  use(middleware) {
    const originalEmit = this.emit;
    
    this.emit = (event, data) => {
      // 调用中间件
      middleware(event, data, (err) => {
        if (err) {
          this.emit('error', { event, error: err });
          return;
        }
        originalEmit.call(this, event, data);
      });
    };
  }

  /**
   * 记录事件历史
   */
  recordEvent(event, data) {
    const record = {
      event,
      data,
      timestamp: Date.now()
    };
    
    this.history.push(record);
    
    // 限制历史大小
    if (this.history.length > this.options.historySize) {
      this.history.shift();
    }
  }

  /**
   * 更新统计
   */
  updateStats(event) {
    this.stats.totalEvents++;
    
    if (!this.stats.byEvent[event]) {
      this.stats.byEvent[event] = 0;
    }
    this.stats.byEvent[event]++;
  }

  /**
   * 获取事件历史
   * @param {string} event - 事件名称（可选）
   * @param {number} limit - 返回数量
   */
  getHistory(event, limit = 10) {
    let history = this.history;
    
    if (event) {
      history = history.filter(h => h.event === event);
    }
    
    return history.slice(-limit);
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      listenerCount: this.listenerCount()
    };
  }

  /**
   * 获取监听器数量
   */
  listenerCount(event) {
    if (event) {
      return this.listenerCount(event);
    }
    return this.eventNames().reduce((sum, e) => sum + this.listenerCount(e), 0);
  }

  /**
   * 清除所有监听器
   */
  clear() {
    this.removeAllListeners();
    this.history = [];
  }

  /**
   * 清除特定事件
   */
  clearEvent(event) {
    this.removeAllListeners(event);
  }
}

/**
 * 预定义事件
 */
const Events = {
  // 采集相关
  CRAWL_START: 'crawl:start',
  CRAWL_PROGRESS: 'crawl:progress',
  CRAWL_COMPLETE: 'crawl:complete',
  CRAWL_ERROR: 'crawl:error',
  
  // 文章相关
  ARTICLE_FETCHED: 'article:fetched',
  ARTICLE_FILTERED: 'article:filtered',
  ARTICLE_QUALITY_SCORED: 'article:quality-scored',
  
  // 生成相关
  GENERATE_START: 'generate:start',
  GENERATE_PROGRESS: 'generate:progress',
  GENERATE_COMPLETE: 'generate:complete',
  GENERATE_ERROR: 'generate:error',
  
  // 发布相关
  PUBLISH_START: 'publish:start',
  PUBLISH_SUCCESS: 'publish:success',
  PUBLISH_ERROR: 'publish:error',
  
  // 系统相关
  SYSTEM_ERROR: 'system:error',
  CONFIG_CHANGED: 'config:changed',
  HEALTH_CHECK: 'health:check'
};

/**
 * 创建事件总线实例
 */
function createEventBus(options) {
  return new EventBus(options);
}

module.exports = {
  EventBus,
  Events,
  createEventBus
};
