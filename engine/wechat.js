'use strict';

/**
 * 微信公众号 API 客户端
 * ====================
 * 封装 token 获取（带缓存）、图片素材上传、草稿创建。
 *
 * 旧实现的三个问题，这里都做了修正：
 *   1. 每个脚本都自己调一次 /cgi-bin/token —— token 有每日调用上限（2000 次/天），
 *      且官方要求缓存复用（有效期 7200 秒）。这里做进程内缓存 + 提前 5 分钟刷新。
 *   2. 不处理 token 过期（errcode 40001/42001）—— 这里自动失效重取并重试一次。
 *   3. 不校验字段长度 —— 这里按官方限制做前置校验（标题 64、摘要 120）。
 */

const axios = require('axios');
const FormData = require('form-data');

const API = {
  token: 'https://api.weixin.qq.com/cgi-bin/token',
  addMaterial: 'https://api.weixin.qq.com/cgi-bin/material/add_material',
  uploadImg: 'https://api.weixin.qq.com/cgi-bin/media/uploadimg',
  addDraft: 'https://api.weixin.qq.com/cgi-bin/draft/add',
  getDraftCount: 'https://api.weixin.qq.com/cgi-bin/draft/count',
};

// 微信官方限制
const LIMITS = {
  title: 64,
  digest: 120,
  author: 8,
  contentBytes: 1024 * 1024,
};

/** token 失效相关错误码，遇到时应清缓存重取后重试。 */
const TOKEN_ERROR_CODES = new Set([40001, 40014, 41001, 42001]);

/**
 * 微信错误码 -> 可执行的排查建议。
 *
 * 微信接口失败时只给一个数字，排查成本很高。这里把最常见的几个错误码
 * 翻译成「去哪里改什么」，让 --publish 失败时能自解释。
 */
const ERROR_HINTS = {
  40001: '凭据无效或已过期。若刚在公众平台重置过 AppSecret，请同步更新 .env 的 WECHAT_SECRET。',
  40013: 'AppID 无效。请核对 .env 的 WECHAT_APPID 是否与公众号一致。',
  40125: 'AppSecret 无效。请在公众平台重置后更新 .env 的 WECHAT_SECRET。',
  40164: '当前出口 IP 不在公众号的 IP 白名单中。请到「公众平台 → 开发 → 基本配置 → IP白名单」添加；'
       + '运行 `npm run wechat:check` 可查看当前出口 IP。',
  41002: 'appid 缺失。请检查 .env 的 WECHAT_APPID。',
  45009: '接口调用超过每日上限（token 接口为 2000 次/天）。请稍后重试，并检查是否有脚本在重复取 token。',
  48001: '接口未授权。草稿箱/发布接口需要已认证的服务号，请确认公众号类型与权限。',
  48002: '调用方 IP 与后台配置不符，请检查 IP 白名单。',
  40007: 'media_id 无效或已过期。请重新上传封面素材。',
  40005: '文件类型不合法。封面需为 PNG/JPG 的真实图片字节（不能是 SVG 文本）。',
};

/**
 * 把微信接口的 errcode 翻译成带建议的错误描述。
 * @param {{errcode: number, errmsg?: string}} payload
 * @param {string} [action] 出错的动件，如 '获取 access_token'
 * @returns {string}
 */
function describeApiError(payload, action = '') {
  const code = payload && payload.errcode;
  const errmsg = (payload && payload.errmsg) || '未知错误';
  const prefix = action ? `${action}失败 ` : '';
  const head = `${prefix}[${code}] ${errmsg}`;
  const hint = ERROR_HINTS[code];
  return hint ? `${head}\n  可能原因：${hint}` : head;
}

class WeChatError extends Error {
  constructor(message, payload) {
    super(message);
    this.name = 'WeChatError';
    this.payload = payload;
  }
}

/** 校验文章字段是否符合微信接口限制，返回问题列表。 */
function validateArticle(article) {
  const errors = [];
  const count = (s) => (typeof s === 'string' ? [...s].length : 0);

  if (!article.title) {errors.push('title 不能为空');}
  else if (count(article.title) > LIMITS.title) {
    errors.push(`title 超长：${count(article.title)} > ${LIMITS.title} 字`);
  }

  if (article.digest && count(article.digest) > LIMITS.digest) {
    errors.push(`digest 超长：${count(article.digest)} > ${LIMITS.digest} 字`);
  }

  if (article.author && count(article.author) > LIMITS.author) {
    errors.push(`author 超长：${count(article.author)} > ${LIMITS.author} 字`);
  }

  if (!article.content) {errors.push('content 不能为空');}
  else if (Buffer.byteLength(article.content, 'utf8') > LIMITS.contentBytes) {
    errors.push(`content 超过 ${LIMITS.contentBytes} 字节`);
  }

  if (!article.thumbMediaId) {errors.push('thumbMediaId 不能为空（需先上传封面）');}

  return errors;
}

class WeChatClient {
  /**
   * @param {object} [options]
   * @param {string} [options.appId]
   * @param {string} [options.appSecret]
   * @param {object} [options.endpoints] 覆盖默认 API 端点
   * @param {number} [options.timeout] 请求超时（毫秒）
   */
  constructor(options = {}) {
    const config = options.config || safeRequireConfig();

    this.appId = options.appId || (config && config.publish && config.publish.appId);
    this.appSecret = options.appSecret || (config && config.publish && config.publish.appSecret);
    this.endpoints = {
      ...API,
      ...((config && config.publish && config.publish.endpoints) || {}),
      ...(options.endpoints || {}),
    };
    this.timeout = options.timeout || 30000;

    this._token = null;
    this._tokenExpiresAt = 0;

    if (!this.appId || !this.appSecret) {
      throw new WeChatError(
        '缺少 WECHAT_APPID / WECHAT_SECRET。请在 .env 中配置（参考 .env.example）。'
      );
    }
  }

