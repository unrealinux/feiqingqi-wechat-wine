/**
 * 配置验证模块
 * 验证环境变量和配置的合法性
 */

const requiredFields = {
  generate: ['provider', 'apiKey'],
  publish: ['appId', 'appSecret']
};

const optionalFields = {
  generate: ['model', 'baseUrl', 'endpoints'],
  publish: ['endpoints', 'testMode', 'autoPublish'],
  crawl: ['rssSources', 'backupWebsites', 'keywords'],
  redis: ['host', 'port'],
  database: ['host', 'user', 'password', 'database']
};

/**
 * 验证必填字段
 */
function validateRequired(config) {
  const errors = [];
  
  // 检查 generate 必填
  if (!config.generate?.provider) {
    errors.push('LLM_PROVIDER is required');
  }
  if (!config.generate?.apiKey || config.generate.apiKey.startsWith('your_')) {
    errors.push('LLM_API_KEY is required');
  }
  
  // 检查 publish 必填
  if (!config.publish?.appId || config.publish.appId.startsWith('your_')) {
    errors.push('WECHAT_APPID is required');
  }
  if (!config.publish?.appSecret || config.publish.appSecret.startsWith('your_')) {
    errors.push('WECHAT_SECRET is required');
  }
  
  return errors;
}

/**
 * 验证URL格式
 */
function validateUrls(config) {
  const errors = [];
  
  // 验证 RSS 源
  const rssSources = config.crawl?.rssSources || [];
  rssSources.forEach((url, index) => {
    try {
      new URL(url);
    } catch {
      errors.push(`RSS源 #${index + 1} 格式无效: ${url}`);
    }
  });
  
  // 验证备用网站
  const backupWebsites = config.crawl?.backupWebsites || [];
  backupWebsites.forEach((site, index) => {
    try {
      new URL(site.url);
    } catch {
      errors.push(`备用网站 #${index + 1} URL格式无效: ${site.url}`);
    }
  });
  
  return errors;
}

/**
 * 验证数值范围
 */
function validateRanges(config) {
  const errors = [];
  
  // 超时设置
  if (config.crawl?.timeout && config.crawl.timeout < 1000) {
    errors.push('crawl.timeout 最小值为 1000ms');
  }
  
  // 并发数
  if (config.crawl?.maxConcurrent && config.crawl.maxConcurrent > 20) {
    errors.push('crawl.maxConcurrent 建议不超过 20');
  }
  
  // 速率限制
  const rateLimit = config.crawl?.rateLimit || {};
  if (rateLimit.maxRequests && rateLimit.maxRequests > 100) {
    errors.push('rateLimit.maxRequests 建议不超过 100');
  }
  
  return errors;
}

/**
 * 主验证函数
 */
function validateConfig(config) {
  const errors = [
    ...validateRequired(config),
    ...validateUrls(config),
    ...validateRanges(config)
  ];
  
  const warnings = [];
  
  // 警告检查
  if (config.publish?.testMode === false && !config.publish?.autoPublish) {
    warnings.push('testMode关闭时，建议开启autoPublish');
  }
  
  if (!config.redis?.host && config.crawl?.rssSources?.length > 0) {
    warnings.push('未配置Redis，可能会影响缓存效率');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: errors.length === 0 ? '配置验证通过' : `发现 ${errors.length} 个错误`
  };
}

/**
 * CLI验证脚本
 */
function runValidation() {
  require('dotenv').config();
  const config = require('./config');
  
  console.log('='.repeat(50));
  console.log('配置验证');
  console.log('='.repeat(50));
  
  const result = validateConfig(config);
  
  if (result.valid) {
    console.log('✅', result.summary);
  } else {
    console.log('❌', result.summary);
    console.log('\n错误:');
    result.errors.forEach(err => console.log('  -', err));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n警告:');
    result.warnings.forEach(w => console.log('  -', w));
  }
  
  process.exit(result.valid ? 0 : 1);
}

// 如果直接运行
if (require.main === module) {
  runValidation();
}

module.exports = {
  validateConfig,
  validateRequired,
  validateUrls,
  validateRanges
};
