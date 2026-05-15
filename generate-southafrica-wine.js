/**
 * 南非葡萄酒文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实南非封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实南非葡萄酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'southafrica_cover_real.png');
  const prompt = 'Photorealistic South African vineyard at sunset, Table Mountain in background, Cape Dutch architecture, rows of grapevines, wine bottle in foreground, dramatic clouds, professional photography, warm golden lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('southafrica_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#228B22"/>
            <stop offset="100%" style="stop-color:#9ACD32"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🌿 南非葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">皮诺塔吉 · 斯泰伦布什 · 好望角</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#9ACD32" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'southafrica_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#1a3a1a"/>
      <stop offset="100%" style="stop-color:#2d5a2d"/>
    </linearGradient>
    <linearGradient id="mtnGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#4a7c4a"/>
      <stop offset="100%" style="stop-color:#87CEEB"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 桌山（南非地标） -->
  <path d="M200,150 L300,80 L400,120 L500,60 L600,100 L700,50 L900,130 L900,200 L200,200 Z" fill="url(#mtnGrad)" opacity="0.85"/>
  
  <!-- 葡萄藤 -->
  <g transform="translate(80, 280)" opacity="0.85">
    <path d="M0,0 Q20,-15 40,0 Q60,-15 80,0" fill="none" stroke="#228B22" stroke-width="3"/>
    <circle cx="10" cy="5" r="6" fill="#722F37"/>
    <circle cx="25" cy="-5" r="6" fill="#8B0000"/>
    <circle cx="40" cy="8" r="5" fill="#722F37"/>
    <circle cx="55" cy="-3" r="6" fill="#8B0000"/>
    <circle cx="70" cy="5" r="5" fill="#722F37"/>
  </g>
  
  <!-- 酒瓶 -->
  <g transform="translate(380, 130)">
    <path d="M25,160 L45,50 L75,50 L95,160 Z" fill="#722F37" opacity="0.95"/>
    <rect x="52" y="35" width="10" height="15" fill="#4a1c1a"/>
    <ellipse cx="60" cy="160" rx="35" ry="8" fill="#5c1a1a"/>
    <path d="M45,60 Q60,45 75,60" fill="none" stroke="#9ACD32" stroke-width="2" opacity="0.7"/>
  </g>
  
  <!-- 皮诺塔吉葡萄串 -->
  <g transform="translate(620, 260)" opacity="0.8">
    <circle cx="0" cy="0" r="7" fill="#4a002a"/>
    <circle cx="15" cy="5" r="6" fill="#5c0033"/>
    <circle cx="30" cy="-3" r="7" fill="#4a002a"/>
    <circle cx="45" cy="6" r="6" fill="#5c0033"/>
    <circle cx="60" cy="2" r="7" fill="#4a002a"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(510, 60)">
    <rect x="0" y="0" width="300" height="130" rx="8" fill="#228B22" opacity="0.95"/>
    <rect x="0" y="0" width="300" height="130" rx="8" fill="none" stroke="#9ACD32" stroke-width="3"/>
    <text x="150" y="50" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">🌿 南非</text>
    <text x="150" y="95" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="white" text-anchor="middle">葡萄酒</text>
    <line x1="50" y1="110" x2="250" y2="110" stroke="white" stroke-width="2" opacity="0.5"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#9ACD32">🌿 ${date.display} 南非葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">皮诺塔吉 · 斯泰伦布什 · 好望角</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'southafrica_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成南非葡萄酒文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #228B22; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #228B22; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #228B22; border-bottom: 2px solid #228B22; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #228B22;">🌿 ${date.chinese} 南非葡萄酒入门</h2>
<p style="text-align: center; color: #666;">皮诺塔吉 · 斯泰伦布什 · 好望角</p>

<section style="background:linear-gradient(135deg,#1a3a1a,#2d5a2d);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#90EE90;font-size:16px;line-height:1.9">南非是<strong style="color:#ffd700">新世界最古老的葡萄酒产国之一</strong>，拥有超过350年的酿酒历史。这里独特的<strong style="color:#ffd700">皮诺塔吉（Pinotage）</strong>品种和老藤葡萄酒，正在世界舞台上赢得越来越多的关注。</p>
</section>

<h3>🗺 一、南非葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 三大经典产区：</strong></p>

<div class="region-item">
<h4>🏠 斯泰伦布什（Stellenbosch）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非葡萄酒的中心，历史最悠久<br/>
<strong>• 气候：</strong>地中海气候，夏季干燥<br/>
<strong>• 土壤：</strong>花岗岩、页岩<br/>
<strong>• 代表品种：</strong>赤霞珠、皮诺塔吉、霞多丽<br/>
<strong>• 特点：</strong>大学城氛围，精品酒庄林立</p>
</div>

<div class="region-item">
<h4>🏠 帕尔（Paarl）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非最大产量产区<br/>
<strong>• 气候：</strong>较斯泰伦布什更温暖<br/>
<strong>• 特点：</strong>大型酒庄集中，品质稳定<br/>
<strong>• 代表品种：</strong>霞多丽、白诗南<br/>
<strong>• 著名酒庄：</strong>Delaire Graff、Kanonenberg</p>
</div>

<div class="region-item">
<h4>🏠 弗朗斯胡克（Franschhoek）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>"法国河谷"，风景如画<br/>
<strong>• 气候：</strong>山谷凉爽，昼夜温差大<br/>
<strong>• 特点：</strong>精品小酒庄，美食天堂<br/>
<strong>• 代表品种：</strong>霞多丽、长相思<br/>
<strong>• 体验：</strong>葡萄酒电车游览</p>
</div>

<div class="region-item">
<h4>🏠 康斯坦提亚（Constantia）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非最古老的葡萄园区域<br/>
<strong>• 距离：</strong>开普敦以南20公里<br/>
<strong>• 特点：</strong>凉爽海洋气候<br/>
<strong>• 历史：</strong>1688年建立，曾是荷兰东印度公司供酒</p>
</div>

</section>

<h3>🍇 二、南非明星品种</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 皮诺塔吉（Pinotage）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非国宝品种，全球独有<br/>
<strong>• 诞生：</strong>1925年 Pinot Noir × Cinsault 杂交<br/>
<strong>• 特点：</strong>黑莓、樱桃、巧克力、烟熏<br/>
<strong>• 风格：</strong>从轻盈到饱满，适合橡木桶陈酿<br/>
<strong>• 入门价格：</strong>约80-300元</p>
</div>

<div class="region-item">
<h4>🟡 白诗南（Chenin Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非最重要的白葡萄品种<br/>
<strong>• 本地名称：</strong>"Steen"（斯泰因）<br/>
<strong>• 特点：</strong>苹果、梨、蜂蜜、矿物质<br/>
<strong>• 风格：</strong>从干型到甜型，从年轻到橡木桶<br/>
<strong>• 入门价格：</strong>约60-200元</p>
</div>

<div class="region-item">
<h4>🔴 赤霞珠（Cabernet Sauvignon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非红葡萄酒的核心品种<br/>
<strong>• 特点：</strong>黑醋栗、雪松、烟草<br/>
<strong>• 风格：</strong>结构紧致，单宁强健<br/>
<strong>• 代表产区：</strong>斯泰伦布什<br/>
<strong>• 入门价格：</strong>约100-400元</p>
</div>

<div class="region-item">
<h4>🟡 霞多丽（Chardonnay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非白葡萄酒的明星<br/>
<strong>• 特点：</strong>柑橘、苹果、奶油（桶酿）<br/>
<strong>• 风格：</strong>凉爽产区更清爽，温暖产区更饱满<br/>
<strong>• 著名产区：</strong>弗朗斯胡克、康斯坦提亚<br/>
<strong>• 入门价格：</strong>约80-250元</p>
</div>

</section>

<h3>👑 三、传奇酒庄推荐</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 Kanonenberg（卡农山）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>南非最古老酒庄之一（1771年）<br/>
<strong>• 价格：</strong>约150-800元<br/>
<strong>• 特点：</strong>老藤葡萄，极致品质<br/>
<strong>• 代表作：</strong>Pinotage、Wine of Origin</p>
</div>

<div class="region-item">
<h4>🔴 Delaire Graff（德拉雷格拉夫）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>帕尔顶级酒庄，艺术品酒庄<br/>
<strong>• 价格：</strong>约300-2000元<br/>
<strong>• 特点：</strong>建筑与艺术结合，品质卓越<br/>
<strong>• 代表作：</strong>Delaire Reserve、Graff Estate</p>
</div>

<div class="region-item">
<h4>🔴 Spice Route（香料之路）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>帕尔精品酒庄代表<br/>
<strong>• 价格：</strong>约150-600元<br/>
<strong>• 特点：</strong>专注于皮诺塔吉<br/>
<strong>• 代表作：</strong>Spice Route Pinotage、Chakalaka</p>
</div>

<div class="region-item">
<h4>🔴 Klein Constantia（克莱因康斯坦提亚）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>历史名庄，以贵腐酒闻名<br/>
<strong>• 价格：</strong>约200-1500元<br/>
<strong>• 特点：</strong>Vin de Constance 贵腐酒是世界顶级<br/>
<strong>• 历史：</strong>1685年创建，曾供应英国王室</p>
</div>

</section>

<h3>💰 四、价格与性价比</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 60-150 元（日常）</strong><br/>
<span style="color:#666">• Spice Route Chakalaka：入门首选</span><br/>
<span style="color:#666">• Kaiken Ultra：阿根廷风格</span><br/>
<span style="color:#666">• 特点：果味直接，单宁柔和</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 150-400 元（进阶）</strong><br/>
<span style="color:#666">• Kanonenberg Pinotage：经典代表</span><br/>
<span style="color:#666">• Delaire Graff Reserve：品质保证</span><br/>
<strong style="color:#c62828">• 特点：可存放3-8年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 400-2000 元（顶级）</strong><br/>
<span style="color:#666">• Klein Constantia Vin de Constance：世界级贵腐</span><br/>
<span style="color:#666">• Delaire Graff Estate：膜拜级</span><br/>
<strong style="color:#c62828">• 特点：可陈年10-20年</strong></p>
</section>

<h3>📅 五、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#228B22;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">评分</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2018</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">卓越年份，结构完美</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2019</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">温暖年份，果味浓郁</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2020</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优秀年份，值得关注</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2017</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅年份，酸度漂亮</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2021</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">新鲜果味，适合早饮</td>
</tr>
</table>
</section>

<h3>🍷 六、好望角混酿（Cape Blend）</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1a3a1a;font-weight:bold;margin-bottom:15px">🍷 什么是好望角混酿？</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 定义：</strong>南非特有的红葡萄酒混酿<br/>
<strong>• 法规：</strong>必须以皮诺塔吉为主（30%+），混酿其他品种<br/>
<strong>• 常见组合：</strong>Pinotage + 赤霞珠 + 美乐<br/>
<strong>• 风格：</strong>果味丰富，结构平衡，独特南非风格</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 代表酒款：</strong><br/>
<span style="color:#666">• Spice Route Chakalaka：经典好望角混酿</span><br/>
<span style="color:#666">• Delaire Graff Cape Blend：顶级代表</span></p>

<p style="color:#333;line-height:1.8"><strong>• 配餐建议：</strong>烧烤、非洲特色菜、软奶酪</p>
</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：南非酒都很便宜</strong><br/>
<span style="color:#666">顶级南非酒（如 Klein Constantia）价格可达数千元。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：皮诺塔吉是南非唯一的特色</strong><br/>
<span style="color:#666">白诗南（Steen）、老藤赤霞珠同样世界一流。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：南非酒品质不稳定</strong><br/>
<span style="color:#666">事实上，南非葡萄酒品质提升显著，多个品牌获国际大奖。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：南非只产红葡萄酒</strong><br/>
<span style="color:#666">霞多丽、白诗南品质优秀，贵腐酒更是世界顶级。</span></p>
</section>

<h3>🍸 八、饮用与保存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 红葡萄酒：16-18℃（室温）</span><br/>
<span style="color:#666">• 白葡萄酒：8-10℃（冰镇）</span><br/>
<span style="color:#666">• 贵腐酒：6-8℃（充分冰镇）</span><br/><br/>
<strong>🍷 醒酒建议：</strong><br/>
<span style="color:#666">• 入门红：开瓶即饮</span><br/>
<span style="color:#666">• 进阶红：醒酒30分钟</span><br/>
<span style="color:#666">• 顶级红：醒酒1-2小时</span><br/><br/>
<strong>🍽 配餐建议：</strong><br/>
<span style="color:#666">• 皮诺塔吉：烤肉、烧烤、咖喱</span><br/>
<span style="color:#666">• 白诗南：海鲜、鸡肉、沙拉</span><br/>
<strong style="color:#c62828">• 贵腐酒：鹅肝、蓝纹奶酪、甜点</strong><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 未开瓶：避光保存，12-18℃</span><br/>
<span style="color:#666">• 入门款：1-3年内饮用</span><br/>
<span style="color:#666">• 顶级款：可陈年10-20年</span><br/>
<span style="color:#666">• 开瓶后：红葡萄酒可保存3-5天</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a3a1a,#2d5a2d);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd700;font-size:14px;font-weight:bold;margin-bottom:8px">🌿 结语</p>
<p style="color:#90EE90;font-size:14px;line-height:1.8;margin:0">南非是新世界葡萄酒的一颗遗珠。皮诺塔吉的独特风味、老藤的珍贵价值、康斯坦提亚贵腐的传奇——这里有太多值得探索的故事。从几十元的日常款到数千元的膜拜级，南非葡萄酒的性价比和多样性超乎你的想象。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🌿 生成南非葡萄酒入门文章');
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
    title: `🌿 ${date.chinese} 南非葡萄酒入门：皮诺塔吉·斯泰伦布什·好望角`,
    author: '红酒顾问',
    digest: '南非是新世界最古老的葡萄酒产国之一，拥有独特的皮诺塔吉品种和世界级贵腐酒。本文详解产区、品种、传奇酒庄。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `southafrica_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'southafrica_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/southafrica_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();