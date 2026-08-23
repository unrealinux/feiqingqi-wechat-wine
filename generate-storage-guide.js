/**
 * 红酒储存完全指南文章生成器
 * 使用 baoyu-imagine + DashScope 生成写实封面，发布到微信公众号草稿箱
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
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  chinese: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

/**
 * 使用 baoyu-imagine + DashScope 生成写实储存封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实储存封面...');
  
  const coverPath = path.join(__dirname, 'output', 'storage_cover_real.png');
  const prompt = 'Photorealistic wine cellar storage room, professional wine racks with bottles, temperature and humidity control equipment, dark wooden shelves, warm lighting, ultra detailed, 8K quality, gourmet magazine style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('storage_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      // 裁剪为微信封面尺寸 900x383
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      // 添加文字叠加
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#D4AF37"/>
            <stop offset="100%" style="stop-color:#F4E4BC"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 红酒储存完全指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">温度·湿度·光线·姿势</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'storage_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      
      return finalBuffer;
    }
    
    throw new Error('生成失败: ' + stderr);
    
  } catch (err) {
    console.warn('   ⚠️ AI 生成失败:', err.message);
    return generateLocalCover();
  }
}

/**
 * 本地备用封面
 */
function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a237e"/>
      <stop offset="100%" style="stop-color:#283593"/>
    </linearGradient>
    <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#bgGrad)"/>
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#bottleGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">储存</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 红酒储存完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">温度·湿度·光线·姿势</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'storage_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成红酒储存文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .tip-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .tip-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 红酒储存完全指南</h2>
<p style="text-align: center; color: #666;">温度·湿度·光线·姿势</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">买回的红酒储存不当，可能让几千元的名庄酒在几个月内变质。<strong style="color:#ffd740">正确的储存方式</strong>能让好酒完美陈年，错误的储存则是烧钱。</p>
</section>

<h3>🌡️ 一、理想储存环境</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="tip-item">
<h4>🌡️ 温度：12-15℃</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>红葡萄酒：</strong>12-15℃最佳，波动不超过±2℃<br/>
<strong>白葡萄酒：</strong>8-12℃，饮用前冰镇<br/>
<strong>起泡酒：</strong>6-8℃，保持气泡活力<br/>
<span style="color:#666">💡 温度过高加速老化，过低会抑制陈年</span></p>
</div>

<div class="tip-item">
<h4>💧 湿度：60-75%</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>理想湿度：</strong>65-70%<br/>
<span style="color:#666">• 过低（<50%）：软木塞会变干，空气进入氧化酒液</span><br/>
<span style="color:#666">• 过高（>80%）：标签发霉，酒瓶生锈</span></p>
</div>

<div class="tip-item">
<h4>🌑 光线：完全黑暗</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>紫外线是红酒杀手：</strong>会让酒产生"光线味"（类似湿纸板）<br/>
<span style="color:#666">• 储存室用暖黄色灯光，避免日光灯</span><br/>
<span style="color:#666">• 酒窖要完全黑暗，或用不透光木箱</span></p>
</div>

</section>

<h3>🛌 二、摆放姿势</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">🛌 正确姿势</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟢 水平放置（最佳）</strong><br/>
<span style="color:#666">• 酒液接触软木塞，保持塞子湿润膨胀</span><br/>
<span style="color:#666">• 密封性最好，氧化风险最低</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟠 倾斜45度（次佳）</strong><br/>
<span style="color:#666">• 同样能保持软木塞湿润</span><br/>
<span style="color:#666">• 适合展示酒标时使用</span></p>

<p style="color:#333;line-height:1.8"><strong>🟣 直立放置（仅短期）</strong><br/>
<span style="color:#666">• 仅适合1-3个月内饮用的酒</span><br/>
<span style="color:#666">• 长期直立会让软木塞变干</span></p>
</section>

