/**
 * 勃艮第产区巡礼文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实勃艮第封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实勃艮第封面...');
  
  const coverPath = path.join(__dirname, 'output', 'burgundy_cover_real.png');
  const prompt = 'Photorealistic aerial view of Burgundy vineyard at golden hour, rows of Pinot Noir grapevines, historic French chateau with stone architecture, Romanée-Conti vineyard, professional landscape photography, warm lighting, ultra detailed, 8K quality';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('burgundy_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 勃艮第产区巡礼</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">黑皮诺的故乡 · 风土传奇 · 特级园</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'burgundy_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#4a0e2e"/>
      <stop offset="100%" style="stop-color:#722F37"/>
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
  <g transform="translate(350, 40)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#4a0e2e" text-anchor="middle">勃艮第</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#4a0e2e" text-anchor="middle">产区巡礼</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#2a0a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 勃艮第产区巡礼</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">黑皮诺的故乡 · 风土传奇 · 特级园</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'burgundy_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成勃艮第产区文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #722F37; }
  .item { margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
  .item:last-child { border-bottom: none; }
  .name { font-weight: bold; color: #333; font-size: 16px; }
  .info { color: #666; font-size: 14px; margin-top: 5px; }
  .price { color: #d4af37; font-weight: bold; }
  .tag { background: #fce4ec; color: #c2185b; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
  h3 { color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #722F37;">🍷 ${date.chinese} 勃艮第产区巡礼：黑皮诺的故乡</h2>
<p style="text-align: center; color: #666;">黑皮诺的故乡 · 风土传奇 · 特级园</p>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#fce4ec;font-size:16px;line-height:1.9">勃艮第（Bourgogne）是法国最精致、最昂贵的葡萄酒产区之一。这里以<strong style="color:#ffd740">黑皮诺（Pinot Noir）</strong>和<strong style="color:#ffd740">霞多丽（Chardonnay）</strong>闻名于世，每一瓶酒都是风土（Terroir）的完美表达。</p>
</section>

<h3>🌍 一、勃艮第在哪里</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">勃艮第位于法国中部，从第戎（Dijon）向南延伸至里昂（Lyon），全长约360公里。产区分为四大区域：</p>
<p style="color:#333;line-height:1.8"><strong>📍 核心子产区：</strong><br/>
• <strong>夏布利（Chablis）</strong> - 最北端，只产霞多丽白葡萄酒<br/>
• <strong>夜丘（Côte de Nuits）</strong> - 黑皮诺的圣地，特级园集中地<br/>
• <strong>伯恩丘（Côte de Beaune）</strong> - 红白葡萄酒并重，默尔索（Meursault）所在地<br/>
• <strong>马贡（Mâconnais）</strong> - 最南端，出产性价比高的霞多丽</p>
</section>

<h3>🍇 二、勃艮第的分级制度</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">
<p style="color:#c2185b;font-weight:bold;margin-bottom:15px">🏆 从低到高的等级</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟢 大区级 AOC（Bourgogne AOC）</strong><br/>
<span style="color:#666">最基础的等级，覆盖整个勃艮第产区，约占产量50%。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟡 村庄级 AOC（Village AOC）</strong><br/>
<span style="color:#666">来自特定村庄，如热夫雷-香贝丹（Gevrey-Chambertin）、沃恩-罗曼尼（Vosne-Romanée）。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟠 一级园（Premier Cru）</strong><br/>
<span style="color:#666">品质优秀的葡萄园，地块名称会标注在酒标上，如"Les Amoureuses"。</span></p>

<p style="color:#333;line-height:1.8"><strong>🔴 特级园（Grand Cru）</strong><br/>
<span style="color:#666">最高等级，仅占产量的1-2%。共有33个特级园，如罗曼尼·康帝（Romanee-Conti）、拉塔希（La Tâche）。</span></p>
</section>

<h3>👑 三、传奇酒庄与特级园</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🔴 特级园（Grand Cru）</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 罗曼尼·康帝（Romanee-Conti）</strong><br/>
<span style="color:#666">• 地位：勃艮第之王，全球最昂贵的葡萄酒之一</span><br/>
<span style="color:#666">• 价格：约10万-30万元/瓶</span><br/>
<span style="color:#666">• 特点：丝滑单宁，花香馥郁，陈年潜力50年+</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 拉塔希（La Tâche）</strong><br/>
<span style="color:#666">• 地位：康帝酒庄的独占园，品质接近康帝</span><br/>
<span style="color:#666">• 价格：约3万-8万元/瓶</span><br/>
<span style="color:#666">• 特点：结构宏大，层次复杂，适合长期陈年</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 蒙哈榭（Montrachet）</strong><br/>
<span style="color:#666">• 地位：全球最昂贵的白葡萄酒产区</span><br/>
<span style="color:#666">• 价格：约5,000-15,000元/瓶</span><br/>
<span style="color:#666">• 特点：霞多丽白葡萄酒，黄油、坚果、矿物质感</span></p>

<p style="color:#333;line-height:1.8"><strong>🍷 香贝丹（Chambertin）</strong><br/>
<span style="color:#666">• 地位：拿破仑最爱的酒，被称为"国王的葡萄酒"</span><br/>
<span style="color:#666">• 价格：约3,000-6,000元/瓶</span><br/>
<span style="color:#666">• 特点：力量与优雅的平衡，陈年潜力30年+</span></p>
</section>

<h3>💎 四、高性价比酒庄推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 300-800 元</strong><br/>
<span style="color:#666">• 约瑟夫·杜鲁安（Joseph Drouhin）- 勃艮第大酒商，品质稳定</span><br/>
<span style="color:#666">• 路易·亚都（Louis Jadot）- 产量大，入门首选</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 800-3000 元</strong><br/>
<span style="color:#666">• 阿曼·卢梭（Armand Rousseau）- 热夫雷-香贝丹的专家</span><br/>
<span style="color:#666">• 拉芳（Lafon）- 默尔索顶级生产者</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 3000 元以上</strong><br/>
<span style="color:#666">• 康帝酒庄（DRC）- 罗曼尼·康帝的拥有者</span><br/>
<span style="color:#666">• 勒桦酒庄（Leroy）- 勃艮第女王的传奇酒庄</span></p>
</section>

<h3>🍷 五、勃艮第 vs 波尔多</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1565c0;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">勃艮第</td>
<td style="padding:10px;font-weight:bold">波尔多</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>主要品种</strong></td>
<td style="padding:10px;color:#666">黑皮诺、霞多丽</td>
<td style="padding:10px;color:#666">赤霞珠、梅洛</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>风格</strong></td>
<td style="padding:10px;color:#666">优雅、细腻、风土驱动</td>
<td style="padding:10px;color:#666">强劲、结构感、酒庄驱动</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>分级</strong></td>
<td style="padding:10px;color:#666">按葡萄园分级（Grand Cru）</td>
<td style="padding:10px;color:#666">按酒庄分级（1855列级庄）</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>产量</strong></td>
<td style="padding:10px;color:#666">小（1-2万瓶/酒庄）</td>
<td style="padding:10px;color:#666">大（10-30万瓶/酒庄）</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#666">普遍较高（风土溢价）</td>
<td style="padding:10px;color:#666">从亲民到天价都有</td>
</tr>
</table>
</section>

<h3>📅 六、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#722F37;color:white">
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
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">优雅平衡，果味纯净，适饮期较早</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2019</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">温暖年份，酒体饱满，果味爆炸</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>2012</strong></td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，酸度漂亮，优雅细腻</td>
</tr>
</table>
</section>

<h3>💰 七、投资建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资：</strong><br/><br/>
<strong>• 特级园（Grand Cru）</strong> - 罗曼尼·康帝、拉塔希、蒙哈榭<br/>
<span style="color:#666">产量稀少，价格持续上涨，流动性较好</span><br/><br/>
<strong>• 一级园（Premier Cru）</strong> - 来自顶级酒庄<br/>
<span style="color:#666">品质有保障，价格相对亲民</span><br/><br/>
<strong>• 顶级酒商</strong> - DRC、Leroy、Rousseau<br/>
<span style="color:#666">品牌价值极高，拍卖市场活跃</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 勃艮第假酒同样泛滥，务必通过正规渠道购买</span><br/>
<span style="color:#666">• 2018年后年份因产量增加而价格趋稳，谨慎追高</span><br/>
<span style="color:#666">• 关注勃艮第拍卖行（如iDealwine）的成交价</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#fce4ec;font-size:14px;line-height:1.8;margin:0">勃艮第是风土的殿堂。从几百元的村庄级到数十万元的特级园，这里每一瓶酒都讲述着土地的故事。理解风土，是通往葡萄酒大师之路的必修课。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒产区</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成勃艮第产区巡礼文章');
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
    title: `🍷 ${date.chinese} 勃艮第产区巡礼：黑皮诺的故乡`,
    author: '红酒顾问',
    digest: '勃艮第是法国最精致的葡萄酒产区，以黑皮诺和霞多丽闻名。本文详解分级制度、传奇特级园、经典年份和投资价值。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `burgundy_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'burgundy_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/burgundy_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
