/**
 * 生成本地优化波尔多写实封面（无需外部API）
 * 使用纯 Canvas API 生成高质量封面
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createCanvas } = require('canvas');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  chinese: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

async function generateLocalCover() {
  console.log('🎨 使用本地 Canvas 生成写实波尔多封面...');

  const width = 900;
  const height = 383;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a237e');
  gradient.addColorStop(0.5, '#283593');
  gradient.addColorStop(1, '#3949ab');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. 模拟葡萄园层次
  ctx.fillStyle = 'rgba(40, 80, 40, 0.6)';
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * width;
    const y = 150 + Math.random() * 180;
    const w = 100 + Math.random() * 200;
    const h = 20 + Math.random() * 30;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. 酒瓶剪影
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(width * 0.35, 80);
  ctx.lineTo(width * 0.38, 280);
  ctx.lineTo(width * 0.42, 280);
  ctx.lineTo(width * 0.45, 80);
  ctx.closePath();
  ctx.fill();

  // 4. 玻璃反光效果
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.moveTo(width * 0.35, 100);
  ctx.lineTo(width * 0.385, 100);
  ctx.lineTo(width * 0.43, 250);
  ctx.lineTo(width * 0.415, 250);
  ctx.closePath();
  ctx.fill();

  // 5. 标签区域
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(width * 0.55, 160, 120, 40);
  ctx.fillStyle = '#1a237e';
  ctx.font = 'bold 20px Microsoft YaHei';
  ctx.fillText('波尔多', width * 0.57, 190);

  // 6. 底部信息条
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, height - 60, width, 60);

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 34px Microsoft YaHei';
  ctx.fillText('🍷 波尔多产区巡礼', 30, height - 20);

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '16px Microsoft YaHei';
  ctx.fillText('左岸vs右岸 · 五大名庄 · 1855分级', 30, height - 40);

  ctx.fillStyle = '#D4AF37';
  ctx.font = '12px Microsoft YaHei';
  ctx.textAlign = 'right';
  ctx.fillText(date.display, width - 30, height - 25);

  ctx.textAlign = 'left';

  // 7. 添加质感纹理
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);

  // 8. 导出并优化
  const pngBuffer = canvas.toBuffer('image/png');
  
  const outputPath = path.join(__dirname, 'output', 'bordeaux_cover_local.png');
  await sharp(pngBuffer)
    .png({ quality: 90 })
    .toFile(outputPath);

  console.log('✅ 本地封面生成成功！');
  console.log('📁 保存路径:', outputPath);
  
  return outputPath;
}

generateLocalCover().catch(err => {
  console.error('❌ 生成失败:', err.message);
});