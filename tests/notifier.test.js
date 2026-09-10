/**
 * 统一通知器测试
 *
 * 不发真实请求：只验证渠道判定、正文构建与 HTML 转义。
 */

const { Notifier, escapeHtml, LEVEL_ICON } = require('../tools/notifier');

describe('Notifier 渠道判定', () => {
  test('未配置任何渠道时应为 disabled', () => {
    const n = new Notifier({ env: {} });
    expect(n.enabled).toBe(false);
    expect(n.channels).toEqual([]);
  });

  test('仅配置 webhook', () => {
    const n = new Notifier({ env: { NOTIFY_WEBHOOK_URL: 'https://example.com/hook' } });
    expect(n.enabled).toBe(true);
    expect(n.channels).toEqual(['webhook:dingtalk']); // 默认拼钉钉
  });

  test('仅配置邮件需要 host 与收件人同时具备', () => {
    expect(new Notifier({ env: { SMTP_HOST: 'smtp.example.com' } }).enabled).toBe(false);
    expect(new Notifier({ env: { MAIL_TO: 'a@b.com' } }).enabled).toBe(false);

    const n = new Notifier({ env: { SMTP_HOST: 'smtp.example.com', MAIL_TO: 'a@b.com' } });
    expect(n.channels).toEqual(['email']);
  });

  test('应支持多个收件人（逗号分隔）', () => {
    const n = new Notifier({ env: { SMTP_HOST: 's', MAIL_TO: 'a@b.com, c@d.com ,' } });
    expect(n.mail.to).toEqual(['a@b.com', 'c@d.com']);
  });

  test('SMTP_SECURE 默认 true，显式 false 时关闭', () => {
    expect(new Notifier({ env: {} }).mail.secure).toBe(true);
    expect(new Notifier({ env: { SMTP_SECURE: 'false' } }).mail.secure).toBe(false);
  });

  test('未配置渠道时 send 应安全返回而非抛错', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const n = new Notifier({ env: {} });

    const res = await n.send({ title: 'x', lines: ['y'] });
    expect(res).toEqual({ enabled: false, sent: 0, failed: 0, results: [] });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('正文构建', () => {
  const n = new Notifier({ env: {} });

  test('纯文本应带等级图标与标题', () => {
    const text = n.buildText('标题', ['甲：1', '乙：2'], 'error');
    expect(text.split('\n')[0]).toBe(`${LEVEL_ICON.error} 标题`);
    expect(text).toContain('甲：1');
  });

  test('HTML 应把「键：值」渲染成表格行', () => {
    const html = n.buildHtml('标题', ['出口 IP：1.2.3.4'], 'warn');
    expect(html).toContain('<td');
    expect(html).toContain('出口 IP');
    expect(html).toContain('1.2.3.4');
  });

  test('HTML 应转义特殊字符', () => {
    const html = n.buildHtml('<script>alert(1)</script>', ['a & b < c'], 'info');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('a &amp; b &lt; c');
  });
});

describe('escapeHtml', () => {
  test('应转义 XML 元字符', () => {
    expect(escapeHtml('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;');
  });

  test('应处理 null/undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });
});
