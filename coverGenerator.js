/**
 * Professional Cover Image Generator (Sharp-based)
 * 
 * 生成高质量的微信公众号封面图 (900x383)
 * 支持多种风格：红酒主题、渐变、AI生成、素材背景
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// 封面图配置
const COVER_CONFIG = {
  width: 900,
  height: 383,
  // 红酒主题配色
  colors: {
    darkPurple: '#2D1436',
    wineRed: '#801E32',
    burgundy: '#800020',
    deepRed: '#500F23',
    gold: '#D4AF37',
    cream: '#FFF8E7',
    glass: '#C8B4BE',
    grape: '#663366',
    leaf: '#2D5016',
    white: '#FFFFFF',
    black: '#1A1A1A',
  },
};

class CoverGenerator {
  constructor(options = {}) {
    this.width = options.width || COVER_CONFIG.width;
    this.height = options.height || COVER_CONFIG.height;
    this.openai = options.openaiApiKey ? new OpenAI({ apiKey: options.openaiApiKey }) : null;
    this.debug = options.debug || false;
  }

  /**
   * 生成红酒主题封面 (Sharp-based)
   */
  async generateWineCover(options = {}) {
    const {
      title = '红酒资讯',
      subtitle = '',
      author = '红酒顾问',
      style = 'elegant', // elegant, modern, classic
    } = options;

    try {
      // 1. 创建渐变背景
      const backgroundBuffer = await this._createGradientBackground(style);

      // 2. 创建文字 SVG
      const textSvgBuffer = this._createTextSvg(title, subtitle, author, style);

      // 3. 合成背景 + 文字
      const finalBuffer = await sharp(backgroundBuffer)
        .composite([{
          input: textSvgBuffer,
          top: 0,
          left: 0,
        }])
        .png()
        .toBuffer();

      // 4. 添加质感效果 (暗角)
      const vignetteBuffer = await this._createVignette();
      const result = await sharp(finalBuffer)
        .composite([{
          input: vignetteBuffer,
          top: 0,
          left: 0,
        }])
        .png()
        .toBuffer();

      if (this.debug) {
        const debugPath = path.join(__dirname, 'debug_cover.png');
        fs.writeFileSync(debugPath, result);
        console.log(`Debug cover saved to: ${debugPath}`);
      }

      return result;
    } catch (error) {
      console.error('Cover generation failed:', error);
      throw error;
    }
  }

  /**
   * 创建渐变背景 SVG
   */
  async _createGradientBackground(style) {
    let colors;
    
    switch (style) {
      case 'modern':
        colors = ['#1a1a2e', '#16213e', '#0f3460'];
        break;
      case 'classic':
        colors = ['#2D1436', '#500F23', '#800020', '#6B0F1A'];
        break;
      case 'elegant':
      default:
        colors = ['#1E0F1E', '#3D1A2E', '#5C1A2E', '#801E32'];
    }

    // 创建 SVG 渐变背景
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            ${colors.map((color, i) => `<stop offset="${(i / (colors.length - 1)) * 100}%" style="stop-color:${color};stop-opacity:1" />`).join('')}
          </linearGradient>
          <radialGradient id="glow" cx="30%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#801E32;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)" />
        <rect width="100%" height="100%" fill="url(#glow)" />
      </svg>
    `;

    return Buffer.from(svg);
  }

  /**
   * 创建文字 SVG
   */
  _createTextSvg(title, subtitle, author, style) {
    // 截断标题
    const maxTitleLen = 15;
    const displayTitle = title.length > maxTitleLen ? title.substring(0, maxTitleLen) + '...' : title;
    
    const maxSubtitleLen = 25;
    const displaySubtitle = subtitle && subtitle.length > maxSubtitleLen 
      ? subtitle.substring(0, maxSubtitleLen) + '...' 
      : (subtitle || '');

    // 文字阴影效果
    const shadowColor = '#000000';
    const shadowOpacity = '0.5';
    const shadowBlur = '4';
    const shadowOffset = '2';

    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="${shadowOffset}" dy="${shadowOffset}" stdDeviation="${shadowBlur}" flood-color="${shadowColor}" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        
        <!-- 标题区域背景 -->
        <rect x="40" y="${this.height / 2 - 60}" width="500" height="120" fill="rgba(0,0,0,0.2)" rx="5" />
        
        <!-- 标题 -->
        <text 
          x="60" 
          y="${this.height / 2 - 15}" 
          font-family="Microsoft YaHei, SimHei, sans-serif" 
          font-size="56" 
          font-weight="bold" 
          fill="#FFFFFF"
          filter="url(#shadow)"
        >${this._escapeXml(displayTitle)}</text>
        
        ${displaySubtitle ? `
        <!-- 副标题 -->
        <text 
          x="60" 
          y="${this.height / 2 + 25}" 
          font-family="Microsoft YaHei, SimHei, sans-serif" 
          font-size="28" 
          fill="rgba(255,255,255,0.7)"
          filter="url(#shadow)"
        >${this._escapeXml(displaySubtitle)}</text>
        ` : ''}
        
        ${author ? `
        <!-- 作者 -->
        <text 
          x="60" 
          y="${this.height / 2 + 60}" 
          font-family="Microsoft YaHei, SimHei, sans-serif" 
          font-size="20" 
          fill="#D4AF37"
          opacity="0.8"
        >${this._escapeXml(author)}</text>
        ` : ''}
        
        <!-- 装饰线 - 顶部 -->
        <line x1="50" y1="30" x2="${this.width - 50}" y2="30" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1" />
        
        <!-- 装饰线 - 底部 -->
        <line x1="50" y1="${this.height - 30}" x2="${this.width - 50}" y2="${this.height - 30}" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1" />
      </svg>
    `;

    return Buffer.from(svg);
  }

  /**
   * 创建暗角效果
   */
  async _createVignette() {
    const svg = `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="30%" style="stop-color:#000000;stop-opacity:0" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.4" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>
    `;

    return sharp(Buffer.from(svg))
      .png()
      .toBuffer();
  }

  /**
   * XML 转义
   */
  _escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * 从背景图生成封面
   */
  async generateFromTemplate(options = {}) {
    const {
      title = '红酒资讯',
      subtitle = '',
      author = '红酒顾问',
      backgroundPath = null, // 本地文件路径或 URL
    } = options;

    try {
      let backgroundBuffer;

      if (backgroundPath) {
        // 加载背景图片
        if (backgroundPath.startsWith('http')) {
          const axios = require('axios');
          const response = await axios.get(backgroundPath, { responseType: 'arraybuffer' });
          backgroundBuffer = Buffer.from(response.data);
        } else if (fs.existsSync(backgroundPath)) {
          backgroundBuffer = fs.readFileSync(backgroundPath);
        } else {
          throw new Error(`Background image not found: ${backgroundPath}`);
        }

        // 调整大小为封面尺寸
        backgroundBuffer = await sharp(backgroundBuffer)
          .resize(this.width, this.height, {
            fit: 'cover',
            position: 'center',
          })
          .toBuffer();
      } else {
        // 默认渐变背景
        backgroundBuffer = await this._createGradientBackground('elegant');
      }

      // 创建文字 SVG
      const textSvgBuffer = this._createTextSvg(title, subtitle, author, 'elegant');

      // 合成
      const finalBuffer = await sharp(backgroundBuffer)
        .composite([{
          input: textSvgBuffer,
          top: 0,
          left: 0,
        }])
        .png()
        .toBuffer();

      return finalBuffer;
    } catch (error) {
      console.error('Template cover generation failed:', error);
      throw error;
    }
  }

  /**
   * 使用素材库生成封面
   */
  async generateWithAssets(options = {}) {
    const {
      title = '红酒资讯',
      subtitle = '',
      author = '红酒顾问',
      assetManager = null, // AssetManager 实例
    } = options;

    try {
      // 尝试获取随机背景图
      let backgroundPath = null;
      
      if (assetManager) {
        const randomAsset = assetManager.getRandomAsset('backgrounds');
        if (randomAsset) {
          backgroundPath = randomAsset.path;
          if (this.debug) {
            console.log(`Using background: ${backgroundPath}`);
          }
        }
      }

      // 如果没有素材，回退到渐变背景
      if (!backgroundPath) {
        return this.generateWineCover({ title, subtitle, author, style: 'elegant' });
      }

      return this.generateFromTemplate({
        title,
        subtitle,
        author,
        backgroundPath,
      });
    } catch (error) {
      console.error('Asset-based cover generation failed:', error);
      // 降级到渐变背景
      return this.generateWineCover({ title, subtitle, author, style: 'elegant' });
    }
  }

  /**
   * AI生成封面图 (使用DALL-E)
   */
  async generateAICover(options = {}) {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Set openaiApiKey in constructor.');
    }

    const {
      title = '红酒资讯',
      content = '',
      style = 'elegant wine-themed cover with burgundy colors',
    } = options;

    const prompt = `Create a professional WeChat article cover image (2.35:1 aspect ratio, landscape).
    
Title: "${title}"
Style: ${style}

Requirements:
- Deep burgundy and wine-red color palette
- Elegant, minimalist design
- Include subtle wine-related elements (wine glass, grapes, or wine drops)
- Professional typography for title
- High quality, suitable for social media
- No text in image (text will be overlaid programmatically)`;

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1792x1024',
        quality: 'standard',
        n: 1,
        response_format: 'b64_json',
      });

      const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
      
      // 调整大小为封面尺寸
      const resizedBuffer = await sharp(imageBuffer)
        .resize(this.width, this.height, {
          fit: 'cover',
          position: 'center',
        })
        .png()
        .toBuffer();

      // 添加文字
      const textSvgBuffer = this._createTextSvg(title, '', '', 'elegant');
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{
          input: textSvgBuffer,
          top: 0,
          left: 0,
        }])
        .png()
        .toBuffer();

      return finalBuffer;
    } catch (error) {
      console.error('AI cover generation failed:', error.message);
      // 降级到本地生成
      return this.generateWineCover(options);
    }
  }

  /**
   * 生成带装饰元素的封面
   */
  async generateWithElements(options = {}) {
    const {
      title = '红酒资讯',
      subtitle = '',
      author = '红酒顾问',
      style = 'elegant',
      elements = [], // 装饰元素图片路径数组
    } = options;

    try {
      // 1. 创建/加载背景
      let backgroundBuffer;
      
      if (elements.length > 0 && fs.existsSync(elements[0])) {
        backgroundBuffer = await sharp(elements[0])
          .resize(this.width, this.height, { fit: 'cover' })
          .toBuffer();
      } else {
        backgroundBuffer = await this._createGradientBackground(style);
      }

      // 2. 创建文字层
      const textSvgBuffer = this._createTextSvg(title, subtitle, author, style);

      // 3. 合成所有层
      let pipeline = sharp(backgroundBuffer);
      
      const composites = [{
        input: textSvgBuffer,
        top: 0,
        left: 0,
      }];

      // 添加其他装饰元素
      for (let i = 1; i < elements.length; i++) {
        if (fs.existsSync(elements[i])) {
          const elementBuffer = await sharp(elements[i])
            .resize(100, 100, { fit: 'contain' })
            .toBuffer();
          composites.push({
            input: elementBuffer,
            top: this.height - 120,
            left: this.width - 120,
          });
        }
      }

      // 添加暗角
      const vignetteBuffer = await this._createVignette();
      composites.push({
        input: vignetteBuffer,
        top: 0,
        left: 0,
      });

      const finalBuffer = await pipeline
        .composite(composites)
        .png()
        .toBuffer();

      return finalBuffer;
    } catch (error) {
      console.error('Cover generation with elements failed:', error);
      throw error;
    }
  }
}

module.exports = {
  CoverGenerator,
  COVER_CONFIG,
};
