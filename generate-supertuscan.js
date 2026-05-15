/**
 * 超级托斯卡纳葡萄酒完全指南
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实超级托斯卡纳封面...');
  const coverPath = path.join(__dirname, 'output', 'supertuscan_cover_real.png');
  const prompt = 'Photorealistic Super Tuscan wine, Tignanello bottle on rustic wooden table, Tuscan rolling hills sunset background, Sangiovese and Cabernet grapes, modern wine cellar, professional photography, 8K ultra-detailed';
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    if (stdout.includes('cover.png') || stdout.includes('supertuscan_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      const resizedBuffer = await sharp(coverPath).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#B8860B"/><stop offset="100%" style="stop-color:#DAA520"/></linearGradient><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/></filter></defs><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/><text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 超级托斯卡纳完全指南</text><text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利托斯卡纳 · 革命之作 · 国际品种</text><text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer).composite([{ input: textBuffer, top: 0, left: 0 }]).png().toBuffer();
      const outputPath = path.join(__dirname, 'output', 'supertuscan_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      return finalBuffer;
    }
  } catch (error) { console.log('   ⚠️ AI 生成失败:', error.message); }
  console.log('   使用本地备用封面');
  return generateLocalCover();
}
function generateLocalCover() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a0a"/><stop offset="50%" style="stop-color:#3a2a1a"/><stop offset="100%" style="stop-color:#1a1a2e"/></linearGradient><linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#4a2800"/><stop offset="100%" style="stop-color:#8B4513"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#DAA520"/><stop offset="100%" style="stop-color:#B8860B"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bgGrad)"/><circle cx="650" cy="100" r="180" fill="rgba(139, 69, 19, 0.3)"/><circle cx="680" cy="120" r="150" fill="rgba(218, 165, 32, 0.15)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#wineGrad)" stroke="url(#goldGrad)" stroke-width="3"/><rect x="640" y="210" width="120" height="30" rx="2" fill="url(#goldGrad)"/><text x="700" y="230" font-family="serif" font-size="12" fill="#1a1a0a" text-anchor="middle" font-weight="bold">SUPER TUSCAN</text><text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">IGT</text><text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Tuscany, Italy</text><text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text><rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/><text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DAA520">超级托斯卡纳</text><text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利托斯卡纳</text><text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"革命之作" · 国际品种混酿</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">打破传统的意大利葡萄酒革命</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(buffer => { const outputPath = path.join(__dirname, 'output', 'supertuscan_cover_ai.png'); fs.writeFileSync(outputPath, buffer); console.log('📁 SVG 封面已保存:', outputPath); return buffer; });
}
function generateContent() { return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #B8860B; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #B8860B; border-bottom: 2px solid #DAA520; padding-bottom: 8px; margin-top: 25px; }
</style>
<h2 style="text-align: center; color: #B8860B;">🍷 ${date.chinese} 超级托斯卡纳完全指南：意大利葡萄酒的革命</h2>
<p style="text-align: center; color: #666;">托斯卡纳 · 国际品种 · 创新与传统</p>
<section style="background:linear-gradient(135deg,#1a1a0a,#3a2a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFFACD;font-size:16px;line-height:1.9">超级托斯卡纳（Super Tuscan）是<strong style="color:#DAA520">意大利葡萄酒史上最具革命性</strong>的存在。诞生于1970年代，它打破了传统葡萄酒法规的束缚，大胆使用国际葡萄品种，开创了意大利葡萄酒的新纪元。本文将带你了解<strong style="color:#DAA520">这场葡萄酒革命的故事</strong>。</p>
</section>
<h3>📜 一、超级托斯卡纳的诞生</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item">
<h4>革命的起源</h4>
<p style="color:#333;line-height:1.8;margin:0">
1970年代，一些托斯卡纳酿酒师对当时的DOC法规感到不满——法规要求基安蒂必须使用白葡萄。于是他们开始"违规"酿造：<strong>使用赤霞珠、梅洛等国际品种</strong>，并使用法国小橡木桶陈酿。</p>
</div>
<div class="region-item">
<h4>Tignanello 1971</h4>
<p style="color:#333;line-height:1.8;margin:0">安蒂诺里酒庄（Antinori）的Tignanello是超级托斯卡纳的开创之作。它放弃了白葡萄，使用桑娇维塞与国际品种混酿，在法国橡木桶中陈酿，一举轰动世界。</p>
</div>
<div class="region-item">
<h4>Sassicaia 1968</h4>
<p style="color:#333;line-height:1.8;margin:0">超级托斯卡纳的鼻祖，100%赤霞珠酿造。最初只是私人享用，1968年首次上市即大获成功，被誉为"意大利的拉菲"。</p>
</div>
</section>
<h3>🍇 二、主要葡萄品种</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px">
<div class="region-item">
<h4>桑娇维塞（Sangiovese）</h4>
<p style="color:#333;line-height:1.8;margin:0">传统托斯卡纳品种，提供酸度和优雅结构，是许多超级托斯卡纳的基酒。</p>
</div>
<div class="region-item">
<h4>赤霞珠（Cabernet Sauvignon）</h4>
<p style="color:#333;line-height:1.8;margin:0">国际品种，增加酒体和单宁，带来黑醋栗和雪松香气。</p>
</div>
<div class="region-item">
<h4>梅洛（Merlot）</h4>
<p style="color:#333;line-height:1.8;margin:0">增加柔滑口感和果香，使葡萄酒更圆润。</p>
</div>
<div class="region-item">
<h4>品丽珠（Cabernet Franc）</h4>
<p style="color:#333;line-height:1.8;margin:0">增加优雅的花香和草本香气。</p>
</div>
</section>
<h3>🥇 三、最著名的超级托斯卡纳</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<div class="region-item">
<h4>Sassicaia - 西施佳雅</h4>
<p style="color:#333;line-height:1.8;margin:0">来自Bolgheri海岸的传奇，100%赤霞珠，1994年拥有自己的DOC产区。被誉为"意大利的拉菲"。</p>
</div>
<div class="region-item">
<h4>Tignanello - 天娜</h4>
<p style="color:#333;line-height:1.8;margin:0">安蒂诺里酒庄的旗舰，桑娇维塞混酿少量赤霞珠和品丽珠。超级托斯卡纳的标志。</p>
</div>
<div class="region-item">
<h4>Ornellaia - 欧纳拉雅</h4>
<p style="color:#333;line-height:1.8;margin:0">Bolgheri的顶级酒庄，波尔多品种混酿，展现出海洋性气候的精致。</p>
</div>
<div class="region-item">
<h4>Masseto - 马赛多</h4>
<p style="color:#333;line-height:1.8;margin:0">100%梅洛，被誉为"意大利的帕图斯"，世界上最昂贵的葡萄酒之一。</p>
</div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item">
<h4>风格特点</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>颜色：</strong>深宝石红至深石榴红<br/>
• <strong>香气：</strong>黑莓、黑醋栗、雪松、烟草、咖啡、香草<br/>
• <strong>酒体：</strong>饱满<br/>
• <strong>单宁：</strong>丰富但精细<br/>
• <strong>陈年潜力：</strong>10-20年以上
</p>
</div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>烤肉：</strong>烤牛排、烤羊排、牛肋排</p>
<p style="color:#333;line-height:1.8">• <strong>野味：</strong>烤鹿肉、红酒炖牛肉</p>
<p style="color:#333;line-height:1.8">• <strong>陈年奶酪：</strong>陈年佩科里诺、帕尔马干酪</p>
<p style="color:#333;line-height:1.8">• <strong>意式菜肴：</strong>佛罗伦萨T骨牛排、番茄牛肉面</p>
</section>
<section style="background:linear-gradient(135deg,#1a1a0a,#3a2a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFFACD;font-size:16px;line-height:1.9">超级托斯卡纳不仅是一场<strong style="color:#DAA520">葡萄酒的革命</strong>，更是意大利酿酒师追求极致的象征。它们用国际品种在托斯卡纳的土地上创造了全新的传奇。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }
async function publishToWeChat(article, coverBuffer) {
  console.log('📤 发布到微信公众号草稿箱...');
  const wechatConfig = config.publish;
  const tokenRes = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}`);
  const accessToken = tokenRes.data.access_token;
  console.log('   ✅ Token 获取成功');
  console.log('   步骤 2/3: 上传封面图...');
  const form = new FormData(); form.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const mediaRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`, form, { headers: form.getHeaders() });
  const mediaId = mediaRes.data.media_id;
  console.log('   ✅ 封面上传成功, media_id:', mediaId);
  console.log('   步骤 3/3: 创建草稿...');
  const draftRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`, { articles: [{ title: article.title, thumb_media_id: mediaId, author: article.author, digest: article.digest, content: article.content, show_cover_pic: 1, need_open_comment: 0, only_fans_can_comment: 0 }] });
  if (draftRes.data.media_id) { console.log('   ✅ 草稿创建成功, media_id:', draftRes.data.media_id); return draftRes.data.media_id; }
  else { throw new Error('草稿创建失败: ' + JSON.stringify(draftRes.data)); }
}
async function main() {
  console.log('============================================================'); console.log('🥂 生成超级托斯卡纳完全指南文章'); console.log('日期:', date.display); console.log('============================================================');
  try {
    const coverBuffer = await generateCoverWithAI();
    const article = { title: `🍷 ${date.chinese} 超级托斯卡纳完全指南：意大利葡萄酒的革命`, author: '红酒顾问', digest: '超级托斯卡纳是意大利葡萄酒史上最具革命性的存在。本文详解其诞生历史、主要品种、传奇酒款及品鉴建议。', content: generateContent(), coverImage: 'supertuscan_cover_ai.png', category: 'wine-knowledge', tags: ['超级托斯卡纳', '意大利葡萄酒', '托斯卡纳', 'Sassicaia', 'Tignanello'], publishDate: date.full };
    const outputPath = path.join(__dirname, 'output', `supertuscan_${date.full.replace(/-/g, '')}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(article, null, 2)); console.log('📁 文章已保存:', outputPath);
    const mediaId = await publishToWeChat(article, coverBuffer);
    console.log('============================================================'); console.log('✅ 发布成功！'); console.log('草稿ID:', mediaId); console.log('============================================================');
  } catch (error) { console.error('❌ 错误:', error.message); process.exit(1); }
}
main();