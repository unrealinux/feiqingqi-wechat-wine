# 葡萄酒信息源配置文档

## 📊 信息源统计

| 类型 | 数量 | 说明 |
|------|------|------|
| **RSS源** | 22个 | S级7个，A级12个，B级1个 |
| **网站源** | 14个 | 中文8个，国际6个 |
| **市场数据** | 3个 | Liv-ex, Vinum, Vin-X |
| **拍卖行** | 3个 | 苏富比, 佳士得, HDH |
| **总计** | **42个** | |

---

## 🌟 S级来源（必用，国际权威）

| 来源 | RSS地址 | 类型 | 语言 |
|------|---------|------|------|
| **Decanter** | https://www.decanter.com/wine-news/feed | 新闻 | EN |
| **Wine Spectator** | https://www.winespectator.com/rss/rss?t=1 | 新闻 | EN |
| **Wine-Searcher** | https://www.wine-searcher.com/news/rss | 新闻 | EN |
| **Robert Parker** | https://www.robertparker.com/rss | 评分 | EN |
| **James Suckling** | https://jamessuckling.com/feed | 评分 | EN |
| **Liv-ex** | https://www.liv-ex.com/feed/ | 市场 | EN |
| **红酒世界** | https://www.wine-world.com/articlerss/rss.aspx | 新闻 | ZH |

---

## 📰 A级来源（补充，专业媒体）

| 来源 | RSS地址 | 类型 | 语言 |
|------|---------|------|------|
| **The Drinks Business** | https://www.thedrinksbusiness.com/feed/ | 新闻 | EN |
| **Wine Industry Advisor** | https://wineindustryadvisor.com/feed | 行业 | EN |
| **Jancis Robinson** | https://www.jancisrobinson.com/articles.rss | 评论 | EN |
| **Vivino News** | https://www.vivino.com/news/rss | 消费 | EN |
| **Wine Enthusiast** | https://www.winemag.com/feed/ | 新闻 | EN |
| **VinePair** | https://vinepair.com/explore/categor.. | 科普 | EN |
| **WineNews Italy** | https://winenews.it/en/feed/ | 区域 | EN |
| **Harpers Wine** | https://www.harpers.co.uk/feed | 行业 | EN |
| **Vinum Fine Wines** | https://vinumfinewines.com/feed/ | 市场 | EN |
| **Vin-X Investment** | https://www.vin-x.com/blog/feed/ | 投资 | EN |
| **葡萄酒资讯网** | https://www.winesinfo.com/rss | 新闻 | ZH |
| **葡萄酒商业观察** | https://www.wbo529.com/feed | 行业 | ZH |

---

## 🏛️ 拍卖行来源

| 拍卖行 | RSS地址 | 优先级 |
|--------|---------|--------|
| **苏富比** | https://www.sothebys.com/en/wine/feed | S |
| **佳士得** | https://www.christies.com/en/results?category=wine&feed=rss | S |
| **Hart Davis Hart** | https://www.hdhwine.com/feed/ | A |

---

## 🕷️ 网站爬取源

### 中文网站

| 网站 | 地址 | 内容类型 |
|------|------|----------|
| 红酒世界 | https://www.wine-world.com | 综合资讯 |
| 葡萄酒资讯网 | https://www.winesinfo.com | 综合资讯 |
| 葡萄酒商业观察 | https://www.wbo529.com | 行业分析 |
| 酒咔嚓 | https://www.jiukacha.com | 消费资讯 |
| 逸香网 | https://www.wines-info.com | 专业评测 |
| 酒斛网 | https://www.9kacha.com | 消费者社区 |
| 酒仙网资讯 | https://www.jiuxian.com/news | 电商资讯 |
| 也买酒资讯 | https://www.yesmywine.com/news | 电商资讯 |

### 国际网站

| 网站 | 地址 | 内容类型 |
|------|------|----------|
| Wine Spectator | https://www.winespectator.com | 综合资讯 |
| Decanter | https://www.decanter.com | 综合资讯 |
| VinePair | https://vinepair.com | 科普教育 |

---

## 🔍 搜索关键词配置

### 中文关键词
- 基础：红酒、葡萄酒、品酒、酒庄、产区、年份、评分
- 产区：波尔多、勃艮第、香槟、宁夏、张裕、长城

### 英文关键词
- 基础：wine, bordeaux, burgundy, champagne, tasting, vintage
- 专业：winery, vineyard, sommelier, wine investment, fine wine
- 趋势：organic wine, natural wine, biodynamic, sustainable wine

---

## 📡 新闻API配置

| API | 状态 | 配置项 |
|-----|------|--------|
| 聚合数据 | ✅ 已配置 | JUHE_API_KEY |
| 天行数据 | ✅ 已配置 | TIANAPI_KEY |
| NewsAPI | ⚠️ 需代理 | NEWSAPI_KEY |

---

## 🔧 使用方法

### 1. 使用增强版爬虫
```bash
node enhanced-crawler.js
```

### 2. 在代码中使用
```javascript
const EnhancedCrawler = require('./enhanced-crawler');

const crawler = new EnhancedCrawler({
  maxArticlesPerSource: 15,
  concurrency: 5,
});

const articles = await crawler.crawl();
console.log(articles);
```

### 3. 获取信息源统计
```javascript
const { getSourceStats } = require('./enhanced-sources');
console.log(getSourceStats());
```

---

## 📈 数据质量保证

### 验证原则
- **价格异动**：需≥2个独立来源确认
- **单一来源**：标注"[待确认]"
- **突发事件**：标注来源时间

### 去重策略
- 基于标题相似度去重
- 基于URL去重
- 基于内容指纹去重

### 排序逻辑
- 优先级：S级 > A级 > B级 > C级
- 时效性：最新日期优先
- 来源可信度：权威媒体优先

---

## 🚀 扩展指南

### 添加新RSS源
1. 在 `enhanced-sources.js` 中添加新源
2. 设置优先级 (S/A/B/C)
3. 设置语言 (zh/en)
4. 测试连接

### 添加新网站源
1. 在对应的数组中添加新网站
2. 配置选择器 (articleSelector, titleSelector, contentSelector)
3. 设置最大文章数
4. 测试爬取

---

*最后更新：2026-03-21*
