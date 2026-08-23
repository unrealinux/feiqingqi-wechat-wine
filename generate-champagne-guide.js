/**
 * 香槟完全指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实香槟封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实香槟封面...');
  
  const coverPath = path.join(__dirname, 'output', 'champagne_cover_real.png');
  const prompt = 'Photorealistic champagne bottle and flutes, golden bubbles rising in crystal glasses, professional product photography, celebration atmosphere, warm lighting, bokeh background with vineyard, 8K ultra-detailed, luxury magazine style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('champagne_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍾 香槟完全指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">气泡的秘密 · 酿造工艺 · 配餐艺术</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'champagne_cover_ai.png');
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
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#1a237e" text-anchor="middle">香槟</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#1a237e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍾 ${date.display} 香槟完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">气泡的秘密 · 酿造工艺 · 配餐艺术</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'champagne_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成香槟完全指南文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .item { margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
  .item:last-child { border-bottom: none; }
  .name { font-weight: bold; color: #333; font-size: 16px; }
  .info { color: #666; font-size: 14px; margin-top: 5px; }
  .price { color: #d4af37; font-weight: bold; }
  .tag { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍾 ${date.chinese} 香槟完全指南</h2>
<p style="text-align: center; color: #666;">气泡的秘密 · 酿造工艺 · 配餐艺术</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">香槟（Champagne）是法国最北端的产区，也是<strong style="color:#ffd740">气泡酒之王</strong>。只有在法国香槟产区、采用传统法酿造的气泡酒，才能称为"香槟"。</p>
</section>

<h3>🍾 一、什么是真正的香槟</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📍 产地限制</strong><br/>
香槟产区位于巴黎东北方约150公里，气候寒冷，葡萄难以成熟。这种极端气候造就了香槟独特的酸度和矿物质感。</p>

<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>📋 葡萄品种</strong><br/>
• <strong>霞多丽（Chardonnay）</strong> - 提供酸度、矿物质感和柠檬、青苹果香气<br/>
• <strong>黑皮诺（Pinot Noir）</strong> - 提供酒体、结构和红色水果香气<br/>
• <strong>默尼耶（Meunier）</strong> - 提供果味圆润和早期适饮性</p>

<p style="color:#333;line-height:1.8"><strong>📇 法律保护</strong><br/>
根据1891年法国法律和1919年《凡尔赛条约》，只有香槟产区生产的气泡酒才能叫"Champagne"。其他地区的只能叫"Crémant"或"Cava"。</p>
</section>

<h3>🫖 二、酿造工艺：传统法</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">🔄 传统法（Méthode Traditionnelle）步骤</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 第一次发酵</strong><br/>
<span style="color:#666">基酒发酵完成，获得干白葡萄酒（Still Wine）。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 混合调配（Assemblage）</strong><br/>
<span style="color:#666">酿酒师将不同村庄、不同品种的基酒混合，创造品牌独特风格。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 装瓶二次发酵</strong><br/>
<span style="color:#666">加入"liqueur de tirage"（糖+酵母），装瓶密封，进行二次发酵产生气泡。</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 酒泥陈年（Sur Lie）</strong><br/>
<span style="color:#666">酒液与死酵母接触至少15个月（年份香槟需36个月+）。这是香槟面包、饼干风味的来源。</span></p>

<p style="color:#333;line-height:1.8"><strong>5. 转瓶与除渣（Remuage & Dégorgement）</strong><br/>
<span style="color:#666">慢慢转动酒瓶，让酒泥沉到瓶口，然后冷冻瓶口去除酒泥。最后补糖（Dosage）决定甜度。</span></p>
</section>

<h3>🍸 三、香槟的甜度分级</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a237e;color:white">
<td style="padding:10px;font-weight:bold">甜度等级</td>
<td style="padding:10px;font-weight:bold">补糖量（g/L）</td>
<td style="padding:10px;font-weight:bold">口感</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Brut Nature / Zero Dosage</strong></td>
<td style="padding:10px;color:#666">0-3g/L</td>
<td style="padding:10px;color:#666">极干，无糖感</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Extra Brut</strong></td>
<td style="padding:10px;color:#666">0-6g/L</td>
<td style="padding:10px;color:#666">极干，酸度突出</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Brut（最常见）</strong></td>
<td style="padding:10px;color:#666">0-12g/L</td>
<td style="padding:10px;color:#666">干型，平衡酸度与果味</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Extra Dry / Extra Sec</strong></td>
<td style="padding:10px;color:#666">12-17g/L</td>
<td style="padding:10px;color:#666">微甜，果味更明显</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Sec（Dry）</strong></td>
<td style="padding:10px;color:#666">17-32g/L</td>
<td style="padding:10px;color:#666">甜，适合新手</td>
</tr>
<tr style="background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Demi-Sec</strong></td>
<td style="padding:10px;color:#666">32-50g/L</td>
<td style="padding:10px;color:#666">甜型，配甜点绝佳</td>
</tr>
</table>
<p style="color:#666;font-size:14px;margin-top:15px">💡 推荐：Brut 或 Extra Brut，最能体验香槟的精髓。</p>
</section>

<h3>👑 四、三大香槟品牌与风格</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:15px">🔴 三大品牌（NM - 酒商）</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍾 酩悦（Moët & Chandon）</strong><br/>
<span style="color:#666">• 风格：果味饱满，圆润易饮</span><br/>
<span style="color:#666">• 代表作：Dom Pérignon（唐培里侬）</span><br/>
<span style="color:#666">• 价格：约800-3000元</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍾 凯歌（Veuve Clicquot）</strong><br/>
<span style="color:#666">• 风格：结构宏大，陈年潜力强</span><br/>
<span style="color:#666">• 代表作：La Grande Dame（贵妇）</span><br/>
<span style="color:#666">• 价格：约600-2500元</span></p>

<p style="color:#333;line-height:1.8"><strong>🍾 库克（Krug）</strong><br/>
<span style="color:#666">• 风格：极致复杂，小橡木桶发酵</span><br/>
<span style="color:#666">• 代表作：Krug Grande Cuvée</span><br/>
<span style="color:#666">• 价格：约1500-5000元</span></p>
</section>

<h3>🍇 五、小农香槟（RM）推荐</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">🌿 小农香槟（Récoltant Manipulant）</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💎 种植农自己种植、酿造、装瓶</strong><br/>
<span style="color:#666">• 产量小，品质高，风土表达更精准</span><br/>
<span style="color:#666">• 比大品牌更具性价比和个性</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍾 Egly-Ouriet</strong><br/>
<span style="color:#666">• 风格：饱满、复杂、陈年潜力强</span><br/>
<span style="color:#666">• 价格：约800-2000元</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍾 Pierre Péters</strong><br/>
<span style="color:#666">• 风格：100%霞多丽，矿物感极强</span><br/>
<span style="color:#666">• 价格：约600-1500元</span></p>

<p style="color:#333;line-height:1.8"><strong>🍾 Jacques Selosse</strong><br/>
<span style="color:#666">• 风格：自然酒风格，氧化风味，颠覆传统</span><br/>
<span style="color:#666">• 价格：约1500-4000元</span></p>
</section>

<h3>🍷 六、香槟配餐指南</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🦪 生蚝/海鲜</strong><br/>
<span style="color:#666">• 经典搭配：Brut香槟+法国生蚝</span><br/>
<span style="color:#666">• 高酸度去腥提鲜，气泡清洁味蕾</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍗 炸物/天妇罗</strong><br/>
<span style="color:#666">• 气泡能"切断"油腻感，酥脆口感配气泡绝佳</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍰 奶酪/熟食</strong><br/>
<span style="color:#666">• 布里奶酪+香槟=经典法式下午茶</span><br/>
<span style="color:#666">• 年份香槟配鹅肝，咸甜对比惊艳</span></p>

<p style="color:#333;line-height:1.8"><strong>🍰 甜点</strong><br/>
<span style="color:#666">• Demi-Sec香槟+水果塔=庆祝标配</span><br/>
<span style="color:#666">• 避免巧克力：单宁会与气泡冲突</span></p>
</section>

<h3>💰 七、购买与储存建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;line-height:1.8;margin-bottom:10px"><strong>🛒 购买渠道</strong><br/>
<span style="color:#666">• 正规进口商：ASC、桃乐丝、由西往东</span><br/>
<span style="color:#666">• 免税店：机场免税店价格通常便宜10-20%</span><br/>
<span style="color:#666">• 避免：超市临期打折品（香槟也会老化）</</span></p>

<p style="color:#155724;line-height:1.8;margin-bottom:10px"><strong>📦 储存条件</strong><br/>
<span style="color:#666">• 温度：8-10℃（比静止酒略低）</span><br/>
<span style="color:#666">• 姿势：水平放置，保持软木塞湿润</span><br/>
<span style="color:#666">• 光线：完全黑暗，避免紫外线破坏气泡</span></p>

<p style="color:#155724;line-height:1.8"><strong>⏳ 适饮期</strong><br/>
<span style="color:#666">• 非年份香槟（NV）：购买后1-3年内饮用</span><br/>
<span style="color:#666">• 年份香槟（Vintage）：可陈年10-30年+</span></p>
</section>

<h3>❌ 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：所有气泡酒都是香槟</strong><br/>
<span style="color:#666">事实上，只有香槟产区产的才能叫香槟。其他如Crémant、Cava、Prosecco都是不同的气泡酒。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：香槟越甜越好</strong><br/>
<span style="color:#666">传统香槟是干型的（Brut）。甜型（Demi-Sec）通常配甜点，不适合正餐。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：香槟不需要醒酒</strong><br/>
<span style="color:#666">年份香槟建议醒酒15-30分钟，让香气充分释放。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>❌ 误区4：开瓶要"砰"一声</strong><br/>
<span style="color:#666">正确开瓶应控制气压缓慢旋转瓶盖，避免酒液喷出浪费。</span></p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍾 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">香槟不仅是庆祝的代名词，更是酿造工艺的巅峰。从Brut Nature到Demi-Sec，从大品牌到小农香槟，这里有无尽的探索空间。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍾 生成香槟完全指南文章');
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
    title: `🍾 ${date.chinese} 香槟完全指南：气泡的秘密与配餐艺术`,
    author: '红酒顾问',
    digest: '香槟是气泡酒之王。本文详解香槟定义、传统法酿造工艺、甜度分级、品牌推荐和配餐指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `champagne_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'champagne_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/champagne_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
