/**
 * 弗留利-威尼斯朱利亚葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#001a2a"/><stop offset="50%" style="stop-color:#003a4a"/><stop offset="100%" style="stop-color:#001a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#4682B4"/><stop offset="100%" style="stop-color:#87CEEB"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(135,206,235,0.06)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#87CEEB" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Friuli-Venezia Giulia, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#87CEEB" filter="url(#g)">🌅</text><rect x="20" y="130" width="500" height="2" fill="#87CEEB"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#87CEEB">弗留利-威尼斯朱利亚</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利东北 · 白葡萄酒天堂 · 橙酒的发源地</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"斯洛文尼亚边境的葡萄酒秘境"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">Friulano与橙酒的故乡</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#87CEEB" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','friuli_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#4682B4;margin:0 0 8px 0;font-size:16px}h3{color:#4682B4;border-bottom:2px solid #87CEEB;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#4682B4;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#4682B4;">🌅 ${date.chinese} 弗留利-威尼斯朱利亚完全指南</h2>
<p style="text-align:center;color:#666;">弗留利 · 意大利白葡萄酒的标杆 · 橙酒运动 · 弗留利诺</p>
<section style="background:linear-gradient(135deg,#001a2a,#003a4a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0E0E6;font-size:16px;line-height:1.9">弗留利-威尼斯朱利亚（Friuli-Venezia Giulia）是<strong style="color:#87CEEB">意大利最重要的白葡萄酒产区之一</strong>，位于意大利东北角与斯洛文尼亚接壤的边境地区。这里以<strong style="color:#87CEEB">纯净优雅的白葡萄酒</strong>闻名于世，同时也是全球"橙酒"（Orange Wine）运动的发源地——这种使用白葡萄带皮发酵的自然酒风格，在这里有着数百年的传统。</p>
</section>
<h3>🗺️ 一、主要子产区</h3>
<section style="background:#F0F8FF;padding:18px;border-radius:8px">
<table>
<tr><th>DOCG/DOC</th><th>位置</th><th>特色</th></tr>
<tr><td>Collio DOC</td><td>戈里齐亚省丘陵</td><td>弗留利最著名的产区，白葡萄酒标杆，多石土壤</td></tr>
<tr><td>Colli Orientali del Friuli DOC</td><td>乌迪内省东部</td><td>同样顶级，产量更大，品种更丰富</td></tr>
<tr><td>Friuli Isonzo DOC</td><td>伊松佐河平原</td><td>土壤富含矿物质，白葡萄酒清新爽口</td></tr>
<tr><td>Friuli Grave DOC</td><td>广阔平原地区</td><td>产量最大，性价比高</td></tr>
<tr><td>Ramandolo DOCG</td><td>Colli Orientali内</td><td>甜型白葡萄酒，使用Verduzzo葡萄</td></tr>
<tr><td>Picolit DOCG</td><td>Colli Orientali内</td><td>古老甜白葡萄酒，曾是欧洲皇室最爱</td></tr>
</table>
</section>
<h3>🍇 二、代表品种</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>弗留利诺（Friulano）</h4><p style="color:#333;line-height:1.8;margin:0">弗留利的骄傲和灵魂。这种白葡萄酿造出酒体中等、带有白桃、杏仁和矿物的葡萄酒。口感清爽，标志性特征是尾韵中的苦杏仁风味。曾是弗留利种植面积最广的白葡萄品种。经典搭配：弗留利海鲜和冷切肉。</p></div>
<div class="region-item"><h4>黄丽波拉（Ribolla Gialla）</h4><p style="color:#333;line-height:1.8;margin:0">一种古老的本地品种，在弗留利有着悠久的历史。酿造出的葡萄酒清爽活泼，带有柑橘和草本的风味。它是橙酒运动中最重要的品种——带皮发酵数月后，展现出浓郁的琥珀色和强大的结构感。</p></div>
<div class="region-item"><h4>其他重要品种</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>灰皮诺（Pinot Grigio）：</strong>弗留利的灰皮诺是意大利最优秀的，比上阿迪杰的更加饱满<br/>• <strong>长相思（Sauvignon）：</strong>在Collio产区有惊艳表现<br/>• <strong>Refosco dal Peduncolo Rosso：</strong>弗留利最好的红葡萄品种</p></div>
</section>
<h3>🍊 三、橙酒运动</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>橙酒简介</h4><p style="color:#333;line-height:1.8;margin:0">橙酒（Orange Wine）是将白葡萄带皮浸渍数周甚至数月的自然酒风格。这种古老的酿造方法在格鲁吉亚有着8000年历史，而弗留利是将其重新引入现代葡萄酒世界的先锋。代表性酒庄包括<strong>Gravner、Radikon、Dario Princic</strong>和<strong>Stanko Radikon</strong>等。</p></div>
<div class="region-item"><h4>品鉴特点</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>深琥珀色到橙色<br/><strong>香气：</strong>干果、橙皮、蜂蜜、草药、坚果<br/><strong>口感：</strong>单宁感（来自葡萄皮），结构强劲，余味复杂</p></div>
</section>
<h3>👃 四、品鉴精选</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>推荐酒庄</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Livio Felluga：</strong>弗留利的标志性酒庄，品质标杆<br/>• <strong>Gravner：</strong>橙酒运动的传奇，使用陶罐陈酿<br/>• <strong>Radikon：</strong>橙酒先驱之一，Ribolla Gialla大师<br/>• <strong>Miani：</strong>产量极少，品质极高，传奇酒庄<br/>• <strong>Venica & Venica：</strong>Collio产区的代表，白葡萄酒一流</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>弗留利诺：</strong>火腿、海鲜意面、烤鱼、蔬菜烩饭<br/>• <strong>橙酒：</strong>适合搭配奶酪、咖喱菜肴、中东烤肉和发酵类食物<br/>• <strong>Refosco红酒：</strong>烤肉、野味和炖菜</p></div>
</section>
<section style="background:linear-gradient(135deg,#001a2a,#003a4a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0E0E6;font-size:16px;line-height:1.9">弗留利是意大利白葡萄酒爱好者的朝圣之地。<strong style="color:#87CEEB">无论是纯净优雅的弗留利诺、传统创新的橙酒，还是国际品种的精彩演绎，这片东北角的土地总能带来惊喜</strong>。如果你热爱白葡萄酒，弗留利就是你不可错过的目的地。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌅 生成弗留利完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌅 ${date.chinese} 弗留利-威尼斯朱利亚完全指南：意大利白葡萄酒的标杆`,author:'红酒顾问',digest:'弗留利是意大利最重要的白葡萄酒产区之一，也是橙酒运动的发源地。探索这片位于斯洛文尼亚边境的葡萄酒秘境。',content:generateContent(),coverImage:'friuli_cover_ai.png',category:'wine-knowledge',tags:['弗留利','意大利白葡萄酒','弗留利诺','橙酒','Collio'],publishDate:date.full};
    const op = path.join(__dirname,'output',`friuli_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
