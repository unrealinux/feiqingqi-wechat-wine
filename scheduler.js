/**
 * 定时任务调度器
 * 管理自动采集、生成、发布任务的调度
 */

const cron = require('node-cron');
const { Crawler } = require('./crawler');
const { Aggregator } = require('./aggregator');
const { ArticleGenerator } = require('./generator');
const { WeChatPublisher } = require('./publisher');
const logger = require('./logger');

/**
 * 任务调度器
 */
class TaskScheduler {
  constructor(options = {}) {
    this.config = options;
    this.tasks = new Map();
    this.isRunning = false;
    this.lastRun = null;
    this.runHistory = [];
    
    // 初始化组件
    this.crawler = new Crawler();
    this.aggregator = new Aggregator();
    this.generator = new ArticleGenerator();
    this.publisher = new WeChatPublisher();
  }

  /**
   * 采集任务
   */
  async runCrawl() {
    const startTime = Date.now();
    logger.info('开始定时采集任务');
    
    try {
      const articles = await this.crawler.crawl();
      const duration = Date.now() - startTime;
      
      logger.info('定时采集完成', {
        count: articles.length,
        duration
      });
      
      return { success: true, count: articles.length, duration };
    } catch (error) {
      logger.error('定时采集失败', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * 完整流程任务
   */
  async runFullPipeline() {
    const startTime = Date.now();
    const result = {
      crawl: null,
      generate: null,
      publish: null,
      errors: []
    };

    logger.info('开始定时完整流程');

    try {
      // 1. 采集
      logger.info('步骤1: 采集文章');
      const articles = await this.crawler.crawl();
      result.crawl = { success: true, count: articles.length };

      if (articles.length === 0) {
        result.errors.push('未采集到文章');
        return result;
      }

      // 2. 聚合
      logger.info('步骤2: 聚合文章');
      const aggregated = await this.aggregator.aggregate(articles);

      // 3. 生成
      logger.info('步骤3: 生成文章');
      const generated = await this.generator.generate(aggregated);
      result.generate = { success: true, title: generated.title };

      // 4. 发布
      if (this.config.autoPublish) {
        logger.info('步骤4: 发布文章');
        const published = await this.publisher.publish(generated);
        result.publish = published;
      }

      const duration = Date.now() - startTime;
      logger.info('定时完整流程完成', { duration, result });

      // 记录历史
      this.recordRun('full', result, duration);

      return result;
    } catch (error) {
      logger.error('定时流程失败', { error: error.message });
      result.errors.push(error.message);
      return result;
    }
  }

  /**
   * 记录运行历史
   */
  recordRun(type, result, duration) {
    const record = {
      type,
      timestamp: new Date().toISOString(),
      duration,
      result
    };
    
    this.runHistory.unshift(record);
    
    // 只保留最近100条
    if (this.runHistory.length > 100) {
      this.runHistory = this.runHistory.slice(0, 100);
    }
    
    this.lastRun = record;
  }

  /**
   * 获取调度配置
   */
  getScheduleConfig() {
    return {
      crawl: this.config.crawlSchedule || '0 8 * * *',
      full: this.config.fullSchedule || '0 8 * * *'
    };
  }

  /**
   * 启动调度器
   */
  start() {
    if (this.isRunning) {
      logger.warn('调度器已在运行中');
      return;
    }

    logger.info('启动任务调度器');
    this.isRunning = true;

    // 定时采集任务
    if (this.config.crawlSchedule) {
      const crawlTask = cron.schedule(
        this.config.crawlSchedule,
        () => this.runCrawl(),
        { scheduled: true }
      );
      this.tasks.set('crawl', crawlTask);
      logger.info(`采集任务已调度: ${this.config.crawlSchedule}`);
    }

    // 完整流程任务
    if (this.config.fullSchedule) {
      const fullTask = cron.schedule(
        this.config.fullSchedule,
        () => this.runFullPipeline(),
        { scheduled: true }
      );
      this.tasks.set('full', fullTask);
      logger.info(`完整流程已调度: ${this.config.fullSchedule}`);
    }

    logger.info('任务调度器启动完成', {
      tasks: this.tasks.size,
      schedules: this.getScheduleConfig()
    });
  }

  /**
   * 停止调度器
   */
  stop() {
    logger.info('停止任务调度器');
    
    for (const [name, task] of this.tasks) {
      task.stop();
      logger.info(`已停止任务: ${name}`);
    }
    
    this.tasks.clear();
    this.isRunning = false;
  }

  /**
   * 手动触发任务
   */
  async trigger(type = 'full') {
    logger.info(`手动触发任务: ${type}`);
    
    if (type === 'crawl') {
      return await this.runCrawl();
    } else if (type === 'full') {
      return await this.runFullPipeline();
    } else {
      throw new Error(`未知任务类型: ${type}`);
    }
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      tasks: [...this.tasks.keys()],
      lastRun: this.lastRun,
      history: this.runHistory.slice(0, 10),
      schedules: this.getScheduleConfig()
    };
  }

  /**
   * 列出所有可用调度表达式
   */
  static getCommonSchedules() {
    return {
      'every_hour': '0 * * * *',
      'every_6_hours': '0 */6 * * *',
      'every_12_hours': '0 */12 * * *',
      'daily_6am': '0 6 * * *',
      'daily_8am': '0 8 * * *',
      'daily_noon': '0 12 * * *',
      'daily_6pm': '0 18 * * *',
      'weekly_monday': '0 8 * * 1',
      'weekly_friday': '0 8 * * 5'
    };
  }
}

/**
 * CLI启动
 */
function startScheduler() {
  const config = {
    crawlSchedule: process.env.CRAWL_SCHEDULE || '0 8 * * *',
    fullSchedule: process.env.FULL_SCHEDULE || '0 8 * * *',
    autoPublish: process.env.AUTO_PUBLISH === 'true'
  };

  const scheduler = new TaskScheduler(config);
  
  // 优雅退出
  process.on('SIGTERM', () => {
    logger.info('收到SIGTERM信号，停止调度器');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('收到SIGINT信号，停止调度器');
    scheduler.stop();
    process.exit(0);
  });

  // 启动
  scheduler.start();
  
  // 输出状态
  console.log('调度器状态:');
  console.log(JSON.stringify(scheduler.getStatus(), null, 2));
}

module.exports = { TaskScheduler, startScheduler };
