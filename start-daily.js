/**
 * 启动每日定时任务
 * 使用 node-cron 每天定时执行发布任务
 */

const cron = require('node-cron');
const { main, CONFIG } = require('./daily-scheduler');

console.log('='.repeat(60));
console.log('🍷 每日自动发布系统 - 定时任务');
console.log('='.repeat(60));
console.log('');

// 定时任务配置
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *'; // 默认每天早上9点

console.log(`📅 定时任务已启动`);
console.log(`⏰ 执行时间: ${CRON_SCHEDULE}`);
console.log(`📝 发布文章: ${CONFIG.articles.length} 篇`);
console.log('');

CONFIG.articles.forEach((article, i) => {
  console.log(`   ${i + 1}. ${article.name} - ${article.description}`);
});

console.log('');
console.log('等待执行...（按 Ctrl+C 停止）');
console.log('');

// 启动定时任务
cron.schedule(CRON_SCHEDULE, async () => {
  console.log('');
  console.log('='.repeat(60));
  console.log(`⏰ 定时任务触发 - ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  
  try {
    await main();
    console.log('\n✅ 定时任务执行完成');
  } catch (err) {
    console.error('\n❌ 定时任务执行失败:', err.message);
  }
});

// 保持进程运行
process.on('SIGINT', () => {
  console.log('\n\n👋 定时任务已停止');
  process.exit(0);
});
