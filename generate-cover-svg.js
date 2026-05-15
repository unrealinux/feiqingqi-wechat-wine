/**
 * 使用纯 JS 生成 SVG 波尔多封面（无外部依赖）
 * SVG 可直接被微信使用，或转换为 PNG
 */

const fs = require('fs');
const path = require('path');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

function generateSVG() {
  console.log('🎨 生成 SVG 波尔多封面...');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a237e"/>
      <stop offset="100%" style="stop-color:#283593"/>
    </linearGradient>
    <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1a237e"/>
      <stop offset="100%" style="stop-color:#3949ab"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="900" height="383" fill="url(#bgGrad)"/>

  <!-- 酒瓶主体（左侧） -->
  <g transform="translate(220, 40)">
    <ellipse cx="80" cy="200" rx="60" ry="140" fill="url(#bottleGrad)" filter="url(#shadow)"/>
    <!-- 瓶肩 -->
    <path d="M20,50 Q80,-10 140,50 Q80,10 20,50" fill="#3949ab" opacity="0.9"/>
    <!-- 瓶口 -->
    <rect x="70" y="0" width="20" height="25" fill="#3949ab" opacity="0.9"/>
  </g>

  <!-- 标签区域（右侧） -->
  <g transform="translate(520, 150)">
    <!-- 金色标签 -->
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">波尔多</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">产区巡礼</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>

  <!-- 左侧深蓝竖条 -->
  <rect x="498" y="150" width="20" height="100" fill="#1a237e" opacity="0.9"/>

  <!-- 底部深色条 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0e2a" opacity="0.95"/>

  <!-- 底部文字 -->
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 波尔多产区巡礼</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">左岸vs右岸 · 五大名庄 · 1855分级</text>
  </g>

  <!-- 右上角日期 -->
  <g transform="translate(800, 30)">
    <text text-anchor="end" font-family="Microsoft YaHei, sans-serif" font-size="12" fill="#D4AF37">${date.display}</text>
  </g>

  <!-- 装饰圆点 -->
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
    <circle cx="750" cy="50" r="25"/>
  </g>
</svg>`;

  const outPath = path.join(__dirname, 'output', 'bordeaux_cover.svg');
  fs.writeFileSync(outPath, svg);

  console.log('✅ SVG 封面生成成功！');
  console.log('📁 保存路径:', outPath);
  console.log('📌 说明: SVG 可直接作为封面，或通过在线工具转为 PNG');

  // 同时生成一个 PNG 占位图（纯色+文字的 PNG 用文本方式生成较复杂，这里只提供 SVG）
  // 用户如果需要 PNG，可使用微信编辑器打开 SVG 导出，或使用在线 SVG→PNG 转换
  
  return svg;
}

// 生成并输出 SVG 字符串以便调试
const svgContent = generateSVG();
console.log('\n--- SVG 内容预览（前500字符）---');
console.log(svgContent.substring(0, 500));
console.log('...');