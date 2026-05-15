/**
 * 葡萄品种大全文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实葡萄品种封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实葡萄品种封面...');
  
  const coverPath = path.join(__dirname, 'output', 'grape_varieties_cover_real.png');
  const prompt = 'Photorealistic collection of wine grape varieties, fresh grape clusters on vine, red grapes and white grapes, vineyard leaves, wine making ingredients, elegant dark background, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('grape_varieties_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#228B22"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍇 葡萄品种大全</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">红葡萄 · 白葡萄 · 常见品种 · 特色品种</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'grape_varieties_cover_ai.png');
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
      <stop offset="100%" style="stop-color:#0f1f0f"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC143C"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#228B22"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 葡萄串 - 红葡萄 -->
  <g transform="translate(150, 150)">
    <ellipse cx="30" cy="20" rx="25" ry="18" fill="url(#redGrad)" opacity="0.9"/>
    <ellipse cx="55" cy="35" rx="22" ry="16" fill="url(#redGrad)" opacity="0.9"/>
    <ellipse cx="20" cy="50" rx="20" ry="15" fill="url(#redGrad)" opacity="0.9"/>
    <ellipse cx="50" cy="70" rx="23" ry="17" fill="url(#redGrad)" opacity="0.9"/>
    <ellipse cx="30" cy="90" rx="20" ry="14" fill="url(#redGrad)" opacity="0.9"/>
    <!-- 葡萄藤 -->
    <path d="M30,0 L30,20" stroke="#228B22" stroke-width="3" fill="none"/>
    <path d="M30,0 Q40,-10 30,-20 Q20,-10 30,0" fill="#228B22"/>
  </g>
  
  <!-- 葡萄串 - 白葡萄 -->
  <g transform="translate(350, 160)">
    <ellipse cx="30" cy="20" rx="22" ry="16" fill="#F0E68C" opacity="0.9"/>
    <ellipse cx="52" cy="32" rx="20" ry="14" fill="#F0E68C" opacity="0.9"/>
    <ellipse cx="18" cy="45" rx="18" ry="13" fill="#F0E68C" opacity="0.9"/>
    <ellipse cx="45" cy="60" rx="21" ry="15" fill="#F0E68C" opacity="0.9"/>
    <ellipse cx="25" cy="78" rx="18" ry="13" fill="#F0E68C" opacity="0.9"/>
    <!-- 葡萄藤 -->
    <path d="M30,0 L30,20" stroke="#228B22" stroke-width="3" fill="none"/>
    <path d="M30,0 Q40,-10 30,-20 Q20,-10 30,0" fill="#228B22"/>
  </g>
  
  <!-- 葡萄串 - 黑葡萄 -->
  <g transform="translate(550, 155)">
    <ellipse cx="28" cy="18" rx="20" ry="15" fill="#2F1B1B" opacity="0.95"/>
    <ellipse cx="48" cy="30" rx="18" ry="13" fill="#2F1B1B" opacity="0.95"/>
    <ellipse cx="20" cy="45" rx="17" ry="12" fill="#2F1B1B" opacity="0.95"/>
    <ellipse cx="42" cy="58" rx="19" ry="14" fill="#2F1B1B" opacity="0.95"/>
    <ellipse cx="25" cy="75" rx="17" ry="12" fill="#2F1B1B" opacity="0.95"/>
    <!-- 葡萄藤 -->
    <path d="M28,0 L28,18" stroke="#228B22" stroke-width="3" fill="none"/>
    <path d="M28,0 Q38,-10 28,-20 Q18,-10 28,0" fill="#228B22"/>
  </g>
  
  <!-- 葡萄叶 -->
  <g transform="translate(700, 180)" opacity="0.7">
    <path d="M0,30 Q15,0 30,30 Q45,0 60,30 Q45,60 30,30 Q15,60 0,30" fill="#228B22"/>
    <line x1="30" y1="30" x2="30" y2="60" stroke="#1a5c1a" stroke-width="2"/>
    <line x1="30" y1="30" x2="15" y2="45" stroke="#1a5c1a" stroke-width="1.5"/>
    <line x1="30" y1="30" x2="45" y2="45" stroke="#1a5c1a" stroke-width="1.5"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="350" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="350" height="130" rx="10" fill="none" stroke="#228B22" stroke-width="4"/>
    <text x="175" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🍇 葡萄品种大全</text>
    <text x="175" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">红葡萄 · 白葡萄</text>
    <line x1="70" y1="110" x2="280" y2="110" stroke="#228B22" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🍇 ${date.display} 葡萄品种大全</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">红葡萄 · 白葡萄 · 常见品种 · 特色品种</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'grape_varieties_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成葡萄品种大全文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #228B22; }
  .grape-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .grape-item h4 { color: #228B22; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #228B22; border-bottom: 2px solid #228B22; padding-bottom: 8px; margin-top: 25px; }
  .red-grape { border-left-color: #8B0000; }
  .white-grape { border-left-color: #DAA520; }
</style>

<h2 style="text-align: center; color: #228B22;">🍇 ${date.chinese} 葡萄品种大全：红葡萄·白葡萄完全指南</h2>
<p style="text-align: center; color: #666;">红葡萄 · 白葡萄 · 常见品种 · 特色品种</p>

<section style="background:linear-gradient(135deg,#0f1f0f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E8F5E9;font-size:16px;line-height:1.9">葡萄是葡萄酒的灵魂。<strong style="color:#FFD700">全球有超过1000种酿酒葡萄</strong>，但真正广泛种植的仅有几十种。从赤霞珠到霞多丽，从黑皮诺到长相思——这篇文章将带你全面了解<strong style="color:#FFD700">最重要的葡萄品种</strong>。</p>
</section>

<h3>🔴 一、红葡萄品种TOP10</h3>
<section style="background:#fff5f5;padding:18px;border-radius:8px">

<div class="grape-item" style="border-left:4px solid #8B0000">
<h4>🥇 赤霞珠（Cabernet Sauvignon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球种植面积第一的红葡萄品种<br/>
<strong>• 特点：</strong>黑色水果（黑醋栗）、青椒、烟熏、单宁强壮<br/>
<strong>• 口感：</strong>酒体饱满，单宁明显，陈年潜力强<br/>
<strong>• 典型产区：</strong>波尔多、纳帕谷、库纳瓦拉<br/>
<strong>• 代表酒：</strong>拉菲、opus one、作品一号</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🥈 <h4>梅洛（Merlot）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球第二大红葡萄品种<br/>
<parameter name="style">• 特点：</strong>红色水果（樱桃、草莓）、李子、巧克力<br/>
<parameter name="style">• 口感：</strong>酒体中等，单宁柔滑，易入口<br/>
<parameter name="style">• 典型产区：</strong>波尔多右岸、美国加州<br/>
<strong>• 代表酒：</strong>柏图斯（Petrus）、白马酒庄</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🥉 <h4>黑皮诺（Pinot Noir）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>最娇贵的红葡萄品种"葡萄皇后"<br/>
<parameter name="style">• 特点：</strong>红色水果（覆盆子、樱桃）、花香、泥土<br/>
<parameter name="style">• 口感：</strong>酒体轻盈，单宁细腻，酸度高<br/>
<parameter name="style">• 典型产区：</strong>勃艮第、新西兰、美国俄勒冈<br/>
<strong>• 代表酒：</strong>罗曼尼·康帝、膜拜酒</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>西拉（Syrah）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国北罗纳的王者<br/>
<parameter name="style">• 特点：</strong>黑色水果、黑胡椒、烟熏、皮革<br/>
<parameter name="style">• 口感：</strong>酒体饱满，单宁强壮<br/>
<parameter name="style">• 典型产区：</strong>埃米塔日、罗第丘、澳大利亚<br/>
<strong>• 代表酒：</strong>Chapoutier、Penfolds Grange</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>歌海娜（Grenache）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>西班牙和南罗纳的主力品种<br/>
<parameter name="style">• 特点：</strong>红色水果、甘草、甜香料、酒精感强<br/>
<parameter name="style">• 口感：</strong>酒体圆润，酒精感明显<br/>
<parameter name="style">• 典型产区：</strong>教皇新堡、里奥哈、普里奥拉托<br/>
<strong>• 代表酒：</strong>Château Rayas</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>桑娇维塞（Sangiovese）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>意大利的代表性品种<br/>
<parameter name="style">• 特点：</strong>酸樱桃、草本、烟草、皮革<br/>
<parameter name="style">• 口感：</strong>酸度高，单宁中等到强<br/>
<parameter name="style">• 典型产区：</strong>基安蒂、蒙塔奇诺<br/>
<strong>• 代表酒：</strong>布鲁奈罗、Sassicaia</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>丹魄（Tempranillo）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>西班牙的国宝级品种<br/>
<parameter name="style">• 特点：</strong>李子、无花果、烟草、皮革<br/>
<parameter name="style">• 口感：</strong>酒体中等，单宁细腻<br/>
<parameter name="style">• 典型产区：</strong>里奥哈、杜埃罗河岸、葡萄牙<br/>
<strong>• 代表酒：</strong>Vega Sicilia、Pingus</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>品丽珠（Cabernet Franc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>赤霞珠的父本，波尔多右岸常客<br/>
<parameter name="style">• 特点：</strong>青椒、覆盆子、花香、草本<br/>
<parameter name="style">• 口感：</strong>单宁较轻，酸度活跃<br/>
<parameter name="style">• 典型产区：</strong>波尔多右岸、卢瓦尔河谷<br/>
<strong>• 代表酒：</strong>白马酒庄（混酿）</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>慕合怀特（Mourvèdre）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南罗纳和西班牙的重要品种<br/>
<parameter name="style">• 特点：</strong>野味、皮革、黑色水果、单宁重<br/>
<parameter name="style">• 口感：</strong>酒体饱满，颜色深<br/>
<parameter name="style">• 典型产区：</strong>教皇新堡、邦多勒<br/>
<strong>• 代表酒：</strong>Château Beaucastel</p>
</div>

<div class="grape-item" style="border-left:4px solid #8B0000">
🏅 <h4>内比奥罗（Nebbiolo）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>意大利皮埃蒙特之王"酒王之后"<br/>
<parameter name="style">• 特点：</strong>焦油、玫瑰、樱桃、巧克力<br/>
<parameter name="style">• 口感：</strong>高酸高单宁，需要长时间陈年<br/>
<parameter name="style">• 典型产区：</strong>巴罗洛、巴巴莱斯科<br/>
<strong>• 代表酒：</strong>巴罗洛珍藏</p>
</div>

</section>

<h3>⚪ 二、白葡萄品种TOP10</h3>
<section style="background:#fffef5;padding:18px;border-radius:8px">

<div class="grape-item" style="border-left:4px solid #DAA520">
<h4>🥇 霞多丽（Chardonnay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球种植面积第一的白葡萄品种<br/>
<strong>• 特点：</strong>柑橘、苹果、奶油、烘烤（橡木桶）<br/>
<strong>• 口感：</strong>酒体饱满，从清爽到浓郁多样<br/>
<strong>• 典型产区：</strong>勃艮第、香槟、加州、智利<br/>
<strong>• 代表酒：</strong>Montrachet、克伦费尔</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🥈 <h4>长相思（Sauvignon Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>最受欢迎的白葡萄品种之一<br/>
<parameter name="style">• 特点：</strong>青草、百香果、番石榴、矿物<br/>
<parameter name="style">• 口感：</strong>酸度高，清爽活泼<br/>
<parameter name="style">• 典型产区：</strong>卢瓦尔河谷、新西兰、马尔堡<br/>
<strong>• 代表酒：</strong>Sancerre、Puligny-Montrachet</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🥉 <h4>雷司令（Riesling）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>德国国宝品种，甜酒专家<br/>
<parameter name="style">• 特点：</strong>柠檬、青苹果、蜂蜜、汽油（陈年后）<br/>
<parameter name="style">• 口感：</strong>酸度高，从干型到极甜<br/>
<parameter name="style">• 典型产区：</strong>德国摩泽尔、阿尔萨斯、澳大利亚<br/>
<strong>• 代表酒：</strong>Egon Müller</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>灰皮诺（Pinot Gris）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>黑皮诺的变种，风格多样<br/>
<parameter name="style">• 特点：</strong>梨子、桃、甜瓜、香料<br/>
<parameter name="style">• 口感：</strong>酒体中等，酸度中低<br/>
<parameter name="style">• 典型产区：</strong>阿尔萨斯、意大利上阿迪杰<br/>
<parameter name="style">• 代表酒：</strong>Trimbach灰皮诺</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>维欧尼（Viognier）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国北罗纳的特色品种<br/>
<parameter name="style">• 特点：</strong>杏子、桃子、橙花、薰衣草<br/>
<parameter name="style">• 口感：</strong>酒体丰满，酸度中低<br/>
<parameter name="style">• 典型产区：</strong>孔德里约、澳大利亚<br/>
<parameter name="style">• 代表酒：</strong>Condrieu</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>赛美蓉（Semillon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>苏玳贵腐酒的核心品种<br/>
<parameter name="style">• 特点：</strong>柠檬、蜂蜜、蜂蜡、烘烤<br/>
<parameter name="style">• 口感：</strong>酒体饱满，干型和甜型皆可<br/>
<parameter name="style">• 典型产区：</strong>苏玳、猎人谷<br/>
<parameter name="style">• 代表酒：</strong>滴金酒庄（Yquem）</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>琼瑶浆（Gewürztraminer）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>最具特色的芳香型白葡萄<br/>
<parameter name="style">• 特点：</strong>荔枝、玫瑰、香料、热带水果<br/>
<parameter name="style">• 口感：</strong>酒体饱满，酸度低<br/>
<parameter name="style">• 典型产区：</strong>阿尔萨斯、德国<br/>
<parameter name="style">• 代表酒：</strong>Trimbach琼瑶浆</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>白诗南（Chenin Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国卢瓦尔河谷的核心品种<br/>
<parameter name="style">• 特点：</strong>苹果、蜂蜜、矿物质<br/>
<parameter name="style">• 口感：</strong>酸度高，从干到甜多样<br/>
<parameter name="style">• 典型产区：</strong>卢瓦尔河谷、南非<br/>
<parameter name="style">• 代表酒：</strong>Vouvray</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>玛珊（Marsanne）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国北罗纳白葡萄酒主力<br/>
<parameter name="style">• 特点：</strong>梨子、坚果、蜂蜜<br/>
<parameter name="style">• 口感：</strong>酒体饱满，可陈年<br/>
<parameter name="style">• 典型产区：</strong>埃米塔日、克罗兹<br/>
<parameter name="style">• 代表酒：</strong>Hermitage白</p>
</div>

<div class="grape-item" style="border-left:4px solid #DAA520">
🏅 <h4>小粒白麝香（Muscat Blanc à Petits Grains）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>最古老的酿酒葡萄之一<br/>
<parameter name="style">• 特点：</strong>葡萄、橙花、茉莉花<br/>
<parameter name="style">• 口感：</strong>甜型为主，香气浓郁<br/>
<parameter name="style">• 典型产区：</strong>阿斯蒂、麝香加强酒<br/>
<parameter name="style">• 代表酒：</strong>Asti DOCG</p>
</div>

</section>

<h3>🍇 三、葡萄品种配餐指南</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">

<div class="grape-item">
<h4>🍖 红酒配红肉</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 赤霞珠：</strong>牛排、烤肉、炖牛肉<br/>
<strong>• 西拉：</strong>羊肉、烧烤、野味<br/>
<strong>• 梅洛：</strong>猪肉、禽类、意式炖肉</p>
</div>

<div class="grape-item">
🦐 <h4>白酒配海鲜</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 霞多丽：</strong>龙虾、扇贝、奶油酱海鲜<br/>
<parameter name="style">• 长相思：</strong>生蚝、青口、刺身<br/>
<parameter name="style">• 雷司令：</strong>清蒸鱼、亚洲海鲜</p>
</div>

<div class="grape-item">
🧀 <h4>奶酪搭配</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 赤霞珠：</strong>切达、帕玛森<br/>
<parameter name="style">• 黑皮诺：</strong>布里、卡芒贝尔<br/>
<parameter name="style">• 雷司令：</strong>山羊奶酪</p>
</div>

<div class="grape-item">
🥗 <h4>素食搭配</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 长相思：</strong>沙拉、蔬菜意面<br/>
<parameter name="style">• 灰皮诺：</strong>蘑菇、烩菜<br/>
<parameter name="style">• 梅洛：</strong>烤蔬菜、披萨</p>
</div>

</section>

<h3>📊 四、红白品种对比</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#228B22;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">红葡萄</td>
<td style="padding:10px;font-weight:bold">白葡萄</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>果肉颜色</strong></td>
<td style="padding:10px;color:#666">无色（仅果皮有色）</td>
<td <td style="padding:10px;color="#666">无色</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>主要成分</strong></td>
<td style="padding:10px;color:#666">单宁、花青素</td>
<td <td style="padding:10px;color="#666">酸度、芳香物质</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>酒体</strong></td>
<td style="padding:10px;color:#666">通常更饱满</td>
<td <td style="padding:10px;color="#666">通常更轻盈</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>适饮温度</strong></td>
<td style="padding:10px;color:#666">14-16℃</td>
<td <td style="padding:10px;color="#666">8-12℃</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>著名品种</strong></td>
<td style="padding:10px;color:#666">赤霞珠、黑皮诺、西拉</td>
<td <td style="padding:10px;color="#666">霞多丽、长相思、雷司令</td>
</tr>
</table>
</section>

<h3>💡 五、常见误区</h3>
<section style="background:#FFEBEE;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：红葡萄酒比白葡萄酒好</strong><br/>
<span style="color:#666">两者风格不同，白葡萄酒同样可以高品质且昂贵。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：葡萄品种决定一切</strong><br/>
<span style="color:#666">风土、酿酒师、酿造工艺同样重要。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：黑皮诺太贵不值得</strong><br/>
<strong style="color:#666">入门级黑皮诺也有优秀选择，关注新西兰和智利。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：霞多丽就是奶油味</strong><br/>
<span style="color:#666">不锈钢桶霞多丽清爽干净，橡木桶才是奶油味来源。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：长相思不能配餐</strong><br/>
<span style="color:#666">搭配海鲜、亚洲菜、清淡肉类非常适合。</span></p>
</section>

<h3>📝 六、品种选购建议</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>✅ 新手入门推荐：</strong><br/>
<span style="color:#666">• 红酒：梅洛、黑皮诺（柔顺易饮）</span><br/>
<span style="color:#666">• 白酒：长相思、灰皮诺（清爽芳香）</span><br/><br/>
<strong>进阶探索：</strong><br/>
<span style="color:#666">• 红酒：内比奥罗、桑娇维塞（意式风情）</span><br/>
<span style="color:#666">• 白酒：维欧尼、雷司令（独特风格）</span><br/><br/>
<strong>老饕进阶：</strong><br/>
<span style="color:#666">• 红酒：赤霞珠（波尔多 Napa）、黑皮诺（勃艮第）</span><br/>
<span style="color:#666">• 白酒：霞多丽（勃艮第）、赛美蓉（苏玳）</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#0f1f0f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🍇 结语</p>
<p style="color:#E8F5E9;font-size:14px;line-height:1.8;margin:0">葡萄品种是理解葡萄酒的基石。从赤霞珠到霞多丽，从黑皮诺到长相思——每个品种都有其独特的个性与风味。了解品种不仅能帮助我们更好地选择葡萄酒，更能让我们在品酒的过程中感受到大自然的馈赠与酿酒师的匠心。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍇 生成葡萄品种大全文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍇 ${date.chinese} 葡萄品种大全：红葡萄·白葡萄完全指南`,
    author: '红酒顾问',
    digest: '全球有超过1000种酿酒葡萄。本文详解10大红葡萄品种、10大白葡萄品种、配餐指南和选购建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `grape_varieties_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'grape_varieties_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/grape_varieties_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();