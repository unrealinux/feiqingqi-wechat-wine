#!/usr/bin/env node
'use strict';

/**
 * 通知链路验证
 * ============
 * 在**不填任何真实凭据**的前提下，验证「通知能不能发出去、格式对不对、失败能不能被发现」。
 *
 * 做法：本地起一个 Webhook 接收器和一个极简 SMTP 服务器，把通知真正发过去，
 * 再逐个校验各平台的报文要求。
 *
 * 为什么值得这么做
 * ----------------
 * 钉钉 / 企业微信 / 飞书 在**失败时也返回 HTTP 200**，错误码藏在返回体里。
 * 如果只验证「请求发出去了」，会得到虚假的安心 —— 实际通知可能一条都没送达。
 * 本工具同时验证「成功路径」与「失败能否被发现」。
 *
 * 用法
 * ----
 *   node tools/verify-notify.js            # 本地模拟验证（推荐，无需凭据）
 *   node tools/verify-notify.js --live     # 用 .env 里配置的真实渠道发一条测试通知
 *   node tools/verify-notify.js --json
 *
 * 退出码：0 全部通过 ｜ 1 存在失败
 */

try {
  require('dotenv').config();
} catch {
  // dotenv 可选
}

const http = require('http');
const net = require('net');

const { Notifier } = require('./notifier');

const WEBHOOK_TYPES = ['dingtalk', 'wecom', 'feishu', 'slack', 'discord', 'custom'];

/**
 * 各平台的报文要求。
 *
 * 依据官方文档：钉钉 markdown 必填 title+text；企业微信 markdown 用 content；
 * 飞书用 msg_type+content.text；Slack 用 text(blocks)；Discord 用 embeds。
 */
const PAYLOAD_RULES = {
  dingtalk: (body) => {
    const errs = [];
    if (body.msgtype !== 'markdown') {errs.push('msgtype 应为 markdown');}
    if (!body.markdown) {errs.push('缺少 markdown 对象');}
    else {
      if (!body.markdown.title) {errs.push('缺少 markdown.title（钉钉必填）');}
      if (!body.markdown.text) {errs.push('缺少 markdown.text（钉钉必填）');}
    }
    return errs;
  },
  wecom: (body) => {
    const errs = [];
    if (body.msgtype !== 'markdown') {errs.push('msgtype 应为 markdown');}
    if (!body.markdown || !body.markdown.content) {errs.push('缺少 markdown.content（企业微信必填）');}
    return errs;
  },
  feishu: (body) => {
    const errs = [];
    if (body.msg_type !== 'text') {errs.push('msg_type 应为 text');}
    if (!body.content || typeof body.content.text !== 'string') {errs.push('缺少 content.text');}
    return errs;
  },
  slack: (body) => {
    const errs = [];
    if (typeof body.text !== 'string' || !body.text) {errs.push('缺少 text');}
    if (!Array.isArray(body.blocks) || body.blocks.length === 0) {errs.push('缺少 blocks');}
    return errs;
  },
  discord: (body) => {
    const errs = [];
    if (!Array.isArray(body.embeds) || body.embeds.length === 0) {errs.push('缺少 embeds');}
    else if (!body.embeds[0].description) {errs.push('embeds[0] 缺少 description');}
    return errs;
  },
  custom: (body) => {
    const errs = [];
    if (!body || typeof body !== 'object') {errs.push('请求体不是 JSON 对象');}
    else if (!body.text && !body.msgtype) {errs.push('缺少可识别的正文（text / msgtype）');}
    return errs;
  }
};

/** 各平台成功时应答（用于让 webhook.js 判定成功） */
const SUCCESS_RESPONSE = {
  dingtalk: { errcode: 0, errmsg: 'ok' },
  wecom: { errcode: 0, errmsg: 'ok' },
  feishu: { code: 0, msg: 'success' },
  slack: 'ok',
  discord: { ok: true },
  custom: { ok: true }
};

