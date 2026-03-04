/**
 * 红酒元素封面图生成器
 * 支持酒杯、葡萄、酒瓶、酒庄风景等红酒元素
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class WineElementCoverGenerator {
  constructor(options = {}) {
    this.width = options.width || 900;
    this.height = options.height || 383;
  }

  /**
   * 生成带红酒元素的封面
   */
  async generate(options = {}) {
    const {
      title = '',
      subtitle = '',
      author = '',
      date = '',
      category = '红酒',
      element = 'wineglass',  // wineglass, grapes, bottle, vineyard, wine
      theme = 'elegant'  // elegant, modern, luxury, vintage
    } = options;

    // 创建背景
    const background = await this.createBackground(theme);

    // 创建红酒元素
    const wineElement = await this.createWineElement(element, theme);

    // 创建文字层
    const textLayer = await this.createTextLayer(theme, {
      title, subtitle, author, date, category
    });

    // 合成
    const result = await sharp(background)
      .composite([
        { input: wineElement, top: 0, left: 0 },
        { input: textLayer, top: 0, left: 0 }
      ])
      .png()
      .toBuffer();

    return result;
  }

  /**
   * 创建背景
   */
  async createBackground(theme) {
    const backgrounds = {
      elegant: () => this.createGradientBg(['#1a0a10', '#2d1424', '#4a1a2e'], '70%', '30%'),
      modern: () => this.createGradientBg(['#1a1a2e', '#16213e', '#0f3460'], '50%', '50%'),
      luxury: () => this.createLuxuryBg(),
      vintage: () => this.createVintageBg(),
    };
    return (backgrounds[theme] || backgrounds.elegant)();
  }

  /**
   * 创建渐变背景
   */
  async createGradientBg(colors, cx = '50%', cy = '50%') {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            ${colors.map((c, i) => `<stop offset="${(i/(colors.length-1))*100}%" style="stop-color:${c};stop-opacity:1" />`).join('')}
          </linearGradient>
          <radialGradient id="glow" cx="${cx}" cy="${cy}" r="60%">
            <stop offset="0%" style="stop-color:#8b2252;stop-opacity:0.4"/>
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#glow)"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建奢华背景
   */
  async createLuxuryBg() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0508"/>
            <stop offset="50%" style="stop-color:#1a0d15"/>
            <stop offset="100%" style="stop-color:#0a0508"/>
          </linearGradient>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill="#d4af37" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建复古背景
   */
  async createVintageBg() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2d1f1a"/>
            <stop offset="50%" style="stop-color:#3d2a20"/>
            <stop offset="100%" style="stop-color:#1a1008"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="#000" opacity="0.2"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建红酒元素
   */
  async createWineElement(element, theme) {
    const elements = {
      wineglass: () => this.createWineGlass(theme),
      grapes: () => this.createGrapes(theme),
      bottle: () => this.createWineBottle(theme),
      vineyard: () => this.createVineyard(theme),
      wine: () => this.createWinePour(theme),
    };
    return (elements[element] || elements.wineglass)();
  }

  /**
   * 创建酒杯
   */
  async createWineGlass(theme) {
    const color = theme === 'vintage' ? '#c9a86c' : '#d4af37';
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.2"/>
          </linearGradient>
          <linearGradient id="wine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#9b1b30;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#5c0f1a;stop-opacity:0.95"/>
          </linearGradient>
        </defs>
        
        <!-- 酒杯杯身 -->
        <path d="M${this.width-180},${this.height-280} Q${this.width-120},${this.height-150} ${this.width-150},${this.height-50} L${this.width-210},${this.height-50} Q${this.width-240},${this.height-150} ${this.width-180},${this.height-280}Z" 
              fill="url(#glass)" stroke="${color}" stroke-width="1" opacity="0.8"/>
        
        <!-- 杯中红酒 -->
        <path d="M${this.width-175},${this.height-270} Q${this.width-130},${this.height-160} ${this.width-155},${this.height-60} L${this.width-205},${this.height-60} Q${this.width-230},${this.height-160} ${this.width-175},${this.height-270}Z" 
              fill="url(#wine)" opacity="0.9"/>
        
        <!-- 高光 -->
        <path d="M${this.width-165},${this.height-250} Q${this.width-145},${this.height-180} ${this.width-155},${this.height-100}" 
              fill="none" stroke="#fff" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
        
        <!-- 酒杯杯柄 -->
        <rect x="${this.width-155}" y="${this.height-60}" width="4" height="50" rx="2" fill="${color}" opacity="0.7"/>
        <rect x="${this.width-165}" y="${this.height-15}" width="24" height="4" rx="2" fill="${color}" opacity="0.7"/>
        
        <!-- 装饰圆点 -->
        <circle cx="${this.width-100}" cy="80" r="3" fill="${color}" opacity="0.2"/>
        <circle cx="${this.width-80}" cy="60" r="2" fill="${color}" opacity="0.15"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建葡萄
   */
  async createGrapes(theme) {
    const color = theme === 'vintage' ? '#6b4423' : '#8b4513';
    const grapeColor = theme === 'vintage' ? '#722f37' : '#8b2252';
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 葡萄串 -->
        <ellipse cx="${this.width-150}" cy="${this.height-180}" rx="35" ry="50" fill="${grapeColor}" opacity="0.85"/>
        <ellipse cx="${this.width-120}" cy="${this.height-170}" rx="35" ry="50" fill="${grapeColor}" opacity="0.85"/>
        <ellipse cx="${this.width-135}" cy="${this.height-210}" rx="35" ry="50" fill="${grapeColor}" opacity="0.9"/>
        <ellipse cx="${this.width-165}" cy="${this.height-200}" rx="30" ry="45" fill="${grapeColor}" opacity="0.8"/>
        <ellipse cx="${this.width-105}" cy="${this.height-190}" rx="30" ry="45" fill="${grapeColor}" opacity="0.85"/>
        <ellipse cx="${this.width-150}" cy="${this.height-140}" rx="30" ry="40" fill="${grapeColor}" opacity="0.8"/>
        
        <!-- 葡萄叶子 -->
        <path d="M${this.width-135},${this.height-260} Q${this.width-100},${this.height-280} ${this.width-80},${this.height-250} Q${this.width-90},${this.height-230} ${this.width-130},${this.height-240}Z" 
              fill="${color}" opacity="0.8"/>
        <path d="M${this.width-180},${this.height-230} Q${this.width-200},${this.height-250} ${this.width-210},${this.height-220} Q${this.width-200},${this.height-200} ${this.width-180},${this.height-210}Z" 
              fill="${color}" opacity="0.7"/>
        
        <!-- 葡萄藤 -->
        <path d="M${this.width-135},${this.height-260} Q${this.width-140},${this.height-290} ${this.width-130},${this.height-310}" 
              fill="none" stroke="${color}" stroke-width="2" opacity="0.6"/>
        
        <!-- 装饰 -->
        <circle cx="${this.width-80}" cy="70" r="2" fill="#d4af37" opacity="0.2"/>
        <circle cx="${this.width-60}" cy="90" r="3" fill="#d4af37" opacity="0.15"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建酒瓶
   */
  async createWineBottle(theme) {
    const color = theme === 'vintage' ? '#c9a86c' : '#d4af37';
    const bottleColor = theme === 'vintage' ? '#2d1f1a' : '#1a3a2a';
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bottle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0a0a0a"/>
            <stop offset="30%" style="stop-color:${bottleColor}"/>
            <stop offset="70%" style="stop-color:${bottleColor}"/>
            <stop offset="100%" style="stop-color:#0a0a0a"/>
          </linearGradient>
          <linearGradient id="label" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f5f5dc"/>
            <stop offset="100%" style="stop-color:#e8e4d0"/>
          </linearGradient>
        </defs>
        
        <!-- 瓶身 -->
        <rect x="${this.width-200}" y="${this.height-280}" width="50" height="230" rx="5" fill="url(#bottle)"/>
        
        <!-- 瓶瓶颈 -->
        <rect x="${this.width-192}" y="${this.height-310}" width="34" height="35" fill="url(#bottle)"/>
        
        <!-- 瓶塞 -->
        <rect x="${this.width-190}" y="${this.height-325}" width="30" height="18" rx="2" fill="${color}" opacity="0.8"/>
        
        <!-- 酒标 -->
        <rect x="${this.width-195}" y="${this.height-220}" width="40" height="80" fill="url(#label)"/>
        <line x1="${this.width-193}" y1="${this.height-210}" x2="${this.width-157}" y2="${this.height-210}" stroke="${color}" stroke-width="0.5"/>
        <line x1="${this.width-193}" y1="${this.height-150}" x2="${this.width-157}" y2="${this.height-150}" stroke="${color}" stroke-width="0.5"/>
        
        <!-- 瓶身反光 -->
        <rect x="${this.width-190}" y="${this.height-270}" width="3" height="200" fill="#fff" opacity="0.1"/>
        
        <!-- 装饰 -->
        <circle cx="${this.width-100}" cy="80" r="3" fill="${color}" opacity="0.2"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建酒庄风景
   */
  async createVineyard(theme) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87ceeb"/>
            <stop offset="50%" style="stop-color:#b0c4de"/>
            <stop offset="100%" style="stop-color:#d2b48c"/>
          </linearGradient>
          <linearGradient id="hills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#228b22"/>
            <stop offset="100%" style="stop-color:#006400"/>
          </linearGradient>
        </defs>
        
        <!-- 天空 -->
        <rect width="100%" height="100%" fill="url(#sky)"/>
        
        <!-- 太阳 -->
        <circle cx="750" cy="80" r="40" fill="#ffd700" opacity="0.8"/>
        
        <!-- 山丘 -->
        <ellipse cx="300" cy="${this.height-50}" rx="350" ry="120" fill="url(#hills)"/>
        <ellipse cx="700" cy="${this.height-30}" rx="280" ry="100" fill="url(#hills)" opacity="0.9"/>
        
        <!-- 葡萄藤架 (简化) -->
        ${this.createVineyardRows()}
        
        <!-- 远处树木 -->
        <rect x="100" y="${this.height-120}" width="8" height="60" fill="#1a472a"/>
        <rect x="150" y="${this.height-140}" width="10" height="80" fill="#1a472a"/>
        
        <!-- 装饰 -->
        <circle cx="${this.width-50}" cy="60" r="2" fill="#d4af37" opacity="0.3"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建葡萄藤行
   */
  createVineyardRows() {
    let rows = '';
    for (let i = 0; i < 5; i++) {
      const y = this.height - 80 - i * 25;
      rows += `<line x1="0" y1="${y}" x2="${this.width}" y2="${y}" stroke="#1a5c1a" stroke-width="1"/>`;
      for (let j = 0; j < 20; j++) {
        const x = j * 50 + 20;
        rows += `<rect x="${x}" y="${y-15}" width="3" height="20" fill="#3d2817"/>`;
      }
    }
    return rows;
  }

  /**
   * 创建倒酒
   */
  async createWinePour(theme) {
    const color = theme === 'vintage' ? '#722f37' : '#8b2252';
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stream" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.7"/>
          </linearGradient>
        </defs>
        
        <!-- 酒瓶(倾斜) -->
        <ellipse cx="${this.width-150}" cy="80" rx="25" ry="80" fill="#1a3a2a" transform="rotate(-30 ${this.width-150} 80)"/>
        
        <!-- 酒液流出 -->
        <path d="M${this.width-135},${this.height-150} Q${this.width-130},${this.height-100} ${this.width-140},${this.height-50}" 
              fill="none" stroke="url(#stream)" stroke-width="8" stroke-linecap="round"/>
        
        <!-- 酒杯 -->
        <path d="M${this.width-200},${this.height-100} Q${this.width-160},${this.height-30} ${this.width-190},${this.height-20} L${this.width-230},${this.height-20} Q${this.width-260},${this.height-30} ${this.width-200},${this.height-100}Z" 
              fill="${color}" opacity="0.7"/>
        
        <!-- 气泡 -->
        <circle cx="${this.width-180}" cy="${this.height-60}" r="3" fill="#fff" opacity="0.4"/>
        <circle cx="${this.width-200}" cy="${this.height-50}" r="2" fill="#fff" opacity="0.3"/>
        <circle cx="${this.width-210}" cy="${this.height-70}" r="2" fill="#fff" opacity="0.3"/>
        
        <!-- 装饰 -->
        <circle cx="${this.width-80}" cy="70" r="3" fill="#d4af37" opacity="0.2"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建文字层
   */
  async createTextLayer(theme, options) {
    const { title, subtitle, author, date, category } = options;
    const titleColor = theme === 'minimal' || theme === 'vintage' ? '#1a1a1a' : '#ffffff';
    const accentColor = theme === 'vintage' ? '#c9a86c' : '#d4af37';

    const titleLines = this.wrapText(title, 12);
    const subtitleLine = subtitle ? subtitle.substring(0, 18) : '';

    let svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
          </filter>
          <linearGradient id="titleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${titleColor}"/>
            <stop offset="100%" style="stop-color:${titleColor};stop-opacity:0.8"/>
          </linearGradient>
        </defs>
        
        <!-- 类别标签 -->
        <text x="50" y="40" font-family="Georgia,serif" font-size="12" fill="${accentColor}" letter-spacing="2" opacity="0.8">${category.toUpperCase()}</text>
        <line x1="50" y1="50" x2="150" y2="50" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>
    `;

    // 标题
    const startY = 110;
    titleLines.forEach((line, i) => {
      svg += `<text x="50" y="${startY + i * 45}" font-family="Microsoft YaHei,PingFang SC" font-size="40" font-weight="bold" fill="url(#titleGrad)" filter="url(#shadow)">${this.escape(line)}</text>`;
    });

    // 分隔线
    svg += `<line x1="50" y1="${startY + titleLines.length * 45 + 10}" x2="160" y2="${startY + titleLines.length * 45 + 10}" stroke="${accentColor}" stroke-width="2"/>`;

    // 副标题
    if (subtitleLine) {
      svg += `<text x="50" y="${startY + titleLines.length * 45 + 40}" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="rgba(255,255,255,0.7)">${this.escape(subtitleLine)}</text>`;
    }

    // 作者和日期
    if (author) {
      svg += `<text x="50" y="${this.height - 30}" font-family="Microsoft YaHei" font-size="14" fill="${accentColor}">${this.escape(author)}</text>`;
    }
    if (date) {
      svg += `<text x="${this.width - 50}" y="${this.height - 30}" font-family="Microsoft YaHei" font-size="14" fill="${accentColor}" text-anchor="end" opacity="0.8">${date}</text>`;
    }

    svg += `</svg>`;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 文字换行
   */
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

  /**
   * XML转义
   */
  escape(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

module.exports = WineElementCoverGenerator;
