/**
 * 敏感数据加密模块
 * 用于加密存储 API Key、密码等敏感配置
 */

const crypto = require('crypto');

class SecretManager {
  constructor(options = {}) {
    this.algorithm = options.algorithm || 'aes-256-gcm';
    this.keyLength = options.keyLength || 32;
    this.ivLength = options.ivLength || 16;
    this.tagLength = options.tagLength || 16;
    this.saltLength = options.saltLength || 64;
    
    // 从环境变量或配置获取主密钥
    this.masterKey = this.getMasterKey();
  }

  /**
   * 获取主密钥
   * 优先级: 环境变量 > 配置文件 > 生成随机密钥
   */
  getMasterKey() {
    // 优先使用环境变量中的主密钥
    const envKey = process.env.ENCRYPTION_KEY;
    if (envKey && envKey.length >= 32) {
      return Buffer.from(envKey.slice(0, 32), 'utf-8');
    }
    
    // 使用默认密钥（仅开发环境）
    const defaultKey = process.env.NODE_ENV === 'production' 
      ? null 
      : 'dev-secret-key-32bytes!';
    
    if (defaultKey) {
      return crypto.scryptSync(defaultKey, 'salt', this.keyLength);
    }
    
    throw new Error('请设置 ENCRYPTION_KEY 环境变量用于生产环境');
  }

  /**
   * 加密敏感数据
   * @param {string} plaintext - 明文
   * @returns {string} 加密后的字符串 (base64)
   */
  encrypt(plaintext) {
    if (!plaintext) return '';
    
    // 生成随机 IV
    const iv = crypto.randomBytes(this.ivLength);
    
    // 创建加密器
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
    
    // 加密
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    // 获取认证标签
    const tag = cipher.getAuthTag();
    
    // 组合: IV + Tag + Encrypted Data
    const combined = Buffer.concat([iv, tag, encrypted]);
    
    return combined.toString('base64');
  }

  /**
   * 解密敏感数据
   * @param {string} encryptedText - 加密字符串 (base64)
   * @returns {string} 明文
   */
  decrypt(encryptedText) {
    if (!encryptedText) return '';
    
    try {
      // 解码 base64
      const combined = Buffer.from(encryptedText, 'base64');
      
      // 提取 IV, Tag, Encrypted Data
      const iv = combined.subarray(0, this.ivLength);
      const tag = combined.subarray(this.ivLength, this.ivLength + this.tagLength);
      const encrypted = combined.subarray(this.ivLength + this.tagLength);
      
      // 创建解密器
      const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
      decipher.setAuthTag(tag);
      
      // 解密
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('解密失败:', error.message);
      return '';
    }
  }

  /**
   * 加密配置对象中的敏感字段
   * @param {Object} config - 配置对象
   * @param {Array<string>} sensitiveFields - 敏感字段名
   * @returns {Object} 加密后的配置
   */
  encryptConfig(config, sensitiveFields = []) {
    const encrypted = { ...config };
    
    for (const field of sensitiveFields) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        // 检查是否已经加密
        if (!this.isEncrypted(encrypted[field])) {
          encrypted[field] = this.encrypt(encrypted[field]);
        }
      }
    }
    
    return encrypted;
  }

  /**
   * 解密配置对象中的敏感字段
   * @param {Object} config - 配置对象
   * @param {Array<string>} sensitiveFields - 敏感字段名
   * @returns {Object} 解密后的配置
   */
  decryptConfig(config, sensitiveFields = []) {
    const decrypted = { ...config };
    
    for (const field of sensitiveFields) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        if (this.isEncrypted(decrypted[field])) {
          decrypted[field] = this.decrypt(decrypted[field]);
        }
      }
    }
    
    return decrypted;
  }

  /**
   * 检查字符串是否已加密
   * @param {string} text - 待检查文本
   * @returns {boolean}
   */
  isEncrypted(text) {
    if (!text || text.length < 24) return false;
    
    try {
      const buffer = Buffer.from(text, 'base64');
      return buffer.length >= 33; // IV(16) + Tag(16) + min data(1)
    } catch {
      return false;
    }
  }

  /**
   * 生成随机密钥
   * @param {number} length - 密钥长度
   * @returns {string}
   */
  generateKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * 创建加密配置文件的工具
   * @param {Object} config - 原始配置
   * @param {Array<string>} sensitiveFields - 敏感字段列表
   */
  static createEncryptedConfig(config, sensitiveFields) {
    const manager = new SecretManager();
    return manager.encryptConfig(config, sensitiveFields);
  }

  /**
   * 从加密配置解密
   * @param {Object} encryptedConfig - 加密配置
   * @param {Array<string>} sensitiveFields - 敏感字段列表
   */
  static decryptConfig(encryptedConfig, sensitiveFields) {
    const manager = new SecretManager();
    return manager.decryptConfig(encryptedConfig, sensitiveFields);
  }
}

/**
 * 环境变量加密工具
 * 用于加密 .env 文件中的敏感值
 */
class EnvEncryptor {
  constructor() {
    this.secretManager = new SecretManager();
    this.sensitiveKeys = [
      'OPENAI_API_KEY', 'LLM_API_KEY',
      'WECHAT_SECRET', 'WECHAT_TOKEN', 'WECHAT_KEY',
      'JUHE_API_KEY', 'TIANAPI_KEY',
      'DB_PASSWORD', 'REDIS_PASSWORD',
      'API_KEY', 'SECRET', 'PASSWORD', 'TOKEN'
    ];
  }

  /**
   * 加密 .env 文件
   * @param {string} envPath - .env 文件路径
   */
  async encryptEnvFile(envPath) {
    const fs = require('fs');
    const content = await fs.promises.readFile(envPath, 'utf8');
    
    const lines = content.split('\n');
    const encrypted = lines.map(line => {
      // 跳过注释和空行
      if (!line.trim() || line.trim().startsWith('#')) {
        return line;
      }
      
      const [key, ...valueParts] = line.split('=');
      if (!key || valueParts.length === 0) return line;
      
      const value = valueParts.join('=').trim();
      const keyUpper = key.trim().toUpperCase();
      
      // 检查是否是敏感字段
      const isSensitive = this.sensitiveKeys.some(
        k => keyUpper.includes(k) && value && value !== 'your_' + k.toLowerCase() + '_here'
      );
      
      if (isSensitive && !this.secretManager.isEncrypted(value)) {
        const encryptedValue = this.secretManager.encrypt(value);
        return `${key}=ENC:${encryptedValue}`;
      }
      
      return line;
    });
    
    return encrypted.join('\n');
  }

  /**
   * 解密环境变量
   * @param {string} value - 环境变量值
   * @returns {string} 解密后的值
   */
  decryptValue(value) {
    if (typeof value !== 'string') return value;
    
    if (value.startsWith('ENC:')) {
      const encrypted = value.slice(4);
      return this.secretManager.decrypt(encrypted);
    }
    
    return value;
  }

  /**
   * 加载并解密环境变量
   * @param {Object} processEnv - process.env
   * @returns {Object} 解密后的环境变量
   */
  decryptEnv(processEnv) {
    const decrypted = { ...processEnv };
    
    for (const key of Object.keys(decrypted)) {
      if (typeof decrypted[key] === 'string') {
        decrypted[key] = this.decryptValue(decrypted[key]);
      }
    }
    
    return decrypted;
  }
}

module.exports = {
  SecretManager,
  EnvEncryptor
};
