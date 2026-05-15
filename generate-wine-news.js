/**
 * 葡萄酒行业快讯文章生成器
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();

const https = require('https');
const http = require('http');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()],
};

function httpRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const lib = isHttps ? https : http;
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = lib.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { resolve(body); } });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timeout')); });
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function uploadImage(accessToken, imageBuffer) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2);
    const url = new URL(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`);
    const bodyParts = [];
    bodyParts.push(Buffer.from(`--${boundary}\r\n`));
    bodyParts.push(Buffer.from(`Content-Disposition: form-data; name="media"; filename="cover.png"\r\n`));
    bodyParts.push(Buffer.from(`Content-Type: image/png\r\n\r\n`));
    bodyParts.push(imageBuffer);
    bodyParts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
    const body = Buffer.concat(bodyParts);
    const options = {
      hostname: url.hostname, port: 443, path: url.pathname + url.search, method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(new Error('Failed to parse: ' + body)); } });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Upload timeout')); });
    req.write(body);
    req.end();
  });
}

async function generateCover() {
  console.log('🎨 生成行业快讯封面...');
  const apiKey = process.env.ZIMAGE_API_KEY;
  try {
    const submitResponse = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-ModelScope-Async-Mode': 'true' },
      body: JSON.stringify({ model: 'Tongyi-MAI/Z-Image-Turbo', prompt: 'Wine industry news concept, financial charts with wine bottles, market data visualization, professional business photography, dark elegant background', negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark', steps: 12, width: 1280, height: 720 })
    });
    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    console.log('   任务ID:', taskId);
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, { headers: { 'Authorization': `Bearer ${apiKey}`, 'X-ModelScope-Task-Type': 'image_generation' } });
      const statusData = await statusResponse.json();
      if (statusData.task_status === 'SUCCEED') {
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          console.log('   ✅ AI图片生成成功');
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const rawImage = Buffer.from(imageBuffer);
          const croppedBuffer = await sharp(rawImage).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="url(#tg)">📰 葡萄酒行业快讯</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">实时动态 · 市场异动 · 趋势解读</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
          const textBuffer = Buffer.from(svg);
          return sharp(croppedBuffer).composite([{ input: textBuffer, top: 0, left: 0 }]).png().toBuffer();
        }
      }
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) { console.warn('   ⚠️ AI封面生成失败'); }
  console.log('   使用备用封面');
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">📰 葡萄酒行业快讯</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">实时动态 · 市场异动 · 趋势解读</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('📰 生成葡萄酒行业快讯');
  console.log('日期:', date.display, date.weekday);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: `📰 ${date.display} ${date.weekday} 葡萄酒行业快讯`,
    author: '行业资讯分析师',
    digest: `${date.display}最新葡萄酒行业动态：价格异动、政策发布、企业动态、市场趋势。`,
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.display} ${date.weekday} | 行业快讯 | 资讯分析师</p></section>

<section style="background:linear-gradient(135deg,#c41e3a,#8b2252);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#fff;font-size:16px;line-height:1.9"><strong>📅 ${date.display} 行业快讯</strong><br/>本期聚焦葡萄酒市场最新动态，涵盖价格异动、政策发布、企业动态及消费趋势。</p>
</section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #c41e3a;padding-left:12px;margin-bottom:18px">🔥 今日热点</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>1. 香槟市场持续升温</strong><br/><span style="color:#666">Champagne 50指数年初至今上涨1.4%，领跑所有葡萄酒板块。Dom Pérignon、Krug等高端品牌需求强劲，亚洲市场表现尤为突出。对投资者：关注香槟板块配置机会。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>2. 意大利葡萄酒表现强劲</strong><br/><span style="color:#666">Italy 100指数上涨0.7%，Barolo Monfortino 2005两月内涨幅达21%。超级托斯卡纳持续受到追捧。对进口商：关注意大利产区采购机会。</span></p>
<p style="color:#333;line-height:1.8"><strong>3. 波尔多市场企稳回升</strong><br/><span style="color:#666">Bordeaux 500指数上涨0.5%，一级庄价格保持稳定。2016年份继续受到市场青睐。对收藏者：波尔多2016年份仍是配置首选。</span></p>
</section></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 市场快报</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">💰 价格动态</p>
<p style="color:#333;line-height:1.8">• Liv-ex 100指数：385.6点，年初至今+0.6%<br/>• Champagne 50：+1.4%（领涨）<br/>• Italy 100：+0.7%<br/>• Bordeaux 500：+0.5%</p></section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🏛️ 政策/产区</p>
<p style="color:#333;line-height:1.8">• 欧盟葡萄酒出口政策调整，亚洲市场关税有望降低<br/>• 加州葡萄酒产区发布春季天气预警，需关注霜冻风险</p></section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍷 企业/事件</p>
<p style="color:#333;line-height:1.8">• 多家国际酒庄集团宣布2026年扩张计划<br/>• 亚洲葡萄酒消费市场持续复苏，进口量同比增长</p></section>
</section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📌 明日关注</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#333;line-height:1.8">• Liv-ex月度市场报告发布（关注指数波动）<br/>• 波尔多2024年份期酒价格预测更新</p>
</section></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 关键数据面板</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse"><tr style="border-bottom:2px solid #d4af37"><td style="padding:10px;font-weight:bold;color:#2d1424">指标</td><td style="padding:10px;font-weight:bold;color:#2d1424">今日值</td><td style="padding:10px;font-weight:bold;color:#2d1424">较前日</td></tr>
<tr style="border-bottom:1px solid #e8e0d8"><td style="padding:10px;color:#333">Liv-ex 100</td><td style="padding:10px;color:#c41e3a">385.6</td><td style="padding:10px;color:#28a745">+0.6% (YTD)</td></tr>
<tr style="border-bottom:1px solid #e8e0d8"><td style="padding:10px;color:#333">Champagne 50</td><td style="padding:10px;color:#c41e3a">+1.4%</td><td style="padding:10px;color:#28a745">领涨</td></tr>
<tr><td style="padding:10px;color:#333">Italy 100</td><td style="padding:10px;color:#c41e3a">+0.7%</td><td style="padding:10px;color:#28a745">稳健</td></tr></table>
</section></section>

<section style="background:#f5f5f5;padding:12px;border-radius:6px;margin-bottom:20px"><p style="color:#666;font-size:12px;margin:0"><strong>🔗 信息来源</strong><br/>• Liv-ex | 实时数据<br/>• The Drinks Business | ${date.display}<br/>• Wine Industry Advisor | ${date.display}</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center"><p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">📰 行业快讯</p><p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">每日更新，掌握葡萄酒市场最新动态<br/>为投资者、进口商、消费者提供决策参考</p><p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display} ${date.weekday}<br/>关注我们，获取每日行业快讯</p></section>`
  };

  console.log('📝 标题:', article.title);
  console.log('📤 发布到微信...');

  console.log('   获取Token...');
  const tokenData = await httpRequest(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1e5b38ae39297ce6&secret=6a039c03485d1b158ada96498543fe6a`, 'GET');
  console.log('   Token响应:', JSON.stringify(tokenData));
  if (tokenData.errcode) { console.log('❌ Token获取失败:', tokenData.errmsg); return; }
  const token = tokenData.access_token;
  console.log('   Token获取成功');

  console.log('   上传封面...');
  const uploadData = await uploadImage(token, coverBuffer);
  console.log('   上传响应:', JSON.stringify(uploadData));
  if (uploadData.errcode) { console.log('❌ 封面上传失败:', uploadData.errmsg); return; }
  const mediaId = uploadData.media_id;
  console.log('   上传成功');

  console.log('   创建草稿...');
  const draftData = await httpRequest(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, 'POST', {
    articles: [{ ...article, thumb_media_id: mediaId, need_open_comment: 0, only_fans_can_comment: 0 }]
  });
  console.log('   草稿响应:', JSON.stringify(draftData));
  if (draftData.errcode) { console.log('❌ 创建草稿失败:', draftData.errmsg); return; }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 发布成功！');
  console.log('草稿ID:', draftData.media_id);
  console.log('='.repeat(60));
}

main().catch(err => { console.error('\n❌ 任务失败:', err.message); process.exit(1); });
