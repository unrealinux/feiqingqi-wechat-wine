/**
 * 结构化日志模块
 * 支持JSON格式输出，便于日志收集和分析
 */

const fs = require('fs');
const path = require('path');

// 日志级别
const Levels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// 当前级别
let currentLevel = Levels.INFO;

// 输出目标
let outputStream = null;
let logFile = null;

/**
 * 初始化日志系统
 */
function init(options = {}) {
  const {
    level = 'info',
    file = 'logs/app.log',
    console: consoleOutput = true
  } = options;
  
  // 设置级别
  currentLevel = Levels[level.toUpperCase()] || Levels.INFO;
  
  // 文件输出
  if (file) {
    const logDir = path.dirname(file);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    logFile = file;
  }
  
  // 控制台输出
  if (!consoleOutput) {
    outputStream = fs.createWriteStream(logFile, { flags: 'a' });
  }
}

/**
 * 创建日志条目
 */
function createEntry(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...meta,
    pid: process.pid,
    hostname: require('os').hostname()
  };
}

/**
 * 输出日志
 */
function output(entry) {
  const line = JSON.stringify(entry);
  
  // 控制台输出
  if (outputStream === null) {
    const color = {
      DEBUG: '\x1b[36m',
      INFO: '\x1b[32m',
      WARN: '\x1b[33m',
      ERROR: '\x1b[31m'
    }[entry.level] || '';
    
    console.log(`${color}${line}\x1b[0m`);
  }
  
  // 文件输出
  if (logFile) {
    fs.appendFileSync(logFile, line + '\n');
  }
  
  // 自定义输出流
  if (outputStream && outputStream !== null) {
    outputStream.write(line + '\n');
  }
}

/**
 * 日志方法
 */
const logger = {
  debug(message, meta) {
    if (currentLevel <= Levels.DEBUG) {
      output(createEntry('DEBUG', message, meta));
    }
  },
  
  info(message, meta) {
    if (currentLevel <= Levels.INFO) {
      output(createEntry('INFO', message, meta));
    }
  },
  
  warn(message, meta) {
    if (currentLevel <= Levels.WARN) {
      output(createEntry('WARN', message, meta));
    }
  },
  
  error(message, meta) {
    if (currentLevel <= Levels.ERROR) {
      output(createEntry('ERROR', message, meta));
    }
  },
  
  // 便捷方法：记录操作
  operation(name, fn) {
    const start = Date.now();
    logger.info(`开始: ${name}`);
    
    try {
      const result = fn();
      if (result && result.then) {
        return result.then(data => {
          logger.info(`完成: ${name}`, { duration: Date.now() - start });
          return data;
        }).catch(err => {
          logger.error(`失败: ${name}`, { error: err.message, duration: Date.now() - start });
          throw err;
        });
      }
      logger.info(`完成: ${name}`, { duration: Date.now() - start });
      return result;
    } catch (err) {
      logger.error(`失败: ${name}`, { error: err.message, duration: Date.now() - start });
      throw err;
    }
  },
  
  // 便捷方法：异步操作
  async operationAsync(name, fn) {
    const start = Date.now();
    logger.info(`开始: ${name}`);
    
    try {
      const data = await fn();
      logger.info(`完成: ${name}`, { duration: Date.now() - start });
      return data;
    } catch (err) {
      logger.error(`失败: ${name}`, { error: err.message, duration: Date.now() - start });
      throw err;
    }
  },
  
  // 设置级别
  setLevel(level) {
    currentLevel = Levels[level.toUpperCase()] || Levels.INFO;
  },
  
  // 关闭日志系统
  close() {
    if (outputStream && outputStream !== null) {
      outputStream.end();
    }
  }
};

// 自动初始化
if (process.env.LOG_LEVEL) {
  logger.setLevel(process.env.LOG_LEVEL);
}

module.exports = logger;
module.exports.default = logger;
module.exports.Levels = Levels;
