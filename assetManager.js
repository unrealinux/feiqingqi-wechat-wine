/**
 * 素材库管理器
 * 
 * 管理封面图素材，支持：
 * - 背景图片
 * - 装饰元素
 * - 叠加图层
 * - 模板系统
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 素材库目录结构
const ASSET_STRUCTURE = {
  backgrounds: '背景图片 (红酒、酒杯、葡萄等)',
  elements: '装饰元素 (图标、边框、酒滴等)',
  overlays: '叠加图层 (纹理、光效、渐变)',
  templates: '模板文件',
};

class AssetManager {
  constructor(options = {}) {
    this.assetsDir = options.assetsDir || path.join(__dirname, 'assets');
    this.cache = new Map();
    this.debug = options.debug || false;
    
    // 确保目录存在
    this._ensureDirectories();
  }

  /**
   * 确保素材目录存在
   */
  _ensureDirectories() {
    Object.keys(ASSET_STRUCTURE).forEach(dir => {
      const fullPath = path.join(this.assetsDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        if (this.debug) {
          console.log(`Created directory: ${fullPath}`);
        }
      }
    });
  }

  /**
   * 获取素材列表
   */
  listAssets(category = 'backgrounds') {
    const dir = path.join(this.assetsDir, category);
    
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map(file => ({
        name: file,
        path: path.join(dir, file),
        url: `/assets/${category}/${file}`,
        category,
      }));
  }

  /**
   * 获取随机素材
   */
  getRandomAsset(category = 'backgrounds') {
    const assets = this.listAssets(category);
    if (assets.length === 0) return null;
    return assets[Math.floor(Math.random() * assets.length)];
  }

  /**
   * 加载素材图片为 Buffer
   */
  async loadAssetBuffer(assetPath) {
    // 检查缓存
    if (this.cache.has(assetPath)) {
      return this.cache.get(assetPath);
    }

    // 本地文件
    if (fs.existsSync(assetPath)) {
      const buffer = fs.readFileSync(assetPath);
      this.cache.set(assetPath, buffer);
      return buffer;
    }

    // URL 下载
    if (assetPath.startsWith('http')) {
      const response = await axios.get(assetPath, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });
      const buffer = Buffer.from(response.data);
      this.cache.set(assetPath, buffer);
      return buffer;
    }

    throw new Error(`Asset not found: ${assetPath}`);
  }

  /**
   * 下载并保存素材
   */
  async downloadAsset(url, category = 'backgrounds', filename = null) {
    const buffer = await this.loadAssetBuffer(url);
    
    if (!filename) {
      const ext = path.extname(url.split('?')[0]) || '.jpg';
      filename = `asset_${Date.now()}${ext}`;
    }

    const savePath = path.join(this.assetsDir, category, filename);
    fs.writeFileSync(savePath, buffer);
    
    if (this.debug) {
      console.log(`Downloaded: ${url} -> ${savePath}`);
    }

    return {
      name: filename,
      path: savePath,
      url: `/assets/${category}/${filename}`,
      category,
    };
  }

  /**
   * 预加载在线素材库
   */
  async preloadOnlineAssets() {
    // Unsplash 红酒相关图片 (需要 API Key 或使用示例 URL)
    const unsplashCollections = {
      backgrounds: [
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80', // 红酒杯
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80', // 葡萄园
        'https://images.unsplash.com/photo-1549804183-dc98c9a6a3b6?w=1200&q=80', // 红酒瓶
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80', // 酒庄
        'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=1200&q=80', // 葡萄
      ],
      elements: [
        // 可添加装饰元素 URL
      ],
    };

    const downloaded = [];
    
    for (const [category, urls] of Object.entries(unsplashCollections)) {
      for (const url of urls.slice(0, 3)) { // 限制下载数量
        try {
          const asset = await this.downloadAsset(url, category);
          downloaded.push(asset);
        } catch (err) {
          if (this.debug) {
            console.error(`Failed to download ${url}: ${err.message}`);
          }
        }
      }
    }

    return downloaded;
  }

  /**
   * 获取素材统计
   */
  getStats() {
    const stats = {};
    
    Object.keys(ASSET_STRUCTURE).forEach(category => {
      const assets = this.listAssets(category);
      stats[category] = {
        count: assets.length,
        files: assets.map(a => a.name),
      };
    });

    return stats;
  }

  /**
   * 创建素材库配置文件
   */
  createConfig() {
    const config = {
      version: '1.0.0',
      categories: ASSET_STRUCTURE,
      stats: this.getStats(),
      recommended: {
        backgrounds: [
          '红酒杯特写 - 高清产品图',
          '葡萄园风景 - 自然光拍摄',
          '酒庄内景 - 专业氛围',
          '红酒倒出瞬间 - 动态效果',
          '木质酒桶 - 传统工艺感',
        ],
        elements: [
          '金色边框装饰',
          '水滴/酒滴效果',
          '葡萄藤蔓',
          '品酒笔记图标',
          '评分星级',
        ],
        overlays: [
          '暗角纹理',
          '光斑效果',
          '渐变蒙版',
          '噪点纹理',
        ],
      },
    };

    const configPath = path.join(this.assetsDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    return config;
  }
}

module.exports = {
  AssetManager,
  ASSET_STRUCTURE,
};
