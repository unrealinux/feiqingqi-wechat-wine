/**
 * 每日调度器 - 实时数据版
 * 每天自动获取最新数据并生成3篇文章
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
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const sharp = require('sharp');
const FormData = require('form-data');
const config = require('./config');

const { 
  fetchLatestNews, 
  generateInvestmentArticle, 
  generateBuyingGuide, 
  generateDailyNews,
  getTodayDate 
} = require('./data-fetcher');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');

/**
 * 生成AI封面
 */
async function generateAICover(date) {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('🎨 生成AI封面...');
  
  try {
    const submitResponse = await fetch(
      'https://api-inference.modelscope.cn/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-ModelScope-Async-Mode': 'true'
        },
        body: JSON.stringify({
          model: 'Tongyi-MAI/Z-Image-Turbo',
          prompt: 'Wine market analysis, professional business photography, dark elegant background, red wine color scheme',
          negative_prompt: 'blurry, low quality, cartoon, text, watermark',
          steps: 10,
          width: 1280,
          height: 720
        })
      }
    );
    
    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(
        `https://api-inference.modelscope.cn/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-ModelScope-Task-Type': 'image_generation'
          }
        }
      );
      
      const statusData = await statusResponse.json();
      
      if (statusData.task_status === 'SUCCEED') {
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const rawImage = Buffer.from(imageBuffer);
          
          const croppedBuffer = await sharp(rawImage)
            .resize(900, 383, { fit: 'cover', position: 'center' })
            .png()
            .toBuffer();
          
          return croppedBuffer;
        }
      }
      
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) {
    console.warn('   ⚠️ AI封面生成失败');
  }
  
  // 备用渐变封面
  const gradientSvg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a0a10"/>
        <stop offset="50%" style="stop-color:#2d1424"/>
        <stop offset="100%" style="stop-color:#4a1a2e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#D4AF37"/>
        <stop offset="100%" style="stop-color:#F4E4BC"/>
      </linearGradient>
    </defs>
    <rect width="900" height="383" fill="url(#grad)"/>
    <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.6)"/>
    <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">🍷 ${date.display} 葡萄酒资讯</text>
    <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">每日精选</text>
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">实时更新</text>
  </svg>`;
  
  return sharp(Buffer.from(gradientSvg)).png().toBuffer();
}

/**
 * 添加文字到封面
 */
