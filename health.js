"use strict";

// 简单的健康指标与观测点
let _health = {
  startedAt: Date.now(),
  counters: {
    crawled: 0,
    aggregated: 0,
    generated: 0,
    published: 0,
    crawlFailures: 0,
  },
  lastTimestamps: {
    crawl: null,
    aggregate: null,
    generate: null,
    publish: null
  }
};

function incCrawled(n = 1) {
  _health.counters.crawled += n;
  _health.lastTimestamps.crawl = Date.now();
}

function incCrawlFailure(n = 1) {
  _health.counters.crawlFailures += n;
  _health.lastTimestamps.crawl = Date.now();
}

function incAggregated(n = 1) {
  _health.counters.aggregated += n;
  _health.lastTimestamps.aggregate = Date.now();
}

function incGenerated(n = 1) {
  _health.counters.generated += n;
  _health.lastTimestamps.generate = Date.now();
}

function incPublished(n = 1) {
  _health.counters.published += n;
  _health.lastTimestamps.publish = Date.now();
}

function report() {
  // 返回健康快照
  return JSON.parse(JSON.stringify(_health));
}

module.exports = {
  health: _health,
  incCrawled,
  incCrawlFailure,
  incAggregated,
  incGenerated,
  incPublished,
  report
};
