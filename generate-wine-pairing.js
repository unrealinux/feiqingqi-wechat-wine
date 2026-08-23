/**
 * 葡萄酒入门文章 - 配餐指南篇
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
  console.log('🎨 生成配餐主题封面...');
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
        prompt: 'Elegant wine and food pairing table setting, steak with red wine, seafood with white wine, cheese platter, professional food photography, warm ambient lighting, high detail, 8k quality',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="url(#tg)">🍷 葡萄酒配餐指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">核心原则 · 经典公式 · 进阶技巧</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">🍷 葡萄酒配餐指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">核心原则 · 经典公式 · 进阶技巧</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒入门文章（配餐指南篇）');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 葡萄酒配餐指南：让美食与美酒互相成就',
    author: '红酒顾问',
    digest: '红酒配红肉，白酒配白肉？这只是基础。掌握风味强度、酸度、单宁的平衡，你也能成为配餐大师。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 葡萄酒入门系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">
你是否遇到过：好酒配错了菜，味道大打折扣？或者一道普通的菜，配上一杯合适的酒，瞬间变得高级？<strong style="color:#d4af37">配餐</strong>是一门艺术，也是一门科学。掌握几个核心原则，你也能让美食与美酒互相成就。
</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⚖️ 一、配餐的核心原则</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🎯 记住这4个关键词</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 风味强度（Intensity）</strong><br/><span style="color:#666">重口味配重口味，轻口味配轻口味。清蒸鱼配轻盈白酒，红烧肉配浓郁红酒。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 酸度（Acidity）</strong><br/><span style="color:#666">高酸度的酒能解腻。香槟配炸鸡，夏布利配生蚝，就是利用酸度切割油脂。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 单宁（Tannin）</strong><br/><span style="color:#666">单宁能软化肉质纤维。牛排配赤霞珠，单宁与蛋白质结合，肉更嫩，酒更顺。</span></p>
<p style="color:#333;line-height:1.8"><strong>4. 甜度（Sweetness）</strong><br/><span style="color:#666">酒要比菜甜。甜点配甜酒，否则酒会显得酸涩。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📝 二、经典搭配公式</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🥩 红酒 + 红肉</p>
<p style="color:#333;line-height:1.8"><strong>原理：</strong>红酒中的单宁与肉类蛋白质结合，软化肉质，同时肉类的脂肪能柔化单宁的涩感。<br/><strong>推荐：</strong>赤霞珠配牛排，西拉配烤羊排，黑皮诺配烤鸭。</p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🐟 白酒 + 白肉/海鲜</p>
<p style="color:#333;line-height:1.8"><strong>原理：</strong>白酒的高酸度能去腥提鲜，且不会掩盖海鲜的细腻风味。<br/><strong>推荐：</strong>长相思配生蚝，霞多丽配龙虾，雷司令配亚洲菜。</p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍾 起泡酒 + 油炸/咸味小吃</p>
<p style="color:#333;line-height:1.8"><strong>原理：</strong>气泡和酸度能切割油脂，带来清爽感。<br/><strong>推荐：</strong>香槟配薯条，普罗塞克配天妇罗，卡瓦配Tapas。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🚀 三、进阶搭配技巧</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🌶️ 辣菜怎么配？</p>
<p style="color:#333;line-height:1.8">辣菜需要低酒精度、高酸度、带点甜味的酒。<strong>推荐：</strong>德国雷司令（半干）、莫斯卡托阿斯蒂。避免高单宁红酒，会加重辣感。</p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37;margin-top:12px">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🧀 奶酪怎么配？</p>
<p style="color:#333;line-height:1.8">硬奶酪配红酒（如切达配赤霞珠），软奶酪配白酒（如布里配霞多丽），蓝纹奶酪配甜酒（如苏玳配罗克福）。</p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37;margin-top:12px">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍫 甜点怎么配？</p>
<p style="color:#333;line-height:1.8">酒要比甜点更甜。<strong>推荐：</strong>巧克力配波特酒，水果塔配莫斯卡托，焦糖布丁配苏玳贵腐。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">❌ 四、常见配餐误区</h2>
<section style="background:#fff5f5;padding:18px;border-radius:8px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🚫 这些搭配要避开！</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区1：红酒配所有肉类</strong><br/><span style="color:#666">清蒸鱼配红酒会有金属味！白肉配白酒，红肉配红酒。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区2：甜酒配辣菜</strong><br/><span style="color:#666">太甜的酒会加重辣感。选半干或带酸度的酒。</span></p>
<p style="color:#333;line-height:1.8"><strong>误区3：高单宁酒配海鲜</strong><br/><span style="color:#666">单宁与海鲜中的碘反应，会产生金属味。海鲜配高酸白酒。</span></p>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">配餐没有绝对的对错，只有个人口味的偏好。掌握这些原则，大胆尝试，你会发现美食与美酒的无限可能。欢迎在评论区分享你的神仙搭配！</p>
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
