/**
 * 错误处理与健壮性模块
 * - 错误分类（可恢复/致命）
 * - 带指数退避的重试机制
 * - 全局错误处理器
 */

/**
 * 错误类型枚举
 */
const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',           // 网络错误（可重试）
  TIMEOUT: 'TIMEOUT_ERROR',           // 超时错误（可重试）
  RATE_LIMIT: 'RATE_LIMIT_ERROR',     // 速率限制（可重试，需等待）
  AUTH: 'AUTH_ERROR',                 // 认证错误（不可重试）
  VALIDATION: 'VALIDATION_ERROR',     // 验证错误（不可重试）
  NOT_FOUND: 'NOT_FOUND_ERROR',       // 资源不存在（不可重试）
  PARSE: 'PARSE_ERROR',               // 解析错误（不可重试）
  SYSTEM: 'SYSTEM_ERROR',             // 系统错误（视情况重试）
  UNKNOWN: 'UNKNOWN_ERROR',           // 未知错误
};

/**
 * 可恢复的错误类型
 */
const RecoverableErrors = [
  ErrorTypes.NETWORK,
  ErrorTypes.TIMEOUT,
  ErrorTypes.RATE_LIMIT,
  ErrorTypes.SYSTEM,
];

/**
 * 自定义应用错误类
 */
class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, options = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.isRecoverable = RecoverableErrors.includes(type);
    this.originalError = options.originalError || null;
    this.context = options.context || {};
    this.timestamp = new Date().toISOString();
    this.retryCount = options.retryCount || 0;
    
    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * 是否可以重试
   */
  canRetry(maxRetries = 3) {
    return this.isRecoverable && this.retryCount < maxRetries;
  }

  /**
   * 创建带重试计数的副本
   */
  withRetry() {
    return new AppError(this.message, this.type, {
      ...this.context,
      originalError: this.originalError,
      retryCount: this.retryCount + 1,
    });
  }

  /**
   * 转换为JSON
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      isRecoverable: this.isRecoverable,
      context: this.context,
      timestamp: this.timestamp,
      retryCount: this.retryCount,
      stack: this.stack,
    };
  }
}

/**
 * 从原生错误创建AppError
 */
function createAppError(error, context = {}) {
  // 已经是AppError
  if (error instanceof AppError) {
    return error;
  }

  // Axios错误
  if (error.isAxiosError) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new AppError(error.message, ErrorTypes.TIMEOUT, { originalError: error, context });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new AppError(error.message, ErrorTypes.NETWORK, { originalError: error, context });
    }
    if (error.response?.status === 429) {
      return new AppError('Rate limit exceeded', ErrorTypes.RATE_LIMIT, { 
        originalError: error, 
        context: { ...context, retryAfter: error.response.headers['retry-after'] }
      });
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return new AppError('Authentication failed', ErrorTypes.AUTH, { originalError: error, context });
    }
    if (error.response?.status === 404) {
      return new AppError('Resource not found', ErrorTypes.NOT_FOUND, { originalError: error, context });
    }
    return new AppError(error.message, ErrorTypes.NETWORK, { originalError: error, context });
  }

  // JSON解析错误
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return new AppError(error.message, ErrorTypes.PARSE, { originalError: error, context });
  }

  // 默认为系统错误
  return new AppError(error.message || 'Unknown error', ErrorTypes.UNKNOWN, { originalError: error, context });
}

/**
 * 重试配置
 */
const DefaultRetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,    // 初始延迟 1秒
  maxDelay: 30000,       // 最大延迟 30秒
  backoffFactor: 2,      // 指数退避因子
  jitter: true,          // 添加随机抖动避免惊群效应
};

/**
 * 计算重试延迟（指数退避 + 抖动）
 */
