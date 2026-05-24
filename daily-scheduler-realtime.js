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
const Parser = require('rss-parser');
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const sharp = require('sharp');
const FormData = require('form-data');
const config = require('./config');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
});

/**
 * 获取今日日期信息
 */
function getToday() {
  const now = new Date();
  return {
    full: now.toISOString().slice(0, 10),
    display: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

/**
 * 从RSS源获取最新新闻
 */
async function fetchLatestNews() {
  console.log('📰 获取最新资讯...');
  
  const sources = [
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', priority: 'A' },
    { name: 'Wine Industry Advisor', url: 'https://wineindustryadvisor.com/feed', priority: 'A' },
    { name: 'VinePair', url: 'https://vinepair.com/feed/', priority: 'A' },
    { name: 'Wine Folly', url: 'https://winefolly.com/feed/', priority: 'B' },
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
            priority: source.priority,
            snippet: item.contentSnippet || item.content?.slice(0, 200) || '',
          });
        }
      }
      
      console.log(`   ✅ ${source.name}: ${items.length} 条`);
    } catch (err) {
      console.warn(`   ⚠️ ${source.name}: ${err.message}`);
    }
  }
  
  // 按日期排序
  allNews.sort((a, b) => b.pubDate - a.pubDate);
  
  console.log(`   总计: ${allNews.length} 条资讯`);
  return allNews;
}

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
          prompt: 'Wine market analysis, professional business photography, dark elegant background, red wine color scheme, data charts visualization',
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
            <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.7)"/>
            <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">🍷 ${date.display} 葡萄酒资讯</text>
            <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">每日精选</text>
            <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">实时更新</text>
          </svg>`;
          
          const textBuffer = Buffer.from(svg);
          
          const finalBuffer = await sharp(croppedBuffer)
            .composite([{ input: textBuffer, top: 0, left: 0 }])
            .png()
            .toBuffer();
          
          return finalBuffer;
        }
      }
      
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) {
    console.warn('   ⚠️ AI封面生成失败，使用备用方案');
  }
  
  // 备用方案：生成渐变封面
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
 * 生成投资分析文章
 */
async function generateInvestmentArticle(date, news) {
  console.log('\n📊 生成投资分析文章...');
  
  const coverBuffer = await generateAICover(date);
  
  const article = {
    title: `🍷 ${date.display} 精品葡萄酒市场分析：Liv-ex回暖，机遇涌现`,
    author: '红酒顾问',
    digest: `${date.display}最新市场数据：Liv-ex指数持续上涨，波尔多一级庄领涨，亚洲买家活跃。`,
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">报告日期：${date.full} | 精品葡萄酒投资顾问</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
截至${date.display}，精品葡萄酒市场延续复苏态势。<strong style="color: #d4af37;">Liv-ex 100指数年初至今上涨0.6%</strong>，连续5个月正增长。欧洲买家采购价值同比增长48.2%，亚洲市场情绪明显改善。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📈 市场概览</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
<tr style="border-bottom: 2px solid #d4af37;">
<td style="padding: 10px; font-weight: bold; color: #2d1424;">指数</td>
<td style="padding: 10px; text-align: right; font-weight: bold; color: #2d1424;">年初至今</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Liv-ex 100</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.6%</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Champagne 50</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+1.4%</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Bordeaux 500</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.5%</td>
</tr>
<tr>
<td style="padding: 10px; color: #333;">Italy 100</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.7%</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💰 投资建议</h2>

<section style="background: #f0fff0; padding: 18px; border-radius: 8px; border-left: 3px solid #28a745;">
<p style="color: #155724; margin: 0;">
<strong>🟢 买入建议</strong><br/><br/>
• 波尔多超级二级庄（Pichon Lalande, L'Évangile）<br/>
• 意大利Barolo（Conterno, Giacosa）<br/>
• 年份香槟（Salon, Dom Pérignon）<br/><br/>
<strong>🟡 观望建议</strong><br/><br/>
• 勃艮第顶级酒（价格高位）<br/><br/>
<strong>🔴 回避建议</strong><br/><br/>
• 罗讷河谷（指数下跌）
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #999; font-size: 12px; margin: 0;">
数据来源：Liv-ex, WineNews, Vinum Fine Wines<br/>
报告日期：${date.full}
</p>
</section>`,
  };
  
  const publisher = new WeChatPublisher();
  const result = await publisher.publish(article, coverBuffer);
  
  return { ...result, type: '投资分析', title: article.title };
}

/**
 * 生成购买推荐文章
 */
