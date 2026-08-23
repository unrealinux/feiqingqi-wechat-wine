/**
 * 西班牙葡萄酒入门文章生成器*
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
 * 使用 baoyu-imagine + DashScope 生成写实西班牙封面*
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实西班牙封面...');
  
  const coverPath = path.join(__dirname, 'output', 'spanish_cover_real.png');
  const prompt = 'Photorealistic Spanish vineyard landscape, Rioja region with Tempranillo grapes, historic stone winery, warm golden hour lighting, professional landscape photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('spanish_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 西班牙葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">里奥哈 · 普里奥拉托 · 卡瓦</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'spanish_cover_ai.png');
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
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">西班牙</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">葡萄酒</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 西班牙葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">里奥哈 · 普里奥拉托 · 卡瓦</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'spanish_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成西班牙葡萄酒入门文章内容*
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 西班牙葡萄酒入门</h2>
<p style="text-align: center; color: #666;">里奥哈 · 普里奥拉托 · 卡瓦</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">西班牙是<strong style="color:#ffd740">全球第三大葡萄酒产国</strong>，拥有<strong style="color:#ffd740">70+法定产区</strong>。从里奥哈的陈年传奇到普里奥拉托的温暖饱满，这里每一瓶酒都充满<strong style="color:#ffd740">阳光的味道</strong>。</p>
</section>

<h3>🗺 一、西班牙葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 三大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 里奥哈（Rioja）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>西班牙北部，埃布罗河谷（Ebro Valley）<br/>
<strong>• 品种：</strong>丹魄（Tempranillo）、歌海娜（Garnacha）<br/>
<strong>• 风格：</strong>陈年潜力强，红果+皮革+香草<br/>
<strong>• 推荐年份：</strong>2010、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 普里奥拉托（Priorat）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>加泰罗尼亚（Catalonia），里奥哈东北方<br/>
<strong>• 品种：</strong>歌海娜（Garnacha）、佳丽酿（Cariñena）<br/>
<strong>• 风格：</strong>酒精度高（14-15%），饱满酒体<br/>
<strong>• 推荐年份：</strong>2013、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 杜埃罗河岸（Ribera del Duero）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>西班牙中部高原，杜埃罗河沿岸<br/>
<strong>• 品种：</strong>丹魄（Tempranillo）为主<br/>
<strong>• 风格：</strong>更浓郁，单宁更强，陈年潜力极佳<br/>
<strong>• 推荐年份：</strong>2010、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 下海湾（Rías Baixas）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>西班牙西北部，靠近大西洋<br/>
<strong>• 品种：</strong>阿尔巴利诺（Albariño）<br/>
<strong>• 风格：</strong>清爽高酸，白色花果香<br/>
<strong>• 推荐年份：</strong>适合3年内饮用</p>
</div>

</section>

<h3>🍇 二、分级制度（从低到高）</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">🏆 西班牙 DO 分级</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟢 VdM（Vino de Mesa）</strong><br/>
<span style="color:#666">• 含义：日常餐酒</span><br/>
<span style="color:#666">• 约占产量50%</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟡 IGP（Indicación Geográfica Protegida）</strong><br/>
<span style="color:#666">• 含义：地区餐酒</span><br/>
<span style="color:#666">• 类似法国 IGP</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🟠 DO（Denominación de Origen）</strong><br/>
<span style="color:#666">• 含义：法定产区（共70+个）</span><br/>
<span style="color:#666">• 类似法国 AOC</span></p>

<p style="color:#333;line-height:1.8"><strong>🔴 DOCa（Denominación de Origen Calificada）</strong><br/>
<span style="color:#666">• 含义：保证法定产区（最高级）</span><br/>
<span style="color:#666">• 只有里奥哈（Rioja）和普里奥拉托（Priorat）</span></p>
</section>

<h3>👑 三、传奇酒庄与酒款</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🔴 必知酒款</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 贝加西西里亚（Vega Sicilia - Unico）</strong><br/>
<span style="color:#666">• 地位：西班牙酒王，杜埃罗河岸的传奇</span><br/>
<span style="color:#666">• 价格：约 1,500-5,000元/瓶</span><br/>
<span style="color:#666">• 特点：丹魄+赤霞珠混酿，陈年10-30年+</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 平古斯（Pingus）</strong><br/>
<span style="color:#666">• 地位：普里奥拉托的膜拜对象</span><br/>
<span style="color:#666">• 价格：约 2,000-6,000元/瓶</span><br/>
<span style="color:#666">• 特点：100%丹魄，极致浓郁饱满</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 橡树河（Roda）</strong><br/>
<span style="color:#666">• 地位：里奥哈一级庄代表</span><br/>
<span style="color:#666">• 价格：约 500-1,500元/瓶</span><br/>
<span style="color:#666">• 特点：传统法陈年，红果+香草+皮革</span></p>

<p style="color:#333;line-height:1.8"><strong>🍷 慕佳罗（Muga）</strong><br/>
<span style="color:#666">• 地位：里奥哈传统酒庄</span><br/>
<span style="color:#666">• 价格：约 300-800元/瓶</span><br/>
<span style="color:#666">• 特点：性价比极高，适合入门</span></p>
</section>

<h3>🍸 四、卡瓦（Cava）- 西班牙香槟</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">🍾 卡瓦（Cava）完全指南</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍸 什么是卡瓦？</strong><br/>
<span style="color:#666">• 定义：西班牙传统法气泡酒</span><br/>
<span style="color:#666">• 产区：主要在加泰罗尼亚（Catalonia）</span><br/>
<span style="color:#666">• 品种：马家婆（Macabeo）、沙雷洛（Xarel-lo）、帕雷亚达（Parellada）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍸 卡瓦 vs 香槟</strong><br/>
<span style="color:#666">• 价格：约 80-300元 vs 香槟 300-3,000元</span><br/>
<span style="color:#666">• 风格：更偏向果味，较少酵母味</span><br/>
<span style="color:#666">• 性价比：极高，香槟的最佳替代品</span></p>

<p style="color:#333;line-height:1.8"><strong>🍸 推荐品牌</strong><br/>
<span style="color:#666">• Codorníu（菲斯奈特）- 卡瓦发明者</span><br/>
<span style="color:#666">• Gramona - 顶级卡瓦，香槟同款工艺</span><br/>
<span style="color:#666">• Freixenet - 全球最畅销的卡瓦品牌</span></p>
</section>

<h3>💎 五、高性价比酒款推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 100-300 元</strong><br/>
<span style="color:#666">• 里奥哈 Crianza（陈年12个月）</span><br/>
<span style="color:#666">• 推荐：Marqués de Riscal、López de Heredia</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 300-800 元</strong><br/>
<span style="color:#666">• 里奥哈 Reserva（陈年36个月）</span><br/>
<span style="color:#666">• 推荐：Roda、Muga Reserva</span></p>

<p style="color:#333;line-height:1.8"><strong>💎 800 元以上</strong><br/>
<span style="color:#666">• 里奥哈 Gran Reserva（陈年60个月+）</span><br/>
<span style="color:#666">• 推荐：Vega Sicilia Unico、Pingus</span></p>
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
<td style="padding:10px;color:#666">经典年份，细腻优雅，陈年潜力强</td>
</tr>
</table>
</section>

<h3>💰 七、投资建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资：</strong><br/><br/>
<strong>• 顶级酒款</strong> - 贝加西西里亚（Vega Sicilia Unico）、平古斯（Pingus）<br/>
<span style="color:#666">产量稀少，国际知名度高，拍卖市场活跃</span><br/><br/>
<strong>• 里奥哈 Gran Reserva</strong> - 陈年60个月+，品质有保障<br/>
<span style="color:#666">价格相对亲民，升值空间稳定</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 西班牙酒流动性不如法国、意大利</span><br/>
<span style="color:#666">• 优先选择国际知名品牌（Vega Sicilia、Pingus）</span><br/>
<span style="color:#666">• 关注伦敦国际红酒交易所（Liv-ex）的成交价</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">西班牙是阳光与传统的结合。从80元的卡瓦到5000元的贝加西西里亚，这里有无尽的探索空间。掌握DO分级制度，你就能挑到最适合自己的西班牙酒。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱*
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成西班牙葡萄酒入门文章');
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
    title: `🍷 ${date.chinese} 西班牙葡萄酒入门：里奥哈·普里奥拉托·卡瓦`,
    author: '红酒顾问',
    digest: '西班牙是全球第三大葡萄酒产国。本文详解三大核心产区、DO分级制度、传奇酒款和卡瓦气泡酒。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `spanish_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'spanish_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/spanish_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
