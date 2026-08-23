/**
 * 香槟产区巡礼文章生成器
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
  console.log('🎨 生成香槟产区写实封面...');
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
        prompt: 'Luxury Champagne celebration, crystal glasses with golden sparkling wine, elegant bubbles rising, dark elegant background, professional product photography, warm lighting, festive atmosphere, high detail, 8k quality',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍾 香槟产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">庆典之酒 · 传统法 · 顶级品牌</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a0a"/><stop offset="50%" style="stop-color:#2d2d14"/><stop offset="100%" style="stop-color:#4a4a1a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍾 香槟产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">庆典之酒 · 传统法 · 顶级品牌</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍾 生成香槟产区巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍾 香槟产区巡礼：探秘庆典之酒的诞生地',
    author: '红酒顾问',
    digest: '香槟是世界上最高贵的起泡酒，只有法国香槟地区生产。本文带你了解香槟的历史、酿造工艺、分级体系和顶级品牌。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 产区巡礼系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#1a1a0a,#2d2d14);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">
香槟（Champagne）是世界上最高贵的起泡酒，只有<strong style="color:#d4af37">法国香槟地区</strong>生产的才能叫"香槟"。它采用独特的<strong style="color:#d4af37">传统法</strong>酿造，是庆典和重要场合的象征。
</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌍 一、香槟在哪里</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">香槟产区位于法国北部，巴黎以东约150公里。这里是世界最北的葡萄酒产区之一，气候寒冷，平均气温只有10°C，非常适合酿造清爽的起泡酒。</p>
<p style="color:#333;line-height:1.8"><strong>📍 地理位置：</strong>法国北部，埃纳省、马恩省、奥布省<br/><strong>🌡️ 气候类型：</strong>大陆性气候，寒冷多雨<br/><strong>🍇 主要葡萄：</strong>霞多丽、黑皮诺、莫尼耶<br/><strong>📏 产区面积：</strong>约34,000公顷<br/><strong>🍷 年产量：</strong>约3亿瓶</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、香槟的葡萄品种</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 霞多丽（Chardonnay）- 约30%</strong><br/><span style="color:#666">提供清爽酸度和柑橘风味，常见于白中白香槟（Blanc de Blancs）</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 黑皮诺（Pinot Noir）- 约38%</strong><br/><span style="color:#666">提供酒体和红色水果风味，常见于黑中白香槟（Blanc de Noirs）</span></p>
<p style="color:#333;line-height:1.8"><strong>3. 莫尼耶（Pinot Meunier）- 约32%</strong><br/><span style="color:#666">提供果味和圆润感，是很多香槟的"秘密武器"</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⚗️ 三、传统法酿造工艺</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🎯 为什么香槟如此特别？</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">香槟采用独特的<strong>传统法</strong>（Méthode Champenoise）酿造，也叫瓶中二次发酵法。整个过程需要至少15个月，无年份香槟甚至需要3年以上。</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>第一步：基酒酿造</strong><br/><span style="color:#666">先酿造静态白葡萄酒作为基酒</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>第二步：混合（Assemblage）</strong><br/><span style="color:#666">调配师将不同年份、品种、地块的基酒混合</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>第三步：二次发酵</strong><br/><span style="color:#666">加入糖和酵母，在瓶中进行二次发酵产生气泡</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>第四步：陈酿</strong><br/><span style="color:#666">酒泥接触（Sur Lie）至少15个月，增添烤面包风味</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>第五步：转瓶（Riddling）</strong><br/><span style="color:#666">将酒瓶逐渐倾斜，让酒泥沉淀到瓶口</span></p>
<p style="color:#333;line-height:1.8"><strong>第六步：除渣（Disgorgement）</strong><br/><span style="color:#666">冷冻瓶口，去除酒泥，补充糖液（Dosage）</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 四、香槟分级体系</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">按甜度分类：</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">类型</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">残糖量</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">说明</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">Brut Nature</td>
<td style="padding:10px;color:#666">0-3g/L</td>
<td style="padding:10px;color:#666">最干，无添加糖</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">Extra Brut</td>
<td style="padding:10px;color:#666">0-6g/L</td>
<td style="padding:10px;color:#666">非常干</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#c41e3a;font-weight:bold">Brut</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">0-12g/L</td>
<td style="padding:10px;color:#666;font-weight:bold">最常见，清爽干型</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">Extra Dry</td>
<td style="padding:10px;color:#666">12-17g/L</td>
<td style="padding:10px;color:#666">微甜</td>
</tr>
<tr>
<td style="padding:10px;color:#333">Demi-Sec</td>
<td style="padding:10px;color:#666">32-50g/L</td>
<td style="padding:10px;color:#666">半甜，适合配甜点</td>
</tr>
</table>
<p style="color:#8b2252;font-weight:bold;margin-top:15px;margin-bottom:12px">按类型分类：</p>
<p style="color:#333;line-height:1.8"><strong>• 无年份香槟（NV）：</strong>最常见，多个年份混合<br/><strong>• 年份香槟（Vintage）：</strong>单一优秀年份，品质更高<br/><strong>• 桃红香槟（Rosé）：</strong>加入红酒调配，颜色粉红<br/><strong>• 白中白（Blanc de Blancs）：</strong>100%霞多丽<br/><strong>• 黑中白（Blanc de Noirs）：</strong>100%黑皮诺/莫尼耶<br/><strong>• 桃红年份香槟：</strong>最高端，产量极少</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👑 五、顶级香槟品牌</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍾 大牌香槟（Grandes Marques）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 唐培里侬（Dom Pérignon）</strong><br/><span style="color:#666">• 地位：最知名的香槟品牌</span><br/><span style="color:#666">• 特点：只在优秀年份生产，陈年潜力20年+</span><br/><span style="color:#666">• 价格：约2000-3000元</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 库克（Krug）</strong><br/><span style="color:#666">• 地位：香槟中的"罗曼尼康帝"</span><br/><span style="color:#666">• 特点：100%橡木桶发酵，浓郁饱满</span><br/><span style="color:#666">• 价格：约1500-2500元</span></p>
<p style="color:#333;line-height:1.8"><strong>3. 沙龙（Salon）</strong><br/><span style="color:#666">• 地位：最稀有的香槟，平均10年只有3-4个年份</span><br/><span style="color:#666">• 特点：100%霞多丽，来自Le Mesnil单一园</span><br/><span style="color:#666">• 价格：约3000-5000元</span></p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍾 香槟行家之选</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 塞尔日·罗塞（Serge Roset）</strong><br/><span style="color:#666">• 小农香槟代表，产量极少</span><br/><span style="color:#666">• 约800-1500元</span></p>
<p style="color:#333;line-height:1.8"><strong>5. 贝瑟恩（Bérêche）</strong><br/><span style="color:#666">• 年轻一代的香槟新星</span><br/><span style="color:#666">• 约600-1200元</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💰 六、投资建议</h2>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;line-height:1.8">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• 年份香槟：</strong>Dom Pérignon、Krug、Salon<br/>
<span style="color:#666">顶级稀缺，升值潜力大</span><br/><br/>
<strong>• 老年份香槟：</strong>1996、2002、2008年份<br/>
<span style="color:#666">陈年香槟风味复杂，市场需求旺盛</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 存储要求高，温度需恒定<br/>
• 流动性较低，需要长期持有<br/>
• 需要通过正规渠道购买</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 七、配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥂 香槟配餐</p>
<p style="color:#333;line-height:1.8"><strong>• 生蚝 + 白中白香槟</strong> - 清爽酸度突出鲜美<br/><strong>• 鱼子酱 + 年份香槟</strong> - 经典奢华搭配<br/><strong>• 炸鸡 + 无年份Brut</strong> - 现代流行搭配<br/><strong>• 草莓 + 桃红香槟</strong> - 浪漫甜蜜<br/><strong>• 奶酪 + 陈年香槟</strong> - 风味互补</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📅 八、经典年份推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">年份</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">评分</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">特点</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2012</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">完美平衡，经典年份</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2008</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">清爽高酸，陈年潜力佳</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2002</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">浓郁饱满，适饮期</td>
</tr>
<tr>
<td style="padding:10px;color:#333">1996</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，收藏级</td>
</tr>
</table>
</section>
</section>

<section style="background:linear-gradient(135deg,#1a1a0a,#2d2d14);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍾 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">香槟是庆典的象征，也是投资收藏的佳选。从入门的无年份Brut，到收藏级的Salon老年份，都有无尽的探索空间。</p>
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
