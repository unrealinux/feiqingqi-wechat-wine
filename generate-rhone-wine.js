/**
 * 法国罗纳河谷文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实罗纳河谷封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实罗纳河谷封面...');
  
  const coverPath = path.join(__dirname, 'output', 'rhone_wine_cover_real.png');
  const prompt = 'Photorealistic French Rhône Valley landscape, terraced vineyards overlooking Rhône river, Châteauneuf-du-Pape castles, sunset over vineyards, wine bottles and glasses, golden sunlight, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('rhone_wine_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="100%" style="stop-color:#DC143C"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 法国罗纳河谷</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">教皇新堡 · 埃米塔日 · 孔德里约</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'rhone_wine_cover_ai.png');
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
      <stop offset="100%" style="stop-color:#4a2c2a"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#DC143C"/>
    </linearGradient>
    <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8B4513"/>
      <stop offset="100%" style="stop-color:#228B22"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 远景山脉 -->
  <g transform="translate(0, 180)">
    <polygon points="0,50 150,0 300,30 450,10 600,40 750,20 900,50 900,120 0,120" fill="url(#hillGrad)" opacity="0.6"/>
    <polygon points="0,80 200,30 400,50 600,20 800,60 900,40 900,120 0,120" fill="url(#hillGrad)" opacity="0.4"/>
  </g>
  
  <!-- 梯田葡萄园 -->
  <g transform="translate(100, 220)">
    <polygon points="0,60 30,55 60,60 80,50 100,55 130,60 160,45 160,100 0,100" fill="#228B22" opacity="0.8"/>
    <polygon points="50,100 80,95 110,100 130,90 150,95 180,100 180,140 50,140" fill="#2E8B57" opacity="0.8"/>
    <polygon points="100,140 130,135 160,140 180,130 200,135 230,140 230,170 100,170" fill="#228B22" opacity="0.8"/>
    <!-- 葡萄藤线条 -->
    <line x1="10" y1="55" x2="150" y2="55" stroke="#8B4513" stroke-width="2" opacity="0.5"/>
    <line x1="60" y1="95" x2="220" y2="95" stroke="#8B4513" stroke-width="2" opacity="0.5"/>
    <line x1="110" y1="135" x2="220" y2="135" stroke="#8B4513" stroke-width="2" opacity="0.5"/>
  </g>
  
  <!-- 罗纳河 -->
  <path d="M0,280 Q200,260 400,290 Q600,320 800,280 Q900,260 900,280 L900,383 L0,383 Z" fill="#1E90FF" opacity="0.4"/>
  <path d="M0,290 Q200,270 400,300 Q600,330 800,290" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.5"/>
  
  <!-- 酒庄建筑 -->
  <g transform="translate(650, 150)">
    <!-- 主建筑 -->
    <rect x="0" y="30" width="80" height="50" fill="#D2691E" rx="3"/>
    <polygon points="0,30 40,0 80,30" fill="#8B4513"/>
    <rect x="20" y="45" width="15" height="20" fill="#2F4F4F" rx="2"/>
    <rect x="50" y="45" width="15" height="20" fill="#2F4F4F" rx="2"/>
    <!-- 塔楼 -->
    <rect x="70" y="10" width="25" height="70" fill="#D2691E" rx="2"/>
    <polygon points="70,10 82.5,-15 95,10" fill="#8B4513"/>
    <rect x="77" y="20" width="10" height="12" fill="#2F4F4F" rx="2"/>
    <!-- 烟囱 -->
    <rect x="10" y="10" width="10" height="20" fill="#696969"/>
  </g>
  
  <!-- 酒瓶与酒杯 -->
  <g transform="translate(500, 230)">
    <!-- 酒瓶 -->
    <g transform="translate(0, 0)">
      <rect x="15" y="30" width="25" height="60" fill="#722F37" rx="2"/>
      <rect x="22" y="15" width="10" height="15" fill="#8B0000"/>
      <rect x="25" y="10" width="5" height="8" fill="#2F4F4F"/>
      <!-- 标签 -->
      <rect x="18" y="45" width="18" height="20" fill="#FFD700" opacity="0.8"/>
      <line x1="20" y1="50" x2="34" y2="50" stroke="#8B4513" stroke-width="2"/>
      <line x1="20" y1="55" x2="34" y2="55" stroke="#8B4513" stroke-width="1"/>
    </g>
    <!-- 酒杯 -->
    <g transform="translate(60, 25)">
      <path d="M5,40 L12,10 L28,10 L35,40 Z" fill="#D2691E" opacity="0.7"/>
      <ellipse cx="20" cy="40" rx="15" ry="3" fill="#8B0000"/>
    </g>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#DC143C" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#2c1810" text-anchor="middle">🍷 罗纳河谷</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#2c1810" text-anchor="middle">法国葡萄酒圣地</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#DC143C" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🍷 ${date.display} 法国罗纳河谷</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">教皇新堡 · 埃米塔日 · 孔德里约</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'rhone_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成法国罗纳河谷文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #8B0000; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B0000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B0000; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B0000;">🍷 ${date.chinese} 法国罗纳河谷：教皇新堡·埃米塔日·孔德里约</h2>
<p style="text-align: center; color: #666;">教皇新堡 · 埃米塔日 · 孔德里约</p>

<section style="background:linear-gradient(135deg,#2c1810,#4a2c2a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">罗纳河谷是<strong style="color:#FFD700">法国最古老的葡萄酒产区之一</strong>，拥有超过2000年的酿酒历史。从教皇新堡的宏伟到埃米塔日的精致，从孔德里约的优雅到罗第丘的峻峭——这篇文章将带你深入探索<strong style="color:#FFD700">法国南部的葡萄酒圣地</strong>。</p>
</section>

<h3>🏛 一、罗纳河谷五大子产区</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>👑 教皇新堡（Châteauneuf-du-Pape）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>罗纳河谷最著名产区，顶级葡萄酒代名词<br/>
<strong>• 位置：</strong>罗纳河南部，沃克吕兹省<br/>
<strong>• 葡萄品种：</strong>13种（歌海娜为主，慕合怀特、西拉、添普兰尼洛等）<br/>
<strong>• 特点：</strong>酒体饱满，浓郁辛辣，陈年潜力强<br/>
<strong>• 土壤：</strong>鹅卵石土壤（Galets），白天吸热夜间放热<br/>
<strong>• 代表酒庄：</strong>Château Rayas、Château Beaucastel、Pape Clément</p>
</div>

<div class="region-item">
🏆 <h4>埃米塔日（Hermitage）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>北罗纳的王座，被称"天下第一西拉"<br/>
<parameter name="style">• 位置：</strong>罗纳河北部，德龙省<br/>
<strong>• 葡萄品种：</strong>西拉（主导），玛珊，胡珊<br/>
<strong>• 特点：</strong>结构严谨，单宁强壮，陈年50年+<br/>
<strong>• 土壤：</strong>花岗岩土壤，贫瘠且排水良好<br/>
<strong>• 代表酒庄：</strong>Chapoutier、Jean-Louis Chave、Grasvendres</p>
</div>

<div class="region-item">
🏆 <h4>孔德里约（Condrieu）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>法国最伟大的维欧尼白葡萄酒产区<br/>
<parameter name="style">• 位置：</strong>罗纳河北部，孔德里约村<br/>
<parameter name="style">• 葡萄品种：</strong>维欧尼（Viognier）<br/>
<parameter name="style">• 特点：</strong>芳香馥郁，杏子、桃子和花香，入口圆润<br/>
<parameter name="style">• 产量限制：</strong>非常低，年产量仅约3万瓶<br/>
<strong>• 代表酒庄：</strong>Pierre-Jean Villié、Yves Cuilleron、André Perret</p>
</div>

<div class="region-item">
🏆 <h4>罗第丘（Côte-Rôtie）</h4>
<p style="color:#333;line-height:1.8;margin:0"><parameter name="style">• 地位：</strong>北罗纳最北端，西拉的极致表达<br/>
<parameter name="style">• 位置：</strong>罗纳河北部，阿尔代什省<br/>
<parameter name="style">• 葡萄品种：</strong>西拉+维欧尼（最多20%）<br/>
<parameter name="style">• 特点：</strong>优雅细腻，单宁丝滑，黑色水果+紫罗兰<br/>
<parameter name="style">• 坡度：</strong>极为陡峭，需要手工采摘<br/>
<parameter name="style">• 代表酒庄：</strong>E. Guigal、Jamous、Clusel-Roch</p>
</div>

<div class="region-item">
🏆 <h4>圣约瑟夫（Saint-Joseph）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>北罗纳最大法定产区<br/>
<parameter name="style">• 位置：</strong>罗纳河北部，沿罗纳河右岸<br/>
<parameter name="style">• 葡萄品种：</strong>红：西拉；白：玛珊，胡珊<br/>
<parameter name="style">• 特点：</strong>品质稳定，性价比高<br/>
<strong>• 代表酒庄：</strong>Jean-Luc Jamet、Dard & Ribo、Gilles Barge</p>
</div>

<div class="region-item">
🏆 <h4>克罗兹-埃米塔日（Crozes-Hermitage）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>埃米塔日的兄弟产区<br/>
<parameter name="style">• 位置：</strong>埃米塔日周围<br/>
<parameter name="style">• 葡萄品种：</strong>西拉为主，白葡萄酒<br/>
<parameter name="style">• 特点：</strong>价格更亲民，风格更易饮<br/>
<strong>• 代表酒庄：</strong>Alain Graillot、Domaine des Remparts</p>
</div>

</section>

<h3>🍇 二、罗纳河谷核心品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 西拉（Syrah）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>北罗纳的绝对主角<br/>
<strong>• 特点：</strong>黑色水果、黑胡椒、烟熏、皮革<br/>
<strong>• 口感：</strong>单宁强壮，酒体饱满<br/>
<strong>• 代表：</strong>埃米塔日、罗第丘、克罗兹-埃米塔日</p>
</div>

<div class="region-item">
🔴 <h4>歌海娜（Grenache）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南罗纳的王者<br/>
<strong>• 特点：</strong>红色水果、甘草、甜香料<br/>
<strong>• 口感：</strong>酒体圆润，酒精感明显<br/>
<strong>• 代表：</strong>教皇新堡、教会园（Côtes du Rhône Villages）</p>
</div>

<div class="region-item">
⚪ <h4>维欧尼（Viognier）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>孔德里约的专属<br/>
<strong>• 特点：</strong>杏子、桃子、橙花、薰衣草<br/>
<strong>• 口感：</strong>酒体丰满，酸度中低<br/>
<strong>• 代表：</strong>孔德里约（Condrieu）</p>
</div>

<div class="region-item">
⚪ <h4>玛珊（Marsanne）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>北罗纳白葡萄酒主力<br/>
<parameter name="style">• 特点：</strong>梨子、坚果、蜂蜜、矿物质<br/>
<parameter name="style">• 口感：</strong>结构好，可陈年<br/>
<strong>• 代表：</strong>圣佩莱（Saint-Péray）、克罗兹-埃米塔日白</p>
</div>

<div class="region-item">
⚪ <h4>胡珊（Roussanne）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>与玛珊常混合<br/>
<parameter name="style">• 特点：</strong>花香、茶叶、柑橘<br/>
<parameter name="style">• 口感：</strong>酸度更高，更细腻<br/>
<strong>• 代表：</strong>埃米塔日白、圣佩莱</p>
</div>

<div class="region-item">
🔴 <h4>慕合怀特（Mourvèdre）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南罗纳第三大品种<br/>
<parameter name="style">• 特点：</strong>野味、皮革、黑色水果<br/>
<parameter name="style">• 口感：</strong>单宁重，颜色深<br/>
<strong>• 代表：</strong>教皇新堡混酿</p>
</div>

</section>

<h3>💰 三、罗纳河谷价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 100-250 元（入门）</strong><br/>
<span style="color:#666">• 罗纳河谷大区（Côtes du Rhône）</span><br/>
<span style="color:#666">• 村庄级（Côtes du Rhône Villages）</span><br/>
<span style="color:#666">• 入门级克罗兹-埃米塔日</span><br/>
<span style="color:#666">• 特点：果香充沛，简单易饮</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 250-600 元（进阶）</strong><br/>
<span style="color:#666">• 优质村庄级（如Visan、Sablet）</span><br/>
<span style="color:#666">• 入门级教皇新堡</span><br/>
<span style="color:#666">• 罗第丘入门</span><br/>
<strong style="color:#c62828">• 特点：开始展现产区特色</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 600-1500 元（高级）</strong><br/>
<span style="color:#666">• 中端教皇新堡（如Château Mont-Redon）</span><br/>
<span style="color:#666">• 埃米塔日入门（如Jean-Louis Chave）</span><br/>
<span style="color:#666">• 孔德里约精选</span><br/>
<strong style="color:#c62828">• 特点：可陈年10-20年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 1500元以上（膜拜）</strong><br/>
<span style="color:#666">• 顶级教皇新堡（Château Rayas、Beaucastel）</span><br/>
<span style="color:#666">• 埃米塔日顶级（Chapoutier Le Meal）</span><br/>
<span style="color:#666">• 罗第坡传奇（Jamous、La Turque）</span><br/>
<strong style="color:#c62828">• 特点：拍卖级，陈年30年+，稀缺</strong></p>
</section>

<h3>📅 四、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B0000;color:white">
<td style="padding:10px;font-weight:bold">产区</td>
<td style="padding:10px;font-weight:bold">优秀年份</td>
<td style="padding:10px;font-weight:bold">备注</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>教皇新堡</strong></td>
<td style="padding:10px;color:#c41e3a">2016、2015、2010、2007、2005</td>
<td <td style="padding:10px;color:#666">世纪年份</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>埃米塔日</strong></td>
<td style="padding:10px;color:#c41e3a">2015、2012、2010、2009、2006</td>
<td <td style="padding:10px;color="#666">卓越表现</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>罗第丘</strong></td>
<td style="padding:10px;color:#c41e3a">2015、2012、2010、2009、2005</td>
<td <td style="padding:10px;color="#666">优雅极致</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>孔德里约</strong></td>
<td style="padding:10px;color:#c41e3a">2020、2018、2017、2015</td>
<td <td style="padding:10px;color:#666">芳香年份</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>克罗兹-埃米塔日</strong></td>
<td style="padding:10px;color:#c41e3a">2018、2016、2015、2011</td>
<td <td style="padding:10px;color:#666">性价比高</td>
</tr>
</table>
</section>

<h3>🍽 五、罗纳河谷配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🍖 肉类搭配</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 烤羊肉：</strong>埃米塔日西拉（经典组合）<br/>
<strong>• 烤牛肉：</strong>教皇新堡<br/>
<strong>• 野味：</strong>埃米塔日（鹿肉、野猪）<br/>
<strong>• 鸭肉：</strong>罗第丘</p>
</div>

<div class="region-item">
🧀 <h4>奶酪搭配</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 山羊奶酪：</strong>孔德里约维欧尼<br/>
<strong>• 软质奶酪：</strong>教皇新堡<br/>
<strong>• 蓝纹奶酪：</strong>埃米塔日（浓郁配浓郁）</p>
</div>

<div class="region-item">
🥘 <h4>法式料理</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 勃艮第红酒烩鸡：</strong>克罗兹-埃米塔日<br/>
<parameter name="style">• 红酒炖牛肉：</strong>教皇新堡<br/>
<strong>• 法式蜗牛：</strong>罗纳河谷白葡萄酒</p>
</div>

<div class="region-item">
🌶 <h4>辛辣菜系</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 印度咖喱：</strong>教皇新堡（浓郁解辣）<br/>
<strong>• 川菜：</strong>孔德里约（芳香解腻）<br/>
<strong>• 烧烤：</strong>埃米塔日（重口味配重酒）</p>
</div>

</section>

<h3>💡 六、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：罗纳河谷都是红酒</strong><br/>
<span style="color:#666">事实上，北罗纳白葡萄酒（孔德里约、圣佩莱）同样精彩。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：教皇新堡都很贵</strong><br/>
<span style="color:#666">入门级100多元就有交易，关注Château Mont-Redon等。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：埃米塔日只能陈年</strong><br/>
<strong style="color:#666">新年份已有很好表现，不需要等待30年。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：孔德里约是甜酒</span><br/>
<span style="color:#666">干型白葡萄酒，虽然芳香浓郁但入口干爽。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：罗纳河谷不如波尔多</strong><br/>
<span style="color:#666">两个产区风格不同，罗纳更浓郁、更适合重口味。</span></p>
</section>

<h3>📝 七、罗纳河谷分级制度</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px;border-left:3px solid #3F51B5">
<p style="color:#1A237E;margin:0">
<strong>🏆 教皇新堡分级（1936年）：</strong><br/>
<span style="color:#666">• 无官方分级，但有"卓越名庄"非正式认可</span><br/>
<span style="color:#666">• Château Rayas 被公认为第一</span><br/>
<span style="color:#666">• Beaucastel、Château de Beaucastel 紧随其后</span><br/><br/>
<strong>📊 罗纳河谷分级：</strong><br/>
<span style="color:#666">• 罗纳河谷大区（Côtes du Rhône）</span><br/>
<span style="color:#666">• 罗纳河谷村庄（Côtes du Rhône Villages）——更高品质</span><br/>
<span style="color:#666">• 特定村庄（如Gigondas、Vacqueyras）——独立AOP</span><br/><br/>
<strong>⭐ 埃米塔日分级：</strong><br/>
<span style="color:#666">• 只有两个AOP：Hermitage + Crozes-Hermitage</span><br/>
<span style="color:#666">• 无官方分级，但品质差距明显</span>
</p>
</section>

<h3>🍸 八、饮用与保存建议</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px;border-left:3px solid #E91E63">
<p style="color:#880E4F;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 红酒：14-16℃（轻微冰镇）</span><br/>
<span style="color:#666">• 白葡萄酒：10-12℃（充分冰镇）</span><br/>
<span style="color:#666">• 教皇新堡：14-16℃</span><br/><br/>
<strong>🍷 酒杯选择：</strong><br/>
<span style="color:#666">• 波尔多杯（适合教皇新堡等浓郁红酒）</span><br/>
<span style="color:#666">• 勃艮第杯（适合埃米塔日、罗第丘）</span><br/>
<span style="color:#666">• 白葡萄酒杯（适合孔德里约）</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 未开瓶：避光保存，12-15℃</span><br/>
<span style="color:#666">• 陈年能力：教皇新堡/埃米塔日 20年+</span><br/>
<span style="color:#666">• 开瓶后：可保存1-2天，建议一次喝完</span><br/>
<span style="color:#666">• 醒酒：顶级酒建议醒酒1-2小时</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2c1810,#4a2c2a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#FFE4C4;font-size:14px;line-height:1.8;margin:0">罗纳河谷是法国葡萄酒的縮影——从北到南，从西拉到歌海娜，从埃米塔日的峻峭到教皇新堡的宏伟。这里既有适合日常饮用的性价比之选，也有动辄数千元的膜拜级珍酿。无论你是资深的葡萄酒老饕，还是刚刚入门的新手，罗纳河谷都能带给你惊喜。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成法国罗纳河谷文章');
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
    title: `🍷 ${date.chinese} 法国罗纳河谷：教皇新堡·埃米塔日·孔德里约`,
    author: '红酒顾问',
    digest: '罗纳河谷是法国最古老的葡萄酒产区之一。本文详解五大子产区、核心品种、价格指南和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `rhone_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'rhone_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/rhone_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();