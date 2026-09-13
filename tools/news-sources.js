'use strict';

/**
 * 新闻抓取的信息源清单（活跃主线）
 * ================================
 * 这里的每个源都在 2026-09 做过实测：能返回真正的 RSS/Atom（而非反爬 HTML），
 * 且 XML 可被严格解析器接受。清单刻意保持精简 —— 失效源比没有源更糟，
 * 它会让日志充满噪音、掩盖真正可用的源。
 *
 * 字段：
 *   name      展示名（同时作为草稿的默认作者/标签来源）
 *   url       RSS/Atom 地址
 *   language  zh / en
 *   type      内容类型，影响分类推断与标签
 *
 * 关于中文源：
 *   归档版注册的中文源（红酒世界 / 葡萄酒资讯网 / 葡萄酒商业观察等）目前均不可用
 *   —— 或返回 captcha 页，或 404，或 TLS 证书链不完整。因此默认清单暂时只有英文源。
 *   若找到可用的中文源，直接往这里加即可（建议先 `node tools/fetch-news.js --source X --dry-run` 验证）。
 *
 * 更多历史来源见 archive/first-gen/enhanced-sources.js（含拍卖行、产区专用、网站爬取）。
 */

const SOURCES = [
  { name: 'Decanter', url: 'https://www.decanter.com/feed/', language: 'en', type: 'news' },
  { name: 'VinePair', url: 'https://vinepair.com/feed/', language: 'en', type: 'news' },
  { name: 'Wine Enthusiast', url: 'https://www.winemag.com/feed/', language: 'en', type: 'news' },
  { name: 'Wine Folly', url: 'https://winefolly.com/feed/', language: 'en', type: 'education' },
  { name: 'Vinography', url: 'https://www.vinography.com/feed/', language: 'en', type: 'blog' },
  { name: 'Liv-ex', url: 'https://www.liv-ex.com/feed/', language: 'en', type: 'market' },
  { name: 'Bordeaux.com', url: 'https://www.bordeaux.com/en/rss', language: 'en', type: 'regional' }
];

/** 按名称（不区分大小写、支持子串）筛选来源 */
function selectSources(query) {
  if (!query) {return SOURCES.slice();}
  const q = String(query).toLowerCase();
  return SOURCES.filter((s) => s.name.toLowerCase().includes(q));
}

module.exports = { SOURCES, selectSources };
