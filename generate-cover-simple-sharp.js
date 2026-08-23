/**
 * 使用 Sharp 生成简洁波尔多封面（纯图片生成，无Canvas、无API依赖）
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function generateCover() {
  console.log('🎨 使用 Sharp 生成波尔多封面...');

  const width = 900;
  const height = 383;

  // 创建深色渐变背景
  const gradient = sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 26, g: 35, b: 126 } // #1a237e
    }
  });

  // 创建下半部分更深色渐变，使用composite叠加
  const darkOverlay = sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 24, g: 30, b: 100 } // 更深的底色
    }
  });

  // 生成酒瓶区域（深蓝色椭圆/矩形）
  const bottleLayer = sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 } // 透明底，我们将叠加
    }
  });

  // 使用SVG绘制酒瓶形状
  const bottleSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#1a237e"/>
        <stop offset="100%" style="stop-color:#3949ab"/>
      </linearGradient>
    </defs>
    <!-- 酒瓶主体 -->
    <ellipse cx="350" cy="300" rx="80" ry="150" fill="url(#bottleGrad)" opacity="0.8"/>
    <!-- 瓶肩 -->
    <path d="M270,150 Q350,80 430,150 Q350,120 350,130 Z" fill="#3949ab" opacity="0.8"/>
    <!-- 标签区域 -->
    <rect x="480" y="180" width="140" height="50" rx="3" fill="#ffd700" opacity="0.9"/>
    <rect x="480" y="260" width="140" height="60" rx="3" fill="#1a237e" opacity="0.9"/>
  </svg>`;

  // 生成标签PNG
  const labelPng = await sharp(Buffer.from(bottleSvg), {
    density: 300
  }).png().toBuffer();

  // 输出封面
  const outputPath = path.join(__dirname, 'output', 'bordeaux_cover_final.png');
  
  await sharp(labelPng)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .composite([{
      input: await gradient.toBuffer(),
      blend: 'over'
    }])
    .png({ quality: 90 })
    .toFile(outputPath);

  console.log('✅ 封面生成成功！');
  console.log('📁 保存路径:', outputPath);
  
  // 返回封面Buffer用于后续发布
  return fs.readFileSync(outputPath);
}

generateCover().catch(err => {
  console.error('❌ 生成失败:', err.message);
});