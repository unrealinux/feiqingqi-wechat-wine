/**
 * 新闻API数据源
 * 
 * 支持多个国内新闻聚合API：
 * - 聚合数据 (juhe.cn)
 * - 天行数据 (tianapi.com)
 * - 自定义API
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { withRetry } = require('./errors');

// API配置
const API_CONFIG = {
  // 聚合数据 - 新闻头条
  juhe: {
    baseUrl: 'http://v.juhe.cn/toutiao/index',
    key: process.env.JUHE_API_KEY || '',
    type: 'toutiao', // top(头条),shehui(社会),guonei(国内),guoji(国际),yule(娱乐),tiyu(体育)等
    // 或使用 keywords 参数搜索
    searchUrl: 'http://v.juhe.cn/toutiao/content',
  },
  
  // 天行数据 - 新闻API
  tianapi: {
    baseUrl: 'https://api.tianapi.com/guonei/index',
    key: process.env.TIANAPI_KEY || '',
    // 可用端点: guonei/index (国内新闻) - 需要在官网申请
  },
  
  // 百度新闻搜索（需API Key）
  baidu: {
    baseUrl: 'https://api.baidu.com/jsonrpc/srpc',
    key: process.env.BAIDU_API_KEY || '',
  },
};

class NewsApiSource {
  constructor(options = {}) {
    this.timeout = options.timeout || 15000;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    };
  }

  /**
   * 聚合数据 - 新闻搜索
   */
  async fetchFromJuhe(keyword = '红酒') {
    const key = API_CONFIG.juhe.key;
    if (!key) {
      console.log('  聚合数据: 未配置API Key，跳过');
      return [];
    }

    try {
      console.log(`  聚合数据: 获取新闻头条...`);
      
      // 获取多种类型的新闻
      const types = ['top', 'guonei', 'guoji', 'keji', 'shehui'];
      const allArticles = [];
      
      for (const type of types) {
        try {
          const response = await axios.get(API_CONFIG.juhe.baseUrl, {
            params: { key, type },
            headers: this.headers,
            timeout: this.timeout,
          });
      if (response.data?.error_code === 0 && response.data?.result?.data) {
            response.data.result.data.forEach(item => {
              allArticles.push({
                id: uuidv4(),
                title: item.title,
                link: item.url,
                content: item.abstract || '',
                pubDate: item.date ? new Date(item.date) : new Date(),
                source: item.author_name || '聚合数据',
                type: 'juhe',
                author: item.author_name || '未知',
                thumbnail: item.thumbnail_pic_s,
                quality: 50,
              });
            });
          }
        } catch (e) {
          // 忽略单个类型的错误
        }
      }

      // 先筛选红酒相关文章
      const wineArticles = allArticles.filter(item => 
        this.isWineRelated(item.title + ' ' + item.content)
      );
      
      // 如果筛选到红酒相关，返回红酒文章
      if (wineArticles.length > 0) {
        console.log(`  聚合数据: 获取 ${wineArticles.length} 篇红酒相关文章 (共 ${allArticles.length} 篇)`);
        return wineArticles.map(a => ({ ...a, quality: 80 }));
      }
      
      // 如果没有红酒相关，返回所有文章（供后续AI处理）
      console.log(`  聚合数据: 获取 ${allArticles.length} 篇新闻头条`);
      return allArticles.slice(0, 20); // 最多返回20篇
    } catch (error) {
      console.log(`  聚合数据: 请求失败 - ${error.message}`);
      return [];
    }
  }

  /**
   * 天行数据 - 国内新闻
   */
  async fetchFromTianapi(keyword = '红酒') {
    const key = API_CONFIG.tianapi.key;
    if (!key) {
      console.log('  天行数据: 未配置API Key，跳过');
      return [];
    }

    try {
      console.log(`  天行数据: 获取国内新闻...`);
      
      const response = await withRetry(
        () => axios.get(API_CONFIG.tianapi.baseUrl, {
          params: {
            key: key,
            num: 20,
          },
          headers: this.headers,
          timeout: this.timeout,
        }),
        { maxRetries: 2 }
      );

      if (response.data?.code === 200 && response.data?.newslist) {
        const articles = response.data.newslist.map(item => ({
          id: uuidv4(),
          title: item.title,
          link: item.url,
          content: item.description || item.content || '',
          pubDate: item.ctime ? new Date(item.ctime) : new Date(),
          source: item.source || '天行数据',
          type: 'tianapi',
          author: item.author || '未知',
          thumbnail: item.picUrl,
          quality: 75,
        }));
        
        console.log(`  天行数据: 获取 ${articles.length} 篇文章`);
        return articles;
      }
      
      console.log('  天行数据: 响应格式异常');
      return [];
    } catch (error) {
      console.log(`  天行数据: 请求失败 - ${error.message}`);
      return [];
    }
  }

  /**
   * 自定义RSS/API源
   */
  async fetchFromCustomSource(source) {
    try {
      console.log(`  自定义源: ${source.name}...`);
      
      const response = await withRetry(
        () => axios.get(source.url, {
          params: source.params || {},
          headers: { ...this.headers, ...source.headers },
          timeout: this.timeout,
        }),
        { maxRetries: 2 }
      );

      if (source.parser) {
        return source.parser(response.data);
      }
      
      return [];
    } catch (error) {
      console.log(`  自定义源: ${source.name} 请求失败 - ${error.message}`);
      return [];
    }
  }

  /**
   * 检查是否与红酒相关
   */
  isWineRelated(text) {
    const keywords = [
      '红酒', '葡萄酒', 'wine', '品酒', '酒庄', '产区',
      '葡萄', '干红', '干白', '起泡酒', '香槟', '酿酒',
    ];
    const lowerText = text.toLowerCase();
    return keywords.some(k => lowerText.includes(k.toLowerCase()));
  }

  /**
   * 从所有可用源获取新闻
   */
  async fetchAll(keywords = ['红酒', '葡萄酒', 'wine']) {
    console.log('正在从新闻API采集...');
    const allArticles = [];

    // 聚合数据
    for (const keyword of keywords) {
      const articles = await this.fetchFromJuhe(keyword);
      allArticles.push(...articles);
    }

    // 天行数据
    for (const keyword of keywords) {
      const articles = await this.fetchFromTianapi(keyword);
      allArticles.push(...articles);
    }

    console.log(`新闻API采集完成，获取 ${allArticles.length} 篇文章`);
    return allArticles;
  }

  /**
   * 获取API配置状态
   */
  getStatus() {
    return {
      juhe: {
        configured: !!API_CONFIG.juhe.key,
        name: '聚合数据',
        url: 'https://www.juhe.cn',
        docs: 'https://www.juhe.cn/docs/api/id/88',
      },
      tianapi: {
        configured: !!API_CONFIG.tianapi.key,
        name: '天行数据',
        url: 'https://www.tianapi.com',
        docs: 'https://www.tianapi.com/apiview/51',
      },
    };
  }
}

module.exports = {
  NewsApiSource,
  API_CONFIG,
};
