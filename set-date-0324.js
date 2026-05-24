const fs = require('fs');
const path = require('path');

// 设置日期为3月24日
const dateDisplay = '2026.03.24';
const dateFull = '2026-03-24';

console.log('设置日期为:', dateDisplay);

// 修复 publish-daily-news.js
const newsPath = path.join(__dirname, 'publish-daily-news.js');
let newsContent = fs.readFileSync(newsPath, 'utf-8');
newsContent = newsContent.replace(/📰 2026\.\d+\.\d+ 行业快讯/g, `📰 ${dateDisplay} 行业快讯`);
newsContent = newsContent.replace(/2026-\d+-\d+/g, dateFull);
fs.writeFileSync(newsPath, newsContent);
console.log('✅ publish-daily-news.js');

// 修复 publish-analysis-report.js
const analysisPath = path.join(__dirname, 'publish-analysis-report.js');
let analysisContent = fs.readFileSync(analysisPath, 'utf-8');
analysisContent = analysisContent.replace(/报告日期：\d{4}-\d{2}-\d{2}/g, `报告日期：${dateFull}`);
analysisContent = analysisContent.replace(/\d{4}\.\d{2}\.\d{2} 精品葡萄酒市场分析/g, `${dateDisplay} 精品葡萄酒市场分析`);
analysisContent = analysisContent.replace(/2026年\d+月\d+日/g, '2026年3月24日');
fs.writeFileSync(analysisPath, analysisContent);
console.log('✅ publish-analysis-report.js');

// 修复 publish-buying-guide.js
const buyingPath = path.join(__dirname, 'publish-buying-guide.js');
let buyingContent = fs.readFileSync(buyingPath, 'utf-8');
buyingContent = buyingContent.replace(/\d{4}\.\d{2}\.\d{2} 葡萄酒购买指南/g, `${dateDisplay} 葡萄酒购买指南`);
fs.writeFileSync(buyingPath, buyingContent);
console.log('✅ publish-buying-guide.js');

// 修复 daily-scheduler.js
const schedulerPath = path.join(__dirname, 'daily-scheduler.js');
let schedulerContent = fs.readFileSync(schedulerPath, 'utf-8');
schedulerContent = schedulerContent.replace(/日期: \d{4}-\d{2}-\d{2}/g, `日期: ${dateFull}`);
fs.writeFileSync(schedulerPath, schedulerContent);
console.log('✅ daily-scheduler.js');

console.log('\n✅ 所有脚本已更新为 2026.03.24');
