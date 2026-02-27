const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');
const { Redis, Logger } = require('./utils');
const { withRetry, createAppError, AppError, ErrorTypes } = require('./errors');
// CoverGenerator is loaded lazily in uploadThumb to avoid native binding errors

class WeChatPublisher {
  constructor() {
    this.redis = new Redis();
    this.logger = new Logger();
    this.accessToken = null;
    this.tokenExpireTime = 0;
    this.debug = process.env.DEBUG_PUBLISH === 'true';
  }

  /**
   * 验证发布配置
   */
  validateConfig() {
    const errors = [];
    
    if (!config.publish.appId) {
      errors.push('缺少 WECHAT_APPID 配置');
    }
    
    if (!config.publish.appSecret) {
      errors.push('缺少 WECHAT_SECRET 配置');
    }
    
    // 检查 AppID 格式 (应以 wx 开头)
    if (config.publish.appId && !config.publish.appId.startsWith('wx')) {
      errors.push('WECHAT_APPID 格式不正确，应以 "wx" 开头');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 发布文章
   */
  async publish(article) {
    console.log('开始发布到微信公众号...');
    const startTime = Date.now();

    // 验证配置
    const validation = this.validateConfig();
    if (!validation.valid) {
      console.error('❌ 发布配置错误:');
      validation.errors.forEach(err => console.error(`  - ${err}`));
      return {
        success: false,
        error: '配置错误',
        errors: validation.errors,
      };
    }

    // 输出配置信息（调试模式）
    if (this.debug) {
      console.log('📋 发布配置:');
      console.log(`  AppID: ${config.publish.appId}`);
      console.log(`  测试模式: ${config.publish.testMode ? '是' : '否'}`);
      console.log(`  自动发布: ${config.publish.autoPublish ? '是' : '否'}`);
    }

    try {
      // 1. 获取访问令牌
      console.log('📌 步骤 1/4: 获取 Access Token...');
      const token = await withRetry(
        () => this.getAccessToken(),
        { maxRetries: 2 }
      );
      console.log('  ✅ Access Token 获取成功');

      // 2. 上传封面图
      console.log('📌 步骤 2/4: 上传封面图...');
      const thumbUrl = article.thumbUrl || config.publish.defaultThumb;
      const thumbMediaId = await this.uploadThumb(thumbUrl);
      if (thumbMediaId) {
        console.log('  ✅ 封面图上传成功');
      } else {
        console.log('  ⚠️ 封面图上传失败，继续发布');
      }

      // 3. 创建草稿
      console.log('📌 步骤 3/4: 创建草稿...');
      const draftId = await withRetry(
        () => this.createDraft(token, article, thumbMediaId),
        { maxRetries: 2 }
      );
      console.log(`  ✅ 草稿创建成功 (ID: ${draftId})`);

      // 4. 发布文章（或仅创建草稿）
      let publishResult = null;
      if (config.publish.testMode) {
        console.log('📌 步骤 4/4: 测试模式 - 跳过发布');
        console.log('  ⚠️ 测试模式：草稿已创建但未发布');
        publishResult = { msg: '测试模式，草稿未发布', draftId };
      } else {
        console.log('📌 步骤 4/4: 发布文章...');
        publishResult = await withRetry(
          () => this.publishDraft(token, draftId),
          { maxRetries: 2 }
        );
        console.log('  ✅ 文章发布成功');
      }

      const duration = Date.now() - startTime;
      console.log(`\n🎉 发布流程完成，耗时 ${duration}ms`);

      return {
        success: true,
        draftId,
        publishResult,
        testMode: config.publish.testMode,
        url: publishResult?.data?.url || null,
        msgId: publishResult?.data?.msg_id || null,
      };
    } catch (error) {
      const appError = createAppError(error, { operation: 'publish' });
      console.error('❌ 发布失败:', appError.message);
      
      return {
        success: false,
        error: appError.message,
        type: appError.type,
      };
    }
  }

  /**
   * 获取 Access Token
   */
  async getAccessToken() {
    const now = Date.now();

    // 检查缓存的 token 是否有效
    if (this.accessToken && now < this.tokenExpireTime) {
      if (this.debug) {
        console.log('  使用缓存的 Access Token');
      }
      return this.accessToken;
    }

    const url = config.publish.endpoints.token;
    const params = {
      grant_type: 'client_credential',
      appid: config.publish.appId,
      secret: config.publish.appSecret,
    };

    if (this.debug) {
      console.log(`  请求 URL: ${url}`);
      console.log(`  AppID: ${params.appid}`);
    }

    const response = await axios.get(url, { 
      params,
      timeout: 10000,
    });

    if (response.data.errcode) {
      throw new AppError(
        `获取 access_token 失败: ${response.data.errmsg} (错误码: ${response.data.errcode})`,
        ErrorTypes.AUTH
      );
    }

    this.accessToken = response.data.access_token;
    // 提前 5 分钟刷新 token
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  /**
   * 上传封面图到微信素材库
   */
  async uploadThumb(thumbUrl) {
    try {
      const token = await this.getAccessToken();
      // 生成本地封面图 (900x383 红酒色)
      const imageBuffer = this.generateCoverImage();
      console.log('  使用本地生成的封面图');
      
      // 上传到微信素材库
      const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('media', imageBuffer, {
        filename: 'wine_cover.png',
        contentType: 'image/png',
      });
      const response = await axios.post(url, formData, {
        headers: { ...formData.getHeaders() },
        timeout: 30000,
      });
      if (response.data.errcode) {
        console.error(`  上传失败: ${response.data.errmsg} (错误码: ${response.data.errcode})`);
        return null;
      }
      
      console.log('  ✅ 封面图上传成功');
      return response.data.media_id;
    } catch (error) {
      console.error(`  上传封面图失败: ${error.message}`);
      return null;
    }
  }
  
  /**
   * 生成精美的红酒主题封面图 (900x383 PNG)
   * 包含渐变背景、酒杯、葡萄串、酒滴等红酒元素
   */
  generateCoverImage(title = '') {
    const zlib = require('zlib');
    const width = 900;
    const height = 383;
    // PNG 签名和 IHDR
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;  // bit depth
    ihdrData[9] = 2;  // color type (RGB)
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace
    const ihdr = this.createPngChunk('IHDR', ihdrData);
    const rawData = Buffer.alloc((width * 3 + 1) * height);
    const colors = {
      darkPurple: [45, 20, 54],
      wineRed: [128, 30, 50],
      deepRed: [80, 15, 35],
      burgundy: [128, 0, 32],
      grape: [102, 51, 102],
      gold: [212, 175, 55],
      cream: [255, 248, 231],
      glass: [200, 180, 190],
    };
    
    // ===== 辅助绘制函数 =====
    
    // 检查点是否在椭圆内
    const inEllipse = (px, py, cx, cy, rx, ry) => {
      return ((px - cx) ** 2) / (rx ** 2) + ((py - cy) ** 2) / (ry ** 2) <= 1;
    };
    
    // 检查点是否在圆内
    const inCircle = (px, py, cx, cy, r) => {
      return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2) <= r;
    };
    
    // 检查点是否在酒杯形状内 (返回 0-1 的强度值)
    const inWineGlass = (px, py) => {
      // 酒杯由三部分组成：杯口椭圆、杯身、杯茎、杯底
      const glassCenterX = 780;
      const glassTopY = 60;
      
      // 杯口区域 (宽椭圆)
      if (py >= glassTopY && py <= glassTopY + 40) {
        const bowlWidth = 70 - (py - glassTopY) * 0.8;
        const bowlCenterX = glassCenterX;
        if (Math.abs(px - bowlCenterX) <= bowlWidth) {
          return 0.15 + (py - glassTopY) / 200;
        }
      }
      
      // 杯身区域 (逐渐收窄)
      if (py >= glassTopY + 40 && py <= glassTopY + 140) {
        const progress = (py - glassTopY - 40) / 100;
        const bowlWidth = 62 - progress * 50;
        const bowlCenterX = glassCenterX;
        if (Math.abs(px - bowlCenterX) <= bowlWidth) {
          return 0.1 + progress * 0.1;
        }
      }
      
      // 杯茎区域 (细长)
      if (py >= glassTopY + 140 && py <= glassTopY + 220) {
        const stemWidth = 6;
        if (Math.abs(px - glassCenterX) <= stemWidth) {
          return 0.08;
        }
      }
      
      // 杯底区域 (小椭圆)
      if (py >= glassTopY + 220 && py <= glassTopY + 245) {
        const baseWidth = 35;
        if (Math.abs(px - glassCenterX) <= baseWidth) {
          return 0.12;
        }
      }
      
      return 0;
    };
    
    // 检查点是否在酒液区域内
    const inWineLiquid = (px, py) => {
      const glassCenterX = 780;
      const liquidTopY = 100;
      const liquidBottomY = 180;
      
      if (py >= liquidTopY && py <= liquidBottomY) {
        const progress = (py - liquidTopY) / (liquidBottomY - liquidTopY);
        const width = 60 - progress * 48;
        // 添加波动效果
        const wave = Math.sin((px / 20) + (py / 15)) * 3;
        if (Math.abs(px - glassCenterX) <= width + wave) {
          return true;
        }
      }
      return false;
    };
    
    // 检查点是否在葡萄串内
    const inGrapeCluster = (px, py) => {
      const clusterCenterX = 100;
      const clusterTopY = 80;
      
      // 葡萄由多个小圆组成
      const grapes = [
        // 顶部
        { x: clusterCenterX, y: clusterTopY + 20, r: 18 },
        { x: clusterCenterX - 20, y: clusterTopY + 25, r: 16 },
        { x: clusterCenterX + 18, y: clusterTopY + 22, r: 17 },
        // 中上部
        { x: clusterCenterX - 15, y: clusterTopY + 50, r: 18 },
        { x: clusterCenterX + 15, y: clusterTopY + 48, r: 17 },
        { x: clusterCenterX - 35, y: clusterTopY + 45, r: 15 },
        { x: clusterCenterX + 32, y: clusterTopY + 42, r: 16 },
        // 中部
        { x: clusterCenterX - 25, y: clusterTopY + 75, r: 17 },
        { x: clusterCenterX + 5, y: clusterTopY + 78, r: 18 },
        { x: clusterCenterX + 30, y: clusterTopY + 72, r: 15 },
        { x: clusterCenterX - 45, y: clusterTopY + 70, r: 14 },
        // 底部
        { x: clusterCenterX - 15, y: clusterTopY + 105, r: 16 },
        { x: clusterCenterX + 20, y: clusterTopY + 100, r: 15 },
        { x: clusterCenterX + 0, y: clusterTopY + 125, r: 14 },
        { x: clusterCenterX - 30, y: clusterTopY + 115, r: 13 },
      ];
      
      for (const grape of grapes) {
        if (inCircle(px, py, grape.x, grape.y, grape.r)) {
          return { inGrape: true, grape };
        }
      }
      return { inGrape: false };
    };
    
    // 检查点是否在葡萄叶内
    const inGrapeLeaf = (px, py) => {
      // 叶子1
      const leaf1 = { cx: 140, cy: 60, rx: 40, ry: 25, rotation: -0.3 };
      const dx1 = (px - leaf1.cx) * Math.cos(leaf1.rotation) + (py - leaf1.cy) * Math.sin(leaf1.rotation);
      const dy1 = -(px - leaf1.cx) * Math.sin(leaf1.rotation) + (py - leaf1.cy) * Math.cos(leaf1.rotation);
      if ((dx1 ** 2) / (leaf1.rx ** 2) + (dy1 ** 2) / (leaf1.ry ** 2) <= 1) {
        return true;
      }
      
      // 叶子2
      const leaf2 = { cx: 160, cy: 85, rx: 35, ry: 20, rotation: 0.5 };
      const dx2 = (px - leaf2.cx) * Math.cos(leaf2.rotation) + (py - leaf2.cy) * Math.sin(leaf2.rotation);
      const dy2 = -(px - leaf2.cx) * Math.sin(leaf2.rotation) + (py - leaf2.cy) * Math.cos(leaf2.rotation);
      if ((dx2 ** 2) / (leaf2.rx ** 2) + (dy2 ** 2) / (leaf2.ry ** 2) <= 1) {
        return true;
      }
      
      return false;
    };
    
    // 检查点是否在酒滴内
    const wineDrops = [
      { x: 650, y: 280, r: 12 },
      { x: 670, y: 310, r: 10 },
      { x: 640, y: 330, r: 8 },
      { x: 200, y: 300, r: 10 },
      { x: 220, y: 325, r: 8 },
    ];
    
    const inWineDrop = (px, py) => {
      for (const drop of wineDrops) {
        if (inCircle(px, py, drop.x, drop.y, drop.r)) {
          return true;
        }
      }
      return false;
    };
    
    // ===== 绘制每个像素 =====
    for (let y = 0; y < height; y++) {
      const rowStart = y * (width * 3 + 1);
      rawData[rowStart] = 0; // filter byte
      for (let x = 0; x < width; x++) {
        const pixelStart = rowStart + 1 + x * 3;
        const gradientRatio = x / width;
        const verticalRatio = y / height;
        // 从左到右：深紫 -> 酒红
        let r = Math.floor(colors.darkPurple[0] * (1 - gradientRatio) + colors.wineRed[0] * gradientRatio);
        let g = Math.floor(colors.darkPurple[1] * (1 - gradientRatio) + colors.wineRed[1] * gradientRatio);
        let b = Math.floor(colors.darkPurple[2] * (1 - gradientRatio) + colors.wineRed[2] * gradientRatio);
        // 垂直亮度变化
        const brightnessBoost = (1 - verticalRatio) * 25;
        r = Math.min(255, r + brightnessBoost);
        g = Math.min(255, g + brightnessBoost * 0.3);
        b = Math.min(255, b + brightnessBoost * 0.5);
        // ===== 绘制红酒元素 =====
        
        // 1. 酒杯轮廓
        const glassIntensity = inWineGlass(x, y);
        if (glassIntensity > 0) {
          const glassColor = colors.glass;
          r = Math.floor(r * (1 - glassIntensity) + glassColor[0] * glassIntensity);
          g = Math.floor(g * (1 - glassIntensity) + glassColor[1] * glassIntensity);
          b = Math.floor(b * (1 - glassIntensity) + glassColor[2] * glassIntensity);
        }
        
        // 2. 酒杯内的酒液
        if (inWineLiquid(x, y)) {
          // 酒液颜色，带有深度感
          const liquidColor = colors.burgundy;
          const depth = Math.random() * 0.2 + 0.8;
          r = Math.floor(liquidColor[0] * depth);
          g = Math.floor(liquidColor[1] * depth);
          b = Math.floor(liquidColor[2] * depth);
        }
        
        // 3. 葡萄串
        const grapeResult = inGrapeCluster(x, y);
        if (grapeResult.inGrape) {
          const grape = grapeResult.grape;
          const distFromCenter = Math.sqrt((x - grape.x) ** 2 + (y - grape.y) ** 2) / grape.r;
          // 葡萄渐变效果
          const grapeColor = colors.grape;
          const highlight = 1 - distFromCenter * 0.4;
          r = Math.floor(grapeColor[0] * highlight + 50 * (1 - highlight));
          g = Math.floor(grapeColor[1] * highlight + 20 * (1 - highlight));
          b = Math.floor(grapeColor[2] * highlight + 30 * (1 - highlight));
        }
        
        // 4. 葡萄叶
        if (inGrapeLeaf(x, y)) {
          r = 45; g = 80; b = 35;
        }
        
        // 5. 酒滴
        if (inWineDrop(x, y)) {
          r = colors.wineRed[0];
          g = colors.wineRed[1];
          b = colors.wineRed[2];
        }
        
        // 6. 添加细微噪点
        const noise = (Math.random() - 0.5) * 6;
        r = Math.max(0, Math.min(255, Math.floor(r + noise)));
        g = Math.max(0, Math.min(255, Math.floor(g + noise)));
        b = Math.max(0, Math.min(255, Math.floor(b + noise)));
        rawData[pixelStart] = r;
        rawData[pixelStart + 1] = g;
        rawData[pixelStart + 2] = b;
      }
    }
    const compressed = zlib.deflateSync(rawData, { level: 9 });
    const idat = this.createPngChunk('IDAT', compressed);
    const iend = this.createPngChunk('IEND', Buffer.alloc(0));
    
    return Buffer.concat([signature, ihdr, idat, iend]);
  }
  
  
  createPngChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = this.crc32(crcData);
    
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc >>> 0, 0);
    
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }
  
  
  
  
  
  
  crc32(data) {
    let crc = 0xFFFFFFFF;
    const table = this.getCrcTable();
    for (let i = 0; i < data.length; i++) {
      crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return crc ^ 0xFFFFFFFF;
  }
  getCrcTable() {
    if (this._crcTable) return this._crcTable;
    this._crcTable = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      this._crcTable[i] = c;
    }
    return this._crcTable;
  }

