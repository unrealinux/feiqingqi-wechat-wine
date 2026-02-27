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
      if (!webhook.enabled) continue;
      
      try {
        const payload = this.buildPayload(webhook.type, message, options);
        const result = await this.sendToWebhook(webhook, payload);
        results.push({ webhook: webhook.name, success: true, result });
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
          type: 'section',
          text: { type: 'mrkdwn', text: message }
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
        description: message,
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
    
    // 签名 (如果配置了密钥)
    if (webhook.secret) {
      const timestamp = Date.now();
      const sign = this.sign(payload, webhook.secret, timestamp);
      headers['X-Webhook-Timestamp'] = timestamp;
      headers['X-Webhook-Sign'] = sign;
    }

    const response = await axios.post(webhook.url, payload, {
      headers,
      timeout: 10000
    });

    return response.data;
  }

  /**
   * 生成签名
   */
  sign(payload, secret, timestamp) {
    const stringToSign = `${timestamp}\n${secret}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(stringToSign);
    return hmac.digest('base64');
  }

  /**
   * 快捷方法: 发送成功通知
   */
  async notifySuccess(title, details) {
    return await this.send('✅ 任务执行成功', { title, details });
  }

  /**
   * 快捷方法: 发送失败通知
   */
  async notifyFailure(title, details) {
    return await this.send('❌ 任务执行失败', { title, details });
  }

  /**
   * 快捷方法: 发送文章发布通知
   */
  async notifyPublish(article) {
    return await this.send(`新文章已发布: ${article.title}`, {
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

module.exports = { WebhookNotifier, WebhookFactory };
