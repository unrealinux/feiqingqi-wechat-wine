/**
 * 使用 Sharp 生成本地优化波尔多写实封面（兼容Windows/Linux/Mac）
 * 纯图片处理，无需Canvas、无需外部API
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  chinese: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

async function generateLocalCover() {
  console.log('🎨 使用 Sharp 生成写实波尔多封面...');

  const width = 900;
  const height = 383;

  // 1. 生成深色渐变背景
  const baseColor1 = '#1a237e';  // 深蓝
  const baseColor2 = '#283593';  // 中蓝
  const baseColor3 = '#3949ab';  // 浅蓝

  // 创建渐变用的像素数据
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // 简单的渐变：从上到下由深变浅
      const ratio = y / (height - 1);
      const r = Math.round(parseInt(baseColor1.slice(1,3),16) * (1-ratio*0.3) + parseInt(baseColor3.slice(1,3),16) * ratio*0.5);
      const g = Math.round(parseInt(baseColor1.slice(3,5),16) * (1-ratio*0.3) + parseInt(baseColor3.slice(3,5),16) * ratio*0.5);
      const b = Math.round(parseInt(baseColor1.slice(5,7),16) * (1-ratio*0.3) + parseInt(baseColor3.slice(5,7),16) * ratio*0.5);
      pixels[idx] = r;
      pixels[idx+1] = g;
      pixels[idx+2] = b;
      pixels[idx+3] = 255;
    }
  }

  let image = sharp(pixels, { 
    raw: { 
      width: width, 
      height: height, 
      channels: 4 
    } 
  });

  // 2. 绘制酒瓶剪影（三角形渐变）
  // 创建一个临时的黑色PNG作为剪影图层
  const bottleLayer = sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  // 生成深色酒瓶区域（简化版：用渐变色块模拟）
  const bottleData = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // 酒瓶形状：底部宽、顶部窄的三角形
      if (x >= width * 0.35 && x <= width * 0.45 && y >= 80 && y <= height - 20) {
        const alpha = Math.min(150, 255 - Math.abs(x - width*0.4)*2);
        bottleData[idx] = 5;
        bottleData[idx+1] = 5;
        bottleData[idx+2] = 10;
        bottleData[idx+3] = alpha;
      } else {
        bottleData[idx] = 0;
        bottleData[idx+1] = 0;
        bottleData[idx+2] = 0;
        bottleData[idx+3] = 0;
      }
    }
  }
  const bottleImg = sharp(bottleData, { raw: { width, height, channels: 4 } });

  // 3. 生成标签区域
  const labelData = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // 标签：金色矩形区域
      if (x >= width * 0.55 && x <= width * 0.67 && y >= 150 && y <= 230) {
        labelData[idx] = 212;
        labelData[idx+1] = 175; // 金色
        labelData[idx+2] = 55;
        labelData[idx+3] = 200;
      } else {
        labelData[idx] = 0;
        labelData[idx+1] = 0;
        labelData[idx+2] = 0;
        labelData[idx+3] = 0;
      }
    }
  }
  const labelImg = sharp(labelData, { raw: { width, height, channels: 4 } });

  // 4. 底部信息条
  const bottomBarData = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // 深色底部条
      if (y >= height - 60) {
        bottomBarData[idx] = 10;
        bottomBarData[idx+1] = 10;
        bottomBarData[idx+2] = 20;
        bottomBarData[idx+3] = 230;
      } else {
        bottomBarData[idx] = 0;
        bottomBarData[idx+1] = 0;
        bottomBarData[idx+2] = 0;
        bottomBarData[idx+3] = 0;
      }
    }
  }
  const bottomImg = sharp(bottomBarData, { raw: { width, height, channels: 4 } });

  // 5. 合成并输出
  try {
    const result = await image
      .composite([
        { input: await bottleImg.toBuffer(), top: 0, left: 0 },
        { input: await labelImg.toBuffer(), top: 0, left: 0 },
        { input: await bottomImg.toBuffer(), top: 0, left: 0 }
      ])
      .png({ quality: 90 })
      .toBuffer();

    const outputPath = path.join(__dirname, 'output', 'bordeaux_cover_sharp.png');
    fs.writeFileSync(outputPath, result);

    console.log('✅ 封面生成成功！');
    console.log('📁 保存路径:', outputPath);
    console.log('📌 文件大小:', Math.round(result.length/1024), 'KB');

  } catch (err) {
    console.error('❌ 生成失败:', err.message);
  }
}

generateLocalCover();