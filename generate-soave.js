/**
 * 苏瓦韦白葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#E0F7FA"/><stop offset="50%" style="stop-color:#B2EBF2"/><stop offset="100%" style="stop-color:#80DEEA"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#00838F"/><stop offset="100%" style="stop-color:#00BCD4"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(0,188,212,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.05)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#00BCD4" stroke-width="2" opacity="0.2"/><text x="700" y="375" font-family="serif" font-size="12" fill="#888" text-anchor="middle">Veneto, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#00838F" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#00BCD4"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#00838F">苏瓦韦</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="#555">意大利威尼托 · 卡尔卡耐卡 · 清爽白葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="#888">"意大利最经典的白葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="#aaa">花香四溢 · 清爽怡人 · 海鲜绝配</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#00BCD4" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','soave_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#00838F;margin:0 0 8px 0;font-size:16px}h3{color:#00838F;border-bottom:2px solid #00BCD4;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#00838F;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#00838F;">🍷 ${date.chinese} 苏瓦韦完全指南：意大利白葡萄酒的经典</h2>
<p style="text-align:center;color:#666;">威尼托 · 卡尔卡耐卡 · 清爽优雅 · 海鲜之友</p>
<section style="background:linear-gradient(135deg,#E0F7FA,#B2EBF2);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#333;font-size:16px;line-height:1.9">苏瓦韦（Soave）是<strong style="color:#00838F">意大利最著名、最经典的白葡萄酒</strong>之一，产自威尼托大区。这款以卡尔卡耐卡（Garganega）葡萄酿造的白葡萄酒，以其清新的花果香气、优雅的矿物感和出色的性价比，赢得了全球葡萄酒爱好者的青睐。从日常佐餐到高级餐厅，苏瓦韦的身影遍布世界各地。本文将带你<strong style="color:#00838F">全面探索苏瓦韦</strong>。</p>
</section>
<h3>🍇 一、卡尔卡耐卡葡萄</h3>
<section style="background:#E0F2F1;padding:18px;border-radius:8px">
<div class="region-item"><h4>品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>起源：</strong>威尼斯地区的古老品种，有千年历史<br/>• <strong>果皮：</strong>厚实，耐病害，适合当地气候<br/>• <strong>酸度：</strong>自然酸度高，提供清爽结构<br/>• <strong>香气：</strong>白花、杏仁、柑橘、梨、矿物<br/>• <strong>种植面积：</strong>威尼托种植最广泛的白葡萄品种</p></div>
</section>
<h3>🏛️ 二、核心产区分级</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Soave DOC</h4><p style="color:#333;line-height:1.8;margin:0">基础级别，覆盖整个苏瓦韦产区。要求至少70%卡尔卡耐卡，允许混酿霞多丽、长相思等国际品种。风格清爽易饮。</p></div>
<div class="region-item"><h4>Soave Classico DOC</h4><p style="color:#333;line-height:1.8;margin:0">核心区域，位于Soave和Monteforte d'Alpone两镇之间。这里是苏瓦韦的发源地，葡萄园多位于火山岩山坡上。品质更高，矿物感更明显。</p></div>
<div class="region-item"><h4>Soave Superiore DOCG</h4><p style="color:#333;line-height:1.8;margin:0">最高级别，对产量和酒精度有更严格要求，要求更低产量和更高成熟度。</p></div>
<div class="region-item"><h4>Recioto di Soave DOCG</h4><p style="color:#333;line-height:1.8;margin:0">使用风干卡尔卡耐卡葡萄酿造的甜型葡萄酒，风格甜美浓郁，是苏瓦韦产区的珍宝。</p></div>
</section>
<h3>🍷 三、酿造风格</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>不锈钢桶风格</h4><p style="color:#333;line-height:1.8;margin:0">最传统的方式，突出新鲜的花香和果味。酒质纯净清爽，是苏瓦韦的代表风格。</p></div>
<div class="region-item"><h4>橡木桶风格</h4><p style="color:#333;line-height:1.8;margin:0">部分顶级苏瓦韦会使用法国橡木桶陈酿数月，增加香草和坚果的复杂度，酒体更加饱满。</p></div>
<div class="region-item"><h4>酒泥陈酿风格</h4><p style="color:#333;line-height:1.8;margin:0">一些酒庄会采用酒泥陈酿（Sur Lie），增加酵母风味和口感厚度。</p></div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>视觉</h4><p style="color:#333;line-height:1.8;margin:0">浅稻草黄色到浅金色，酒液清澈透亮。</p></div>
<div class="region-item"><h4>嗅觉</h4><p style="color:#333;line-height:1.8;margin:0">清新的白花、杏仁、柑橘和梨的香气，伴随着淡雅的矿物感。Classico产区的酒还有独特的燧石气息。</p></div>
<div class="region-item"><h4>味觉</h4><p style="color:#333;line-height:1.8;margin:0">入口清爽，酸度明快，带有柠檬、白桃和杏仁的风味。余味中带有矿物感和淡淡的苦杏仁味，这是卡尔卡耐卡的标志性特点。</p></div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table><tr><th>菜品</th><th>推荐</th><th>搭配原理</th></tr><tr><td>海鲜</td><td>生蚝、白灼虾、清蒸鱼</td><td>酸度提升海鲜鲜甜</td></tr><tr><td>意式前菜</td><td>意式火腿蜜瓜、炸鱿鱼</td><td>清爽口感平衡油脂</td></tr><tr><td>蔬菜料理</td><td>芦笋烩饭、蔬菜沙拉</td><td>清新风格与蔬菜和谐搭配</td></tr><tr><td>日式料理</td><td>刺身、天妇罗、寿司</td><td>酸度和鲜味完美配合</td></tr></table>
</section>
<section style="background:linear-gradient(135deg,#E0F7FA,#B2EBF2);padding:22px;border-radius:10px;text-align:center">
<p style="color:#333;font-size:16px;line-height:1.9">苏瓦韦是意大利白葡萄酒的经典之作。<strong style="color:#00838F">清爽、优雅、百搭</strong>，无论是夏日午后还是海鲜盛宴，它总是最可靠的选择。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成苏瓦韦完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 苏瓦韦完全指南：意大利白葡萄酒的经典`,author:'红酒顾问',digest:'苏瓦韦是意大利最经典的白葡萄酒之一。本文详解卡尔卡耐卡葡萄、核心产区分级、酿造风格及海鲜搭配指南。',content:generateContent(),coverImage:'soave_cover_ai.png',category:'wine-knowledge',tags:['苏瓦韦','意大利白葡萄酒','威尼托','卡尔卡耐卡','Soave'],publishDate:date.full};
    const op = path.join(__dirname,'output',`soave_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
    const w = config.publish; const t = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);
    const a = t.data.access_token; console.log('📤 发布到微信公众号草稿箱...');
    const f = new FormData(); f.append('media',cb,{filename:'cover.png',contentType:'image/png'});
    const m = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});
    console.log('   ✅ 封面已上传');
    const d = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:article.title,thumb_media_id:m.data.media_id,author:article.author,digest:article.digest,content:article.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});
    console.log('   ✅ 草稿创建成功, media_id:',d.data.media_id);
    console.log('============================================================\n✅ 发布成功！\n============================================================');
  } catch(e){console.error('❌ 错误:',e.message); process.exit(1);}
}
main();