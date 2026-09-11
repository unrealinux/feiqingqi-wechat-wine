/**
 * Webhook通知系统
 * 支持多种通知渠道：钉钉、企业微信、飞书、Slack、Discord等
 */

const axios = require('axios');
const crypto = require('crypto');

/**
 * Webhook通知器
 */
class WebhookNotifier {
  constructor(options = {}) {
    this.webhooks = options.webhooks || [];
    this.secret = options.secret || '';
    this.enabled = options.enabled !== false;
  }

  /**
   * 添加Webhook
   */
  addWebhook(config) {
    this.webhooks.push({
      name: config.name || 'unnamed',
      url: config.url,
      type: config.type || 'dingtalk', // dingtalk, wecom, feishu, slack, discord, custom
      secret: config.secret,
      enabled: config.enabled !== false
    });
  }

  /**
   * 发送通知
   */
  async send(message, options = {}) {
    if (!this.enabled) {
      console.log('[Webhook] 通知已禁用');
      return { success: false, reason: 'disabled' };
    }

    const results = [];
    
    for (const webhook of this.webhooks) {
      if (!webhook.enabled) {continue;}
      
      try {
        const payload = this.buildPayload(webhook.type, message, options);
        const data = await this.sendToWebhook(webhook, payload);
        // 钉钉/企业微信/飞书在失败时仍返回 HTTP 200，错误码只在 body 里。
        // 不看 body 就会把「签名不匹配」当成发送成功 —— 静默失败最难排查。
        const platformError = checkPlatformResponse(webhook.type, data);
        if (platformError) {
          results.push({ webhook: webhook.name, success: false, error: platformError, result: data });
        } else {
          results.push({ webhook: webhook.name, success: true, result: data });
        }
      } catch (error) {
        results.push({ webhook: webhook.name, success: false, error: error.message });
      }
    }

    return {
      total: this.webhooks.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * 构建消息载荷
   */
  buildPayload(type, message, options) {
    const base = {
      msgtype: 'text',
      text: { content: this.formatMessage(message, options) }
    };

    switch (type) {
    case 'dingtalk':
      return this.formatDingtalk(message, options);
    case 'wecom':
      return this.formatWecom(message, options);
    case 'feishu':
      return this.formatFeishu(message, options);
    case 'slack':
      return this.formatSlack(message, options);
    case 'discord':
      return this.formatDiscord(message, options);
    default:
      return base;
    }
  }

  /**
   * 格式化消息
   */
  formatMessage(message, options) {
    const lines = [
      `📰 ${options.title || '红酒文章系统通知'}`,
      '',
      message,
      '',
      `⏰ 时间: ${new Date().toLocaleString('zh-CN')}`
    ];
    
    if (options.details) {
      lines.push('', '📋 详情:');
      for (const [key, value] of Object.entries(options.details)) {
        lines.push(`  • ${key}: ${value}`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * 钉钉格式
   */
  formatDingtalk(message, options) {
    return {
      msgtype: 'markdown',
      markdown: {
        title: options.title || '通知',
        text: this.formatMessage(message, options)
      }
    };
  }

  /**
   * 企业微信格式
   */
  formatWecom(message, options) {
    return {
      msgtype: 'markdown',
      markdown: {
        content: this.formatMessage(message, options)
      }
    };
  }

  /**
   * 飞书格式
   */
  formatFeishu(message, options) {
    return {
      msg_type: 'text',
      content: {
        text: this.formatMessage(message, options)
      }
    };
  }

  /**
   * Slack格式
   */
  formatSlack(message, options) {
    return {
      text: options.title || '通知',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: options.title || '通知' }
        },
        {
          // 必须用 formatMessage：否则 options.details（实际 IP、错误码等）
          // 会被丢掉，只发出一句标题 —— 告警将失去可操作性
          type: 'section',
          text: { type: 'mrkdwn', text: this.formatMessage(message, options) }
        }
      ]
    };
  }

  /**
   * Discord格式
   */
  formatDiscord(message, options) {
    return {
      embeds: [{
        title: options.title || '通知',
        // 同 Slack：必须带上 details，否则告警内容为空壳
        description: this.formatMessage(message, options),
        timestamp: new Date().toISOString(),
        color: 0x722F37 // 红酒色
      }]
    };
  }

  /**
   * 发送到Webhook
   */
  async sendToWebhook(webhook, payload) {
    const headers = { 'Content-Type': 'application/json' };
    let url = webhook.url;
    let body = payload;

    if (webhook.secret) {
      const timestamp = Date.now();

      if (webhook.type === 'dingtalk') {
        // 钉钉「加签」要求 timestamp 与 sign 作为 **URL 查询参数**。
        // 放在 HTTP 头里不会被校验，机器人会返回 310000 sign not match。
        const separator = url.includes('?') ? '&' : '?';
        const sign = this.sign(webhook.secret, timestamp);
        url = `${url}${separator}timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
      } else if (webhook.type === 'feishu') {
        // 飞书要求签名放在 **请求体** 里，且算法与钉钉恰好相反
        body = { ...payload, timestamp: String(timestamp), sign: this.signFeishu(webhook.secret, timestamp) };
      } else {
        // 其余平台没有统一的签名约定，保留头部形式供自建服务校验
        headers['X-Webhook-Timestamp'] = String(timestamp);
        headers['X-Webhook-Sign'] = this.sign(webhook.secret, timestamp);
      }
    }

    const response = await axios.post(url, body, {
      headers,
      timeout: 10000
    });

    return response.data;
  }

  /**
   * 钉钉加签：key = secret，data = `${timestamp}\n${secret}`
   */
  sign(secret, timestamp) {
    const stringToSign = `${timestamp}\n${secret}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(stringToSign);
    return hmac.digest('base64');
  }

  /**
   * 飞书加签：key = `${timestamp}\n${secret}`，data = 空字符串。
   *
   * 注意与钉钉 **恰好相反**（钉钉把 secret 当 key、把 timestamp 拼进 data），
   * 因此不能复用 sign()，否则签名永远校验不通过。
   */
  signFeishu(secret, timestamp) {
    const stringToSign = `${timestamp}\n${secret}`;
    return crypto.createHmac('sha256', stringToSign).update('').digest('base64');
  }

  /**
   * 快捷方法: 发送成功通知
   */
  async notifySuccess(title, details) {
    return this.send('✅ 任务执行成功', { title, details });
  }

  /**
   * 快捷方法: 发送失败通知
   */
  async notifyFailure(title, details) {
    return this.send('❌ 任务执行失败', { title, details });
  }

  /**
   * 快捷方法: 发送文章发布通知
   */
  async notifyPublish(article) {
    return this.send(`新文章已发布: ${article.title}`, {
      title: '📝 文章发布通知',
      details: {
        标题: article.title,
        字数: article.wordCount,
        标签: article.tags?.join(', ') || '无',
        链接: article.url || '待生成'
      }
    });
  }

  /**
   * 获取配置状态
   */
  getStatus() {
    return {
      enabled: this.enabled,
      webhooks: this.webhooks.map(w => ({
        name: w.name,
        type: w.type,
        enabled: w.enabled
      }))
    };
  }
}

/**
 * 判定各平台返回体是否表示成功。
 *
 * 钉钉 / 企业微信失败时返回 HTTP 200 + errcode（如 310000 sign not match），
 * 飞书用 code，Discord 用 ok:false。必须看 body，否则会静默丢通知。
 *
 * @param {string} type 渠道类型
 * @param {*} data 平台返回体
 * @returns {string|null} 错误描述；null 表示成功
 */
function checkPlatformResponse(type, data) {
  if (!data || typeof data !== 'object') {
    return null; // 非 JSON（如 Discord 的 204）视为成功
  }

  if (type === 'dingtalk' || type === 'wecom') {
    if (data.errcode !== undefined && data.errcode !== 0) {
      return `[${data.errcode}] ${data.errmsg || '未知错误'}`;
    }
  }

  if (type === 'feishu') {
    if (data.code !== undefined && data.code !== 0) {
      return `[${data.code}] ${data.msg || '未知错误'}`;
    }
  }

  if (data.ok === false) {
    return data.error || 'ok=false';
  }

  return null;
}

/**
 * 预配置的Webhook工厂
 */
const WebhookFactory = {
  /**
   * 创建钉钉Webhook
   */
  createDingtalk(url, secret) {
    return {
      url,
      type: 'dingtalk',
      secret
    };
  },

  /**
   * 创建企业微信Webhook
   */
  createWecom(url, key) {
    return {
      url: `${url}?key=${key}`,
      type: 'wecom'
    };
  },

  /**
   * 创建飞书Webhook
   */
  createFeishu(url) {
    return {
      url,
      type: 'feishu'
    };
  },

  /**
   * 创建Slack Webhook
   */
  createSlack(url) {
    return {
      url,
      type: 'slack'
    };
  },

  /**
   * 创建Discord Webhook
   */
  createDiscord(url) {
    return {
      url,
      type: 'discord'
    };
  }
};

module.exports = { WebhookNotifier, WebhookFactory, checkPlatformResponse };
