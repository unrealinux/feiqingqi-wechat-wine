/**
 * 桃红酒完全指南文章生成器
 * 使用 baoyu-imagine + DashScope 生成写实封面，发布到微信公众号草稿箱
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

/**
 * 使用 baoyu-imagine + DashScope 生成写实桃红酒封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实桃红酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'rose_wine_cover_real.png');
  const prompt = 'Photorealistic glasses of fine rosé wine, summer cocktails, pink wine bottles on table, elegant outdoor dining, fresh berries and peach, romantic setting, soft golden light, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('rose_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF69B4"/>
            <stop offset="100%" style="stop-color:#FF1493"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🥂 桃红酒完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">普罗旺斯 · 桃红葡萄酒 · 夏日特饮</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FF69B4" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'rose_wine_cover_ai.png');
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
      <stop offset="100%" style="stop-color:#2d1f2f"/>
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF69B4"/>
      <stop offset="100%" style="stop-color:#FF1493"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 装饰圆形 -->
  <g opacity="0.2">
    <circle cx="100" cy="100" r="60" fill="#FF69B4"/>
    <circle cx="800" cy="300" r="80" fill="#FF1493"/>
    <circle cx="200" cy="280" r="40" fill="#FF69B4"/>
  </g>
  
  <!-- 桃红酒杯组合 -->
  <g transform="translate(180, 120)">
    <!-- 左杯 -->
    <g transform="translate(0, 0)">
      <path d="M20,100 L28,40 L62,40 L70,100 Z" fill="url(#roseGrad)" opacity="0.7"/>
      <rect x="45" y="20" width="8" height="20" fill="#C71585"/>
      <ellipse cx="45" cy="100" rx="25" ry="5" fill="#C71585"/>
    </g>
    <!-- 中杯 -->
    <g transform="translate(90, 10)">
      <path d="M20,90 L28,35 L62,35 L70,90 Z" fill="url(#roseGrad)" opacity="0.75"/>
      <rect x="45" y="15" width="8" height="20" fill="#C71585"/>
      <ellipse cx="45" cy="90" rx="25" ry="5" fill="#C71585"/>
    </g>
    <!-- 右杯 -->
    <g transform="translate(180, 5)">
      <path d="M20,80 L28,30 L62,30 L70,80 Z" fill="url(#roseGrad)" opacity="0.8"/>
      <rect x="45" y="10" width="8" height="20" fill="#C71585"/>
      <ellipse cx="45" cy="80" rx="25" ry="5" fill="#C71585"/>
    </g>
  </g>
  
  <!-- 桃红酒瓶 -->
  <g transform="translate(550, 140)" opacity="0.8">
    <rect x="35" y="20" width="30" height="90" fill="#FF69B4" rx="2"/>
    <rect x="42" y="0" width="16" height="20" fill="#FF1493"/>
    <rect x="47" y="-8" width="6" height="10" fill="#C71585"/>
    <rect x="38" y="110" width="24" height="25" fill="#E05098"/>
    <!-- 标签 -->
    <rect x="40" y="50" width="20" height="25" fill="#FFF" opacity="0.9"/>
    <text x="50" y="65" font-size="6" fill="#FF1493" text-anchor="middle">Rosé</text>
  </g>
  
  <!-- 草莓装饰 -->
  <g transform="translate(420, 250)">
    <ellipse cx="10" cy="15" rx="12" ry="10" fill="#DC143C"/>
    <ellipse cx="30" cy="20" rx="10" ry="8" fill="#DC143C"/>
    <ellipse cx="50" cy="15" rx="11" ry="9" fill="#DC143C"/>
    <!-- 叶子 -->
    <path d="M10,5 L15,0 L12,5" fill="#228B22"/>
    <path d="M30,10 L35,5 L32,10" fill="#228B22"/>
    <path d="M50,5 L55,0 L52,5" fill="#228B22"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#FF69B4" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#FF1493" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#fff" text-anchor="middle">🥂 桃红酒</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#fff" text-anchor="middle">完全指南</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#C71585" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FF69B4">🥂 ${date.display} 桃红酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">普罗旺斯 · 桃红葡萄酒 · 夏日特饮</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'rose_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成桃红酒完全指南文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF69B4; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #C71585; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #C71585; border-bottom: 2px solid #FF69B4; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #C71585;">🥂 ${date.chinese} 桃红酒完全指南</h2>
<p style="text-align: center; color: #666;">普罗旺斯 · 桃红葡萄酒 · 夏日特饮</p>

<section style="background:linear-gradient(135deg,#2d1f2f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">桃红酒是<strong style="color:#FF69B4">夏日最具代表性的饮品</strong>之一，从法国普罗旺斯的浪漫到西班牙的热情，从桃红的清新到橙粉的深邃。本文将带你全面了解<strong style="color:#FF69B4">桃红酒的世界</strong>。</p>
</section>

<h3>🍇 一、桃红酒四大酿造工艺</h3>
<section style="background:#fff5f8;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🩷 浸渍法（Maceration）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>红葡萄皮与汁液短暂接触（数小时至2天）<br/>
<strong>• 特点：</strong>颜色较深，风味更浓郁，单宁稍多<br/>
<strong>• 典型产区：</strong>普罗旺斯、卢瓦尔河<br/>
<strong>• 代表：</strong>大多数优质桃红酒</p>
</div>

<div class="region-item">
🩷 <h4>放血法（Saignnée）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>红酒发酵时放出部分汁液，剩余皮渣继续浸渍<br/>
<parameter name="style">• 特点：</strong>颜色较浅，果味清新<br/>
<parameter name="style">• 典型产区：</strong>罗纳河谷、朗格多克<br/>
<strong>• 代表：</strong>一些桃红伏特加（Rosé Vodka）</p>
</div>

<div class="region-item">
🩷 <h4>调配法（Assemblage）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>直接混合红葡萄酒和白葡萄酒<br/>
<parameter name="style">• 特点：</strong>颜色稳定，可精确控制风格<br/>
<parameter name="style">• 典型产区：</strong>香槟区（桃红香槟）<br/>
<strong>• 代表：</strong>桃红香槟</p>
</div>

<div class="region-item">
🩷 <h4>灰葡萄法（Gris）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>使用灰葡萄（黑皮诺灰变种）直接压榨<br/>
<parameter name="style">• 特点：</strong>颜色极淡，风格优雅<br/>
<parameter name="style">• 典型产区：</strong>法国阿尔萨斯<br/>
<parameter name="style">• 代表：</strong>阿尔萨斯灰皮诺（Pinot Gris）</p>
</div>

</section>

<h3>🗺 二、全球桃红酒核心产区</h3>
<section style="background:#FFE4E1;padding:18px;border-radius:8px">

<div class="region-item">
🏆 <h4>法国普罗旺斯（Provence）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球桃红酒的故乡和标杆<br/>
<parameter name="style">• 主要品种：</strong>歌海娜、神索、西拉、慕合怀特<br/>
<parameter name="style">• 风格：</strong>干型、清新、红色水果、矿物<br/>
<parameter name="style">• 特点：</strong>必须使用传统方法酿造<br/>
<strong>• 代表酒庄：</strong>Château d'Esclans、Miraval、Domaines Ott</p>
</div>

<div class="region-item">
🏆 <h4>法国卢瓦尔河（Loire）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国第二大桃红酒产区<br/>
<parameter name="style">• 主要品种：</strong>品丽珠、佳美<br/>
<parameter name="style">• 风格：</strong>果味活跃、酸度明显<br/>
<parameter name="style">• 特点：</strong>桃红心血管（Rosé de Loire）AOC<br/>
<strong>• 代表：</strong>Loire Valley Rosé</p>
</div>

<div class="region-item">
🏆 <h4>西班牙（España）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>产量全球第一的桃红生产国<br/>
<parameter name="style">• 主要品种：</strong>丹魄、歌海娜<br/>
<parameter name="style">• 风格：</strong>从干型到半甜，果味丰富<br/>
<parameter name="style">• 特点：</strong>价格亲民，选择多样<br/>
<strong>• 代表：</strong>西班牙DO桃红</p>
</div>

<div class="region-item">
🏆 <h4>意大利（Italia）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 主要产区：</strong>普利亚、托斯卡纳、西西里<br/>
<parameter name="style">• 主要品种：</strong>黑皮诺、桑娇维塞<br/>
<parameter name="style">• 风格：</strong>结构感强，酸度活跃<br/>
<parameter name="style">• 特点：</strong>正在崛起的高品质桃红<br/>
<strong>• 代表：</strong>Tuscany IGT Rosé</p>
</div>

<div class="region-item">
🏆 <h4>美国加州（California）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 主要品种：</strong>赤霞珠、黑皮诺、仙粉黛<br/>
<parameter name="style">• 风格：</strong>果味浓郁、酒体饱满<br/>
<parameter name="style">• 特点：</strong>创新风格，价格跨度大<br/>
<strong>• 代表：</strong>California Rosé</p>
</div>

</section>

<h3>🎨 三、桃红酒颜色分级</h3>
<section style="background:#fff0f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🖤 橙粉（Orange）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 浸渍时间：</strong>最长（数天）<br/>
<parameter name="style">• 特点：</strong>颜色最深，单宁最多，结构感强<br/>
<parameter name="style">• 风格：</strong>更像淡红酒<br/>
<parameter name="style">• 代表：</strong>自然酒桃红、橙色葡萄酒</p>
</div>

<div class="region-item">
🩷 <h4>宝石红（Ruby）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 浸渍时间：</strong>中等（12-48小时）<br/>
<parameter name="style">• 特点：</strong>颜色适中，果味与结构平衡<br/>
<parameter name="style">• 风格：</strong>最具代表性<br/>
<parameter name="style">• 代表：</strong>普罗旺斯精品桃红</p>
</div>

<div class="region-item">
💗 <h4>浅粉（Pink）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 浸渍时间：</strong>短（6-12小时）<br/>
<parameter name="style">• 特点：</strong>颜色清浅，果味清新<br/>
<parameter name="style">• 风格：</strong>轻盈易饮<br/>
<parameter name="style">• 代表：</strong>大多数入门级桃红</p>
</div>

<div class="region-item">
🤍 <h4>鲑鱼红（Salmon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 浸渍时间：</strong>极短（数小时）<br/>
<parameter name="style">• 特点：</strong>颜色最浅，风格优雅<br/>
<parameter name="style">• 风格：</strong>精致细腻<br/>
<parameter name="style">• 代表：</strong>高端普罗旺斯</p>
</div>

</section>

<h3>💰 四、桃红酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 50-120 元（入门）</strong><br/>
<span style="color:#666">• 西班牙入门级桃红</span><br/>
<span style="color:#666">• 法国大区级桃红</span><br/>
<span style="color:#666">• 特点：果香简单，清爽易饮</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 120-300 元（进阶）</strong><br/>
<span style="color:#666">• 普罗旺斯村庄级</span><br/>
<span style="color:#666">• 意大利优质桃红</span><br/>
<strong style="color:#c62828">• 特点：开始展现产区特色</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 300-600 元（高级）</strong><br/>
<span style="color:#666">• 普罗旺斯名庄（Château d'Esclans）</span><br/>
<span style="color:#666">• 桃红香槟</span><br/>
<strong style="color:#c62828">• 特点：可与优质红酒媲美</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 600元以上（高端）</strong><br/>
<span style="color:#666">• 顶级桃红（ Garrus、Whispering Angel）</span><br/>
<span style="color:#666">• 精品桃红香槟</span><br/>
<strong style="color:#c62828">• 特点：膜拜级，稀缺</strong></p>
</section>

<h3>📅 五、经典年份与最佳饮用</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#C71585;color:white">
<td style="padding:10px;font-weight:bold">项目</td>
<td style="padding:10px;font-weight:bold">建议</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>最佳饮用年份</strong></td>
<td style="padding:10px;color:#666">2024、2023、2022（新鲜优先）</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>保质期</strong></td>
<td <td style="padding:10px;color="#666">大多数1-2年，优质可3-5年</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>饮用温度</strong></td>
<td style="padding:10px;color:#666">8-12℃（充分冰镇）</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>最佳场合</strong></td>
<td <td style="padding:10px;color="#666">夏日聚会、海边、野餐、轻松晚宴</td>
</tr>
</table>
</section>

<h3>🍽 六、桃红酒配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🥗 <h4>沙拉与轻食</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 凯撒沙拉：</strong>普罗旺斯桃红<br/>
<strong>• 希腊沙拉：</strong>桃红<br/>
<strong>• 鸡肉沙拉：</strong>任何优质桃红</p>
</div>

<div class="region-item">
🦐 <h4>海鲜</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 虾：</strong>干型桃红<br/>
<parameter name="style">• 生蚝：</strong>卢瓦尔河桃红<br/>
<parameter name="style">• 烤鱼：</strong>普罗旺斯桃红</p>
</div>

<div class="region-item">
🌮 <h4>亚洲料理</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 泰国菜：</strong>桃红（解辣）<br/>
<parameter name="style">• 越南春卷：</strong>干型桃红<br/>
<parameter name="style">• 中餐粤菜：</strong>桃红</p>
</div>

<div class="region-item">
🍕 <h4>西餐</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 披萨：</strong>意大利桃红<br/>
<parameter name="style">• 意面：</strong>桃红<br/>
<parameter name="style">• 法式料理：</strong>普罗旺斯桃红</p>
</div>

<div class="region-item">
🍰 <h4>甜点</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 水果塔：</strong>半甜桃红<br/>
<parameter name="style">• 浆果蛋糕：</strong>桃红<br/>
<parameter name="style">• 注意：酒要比甜点更甜</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：桃红酒是甜酒</strong><br/>
<span style="color:#666">事实上，绝大多数桃红酒是干型（不甜）。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：桃红酒不能陈年</strong><br/>
<span style="color:#666">优质桃红可陈年3-5年，风味更复杂。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：桃红酒没有单宁</strong><br/>
<strong style="color:#666">浸渍法桃红有轻微单宁，口感更丰富。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：桃红酒只适合夏天</strong><br/>
<span style="color:#666">事实上，桃红酒全年皆宜，尤其适合温暖气候。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：桃红酒都是便宜货</strong><br/>
<span style="color:#666">顶级桃红如Garrus价格可与优质红酒媲美。</span></p>
</section>

<h3>📝 八、桃红酒 vs 红白酒</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>🍷 对比：</strong><br/>
<span style="color:#666">• 酿造：浸渍时间短于红酒，长于白酒</span><br/>
<span style="color:#666">• 颜色：介于红酒和白酒之间</span><br/>
<span style="color:#666">• 单宁：少于红酒，多于白酒（或无）</span><br/>
<span style="color:#666">• 风格：兼具红酒的果味和白酒的清爽</span><br/><br/>
<strong>🥂 选择场景：</strong><br/>
<span style="color:#666">• 不知选红酒还是白酒？选桃红！</span><br/>
<span style="color:#666">• 夏日户外？桃红是完美选择</span><br/>
<span style="color:#666">• 海鲜配酒纠结？桃红是安全牌</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2d1f2f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FF69B4;font-size:14px;font-weight:bold;margin-bottom:8px">🥂 结语</p>
<p style="color:#FFE4E1;font-size:14px;line-height:1.8;margin:0">桃红酒是葡萄酒世界中最具夏日氛围的品类。它既有红酒的丰富果味，又有白酒的清爽活泼。无论是海边度假、朋友聚会，还是独自享用晚餐，桃红酒都能为你带来愉悦的体验。现在就打开一瓶冰镇桃红，感受夏日的清凉吧！</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🥂 生成桃红酒完全指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🥂 ${date.chinese} 桃红酒完全指南：普罗旺斯·酿造工艺·配餐`,
    author: '红酒顾问',
    digest: '桃红酒是夏日最具代表性的饮品。本文详解四大酿造工艺、全球核心产区、颜色分级和配餐指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `rose_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'rose_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/rose_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();