  /**
   * 创建草稿
   */
  async createDraft(token, article, thumbMediaId) {
    const url = `${config.publish.endpoints.draft}?access_token=${token}`;

    // 准备文章内容
    const articleContent = article.content || '';
    const articleDigest = (article.abstract || article.subtitle || articleContent).replace(/<[^>]*>/g, '').slice(0, 120);

    const payload = {
      articles: [
        {
          title: article.title,
          author: article.author || '红酒顾问',
          digest: articleDigest,
          content: articleContent,
          thumb_media_id: thumbMediaId || '',
          need_open_comment: 0,
          only_fans_can_comment: 0,
        },
      ],
    };

    if (this.debug) {
      console.log(`  文章标题: ${article.title}`);
      console.log(`  文章作者: ${payload.articles[0].author}`);
      console.log(`  内容长度: ${articleContent.length} 字符`);
    }

    const response = await axios.post(url, payload, {
      timeout: 30000,
    });

    if (response.data.errcode) {
      throw new AppError(
        `创建草稿失败: ${response.data.errmsg} (错误码: ${response.data.errcode})`,
        ErrorTypes.VALIDATION
      );
    }

    return response.data.media_id;
  }

  /**
   * 发布草稿
   */
  async publishDraft(token, mediaId) {
    const url = `${config.publish.endpoints.publish}?access_token=${token}`;

    const payload = {
      media_id: mediaId,
    };

    const response = await axios.post(url, payload, {
      timeout: 30000,
    });

    if (response.data.errcode && response.data.errcode !== 0) {
      // 常见错误码处理
      const errorMessages = {
        40001: 'AppSecret 错误或不属于该公众号',
        40002: '请确保 grant_type 为 client_credential',
        40013: 'AppID 无效',
        40163: '请先绑定开放平台帐号',
        45007: '需要图文消息的素材',
        40009: '图文消息素材为空',
        45026: '缺少图文消息描述',
        45027: '图文消息描述太长',
        45028: '图文消息内容为空',
        45029: '图文消息内容太长',
        45030: '图文消息标题为空',
        45031: '图文消息标题太长',
        45032: '图文消息链接为空',
        45033: '图文消息链接太长',
        45034: '图文消息作者为空',
        45035: '图文消息作者太长',
        40035: '不合法的参数',
        40037: '不合法的模板 ID',
        40039: '不合法的 URL',
        40165: '原文链接不合法',
        43004: '需要接收者关注服务号',
        43005: '需要接收者绑定服务号',
        43019: '需要将接收者从黑名单中移除',
        44001: '多媒体文件为空',
        44002: 'POST 的数据为空',
        44003: '图文消息内容为空',
        44004: '文本消息内容为空',
        45001: '多媒体文件大小超过限制',
        45002: '消息内容超过限制',
        45003: '标题字段超过限制',
        45004: '描述字段超过限制',
        45005: '链接字段超过限制',
        45006: '图片链接字段超过限制',
        45008: '图文消息超过限制',
        45009: '接口调用超过限制',
        45010: '创建菜单个数超过限制',
        45011: 'API 调用太频繁，请稍候再试',
        45017: '分组名字过长',
        45018: '分组数量超过上限',
        46001: '不存在媒体数据',
        46002: '不存在的菜单版本',
        46003: '不存在的菜单数据',
        46004: '不存在的用户',
        47001: '解析 JSON/XML 内容错误',
        48001: 'api 功能未授权',
        48002: '粉丝拒收消息',
        48003: '平台不支持该功能',
        48004: '不支持的授权类型',
        48005: 'API 禁止调用被声明为需要授权的接口',
        48006: 'API 禁止调用已过期的接口',
        50001: '用户未授权该 api',
        50002: '用户受限',
        50005: '用户未关注公众号',
        61004: 'access_token 过期',
        61006: 'IP 不在白名单中',
      };

      const errorMsg = errorMessages[response.data.errcode] || response.data.errmsg;
      throw new AppError(
        `发布失败: ${errorMsg} (错误码: ${response.data.errcode})`,
        ErrorTypes.VALIDATION
      );
    }

    return response.data;
  }

