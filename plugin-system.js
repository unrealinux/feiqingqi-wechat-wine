/**
 * 插件系统框架
 * 支持扩展数据源、内容转换器、发布器等
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * 插件类型枚举
 */
const PluginTypes = {
  DATA_SOURCE: 'dataSource',      // 数据源
  TRANSFORMER: 'transformer',     // 内容转换器
  PUBLISHER: 'publisher',         // 发布器
  MIDDLEWARE: 'middleware',       // 中间件
  VALIDATOR: 'validator'         // 验证器
};

/**
 * 插件基类
 */
class BasePlugin {
  constructor(options = {}) {
    this.name = options.name || this.constructor.name;
    this.version = options.version || '1.0.0';
    this.enabled = options.enabled !== false;
    this.config = options.config || {};
    this.priority = options.priority || 100;
  }

  /**
   * 初始化插件
   */
  async init(context) {
    this.context = context;
    console.log(`[Plugin] ${this.name} initialized`);
  }

  /**
   * 启用插件
   */
  enable() {
    this.enabled = true;
  }

  /**
   * 禁用插件
   */
  disable() {
    this.enabled = false;
  }

  /**
   * 验证配置
   */
  validateConfig() {
    return { valid: true, errors: [] };
  }
}

/**
 * 数据源插件
 */
class DataSourcePlugin extends BasePlugin {
  constructor(options = {}) {
    super(options);
    this.type = PluginTypes.DATA_SOURCE;
  }

  async fetch(options = {}) {
    throw new Error('fetch() must be implemented by subclass');
  }
}

/**
 * 内容转换器插件
 */
class TransformerPlugin extends BasePlugin {
  constructor(options = {}) {
    super(options);
    this.type = PluginTypes.TRANSFORMER;
  }

  async transform(content, options = {}) {
    throw new Error('transform() must be implemented by subclass');
  }
}

/**
 * 发布器插件
 */
class PublisherPlugin extends BasePlugin {
  constructor(options = {}) {
    super(options);
    this.type = PluginTypes.PUBLISHER;
  }

  async publish(content, options = {}) {
    throw new Error('publish() must be implemented by subclass');
  }
}

/**
 * 插件管理器
 */
class PluginManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.plugins = new Map();
    this.pluginDir = options.pluginDir || './plugins';
    this.context = options.context || {};
    this.hooks = new Map();
    
    // 初始化钩子
    this.initHooks();
  }

  /**
   * 初始化内置钩子
   */
  initHooks() {
    const hookNames = [
      'beforeCrawl',
      'afterCrawl',
      'beforeTransform',
      'afterTransform',
      'beforePublish',
      'afterPublish',
      'onError',
      'onRetry'
    ];

    hookNames.forEach(name => {
      this.hooks.set(name, []);
    });
  }

  /**
   * 注册插件
   */
  register(plugin) {
    if (!(plugin instanceof BasePlugin)) {
      throw new Error('Plugin must extend BasePlugin');
    }

    const key = `${plugin.type}:${plugin.name}`;
    
    if (this.plugins.has(key)) {
      console.warn(`[Plugin] Plugin ${key} already registered, replacing`);
    }

    this.plugins.set(key, plugin);
    this.emit('registered', plugin);
    
    console.log(`[Plugin] Registered: ${key}`);
    return this;
  }

  /**
   * 批量注册插件
   */
  registerMany(plugins) {
    plugins.forEach(p => this.register(p));
    return this;
  }

  /**
   * 获取插件
   */
  get(name, type) {
    const key = `${type}:${name}`;
    return this.plugins.get(key);
  }

  /**
   * 获取所有插件
   */
  getAll(type) {
    if (!type) {
      return Array.from(this.plugins.values());
    }
    
    return Array.from(this.plugins.values())
      .filter(p => p.type === type);
  }

  /**
   * 获取启用的插件
   */
  getEnabled(type) {
    return this.getAll(type).filter(p => p.enabled);
  }

  /**
   * 初始化所有插件
   */
  async initAll() {
    const promises = [];
    
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled) {
        promises.push(plugin.init(this.context));
      }
    }

    await Promise.all(promises);
    this.emit('initialized');
  }

  /**
   * 加载插件目录
   */
  async loadFromDir(dir) {
    const pluginDir = path.resolve(dir);
    
    if (!fs.existsSync(pluginDir)) {
      console.warn(`[Plugin] Plugin directory not found: ${pluginDir}`);
      return [];
    }

    const files = await fs.promises.readdir(pluginDir);
    const loaded = [];

    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      
      const filepath = path.join(pluginDir, file);
      
      try {
        const pluginModule = require(filepath);
        
        // 支持多种导出格式
        const plugin = pluginModule.default || pluginModule;
        
        if (plugin && typeof plugin === 'object') {
          this.register(plugin);
          loaded.push(plugin.name);
        }
      } catch (err) {
        console.error(`[Plugin] Failed to load ${file}:`, err.message);
      }
    }

    return loaded;
  }

  /**
   * 注册钩子
   */
  registerHook(hookName, fn) {
    if (!this.hooks.has(hookName)) {
      throw new Error(`Unknown hook: ${hookName}`);
    }
    
    this.hooks.get(hookName).push(fn);
    return this;
  }

  /**
   * 触发钩子
   */
  async triggerHook(hookName, data) {
    const handlers = this.hooks.get(hookName) || [];
    
    let result = data;
    for (const handler of handlers) {
      try {
        result = await handler(result) || result;
      } catch (err) {
        console.error(`[Plugin] Hook ${hookName} error:`, err.message);
        this.emit('hookError', { hook: hookName, error: err });
      }
    }
    
    return result;
  }

  /**
   * 禁用插件
   */
  disable(name, type) {
    const plugin = this.get(name, type);
    if (plugin) {
      plugin.disable();
    }
    return this;
  }

  /**
   * 启用插件
   */
  enablePlugin(name, type) {
    const plugin = this.get(name, type);
    if (plugin) {
      plugin.enable();
    }
    return this;
  }

  /**
   * 卸载插件
   */
  unregister(name, type) {
    const key = `${type}:${name}`;
    const plugin = this.plugins.get(key);
    
    if (plugin) {
      this.plugins.delete(key);
      this.emit('unregistered', plugin);
    }
    
    return this;
  }

  /**
   * 获取插件状态
   */
  getStatus() {
    const status = {
      total: this.plugins.size,
      enabled: 0,
      byType: {}
    };

    for (const plugin of this.plugins.values()) {
      if (plugin.enabled) status.enabled++;
      
      if (!status.byType[plugin.type]) {
        status.byType[plugin.type] = { total: 0, enabled: 0 };
      }
      
      status.byType[plugin.type].total++;
      if (plugin.enabled) {
        status.byType[plugin.type].enabled++;
      }
    }

    return status;
  }
}

/**
 * 创建示例插件
 */
function createExamplePlugins() {
  // 示例数据源插件
  class ExampleRSSPlugin extends DataSourcePlugin {
    constructor(options = {}) {
      super({
        name: 'example-rss',
        version: '1.0.0',
        ...options
      });
    }

    async fetch(options = {}) {
      // 示例实现
      return [];
    }
  }

  // 示例转换器插件
  class ExampleTransformerPlugin extends TransformerPlugin {
    constructor(options = {}) {
      super({
        name: 'example-transformer',
        version: '1.0.0',
        ...options
      });
    }

    async transform(content, options = {}) {
      return content;
    }
  }

  // 示例发布器插件
  class ExamplePublisherPlugin extends PublisherPlugin {
    constructor(options = {}) {
      super({
        name: 'example-publisher',
        version: '1.0.0',
        ...options
      });
    }

    async publish(content, options = {}) {
      return { success: true, id: 'example-id' };
    }
  }

  return {
    ExampleRSSPlugin,
    ExampleTransformerPlugin,
    ExamplePublisherPlugin,
    PluginTypes
  };
}

module.exports = {
  PluginManager,
  BasePlugin,
  DataSourcePlugin,
  TransformerPlugin,
  PublisherPlugin,
  PluginTypes,
  createExamplePlugins
};
