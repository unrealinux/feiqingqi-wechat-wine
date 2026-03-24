/**
 * 行业快讯 - 实时数据版
 * 从实际信息源获取最新数据
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
axios.defaults.proxy = false;
const FormData = require('form-data');
const config = require('./config');
const Parser = require('rss-parser');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
});

/**
 * 获取今日日期
 */
function getTodayDate() {
  const now = new Date();
  return {
    full: now.toISOString().slice(0, 10),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    display: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
  };
}

/**
 * 从RSS源获取最新文章
 */
async function fetchLatestNews() {
  console.log('📰 正在获取最新资讯...');
  
  const sources = [
    { name: 'Decanter', url: 'https://www.decanter.com/wine-news/feed', priority: 'S' },
    { name: 'Wine-Searcher', url: 'https://www.wine-searcher.com/news/rss', priority: 'S' },
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', priority: 'A' },
    { name: 'WineNews', url: 'https://winenews.it/en/feed/', priority: 'A' },
    { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', priority: 'S' },
  ];
  
  const allNews = [];
  
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 5);
      
      for (const item of items) {
        if (item.title && item.pubDate) {
          const pubDate = new Date(item.pubDate);
          const daysDiff = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
          
          // 只保留最近3天的新闻
          if (daysDiff <= 3) {
            allNews.push({
              title: item.title,
              link: item.link,
              pubDate: pubDate,
              source: source.name,
              priority: source.priority,
              snippet: item.contentSnippet || item.content?.slice(0, 200) || '',
            });
          }
        }
      }
      
      console.log(`   ✅ ${source.name}: ${items.length} 条`);
    } catch (err) {
      console.warn(`   ⚠️ ${source.name}: ${err.message}`);
    }
  }
  
  // 按优先级和日期排序
  allNews.sort((a, b) => {
    const pOrder = { S: 0, A: 1, B: 2 };
    const pA = pOrder[a.priority] || 3;
    const pB = pOrder[b.priority] || 3;
    if (pA !== pB) return pA - pB;
    return b.pubDate - a.pubDate;
  });
  
  console.log(`\n   总计获取 ${allNews.length} 条最新资讯`);
  return allNews;
}

/**
 * 分析新闻内容生成摘要
 */
function analyzeNews(news) {
  const categories = {
    price: [],      // 价格异动
    policy: [],     // 政策产区
    company: [],    // 企业事件
    market: [],     // 市场动态
  };
  
  for (const item of news) {
    const title = item.title.toLowerCase();
    
    if (title.includes('price') || title.includes('index') || title.includes('liv-ex') || 
        title.includes('bordeaux') || title.includes('burgundy') || title.includes('价格')) {
      categories.price.push(item);
    } else if (title.includes('tariff') || title.includes('policy') || title.includes('eu') || 
               title.includes('regulation') || title.includes('政策')) {
      categories.policy.push(item);
    } else if (title.includes('acquisition') || title.includes('merger') || title.includes('company') ||
               title.includes('winery') || title.includes('酒庄') || title.includes('收购')) {
      categories.company.push(item);
    } else {
      categories.market.push(item);
    }
  }
  
  return categories;
}

/**
 * 生成HTML内容
 */
