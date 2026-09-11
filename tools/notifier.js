'use strict';

/**
 * 统一通知器
 * ==========
 * 把「要发一条通知」这件事收敛到一个地方，支持：
 *
 *   1. Webhook —— 复用项目已有的 webhook.js，支持钉钉 / 企业微信 / 飞书 / Slack / Discord
 *   2. 邮件    —— nodemailer（可选依赖，未安装时自动降级）
 *
 * 设计原则
 * --------
 * - 通知失败不应影响主流程：send() 永远不抛异常，只返回各渠道的结果
 * - 未配置任何渠道时给出一次性警告，而不是静默什么都不做
 * - 正文同时提供纯文本与 HTML，兼顾机器可读与手机上的可读性
 *
 * 环境变量
 * --------
 *   NOTIFY_WEBHOOK_TYPE=dingtalk|wecom|feishu|slack|discord|custom
 *   NOTIFY_WEBHOOK_URL=
 *   NOTIFY_WEBHOOK_SECRET=          # 钉钉加签等场景才需要
 *
 *   SMTP_HOST=                      # 留空则不发邮件
 *   SMTP_PORT=465
 *   SMTP_SECURE=true                # 465 用 true，587 用 false
 *   SMTP_USER=
 *   SMTP_PASS=
 *   MAIL_FROM=
 *   MAIL_TO=                        # 多个收件人用逗号分隔
 */

const LEVEL_ICON = { info: 'ℹ️', warn: '⚠️', error: '🔴', ok: '✅' };

class Notifier {
  constructor(options = {}) {
    const env = options.env || process.env;

    this.webhook = {
      type: env.NOTIFY_WEBHOOK_TYPE || 'dingtalk',
      url: env.NOTIFY_WEBHOOK_URL || '',
      secret: env.NOTIFY_WEBHOOK_SECRET || ''
    };

    this.mail = {
      host: env.SMTP_HOST || '',
      port: Number(env.SMTP_PORT || 465),
      secure: String(env.SMTP_SECURE || 'true') !== 'false',
      user: env.SMTP_USER || '',
      pass: env.SMTP_PASS || '',
      from: env.MAIL_FROM || env.SMTP_USER || '',
      to: (env.MAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean)
    };

    this._warned = false;
  }

  /** 已启用的渠道名列表 */
  get channels() {
    const list = [];
    if (this.webhook.url) {list.push(`webhook:${this.webhook.type}`);}
    if (this.mail.host && this.mail.to.length) {list.push('email');}
    return list;
  }

  get enabled() {
    return this.channels.length > 0;
  }

  /**
   * 发送一条通知。
   * @param {{title: string, lines?: string[], level?: string, details?: object}} message
   * @returns {Promise<{enabled: boolean, sent: number, failed: number, results: object[]}>}
   */
  async send(message) {
    const { title, lines = [], level = 'info' } = message;

    if (!this.enabled) {
      if (!this._warned) {
        console.warn('[通知] 未配置任何通知渠道（NOTIFY_WEBHOOK_URL 或 SMTP_HOST+MAIL_TO），已跳过发送');
        this._warned = true;
      }
      return { enabled: false, sent: 0, failed: 0, results: [] };
    }

    const results = [];
    const text = this.buildText(title, lines, level);

    if (this.webhook.url) {
      results.push(await this.sendWebhook(title, lines, level));
    }
    if (this.mail.host && this.mail.to.length) {
      results.push(await this.sendMail(title, text, level));
    }

    return {
      enabled: true,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results
    };
  }

  /** 纯文本正文（Webhook 与邮件的正文都用它） */
  buildText(title, lines, level) {
    const icon = LEVEL_ICON[level] || LEVEL_ICON.info;
    return [`${icon} ${title}`, ...lines].join('\n');
  }

  /** 邮件 HTML 正文 */
  buildHtml(title, lines, level) {
    const color = { info: '#0277bd', warn: '#ef6c00', error: '#c62828', ok: '#2e7d32' }[level] || '#0277bd';
    const rows = lines
      .map((line) => {
        const idx = line.indexOf('：');
        if (idx > 0 && idx < 12) {
          const k = line.slice(0, idx);
          const v = line.slice(idx + 1);
          return `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>`
            + `<td style="padding:6px 12px;color:#222">${escapeHtml(v)}</td></tr>`;
        }
        return `<tr><td colspan="2" style="padding:6px 12px;color:#222">${escapeHtml(line)}</td></tr>`;
      })
      .join('');

    return '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',\'PingFang SC\',\'Microsoft YaHei\',sans-serif;max-width:600px">'
      + `<div style="border-left:4px solid ${color};padding:10px 14px;background:#fafafa;margin-bottom:12px">`
      + `<strong style="color:${color};font-size:15px">${escapeHtml(title)}</strong></div>`
      + `<table style="border-collapse:collapse;font-size:14px">${rows}</table>`
      + '<div style="margin-top:14px;color:#999;font-size:12px">由 feiqingqiWechatMP 自动发出</div>'
      + '</div>';
  }

  async sendWebhook(title, lines, level) {
    try {
      const { WebhookNotifier } = require('../webhook');
      const notifier = new WebhookNotifier({ enabled: true });
      notifier.addWebhook({
        name: 'ip-watch',
        url: this.webhook.url,
        type: this.webhook.type,
        secret: this.webhook.secret
      });

      const details = {};
      lines.forEach((line) => {
        const idx = line.indexOf('：');
        if (idx > 0 && idx < 12) {details[line.slice(0, idx)] = line.slice(idx + 1);}
      });

      const result = await notifier.send(`${LEVEL_ICON[level] || ''} ${title}`.trim(), {
        title,
        details
      });

      // 把底层失败原因透出来。webhook.js 的失败明细在 result.results[] 里，
      // 不取出来就会只得到一个 success:false，出问题时无从排查。
      const perWebhook = (result && result.results) || [];
      const failure = perWebhook.find((r) => !r.success);
      const ok = Boolean(result) && result.failed === 0;

      return {
        channel: `webhook:${this.webhook.type}`,
        success: ok,
        error: ok ? undefined : (failure && failure.error) || '发送失败（无明细）',
        result
      };
    } catch (err) {
      return { channel: `webhook:${this.webhook.type}`, success: false, error: err.message };
    }
  }

  async sendMail(title, text, level) {
    let nodemailer;
    try {
      nodemailer = require('nodemailer');
    } catch {
      return { channel: 'email', success: false, error: '未安装 nodemailer（npm i nodemailer）' };
    }

    try {
      const transport = nodemailer.createTransport({
        host: this.mail.host,
        port: this.mail.port,
        secure: this.mail.secure,
        auth: this.mail.user ? { user: this.mail.user, pass: this.mail.pass } : undefined
      });

      const info = await transport.sendMail({
        from: this.mail.from,
        to: this.mail.to.join(', '),
        subject: `[公众号发布自检] ${title}`,
        text,
        html: this.buildHtml(title, text.split('\n').slice(1), level)
      });

      return { channel: 'email', success: true, messageId: info.messageId };
    } catch (err) {
      return { channel: 'email', success: false, error: err.message };
    }
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { Notifier, LEVEL_ICON, escapeHtml };
