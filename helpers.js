/**
 * 工具函数模块
 * 常用的辅助函数集合
 */

const crypto = require('crypto');
const { URL } = require('url');

/**
 * 生成字符串哈希
 */
function hash(str, algorithm = 'md5') {
  return crypto.createHash(algorithm).update(str).digest('hex');
}

/**
 * 规范化URL
 */
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // 移除常见的跟踪参数
    u.searchParams.delete('utm_source');
    u.searchParams.delete('utm_medium');
    u.searchParams.delete('utm_campaign');
    u.searchParams.delete('ref');
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * 提取域名
 */
function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * 清理文本
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

/**
 * 提取摘要
 */
function extractSummary(content, maxLength = 200) {
  if (!content) return '';
  
  // 移除HTML标签
  const plain = content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  
  // 清理空白
  const cleaned = cleanText(plain);
  
  // 截断
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * 检查是否为有效URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      
      if (attempt < maxAttempts) {
        const delayTime = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        );
        await delay(delayTime);
      }
    }
  }
  
  throw lastError;
}

/**
 * 防抖函数
 */
function debounce(fn, ms) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * 节流函数
 */
function throttle(fn, ms) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= ms) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 随机选择
 */
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 分组函数
 */
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (acc[group] = acc[group] || []).push(item);
    return acc;
  }, {});
}

/**
 * 唯一值
 */
function unique(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 格式化时间差
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

module.exports = {
  hash,
  normalizeUrl,
  extractDomain,
  cleanText,
  extractSummary,
  isValidUrl,
  delay,
  retryWithBackoff,
  debounce,
  throttle,
  randomChoice,
  groupBy,
  unique,
  formatBytes,
  formatDuration
};
