/**
 * 日志管理系统
 * 支持日志轮转、分类存储、多级别输出
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class LogManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      // 日志目录
      logDir: options.logDir || './logs',
      
      // 日志级别: debug, info, warn, error
      level: options.level || 'info',
      
      // 文件输出
      fileEnabled: options.fileEnabled !== false,
      maxFiles: options.maxFiles || 30,      // 保留天数
      maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB
      
      // 控制台输出
      consoleEnabled: options.consoleEnabled !== false,
      
      // JSON 格式
      jsonFormat: options.jsonFormat || false,
      
      // 时间格式
      timestampFormat: options.timestampFormat || 'YYYY-MM-DD HH:mm:ss',
      
      // 分类日志
      categories: options.categories || ['app', 'crawl', 'error', 'access']
    };
    
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    this.currentLevel = this.levels[this.options.level] || 1;
    this.streams = new Map();
    
    this.init();
  }

  /**
   * 初始化日志系统
   */
  init() {
    // 创建日志目录
    if (!fs.existsSync(this.options.logDir)) {
      fs.mkdirSync(this.options.logDir, { recursive: true });
    }
    
    // 初始化分类日志文件
    if (this.options.fileEnabled) {
      this.initCategoryLogs();
    }
  }

  /**
   * 初始化分类日志
   */
  initCategoryLogs() {
    const today = this.getDateString();
    
    for (const category of this.options.categories) {
      const logFile = path.join(
        this.options.logDir,
        `${category}_${today}.log`
      );
      
      // 确保文件存在
      if (!fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '');
      }
      
      this.streams.set(category, {
        file: logFile,
        date: today,
        size: 0
      });
    }
  }

  /**
   * 写日志
   * @param {string} level - 日志级别
   * @param {string} category - 日志分类
   * @param {string} message - 日志消息
   * @param {Object} meta - 附加数据
   */
  write(level, category, message, meta = {}) {
    // 级别过滤
    if (this.levels[level] < this.currentLevel) {
      return;
    }

    const timestamp = this.formatTimestamp(new Date());
    const logEntry = this.formatEntry(level, category, message, meta, timestamp);

    // 控制台输出
    if (this.options.consoleEnabled) {
      this.writeToConsole(level, logEntry);
    }

    // 文件输出
    if (this.options.fileEnabled) {
      this.writeToFile(category, logEntry);
    }

    // 事件通知
    this.emit('log', { level, category, message, meta, timestamp });
  }

  /**
   * 格式化日志条目
   */
  formatEntry(level, category, message, meta, timestamp) {
    const entry = {
      timestamp,
      level: level.toUpperCase(),
      category,
      message,
      ...meta
    };

    if (this.options.jsonFormat) {
      return JSON.stringify(entry) + '\n';
    }

    // 文本格式
    let formatted = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;
    
    if (Object.keys(meta).length > 0) {
      formatted += ' ' + JSON.stringify(meta);
    }
    
    return formatted + '\n';
  }

  /**
   * 写入控制台
   */
  writeToConsole(level, entry) {
    const colors = {
      debug: '\x1b[36m',   // cyan
      info: '\x1b[32m',    // green
      warn: '\x1b[33m',    // yellow
      error: '\x1b[31m'    // red
    };
    
    const color = colors[level] || '';
    const reset = '\x1b[0m';
    
    console.log(`${color}${entry}${reset}`);
  }

  /**
   * 写入文件
   */
  writeToFile(category, entry) {
    let streamInfo = this.streams.get(category);
    
    if (!streamInfo) {
      // 新分类
      streamInfo = {
        file: path.join(
          this.options.logDir,
          `${category}_${this.getDateString()}.log`
        ),
        date: this.getDateString(),
        size: 0
      };
      this.streams.set(category, streamInfo);
    }

    // 检查日期变化（跨天）
    const today = this.getDateString();
    if (streamInfo.date !== today) {
      this.rotateFile(category);
      streamInfo = this.streams.get(category);
    }

    // 检查文件大小
    if (streamInfo.size >= this.options.maxSize) {
      this.rotateFile(category);
      streamInfo = this.streams.get(category);
    }

    // 写入文件
    try {
      fs.appendFileSync(streamInfo.file, entry);
      streamInfo.size += Buffer.byteLength(entry, 'utf8');
    } catch (error) {
      console.error('日志写入失败:', error.message);
    }
  }

  /**
   * 轮转日志文件
   */
  rotateFile(category) {
    const streamInfo = this.streams.get(category);
    if (!streamInfo) return;

    const timestamp = Date.now();
    const rotatedFile = streamInfo.file.replace(
      '.log',
      `_${timestamp}.log`
    );

    try {
      if (fs.existsSync(streamInfo.file)) {
        fs.renameSync(streamInfo.file, rotatedFile);
        
        // 压缩旧文件（可选）
        this.compressOldLogs(category);
      }
      
      // 重置流信息
      streamInfo.file = path.join(
        this.options.logDir,
        `${category}_${this.getDateString()}.log`
      );
      streamInfo.date = this.getDateString();
      streamInfo.size = 0;
      
      // 创建新文件
      fs.writeFileSync(streamInfo.file, '');
    } catch (error) {
      console.error('日志轮转失败:', error.message);
    }
  }

  /**
   * 压缩旧的日志文件
   */
  compressOldLogs(category) {
    const files = fs.readdirSync(this.options.logDir)
      .filter(f => f.startsWith(category) && f.endsWith('.log') && !f.includes('_'))
      .map(f => ({
        name: f,
        path: path.join(this.options.logDir, f),
        time: fs.statSync(path.join(this.options.logDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    // 删除超期文件
    const maxAge = this.options.maxFiles * 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (let i = this.options.maxFiles; i < files.length; i++) {
      try {
        fs.unlinkSync(files[i].path);
      } catch (e) {
        // 忽略删除错误
      }
    }
  }

  /**
   * 获取日期字符串
   */
  getDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 格式化时间戳
   */
  formatTimestamp(date) {
    const str = this.options.timestampFormat;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return str
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * 便捷方法
   */
  debug(category, message, meta) {
    this.write('debug', category, message, meta);
  }

  info(category, message, meta) {
    this.write('info', category, message, meta);
  }

  warn(category, message, meta) {
    this.write('warn', category, message, meta);
  }

  error(category, message, meta) {
    this.write('error', category, message, meta);
  }

  /**
   * 获取日志统计
   */
  getStats() {
    const stats = {
      categories: {},
      totalSize: 0
    };

    for (const [category, info] of this.streams) {
      try {
        const fileSize = fs.existsSync(info.file) 
          ? fs.statSync(info.file).size 
          : 0;
        
        stats.categories[category] = {
          currentFile: info.file,
          currentSize: fileSize,
          lastUpdate: info.date
        };
        stats.totalSize += fileSize;
      } catch (e) {
        // 忽略错误
      }
    }

    return stats;
  }

  /**
   * 清理旧日志
   */
  cleanup() {
    const maxAge = this.options.maxFiles * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    const files = fs.readdirSync(this.options.logDir)
      .filter(f => f.endsWith('.log'));

    for (const file of files) {
      const filePath = path.join(this.options.logDir, file);
      const fileTime = fs.statSync(filePath).mtime.getTime();
      
      if (now - fileTime > maxAge) {
        try {
          fs.unlinkSync(filePath);
          console.log(`已清理过期日志: ${file}`);
        } catch (e) {
          // 忽略
        }
      }
    }
  }

  /**
   * 关闭日志系统
   */
  close() {
    this.streams.clear();
  }
}

/**
 * 创建日志管理器实例
 */
function createLogger(options = {}) {
  return new LogManager(options);
}

module.exports = {
  LogManager,
  createLogger
};
