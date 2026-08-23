/**
 * 葡萄酒入门文章 - 存酒指南篇
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
  console.log('🎨 生成封面...');
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
        prompt: 'Elegant wine cellar with wooden racks, bottles of wine stored horizontally, warm ambient lighting, professional interior photography, high detail',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark',
        steps: 12,
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="url(#tg)">🍷 新手存酒指南：别让好酒变质</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">温度·湿度·避光·平放·常见误区</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">🍷 新手存酒指南：别让好酒变质</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">温度·湿度·避光·平放·常见误区</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒入门文章（存酒指南篇）');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 新手存酒指南：别让好酒变质',
    author: '红酒顾问',
    digest: '买回家的酒怎么存？温度、湿度、避光、平放，掌握这4个要素，让你的酒保持最佳状态。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 葡萄酒入门系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">
你是否遇到过：花大价钱买的好酒，放了半年后味道变酸、果味全无？这通常不是酒的问题，而是<strong style="color:#d4af37">储存不当</strong>造成的。葡萄酒是"活"的，对环境极其敏感。学会正确存酒，才能让你的酒保持最佳状态。
</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌡️ 一、存酒的5大敌人</h2>
<section style="background:#fff5f5;padding:18px;border-radius:8px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🚫 这些因素会毁掉你的酒！</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 高温（Heat）</strong><br/><span style="color:#666">最致命的敌人。超过25°C，酒会加速老化，果味消失，甚至变成"煮酒"味。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 温度波动（Temperature Fluctuation）</strong><br/><span style="color:#666">比恒温高温更可怕。热胀冷缩会让软木塞松动，空气进入导致氧化。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 光照（Light）</strong><br/><span style="color:#666">紫外线会破坏酒中的单宁和色素，产生"光臭味"（Light Strike）。这也是为什么好酒都用深色瓶。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 干燥（Dryness）</strong><br/><span style="color:#666">湿度低于50%，软木塞会干缩，空气进入导致氧化。</span></p>
<p style="color:#333;line-height:1.8"><strong>5. 震动（Vibration）</strong><br/><span style="color:#666">频繁震动会扰动酒液中的沉淀物，影响陈年过程。避免放在洗衣机旁或经常搬动。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🎯 二、理想储存条件</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">✅ 黄金法则</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">要素</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">理想范围</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">说明</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">温度</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">10-15°C</td>
<td style="padding:10px;color:#666">12°C最佳，波动<2°C</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">湿度</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">60-70%</td>
<td style="padding:10px;color:#666">保持软木塞湿润</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">光线</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">完全避光</td>
<td style="padding:10px;color:#666">黑暗环境最佳</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">震动</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">静止</td>
<td style="padding:10px;color:#666">远离电器和走廊</td>
</tr>
<tr>
<td style="padding:10px;color:#333">摆放</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">平放或斜放</td>
<td style="padding:10px;color:#666">酒液接触软木塞</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🏠 三、家庭存酒方案</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">💡 方案1：短期存酒（1-3个月内喝掉）</p>
<p style="color:#333;line-height:1.8"><strong>• 衣柜/床底</strong>：阴凉避光，适合日常餐酒。<br/><strong>• 冰箱</strong>：仅限白酒/起泡酒，红酒放冰箱会失去风味。<br/><strong>• 地下室</strong>：如果有，是天然酒窖。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">💡 方案2：中期存酒（3-12个月）</p>
<p style="color:#333;line-height:1.8"><strong>• 电子酒柜</strong>：最佳选择，控温控湿，价格1000-5000元。<br/><strong>• 储物间</strong>：选择最阴凉、无窗户的角落。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">💡 方案3：长期收藏（1年以上）</p>
<p style="color:#333;line-height:1.8"><strong>• 专业酒窖</strong>：恒温恒湿，适合名庄酒。<br/><strong>• 第三方仓储</strong>：如Uvinum、专业酒商仓储服务。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍾 四、开瓶后怎么存？</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">⏳ 开瓶后的保质期</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 红酒</strong>：塞回软木塞，放阴凉处，<strong>3-5天</strong>内喝完。<br/><strong>• 白酒</strong>：塞好放冰箱，<strong>3-5天</strong>内喝完。<br/><strong>• 起泡酒</strong>：用专用塞，放冰箱，<strong>1-2天</strong>内喝完。<br/><strong>• 甜酒/加强酒</strong>：波特、雪莉可放<strong>2-4周</strong>。</p>
<p style="color:#333;line-height:1.8"><strong>延长保存技巧：</strong><br/>• 使用真空塞（Vacuum Stopper）抽出空气<br/>• 注入惰性气体（如Private Preserve）<br/>• 换小瓶装减少空气接触</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⚠️ 五、常见存酒误区</h2>
<section style="background:#fff5f5;padding:18px;border-radius:8px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🚫 这些做法会毁掉你的酒！</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区1：红酒放冰箱长期保存</strong><br/><span style="color:#666">冰箱太干燥，软木塞会干缩。且温度过低会抑制风味发展。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区2：放在厨房或阳台</strong><br/><span style="color:#666">厨房温度波动大，阳台有阳光直射，都是存酒禁区。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区3：直立存放</strong><br/><span style="color:#666">长期直立会让软木塞干燥，空气进入导致氧化。螺旋盖酒可直立。</span></p>
<p style="color:#333;line-height:1.8"><strong>误区4：频繁搬动</strong><br/><span style="color:#666">震动会扰动沉淀物，影响陈年。存好后尽量少动。</span></p>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">存酒并不难，记住核心：恒温、恒湿、避光、平放。对于日常餐酒，放在阴凉避光处即可；对于名庄酒，建议投资电子酒柜或专业仓储。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒知识</p>
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
