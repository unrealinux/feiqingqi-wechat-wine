/**
 * 优化版信息源配置
 * 包含国际权威媒体、中文资讯网站、行业报告等多种来源
 */

// 国际权威葡萄酒RSS源
const INTERNATIONAL_RSS_SOURCES = [
  // S级来源 - 国际权威媒体
  { name: 'Decanter', url: 'https://www.decanter.com/wine-news/feed', priority: 'S', language: 'en' },
  { name: 'Wine Spectator', url: 'https://www.winespectator.com/rss/rss?t=1', priority: 'S', language: 'en' },
  { name: 'VinePair', url: 'https://vinepair.com/explore/categor..', priority: 'A', language: 'en' },
  { name: 'Wine-Searcher News', url: 'https://www.wine-searcher.com/news/rss', priority: 'S', language: 'en' },
  { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', priority: 'A', language: 'en' },
  { name: 'Wine Industry Advisor', url: 'https://wineindustryadvisor.com/feed', priority: 'A', language: 'en' },
  
  // A级来源 - 专业博客和评论
  { name: 'Jancis Robinson', url: 'https://www.jancisrobinson.com/articles.rss', priority: 'A', language: 'en' },
  { name: 'Wine Folly', url: 'https://winefolly.com/feed/', priority: 'B', language: 'en' },
  { name: 'Vivino News', url: 'https://www.vivino.com/news/rss', priority: 'A', language: 'en' },
  { name: 'Wine Enthusiast', url: 'https://www.winemag.com/feed/', priority: 'A', language: 'en' },
  { name: 'Robert Parker Wine Advocate', url: 'https://www.robertparker.com/rss', priority: 'S', language: 'en' },
  { name: 'James Suckling', url: 'https://jamessuckling.com/feed', priority: 'S', language: 'en' },
  
  // 区域性来源
  { name: 'WineNews Italy', url: 'https://winenews.it/en/feed/', priority: 'A', language: 'en' },
  { name: 'Harpers Wine', url: 'https://www.harpers.co.uk/feed', priority: 'A', language: 'en' },
  { name: 'Meininger\'s Wine Business', url: 'https://www.meiningers-international.com/feed', priority: 'A', language: 'en' },
  { name: 'Wine Business International', url: 'https://www.winebusiness.com/feed/', priority: 'A', language: 'en' },
];

// 中文葡萄酒RSS源
const CHINESE_RSS_SOURCES = [
  { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', priority: 'S', language: 'zh' },
  { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com/rss', priority: 'A', language: 'zh' },
  { name: '葡萄酒商业观察', url: 'https://www.wbo529.com/feed', priority: 'A', language: 'zh' },
];

// Liv-ex市场数据源
const MARKET_DATA_SOURCES = [
  { name: 'Liv-ex Blog', url: 'https://www.liv-ex.com/feed/', priority: 'S', type: 'market' },
  { name: 'Vinum Fine Wines', url: 'https://vinumfinewines.com/feed/', priority: 'A', type: 'market' },
  { name: 'Vin-X Investment', url: 'https://www.vin-x.com/blog/feed/', priority: 'A', type: 'investment' },
];

// 拍卖行数据源
const AUCTION_SOURCES = [
  { name: 'Sotheby\'s Wine', url: 'https://www.sothebys.com/en/wine/feed', priority: 'S', type: 'auction' },
  { name: 'Christie\'s Wine', url: 'https://www.christies.com/en/results?category=wine&feed=rss', priority: 'S', type: 'auction' },
  { name: 'Hart Davis Hart', url: 'https://www.hdhwine.com/feed/', priority: 'A', type: 'auction' },
];

// 中文葡萄酒网站（直接爬取）
const CHINESE_WINE_WEBSITES = [
  { 
    name: '红酒世界', 
    url: 'https://www.wine-world.com', 
    articleSelector: '.news-item a, .article-list a, .item a',
    titleSelector: 'h1, .title, .article-title',
    contentSelector: '.article-content, .content, .article-body',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '葡萄酒资讯网', 
    url: 'https://www.winesinfo.com', 
    selector: '.news-list a, .article-list a',
    titleSel: 'h1, .title',
    contentSel: '.content, .article-content',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '葡萄酒商业观察', 
    url: 'https://www.wbo529.com', 
    selector: '.news-list a, .article-list a',
    titleSel: 'h1, .title',
    contentSel: '.content, .article-content',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '酒咔嚓', 
    url: 'https://www.jiukacha.com', 
    selector: '.article-list a, .news-list a',
    titleSel: 'h1, .article-title',
    contentSel: '.article-content, .content',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '逸香网', 
    url: 'https://www.wines-info.com', 
    selector: '.article-list a, .news-list a',
    titleSel: 'h1, .title',
    contentSel: '.article-content, .content',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '酒斛网', 
    url: 'https://www.9kacha.com', 
    selector: '.article-list a, .news-list a',
    titleSel: 'h1, .title',
    contentSel: '.article-content, .content',
    maxArticles: 15,
    language: 'zh'
  },
  { 
    name: '酒仙网资讯', 
    url: 'https://www.jiuxian.com/news', 
    selector: '.news-list a, .article-list a',
    titleSel: 'h1, .title',
    contentSel: '.article-content, .content',
    maxArticles: 10,
    language: 'zh'
  },
  { 
    name: '也买酒资讯', 
    url: 'https://www.yesmywine.com/news', 
    selector: '.news-list a, .article-list a',
    titleSel: 'h1, .title',
    contentSel: '.article-content, .content',
    maxArticles: 10,
    language: 'zh'
  },
];

// 国际葡萄酒网站（直接爬取）
const INTERNATIONAL_WINE_WEBSITES = [
  { 
    name: 'Wine Spectator', 
    url: 'https://www.winespectator.com', 
    articleSelector: '.article-link, .news-item a',
    titleSelector: 'h1, .article-title',
    contentSelector: '.article-body, .content',
    maxArticles: 10,
    language: 'en'
  },
  { 
    name: 'Decanter', 
    url: 'https://www.decanter.com', 
    articleSelector: '.article-link, .news-item a',
    titleSelector: 'h1, .article-title',
    contentSelector: '.article-body, .content',
    maxArticles: 10,
    language: 'en'
  },
  { 
    name: 'VinePair', 
    url: 'https://vinepair.com', 
    articleSelector: '.article-link, .post-item a',
    titleSelector: 'h1, .post-title',
    contentSelector: '.post-content, .article-body',
    maxArticles: 10,
    language: 'en'
  },
];

// 搜索关键词配置
const SEARCH_KEYWORDS = [
  // 中文关键词
  '红酒', '葡萄酒', '品酒', '酒庄', '产区', '年份', '评分',
  '波尔多', '勃艮第', '香槟', '宁夏', '张裕', '长城',
  // 英文关键词
  'wine', 'bordeaux', 'burgundy', 'champagne', 'tasting',
  'vintage', 'winery', 'vineyard', 'sommelier',
  // 投资相关
  'wine investment', 'fine wine', 'wine auction', 'wine market',
  'Liv-ex', 'wine prices', 'wine collection',
  // 趋势相关
  'organic wine', 'natural wine', 'biodynamic', 'sustainable wine',
  'low alcohol wine', 'wine trends 2026',
];

// 新闻API配置
const NEWS_API_CONFIG = {
  // 聚合数据 - 新闻头条
  juhe: {
    enabled: true,
    apiKey: process.env.JUHE_API_KEY,
    endpoint: 'http://v.juhe.cn/toutiao/index',
    categories: ['entertainment', 'sports', 'technology'],
  },
  // 天行数据
  tianapi: {
    enabled: true,
    apiKey: process.env.TIANAPI_KEY,
    endpoint: 'https://apis.tianapi.com/wine/index',
  },
  // NewsAPI.org (需要代理)
  newsapi: {
    enabled: false, // 国内需要代理
    apiKey: process.env.NEWSAPI_KEY,
    endpoint: 'https://newsapi.org/v2/everything',
    queries: ['wine', '葡萄酒', '红酒'],
  },
};

// 导出配置
module.exports = {
  INTERNATIONAL_RSS_SOURCES,
  CHINESE_RSS_SOURCES,
  MARKET_DATA_SOURCES,
  AUCTION_SOURCES,
  CHINESE_WINE_WEBSITES,
  INTERNATIONAL_WINE_WEBSITES,
  SEARCH_KEYWORDS,
  NEWS_API_CONFIG,
  
  // 获取所有RSS源
  getAllRssSources() {
    return [
      ...INTERNATIONAL_RSS_SOURCES,
      ...CHINESE_RSS_SOURCES,
      ...MARKET_DATA_SOURCES,
      ...AUCTION_SOURCES,
    ];
  },
  
  // 按优先级获取RSS源
  getRssSourcesByPriority(priority) {
    return this.getAllRssSources().filter(s => s.priority === priority);
  },
  
  // 按语言获取RSS源
  getRssSourcesByLanguage(language) {
    return this.getAllRssSources().filter(s => s.language === language);
  },
  
  // 获取所有网站源
  getAllWebsiteSources() {
    return [
      ...CHINESE_WINE_WEBSITES,
      ...INTERNATIONAL_WINE_WEBSITES,
    ];
  },
  
  // 统计信息源数量
  getSourceStats() {
    const allRss = [
      ...INTERNATIONAL_RSS_SOURCES,
      ...CHINESE_RSS_SOURCES,
      ...MARKET_DATA_SOURCES,
      ...AUCTION_SOURCES,
    ];
    
    return {
      rss: {
        total: allRss.length,
        s_level: allRss.filter(s => s.priority === 'S').length,
        a_level: allRss.filter(s => s.priority === 'A').length,
        b_level: allRss.filter(s => s.priority === 'B').length,
      },
      websites: {
        total: CHINESE_WINE_WEBSITES.length + INTERNATIONAL_WINE_WEBSITES.length,
        chinese: CHINESE_WINE_WEBSITES.length,
        international: INTERNATIONAL_WINE_WEBSITES.length,
      },
      market: MARKET_DATA_SOURCES.length,
      auction: AUCTION_SOURCES.length,
    };
  }
};
