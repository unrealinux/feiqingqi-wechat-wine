/**
 * 单独生成行业快讯
 */

// 设置环境
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;

const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const sharp = require('sharp');
const FormData = require('form-data');
const config = require('./config');

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
});

// 获取今日日期
const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

console.log('='.repeat(60));
console.log('📰 生成行业快讯');
console.log('日期:', date.display);
console.log('='.repeat(60));
console.log('');

// 从RSS获取最新新闻
async function fetchNews() {
  console.log('📰 获取最新资讯...');
  
  const sources = [
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/' },
    { name: 'VinePair', url: 'https://vinepair.com/feed/' },
  ];
  
  const allNews = [];
  
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 5);
      
      for (const item of items) {
        if (item.title) {
          allNews.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            source: source.name,
            snippet: item.contentSnippet?.slice(0, 200) || '',
          });
        }
      }
      
      console.log(`   ✅ ${source.name}: ${items.length} 条`);
    } catch (err) {
      console.warn(`   ⚠️ ${source.name}: ${err.message}`);
    }
  }
  
  allNews.sort((a, b) => b.pubDate - a.pubDate);
  console.log(`   总计: ${allNews.length} 条资讯\n`);
  return allNews;
}

// 生成HTML内容
function generateHTML(news) {
  const topNews = news.slice(0, 5);
  const headlines = topNews.map(n => n.title.slice(0, 25)).join('、');
  
  return `<section style="margin-bottom: 15px;">
<p style="color: #999; font-size: 12px; text-align: center;">${date.display} | 行业快讯 | 实时更新</p>
</section>

<section style="background: linear-gradient(135deg, #c41e3a 0%, #8b2252 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">🔥 今日热点</p>
${topNews.slice(0, 2).map(n => `<p style="color: #f5e6d3; font-size: 15px; line-height: 1.8; margin-bottom: 10px;">
<strong>${n.title}</strong><br/>
<span style="color: #ddd; font-size: 12px;">来源：${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
</p>`).join('\n')}
</section>

<section style="margin-bottom: 20px;">
<h2 style="color: #2d1424; font-size: 18px; border-left: 4px solid #c41e3a; padding-left: 10px; margin-bottom: 15px;">📊 最新资讯</h2>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px;">
${topNews.map(n => `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
<strong>• ${n.title}</strong><br/>
<span style="color: #999; font-size: 12px;">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
</p>`).join('\n')}
</section>
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
${[...new Set(topNews.map(n => n.source))].map(s => `• ${s}`).join('<br/>')}
</p>
</section>

<section style="text-align: center; padding: 15px;">
<p style="color: #999; font-size: 12px; margin: 0;">
免责声明：本快讯仅供参考，不构成投资建议<br/>
数据更新时间：${new Date().toISOString()}<br/>
发布日期：${date.display}
</p>
</section>`;
}

// 生成封面
async function generateCover() {
  console.log('🎨 生成封面...');
  
  const gradientSvg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#c41e3a"/>
        <stop offset="50%" style="stop-color:#8b2252"/>
        <stop offset="100%" style="stop-color:#4a1a2e"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#D4AF37"/>
        <stop offset="100%" style="stop-color:#F4E4BC"/>
      </linearGradient>
    </defs>
    <rect width="900" height="383" fill="url(#grad)"/>
    <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.6)"/>
    <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">📰 ${date.display} 行业快讯</text>
    <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">每日速递 | 实时更新</text>
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">实时更新</text>
  </svg>`;
  
  const buffer = await sharp(Buffer.from(gradientSvg)).png().toBuffer();
  console.log('   ✅ 封面已生成');
  return buffer;
}

// 微信发布
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
    await this.getAccessToken();
    const thumbMediaId = await this.uploadImage(coverBuffer);
    const draftId = await this.createDraft(article, thumbMediaId);
    return { success: true, draftId };
  }
}

// 主流程
async function main() {
  try {
    const news = await fetchNews();
    const coverBuffer = await generateCover();
    
    const headlines = news.slice(0, 3).map(n => n.title.slice(0, 25)).join('、');
    
    const article = {
      title: `📰 ${date.display} 行业快讯：${headlines.slice(0, 50)}...`,
      author: '资讯分析师',
      digest: `${date.display}最新葡萄酒行业资讯`,
      content: generateHTML(news),
    };
    
    console.log(`\n📝 标题: ${article.title}\n`);
    
    const publisher = new WeChatPublisher();
    const result = await publisher.publish(article, coverBuffer);
    
    con
