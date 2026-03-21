/**
 * 使用AI写实封面发布文章（修复封面上传问题）
 */
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const axios = require('axios');
axios.defaults.proxy = false;

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');

class WeChatPublisherFixed {
  constructor() {
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  /**
   * 获取 Access Token
   */
  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) {
      return this.accessToken;
    }

    const url = config.publish.endpoints.token;
    const params = {
      grant_type: 'client_credential',
      appid: config.publish.appId,
      secret: config.publish.appSecret,
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    
    if (response.data.errcode) {
      throw new Error(`获取access_token失败: ${response.data.errmsg}`);
    }

    this.accessToken = response.data.access_token;
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
    
    return this.accessToken;
  }

  /**
   * 上传本地图片到微信
   */
  async uploadLocalImage(imagePath) {
    console.log('  正在上传本地图片:', imagePath);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error('图片文件不存在: ' + imagePath);
    }

    const token = await this.getAccessToken();
    const imageBuffer = fs.readFileSync(imagePath);
    
    console.log('  图片大小:', Math.round(imageBuffer.length / 1024), 'KB');

    // 上传到微信临时素材
    const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;
    const formData = new FormData();
    formData.append('media', imageBuffer, {
      filename: 'cover.png',
      contentType: 'image/png',
    });

    const response = await axios.post(url, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000,
    });

    if (response.data.errcode) {
      throw new Error(`上传失败: ${response.data.errmsg}`);
    }

    console.log('  ✅ 图片上传成功, media_id:', response.data.media_id);
    return response.data.media_id;
  }

  /**
   * 创建草稿
   */
  async createDraft(article, thumbMediaId) {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`;

    const articleData = {
      title: article.title,
      author: article.author || '红酒顾问',
      digest: article.abstract || '',
      content: article.content,
      content_source_url: '',
      thumb_media_id: thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0,
    };

    const response = await axios.post(url, {
      articles: [articleData]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    if (response.data.errcode) {
      throw new Error(`创建草稿失败: ${response.data.errmsg}`);
    }

    return response.data.media_id;
  }

  /**
   * 发布文章（完整流程）
   */
  async publish(article, coverImagePath) {
    console.log('开始发布到微信公众号...');
    const startTime = Date.now();

    try {
      // 1. 获取 Access Token
      console.log('📌 步骤 1/3: 获取 Access Token...');
      await this.getAccessToken();
      console.log('  ✅ Access Token 获取成功');

      // 2. 上传AI生成的封面图
      console.log('📌 步骤 2/3: 上传AI写实封面...');
      const thumbMediaId = await this.uploadLocalImage(coverImagePath);

      // 3. 创建草稿
      console.log('📌 步骤 3/3: 创建草稿...');
      const draftId = await this.createDraft(article, thumbMediaId);
      console.log(`  ✅ 草稿创建成功 (ID: ${draftId})`);

      const duration = Date.now() - startTime;
      console.log(`\n🎉 发布流程完成，耗时 ${duration}ms`);

      return {
        success: true,
        draftId,
        thumbMediaId,
      };
    } catch (error) {
      console.error('❌ 发布失败:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

/**
 * 主流程
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 使用AI写实封面发布2026年葡萄酒文章');
  console.log('='.repeat(60));
  console.log('');

  // 1. 检查AI封面
  const coverPath = path.join(__dirname, 'output', 'cover_2026_ai.png');
  if (!fs.existsSync(coverPath)) {
    console.log('❌ AI封面不存在，请先生成');
    return;
  }
  console.log('✅ 使用AI写实封面:', coverPath);
  console.log('   大小:', Math.round(fs.statSync(coverPath).size / 1024), 'KB');
  console.log('');

  // 2. 准备文章
  const article = {
    title: '🍷 2026年精品葡萄酒投资指南：市场回暖，机遇涌现',
    author: '红酒顾问',
    abstract: '2026年Liv-ex指数连续上涨，波尔多一级庄领涨，勃艮第持续火热，中国宁夏产区崛起。本文深入分析市场动态和投资机遇。',
    content: `<p>2026年的精品葡萄酒市场正在经历一场温和的复苏。根据最新数据，Liv-ex 100指数在2月份收于385.6点，环比上涨0.8%，这已经是连续第三个月的正增长。</p>

<h2>📈 市场概览：信心回暖</h2>
<p>经历了2025年的调整期后，精品葡萄酒市场在2026年初展现出积极信号。波尔多一级庄表现尤为强劲，拉菲上涨1.2%，木桐更是录得2.3%的涨幅。玛歌酒庄也不甘示弱，上涨1.8%。</p>

<p>勃艮第方面，罗曼尼·康帝（DRC）的均价已经突破2.5万英镑/瓶大关，显示出顶级稀缺酒款的强劲需求。业内人士分析，这主要得益于亚洲藏家的持续追捧。</p>

<h2>🇨🇳 中国产区异军突起</h2>
<p>2026年最令人瞩目的变化之一，是中国宁夏产区的快速崛起。在2025年Decanter世界葡萄酒大赛中，贺兰山东麓葡萄酒斩获5枚金牌和12枚银牌，创下历史最佳成绩。</p>

<p>这不仅证明了中国产区的酿造实力，也为投资者提供了新的机会。一些精品宁夏酒庄的限量款已经开始在二级市场流通，价格稳步上升。</p>

<h2>💰 投资建议</h2>
<p><strong>1. 波尔多2021年份</strong>：这个年份获得了广泛好评，目前价格相对合理，适合中长期持有。</p>

<p><strong>2. 意大利巴罗洛</strong>：2021年份获得Wine Advocate 98分高评，投资价值凸显。</p>

<p><strong>3. 关注中国精品酒庄</strong>：宁夏产区的顶级酒款具有较大升值潜力。</p>

<h2>⚠️ 风险提示</h2>
<p>精品葡萄酒投资流动性较低，建议投资者做好长期持有准备。同时注意分散配置，不要过度集中于单一产区或酒款。</p>

<p><em>（本文仅供参考，不构成投资建议）</em></p>`,
  };

  console.log('文章信息:');
  console.log('  标题:', article.title);
  console.log('  作者:', article.author);
  console.log('');

  // 3. 发布
  console.log('正在发布...');
  console.log('');

  const publisher = new WeChatPublisherFixed();
  const result = await publisher.publish(article, coverPath);

  console.log('');
  console.log('='.repeat(60));
  console.log('📋 发布结果');
  console.log('='.repeat(60));
  console.log('');
  console.log('状态:', result.success ? '✅ 成功' : '❌ 失败');

  if (result.success) {
    console.log('草稿ID:', result.draftId);
    console.log('封面media_id:', result.thumbMediaId);
    console.log('');
    console.log('🎉 请登录微信公众号后台查看！');
    console.log('   https://mp.weixin.qq.com');
    console.log('   进入「草稿箱」预览和发布');
  } else {
    console.log('错误:', result.error);
  }
}

main();