function calculateDelay(retryCount, config = DefaultRetryConfig) {
  const baseDelay = Math.min(
    config.initialDelay * Math.pow(config.backoffFactor, retryCount),
    config.maxDelay
  );
  
  if (config.jitter) {
    // 添加 0-50% 的随机抖动
    return baseDelay * (0.5 + Math.random() * 0.5);
  }
  return baseDelay;
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的异步操作执行器
 * @param {Function} fn - 要执行的异步函数
 * @param {Object} options - 重试配置
 * @returns {Promise} 执行结果
 */
async function withRetry(fn, options = {}) {
  const config = { ...DefaultRetryConfig, ...options };
  let lastError = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = createAppError(error);
      lastError.retryCount = attempt;

      // 检查是否可以重试
      if (!lastError.isRecoverable || attempt >= config.maxRetries) {
        throw lastError;
      }

      // 特殊处理速率限制
      if (lastError.type === ErrorTypes.RATE_LIMIT && lastError.context?.retryAfter) {
        const waitTime = parseInt(lastError.context.retryAfter) * 1000;
        console.log(`速率限制，等待 ${waitTime}ms 后重试...`);
        await sleep(waitTime);
      } else {
        const delay = calculateDelay(attempt, config);
        console.log(`操作失败 (${lastError.type})，${Math.round(delay)}ms 后重试 (${attempt + 1}/${config.maxRetries})...`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * 批量执行（带并发控制）
 * @param {Array} items - 要处理的项目数组
 * @param {Function} fn - 处理函数
 * @param {Object} options - 配置选项
 */
async function withBatch(items, fn, options = {}) {
  const {
    concurrency = 5,
    continueOnError = true,
    onProgress = null,
  } = options;

  const results = [];
  const errors = [];
  let completed = 0;

  // 创建任务队列
  const queue = [...items];
  const total = items.length;

  async function processQueue() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      try {
        const result = await fn(item);
        results.push({ status: 'fulfilled', value: result, item });
      } catch (error) {
        const appError = createAppError(error, { item });
        errors.push(appError);
        results.push({ status: 'rejected', reason: appError, item });
        
        if (!continueOnError) {
          throw appError;
        }
      } finally {
        completed++;
        if (onProgress) {
          onProgress(completed, total, item);
        }
      }
    }
  }

  // 并发执行
  const workers = Array(Math.min(concurrency, items.length))
    .fill(null)
    .map(() => processQueue());

  await Promise.all(workers);

  return { results, errors, success: results.filter(r => r.status === 'fulfilled').length };
}

/**
 * 全局错误处理器
 */
class GlobalErrorHandler {
  constructor(logger = null) {
    this.logger = logger;
    this.handlers = new Map();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // 未捕获的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      const error = createAppError(reason);
      console.error('[UNHANDLED REJECTION]', error.toJSON());
      if (this.logger) {
        this.logger.error('Unhandled Promise Rejection', { error: error.toJSON() });
      }
      // 对于致命错误，退出进程
      if (!error.isRecoverable) {
        process.exit(1);
      }
    });

    // 未捕获的异常
    process.on('uncaughtException', (error) => {
      const appError = createAppError(error);
      console.error('[UNCAUGHT EXCEPTION]', appError.toJSON());
      if (this.logger) {
        this.logger.error('Uncaught Exception', { error: appError.toJSON() });
      }
      // 未捕获异常通常是致命的
      process.exit(1);
    });
  }

  /**
   * 注册特定错误类型的处理器
   */
  registerHandler(errorType, handler) {
    this.handlers.set(errorType, handler);
  }

  /**
   * 处理错误
   */
  async handle(error) {
    const appError = createAppError(error);
    
    const handler = this.handlers.get(appError.type);
    if (handler) {
      try {
        return await handler(appError);
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError);
      }
    }

    // 默认处理：记录日志
    if (this.logger) {
      this.logger.error(appError.message, appError.toJSON());
    }

    return { handled: false, error: appError };
  }
}

/**
 * 断路器模式
 */
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000; // 1分钟
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      } else {
        throw new AppError('Circuit breaker is OPEN', ErrorTypes.RATE_LIMIT);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
    } else if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }
}

module.exports = {
  ErrorTypes,
  RecoverableErrors,
  AppError,
  createAppError,
  withRetry,
  withBatch,
  sleep,
  calculateDelay,
  GlobalErrorHandler,
  CircuitBreaker,
  DefaultRetryConfig,
};
