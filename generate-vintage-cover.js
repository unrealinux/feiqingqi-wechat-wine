/**
 * CLI script to generate vintage-style wine investment cover
 */
require('dotenv').config();
const WineElementCoverGenerator = require('./wine-element-cover');
const fs = require('fs');
const path = require('path');

async function main() {
  const coverGen = new WineElementCoverGenerator({ width: 900, height: 383 });

  const coverBuffer = await coverGen.generate({
    title: '🍷 2026葡萄酒投资分析',
    subtitle: '市场趋势与收藏价值',
    author: '投资顾问',
    date: '2026-02',
    category: '投资',
    element: 'bottle',  // 酒瓶元素适合投资分析
    theme: 'vintage'
  });

  const outputPath = path.join(__dirname, 'output', 'vintage_invest_cover.png');
  fs.writeFileSync(outputPath, coverBuffer);

  console.log('✅ 复古风格封面已生成！');
  console.log('📁 文件:', outputPath);
  console.log('📌 风格: 复古(vintage)');
  console.log('📌 元素: 酒瓶(bottle)');
}

main().catch(console.error);
