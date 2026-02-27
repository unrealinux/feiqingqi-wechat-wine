require('dotenv').config();

const Crawler = require('./crawler');
const Aggregator = require('./aggregator');
const ArticleGenerator = require('./generator');
const WeChatPublisher = require('./publisher');
const { Logger, Redis } = require('./utils');
const cron = require('node-cron');
const config = require('./config');

class WineArticleApp {
  constructor() {
    this.logger = new Logger();
    this.redis = new Redis();
    this.crawler = new Crawler();
    this.aggregator = new Aggregator();
    this.generator = new ArticleGenerator();
    this.publisher = new WeChatPublisher();
  }

  async run() {
    console.log('='.repeat(50));
    console.log('红酒文章采集和发布系统启动');
    console.log('='.repeat(50));

    try {
      // 1. 采集文章
      const articles = await this.crawler.crawl();
      
      if (articles.length === 0) {
        console.log('未采集到任何文章，程序退出');
        return;
      }

      // 2. 汇总和分析
      const aggregatedData = await this.aggregator.aggregate(articles);
      
      // 3. 生成微信公众号文章
      const generatedArticle = await this.generator.generate(aggregatedData);
      
      // 4. 发布到微信公众号
      if (config.publish.autoPublish) {
        const publishResult = await this.publisher.publish(generatedArticle);
        
        console.log('\n' + '='.repeat(50));
        console.log('发布结果:');
        console.log(`文章标题: ${generatedArticle.title}`);
        console.log(`发布时间: ${new Date().toLocaleString()}`);
        console.log(`发布状态: ${publishResult.success ? '成功' : '失败'}`);
        if (publishResult.url) {
          console.log(`文章链接: ${publishResult.url}`);
        }
        console.log('='.repeat(50));
      } else {
        console.log('\n' + '='.repeat(50));
        console.log('生成的文章预览:');
        console.log(`标题: ${generatedArticle.title}`);
        console.log(`副标题: ${generatedArticle.subtitle}`);
        console.log(`摘要: ${generatedArticle.abstract}`);
        console.log(`字数: ${generatedArticle.wordCount}`);
        console.log('='.repeat(50));
      }

      // 5. 保存生成结果到文件
      this.saveArticleToFile(generatedArticle);

      return {
        articles: articles.length,
        categories: Object.keys(aggregatedData.categories).length,
        article: generatedArticle,
      };
    } catch (error) {
      console.error('程序执行出错:', error);
      this.logger.error('程序执行出错', { error: error.message });
    } finally {
      try {
        await this.redis.close();
      } catch (error) {
        // 忽略关闭错误
      }
    }
  }

  saveArticleToFile(article) {
    const fs = require('fs');
    const outputDir = './output';
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `wine_article_${Date.now()}.json`;
    const filePath = `${outputDir}/${fileName}`;

    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
    console.log(`\n文章已保存到: ${filePath}`);

    // 同时保存HTML版本
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${article.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #722F37; }
    h2 { color: #8B0000; margin-top: 30px; }
    .subtitle { color: #666; font-size: 18px; }
    .meta { color: #999; font-size: 14px; margin-bottom: 20px; }
    .content { line-height: 1.8; }
    .tags { margin-top: 30px; }
    .tag { background: #f0f0f0; padding: 5px 10px; margin-right: 10px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>${article.title}</h1>
  <p class="subtitle">${article.subtitle}</p>
  <p class="meta">生成时间: ${new Date().toLocaleString()}</p>
  <div class="content">${article.content}</div>
  <div class="tags">
    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
  </div>
</body>
</html>`;

    const htmlPath = `${outputDir}/wine_article_${Date.now()}.html`;
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`HTML版本已保存到: ${htmlPath}`);
  }

  startScheduler() {
    console.log('\n启动定时任务...');
    
    // 每天早上8点执行
    cron.schedule('0 8 * * *', async () => {
      console.log('\n' + '='.repeat(50));
      console.log('定时任务执行');
      console.log('='.repeat(50));
      
      await this.run();
    });

    console.log('定时任务已启动。每天早上8点自动执行采集和发布。');
  }
}

// 主程序入口
async function main() {
  const app = new WineArticleApp();
  
  // 检查是否指定了定时模式
  const args = process.argv.slice(2);
  const isScheduled = args.includes('--schedule') || args.includes('-s');
  
  if (isScheduled) {
    app.startScheduler();
  } else {
    await app.run();
  }
}

// 导出类供其他模块使用
module.exports = {
  WineArticleApp,
  Crawler,
  Aggregator,
  ArticleGenerator,
  WeChatPublisher,
};

// 如果直接运行此文件
if (require.main === module) {
  // 启动健康端点（如果配置了）
  try {
    const healthEndpointEnabled = (process.env.HEALTH_ENDPOINT === 'true') || !!process.env.HEALTH_PORT;
    if (healthEndpointEnabled) {
      const { startHealthServer } = require('./health-endpoint');
      const port = parseInt(process.env.HEALTH_PORT || '3000', 10);
      startHealthServer(port);
    }
  } catch (e) {
    console.error('Failed to start health endpoint:', e);
  }
  
  main().catch(console.error);
}
