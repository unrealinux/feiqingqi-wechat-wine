/**
 * 起泡酒完全指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实起泡酒封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实起泡酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'sparkling_wine_cover_real.png');
  const prompt = 'Photorealistic champagne glasses celebration, fine sparkling wine bottles on ice bucket, golden bubbles rising, elegant banquet table, crystal flutes, festive atmosphere, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('sparkling_wine_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🥂 起泡酒完全指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">香槟 · 卡瓦 · 普罗塞克 · 阿斯蒂</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'sparkling_wine_cover_ai.png');
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
  
  <!-- 香槟杯组合 -->
  <g transform="translate(200, 80)">
    <!-- 左侧笛型杯 -->
    <g transform="translate(0, 0)">
      <path d="M20,120 L25,50 L55,50 L60,120 Z" fill="url(#goldGrad)" opacity="0.8"/>
      <line x1="42" y1="30" x2="42" y2="50" stroke="#8B7500" stroke-width="4"/>
      <ellipse cx="42" cy="120" rx="20" ry="4" fill="#B8860B"/>
      <!-- 气泡 -->
      <circle cx="35" cy="80" r="2" fill="white" opacity="0.8"/>
      <circle cx="45" cy="70" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="40" cy="90" r="1" fill="white" opacity="0.7"/>
    </g>
    <!-- 中间郁金香杯 -->
    <g transform="translate(80, -5)">
      <path d="M15,100 L20,45 L60,45 L65,100 Z" fill="url(#goldGrad)" opacity="0.8"/>
      <rect x="40" y="30" width="6" height="15" fill="#8B7500"/>
      <ellipse cx="42" cy="100" rx="25" ry="5" fill="#B8860B"/>
      <!-- 气泡 -->
      <circle cx="35" cy="70" r="2" fill="white" opacity="0.8"/>
      <circle cx="50" cy="60" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="45" cy="80" r="1" fill="white" opacity="0.7"/>
    </g>
    <!-- 右侧碟型杯 -->
    <g transform="translate(160, 10)">
      <ellipse cx="40" cy="50" rx="35" ry="15" fill="url(#goldGrad)" opacity="0.8"/>
      <path d="M5,50 L75,50 L65,80 L15,80 Z" fill="url(#goldGrad)" opacity="0.7"/>
      <rect x="35" y="80" width="10" height="20" fill="#8B7500"/>
      <ellipse cx="40" cy="100" rx="25" ry="4" fill="#B8860B"/>
    </g>
  </g>
  
  <!-- 香槟瓶 -->
  <g transform="translate(600, 120)" opacity="0.85">
    <rect x="35" y="0" width="30" height="80" fill="#2d5a3d" rx="3"/>
    <rect x="40" y="-15" width="20" height="15" fill="#c9a227"/>
    <rect x="45" y="-20" width="10" height="8" fill="#8B7500"/>
    <rect x="38" y="80" width="24" height="30" fill="#1a3d2a"/>
    <!-- 瓶颈金圈 -->
    <rect x="43" y="60" width="14" height="8" fill="#FFD700"/>
    <!-- 气泡 -->
    <circle cx="50" cy="40" r="1.5" fill="white" opacity="0.7"/>
    <circle cx="55" cy="30" r="1" fill="white" opacity="0.5"/>
    <circle cx="45" cy="50" r="1" fill="white" opacity="0.6"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(520, 50)">
    <rect x="0" y="0" width="310" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="310" height="130" rx="10" fill="none" stroke="#B8860B" stroke-width="4"/>
    <text x="155" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🥂 起泡酒</text>
    <text x="155" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">完全指南</text>
    <line x1="50" y1="110" x2="260" y2="110" stroke="#B8860B" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🥂 ${date.display} 起泡酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">香槟 · 卡瓦 · 普罗塞克 · 阿斯蒂</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'sparkling_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成起泡酒完全指南文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4FC3F7; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #0277BD; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #0277BD; border-bottom: 2px solid #4FC3F7; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #0277BD;">🥂 ${date.chinese} 起泡酒完全指南</h2>
<p style="text-align: center; color: #666;">香槟 · 卡瓦 · 普罗塞克 · 阿斯蒂</p>

<section style="background:linear-gradient(135deg,#0d47a1,#1565c0);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E3F2FD;font-size:16px;line-height:1.9">起泡酒是<strong style="color:#FFD700">庆祝与欢聚的象征</strong>，从法国香槟到意大利阿斯蒂，每一瓶都承载着独特的历史与酿造哲学。本文将带你深入了解<strong style="color:#FFD700">全球四大起泡酒类型</strong>，以及它们背后的秘密。</p>
</section>

<h3>🍾 一、起泡酒四大酿造工艺</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 香槟法（Méthode Champenoise）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>瓶内二次发酵产生气泡<br/>
<strong>• 特点：</strong>最复杂、成本最高、风味最丰富<br/>
<strong>• 气泡：</strong>细腻绵密，持续时间长<br/>
<strong>• 代表：</strong>法国香槟、西班牙卡瓦（Cava）<br/>
<strong>• 注意：</strong>只有法国香槟区可称"Champagne"</p>
</div>

<div class="region-item">
h4>⏰ 罐中发酵法（Charmat Tank Method）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>不锈钢罐内二次发酵<br/>
<strong>• 特点：</strong>成本低效率高，果香新鲜<br/>
<strong>• 气泡：</strong>较大，较为粗糙<br/>
<strong>• 代表：</strong>意大利普罗塞克（Prosecco）、阿斯蒂（Asti）<br/>
<strong>• 注意：</strong>不可标注"传统法"</p>
</div>

<div class="region-item">
h4>🫧 转移法（Transfer Method）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>瓶内发酵后转移到另一瓶<br/>
<strong>• 特点：</strong>兼具瓶中发酵风味和效率<br/>
<parameter name="style">• 代表：</strong>一些澳洲起泡酒<br/>
<strong>• 注意：</strong>品质介于传统法和罐中法之间</p>
</div>

<div class="region-item">
h4>💨 二氧化碳注入法（Carbonation）<h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>直接注入二氧化碳<br/>
<strong>• 特点：</strong>成本最低，气泡粗糙不自然<br/>
<strong>• 代表：</strong>低端起泡酒<br/>
<strong>• 注意：</strong>不建议购买，属于"伪起泡酒"</p>
</div>

</section>

<h3>🗺 二、全球起泡酒产区</h3>
<section style="background:#E1F5FE;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 法国香槟（Champagne）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>起泡酒皇冠上的明珠<br/>
<strong>• 品种：</strong>Chardonnay、Pinot Noir、Meunier<br/>
<strong>• 风格：</strong>干型为主，酸度极高，酵母风味<br/>
<strong>• 分级：</strong>无年份（NV）、年份（Vintage）、白中白（Blanc de Blancs）、黑中白（Blanc de Noirs）<br/>
<strong>• 代表：</strong>Dom Pérignon、Krug、Veuve Clicquot</p>
</div>

<div class="region-item">
🏆 <h4>意大利皮埃蒙特（Piemonte）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 阿斯蒂（Asti DOCG）：</strong>微起泡，甜型，麝香葡萄<br/>
<strong>• 弗朗恰柯塔（Franciacorta DOCG）：</strong>传统法，品质极高<br/>
<strong>• 特点：</strong>从干型到甜型，选择丰富<br/>
<strong>• 代表：</strong>Ca' del Bosco、Gancia、Bellavista</p>
</div>

<div class="region-item">
🏆 <h4>意大利威尼托（Veneto）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 普罗塞克（Prosecco DOC/DOCG）：</strong>全球销量第一的起泡酒<br/>
<strong>• 品种：</strong>Glera<br/>
<strong>• 风格：</strong>果香清新，酒精度低（11-12%）<br/>
<strong>• 类型：</strong>Superiore DOCG、Superiore Rive DOCG<br/>
<strong>• 代表：</strong>Carpenè Malvolti、Bottega、Mionetto</p>
</div>

<div class="region-item">
🏆 <h4>西班牙加泰罗尼亚（Catalunya）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 卡瓦（Cava DO）：</strong>使用传统法但价格亲民<br/>
<strong>• 品种：</strong>Macabeu、Xarel·lo、Parrellada<br/>
<strong>• 特点：</strong>性价比极高，品质逐年提升<br/>
<strong>• 代表：</strong>Freixenet、Codorníu、Juvé Camps</p>
</div>

<div class="region-item">
🏆 <h4>其他产区</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 德国：</strong>Sekt（塞克特）<br/>
<strong>• 法国其他：</strong>Crémant（阿尔萨斯、卢瓦尔河）<br/>
<strong>• 澳大利亚：</strong>传统法起泡酒（塔斯马尼亚）<br/>
<strong>• 美国：</strong>加州起泡酒（Napa、Sonoma）<br/>
<strong>• 南非：</strong>开普起泡酒（Cap Classique）</p>
</div>

</section>

<h3>📊 三、香槟 vs 普罗塞克 vs 卡瓦 对比</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#0277BD;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">香槟</td>
<td style="padding:10px;font-weight:bold">普罗塞克</td>
<td style="padding:10px;font-weight:bold">卡瓦</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>酿造法</strong></td>
<td style="padding:10px;color:#666">传统瓶中发酵</td>
<td style="padding:10px;color:#666">罐中发酵</td>
<td <td style="padding:10px;color:#666">传统瓶中发酵</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#c62828">💰💰💰💰 高</td>
<td style="padding:10px;color:#388e3c">💰 亲民</td>
<td <td style="padding:10px;color:#388e3c">💰💰 中等</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>风格</strong></td>
<td style="padding:10px;color:#666">复杂、酵母、烘烤</td>
<td style="padding:10px;color:#666">清新、果香、轻盈</td>
<td <td style="padding:10px;color:#666">平衡、坚果、细腻</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>甜度</strong></td>
<td style="padding:10px;color:#666">Brut（干型）为主</td>
<td style="padding:10px;color:#666">Extra Dry（半干）</td>
<td <td style="padding:10px;color:#666">Brut（干型）为主</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>气泡</strong></td>
<td style="padding:10px;color:#666">细腻绵密</td>
<td style="padding:10px;color:#666">较大，较粗糙</td>
<td <td style="padding:10px;color:#666">细腻，持续久</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>配餐</strong></td>
<td style="padding:10px;color:#666">鱼子酱、牡蛎、鹅肝</td>
<td style="padding:10px;color:#666">意面、披萨、海鲜</td>
<td <td style="padding:10px;color:#666">西班牙小食、Tapas</td>
</tr>
</table>
</section>

<h3>💰 四、起泡酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-200 元（日常款）</strong><br/>
<span style="color:#666">• 入门级普罗塞克（Prosecco DOC）</span><br/>
<span style="color:#666">• 入门级卡瓦（Cava）</span><br/>
<span style="color:#666">• 法国克雷芒（Crémant）</span><br/>
<span style="color:#666">• 特点：适合日常饮用，果香清新</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 200-500 元（进阶）</strong><br/>
<span style="color:#666">• 中端普罗塞克（Superiore DOCG）</span><br/>
<span style="color:#666">• 入门级年份香槟</span><br/>
<span style="color:#666">• 意大利弗朗恰柯塔</span><br/>
<strong style="color:#c62828">• 特点：可作为礼物，适合聚会</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 500-1500 元（高端）</strong><br/>
<span style="color:#666">• 名庄无年份香槟（Moët、Veuve）</span><br/>
<span style="color:#666">• 优质卡瓦（Reserva）</span><br/>
<span style="color:#666">• 澳洲传统法起泡酒</span><br/>
<strong style="color:#c62828">• 特点：正式场合首选，品质卓越</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 1500元以上（膜拜）</strong><br/>
<span style="color:#666">• 年份香槟（Vintage Champagne）</span><br/>
<span style="color:#666">• 顶级酒庄（Dom Pérignon、Krug）</span><br/>
<span style="color:#666">• 白中白/黑中白珍酿</span><br/>
<strong style="color:#c62828">• 特点：收藏级，可陈年10-20年</strong></p>
</section>

<h3>📅 五、经典年份与评分</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#0277BD;color:white">
<td style="padding:10px;font-weight:bold">产区</td>
<td style="padding:10px;font-weight:bold">优秀年份</td>
<td style="padding:10px;font-weight:bold">备注</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>香槟</strong></td>
<td style="padding:10px;color:#c41e3a">2012、2008、2002、1996</td>
<td <td style="padding:10px;color:#666">传奇年份</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>普罗塞克</strong></td>
<td style="padding:10px;color:#c41e3a">2021、2020、2019</td>
<td <td style="padding:10px;color="#666">新鲜饮用最佳</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>弗朗恰柯塔</strong></td>
<td style="padding:10px;color:#c41e3a">2016、2015、2013</td>
<td <td style="padding:10px;color:#666">品质卓越</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>卡瓦</strong></td>
<td style="padding:10px;color:#c41e3a">2017、2014、2012</td>
<td <td style="padding:10px;color="#666">Reserva级</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>澳洲起泡酒</strong></td>
<td style="padding:10px;color:#c41e3a">2018、2016、2014</td>
<td <td style="padding:10px;color:#666">塔斯马尼亚最佳</td>
</tr>
</table>
</section>

<h3>🍽 六、起泡酒配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🥚 经典搭配：鱼子酱</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 完美组合：</strong>香槟 + 鱼子酱<br/>
<strong>• 原理：</strong>盐分与酸度、旨味的完美碰撞<br/>
<strong>• 小技巧：</strong>用小勺舀起，直接入口</p>
</div>

<div class="region-item">
🦪 <h4>牡蛎</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 经典组合：</strong>香槟/普罗塞克 + 生蚝<br/>
<strong>• 原理：</strong>海的鲜味与气泡的清新<br/>
<strong>• 推荐：</strong>布列塔尼/日本生蚝</p>
</div>

<div class="region-item">
🍕 <h4>意式料理</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 披萨：</strong>玛格丽特披萨 + 普罗塞克<br/>
<strong>• 意面：</strong>海鲜意面 + 普罗塞克<br/>
<strong>• 原理：</strong>清新解腻</p>
</div>

<div class="region-item">
🥟 <h4>亚洲料理</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 中餐：</strong>粤菜点心 + 普罗塞克<br/>
<strong>• 日料：</strong>刺身/天妇罗 + 香槟<br/>
<strong>• 泰餐：</strong>酸辣泰菜 + 普罗塞克（解辣）</p>
</div>

<div class="region-item">
🧁 <h4>甜点</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 水果塔：</strong>普罗塞克<br/>
<parameter name="style">• 闪电泡芙：</strong>香槟<br/>
<strong>• 注意：</strong>酒要比甜点更甜</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：起泡酒就是香槟</strong><br/>
<span style="color:#666">事实上，只有法国香槟区生产的才能叫"Champagne"。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：起泡酒要大力摇匀</strong><br/>
<span style="color:#666">正确方式：轻轻拧开瓶盖，让气泡自然溢出。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：起泡酒不能陈年</strong><br/>
<strong style="color:#666">顶级香槟可陈年10-20年，风味更复杂。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：起泡酒要冰到很冷</strong><br/>
<span style="color:#666">香槟建议8-10℃，普罗塞克6-8℃即可。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：起泡酒只能当开胃酒</strong><br/>
<span style="color:#666">事实上，餐后搭配甜点也非常适合。</span></p>
</section>

<h3>📝 八、香槟标签解读</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px;border-left:3px solid #0277BD">
<p style="color:#01579b;margin:0">
<strong>🥂 类型术语：</strong><br/>
<span style="color:#666">• Brut（干型）：糖分 0-12g/L，最常见</span><br/>
<span style="color:#666">• Extra Brut（极干）：糖分 0-6g/L</span><br/>
<span style="color:#666">• Demi-Sec（半干）：糖分 32-50g/L，可做餐后酒</span><br/>
<span style="color:#666">• Doux（甜型）：糖分 50g/L+，极少见</span><br/><br/>
<strong>🍇 品种术语：</strong><br/>
<span style="color:#666">• Blanc de Blancs（白中白）：100%霞多丽</span><br/>
<span style="color:#666">• Blanc de Noirs（黑中白）：100%黑皮诺/莫尼耶</span><br/>
<span style="color:#666">• Rosé（桃红）：浸渍法或调配法</span><br/><br/>
<strong>📅 年份术语：</strong><br/>
<span style="color:#666">• NV（无年份）：混酿多年基酒</span><br/>
<span style="color:#666">• Vintage（年份）：单一年份葡萄</span><br/>
<span style="color:#666">• Réserve（珍藏）：更高品质基酒</span>
</p>
</section>

<h3>🍸 九、饮用与保存建议</h3>
<section style="background:#f3e5f5;padding:18px;border-radius:8px;border-left:3px solid #7B1FA2">
<p style="color:#4a148c;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 香槟：8-10℃（可边喝边升温）</span><br/>
<span style="color:#666">• 普罗塞克：6-8℃（充分冰镇）</span><br/>
<span style="color:#666">• 卡瓦：8-10℃</span><br/><br/>
<strong>🍷 酒杯选择：</strong><br/>
<span style="color:#666">• 笛型杯（Flute）：保持气泡，适合宴席</span><br/>
<span style="color:#666">• 郁金香杯（Tulip）：聚拢香气，适合品鉴</span><br/>
<span style="color:#666">• 白葡萄酒杯：可通用，需提前冰镇</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 未开瓶：避光保存，12-18℃</span><br/>
<span style="color:#666">• 开瓶后：冰箱保存，1-3天内喝完</span><br/>
<span style="color:#666">• 气泡会随时间消散，开瓶即饮最佳</span><br/>
<span style="color:#666">• 建议：用专业起泡酒塞保存</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#0d47a1,#1565c0);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🥂 结语</p>
<p style="color:#E3F2FD;font-size:14px;line-height:1.8;margin:0">起泡酒不仅仅是一种饮品，更是一种生活态度。从法国香槟的优雅到意大利普罗塞克的随性，从西班牙卡瓦的性价比到南非开普的惊喜——每一瓶起泡酒都在讲述着产区的故事。下次举杯时，不妨细细品味那些跳跃的气泡，感受它们带来的欢乐与祝福。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🥂 生成起泡酒完全指南文章');
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
    title: `🥂 ${date.chinese} 起泡酒完全指南：香槟·卡瓦·普罗塞克·阿斯蒂`,
    author: '红酒顾问',
    digest: '起泡酒是庆祝与欢聚的象征。本文详解四大酿造工艺、全球产区、价格指南和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `sparkling_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'sparkling_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/sparkling_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();