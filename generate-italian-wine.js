/**
 * 意大利葡萄酒入门文章生成器*
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
 * 使用 baoyu-imagine + DashScope 生成写实意大利封面*
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实意大利封面...');
  
  const coverPath = path.join(__dirname, 'output', 'italian_cover_real.png');
  const prompt = 'Photorealistic Italian vineyard landscape, rolling hills of Tuscany, grapevines with Sangiovese grapes, historic stone villa, warm golden hour lighting, professional landscape photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('italian_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 意大利葡萄酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">基安蒂·布鲁奈罗·阿马罗尼</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'italian_cover_ai.png');
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
      <stop offset="50%" style="stop-color:#283593"/>
      <stop offset="100%" style="stop-color:#3949ab"/>
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
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#glassGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">意大利</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">葡萄酒</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 意大利葡萄酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">基安蒂·布鲁奈罗·阿马罗尼</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'italian_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成意大利葡萄酒入门文章内容*
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 意大利葡萄酒入门</h2>
<p style="text-align: center; color: #666;">基安蒂·布鲁奈罗·阿马罗尼</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">意大利是<strong style="color:#ffd740">全球产量最大的葡萄酒国</strong>，拥有<strong style="color:#ffd740">20个产区、350+法定产区</strong>。从托斯卡纳的基安蒂到皮埃蒙特的巴巴莱斯科，这里每一瓶酒都是<strong style="color:#ffd740">阳光与土地的结晶</strong>。</p>
</section>

<h3>🗺 一、意大利葡萄酒地图</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 三大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 托斯卡纳（Tuscany）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 知名酒款：</strong>基安蒂（Chianti）、布鲁奈罗（Brunello di Montalcino）、贵族酒（Vino Nobile di Montepulciano）<br/>
<strong>• 主要品种：</strong>桑娇维塞（Sangiovese）<br/>
<strong>• 风格：</strong>高酸度、高单宁，陈年潜力强<br/>
<strong>• 推荐年份：</strong>2010、2015、2016</p>
</div>

<div class="region-item">
<h4>🏠 皮埃蒙特（Piedmont）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 知名酒款：</strong>巴巴莱斯科（Barbaresco）、巴罗洛（Barolo）、阿斯蒂（Asti）<br/>
<strong>• 主要品种：</strong>内比奥罗（Nebbiolo）、巴贝拉（Barbera）<br/>
<strong>• 风格：</strong>极高单宁、玫瑰花香、焦油味<br/>
<strong>• 推荐年份：</strong>2010、2013、2015</p>
</div>

<div class="region-item">
<h4>🏠 威尼托（Veneto）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 知名酒款：</strong>阿马罗尼（Amarone）、瓦尔波利切拉（Valpolicella）、苏韦瓦（Soave）<br/>
<strong>• 主要品种：</strong>科维纳（Corvina）、加佐（Garganega）<br/>
<strong>• 风格：</strong>干果味、高酒精度、饱满酒体<br/>
<strong>• 推荐年份：</strong>2010、2015、2016</p>
</div>
</section>

<h3>🍷 二、必知的7大酒款</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 巴罗洛（Barolo）—— 酒王</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>意大利最昂贵的红葡萄酒之一，被称为"酒王"<br/>
<strong>• 价格：</strong>约500-3000元/瓶<br/>
<strong>• 特点：</strong>极高单宁，玫瑰花瓣、焦油、松露香气<br/>
<strong>• 陈年：</strong>可以陈年20-50年<br/>
<strong>• 推荐酒庄：</strong>孔特诺（Conterno）、嘉雅（Gaja）</p>
</div>

<div class="region-item">
<h4>🔴 巴巴莱斯科（Barbaresco）—— 酒后</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>比巴罗洛优雅，陈年潜力稍短<br/>
<strong>• 价格：</strong>约400-2000元/瓶<br/>
<strong>• 特点：</strong>单宁较柔和，花香更明显<br/>
<strong>• 陈年：</strong>可以陈年15-30年<br/>
<strong>• 推荐酒庄：</strong>Angelo Gaja、Produttori del Barbaresco</p>
</div>

<div class="region-item">
<h4>🔴 布鲁奈罗（Brunello di Montalcino）—— 托斯卡纳之光</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>托斯卡纳最顶级的红葡萄酒<br/>
<strong>• 价格：</strong>约300-1500元/瓶<br/>
<strong>• 特点：</strong>100%桑娇维塞，高酸、高单宁<br/>
<strong>• 陈年：</strong>至少陈年5年，可陈年20年+<br/>
<strong>• 推荐酒款：</strong>Case Base、Biondi Santi</p>
</div>

<div class="region-item">
<h4>🔴 阿马罗尼（Amarone della Valpolicella）—— 干果之王</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>威尼托最顶级的红葡萄酒<br/>
<strong>• 价格：</strong>约400-2000元/瓶<br/>
<strong>• 特点：</strong>葡萄风干浓缩，15-17%高酒精度<br/>
<strong>• 陈年：</strong>可以陈年15-25年<br/>
<strong>• 推荐酒款：</strong>Zenato、Masi、Allegrini</p>
</div>

<div class="region-item">
<h4>🔴 基安蒂（Chianti Classico）—— 入门首选</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>意大利产量最大的DOCG<br/>
<strong>• 价格：</strong>约100-500元/瓶<br/>
<strong>• 特点：</strong>酸樱桃、草药味，高酸度<br/>
<strong>• 陈年：</strong>适合5-10年内饮用<br/>
<strong>• 推荐酒款：</strong>Antinori、Ricasoli</p>
</div>

<div class="region-item">
<h4>🔴 苏韦瓦（Soave）—— 白葡萄酒之王</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>意大利最知名的白葡萄酒<br/>
<strong>• 价格：</strong>约80-300元/瓶<br/>
<strong>• 特点：</strong>青苹果、白色花香，高酸度<br/>
<strong>• 陈年：</strong>适合3-5年内饮用<br/>
<strong>• 推荐酒款：</strong>Pieropan、Inama</p>
</div>

<div class="region-item">
<h4>🔴 阿斯蒂（Asti）—— 气泡甜酒</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>全球最知名的白气泡甜酒<br/>
<strong>• 价格：</strong>约80-200元/瓶<br/>
<strong>• 特点：</strong>莫斯卡托葡萄，水蜜桃、柑橘香<br/>
<strong>• 陈年：</strong>新鲜饮用，不要陈年<br/>
<strong>• 推荐酒款：</strong>Martini、Gancia</p>
</div>
</section>

<h3>📅 三、DOCG 分级制度</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:15px"><strong>📆 从低到高：</strong></p>

<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">等级</td>
<td style="padding:10px;font-weight:bold">含义</td>
<td style="padding:10px;font-weight:bold">例子</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333">VdT</td>
<td style="padding:10px;color:#666">日常餐酒</td>
<td style="padding:10px;color:#666">Vino da Tavola</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333">IGT</td>
<td style="padding:10px;color:#666">地区餐酒（如超级托斯卡纳）</td>
<td style="padding:10px;color:#666">Toscana IGT</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333">DOC</td>
<td style="padding:10px;color:#666">法定产区</td>
<td style="padding:10px;color:#666">Chianti DOCG</td>
</tr>
<tr>
<td style="padding:10px;color:#d4af37;font-weight:bold">DOCG</td>
<td style="padding:10px;color:#666">保证法定产区（最高级别）</td>
<td style="padding:10px;color:#666">Barolo DOCG、Brunello DOCG</td>
</tr>
</table>
<p style="color:#666;font-size:14px;line-height:1.8;margin-top:12px">💡 DOCG级别会在瓶颈贴有粉色封条，是品质的保证。</p>
</section>

<h3>💰 四、高性价比酒款推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 100-300 元</strong><br/>
<span style="color:#666">• 基安蒂（Chianti Classico）</span><br/>
<span style="color:#666">• 苏韦瓦（Soave Superiore）</span><br/>
<span style="color:#666">• 蒙特布查诺（Montepulciano d'Abruzzo）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎💎 300-800 元</strong><br/>
<span style="color:#666">• 巴巴莱斯科（Barbaresco）</span><br/>
<span style="color:#666">• 布鲁奈罗（Brunello di Montalcino）</span><br/>
<span style="color:#666">• 超级托斯卡纳（Super Tuscan）</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800 元以上</strong><br/>
<span style="color:#666">• 巴罗洛（Barolo）</span><br/>
<span style="color:#666">• 阿马罗尼（Amarone）</span><br/>
<span style="color:#666">• 嘉雅（Gaja）任何酒款</span></p>
</section>

<h3>🍇 五、超级托斯卡纳（Super Tuscan）</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🌟 颠覆传统的传奇</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💡 什么是超级托斯卡纳？</strong><br/>
<span style="color:#666">用非传统品种（赤霞珠、梅洛）酿造的托斯卡纳酒，最初只能标IGT，现在已是全球顶级酒款。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🔴 顶级酒款：</strong><br/>
<span style="color:#666">• 西施佳乐（Sassicaia）</span> - 第一款超级托斯卡纳，被誉为"意大利的拉菲"<br/>
<span style="color:#666">• 奥纳亚（Ornellaia）</span> - 与西施佳乐齐名<br/>
<span style="color:#666">• 马赛多（Masseto）</span> - 100%梅洛，被称为"意大利的柏图斯"</p>

<p style="color:#333;line-height:1.8"><strong>💰 价格：</strong>约800-5000元/瓶，陈年潜力20年+</p>
</section>

<h3>⚠️ 六、购买避坑指南</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：所有基安蒂都一样</strong><br/>
<span style="color:#666">实际上基安蒂分三个等级：基安蒂（基础）、基安蒂经典（Classico，更好）、基安蒂经典珍藏（Riserva，顶级）。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：巴罗洛越贵越好</strong><br/>
<span style="color:#666">小酒庄（如Vietti）的巴罗洛性价比极高，不一定要买大牌。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：阿马罗尼都很贵</strong><br/>
<span style="color:#666">基础款阿马罗尼约400元，Classico级别约800元+，按需选择。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>❌ 误区4：超级托斯卡纳都是好酒</strong><br/>
<span style="color:#666">认准"Tenuta San Guido"、"Ornellaia"、"Masseto"等顶级酒款，避免杂牌。</span></p>
</section>

<h3>💡 七、投资建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资：</strong><br/><br/>
<strong>• 巴罗洛（Barolo）</strong> - 陈年潜力极强，价格持续上涨<br/>
<span style="color:#666">推荐年份：2010、2013、2015、2016</span><br/><br/>
<strong>• 布鲁奈罗（Brunello）</strong> - 托斯卡纳最稳定的投资标的<br/>
<span style="color:#666">推荐年份：2010、2015、2016</span><br/><br/>
<strong>• 超级托斯卡纳</strong> - 西施佳乐、奥纳亚，流动性好<br/>
<span style="color:#666">推荐年份：2010、2015、2016</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 意大利假酒相对较少，但也要通过正规渠道购买</span><br/>
<span style="color:#666">• 关注意大利拍卖行（如Italvinus）的成交价</span><br/>
<span style="color:#666">• 优先选择DOCG级别，IGT（即使是超级托斯卡纳）风险稍高</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">意大利是葡萄酒的宝库。从100元的基安蒂到5000元的西施佳乐，这里有无尽的探索空间。掌握分级制度，你就能挑到最适合自己的意大利酒。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱*
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成意大利葡萄酒入门文章');
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
    title: `🍷 ${date.chinese} 意大利葡萄酒入门：基安蒂·布鲁奈罗·阿马罗尼`,
    author: '红酒顾问',
    digest: '意大利是全球产量最大的葡萄酒国。本文详解三大产区、7大必知酒款、DOCG分级制度和超级托斯卡纳传奇。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `italian_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'italian_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/italian_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
