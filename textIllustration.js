/**
 * 文本配图生成器
 * 为微信公众号文章生成高质量配图
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class TextIllustrationGenerator {
  constructor(options = {}) {
    this.width = options.width || 900;
    this.height = options.height || 383;
    this.assetsDir = options.assetsDir || path.join(__dirname, 'assets');
  }

  /**
   * 生成文章封面配图
   */
  async generateCover(options = {}) {
    const {
      title = '',
      subtitle = '',
      author = '',
      date = '',
      category = '',
      backgroundPath = null,
      style = 'elegant',
      template = 'default'
    } = options;

    // 选择模板
    switch (template) {
      case 'wine':
        return this._generateWineStyle(title, subtitle, author, date, category, backgroundPath);
      case 'modern':
        return this._generateModernStyle(title, subtitle, author, date, category, backgroundPath);
      case 'minimalist':
        return this._generateMinimalistStyle(title, subtitle, author, date, category, backgroundPath);
      case 'bold':
        return this._generateBoldStyle(title, subtitle, author, date, category, backgroundPath);
      default:
        return this._generateDefaultStyle(title, subtitle, author, date, category, backgroundPath);
    }
  }

  /**
   * 生成文章内文配图（16:9）
   */
  async generateInlineImage(options = {}) {
    const {
      text = '',
      width = 600,
      height = 338,
      style = 'quote'
    } = options;

    this.width = width;
    this.height = height;

    switch (style) {
      case 'quote':
        return this._generateQuoteCard(text);
      case 'stat':
        return this._generateStatCard(text);
      case 'tip':
        return this._generateTipCard(text);
      default:
        return this._generateQuoteCard(text);
    }
  }

  /**
   * 生成摘要卡片
   */
  async generateSummaryCard(options = {}) {
    const {
      points = [],
      title = '核心要点'
    } = options;

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#eeeeee;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)" rx="8"/>
        <rect x="0" y="0" width="6" height="100%" fill="#801E32"/>
        <text x="20" y="35" font-family="Microsoft YaHei, sans-serif" font-size="18" font-weight="bold" fill="#801E32">${title}</text>
        ${points.map((p, i) => `
          <text x="20" y="${65 + i * 28}" font-family="Microsoft YaHei, sans-serif" font-size="14" fill="#333">
            <tspan fill="#801E32">●</tspan> ${this._escapeXml(p.substring(0, 40))}${p.length > 40 ? '...' : ''}
          </text>
        `).join('')}
      </svg>
    `;

    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * ===== 私有方法 ===== 
   */

  // 红酒风格
  async _generateWineStyle(title, subtitle, author, date, category, backgroundPath) {
    let background;
    if (backgroundPath && fs.existsSync(backgroundPath)) {
      background = await sharp(backgroundPath)
        .resize(this.width, this.height, { fit: 'cover', position: 'center' })
        .toBuffer();
    } else {
      background = await this._createWineGradient();
    }

    // 叠加层
    const overlay = await this._createDarkOverlay();

    // 文字层
    const textLayer = await this._createWineTextLayer(title, subtitle, author, date, category);

    return sharp(background)
      .composite([
        { input: overlay, top: 0, left: 0 },
        { input: textLayer, top: 0, left: 0 }
      ])
      .png()
      .toBuffer();
  }

  // 现代风格
  async _generateModernStyle(title, subtitle, author, date, category, backgroundPath) {
    const background = await this._createModernGradient();

    const textLayer = await this._createModernTextLayer(title, subtitle, author, date, category);

    return sharp(background)
      .composite([{ input: textLayer, top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  // 简约风格
  async _generateMinimalistStyle(title, subtitle, author, date, category, backgroundPath) {
    const background = await this._createMinimalistBg();

    const textLayer = await this._createMinimalistTextLayer(title, subtitle, author, date);

    return sharp(background)
      .composite([{ input: textLayer, top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  // 醒目风格
  async _generateBoldStyle(title, subtitle, author, date, category, backgroundPath) {
    const background = await this._createBoldGradient();

    const textLayer = await this._createBoldTextLayer(title, subtitle, author, date);

    return sharp(background)
      .composite([{ input: textLayer, top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  // 默认风格
  async _generateDefaultStyle(title, subtitle, author, date, category, backgroundPath) {
    return this._generateWineStyle(title, subtitle, author, date, category, backgroundPath);
  }

  // 红酒渐变背景
  async _createWineGradient() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a0a10"/>
            <stop offset="50%" style="stop-color:#3d1a2e"/>
            <stop offset="100%" style="stop-color:#1a0a10"/>
          </linearGradient>
          <radialGradient id="r" cx="70%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:#8b2252;stop-opacity:0.5"/>
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <rect width="100%" height="100%" fill="url(#r)"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 深色叠加层
  async _createDarkOverlay() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#000000" opacity="0.4"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 红酒文字层
  async _createWineTextLayer(title, subtitle, author, date, category) {
    const title1 = title.substring(0, 12);
    const title2 = title.length > 12 ? title.substring(12, 24) : '';
    const displaySubtitle = subtitle ? subtitle.substring(0, 20) : '';

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.6"/>
          </filter>
          <linearGradient id="t" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fff"/>
            <stop offset="100%" style="stop-color:#ddd"/>
          </linearGradient>
        </defs>
        ${category ? `<text x="50" y="40" font-family="Georgia,serif" font-size="12" fill="#d4af37" letter-spacing="2">${category.toUpperCase()}</text>` : ''}
        ${category ? `<line x1="50" y1="48" x2="150" y2="48" stroke="#d4af37" opacity="0.5"/>` : ''}
        <text x="50" y="${category ? 95 : 75}" font-family="Microsoft YaHei,PingFang SC" font-size="36" font-weight="bold" fill="url(#t)" filter="url(#s)">${this._escapeXml(title1)}</text>
        ${title2 ? `<text x="50" y="${category ? 135 : 115}" font-family="Microsoft YaHei,PingFang SC" font-size="36" font-weight="bold" fill="url(#t)" filter="url(#s)">${this._escapeXml(title2)}</text>` : ''}
        ${displaySubtitle ? `<text x="50" y="${category ? 175 : 155}" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">${this._escapeXml(displaySubtitle)}</text>` : ''}
        <line x1="50" y1="${category ? 195 : 175}" x2="150" y2="${category ? 195 : 175}" stroke="#d4af37" stroke-width="2"/>
        ${author ? `<text x="50" y="${category ? 225 : 205}" font-family="Microsoft YaHei" font-size="14" fill="#d4af37">${this._escapeXml(author)}</text>` : ''}
        ${date ? `<text x="750" y="350" font-family="Microsoft YaHei" font-size="14" fill="#d4af37" text-anchor="end">${this._escapeXml(date)}</text>` : ''}
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 现代渐变
  async _createModernGradient() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 现代文字层
  async _createModernTextLayer(title, subtitle, author, date, category) {
    const titleText = title.substring(0, 16);
    const title2 = title.length > 16 ? title.substring(16, 32) : '';

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/></filter></defs>
        <text x="40" y="100" font-family="Microsoft YaHei,PingFang SC" font-size="42" font-weight="bold" fill="#fff" filter="url(#s)">${this._escapeXml(titleText)}</text>
        ${title2 ? `<text x="40" y="150" font-family="Microsoft YaHei,PingFang SC" font-size="42" font-weight="bold" fill="#fff" filter="url(#s)">${this._escapeXml(title2)}</text>` : ''}
        ${subtitle ? `<text x="40" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.9)">${this._escapeXml(subtitle.substring(0, 30))}</text>` : ''}
        ${author ? `<text x="40" y="350" font-family="Microsoft YaHei" font-size="14" fill="#fff" opacity="0.8">${this._escapeXml(author)}</text>` : ''}
        ${date ? `<text x="750" y="350" font-family="Microsoft YaHei" font-size="14" fill="#fff" text-anchor="end" opacity="0.8">${this._escapeXml(date)}</text>` : ''}
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 简约背景
  async _createMinimalistBg() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <rect x="0" y="0" width="8" height="100%" fill="#801E32"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 简约文字层
  async _createMinimalistTextLayer(title, subtitle, author, date) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <text x="40" y="100" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#1a1a1a">${this._escapeXml(title.substring(0, 14))}</text>
        ${title.length > 14 ? `<text x="40" y="145" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#1a1a1a">${this._escapeXml(title.substring(14, 28))}</text>` : ''}
        ${subtitle ? `<text x="40" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="#666">${this._escapeXml(subtitle.substring(0, 25))}</text>` : ''}
        ${author ? `<text x="40" y="350" font-family="Microsoft YaHei" font-size="14" fill="#801E32">${this._escapeXml(author)}</text>` : ''}
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 醒目渐变
  async _createBoldGradient() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#801E32"/>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 醒目文字层
  async _createBoldTextLayer(title, subtitle, author, date) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <text x="40" y="120" font-family="Microsoft YaHei,PingFang SC" font-size="48" font-weight="900" fill="#fff">${this._escapeXml(title.substring(0, 12))}</text>
        ${title.length > 12 ? `<text x="40" y="175" font-family="Microsoft YaHei,PingFang SC" font-size="48" font-weight="900" fill="#fff">${this._escapeXml(title.substring(12, 24))}</text>` : ''}
        ${subtitle ? `<text x="40" y="240" font-family="Microsoft YaHei,PingFang SC" font-size="22" fill="#ffd700">${this._escapeXml(subtitle.substring(0, 20))}</text>` : ''}
        ${author ? `<text x="40" y="350" font-family="Microsoft YaHei" font-size="14" fill="#fff" opacity="0.7">${this._escapeXml(author)}</text>` : ''}
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 引用卡片
  _generateQuoteCard(text) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9f9f9" rx="8"/>
        <text x="30" y="40" font-family="Georgia,serif" font-size="24" fill="#801E32">"</text>
        <text x="50" y="100" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="#333">
          ${this._wrapText(text, 30).map((line, i) => `<tspan x="50" dy="${i === 0 ? 0 : 28}">${this._escapeXml(line)}</tspan>`).join('')}
        </text>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 数据卡片
  _generateStatCard(text) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" rx="8"/>
        <text x="50%" y="55%" font-family="Microsoft YaHei,PingFang SC" font-size="48" font-weight="bold" fill="#fff" text-anchor="middle">${this._escapeXml(text)}</text>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 提示卡片
  _generateTipCard(text) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff8e7" rx="8"/>
        <rect x="0" y="0" width="6" height="100%" fill="#d4af37" rx="3"/>
        <text x="30" y="40" font-family="Microsoft YaHei,PingFang SC" font-size="16" font-weight="bold" fill="#d4af37">💡 提示</text>
        <text x="30" y="80" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="#333">
          ${this._wrapText(text, 25).map((line, i) => `<tspan x="30" dy="${i === 0 ? 0 : 24}">${this._escapeXml(line)}</tspan>`).join('')}
        </text>
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  // 文字换行
  _wrapText(text, maxLen) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length > maxLen) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 5);
  }

  // XML转义
  _escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

module.exports = TextIllustrationGenerator;
