/**
 * config.js 测试
 *
 * 根 config.js 已精简为仅供引擎的 publish 段。这里守住两件事：
 *   1. endpoints 的键名与 engine/wechat.js 的 API 常量一致
 *      —— 旧配置用了 draft/material 等键名，导致 WECHAT_DRAFT_URL 覆盖长期失效；
 *   2. 环境变量能正确覆盖默认端点，且 appId/appSecret 取自 WECHAT_*。
 */

const KEYS = [
  'WECHAT_APPID',
  'WECHAT_SECRET',
  'WECHAT_TOKEN_URL',
  'WECHAT_DRAFT_URL',
  'WECHAT_UPLOAD_URL'
];

let saved;

beforeEach(() => {
  saved = {};
  for (const k of KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  jest.resetModules();
});

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = saved[k];
    }
  }
});

/** 重新加载 config（避免模块缓存） */
const loadConfig = () => {
  jest.resetModules();
  return require('../config');
};

describe('config.publish.endpoints', () => {
  test('键名与 engine/wechat.js 的 API 常量一致', () => {
    const { endpoints } = loadConfig().publish;
    expect(Object.keys(endpoints).sort()).toEqual(
      ['addDraft', 'addMaterial', 'getDraftCount', 'token', 'uploadImg'].sort()
    );
  });

  test('默认指向微信官方地址', () => {
    const { endpoints } = loadConfig().publish;
    expect(endpoints.token).toBe('https://api.weixin.qq.com/cgi-bin/token');
    expect(endpoints.addDraft).toBe('https://api.weixin.qq.com/cgi-bin/draft/add');
    expect(endpoints.addMaterial).toBe('https://api.weixin.qq.com/cgi-bin/material/add_material');
    expect(endpoints.uploadImg).toBe('https://api.weixin.qq.com/cgi-bin/media/uploadimg');
    expect(endpoints.getDraftCount).toBe('https://api.weixin.qq.com/cgi-bin/draft/count');
  });

  test('WECHAT_TOKEN_URL / WECHAT_DRAFT_URL 能覆盖默认端点', () => {
    process.env.WECHAT_TOKEN_URL = 'https://proxy.example.com/token';
    process.env.WECHAT_DRAFT_URL = 'https://proxy.example.com/draft';
    const { endpoints } = loadConfig().publish;
    expect(endpoints.token).toBe('https://proxy.example.com/token');
    expect(endpoints.addDraft).toBe('https://proxy.example.com/draft');
  });

  test('WECHAT_UPLOAD_URL 覆盖 uploadImg（引擎图片上传端点）', () => {
    process.env.WECHAT_UPLOAD_URL = 'https://proxy.example.com/upload';
    expect(loadConfig().publish.endpoints.uploadImg).toBe('https://proxy.example.com/upload');
  });

  test('appId / appSecret 取自 WECHAT_* 环境变量', () => {
    process.env.WECHAT_APPID = 'wx-from-test';
    process.env.WECHAT_SECRET = 'secret-from-test';
    const { publish } = loadConfig();
    expect(publish.appId).toBe('wx-from-test');
    expect(publish.appSecret).toBe('secret-from-test');
  });

  test('不再包含第一代配置段（已内聚到 archive/first-gen/config.js）', () => {
    const cfg = loadConfig();
    for (const legacy of ['crawl', 'generate', 'aggregate', 'redis', 'database', 'cache', 'performance']) {
      expect(cfg).not.toHaveProperty(legacy);
    }
  });
});