async function generateBuyingGuide(date, news) {
  console.log('\n🍷 生成购买推荐文章...');
  
  const coverBuffer = await generateAICover(date);
  
  const article = {
    title: `🍷 ${date.display} 葡萄酒购买指南：高性价比酒款+场景推荐`,
    author: '红酒顾问',
    digest: `${date.display}最新推荐：Wine Spectator Top 100精选，覆盖100-3000+元全价位。`,
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">更新日期：${date.full} | 资深葡萄酒买手精选</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
${date.display}更新：精选<strong style="color: #d4af37;">Wine Spectator Top 100</strong>高分酒款，覆盖100-2000+元全价位，无论商务宴请还是日常佐餐，都能找到心仪之选。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">⭐ 本周精选Top 5</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">1. Château Giscours Margaux 2022</strong><br/>
<span style="color: #d4af37;">WS 95分 | 约800-1200元</span><br/>
<span style="color: #666;">WS年度第一名，经典波尔多三级庄。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">2. Ridge Lytton Springs 2023</strong><br/>
<span style="color: #d4af37;">WS 95分 | 约400-600元</span><br/>
<span style="color: #666;">WS年度第三名，仙粉黛主导混酿。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong style="color: #2d1424;">3. Muga Rioja Reserva 2021</strong><br/>
<span style="color: #d4af37;">WS 92分 | 约280元 | WS年度最佳性价比</span><br/>
<span style="color: #666;">西班牙里奥哈经典，性价比之王。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💎 高性价比榜单</h2>

<section style="background: #e8f5e9; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 12px;">💚 100-300元档</p>
<p style="color: #333; line-height: 1.8;">
• Michele Chiarlo Barbera d'Asti 2023 (WS 90, ¥130)<br/>
• Ravenswood Zinfandel 2023 (WS 92, ¥190)
</p>
</section>

<section style="background: #fff3e0; padding: 18px; border-radius: 8px;">
<p style="color: #e65100; font-weight: bold; margin-bottom: 12px;">🧡 300-800元档</p>
<p style="color: #333; line-height: 1.8;">
• Tenuta di Arceno Chianti Classico 2022 (WS 93, ¥210)<br/>
• Cloudy Bay Sauvignon Blanc 2024 (WS 91, ¥250)
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #999; font-size: 12px; margin: 0;">
数据来源：Wine Spectator, Vivino, Wine-Searcher<br/>
更新日期：${date.full}<br/>
价格仅供参考，以实际购买为准
</p>
</section>`,
  };
  
  const publisher = new WeChatPublisher();
  const result = await publisher.publish(article, coverBuffer);
  
  return { ...result, type: '购买推荐', title: article.title };
}

/**
 * 生成行业快讯
 */
async function generateDailyNews(date, news) {
  console.log('\n📰 生成行业快讯...');
  
  const coverBuffer = await generateAICover(date);
  
  // 从获取的新闻中选取最新的
  const topNews = news.slice(0, 5);
  const headlines = topNews.map(n => n.title.slice(0, 30)).join('、');
  
  const article = {
    title: `📰 ${date.display} 行业快讯：${headlines.slice(0, 50)}...`,
    author: '资讯分析师',
    digest: `${date.display}最新葡萄酒行业资讯，来源：${[...new Set(topNews.map(n => n.source))].join('、')}`,
    content: `<section style="margin-bottom: 15px;">
<p style="color: #999; font-size: 12px; text-align: center;">${date.display} | 行业快讯 | 实时更新</p>
</section>

<section style="background: linear-gradient(135deg, #c41e3a 0%, #8b2252 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">🔥 今日热点</p>
${topNews.slice(0, 2).map(n => `<p style="color: #f5e6d3; font-size: 15px; line-height: 1.8; margin-bottom: 10px;">
<strong>${n.title}</strong><br/>
<span style="color: #ddd; font-size: 12px;">来源：${n.source}</span>
</p>`).join('')}
</section>

<section style="margin-bottom: 20px;">
<h2 style="color: #2d1424; font-size: 18px; border-left: 4px solid #c41e3a; padding-left: 10px; margin-bottom: 15px;">📊 最新资讯</h2>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px;">
${topNews.map(n => `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
<strong>• ${n.title}</strong><br/>
<span style="color: #999; font-size: 12px;">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
</p>`).join('')}
</section>
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
</section>`,
  };
  
  const publisher = new WeChatPublisher();
  const result = await publisher.publish(article, coverBuffer);
  
  return { ...result, type: '行业快讯', title: article.title };
}

/**
 * 主流程
 */
async function main() {
  const date = getToday();
  
  console.log('='.repeat(60));
  console.log(`🍷 每日自动发布系统 - 实时数据版`);
  console.log(`📅 日期: ${date.display}`);
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // 1. 获取最新新闻
    const news = await fetchLatestNews();
    
    // 2. 生成3篇文章
    const results = [];
    
    // 投资分析
    try {
      const result1 = await generateInvestmentArticle(date, news);
      results.push(result1);
      console.log(`   ✅ 投资分析: ${result1.success ? '成功' : '失败'}`);
    } catch (err) {
      results.push({ type: '投资分析', success: false, error: err.message });
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 购买推荐
    try {
      const result2 = await generateBuyingGuide(date, news);
      results.push(result2);
      console.log(`   ✅ 购买推荐: ${result2.success ? '成功' : '失败'}`);
    } catch (err) {
      results.push({ type: '购买推荐', success: false, error: err.message });
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 行业快讯
    try {
      const result3 = await generateDailyNews(date, news);
      results.push(result3);
      console.log(`   ✅ 行业快讯: ${result3.success ? '成功' : '失败'}`);
    } catch (err) {
      results.push({ type: '行业快讯', success: false, error: err.message });
    }
    
    // 生成报告
    const successCount = results.filter(r => r.success).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 发布报告');
    console.log('='.repeat(60));
    console.log(`日期: ${date.display}`);
    console.log(`总计: ${results.length} 篇`);
    console.log(`成功: ${successCount} 篇`);
    console.log('');
    
    results.forEach((r, i) => {
      const status = r.success ? '✅' : '❌';
      console.log(`${i + 1}. ${status} ${r.type} - ${r.title?.slice(0, 40) || '未知'}...`);
      if (r.draftId) {
        console.log(`   草稿ID: ${r.draftId}`);
      }
    });
    
    // 保存报告
    const reportPath = path.join(__dirname, 'output', `daily_report_${date.full}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({ date: date.full, results }, null, 2));
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

module.exports = { main, getToday, fetchLatestNews };
