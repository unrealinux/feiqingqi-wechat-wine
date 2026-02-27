require('dotenv').config();

module.exports = {
  // 采集配置
  crawl: {
    // RSS源 - 支持通过环境变量配置，逗号分隔多个URL
    // 示例: set RSS_SOURCES=https://site1.com/rss.xml,https://site2.com/rss.xml
    rssSources: (() => {
      const envSources = process.env.RSS_SOURCES;
      if (envSources) {
        return envSources.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [
        'https://www.wine-world.com/articlerss/rss.aspx',
        'https://www.decanter.com/feed/',
        'https://www.vinepair.com/feed/',
        'https://www.wine-searcher.com/news/rss',
      ];
    })(),

    // 备用数据源 - 国内红酒/葡萄酒网站 (按优先级排序)
    backupWebsites: [
      // 葡萄酒资讯网
      { name: '葡萄酒资讯网', url: 'https://www.winesinfo.com', selector: '.news-list a, .article-list a', titleSel: 'h1, .title', contentSel: '.content, .article-content' },
      // 食品伙伴网-葡萄酒
      { name: '食品伙伴网-葡萄酒', url: 'http://wine.foodmate.net', selector: '.news_list a, .article-list a', titleSel: 'h1, .title', contentSel: '.content, .article-content' },
      // 葡萄酒商业观察
      { name: '葡萄酒商业观察', url: 'https://www.wbo529.com', selector: '.news-list a, .article-list a', titleSel: 'h1, .title', contentSel: '.content, .article-content' },
      // 中国酒业新闻网
      { name: '中国酒业新闻网', url: 'http://www.cnwinenews.com', selector: '.news-list a, .article-list a', titleSel: 'h1, .title', contentSel: '.content, .article-content' },
      // 国家葡萄葡萄酒产业网
      { name: '国家葡萄葡萄酒产业网', url: 'http://www.chngw.net', selector: '.news-list a, ul li a', titleSel: 'h1, .title', contentSel: '.content, .article-content' },
    ],

    // 搜索关键词
    keywords: [
      '红酒',
      '葡萄酒',
      'wine',
      '品酒',
      '红酒推荐',
      '红酒知识',
      '葡萄酒产区',
      '酒庄',
    ],
    interval: 30000,
    maxConcurrent: 3,
    timeout: 15000,
    // 速率限制配置
    rateLimit: {
      enabled: true,
      maxRequests: 30,      // 每时间窗口最大请求数
      windowMs: 60000,       // 时间窗口（毫秒）
      crawlDelay: 1000,      // 请求间隔（毫秒）
    },
    // 是否遵守robots.txt
    respectRobotsTxt: true,
  },

  // 聚合配置
  aggregate: {
    // 去重时间窗口（小时）
    deduplicationWindow: 24,
    // 最小内容长度
    minContentLength: 100,
    // 分类数量
    categoryCount: 5,
  },

  // 生成配置 - API端点配置化
  generate: {
    // 模型提供商: openai / minimax / deepseek / zhipu / ollama
    provider: process.env.LLM_PROVIDER || 'minimax',
    // 模型名称
    model: process.env.LLM_MODEL || 'abab6.5s-chat',
    // API配置
    apiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY,
    baseUrl: process.env.LLM_BASE_URL || 'https://api.minimax.chat/v1',
    // API端点配置（敏感配置，不硬编码）
    endpoints: {
      openai: process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
      minimax: process.env.MINIMAX_ENDPOINT || 'https://api.minimax.chat/v1/text/chatcompletion_v2',
      deepseek: process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/chat/completions',
      zhipu: process.env.ZHIPU_ENDPOINT || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    },
    // 生成参数
    temperature: 0.7,
    maxTokens: 4000,
    // 文章风格
    style: '微信公众号风格 - 标题吸引人，图文并茂，语言生动',
    targetLength: 2000,
    // 请求限流
    rateLimit: {
      maxRetries: 3,
      retryDelay: 2000,
    },
  },

  // 发布配置
  publish: {
    // 公众号AppID
    appId: process.env.WECHAT_APPID,
    // 公众号Secret
    appSecret: process.env.WECHAT_SECRET,
    // API端点配置化
    endpoints: {
      token: process.env.WECHAT_TOKEN_URL || 'https://api.weixin.qq.com/cgi-bin/token',
      draft: process.env.WECHAT_DRAFT_URL || 'https://api.weixin.qq.com/cgi-bin/draft/add',
      publish: process.env.WECHAT_PUBLISH_URL || 'https://api.weixin.qq.com/cgi-bin/freepublish/commit',
      uploadImg: process.env.WECHAT_UPLOAD_URL || 'https://api.weixin.qq.com/cgi-bin/media/uploadimg',
      material: 'https://api.weixin.qq.com/cgi-bin/material/add_material',
    },
    // 文章类型
    contentType: 'news',
    // 自动发布开关（环境变量优先）
    autoPublish: process.env.WECHAT_AUTO_PUBLISH === 'true',
    // 发布间隔（毫秒）
    publishInterval: 5000,
    // 测试模式（只创建草稿，不发布）
    testMode: process.env.WECHAT_TEST_MODE === 'true',
    // 封面图配置
    defaultThumb: 'https://example.com/wine-cover.jpg',
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wine_articles',
  },

  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    keyPrefix: 'wine:',
  },

  // 缓存配置
  cache: {
    // 采集结果缓存时间（小时）
    crawlCache: 24,
    // 生成结果缓存时间（小时）
    generateCache: 168,
    // LRU缓存配置
    lru: {
      maxSize: 500,
      ttl: 3600000, // 1小时
    }
  },

  // 性能配置
  performance: {
    // HTTP连接池配置
    http: {
      maxSockets: 10,          // 最大并发连接数
      maxFreeSockets: 5,        // 最大空闲连接数
      timeout: 60000,            // 连接超时（毫秒）
    },
    // 并发控制
    concurrency: {
      maxConcurrentRequests: 5,  // 最大并发请求数
      requestDelay: 200,          // 请求间隔（毫秒）
      retryAttempts: 3,           // 重试次数
    },
    // 内存优化
    memory: {
      enableGC: true,            // 启用定期垃圾回收
      gcInterval: 300000,        // GC间隔（毫秒）5分钟
    }
  },

  // 日志配置
  logging: {
    level: 'info',
    format: 'json',
    file: 'logs/app.log',
  },
};
