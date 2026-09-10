/**
 * 微信发布前置自检测试
 *
 * 只测纯函数（IP 解析、渲染、错误码翻译），不发任何网络请求。
 */

const {
  mask,
  extractReportedIp,
  renderReport,
  IPV4_RE,
  HINTS
} = require('../tools/check-wechat-ip');
const { describeApiError, ERROR_HINTS } = require('../engine/wechat');

describe('mask', () => {
  test('should not leak the full secret', () => {
    const masked = mask('a7d00f777ea5123456789');
    expect(masked).not.toContain('123456789');
    expect(masked.endsWith('…')).toBe(true);
  });

  test('should handle short and missing values', () => {
    expect(mask('')).toBe('(未配置)');
    expect(mask(null)).toBe('(未配置)');
    expect(mask('abc')).toBe('abc…');
  });
});

describe('extractReportedIp', () => {
  test('should parse the IP from a real 40164 message', () => {
    // 微信真实返回格式
    const errmsg =
      'invalid ip 120.208.99.249 ipv6 ::ffff:120.208.99.249, not in whitelist rid: 6aa2f516-18f315ad-4be915b8';
    expect(extractReportedIp(errmsg)).toEqual({ ip: '120.208.99.249', family: 4 });
  });

  test('should ignore the ipv6 form and return the ipv4 form', () => {
    const errmsg = 'invalid ip 1.2.3.4 ipv6 ::ffff:1.2.3.4, not in whitelist';
    expect(extractReportedIp(errmsg).ip).toBe('1.2.3.4');
  });

  test('should return null when the message does not report an IP', () => {
    expect(extractReportedIp('invalid credential')).toBeNull();
    expect(extractReportedIp('')).toBeNull();
    expect(extractReportedIp(null)).toBeNull();
  });

  test('IPV4_RE should accept IPv4 and reject IPv6 / junk', () => {
    expect(IPV4_RE.test('120.208.99.249')).toBe(true);
    expect(IPV4_RE.test('2409:8a0c:76:b794:b862:a35c:d558:717')).toBe(false);
    expect(IPV4_RE.test('not-an-ip')).toBe(false);
  });
});

describe('renderReport', () => {
  const base = {
    appId: 'wx1e5b38ae39297ce6',
    appSecretConfigured: true,
    proxy: { enabled: false },
    ip: null,
    ipProvider: null,
    reportedIp: null,
    ipSkipped: false,
    errcode: null,
    errmsg: null,
    networkError: null,
    expiresIn: 7200,
    verdict: 'ok'
  };

  test('should report success', () => {
    const text = renderReport(base);
    expect(text).toContain('✅ 可以发布');
    expect(text).toContain('access_token');
    expect(text).toContain('已配置');
  });

  test('should prefer the WeChat-reported IP over the locally detected one', () => {
    // 本机探测到 IPv6，而微信看到的是 IPv4 —— 必须以微信为准
    const text = renderReport({
      ...base,
      verdict: 'blocked',
      errcode: 40164,
      errmsg: 'invalid ip 120.208.99.249 ipv6 ::ffff:120.208.99.249, not in whitelist',
      reportedIp: '120.208.99.249',
      ip: '2409:8a0c:76:b794::1',
      ipProvider: 'icanhazip'
    });

    expect(text).toContain('120.208.99.249');
    expect(text).toContain('白名单要加这个');
    // 修复步骤里必须是微信看到的那个 IP
    expect(text).toMatch(/添加：120\.208\.99\.249/);
    expect(text).not.toMatch(/添加：2409:/);
  });

  test('should give whitelist steps for 40164', () => {
    const text = renderReport({
      ...base,
      verdict: 'blocked',
      errcode: 40164,
      errmsg: 'invalid ip',
      ip: '1.2.3.4'
    });
    expect(text).toContain('⛔ 无法发布');
    expect(text).toContain('IP白名单');
    expect(text).toContain('添加：1.2.3.4');
  });

  test('should give credential steps when secrets are missing', () => {
    const text = renderReport({ ...base, verdict: 'credentials', appId: '', appSecretConfigured: false });
    expect(text).toContain('缺少 WECHAT_APPID');
    expect(text).toContain('.env.example');
  });

  test('should surface network failures', () => {
    const text = renderReport({ ...base, verdict: 'blocked', networkError: 'ETIMEDOUT' });
    expect(text).toContain('ETIMEDOUT');
    expect(text).toContain('api.weixin.qq.com');
  });

  test('should mention the proxy when one is configured', () => {
    const text = renderReport({
      ...base,
      verdict: 'blocked',
      errcode: 40164,
      ip: '1.2.3.4',
      proxy: { enabled: true, https: 'http://127.0.0.1:7890' }
    });
    expect(text).toContain('已启用');
    expect(text).toContain('代理的出口 IP');
  });

  test('报告本身绝不能包含任何明文凭据', () => {
    // 结果对象刻意不携带 secret，只带「是否已配置」的布尔值，
    // 防止 --json 输出被写入日志或 CI 产物
    const text = renderReport({ ...base, ip: '1.2.3.4' });
    expect(text).not.toMatch(/[0-9a-f]{32}/); // 32 位十六进制 = 疑似 appsecret
    expect(Object.keys(base)).not.toContain('appSecret');
  });
});

describe('describeApiError', () => {
  test('should include the errcode and errmsg', () => {
    const msg = describeApiError({ errcode: 40125, errmsg: 'invalid appsecret' }, '获取 access_token');
    expect(msg).toContain('获取 access_token失败');
    expect(msg).toContain('[40125]');
    expect(msg).toContain('invalid appsecret');
  });

  test('should append an actionable hint for known codes', () => {
    const msg = describeApiError({ errcode: 40164, errmsg: 'invalid ip' });
    expect(msg).toContain('IP 白名单');
    expect(msg).toContain('npm run wechat:check');
  });

  test('should not invent a hint for unknown codes', () => {
    const msg = describeApiError({ errcode: 99999, errmsg: 'mystery' });
    expect(msg).toContain('[99999]');
    expect(msg).not.toContain('可能原因');
  });

  test('hints should cover the codes the publisher actually relies on', () => {
    [40001, 40013, 40125, 40164, 45009, 48001, 40007, 40005].forEach((code) => {
      expect(typeof ERROR_HINTS[code]).toBe('string');
      expect(ERROR_HINTS[code].length).toBeGreaterThan(10);
    });
  });
});

describe('HINTS consistency', () => {
  test('the standalone checker should hint 40164 as a whitelist problem', () => {
    expect(HINTS[40164]).toContain('IP 白名单');
  });
});
