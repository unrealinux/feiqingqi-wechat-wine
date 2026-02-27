/**
 * 配置热重载模块
 * 监听配置文件变化，自动重新加载
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class ConfigHotReloader extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.configPath = options.configPath || './config.js';
    this.watchPath = options.watchPath || ['./config.js', './.env'];
    this.debounceMs = options.debounceMs || 1000;
    this.autoReload = options.autoReload !== false;
    
    this.config = null;
    this.watchers = new Map();
    this.debounceTimers = new Map();
    this.loadCount = 0;
  }

  /**
   * 加载配置
   */
  load() {
    try {
      // 清除缓存
      delete require.cache[require.resolve(this.configPath)];
      
      // 重新加载
      this.config = require(this.configPath);
      this.loadCount++;
      
      this.emit('loaded', {
        config: this.config,
        count: this.loadCount,
        timestamp: new Date()
      });
      
      console.log(`[Config] 配置已重新加载 (${this.loadCount}次)`);
      return this.config;
    } catch (error) {
      this.emit('error', {
        error: error.message,
        timestamp: new Date()
      });
      
      console.error(`[Config] 配置加载失败: ${error.message}`);
      
      // 返回上一次有效的配置
      return this.config;
    }
  }

  /**
   * 获取配置
   */
  get() {
    return this.config;
  }

  /**
   * 获取特定配置项
   */
  get(path, defaultValue = undefined) {
    if (!this.config) return defaultValue;
    
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value === undefined || value === null) {
        return defaultValue;
      }
      value = value[key];
    }
    
    return value !== undefined ? value : defaultValue;
  }

  /**
   * 监听文件变化
   */
  watch() {
    if (!this.autoReload) {
      console.log('[Config] 自动重载已禁用');
      return this;
    }

    for (const filePath of this.watchPath) {
      this.watchFile(filePath);
    }

    console.log(`[Config] 已监听 ${this.watchPath.length} 个配置文件`);
    return this;
  }

  /**
   * 监听单个文件
   */
  watchFile(filePath) {
    const absolutePath = path.resolve(filePath);
    
    // 检查文件是否存在
    if (!fs.existsSync(absolutePath)) {
      console.warn(`[Config] 配置文件不存在: ${filePath}`);
      return;
    }

    // 如果已经监听，则跳过
    if (this.watchers.has(absolutePath)) {
      return;
    }

    try {
      const watcher = fs.watch(absolutePath, (eventType) => {
        if (eventType === 'change') {
          this.handleFileChange(absolutePath);
        }
      });

      this.watchers.set(absolutePath, watcher);
      console.log(`[Config] 监听: ${filePath}`);
    } catch (error) {
      console.error(`[Config] 监听失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 处理文件变化（防抖）
   */
  handleFileChange(filePath) {
    // 清除之前的定时器
    const existingTimer = this.debounceTimers.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 设置新的定时器
    const timer = setTimeout(() => {
      this.debounceTimers.delete(filePath);
      console.log(`[Config] 检测到配置文件变化: ${filePath}`);
      this.load();
      this.emit('changed', {
        file: filePath,
        timestamp: new Date()
      });
    }, this.debounceMs);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * 停止监听
   */
  unwatch() {
    for (const [filePath, watcher] of this.watchers) {
      watcher.close();
      console.log(`[Config] 停止监听: ${filePath}`);
    }
    
    this.watchers.clear();
    
    // 清除所有定时器
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }

  /**
   * 手动触发重载
   */
  reload() {
    return this.load();
  }

  /**
   * 获取加载历史
   */
  getLoadHistory() {
    return {
      loadCount: this.loadCount,
      lastLoad: this.loadCount > 0 ? new Date() : null
    };
  }

  /**
   * 销毁
   */
  destroy() {
    this.unwatch();
    this.removeAllListeners();
  }
}

/**
 * 配置验证器
 */
class ConfigValidator {
  static validate(config) {
    const errors = [];
    const warnings = [];

    // 必填字段检查
    if (!config.generate?.provider) {
      errors.push('generate.provider 是必填项');
    }

    if (!config.generate?.apiKey) {
      errors.push('generate.apiKey 是必填项');
    }

    if (!config.publish?.appId) {
      errors.push('publish.appId 是必填项');
    }

    // 数值范围检查
    if (config.crawl?.timeout && config.crawl.timeout < 1000) {
      warnings.push('crawl.timeout 建议不小于1000ms');
    }

    if (config.crawl?.maxConcurrent && config.crawl.maxConcurrent > 20) {
      warnings.push('crawl.maxConcurrent 建议不超过20');
    }

    // URL格式检查
    if (config.crawl?.rssSources) {
      for (const url of config.crawl.rssSources) {
        try {
          new URL(url);
        } catch {
          errors.push(`无效的RSS URL: ${url}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * 创建配置管理器实例
 */
function createConfigManager(options = {}) {
  const reloader = new ConfigHotReloader({
    configPath: options.configPath,
    watchPath: options.watchPath,
    debounceMs: options.debounceMs,
    autoReload: options.autoReload !== false
  });

  // 初始加载
  reloader.load();

  // 自动监听变化
  if (options.autoReload !== false) {
    reloader.watch();
  }

  return reloader;
}

module.exports = {
  ConfigHotReloader,
  ConfigValidator,
  createConfigManager
};
