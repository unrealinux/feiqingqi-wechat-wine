/**
 * 阿根廷马尔贝克文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实阿根廷封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实阿根廷马尔贝克封面...');
  
  const coverPath = path.join(__dirname, 'output', 'argentina_malbec_cover_real.png');
  const prompt = 'Photorealistic Argentine vineyard at sunset, Andes mountains in background, rows of Malbec grapevines, high altitudevineyard landscape, wine bottle in foreground, professional photography, warm golden hour lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('argentina_malbec_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#8B4513"/>
            <stop offset="100%" style="stop-color:#CD853F"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🌙 阿根廷马尔贝克入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">门多萨 · 高海拔 · 安第斯山</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#CD853F" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'argentina_malbec_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#2c1810"/>
      <stop offset="100%" style="stop-color:#4a2c20"/>
    </linearGradient>
    <linearGradient id="mtnGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#8B4513"/>
      <stop offset="50%" style="stop-color:#A0522D"/>
      <stop offset="100%" style="stop-color:#D2691E"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 安第斯山脉 -->
  <path d="M0,180 L100,120 L200,160 L350,80 L500,140 L650,70 L800,130 L900,100 L900,220 L0,220 Z" fill="url(#mtnGrad)" opacity="0.9"/>
  
  <!-- 马尔贝克葡萄串 -->
  <g transform="translate(80, 250)" opacity="0.85">
    <circle cx="0" cy="0" r="9" fill="#722F37"/>
    <circle cx="18" cy="5" r="8" fill="#8B0000"/>
    <circle cx="36" cy="-3" r="9" fill="#722F37"/>
    <circle cx="54" cy="7" r="8" fill="#8B0000"/>
    <circle cx="72" cy="2" r="9" fill="#722F37"/>
  </g>
  
  <!-- 酒瓶 -->
  <g transform="translate(400, 120)">
    <path d="M25,160 L45,50 L75,50 L95,160 Z" fill="#722F37" opacity="0.95"/>
    <rect x="52" y="35" width="10" height="15" fill="#4a1c1a"/>
    <ellipse cx="60" cy="160" rx="35" ry="8" fill="#5c1a1a"/>
    <path d="M45,60 Q60,45 75,60" fill="none" stroke="#CD853F" stroke-width="2" opacity="0.7"/>
  </g>
  
  <!-- 葡萄藤装饰 -->
  <g transform="translate(650, 280)">
    <path d="M0,0 Q20,-20 40,0 Q60,-20 80,0" fill="none" stroke="#228B22" stroke-width="3" opacity="0.7"/>
    <circle cx="10" cy="-5" r="5" fill="#722F37"/>
    <circle cx="30" cy="5" r="5" fill="#8B0000"/>
    <circle cx="50" cy="-5" r="5" fill="#722F37"/>
    <circle cx="70" cy="5" r="5" fill="#8B0000"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(520, 60)">
    <rect x="0" y="0" width="300" height="130" rx="8" fill="#CD853F" opacity="0.95"/>
    <rect x="0" y="0" width="300" height="130" rx="8" fill="none" stroke="#8B4513" stroke-width="3"/>
    <text x="150" y="50" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">🌙 阿根廷</text>
    <text x="150" y="95" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="white" text-anchor="middle">马尔贝克</text>
    <line x1="50" y1="110" x2="250" y2="110" stroke="white" stroke-width="2" opacity="0.5"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#CD853F">🌙 ${date.display} 阿根廷马尔贝克入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">门多萨 · 高海拔 · 安第斯山</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'argentina_malbec_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成阿根廷马尔贝克文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #722F37; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #722F37; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #722F37;">🌙 ${date.chinese} 阿根廷马尔贝克入门</h2>
<p style="text-align: center; color: #666;">门多萨 · 高海拔 · 安第斯山</p>

<section style="background:linear-gradient(135deg,#2c1810,#4a2c20);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5deb3;font-size:16px;line-height:1.9">马尔贝克是<strong style="color:#ffd700">阿根廷的国宝品种</strong>，被誉为"阿根廷的赤霞珠"。这种葡萄在法国卡奥尔籍籍无名，却在阿根廷的安第斯山麓绽放出极致光彩，成为全球最受欢迎的红葡萄酒之一。</p>
</section>

<h3>🗺 一、马尔贝克产区地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 核心产区：</strong></p>

<div class="region-item">
<h4>🏠 门多萨（Mendoza）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>阿根廷最大、最重要的葡萄酒产区<br/>
<strong>• 气候：</strong>大陆性气候，干燥少雨<br/>
<strong>• 灌溉：</strong>安第斯山冰雪融水灌溉<br/>
<strong>• 代表子产区：</strong>Luján de Cuyo、Uco Valley、Maipú</p>
</div>

<div class="region-item">
<h4>🏠 卢汉德库约（Luján de Cuyo）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>马尔贝克的发源地，第一个DOC<br/>
<strong>• 海拔：</strong>900-1100米<br/>
<strong>• 特点：</strong>老藤马尔贝克，风味浓郁<br/>
<strong>• 代表酒庄：</strong>Catena Zapata、Zuccardi</p>
</div>

<div class="region-item">
<h4>🏠 乌科谷（Uco Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>新兴高品质产区<br/>
<strong>• 海拔：</strong>1000-1500米（最高海拔）<br/>
<strong>• 特点：</strong>酸度更高，单宁更细腻<br/>
<strong>• 代表酒庄：</strong>Achaval Ferrer、Salentein</p>
</div>

<div class="region-item">
<h4>🏠 萨尔塔（Salta）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>世界最高海拔葡萄园之一<br/>
<• 海拔：</strong>1500-3000米<br/>
<strong>• 特点：</strong>极端气候，浓郁果味<br/>
<strong>• 代表酒庄：</strong>Colomé、Cafayate</p>
</div>

</section>

<h3>⛰ 二、高海拔的魅力</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🌡 高海拔优势</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 昼夜温差：</strong>白天25°C，夜间10°C，酸度完美保留<br/>
<strong>• 强紫外线：</strong>促进酚类物质成熟，风味浓郁<br/>
<strong>• 更长生长季：</strong>缓慢成熟，风味更复杂<br/>
<strong>• 更少病虫害：</strong>干燥气候减少农药使用</p>
</div>

<div class="region-item">
<h4>📊 海拔与风格</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 900-1100米：</strong>果味浓郁，酒体饱满<br/>
<strong>• 1100-1400米：</strong>酸度更好，结构更紧致<br/>
<strong>• 1400米+：</strong>极致优雅，矿物感强</p>
</div>

</section>

<h3>🍇 三、马尔贝克完全指南</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 什么是马尔贝克？</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原产地：</strong>法国卡奥尔（Cahors）<br/>
<strong>• 历史：</strong>1860年代传入阿根廷，现在是阿根廷代名词<br/>
<strong>• 特点：</strong>紫罗兰、黑莓、李子、巧克力<br/>
<strong>• 风格：</strong>酒体饱满，单宁中等偏高，酸度适中</p>
</div>

<div class="region-item">
<h4>🍷 葡萄酒风格</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 入门款（Uneg）：</strong>果味直接，简单易饮<br/>
<strong>• 进阶款（Reserva）：</strong>橡木桶陈酿，风味复杂<br/>
<strong>• 顶级款（Gran Reserva）：</strong>老藤，低产量，结构完美</p>
</div>

</section>

<h3>👑 四、传奇酒庄推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 Catena Zapata（卡氏家族）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>阿根廷最著名的家族酒庄<br/>
<strong>• 价格：</strong>约200-1500元<br/>
<strong>• 特点：</strong>马尔贝克先驱，高海拔葡萄园<br/>
<strong>• 代表作：</strong>Catena Zapata Malbec、Nicotelo</p>
</div>

<div class="region-item">
<h4>🔴 Zuccardi（祖卡迪）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>门多萨最具创新精神的酒庄<br/>
<strong>• 价格：</strong>约150-800元<br/>
<strong>• 特点：</strong>专注单一葡萄园，表达风土<br/>
<strong>• 代表作：</strong>Zuccardi Aluvional、Finca Piedra Infinita</p>
</div>

<div class="region-item">
<h4>🔴 Achaval Ferrer（阿查瓦尔费雷尔）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>乌科谷马尔贝克标杆<br/>
<strong>• 价格：</strong>约200-1200元<br/>
<strong>• 特点：</strong>老藤，低干预，极致纯净<br/>
<strong>• 代表作：</strong>Achaval Ferrer Malbec、Finca Mirador</p>
</div>

<div class="region-item">
<h4>🔴 Kaiken（凯肯）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>高性价比之选<br/>
<strong>• 价格：</strong>约80-400元<br/>
<strong>• 特点：</strong>家族传承，品质稳定<br/>
<strong>• 代表作：</strong>Kaiken Ultra、Kaiken Mai</p>
</div>

</section>

<h3>💰 五、价格与性价比</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-200 元（日常）</strong><br/>
<span style="color:#666">• Kaiken Ultra：性价比之王</span><br/>
<span style="color:#666">• Trapiche Iscay：入门级精品</span><br/>
<span style="color:#666">• 特点：果味直接，单宁柔和</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 200-600 元（进阶）</strong><br/>
<span style="color:#666">• Catena Zapata：品质保证</span><br/>
<span style="color:#666">• Zuccardi Serie A：清新优雅</span><br/>
<strong style="color:#c62828">• 特点：可存放3-8年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 600-2000 元（顶级）</strong><br/>
<span style="color:#666">• Catena Zapata Adrianna：世界级</span><br/>
<span style="color:#666">• Zuccardi Aluvional：表达风土</span><br/>
<strong style="color:#c62828">• 特点：可陈年15-30年</strong></p>
</section>

<h3>🍷 六、马尔贝克 vs 赤霞珠</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#722F37;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">马尔贝克（阿根廷）</td>
<td style="padding:10px;font-weight:bold">赤霞珠（全球）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>主要风格</strong></td>
<td style="padding:10px;color:#666">酒体饱满，果味浓郁</td>
<td style="padding:10px;color:#666">结构性强，单宁突出</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>典型香气</strong></td>
<td style="padding:10px;color:#666">紫罗兰、黑莓、巧克力</td>
<td <td style="padding:10px;color:#666">黑醋栗、薄荷、雪松</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>单宁</strong></td>
<td style="padding:10px;color:#666">中等偏高，柔软</td>
<td <td style="padding:10px;color:#666">高，坚实</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>配餐</strong></td>
<td style="padding:10px;color:#666">烤肉、阿斯多（阿根廷烤肉）</td>
<td <td style="padding:10px;color:#666">牛排、烧烤</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#666">⭐⭐⭐⭐⭐ 更亲民</td>
<td <td style="padding:10px;color:#666">⭐⭐⭐⭐ 稍贵</td>
</tr>
</table>
</section>

<h3>📅 七、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#722F37;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">评分</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2019</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，结构完美</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2017</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅平衡，果味纯净</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2020</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">现代风格，果味成熟</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2016</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">良好年份，陈年潜力佳</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2021</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">新鲜果味，适合早饮</td>
</tr>
</table>
</section>

<h3>💡 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：马尔贝克只产自阿根廷</strong><br/>
<span style="color:#666">法国卡奥尔（ Cahors）是马尔贝克原产地，智利、美国也有种植。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：马尔贝克只适合配烤肉</strong><br/>
<span style="color:#666">其实配意式炖饭、墨西哥菜、甚至烤鸭都很精彩。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：马尔贝克没有陈年潜力</strong><br/>
<strong style="color:#666">顶级马尔贝克可陈年15-30年，风味更复杂。</strong></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：马尔贝克酒精度都高</strong><br/>
<span style="color:#666">高海拔马尔贝克可以做到13-14%酒精度，平衡优雅。</span></p>
</section>

<h3>🍸 九、饮用与保存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 最佳温度：16-18℃（室温）</span><br/>
<span style="color:#666">• 入门款：可轻微冰镇（14-16℃）</span><br/><br/>
<strong>🍷 醒酒建议：</strong><br/>
<span style="color:#666">• 入门款：开瓶即饮</span><br/>
<span style="color:#666">• 进阶款：醒酒30分钟</span><br/>
<span style="color:#666">• 顶级款：醒酒1-2小时</span><br/><br/>
<strong>🍽 配餐建议：</strong><br/>
<span style="color:#666">• 经典搭配：阿根廷烤肉（Asado）</span><br/>
<span style="color:#666">• 创意搭配：意式炖饭、墨西哥玉米饼</span><br/>
<span style="color:#666">• 奶酪搭配：蓝纹奶酪、硬质成熟奶酪</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 未开瓶：避光保存，12-18℃</span><br/>
<span style="color:#666">• 入门款：1-3年内饮用</span><br/>
<span style="color:#666">• 顶级款：可陈年10-20年</span><br/>
<span style="color:#666">• 开瓶后：可保存3-5天（冷藏）</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2c1810,#4a2c20);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd700;font-size:14px;font-weight:bold;margin-bottom:8px">🌙 结语</p>
<p style="color:#f5deb3;font-size:14px;line-height:1.8;margin:0">马尔贝克是阿根廷葡萄酒的名片，从几十元的日常餐酒到数千元的膜拜级，这里的选择丰富多样。不要被"配烤肉"的刻板印象限制——这粒来自法国的种子，在安第斯山麓找到了最完美的家园。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🌙 生成阿根廷马尔贝克入门文章');
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
    title: `🌙 ${date.chinese} 阿根廷马尔贝克入门：门多萨·高海拔·安第斯山`,
    author: '红酒顾问',
    digest: '马尔贝克是阿根廷的国宝品种，在安第斯山麓绽放出极致光彩。本文详解产区、风土、传奇酒庄和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `argentina_malbec_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'argentina_malbec_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/argentina_malbec_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();