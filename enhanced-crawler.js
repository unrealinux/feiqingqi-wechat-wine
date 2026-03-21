/**
 * 增强版爬虫 - 支持多种信息源
 */
const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const {
  INTERNATIONAL_RSS_SOURCES,
  CHINESE_RSS_SOURCES,
  MARKET_DATA_SOURCES,
  AUCTION_SOURCES,
  CHINESE_WINE_WEBSITES,
  INTERNATIONAL_WINE_WEBSITES,
  SEARCH_KEYWORDS,
  NEWS_API_CONFIG,
  getAllRssSources,
  getAllWebsiteSources,
  getSourceStats,
} = require('./enhanced-sources');

class EnhancedCrawler {
  constructor(options = {}) {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    this.turndownService = new TurndownService();
    this.articles = [];
    this.visitedUrls = new Set();
    this.maxArticlesPerSource = options.maxArticlesPerSource || 15;
    this.concurrency = options.concurrency || 5;
    this.timeout = options.timeout || 15000;
    this.outputDir = options.outputDir || path.join(__dirname, 'crawled_data');
    
    // 创建输出目录
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 主采集流程
   */
  async crawl() {
    console.log('='.repeat(60));
    console.log('🍷 增强版葡萄酒信息采集器');
    console.log('='.repeat(60));
    console.log('');
    
    const stats = getSourceStats();
    console.log('📊 信息源统计：');
    console.log(`   RSS源: ${stats.rss.total} 个 (S级: ${stats.rss.s_level}, A级: ${stats.rss.a_level})`);
    console.log(`   网站源: ${stats.websites.total} 个 (中文: ${stats.websites.chinese}, 国际: ${stats.websites.international})`);
    console.log(`   市场数据: ${stats.market} 个`);
    console.log(`   拍卖行: ${stats.auction} 个`);
    console.log('');
    
    const startTime = Date.now();
    
    try {
      // 并行执行所有采集任务
      const results = await Promise.allSettled([
        this.crawlFromInternationalRSS(),
        this.crawlFromChineseRSS(),
        this.crawlFromMarketData(),
        this.crawlFromAuctionSources(),
        this.crawlFromChineseWebsites(),
        this.crawlFromInternationalWebsites(),
      ]);
      
      // 合并结果
      const allArticles = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value || []);
      
      // 记录失败
      const failures = results
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({ index: i, error: r.reason?.message }));
      
      if (failures.length > 0) {
        console.warn(`⚠️ ${failures.length} 个采集源失败`);
      }
      
      this.articles = allArticles;
      
      // 去重
      this.articles = this.deduplicate(this.articles);
      
      // 排序（按质量和时效性）
      this.articles = this.sortArticles(this.articles);
      
      // 保存
      await this.saveArticles();
      
      const duration = Date.now() - startTime;
      console.log('');
      console.log('='.repeat(60));
      console.log(`✅ 采集完成！`);
      console.log(`   总计: ${this.articles.length} 篇文章`);
      console.log(`   耗时: ${duration}ms`);
      console.log('='.repeat(60));
      
      return this.articles;
      
    } catch (error) {
      console.error('❌ 采集失败:', error.message);
      throw error;
    }
  }

  /**
   * 从国际RSS源采集
   */
  async crawlFromInternationalRSS() {
    console.log('📡 采集国际RSS源...');
    const articles = [];
    
    for (const source of INTERNATIONAL_RSS_SOURCES.slice(0, 10)) {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        for (const item of (feed.items || []).slice(0, this.maxArticlesPerSource)) {
          if (item.title && item.link && !this.visitedUrls.has(item.link)) {
            this.visitedUrls.add(item.link);
            
            articles.push({
              id: uuidv4(),
              title: item.title,
              link: item.link,
              content: item.contentSnippet || item.content || '',
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              source: source.name,
              priority: source.priority,
              language: source.language,
              type: 'rss',
            });
          }
        }
        
        console.log(`   ✅ ${source.name}: ${feed.items?.length || 0} 条`);
      } catch (err) {
        console.warn(`   ⚠️ ${source.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 从中文RSS源采集
   */
  async crawlFromChineseRSS() {
    console.log('📡 采集中文RSS源...');
    const articles = [];
    
    for (const source of CHINESE_RSS_SOURCES) {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        for (const item of (feed.items || []).slice(0, this.maxArticlesPerSource)) {
          if (item.title && item.link && !this.visitedUrls.has(item.link)) {
            this.visitedUrls.add(item.link);
            
            articles.push({
              id: uuidv4(),
              title: item.title,
              link: item.link,
              content: item.contentSnippet || item.content || '',
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              source: source.name,
              priority: source.priority,
              language: 'zh',
              type: 'rss',
            });
          }
        }
        
        console.log(`   ✅ ${source.name}: ${feed.items?.length || 0} 条`);
      } catch (err) {
        console.warn(`   ⚠️ ${source.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 从市场数据源采集
   */
  async crawlFromMarketData() {
    console.log('📊 采集市场数据...');
    const articles = [];
    
    for (const source of MARKET_DATA_SOURCES) {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        for (const item of (feed.items || []).slice(0, 10)) {
          if (item.title && item.link && !this.visitedUrls.has(item.link)) {
            this.visitedUrls.add(item.link);
            
            articles.push({
              id: uuidv4(),
              title: item.title,
              link: item.link,
              content: item.contentSnippet || '',
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              source: source.name,
              priority: 'S',
              type: source.type || 'market',
              language: 'en',
            });
          }
        }
        
        console.log(`   ✅ ${source.name}: ${feed.items?.length || 0} 条`);
      } catch (err) {
        console.warn(`   ⚠️ ${source.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 从拍卖行数据源采集
   */
  async crawlFromAuctionSources() {
    console.log('🏛️ 采集拍卖行数据...');
    const articles = [];
    
    for (const source of AUCTION_SOURCES) {
      try {
        const feed = await this.parser.parseURL(source.url);
        
        for (const item of (feed.items || []).slice(0, 10)) {
          if (item.title && item.link && !this.visitedUrls.has(item.link)) {
            this.visitedUrls.add(item.link);
            
            articles.push({
              id: uuidv4(),
              title: item.title,
              link: item.link,
              content: item.contentSnippet || '',
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              source: source.name,
              priority: 'S',
              type: 'auction',
              language: 'en',
            });
          }
        }
        
        console.log(`   ✅ ${source.name}: ${feed.items?.length || 0} 条`);
      } catch (err) {
        console.warn(`   ⚠️ ${source.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 从中文网站直接爬取
   */
  async crawlFromChineseWebsites() {
    console.log('🕷️ 爬取中文网站...');
    const articles = [];
    
    for (const site of CHINESE_WINE_WEBSITES.slice(0, 5)) {
      try {
        const response = await axios.get(site.url, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        const $ = cheerio.load(response.data);
        const links = [];
        
        $(site.selector || site.articleSelector).each((i, el) => {
          if (i >= (site.maxArticles || 10)) return;
          
          const href = $(el).attr('href');
          const title = $(el).text().trim();
          
          if (href && title && title.length > 10 && !this.visitedUrls.has(href)) {
            this.visitedUrls.add(href);
            links.push({ url: href.startsWith('http') ? href : site.url + href, title });
          }
        });
        
        console.log(`   ✅ ${site.name}: 发现 ${links.length} 个链接`);
        articles.push(...links.map(link => ({
          id: uuidv4(),
          title: link.title,
          link: link.url,
          content: '',
          pubDate: new Date(),
          source: site.name,
          priority: 'A',
          type: 'website',
          language: 'zh',
        })));
        
      } catch (err) {
        console.warn(`   ⚠️ ${site.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 从国际网站直接爬取
   */
  async crawlFromInternationalWebsites() {
    console.log('🕷️ 爬取国际网站...');
    const articles = [];
    
    for (const site of INTERNATIONAL_WINE_WEBSITES.slice(0, 3)) {
      try {
        const response = await axios.get(site.url, {
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        const $ = cheerio.load(response.data);
        const links = [];
        
        $(site.articleSelector).each((i, el) => {
          if (i >= (site.maxArticles || 10)) return;
          
          const href = $(el).attr('href');
          const title = $(el).text().trim();
          
          if (href && title && title.length > 10 && !this.visitedUrls.has(href)) {
            this.visitedUrls.add(href);
            links.push({ url: href.startsWith('http') ? href : site.url + href, title });
          }
        });
        
        console.log(`   ✅ ${site.name}: 发现 ${links.length} 个链接`);
        articles.push(...links.map(link => ({
          id: uuidv4(),
          title: link.title,
          link: link.url,
          content: '',
          pubDate: new Date(),
          source: site.name,
          priority: 'A',
          type: 'website',
          language: 'en',
        })));
        
      } catch (err) {
        console.warn(`   ⚠️ ${site.name}: ${err.message}`);
      }
    }
    
    console.log(`   总计: ${articles.length} 篇`);
    return articles;
  }

  /**
   * 去重
   */
  deduplicate(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.title.toLowerCase().replace(/\s+/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * 排序
   */
  sortArticles(articles) {
    const priorityOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3 };
    
    return articles.sort((a, b) => {
      // 先按优先级
      const pA = priorityOrder[a.priority] || 3;
      const pB = priorityOrder[b.priority] || 3;
      if (pA !== pB) return pA - pB;
      
      // 再按日期
      const dA = new Date(a.pubDate || 0);
      const dB = new Date(b.pubDate || 0);
      return dB - dA;
    });
  }

  /**
   * 保存文章
   */
  async saveArticles() {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `articles_${timestamp}.json`;
    const filepath = path.join(this.outputDir, filename);
    
    const data = {
      timestamp: new Date().toISOString(),
      count: this.articles.length,
      sources: getSourceStats(),
      articles: this.articles,
    };
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`📁 数据已保存: ${filepath}`);
  }

  /**
   * 获取摘要
   */
  getSummary() {
    const bySource = {};
    const byLanguage = { zh: 0, en: 0 };
    const byType = {};
    
    for (const article of this.articles) {
      bySource[article.source] = (bySource[article.source] || 0) + 1;
      byLanguage[article.language] = (byLanguage[article.language] || 0) + 1;
      byType[article.type] = (byType[article.type] || 0) + 1;
    }
    
    return {
      total: this.articles.length,
      bySource,
      byLanguage,
      byType,
    };
  }
}

// CLI
if (require.main === module) {
  const crawler = new EnhancedCrawler();
  
  crawler.crawl()
    .then(articles => {
      console.log('\n📊 采集摘要：');
      console.log(JSON.stringify(crawler.getSummary(), null, 2));
    })
    .catch(err => {
      console.error('❌ 错误:', err);
      process.exit(1);
    });
}

module.exports = EnhancedCrawler;
