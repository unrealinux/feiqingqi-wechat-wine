/**
 * 中国葡萄酒文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实中国葡萄酒封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实中国葡萄酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'china_wine_cover_real.png');
  const prompt = 'Photorealistic Chinese winery landscape, modern vineyards in Ningxia, chateau-style winery buildings, wine barrels in cellars, Chinese winemakers working, sunset over desert vineyards, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('china_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#DC143C"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🇨🇳 中国葡萄酒</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">宁夏 · 烟台 · 新疆 · 云南</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'china_wine_cover_ai.png');
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
      <stop offset="100%" style="stop-color:#2d1f1f"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#DC143C"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 贺兰山远景 -->
  <g transform="translate(0, 100)">
    <polygon points="0,80 100,30 200,60 300,20 400,50 500,10 600,40 700,20 800,60 900,40 900,150 0,150" fill="#4a3728" opacity="0.5"/>
    <polygon points="0,100 150,60 300,80 450,40 600,70 750,50 900,90 900,150 0,150" fill="#3d2d20" opacity="0.4"/>
  </g>
  
  <!-- 葡萄园梯田 -->
  <g transform="translate(80, 220)">
    <polygon points="0,40 30,35 60,40 90,30 120,35 150,40 180,25 180,80 0,80" fill="#228B22" opacity="0.8"/>
    <polygon points="40,80 70,75 100,80 130,70 160,75 190,80 190,120 40,120" fill="#2E8B57" opacity="0.8"/>
    <polygon points="80,120 110,115 140,120 170,110 200,115 230,120 230,150 80,150" fill="#228B22" opacity="0.8"/>
  </g>
  
  <!-- 酒庄建筑 -->
  <g transform="translate(600, 160)">
    <rect x="0" y="30" width="100" height="60" fill="#D2691E" rx="3"/>
    <polygon points="0,30 50,-10 100,30" fill="#8B4513"/>
    <rect x="25" y="45" width="20" height="25" fill="#2F4F4F" rx="2"/>
    <rect x="60" y="45" width="20" height="25" fill="#2F4F4F" rx="2"/>
    <rect x="110" y="10" width="30" height="80" fill="#D2691E" rx="2"/>
    <polygon points="110,10 125,-15 140,10" fill="#8B4513"/>
    <rect x="118" y="20" width="12" height="15" fill="#2F4F4F" rx="2"/>
  </g>
  
  <!-- 酒瓶 -->
  <g transform="translate(480, 230)">
    <rect x="15" y="30" width="25" height="60" fill="#722F37" rx="2"/>
    <rect x="22" y="15" width="10" height="15" fill="#8B0000"/>
    <rect x="25" y="10" width="5" height="8" fill="#2F4F4F"/>
    <rect x="18" y="45" width="18" height="20" fill="#FFD700" opacity="0.8"/>
    <text x="27" y="58" font-size="8" fill="#8B4513" text-anchor="middle">中国</text>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#DC143C" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#2c1810" text-anchor="middle">🇨🇳 中国葡萄酒</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#2c1810" text-anchor="middle">崛起中的东方佳酿</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#DC143C" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🇨🇳 ${date.display} 中国葡萄酒</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">宁夏 · 烟台 · 新疆 · 云南</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'china_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成中国葡萄酒文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #DC143C; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #B22222; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #B22222; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #B22222;">🇨🇳 ${date.chinese} 中国葡萄酒：崛起中的东方佳酿</h2>
<p style="text-align: center; color: #666;">宁夏 · 烟台 · 新疆 · 云南</p>

<section style="background:linear-gradient(135deg,#1a1a2e,#2d1f1f);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">中国葡萄酒产业<strong style="color:#FFD700">正在迅速崛起</strong>，从宁夏贺兰山到新疆天山，从山东蓬莱到云南香格里拉，越来越多的优质产区开始在国际舞台上崭露头角。本文将带你全面了解<strong style="color:#FFD700">中国葡萄酒的四大核心产区</strong>。</p>
</section>

<h3>🏔 一、中国葡萄酒四大产区</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 宁夏贺兰山（Ningxia）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>中国葡萄酒的核心产区，贺兰山东麓葡萄酒地理标志<br/>
<strong>• 位置：</strong>宁夏回族自治区，银川周边<br/>
<strong>• 气候：</strong>大陆性干旱气候，日照充足，昼夜温差大<br/>
<strong>• 土壤：</strong>砾石土壤，排水良好<br/>
<strong>• 主要品种：</strong>赤霞珠、蛇龙珠、梅洛、霞多丽<br/>
<strong>• 特点：</strong>颜色深邃，单宁厚实，黑色果香<br/>
<strong>• 代表酒庄：</strong>贺兰山银色高地、迦南美地、张裕摩塞尔十五世、志辉源石</p>
</div>

<div class="region-item">
🏆 <h4>山东烟台（Yantai）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>中国葡萄酒的发源地，亚洲唯一的国际葡萄与葡萄酒城<br/>
<parameter name="style">• 位置：</strong>山东省烟台市，蓬莱沿海<br/>
<parameter name="style">• 气候：</strong>海洋性气候，温和湿润<br/>
<parameter name="style">• 土壤：</strong>沙质土壤，富含矿物质<br/>
<parameter name="style">• 主要品种：</strong>赤霞珠、霞多丽、贵人香、蛇龙珠<br/>
<parameter name="style">• 特点：</strong>果香浓郁，酸度适中<br/>
<strong>• 代表酒庄：</strong>张裕、长城、君顶、拉菲（山东）</p>
</div>

<div class="region-item">
🏆 <h4>新疆天山（Tianshan）</h4>
<p style="color:#333;line-height:1.8;margin:0"><parameter name="style">• 地位：</strong>中国最大的酿酒葡萄种植区<br/>
<parameter name="style">• 位置：</strong>新疆维吾尔自治区，天山北麓<br/>
<parameter name="style">• 气候：</strong>干旱大陆性气候，日照长达3000小时<br/>
<parameter name="style">• 土壤：</strong>灰钙土，富含钾、磷<br/>
<parameter name="style">• 主要品种：</strong>赤霞珠、霞多丽、白玉霓<br/>
<parameter name="style">• 特点：</strong>颜色深浓，糖分高，酒精感强<br/>
<strong>• 代表酒庄：</strong>中信国安、楼兰、乡都、天山冰湖</p>
</div>

<div class="region-item">
🏆 <h4>云南香格里拉（Shangri-La）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>中国最高海拔的葡萄酒产区<br/>
<parameter name="style">• 位置：</strong>云南省迪庆藏族自治州<br/>
<parameter name="style">• 气候：</strong>高原气候，昼夜温差极大<br/>
<parameter name="style">• 土壤：</strong>高山土壤，矿物质丰富<br/>
<parameter name="style">• 主要品种：</strong>赤霞珠、霞多丽<br/>
<parameter name="style">• 特点：</strong>酸度活跃，香气清新，风格独特<br/>
<strong>• 代表酒庄：</strong>敖云、香格里拉高原、纬度</p>
</div>

<div class="region-item">
🏆 <h4>其他产区</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 河北昌黎：</strong>中国干红葡萄酒之乡<br/>
<strong>• 山西汾阳：</strong>中国最早葡萄酒基地之一<br/>
<strong>• 吉林通化：</strong>山葡萄酒特色产区<br/>
<strong>• 四川阿坝：</strong>高原冰葡萄酒</p>
</div>

</section>

<h3>🍇 二、中国特色葡萄品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 蛇龙珠（Cabernet Gernischt）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>中国特色品种，仅在烟台大面积种植<br/>
<strong>• 特点：</strong>具有独特的植物香气，类似青椒和树叶<br/>
<strong>• 口感：</strong>酒体中等，单宁细腻<br/>
<strong>• 代表：</strong>张裕解百纳（主要成分）</p>
</div>

<div class="region-item">
🔴 <h4>马瑟兰（Marselan）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国品种，在中国表现优异<br/>
<parameter name="style">• 特点：</strong>果香浓郁，单宁细腻<br/>
<parameter name="style">• 口感：</strong>颜色深，结构好<br/>
<strong>• 代表：</strong>宁夏多个酒庄的马瑟兰单品</p>
</div>

<div class="region-item">
🔴 <h4>北醇（Beichun）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>中国杂交品种<br/>
<parameter name="style">• 特点：</strong>抗寒性强，适应性好<br/>
<parameter name="style">• 口感：</strong>颜色深，酸度高<br/>
<strong>• 代表：</strong>东北地区冰葡萄酒</p>
</div>

<div class="region-item">
⚪ <h4>贵人香（Italian Riesling）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>山东传统白葡萄品种<br/>
<parameter name="style">• 特点：</strong>花香突出，酸度适中<br/>
<parameter name="style">• 口感：</strong>清爽宜人<br/>
<strong>• 代表：</strong>张裕霞多丽</p>
</div>

</section>

<h3>💰 三、中国葡萄酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 50-120 元（入门）</strong><br/>
<span style="color:#666">• 国产大区级干红</span><br/>
<span style="color:#666">• 入门级赤霞珠</span><br/>
<span style="color:#666">• 特点：适合日常饮用</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 120-300 元（进阶）</strong><br/>
<span style="color:#666">• 宁夏产区入门</span><br/>
<span style="color:#666">• 烟台/新疆优质干红</span><br/>
<strong style="color:#c62828">• 特点：开始展现产区特色</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 300-800 元（高级）</strong><br/>
<span style="color:#666">• 宁夏贺兰山精选</span><br/>
<span style="color:#666">• 特色品种（如蛇龙珠、马瑟兰）</span><br/>
<strong style="color:#c62828">• 特点：可对标进口中级酒</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800元以上（高端）</strong><br/>
<span style="color:#666">• 宁夏膜拜酒庄（银色高地、迦南美地）</span><br/>
<span style="color:#666">• 云南高原敖云</span><br/>
<strong style="color:#c62828">• 特点：对标国际名庄</strong></p>
</section>

<h3>📅 四、中国葡萄酒发展历程</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#B22222;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">里程碑事件</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>1892</strong></td>
<td style="padding:10px;color:#666">张裕在烟台创立，中国现代葡萄酒工业开端</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>1996</strong></td>
<td style="padding:10px;color:#666">宁夏贺兰山开始大面积种植酿酒葡萄</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2000</strong></td>
<td style="padding:10px;color:#666">宁夏产区开始进入快速发展期</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2011</strong></td>
<td style="padding:10px;color:#666">贺兰山东麓获得地理标志产品保护</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2015</strong></td>
<td style="padding:10px;color:#666">宁夏成功举办中国首届国际葡萄酒博览会</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2020</strong></td>
<td style="padding:10px;color:#666">中国葡萄酒出口量居全球前列</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2024</strong></td>
<td style="padding:10px;color:#666">宁夏产区多次获得国际大赛金奖</td>
</tr>
</table>
</section>

<h3>🏆 五、中国知名酒庄</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏰 宁夏贺兰山酒庄</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 银色高地：</strong>中国膜拜酒庄，家族式精品<br/>
<strong>• 迦南美地：</strong>近年崛起迅速，品质卓越<br/>
<strong>• 志辉源石：</strong>生态友好型酒庄<br/>
<strong>• 贺兰晴雪：</strong>宁夏代表性精品酒庄</p>
</div>

<div class="region-item">
🏰 <h4>山东烟台酒庄</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 张裕：</strong>中国最古老葡萄酒企业<br/>
<strong>• 长城（烟台）：</strong>国有大型酒庄<br/>
<strong>• 君顶：</strong>高端精品酒庄</p>
</div>

<div class="region-item">
🏰 <h4>新疆产区</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 中信国安：</strong>新疆最大葡萄酒企业<br/>
<parameter name="style">• 楼兰：</strong>吐鲁番老藤葡萄特色</p>
</div>

<div class="region-item">
🏰 <h4>云南高原</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 敖云：</strong>酩悦轩尼诗旗下，中国最贵葡萄酒之一<br/>
<parameter name="style">• 香格里拉：</strong>高原风土特色</p>
</div>

</section>

<h3>🍽 六、中国葡萄酒配餐指南</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🍖 中式肉类</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 烤羊肉：</strong>宁夏赤霞珠（经典搭配）<br/>
<strong>• 红烧肉：</strong>马瑟兰（解腻）<br/>
<strong>• 炖牛肉：</strong>蛇龙珠</p>
</div>

<div class="region-item">
🥘 <h4>中式菜肴</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 火锅：</strong>果香型干红<br/>
<parameter name="style">• 炒菜：</strong>霞多丽干白<br/>
<strong>• 烧烤：</strong>赤霞珠</p>
</div>

<div class="region-item">
🧀 <h4>西餐搭配</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 牛排：</strong>宁夏高端赤霞珠<br/>
<parameter name="style">• 海鲜：</strong>山东霞多丽<br/>
<strong>• 意面：</strong>马瑟兰</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：中国葡萄酒不如进口</strong><br/>
<span style="color:#666">事实上，宁夏葡萄酒多次获得国际大赛金奖。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：只有赤霞珠</strong><br/>
<span style="color:#666">中国已种植马瑟兰、霞多丽等多种国际品种。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：中国不适合种葡萄</strong><br/>
<strong style="color:#666">宁夏贺兰山、新疆天山的自然条件非常优越。</strong></p>

<p style="color:#c62828;line-height:1.8">❌ <strong>误区4：葡萄酒历史短</strong><br/>
<span style="color:#666">张裕创立于1892年，已有130多年历史。</span></p>
</section>

<h3>📝 八、中国葡萄酒选购指南</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>✅ 选购技巧：</strong><br/>
<span style="color:#666">• 看产区：宁夏贺兰山品质最佳</span><br/>
<span style="color:#666">• 看品种：马瑟兰、蛇龙珠是中国特色</span><br/>
<span style="color:#666">• 看年份：优质年份如2015、2017、2020</span><br/>
<span style="color:#666">• 看酒庄：知名酒庄品质更有保障</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 避光保存，12-15℃</span><br/>
<span style="color:#666">• 优质酒可陈年5-15年</span><br/>
<span style="color:#666">• 开瓶后尽快饮用</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a1a2e,#2d1f1f);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🇨🇳 结语</p>
<p style="color:#FFE4C4;font-size:14px;line-height:1.8;margin:0">中国葡萄酒产业虽然起步较晚，但发展迅速。宁夏贺兰山、新疆天山、山东烟台等产区正在用品质证明：中国也能酿出世界级的优质葡萄酒。作为消费者，我们期待更多优质、平价的国产佳酿出现在餐桌上。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🇨🇳 生成中国葡萄酒文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🇨🇳 ${date.chinese} 中国葡萄酒：崛起中的东方佳酿`,
    author: '红酒顾问',
    digest: '中国葡萄酒产业正在迅速崛起。本文详解四大核心产区、代表品种、知名酒庄和选购指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `china_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'china_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/china_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();