/**
 * 波尔多入门介绍文章生成器
 */

// 设置环境
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const FormData = require('form-data');
const config = require('./config');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');

// 获取今日日期
const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

console.log('='.repeat(60));
console.log('🍷 生成波尔多入门介绍文章');
console.log('日期:', date.display);
console.log('='.repeat(60));
console.log('');

/**
 * 生成AI封面
 */
async function generateCover() {
  console.log('🎨 生成AI封面...');
  
  const apiKey = process.env.ZIMAGE_API_KEY;
  
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
          prompt: 'Beautiful Bordeaux vineyard landscape, golden sunset, rolling hills with grapevines, classic French chateau in background, professional landscape photography, warm colors, high detail, 8k quality',
          negative_prompt: 'blurry, low quality, cartoon, text, watermark, modern buildings',
          steps: 12,
          width: 1280,
          height: 720
        })
      }
    );
    
    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    console.log('   任务ID:', taskId);
    
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
          console.log('   ✅ AI图片生成成功');
          
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
            <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">🍷 波尔多入门指南</text>
            <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">左岸vs右岸 · 五大名庄 · 年份指南</text>
            <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
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
    console.warn('   ⚠️ AI封面生成失败');
  }
  
  // 备用渐变封面
  console.log('   使用备用封面');
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
    <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">🍷 波尔多入门指南</text>
    <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">左岸vs右岸 · 五大名庄 · 年份指南</text>
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
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
    await this.getAccessToken();
    const thumbMediaId = await this.uploadImage(coverBuffer);
    const draftId = await this.createDraft(article, thumbMediaId);
    return { success: true, draftId };
  }
}

/**
 * 主流程
 */
