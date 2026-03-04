/**
 * 专业封面图生成器
 * 支持多种风格：红酒、商务、简约、节日等
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ProfessionalCoverGenerator {
  constructor(options = {}) {
    this.width = options.width || 900;
    this.height = options.height || 383;
  }

  /**
   * 生成封面
   * @param {Object} options - 配置选项
   * @returns {Promise<Buffer>}
   */
  async generate(options = {}) {
    const {
      title = '',
      subtitle = '',
      author = '',
      date = '',
      category = '',
      style = 'elegant',  // elegant, modern, minimal, bold, luxury
      backgroundColor = null,
      textColor = '#ffffff',
      accentColor = '#d4af37'
    } = options;

    // 选择背景
    let background;
    if (backgroundColor) {
      background = await this.createSolidBackground(backgroundColor);
    } else {
      background = await this.createStyleBackground(style);
    }

    // 创建装饰层
    const decoration = await this.createDecoration(style, { category, date });

    // 创建文字层
    const textLayer = await this.createTextLayer(style, {
      title, subtitle, author, accentColor, textColor
    });

    // 合成
    const result = await sharp(background)
      .composite([
        { input: decoration, top: 0, left: 0 },
        { input: textLayer, top: 0, left: 0 }
      ])
      .png()
      .toBuffer();

    return result;
  }

  /**
   * 根据风格创建背景
   */
  async createStyleBackground(style) {
    const backgrounds = {
      elegant: () => this.createGradientBackground([
        '#1a0a10', '#2d1424', '#4a1a2e', '#3d1428', '#1a0a10'
      ], { cx: '70%', cy: '30%', r: '60%' }),

      modern: () => this.createGradientBackground([
        '#1a1a2e', '#16213e', '#0f3460'
      ], { cx: '50%', cy: '50%', r: '70%' }),

      minimal: () => this.createSolidBackground('#ffffff'),

      bold: () => this.createGradientBackground([
        '#801E32', '#5c1525', '#3d0f1a'
      ], { cx: '30%', cy: '70%', r: '50%' }),

      luxury: () => this.createLuxuryBackground(),

      ocean: () => this.createGradientBackground([
        '#0f2027', '#203a43', '#2c5364'
      ], { cx: '50%', cy: '30%', r: '60%' }),

      sunset: () => this.createGradientBackground([
        '#355c7d', '#6c5b7b', '#c06c84'
      ], { cx: '50%', cy: '0%', r: '80%' }),

      forest: () => this.createGradientBackground([
        '#134e5e', '#2d5a27', '#3e7c17'
      ], { cx: '50%', cy: '30%', r: '60%' }),
    };

    return (backgrounds[style] || backgrounds.elegant)();
  }

  /**
   * 创建渐变背景
   */
  async createGradientBackground(colors, radial = null) {
    let gradient = '';
    
    if (radial) {
      gradient = `
        <radialGradient id="g" cx="${radial.cx}" cy="${radial.cy}" r="${radial.r}">
          <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors[Math.floor(colors.length / 2)]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors[colors.length - 1]};stop-opacity:1" />
        </radialGradient>
      `;
    } else {
      gradient = `
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          ${colors.map((c, i) => `<stop offset="${(i / (colors.length - 1)) * 100}%" style="stop-color:${c};stop-opacity:1" />`).join('')}
        </linearGradient>
      `;
    }

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>${gradient}</defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
    `;

    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建纯色背景
   */
  async createSolidBackground(color) {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}" />
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建奢华背景
   */
  async createLuxuryBackground() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1a1520;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0" />
          </linearGradient>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="30" height="30">
            <circle cx="2" cy="2" r="1" fill="#d4af37" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g1)" />
        <rect width="100%" height="100%" fill="url(#g2)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    `;
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  /**
   * 创建装饰层
   */
  async createDecoration(style, options = {}) {
    const { category, date } = options;

    const decorations = {
      elegant: () => {
        const svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="40" x2="200" y2="40" stroke="#d4af37" stroke-width="1" opacity="0.3"/>
            <line x1="50" y1="${this.height - 40}" x2="300" y2="${this.height - 40}" stroke="#d4af37" stroke-width="1" opacity="0.3"/>
            ${category ? `<text x="${this.width - 50}" y="45" font-family="Georgia,serif" font-size="12" fill="#d4af37" opacity="0.6" text-anchor="end">${category.toUpperCase()}</text>` : ''}
            ${date ? `<text x="${this.width - 50}" y="${this.height - 25}" font-family="Microsoft YaHei" font-size="14" fill="#d4af37" opacity="0.7" text-anchor="end">${date}</text>` : ''}
          </svg>
        `;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      modern: () => {
        const svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="8" height="100%" fill="#667eea"/>
            <circle cx="${this.width - 100}" cy="80" r="60" fill="#667eea" opacity="0.1"/>
            <circle cx="${this.width - 50}" cy="50" r="30" fill="#764ba2" opacity="0.1"/>
          </svg>
        `;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      minimal: () => {
        const svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="6" height="100%" fill="#333333"/>
            <line x1="30" y1="${this.height - 30}" x2="150" y2="${this.height - 30}" stroke="#333333" stroke-width="2"/>
          </svg>
        `;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      bold: () => {
        const svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <polygon points="${this.width},0 ${this.width - 150},0 ${this.width},150" fill="#5c1525" opacity="0.5"/>
            <circle cx="80" cy="${this.height - 60}" r="100" fill="#ffd700" opacity="0.05"/>
          </svg>
        `;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      luxury: () => {
        const svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="40" y1="35" x2="100" y2="35" stroke="#d4af37" stroke-width="2"/>
            <line x1="40" y1="${this.height - 35}" x2="200" y2="${this.height - 35}" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
            <circle cx="${this.width - 80}" cy="60" r="4" fill="#d4af37" opacity="0.4"/>
            <circle cx="${this.width - 60}" cy="75" r="3" fill="#d4af37" opacity="0.3"/>
            <circle cx="${this.width - 45}" cy="85" r="2" fill="#d4af37" opacity="0.2"/>
            ${category ? `<text x="50" y="55" font-family="Georgia,serif" font-size="11" fill="#d4af37" letter-spacing="3" opacity="0.8">${category.toUpperCase()}</text>` : ''}
          </svg>
        `;
        return sharp(Buffer.from(svg)).png().toBuffer();
      }
    };

    return (decorations[style] || decorations.elegant)();
  }

  /**
   * 创建文字层
   */
  async createTextLayer(style, options = {}) {
    const { title, subtitle, author, accentColor, textColor } = options;

    // 处理标题换行
    const titleLines = this.wrapText(title, 14);
    const subtitleLine = subtitle ? subtitle.substring(0, 22) : '';

    const textLayers = {
      elegant: () => {
        const titleY = titleLines.length > 1 ? 140 : 160;
        let svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
              </filter>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${textColor}"/>
                <stop offset="100%" style="stop-color:#cccccc"/>
              </linearGradient>
            </defs>
        `;

        // 标题
        titleLines.forEach((line, i) => {
          svg += `<text x="50" y="${titleY + i * 45}" font-family="Microsoft YaHei,PingFang SC" font-size="42" font-weight="bold" fill="url(#titleGrad)" filter="url(#shadow)">${this.escapeXml(line)}</text>`;
        });

        // 分隔线
        svg += `<line x1="50" y1="${titleY + titleLines.length * 45 + 10}" x2="180" y2="${titleY + titleLines.length * 45 + 10}" stroke="${accentColor}" stroke-width="2"/>`;

        // 副标题
        if (subtitleLine) {
          svg += `<text x="50" y="${titleY + titleLines.length * 45 + 45}" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.75)">${this.escapeXml(subtitleLine)}</text>`;
        }

        // 作者
        if (author) {
          svg += `<text x="50" y="${this.height - 30}" font-family="Microsoft YaHei" font-size="14" fill="${accentColor}">${this.escapeXml(author)}</text>`;
        }

        svg += `</svg>`;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      modern: () => {
        const titleY = 130;
        let svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
              </filter>
            </defs>
        `;

        titleLines.forEach((line, i) => {
          svg += `<text x="40" y="${titleY + i * 48}" font-family="Microsoft YaHei,PingFang SC" font-size="44" font-weight="bold" fill="#ffffff" filter="url(#shadow)">${this.escapeXml(line)}</text>`;
        });

        if (subtitleLine) {
          svg += `<text x="40" y="${titleY + titleLines.length * 48 + 15}" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">${this.escapeXml(subtitleLine)}</text>`;
        }

        if (author) {
          svg += `<text x="40" y="${this.height - 25}" font-family="Microsoft YaHei" font-size="14" fill="#ffffff" opacity="0.7">${this.escapeXml(author)}</text>`;
        }

        svg += `</svg>`;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      minimal: () => {
        const titleY = 120;
        let svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        `;

        titleLines.forEach((line, i) => {
          svg += `<text x="40" y="${titleY + i * 42}" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#1a1a1a">${this.escapeXml(line)}</text>`;
        });

        svg += `<line x1="40" y1="${titleY + titleLines.length * 42 + 10}" x2="120" y2="${titleY + titleLines.length * 42 + 10}" stroke="#333333" stroke-width="2"/>`;

        if (subtitleLine) {
          svg += `<text x="40" y="${titleY + titleLines.length * 42 + 40}" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="#666666">${this.escapeXml(subtitleLine)}</text>`;
        }

        if (author) {
          svg += `<text x="40" y="${this.height - 30}" font-family="Microsoft YaHei" font-size="14" fill="#801E32">${this.escapeXml(author)}</text>`;
        }

        svg += `</svg>`;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      bold: () => {
        const titleY = 140;
        let svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.4"/>
              </filter>
            </defs>
        `;

        titleLines.forEach((line, i) => {
          svg += `<text x="40" y="${titleY + i * 50}" font-family="Microsoft YaHei,PingFang SC" font-size="48" font-weight="900" fill="#ffffff" filter="url(#shadow)">${this.escapeXml(line)}</text>`;
        });

        if (subtitleLine) {
          svg += `<text x="40" y="${titleY + titleLines.length * 50 + 20}" font-family="Microsoft YaHei,PingFang SC" font-size="22" fill="#ffd700">${this.escapeXml(subtitleLine)}</text>`;
        }

        if (author) {
          svg += `<text x="40" y="${this.height - 35}" font-family="Microsoft YaHei" font-size="14" fill="#ffffff" opacity="0.7">${this.escapeXml(author)}</text>`;
        }

        svg += `</svg>`;
        return sharp(Buffer.from(svg)).png().toBuffer();
      },

      luxury: () => {
        const titleY = 150;
        let svg = `
          <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.6"/>
              </filter>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd700"/>
                <stop offset="50%" style="stop-color:#d4af37"/>
                <stop offset="100%" style="stop-color:#b8860b"/>
              </linearGradient>
            </defs>
        `;

        titleLines.forEach((line, i) => {
          svg += `<text x="50" y="${titleY + i * 48}" font-family="Microsoft YaHei,PingFang SC,serif" font-size="44" font-weight="bold" fill="url(#goldGrad)" filter="url(#shadow)">${this.escapeXml(line)}</text>`;
        });

        svg += `<line x1="50" y1="${titleY + titleLines.length * 48 + 5}" x2="150" y2="${titleY + titleLines.length * 48 + 5}" stroke="url(#goldGrad)" stroke-width="2"/>`;

        if (subtitleLine) {
          svg += `<text x="50" y="${titleY + titleLines.length * 48 + 40}" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">${this.escapeXml(subtitleLine)}</text>`;
        }

        if (author) {
          svg += `<text x="50" y="${this.height - 30}" font-family="Georgia,serif" font-size="14" fill="url(#goldGrad)">${this.escapeXml(author)}</text>`;
        }

        svg += `</svg>`;
        return sharp(Buffer.from(svg)).png().toBuffer();
      }
    };

    return (textLayers[style] || textLayers.elegant)();
  }

  /**
   * 文字换行
   */
  wrapText(text, maxCharsPerLine) {
    if (!text) return [''];
    const lines = [];
    let currentLine = '';
    
    for (const char of text) {
      if (currentLine.length >= maxCharsPerLine && char !== ' ') {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 3); // 最多3行
  }

  /**
   * XML转义
   */
  escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

module.exports = ProfessionalCoverGenerator;
