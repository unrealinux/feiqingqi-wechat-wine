const { Redis, Logger } = require('./utils');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const { createAppError, AppError, ErrorTypes } = require('./errors');

class Aggregator {
  constructor() {
    this.redis = new Redis();
    this.logger = new Logger();
  }

  async aggregate(articles) {
    console.log('开始汇总文章...');
    const startTime = Date.now();

    try {
      if (!articles || articles.length === 0) {
        throw new AppError('没有文章需要汇总', ErrorTypes.VALIDATION);
      }

      // 1. 内容清洗
      const cleanedArticles = await this.cleanContent(articles);

      // 2. 智能分类
      const categorizedArticles = await this.categorize(cleanedArticles);

      // 3. 将分类对象转换为扁平数组用于后续处理
      const flatArticles = Object.values(categorizedArticles).flat();

      if (flatArticles.length === 0) {
        throw new AppError('分类后没有有效文章', ErrorTypes.VALIDATION);
      }

      // 4. 提取关键信息
      const extractedArticles = await this.extractKeyInfo(flatArticles);

      // 5. 生成摘要
      const summarizedArticles = await this.generateSummaries(extractedArticles);

      // 6. 创建知识图谱
      const knowledgeGraph = await this.buildKnowledgeGraph(summarizedArticles);

      // 7. 生成汇总报告
      const report = await this.generateReport(summarizedArticles, knowledgeGraph);

      const duration = Date.now() - startTime;
      console.log(`汇总完成，耗时 ${duration}ms`);

      return {
        articles: summarizedArticles,
        categories: categorizedArticles,
        knowledgeGraph,
        report,
      };
    } catch (error) {
      const appError = createAppError(error, { operation: 'aggregate' });
      console.error('汇总过程出错:', appError.message);
      throw appError;
    }
  }

