/**
 * 智利葡萄酒入门文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实智利封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实智利封面...');
  
  const coverPath = path.join(__dirname, 'output', 'chile_cover_real.png');
  const prompt = 'Photorealistic Chilean vineyard at sunset, Andes mountains in background, rows of grapevines, wine barrel in foreground, professional photography, warm golden hour lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('chile_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍇 智利葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">赤霞珠 · 佳美娜 · 中央山谷</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'chile_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#1e3c72"/>
      <stop offset="100%" style="stop-color:#2a5298"/>
    </linearGradient>
    <linearGradient id="mtn" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#2d5a27"/>
      <stop offset="100%" style="stop-color:#4a7c42"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  <!-- 安第斯山脉 -->
  <path d="M0,200 L150,100 L300,180 L450,80 L600,150 L750,90 L900,160 L900,250 L0,250 Z" fill="url(#mtn)"/>
  <!-- 葡萄藤 -->
  <g transform="translate(50, 280)" opacity="0.9">
    <circle cx="0" cy="0" r="8" fill="#722F37"/>
    <circle cx="20" cy="5" r="7" fill="#8B0000"/>
    <circle cx="40" cy="-3" r="9" fill="#722F37"/>
    <circle cx="60" cy="8" r="7" fill="#A52A2A"/>
    <circle cx="80" cy="2" r="8" fill="#8B0000"/>
  </g>
  <!-- 酒瓶 -->
  <g transform="translate(400, 100)">
    <path d="M30,200 L50,50 L80,50 L100,200 Z" fill="#722F37" opacity="0.95"/>
    <rect x="55" y="35" width="10" height="15" fill="#5c1a1a"/>
    <path d="M45,55 Q60,40 75,55" fill="none" stroke="#ffd700" stroke-width="2" opacity="0.8"/>
  </g>
  <!-- 标题框 -->
  <g transform="translate(520, 80)">
    <rect x="0" y="0" width="280" height="120" rx="8" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="280" height="120" rx="8" fill="none" stroke="#d4af37" stroke-width="3"/>
    <text x="140" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1e3c72" text-anchor="middle">🍇 智利</text>
    <text x="140" y="85" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="#1e3c72" text-anchor="middle">葡萄酒</text>
  </g>
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#ffd700">🍇 ${date.display} 智利葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">赤霞珠 · 佳美娜 · 中央山谷</text>
  </g>
  <g fill="rgba(255,255,255,0.06)">
    <circle cx="850" cy="50" r="40"/>
    <circle cx="100" cy="350" r="25"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'chile_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成智利葡萄酒入门文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1e3c72; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1e3c72; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1e3c72;">🍇 ${date.chinese} 智利葡萄酒入门</h2>
<p style="text-align: center; color: #666;">赤霞珠 · 佳美娜 · 中央山谷</p>

<section style="background:linear-gradient(135deg,#1e3c72,#2a5298);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">智利是<strong style="color:#ffd700">新世界葡萄酒的代表</strong>，也是<strong style="color:#ffd700">性价比最高</strong>的葡萄酒产国之一。独特的地理环境和悠久的酿酒历史，使其成为品酒爱好者的必选之地。</p>
</section>

<h3>🗺 一、智利葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 五大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 中央山谷（Central Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>智利中部，首都圣地亚哥周边<br/>
<strong>• 品种：</strong>赤霞珠、佳美娜、马尔贝克<br/>
<strong>• 风格：</strong>果味浓郁，单宁柔和，价格亲民<br/>
<strong>• 代表产区：</strong>迈普（Maipo）、科尔查瓜（Colchagua）</p>
</div>

<div class="region-item">
<h4>🏠 麦坡谷（Maipo Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>中央山谷东部，安第斯山麓<br/>
<strong>• 品种：</strong>赤霞珠（智利最佳）<br/>
<strong>• 风格：</strong>酒体饱满，单宁细腻，黑色水果风味<br/>
<strong>• 特点：</strong>被誉为我 Chile 的波尔多</p>
</div>

<div class="region-item">
<h4>🏠 卡萨布兰卡谷（Casablanca Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>沿海地区，太平洋影响<br/>
<strong>• 品种：</strong>霞多丽、长相思<br/>
<strong>• 风格：</strong>酸度清爽，矿物感强，风格清新<br/>
<strong>• 特点：</strong>智利白葡萄酒的明星产区</p>
</div>

<div class="region-item">
<h4>🏠 科尔查瓜谷（Colchagua Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>中央山谷南部<br/>
<strong>• 品种：</strong>佳美娜、赤霞珠、西拉<br/>
<strong>• 风格：</strong>酒体浓郁，果味成熟，结构完整<br/>
<strong>• 特点：</strong>佳美娜的最佳种植区</p>
</div>

<div class="region-item">
<h4>🏠 阿空加瓜谷（Aconcagua Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>北部，靠近沙漠<br/>
<strong>• 品种：</strong>赤霞珠、西拉<br/>
<strong>• 风格：</strong>极深度，高单宁，陈年潜力强<br/>
<strong>• 特点：</strong>智利最热产区之一</p>
</div>

</section>

<h3>🍇 二、智利明星葡萄品种</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 佳美娜（Carmenère）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利的国宝品种，被误认为是梅洛150年<br/>
<strong>• 特点：</strong>紫罗兰、黑樱桃、巧克力风味<br/>
<strong>• 风格：</strong>酒体中等，单宁柔软，酸度适中<br/>
<strong>• 代表产区：</strong>科尔查瓜、卡恰布<br/>
<strong>• 入门价格：</strong>约80-200元</p>
</div>

<div class="region-item">
<h4>🔴 赤霞珠（Cabernet Sauvignon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利最重要的红葡萄品种<br/>
<strong>• 特点：</strong>黑醋栗、薄荷、雪松<br/>
<strong>• 风格：</strong>酒体饱满，单宁强健，陈年潜力佳<br/>
<strong>• 代表产区：</strong>麦坡谷、阿空加瓜<br/>
<strong>• 入门价格：</strong>约100-300元</p>
</div>

<div class="region-item">
<h4>🟡 长相思（Sauvignon Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利白葡萄酒的代表品种<br/>
<strong>• 特点：</strong>青柠、醋栗、百香果<br/>
<strong>• 风格：</strong>酸度清爽，香气活泼<br/>
<strong>• 代表产区：</strong>卡萨布兰卡、莱达<br/>
<strong>• 入门价格：</strong>约60-150元</p>
</div>

<div class="region-item">
<h4>🟡 霞多丽（Chardonnay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利白葡萄酒的另一主力<br/>
<strong>• 特点：</strong>苹果、梨、奶油（桶酿）<br/>
<strong>• 风格：</strong>从清爽到饱满都有<br/>
<strong>• 代表产区：</strong>卡萨布兰卡、圣安东尼奥<br/>
<strong>• 入门价格：</strong>约70-180元</p>
</div>

</section>

<h3>👑 三、传奇酒庄推荐</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 Concha y Toro（干露酒庄）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利最大、历史最悠久的酒庄<br/>
<strong>• 价格：</strong>约100-800元<br/>
<strong>• 特点：</strong>多元化，从入门到顶级都有<br/>
<strong>• 代表作：</strong>Don Melchor、Casillero del Diablo</p>
</div>

<div class="region-item">
<h4>🔴 Almaviva（活灵魂）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利酒王，波雅克与干露的合资<br/>
<strong>• 价格：</strong>约500-2000元<br/>
<strong>• 特点：</strong>法式风格，优雅平衡<br/>
<strong>• 代表作：</strong>Almaviva</p>
</div>

<div class="region-item">
<h4>🔴 Errazuriz（伊拉苏）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利最古老的家族酒庄之一<br/>
<strong>• 价格：</strong>约150-1500元<br/>
<strong>• 特点：</strong>单一葡萄园，顶级品质<br/>
<strong>• 代表作：</strong>Errazuriz Estate、Max</p>
</div>

<div class="region-item">
<h4>🔴 Santa Rita（桑塔瑞塔）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>智利第三大酒庄<br/>
<strong>• 价格：</strong>约80-500元<br/>
<strong>• 特点：</strong>高性价比，获奖无数<br/>
<strong>• 代表作：</strong>Santa Casa、980</p>
</div>

</section>

<h3>💰 四、高性价比酒款推荐</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-150 元（日常）</strong><br/>
<span style="color:#666">• Casillero del Diablo 赤霞珠：干露入门款</span><br/>
<span style="color:#666">• Santa Rita 梅洛：果味柔和</span><br/>
<span style="color:#666">• 特点：适合日常饮用，无需醒酒</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 150-400 元（进阶）</strong><br/>
<span style="color:#666">• Errazuriz 赤霞珠：单一葡萄园</span><br/>
<span style="color:#666">• Concha y Toro 佳美娜：旗舰款</span><br/>
<span style="color:#666">• 特点：可存放3-5年</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 400-1000 元（顶级）</strong><br/>
<span style="color:#666">• Don Melchor：智利赤霞珠标杆</span><br/>
<span style="color:#666">• Almaviva：智利酒王</span><br/>
<strong style="color:#c62828">• 特点：可陈年10-20年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎 1000元以上（膜拜）</strong><br/>
<span style="color:#666">• Seña：智利首款膜拜酒</span><br/>
<span style="color:#666">• Clos de Apalta：科尔查瓜传奇</span><br/>
<strong style="color:#c62828">• 特点：拍卖级，稀缺</strong></p>
</section>

<h3>📅 五、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1e3c72;color:white">
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
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color="#666">优雅平衡，果味纯净</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2019</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color="#666">温暖年份，果味成熟，风格浓郁</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2020</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color="#666">近十年最佳，产量低品质高</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2021</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color="#666">新鲜果味，适合早饮</td>
</tr>
</table>
</section>

<h3>🍷 六、智利 vs 阿根廷</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1e3c72;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">智利</td>
<td style="padding:10px;font-weight:bold">阿根廷</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>旗舰品种</strong></td>
<td style="padding:10px;color:#666">佳美娜、赤霞珠</td>
<td style="padding:10px;color:#666">马尔贝克</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>气候</strong></td>
<td style="padding:10px;color:#666">凉爽海岸到炎热山谷</td>
<td <td style="padding:10px;color:#666">安第斯高海拔，昼夜温差大</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>风格</strong></td>
<td style="padding:10px;color:#666">果味浓郁，柔和易饮</td>
<td <td style="padding:10px;color="#666">结构感强，黑色水果</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>性价比</strong></td>
<td style="padding:10px;color:#666">⭐⭐⭐⭐⭐ 更高</td>
<td <td style="padding:10px;color="#666">⭐⭐⭐⭐ 也很高</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>代表酒庄</strong></td>
<td style="padding:10px;color:#666">Concha y Toro、Errazuriz</td>
<td <td style="padding:10px;color:#666">Catena Zapata、Zuccardi</td>
</tr>
</table>
</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：智利酒都是便宜的</strong><br/>
<span style="color:#666">事实上，智利有膜拜酒（如 Seña、Almaviva），价格可达数千元。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：佳美娜和梅洛是一样的</strong><br/>
<span style="color:#666">佳美娜有独特的紫罗兰和巧克力风味，单宁更细腻。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：智利只产红葡萄酒</strong><br/>
<span style="color:#666">卡萨布兰卡的长相思和霞多丽同样出色，品质世界一流。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：智利酒不需要陈年</strong><br/>
<span style="color:#666">顶级赤霞珠和佳美娜可以陈年10-20年。</span></p>
</section>

<h3>🛒 八、购买与储存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🛒 购买渠道：</strong><br/>
<span style="color:#666">• 电商平台：京东、天猫、盒马</span><br/>
<span style="color:#666">• 专业零售商：也买酒、的酒网</span><br/>
<span style="color:#666">• 酒庄直购：部分酒庄支持直邮</span><br/><br/>
<strong>📦 储存条件：</strong><br/>
<span style="color:#666">• 温度：10-15℃（标准红酒储存）</span><br/>
<span style="color:#666">• 姿势：水平放置</span><br/>
<span style="color:#666">• 避光：避免阳光直射</span><br/><br/>
<strong>⏳ 适饮期：</strong><br/>
<span style="color:#666">• 入门款：1-3年内饮用</span><br/>
<span style="color:#666">• 中端款：3-8年</span><br/>
<span style="color:#666">• 顶级款：10-20年</span><br/><br/>
<strong>💡 配餐建议：</strong><br/>
<span style="color:#666">• 赤霞珠：牛排、烤肉</span><br/>
<span style="color:#666">• 佳美娜：意式炖饭、墨西哥菜</span><br/>
<span style="color:#666">• 长相思：海鲜、沙拉</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1e3c72,#2a5298);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd700;font-size:14px;font-weight:bold;margin-bottom:8px">🍇 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">智利是进入新世界葡萄酒的最佳起点。从几十元的日常餐酒到数千元的膜拜酒，这里满足了所有价位需求。不要被"便宜"的刻板印象限制，智利的顶级佳酿同样值得探索。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍇 生成智利葡萄酒入门文章');
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
    title: `🍇 ${date.chinese} 智利葡萄酒入门：赤霞珠·佳美娜·中央山谷`,
    author: '红酒顾问',
    digest: '智利是新世界葡萄酒的代表，以高性价比著称。本文详解五大产区、明星品种、传奇酒庄和经典年份。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `chile_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'chile_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/chile_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();