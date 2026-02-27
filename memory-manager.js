/**
 * 内存管理和监控
 * 自动监控内存使用，支持预警和自动清理
 */

const os = require('os');

class MemoryManager {
  constructor(options = {}) {
    this.options = {
      // 内存阈值
      warningThreshold: options.warningThreshold || 0.7,   // 70% 警告
      criticalThreshold: options.criticalThreshold || 0.85, // 85% 危险
      
      // 自动清理
      autoCleanup: options.autoCleanup !== false,
      cleanupInterval: options.cleanupInterval || 60000,   // 1分钟检查
      
      // 事件回调
      onWarning: options.onWarning || null,
      onCritical: options.onCritical || null,
      onCleanup: options.onCleanup || null,
      
      // 缓存管理器引用
      cacheManager: options.cacheManager || null
    };

    this.startTime = Date.now();
    this.checkCount = 0;
    this.events = [];
    this.cleanupInterval = null;
    
    this.startMonitoring();
  }

  /**
   * 获取内存信息
   */
  getMemoryInfo() {
    const used = process.memoryUsage();
    const total = os.totalmem();
    const free = os.freemem();
    const usedTotal = total - free;
    
    return {
      process: {
        heapUsed: used.heapUsed,
        heapTotal: used.heapTotal,
        external: used.external,
        rss: used.rss,
        arrayBuffers: used.arrayBuffers
      },
      system: {
        total,
        free,
        used: usedTotal,
        usagePercent: usedTotal / total
      },
      timestamp: Date.now()
    };
  }

  /**
   * 获取健康状态
   */
  getHealthStatus() {
    const info = this.getMemoryInfo();
    const usagePercent = info.system.usagePercent;
    
    let status = 'healthy';
    let level = 'info';
    
    if (usagePercent >= this.options.criticalThreshold) {
      status = 'critical';
      level = 'error';
    } else if (usagePercent >= this.options.warningThreshold) {
      status = 'warning';
      level = 'warning';
    }
    
    return {
      status,
      level,
      usagePercent,
      ...info
    };
  }

  /**
   * 检查内存状态
   */
  check() {
    this.checkCount++;
    const health = this.getHealthStatus();
    
    // 触发事件
    if (health.status === 'critical' && this.options.onCritical) {
      this.triggerEvent('critical', health);
      this.options.onCritical(health);
    } else if (health.status === 'warning' && this.options.onWarning) {
      this.triggerEvent('warning', health);
      this.options.onWarning(health);
    }
    
    // 自动清理
    if (this.options.autoCleanup && health.status !== 'healthy') {
      this.performCleanup();
    }
    
    return health;
  }

  /**
   * 触发事件
   */
  triggerEvent(type, data) {
    const event = {
      type,
      data,
      timestamp: Date.now(),
      checkCount: this.checkCount
    };
    
    this.events.push(event);
    
    // 保留最近100个事件
    if (this.events.length > 100) {
      this.events.shift();
    }
  }

  /**
   * 执行清理
   */
  performCleanup() {
    const cleaned = {
      cache: 0,
      gc: 0
    };

    // 清理缓存
    if (this.options.cacheManager) {
      cleaned.cache = this.options.cacheManager.cleanup();
    }

    // 强制 GC (如果可用)
    if (global.gc) {
      global.gc();
      cleaned.gc = 1;
    }

    if (this.options.onCleanup) {
      this.options.onCleanup(cleaned);
    }

    console.log(`[Memory] Cleanup performed: cache=${cleaned.cache}, gc=${cleaned.gc}`);
    return cleaned;
  }

  /**
   * 开始监控
   */
  startMonitoring() {
    if (this.cleanupInterval) return;
    
    this.cleanupInterval = setInterval(() => {
      this.check();
    }, this.options.cleanupInterval);
    
    // 立即检查一次
    this.check();
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * 获取统计
   */
  getStats() {
    return {
      uptime: Date.now() - this.startTime,
      checkCount: this.checkCount,
      events: this.events.length,
      thresholds: {
        warning: this.options.warningThreshold,
        critical: this.options.criticalThreshold
      }
    };
  }

  /**
   * 获取事件历史
   */
  getEvents(limit = 20) {
    return this.events.slice(-limit);
  }

  /**
   * 手动触发清理
   */
  forceCleanup() {
    return this.performCleanup();
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.stopMonitoring();
    this.events = [];
  }
}

/**
 * 内存安全装饰器
 * 防止内存溢出错误
 */
function memorySafe(options = {}) {
  const manager = new MemoryManager(options);
  
  return {
    manager,
    
    // 包装异步函数
    wrapAsync: (fn) => {
      return async (...args) => {
        const health = manager.check();
        
        if (health.status === 'critical') {
          throw new Error('Memory critical, operation rejected');
        }
        
        return fn(...args);
      };
    },
    
    // 内存不足时拒绝新任务
    createQueue: (concurrency = 1) => {
      let running = 0;
      const queue = [];
      
      const process = async () => {
        if (running >= concurrency || queue.length === 0) return;
        
        const health = manager.getHealthStatus();
        if (health.status === 'critical') {
          setTimeout(process, 1000);
          return;
        }
        
        running++;
        const task = queue.shift();
        
        try {
          await task.fn(...task.args);
        } catch (e) {
          task.reject(e);
        } finally {
          running--;
          process();
        }
      };
      
      return {
        add: (fn, ...args) => {
          return new Promise((resolve, reject) => {
            queue.push({ fn, args, resolve, reject });
            process();
          });
        },
        size: () => queue.length,
        running: () => running
      };
    }
  };
}

module.exports = {
  MemoryManager,
  memorySafe
};
