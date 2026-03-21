/**
 * 高级写实封面生成器
 * 结合AI生成/矢量元素/照片合成技术
 */
require('dotenv').config();
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class PhotorealisticCoverGenerator {
  constructor() {
    this.width = 900;
    this.height = 383;
  }

  /**
   * 生成写实风格封面
   */
  async generatePhotorealisticCover(options) {
    const {
      title = '葡萄酒文章',
      subtitle = '',
      date = new Date().toISOString().slice(0, 7),
      style = 'vintage', // vintage, classic, modern
      element = 'bottle'
    } = options;

    console.log('🎨 生成写实风格封面...');
    console.log(`   标题: ${title}`);
    console.log(`   风格: ${style}`);
    console.log(`   元素: ${element}`);

    // 1. 创建深度渐变背景（模拟光影效果）
    const background = await this.createPhotorealisticBackground(style);

    // 2. 创建酒瓶/酒杯元素（矢量风格）
    const elementOverlay = await this.createWineElement(element, style);

    // 3. 创建文字层
    const textLayer = await this.createTextLayer(title, subtitle, date, style);

    // 4. 合成所有图层
    const compositeBuffer = await sharp(background)
      .composite([
        { input: elementOverlay, top: 0, left: 0, blend: 'overlay', opacity: 0.8 },
        { input: textLayer, top: 0, left: 0 }
      ])
      .png()
      .toBuffer();

    // 5. 添加最终效果（模糊、光晕）
    const finalBuffer = await this.addFinalEffects(compositeBuffer, style);

    return finalBuffer;
  }

  /**
   * 创建写实背景（多层渐变模拟光影）
   */
  async createPhotorealisticBackground(style) {
    const width = 1024;
    const height = 1024;

    let colors;
    switch (style) {
      case 'vintage':
        colors = {
          base: '#1a0f0a',      // 深褐底
          mid: '#2d1f18',       // 中褐
          highlight: '#4a2f20', // 暖褐
          accent: '#6b3a25'     // 焦糖
        };
        break;
      case 'classic':
        colors = {
          base: '#0f0a1a',      // 深紫底
          mid: '#1a102d',       // 中紫
          highlight: '#2a1840', // 紫罗兰
          accent: '#3d2055'     // 深紫
        };
        break;
      default: // modern
        colors = {
          base: '#0a0a0a',      // 黑底
          mid: '#1a1a1a',       // 深灰
          highlight: '#2a2a2a', // 中灰
          accent: '#3a3a3a'     // 浅灰
        };
    }

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 基础渐变 -->
          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.base}"/>
            <stop offset="50%" style="stop-color:${colors.mid}"/>
            <stop offset="100%" style="stop-color:${colors.base}"/>
          </linearGradient>
          
          <!-- 径向光晕 -->
          <radialGradient id="glowGrad" cx="70%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:${colors.highlight};stop-opacity:0.4"/>
            <stop offset="100%" style="stop-color:${colors.base};stop-opacity:0"/>
          </radialGradient>
          
          <!-- 高光条 -->
          <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0"/>
            <stop offset="50%" style="stop-color:${colors.highlight};stop-opacity:0.2"/>
            <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0"/>
          </linearGradient>
        </defs>
        
        <!-- 基础背景 -->
        <rect width="100%" height="100%" fill="url(#baseGrad)"/>
        
        <!-- 光晕 -->
        <rect width="100%" height="100%" fill="url(#glowGrad)"/>
        
        <!-- 高光条 -->
        <rect x="0" y="400" width="100%" height="20" fill="url(#shineGrad)"/>
        
        <!-- 微纹理 -->
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.03"/>
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  }

  /**
   * 创建酒瓶/酒杯元素
   */
  async createWineElement(element, style) {
    const accentColor = style === 'classic' ? '#8b4a7a' : 
                        style === 'vintage' ? '#7a3a2a' : '#6a6a6a';
    const width = 1024;
    const height = 1024;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.2"/>
        </linearGradient>
      </defs>`;

    if (element === 'bottle') {
      // 酒瓶轮廓
      svg += `
        <g transform="translate(450, 250)">
          <!-- 瓶身 -->
          <path d="M30 100 L30 500 Q30 550 50 550 L90 550 Q110 550 110 500 L110 100 L130 100 L130 80 Q130 60 110 60 L90 60 Q70 60 70 80 L70 100 L110 100" 
                fill="url(#wineGrad)" stroke="${accentColor}" stroke-width="2"/>
          <!-- 瓶颈 -->
          <rect x="85" y="20" width="30" height="80" fill="url(#wineGrad)" stroke="${accentColor}" stroke-width="2"/>
          <!-- 瓶口 -->
          <ellipse cx="100" cy="20" rx="20" ry="8" fill="${accentColor}" opacity="0.7"/>
          <!-- 酒液 -->
          <path d="M35 300 L35 520 Q35 540 50 540 L90 540 Q105 540 105 520 L105 300" 
                fill="#7a3030" opacity="0.8"/>
        </g>`;
    } else if (element === 'wineglass') {
      // 酒杯轮廓
      svg += `
        <g transform="translate(400, 300)">
          <!-- 杯身 -->
          <path d="M100 150 Q80 200 90 280 Q100 350 120 400 Q140 350 150 280 Q160 200 140 150 Z" 
                fill="url(#wineGrad)" stroke="${accentColor}" stroke-width="2"/>
          <!-- 酒液 -->
          <path d="M95 180 Q85 220 92 280 Q100 330 120 360 Q140 330 148 280 Q155 220 145 180 Z" 
                fill="#7a3030" opacity="0.8"/>
          <!-- 杯脚 -->
          <rect x="115" y="400" width="10" height="100" fill="${accentColor}" opacity="0.7"/>
          <!-- 杯座 -->
          <ellipse cx="120" cy="510" rx="40" ry="10" fill="${accentColor}" opacity="0.7"/>
        </g>`;
    }

    svg += `</svg>`;

    return sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  }

  /**
   * 创建文字层
   */
  async createTextLayer(title, subtitle, date, style) {
    const accentColor = style === 'classic' ? '#d4af37' : 
                        style === 'vintage' ? '#c9a66b' : '#ffffff';
    
    const titleSize = 42;
    const subtitleSize = 20;
    
    // 分割标题行
    const titleLines = this.wrapText(title, 25);

    let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.9"/>
          <stop offset="50%" style="stop-color:#fff;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.9"/>
        </linearGradient>
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>
        </filter>
      </defs>
      
      <!-- 底部遮罩 -->
      <rect x="0" y="250" width="${this.width}" height="133" fill="rgba(0,0,0,0.6)"/>`;

    // 标题
    let titleY = 280;
    titleLines.forEach((line, i) => {
      svg += `<text x="30" y="${titleY + i * (titleSize + 10)}" 
                font-family="Microsoft YaHei, PingFang SC, sans-serif" 
                font-size="${titleSize}" 
                font-weight="bold"
                fill="url(#textGrad)"
                filter="url(#textShadow)">${this.escapeXml(line)}</text>`;
    });

    // 副标题
    if (subtitle) {
      svg += `<text x="30" y="${titleY + titleLines.length * (titleSize + 10) + 10}" 
                font-family="Microsoft YaHei, PingFang SC, sans-serif" 
                font-size="${subtitleSize}" 
                fill="rgba(255,255,255,0.8)">${this.escapeXml(subtitle)}</text>`;
    }

    // 日期
    svg += `<text x="${this.width - 30}" y="${this.height - 25}" 
              font-family="Microsoft YaHei, sans-serif" 
              font-size="16" 
              fill="${accentColor}" 
              text-anchor="end" 
              opacity="0.9">${date}</text>`;

    svg += `</svg>`;

    return sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  }

  /**
   * 添加最终效果（模糊、锐化）
   */
  async addFinalEffects(buffer, style) {
    // 根据风格添加不同效果
    const operations = sharp(buffer);

    if (style === 'vintage') {
      return operations
        .modulate({ brightness: 0.95, saturation: 0.8 })
        .png()
        .toBuffer();
    } else if (style === 'classic') {
      return operations
        .modulate({ brightness: 0.9, saturation: 0.9 })
        .png()
        .toBuffer();
    } else {
      return operations
        .modulate({ brightness: 1, saturation: 1 })
        .png()
        .toBuffer();
    }
  }

  wrapText(text, maxChars) {
    if (!text) return [''];
    const lines = [];
    let line = '';
    for (const char of text) {
      if (line.length >= maxChars && char !== ' ') {
        lines.push(line);
        line = char;
      } else {
        line += char;
      }
    }
    if (line) lines.push(line);
    return lines.slice(0, 2);
  }

  escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

