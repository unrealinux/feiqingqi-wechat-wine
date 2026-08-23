/**
 * 新世界 vs 旧世界对比指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实对比封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实对比封面...');
  
  const coverPath = path.join(__dirname, 'output', 'world_cover_real.png');
  const prompt = 'Photorealistic split view of wine world: left side old world French vineyard with stone chateau, right side new world modern winery with stainless steel tanks, professional photography, warm lighting, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('world_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 新世界 vs 旧世界</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">风格·工艺·法规·口感差异</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'world_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#1a237e"/>
      <stop offset="100%" style="stop-color:#283593"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  <g transform="translate(200, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(400, 60)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">新 vs 旧</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">世界</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <g transform="translate(600, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 新世界 vs 旧世界</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">风格·工艺·法规·口感差异</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'world_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成新世界 vs 旧世界文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .compare-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .compare-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 新世界 vs 旧世界</h2>
<p style="text-align: center; color: #666;">风格·工艺·法规·口感差异</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">葡萄酒世界分为<strong style="color:#ffd740">两大阵营</strong>：旧世界（法国、意大利）和新世界（美国、澳洲）。理解它们的差异，是通往品酒大师的必经之路。</p>
</section>

<h3>🌍 一、什么是旧世界与新世界</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🗺 旧世界（Old World）</strong><br/>
<span style="color:#666">• 地区：法国、意大利、西班牙、德国、葡萄牙</span><br/>
<span style="color:#666">• 特点：传统工艺、风土驱动、法规严格</span><br/>
<span style="color:#666">• 风格：优雅、高酸、相对低酒精度（12-13.5%）</span></p>

<p style="color:#333;line-height:1.8"><strong>🗺 新世界（New World）</strong><br/>
<span style="color:#666">• 地区：美国、澳洲、新西兰、智利、阿根廷、南非</span><br/>
<span style="color:#666">• 特点：现代科技、果味驱动、创新自由</span><br/>
<span style="color:#666">• 风格：饱满、高酒精度（13.5-15%）、果味爆炸</span></p>
</section>

<h3>📊 二、核心差异对比</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">旧世界</td>
<td style="padding:10px;font-weight:bold">新世界</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>法规</strong></td>
<td style="padding:10px;color:#666">严格AOC/DOC系统</td>
<td style="padding:10px;color:#666">相对宽松，鼓励创新</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>风土</strong></td>
<td style="padding:10px;color:#666">核心概念，土地决定风格</td>
<td style="padding:10px;color:#666">果味为主，土地影响较小</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>酿造</strong></td>
<td style="padding:10px;color:#666">传统法，少干预</td>
<td style="padding:10px;color:#666">现代科技，精准控制</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>橡木桶</strong></td>
<td style="padding:10px;color:#666">法国橡木，谨慎使用</td>
<td style="padding:10px;color:#666">美国橡木，重度使用</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>口感</strong></td>
<td style="padding:10px;color:#666">优雅、高酸、陈年潜力强</td>
<td style="padding:10px;color:#666">饱满、果味、即饮为主</td>
</tr>
</table>
</section>

<h3>🍇 三、旧世界代表：法国 vs 新世界代表：美国</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="compare-item">
<h4>🇫🇷 法国（波尔多 vs 勃艮第）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 波尔多：</strong>赤霞珠+梅洛，力量与结构的代名词<br/>
<strong>• 勃艮第：</strong>黑皮诺+霞多丽，风土的极致表达<br/>
<strong>• 法规：</strong>1855分级（酒庄）、AOC（产地）<br/>
<strong>• 风格：</strong>优雅细腻，陈年潜力20-50年</p>
</div>

<div class="compare-item">
<h4>🇺🇸 美国（纳帕谷）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 品种：</strong>赤霞珠为主，果味爆炸型<br/>
<strong>• 特点：</strong>1976年"巴黎审判"一战成名<br/>
<strong>• 法规：</strong>AVA系统，相对宽松<br/>
<strong>• 风格：</strong>饱满酒体，高酒精度（14-15%），即饮为主</p>
</div>

</section>

<h3>🍷 四、口感差异测试</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🛒 盲品对比</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 旧世界酒（如波尔多2015）</strong><br/>
<span style="color:#666">• 颜色：较浅（边缘偏砖红）</span><br/>
<span style="color:#666">• 香气：灌木丛、铅笔芯、湿石头</span><br/>
<span style="color:#666">• 口感：高酸、紧致单宁、余味悠长</span><br/>
<span style="color:#666">• 配餐：红肉、奶酪，陈年后更优雅</span></p>

<p style="color:#333;line-height:1.8"><strong>🍷 新世界酒（如纳帕谷2015）</strong><br/>
<span style="color:#666">• 颜色：深邃（紫黑色）</span><br/>
<span style="color:#666">• 香气：成熟黑果、香草、椰子（美桶）</span><br/>
<span style="color:#666">• 口感：饱满、圆润单宁、果味主导</span><br/>
<span style="color:#666">• 配餐：牛排、烤肉，即开即饮</span></p>
</section>

<h3>📅 五、年份重要性差异</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🗓 旧世界：年份至关重要</strong><br/>
<span style="color:#666">• 波尔多：2010、2015、2016是传奇年份</span><br/>
<span style="color:#666">• 勃艮第：2012、2015、2017是经典年份</span><br/>
<span style="color:#666">• 差年份价格可能只有好年份的30-50%</span></p>

<p style="color:#333;line-height:1.8"><strong>🗓 新世界：年份不那么重要</strong><br/>
<span style="color:#666">• 阳光充足，年份差异小</span><br/>
<span style="color:#666">• 科技弥补气候不足（灌溉、采摘时间）</span><br/>
<span style="color:#666">• 价格相对稳定，不受年份影响大</span></p>
</section>

<h3>💰 六、价格差异</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">价格段</td>
<td style="padding:10px;font-weight:bold">旧世界</td>
<td style="padding:10px;font-weight:bold">新世界</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>100-300元</strong></td>
<td style="padding:10px;color:#666">IGP、VdF级别，日常餐酒</td>
<td style="padding:10px;color:#666">澳洲夏敦埃、智利赤霞珠</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>300-800元</strong></td>
<td style="padding:10px;color:#666">村庄级、中级庄</td>
<td style="padding:10px;color:#666">纳帕谷入门、新西兰黑皮诺</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>800元以上</strong></td>
<td style="padding:10px;color:#666">列级庄、特级园</td>
<td style="padding:10px;color:#666">顶级纳帕、澳洲葛兰许</td>
</tr>
</table>
</section>

<h3>⚠️ 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：新世界酒都是便宜货</strong><br/>
<span style="color:#666">事实上，顶级纳帕谷（如Screaming Eagle）可以卖到2万-5万元/瓶，比许多旧世界酒更贵。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：旧世界酒一定好喝</strong><br/>
<span style="color:#666">差年份的旧世界酒可能酸涩难饮，而好年份的新世界酒可能更让人愉悦。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：新世界没有风土</strong><br/>
<span style="color:#666">事实上，新西兰中奥塔哥、澳洲巴罗萨都有独特的风土表达。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4：旧世界都适合陈年</strong><br/>
<span style="color:#666">日常餐酒（VdF、IGP）适合3年内饮用，不要盲目陈年。</span></p>
</section>

<h3>💡 八、选购建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 如果你是新手：</strong><br/><br/>
<span style="color:#666">• 从新世界开始（澳洲、智利、美国）</span><br/>
<span style="color:#666">• 果味饱满，容易入口，不需要专业知识</span><br/>
<span style="color:#666">• 推荐：澳洲设拉子、美国赤霞珠</span><br/><br/>
<strong>🟢 如果你想进阶：</strong><br/><br/>
<span style="color:#666">• 尝试旧世界（法国、意大利）</span><br/>
<span style="color:#666">• 理解风土、年份、AOC系统</span><br/>
<span style="color:#666">• 推荐：波尔多、勃艮第、基安蒂</span><br/><br/>
<strong>🟢 如果你想投资：</strong><br/><br/>
<span style="color:#666">• 旧世界顶级酒（列级庄、特级园）</span><br/>
<span style="color:#666">• 新世界产量大，流动性较差</span><br/>
<span style="color:#666">• 投资首选：波尔多一级庄、勃艮第特级园</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">新世界和旧世界不是好坏之分，而是<strong>风格的差异</strong>。新世界果味饱满适合新手，旧世界风土复杂适合进阶。最好的方式是<strong>都尝试</strong>，找到自己的最爱。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成新世界 vs 旧世界对比文章');
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
    title: `🍷 ${date.chinese} 新世界 vs 旧世界：风格·工艺·法规·口感差异`,
    author: '红酒顾问',
    digest: '葡萄酒世界分为两大阵营：旧世界和新世界。本文详解它们的核心差异、口感对比、年份重要性和选购建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `world_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'world_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/world_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
