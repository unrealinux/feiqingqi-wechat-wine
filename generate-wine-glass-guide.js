/**
 * 如何选购红酒杯文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实红酒杯封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实红酒杯封面...');
  
  const coverPath = path.join(__dirname, 'output', 'glass_cover_real.png');
  const prompt = 'Photorealistic wine glass collection, crystal wine glasses for different grape varieties, professional product photography, bokeh background with vineyard, warm lighting, 8K ultra-detailed, gourmet magazine style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('glass_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 如何选购红酒杯</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">杯型·材质·搭配·保养</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'glass_cover_ai.png');
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
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#bgGrad)"/>
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">选杯</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 如何选购红酒杯</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">杯型·材质·搭配·保养</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'glass_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成如何选购红酒杯文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .glass-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .glass-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 如何选购红酒杯：杯型·材质·搭配·保养</h2>
<p style="text-align: center; color: #666;">选对杯子，酒好喝一倍</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">一支好酒，如果杯子选错了，风味可能损失<strong style="color:#ffd740">30%以上</strong>。红酒杯不是装饰品，它是<strong style="color:#ffd740">品尝工具</strong>，直接影响香气释放和口感体验。</p>
</section>

<h3>🍷 一、为什么杯子很重要</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🌬️ 香气聚集</strong><br/>
<span style="color:#666">郁金香杯的收口设计能将香气聚集到鼻尖，让你闻到更多层次。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>💧 口感引导</strong><br/>
<span style="color:#666">杯口形状决定酒液接触舌头的位置，影响甜、酸、单宁的感知。</span></p>

<p style="color:#333;line-height:1.8"><strong>👀 视觉享受</strong><br/>
<span style="color:#666">透明水晶杯让你欣赏酒色和挂杯（Legs），提升品鉴体验。</span></p>
</section>

<h3>🍸 二、常见红酒杯型</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="glass-item">
<h4>🍷 波尔多杯（Bordeaux Glass）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>形状：</strong>高脚、大杯肚、收口<br/>
<strong>适合：</strong>赤霞珠、梅洛为主的酒<br/>
<strong>特点：</strong>收口聚集香气，大杯肚让酒接触更多氧气<br/>
<strong>容量：</strong>通常 600-800ml（倒酒约150ml）</p>
</div>

<div class="glass-item">
<h4>🍷 勃艮第杯（Bourgogne Glass）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>形状：</strong>杯肚更宽、杯口略收<br/>
<strong>适合：</strong>黑皮诺、霞多丽<br/>
<strong>特点：</strong>宽杯肚聚集细腻香气，适合优雅风格的酒<br/>
<strong>容量：</strong>通常 500-700ml</p>
</div>

<div class="glass-item">
<h4>🥂 香槟杯（Champagne Flute）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>形状：</strong>细长、高脚、直身<br/>
<strong>适合：</strong>香槟、气泡酒<br/>
<strong>特点：</strong>保持气泡活力，防止氧化，展现气泡细腻<br/>
<strong>容量：</strong>通常 150-300ml</p>
</div>

<div class="glass-item">
<h4>🍷  ISO 标准杯</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>形状：</strong>郁金香型，标准化设计<br/>
<strong>适合：</strong>所有红酒（教学/品鉴用）<br/>
<strong>特点：</strong>中立设计，不影响酒的风味表达<br/>
<strong>容量：</strong>通常 300-400ml</p>
</div>

</section>

<h3>💎 三、材质选择</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">材质</td>
<td style="padding:10px;font-weight:bold">优点</td>
<td style="padding:10px;font-weight:bold">缺点</td>
<td style="padding:10px;font-weight:bold">推荐品牌</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>水晶玻璃</strong></td>
<td style="padding:10px;color:#666">透亮、清脆、薄壁</td>
<td style="padding:10px;color:#666">贵、易碎</td>
<td style="padding:10px;color:#d4af37">Riedel、Zalto、Spiegelau</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>普通玻璃</strong></td>
<td style="padding:10px;color:#666">便宜、耐用</td>
<td style="padding:10px;color:#666">较厚、不够透亮</td>
<td style="padding:10px;color:#d4af37">Libbey、Arc</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>无铅水晶</strong></td>
<td style="padding:10px;color:#666">安全、透亮</td>
<td style="padding:10px;color:#666">略贵于普通玻璃</td>
<td style="padding:10px;color:#d4af37">Schott Zwiesel</td>
</tr>
</table>
<p style="color:#666;font-size:14px;margin-top:12px">💡 避免含铅水晶（Lead Crystal），长期用可能析出铅。</p>
</section>

<h3>🏷 四、杯型搭配指南</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🛒 选购速查表</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 波尔多红（赤霞珠、梅洛）</strong><br/>
<span style="color:#666">→ 波尔多杯（Bordeaux Glass）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 勃艮第红（黑皮诺）</strong><br/>
<span style="color:#666">→ 勃艮第杯（Bourgogne Glass）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 霞多丽白葡萄酒</strong><br/>
<span style="color:#666">→ 白葡萄酒杯（细长型）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 香槟/气泡酒</strong><br/>
<span style="color:#666">→ 香槟笛形杯（Flute）</span></p>

<p style="color:#333;line-height:1.8"><strong>🔴 甜酒（波特、苏玳）</strong><br/>
<span style="color:#666">→ 小容量甜酒杯（约150ml）</span></p>
</section>

<h3>💰 五、不同预算推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 入门级（50-150元/只）</strong><br/>
<span style="color:#666">• 品牌：Spiegelau、Schott Zwiesel 入门款</span><br/>
<span style="color:#666">• 特点：无铅水晶，耐用，性价比高</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎💎 中端（150-500元/只）</strong><br/>
<span style="color:#666">• 品牌：Riedel Vinum系列、Zalto</span><br/>
<span style="color:#666">• 特点：专业杯型，厚度适中，手感好</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 高端（500元+/只）</strong><br/>
<span style="color:#666">• 品牌：Riedel Sommeliers、Lalique</span><br/>
<span style="color:#666">• 特点：手工吹制，极薄壁，艺术品级</span></p>
</section>

<h3>🧼 六、保养与清洁</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">✅ 正确保养</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 手洗优先</strong><br/>
<span style="color:#666">• 用温水+中性洗洁精，软海绵轻轻擦拭</span><br/>
<span style="color:#666">• 避免使用洗碗机（高温+洗涤剂会腐蚀水晶表面）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 擦干技巧</strong><br/>
<span style="color:#666">• 用无绒布（Microfiber）擦干，避免水渍</span><br/>
<span style="color:#666">• 不要旋转杯子擦干（易断裂）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 储存方式</strong><br/>
<span style="color:#666">• 倒挂于杯架上，避免积灰</span><br/>
<span style="color:#666">• 或正放在软垫上，杯口向上</span></p>

<p style="color:#333;line-height:1.8"><strong>4. 去酒渍</strong><br/>
<span style="color:#666">• 用白醋+温水浸泡30分钟，再轻轻擦拭</span></p>
</section>

<h3>❌ 七、常见选购误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：一套杯喝遍所有酒</strong><br/>
<span style="color:#666">不同酒款需要不同杯型。用波尔多杯喝黑皮诺，香气会损失30%。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：杯子越大越好</strong><br/>
<span style="color:#666">太大杯子难以聚集香气。标准品鉴用300-400ml足够。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：必须买最贵的</strong><br/>
<span style="color:#666">Spiegelau等中端品牌已经足够好。初学者不必追求手工杯。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>❌ 误区4：可以用普通玻璃杯</strong><br/>
<span style="color:#666">普通玻璃杯壁厚、不透明，会严重影响品鉴体验。</span></p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">选对杯子，是品酒的第一步。投资一套好的水晶杯，能让你的红酒体验提升一个档次。记住：杯子不是装饰品，它是品鉴工具。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成如何选购红酒杯文章');
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
    title: `🍷 ${date.chinese} 如何选购红酒杯：杯型·材质·搭配·保养`,
    author: '红酒顾问',
    digest: '选对杯子，酒好喝一倍。本文详解红酒杯型、材质选择、杯型搭配指南和保养技巧。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `glass_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'glass_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/glass_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
