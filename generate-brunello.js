/**
 * 布鲁奈罗葡萄酒完全指南
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实布鲁奈罗封面...');
  const coverPath = path.join(__dirname, 'output', 'brunello_cover_real.png');
  const prompt = 'Photorealistic Italian Brunello di Montalcino wine, Sangiovese grapes on Tuscan hillsides, Montalcino medieval hilltop town, oak barrels in historic cellar, warm golden Tuscan sunset, professional photography, 8K ultra-detailed';
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    if (stdout.includes('cover.png') || stdout.includes('brunello_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      const resizedBuffer = await sharp(coverPath).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#A0522D"/><stop offset="100%" style="stop-color:#CD853F"/></linearGradient><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/></filter></defs><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/><text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 布鲁奈罗完全指南</text><text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利托斯卡纳 · 蒙塔奇诺 · 桑娇维塞</text><text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#CD853F" text-anchor="end">${date.display}</text></svg>`;
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer).composite([{ input: textBuffer, top: 0, left: 0 }]).png().toBuffer();
      const outputPath = path.join(__dirname, 'output', 'brunello_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      return finalBuffer;
    }
  } catch (error) {
    console.log('   ⚠️ AI 生成失败:', error.message);
  }
  console.log('   使用本地备用封面');
  return generateLocalCover();
}

function generateLocalCover() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1f0a"/><stop offset="50%" style="stop-color:#4a2c14"/><stop offset="100%" style="stop-color:#1a1a2e"/></linearGradient><linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#722F37"/><stop offset="100%" style="stop-color:#A0522D"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#DAA520"/><stop offset="100%" style="stop-color:#B8860B"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bgGrad)"/><circle cx="650" cy="100" r="180" fill="rgba(160, 82, 45, 0.3)"/><circle cx="680" cy="120" r="150" fill="rgba(205, 133, 63, 0.2)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#wineGrad)" stroke="url(#goldGrad)" stroke-width="3"/><rect x="640" y="210" width="120" height="30" rx="2" fill="url(#goldGrad)"/><text x="700" y="230" font-family="serif" font-size="14" fill="#2d1f0a" text-anchor="middle" font-weight="bold">BRUNELLO</text><text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text><text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Tuscany, Italy</text><text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text><rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/><text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DEB887">布鲁奈罗</text><text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利托斯卡纳</text><text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利顶级红酒" · 大桑娇维塞</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">陈年实力不输巴罗洛</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DEB887" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(buffer => {
    const outputPath = path.join(__dirname, 'output', 'brunello_cover_ai.png');
    fs.writeFileSync(outputPath, buffer);
    console.log('📁 SVG 封面已保存:', outputPath);
    return buffer;
  });
}

function generateContent() { return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #A0522D; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #A0522D; border-bottom: 2px solid #DEB887; padding-bottom: 8px; margin-top: 25px; }
</style>
<h2 style="text-align: center; color: #A0522D;">🍷 ${date.chinese} 布鲁奈罗完全指南：托斯卡纳的骄傲</h2>
<p style="text-align: center; color: #666;">托斯卡纳 · 蒙塔奇诺 · 大桑娇维塞</p>
<section style="background:linear-gradient(135deg,#2d1f0a,#4a2c14);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">布鲁奈罗（Brunello di Montalcino）是<strong style="color:#DEB887">意大利托斯卡纳</strong>最顶级的葡萄酒之一，被誉为"意大利顶级红酒中的王者"。采用100%大桑娇维塞（Sangiovese Grosso）葡萄酿造，以其极长的陈年潜力和复杂优雅的风格闻名。本文将带你全面了解<strong style="color:#DEB887">布鲁奈罗的魅力</strong>。</p>
</section>
<h3>🍇 一、认识大桑娇维塞葡萄</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">布鲁奈罗采用<strong>100%大桑娇维塞（Sangiovese Grosso）</strong>葡萄酿造，是桑娇维塞家族中最优秀的克隆品种。</p>
<div class="region-item">
<h4>葡萄品种特性</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>果粒更大：</strong>比普通桑娇维塞果粒更饱满<br/>
• <strong>单宁丰富：</strong>结构紧实，适合长期陈年<br/>
• <strong>酸度明亮：</strong>提供优雅的骨架感<br/>
• <strong>风味复杂：</strong>兼具果香和陈年风味
</p>
</div>
</section>
<h3>🏛️ 二、核心产区风土</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item">
<h4>北部产区</h4>
<p style="color:#333;line-height:1.8;margin:0">海拔较高，土壤富含石灰岩，出产的布鲁奈罗更优雅芳香。代表村庄：Montalcino北部周边。</p>
</div>
<div class="region-item">
<h4>南部产区</h4>
<p style="color:#333;line-height:1.8;margin:0">温暖干燥，土壤以黏土和砂岩为主，出产的葡萄酒更浓郁强劲。代表葡萄园：Sant'Angelo in Colle。</p>
</div>
<div class="region-item">
<h4>东部产区</h4>
<p style="color:#333;line-height:1.8;margin:0">海拔适中，土壤多样，风格介于南北之间，平衡优雅。</p>
</div>
</section>
<h3>🍷 三、酿造工艺与法规</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item">
<h4>法规要求</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>葡萄：</strong>100%大桑娇维塞<br/>
• <strong>陈酿：</strong>至少2年橡木桶 + 4个月瓶中<br/>
• <strong>珍藏（Riserva）：</strong>至少5年陈酿（含橡木桶）<br/>
• <strong>最低酒精度：</strong>12.5%
</p>
</div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item">
<h4>典型特征</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>颜色：</strong>深石榴红，陈年后边缘呈砖红色<br/>
• <strong>香气：</strong>野樱桃、紫罗兰、草莓、草本、烟草、皮革、巧克力<br/>
• <strong>单宁：</strong>强劲但优雅<br/>
• <strong>酸度：</strong>清爽明快<br/>
• <strong>余味：</strong>悠长复杂<br/>
• <strong>陈年潜力：</strong>10-30年以上
</p>
</div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>托斯卡纳烤肉：</strong>佛罗伦萨T骨牛排</p>
<p style="color:#333;line-height:1.8">• <strong>野味菜肴：</strong>烤野猪肉、鹿肉</p>
<p style="color:#333;line-height:1.8">• <strong>陈年奶酪：</strong>佩科里诺陈年奶酪</p>
<p style="color:#333;line-height:1.8">• <strong>意式烩牛膝：</strong>米兰风格烩牛膝（Ossobuco）</p>
</section>
<h3>💰 六、知名酒庄</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<div class="region-item">
<h4>Biondi-Santi - 碧安帝山迪</h4>
<p style="color:#333;line-height:1.8;margin:0">布鲁奈罗的发明者，历史最悠久的酒庄，1888年酿造出第一瓶布鲁奈罗。</p>
</div>
<div class="region-item">
<h4>Fattoria dei Barbi</h4>
<p style="color:#333;line-height:1.8;margin:0">历史悠久的传统酒庄，性价比高。</p>
</div>
<div class="region-item">
<h4>Casanova di Neri</h4>
<p style="color:#333;line-height:1.8;margin:0">现代派代表，多次获得酒评家满分评价。</p>
</div>
<div class="region-item">
<h4>Poggio di Sotto</h4>
<p style="color:#333;line-height:1.8;margin:0">优雅风格的标杆，被誉为"布鲁奈罗中的勃艮第"。</p>
</div>
</section>
<section style="background:linear-gradient(135deg,#2d1f0a,#4a2c14);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">布鲁奈罗是意大利葡萄酒中<strong style="color:#DEB887">最能体现时间价值</strong>的佳酿。等待一款布鲁奈罗绽放是一件美妙的事，每一刻的等待都值得。</p>
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
  const form = new FormData();
  form.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const mediaRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`, form, { headers: form.getHeaders() });
  const mediaId = mediaRes.data.media_id;
  console.log('   ✅ 封面上传成功, media_id:', mediaId);
  console.log('   步骤 3/3: 创建草稿...');
  const articles = [{ title: article.title, thumb_media_id: mediaId, author: article.author, digest: article.digest, content: article.content, content_source_url: '', show_cover_pic: 1, need_open_comment: 0, only_fans_can_comment: 0 }];
  const draftRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`, { articles: articles });
  if (draftRes.data.media_id) { console.log('   ✅ 草稿创建成功, media_id:', draftRes.data.media_id); return draftRes.data.media_id; }
  else { throw new Error('草稿创建失败: ' + JSON.stringify(draftRes.data)); }
}

async function main() {
  console.log('============================================================');
  console.log('🥂 生成布鲁奈罗完全指南文章');
  console.log('日期:', date.display);
  console.log('============================================================');
  try {
    const coverBuffer = await generateCoverWithAI();
    const article = { title: `🍷 ${date.chinese} 布鲁奈罗完全指南：托斯卡纳的骄傲`, author: '红酒顾问', digest: '布鲁奈罗是意大利托斯卡纳最顶级的葡萄酒之一，采用100%大桑娇维塞酿造。本文详解核心产区风土、酿造法规及知名酒庄。', content: generateContent(), coverImage: 'brunello_cover_ai.png', category: 'wine-knowledge', tags: ['布鲁奈罗', '意大利葡萄酒', '托斯卡纳', '蒙塔奇诺', '桑娇维塞'], publishDate: date.full };
    const outputPath = path.join(__dirname, 'output', `brunello_${date.full.replace(/-/g, '')}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
    console.log('📁 文章已保存:', outputPath);
    const mediaId = await publishToWeChat(article, coverBuffer);
    console.log('============================================================');
    console.log('✅ 发布成功！');
    console.log('草稿ID:', mediaId);
    console.log('============================================================');
  } catch (error) { console.error('❌ 错误:', error.message); process.exit(1); }
}
main();