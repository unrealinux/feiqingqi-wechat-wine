/**
 * 每日自动发布脚本
 * 每天定时生成3篇文章并发布到微信草稿箱
 * 
 * 使用方法:
 * 1. 手动运行: node daily-scheduler.js
 * 2. 定时任务: 使用 cron 或 node-cron 设置每天运行
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const axios = require('axios');
axios.defaults.proxy = false;

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 配置
const CONFIG = {
  // 每日生成的文章类型
  articles: [
    {
      name: '投资分析',
      script: 'publish-analysis-report.js',
      description: 'Liv-ex指数、名庄价格、拍卖市场',
    },
    {
      name: '购买推荐',
      script: 'publish-buying-guide.js',
      description: '高性价比酒款、场景推荐、趋势品种',
    },
    {
      name: '行业快讯',
      script: 'publish-daily-news.js',
      description: '最新动态、价格异动、企业事件',
    },
  ],
  // 输出目录
  outputDir: path.join(__dirname, 'output'),
  // 日志文件
  logFile: path.join(__dirname, 'logs', 'daily-publish.log'),
};

/**
 * 运行单个发布脚本
 */
function runPublishScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 运行脚本: ${scriptName}`);
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const child = spawn('node', [scriptName], {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        HTTP_PROXY: '',
        HTTPS_PROXY: '',
        http_proxy: '',
        https_proxy: '',
      },
    });
    
    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      if (code === 0) {
        console.log(`\n✅ ${scriptName} 完成 (${duration}ms)`);
        resolve({ success: true, script: scriptName, duration });
      } else {
        console.error(`\n❌ ${scriptName} 失败 (code: ${code})`);
        resolve({ success: false, script: scriptName, code, duration });
      }
    });
    
    child.on('error', (err) => {
      console.error(`\n❌ ${scriptName} 错误:`, err.message);
      reject(err);
    });
  });
}

/**
 * 记录日志
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // 确保日志目录存在
  const logDir = path.dirname(CONFIG.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(CONFIG.logFile, logMessage);
  console.log(message);
}

/**
 * 主流程
 */
async function main() {
  const startTime = Date.now();
  const date = new Date().toISOString().slice(0, 10);
  
  console.log('='.repeat(60));
  console.log(`🍷 每日自动发布系统`);
  console.log(`📅 日期: ${date}`);
  console.log(`📝 计划发布: ${CONFIG.articles.length} 篇文章`);
  console.log('='.repeat(60));
  
  log(`开始每日发布任务 - ${date}`);
  
  const results = [];
  
  // 依次执行每篇文章的发布
  for (const article of CONFIG.articles) {
    console.log(`\n📌 准备发布: ${article.name} (${article.description})`);
    
    try {
      const result = await runPublishScript(article.script);
      results.push({
        ...article,
        ...result,
      });
      
      // 等待一段时间再执行下一个，避免频率限制
      if (CONFIG.articles.indexOf(article) < CONFIG.articles.length - 1) {
        console.log('\n⏳ 等待10秒后执行下一篇...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (err) {
      results.push({
        ...article,
        success: false,
        error: err.message,
      });
    }
  }
  
  // 生成报告
  const totalTime = Date.now() - startTime;
  const successCount = results.filter(r => r.success).length;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 发布报告');
  console.log('='.repeat(60));
  console.log(`日期: ${date}`);
  console.log(`总计: ${results.length} 篇`);
  console.log(`成功: ${successCount} 篇`);
  console.log(`失败: ${results.length - successCount} 篇`);
  console.log(`总耗时: ${(totalTime / 1000).toFixed(1)}s`);
  console.log('');
  
  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    const duration = r.duration ? `(${(r.duration / 1000).toFixed(1)}s)` : '';
    console.log(`${i + 1}. ${status} ${r.name} ${duration}`);
  });
  
  // 保存报告
  const report = {
    date,
    timestamp: new Date().toISOString(),
    totalTime,
    results,
    summary: {
      total: results.length,
      success: successCount,
      failed: results.length - successCount,
    },
  };
  
  const reportPath = path.join(CONFIG.outputDir, `daily_report_${date}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📁 报告已保存: ${reportPath}`);
  
  log(`每日发布任务完成 - 成功: ${successCount}/${results.length}`);
  
  return report;
}

// 如果直接运行
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ 每日发布任务完成');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ 每日发布任务失败:', err);
      process.exit(1);
    });
}

module.exports = { main, runPublishScript, CONFIG };