  async cleanContent(articles) {
    console.log('正在清洗内容...');
    
    return articles.map(article => {
      return {
        ...article,
        // 清洗标题
        title: this.cleanText(article.title),
        // 清洗内容
        content: this.cleanText(article.content),
        // 提取日期
        pubDate: article.pubDate instanceof Date ? article.pubDate : new Date(article.pubDate),
        // 添加唯一标识
        uid: uuidv4(),
        // 添加时间戳
        timestamp: Date.now(),
      };
    });
  }

  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/&nbsp;/g, ' ')  // 替换空格实体
      .replace(/&amp;/g, '&')  // 替换&实体
      .replace(/&lt;/g, '<')   // 替换<实体
      .replace(/&gt;/g, '>')   // 替换>实体
      .replace(/&quot;/g, '"') // 替换"实体
      .replace(/\s+/g, ' ')    // 合并空白字符
      .trim();
  }

  async categorize(articles) {
    console.log('正在智能分类...');

    const categories = {
      '行业动态': [],
      '品酒评测': [],
      '知识科普': [],
      '产区新闻': [],
      '市场趋势': [],
      '人物访谈': [],
      '其他': [],
    };

    const categoryKeywords = {
      '行业动态': ['行业', '市场', '动态', '趋势', '报告', '数据', '统计'],
      '品酒评测': ['品酒', '评测', '评分', '推荐', '口感', '香气', '风味'],
      '知识科普': ['知识', '科普', '指南', '技巧', '如何', '为什么', '是什么'],
      '产区新闻': ['产区', '酒庄', '葡萄园', '产地', '法国', '意大利', '智利'],
      '市场趋势': ['趋势', '增长', '下降', '预测', '机遇', '挑战'],
      '人物访谈': ['访谈', '对话', '专访', '创始人', '酿酒师', 'CEO'],
    };

    for (const article of articles) {
      const text = (article.title + ' ' + article.content).toLowerCase();
      let assigned = false;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        const matchCount = keywords.filter(keyword => 
          text.includes(keyword.toLowerCase())
        ).length;

        if (matchCount >= 2) {
          categories[category].push({
            ...article,
            category,
            categoryConfidence: matchCount / keywords.length,
          });
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        categories['其他'].push({
          ...article,
          category: '其他',
          categoryConfidence: 0,
        });
      }
    }

    // 统计各类别文章数量
    console.log('分类统计:');
    for (const [category, items] of Object.entries(categories)) {
      console.log(`  ${category}: ${items.length} 篇`);
    }

    return categories;
  }

  async extractKeyInfo(articles) {
    console.log('正在提取关键信息...');

    return articles.map(article => {
      const info = {
        ...article,
        keyInfo: {
          // 提取提到的红酒类型
          wineTypes: this.extractWineTypes(article.content),
          // 提取提到的产区
          regions: this.extractRegions(article.content),
          // 提取提到的品牌
          brands: this.extractBrands(article.content),
          // 提取年份
          vintages: this.extractVintages(article.content),
          // 提取价格信息
          prices: this.extractPrices(article.content),
          // 提取评分
          ratings: this.extractRatings(article.content),
        },
      };

      return info;
    });
  }

  extractWineTypes(content) {
    const wineTypes = [
      '干红', '干白', '半干', '半甜', '甜白', '起泡酒', '香槟',
      '贵腐酒', '冰酒', '加强酒', '波特酒', '雪莉酒',
      '赤霞珠', '梅洛', '黑皮诺', '霞多丽', '雷司令',
      '长相思', '西拉', '品丽珠', '丹魄', '马尔贝克',
    ];

    const found = [];
    const contentLower = content.toLowerCase();

    for (const type of wineTypes) {
      if (content.includes(type)) {
        found.push(type);
      }
    }

    return found;
  }

  extractRegions(content) {
    const regions = [
      '波尔多', '勃艮第', '香槟', '罗纳河谷', '卢瓦尔河谷',
      '托斯卡纳', '皮埃蒙特', '威尼托', '阿斯蒂',
      '纳帕谷', '索诺玛', '门多萨', '中央山谷',
      '巴罗萨谷', '克莱尔谷', '玛格丽特河',
      '新疆', '宁夏', '烟台', '通化',
    ];

    const found = [];
    for (const region of regions) {
      if (content.includes(region)) {
        found.push(region);
      }
    }

    return found;
  }

  extractBrands(content) {
    const brands = [
      '拉菲', '拉图', '玛歌', '木桐', '奥比昂',
      '罗曼尼康帝', '亨利贾叶', '路易亚都',
      '奔富', '杰卡斯', '黄尾袋鼠',
      '张裕', '长城', '王朝', '威龙',
    ];

    const found = [];
    for (const brand of brands) {
      if (content.includes(brand)) {
        found.push(brand);
      }
    }

    return found;
  }

  extractVintages(content) {
    const vintages = [];
    const yearRegex = /(?:19|20)\d{2}/g;
    const matches = content.match(yearRegex);
    
    if (matches) {
      const uniqueYears = [...new Set(matches)];
      for (const year of uniqueYears) {
        const numYear = parseInt(year);
        if (numYear >= 1950 && numYear <= 2025) {
          vintages.push(year);
        }
      }
    }

    return [...new Set(vintages)].slice(0, 10);
  }

  extractPrices(content) {
    const prices = [];
    const priceRegex = /[¥$€£]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)|(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:元|美元|欧元|英镑)/g;
    const matches = content.match(priceRegex);
    
    if (matches) {
      prices.push(...matches.slice(0, 5));
    }

    return prices;
  }

  extractRatings(content) {
    const ratings = [];
    const ratingPatterns = [
      /\b(\d+(?:\.\d)?)\s*(?:分|point|points)\b/gi,
      /\b(?:RP|WS|WA|JS|V)\s*[:：]?\s*(\d+(?:\.\d)?)\b/gi,
      /\b(\d+(?:\.\d)?)\/\s*100\b/gi,
      /\b(\d+(?:\.\d)?)\/\s*20\b/gi,
    ];

    for (const pattern of ratingPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const score = parseFloat(match.match(/\d+(?:\.\d)?/)[0]);
          if (score >= 50 && score <= 100) {
            ratings.push({
              score,
              source: match.replace(/[\d.\/\s]/g, '') || '评分',
            });
          }
        }
      }
    }

    return ratings.slice(0, 10);
  }

  async generateSummaries(articles) {
    console.log('正在生成文章摘要...');

    // 使用简化的提取式摘要方法
    return articles.map(article => {
      const content = article.content || '';
      
      // 提取前100个字作为简短摘要
      const briefSummary = content.slice(0, 150) + '...';
      
      // 提取关键词
      const keywords = this.extractKeywords(content);
      
      // 生成一句话总结
      const oneSentence = this.generateOneSentence(article);

      return {
        ...article,
        briefSummary,
        keywords,
        oneSentence,
        wordCount: content.split(/\s+/).length,
      };
    });
  }

  extractKeywords(content) {
    const stopWords = ['的', '是', '在', '和', '与', '或', '等', '了', '一个', '一些', '这个', '那个'];
    
    const words = content.split(/\s+/);
    const wordCount = {};
    
    for (const word of words) {
      if (word.length > 2 && !stopWords.includes(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
    
    // 返回词频最高的10个词
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  generateOneSentence(article) {
    const type = article.category || '其他';
    const templates = {
      '行业动态': `关于${article.source}发布的最新行业动态报道`,
      '品酒评测': `专业品酒师对相关红酒的深度评测`,
      '知识科普': `红酒知识的全面科普与解析`,
      '产区新闻': `来自${article.keyInfo.regions[0] || '主要产区'}的最新消息`,
      '市场趋势': `红酒市场发展趋势分析`,
      '人物访谈': `业内专家深度访谈`,
      '其他': `红酒相关资讯分享`,
    };

    return templates[type] || '红酒相关资讯';
  }

  async buildKnowledgeGraph(articles) {
    console.log('正在构建知识图谱...');

    const graph = {
      nodes: [],
      edges: [],
      entities: {
        wineTypes: new Set(),
        regions: new Set(),
        brands: new Set(),
        vintages: new Set(),
      },
    };

    // 统计实体出现频率
    const entityCount = {
      wineTypes: {},
      regions: {},
      brands: {},
    };

    for (const article of articles) {
      const { keyInfo } = article;

      // 统计红酒类型
      for (const type of keyInfo.wineTypes) {
        entityCount.wineTypes[type] = (entityCount.wineTypes[type] || 0) + 1;
        graph.entities.wineTypes.add(type);
      }

      // 统计产区
      for (const region of keyInfo.regions) {
        entityCount.regions[region] = (entityCount.regions[region] || 0) + 1;
        graph.entities.regions.add(region);
      }

      // 统计品牌
      for (const brand of keyInfo.brands) {
        entityCount.brands[brand] = (entityCount.brands[brand] || 0) + 1;
        graph.entities.brands.add(brand);
      }

      // 收集年份
      for (const vintage of keyInfo.vintages) {
        graph.entities.vintages.add(vintage);
      }
    }

    // 构建节点
    graph.nodes = [
      ...Object.entries(entityCount.wineTypes).map(([name, count]) => ({
        id: `type_${name}`,
        name,
        type: 'wineType',
        count,
      })),
      ...Object.entries(entityCount.regions).map(([name, count]) => ({
        id: `region_${name}`,
        name,
        type: 'region',
        count,
      })),
      ...Object.entries(entityCount.brands).map(([name, count]) => ({
        id: `brand_${name}`,
        name,
        type: 'brand',
        count,
      })),
    ];

    // 构建边（基于共现关系）
    for (const article of articles) {
      const { keyInfo } = article;
      
      // 产区-类型关系
      for (const region of keyInfo.regions) {
        for (const type of keyInfo.wineTypes) {
          graph.edges.push({
            from: `region_${region}`,
            to: `type_${type}`,
            weight: 1,
          });
        }
      }

      // 品牌-产区关系
      for (const brand of keyInfo.brands) {
        for (const region of keyInfo.regions) {
          graph.edges.push({
            from: `brand_${brand}`,
            to: `region_${region}`,
            weight: 1,
          });
        }
      }
    }

    // 统计信息
    graph.stats = {
      totalArticles: articles.length,
      totalEntities: graph.nodes.length,
      topWineTypes: Object.entries(entityCount.wineTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      topRegions: Object.entries(entityCount.regions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      topBrands: Object.entries(entityCount.brands)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
    };

    console.log(`知识图谱构建完成，包含 ${graph.nodes.length} 个实体节点`);
    return graph;
  }

  async generateReport(articles, knowledgeGraph) {
    const categoryStats = {};
    
    for (const article of articles) {
      const category = article.category || '未分类';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    }

    return {
      totalArticles: articles.length,
      categoryStats,
      publishedRange: {
        earliest: articles.reduce((min, a) => a.pubDate < min ? a.pubDate : min, articles[0]?.pubDate),
        latest: articles.reduce((max, a) => a.pubDate > max ? a.pubDate : max, articles[0]?.pubDate),
      },
      topKeywords: articles.flatMap(a => a.keywords)
        .reduce((count, word) => {
          count[word] = (count[word] || 0) + 1;
          return count;
        }, {}),
      generatedAt: new Date(),
    };
  }
}

module.exports = Aggregator;