<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;font-weight:bold;margin-bottom:15px">❌ 错误姿势</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>❌ 直立放置超过3个月</strong> → 软木塞干裂，空气进入氧化</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>❌ 频繁震动</strong> → 破坏酒的结构，加速老化</p>
<p style="color:#333;line-height:1.8"><strong>❌ 冰箱长期储存</strong> → 压缩机震动+过于干燥，仅适合短期（<1个月）</p>
</section>

<h3>🏠 三、储存设备选择</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">设备</td>
<td style="padding:10px;font-weight:bold">适合场景</td>
<td style="padding:10px;font-weight:bold">预算</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>专业酒窖</strong></td>
<td style="padding:10px;color:#666">收藏家，100+瓶</td>
<td style="padding:10px;color:#d4af37">5万-50万+</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>嵌入式酒柜</strong></td>
<td style="padding:10px;color:#666">家庭用，20-100瓶</td>
<td style="padding:10px;color:#d4af37">3,000-15,000元</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>独立酒柜</strong></td>
<td style="padding:10px;color:#666">入门用，12-50瓶</td>
<td style="padding:10px;color:#d4af37">1,500-5,000元</td>
</tr>
<tr style="background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>地下室/衣柜</strong></td>
<td style="padding:10px;color:#666">临时方案，<20瓶</td>
<td style="padding:10px;color:#d4af37">0-500元</td>
</tr>
</table>
</section>

<h3>💡 四、不同酒款的储存时间</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">酒款类型</td>
<td style="padding:10px;font-weight:bold">适饮期</td>
<td style="padding:10px;font-weight:bold">储存建议</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>日常餐酒（<100元）</strong></td>
<td style="padding:10px;color:#666">1-3年内饮用</td>
<td style="padding:10px;color:#666">无需特殊储存，阴凉处即可</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>中级酒（100-500元）</strong></td>
<td style="padding:10px;color:#666">3-8年</td>
<td style="padding:10px;color:#666">建议使用酒柜，12-15℃</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>列级庄/特级园（500元+）</strong></td>
<td style="padding:10px;color:#666">10-30年+</td>
<td style="padding:10px;color:#666">必须专业酒窖/酒柜，恒温恒湿</td>
</tr>
<tr style="background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>起泡酒/白葡萄酒</strong></td>
<td style="padding:10px;color:#666">2-5年</td>
<td style="padding:10px;color:#666">冷藏，但避免冰箱长期储存</td>
</tr>
</table>
</section>

<h3>🧰 五、家庭储存小技巧</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">✅ 实用技巧</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 衣柜储存法</strong><br/>
<span style="color:#666">• 选择不常用的衣柜底层</span><br/>
<span style="color:#666">• 用泡沫箱包裹酒瓶，保持黑暗</span><br/>
<span style="color:#666">• 放置湿度计监控（淘宝20元）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 地下室储存</strong><br/>
<span style="color:#666">• 天然恒温（约15-18℃）</span><br/>
<span style="color:#666">• 注意防潮（湿度计+除湿机）</span><br/>
<span style="color:#666">• 用木箱或不透光箱子避光</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 冰箱短期储存</strong><br/>
<span style="color:#666">• 仅适合1个月内饮用的酒</span><br/>
<span style="color:#666">• 用保鲜袋包裹，防止异味</span><br/>
<span style="color:#666">• 饮用前30分钟取出回温</span></p>

<p style="color:#333;line-height:1.8"><strong>4. 监控设备</strong><br/>
<span style="color:#666">• 温度计（必备）：监控温度波动</span><br/>
<span style="color:#666">• 湿度计（推荐）：保持60-75%</span><br/>
<span style="color:#666">• 智能酒柜（预算足）：自动恒温恒湿</span></p>
</section>

<h3>❌ 六、常见储存误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：冰箱=酒窖</strong><br/>
<span style="color:#666">冰箱压缩机震动会破坏酒的结构，过于干燥会让软木塞收缩。仅适合短期（<1个月）储存。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：展示架=储存</strong><br/>
<span style="color:#666">光线、温度波动、震动都会伤害好酒。展示架只适合短期（<1个月）展示。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：直立储存更好</strong><br/>
<span style="color:#666">直立会让软木塞变干，空气进入导致氧化。水平放置才是正确姿势。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>❌ 误区4：普通柜子就行</strong><br/>
<span style="color:#666">厨房柜子温度波动大（做饭时30℃+），光照强。好酒需要专业储存环境。</span></p>
</section>

