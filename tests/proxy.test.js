/**
 * proxy.js 测试
 *
 * 代理配置会直接影响爬虫/发布能否连通，且实现里做了大小写环境变量兜底。
 * 测试须显式清空真实环境变量，避免跑测机器自身的代理设置污染结果。
 */

const { getProxyConfig, createProxyAgent, getAxiosProxyConfig } = require('../proxy');

const ENV_KEYS = ['HTTP_PROXY', 'http_proxy', 'HTTPS_PROXY', 'https_proxy'];
let saved;

beforeEach(() => {
  saved = {};
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  // createProxyAgent 会打印代理地址，测试中静音
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = saved[k];
    }
  }
  jest.restoreAllMocks();
});

describe('getProxyConfig', () => {
  test('未配置任何环境变量时 disabled', () => {
    expect(getProxyConfig()).toEqual({ http: '', https: '', enabled: false });
  });

  test('配置大写 HTTP_PROXY 即视为启用', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
    const cfg = getProxyConfig();
    expect(cfg.enabled).toBe(true);
    expect(cfg.http).toBe('http://127.0.0.1:7890');
  });

  test('小写 http_proxy 亦被识别（兜底）', () => {
    process.env.http_proxy = 'http://127.0.0.1:8080';
    expect(getProxyConfig().enabled).toBe(true);
    expect(getProxyConfig().http).toBe('http://127.0.0.1:8080');
  });

  test('仅 HTTPS_PROXY 也能启用', () => {
    process.env.HTTPS_PROXY = 'http://127.0.0.1:7891';
    const cfg = getProxyConfig();
    expect(cfg.enabled).toBe(true);
    expect(cfg.https).toBe('http://127.0.0.1:7891');
  });
});

describe('createProxyAgent', () => {
  test('未启用时返回 undefined', () => {
    expect(createProxyAgent('https')).toBeUndefined();
    expect(createProxyAgent('http')).toBeUndefined();
  });

  test('启用后返回对应协议的 Agent 实例', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
    process.env.HTTPS_PROXY = 'http://127.0.0.1:7891';
    expect(createProxyAgent('https')).toBeDefined();
    expect(createProxyAgent('http')).toBeDefined();
  });

  test('https 缺省时回退到 http 代理', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
    expect(createProxyAgent('https')).toBeDefined();
  });
});

describe('getAxiosProxyConfig', () => {
  test('未启用时返回空对象', () => {
    expect(getAxiosProxyConfig()).toEqual({});
  });

  test('启用时禁用内置代理并挂载两个 Agent', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
    const cfg = getAxiosProxyConfig();
    expect(cfg.proxy).toBe(false);
    expect(cfg.httpAgent).toBeDefined();
    expect(cfg.httpsAgent).toBeDefined();
  });
});
