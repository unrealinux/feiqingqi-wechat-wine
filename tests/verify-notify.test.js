/**
 * tools/verify-notify.js 测试
 *
 * 该工具此前覆盖率约 11%。它封装了几处真实踩过的坑，值得单独守住：
 *   - 钉钉/企微「失败也返回 200」，错误码在 body 里 —— 必须能被识别为失败；
 *   - 中文正文会被 quoted-printable/base64 编码并按 76 列软换行，
 *     一个 IP 可能被从中间折断，字面查找会假失败；
 *   - 各平台报文结构不同（dingtalk/wecom/feishu/slack/discord/custom）。
 */

const http = require('http');

const {
  startReceiver,
  startFakeSmtp,
  PAYLOAD_RULES,
  WEBHOOK_TYPES,
  mimeIncludes,
  decodeQuotedPrintable
} = require('../tools/verify-notify');
const { Notifier } = require('../tools/notifier');

/** 发一个 POST 请求到本地接收器 */
function post(port, path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      { host: '127.0.0.1', port, path, method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(raw); } catch { parsed = raw; }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.end(payload);
  });
}

const TEST_MESSAGE = {
  title: '微信发布被阻断：IP 不在白名单',
  level: 'error',
  lines: ['出口 IP：120.208.99.249', '错误码：40164（不在白名单）']
};

describe('decodeQuotedPrintable', () => {
  test('纯 ASCII 原样返回', () => {
    expect(decodeQuotedPrintable('hello world')).toBe('hello world');
  });

  test('=XX 序列按 UTF-8 还原为中文', () => {
    // 「不在白名单」的 quoted-printable 形式
    const qp = '=E4=B8=8D=E5=9C=A8=E7=99=BD=E5=90=8D=E5=8D=95';
    expect(decodeQuotedPrintable(qp)).toBe('不在白名单');
  });

  test('混合内容只解码 =XX 部分', () => {
    expect(decodeQuotedPrintable('IP=EF=BC=9A120.208.99.249')).toBe('IP：120.208.99.249');
  });

  test('非法 =XX 不吞字符', () => {
    expect(decodeQuotedPrintable('a=ZZb')).toBe('a=ZZb');
  });
});

describe('mimeIncludes（正文可能被软换行/编码，需多形式匹配）', () => {
  test('普通原文可直接命中', () => {
    expect(mimeIncludes('出口 IP：120.208.99.249', '120.208.99.249')).toBe(true);
  });

  test('IP 被 quoted-printable 软换行从中间折断时仍能命中', () => {
    // 76 列软换行把 120.208.99.249 折成 120.208.99.24=\r\n9
    const raw = '出口 IP：120.208.99.24=\r\n9\r\n';
    expect(mimeIncludes(raw, '120.208.99.249')).toBe(true);
  });

  test('中文被 quoted-printable 编码后仍能命中', () => {
    const raw = '=E4=B8=8D=E5=9C=A8=E7=99=BD=E5=90=8D=E5=8D=95';
    expect(mimeIncludes(raw, '不在白名单')).toBe(true);
  });

  test('base64 正文块能解码后命中', () => {
    const b64 = Buffer.from('不在白名单', 'utf8').toString('base64');
    const raw = `Content-Transfer-Encoding: base64\r\n\r\n${b64}\r\n--boundary--`;
    expect(mimeIncludes(raw, '不在白名单')).toBe(true);
  });

  test('确实不存在时返回 false', () => {
    expect(mimeIncludes('无关内容', '120.208.99.249')).toBe(false);
  });
});

describe('PAYLOAD_RULES：各平台报文要求', () => {
  const valid = {
    dingtalk: { msgtype: 'markdown', markdown: { title: 't', text: 'x' } },
    wecom: { msgtype: 'markdown', markdown: { content: 'x' } },
    feishu: { msg_type: 'text', content: { text: 'x' } },
    slack: { text: 'x', blocks: [{}] },
    discord: { embeds: [{ description: 'x' }] },
    custom: { text: 'x' }
  };

  test('六个平台都有对应的校验规则', () => {
    expect(WEBHOOK_TYPES).toEqual(['dingtalk', 'wecom', 'feishu', 'slack', 'discord', 'custom']);
    for (const t of WEBHOOK_TYPES) {
      expect(typeof PAYLOAD_RULES[t]).toBe('function');
    }
  });

  test.each(Object.keys(valid))('%s 的合法报文应无错误', (type) => {
    expect(PAYLOAD_RULES[type](valid[type])).toEqual([]);
  });

  test('dingtalk 缺 title/text 会报错', () => {
    expect(PAYLOAD_RULES.dingtalk({ msgtype: 'markdown', markdown: { text: 'x' } }))
      .toContain('缺少 markdown.title（钉钉必填）');
  });

  test('wecom 必须是 markdown 且含 content', () => {
    const errs = PAYLOAD_RULES.wecom({ msgtype: 'text' });
    expect(errs.length).toBeGreaterThan(0);
  });

  test('feishu 需要 msg_type=text 且 content.text 为字符串', () => {
    expect(PAYLOAD_RULES.feishu({ msg_type: 'post', content: {} }).length).toBeGreaterThan(0);
  });

  test('slack 需要非空 text 与 blocks 数组', () => {
    expect(PAYLOAD_RULES.slack({ text: '' }).length).toBeGreaterThan(0);
    expect(PAYLOAD_RULES.slack({ text: 'x', blocks: [] }).length).toBeGreaterThan(0);
  });

  test('discord 需要 embeds[0].description', () => {
    expect(PAYLOAD_RULES.discord({ embeds: [{}] })).toContain('embeds[0] 缺少 description');
  });

  test('custom 需要可识别的正文', () => {
    expect(PAYLOAD_RULES.custom({ foo: 'bar' }).length).toBeGreaterThan(0);
    expect(PAYLOAD_RULES.custom({ text: 'x' })).toEqual([]);
  });
});