async function addTextToCover(coverBuffer, title, subtitle) {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#D4AF37"/>
        <stop offset="100%" style="stop-color:#F4E4BC"/>
      </linearGradient>
    </defs>
    <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.7)"/>
    <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="28" font-weight="bold" fill="url(#textGrad)">${title}</text>
    <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">${subtitle}</text>
  </svg>`;
  
  const textBuffer = Buffer.from(svg);
  
  return sharp(coverBuffer)
    .composite([{ input: textBuffer, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

/**
 * 微信发布类
 */
class WeChatPublisher {
  constructor() {
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) return this.accessToken;
    const response = await axios.get(config.publish.endpoints.token, {
      params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
      timeout: 10000
    });
    if (response.data.errcode) throw new Error(response.data.errmsg);
    this.accessToken = response.data.access_token;
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
    return this.accessToken;
  }

  async uploadImage(imageBuffer) {
    const token = await this.getAccessToken();
    const formData = new FormData();
    formData.append('media', imageBuffer, { filename: 'cover.png', contentType: 'image/png' });
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
      formData, { headers: formData.getHeaders(), timeout: 30000 }
    );
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }

  async createDraft(article, thumbMediaId) {
    const token = await this.getAccessToken();
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
      { articles: [{ ...article, thumb_media_id: thumbMediaId, need_open_comment: 0, only_fans_can_comment: 0 }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }

  async publish(article, coverBuffer) {
    console.log('📤 发布到微信...');
    try {
      await this.getAccessToken();
      const thumbMediaId = await this.uploadImage(coverBuffer);
      const draftId = await this.createDraft(article, thumbMediaId);
      return { success: true, draftId };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

/**
 * 主流程
 */
async function main() {
  const date = getTodayDate();
  
  console.log('='.repeat(60));
  console.log(`🍷 每日自动发布系统 - 实时数据版`);
  console.log(`📅 日期: ${date.display}`);
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // 1. 获取最新新闻
    console.log('📰 正在获取最新数据...');
    const news = await fetchLatestNews(3); // 获取最近3天的新闻
    
    if (news.length === 0) {
      console.log('⚠️ 未获取到最新新闻，使用备用数据');
    } else {
      console.log(`✅ 获取到 ${news.length} 条最新资讯\n`);
    }
    
    // 2. 生成文章内容（使用实时数据）
    console.log('📝 生成文章内容...');
    const investmentArticle = generateInvestmentArticle(news, date);
    const buyingGuideArticle = generateBuyingGuide(news, date);
    const dailyNewsArticle = generateDailyNews(news, date);
    
    // 3. 发布文章
    const publisher = new WeChatPublisher();
    const results = [];
    
    // 投资分析
    console.log('\n📊 发布投资分析...');
    try {
      const coverBuffer = await generateAICover(date);
      const finalCover = await addTextToCover(coverBuffer, '🍷 市场分析', date.display);
      const result = await publisher.publish(investmentArticle, finalCover);
      results.push({ ...result, type: '投资分析', title: investmentArticle.title });
      console.log(`   ✅ 投资分析: ${result.success ? '成功' : '失败'}`);
      if (result.draftId) console.log(`   草稿ID: ${result.draftId}`);
    } catch (err) {
      results.push({ type: '投资分析', success: false, error: err.message });
      console.log(`   ❌ 投资分析: ${err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 购买推荐
    console.log('\n🍷 发布购买推荐...');
    try {
      const coverBuffer = await generateAICover(date);
      const finalCover = await addTextToCover(coverBuffer, '🍷 购买指南', date.display);
      const result = await publisher.publish(buyingGuideArticle, finalCover);
      results.push({ ...result, type: '购买推荐', title: buyingGuideArticle.title });
      console.log(`   ✅ 购买推荐: ${result.success ? '成功' : '失败'}`);
      if (result.draftId) console.log(`   草稿ID: ${result.draftId}`);
    } catch (err) {
      results.push({ type: '购买推荐', success: false, error: err.message });
      console.log(`   ❌ 购买推荐: ${err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 行业快讯
    console.log('\n📰 发布行业快讯...');
    try {
      const coverBuffer = await generateAICover(date);
      const finalCover = await addTextToCover(coverBuffer, '📰 行业快讯', date.display);
      const result = await publisher.publish(dailyNewsArticle, finalCover);
      results.push({ ...result, type: '行业快讯', title: dailyNewsArticle.title });
      console.log(`   ✅ 行业快讯: ${result.success ? '成功' : '失败'}`);
      if (result.draftId) console.log(`   草稿ID: ${result.draftId}`);
    } catch (err) {
      results.push({ type: '行业快讯', success: false, error: err.message });
      console.log(`   ❌ 行业快讯: ${err.message}`);
    }
    
    // 生成报告
    const successCount = results.filter(r => r.success).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 发布报告');
    console.log('='.repeat(60));
    console.log(`日期: ${date.display}`);
    console.log(`数据来源: ${news.length} 条最新资讯`);
    console.log(`总计: ${results.length} 篇`);
    console.log(`成功: ${successCount} 篇`);
    console.log('');
    
    results.forEach((r, i) => {
      const status = r.success ? '✅' : '❌';
      console.log(`${i + 1}. ${status} ${r.type}`);
      if (r.title) console.log(`   ${r.title.slice(0, 60)}...`);
      if (r.draftId) console.log(`   草稿ID: ${r.draftId}`);
    });
    
    // 保存报告
    const reportPath = path.join(__dirname, 'output', `daily_report_${date.full}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({ 
      date: date.full, 
      newsCount: news.length,
      results 
    }, null, 2));
    console.log(`\n📁 报告已保存: ${reportPath}`);
    
    return results;
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
    throw err;
  }
}

// 如果直接运行
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ 任务完成');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ 任务失败:', err);
      process.exit(1);
    });
}

module.exports = { main };
