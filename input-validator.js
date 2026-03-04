/**
 * 输入验证增强模块
 * 提供全面的输入验证和清洗功能
 */

class InputValidator {
  constructor(options = {}) {
    this.strictMode = options.strictMode !== false;
    this.sanitizeHtml = options.sanitizeHtml !== false;
  }

  /**
   * 验证 URL
   * @param {string} url - 待验证URL
   * @returns {Object} { valid: boolean, error?: string, sanitized?: string }
   */
  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL不能为空' };
    }

    try {
      // 清洗 URL
      let sanitized = url.trim();
      
      // 补全缺失的协议
      if (!sanitized.match(/^https?:\/\//i)) {
        sanitized = 'https://' + sanitized;
      }

      const parsed = new URL(sanitized);
      
      // 检查协议
      if (!['http', 'https'].includes(parsed.protocol)) {
        return { valid: false, error: '仅支持HTTP/HTTPS协议' };
      }

      // 检查域名
      if (!parsed.hostname || parsed.hostname.length < 4) {
        return { valid: false, error: '无效的域名' };
      }

      return { valid: true, sanitized };
    } catch (e) {
      return { valid: false, error: 'URL格式不正确' };
    }
  }

  /**
   * 验证 Email
   * @param {string} email - 待验证邮箱
   * @returns {Object}
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: '邮箱不能为空' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.trim().toLowerCase();

    if (!emailRegex.test(sanitized)) {
      return { valid: false, error: '邮箱格式不正确' };
    }

    return { valid: true, sanitized };
  }

  /**
   * 验证手机号
   * @param {string} phone - 待验证手机号
   * @param {string} country - 国家代码 (默认中国)
   * @returns {Object}
   */
  validatePhone(phone, country = 'CN') {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: '手机号不能为空' };
    }

    const patterns = {
      CN: /^1[3-9]\d{9}$/,
      HK: /^(\+852)?[569]\d{8}$/,
      TW: /^(\+886)?[0-9]{9,10}$/,
      US: /^(\+1)?[2-9]\d{9}$/
    };

    const pattern = patterns[country] || patterns.CN;
    const sanitized = phone.replace(/[\s\-\(\)]/g, '');

    if (!pattern.test(sanitized)) {
      return { valid: false, error: '手机号格式不正确' };
    }

    return { valid: true, sanitized };
  }

  /**
   * 验证文章标题
   * @param {string} title - 待验证标题
   * @param {Object} options - 选项
   * @returns {Object}
   */
  validateTitle(title, options = {}) {
    const {
      minLength = 5,
      maxLength = 100,
      required = true
    } = options;

    if (!title || typeof title !== 'string') {
      return { valid: false, error: '标题不能为空' };
    }

    const sanitized = this.sanitizeText(title.trim());

    if (required && sanitized.length === 0) {
      return { valid: false, error: '标题不能为空' };
    }

    if (sanitized.length < minLength) {
      return { valid: false, error: `标题至少${minLength}个字符` };
    }

    if (sanitized.length > maxLength) {
      return { valid: false, error: `标题最多${maxLength}个字符` };
    }

    return { valid: true, sanitized };
  }

  /**
   * 验证文章内容
   * @param {string} content - 待验证内容
   * @param {Object} options - 选项
   * @returns {Object}
   */
  validateContent(content, options = {}) {
    const {
      minLength = 10,
      maxLength = 50000,
      required = true
    } = options;

    if (!content || typeof content !== 'string') {
      return { valid: false, error: '内容不能为空' };
    }

    // 清洗HTML标签后检查纯文本长度
    const plainText = this.stripHtml(content);
    const sanitized = this.sanitizeText(plainText.trim());

    if (required && sanitized.length === 0) {
      return { valid: false, error: '内容不能为空' };
    }

    if (sanitized.length < minLength) {
      return { valid: false, error: `内容至少${minLength}个字符` };
    }

    if (sanitized.length > maxLength) {
      return { valid: false, error: `内容最多${maxLength}个字符` };
    }

    return { valid: true, sanitized };
  }

  /**
   * 验证配置文件
   * @param {Object} config - 配置对象
   * @param {Object} schema - 验证规则
   * @returns {Object}
   */
  validateConfig(config, schema) {
    const errors = [];
    const validated = {};

    for (const [key, rules] of Object.entries(schema)) {
      const value = config[key];

      // 检查必填
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: key, error: `${key}为必填项` });
        continue;
      }

      // 跳过空值（非必填）
      if (value === undefined || value === null) {
        validated[key] = rules.default || null;
        continue;
      }

      // 类型验证
      if (rules.type) {
        const typeValid = this.validateType(value, rules.type);
        if (!typeValid) {
          errors.push({ field: key, error: `${key}类型错误，期望${rules.type}` });
          continue;
        }
      }

      // 字符串验证
      if (typeof value === 'string') {
        // 长度验证
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({ field: key, error: `${key}长度不能少于${rules.minLength}` });
          continue;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({ field: key, error: `${key}长度不能超过${rules.maxLength}` });
          continue;
        }

        // 格式验证
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({ field: key, error: `${key}格式不正确` });
          continue;
        }

        // URL验证
        if (rules.url) {
          const urlValid = this.validateUrl(value);
          if (!urlValid.valid) {
            errors.push({ field: key, error: urlValid.error });
            continue;
          }
          validated[key] = urlValid.sanitized;
          continue;
        }

        // 枚举验证
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({ field: key, error: `${key}必须是以下值之一: ${rules.enum.join(', ')}` });
          continue;
        }
      }

      // 数值验证
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field: key, error: `${key}最小值为${rules.min}` });
          continue;
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field: key, error: `${key}最大值为${rules.max}` });
          continue;
        }
      }

      validated[key] = value;
    }

    return {
      valid: errors.length === 0,
      errors,
      validated
    };
  }

  /**
   * 验证数据类型
   */
  validateType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'url':
        return this.validateUrl(value).valid;
      case 'email':
        return this.validateEmail(value).valid;
      default:
        return true;
    }
  }

  /**
   * 清洗文本 - 移除危险字符
   * @param {string} text - 待清洗文本
   * @returns {string}
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      .replace(/[\x00-\x1F\x7F]/g, '') // 移除控制字符
      .replace(/[​]/g, '') // 移除零宽空格
      .trim();
  }

  /**
   * 移除HTML标签
   * @param {string} html - HTML字符串
   * @returns {string}
   */
  stripHtml(html) {
    if (!html || typeof html !== 'string') return '';

    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /**
   * 清洗HTML - 保留安全标签
   * @param {string} html - HTML字符串
   * @returns {string}
   */
  sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return '';

    // 允许的标签
    const allowedTags = [
      'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code', 'span', 'div'
    ];

    // 允许的属性
    const allowedAttrs = {
      'a': ['href', 'title'],
      'span': ['class'],
      'div': ['class'],
    };

    let sanitized = html;

    // 移除脚本和样式
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // 移除事件处理
      .replace(/javascript:/gi, '') // 移除 javascript: 协议
      .replace(/data:/gi, ''); // 移除 data: 协议

    return sanitized;
  }

  /**
   * 验证并清洗文章对象
   * @param {Object} article - 文章对象
   * @returns {Object} { valid: boolean, error?: string, article?: Object }
   */
  validateArticle(article) {
    if (!article || typeof article !== 'object') {
      return { valid: false, error: '文章必须是对象' };
    }

    // 验证标题
    const titleResult = this.validateTitle(article.title);
    if (!titleResult.valid) {
      return { valid: false, error: titleResult.error };
    }

    // 验证内容
    const contentResult = this.validateContent(article.content);
    if (!contentResult.valid) {
      return { valid: false, error: contentResult.error };
    }

    // 验证URL
    if (article.url) {
      const urlResult = this.validateUrl(article.url);
      if (!urlResult.valid) {
        return { valid: false, error: urlResult.error };
      }
    }

    // 清洗并返回
    const sanitized = {
      ...article,
      title: titleResult.sanitized,
      content: contentResult.sanitized,
      url: article.url ? this.validateUrl(article.url).sanitized : undefined,
      updatedAt: new Date().toISOString()
    };

    return { valid: true, article: sanitized };
  }
}

/**
 * 验证规则预设
 */
const ValidationSchemas = {
  // 采集配置
  crawl: {
    rssSources: { 
      type: 'array', 
      required: false,
      items: { type: 'url' }
    },
    maxConcurrent: { 
      type: 'number', 
      min: 1, 
      max: 20,
      default: 3 
    },
    timeout: { 
      type: 'number', 
      min: 1000, 
      max: 60000,
      default: 15000 
    }
  },

  // 生成配置
  generate: {
    provider: {
      type: 'string',
      required: true,
      enum: ['openai', 'minimax', 'deepseek', 'zhipu', 'ollama']
    },
    model: { type: 'string', required: true, minLength: 1 },
    temperature: { type: 'number', min: 0, max: 2, default: 0.7 },
    maxTokens: { type: 'number', min: 100, max: 10000, default: 4000 }
  },

  // 发布配置
  publish: {
    appId: { type: 'string', required: true, minLength: 10 },
    appSecret: { type: 'string', required: true, minLength: 10 },
    autoPublish: { type: 'boolean', default: false }
  }
};

module.exports = {
  InputValidator,
  ValidationSchemas
};
