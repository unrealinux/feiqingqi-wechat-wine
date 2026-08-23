/**
 * 红酒投资完全指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实投资封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实投资封面...');
  
  const coverPath = path.join(__dirname, 'output', 'investment_cover_real.png');
  const prompt = 'Photorealistic wine investment concept, premium wine bottles with price tags, auction gavel, professional photography, warm lighting, luxury wine cellar background, 8K ultra-detailed, financial magazine style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('investment_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 红酒投资完全指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">增值·避险·实操策略</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'investment_cover_ai.png');
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
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">投资</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 红酒投资完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">增值·避险·实操策略</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'investment_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成红酒投资文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .tip-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .tip-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 红酒投资完全指南</h2>
<p style="text-align: center; color: #666;">增值·避险·实操策略</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">顶级红酒不仅是饮品，更是<strong style="color:#ffd740">另类资产</strong>。过去20年，波尔多一级庄价格涨幅超过<strong style="color:#ffd740">300%</strong>。本文详解投资逻辑、避坑指南和实操策略。</p>
</section>

<h3>💰 一、红酒为什么能投资</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📈 抗通胀属性</strong><br/>
<span style="color:#666">红酒产量固定（受气候影响），但全球需求增长。供需失衡推动长期价格上涨。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📈 奢侈品属性</strong><br/>
<span style="color:#666">顶级酒庄产量有限（如拉菲年产2万箱），稀缺性决定价值。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📈 零维护成本</strong><br/>
<span style="color:#666">黄金要保险箱，股票要交税。红酒只需恒温酒柜，持有成本极低。</span></p>

<p style="color:#333;line-height:1.8"><strong>📈 享受+投资双收益</strong><br/>
<span style="color:#666">股价涨了也不能吃，红酒涨了可以喝——投资体验极佳。</span></p>
</section>

<h3>🏆 二、投资级酒款清单</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="tip-item">
<h4>🔴 法国波尔多（优先）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>一级庄（5大）：</strong>拉菲、拉图、玛歌、侯伯王、木桐<br/>
<span style="color:#666">• 特点：品牌价值极高，流动性好，拍卖市场活跃</span><br/>
<span style="color:#666">• 涨幅：过去20年涨幅200-400%</span><br/>
<span style="color:#666">• 推荐年份：2010、2015、2016</span></p>
</div>

<div class="tip-item">
<h4>🔴 法国勃艮第</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>特级园（Grand Cru）：</strong>罗曼尼·康帝、拉塔希、蒙哈榭<br/>
<span style="color:#666">• 特点：产量稀少（仅几千瓶），价格持续上涨</span><br/>
<span style="color:#666">• 涨幅：过去10年涨幅300-500%（稀缺性驱动）</span><br/>
<span style="color:#666">• 风险：产量太低，流动性较差</span></p>
</div>

<div class="tip-item">
<h4>🔴 意大利</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>顶级酒：</strong>西施佳乐（Sassicaia）、奥纳亚（Ornellaia）、嘉雅（Gaja）<br/>
<span style="color:#666">• 特点：国际知名度高，价格相对亲民</span><br/>
<span style="color:#666">• 涨幅：过去10年涨幅150-250%</span></p>
</div>

</section>

<h3>💎 三、不同预算投资策略</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="tip-item">
<h4>💎 10万以内（入门）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>策略：</strong>买知名度高的酒，流动性好<br/>
<span style="color:#666">• 波尔多五级庄/超二级庄（雄狮、碧尚男爵）</span><br/>
<span style="color:#666">• 勃艮第一级园（Premier Cru）</span><br/>
<span style="color:#666">• 意大利顶级酒（西施佳乐、奥纳亚）</span><br/>
<span style="color:#666">💡 预期年化收益：5-8%</span></p>
</div>

<div class="tip-item">
<h4>💎💎 10-50万（进阶）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>策略：</strong>配置一级庄+特级园，追求稀缺性<br/>
<span style="color:#666">• 波尔多一级庄（拉菲、拉图、玛歌等）</span><br/>
<span style="color:#666">• 勃艮第特级园（罗曼尼·康帝、拉塔希）</span><br/>
<span style="color:#666">• 香槟（唐培里侬、库克）</span><br/>
<span style="color:#666">💡 预期年化收益：8-12%</span></p>
</div>

<div class="tip-item">
<h4>💎💎💎 50万+（骨灰级）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>策略：</strong>收藏级酒款，追求极致稀缺<br/>
<span style="color:#666">• 罗曼尼·康帝独占园（La Romanée-Conti）</span><br/>
<span style="color:#666">• 波尔多世纪年份（1945、1961、1982）</span><br/>
<span style="color:#666">• 大瓶装（1.5L、3L、6L）</span><br/>
<span style="color:#666">💡 预期年化收益：10-15%（稀缺性溢价）</span></p>
</div>

</section>

<h3>⚠️ 四、投资避坑指南</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;font-weight:bold;margin-bottom:15px">❌ 致命错误清单</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>❌ 买假酒</strong><br/>
<span style="color:#666">• 中国假酒率估算30%+，务必通过Acker、Zachyys、ASC等正规渠道</span><br/>
<span style="color:#666">• 避坑：价格远低于市场价=99.9%是假酒</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>❌ 储存不当</strong><br/>
<span style="color:#666">• 没酒柜=投资归零，温度波动会让酒在1年内变质</span><br/>
<span style="color:#666">• 避坑：必须恒温12-15℃，湿度65-75%</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>❌ 买错年份</strong><br/>
<span style="color:#666">• 差年份（2013、2014）涨幅远低于好年份（2010、2015）</span><br/>
<span style="color:#666">• 避坑：查Wine-Searcher历史价格，避免追高</span></p>

<p style="color:#333;line-height:1.8"><strong>❌ 买新世界酒</strong><br/>
<span style="color:#666">• 加州、澳洲酒拍卖流动性差，转手困难</span><br/>
<span style="color:#666">• 避坑：初学者只买法国、意大利、西班牙</span></p>
</section>

<h3>📊 五、实操步骤指南</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">✅ 5步开始投资</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 设定预算</strong><br/>
<span style="color:#666">• 闲钱投资，不影响生活</span><br/>
<span style="color:#666">• 起步5-10万，分散到5-10款酒</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 选择渠道</strong><br/>
<span style="color:#666">• 拍卖行：Acker Merrall & Condit、Sotheby's、Hart Davis</span><br/>
<span style="color:#666">• 酒商：Zachyys、KL Wines、ASC Fine Wines</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 检查真伪</strong><br/>
<span style="color:#666">• 原木箱（Original Wooden Case）</span><br/>
<span style="color:#666">• 酒标完美无破损、液位正常（Fill Level）</span><br/>
<span style="color:#666">• 索要来源证明（Provenance）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 专业储存</strong><br/>
<span style="color:#666">• 租用专业酒窖（如Cave de Prestige）</span><br/>
<span style="color:#666">• 或购买专业酒柜（EuroCave、Liebherr）</span></p>

<p style="color:#333;line-height:1.8"><strong>5. 设定退出</strong><br/>
<span style="color:#666">• 持有期：5-10年（享受陈年收益）</span><br/>
<span style="color:#666">• 退出渠道：原购买渠道回购、拍卖行、私人转让</span></p>
</section>

<h3>📈 六、市场数据速查</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">酒款</td>
<td style="padding:10px;font-weight:bold">2010年份价格</td>
<td style="padding:10px;font-weight:bold">2020年份价格</td>
<td style="padding:10px;font-weight:bold">10年涨幅</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>拉菲 2010</strong></td>
<td style="padding:10px;color:#666">¥3,500/瓶</td>
<td style="padding:10px;color:#666">¥12,000/瓶</td>
<td style="padding:10px;color:#d4af37;font-weight:bold">+242%</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>拉图 2010</strong></td>
<td style="padding:10px;color:#666">¥3,000/瓶</td>
<td style="padding:10px;color:#666">¥9,500/瓶</td>
<td style="padding:10px;color:#d4af37;font-weight:bold">+216%</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>罗曼尼·康帝 2010</strong></td>
<td style="padding:10px;color:#666">¥80,000/瓶</td>
<td style="padding:10px;color:#666">¥350,000/瓶</td>
<td style="padding:10px;color:#d4af37;font-weight:bold">+337%</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>西施佳乐 2010</strong></td>
<td style="padding:10px;color:#666">¥2,500/瓶</td>
<td style="padding:10px;color:#666">¥8,000/瓶</td>
<td style="padding:10px;color:#d4af37;font-weight:bold">+220%</td>
</tr>
</table>
<p style="color:#666;font-size:14px;margin-top:15px">💡 数据来源：Wine-Searcher、Liv-ex（伦敦国际红酒交易所）</p>
</section>

<h3>💡 七、新手建议</h3>
<section style="background:#fffde7;padding:18px;border-radius:8px;border-left:3px solid #ffa000">
<p style="color:#f57f17;font-weight:bold;margin-bottom:15px">🛒 给新手的5条金科玉律</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 买你懂的酒</strong><br/>
<span style="color:#666">不懂勃艮第？先从波尔多开始。不懂意大利？先从基安蒂开始。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 买大品牌</strong><br/>
<span style="color:#666">拉菲、拉图认知度高，转手容易。小众酒庄再好也难卖。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 买好年份</strong><br/>
<span style="color:#666">2010、2015、2016是波尔多传奇年份。差年份涨幅远低于好年份。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 买原木箱</strong><br/>
<span style="color:#666">12瓶原箱（OWC）比单瓶贵10-15%，但流动性更好。</span></p>

<p style="color:#333;line-height:1.8"><strong>5. 别追高</strong><br/>
<span style="color:#666">2020年波尔多期酒（En primeur）买涨了？等回调再入场。</span></p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">红酒投资是门艺术，也是科学。选对酒款、管对储存、选对时机，你的酒柜就是座金矿。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成红酒投资完全指南文章');
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
    title: `🍷 ${date.chinese} 红酒投资完全指南：增值·避险·实操策略`,
    author: '红酒顾问',
    digest: '顶级红酒不仅是饮品，更是另类资产。本文详解投资逻辑、避坑指南、不同预算策略和实操步骤。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `investment_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'investment_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/investment_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
