/**
 * 使用写实封面重新发布波尔多文章
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const sharp = require('sharp');
const config = require('./config');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 重新发布波尔多文章（写实封面）');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');
  
  // 1. 检查写实封面是否存在
  const coverPath = path.join(__dirname, 'output', 'bordeaux_cover_realistic.png');
  if (!fs.existsSync(coverPath)) {
    console.log('❌ 写实封面不存在，请先运行 generate-bordeaux-cover.js');
    return;
  }
  
  const coverStats = fs.statSync(coverPath);
  console.log('✅ 使用写实封面:', path.basename(coverPath));
  console.log('   大小:', Math.round(coverStats.size / 1024), 'KB');
  console.log('');
  
  // 2. 准备文章
  const article = {
    title: `🍷 波尔多入门指南：从零开始了解世界最著名的葡萄酒产区`,
    author: '红酒顾问',
    digest: '波尔多是世界最著名的葡萄酒产区，本文将带你从零开始了解左岸vs右岸、五大名庄、主要葡萄品种等基础知识。',
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">更新日期：${today.toISOString().slice(0, 10)} | 红酒顾问 | 葡萄酒入门系列</p>
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
<span style="color: #666;">波尔多最重要的红葡萄品种，单宁强劲，陈年潜力佳。</span>
</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
<strong>2. 梅洛（Merlot）</strong><br/>
<span style="color: #666;">早熟品种，口感柔和，果香浓郁。</span>
</p>
<p style="color: #333; line-height: 1.8;">
<strong>3. 品丽珠（Cabernet Franc）</strong><br/>
<span style="color: #666;">提供优雅的花香和草本气息。</span>
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
<strong>特点：</strong>砾石土壤，排水性好，适合赤霞珠<br/>
<strong>风格：</strong>单宁强劲，结构感强，陈年潜力佳<br/>
<strong>主要产区：</strong>梅多克、格拉夫、佩萨克-雷奥良<br/>
<strong>代表酒庄：</strong>拉菲、拉图、玛歌、木桐、奥比昂
</p>
</section>

<section style="background: #fff3e0; padding: 18px; border-radius: 8px;">
<p style="color: #e65100; font-weight: bold; margin-bottom: 12px;">🏔️ 右岸（吉伦特河以东）</p>
<p style="color: #333; line-height: 1.8;">
<strong>特点：</strong>石灰岩和粘土土壤，适合梅洛<br/>
<strong>风格：</strong>口感柔和，果香浓郁<br/>
<strong>主要产区：</strong>圣埃美隆、波美侯<br/>
<strong>代表酒庄：</strong>白马、欧颂、柏图斯、里鹏
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">👑 1855年分级制度</h2>

<section style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); padding: 18px; border-radius: 8px; border-left: 3px solid #d4af37;">
<p style="color: #8b4513; line-height: 1.9; margin: 0;">
<strong>🏆 五大一级庄</strong><br/><br/>
<strong>1. 拉菲（Lafite Rothschild）</strong> - 波雅克，优雅复杂<br/>
<strong>2. 拉图（Latour）</strong> - 波雅克，强劲有力<br/>
<strong>3. 玛歌（Margaux）</strong> - 玛歌，优雅细腻<br/>
<strong>4. 木桐（Mouton Rothschild）</strong> - 波雅克，艺术酒标<br/>
<strong>5. 奥比昂（Haut-Brion）</strong> - 佩萨克，最早一级庄
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📅 经典年份推荐</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 2px solid #d4af37;">
<td style="padding: 10px; font-weight: bold; color: #2d1424;">年份</td>
<td style="padding: 10px; font-weight: bold; color: #2d1424;">评分</td>
<td style="padding: 10px; font-weight: bold; color: #2d1424;">说明</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2016</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">完美年份，投资首选</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2015</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">伟大年份，经典之作</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">2010</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">世纪年份，收藏级</td>
</tr>
<tr>
<td style="padding: 10px; color: #333;">2009</td>
<td style="padding: 10px; color: #c41e3a;">⭐⭐⭐⭐⭐</td>
<td style="padding: 10px; color: #666;">华丽年份，适饮期</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💡 入门建议</h2>

<section style="background: #f0fff0; padding: 18px; border-radius: 8px; border-left: 3px solid #28a745;">
<p style="color: #155724; margin: 0;">
<strong>🟢 新手推荐</strong><br/><br/>
<strong>性价比之选：</strong>中级庄（Cru Bourgeois），200-500元<br/>
<strong>进阶之选：</strong>超级二级庄，品质比肩一级庄<br/>
<strong>收藏之选：</strong>一级庄正牌，5000元+，陈年30年+
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
  
  // 3. 发布到微信
  console.log('📤 发布到微信...');
  
  class WeChatPublisher {
    constructor() {
      this.accessToken = null;
      this.tokenExpireTime = 0;
    }

    async getAcces
