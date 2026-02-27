const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const { Redis } = require('./utils');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const { 
  withRetry, 
  withBatch, 
  createAppError, 
  AppError,
  ErrorTypes,
  CircuitBreaker 
} = require('./errors');
const { shouldCrawl } = require('./robots_check');
const { incCrawled, incCrawlFailure } = require('./health');
const { NewsApiSource } = require('./newsApis');
const { getAxiosProxyConfig, testProxyConnection } = require('./proxy');

class Crawler {
  constructor() {
    this.parser = new Parser();
    this.turndownService = new TurndownService();
    this.redis = new Redis();
    this.articles = [];
    this.proxyConfig = getAxiosProxyConfig();
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
    };
    // 断路器实例，用于管理对外部网站的请求
    this.circuitBreakers = new Map();
  }

  /**
   * 获取或创建指定域名的断路器
   */
  getCircuitBreaker(domain) {
    if (!this.circuitBreakers.has(domain)) {
      this.circuitBreakers.set(domain, new CircuitBreaker({
        failureThreshold: 3,
        timeout: 60000,
      }));
    }
    return this.circuitBreakers.get(domain);
  }

  async crawl() {
    console.log('开始采集红酒相关文章...');
    const startTime = Date.now();

    try {
      // 检查是否使用模拟数据模式
      if (process.env.USE_MOCK_DATA === 'true') {
        console.log('使用模拟数据模式...');
        this.articles = this.generateMockArticles();
      } else {
        // 并行执行所有采集任务，使用Promise.allSettled确保部分失败不影响整体
        const results = await Promise.allSettled([
          this.crawlFromRSS(),
          this.crawlFromSearch(),
          this.crawlFromAPIs(),
          this.crawlFromWebsites(),
          this.crawlFromBackupWebsites(), // 备用网站数据源
          this.crawlFromNewsAPIs(), // 新闻API源
        ]);
        const allArticles = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value);
        
        // 记录失败的采集源
        const failures = results
          .filter(r => r.status === 'rejected')
          .map(r => createAppError(r.reason));

        if (failures.length > 0) {
          console.warn(`警告: ${failures.length} 个采集源失败`);
          failures.forEach(err => {
            console.warn(`  - ${err.type}: ${err.message}`);
          });
        }

        this.articles = allArticles;

        // 如果采集不到数据，自动使用模拟数据
        if (this.articles.length === 0) {
          console.log('网络受限，自动切换到模拟数据模式...');
          this.articles = this.generateMockArticles();
        }
      }

      this.articles = await this.deduplicate(this.articles);
      this.articles = await this.filterAndRank(this.articles);
      await this.saveToCache(this.articles);

      const duration = Date.now() - startTime;
      console.log(`采集完成，共获取 ${this.articles.length} 篇文章，耗时 ${duration}ms`);

      return this.articles;
    } catch (error) {
      const appError = createAppError(error, { operation: 'crawl' });
      console.error('采集过程出错:', appError.message);
      
      // 对于可恢复错误，使用模拟数据继续
      if (appError.isRecoverable) {
        console.log('使用模拟数据继续执行...');
        this.articles = this.generateMockArticles();
        return this.articles;
      }
      
      throw appError;
    }
  }

  generateMockArticles() {
    const mockArticles = [
      {
        id: uuidv4(),
        title: '2026年全球葡萄酒产量下降10%，价格将上涨',
        link: 'https://example.com/wine-production-2026',
        content: '根据国际葡萄与葡萄酒组织(OIV)的最新报告，2026年全球葡萄酒产量预计将下降10%。主要原因是气候变化导致的极端天气，包括霜冻、干旱和暴雨，影响了多个主要产区的葡萄采收。法国、意大利和西班牙等传统产区的产量都有所下降。业内专家预计，这一趋势将导致中高端葡萄酒价格在未来一年内上涨5%-15%。',
        pubDate: new Date(Date.now() - 86400000),
        source: '红酒世界',
        type: 'mock',
        author: '李明',
        quality: 85,
      },
      {
        id: uuidv4(),
        title: '新手必读：如何正确品尝和评价一款红酒',
        link: 'https://example.com/how-to-taste-wine',
        content: '品酒是一门艺术，也是一门科学。本文将介绍品酒的五个关键步骤：观色、闻香、品尝、回味和评价。首先，将酒杯倾斜45度角观察酒液的色泽和透明度。然后轻轻摇晃酒杯，闻取酒液的香气。最后，小口品尝，让酒液在口中停留5-10秒，感受单宁、酸度和酒体的平衡。',
        pubDate: new Date(Date.now() - 172800000),
        source: '品酒汇',
        type: 'mock',
        author: '王芳',
        quality: 80,
      },
      {
        id: uuidv4(),
        title: '法国波尔多左岸五大酒庄2025年份评分发布',
        link: 'https://example.com/bordeaux-2025-scores',
        content: '备受期待的波尔多2025年份期酒评分近日公布。经历了炎热干燥的生长季节后，2025年被众多酒评家视为"卓越年份"。拉菲、拉图、玛歌、木桐和奥比昂五大一级庄均获得了高分评价，其中多款酒获得了95分以上的评分。业内人士认为，这一年的葡萄酒具有极佳的陈年潜力。',
        pubDate: new Date(Date.now() - 259200000),
        source: '酒咔嚓',
        type: 'mock',
        author: '张伟',
        quality: 88,
      },
      {
        id: uuidv4(),
        title: '智利葡萄酒为何在全球市场持续走红？',
        link: 'https://example.com/chile-wine-popularity',
        content: '智利葡萄酒近年来在全球市场的份额持续增长。其成功主要归功于几个因素：首先，智利拥有得天独厚的自然条件，狭长的地形和多样的气候适合种植多种葡萄。其次，相对较低的生产成本使其在性价比方面具有竞争优势。再者，智利葡萄酒的果香浓郁、口感柔和的特点符合现代消费者的口味偏好。',
        pubDate: new Date(Date.now() - 345600000),
        source: '酒虫网',
        type: 'mock',
        author: '陈静',
        quality: 82,
      },
      {
        id: uuidv4(),
        title: '如何打造一个家庭红酒酒窖？',
        link: 'https://example.com/home-wine-cellar',
        content: '对于红酒爱好者来说，在家打造一个小型酒窖是存储葡萄酒的理想选择。理想的酒窖温度应保持在12-15摄氏度，湿度维持在70%-80%。避免光照和震动也非常重要。如果没有专门空间，可以考虑购买恒温酒柜，选择具有双温区设计的产品可以同时存放红酒和白酒。',
        pubDate: new Date(Date.now() - 432000000),
        source: '逸香网',
        type: 'mock',
        author: '刘洋',
        quality: 78,
      },
      {
        id: uuidv4(),
        title: '中国宁夏贺兰山产区崛起，国产高端红酒受关注',
        link: 'https://example.com/ningxia-wine-region',
        content: '宁夏贺兰山东麓葡萄酒产区近年来发展迅速，已成为 中国最具潜力的葡萄酒产区之一。得益于独特的风土条件和政府的政策支持，宁夏产区的葡萄酒品质不断提升。在最近的国际葡萄酒大赛中，多款宁夏葡萄酒斩获金奖，标志着中国葡萄酒正在获得国际认可。',
        pubDate: new Date(Date.now() - 518400000),
        source: '红酒世界',
        type: 'mock',
        author: '赵磊',
        quality: 90,
      },
      {
        id: uuidv4(),
        title: '赤霞珠和梅洛混酿的艺术',
        link: 'https://example.com/cabernet-merlot-blend',
        content: '赤霞珠和梅洛是波尔多混酿中最经典的组合。赤霞珠提供结构感、单宁和黑果香气，而梅洛则带来柔和的口感、饱满的酒体和红色水果风味。酿酒师通过调整两种葡萄的比例来平衡酒液的复杂度与易饮性。通常，赤霞珠占60%-70%，梅洛占30%-40%。',
        pubDate: new Date(Date.now() - 604800000),
        source: '品酒汇',
        type: 'mock',
        author: '周敏',
        quality: 85,
      },
      {
        id: uuidv4(),
        title: '有机葡萄酒市场增长迅速，年轻消费者成主力',
        link: 'https://example.com/organic-wine-market',
        content: '根据最新市场研究报告，有机葡萄酒市场在过去五年中保持了年均15%的增长率。年轻消费者（25-40岁）成为推动这一增长的主要力量。他们更关注健康、环保和可持续发展，愿意为有机认证的葡萄酒支付更高价格。欧盟是有机葡萄酒最大的生产和消费市场。',
        pubDate: new Date(Date.now() - 691200000),
        source: '酒咔嚓',
        type: 'mock',
        author: '吴强',
        quality: 83,
      },
      {
        id: uuidv4(),
        title: '起泡酒和香槟的区别，你真的知道吗？',
        link: 'https://example.com/sparkling-vs-champagne',
        content: '很多消费者分不清起泡酒和香槟的区别。其实，只有法国香槟地区生产的起泡酒才能被称为"香槟"。香槟采用传统的瓶内二次发酵法（传统法）生产，酿造周期长，风味复杂。而其他产区的起泡酒可能采用罐内发酵法或 Charmat 法生产，成本较低，价格相对亲民。',
        pubDate: new Date(Date.now() - 777600000),
        source: '酒虫网',
        type: 'mock',
        author: '徐丽',
        quality: 79,
      },
      {
        id: uuidv4(),
        title: '投资级葡萄酒：如何选择有升值潜力的酒款？',
        link: 'https://example.com/investment-wine',
        content: '葡萄酒投资已成为另类投资的新兴领域。要选择具有升值潜力的酒款，需要关注以下几点：首先是品牌知名度，一级庄和车库酒庄是首选。其次是年份，优秀年份的葡萄酒通常更具收藏价值。再次是评分，罗伯特·帕克等权威酒评家的高分评价会影响酒款的市场价格。建议投资组合多元化。',
        pubDate: new Date(Date.now() - 864000000),
        source: '逸香网',
        type: 'mock',
        author: '孙浩',
        quality: 87,
      },
    ];

    return mockArticles;
  }

  async crawlFromWebsites() {
    console.log('正在从目标网站直接采集...');
    const articles = [];

    const targetSites = [
      {
        name: '红酒世界',
        url: 'https://www.wine-world.com',
        articleSelector: '.news-item a, .article-list a, .item a',
        titleSelector: 'h1, .title, .article-title',
        contentSelector: '.article-content, .content, .article-body, .text',
        maxArticles: 15,
      },
      {
        name: '搜狐酒',
        url: 'https://wine.163.com',
        articleSelector: '.news-list a, .article-list a',
        titleSelector: 'h1, .title',
        contentSelector: '.article-body, .content, .text',
        maxArticles: 20,
      },
      {
        name: '新浪酒',
        url: 'https://wine.sina.com.cn',
        articleSelector: '.news-list a, .article a',
        titleSelector: 'h1',
        contentSelector: '.article-content, .content',
        maxArticles: 20,
      },
      {
        name: '腾讯酒',
        url: 'https://wine.qq.com',
        articleSelector: '.list a, .news-list a',
        titleSelector: 'h1',
        contentSelector: '.article, .content',
        maxArticles: 20,
      },
      {
        name: '知乎',
        url: 'https://www.zhihu.com/topic/红酒',
        articleSelector: '.List-item a',
        titleSelector: 'h1',
        contentSelector: '.RichText, .content',
        maxArticles: 15,
        needAuth: false,
      },
    ];

    // 逐站点检查 robots.txt -> 爬取（并行前置判断）
    const siteResults = await Promise.allSettled(targetSites.map(async (site) => {
      const can = await shouldCrawl(site.url);
      if (!can) {
        console.log(`${site.name}: robots.txt 禁止抓取，跳过`);
        incCrawlFailure(1);
        return null;
      }
      return this.scrapeWebsite(site);
    }));

    siteResults.forEach((result, idx) => {
      const site = targetSites[idx];
      if (result && result.status === 'fulfilled' && result.value) {
        const siteArticles = result.value;
        articles.push(...siteArticles);
        console.log(`${site.name}: 获取 ${siteArticles.length} 篇文章`);
        incCrawled(siteArticles.length);
      } else if (result && result.status === 'rejected') {
        const error = result.reason;
        console.error(`网站采集失败 (${site.name}):`, error?.message || error);
        incCrawlFailure(1);
      }
    });

    console.log(`网站采集完成，获取 ${articles.length} 篇文章`);
    return articles;
  }

  async scrapeWebsite(site) {
    const articles = [];
    const visitedUrls = new Set();
    const domain = new URL(site.url).hostname;
    const circuitBreaker = this.getCircuitBreaker(domain);

    try {
      // 使用断路器和重试机制获取页面
      const response = await circuitBreaker.execute(() =>
        withRetry(
          () => axios.get(site.url, {
            headers: this.headers,
            timeout: config.crawl.timeout * 2,
          }),
          { maxRetries: 2, initialDelay: 2000 }
        )
      );

      const $ = cheerio.load(response.data);
      
      $('script, style, nav, footer, iframe, .ad, .advertisement, .comments').remove();

      const articleLinks = [];
      const seenTitles = new Set();

      $(site.articleSelector).each((i, el) => {
        if (i > 50) return;
        
        const href = $(el).attr('href');
        let title = $(el).text().trim();
        
        // 清理标题
        title = title.replace(/\s+/g, ' ').trim();
        
        if (href && title && title.length > 15 && title.length < 200) {
          const fullUrl = href.startsWith('http') ? href : 
                          href.startsWith('/') ? site.url + href : 
                          site.url + '/' + href;
          
          const titleHash = this.hashString(title);
          if (!seenTitles.has(titleHash) && !visitedUrls.has(fullUrl)) {
            seenTitles.add(titleHash);
            articleLinks.push({ url: fullUrl, title });
          }
        }
      });

      console.log(`${site.name}: 发现 ${articleLinks.length} 篇文章链接`);

      // 使用批量处理并行爬取文章详情
      const { results } = await withBatch(
        articleLinks.slice(0, site.maxArticles || 15),
        async (link) => {
          const articleContent = await this.scrapeArticle(link, site);
          if (articleContent && this.isRelevantWineArticle(articleContent)) {
            return articleContent;
          }
          return null;
        },
        {
          concurrency: 3,
          continueOnError: true,
          onProgress: (completed, total) => {
            if (completed % 5 === 0) {
              console.log(`${site.name}: 爬取进度 ${completed}/${total}`);
            }
          }
        }
      );

      // 收集成功的文章
      results
        .filter(r => r.status === 'fulfilled' && r.value)
        .forEach(r => {
          articles.push(r.value);
          visitedUrls.add(r.item.url);
        });

    } catch (error) {
      const appError = createAppError(error, { site: site.name });
      console.error(`${site.name} 页面访问失败:`, appError.message);
      
      // 如果是断路器打开，记录状态
      if (circuitBreaker.state === 'OPEN') {
        console.warn(`${site.name} 断路器已打开，暂时跳过`);
      }
    }

    return articles;
  }

  async scrapeArticle(link, site) {
    const domain = new URL(link.url).hostname;
    const circuitBreaker = this.getCircuitBreaker(domain);

    try {
      const response = await circuitBreaker.execute(() =>
        withRetry(
          () => axios.get(link.url, {
            headers: this.headers,
            timeout: config.crawl.timeout,
          }),
          { maxRetries: 2 }
        )
      );

      const $ = cheerio.load(response.data);
      
      $('script, style, nav, footer, iframe, .ad, .advertisement, .comments, .footer, .header').remove();

      const title = $(site.titleSelector).first().text().trim() || 
                    $('title').text().trim() ||
                    link.title;

      let content = '';
      for (const selector of [site.contentSelector, 'article', '.article-content', '.content', '.post-content', '.entry-content', '.article-body', '.detail', 'main', '.main']) {
        content = $(selector).text()?.trim() || '';
        if (content.length > 100) break;
      }

      if (!content || content.length < 50) {
        content = $('body').text()?.replace(/\s+/g, ' ').trim() || '';
      }

      const pubDateStr = $('time').attr('datetime') ||
                         $('.publish-time, .date, .pub-date, .create-time').text().trim() ||
                         '';

      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      return {
        id: uuidv4(),
        title,
        link: link.url,
        content: content.slice(0, 5000),
        pubDate,
        source: site.name,
        type: 'website',
        author: $('.author, .writer').text().trim() || '未知',
        quality: 0,
      };
    } catch (error) {
      // 静默失败，返回null
      return null;
    }
  }

  async crawlFromRSS() {
    console.log('正在从RSS源采集...');
    const articles = [];
    const rssSources = config.crawl.rssSources || [];
    console.log(`  配置的RSS源数量: ${rssSources.length}`);

    const feedResults = await Promise.allSettled(
      rssSources.map(feedUrl =>
        withRetry(
          () => {
            console.log(`    正在抓取: ${feedUrl}`);
            return this.parser.parseURL(feedUrl);
          },
          { maxRetries: 2 }
        ).catch(err => {
          console.error(`  RSS源采集失败 (${feedUrl}): ${err.message}`);
          throw err;
        })
      )
    );

    feedResults.forEach((result, index) => {
      const feedUrl = rssSources[index];
      if (result.status === 'fulfilled') {
        const feed = result.value;
        console.log(`  ✅ 成功: ${feedUrl} - ${feed.items?.length || 0} 条目`);
        
        for (const item of feed.items.slice(0, 20)) {
          const article = {
            id: uuidv4(),
            title: item.title,
            link: item.link,
            content: item['content:encoded'] || item.content || item.summary || '',
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            source: feedUrl,
            type: 'rss',
            author: item.creator || item.author || '未知',
            tags: item.categories || [],
            quality: 0,
          };

          if (this.isRelevantWineArticle(article)) {
            articles.push(article);
          }
        }
      } else {
        console.log(`  ❌ 失败: ${feedUrl}`);
      }
    });

    console.log(`RSS采集完成，共获取 ${articles.length} 篇文章`);
    return articles;
  }

  async crawlFromSearch() {
    console.log('正在从搜索引擎采集...');
    const articles = [];

    const searchResults = await Promise.allSettled(
      config.crawl.keywords.map(keyword =>
        this.simulateSearch(keyword).catch(err => {
          console.error(`搜索采集失败 (${keyword}):`, err.message);
          throw err;
        })
      )
    );

    searchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        articles.push(...result.value);
      }
    });

    console.log(`搜索采集完成，获取 ${articles.length} 篇文章`);
    return articles;
  }

  async simulateSearch(keyword) {
    // 模拟从多个来源搜索红酒相关文章
    // 实际使用时，可以接入Bing API、Google API等
    const mockSources = [
      {
        name: '红酒世界',
        baseUrl: 'https://www.wine-world.com',
        url: `https://www.wine-world.com/search?key=${encodeURIComponent(keyword)}`,
      },
      {
        name: '酒咔嚓',
        baseUrl: 'https://www.9kacha.com',
        url: `https://www.9kacha.com/search?q=${encodeURIComponent(keyword)}`,
      },
    ];

    const results = [];

    const sourceResults = await Promise.allSettled(
      mockSources.map(source =>
        withRetry(
          () => axios.get(source.url, {
            headers: this.headers,
            timeout: config.crawl.timeout,
          }),
          { maxRetries: 2 }
        )
      )
    );

    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const source = mockSources[index];
        const $ = cheerio.load(result.value.data);
        
        // 提取搜索结果页中的文章链接
        $('a[href*="/article"]', $('body')).each((i, el) => {
          if (i < 10) {
            const href = $(el).attr('href');
            const title = $(el).text().trim();
            
            if (href && title && title.length > 10) {
              results.push({
                id: uuidv4(),
                title,
                link: href.startsWith('http') ? href : `${source.baseUrl}${href}`,
                source: source.name,
                type: 'search',
                pubDate: new Date(),
                quality: 0,
              });
            }
          }
        });
      }
    });

    return results;
  }

  async crawlFromAPIs() {
    console.log('正在从API接口采集...');
    const articles = [];

    // 模拟从API接口采集
    // 实际使用时，可以接入新闻API、社交媒体API等
    const apiSources = [
      {
        name: '今日头条',
        api: 'https://www.toutiao.com/api/search/content/',
        params: {
          keyword: '红酒',
          aid: 4912,
          app_name: 'web_search',
          offset: 0,
          format: 'json',
          autoload: true,
          count: 20,
          cur_tab: 1,
        },
      },
    ];

    const apiResults = await Promise.allSettled(
      apiSources.map(source =>
        withRetry(
          () => axios.get(source.api, {
            params: source.params,
            headers: this.headers,
            timeout: config.crawl.timeout,
          }),
          { maxRetries: 2 }
        )
      )
    );

    apiResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.data.data) {
        const source = apiSources[index];
        for (const item of result.value.data.data) {
          if (item.title && item.url) {
            articles.push({
              id: uuidv4(),
              title: item.title,
              link: item.url,
              content: item.abstract || '',
              pubDate: item.publish_time ? new Date(item.publish_time * 1000) : new Date(),
              source: source.name,
              type: 'api',
              author: item.source || '未知',
              quality: 0,
            });
          }
        }
      }
    });


    console.log();
    return articles;
  }

  // ===== 备用网站数据源 =====
  async crawlFromBackupWebsites() {
    console.log('正在从备用网站采集...');
    const articles = [];
    const backupSites = config.crawl.backupWebsites || [];

    if (backupSites.length === 0) {
      console.log('  无备用网站配置');
      return articles;
    }

    const siteResults = await Promise.allSettled(
      backupSites.map(async (site) => {
        const siteConfig = {
          name: site.name,
          url: site.url,
          articleSelector: site.selector || '.news-list a, .article-list a',
          titleSelector: site.titleSel || 'h1, .title',
          contentSelector: site.contentSel || '.content, .article-content',
          maxArticles: 10,
        };
        return this.scrapeWebsite(siteConfig);
      })
    );

    siteResults.forEach((result, idx) => {
      const site = backupSites[idx];
      if (result && result.status === 'fulfilled' && result.value) {
        const siteArticles = result.value;
        articles.push(...siteArticles);
        console.log();
        incCrawled(siteArticles.length);
      } else if (result && result.status === 'rejected') {
        console.log();
      }
    });

    console.log();
    return articles;
  }

  // ===== 新闻API数据源 =====
  async crawlFromNewsAPIs() {
    const newsApi = new NewsApiSource();
    const keywords = config.crawl.keywords || ['红酒', '葡萄酒'];
    return await newsApi.fetchAll(keywords);
  }




  async deduplicate(articles) {
    console.log('正在进行去重处理...');
    
    const seen = new Set();
    const uniqueArticles = [];

    for (const article of articles) {
      // 使用标题的哈希值去重
      const titleHash = this.hashString(article.title.toLowerCase());
      
      if (!seen.has(titleHash)) {
        seen.add(titleHash);
        uniqueArticles.push(article);
      }
    }

    console.log(`去重完成，从 ${articles.length} 篇减少到 ${uniqueArticles.length} 篇`);
    return uniqueArticles;
  }

  async filterAndRank(articles) {
    console.log('正在进行质量过滤和排序...');

    // 过滤低质量文章
    const filteredArticles = articles.filter(article => {
      // 过滤条件
      if (!article.title || article.title.length < 10) return false;
      if (article.title.includes('广告') || article.title.includes('推广')) return false;
      
      return true;
    });

    // 按质量评分排序
    filteredArticles.sort((a, b) => b.quality - a.quality);

    // 只保留前50篇
    const topArticles = filteredArticles.slice(0, 50);

    console.log(`质量过滤完成，保留 ${topArticles.length} 篇优质文章`);
    return topArticles;
  }

  async fetchArticleContent(article) {
    try {
      const response = await axios.get(article.link, {
        headers: this.headers,
        timeout: config.crawl.timeout,
      });

      const $ = cheerio.load(response.data);
      
      // 移除脚本和样式
      $('script, style, nav, footer, iframe').remove();

      // 提取主要内容
      const content = $('article').html() || 
                      $('.content').html() || 
                      $('main').html() || 
                      $('body').html() || '';

      // 转换为Markdown
      const markdown = this.turndownService.turndown(content);

      return {
        ...article,
        content: markdown,
        htmlContent: content,
        fetchedAt: new Date(),
      };
    } catch (error) {
      console.error(`获取文章内容失败 (${article.link}):`, error.message);
      return article;
    }
  }

  async saveToCache(articles) {
    try {
      const cacheKey = `crawl:${Date.now()}`;
      await this.redis.set(cacheKey, JSON.stringify(articles), config.cache.crawlCache * 3600);
      console.log(`已保存 ${articles.length} 篇文章到缓存`);
    } catch (error) {
      console.error('保存缓存失败:', error.message);
    }
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
}

module.exports = Crawler;