/**
 * 启动本地 Webhook 接收器。
 * @param {object} [options]
 * @param {boolean} [options.forcePlatformError] 故意返回平台级错误，验证「失败能被发现」
 */
function startReceiver(options = {}) {
  const received = [];

  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      let body;
      try {
        body = JSON.parse(raw || '{}');
      } catch {
        body = raw;
      }
      received.push({ url: req.url, headers: req.headers, body, raw });

      const platform = (req.url.match(/platform=([a-z]+)/) || [])[1] || 'custom';
      const payload = options.forcePlatformError
        ? { errcode: 310000, errmsg: 'sign not match' }
        : SUCCESS_RESPONSE[platform] || { ok: true };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(typeof payload === 'string' ? JSON.stringify({ message: payload }) : JSON.stringify(payload));
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, received, port: server.address().port });
    });
  });
}

/**
 * 启动极简 SMTP 服务器（纯文本，不启用 TLS），用于验证邮件路径。
 * 只实现 nodemailer 会用到的最小命令集。
 */
function startFakeSmtp() {
  const received = [];

  const server = net.createServer((socket) => {
    let buffer = '';
    let inData = false;
    let message = '';

    const send = (line) => socket.write(`${line}\r\n`);
    send('220 verify.local ESMTP');

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');

      let idx;
      while ((idx = buffer.indexOf('\r\n')) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        if (inData) {
          if (line === '.') {
            inData = false;
            received.push(message);
            send('250 OK queued');
          } else {
            message += `${line}\n`;
          }
          continue;
        }

        const cmd = line.toUpperCase();
        if (cmd.startsWith('EHLO') || cmd.startsWith('HELO')) {
          // 刻意不宣告 STARTTLS，让 nodemailer 走明文，省去自签证书
          send('250-verify.local');
          send('250 8BITMIME');
        } else if (cmd.startsWith('MAIL FROM')) {
          send('250 OK');
        } else if (cmd.startsWith('RCPT TO')) {
          send('250 OK');
        } else if (cmd.startsWith('DATA')) {
          inData = true;
          message = '';
          send('354 End data with <CR><LF>.<CR><LF>');
        } else if (cmd.startsWith('RSET') || cmd.startsWith('NOOP')) {
          send('250 OK');
        } else if (cmd.startsWith('QUIT')) {
          send('221 Bye');
          socket.end();
        } else {
          send('250 OK');
        }
      }
    });

    socket.on('error', () => { /* 忽略：验证结束后客户端会直接断开 */ });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, received, port: server.address().port }));
  });
}

/**
 * 解码 quoted-printable（=XX -> 字节，再按 UTF-8 还原）。
 */
