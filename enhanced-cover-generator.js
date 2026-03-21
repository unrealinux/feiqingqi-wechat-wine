/**
 * Enhanced Cover Generator
 * Intelligently selects between AI-generated images and vector-based covers
 * with smart fallback and caching
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { generateWineCover: generateAICover, WINE_PROMPTS } = require('./ai-image-generator');
const WineElementCoverGenerator = require('./wine-element-cover');
const { CoverGenerator } = require('./coverGenerator');
const config = require('./config');

class EnhancedCoverGenerator {
  constructor(options = {}) {
    this.width = options.width || 900;
    this.height = options.height || 383;
    this.cacheDir = path.join(__dirname, '.cover-cache');
    
    // Initialize generators
    this.wineElementGen = new WineElementCoverGenerator({ width: this.width, height: this.height });
    this.professionalGen = new CoverGenerator({ width: this.width, height: this.height });
    
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
  
  /**
   * Generate cache key based on parameters
   */
  _getCacheKey(title, subtitle, element, theme, date) {
    const keyString = `${title}|${subtitle}|${element}|${theme}|${date}`;
    return require('crypto').createHash('md5').update(keyString).digest('hex');
  }
  
  /**
   * Get cached cover if exists
   */
  _getCachedCover(cacheKey) {
    const cachePath = path.join(this.cacheDir, `${cacheKey}.png`);
    if (fs.existsSync(cachePath)) {
      try {
        return fs.readFileSync(cachePath);
      } catch (err) {
        console.warn('Failed to read cached cover:', err.message);
      }
    }
    return null;
  }
  
  /**
   * Save cover to cache
   */
  _saveToCache(cacheKey, imageBuffer) {
    const cachePath = path.join(this.cacheDir, `${cacheKey}.png`);
    try {
      fs.writeFileSync(cachePath, imageBuffer);
    } catch (err) {
      console.warn('Failed to cache cover:', err.message);
    }
  }
  
  /**
   * Select appropriate wine element based on content
   */
  _selectWineElement(title, subtitle) {
    const text = (title + ' ' + subtitle).toLowerCase();
    
    // Keywords for each element type
    const elementKeywords = {
      bottle: ['酒瓶', '红酒瓶', '葡萄酒瓶', '酒庄', 'winery', '瓶装'],
      grapes: ['葡萄', '葡萄园', '葡萄种植', 'grape', 'vineyard', '采摘'],
      wineglass: ['品酒', '酒杯', 'tasting', 'glass', '醒酒', '酒杯'],
      vineyard: ['产区', '酒庄', '葡萄园', 'region', 'estate', '庄园'],
      luxury: ['顶级', '奢华', '珍藏', '珍品', 'premium', 'luxury', 'rare', '珍稀']
    };
    
    // Score each element based on keyword matches
    const scores = {};
    for (const [element, keywords] of Object.entries(elementKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      scores[element] = score;
    }
    
    // Find element with highest score, default to wineglass
    let bestElement = 'wineglass';
    let maxScore = 0;
    
    for (const [element, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestElement = element;
      }
    }
    
    // If no keywords matched, use content-based defaults
    if (maxScore === 0) {
      if (text.includes('投资') || text.includes('价格') || text.includes('市场')) {
        bestElement = 'bottle'; // Investment/market analysis -> bottle
      } else if (text.includes('品鉴') || text.includes('品酒') || text.includes('口感')) {
        bestElement = 'wineglass'; // Tasting -> glass
      } else if (text.includes('产区') || text.includes('酒庄') || text.includes('葡萄园')) {
        bestElement = 'vineyard'; // Region info -> vineyard
      } else if (text.includes('收藏') || text.includes('珍藏') || text.includes('拍卖')) {
        bestElement = 'luxury'; // Collectibles/auction -> luxury
      }
    }
    
    return bestElement;
  }
  
  /**
   * Generate cover using AI image with fallback to vector-based
   */
  async generateSmartCover(options = {}) {
    const {
      title = '',
      subtitle = '',
      author = '',
      date = '',
      category = '红酒',
      forceAI = false,
      forceVector = false
    } = options;
    
    // Select appropriate wine element based on content
    const element = options.element || this._selectWineElement(title, subtitle);
    
    // Generate cache key
    const cacheKey = this._getCacheKey(title, subtitle, element, options.theme || 'elegant', date);
    
    // Check cache first (unless forcing regeneration)
    if (!forceAI && !forceVector) {
      const cached = this._getCachedCover(cacheKey);
      if (cached) {
        console.log('✓ Using cached cover');
        return cached;
      }
    }
    
    console.log(`Generating cover for: "${title}"`);
    console.log(`Selected element: ${element}`);
    
    let imageBuffer = null;
    let generationMethod = 'unknown';
    
    // Try AI generation first (unless forcing vector)
    if (!forceVector) {
      try {
        console.log('🎨 Attempting AI-generated cover...');
        const result = await generateAICover({
          title: title,
          subtitle: subtitle,
          element: element,
          date: date
        });
        
        imageBuffer = await fs.promises.readFile(result.path);
        generationMethod = `AI (${result.provider})`;
        console.log(`✓ AI cover generated using ${result.provider}`);
      } catch (aiError) {
        console.warn('⚠ AI generation failed:', aiError.message);
        // Continue to fallback
      }
    }
    
    // Fallback to vector-based generation
    if (!imageBuffer || forceVector) {
      try {
        console.log('🎨 Generating vector-based cover...');
        
        // Choose between wine element and professional generator based on theme
        if (options.theme === 'professional' || options.forceProfessional) {
          imageBuffer = await this.professionalGen.generateWineCover({
            title: title,
            subtitle: subtitle,
            author: author || '红酒顾问',
            style: options.theme || 'elegant'
          });
          generationMethod = 'Professional Vector';
        } else {
          imageBuffer = await this.wineElementGen.generate({
            title: title,
            subtitle: subtitle,
            author: author,
            date: date,
            category: category,
            element: element,
            theme: options.theme || 'elegant'
          });
          generationMethod = 'Wine Element Vector';
        }
        
        console.log(`✓ Vector cover generated using ${generationMethod}`);
      } catch (vectorError) {
        console.error('✗ Vector generation also failed:', vectorError.message);
        throw new Error('Both AI and vector cover generation failed');
      }
    }
    
    // Cache the result
    if (!forceAI && !forceVector) {
      this._saveToCache(cacheKey, imageBuffer);
    }
    
    console.log(`📌 Cover generation method: ${generationMethod}`);
    return imageBuffer;
  }
  
  /**
   * Clear cache (useful for development or when updating styles)
   */
  clearCache() {
    const files = fs.readdirSync(this.cacheDir);
    for (const file of files) {
      fs.unlinkSync(path.join(this.cacheDir, file));
    }
    console.log(`✓ Cleared ${files.length} cached covers`);
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats() {
    const files = fs.readdirSync(this.cacheDir);
    let totalSize = 0;
    
    for (const file of files) {
      const stats = fs.statSync(path.join(this.cacheDir, file));
      totalSize += stats.size;
    }
    
    return {
      count: files.length,
      size: totalSize,
      sizeMB: (totalSize / (1024 * 1024)).toFixed(2)
    };
  }
}

module.exports = EnhancedCoverGenerator;

// CLI for testing
if (require.main === module) {
  (async () => {
    const generator = new EnhancedCoverGenerator();
    
    const testCases = [
      {
        title: '🍷 2026年2月Liv-ex精品葡萄酒市场报告',
        subtitle: '复苏信号明显，投资机会显现',
        date: '2026-02'
      },
      {
        title: '🏆 法国波尔多2025年份酒评',
        subtitle: '五大酒庄表现卓越，投资价值凸显',
        date: '2026-02',
        element: 'bottle'
      },
      {
        title: '🇨🇳 宁夏产区崛起，国货之光',
        subtitle: '贺兰山东麓葡萄酒获国际大奖',
        date: '2026-02',
        element: 'vineyard'
      },
      {
        title: '👨‍🍳 品酒新手入门指南',
        subtitle: '观色闻香品尝技巧全解析',
        date: '2026-02',
        element: 'wineglass'
      }
    ];
    
    for (const [index, testCase] of testCases.entries()) {
      console.log('\n' + '='.repeat(60));
      console.log(`测试用例 ${index + 1}/${testCases.length}`);
      console.log('='.repeat(60));
      
      try {
        const startTime = Date.now();
        const coverBuffer = await generator.generateSmartCover(testCase);
        const endTime = Date.now();
        
        // Save test output
        const outputPath = path.join(__dirname, 'output', `test_cover_${index + 1}.png`);
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputPath, coverBuffer);
        
        console.log(`✅ 生成成功! 耗时: ${endTime - startTime}ms`);
        console.log(`📁 保存至: ${outputPath}`);
        console.log(`📊 大小: ${(coverBuffer.length / 1024).toFixed(1)} KB`);
        
      } catch (err) {
        console.error('❌ 生成失败:', err.message);
      }
    }
    
    // Show cache stats
    console.log('\n' + '='.repeat(60));
    console.log('缓存统计');
    console.log('='.repeat(60));
    const stats = generator.getCacheStats();
    console.log(`缓存图片数量: ${stats.count}`);
    console.log(`缓存总大小: ${stats.sizeMB} MB (${stats.size} bytes)`);
  })();
}