  /**
   * 获取发布状态
   */
  async getPublishStatus(token, publishId) {
    const url = `https://api.weixin.qq.com/cgi-bin/freepublish/get?access_token=${token}`;
    
    const response = await axios.post(url, { publish_id: publishId });
    return response.data;
  }

  /**
   * 获取文章列表
   */
  async getArticleList(offset = 0, count = 10) {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${token}`;

    const response = await axios.post(url, {
      offset,
      count,
      no_content: 0,
    });

    return response.data;
  }

  /**
   * 删除草稿
   */
  async deleteDraft(mediaId) {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=${token}`;

    const response = await axios.post(url, { media_id: mediaId });

    if (response.data.errcode && response.data.errcode !== 0) {
      throw new AppError(`删除失败: ${response.data.errmsg}`);
    }

    console.log('草稿删除成功');
    return true;
  }

  /**
   * 测试 API 连接
   */
  async testConnection() {
    console.log('\n🔍 测试微信公众号 API 连接...\n');

    // 验证配置
    const validation = this.validateConfig();
    if (!validation.valid) {
      console.log('❌ 配置验证失败:');
      validation.errors.forEach(err => console.log(`  - ${err}`));
      return { success: false, errors: validation.errors };
    }

    console.log('✅ 配置验证通过');
    console.log(`  AppID: ${config.publish.appId}`);

    try {
      // 测试获取 token
      console.log('\n测试获取 Access Token...');
      const token = await this.getAccessToken();
      console.log('✅ Access Token 获取成功');
      console.log(`  Token: ${token.slice(0, 20)}...`);

      // 测试获取文章列表
      console.log('\n测试获取文章列表...');
      const articles = await this.getArticleList(0, 5);
      console.log('✅ 文章列表获取成功');
      console.log(`  总数: ${articles.total_count || 0}`);
      console.log(`  返回: ${articles.item?.length || 0} 条`);

      return {
        success: true,
        token: token.slice(0, 20) + '...',
        articleCount: articles.total_count || 0,
      };
    } catch (error) {
      console.log('❌ 测试失败:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 生成文章链接
   */
  generateArticleUrl(biz, mid, idx) {
    const key = crypto.createHash('md5')
      .update(`${biz}|${mid}|${idx}|${process.env.WECHAT_KEY || 'key'}`, 'utf8')
      .digest('hex');
    
    return `https://mp.weixin.qq.com/s?__biz=${biz}&mid=${mid}&idx=${idx}&scene=0&sn=${key}`;
  }
}

module.exports = WeChatPublisher;