function decodeQuotedPrintable(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    const hex = str.slice(i + 1, i + 3);
    if (ch === '=' && /^[0-9A-Fa-f]{2}$/.test(hex)) {
      bytes.push(parseInt(hex, 16));
      i += 2;
    } else {
      bytes.push(ch.charCodeAt(0) & 0xff);
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

/**
 * 把原始 MIME 数据展开成若干个候选文本。
 *
 * 为什么不能直接对原始数据做子串查找：nodemailer 面对含中文的正文会使用
 * quoted-printable，并按 76 列插入软换行（`=\r\n`）。一个纯 ASCII 的 IP
 * 完全可能被从中间折断成 `120.208.99.24=\r\n9`，字面查找就会假失败。
 */
function mimeCandidates(raw) {
  const candidates = [raw];

  // 1) 仅去掉软换行（最常见的情形）
  const softRemoved = raw.replace(/=\r?\n/g, '');
  candidates.push(softRemoved);

  // 2) 完整 quoted-printable 解码
  candidates.push(decodeQuotedPrintable(softRemoved));

  // 3) 若用了 base64，尝试解码最后一个 base64 块
  const b64 = raw.match(/Content-Transfer-Encoding:\s*base64[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|$)/i);
  if (b64) {
    try {
      candidates.push(Buffer.from(b64[1].replace(/\s+/g, ''), 'base64').toString('utf8'));
    } catch {
      // 解不开就算了，前面的候选仍然参与判定
    }
  }

  return candidates;
}

/** 在 MIME 原文的任一解码形式中查找 */
function mimeIncludes(raw, needle) {
  return mimeCandidates(raw).some((text) => text.includes(needle));
}

/** 构造一个指向本地接收器的 Notifier */
function localNotifier(type, port, options = {}) {
  return new Notifier({
    env: {
      NOTIFY_WEBHOOK_TYPE: type,
      NOTIFY_WEBHOOK_URL: `http://127.0.0.1:${port}/hook?platform=${type}`,
      NOTIFY_WEBHOOK_SECRET: options.secret || ''
    }
  });
}

const TEST_MESSAGE = {
  title: '微信发布被阻断：IP 不在白名单',
  level: 'error',
  lines: ['出口 IP：120.208.99.249', '错误码：40164（不在白名单）']
};

async function verifyWebhookType(type, options) {
  const result = { name: `webhook:${type}`, checks: [], errors: [] };

  const receiver = await startReceiver();
  try {
    const notifier = localNotifier(type, receiver.port, options);
    const delivery = await notifier.send(TEST_MESSAGE);

    // ① 是否真的发出并送达
    if (receiver.received.length !== 1) {
      result.errors.push(`接收器收到 ${receiver.received.length} 个请求，期望 1 个`);
    } else {
      result.checks.push('请求已送达');
    }

    const got = receiver.received[0];
    if (!got) {return result;}

    // ② 报文格式是否符合该平台要求
    const shapeErrors = PAYLOAD_RULES[type](got.body);
    if (shapeErrors.length) {result.errors.push(...shapeErrors);}
    else {result.checks.push('报文格式符合平台要求');}

    // ③ 正文是否带上真实内容
    const serialized = JSON.stringify(got.body);
    if (!serialized.includes('120.208.99.249')) {result.errors.push('正文未包含实际检查内容');}
    else {result.checks.push('正文含实际内容');}

    // ④ 签名位置（钉钉放 URL，飞书放 body）
    if (options.secret) {
      if (type === 'dingtalk') {
        const u = new URL(got.url, 'http://x');
        if (!u.searchParams.get('sign') || !u.searchParams.get('timestamp')) {
          result.errors.push('签名未出现在 URL 查询参数中（钉钉加签要求如此）');
        } else {
          result.checks.push('签名位于 URL 查询参数（钉钉）');
        }
      } else if (type === 'feishu') {
        if (!got.body.sign || !got.body.timestamp) {result.errors.push('签名未出现在请求体中（飞书要求如此）');}
        else {result.checks.push('签名位于请求体（飞书）');}
      }
    }

    // ⑤ 投递结果是否被正确判定为成功
    if (!delivery.enabled || delivery.sent !== 1) {
      result.errors.push(`notifier 判定为未成功发出（sent=${delivery.sent}, failed=${delivery.failed}）`);
    } else {
      result.checks.push('notifier 判定发送成功');
    }
    return result;
  } finally {
    receiver.server.close();
  }
}

/** 关键验证：平台返回 200 但 body 报错时，必须被发现 */
async function verifyFailureDetection(port) {
  const receiver = await startReceiver({ forcePlatformError: true });
  try {
    const notifier = localNotifier('dingtalk', receiver.port);
    const delivery = await notifier.send(TEST_MESSAGE);
    const detected = delivery.failed === 1 && delivery.results[0].success === false;
    return {
      name: '失败可被检测（平台返回 200 + errcode 310000）',
      ok: detected,
      detail: detected
        ? `已正确识别为失败：${delivery.results[0].error}`
        : '未识别出平台级错误 —— 会造成静默丢通知'
    };
  } finally {
    receiver.server.close();
  }
}

async function verifyEmail() {
  const smtp = await startFakeSmtp();
  try {
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
    const mail = smtp.received[0] || '';
    const errors = [];

    if (smtp.received.length !== 1) {errors.push(`SMTP 收到 ${smtp.received.length} 封，期望 1 封`);}
    if (!mail.includes('Subject:')) {errors.push('缺少邮件主题');}
    if (!/To:\s*ops@verify\.local/i.test(mail)) {errors.push('缺少收件人');}
    // 正文需先做 MIME 解码（中文正文会被 quoted-printable/base64 编码）
    if (!mimeIncludes(mail, '120.208.99.249')) {errors.push('正文未包含实际检查内容');}
    if (!mimeIncludes(mail, '不在白名单')) {errors.push('正文未包含中文标题（编码/字符集可能有问题）');}

    if (delivery.failed > 0) {errors.push(`notifier 报告失败：${JSON.stringify(delivery.results)}`);}

    return {
      name: 'email',
      errors,
      checks: errors.length ? [] : ['邮件已投递', '主题/收件人齐全', '正文含实际内容（已按 MIME 解码校验）']
    };
  } finally {
    smtp.server.close();
  }
}

/** 用 .env 中的真实渠道发送一条测试通知 */
async function verifyLive() {
  const notifier = new Notifier();
  if (!notifier.enabled) {
    console.log('❌ .env 未配置任何通知渠道（NOTIFY_WEBHOOK_URL 或 SMTP_HOST+MAIL_TO）');
    console.log('   配置后可重跑本命令，或先执行不带 --live 的本地验证');
    return 1;
  }

  console.log(`正在向已配置的渠道发送测试通知: ${notifier.channels.join(', ')}\n`);
  const delivery = await notifier.send({
    title: '通知渠道连通性测试',
    level: 'info',
    lines: [
      `渠道：${notifier.channels.join(', ')}`,
      `时间：${new Date().toLocaleString('zh-CN')}`,
      '说明：如果你看到了这条消息，说明告警可以正常送达'
    ]
  });

  console.log(`结果：成功 ${delivery.sent} ｜ 失败 ${delivery.failed}`);
  delivery.results.forEach((r) => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.channel}${r.error ? ` —— ${r.error}` : ''}`);
  });
  return delivery.failed === 0 ? 0 : 1;
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes('-h') || argv.includes('--help')) {
    const src = require('fs').readFileSync(__filename, 'utf8');
    const m = src.match(/\/\*\*([\s\S]*?)\*\//);
    console.log(m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '');
    return 0;
  }

  if (argv.includes('--live')) {
    return verifyLive();
  }

  const asJson = argv.includes('--json');
  const results = [];

  console.log('通知链路验证（本地模拟，不需要真实凭据）');
  console.log('='.repeat(60));

  // 1) 各平台报文格式 —— 含签名场景
  for (const type of WEBHOOK_TYPES) {
    for (const secret of ['', 'test-sign-secret']) {
      const r = await verifyWebhookType(type, { secret });
      if (secret) {r.name += '（含加签）';}
      results.push(r);
    }
  }

  // 2) 失败检测
  const failureCheck = await verifyFailureDetection();
  results.push({
    name: failureCheck.name,
    errors: failureCheck.ok ? [] : [failureCheck.detail],
    checks: failureCheck.ok ? [failureCheck.detail] : []
  });

  // 3) 邮件
  results.push(await verifyEmail());

  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const r of results) {
      console.log(`\n${r.errors.length ? '❌' : '✅'} ${r.name}`);
      r.checks.forEach((c) => console.log(`     ✓ ${c}`));
      r.errors.forEach((e) => console.log(`     ✗ ${e}`));
    }
  }

  const failed = results.filter((r) => r.errors.length > 0);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`通过 ${results.length - failed.length} / ${results.length}`);
  if (failed.length) {
    console.log('\n失败项：');
    failed.forEach((r) => console.log(`  ❌ ${r.name}`));
  }
  return failed.length ? 1 : 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error('❌ 验证脚本异常:', err);
      process.exit(1);
    });
}

module.exports = { startReceiver, startFakeSmtp, PAYLOAD_RULES, WEBHOOK_TYPES, mimeIncludes, decodeQuotedPrintable };
