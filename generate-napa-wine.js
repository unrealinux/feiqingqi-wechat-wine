/**
 * 纳帕谷葡萄酒指南文章生成器
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

async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实纳帕谷封面...');
  
  const coverPath = path.join(__dirname, 'output', 'napa_wine_cover_real.png');
  const prompt = 'Photorealistic Napa Valley wine region California, vine-covered hills, premium winery estate, wine barrels in cellar, sunset over vineyards, luxury wine bottles, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('napa_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#8B0000"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 纳帕谷葡萄酒指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">美国膜拜酒 · 赤霞珠 · 纳帕谷AVA</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'napa_wine_cover_ai.png');
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

function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#2d1f1f"/>
    </linearGradient>
    <linearGradient id="napaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 山坡葡萄园 -->
  <g transform="translate(100, 180)">
    <polygon points="0,60 100,30 200,50 300,20 400,45 500,15 600,40 700,25 800,55 900,35 900,150 0,150" fill="#228B22" opacity="0.7"/>
    <polygon points="0,80 150,50 300,70 450,40 600,60 750,45 900,75 900,150 0,150" fill="#2E8B57" opacity="0.6"/>
  </g>
  
  <!-- 酒庄建筑 -->
  <g transform="translate(550, 140)">
    <rect x="0" y="30" width="120" height="60" fill="#D2691E" rx="3"/>
    <polygon points="0,30 60,-10 120,30" fill="#8B4513"/>
    <rect x="20" y="45" width="25" height="25" fill="#2F4F4F" rx="2"/>
    <rect x="55" y="45" width="25" height="25" fill="#2F4F4F" rx="2"/>
    <rect x="90" y="45" width="20" height="25" fill="#2F4F4F" rx="2"/>
  </g>
  
  <!-- 纳帕谷酒瓶 -->
  <g transform="translate(480, 210)">
    <rect x="20" y="30" width="25" height="70" fill="#722F37" rx="2"/>
    <rect x="27" y="15" width="12" height="15" fill="#8B0000"/>
    <rect x="31" y="10" width="5" height="8" fill="#2F4F4F"/>
    <rect x="23" y="50" width="18" height="25" fill="#FFD700" opacity="0.9"/>
    <text x="32" y="65" font-size="7" fill="#8B0000" text-anchor="middle">NAPA</text>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#8B0000" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🍷 纳帕谷</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">美国葡萄酒圣地</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#8B0000" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🍷 ${date.display} 纳帕谷葡萄酒指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">美国膜拜酒 · 赤霞珠 · 纳帕谷AVA</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'napa_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B0000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B0000; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B0000;">🍷 ${date.chinese} 纳帕谷葡萄酒指南：美国膜拜酒·赤霞珠</h2>
<p style="text-align: center; color: #666;">美国膜拜酒 · 赤霞珠 · 纳帕谷AVA</p>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">纳帕谷是<strong style="color:#FFD700">美国最著名的葡萄酒产区</strong>，被誉为"葡萄酒的硅谷"。从1976年巴黎审判的惊人胜利到膜拜酒的崛起，纳帕谷用短短几十年成为了世界顶级葡萄酒产区。本文将带你深入了解<strong style="color:#FFD700">美国葡萄酒的核心产区</strong>。</p>
</section>

<h3>🏔 一、纳帕谷核心AVA产区</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>👑 鹿跃区（Stags Leap District）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷最著名的赤霞珠产区<br/>
<strong>• 特点：</strong>优雅细腻，单宁丝滑，陈年潜力强<br/>
<strong>• 代表酒庄：</strong>Stag's Leap Wine Cellars、Clos du Val、Catherine</p>
</div>

<div class="region-item">
🏆 <h4> Rutherford</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷心脏，赤霞珠经典产区<br/>
<strong>• 特点：</strong>"卢瑟福尘埃"独特风味，巧克力、咖啡<br/>
<strong>• 代表酒庄：</strong>Rubicon Estate、Heitz Cellar、Beringer</p>
</div>

<div class="region-item">
🏆 <h4>Oakville</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷最核心的赤霞珠产区<br/>
<strong>• 特点：</strong>结构严谨，风味复杂<br/>
<strong>• 代表酒庄：</strong>Opus One、Robert Mondavi、Sloan</p>
</div>

<div class="region-item">
🏆 <h4>Howell Mountain</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>高海拔山区，产量稀少<br/>
<strong>• 特点：</strong>浓郁集中，单宁强壮<br/>
<strong>• 代表酒庄：</strong>Dunn Vineyards、La Jota</p>
</div>

<div class="region-item">
🏆 <h4>Mount Veeder</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷海拔最高的AVA之一<br/>
<strong>• 特点：</strong>风格独特，黑色水果，矿物质<br/>
<strong>• 代表酒庄：</strong>Mt. Veeder Winery、Schramsberg</p>
</div>

<div class="region-item">
🏆 <h4>Carneros</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷最佳黑皮诺和霞多丽产区<br/>
<strong>• 特点：</strong>凉爽气候，酸度活跃<br/>
<strong>• 代表酒庄：</strong>Hyland、Williams Selyem</p>
</div>

</section>

<h3>🍇 二、纳帕谷核心品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 赤霞珠（Cabernet Sauvignon）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷的绝对王者，占90%+高端酒<br/>
<strong>• 特点：</strong>黑醋栗、樱桃、巧克力、橡木<br/>
<strong>• 口感：</strong>酒体饱满，单宁丰富<br/>
<strong>• 代表：</strong>膜拜酒、纳帕谷赤霞珠</p>
</div>

<div class="region-item">
🔴 <h4>黑皮诺（Pinot Noir）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>卡内罗斯（ Carneros）最佳<br/>
<strong>• 特点：</strong>红色水果、泥土、复杂<br/>
<strong>• 口感：</strong>酒体轻盈，单宁细腻<br/>
<strong>• 代表：</strong>卡内罗斯黑皮诺</p>
</div>

<div class="region-item">
⚪ <h4>霞多丽（Chardonnay）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷最重要的白葡萄品种<br/>
<strong>• 特点：</strong>苹果、奶油、烘烤（橡木桶）<br/>
<strong>• 口感：</strong>酒体饱满<br/>
<strong>• 代表：</strong>纳帕谷霞多丽</p>
</div>

<div class="region-item">
⚪ <h4>长相思（Sauvignon Blanc）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷白葡萄酒的另一选择<br/>
<strong>• 特点：</strong>青草、百香果、矿物<br/>
<strong>• 口感：</strong>清爽酸度<br/>
<strong>• 代表：</strong>Funkenstein、Grgich</p>
</div>

</section>

<h3>👑 三、膜拜酒（Cult Wine）</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🏆 Screaming Eagle</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷最贵膜拜酒，全美最贵<br/>
<strong>• 特点：</strong>100%赤霞珠，年产仅500箱<br/>
<strong>• 价格：</strong>3000-5000美元/瓶<br/>
<strong>• 代表：</strong>Screaming Eagle Cabernet</p>
</div>

<div class="region-item">
🏆 <h4>Opus One</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>纳帕谷第一个膜拜酒庄<br/>
<strong>• 特点：</strong>波尔多风格，纳帕谷+木桐合作<br/>
<strong>• 价格：</strong>400-600美元/瓶<br/>
<strong>• 代表：</strong>Opus One Red</p>
</div>

<div class="region-item">
🏆 <h4>Dominus</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>敖司旗下膜拜酒<br/>
<strong>• 特点：</strong>100%赤霞珠，波尔多混酿风格<br/>
<strong>• 价格：</strong>300-500美元/瓶<br/>
<strong>• 代表：</strong>Dominus Estate</p>
</div>

<div class="region-item">
🏆 <h4>Hillside Select</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>Shafer酒庄旗舰<br/>
<strong>• 特点：</strong>鹿跃区最佳表达<br/>
<strong>• 价格：</strong>300-500美元/瓶<br/>
<strong>• 代表：</strong>Shafer Hillside Select</p>
</div>

</section>

<h3>💰 四、纳帕谷价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 150-350 元（入门）</strong><br/>
<span style="color:#666">• 纳帕谷大区级赤霞珠</span><br/>
<span style="color:#666">• 入门级霞多丽</span><br/>
<span style="color:#666">• 特点：果香浓郁，性价比高</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 350-800 元（进阶）</strong><br/>
<span style="color:#666">• 优质AVA赤霞珠</span><br/>
<span style="color:#666">• 入门级膜拜酒</span><br/>
<strong style="color:#c62828">• 特点：开始展现产区特色</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 800-2000 元（高级）</strong><br/>
<span style="color:#666">• 名庄赤霞珠（Robert Mondavi等）</span><br/>
<span style="color:#666">• 膜拜酒入门</span><br/>
<strong style="color:#c62828">• 特点：可对标法国中级庄</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 2000元以上（膜拜）</strong><br/>
<span style="color:#666">• 顶级膜拜酒（Screaming Eagle、Opus One）</span><br/>
<span style="color:#666">• 稀有年份</span><br/>
<strong style="color:#c62828">• 特点：收藏级，稀缺</strong></p>
</section>

<h3>📅 五、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B0000;color:white">
<td style="padding:10px;font-weight:bold">年份</td>
<td style="padding:10px;font-weight:bold">品质</td>
<td style="padding:10px;font-weight:bold">特点</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2013</strong></td>
<td style="padding:10px;color:#c41e3a">卓越</td>
<td style="padding:10px;color:#666">完美成熟度</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2012</strong></td>
<td style="padding:10px;color:#c41e3a">优秀</td>
<td <td style="padding:10px;color="#666">平衡完美</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>2010</strong></td>
<td style="padding:10px;color:#c41e3a">优秀</td>
<td <td style="padding:10px;color="#666">强劲单宁</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>2007</strong></td>
<td style="padding:10px;color:#c41e3a">优秀</td>
<td <td style="padding:10px;color="#666">经典年份</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>1996</strong></td>
<td style="padding:10px;color:#c41e3a">传奇</td>
<td <td style="padding:10px;color="#666">帕克100分</td>
</tr>
</table>
</section>

<h3>🍽 六、纳帕谷配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🥩 <h4>顶级牛排</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 和牛：</strong>膜拜酒（奢华搭配）<br/>
<strong>• 肋排：</strong>纳帕谷赤霞珠<br/>
<strong>• 纽约牛排：</strong>任何优质赤霞珠</p>
</div>

<div class="region-item">
🧀 <h4>奶酪</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 蓝纹奶酪：</strong>赤霞珠<br/>
<strong>• 帕玛森：</strong>赤霞珠<br/>
<strong>• 山羊奶酪：</strong>霞多丽</p>
</div>

<div class="region-item">
🍖 <h4>烤肉</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 烧烤：</strong>赤霞珠<br/>
<strong>• 熏肉：</strong>黑皮诺<br/>
<strong>• 烤肉酱：</strong>赤霞珠</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：纳帕谷都是膜拜酒</strong><br/>
<span style="color:#666">事实上，大多数纳帕谷葡萄酒价格亲民。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：纳帕谷不如法国波尔多</strong><br/>
<span style="color:#666">1976年巴黎审判已证明纳帕谷顶级酒可媲美波尔多。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：纳帕谷只产红酒</strong><br/>
<strong style="color:#666">霞多丽和黑皮诺同样优秀。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：膜拜酒一定最好</strong><br/>
<span style="color:#666">非膜拜酒庄也有优质选择。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：纳帕谷不能陈年</strong><br/>
<span style="color:#666">顶级纳帕谷可陈年20-30年。</span></p>
</section>

<h3>📝 八、纳帕谷 vs 波尔多</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>🍷 对比：</strong><br/>
<span style="color:#666">• 气候：纳帕谷更温暖，波尔多更凉爽</span><br/>
<span style="color:#666">• 风格：纳帕谷果味更浓郁，波尔多更优雅</span><br/>
<span style="color:#666">• 价格：纳帕谷普遍更贵</span><br/>
<span style="color:#666">• 陈年：波尔多通常更长的陈年潜力</span><br/><br/>
<strong>🥂 选择：</strong><br/>
<span style="color:#666">• 喜欢浓郁果味？选纳帕谷</span><br/>
<span style="color:#666">• 喜欢优雅复杂？选波尔多</span><br/>
<span style="color:#666">• 预算有限？纳帕谷入门级性价比高</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#FFE4C4;font-size:14px;line-height:1.8;margin:0">纳帕谷用了短短几十年时间，从一个不知名的农业产区成长为世界顶级葡萄酒产区。这里不仅有令全球收藏家趋之若鹜的膜拜酒，也有适合日常饮用的优质选择。无论你是资深的葡萄酒老饕，还是刚刚入门的新手，纳帕谷都能带给你惊喜。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成纳帕谷葡萄酒指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 纳帕谷葡萄酒指南：美国膜拜酒·赤霞珠`,
    author: '红酒顾问',
    digest: '纳帕谷是美国最著名的葡萄酒产区。本文详解核心AVA、膜拜酒、代表品种和价格指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `napa_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'napa_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/napa_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();