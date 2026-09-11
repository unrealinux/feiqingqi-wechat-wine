/**
 * Webhook 通知测试
 *
 * 这些用例固化了「验证通知链路」时发现的三个真实缺陷，防止回归：
 *   1. 钉钉加签必须放在 URL 查询参数（放 HTTP 头会 310000 sign not match）
 *   2. 平台失败时会返回 HTTP 200 + errcode，只看状态码会把静默失败当成功
 *   3. Slack / Discord 的报文构造漏掉了 details，告警会丢正文
 */

const { WebhookNotifier, WebhookFactory, checkPlatformResponse } = require('../webhook');
const { startReceiver } = require('../tools/verify-notify');

const TEST_MESSAGE = '微信发布被阻断：IP 不在白名单';
const TEST_OPTIONS = {
  title: '微信发布被阻断：IP 不在白名单',
  details: { '出口 IP': '120.208.99.249', 错误码: '40164' }
};

describe('checkPlatformResponse', () => {
  test('钉钉/企业微信 errcode 非 0 应判为失败', () => {
    expect(checkPlatformResponse('dingtalk', { errcode: 310000, errmsg: 'sign not match' }))
      .toBe('[310000] sign not match');
    expect(checkPlatformResponse('wecom', { errcode: 93000, errmsg: 'invalid webhook url' }))
      .toBe('[93000] invalid webhook url');
  });

  test('errcode 为 0 应判为成功', () => {
    expect(checkPlatformResponse('dingtalk', { errcode: 0, errmsg: 'ok' })).toBeNull();
    expect(checkPlatformResponse('wecom', { errcode: 0 })).toBeNull();
  });

  test('飞书用 code 字段', () => {
    expect(checkPlatformResponse('feishu', { code: 19021, msg: 'sign match fail' }))
      .toBe('[19021] sign match fail');
    expect(checkPlatformResponse('feishu', { code: 0 })).toBeNull();
  });

  test('Discord 用 ok:false', () => {
    expect(checkPlatformResponse('discord', { ok: false, error: 'rate limited' })).toBe('rate limited');
    expect(checkPlatformResponse('discord', { ok: true })).toBeNull();
  });

  test('非 JSON 响应（如 204）视为成功', () => {
    expect(checkPlatformResponse('discord', '')).toBeNull();
    expect(checkPlatformResponse('custom', null)).toBeNull();
  });
});

describe('签名算法', () => {
  const notifier = new WebhookNotifier({ enabled: false });
  const timestamp = 1700000000000;

  test('钉钉：key=secret, data=timestamp\\nsecret', () => {
    const expected = require('crypto')
      .createHmac('sha256', 'topsecret')
      .update(`${timestamp}\ntopsecret`)
      .digest('base64');
    expect(notifier.sign('topsecret', timestamp)).toBe(expected);
  });

  test('飞书：key=timestamp\\nsecret, data 为空 —— 与钉钉恰好相反', () => {
    const expected = require('crypto')
      .createHmac('sha256', `${timestamp}\ntopsecret`)
      .update('')
      .digest('base64');
    expect(notifier.signFeishu('topsecret', timestamp)).toBe(expected);
  });

  test('两种签名结果必须不同（若相同说明实现被错误合并）', () => {
    expect(notifier.sign('topsecret', timestamp)).not.toBe(notifier.signFeishu('topsecret', timestamp));
  });
});

