/**
 * 红酒醒酒完全指南文章生成器
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
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

async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实醒酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'decanting_cover_real.png');
  const prompt = 'Photorealistic editorial wine photography, crystal decanter pouring ruby red wine into elegant glass, warm golden hour lighting, dark mahogany table, bokeh background with vineyard and wine bottles, professional food photography, 8K, ultra-detailed, Vogue style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('decanting_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      // 裁剪为微信封面尺寸 900x383
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      // 添加文字叠加
      const svgText = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#D4AF37"/>
            <stop offset="100%" style="stop-color:#F4E4BC"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 红酒醒酒完全指南</text>
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">为什么要醒酒 · 醒酒时间 · 正确方法</text>
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svgText);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'decanting_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      
      return finalBuffer;
    }
    
    throw new Error('生成失败: ' + stderr);
    
  } catch (err) {
    console.warn('   ⚠️ AI 生成失败:', err.message);
    return generateLocalSVG();
  }
}

async function generateLocalSVG() {
  console.log('   🎨 使用 SVG 备用封面...');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a0e2e"/>
      <stop offset="100%" style="stop-color:#722F37"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#bgGrad)"/>
  <g transform="translate(350, 40)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#4a0e2e" text-anchor="middle">醒酒</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#4a0e2e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#2a0a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 红酒醒酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">为什么要醒酒 · 醒酒时间 · 正确方法</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'decanting_cover.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #722F37; }
  .time-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  .time-table th { background: #722F37; color: white; padding: 10px; text-align: left; }
  .time-table td { padding: 10px; border-bottom: 1px solid #eee; }
  .time-table tr:nth-child(even) { background: #f9f9f9; }
  h3 { color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #722F37;">🍷 ${date.chinese} 红酒醒酒完全指南</h2>
<p style="text-align: center; color: #666;">为什么要醒酒 · 醒酒时间 · 正确方法</p>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#fce4ec;font-size:16px;line-height:1.9">醒酒（Decanting）是品鉴红酒的重要步骤。通过让酒液与空气接触，可以柔化单宁、释放香气、去除沉淀。但醒酒并非万能——不同酒款需要不同的醒酒时间和方式。</p>
</section>

<h3>🤔 一、为什么要醒酒？</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🌬️ 柔化单宁</strong><br/>
年轻红酒中的单宁通常紧致、涩口。醒酒过程中，氧气与单宁结合，使其变得柔和丝滑。</p>

<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🌹 释放香气</strong><br/>
封闭的红酒往往香气内敛。醒酒能唤醒沉睡的果香、花香、香料和泥土气息。</p>

<p style="color:#333;line-height:1.8"><strong>🧱 去除沉淀</strong><br/>
陈年红酒会产生酒石酸结晶和色素沉淀。通过滗酒（Decanting）可以分离清澈酒液与沉淀物。</p>
</section>

<h3>⏱️ 二、醒酒时间对照表</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<table class="time-table">
<tr>
  <th>酒款类型</th>
  <th>推荐醒酒时间</th>
  <th>说明</th>
</tr>
<tr>
  <td style="color:#333"><strong>年轻赤霞珠（1-3年）</strong></td>
  <td style="color:#c41e3a">60-90分钟</td>
  <td style="color:#666">单宁强劲，需要充分氧化</td>
</tr>
<tr>
  <td style="color:#333"><strong>波尔多左岸（5-10年）</strong></td>
  <td style="color:#c41e3a">45-60分钟</td>
  <td style="color:#666">正值适饮期，适度醒酒即可</td>
</tr>
<tr>
  <td style="color:#333"><strong>梅洛/右岸（年轻）</strong></td>
  <td style="color:#c41e3a">30-45分钟</td>
  <td style="color:#666">单宁较柔和，不宜过久</td>
</tr>
<tr>
  <td style="color:#333"><strong>陈年红酒（15年+）</strong></td>
  <td style="color:#d4af37">15-30分钟</td>
  <td style="color:#666">脆弱易散，短时间醒酒</td>
</tr>
<tr>
  <td style="color:#333"><strong>黑皮诺（勃艮第）</strong></td>
  <td style="color:#d4af37">20-30分钟</td>
  <td style="color:#666">优雅细腻，避免香气散失</td>
</tr>
<tr>
  <td style="color:#333"><strong>意大利巴罗洛</strong></td>
  <td style="color:#c41e3a">90-120分钟</td>
  <td style="color:#666">高单宁高酸，需要长时间醒酒</td>
</tr>
</table>
</section>

<h3>🛠️ 三、正确的醒酒方法</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">📋 步骤指南</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 准备工作</strong><br/>
<span style="color:#666">• 提前24小时将酒瓶直立静置，让沉淀沉底</span><br/>
<span style="color:#666">• 准备干净的醒酒器（Decanter）</span><br/>
<span style="color:#666">• 准备好光源（蜡烛或手电筒）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 缓慢倒酒</strong><br/>
<span style="color:#666">• 将酒瓶缓慢倒入醒酒器</span><br/>
<span style="color:#666">• 保持瓶口靠近醒酒器口，减少飞溅</span><br/>
<span style="color:#666">• 观察到沉淀接近瓶口时停止</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 观察酒液</strong><br/>
<span style="color:#666">• 年轻酒：酒液清澈，边缘呈紫色</span><br/>
<span style="color:#666">• 陈年酒：酒液略显砖红，边缘呈琥珀色</span></p>

<p style="color:#333;line-height:1.8"><strong>4. 等待醒酒</strong><br/>
<span style="color:#666">• 根据酒款设定计时器</span><br/>
<span style="color:#666">• 可每隔15分钟品尝一次，观察变化</span></p>
</section>

<h3>❌ 四、醒酒常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：所有红酒都需要醒酒</strong><br/>
<span style="color:#666">事实上，轻盈的红酒（如博若莱新酒）和老酒（15年+）应少醒或不醒。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：醒酒时间越长越好</strong><br/>
<span style="color:#666">过长时间醒酒会导致香气散失，酒体变得平淡。尤其对优雅细腻的酒款（如黑皮诺）更要谨慎。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：摇晃醒酒器能加速醒酒</strong><br/>
<span style="color:#666">剧烈摇晃会破坏酒的结构，正确的方式是静置，让氧气自然接触酒液。</span></p>

<p style="color:#c62828;line-height:1.8">❌ <strong>误区4：用任何容器都能醒酒</strong><br/>
<span style="color:#666">专用醒酒器的设计能最大化酒液与空气接触面积，效果更好。</span></p>
</section>

<h3>🍷 五、快速醒酒小技巧</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#33691e;line-height:1.8;margin-bottom:10px">✅ <strong>使用快速醒酒器</strong><br/>
<span style="color:#666">专用快速醒酒器（如Vinturi）能在倒酒过程中注入空气，瞬间完成醒酒。</span></p>

<p style="color:#33691e;line-height:1.8;margin-bottom:10px">✅ <strong>增加接触面积</strong><br/>
<span style="color:#666">选择宽底醒酒器，让酒液与空气充分接触。</span></p>

<p style="color:#33691e;line-height:1.8;margin-bottom:10px">✅ <strong>轻柔旋转</strong><br/>
<span style="color:#666">每隔10分钟轻轻旋转醒酒器，让酒液重新接触空气（不要剧烈摇晃）。</span></p>

<p style="color:#33691e;line-height:1.8">✅ <strong>控制温度</strong><br/>
<span style="color:#666">醒酒过程中保持室温（18-20℃），避免阳光直射。</span></p>
</section>

<h3>💰 六、醒酒器选购建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 入门级（100-300元）</strong><br/>
<span style="color:#666">• 玻璃醒酒器：基本功能，适合日常使用</span><br/>
<span style="color:#666">• 推荐：Riedel、Spiegelau入门款</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎💎 中端（300-800元）</strong><br/>
<span style="color:#666">• 水晶醒酒器：更好的光泽和手感</span><br/>
<span style="color:#666">• 推荐：Riedel Vinum系列、Zalto</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 高端（800元以上）</strong><br/>
<span style="color:#666">• 手工吹制水晶：艺术品级，醒酒效果极佳</span><br/>
<span style="color:#666">• 推荐：Riedel Sommeliers、Lalique</span></p>
</section>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#fce4ec;font-size:14px;line-height:1.8;margin:0">醒酒是一门艺术，也是一种科学。掌握正确的醒酒时间和方法，能让红酒展现出最佳状态。记住：不是所有酒都需要醒酒，但每款好酒都值得被认真对待。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成红酒醒酒完全指南');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  // 1. 生成封面
  const coverBuffer = await generateCoverWithAI();

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 红酒醒酒完全指南：为什么要醒酒？醒酒时间对照表`,
    author: '红酒顾问',
    digest: '醒酒是品鉴红酒的重要步骤。本文详解为什么要醒酒、不同酒款的醒酒时间对照表、正确的醒酒方法，以及常见误区。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `decanting_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  console.log('📤 尝试发布到微信公众号草稿箱...');
  try {
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

    console.log('   步骤 2/3: 上传封面图...');
    const coverPath = path.join(__dirname, 'output', 'decanting_cover.png');
    const coverBuffer = fs.readFileSync(coverPath);
    const formData = new FormData();
    formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
    
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
    console.log('💡 提示: 封面已生成为 output/decanting_cover.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
