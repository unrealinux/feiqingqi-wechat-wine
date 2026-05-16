/**
 * 博格利完全指南（超级托斯卡纳的海岸之星）
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a2a"/><stop offset="50%" style="stop-color:#1a2a4a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#2F4F4F"/><stop offset="100%" style="stop-color:#4682B4"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><ellipse cx="650" cy="100" rx="140" ry="80" fill="rgba(70,130,180,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#4682B4" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Tuscany, Italy · Bolgheri DOC</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#4682B4" filter="url(#g)">🌊</text><rect x="20" y="130" width="500" height="2" fill="#4682B4"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#4682B4">博格利</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">托斯卡纳 · 超级托斯卡纳的诞生地</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"西施佳雅的故乡"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">第勒尼安海畔的葡萄酒传奇</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#4682B4" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','bolgheri_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#2F4F4F;margin:0 0 8px 0;font-size:16px}h3{color:#2F4F4F;border-bottom:2px solid #4682B4;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#2F4F4F;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#2F4F4F;">🌊 ${date.chinese} 博格利完全指南：超级托斯卡纳的海岸传奇</h2>
<p style="text-align:center;color:#666;">托斯卡纳 · 第勒尼安海岸 · 西施佳雅 · 意大利最受追捧的产区之一</p>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a4a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">博格利（Bolgheri）是<strong style="color:#4682B4">意大利最令人兴奋的葡萄酒产区之一</strong>，位于托斯卡纳海岸的第勒尼安海边。这里是超级托斯卡纳（Super Tuscan）运动的发源地——1960年代，马里奥·因奇萨·德拉·罗凯塔侯爵在这里创造了传奇的<strong style="color:#4682B4">西施佳雅（Sassicaia）</strong>，彻底改变了意大利葡萄酒的历史进程。</p>
</section>
<h3>🌊 一、历史传奇</h3>
<section style="background:#F0F8FF;padding:18px;border-radius:8px">
<div class="region-item"><h4>超级托斯卡纳的诞生</h4><p style="color:#333;line-height:1.8;margin:0">1940年代，马里奥侯爵在他的博格利庄园种植了赤霞珠和品丽珠——这在当时的意大利是惊世骇俗之举。1968年，第一款西施佳雅面世，虽然没有DOC等级标签（因为使用了"非法"的国际品种），却凭借卓越品质赢得了世界关注，由此开创了"超级托斯卡纳"时代。</p></div>
<div class="region-item"><h4>博格利DOC的建立</h4><p style="color:#333;line-height:1.8;margin:0">直到1983年，博格利才获得DOC地位，1994年升级为DOC。如今，博格利分区中还有<strong>Bolgheri Sassicaia DOC</strong>——意大利唯一一个以特定酒款命名的子产区。</p></div>
</section>
<h3>🍇 二、葡萄品种</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>品种</th><th>在博格利的角色</th></tr>
<tr><td>赤霞珠（Cabernet Sauvignon）</td><td>主力品种，构成结构、单宁和陈年能力</td></tr>
<tr><td>品丽珠（Cabernet Franc）</td><td>增加优雅和香气复杂度，西施佳雅常用</td></tr>
<tr><td>梅洛（Merlot）</td><td>增加圆润度和果味，如玛塞多（Masseto）</td></tr>
<tr><td>小维多（Petit Verdot）</td><td>少量添加，增加色泽和香料感</td></tr>
<tr><td>桑娇维塞（Sangiovese）</td><td>有些传统风格使用</td></tr>
</table>
</section>
<h3>🏆 三、等级与酒款</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>Bolgheri Rosso DOC</h4><p style="color:#333;line-height:1.8;margin:0">基本等级，至少使用60%的国际品种。新鲜果味，适合在3-5年内饮用。性价比极高，通常售价在100-300元之间。</p></div>
<div class="region-item"><h4>Bolgheri Superiore DOC</h4><p style="color:#333;line-height:1.8;margin:0">至少陈酿2年，更加浓郁复杂。酒体饱满，单宁成熟，陈年潜力8-15年。代表酒款：Guado al Tasso、Grattamacco。</p></div>
<div class="region-item"><h4>Bolgheri Sassicaia DOC</h4><p style="color:#333;line-height:1.8;margin:0">意大利唯一的庄园自有DOC子产区，专门为西施佳雅而设。由85%赤霞珠和15%品丽珠混酿，陈酿25个月法式橡木桶。被誉为"意大利的拉菲"，陈年潜力20-30年+。</p></div>
<div class="region-item"><h4>Masseto（玛塞多）</h4><p style="color:#333;line-height:1.8;margin:0">100%梅洛酿造，博格利的另一传奇。产量极少，价格与西施佳雅不相上下，是世界上最顶级的梅洛葡萄酒之一。</p></div>
</section>
<h3>🍽️ 四、美食搭配</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>搭配建议</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>博格利Rosso：</strong>烤肉、意大利面、披萨和牛肉汉堡<br/>• <strong>博格利Superiore：</strong>烤羊排、炖牛肉、烤鸭和野味<br/>• <strong>西施佳雅/玛塞多：</strong>顶级牛排、鹿肉、松露菜肴和陈年奶酪</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a4a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">博格利是意大利葡萄酒的革新者。<strong style="color:#4682B4">从打破传统的西施佳雅到如今百花齐放的顶级酒庄，这片海风吹拂的土地一直在创造着葡萄酒历史</strong>。无论是收藏顶级酒款还是探索性价比之选，博格利都能满足你的期待。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌊 生成博格利完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌊 ${date.chinese} 博格利完全指南：超级托斯卡纳的海岸传奇`,author:'红酒顾问',digest:'博格利是超级托斯卡纳运动的发源地，西施佳雅的故乡。探索这片海风吹拂的葡萄酒天堂。',content:generateContent(),coverImage:'bolgheri_cover_ai.png',category:'wine-knowledge',tags:['博格利','托斯卡纳','超级托斯卡纳','西施佳雅','Bolgheri'],publishDate:date.full};
    const op = path.join(__dirname,'output',`bolgheri_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
