/**
 * 澳洲葡萄酒入门文章生成器*
 * 使用 baoyu-imagine + DashScope 生成写实封面，发布到微信公众号草稿箱*
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
 * 使用 baoyu-imagine + DashScope 生成写实澳洲封面*
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实澳洲封面...');
  
  const coverPath = path.join(__dirname, 'output', 'australian_cover_real.png');
  const prompt = 'Photorealistic Australian vineyard landscape, Barossa Valley with Shiraz grapes, modern winery with stainless steel tanks, professional landscape photography, warm lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('australian_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#D4AF37"/>
            <stop offset="100%" style="stop-color:#F4E4BC"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 澳洲葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">设拉子 · 霞多丽 · 帕斯灰皮诺</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'australian_cover_ai.png');
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
 * 本地备用封面*
 */
function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a237e"/>
      <stop offset="100%" style="stop-color:#283593"/>
    </linearGradient>
    <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#bottleGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">澳洲</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">葡萄酒</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 澳洲葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">设拉子 · 霞多丽 · 帕斯灰皮诺</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'australian_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成澳洲葡萄酒入门文章内容*
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 澳洲葡萄酒入门</h2>
<p style="text-align: center; color: #666;">设拉子 · 霞多丽 · 帕斯灰皮诺</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">澳洲是<strong style="color:#ffd740">新世界葡萄酒的标杆</strong>，以<strong style="color:#ffd740">设拉子（Shiraz）</strong>闻名全球。这里阳光充足、科技先进，每瓶酒都充满<strong style="color:#ffd740">果味爆炸与饱满酒体</strong>。</p>
</section>

<h3>🗺 一、澳洲葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 四大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 巴罗萨山谷（Barossa Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>南澳洲，气候炎热干燥<br/>
<strong>• 品种：</strong>设拉子（Shiraz）为主<br/>
<strong>• 风格：</strong>饱满酒体，黑果+香料+巧克力<br/>
<strong>• 推荐年份：</strong>2010、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 猎人谷（Hunter Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>新南威尔士，澳洲最古老产区<br/>
<strong>• 品种：</strong>设拉子、赛美蓉（Semillon）<br/>
<strong>• 风格：</strong>优雅细腻，陈年潜力强<br/>
<strong>• 推荐年份：</strong>2012、2015、2017</p>
</div>

<div class="region-item">
<h4>🏠 玛格利特河（Margaret River）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>西澳洲，海洋性气候<br/>
<strong>• 品种：</strong>赤霞珠、霞多丽<br/>
<strong>• 风格：</strong>波尔多风格，结构感强<br/>
<strong>• 推荐年份：</strong>2013、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 雅拉山谷（Yarra Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>维多利亚，气候凉爽<br/>
<strong>• 品种：</strong>霞多丽、黑皮诺<br/>
<strong>• 风格：</strong>优雅细腻，高酸度<br/>
<strong>• 推荐年份：</strong>2012、2015、2017</p>
</div>

</section>

<h3>🍷 二、必知的7大酒款</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 奔富（Penfolds Grange）—— 澳洲酒王</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>澳洲最顶级的设拉子酒<br/>
<strong>• 价格：</strong>约 2,000-5,000元/瓶<br/>
<strong>• 特点：</strong>饱满酒体，黑果+香料+巧克力<br/>
<strong>• 陈年：</strong>可以陈年20-40年<br/>
<strong>• 推荐酒款：</strong>Grange、Bin 707</p>
</div>

<div class="region-item">
<h4>🔴 托布雷（Torbreck）—— 设拉子专家</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>巴罗萨设拉子的标杆<br/>
<strong>• 价格：</strong>约 300-1,500元/瓶<br/>
<strong>• 特点：</strong>果味爆炸，饱满酒体<br/>
<strong>• 推荐酒款：</strong>RunRig、The Struie</p>
</div>

<div class="region-item">
<h4>🔴 露纹（Leeuwin Estate）—— 霞多丽之王</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>玛格利特河霞多丽标杆<br/>
<strong>• 价格：</strong>约 400-1,200元/瓶<br/>
<strong>• 特点：</strong>饱满酒体，热带水果香<br/>
<strong>• 推荐酒款：</strong>Art Series Chardonnay</p>
</div>

<div class="region-item">
<h4>🔴 奔富（Penfolds Bin 389）—— 入门首选</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>澳洲最知名的入门酒<br/>
<strong>• 价格：</strong>约 200-400元/瓶<br/>
<strong>• 特点：</strong>饱满酒体，果味易饮<br/>
<strong>• 推荐酒款：</strong>Bin 389、Bin 28</p>
</div>

<div class="region-item">
<h4>🔴 特拉威（Taylors Wines）—— 设拉子专家</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>巴罗萨设拉子专家<br/>
<strong>• 价格：</strong>约 150-500元/瓶<br/>
<strong>• 特点：</strong>果味饱满，性价比极高<br/>
<strong>• 推荐酒款：</strong>Reserve Shiraz</p>
</div>

