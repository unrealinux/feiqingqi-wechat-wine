/**
 * validate-config.js 测试
 *
 * 此前 0% 覆盖，但它是发布/生成前的配置闸门：判断错误会直接导致线上失败。
 * 三个子验证器均为纯函数，适合逐条断言。
 */

const {
  validateConfig,
  validateRequired,
  validateUrls,
  validateRanges
} = require('../validate-config');

/** 一个通过全部校验的基准配置 */
function validConfig(overrides = {}) {
  return {
    generate: { provider: 'openai', apiKey: 'sk-real-key' },
    publish: { appId: 'wx123456', appSecret: 'realsecret', autoPublish: true },
    crawl: {
      rssSources: ['https://example.com/rss'],
      backupWebsites: [{ url: 'https://example.com' }],
      timeout: 5000,
      maxConcurrent: 5,
      rateLimit: { maxRequests: 50 }
    },
    redis: { host: 'localhost' },
    ...overrides
  };
}

describe('validateRequired', () => {
  test('配置齐备时无错误', () => {
    expect(validateRequired(validConfig())).toEqual([]);
  });

  test('缺少 provider / apiKey 时各自报错', () => {
    const errors = validateRequired({ generate: {}, publish: { appId: 'a', appSecret: 'b' } });
    expect(errors).toEqual(
      expect.arrayContaining(['LLM_PROVIDER is required', 'LLM_API_KEY is required'])
    );
  });

  test('占位符（your_ 前缀）视为未配置', () => {
    const errors = validateRequired({
      generate: { provider: 'openai', apiKey: 'your_api_key' },
      publish: { appId: 'your_appid', appSecret: 'your_secret' }
    });
    expect(errors).toEqual(
      expect.arrayContaining(['LLM_API_KEY is required', 'WECHAT_APPID is required', 'WECHAT_SECRET is required'])
    );
  });

  test('config 为空对象时不应抛错（可选链保护）', () => {
    expect(() => validateRequired({})).not.toThrow();
    expect(validateRequired({}).length).toBeGreaterThan(0);
  });
});

describe('validateUrls', () => {
  test('合法 URL 无错误', () => {
    expect(validateUrls(validConfig())).toEqual([]);
  });

  test('非法 RSS 源与备用网站均被指出（含序号）', () => {
    const errors = validateUrls({
      crawl: {
        rssSources: ['not-a-url'],
        backupWebsites: [{ url: 'also-bad' }]
      }
    });
    expect(errors).toEqual([
      'RSS源 #1 格式无效: not-a-url',
      '备用网站 #1 URL格式无效: also-bad'
    ]);
  });

  test('crawl 缺失时视为空列表，不报错', () => {
    expect(validateUrls({})).toEqual([]);
  });
});

describe('validateRanges', () => {
  test('合法范围无错误', () => {
    expect(validateRanges(validConfig())).toEqual([]);
  });

  test('timeout 过小 / 并发过高 / 限流过大均被指出', () => {
    const errors = validateRanges({
      crawl: { timeout: 500, maxConcurrent: 50, rateLimit: { maxRequests: 500 } }
    });
    expect(errors).toEqual([
      'crawl.timeout 最小值为 1000ms',
      'crawl.maxConcurrent 建议不超过 20',
      'rateLimit.maxRequests 建议不超过 100'
    ]);
  });

  test('边界值（恰好等于阈值）不应报错', () => {
    const errors = validateRanges({
      crawl: { timeout: 1000, maxConcurrent: 20, rateLimit: { maxRequests: 100 } }
    });
    expect(errors).toEqual([]);
  });
});

describe('validateConfig', () => {
  test('合法配置判定通过', () => {
    const r = validateConfig(validConfig());
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
    expect(r.summary).toBe('配置验证通过');
  });

  test('存在错误时 valid=false 且汇总数量正确', () => {
    const r = validateConfig({ generate: {}, publish: {} });
    expect(r.valid).toBe(false);
    expect(r.summary).toBe(`发现 ${r.errors.length} 个错误`);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  test('testMode 关闭且未开 autoPublish 时给出警告', () => {
    const r = validateConfig(validConfig({
      publish: { appId: 'wx', appSecret: 's', testMode: false, autoPublish: false }
    }));
    expect(r.warnings).toContain('testMode关闭时，建议开启autoPublish');
  });

  test('有 RSS 源但未配置 Redis 时给出缓存警告', () => {
    const r = validateConfig(validConfig({ redis: {} }));
    expect(r.warnings).toContain('未配置Redis，可能会影响缓存效率');
  });

  test('警告不影响 valid 判定', () => {
    const r = validateConfig(validConfig({ redis: {} }));
    expect(r.valid).toBe(true);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