describe('报文构造', () => {
  const notifier = new WebhookNotifier({ enabled: false });
  const types = ['dingtalk', 'wecom', 'feishu', 'slack', 'discord', 'custom'];

  test('所有平台的报文都必须带上 details 里的实际内容', () => {
    // 回归保护：Slack / Discord 曾漏掉 details，告警只剩标题
    types.forEach((type) => {
      const payload = notifier.buildPayload(type, TEST_MESSAGE, TEST_OPTIONS);
      expect(JSON.stringify(payload)).toContain('120.208.99.249');
    });
  });

  test('各平台使用各自要求的字段名', () => {
    expect(notifier.buildPayload('dingtalk', TEST_MESSAGE, TEST_OPTIONS).msgtype).toBe('markdown');
    expect(notifier.buildPayload('wecom', TEST_MESSAGE, TEST_OPTIONS).msgtype).toBe('markdown');
    expect(notifier.buildPayload('feishu', TEST_MESSAGE, TEST_OPTIONS).msg_type).toBe('text');
    expect(notifier.buildPayload('slack', TEST_MESSAGE, TEST_OPTIONS).blocks).toBeDefined();
    expect(notifier.buildPayload('discord', TEST_MESSAGE, TEST_OPTIONS).embeds).toBeDefined();
  });

  test('钉钉 markdown 必须同时有 title 与 text', () => {
    const payload = notifier.buildPayload('dingtalk', TEST_MESSAGE, TEST_OPTIONS);
    expect(payload.markdown.title).toBeTruthy();
    expect(payload.markdown.text).toBeTruthy();
  });
});

describe('WebhookFactory', () => {
  test('企业微信应把 key 拼进 URL 查询参数', () => {
    const w = WebhookFactory.createWecom('https://qyapi.weixin.qq.com/cgi-bin/webhook/send', 'abc123');
    expect(w.url).toContain('?key=abc123');
    expect(w.type).toBe('wecom');
  });

  test('钉钉工厂应带上 secret', () => {
    const w = WebhookFactory.createDingtalk('https://oapi.dingtalk.com/robot/send?access_token=x', 'sec');
    expect(w.secret).toBe('sec');
  });
});

describe('端到端：真实发出并校验（本地接收器，无外部依赖）', () => {
  let receiver;

  afterEach(() => {
    if (receiver) {receiver.server.close();}
    receiver = null;
  });

  async function sendVia(type, secret) {
    receiver = await startReceiver();
    const notifier = new WebhookNotifier({ enabled: true });
    notifier.addWebhook({
      name: 'test',
      type,
      secret,
      url: `http://127.0.0.1:${receiver.port}/hook?platform=${type}`
    });
    const result = await notifier.send(TEST_MESSAGE, TEST_OPTIONS);
    return { result, received: receiver.received[0] };
  }

  test('钉钉加签应把 timestamp/sign 放在 URL 查询参数里', async () => {
    const { result, received } = await sendVia('dingtalk', 'topsecret');

    expect(result.failed).toBe(0);
    const url = new URL(received.url, 'http://x');
    expect(url.searchParams.get('sign')).toBeTruthy();
    expect(url.searchParams.get('timestamp')).toBeTruthy();
    // 钉钉并不认 HTTP 头形式的签名
    expect(received.headers['x-webhook-sign']).toBeUndefined();
  });

  test('飞书加签应把 timestamp/sign 放在请求体里', async () => {
    const { result, received } = await sendVia('feishu', 'topsecret');

    expect(result.failed).toBe(0);
    expect(received.body.sign).toBeTruthy();
    expect(received.body.timestamp).toBeTruthy();
  });

  test('企业微信无需签名时不应附带任何签名参数', async () => {
    const { received } = await sendVia('wecom', '');
    const url = new URL(received.url, 'http://x');
    expect(url.searchParams.get('sign')).toBeNull();
    expect(received.body.sign).toBeUndefined();
  });

  test('平台返回 200 但带 errcode 时，必须被判为失败', async () => {
    receiver = await startReceiver({ forcePlatformError: true });
    const notifier = new WebhookNotifier({ enabled: true });
    notifier.addWebhook({
      name: 'test',
      type: 'dingtalk',
      url: `http://127.0.0.1:${receiver.port}/hook`
    });

    const result = await notifier.send(TEST_MESSAGE, TEST_OPTIONS);

    expect(result.failed).toBe(1);
    expect(result.results[0].success).toBe(false);
    expect(result.results[0].error).toContain('310000');
  });

  test('网络不可达应被捕获而不是抛异常', async () => {
    const notifier = new WebhookNotifier({ enabled: true });
    notifier.addWebhook({ name: 'dead', type: 'custom', url: 'http://127.0.0.1:1/hook' });

    const result = await notifier.send(TEST_MESSAGE, TEST_OPTIONS);
    expect(result.failed).toBe(1);
    expect(result.results[0].success).toBe(false);
  });
});