<div class="region-item">
<h4>🔴 冷溪山（Coldstream Hills）—— 雅拉黑皮诺</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>澳洲黑皮诺标杆<br/>
<strong>• 价格：</strong>约 300-800元/瓶<br/>
<strong>• 特点：</strong>优雅细腻，樱桃+蘑菇<br/>
<strong>• 推荐酒款：</strong>Reserve Pinot Noir</p>
</div>

<div class="region-item">
<h4>🔴 格罗斯（Grosset）—— 雷司令专家</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>克莱尔谷雷司令之王<br/>
<strong>• 价格：</strong>约 200-600元/瓶<br/>
<strong>• 特点：</strong>高酸度，青苹果+矿物质<br/>
<strong>• 推荐酒款：</strong>Polish Hill Riesling</p>
</div>

</section>

<h3>🍇 三、澳洲 vs 法国对比</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">澳洲（新世界）</td>
<td style="padding:10px;font-weight:bold">法国（旧世界）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>气候</strong></td>
<td style="padding:10px;color:#666">阳光充足，温暖干燥</td>
<td style="padding:10px;color:#666">相对凉爽，多变</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>品种</strong></td>
<td style="padding:10px;color:#666">设拉子、霞多丽</td>
<td style="padding:10px;color:#666">赤霞珠、黑皮诺</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>风格</strong></td>
<td style="padding:10px;color:#666">饱满、果味爆炸、高酒精</td>
<td style="padding:10px;color:#666">优雅、酸度驱动、陈年型</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>酿造</strong></td>
<td style="padding:10px;color:#666">科技精准，少干预</td>
<td style="padding:10px;color:#666">传统工艺，风土驱动</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#666">100-500元为主</td>
<td style="padding:10px;color:#666">从100到100,000元+</td>
</tr>
</table>
</section>

<h3>💎 四、高性价比酒款推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 100-300 元</strong><br/>
<span style="color:#666">• 奔富 Bin 28、Bin 128</span><br/>
<span style="color:#666">• 特拉威普罗米多（Promised Land）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎💎 300-800 元</strong><br/>
<span style="color:#666">• 奔富 Bin 389、Bin 407</span><br/>
<span style="color:#666">• 露纹 Art Series 霞多丽</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800 元以上</strong><br/>
<span style="color:#666">• 奔富 Grange（澳洲酒王）</span><br/>
<span style="color:#666">• 托布雷 The Struie、RunRig</span></p>
</section>

<h3>🍷 五、设拉子 vs 西拉</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🌍 两大设拉子风格</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 澳洲设拉子（Shiraz）</strong><br/>
<span style="color:#666">• 风格：饱满酒体，黑果+香料+巧克力</span><br/>
<span style="color:#666">• 酒精度：14-15%+，果味爆炸</span><br/>
<span style="color:#666">• 代表：奔富、托布雷、特拉威</span></p>

<p style="color:#333;line-height:1.8"><strong>🔴 法国西拉（Syrah）</strong><br/>
<span style="color:#666">• 风格：更优雅，黑橄榄+胡椒</span><br/>
<span style="color:#666">• 酒精度：13-14%，酸度更高</span><br/>
<span style="color:#666">• 代表：吉佳乐（Guigal）、莎普蒂尔（Chapoutier）</span></p>
</section>

<h3>📅 六、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">评分</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2010</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，结构完美，陈年潜力极佳</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2015</strong></td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">温暖年份，酒体饱满，果味爆炸</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2016</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅平衡，酸度漂亮，适饮期较早</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2017</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，果味纯净，优雅细腻</td>
</tr>
</table>
</section>

<h3>💰 七、投资建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资：</strong><br/><br/>
<strong>• 奔富 Grange</strong> - 澳洲酒王，拍卖市场活跃<br/>
<span style="color:#666">品牌价值极高，陈年潜力20-40年</span><br/><br/>
<strong>• 露纹 Art Series</strong> - 霞多丽标杆<br/>
<span style="color:#666">白葡萄酒也能陈年，独特风格</span><br/><br/>
<strong>• 托布雷顶级款</strong> - The Struie、RunRig<br/>
<span style="color:#666">设拉子专家，国际市场认可</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 澳洲酒产量大，流动性不如法国</span><br/>
<span style="color:#666">• 关注澳洲拍卖行（如Langton's）的成交价</span><br/>
<span style="color:#666">• 入门酒不适合投资，只适合饮用</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">澳洲是阳光与科技的结晶。从100元的入门酒到5000元的酒王，这里有无尽的探索空间。掌握设拉子的秘密，你就能找到最适合自己的澳洲酒。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱*
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成澳洲葡萄酒入门文章');
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
    title: `🍷 ${date.chinese} 澳洲葡萄酒入门：设拉子·霞多丽·帕斯灰皮诺`,
    author: '红酒顾问',
    digest: '澳洲是新世界葡萄酒的标杆，以设拉子闻名。本文详解四大核心产区、7大必知酒款、设拉子vs西拉对比。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `australian_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'australian_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/australian_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
