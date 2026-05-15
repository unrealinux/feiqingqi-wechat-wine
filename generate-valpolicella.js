/**
 * 瓦波利切拉葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a0a"/><stop offset="50%" style="stop-color:#3a1a1a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#722F37"/><stop offset="100%" style="stop-color:#B22222"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(178,34,34,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#B22222" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Veneto, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#B22222" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#B22222"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#B22222">瓦波利切拉</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利威尼托 · 科维纳 · 多种风格</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利最具多样性的葡萄酒产区"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">从轻盈日常到浓郁风干，一区多面</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#B22222" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','valpolicella_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B22222;margin:0 0 8px 0;font-size:16px}h3{color:#B22222;border-bottom:2px solid #CD5C5C;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B22222;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B22222;">🍷 ${date.chinese} 瓦波利切拉完全指南：一区四酒</h2>
<p style="text-align:center;color:#666;">威尼托 · 科维纳 · 从轻盈到浓郁 · 风格多样</p>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFC0C0;font-size:16px;line-height:1.9">瓦波利切拉（Valpolicella）是<strong style="color:#CD5C5C">意大利威尼托大区最令人惊叹的葡萄酒产区</strong>之一。这里最独特之处在于——<strong style="color:#CD5C5C">同一个产区酿造出四种风格迥异的葡萄酒</strong>：从轻盈清爽的基础瓦波利切拉，到浓郁醇厚的阿玛罗尼，再到甜美的雷乔托。本文带你全面了解这个"一区四酒"的神奇产区。</p>
</section>
<h3>🍇 一、四种风格的瓦波利切拉</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<table><tr><th>风格</th><th>酿造方式</th><th>口感特点</th><th>陈年潜力</th></tr><tr><td><strong>Valpolicella</strong></td><td>常规酿造，不经风干</td><td>轻盈活泼，果味清新，酸度明亮</td><td>2-3年</td></tr><tr><td><strong>Valpolicella Superiore</strong></td><td>更高成熟度，橡木桶陈酿</td><td>更饱满的果味，带香草和香料气息</td><td>3-5年</td></tr><tr><td><strong>Valpolicella Ripasso</strong></td><td>用阿玛罗尼酒渣再次发酵</td><td>酒体中饱满，果味浓郁，复杂度提升</td><td>3-6年</td></tr><tr><td><strong>Amarone della Valpolicella</strong></td><td>风干葡萄酿造</td><td>浓郁醇厚，高酒精度，深色果香</td><td>10-20年+</td></tr><tr><td><strong>Recioto della Valpolicella</strong></td><td>风干葡萄酿造（甜型）</td><td>甜美浓郁，巧克力与黑樱桃风味</td><td>10年+</td></tr></table>
</section>
<h3>🥇 二、Ripasso - 瓦波利切拉的独特发明</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">Ripasso（意为"重新处理"）是瓦波利切拉独有的酿造技法：将基础瓦波利切拉葡萄酒倒入阿玛罗尼发酵后剩下的酒渣中，进行<strong>二次发酵</strong>。这一过程为酒液增加了更多的单宁、酒体和风味复杂度，创造出介于基础瓦波利切拉和阿玛罗尼之间的风格。Ripasso常被称为"小阿玛罗尼"或"穷人的阿玛罗尼"。</p>
</section>
<h3>🏛️ 三、核心子产区</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>Valpolicella Classica</h4><p style="color:#333;line-height:1.8;margin:0">核心区域，包括Negrar、Fumane、Marano、San Pietro in Cariano、Sant'Ambrogio五个山谷。出产最高品质的瓦波利切拉。</p></div>
<div class="region-item"><h4>Valpantena</h4><p style="color:#333;line-height:1.8;margin:0">Classica以东的山谷，近年品质显著提升。</p></div>
<div class="region-item"><h4>Valpolicella Orientale</h4><p style="color:#333;line-height:1.8;margin:0">东部扩展区，面积广阔，产量大。</p></div>
</section>
<h3>👃 四、品鉴与配餐</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>基础瓦波利切拉</h4><p style="color:#333;line-height:1.8;margin:0">香气：红樱桃、草莓、覆盆子。口感轻盈，酸度活泼。配餐：意式冷盘、番茄面、披萨。饮用温度14-16°C。</p></div>
<div class="region-item"><h4>Ripasso</h4><p style="color:#333;line-height:1.8;margin:0">香气：黑樱桃、李子、香草、巧克力。酒体中饱，单宁柔顺。配餐：烤肉、炖菜、陈年奶酪。适饮温度16-18°C。</p></div>
<div class="region-item"><h4>知名酒庄</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Allegrini：</strong>品质稳定的经典品牌<br/>• <strong>Masi：</strong>Ripasso的推广先驱<br/>• <strong>Tommasi：</strong>性价比高的家族酒庄</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFC0C0;font-size:16px;line-height:1.9">瓦波利切拉是意大利最多元化的葡萄酒产区。从清爽的日常酒到浓郁的阿玛罗尼，<strong style="color:#CD5C5C">同一个山谷，五种不同的惊喜</strong>。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成瓦波利切拉完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 瓦波利切拉完全指南：一区四酒`,author:'红酒顾问',digest:'瓦波利切拉是威尼托最神奇的产区，同一个产区酿造出四种风格迥异的葡萄酒。本文详解五种风格、Ripasso独特工艺及核心子产区。',content:generateContent(),coverImage:'valpolicella_cover_ai.png',category:'wine-knowledge',tags:['瓦波利切拉','意大利葡萄酒','威尼托','Ripasso','Valpolicella'],publishDate:date.full};
    const op = path.join(__dirname,'output',`valpolicella_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
    const w = config.publish; const t = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);
    const a = t.data.access_token; console.log('📤 发布到微信公众号草稿箱...');
    const f = new FormData(); f.append('media',cb,{filename:'cover.png',contentType:'image/png'});
    const m = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});
    const d = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:article.title,thumb_media_id:m.data.media_id,author:article.author,digest:article.digest,content:article.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});
    console.log('   ✅ 草稿创建成功, media_id:',d.data.media_id);
    console.log('============================================================\n✅ 发布成功！\n============================================================');
  } catch(e){console.error('❌ 错误:',e.message); process.exit(1);}
}
main();