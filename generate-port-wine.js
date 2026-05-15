/**
 * 波特酒完全指南文章生成器
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
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

async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实波特酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'port_wine_cover_real.png');
  const prompt = 'Photorealistic Portuguese Port wine glasses, vintage port bottles, old oak barrels in cellar, Douro Valley vineyard hills, ruby red and tawny ports, traditional wine culture, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('port_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#DC143C"/>
            <stop offset="100%" style="stop-color:#8B0000"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🥂 波特酒完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">葡萄牙国酒 · 杜罗河谷 · 加强型葡萄酒</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#DC143C" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'port_wine_cover_ai.png');
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

async function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#2d1f1f"/>
    </linearGradient>
    <linearGradient id="portGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC143C"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 装饰线条 -->
  <g stroke="rgba(220,20,60,0.2)" stroke-width="1">
    <line x1="100" y1="50" x2="150" y2="100"/>
    <line x1="800" y1="330" x2="750" y2="280"/>
  </g>
  
  <!-- 波特酒杯 -->
  <g transform="translate(180, 140)">
    <!-- 波特酒杯 -->
    <g transform="translate(0, 0)">
      <path d="M15,90 L22,35 L58,35 L65,90 Z" fill="url(#portGrad)" opacity="0.8"/>
      <rect x="38" y="20" width="8" height="15" fill="#8B0000"/>
      <ellipse cx="40" cy="90" rx="25" ry="4" fill="#B22222"/>
    </g>
    <!-- 另一杯 -->
    <g transform="translate(90, 15)">
      <path d="M15,75 L22,30 L58,30 L65,75 Z" fill="url(#portGrad)" opacity="0.85"/>
      <rect x="38" y="15" width="8" height="15" fill="#8B0000"/>
      <ellipse cx="40" cy="75" rx="25" ry="4" fill="#B22222"/>
    </g>
  </g>
  
  <!-- 波特酒瓶 -->
  <g transform="translate(480, 150)">
    <rect x="35" y="30" width="30" height="80" fill="#722F37" rx="2"/>
    <rect x="42" y="15" width="16" height="15" fill="#8B0000"/>
    <rect x="47" y="10" width="6" height="8" fill="#2F4F4F"/>
    <rect x="38" y="110" width="24" height="25" fill="#8B0000"/>
    <rect x="40" y="50" width="20" height="25" fill="#DC143C" opacity="0.8"/>
    <text x="50" y="67" font-size="7" fill="#FFD700" text-anchor="middle">Port</text>
  </g>
  
  <!-- 波特酒瓶（茶色） -->
  <g transform="translate(620, 160)" opacity="0.85">
    <rect x="35" y="30" width="30" height="75" fill="#8B4513" rx="2"/>
    <rect x="42" y="15" width="16" height="15" fill="#654321"/>
    <rect x="47" y="10" width="6" height="8" fill="#2F4F4F"/>
    <rect x="38" y="105" width="24" height="20" fill="#5D4037"/>
    <rect x="40" y="50" width="20" height="20" fill="#DAA520" opacity="0.8"/>
    <text x="50" y="64" font-size="7" fill="#2c1810" text-anchor="middle">Tawny</text>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#DC143C" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#8B0000" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#fff" text-anchor="middle">🥂 波特酒</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#fff" text-anchor="middle">完全指南</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#B22222" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#DC143C">🥂 ${date.display} 波特酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">葡萄牙国酒 · 杜罗河谷 · 加强型</text>
  </g>
</svg>`;
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'port_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B0000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B0000; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B0000;">🥂 ${date.chinese} 波特酒完全指南：葡萄牙国酒·杜罗河谷</h2>
<p style="text-align: center; color: #666;">葡萄牙国酒 · 杜罗河谷 · 加强型葡萄酒</p>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">波特酒是<strong style="color:#DC143C">葡萄牙最著名的加强型葡萄酒</strong>，被称为"葡萄牙的国酒"。在杜罗河谷的陡峭梯田上，优质的国产多瑞加葡萄经过独特的酿造工艺，变成了浓郁甜美的波特酒。本文将带你全面了解<strong style="color:#DC143C">波特酒的世界</strong>。</p>
</section>

<h3>🍇 一、波特酒六大类型</h3>
<section style="background:#fff0f0;padding:18px;border-radius:8px">

<div class="region-item">
🔴 <h4>红宝石波特（Ruby Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>年轻风格，深红色，果味浓郁<br/>
<strong>• 风味：</strong>樱桃、草莓、糖果<br/>
<strong>•</strong> 陈酿：</strong>不锈钢桶，保留果味<br/>
<strong>• 价格：</strong>80-200元，最入门<br/>
<strong>• 代表：</strong>Ferreira Ruby、Taylor's Ruby</p>
</div>

<div class="region-item">
🟤 <h4>茶色波特（Tawny Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>氧化风格，琥珀色<br/>
<strong>•</strong> 风味：</strong>坚果、焦糖、皮革、巧克力<br/>
<strong>•</strong> 陈酿：</strong>橡木桶多年，氧化<br/>
<strong>• 价格：</strong>150-400元<br/>
<strong>• 代表：</strong>Taylor's 10yr、Taylors Finest Reserve</p>
</div>

<div class="region-item">
🔴 <h4>年份波特（Vintage Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>最顶级，单一年份葡萄<br/>
<strong>•</strong> 风味：</strong>黑色水果、巧克力、陈年后复杂<br/>
<strong>•</strong> 陈酿：</strong>瓶中陈年，可陈年50年+<br/>
<strong>• 价格：</strong>500-5000元+<br/>
<strong>• 代表：</strong>Taylor's 1994、Famous Vintage</p>
</div>

<div class="region-item">
🔴 <h4>晚装瓶年份波特（LBV - Late Bottled Vintage）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>年份波特风格，更易饮<br/>
<strong>•</strong> 风味：</strong>果味丰富，单宁较软<br/>
<strong>•</strong> 陈酿：</strong>4-6年装瓶<br/>
<strong>• 价格：</strong>150-400元<br/>
<strong>• 代表：</strong>Taylor's LBV、Churchill's LBV</p>
</div>

<div class="region-item">
⚪ <h4>白波特（White Port）</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>白葡萄品种，清新风格<br/>
<strong>•</strong> 风味：</strong>柑橘、蜂蜜、坚果<br/>
<strong>•</strong> 饮用：</strong>冰镇后作为开胃酒<br/>
<strong>•</strong> 价格：</strong>80-200元<br/>
<strong>• 代表：</strong>Ferreira White、Quinta de Ventozelo</p>
</div>

<div class="region-item">
🔴 <h4>克雷森特（Croute）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>极少见，用多品种葡萄<br/>
<strong>•</strong> 风味：</strong>复杂，多层次<br/>
<strong>•</strong> 陈酿：</strong>传统方法<br/>
<strong>•</strong> 价格：</strong>高端稀有<br/>
<strong>• 代表：</strong>极少见</p>
</div>

</section>

<h3>🗺 二、杜罗河谷产区</h3>
<section style="background:#F5F5DC;padding:18px;border-radius:8px">

<div class="region-item">
🏔 <h4>上杜罗（Alto Douro）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>波特酒的核心产区，世界最古老法定产区之一<br/>
<strong>•</strong> 特点：</strong>陡峭梯田，石板土壤，极端气候<br/>
<strong>•</strong> 主要品种：</strong>国产多瑞加（Touriga Nacional）<br/>
<strong>• 代表酒庄：</strong>Quinta do Crasto、Symington</p>
</div>

<div class="region-item">
🏔 <h4>下杜罗（Baixo Douro）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>河谷低地，气候较温和<br/>
<strong>•</strong> 主要品种：</strong>罗丽红（Tinta Roriz）<br/>
<strong>•</strong> 风格：</strong>果味更丰富<br/>
<strong>• 代表：</strong>基础波特酒</p>
</div>

</section>

<h3>🔬 三、波特酒酿造工艺</h3>
<section style="background:#FFE4E1;padding:18px;border-radius:8px">

<div class="region-item">
🔬 <h4>浸渍（Maceration）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>葡萄带皮浸渍，提取颜色和单宁<br/>
<strong>•</strong> 时间：</strong>通常2-3天<br/>
<strong>•</strong> 特点：</strong>保留果味和单宁</p>
</div>

<div class="region-item">
🔬 <h4>加强（Fortification）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>发酵中添加白兰地（77%）终止发酵<br/>
<strong>•</strong> 作用：</strong>保留糖分，提升酒精度至19-22%<br/>
<strong>•</strong> 特点：</strong>甜美浓郁</p>
</div>

<div class="region-item">
🔬 <h4>橡木桶陈酿</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 红宝石：</strong>不锈钢桶，保持果味<br/>
<strong>•</strong> 茶色：</strong>橡木桶多年氧化<br/>
<strong>•</strong> 年份：</strong>瓶中陈酿，可数十年</p>
</div>

</section>

<h3>💰 四、波特酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-200 元（入门）</strong><br/>
<span style="color:#666">• 入门级红宝石波特</span><br/>
<span style="color:#666">• 白波特</span><br/>
<span style="color:#666">• 特点：果香简单，适合日常</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 200-500 元（进阶）</strong><br/>
<span style="color:#666">• 优质茶色波特（10年）</span><br/>
<span style="color:#666">• LBV（晚装瓶年份）<br/>
<strong style="color:#c62828">• 特点：开始展现复杂度</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 500-1500 元（高级）</strong><br/>
<span style="color:#px">• 老年份茶色波特（20-30年）</span><br/>
<span style="color:#px">• 入门级年份波特</span><br/>
<strong style="color:#c62828">• 特点：可陈年10-20年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 1500元以上（高端）</strong><br/>
<span style="color:#px">• 顶级年份波特（Taylor's、Graham's）</span><br/>
<span style="color:#px">• 传奇年份（如1963、1970）</span><br/>
<strong style="color:#c62828">• 特点：收藏级，可陈年50年+</strong></p>
</section>

<h3>📅 五、经典年份与酒庄</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B0000;color:white">
<td style="padding:10px;font-weight:bold">酒庄</td>
<td style="padding:10px;font-weight:bold">特色</td>
<td style="padding:10px;font-weight:bold">代表酒款</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Taylor's</strong></td>
<td style="padding:10px;color:#666">最著名的波特酒商之一</td>
<td style="padding:10px;color:#666">Taylor's Vintage</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Graham's</strong></td>
<td style="padding:10px;color:#666">浓郁甜润风格</td>
<td <td style="padding:10px;color="#666">Graham's 20yo</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Dow's</strong></td>
<td style="padding:10px;color:#666">传统风格，优雅</td>
<td <td style="padding:10px;color="#666">Dow's Vintage</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>Famous</strong></td>
<td style="padding:10px;color:#666">性价比高</td>
<td <td style="padding:10px;color:#666">Famous Vintage</td>
</tr>
</table>
</section>

<h3>🍽 六、波特酒配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🧀 <h4>奶酪</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 蓝纹奶酪：</strong>波特酒（经典组合）<br/>
<strong>•</strong> 斯蒂尔顿：</strong>红宝石波特<br/>
<strong>•</strong> 布里：</strong>茶色波特</p>
</div>

<div class="region-item">
🍫 <h4>甜点</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 巧克力：</strong>年份波特（浓郁配浓郁）<br/>
<strong>•</strong> 焦糖布丁：</strong>茶色波特<br/>
<strong>•</strong> 核桃派：</strong>波特酒</p>
</div>

<div class="region-item">
🥜 <h4>坚果</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 核桃：</strong>茶色波特<br/>
<strong>•</strong> 杏仁：</strong>红宝石波特<br/>
<strong>•</strong> 腰果：</strong>波特酒</p>
</div>

<div class="region-item">
🍷 <h4>餐后酒</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 雪茄：</strong>年份波特<br/>
<strong>•</strong> 单独饮用：</strong>任何优质波特<br/>
<strong>•</strong> 特点：</strong>完美餐后结束</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：波特酒都是甜的</strong><br/>
<span style="color:#666">确实，波特酒大多数是甜型，但白波特有干型风格。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：波特酒要喝新鲜的</strong><br/>
<span style="color:#666">年份波特可陈年50年+，越老越有价值。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：波特酒是奶奶喝的酒</strong><br/>
<strong style="color:#666">事实上，顶级年份波特是收藏家的目标。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：波特酒不需要醒酒</strong><br/>
<span style="color:#666">年份波特建议醒酒1-2小时。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：波特酒比雪莉酒高级</strong><br/>
<span style="color:#666">两者风格不同，没有高下之分。</span></p>
</section>

<h3>📝 八、波特酒 vs 雪莉酒</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>🍷 对比：</strong><br/>
<span style="color:#666">• 产地：波特酒来自葡萄牙，雪莉酒来自西班牙</span><br/>
<span style="color:#px">• 品种：波特用国产多瑞加，雪莉用帕洛米诺</span><br/>
<span style="color:#666">• 风格：波特以甜型为主，雪莉从干到甜都有</span><br/>
<span style="color:#px">• 陈酿：波特有年份和茶色之分</span><br/><br/>
<strong>🥂 选择：</strong><br/>
<span style="color:#px">• 喜欢浓郁甜酒？选波特</span><br/>
<span style="color:#px">• 喜欢多样化？选雪莉</span><br/>
<span style="color:#px">• 配蓝纹奶酪？两者都绝佳</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#DC143C;font-size:14px;font-weight:bold;margin-bottom:8px">🥂 结语</p>
<p style="color:#FFE4E1;font-size:14px;line-height:1.8;margin:0">波特酒是葡萄牙的国宝，拥有超过300年的历史。从平价的红宝石到昂贵的年份波特，从作为开胃酒到餐后甜点，波特酒的世界同样丰富多彩。如果你还没有尝试过波特酒，不妨从一杯茶色波特开始，感受这份来自杜罗河谷的浓郁与甜美。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🥂 生成波特酒完全指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🥂 ${date.chinese} 波特酒完全指南：葡萄牙国酒·杜罗河谷`,
    author: '红酒顾问',
    digest: '波特酒是葡萄牙最著名的加强型葡萄酒。本文详解六大类型、酿造工艺、核心产区和配餐指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `port_wine_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  console.log('📤 发布到微信公众号草稿箱...');
  
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
    const coverPath = path.join(__dirname, 'output', 'port_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/port_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();