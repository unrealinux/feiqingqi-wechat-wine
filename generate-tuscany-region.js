/**
 * 托斯卡纳产区巡礼文章生成器
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fetch = require('node-fetch');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function generateCover() {
  console.log('🎨 生成托斯卡纳写实封面...');
  const apiKey = process.env.ZIMAGE_API_KEY;

  try {
    const submitResponse = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true'
      },
      body: JSON.stringify({
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: 'Beautiful Tuscany vineyard landscape, rolling hills with cypress trees, golden sunset light, Italian countryside villa, Sangiovese grapevines, professional landscape photography, warm Mediterranean light, high detail, 8k quality',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark, modern buildings, cars',
        steps: 15,
        width: 1280,
        height: 720
      })
    });

    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    console.log('   任务ID:', taskId);

    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'X-ModelScope-Task-Type': 'image_generation' }
      });
      const statusData = await statusResponse.json();

      if (statusData.task_status === 'SUCCEED') {
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          console.log('   ✅ AI图片生成成功');
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const rawImage = Buffer.from(imageBuffer);
          const croppedBuffer = await sharp(rawImage).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍷 托斯卡纳产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">超级托斯卡纳 · Chianti · Brunello</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
          const textBuffer = Buffer.from(svg);
          return sharp(croppedBuffer).composite([{ input: textBuffer, top: 0, left: 0 }]).png().toBuffer();
        }
      }
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) {
    console.warn('   ⚠️ AI封面生成失败');
  }

  console.log('   使用备用封面');
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 托斯卡纳产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">超级托斯卡纳 · Chianti · Brunello</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成托斯卡纳产区巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 托斯卡纳产区巡礼：探秘意大利葡萄酒的浪漫与传奇',
    author: '红酒顾问',
    digest: '托斯卡纳是意大利最著名的葡萄酒产区，以Chianti、Brunello di Montalcino和超级托斯卡纳闻名于世。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 产区巡礼系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">托斯卡纳（Tuscany）是意大利最浪漫的葡萄酒产区，以<strong style="color:#d4af37">Chianti</strong>、<strong style="color:#d4af37">Brunello di Montalcino</strong>和<strong style="color:#d4af37">超级托斯卡纳</strong>闻名于世。这里有连绵的山丘、古老的酒庄和世界级的美酒。</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌍 一、托斯卡纳在哪里</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">托斯卡纳位于意大利中部，佛罗伦萨是其首府。这里的气候是典型的地中海气候，夏季温暖干燥，冬季温和多雨，非常适合葡萄种植。连绵起伏的山丘和柏树点缀的风景，是托斯卡纳的标志性景观。</p>
<p style="color:#333;line-height:1.8"><strong>📍 地理位置：</strong>意大利中部，佛罗伦萨周边<br/><strong>🌡️ 气候类型：</strong>地中海气候<br/><strong>🍇 主要葡萄：</strong>桑娇维塞（Sangiovese）<br/><strong>📏 产区面积：</strong>约63,000公顷<br/><strong>🍷 年产量：</strong>约3亿瓶</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、托斯卡纳的灵魂：桑娇维塞</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🍇 桑娇维塞（Sangiovese）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">桑娇维塞是托斯卡纳的灵魂品种，占当地红酒产量的90%以上。它的名字来自拉丁语"Sanguis Jovis"，意为"朱庇特之血"。</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>典型风味：</strong>酸樱桃、李子、紫罗兰、烟草、泥土<br/><strong>特点：</strong>高酸度、中等单宁、中等酒体<br/><strong>陈年潜力：</strong>优质酒款可陈年20-30年</p>
<p style="color:#666;font-size:14px;line-height:1.8">💡 桑娇维塞的魅力在于它能完美表达风土。不同产区的桑娇维塞风格完全不同——Chianti清爽优雅，Brunello浓郁复杂。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 三、托斯卡纳主要产区</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏰 经典产区</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. Chianti Classico</strong><br/><span style="color:#666">• 位置：佛罗伦萨和锡耶纳之间</span><br/><span style="color:#666">• 葡萄：至少80%桑娇维塞</span><br/><span style="color:#666">• 风格：清爽酸度，红樱桃，中等酒体</span><br/><span style="color:#666">• 价格：100-500元</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. Brunello di Montalcino</strong><br/><span style="color:#666">• 位置：蒙塔奇诺镇</span><br/><span style="color:#666">• 葡萄：100%桑娇维塞（当地称Brunello）</span><br/><span style="color:#666">• 风格：浓郁复杂，陈年潜力30年+</span><br/><span style="color:#666">• 价格：300-5000元</span></p>
<p style="color:#333;line-height:1.8"><strong>3. Vino Nobile di Montepulciano</strong><br/><span style="color:#666">• 位置：蒙特普尔恰诺镇</span><br/><span style="color:#666">• 葡萄：至少70%桑娇维塞</span><br/><span style="color:#666">• 风格：比Chianti更浓郁</span><br/><span style="color:#666">• 价格：150-800元</span></p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">⭐ 超级托斯卡纳（Super Tuscan）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">超级托斯卡纳是20世纪70年代诞生的革命性概念。一些酿酒师不满足于传统Chianti的限制，开始使用国际品种（赤霞珠、梅洛等）酿造高品质葡萄酒。</p>
<p style="color:#333;line-height:1.8"><strong>代表酒款：</strong><br/>• <strong>Sassicaia</strong> - 第一款超级托斯卡纳，赤霞珠为主<br/>• <strong>Ornellaia</strong> - 波尔多风格混酿<br/>• <strong>Tignanello</strong> - Antinori家族的旗舰<br/>• <strong>Solaia</strong> - 赤霞珠为主，极其浓郁</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👑 四、顶级酒庄推荐</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍷 超级托斯卡纳名庄</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. Tenuta San Guido（Sassicaia）</strong><br/><span style="color:#666">• 地位：超级托斯卡纳的开创者</span><br/><span style="color:#666">• 酒款：Sassicaia（赤霞珠+品丽珠）</span><br/><span style="color:#666">• 价格：约2000-5000元</span><br/><span style="color:#666">• 评分：WA 97-99</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. Marchesi Antinori（Tignanello/Solaia）</strong><br/><span style="color:#666">• 地位：意大利最古老的葡萄酒家族</span><br/><span style="color:#666">• 酒款：Tignanello、Solaia</span><br/><span style="color:#666">• 价格：约1500-4000元</span><br/><span style="color:#666">• 评分：WA 96-98</span></p>
<p style="color:#333;line-height:1.8"><strong>3. Tenuta dell'Ornellaia（Ornellaia）</strong><br/><span style="color:#666">• 地位：波尔多风格的完美诠释</span><br/><span style="color:#666">• 酒款：Ornellaia（赤霞珠为主）</span><br/><span style="color:#666">• 价格：约1800-3500元</span><br/><span style="color:#666">• 评分：WA 96-98</span></p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍷 Brunello名庄</p>
<p style="color:#333;line-height:1.8"><strong>4. Biondi-Santi</strong><br/><span style="color:#666">• 地位：Brunello的发明者</span><br/><span style="color:#666">• 酒款：Brunello Riserva</span><br/><span style="color:#666">• 价格：约5000-20000元</span><br/><span style="color:#666">• 特点：极其传统，陈年潜力50年+</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💰 五、投资建议</h2>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;line-height:1.8">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• 超级托斯卡纳：</strong>Sassicaia、Ornellaia、Solaia<br/>
<span style="color:#666">国际认可度高，价格稳定上涨</span><br/><br/>
<strong>• Brunello Riserva：</strong>Biondi-Santi、Case Basse<br/>
<span style="color:#666">顶级稀缺，陈年潜力极强</span><br/><br/>
<strong>• Chianti Classico Gran Selezione：</strong><br/>
<span style="color:#666">新兴高端分级，性价比高</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 意大利酒国际认可度低于波尔多/勃艮第<br/>
• 需要通过正规渠道购买<br/>
• 陈年要求高，存储条件需恒温恒湿</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 六、配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 经典搭配</p>
<p style="color:#333;line-height:1.8"><strong>• Chianti Classico + 意大利面/披萨</strong><br/><span style="color:#666">清爽酸度完美搭配番茄酱</span><br/><br/><strong>• Brunello + 炖肉/牛排</strong><br/><span style="color:#666">浓郁酒体搭配红肉</span><br/><br/><strong>• Sassicaia + 高级牛排/野味</strong><br/><span style="color:#666">顶级酒款配顶级料理</span><br/><br/><strong>• 超级托斯卡纳 + 中式红烧肉</strong><br/><span style="color:#666">浓郁酒体与红烧肉完美搭配</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📅 七、经典年份推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">年份</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">评分</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">特点</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2021</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">Brunello伟大年份，WA 98分</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2019</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">超级托斯卡纳经典年份</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2016</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">完美平衡，投资首选</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2015</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">阳光充沛，果味浓郁</td>
</tr>
<tr>
<td style="padding:10px;color:#333">2010</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，适饮期</td>
</tr>
</table>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">托斯卡纳是意大利葡萄酒的浪漫殿堂。从入门的Chianti Classico，到收藏级的Sassicaia和Brunello Riserva，都有无尽的探索空间。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒产区</p>
</section>`
  };

  console.log('📝 标题:', article.title);
  console.log('📤 发布到微信...');

  const tokenResp = await axios.get(config.publish.endpoints.token, {
    params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
    timeout: 10000
  });
  const token = tokenResp.data.access_token;

  const formData = new FormData();
  formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const uploadResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`, formData, { headers: formData.getHeaders(), timeout: 30000 });
  const mediaId = uploadResp.data.media_id;

  const draftResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, { articles: [{ ...article, thumb_media_id: mediaId, need_open_comment: 0, only_fans_can_comment: 0 }] }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 发布成功！');
  console.log('草稿ID:', draftResp.data.media_id);
  console.log('='.repeat(60));
}

main();
