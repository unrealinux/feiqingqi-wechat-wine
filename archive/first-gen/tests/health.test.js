/**
 * health.js 测试
 *
 * 计数器是爬虫运行的观测面，report() 还被 /health 端点序列化输出。
 * 关注两点：增量正确、快照与内部状态隔离（避免调用方改坏真实计数）。
 */

const {
  health,
  incCrawled,
  incCrawlFailure,
  incAggregated,
  incGenerated,
  incPublished,
  report
} = require('../health');

/** 读取当前计数快照 */
const counters = () => report().counters;

describe('health counters', () => {
  test('incCrawled 支持默认步长与自定义步长', () => {
    const before = counters().crawled;
    incCrawled();
    expect(counters().crawled).toBe(before + 1);
    incCrawled(4);
    expect(counters().crawled).toBe(before + 5);
  });

  test('各计数互相独立', () => {
    const before = counters();
    incCrawlFailure(2);
    incAggregated(3);
    incGenerated(5);
    incPublished(7);
    const after = counters();
    expect(after.crawlFailures).toBe(before.crawlFailures + 2);
    expect(after.aggregated).toBe(before.aggregated + 3);
    expect(after.generated).toBe(before.generated + 5);
    expect(after.published).toBe(before.published + 7);
  });

  test('计数时同步刷新对应的时间戳', () => {
    incCrawled();
    const crawlAt = report().lastTimestamps.crawl;
    expect(typeof crawlAt).toBe('number');
    expect(crawlAt).toBeLessThanOrEqual(Date.now());
  });

  test('crawl 与 crawlFailure 共用 crawl 时间戳', () => {
    incCrawlFailure();
    const afterFailure = report().lastTimestamps.crawl;
    incCrawled();
    expect(report().lastTimestamps.crawl).toBeGreaterThanOrEqual(afterFailure);
  });
});

describe('report 快照隔离', () => {
  test('返回结构包含 counters 与 lastTimestamps', () => {
    const snap = report();
    expect(snap).toHaveProperty('startedAt');
    expect(snap).toHaveProperty('counters');
    expect(snap).toHaveProperty('lastTimestamps');
  });

  test('修改快照不会影响内部计数', () => {
    const snap = report();
    const original = health.counters.crawled;
    snap.counters.crawled = 999999;
    expect(health.counters.crawled).toBe(original);
    expect(counters().crawled).toBe(original);
  });

  test('连续两次快照是不同对象（可安全序列化）', () => {
    const a = report();
    const b = report();
    expect(a).not.toBe(b);
    expect(JSON.parse(JSON.stringify(a))).toEqual(a);
  });
});