  /** 获取 access_token（进程内缓存，提前 5 分钟刷新）。 */
  async getAccessToken({ force = false } = {}) {
    const now = Date.now();
    if (!force && this._token && now < this._tokenExpiresAt) {
      return this._token;
    }

    const res = await axios.get(this.endpoints.token, {
      params: { grant_type: 'client_credential', appid: this.appId, secret: this.appSecret },
      timeout: this.timeout,
    });

    // 注意：不要把 secret 打进日志
    if (res.data.errcode) {
      throw new WeChatError(describeApiError(res.data, '获取 access_token'), res.data);
    }

    this._token = res.data.access_token;
    // 官方有效期 7200 秒，这里留 300 秒安全边界
    this._tokenExpiresAt = now + (Number(res.data.expires_in || 7200) - 300) * 1000;
    return this._token;
  }

  /** 清空 token 缓存。 */
  invalidateToken() {
    this._token = null;
    this._tokenExpiresAt = 0;
  }

  /**
   * 调用需要 token 的接口，token 失效时自动重试一次。
   * @param {(token: string) => Promise<any>} fn
   */
  async withToken(fn) {
    let token = await this.getAccessToken();
    let result = await fn(token);
    if (result && TOKEN_ERROR_CODES.has(result.errcode)) {
      this.invalidateToken();
      token = await this.getAccessToken({ force: true });
      result = await fn(token);
    }
    return result;
  }

  /**
   * 上传永久图片素材，返回 media_id（用于封面 thumb_media_id）。
   * 保持 async：保证任何失败都以 rejected Promise 形式暴露，
   * 而不是同步抛出（否则调用方 .catch() 会失效）。
   * @param {Buffer} buffer PNG/JPG 图片数据
   * @param {string} [filename]
   */
  async uploadThumb(buffer, filename = 'cover.png') {
    const contentType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

    return this.withToken(async (token) => {
      const form = new FormData();
      form.append('media', buffer, { filename, contentType });
      const res = await axios.post(`${this.endpoints.addMaterial}?access_token=${token}&type=image`, form, {
        headers: form.getHeaders(),
        timeout: this.timeout,
        maxBodyLength: Infinity,
      });
      if (res.data.errcode) {
        throw new WeChatError(describeApiError(res.data, '上传封面素材'), res.data);
      }
      return res.data;
    });
  }

  /**
   * 上传正文内的图片，返回微信侧可访问的 url。
   * @param {Buffer} buffer
   * @param {string} [filename]
   */
  async uploadContentImage(buffer, filename = 'image.png') {
    const contentType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

    return this.withToken(async (token) => {
      const form = new FormData();
      form.append('media', buffer, { filename, contentType });
      const res = await axios.post(`${this.endpoints.uploadImg}?access_token=${token}`, form, {
        headers: form.getHeaders(),
        timeout: this.timeout,
        maxBodyLength: Infinity,
      });
      if (res.data.errcode) {
        throw new WeChatError(describeApiError(res.data, '上传正文图片'), res.data);
      }
      return res.data.url;
    });
  }

  /**
   * 创建草稿（不会直接群发，需在公众号后台确认发布）。
   * @param {{title, content, thumbMediaId, author?, digest?, showCoverPic?, needOpenComment?}} article
   * @returns {Promise<{media_id: string}>}
   */
  async addDraft(article) {
    const errors = validateArticle(article);
    if (errors.length) {
      throw new WeChatError(`文章字段校验失败:\n  - ${errors.join('\n  - ')}`);
    }

    const payload = {
      articles: [
        {
          title: article.title,
          thumb_media_id: article.thumbMediaId,
          author: article.author || '',
          digest: article.digest || '',
          content: article.content,
          show_cover_pic: article.showCoverPic === undefined ? 1 : article.showCoverPic,
          need_open_comment: article.needOpenComment === undefined ? 0 : article.needOpenComment,
          only_fans_can_comment: 0,
        },
      ],
    };

    return this.withToken(async (token) => {
      const res = await axios.post(`${this.endpoints.addDraft}?access_token=${token}`, payload, {
        timeout: this.timeout,
        maxBodyLength: Infinity,
      });
      if (res.data.errcode) {
        throw new WeChatError(describeApiError(res.data, '创建草稿'), res.data);
      }
      return res.data;
    });
  }

  /** 查询草稿箱总数（可用于连通性自检）。 */
  async getDraftCount() {
    return this.withToken(async (token) => {
      const res = await axios.get(`${this.endpoints.getDraftCount}?access_token=${token}`, {
        timeout: this.timeout,
      });
      if (res.data.errcode) {
        throw new WeChatError(describeApiError(res.data, '查询草稿数'), res.data);
      }
      return res.data;
    });
  }
}

/** config.js 可能不存在或未配置，这里做静默降级。 */
function safeRequireConfig() {
  try {
    return require('../config');
  } catch (err) {
    return null;
  }
}

module.exports = {
  WeChatClient,
  WeChatError,
  validateArticle,
  describeApiError,
  ERROR_HINTS,
  LIMITS,
  API,
};
