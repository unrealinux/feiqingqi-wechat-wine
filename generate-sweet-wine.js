/**
 * 甜酒完全指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实甜酒封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实甜酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'sweet_wine_cover_real.png');
  const prompt = 'Photorealistic collection of fine dessert wines, glasses of golden Sauternes, Ice Wine bottle, Tokaji, Noble Rot grapes, elegant table setting, warm candlelight, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('sweet_wine_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FFA500"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍯 甜酒完全指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">贵腐 · 冰酒 · 晚收 · 波特</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'sweet_wine_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#FFA500"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 装饰线条 -->
  <g stroke="rgba(255,215,0,0.2)" stroke-width="1" fill="none">
    <line x1="100" y1="50" x2="150" y2="100"/>
    <line x1="800" y1="330" x2="850" y2="280"/>
    <circle cx="200" cy="150" r="30" stroke-width="2"/>
    <circle cx="700" cy="300" r="20" stroke-width="2"/>
  </g>
  
  <!-- 甜酒杯组合 -->
  <g transform="translate(280, 100)">
    <!-- 贵腐酒杯 -->
    <g transform="translate(0, 0)">
      <path d="M15,100 L25,40 L55,40 L65,100 Z" fill="url(#goldGrad)" opacity="0.85"/>
      <rect x="38" y="25" width="8" height="15" fill="#8B7500"/>
      <ellipse cx="45" cy="100" rx="25" ry="5" fill="#B8860B"/>
    </g>
    <!-- 冰酒杯 -->
    <g transform="translate(100, 10)">
      <path d="M15,90 L25,35 L55,35 L65,90 Z" fill="url(#goldGrad)" opacity="0.85"/>
      <rect x="38" y="20" width="8" height="15" fill="#8B7500"/>
      <ellipse cx="45" cy="90" rx="25" ry="5" fill="#B8860B"/>
    </g>
    <!-- 波本酒杯 -->
    <g transform="translate(200, 5)">
      <path d="M15,80 L25,30 L55,30 L65,80 Z" fill="url(#goldGrad)" opacity="0.85"/>
      <rect x="38" y="15" width="8" height="15" fill="#8B7500"/>
      <ellipse cx="45" cy="80" rx="25" ry="5" fill="#B8860B"/>
    </g>
  </g>
  
  <!-- 葡萄串（贵腐葡萄） -->
  <g transform="translate(650, 180)" opacity="0.7">
    <circle cx="0" cy="0" r="10" fill="#B8860B"/>
    <circle cx="18" cy="6" r="9" fill="#DAA520"/>
    <circle cx="36" cy="-3" r="10" fill="#B8860B"/>
    <circle cx="54" cy="7" r="9" fill="#DAA520"/>
    <circle cx="72" cy="2" r="10" fill="#B8860B"/>
    <circle cx="90" cy="8" r="8" fill="#DAA520"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(520, 50)">
    <rect x="0" y="0" width="300" height="140" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="300" height="140" rx="10" fill="none" stroke="#B8860B" stroke-width="4"/>
    <text x="150" y="50" font-family="Microsoft YaHei, sans-serif" font-size="38" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🍯 甜酒</text>
    <text x="150" y="95" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">完全指南</text>
    <line x1="50" y1="115" x2="250" y2="115" stroke="#B8860B" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🍯 ${date.display} 甜酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">贵腐 · 冰酒 · 晚收 · 波特</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'sweet_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成甜酒完全指南文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FFD700; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #B8860B; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #B8860B; border-bottom: 2px solid #FFD700; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #B8860B;">🍯 ${date.chinese} 甜酒完全指南</h2>
<p style="text-align: center; color: #666;">贵腐 · 冰酒 · 晚收 · 波特</p>

<section style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFF8DC;font-size:16px;line-height:1.9">甜酒是<strong style="color:#FFD700">葡萄酒世界的璀璨明珠</strong>，每一滴都凝聚着自然的馈赠与酿酒师的智慧。从冰天雪地中采摘的冰酒，到贵腐菌侵蚀下诞生的珍酿——这篇文章将带你全面了解<strong style="color:#FFD700">全球七大甜酒类型</strong>。</p>
</section>

<h3>🍇 一、甜酒酿造七大工艺</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>❄️ 冰酒（Ice Wine）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>葡萄自然冰冻后压榨，糖分浓缩<br/>
<strong>• 温度：</strong>-8°C以下采摘<br/>
<strong>• 产地：</strong>加拿大、德国<br/>
<strong>• 特点：</strong>极高的酸度与甜度平衡，蜂蜜、热带水果风味<br/>
<strong>• 代表酒：</strong>Inniskillin Vidal、Egon Müller</p>
</div>

<div class="region-item">
<h4>🍄 贵腐酒（ Noble Rot / Sauternes）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>灰霉菌（Botrytis）侵蚀葡萄，水分蒸发，糖分浓缩<br/>
<strong>• 产地：</strong>法国苏玳、匈牙利托卡伊、德国<br/>
<strong>• 特点：</strong>杏干、蜂蜜、橘子酱风味，复杂华丽<br/>
<strong>• 代表酒：</strong>Château d'Yquem、Château Lafaurie-Peyraguey</p>
</div>

<div class="region-item">
h4>🌙 晚收酒（Late Harvest）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>延迟采收，让葡萄在藤上自然风干<br/>
<strong>• 产地：</strong>阿尔萨斯、莱茵河、澳大利亚<br/>
<strong>• 特点：</strong>果味浓郁，甜度适中，风格多样<br/>
<strong>• 代表酒：</strong>Trimbach Gewürztraminer Vendanges Tardives</p>
</div>

<div class="region-item">
h4>🏛 托卡伊（Tokaji）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>贵腐菌+古老陶罐陈酿<br/>
<strong>• 产地：</strong>匈牙利<br/>
<strong>• 特点：</strong>独特的氧化风味，坚果、咖啡、酸度完美<br/>
<strong>• 分级：</strong>3-6 Puttonyos（越高级越甜）<br/>
<strong>• 代表酒：</strong>Disznókő、Oremus</p>
</div>

<div class="region-item">
h4>🍇 风干葡萄酒（Passito / Vin Santo）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>葡萄采摘后铺在草席上风干数月<br/>
<strong>• 产地：</strong>意大利（Vin Santo、Sicily Passito）、希腊（Vin Santo）<br/>
<strong>• 特点：</strong>极度浓缩，葡萄干、咖啡、巧克力<br/>
<strong>• 代表酒：</strong>Avignonesi Vin Santo、Southern Italy Passito</p>
</div>

<div class="region-item">
h4>🍷 波特酒（Port）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>发酵中添加白兰地终止发酵，保留糖分<br/>
<strong>• 产地：</strong>葡萄牙杜罗河谷<br/>
<strong>• 特点：</strong>酒精度高（17-22%），甜蜜、浓郁<br/>
<strong>• 类型：</strong>Ruby、Tawny、Vintage、LBV<br/>
<strong>• 代表酒：</strong>Taylor's、Famous、Graham's</p>
</div>

<div class="region-item">
h4>🥂 加强型甜酒（Fortified）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 其他类型：</strong>西班牙雪莉（PX）、法国Banyuls、意大利Marsala<br/>
<strong>• 特点：</strong>酒精度高，可长时间保存<br/>
<strong>• 风格：</strong>从干型到极甜</p>
</div>

</section>

<h3>🗺 二、全球甜酒产区地图</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 法国苏玳（Sauternes）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球最著名的贵腐酒产区<br/>
<strong>• 品种：</strong>Semillon、Sauvignon Blanc<br/>
<strong>• 特点：</strong>复杂华丽，陈年潜力极强<br/>
<strong>• 代表酒庄：</strong>Château d'Yquem、Château Climens</p>
</div>

<div class="region-item">
h4>🏆 加拿大尼亚加拉（Niagara）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>冰酒产量和品质全球第一<br/>
<strong>• 品种：</strong>Vidal、Riesling、Cabernet Franc<br/>
<strong>• 特点：</strong>VQA严格认证，酸甜完美平衡<br/>
<strong>• 代表酒庄：</strong>Inniskillin、Peller Estates</p>
</div>

<div class="region-item">
h4>🏆 德国（Mosel/Rheingau）</h4>
<p style="color:#333;line-line-height:1.8;margin:0"><strong>• 地位：</strong>冰酒和贵腐酒的发源地<br/>
<strong>• 品种：</strong>Riesling<br/>
<strong>• 特点：</strong>高酸度，矿物感，优雅精细<br/>
<strong>• 代表酒庄：</strong>Egon Müller、Dr. Loosen</p>
</div>

<div class="region-item">
h4>🏆 匈牙利托卡伊（Tokaj）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>匈牙利国宝，历史可追溯到16世纪<br/>
<strong>• 品种：</strong>Furmint、Harslevelü<br/>
<strong>• 特点：</strong>独特的陶罐陈酿风味<br/>
<strong>• 代表酒庄：</strong>Disznókő、Royal Tokaji</p>
</div>

<div class="region-item">
🏆 <h4>葡萄牙波特（Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>加强型甜酒代表<br/>
<strong>• 品种：</strong>Touriga Nacional<br/>
<strong>• 特点：</strong>从Ruby到Vintage，选择丰富<br/>
<strong>• 代表酒庄：</strong>Taylor's、Graham's、Dow's</p>
</div>

</section>

<h3>💰 三、甜酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 100-300 元（入门）</strong><br/>
<span style="color:#666">• 加拿大入门级冰酒</span><br/>
<span style="color:#666">• 澳大利亚晚收雷司令</span><br/>
<span style="color:#666">• 入门级波特（Ruby）</span><br/>
<span style="color:#666">• 特点：适合初次体验甜酒</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 300-800 元（进阶）</strong><br/>
<span style="color:#666">• 德国晚收/精选级雷司令</span><br/>
<span style="color:#666">• 法国苏玳入门（Château Laribotte）</span><br/>
<span style="color:#666">• 10-20年茶色波特</span><br/>
<strong style="color:#c62828">• 特点：可陈年5-15年</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 800-2000 元（高级）</strong><br/>
<span style="color:#666">• 苏玳一级庄（Château Suduiraut）</span><br/>
<span style="color:#666">• 顶级冰酒（Egon Müller入门）</span><br/>
<span style="color:#666">• 托卡伊5-6 Puttonyos</span><br/>
<strong style="color:#c62828">• 特点：可陈年15-30年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 2000元以上（膜拜）</strong><br/>
<span style="color:#666">• Château d'Yquem（滴金）</span><br/>
<span style="color:#666">• Egon Müller枯葡级</span><br/>
<strong style="color:#c62828">• 特点：拍卖级，陈年50年+，稀缺</strong></p>
</section>

<h3>📅 四、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#B8860B;color:white">
<td style="padding:10px;font-weight:bold">产区</td>
<td style="padding:10px;font-weight:bold">经典年份</td>
<td style="padding:10px;font-weight:bold">备注</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>苏玳</strong></td>
<td style="padding:10px;color:#c41e3a">2015、2017、2001、1990</td>
<td <td style="padding:10px;color:#666">传奇年份</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>加拿大冰酒</strong></td>
<td style="padding:10px;color:#c41e3a">2017、2014、2012</td>
<td <td style="padding:10px;color:#666">品质卓越</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>德国</strong></td>
<td style="padding:10px;color:#c41e3a">2015、2017、2019</td>
<td <td style="padding:10px;color:#666">完美平衡</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>波特</strong></td>
<td style="padding:10px;color:#c41e3a">2000、1994、2017</td>
<td <td style="padding:10px;color:#666">长期陈年</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>托卡伊</strong></td>
<td style="padding:10px;color:#c41e3a">2016、2013、2008</td>
<td <td style="padding:10px;color:#666">优秀批次</td>
</tr>
</table>
</section>

<h3>🍽 五、甜酒配餐指南</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🦆 经典搭配：鹅肝</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 完美组合：</strong>苏玳/贵腐酒 + 鹅肝<br/>
<strong>• 原理：</strong>甜酒的酸度解腻，鹅肝的丰盈衬托酒的甜美<br/>
<strong>• 小技巧：</strong>搭配无花果酱或波特酱更佳</p>
</div>

<div class="region-item">
🧀 <h4>蓝纹奶酪</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 经典组合：</strong>波特酒 + 蓝纹奶酪<br/>
<strong>• 原理：</strong>强烈风味相互增强<br/>
<strong>• 推荐：</strong>Stilton、Roquefort、Gorgonzola</p>
</div>

<div class="region-item">
🍰 <h4>甜点</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 法式焦糖布丁：</strong>苏玳<br/>
<strong>• 提拉米苏：</strong>意大利Vin Santo<br/>
<strong>• 闪电泡芙：</strong>法国Sauternes<br/>
<strong>• 巧克力：</strong>波特或年份波特</p>
</div>

<div class="region-item">
🌶 <h4>创意搭配：辛辣菜</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 泰国咖喱：</strong>冰酒或晚收雷司令<br/>
<strong>• 印度玛萨拉：</strong>贵腐酒或托卡伊<br/>
<strong>• 川菜：</strong>冰酒（解辣又增香）</p>
</div>

</section>

<h3>💡 六、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：甜酒只是餐后酒</strong><br/>
<span style="color:#666">事实上，干型雪莉（Manzanilla）、甜型白波特都可作为开胃酒。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：甜酒越甜越好</strong><br/>
<span style="color:#666">好的甜酒必须有足够的酸度支撑，否则会腻。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：甜酒不能陈年</strong><br/>
<strong style="color:#666">顶级甜酒可陈年50年以上，风味更复杂。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：甜酒要冰镇</strong><br/>
<span style="color:#666">贵腐和苏玳建议12-14℃，波特16-18℃。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：甜酒配甜点一定OK</strong><br/>
<span style="color:#666">要点：酒要比甜点更甜，否则会显得酸。</span></p>
</section>

<h3>🍷 七、甜酒 vs 餐酒</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#B8860B;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">甜酒</td>
<td style="padding:10px;font-weight:bold">干型餐酒</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>糖分</strong></td>
<td style="padding:10px;color:#666">残留糖分 50-200g/L</td>
<td <td style="padding:10px;color:#666">< 4g/L</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>酸度</strong></td>
<td style="padding:10px;color:#666">必须高酸支撑甜度</td>
<td <td style="padding:10px;color:#666">适中即可</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>产量</strong></td>
<td style="padding:10px;color:#666">极低（正常1/5）</td>
<td <td style="padding:10px;color:#666">正常</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#666">⭐⭐⭐⭐ 较高</td>
<td <td style="padding:10px;color:#666">⭐⭐⭐ 可亲民</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>配餐</strong></td>
<td style="padding:10px;color:#666">甜点、鹅肝、辣味</td>
<td <td style="padding:10px;color="#666">正餐、烤肉、海鲜</td>
</tr>
</table>
</section>

<h3>🍸 八、饮用与保存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 冰酒：6-8℃（充分冰镇）</span><br/>
<span style="color:#666">• 贵腐/苏玳：12-14℃（轻微冰镇）</span><br/>
<span style="color:#666">• 波特/茶色：14-16℃（室温）</span><br/>
<span style="color:#666">• 托卡伊：10-12℃</span><br/><br/>
<strong>🍷 酒杯选择：</strong><br/>
<span style="color:#666">• 小型甜酒杯（150ml容量）</span><br/>
<span style="color:#666">• 郁金香杯型，聚拢香气</span><br/>
<span style="color:#666">• 不建议用大杯，香味会散失</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 未开瓶：避光保存，12-18℃</span><br/>
<span style="color:#666">• 甜酒陈年能力极强：顶级可50年+</span><br/>
<span style="color:#666">• 开瓶后：冰箱可保存1-2周</span><br/>
<span style="color:#666">• 建议：一次性喝完，风味最佳</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🍯 结语</p>
<p style="color:#FFF8DC;font-size:14px;line-height:1.8;margin:0">甜酒是葡萄酒世界最深奥的课题之一。每一滴都来之不易——或是在严寒中等待采摘，或是在贵腐菌的侵蚀下蜕变，或是经历数十年橡木桶的磨砺。从百元的日常甜蜜到万元的拍卖级珍藏，甜酒的世界有无尽的惊喜等待你去发现。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍯 生成甜酒完全指南文章');
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
    title: `🍯 ${date.chinese} 甜酒完全指南：贵腐·冰酒·晚收·波特`,
    author: '红酒顾问',
    digest: '甜酒是葡萄酒世界的璀璨明珠。本文详解七大甜酒酿造工艺、全球核心产区、价格指南和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `sweet_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'sweet_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/sweet_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();