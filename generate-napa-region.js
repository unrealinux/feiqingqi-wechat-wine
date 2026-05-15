/**
 * 纳帕谷产区巡礼文章生成器
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
  console.log('🎨 生成纳帕谷写实封面...');
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
        prompt: 'Beautiful Napa Valley vineyard landscape, rolling hills with Cabernet Sauvignon grapevines, golden sunset light, luxury winery building, professional landscape photography, warm California light, high detail, 8k quality',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark, modern buildings',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍷 纳帕谷产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">美国酒王 · 赤霞珠圣地 · 膜拜酒庄</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 纳帕谷产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">美国酒王 · 赤霞珠圣地 · 膜拜酒庄</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成纳帕谷产区巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 纳帕谷产区巡礼：探秘美国葡萄酒的皇冠明珠',
    author: '红酒顾问',
    digest: '纳帕谷是美国最著名的葡萄酒产区，以顶级赤霞珠和膜拜酒庄闻名于世。本文带你深入了解纳帕谷的风土、名庄和投资价值。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 产区巡礼系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">纳帕谷（Napa Valley）是美国最著名的葡萄酒产区，以<strong style="color:#d4af37">顶级赤霞珠</strong>和<strong style="color:#d4af37">膜拜酒庄</strong>闻名于世。这里的酒风格浓郁饱满，价格动辄数千美元，是全球收藏家追逐的目标。</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌍 一、纳帕谷在哪里</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">纳帕谷位于美国加州旧金山以北约80公里，是一个长约48公里、宽约5公里的山谷。这里的气候是地中海气候，白天温暖干燥，夜晚凉爽，昼夜温差大，非常适合葡萄积累风味物质。</p>
<p style="color:#333;line-height:1.8"><strong>📍 地理位置：</strong>美国加州，旧金山以北<br/><strong>🌡️ 气候类型：</strong>地中海气候<br/><strong>🍇 主要葡萄：</strong>赤霞珠（Cabernet Sauvignon）<br/><strong>📏 产区面积：</strong>约18,000公顷<br/><strong>🍷 年产量：</strong>约4500万瓶</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、纳帕谷的灵魂：赤霞珠</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🍇 赤霞珠（Cabernet Sauvignon）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">赤霞珠是纳帕谷的绝对主角，占当地红酒产量的60%以上。纳帕谷的赤霞珠以浓郁饱满、单宁强劲、陈年潜力极佳著称，是波尔多左岸风格的"美国版"。</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>典型风味：</strong>黑醋栗、黑莓、雪松、石墨、香草、摩卡<br/><strong>特点：</strong>高单宁、高酸度、酒体饱满<br/><strong>陈年潜力：</strong>优质酒款可陈年30-50年</p>
<p style="color:#666;font-size:14px;line-height:1.8">💡 纳帕谷的赤霞珠通常经过橡木桶陈酿，带来香草、烤面包和摩卡的风味。许多顶级酒庄使用100%新法国橡木桶。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🗺️ 三、主要子产区（AVA）</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏔️ 奥克维尔（Oakville）</p>
<p style="color:#333;line-height:1.8">纳帕谷的心脏地带，拥有最优质的赤霞珠葡萄园。Opus One、Robert Mondavi、Silver Oak等名庄位于此。这里的酒结构宏大，陈年潜力极强。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏰 卢瑟福（Rutherford）</p>
<p style="color:#333;line-height:1.8">以"Rutherford Dust"（卢瑟福尘土）风味闻名，这是一种独特的矿物质感。Inglenook、Beaulieu Vineyard等历史名庄位于此。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🦌 鹿跃区（Stags Leap District）</p>
<p style="color:#333;line-height:1.8">1976年巴黎审判中，Stag's Leap Wine Cellars的1973年份击败波尔多一级庄，一举成名。这里的酒优雅细腻，单宁丝滑。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👑 四、顶级酒庄推荐</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 膜拜酒庄（Cult Wines）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. Screaming Eagle（啸鹰）</strong><br/><span style="color:#666">• 地位：美国最贵的葡萄酒</span><br/><span style="color:#666">• 价格：约30000-50000美元/瓶</span><br/><span style="color:#666">• 特点：产量极少，需排队数年才能买到</span></p>
<p style="color:#333;line-height:1.8"><strong>2. Harlan Estate（哈兰）</strong><br/><span style="color:#666">• 地位：纳帕谷的"拉图"</span><br/><span style="color:#666">• 价格：约1000-2000美元/瓶</span><br/><span style="color:#666">• 特点：浓郁强劲，陈年潜力50年+</span></p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 名庄代表</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. Opus One（作品一号）</strong><br/><span style="color:#666">• 地位：波尔多与纳帕的完美融合</span><br/><span style="color:#666">• 价格：约400-600美元/瓶</span><br/><span style="color:#666">• 特点：木桐与蒙大维联合创建</span></p>
<p style="color:#333;line-height:1.8"><strong>4. Caymus（卡缪斯）</strong><br/><span style="color:#666">• 地位：纳帕谷性价比之王</span><br/><span style="color:#666">• 价格：约100-150美元/瓶</span><br/><span style="color:#666">• 特点：浓郁饱满，果味丰富</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💰 五、投资建议</h2>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• 膜拜酒庄：</strong>Screaming Eagle, Harlan, Screaming Eagle<br/>
<span style="color:#666">顶级稀缺，升值潜力极大，但门槛极高</span><br/><br/>
<strong>• 名庄酒：</strong>Opus One, Dominus, Joseph Phelps<br/>
<span style="color:#666">国际认可度高，价格稳定上涨</span><br/><br/>
<strong>• 高性价比：</strong>Caymus, Silver Oak, Stag's Leap<br/>
<span style="color:#666">适合日常饮用，价格亲民</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 纳帕谷酒价格普遍较高<br/>
• 需通过正规渠道购买，避免假酒<br/>
• 存储条件要求高，温度需恒定</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 六、配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 经典搭配</p>
<p style="color:#333;line-height:1.8"><strong>• 纳帕谷赤霞珠 + 牛排</strong><br/><span style="color:#666">强劲单宁切割牛肉脂肪，完美搭配</span><br/><br/><strong>• 纳帕谷赤霞珠 + 烤羊排</strong><br/><span style="color:#666">浓郁酒体与羊肉的膻味完美呼应</span><br/><br/><strong>• 纳帕谷霞多丽 + 龙虾</strong><br/><span style="color:#666">饱满酒体搭配精致海鲜</span></p>
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
<td style="padding:10px;color:#333">2019</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">完美平衡，经典年份</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2016</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅细腻，陈年潜力佳</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2013</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">浓郁饱满，适饮期</td>
</tr>
<tr>
<td style="padding:10px;color:#333">2012</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，收藏级</td>
</tr>
</table>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">纳帕谷是美国葡萄酒的骄傲。从几百元的日常餐酒，到数万美元的膜拜酒庄，都有无尽的探索空间。探索纳帕谷，就是探索美国梦的葡萄酒版本。</p>
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
