'use strict';

/**
 * 新闻抓取的信息源清单（活跃主线）
 * ================================
 * 从第一代流水线的 archive/first-gen/enhanced-sources.js 中筛选出当前可用、
 * 稳定的 RSS 源。归档版本还有拍卖行、产区专用、网站爬取等更多来源，如需扩展
 * 可参考归档文件，但请只把验证可用的源登记到这里。
 *
 * 字段：
 *   name      展示名（同时作为草稿的默认作者/标签来源）
 *   url       RSS/Atom 地址
 *   language  zh / en
 *   type      内容类型，影响分类推断与标签
 */

const SOURCES = [
  // ---- 中文 ----
  { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', language: 'zh', type: 'news' },
  { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com/rss', language: 'zh', type: 'news' },
  { name: '葡萄酒商业观察', url: 'https://www.wbo529.com/feed', language: 'zh', type: 'business' },

  // ---- 英文 ----
  { name: 'Decanter', url: 'https://www.decanter.com/wine-news/feed/', language: 'en', type: 'news' },
  { name: 'VinePair', url: 'https://vinepair.com/feed/', language: 'en', type: 'news' },
  { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', language: 'en', type: 'news' },
  { name: 'Wine Folly', url: 'https://winefolly.com/feed/', language: 'en', type: 'education' },
  { name: 'Wine-Searcher', url: 'https://www.wine-searcher.com/news/rss', language: 'en', type: 'price' },
  { name: 'Wine Spectator', url: 'https://www.winespectator.com/rss/rss?t=1', language: 'en', type: 'news' },
  { name: 'Liv-ex', url: 'https://www.liv-ex.com/feed/', language: 'en', type: 'market' }
];

/** 按名称（不区分大小写、支持子串）筛选来源 */
function selectSources(query) {
  if (!query) {return SOURCES.slice();}
  const q = String(query).toLowerCase();
  return SOURCES.filter((s) => s.name.toLowerCase().includes(q));
}

module.exports = { SOURCES, selectSources };
