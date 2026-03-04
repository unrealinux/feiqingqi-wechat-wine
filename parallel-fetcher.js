/**
 * 并行采集优化模块
 * 提供并发控制、批处理、缓存等功能
 */

const { withRetry } = require('./errors');

class ParallelFetcher {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5; // 最大并发数
    this.timeout = options.timeout || 15000; // 请求超时
    this.retries = options.retries || 2; // 重试次数
    this.cache = options.cache || null; // 缓存实例
    this.cacheTTL = options.cacheTTL || 3600000; // 缓存时间 1小时
    this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    this.headers = {
      'User-Agent': this.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    };
  }

  /**
   * 并行获取多个URL
   * @param {Array<string>} urls - URL列表
   * @param {Function} fetcher - 获取函数
   * @param {Object} options - 选项
   * @returns {Promise<Array>} 结果数组
   */
  async fetchAll(urls, fetcher, options = {}) {
    const concurrency = options.concurrency || this.concurrency;
    const results = [];
    const errors = [];
    
    // 分批处理
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (url) => {
          // 检查缓存
          const cacheKey = this.getCacheKey(url, options.cachePrefix);
          if (this.cache && options.useCache !== false) {
            const cached = await this.cache.get(cacheKey);
            if (cached) {
              return { url, data: cached, cached: true };
            }
          }
          
          // 执行请求
          try {
            const data = await withRetry(
              () => fetcher(url),
              { maxRetries: this.retries, retryDelay: 1000 }
            );
            
            // 缓存结果
            if (this.cache && options.useCache !== false) {
              await this.cache.set(cacheKey, data, { ttl: this.cacheTTL });
            }
            
            return { url, data, cached: false };
          } catch (error) {
            throw { url, error };
          }
        })
      );
      
      // 收集结果
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          errors.push(result.reason);
        }
      });
      
      // 批次间隔（避免过载）
      if (i + concurrency < urls.length && options.batchDelay) {
        await this.delay(options.batchDelay);
      }
    }
    
    return { results, errors };
  }

  /**
   * 批量获取RSS源
   * @param {Array<string>} feedUrls - RSS源列表
   * @param {Object} parser - RSS解析器
   * @returns {Promise<Object>}
   */
  async fetchRSSFeeds(feedUrls, parser) {
    console.log(`[ParallelFetcher] 开始并行获取 ${feedUrls.length} 个RSS源...`);
    const startTime = Date.now();
    
    const { results, errors } = await this.fetchAll(
      feedUrls,
      async (url) => {
        console.log(`[ParallelFetcher] 获取: ${url}`);
        return parser.parseURL(url);
      },
      { concurrency: 3, batchDelay: 500 } // RSS源并发限制较低
    );
    
    const duration = Date.now() - startTime;
    console.log(`[ParallelFetcher] RSS获取完成: ${results.length} 成功, ${errors.length} 失败, 耗时 ${duration}ms`);
    
    // 记录错误
    errors.forEach(err => {
      if (err?.url) {
        console.warn(`[ParallelFetcher] 失败: ${err.url} - ${err.error?.message || '未知错误'}`);
      }
    });
    
    return { results, errors };
  }

  /**
   * 批量获取网页内容
   * @param {Array<string>} urls - URL列表
   * @param {Object} axios - Axios实例
   * @returns {Promise<Object>}
   */
  async fetchWebPages(urls, axios) {
    console.log(`[ParallelFetcher] 开始并行获取 ${urls.length} 个网页...`);
    const startTime = Date.now();
    
    const { results, errors } = await this.fetchAll(
      urls,
      async (url) => {
        const response = await axios.get(url, {
          timeout: this.timeout,
          headers: this.headers,
        });
        return response.data;
      },
      { concurrency: 5, batchDelay: 200 }
    );
    
    const duration = Date.now() - startTime;
    console.log(`[ParallelFetcher] 网页获取完成: ${results.length} 成功, ${errors.length} 失败, 耗时 ${duration}ms`);
    
    return { results, errors };
  }

  /**
   * 批量执行API请求
   * @param {Array<Function>} apiCallers - API调用函数列表
   * @returns {Promise<Object>}
   */
  async fetchAPIs(apiCallers) {
    console.log(`[ParallelFetcher] 开始并行调用 ${apiCallers.length} 个API...`);
    const startTime = Date.now();
    
    const results = await Promise.allSettled(
      apiCallers.map(caller => caller())
    );
    
    const successResults = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    
    const errorResults = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason);
    
    const duration = Date.now() - startTime;
    console.log(`[ParallelFetcher] API调用完成: ${successResults.length} 成功, ${errorResults.length} 失败, 耗时 ${duration}ms`);
    
    return { results: successResults, errors: errorResults };
  }

  /**
   * 带限流的并行获取
   * @param {Array} items - 项目列表
   * @param {Function} processor - 处理函数
   * @param {Object} options - 选项
   */
  async processWithRateLimit(items, processor, options = {}) {
    const {
      requestsPerSecond = 5,
      maxConcurrent = 10,
      onProgress = null,
    } = options;

    const results = [];
    const errors = [];
    let requestCount = 0;
    const startTime = Date.now();
    
    // 限流控制
    const interval = 1000 / requestsPerSecond;
    const queue = [...items];
    const running = new Set();
    
    while (queue.length > 0 || running.size > 0) {
      // 填充并发队列
      while (queue.length > 0 && running.size < maxConcurrent) {
        const item = queue.shift();
        const task = processor(item)
          .then(result => {
            results.push({ item, result });
            running.delete(task);
          })
          .catch(error => {
            errors.push({ item, error });
            running.delete(task);
          });
        
        running.add(task);
        
        // 限流
        await this.delay(interval);
      }
      
      // 等待任意任务完成
      if (running.size > 0) {
        await Promise.race(Array.from(running));
      }
      
      // 进度回调
      requestCount++;
      if (onProgress && requestCount % 10 === 0) {
        onProgress({
          processed: results.length + errors.length,
          total: items.length,
          success: results.length,
          failed: errors.length,
        });
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`[ParallelFetcher] 限流处理完成: ${results.length} 成功, ${errors.length} 失败, 耗时 ${duration}ms`);
    
    return { results, errors };
  }

  /**
   * 获取缓存键
   */
  getCacheKey(url, prefix = '') {
    const hash = require('crypto')
      .createHash('md5')
      .update(url)
      .digest('hex')
      .substring(0, 16);
    return prefix ? `${prefix}:${hash}` : `fetch:${hash}`;
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ParallelFetcher;