<h3>💰 七、酒柜选购建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 入门级（1,500-3,000元）</strong><br/>
<span style="color:#666">• 容量：12-30瓶</span><br/>
<span style="color:#666">• 推荐：Vintec、EuroCave入门款</span><br/>
<span style="color:#666">• 特点：单温区，基础恒温</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎💎 中端（3,000-8,000元）</strong><br/>
<span style="color:#666">• 容量：30-60瓶</span><br/>
<span style="color:#666">• 推荐：EuroCave、Liebherr</span><br/>
<span style="color:#666">• 特点：双温区，恒温恒湿，低震动</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 高端（8,000元+）</strong><br/>
<span style="color:#666">• 容量：60-200瓶+</span><br/>
<span style="color:#666">• 推荐：EuroCave、Transtherm顶级款</span><br/>
<span style="color:#666">• 特点：多温区，专业级恒温恒湿，防紫外线玻璃</span></p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">储存是红酒生命的保障。不管是几百元的日常餐酒，还是几万元的大瓶装，给它们一个合适的家，才能在未来品尝到完美的陈年风味。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成红酒储存完全指南');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  // 1. 生成封面
  const coverBuffer = await generateCoverWithAI();
  console.log('');

  // 2. 生成文章内容
  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 红酒储存完全指南：温度·湿度·光线·姿势`,
    author: '红酒顾问',
    digest: '买回的红酒储存不当，可能让几千元的名庄酒变质。本文详解理想储存环境、摆放姿势、设备选择和常见误区。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `storage_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  // 4. 发布到微信公众号草稿箱
  console.log('📤 发布到微信公众号草稿箱...');
  
  try {
    // 获取 Access Token
    console.log('   步骤 1/3: 获取 Access Token...');
    const tokenResp = await axios.get(config.publish.endpoints.token, {
      params: {
        grant_type: 'client_credential',
        appid: config.publish.appId,
        secret: config.publish.appSecret
      },
      timeout: 10000
    });

    if (tokenResp.data.errcode) {
      throw new Error(`获取 access_token 失败: ${tokenResp.data.errmsg} (错误码: ${tokenResp.data.errcode})`);
    }

    const token = tokenResp.data.access_token;
    console.log('   ✅ Token 获取成功');

    // 上传封面图
    console.log('   步骤 2/3: 上传封面图...');
    const coverPath = path.join(__dirname, 'output', 'storage_cover_ai.png');
    const coverFileBuffer = fs.readFileSync(coverPath);
    const formData = new FormData();
    formData.append('media', coverFileBuffer, { filename: 'cover.png', contentType: 'image/png' });
    
    const uploadResp = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
      formData,
      { headers: formData.getHeaders(), timeout: 30000 }
    );

    if (uploadResp.data.errcode) {
      throw new Error(`上传封面失败: ${uploadResp.data.errmsg}`);
    }

    const mediaId = uploadResp.data.media_id;
    console.log('   ✅ 封面上传成功, media_id:', mediaId);

    // 创建草稿
    console.log('   步骤 3/3: 创建草稿...');
    const draftResp = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
      {
        articles: [{
          title: article.title,
          author: article.author,
          digest: article.digest,
          content: article.content,
          thumb_media_id: mediaId,
          need_open_comment: 1,
          only_fans_can_comment: 0
        }]
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );

    if (draftResp.data.errcode) {
      throw new Error(`创建草稿失败: ${draftResp.data.errmsg}`);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ 发布成功！');
    console.log('草稿ID:', draftResp.data.media_id);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('');
    console.error('❌ 发布失败:', err.message);
    if (err.response) {
      console.error('   错误详情:', err.response.data);
    }
    console.log('');
    console.log('💡 提示: 封面已生成为 output/storage_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
