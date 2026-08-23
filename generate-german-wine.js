/**
 * 德国葡萄酒入门文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实德国封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实德国封面...');
  
  const coverPath = path.join(__dirname, 'output', 'german_cover_real.png');
  const prompt = 'Photorealistic German vineyard landscape, Riesling grapes on steep slopes along Rhine river, historic castle in background, professional landscape photography, warm lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('german_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 德国葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">雷司令 · 冰酒 ·  Steinerberg</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'german_cover_ai.png');
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
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
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
  <rect width="900" height="383" fill="url(#g)"/>
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">德国</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">葡萄酒</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 德国葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">雷司令 · 冰酒 · Steinerberg</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'german_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成德国葡萄酒入门文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 德国葡萄酒入门</h2>
<p style="text-align: center; color: #666;">雷司令 · 冰酒 · Steinerberg</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">德国是<strong style="color:#ffd740">全球最北的葡萄酒产国</strong>，以<strong style="color:#ffd740">雷司令（Riesling）</strong>闻名世界。这里生产的<strong style="color:#ffd740">高酸度、低酒精</strong>的白葡萄酒，是夏日佐餐的绝佳选择。</p>
</section>

<h3>🗺 一、德国葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 三大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 摩泽尔（Mosel）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>德国西南部，摩泽尔河谷<br/>
<strong>• 品种：</strong>雷司令（Riesling）为主<br/>
<strong>• 风格：</strong>高酸度、低酒精（8-10%），矿物感极强<br/>
<strong>• 推荐年份：</strong>2015、2017、2019</p>
</div>

<div class="region-item">
<h4>🏠 莱茵高（Rheingau）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>法兰克福附近，莱茵河谷<br/>
<strong>• 品种：</strong>雷司令、黑皮诺（Spatburgunder）<br/>
<strong>• 风格：</strong>饱满酒体，平衡酸度与果味<br/>
<strong>• 推荐年份：</strong>2015、2016、2017</p>
</div>

<div class="region-item">
<h4>🏠 法尔兹（Pfalz）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>德国葡萄酒之路，温暖产区<br/>
<strong>• 品种：</strong>雷司令、丹魄（Dornfelder）<br/>
<strong>• 风格：</strong>果味更饱满，酒精度略高<br/>
<strong>• 推荐年份：</strong>2015、2016、2018</p>
</div>

</section>

<h3>🍇 二、雷司令完全指南</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🍷 什么是雷司令？</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>德国国宝，全球最优质的白葡萄品种之一<br/>
<strong>• 特点：</strong>高酸度、低酒精、极强陈年潜力<br/>
<strong>• 香气：</strong>青苹果、柠檬、白色花香、矿物感<br/>
<strong>• 陈年后：</strong>蜂蜜、汽油味（独特标志）</p>
</div>

<div class="region-item">
<h4>🍷 甜度分级（从低到高）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• Kabinett（珍藏）：</strong>半干到半甜，轻盈果味<br/>
<strong>• Spätlese（晚收）：</strong>更甜，果味更浓缩<br/>
<strong>• Auslese（精选）：</strong>甜型，贵腐菌影响<br/>
<strong>• Beerenauslese（粒选）：</strong>极甜，贵腐浓郁<br/>
<strong>• Trockenbeerenauslese（枯葡）：</strong>极甜，产量极低，价格昂贵</p>
</div>

</section>

<h3>👑 三、传奇酒庄推荐</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 Egon Müller（伊贡穆勒）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>摩泽尔雷司令之王<br/>
<strong>• 价格：</strong>约300-3000元/瓶<br/>
<strong>• 特点：</strong>极致矿物感、陈年潜力20年+<br/>
<strong>• 代表作：</strong>Scharzhofberger Riesling</p>
</div>

<div class="region-item">
<h4>🔴 Dr. Loosen（露森博士）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>摩泽尔顶级酒庄<br/>
<strong>• 价格：</strong>约200-1500元/瓶<br/>
<strong>• 特点：</strong>有机种植，纯净果味<br/>
<strong>• 代表作：</strong>Ürzinger Würzgarten</p>
</div>

<div class="region-item">
<h4>🔴 Markus Molitor（马克斯莫利特）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>摩泽尔传奇酒庄<br/>
<strong>• 价格：</strong>约300-2000元/瓶<br/>
<strong>• 特点：</strong>从干型到枯葡，全系列生产<br/>
<strong>• 代表作：</strong>Zeltinger Sonnenuhr</p>
</div>

</section>

<h3>🍸 四、冰酒（Eiswein）完全指南</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">❄ 什么是冰酒？</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 定义：</strong>葡萄在-7℃以下自然冰冻后采摘压榨<br/>
<strong>• 产地：</strong>德国、加拿大（最知名）<br/>
<strong>• 特点：</strong>极高甜度、高酸度、平衡完美<br/>
<strong>• 价格：</strong>约300-1000元/375ml</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 配餐：</strong>鹅肝、甜点、蓝纹奶酪<br/>
<strong>• 陈年：</strong>可以陈年10-30年</p>

<p style="color:#333;line-height:1.8"><strong>• 推荐酒款：</strong>Egon Müller、Dr. Loosen 冰酒款</p>
</section>

<h3>💎 五、高性价比酒款推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 100-300 元</strong><br/>
<span style="color:#666">• 酒庄：Dr. Loosen、Wilhelm Haag 入门款</span><br/>
<span style="color:#666">• 特点：轻盈果味，适合即饮</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 300-800 元</strong><br/>
<span style="color:#666">• 酒庄：Egon Müller 入门、Markus Molitor</span><br/>
<span style="color:#666">• 特点：矿物感强，陈年潜力10年+</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800 元以上</strong><br/>
<span style="color:#666">• 酒庄：Egon Müller 顶级款、Joh. Jos. Prüm</span><br/>
<span style="color:#666">• 特点：传奇酒庄，拍卖市场活跃</span></p>
</section>

<h3>🍷 六、德国 vs 法国白葡萄酒</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">德国</td>
<td style="padding:10px;font-weight:bold">法国（勃艮第）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>主要品种</strong></td>
<td style="padding:10px;color:#666">雷司令</td>
<td style="padding:10px;color:#666">霞多丽</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>酸度</strong></td>
<td style="padding:10px;color:#666">极高（清爽型）</td>
<td style="padding:10px;color:#666">高（适中型）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>酒精度</strong></td>
<td style="padding:10px;color:#666">低（8-11%）</td>
<td style="padding:10px;color:#666">中（12-13.5%）</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>风格</strong></td>
<td style="padding:10px;color:#666">轻盈、矿物感、陈年型</td>
<td style="padding:10px;color:#666">饱满、橡木味、圆润</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>配餐</strong></td>
<td style="padding:10px;color:#666">海鲜、亚洲菜、辣味</td>
<td style="padding:10px;color:#666">海鲜、禽类、奶油酱汁</td>
</tr>
</table>
</section>

<h3>📅 七、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">评分</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2015</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，结构完美，陈年潜力极佳</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2017</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅平衡，果味纯净，适饮期较早</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2019</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">温暖年份，酒体饱满，果味爆炸</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2010</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，酸度漂亮，优雅细腻</td>
</tr>
</table>
</section>

<h3>💡 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：德国酒都甜</strong><br/>
<span style="color:#666">事实上，德国生产大量干型（Trocken）雷司令，酸度清爽，极其易饮。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：雷司令只能配甜点</strong><br/>
<span style="color:#666">干型雷司令配亚洲菜（中餐、泰餐）、辣味菜是绝配。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：冰酒都贵</strong><br/>
<span style="color:#666">入门级冰酒约300元/375ml，性价比极高。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：德国只产白葡萄酒</strong><br/>
<span style="color:#666">黑皮诺（Spatburgunder）品质极高，不输勃艮第。</span></p>
</section>

<h3>💰 九、购买与储存建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🛒 购买渠道：</strong><br/>
<span style="color:#666">• 正规进口商：由西往东、ASC、桃乐丝</span><br/>
<span style="color:#666">• 德国酒专营店：Wine & Co.、Vinum</span><br/><br/>
<strong>📦 储存条件：</strong><br/>
<span style="color:#666">• 温度：8-12℃（白葡萄酒标准）</span><br/>
<span style="color:#666">• 姿势：水平放置，保持软木塞湿润</span><br/>
<span style="color:#666">• 光线：完全黑暗，避免紫外线</span><br/><br/>
<strong>⏳ 适饮期：</strong><br/>
<span style="color:#666">• 入门款（Kabinett）：1-3年内饮用</span><br/>
<span style="color:#666">• 顶级款（Auslese+）：可陈年10-30年</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 德国酒假酒较少，但也要注意正规渠道</span><br/>
<span style="color:#666">• 关注葡萄酒网站（如Wine-Searcher）的成交价</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">德国葡萄酒是清爽与陈年的完美结合。从100元的干型雷司令到3000元的枯葡，这里有无尽的探索空间。不要因为"德国酒都甜"的误解，错过了这些顶级白葡萄酒。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成德国葡萄酒入门文章');
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
    title: `🍷 ${date.chinese} 德国葡萄酒入门：雷司令·冰酒· Steinerberg`,
    author: '红酒顾问',
    digest: '德国是全球最北的葡萄酒产国，以雷司令闻名。本文详解三大产区、雷司令甜度分级、冰酒指南和传奇酒庄。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `german_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'german_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/german_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