describe('startReceiver', () => {
  let receiver;

  afterEach((done) => {
    if (receiver) { receiver.server.close(done); } else { done(); }
    receiver = null;
  });

  test('按 platform 返回各平台的成功应答', async () => {
    receiver = await startReceiver();
    const { status, body } = await post(receiver.port, '/hook?platform=feishu', { a: 1 });
    expect(status).toBe(200);
    expect(body).toEqual({ code: 0, msg: 'success' });
  });

  test('记录请求体与 URL 供断言', async () => {
    receiver = await startReceiver();
    await post(receiver.port, '/hook?platform=slack', { text: 'hi' });
    expect(receiver.received).toHaveLength(1);
    expect(receiver.received[0].body).toEqual({ text: 'hi' });
    expect(receiver.received[0].url).toContain('platform=slack');
  });

  test('forcePlatformError 时返回平台级错误（200 + errcode）', async () => {
    receiver = await startReceiver({ forcePlatformError: true });
    const { status, body } = await post(receiver.port, '/hook?platform=dingtalk', { a: 1 });
    expect(status).toBe(200);
    expect(body.errcode).toBe(310000);
  });
});

describe('端到端：Notifier -> 本地接收器 / 本地 SMTP', () => {
  let receiver;
  let smtp;

  afterEach((done) => {
    const closers = [];
    if (receiver) { closers.push(new Promise((r) => receiver.server.close(r))); receiver = null; }
    if (smtp) { closers.push(new Promise((r) => smtp.server.close(r))); smtp = null; }
    Promise.all(closers).then(() => done());
  });

  test('Webhook 成功路径：sent=1 且接收器收到实际内容', async () => {
    receiver = await startReceiver();
    const notifier = new Notifier({
      env: {
        NOTIFY_WEBHOOK_TYPE: 'slack',
        NOTIFY_WEBHOOK_URL: `http://127.0.0.1:${receiver.port}/hook?platform=slack`
      }
    });

    const delivery = await notifier.send(TEST_MESSAGE);
    expect(delivery.sent).toBe(1);
    expect(delivery.failed).toBe(0);
    expect(receiver.received).toHaveLength(1);
    expect(JSON.stringify(receiver.received[0].body)).toContain('120.208.99.249');
  });

  test('平台返回 200 但 body 报错时，必须被识别为失败', async () => {
    receiver = await startReceiver({ forcePlatformError: true });
    const notifier = new Notifier({
      env: {
        NOTIFY_WEBHOOK_TYPE: 'dingtalk',
        NOTIFY_WEBHOOK_URL: `http://127.0.0.1:${receiver.port}/hook?platform=dingtalk`
      }
    });

    const delivery = await notifier.send(TEST_MESSAGE);
    expect(delivery.failed).toBe(1);
    expect(delivery.results[0].success).toBe(false);
  });

  test('邮件路径：正文含实际内容（经 MIME 解码校验）', async () => {
    smtp = await startFakeSmtp();
    const notifier = new Notifier({
      env: {
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: String(smtp.port),
        SMTP_SECURE: 'false',
        MAIL_FROM: 'watch@verify.local',
        MAIL_TO: 'ops@verify.local'
      }
    });

    const delivery = await notifier.send(TEST_MESSAGE);
    expect(delivery.failed).toBe(0);

    const mail = smtp.received[0] || '';
    expect(smtp.received).toHaveLength(1);
    expect(mail).toContain('Subject:');
    expect(/To:\s*ops@verify\.local/i.test(mail)).toBe(true);
    expect(mimeIncludes(mail, '120.208.99.249')).toBe(true);
    expect(mimeIncludes(mail, '不在白名单')).toBe(true);
  });
});
