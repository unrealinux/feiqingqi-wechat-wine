/**
 * 使用 pngjs 生成本地优化波尔多封面（纯图片生成，无Canvas、无API依赖）
 */

const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function generateCover() {
  console.log('🎨 使用 pngjs 生成波尔多封面...');

  const width = 900;
  const height = 383;

  const png = new PNG({ width, height });

  // 填充背景渐变
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      // 深蓝到浅蓝渐变
      const ratio = y / height;
      png.data[idx] = Math.round(26 + (57 * (1 - ratio)));     // R: 26→83
      png.data[idx + 1] = Math.round(35 + (81 * (1 - ratio))); // G: 35→116
      png.data[idx + 2] = Math.round(126 + (39 * (1 - ratio))); // B: 126→165
      png.data[idx + 3] = 255; // Alpha
    }
  }

  // 绘制酒瓶（深色椭圆）
  const bottleCx = 350;
  const bottleCy = 300;
  const bottleRx = 80;
  const bottleRy = 150;
  for (let y = Math.max(0, bottleCy - bottleRy); y < Math.min(height, bottleCy + bottleRy); y++) {
    for (let x = Math.max(0, bottleCx - bottleRx); x < Math.min(width, bottleCx + bottleRx); x++) {
      const dx = (x - bottleCx) / bottleRx;
      const dy = (y - bottleCy) / bottleRy;
      if (dx * dx + dy * dy <= 1.1) { // 略放大确保覆盖
        const idx = (width * y + x) << 2;
        png.data[idx] = Math.max(0, png.data[idx] - 30);
        png.data[idx + 1] = Math.max(0, png.data[idx + 1] - 30);
        png.data[idx + 2] = Math.max(0, png.data[idx + 2] - 50);
      }
    }
  }

  // 绘制标签（金色矩形）
  const labelX = 480, labelY = 180, labelW = 140, labelH = 50;
  for (let y = labelY; y < labelY + labelH && y < height; y++) {
    for (let x = labelX; x < labelX + labelW && x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = 255;
      png.data[idx + 1] = 215; // 金色
      png.data[idx + 2] = 0;
    }
  }
  // 标签左侧深蓝条
  const sideBarX = 468, sideBarW = 12;
  for (let y = labelY; y < labelY + labelH + 60 && y < height; y++) {
    for (let x = sideBarX; x < sideBarX + sideBarW && x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = 26;
      png.data[idx + 1] = 35;
      png.data[idx + 2] = 126;
    }
  }

  // 日期文字（简化：绘制几个方块模拟）
  const dateX = width - 40, dateY = height - 30;
  for (let dy = 0; dy < 10; dy++) {
    for (let dx = 0; dx < 30; dx++) {
      const x = dateX + dx;
      const y = dateY + dy;
      if (x < width && y < height) {
        const idx = (width * y + x) << 2;
        png.data[idx] = 212;
        png.data[idx + 1] = 175;
        png.data[idx + 2] = 55;
      }
    }
  }

  // 保存
  const outPath = path.join(__dirname, 'output', 'bordeaux_cover_pngjs.png');
  await png.pack().pipe(fs.createWriteStream(outPath));

  console.log('✅ 封面生成成功！');
  console.log('📁 保存路径:', outPath);
  console.log('📌 文件大小:', Math.round(fs.statSync(outPath).size/1024), 'KB');
  return outPath;
}

generateCover().catch(err => {
  console.error('❌ 生成失败:', err);
});