async function main() {
  // 1. 生成封面
  const coverBuffer = await generateCover();
  
  // 2. 准备文章
  const article = {
    title: `🍷 波尔多入门指南：从零开始了解世界最著名的葡萄酒产区`,
    author: '红酒顾问',
    digest: '波尔多是世界最著名的葡萄酒产区，本文将带你从零开始了解左岸vs右岸、五大名庄、主要葡萄品种等基础知识。',
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">更新日期：${date.full} | 红酒顾问 | 葡萄酒入门系列</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
波尔多（Bordeaux）是法国西南部的一个重要港口城市，也是世界最著名的葡萄酒产区。这里有超过<strong style="color: #d4af37;">7,000个酒庄</strong>，年产量约<strong style="color: #d4af37;">6亿瓶</strong>，是全球精品葡萄酒的标杆。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🌍 波尔多在哪里？</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
波尔多位于法国西南部，靠近大西洋。这里受墨西哥暖流影响，气候温和湿润，非常适合葡萄种植。
</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
<strong>地理位置：</strong>法国阿基坦大区吉伦特省<br/>
<strong>气候：</strong>温带海洋性气候<br/>
<strong>土壤：</strong>砾石、石灰岩、粘土等多种类型<br/>
<strong>产区面积：</strong>约11万公顷
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🍇 主要葡萄品种</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">红酒品种（左岸为主）</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
<strong>1. 赤霞珠（Cabernet Sauvignon）</strong><br/>
<span style="color: #666;">波尔多最重要的红葡萄品种，单宁强劲，陈年潜力佳。主要种植在左岸的砾石土壤上。</span>
</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
<strong>2. 梅洛（Merlot）</strong><br/>
<span style="color: #666;">早熟品种，口感柔和，果香浓郁。主要种植在右岸的粘土石灰岩土壤上。</span>
</p>
<p style="color: #333; line-height: 1.8;">
<strong>3. 品丽珠（Cabernet Franc）</strong><br/>
<span style="color: #666;">提供优雅的花香和草本气息，常用于混酿。</span>
</p>
</section>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px; margin-top: 12px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">白酒品种</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
<strong>1. 长相思（Sauvignon Blanc）</strong><br/>
<span style="color: #666;">清新酸爽，带有柑橘和草本香气。</span>
</p>
<p style="color: #333; line-height: 1.8;">
<strong>2. 赛美蓉（Sémillon）</strong><br/>
<span style="color: #666;">口感饱满，适合酿造贵腐甜酒。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📍 左岸vs右岸</h2>

<section style="background: #e8f5e9; padding: 18px; border-radius: 8px; margin-bottom: 12px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 12px;">🌊 左岸（吉伦特河以南）</p>
<p style="color: #333; line-height: 1.8;">
<strong>特点：</strong>砾石土壤，排水性好，适合晚熟的赤霞珠<br/>
<strong>风格：</strong>单宁强劲，结构感强，陈年潜力佳<br/>
<strong>主要产区：</strong>梅多克（Médoc）、格拉夫（Graves）、佩萨克-雷奥良（Pessac-Léognan）<br/>
<strong>代表酒庄：</strong>拉菲、拉图、玛歌、木桐、奥比昂
</p>
</section>

<section style="background: #fff3e0; padding: 18px; border-radius: 8px;">
<p style="color: #e65100; font-weight: bold; margin-bottom: 12px;">🏔️ 右岸（吉伦特河以东）</p>
<p style="color: #333; line-height: 1.8;">
<strong>特点：</strong>石灰岩和粘土土壤，适合早熟的梅洛<br/>
<strong>风格：</strong>口感柔和，果香浓郁，更适合年轻时饮用<br/>
<strong>主要产区：</strong>圣埃美隆（Saint-Émilion）、波美侯（Pomerol）<br/>
<strong>代表酒庄：</strong>白马、欧颂、柏图斯、里鹏
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">👑 1855年分级制度</h2>

<section style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); padding: 18px; border-radius: 8px; border-left: 3px solid #d4af37;">
<p style="color: #8b4513; line-height: 1.9; margin: 0;">
<strong>🏆 五大一级庄（Premier Grand Cru Classé）</strong><br/><br/>
<strong>1. 拉菲（Château Lafite Rothschild）</strong><br/>
<span style="color: #666;">波雅克产区，优雅复杂，被誉为"酒王之王"</span><br/><br/>
<strong>2. 拉图（Château Latour）</strong><br/>
<span style="color: #666;">波雅克产区，强劲有力，结构宏大</span><br/><br/>
<strong>3. 玛歌（Château Margaux）</strong><br/>
<span style="color: #666;">玛歌产区，优雅细腻，花香迷人</span><br/><br/>
<strong>4. 木桐（Château Mouton Rothschild）</strong><br/>
<span style="color: #666;">波雅克产区，每年更换艺术酒标</span><br/><br/>
<strong>5. 奥比昂（Château Haut-Brion）</strong><br/>
<span style="color: #666;">佩萨克-雷奥良产区，最早的一级庄</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📅 经典年份推荐</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 2px solid #d4af37;">
<td style="padding: 10px; font-weight: bold; color: #2d1424;">年份</td>
<td style="padding: 10px; font-weight: bold; color: #2d1424;">评价</td>
<td style="padding: 10px; font-weight: bold; color: #2d1424;">适合</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2016</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">投资、收藏</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2015</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">投资、收藏</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2010</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">顶级年份</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2009</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">顶级年份</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2005</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">经典年份</td>
</tr>
<tr>
<td style="padding: 10px; color: #333;">2000</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">适饮期</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💡 入门建议</h2>

<section style="background: #f0fff0; padding: 18px; border-radius: 8px; border-left: 3px solid #28a745;">
<p style="color: #155724; margin: 0;">
<strong>🟢 新手入门推荐</strong><br/><br/>
<strong>1. 性价比之选</strong><br/>
<span style="color: #666;">中级庄（Cru Bourgeois）酒款，价格200-500元，品质稳定</span><br/><br/>
<strong>2. 进阶之选</strong><br/>
<span style="color: #666;">超级二级庄（如Pichon Lalande），品质比肩一级庄</span><br/><br/>
<strong>3. 收藏之选</strong><br/>
<span style="color: #666;">一级庄正牌，价格5000元+，陈年潜力30年+</span>
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #d4af37; font-size: 14px; font-weight: bold; margin-bottom: 8px;">🍷 结语</p>
<p style="color: #f5e6d3; font-size: 14px; line-height: 1.8; margin: 0;">
波尔多是葡萄酒世界的殿堂级产区，<br/>
从入门到精通，每一瓶都有故事值得品味。<br/>
欢迎在评论区分享你的波尔多体验！
</p>
<p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
发布日期：${date.display}
</p>
</section>`
  };
  
  console.log('📝 标题:', article.title);
  console.log('');
  
  // 3. 发布
  const publisher = new WeChatPublisher();
  const result = await publisher.publish(article, coverBuffer);
  
  console.log('');
  console.log('='.repeat(60));
  if (result.success) {
    console.log('✅ 发布成功！');
    console.log('草稿ID:', result.draftId);
  } else {
    console.log('❌ 失败:', result.error);
  }
  console.log('='.repeat(60));
}

main();
