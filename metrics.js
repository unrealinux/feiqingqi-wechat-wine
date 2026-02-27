/**
 * Prometheus 指标导出
 * 支持自定义指标和 HTTP 端点
 */

// 简单的 Prometheus 指标实现（无需额外依赖）
class Counter {
  constructor(name, help, labels = []) {
    this.name = name;
    this.help = help;
    this.labels = labels;
    this.values = new Map();
  }

  inc(labels = {}, value = 1) {
    const key = this.getKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  getKey(labels) {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }

  getValue(labels = {}) {
    const key = this.getKey(labels);
    return this.values.get(key) || 0;
  }

  toString() {
    let output = `# HELP ${this.help}\n# TYPE ${this.name} counter\n`;
    for (const [labels, value] of this.values) {
      output += `${this.name}{${labels}} ${value}\n`;
    }
    return output;
  }
}

class Gauge {
  constructor(name, help, labels = []) {
    this.name = name;
    this.help = help;
    this.labels = labels;
    this.values = new Map();
  }

  set(labels = {}, value) {
    const key = this.getKey(labels);
    this.values.set(key, value);
  }

  inc(labels = {}, value = 1) {
    const key = this.getKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  dec(labels = {}, value = 1) {
    const key = this.getKey(labels);
    this.values.set(key, (this.values.get(key) || 0) - value);
  }

  getKey(labels) {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }

  toString() {
    let output = `# HELP ${this.help}\n# TYPE ${this.name} gauge\n`;
    for (const [labels, value] of this.values) {
      output += `${this.name}{${labels}} ${value}\n`;
    }
    return output;
  }
}

class Histogram {
  constructor(name, help, buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]) {
    this.name = name;
    this.help = help;
    this.buckets = buckets;
    this.values = new Map();
  }

  observe(labels = {}, value) {
    const key = this.getKey(labels);
    if (!this.values.has(key)) {
      this.values.set(key, {
        buckets: this.buckets.map(b => ({ le: b, count: 0 })),
        sum: 0,
        count: 0
      });
    }
    
    const data = this.values.get(key);
    data.sum += value;
    data.count++;
    
    for (const bucket of data.buckets) {
      if (value <= bucket.le) {
        bucket.count++;
      }
    }
  }

  getKey(labels) {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }

  toString() {
    let output = `# HELP ${this.help}\n# TYPE ${this.name} histogram\n`;
    
    for (const [labels, data] of this.values) {
      for (const bucket of data.buckets) {
        output += `${this.name}_bucket{${labels},le="${bucket.le}"} ${bucket.count}\n`;
      }
      output += `${this.name}_sum{${labels}} ${data.sum}\n`;
      output += `${this.name}_count{${labels}} ${data.count}\n`;
    }
    return output;
  }
}

class Summary {
  constructor(name, help, percentiles = [0.5, 0.9, 0.95, 0.99]) {
    this.name = name;
    this.help = help;
    this.percentiles = percentiles;
    this.values = new Map();
  }

  observe(labels = {}, value) {
    const key = this.getKey(labels);
    if (!this.values.has(key)) {
      this.values.set(key, {
        values: [],
        sum: 0,
        count: 0
      });
    }
    
    const data = this.values.get(key);
    data.values.push(value);
    data.sum += value;
    data.count++;
  }

  getKey(labels) {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }

  toString() {
    let output = `# HELP ${this.help}\n# TYPE ${this.name} summary\n`;
    
    for (const [labels, data] of this.values) {
      const sorted = data.values.sort((a, b) => a - b);
      
      for (const p of this.percentiles) {
        const idx = Math.ceil(sorted.length * p) - 1;
        const value = sorted[Math.max(0, idx)];
        output += `${this.name}{${labels},quantile="${p}"} ${value || 0}\n`;
      }
      
      output += `${this.name}_sum{${labels}} ${data.sum}\n`;
      output += `${this.name}_count{${labels}} ${data.count}\n`;
    }
    return output;
  }
}

/**
 * 指标注册表
 */
class Registry {
  constructor() {
    this.metrics = new Map();
  }

  getOrCreate(name, type, help, options = {}) {
    if (this.metrics.has(name)) {
      return this.metrics.get(name);
    }

    let metric;
    switch (type) {
      case 'counter':
        metric = new Counter(name, help, options.labels);
        break;
      case 'gauge':
        metric = new Gauge(name, help, options.labels);
        break;
      case 'histogram':
        metric = new Histogram(name, help, options.buckets);
        break;
      case 'summary':
        metric = new Summary(name, help, options.percentiles);
        break;
      default:
        throw new Error(`Unknown metric type: ${type}`);
    }

    this.metrics.set(name, metric);
    return metric;
  }

  counter(name, help, labels = []) {
    return this.getOrCreate(name, 'counter', help, { labels });
  }

  gauge(name, help, labels = []) {
    return this.getOrCreate(name, 'gauge', help, { labels });
  }

  histogram(name, help, buckets) {
    return this.getOrCreate(name, 'histogram', help, { buckets });
  }

  summary(name, help, percentiles) {
    return this.getOrCreate(name, 'summary', help, { percentiles });
  }

  /**
   * 导出所有指标
   */
  metrics() {
    let output = '';
    for (const metric of this.metrics.values()) {
      output += metric.toString() + '\n';
    }
    return output;
  }

  /**
   * 创建 HTTP 端点处理函数
   */
  middleware() {
    return (req, res) => {
      res.set('Content-Type', 'text/plain; version=0.0.4');
      res.send(this.metrics());
    };
  }
}

// 全局默认注册表
const defaultRegistry = new Registry();

/**
 * 预设指标
 */
function createSystemMetrics(registry = defaultRegistry) {
  // 进程指标
  const processUptime = registry.gauge('process_uptime_seconds', 'Process uptime in seconds');
  const processMemory = registry.gauge('process_memory_bytes', 'Process memory usage in bytes');
  const processCpu = registry.gauge('process_cpu_percent', 'Process CPU usage percentage');

  // 业务指标
  const articlesCrawled = registry.counter('articles_crawled_total', 'Total number of articles crawled', ['source']);
  const articlesPublished = registry.counter('articles_published_total', 'Total number of articles published');
  const requestsTotal = registry.counter('http_requests_total', 'Total HTTP requests', ['method', 'status']);
  const requestDuration = registry.histogram('http_request_duration_seconds', 'HTTP request duration in seconds');

  // 缓存指标
  const cacheHits = registry.counter('cache_hits_total', 'Total cache hits');
  const cacheMisses = registry.counter('cache_misses_total', 'Total cache misses');

  // 更新系统指标
  const startTime = Date.now();
  
  setInterval(() => {
    const mem = process.memoryUsage();
    processUptime.set({}, (Date.now() - startTime) / 1000);
    processMemory.set({ type: 'heap' }, mem.heapUsed);
    processMemory.set({ type: 'rss' }, mem.rss);
  }, 10000);

  return {
    processUptime,
    processMemory,
    processCpu,
    articlesCrawled,
    articlesPublished,
    requestsTotal,
    requestDuration,
    cacheHits,
    cacheMisses
  };
}

module.exports = {
  Counter,
  Gauge,
  Histogram,
  Summary,
  Registry,
  defaultRegistry,
  createSystemMetrics
};
