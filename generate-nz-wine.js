/**
 * 新西兰葡萄酒指南文章生成器
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实新西兰葡萄酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'nz_wine_cover_real.png');
  const prompt = 'Photorealistic New Zealand wine region, Marlborough Sauvignon blanc vineyards, snow-capped mountains in background, wine bottles, Hawke Bay landscape, sustainable farming, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('nz_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00FF7F"/>
            <stop offset="100%" style="stop-color:#228B22"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 新西兰葡萄酒指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">马尔堡长相思 · 中奥塔哥黑皮诺 · 可持续种植</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#00FF7F" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'nz_wine_cover_ai.png');
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

function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0f2027"/>
    </linearGradient>
    <linearGradient id="nzGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00FF7F"/>
      <stop offset="100%" style="stop-color:#228B22"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 新西兰雪山 -->
  <g transform="translate(100, 80)">
    <polygon points="0,60 50,0 100,40 150,10 200,50 250,0 300,30 350,10 400,40 450,20 500,50 550,15 600,45 650,20 700,50 750,25 800,55 850,30 900,60 900,100 0,100" fill="#E0FFFF" opacity="0.6"/>
    <polygon points="0,80 80,40 160,70 240,30 320,60 400,25 480,55 560,35 640,65 720,40 800,70 900,80 900,100 0,100" fill="#B0E0E6" opacity="0.4"/>
  </g>
  
  <!-- 葡萄园 -->
  <g transform="translate(150, 200)">
    <polygon points="0,50 100,40 200,50 300,35 400,45 500,40 600,50 700,35 800,45 900,50 900,100 0,100" fill="#228B22" opacity="0.8"/>
    <polygon points="50,100 150,90 250,100 350,85 450,95 550,90 650,100 750,85 850,95 900,100 900,130 50,130" fill="#2E8B57" opacity="0.7"/>
  </g>
  
  <!-- 新西兰酒瓶 -->
  <g transform="translate(520, 170)">
    <rect x="30" y="30" width="28" height="75" fill="#228B22" rx="2"/>
    <rect x="38" y="15" width="12" height="15" fill="#006400"/>
    <rect x="42" y="8" width="5" height="10" fill="#2F4F4F"/>
    <rect x="33" y="50" width="20" height="25" fill="#00FF7F" opacity="0.9"/>
    <text x="43" y="65" font-size="6" fill="#006400" text-anchor="middle">NZ</text>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#00FF7F" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#228B22" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🍷 新西兰</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">葡萄酒指南</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#228B22" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#00FF7F">🍷 ${date.display} 新西兰葡萄酒指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">马尔堡 · 中奥塔哥 · 可持续种植</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'nz_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #228B22; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #228B22; border-bottom: 2px solid #00FF7F; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #228B22;">🍷 ${date.chinese} 新西兰葡萄酒指南：马尔堡·中奥塔哥</h2>
<p style="text-align: center; color: #666;">马尔堡长相思 · 中奥塔哥黑皮诺 · 可持续种植</p>

<section style="background:linear-gradient(135deg,#0f2027,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#98FB98;font-size:16px;line-height:1.9">新西兰是<strong style="color:#00FF7F">全球最年轻的葡萄酒产区之一</strong>，但却以惊人的速度崛起。马尔堡的长相思已经成为世界标杆，中奥塔哥的黑皮诺同样令人惊艳。本文将带你深入了解<strong style="color:#00FF7F">南半球最闪耀的葡萄酒新星</strong>。</p>
</section>

<h3>🗺 一、新西兰核心产区</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px">

<div class="region-item">
🏆 <h4>马尔堡（Marlborough）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰最大、最著名的产区<br/>
<strong>• 主要品种：</strong>长相思（占70%）、黑皮诺、霞多丽<br/>
<strong>• 特点：</strong>青草、百香果、矿物，酸度活跃<br/>
<strong>• 代表酒庄：</strong>Cloudy Bay、Villa Maria、Kim Crawford、Saint Clair</p>
</div>

<div class="region-item">
🏆 <h4>中奥塔哥（Central Otago）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰唯一的大陆性气候产区<br/>
<strong>•</strong> 主要品种：</strong>黑皮诺（占80%+）<br/>
<strong>•</strong> 特点：</strong>红色水果、泥土、复杂，风格独特<br/>
<strong>•</strong> 代表酒庄：</strong>Felton Road、Aron Hill、Peregrine</p>
</div>

<div class="region-item">
🏆 <h4>霍克斯湾（Hawke's Bay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰第二大产区，最古老的产区之一<br/>
<strong>•</strong> 主要品种：</strong>赤霞珠、梅洛、霞多丽<br/>
<strong>•</strong> 特点：</strong>成熟果味，结构感强<br/>
<strong>•</strong> 代表酒庄：</strong>Church Road、Te Mata、Craggy Range</p>
</div>

<div class="region-item">
🏆 <h4>马丁堡（Martinborough）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>小型精品产区，凉爽气候<br/>
<strong>•</strong> 主要品种：</strong>黑皮诺、长相思<br/>
<strong>•</strong> 特点：</strong>优雅细腻，风格类似中奥塔哥<br/>
<strong>•</strong> 代表酒庄：</strong>Auntsfield、Pernod Ricard</p>
</div>

<div class="region-item">
🏆 <h4>怀托帕（Waitaki Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新兴优质产区，石灰岩土壤<br/>
<strong>•</strong> 主要品种：</strong>黑皮诺、长相思、灰皮诺<br/>
<strong>•</strong> 特点：</strong>矿物质风味，独特风土<br/>
<strong>•</strong> 代表酒庄：</strong>Dry River、Mount Difficulty</p>
</div>

</section>

<h3>🍇 二、新西兰特色品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
⚪ <h4>长相思（Sauvignon Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰旗舰品种，世界最佳长相思之一<br/>
<strong>• 特点：</strong>青草、百香果、番石榴、醋栗、矿物<br/>
<strong>•</strong> 口感：</strong>酸度活泼，清爽不甜<br/>
<strong>• 代表：</strong>马尔堡长相思</p>
</div>

<div class="region-item">
🔴 <h4>黑皮诺（Pinot Noir）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰第二大明星品种<br/>
<strong>•</strong> 特点：</strong>樱桃、覆盆子、泥土、香料<br/>
<strong>•</strong> 口感：</strong>酒体轻盈，单宁细腻<br/>
<strong>• 代表：</strong>中奥塔哥黑皮诺</p>
</div>

<div class="region-item">
⚪ <h4>霞多丽（Chardonnay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新西兰重要白葡萄品种<br/>
<strong>•</strong> 特点：</strong>柑橘、苹果、奶油（橡木桶）<br/>
<strong>•</strong> 口感：</strong>酒体中等至饱满<br/>
<strong>• 代表：</strong>霍克斯湾霞多丽</p>
</div>

<div class="region-item">
🔴 <h4>西拉（Syrah）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新兴潜力品种<br/>
<strong>•</strong> 特点：</strong>黑色水果、 pepper、香料<br/>
<strong>•</strong> 口感：</strong>酒体饱满<br/>
<strong>• 代表：</strong>霍克斯湾西拉</p>
</div>

</section>

<h3>🌿 三、新西兰可持续种植</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">

<div class="region-item">
🌿 <h4>有机种植（Organic）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 现状：</strong>越来越多的酒庄获得有机认证<br/>
<strong>•</strong> 特点：</strong>不使用合成农药和化肥<br/>
<strong>•</strong> 代表酒庄：</strong>Cloudy Bay、Felton Road</p>
</div>

<div class="region-item">
🌿 <h4>生物动力法（Biodynamic）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 现状：</strong>少数酒庄采用<br/>
<strong>•</strong> 特点：</strong>遵循自然能量循环<br/>
<strong>•</strong> 代表酒庄：</strong>Hawksridge、Vrede</p>
</div>

<div class="region-item">
🌿 <h4>Sustainable Winegrowing NZ</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 现状：</strong>新西兰官方可持续认证项目<br/>
<strong>•</strong> 覆盖率：</strong>96%以上葡萄园参与<br/>
<strong>•</strong> 特点：</strong>环境保护、资源节约</p>
</div>

</section>

<h3>💰 四、新西兰葡萄酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-200 元（入门）</strong><br/>
<span style="color:#666">• 马尔堡入门级长相思</span><br/>
<span style="color:#666">• 基础黑皮诺</span><br/>
<span style="color:#666">• 特点：果香新鲜，性价比极高</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 200-400 元（进阶）</strong><br/>
<span style="color:#666">• 马尔堡精选长相思</span><br/>
<span style="color:#666">• 中奥塔哥入门黑皮诺<br/>
<strong style="color:#c62828">• 特点：开始展现产区特色</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 400-800 元（高级）</strong><br/>
<span style="color:#666">• 名庄长相思（Cloudy Bay）</span><br/>
<span style="color:#666">• 中奥塔哥优质黑皮诺<br/>
<strong style="color:#c62828">• 特点：可对标勃艮第入门</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800元以上（高端）</strong><br/>
<span style="color:#666">• 顶级黑皮诺（Felton Road）</span><br/>
<span style="color:#666">• 霞多丽特酿<br/>
<strong style="color:#c62828">• 特点：对标世界顶级</strong></p>
</section>

<h3>📅 五、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#228B22;color:white">
<td style="padding:10px;font-weight:bold">品种</td>
<td style="padding:10px;font-weight:bold">优秀年份</td>
<td style="padding:10px;font-weight:bold">备注</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>长相思</strong></td>
<td style="padding:10px;color:#c41e3a">2024、2022、2021、2020</td>
<td style="padding:10px;color:#666">新鲜优先</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>黑皮诺</strong></td>
<td style="padding:10px;color:#c41e3a">2021、2019、2018、2016</td>
<td <td style="padding:10px;color="#666">中奥塔哥卓越</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>霞多丽</strong></td>
<td style="padding:10px;color:#c41e3a">2022、2020、2019</td>
<td <td style="padding:10px;color="#666">霍克斯湾</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>赤霞珠</strong></td>
<td style="padding:10px;color:#c41e3a">2019、2018、2016</td>
<td <td style="padding:10px;color="#666">霍克斯湾</td>
</tr>
</table>
</section>

<h3>🍽 六、新西兰葡萄酒配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🦐 <h4>海鲜</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 生蚝：</strong>马尔堡长相思（经典组合）<br/>
<strong>•</strong> 虾：</strong>长相思<br/>
<strong>•</strong> 扇贝：</strong>霞多丽</p>
</div>

<div class="region-item">
🥗 <h4>轻食</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 沙拉：</strong>长相思<br/>
<strong>•</strong> 蔬菜意面：</strong>长相思<br/>
<strong>•</strong> 烤鸡：</strong>霞多丽</p>
</div>

<div class="region-item">
🍖 <h4>肉类</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 鸭肉：</strong>中奥塔哥黑皮诺<br/>
<strong>•</strong> 羊肉：</strong>黑皮诺、西拉<br/>
<strong>•</strong> 牛肉：</strong>霍克斯湾赤霞珠</p>
</div>

<div class="region-item">
🧀 <h4>奶酪</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 山羊奶酪：</strong>长相思<br/>
<strong>•</strong> 软质奶酪：</strong>黑皮诺<br/>
<strong>•</strong> 硬质奶酪：</strong>霞多丽</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：新西兰只有长相思</strong><br/>
<span style="color:#666">事实上，中奥塔哥黑皮诺同样世界闻名。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：新西兰酒都是便宜货</strong><br/>
<span style="color:#666">顶级黑皮诺价格可达数百美元。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：长相思要趁新鲜喝</strong><br/>
<strong style="color:#666">优质长相思可陈年3-5年。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：黑皮诺不如勃艮第</strong><br/>
<span style="color:#666">中奥塔哥黑皮诺有自己的独特风格。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：新西兰是新产品</strong><br/>
<span style="color:#666">1985年才开始商业化，但发展迅速。</span></p>
</section>

<h3>📝 八、新西兰 vs 其他新世界</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>🍷 对比：</strong><br/>
<span style="color:#666">• 智利：价格更亲民，风格更浓郁</span><br/>
<span style="color:#666">• 阿根廷：马尔贝克为主，浓郁度高</span><br/>
<span style="color:#666">• 澳大利亚：设拉子为主，风格多样</span><br/>
<span style="color:#666">• 新西兰：长相思最佳，纯净自然</span><br/><br/>
<strong>🌿 特色：</strong><br/>
<span style="color:#666">• 可持续种植领先（96%+参与）</span><br/>
<span style="color:#666">• 纯净自然风格</span><br/>
<span style="color:#666">• 小型精品酒庄多</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#0f2027,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#00FF7F;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#98FB98;font-size:14px;line-height:1.8;margin:0">新西兰用短短几十年时间，从一个不为人知的农业国家，成长为世界顶级葡萄酒产区。这里的长相思以独特的青草香气和活泼酸度征服了全球消费者，中奥塔哥的黑皮诺同样展现出令人惊叹的潜力。如果你还没有尝试过新西兰葡萄酒，现在正是最好的时机。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成新西兰葡萄酒指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 新西兰葡萄酒指南：马尔堡·中奥塔哥`,
    author: '红酒顾问',
    digest: '新西兰是全球最年轻的葡萄酒产区之一。本文详解核心产区、代表品种、可持续种植和价格指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `nz_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'nz_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/nz_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();