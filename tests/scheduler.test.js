/**
 * TaskScheduler 测试
 *
 * 注意：scheduler.js 实现的是「采集 -> 聚合 -> 生成 -> 发布」流水线调度器，
 * 不是通用任务调度器。历史测试按 scheduleInterval/scheduleCron/stopAll 等
 * 通用 API 编写，与该实现完全不同，属于测试与实现脱节。
 *
 * 这里改为覆盖真实公开接口，并 mock 掉依赖网络与配置的重组件。
 */

jest.mock('node-cron', () => ({
  schedule: jest.fn(() => ({ stop: jest.fn(), start: jest.fn() }))
}));

jest.mock('../crawler', () => ({ Crawler: jest.fn() }));
jest.mock('../aggregator', () => ({ Aggregator: jest.fn() }));
jest.mock('../generator', () => ({ ArticleGenerator: jest.fn() }));
jest.mock('../publisher', () => ({ WeChatPublisher: jest.fn() }));
jest.mock('../logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const cron = require('node-cron');
const { Crawler } = require('../crawler');
const { Aggregator } = require('../aggregator');
const { ArticleGenerator } = require('../generator');
const { WeChatPublisher } = require('../publisher');
const TaskScheduler = require('../scheduler');

describe('TaskScheduler', () => {
  let scheduler;
  let crawler;
  let aggregator;
  let generator;
  let publisher;

  beforeEach(() => {
    jest.clearAllMocks();

    crawler = { crawl: jest.fn().mockResolvedValue([{ title: '素材一', content: '正文' }]) };
    aggregator = { aggregate: jest.fn().mockResolvedValue({ categories: {}, articles: [] }) };
    generator = { generate: jest.fn().mockResolvedValue({ title: '生成的标题', content: '<p>x</p>' }) };
    publisher = { publish: jest.fn().mockResolvedValue({ success: true, url: 'https://mp.weixin.qq.com/x' }) };

    Crawler.mockImplementation(() => crawler);
    Aggregator.mockImplementation(() => aggregator);
    ArticleGenerator.mockImplementation(() => generator);
    WeChatPublisher.mockImplementation(() => publisher);

    scheduler = new TaskScheduler({ crawlSchedule: '0 8 * * *', fullSchedule: '0 8 * * *' });
  });

  describe('constructor', () => {
    test('should instantiate the pipeline components', () => {
      expect(Crawler).toHaveBeenCalledTimes(1);
      expect(Aggregator).toHaveBeenCalledTimes(1);
      expect(ArticleGenerator).toHaveBeenCalledTimes(1);
      expect(WeChatPublisher).toHaveBeenCalledTimes(1);
    });

    test('should start in a non-running state with no tasks', () => {
      const status = scheduler.getStatus();
      expect(status.isRunning).toBe(false);
      expect(status.tasks).toEqual([]);
      expect(status.lastRun).toBeNull();
      expect(status.history).toEqual([]);
    });
  });

  describe('getScheduleConfig', () => {
    test('should use the provided schedules', () => {
      expect(scheduler.getScheduleConfig()).toEqual({ crawl: '0 8 * * *', full: '0 8 * * *' });
    });

    test('should fall back to daily 8am defaults', () => {
      const fresh = new TaskScheduler();
      expect(fresh.getScheduleConfig()).toEqual({ crawl: '0 8 * * *', full: '0 8 * * *' });
    });
  });

  describe('runCrawl', () => {
    test('should return count and duration on success', async () => {
      const result = await scheduler.runCrawl();
      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      expect(typeof result.duration).toBe('number');
    });

    test('should return failure object instead of throwing', async () => {
      crawler.crawl.mockRejectedValueOnce(new Error('网络超时'));
      const result = await scheduler.runCrawl();
      expect(result.success).toBe(false);
      expect(result.error).toBe('网络超时');
    });
  });

  describe('runFullPipeline', () => {
    test('should skip publishing when autoPublish is off', async () => {
      const result = await scheduler.runFullPipeline();

      expect(result.crawl).toEqual({ success: true, count: 1 });
      expect(result.generate).toEqual({ success: true, title: '生成的标题' });
      expect(result.publish).toBeNull();
      expect(publisher.publish).not.toHaveBeenCalled();
      expect(result.errors).toEqual([]);
    });

    test('should publish when autoPublish is on', async () => {
      const autoScheduler = new TaskScheduler({ autoPublish: true });
      const result = await autoScheduler.runFullPipeline();

      expect(publisher.publish).toHaveBeenCalledTimes(1);
      expect(result.publish).toEqual({ success: true, url: 'https://mp.weixin.qq.com/x' });
      // runFullPipeline 内部会记录一次运行历史
      expect(autoScheduler.getStatus().history).toHaveLength(1);
    });

    test('should report an error when nothing was crawled', async () => {
      crawler.crawl.mockResolvedValueOnce([]);
      const result = await scheduler.runFullPipeline();

      expect(result.errors).toContain('未采集到文章');
      expect(generator.generate).not.toHaveBeenCalled();
    });

    test('should capture pipeline failures without throwing', async () => {
      generator.generate.mockRejectedValueOnce(new Error('LLM 调用失败'));
      const result = await scheduler.runFullPipeline();

      expect(result.errors).toContain('LLM 调用失败');
      expect(scheduler.getStatus().history).toHaveLength(1);
    });
  });

  describe('recordRun', () => {
    test('should prepend the newest record and set lastRun', () => {
      scheduler.recordRun('crawl', { ok: 1 }, 120);
      scheduler.recordRun('full', { ok: 2 }, 340);

      const status = scheduler.getStatus();
      expect(status.lastRun.type).toBe('full');
      expect(status.lastRun.duration).toBe(340);
      expect(status.history[0].type).toBe('full');
      expect(status.history[1].type).toBe('crawl');
    });

    test('should keep at most 100 records', () => {
      for (let i = 0; i < 130; i++) {
        scheduler.recordRun('crawl', { i }, i);
      }
      expect(scheduler.runHistory).toHaveLength(100);
      expect(scheduler.runHistory[0].duration).toBe(129);
    });
  });

  describe('getStatus', () => {
    test('should expose only the latest 10 history entries', () => {
      for (let i = 0; i < 15; i++) {
        scheduler.recordRun('crawl', { i }, i);
      }
      expect(scheduler.getStatus().history).toHaveLength(10);
      expect(scheduler.runHistory).toHaveLength(15);
    });
  });

  describe('start and stop', () => {
    test('should schedule both jobs and mark as running', () => {
      scheduler.start();

      expect(cron.schedule).toHaveBeenCalledTimes(2);
      expect(scheduler.getStatus().isRunning).toBe(true);
      expect(scheduler.getStatus().tasks.sort()).toEqual(['crawl', 'full']);
    });

    test('should not double-schedule when already running', () => {
      scheduler.start();
      scheduler.start();
      expect(cron.schedule).toHaveBeenCalledTimes(2);
    });

    test('should stop every task and reset running state', () => {
      scheduler.start();
      const tasks = [...scheduler.tasks.values()];

      scheduler.stop();

      tasks.forEach(task => expect(task.stop).toHaveBeenCalled());
      expect(scheduler.getStatus().isRunning).toBe(false);
      expect(scheduler.getStatus().tasks).toEqual([]);
    });
  });

  describe('trigger', () => {
    test('should run the crawl task', async () => {
      const result = await scheduler.trigger('crawl');
      expect(result.success).toBe(true);
      expect(crawler.crawl).toHaveBeenCalledTimes(1);
    });

    test('should run the full pipeline by default', async () => {
      const result = await scheduler.trigger();
      expect(result.crawl).toBeDefined();
      expect(generator.generate).toHaveBeenCalledTimes(1);
    });

    test('should reject unknown task types', async () => {
      await expect(scheduler.trigger('nope')).rejects.toThrow('未知任务类型: nope');
    });
  });

  describe('getCommonSchedules', () => {
    test('should expose reusable cron expressions', () => {
      const schedules = TaskScheduler.getCommonSchedules();
      expect(schedules.daily_8am).toBe('0 8 * * *');
      expect(Object.values(schedules).every(v => typeof v === 'string' && v.split(' ').length === 5)).toBe(true);
    });
  });

  describe('module exports', () => {
    test('should support both default and named import styles', () => {
      const mod = require('../scheduler');
      expect(typeof mod).toBe('function');
      expect(mod.TaskScheduler).toBe(mod);
      expect(typeof mod.startScheduler).toBe('function');
    });
  });
});
