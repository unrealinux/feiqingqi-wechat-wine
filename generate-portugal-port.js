/**
 * 葡萄牙波特酒文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实葡萄牙封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实葡萄牙封面...');
  
  const coverPath = path.join(__dirname, 'output', 'portugal_cover_real.png');
  const prompt = 'Photorealistic Portuguese Port wine cellars, old wooden barrels in dark cellar, ruby red port wine in glasses, Douro Valley vineyard in background, professional photography, warm candlelight atmosphere, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('portugal_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#8B0000"/>
            <stop offset="100%" style="stop-color:#DC143C"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 葡萄牙波特酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">波特酒 · 杜罗河 · 加强酒</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#DC143C" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'portugal_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#2c0e0e"/>
      <stop offset="100%" style="stop-color:#4a1c1c"/>
    </linearGradient>
    <linearGradient id="portGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#DC143C"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  <!-- 波特酒杯 -->
  <g transform="translate(380, 80)">
    <path d="M20,180 L40,80 L70,80 L90,180 Z" fill="url(#portGrad)" opacity="0.9"/>
    <ellipse cx="55" cy="180" rx="35" ry="8" fill="#8B0000" opacity="0.8"/>
    <rect x="45" y="60" width="20" height="20" fill="#5c1a1a"/>
  </g>
  <!-- 橡木桶 -->
  <g transform="translate(600, 180)">
    <ellipse cx="50" cy="30" rx="45" ry="15" fill="#5c3d2e"/>
    <rect x="5" y="30" width="90" height="60" fill="#8B4513"/>
    <ellipse cx="50" cy="90" rx="45" ry="15" fill="#5c3d2e"/>
    <rect x="5" y="35" width="90" height="8" fill="#3d2817"/>
    <rect x="5" y="50" width="90" height="8" fill="#3d2817"/>
    <rect x="5" y="65" width="90" height="8" fill="#3d2817"/>
    <rect x="5" y="77" width="90" height="8" fill="#3d2817"/>
  </g>
  <!-- 葡萄串 -->
  <g transform="translate(80, 200)">
    <circle cx="0" cy="0" r="8" fill="#4a0080"/>
    <circle cx="15" cy="5" r="7" fill="#5c0099"/>
    <circle cx="30" cy="-2" r="8" fill="#4a0080"/>
    <circle cx="45" cy="6" r="7" fill="#5c0099"/>
    <circle cx="60" cy="2" r="8" fill="#4a0080"/>
  </g>
  <!-- 标题框 -->
  <g transform="translate(520, 60)">
    <rect x="0" y="0" width="280" height="130" rx="8" fill="#DC143C" opacity="0.95"/>
    <rect x="0" y="0" width="280" height="130" rx="8" fill="none" stroke="#8B0000" stroke-width="3"/>
    <text x="140" y="50" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">🍷 葡萄牙</text>
    <text x="140" y="95" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="white" text-anchor="middle">波特酒</text>
  </g>
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#DC143C">🍷 ${date.display} 葡萄牙波特酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">波特酒 · 杜罗河 · 加强酒</text>
  </g>
  <g fill="rgba(255,255,255,0.05)">
    <circle cx="820" cy="60" r="35"/>
    <circle cx="150" cy="330" r="20"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'portugal_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成葡萄牙波特酒文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #8B0000; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B0000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B0000;">🍷 ${date.chinese} 葡萄牙波特酒入门</h2>
<p style="text-align: center; color: #666;">波特酒 · 杜罗河 · 加强酒</p>

<section style="background:linear-gradient(135deg,#2c0e0e,#4a1c1c);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f8d7da;font-size:16px;line-height:1.9">波特酒（Port）是<strong style="color:#ffd700">葡萄牙的国宝</strong>，也是全球最著名的<strong style="color:#ffd700">加强型葡萄酒</strong>。它诞生于17世纪，曾是英国贵族的挚爱，至今仍是甜点酒的巅峰之作。</p>
</section>

<h3>🗺 一、波特酒产地：杜罗河谷</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📍 杜罗河谷（Douro Valley）：</strong></p>

<div class="region-item">
<h4>🌡 气候与风土</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>葡萄牙北部，贯穿东西的杜罗河谷<br/>
<strong>• 气候：</strong>极端大陆性，夏季炎热，冬季寒冷<br/>
<strong>• 地形：</strong>陡峭的梯田葡萄园，片岩土壤<br/>
<strong>• 特点：</strong>世界上最古老的法定产区之一（1756年）</p>
</div>

<div class="region-item">
<h4>🏰 子产区</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 上杜罗（Upper Douro）：</strong>最高海拔，品质最佳<br/>
<strong>• 下杜罗（Lower Douro）：</strong>产量较大，风格柔和<br/>
<strong>• Côa Valley：</strong>新兴高质量产区</p>
</div>

</section>

<h3>🍇 二、波特酒酿造工艺</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔬 什么是加强酒？</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 定义：</strong>在发酵过程中添加白兰地（葡萄蒸馏酒）终止发酵<br/>
<strong>• 结果：</strong>酒精度提高到17-22%，保留部分糖分（甜型）<br/>
<strong>• 分类：</strong>红波特、白波特、桃红波特</p>
</div>

<div class="region-item">
<h4>🍷 酿造流程</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>1. 葡萄采收：</strong>通常在9-10月，人工采摘<br/>
<strong>2. 发酵：</strong>在大木桶中发酵约2-3天<br/>
<strong>3. 加白兰地：</strong>按比例加入77%白兰地，终止发酵<br/>
<strong>4. 陈酿：</strong>在橡木桶中陈酿，氧化成熟<br/>
<strong>5. 装瓶：</strong>根据风格决定陈年时间</p>
</div>

</section>

<h3>📝 三、波特酒类型详解</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 红波特酒（Ruby Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>深红色，果味浓郁，单宁充沛<br/>
<strong>• 陈酿：</strong>橡木桶陈酿2-3年<br/>
<strong>• 价格：</strong>约80-300元<br/>
<strong>• 代表：</strong>Taylor's、Famous、Sandeman Ruby</p>
</div>

<div class="region-item">
<h4>🔴 波特年份酒（Vintage Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>最佳年份单酿，陈年潜力极强<br/>
<strong>• 陈酿：</strong>桶陈2-3年后装瓶，继续陈年<br/>
<strong>• 价格：</strong>约300-3000元<br/>
<strong>• 代表：</strong>Taylor's 1994、Dow's 2000<br/>
<strong>• 适饮：</strong>装瓶后20-50年</p>
</div>

<div class="region-item">
<h4>🟤 茶色波特（Tawny Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>琥珀色，氧化风味，坚果、咖啡<br/>
<strong>• 陈酿：</strong>橡木桶长期陈酿（10-40年）<br/>
<strong>• 价格：</strong>约150-800元<br/>
<strong>• 代表：</strong>Warres 10 Year、Graham's 20 Year</p>
</div>

<div class="region-item">
🟡 <h4>白波特（White Port）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>金黄色，干型或甜型，清新果味<br/>
<strong>• 饮用：</strong>通常作为开胃酒，冰镇饮用<br/>
<strong>• 价格：</strong>约60-200元<br/>
<strong>• 代表：</strong>Cockburn's White、Ferreira White</p>
</div>

<div class="region-item">
<h4>💎 晚装年份波特（Late Bottled Vintage, LBV）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>年份波特风格，但更易饮<br/>
<strong>• 陈酿：</strong>橡木桶4-6年，比年份波特更早装瓶<br/>
<strong>• 价格：</strong>约150-400元<br/>
<strong>• 代表：</strong>Taylor's LBV、Famous LBV</p>
</div>

</section>

<h3>👑 四、传奇酒庄推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 Taylor's（泰勒）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>波特酒界的劳斯莱斯<br/>
<strong>• 价格：</strong>约200-3000元<br/>
<strong>• 特点：</strong>顶级年份波特，百年历史<br/>
<strong>• 代表作：</strong>Taylor's Vintage 1994</p>
</div>

<div class="region-item">
<h4>🏆 Graham's（格雷厄姆）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>六大品牌之一<br/>
<strong>• 价格：</strong>约150-2000元<br/>
<strong>• 特点：</strong>果味浓郁，甜美风格<br/>
<strong>• 代表作：</strong>Graham's 2000</p>
</div>

<div class="region-item">
<h4>🏆 Dow's（道斯）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>英国最古老的波特品牌<br/>
<strong>• 价格：</strong>约180-1500元<br/>
<strong>• 特点：</strong>干型尾韵，优雅平衡<br/>
<strong>• 代表作：</strong>Dow's Vintage 1994</p>
</div>

<div class="region-item">
<h4>🏆 Warre's（沃尔）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>最古老的英国波特品牌<br/>
<strong>• 价格：</strong>约120-1200元<br/>
<strong>• 特点：</strong>经典风格，品质稳定<br/>
<strong>• 代表作：</strong>Warre's 10 Year</p>
</div>

</section>

<h3>💰 五、高性价比酒款推荐</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 60-150 元（入门）</strong><br/>
<span style="color:#666">• Sandeman Ruby：经典入门款</span><br/>
<span style="color:#666">• Fonseca Bin 5：果味充沛</span><br/>
<span style="color:#666">• Cockburn's Special Ruby：性价比高</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 150-400 元（进阶）</strong><br/>
<span style="color:#666">• Taylor's LBV：年份波特风格</span><br/>
<span style="color:#666">• Graham's 10 Year：茶色波特入门</span><br/>
<strong style="color:#c62828">• Warre's Warrior：老年份风格</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 400-2000 元（顶级）</strong><br/>
<span style="color:#666">• Taylor's Vintage：传奇年份</span><br/>
<span style="color:#666">• Graham's Vintage：浓郁甜美</span><br/>
<strong style="color:#c62828">• Dow's Vintage：优雅派代表</strong></p>
</section>

<h3>📅 六、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B0000;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">评分</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2000</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，结构完美</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>1994</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，陈年潜力极强</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2017</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">现代优秀年份，果味浓郁</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2020</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">最新优秀年份，值得关注</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2011</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">良好年份，品质优秀</td>
</tr>
</table>
</section>

<h3>🍷 七、波特酒 vs 雪莉酒</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B0000;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">波特酒（葡萄牙）</td>
<td style="padding:10px;font-weight:bold">雪莉酒（西班牙）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>产地</strong></td>
<td style="padding:10px;color:#666">葡萄牙杜罗河谷</td>
<td style="padding:10px;color:#666">西班牙安达卢西亚</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>加强时机</strong></td>
<td style="padding:10px;color:#666">发酵中期</td>
<td <td style="padding:10px;color:#666">发酵后（部分）或发酵前</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>主要风格</strong></td>
<td style="padding:10px;color:#666">甜型为主</td>
<td <td style="padding:10px;color:#666">干型（Manzanilla、Fino）到甜型</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>陈酿系统</strong></td>
<td style="padding:10px;color:#666">橡木桶培养</td>
<td <td style="padding:10px;color:#666">生物陈年（Flor酵母）或氧化陈年</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>代表品种</strong></td>
<td style="padding:10px;color:#666">Touriga Nacional</td>
<td <td style="padding:10px;color="#666">Palomino、Pedro Ximenez</td>
</tr>
</table>
</section>

<h3>💡 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：波特酒都是甜的</strong><br/>
<span style="color:#666">白波特有干型，近年也有干型红波特（Dry Port）。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：波特酒越陈越好</strong><br/>
<span style="color:#666">茶色波特在装瓶后会逐渐衰退，开瓶后需尽快饮用。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：波特酒要大量陈年</strong><br/>
<span style="color:#666">Ruby、LBV等适合在年轻时饮用氧化风味不重。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：波特酒只配甜点</strong><br/>
<span style="color:#666">干型白波特可作开胃酒，红波特配烤肉、奶酪同样精彩。</span></p>
</section>

<h3>🍸 九、饮用与保存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 红波特：16-18℃（室温）</span><br/>
<span style="color:#666">• 白波特：8-10℃（冰镇）</span><br/>
<span style="color:#666">• 茶色波特：14-16℃</span><br/><br/>
<strong>🍷 醒酒：</strong><br/>
<span style="color:#666">• 年份波特：需醒酒2-3小时</span><br/>
<span style="color:#666">• Ruby/LBV：可即饮</span><br/>
<span style="color:#666">• 茶色波特：开瓶即饮</span><br/><br/>
<strong>🍽 配餐建议：</strong><br/>
<span style="color:#666">• 甜点：蓝纹奶酪、巧克力、焦糖布丁</span><br/>
<span style="color:#666">• 干型：坚果、熟食、烤肉</span><br/>
<span style="color:#666">• 开胃：白波特配橄榄、薄荷</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 开瓶后：冰箱可保存1-2周（茶色）</span><br/>
<span style="color:#666">• 未开瓶：避光保存，15-20℃</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2c0e0e,#4a1c1c);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd700;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f8d7da;font-size:14px;line-height:1.8;margin:0">波特酒是加强型葡萄酒的教科书，从几十元的Ruby到数千元的Vintage，这里有无尽的选择。它不需要昂贵的酒柜，不需要复杂的仪式——打开一瓶好波特，和朋友分享，便是最好的时光。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄牙波特酒入门文章');
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
    title: `🍷 ${date.chinese} 葡萄牙波特酒入门：波特酒·杜罗河·加强酒`,
    author: '红酒顾问',
    digest: '波特酒是葡萄牙的国宝，全球最著名的加强型葡萄酒。本文详解酿造工艺、五大类型、传奇酒庄和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `portugal_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'portugal_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/portugal_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();