// CLI
if (require.main === module) {
  (async () => {
    const generator = new PhotorealisticCoverGenerator();
    
    const testCases = [
      {
        title: '🍷 2026葡萄酒投资分析',
        subtitle: '市场趋势与收藏价值',
        date: '2026-02',
        style: 'vintage',
        element: 'bottle'
      },
      {
        title: '🏆 波尔多2025年份酒评',
        subtitle: '五大酒庄投资价值分析',
        date: '2026-02',
        style: 'classic',
        element: 'wineglass'
      },
      {
        title: '🇨🇳 宁夏产区崛起',
        subtitle: '国货之光，投资新机遇',
        date: '2026-02',
        style: 'modern',
        element: 'bottle'
      }
    ];

    console.log('生成写实风格封面测试...\n');

    for (const [index, testCase] of testCases.entries()) {
      console.log(`[${index + 1}/${testCases.length}] ${testCase.style}风格封面`);
      
      try {
        const startTime = Date.now();
        const buffer = await generator.generatePhotorealisticCover(testCase);
        const endTime = Date.now();

        const outputPath = path.join(__dirname, 'output', `photoreal_${testCase.style}_${index + 1}.png`);
        fs.writeFileSync(outputPath, buffer);

        console.log(`  ✅ 生成成功: ${path.basename(outputPath)}`);
        console.log(`  ⏱️ 耗时: ${endTime - startTime}ms`);
        console.log('');
      } catch (err) {
        console.log(`  ❌ 生成失败: ${err.message}\n`);
      }
    }

    console.log('='.repeat(60));
    console.log('✅ 测试完成！');
    console.log('📁 封面保存在: output/ 目录');
  })();
}

module.exports = PhotorealisticCoverGenerator;
