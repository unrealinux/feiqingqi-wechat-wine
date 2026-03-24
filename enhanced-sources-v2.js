/**
 * 增强版信息源配置 - 完整版
 * 包含所有可获取的葡萄酒信息来源
 */

// ==================== S级来源（国际权威）====================

const S_LEVEL_SOURCES = [
  { name: 'Wine Spectator', url: 'https://www.winespectator.com/rss/rss?t=1', priority: 'S', language: 'en', type: 'news' },
  { name: 'Decanter', url: 'https://www.decanter.com/wine-news/feed/', priority: 'S', language: 'en', type: 'news' },
  { name: 'Wine-Searcher', url: 'https://www.wine-searcher.com/news/rss', priority: 'S', language: 'en', type: 'price' },
  { name: 'Wine Enthusiast', url: 'https://www.winemag.com/feed/', priority: 'S', language: 'en', type: 'news' },
  { name: 'Liv-ex', url: 'https://www.liv-ex.com/feed/', priority: 'S', language: 'en', type: 'market' },
  { name: 'James Suckling', url: 'https://jamessuckling.com/feed', priority: 'S', language: 'en', type: 'rating' },
  { name: 'Robert Parker', url: 'https://www.robertparker.com/rss', priority: 'S', language: 'en', type: 'rating' },
  { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', priority: 'S', language: 'zh', type: 'news' },
];

// ==================== A级来源（专业媒体）====================

const A_LEVEL_SOURCES = [
  { name: 'VinePair', url: 'https://vinepair.com/feed/', priority: 'A', language: 'en', type: 'news' },
  { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', priority: 'A', language: 'en', type: 'news' },
  { name: 'Wine Industry Advisor', url: 'https://wineindustryadvisor.com/feed', priority: 'A', language: 'en', type: 'industry' },
  { name: 'Vinography', url: 'https://www.vinography.com/feed/', priority: 'A', language: 'en', type: 'blog' },
  { name: 'Northwest Wine Report', url: 'https://northwestwinereport.com/feed', priority: 'A', language: 'en', type: 'regional' },
  { name: 'The Grape Pursuit', url: 'https://thegrapepursuit.com/feed', priority: 'A', language: 'en', type: 'blog' },
  { name: 'Glass of Bubbly', url: 'https://glassofbubbly.com/feed', priority: 'A', language: 'en', type: 'sparkling' },
  { name: 'Harpers Wine', url: 'https://www.harpers.co.uk/feed', priority: 'A', language: 'en', type: 'industry' },
  { name: 'WineNews Italy', url: 'https://winenews.it/en/feed/', priority: 'A', language: 'en', type: 'regional' },
  { name: 'Vinum Fine Wines', url: 'https://vinumfinewines.com/feed/', priority: 'A', language: 'en', type: 'market' },
  { name: 'Vin-X', url: 'https://www.vin-x.com/blog/feed/', priority: 'A', language: 'en', type: 'investment' },
  { name: 'Jancis Robinson', url: 'https://www.jancisrobinson.com/articles.rss', priority: 'A', language: 'en', type: 'review' },
  { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com/rss', priority: 'A', language: 'zh', type: 'news' },
  { name: '葡萄酒商业观察', url: 'https://www.wbo529.com/feed', priority: 'A', language: 'zh', type: 'business' },
];

// ==================== B级来源（独立博客）====================

const B_LEVEL_SOURCES = [
  { name: 'Wine Folly', url: 'https://winefolly.com/feed/', priority: 'B', language: 'en', type: 'education' },
  { name: 'The Drunkencyclist', url: 'https://thedrunkencyclist.com/feed', priority: 'B', language: 'en', type: 'blog' },
  { name: 'History & Wine', url: 'https://historyandwine.com/feed', priority: 'B', language: 'en', type: 'culture' },
  { name: 'Choice Wineries', url: 'https://choicewineries.com/feed', priority: 'B', language: 'en', type: 'regional' },
  { name: 'Costco Wine Blog', url: 'https://costcowineblog.com/feed/?x=1', priority: 'B', language: 'en', type: 'value' },
  { name: 'Barolista', url: 'https://barolista.blogspot.com/feeds/posts/default?alt=rss', priority: 'B', language: 'en', type: 'regional' },
  { name: 'Vivino News', url: 'https://www.vivino.com/news/rss', priority: 'B', language: 'en', type: 'consumer' },
];

// ==================== 拍卖行来源====================

const AUCTION_SOURCES = [
  { name: "Sotheby's Wine", url: 'https://www.sothebys.com/en/wine/feed', priority: 'S', type: 'auction' },
  { name: "Christie's Wine", url: 'https://www.christies.com/results?category=wine&feed=rss', priority: 'S', type: 'auction' },
  { name: 'Hart Davis Hart', url: 'https://www.hdhwine.com/feed/', priority: 'A', type: 'auction' },
];

// ==================== 产区专用来源====================

const REGIONAL_SOURCES = {
  bordeaux: [
    { name: 'Bordeaux.com', url: 'https://www.bordeaux.com/en/rss', priority: 'A', region: 'Bordeaux' },
  ],
  burgundy: [
    { name: 'Burgundy Report', url: 'https://www.burgundyreport.com/feed/', priority: 'A', region: 'Burgundy' },
  ],
  champagne: [
    { name: 'Champagne Magazine', url: 'https://www.champagnemagazine.com/feed', priority: 'A', region: 'Champagne' },
  ],
  italy: [
    { name: 'WineNews Italy', url: 'https://winenews.it/en/feed/', priority: 'A', region: 'Italy' },
  ],
  usa: [
    { name: 'Wine Spectator Napa', url: 'https://www.winespectator.com/rss/rss?t=2', priority: 'A', region: 'Napa' },
  ],
};

// ==================== 中文来源====================

const CHINESE_SOURCES = [
  { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', priority: 'S', language: 'zh', type: 'news' },
  { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com/rss', priority: 'A', language: 'zh', type: 'news' },
  { name: '葡萄酒商业观察', url: 'https://www.wbo529.com/feed', priority: 'A', language: 'zh', type: 'business' },
];

// ==================== 网站爬取源====================

const WEBSITE_SOURCES = {
  chinese: [
    { name: '红酒世界', url: 'https://www.wine-world.com', selector: '.news-item a', maxArticles: 15 },
    { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com', selector: '.news-list a', maxArticles: 15 },
    { name: '葡萄酒商业观察', url: 'https://www.wbo529.com', selector: '.article-list a', maxArticles: 15 },
    { name: '酒咔嚓', url: 'https://www.jiukacha.com', selector: '.article-list a', maxArticles: 15 },
    { name: '逸香网', url: 'https://www.wines-info.com', selector: '.news-list a', maxArticles: 15 },
    { name: '酒斛网', url: 'https://www.9kacha.com', selector: '.article-list a', maxArticles: 15 },
  ],
  international: [
    { name: 'Wine Spectator', url: 'https://www.winespectator.com', selector: '.article-link', maxArticles: 10 },
    { name: 'Decanter', url: 'https://www.decanter.com', selector: '.article-link', maxArticles: 10 },
    { name: 'VinePair', url: 'https://vinepair.com', selector: '.post-item a', maxArticles: 10 },
  ],
};

// ==================== 辅助函数====================

/**
 * 获取所有RSS源
 */
function getAllRssSources() {
  return [
    ...S_LEVEL_SOURCES,
    ...A_LEVEL_SOURCES,
    ...B_LEVEL_SOURCES,
    ...AUCTION_SOURCES,
    ...CHINESE_SOURCES,
  ];
}

/**
 * 按优先级获取源
 */
function getSourcesByPriority(priority) {
  return getAllRssSources().filter(s => s.priority === priority);
}

/**
 * 按语言获取源
 */
function getSourcesByLanguage(language) {
  return getAllRssSources().filter(s => s.language === language);
}

/**
 * 按类型获取源
 */
function getSourcesByType(type) {
  return getAllRssSources().filter(s => s.type === type);
}

/**
 * 获取统计信息
 */
function getSourceStats() {
  const all = getAllRssSources();
  return {
    total: all.length,
    byPriority: {
      S: all.filter(s => s.priority === 'S').length,
      A: all.filter(s => s.priority === 'A').length,
      B: all.filter(s => s.priority === 'B').length,
    },
    byLanguage: {
      en: all.filter(s => s.language === 'en').length,
      zh: all.filter(s => s.language === 'zh').length,
    },
    byType: {
      news: all.filter(s => s.type === 'news').length,
      market: all.filter(s => s.type === 'market').length,
      rating: all.filter(s => s.type === 'rating').length,
      auction: all.filter(s => s.type === 'auction').length,
      blog: all.filter(s => s.type === 'blog').length,
      industry: all.filter(s => s.type === 'industry').length,
      regional: all.filter(s => s.type === 'regional').length,
    },
    websites: {
      chinese: WEBSITE_SOURCES.chinese.length,
      international: WEBSITE_SOURCES.international.length,
      total: WEBSITE_SOURCES.chinese.length + WEBSITE_SOURCES.international.length,
    },
  };
}

// ==================== 导出====================

module.exports = {
  // 来源数组
  S_LEVEL_SOURCES,
  A_LEVEL_SOURCES,
  B_LEVEL_SOURCES,
  AUCTION_SOURCES,
  CHINESE_SOURCES,
  REGIONAL_SOURCES,
  WEBSITE_SOURCES,
  
  // 辅助函数
  getAllRssSources,
  getSourcesByPriority,
  getSourcesByLanguage,
  getSourcesByType,
  getSourceStats,
};
