const fs = require('fs');
const path = require('path');

// 获取今日日期
const today = new Date();
const dateDisplay = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
const dateFull = today.toISOString().slice(0, 10);

console.log('修复日期为:', dateDisplay);

// 读取 publish-daily-news.js
const filePath = path.join(__dirname, 'publish-daily-news.js');
let content = fs.readFileSync(filePath, 'utf-8');

// 替换硬编码的日期
content = content.replace(/📰 2026\.3\.21 行业快讯/g, `📰 ${dateDisplay} 行业快讯`);
content = content.replace(/2026-03-21/g, dateFull);

fs.writeFileSync(filePath, content);
console.log('✅ 已修复 publish-daily-news.js');

// 读取 publish-analysis-report.js
const analysisPath = path.join(__dirname, 'publish-analysis-report.js');
let analysisContent = fs.readFileSync(analysisPath, 'utf-8');

// 替换日期
analysisContent = analysisContent.replace(/报告日期：2026-03-21/g, `报告日期：${dateFull}`);
analysisContent = analysisContent.replace(/2026年精品葡萄酒市场分析/g, `${dateDisplay} 精品葡萄酒市场分析`);

fs.writeFileSync(analysisPath, analysisContent);
console.log('✅ 已修复 publish-analysis-report.js');

// 读取 publish-buying-guide.js
const buyingPath = path.join(__dirname, 'publish-buying-guide.js');
let buyingContent = fs.readFileSync(buyingPath, 'utf-8');

// 替换日期
buyingContent = buyingContent.replace(/2026年葡萄酒购买指南/g, `${dateDisplay} 葡萄酒购买指南`);

fs.writeFileSync(buyingPath, buyingContent);
console.log('✅ 已修复 publish-buying-guide.js');

console.log('\n所有脚本已更新为今日日期:', dateDisplay);