function generateHTML(news, date) {
  const categories = analyzeNews(news);
  
  // 选择今日热点（S级优先）
  const hotNews = news.filter(n => n.priority === 'S').slice(0, 2);
  const mainHot = hotNews[0] || news[0];
  
  // 构建HTML
  let html = `<section style="margin-bottom: 15px;">
<p style="color: #999; font-size: 12px; text-align: center;">${date.display} | 行业快讯 | 来源：Decanter, Wine-Searcher, Liv-ex, WineNews</p>
</section>

<section style="background: linear-gradient(135deg, #c41e3a 0%, #8b2252 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">🔥 今日热点</p>
<p style="color: #f5e6d3; font-size: 15px; line-height: 1.8; margin: 0;">
<strong>${escapeHtml(mainHot.title)}</strong>
</p>
<p style="color: #ddd; font-size: 12px; margin-top: 8px; margin-bottom: 0;">来源：${mainHot.source} | ${mainHot.pubDate.toISOString().slice(0, 10)}</p>
</section>

<section style="margin-bottom: 20px;">
<h2 style="color: #2d1424; font-size: 18px; border-left: 4px solid #c41e3a; padding-left: 10px; margin-bottom: 15px;">📊 最新资讯</h2>`;

  // 按分类展示
  const sections = [
    { key: 'price', title: '💰 价格动态', color: '#8b2252' },
    { key: 'policy', title: '🏛️ 政策产区', color: '#8b2252' },
    { key: 'company', title: '🍷 企业事件', color: '#8b2252' },
    { key: 'market', title: '📈 市场动态', color: '#8b2252' },
  ];
  
  for (const section of sections) {
    const items = categories[section.key].slice(0, 3);
    if (items.length > 0) {
      html += `
<section style="background: #faf8f5; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
<p style="color: ${section.color}; font-weight: bold; margin-bottom: 10px;">${section.title}</p>`;
      
      for (const item of items) {
        html += `
<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• ${escapeHtml(item.title.slice(0, 100))}</strong><br/>
<span style="color: #999; font-size: 12px;">来源：${item.source} | ${item.pubDate.toISOString().slice(0, 10)}</span>
</p>`;
      }
      
      html += `\n</section>`;
    }
  }

  html += `
</section>

<section style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">📌 明日关注</p>
<p style="color: #333; font-size: 14px; line-height: 1.7;">
• 持续关注Liv-ex指数变化<br/>
• 关注拍卖行最新成交数据<br/>
• 留意产区天气和采收进展
</p>
</section>

<section style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #666; font-size: 12px; margin: 0;">
<strong>🔗 信息来源</strong><br/>
Decanter, Wine-Searcher, The Drinks Business, WineNews, 红酒世界('<br/>')}
</p>
</section>

<section style="text-align: center; padding: 15px;">
<p style="color: #999; font-size: 12px; margin: 0;">
免责声明：本快讯仅供参考，不构成投资建议<br/>
数据更新时间：${new Date().toISOString()}<br/>
发布日期：${date.display}
</p>
</section>`;

  return html;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 生成AI封面
 */
async function generateAICover(date) {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('🎨 生成AI封面...');
  
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
        prompt: 'Breaking news headline concept, wine market data charts and graphs, newspaper front page style, professional business photography, dark background with red wine color accents, market ticker tape, financial data visualization',
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
        
        const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#D4AF37"/>
              <stop offset="100%" style="stop-color:#F4E4BC"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.3)"/>
          <rect x="0" y="280" width="900" height="103" fill="rgba(0,0,0,0.75)"/>
          <text x="30" y="325" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">📰 ${date.display} 行业快讯</text>
          <text x="30" y="365" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">每日速递</text>
          <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">实时更新</text>
        </svg>`;
        
        const textBuffer = Buffer.from(svg);
        
        const finalBuffer = await sharp(croppedBuffer)
          .composite([{ input: textBuffer, top: 0, left: 0 }])
          .png()
          .toBuffer();
        
        const outputPath = path.join(__dirname, 'output', 'cover_daily_news.png');
        fs.writeFileSync(outputPath, finalBuffer);
        console.log('   ✅ 封面已生成');
        
        return outputPath;
      }
    }
    
    if (statusData.task_status === 'FAILED') throw new Error('生成失败');
  }
  
  throw new Error('超时');
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

  async uploadImage(imagePath) {
    const token = await this.getAccessToken();
    const imageBuffer = fs.readFileSync(imagePath);
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

  async publish(article, coverPath) {
    console.log('\n📤 发布到微信...');
    try {
      await this.getAccessToken();
      const thumbMediaId = await this.uploadImage(coverPath);
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
  console.log(`📰 生成今日行业快讯 (${date.display})`);
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // 1. 获取最新新闻
    const news = await fetchLatestNews();
    
    if (news.length === 0) {
      console.log('⚠️ 未获取到最新新闻');
      return;
    }
    
    // 2. 生成AI封面
    const coverPath = await generateAICover(date);
    
    // 3. 生成HTML内容
    const htmlContent = generateHTML(news, date);
    
    // 4. 构建文章
    const topNews = news.slice(0, 3);
    const article = {
      title: `📰 ${date.display} 行业快讯：${topNews.map(n => n.title.slice(0, 20)).join('、')}`,
      author: '资讯分析师',
      digest: `今日最新葡萄酒行业资讯，来源：${[...new Set(news.map(n => n.source))].join('、')}`,
      content: htmlContent,
    };
    
    console.log(`\n📝 标题: ${article.title}`);
    
    // 5. 发布
    const publisher = new WeChatPublisher();
    const result = await publisher.publish(article, coverPath);
    
    console.log('\n' + '='.repeat(60));
    if (result.success) {
      console.log('✅ 发布成功！');
      console.log('草稿ID:', result.draftId);
    } else {
      console.log('❌ 失败:', result.error);
    }
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
  }
}

main();
