/**
 * 代理配置模块
 * 
 * 支持配置 HTTP/HTTPS 代理来解决网络问题
 * 使用方式：在 .env 文件中配置 HTTP_PROXY 和 HTTPS_PROXY
 */

const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');

/**
 * 获取代理配置
 */
function getProxyConfig() {
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy || '';
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
  
  return {
    http: httpProxy,
    https: httpsProxy,
    enabled: !!(httpProxy || httpsProxy),
  };
}

/**
 * 创建代理 Agent
 */
function createProxyAgent(protocol = 'https') {
  const config = getProxyConfig();
  
  if (!config.enabled) {
    return undefined;
  }
  
  const proxyUrl = protocol === 'https' 
    ? (config.https || config.http)
    : config.http;
  
  if (!proxyUrl) {
    return undefined;
  }
  
  console.log(`[Proxy] 使用代理: ${proxyUrl}`);
  
  if (protocol === 'https') {
    return new HttpsProxyAgent(proxyUrl);
  } else {
    return new HttpProxyAgent(proxyUrl);
  }
}

/**
 * 获取 axios 代理配置
 */
function getAxiosProxyConfig() {
  const config = getProxyConfig();
  
  if (!config.enabled) {
    return {};
  }
  
  return {
    proxy: false, // 禁用 axios 内置代理，使用 agent
    httpAgent: createProxyAgent('http'),
    httpsAgent: createProxyAgent('https'),
  };
}

/**
 * 测试代理连接
 */
async function testProxyConnection() {
  const axios = require('axios');
  const config = getProxyConfig();
  
  console.log('\n🔍 代理配置检测');
  console.log('─'.repeat(40));
  
  if (!config.enabled) {
    console.log('❌ 未配置代理');
    console.log('\n配置方法:');
    console.log('在 .env 文件中添加:');
    console.log('  HTTP_PROXY=http://127.0.0.1:7890');
    console.log('  HTTPS_PROXY=http://127.0.0.1:7890');
    return false;
  }
  
  console.log('✅ 代理已配置');
  console.log(`   HTTP:  ${config.http || '(未配置)'}`);
  console.log(`   HTTPS: ${config.https || '(未配置)'}`);
  
  // 测试连接
  console.log('\n测试代理连接...');
  
  const testUrls = [
    { name: 'Google', url: 'https://www.google.com', timeout: 10000 },
    { name: '红酒世界', url: 'https://www.wine-world.com', timeout: 10000 },
  ];
  
  const proxyConfig = getAxiosProxyConfig();
  let success = 0;
  
  for (const test of testUrls) {
    try {
      const start = Date.now();
      const response = await axios.get(test.url, {
        ...proxyConfig,
        timeout: test.timeout,
        validateStatus: () => true, // 接受任何状态码
      });
      console.log(`  ✅ ${test.name}: ${response.status} (${Date.now() - start}ms)`);
      success++;
    } catch (err) {
      console.log(`  ❌ ${test.name}: ${err.message}`);
    }
  }
  
  if (success > 0) {
    console.log('\n✅ 代理工作正常！');
    return true;
  } else {
    console.log('\n❌ 代理连接失败，请检查代理设置');
    return false;
  }
}

module.exports = {
  getProxyConfig,
  createProxyAgent,
  getAxiosProxyConfig,
  testProxyConnection,
};
