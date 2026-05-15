/**
 * 普罗塞克葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');
const { exec } = require('child_process'); const util = require('util'); const execPromise = util.promisify(exec);

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine 生成写实普罗塞克封面...');
  const coverPath = path.join(__dirname, 'output', 'prosecco_cover_real.png');
  const prompt = 'Photorealistic Italian Prosecco sparkling wine, Glera grapes on Veneto hills, wine glass with golden bubbles, Conegliano Valdobbiadene vineyards, elegant bottle with gold label, professional photography, 8K ultra-detailed';
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const { stdout, stderr } = await execPromise(`npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`, { timeout: 180000 });
    if (stdout.includes('cover.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      const resizedBuffer = await sharp(coverPath).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#B8860B"/><stop offset="100%" style="stop-color:#9ACD32"/></linearGradient><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/></filter></defs><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/><text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🥂 普罗塞克完全指南</text><text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利威尼托 · 格蕾拉 · 清新起泡</text><text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#9ACD32" text-anchor="end">${date.display}</text></svg>`;
      const finalBuffer = await sharp(resizedBuffer).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
      fs.writeFileSync(path.join(__dirname, 'output', 'prosecco_cover_ai.png'), finalBuffer);
      return finalBuffer;
    }
  } catch(e) { console.log('   ⚠️ AI 生成失败:', e.message); }
  return generateLocalCover();
}
function generateLocalCover() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a2e1a"/><stop offset="50%" style="stop-color:#1a4a2a"/><stop offset="100%" style="stop-color:#1a1a2e"/></linearGradient><linearGradient id="wine" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#B8860B"/><stop offset="100%" style="stop-color:#9ACD32"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(154,205,50,0.2)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#wine)" stroke="#DAA520" stroke-width="3"/><rect x="640" y="210" width="120" height="30" rx="2" fill="#DAA520"/><text x="700" y="230" font-family="serif" font-size="14" fill="#0a2e1a" text-anchor="middle" font-weight="bold">PROSECCO</text><text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text><text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Veneto, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#9ACD32" filter="url(#g)">🥂</text><rect x="20" y="130" width="400" height="2" fill="#9ACD32"/><text x="30" y="160" font-family="Microsoft YaHei,PingFang SC" font-size="36" font-weight="bold" fill="#9ACD32">普罗塞克</text><text x="30" y="195" font-family="Microsoft YaHei,PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利威尼托</text><text x="30" y="220" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"国民起泡酒" · 格蕾拉葡萄</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">世界上最受欢迎的起泡酒之一</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#9ACD32" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b => { fs.writeFileSync(path.join(__dirname,'output','prosecco_cover_ai.png'), b); console.log('📁 SVG 封面已保存'); return b; });
}
function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#9ACD32;margin:0 0 8px 0;font-size:16px}h3{color:#9ACD32;border-bottom:2px solid #ADFF2F;padding-bottom:8px;margin-top:25px}</style>
<h2 style="text-align:center;color:#9ACD32;">🥂 ${date.chinese} 普罗塞克完全指南：意大利国民起泡酒</h2>
<p style="text-align:center;color:#666;">威尼托 · 格蕾拉 · 清新果香</p>
<section style="background:linear-gradient(135deg,#0a2e1a,#1a4a2a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#F0FFF0;font-size:16px;line-height:1.9">普罗塞克（Prosecco）是<strong style="color:#ADFF2F">意大利最受欢迎的起泡酒</strong>，以其清新的果香、活泼的气泡和亲民的价格风靡全球。与香槟不同，普罗塞克采用罐式发酵法（Charmat/Martinotti法），保留了葡萄的原始果香。本文将带你了解<strong style="color:#ADFF2F">普罗塞克的魅力</strong>。</p>
</section>
<h3>🍇 一、格蕾拉葡萄</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">普罗塞克主要使用<strong>格蕾拉（Glera）</strong>葡萄酿造。这种白葡萄品种以其清新的酸度和花果香气而闻名：<br/>• <strong>香气：</strong>青苹果、梨、白桃、橙花<br/>• <strong>特点：</strong>高酸度，低单宁，适合起泡酒<br/>• <strong>产区：</strong>威尼托大区的丘陵地带</p>
</section>
<h3>🏛️ 二、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Conegliano Valdobbiadene DOCG</h4><p style="color:#333;line-height:1.8;margin:0">最高品质的普罗塞克产区，位于陡峭的丘陵地带。这里的土壤富含石灰岩和砂岩，出产的葡萄酒更加细腻优雅。</p></div>
<div class="region-item"><h4>Asolo DOCG</h4><p style="color:#333;line-height:1.8;margin:0">另一个DOCG产区，风格同样精致，近年品质快速提升。</p></div>
<div class="region-item"><h4>Prosecco DOC</h4><p style="color:#333;line-height:1.8;margin:0">基础级别，产量最大，覆盖威尼托和弗留利大区，性价比高。</p></div>
</section>
<h3>🥂 三、普罗塞克的种类</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>Spumante（起泡型）</h4><p style="color:#333;line-height:1.8;margin:0">最经典的普罗塞克，充分起泡，气泡持久细腻。</p></div>
<div class="region-item"><h4>Frizzante（微起泡型）</h4><p style="color:#333;line-height:1.8;margin:0">轻微起泡，口感更柔和，适合日常饮用。</p></div>
<div class="region-item"><h4>Tranquillo（静止型）</h4><p style="color:#333;line-height:1.8;margin:0">无气泡的静止葡萄酒，较为少见。</p></div>
<div class="region-item"><h4>甜度分级</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Brut（天然）：</strong>含糖量最少，最干爽<br/>• <strong>Extra Dry：</strong>最常见，微甜<br/>• <strong>Dry：</strong>较甜</p></div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>典型特征</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>颜色：</strong>浅稻草黄到金色<br/>• <strong>香气：</strong>青苹果、梨、白花、柑橘<br/>• <strong>口感：</strong>清爽活泼，酸度明快<br/>• <strong>气泡：</strong>细腻持久<br/>• <strong>酒精度：</strong>通常10.5-11.5%</p></div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>开胃菜：</strong>意式火腿、炸鱿鱼、橄榄<br/>• <strong>海鲜：</strong>生蚝、虾、白肉鱼<br/>• <strong>前餐：</strong>蔬菜沙拉、水果拼盘<br/>• <strong>甜点：</strong>提拉米苏、水果塔<br/>• <strong>经典鸡尾酒：</strong>Bellini（普罗塞克+桃子汁）</p>
</section>
<section style="background:linear-gradient(135deg,#0a2e1a,#1a4a2a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#F0FFF0;font-size:16px;line-height:1.9">无论节日庆祝、朋友聚会还是日常小酌，<strong style="color:#ADFF2F">普罗塞克</strong>都是增添仪式感的最佳选择。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }
async function publishToWeChat(article, coverBuffer) {
  const w = config.publish; const t = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);
  const a = t.data.access_token;
  const f = new FormData(); f.append('media', coverBuffer, {filename:'cover.png',contentType:'image/png'});
  const m = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`, f, {headers: f.getHeaders()});
  const d = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`, {articles:[{title:article.title,thumb_media_id:m.data.media_id,author:article.author,digest:article.digest,content:article.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});
  if(d.data.media_id){console.log('   ✅ 草稿创建成功, media_id:', d.data.media_id); return d.data.media_id;}
  else throw new Error('草稿创建失败: '+JSON.stringify(d.data));
}
async function main() {
  console.log('============================================================\n🥂 生成普罗塞克完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const coverBuffer = await generateCoverWithAI();
    const article = {title:`🥂 ${date.chinese} 普罗塞克完全指南：意大利国民起泡酒`,author:'红酒顾问',digest:'普罗塞克是意大利最受欢迎的起泡酒，以其清新的果香和活泼的气泡风靡全球。本文详解格蕾拉葡萄、核心产区及品鉴要点。',content:generateContent(),coverImage:'prosecco_cover_ai.png',category:'wine-knowledge',tags:['普罗塞克','意大利葡萄酒','威尼托','起泡酒','格蕾拉'],publishDate:date.full};
    const p = path.join(__dirname,'output',`prosecco_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(p, JSON.stringify(article,null,2)); console.log('📁 文章已保存:',p);
    const mid = await publishToWeChat(article, coverBuffer);
    console.log('============================================================\n✅ 发布成功！\n草稿ID:',mid,'\n============================================================');
  } catch(e){console.error('❌ 错误:',e.message); process.exit(1);}
}
main();