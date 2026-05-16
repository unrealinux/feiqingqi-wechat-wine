/**
 * 埃特纳火山葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="50%" style="stop-color:#3a1a0a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B0000"/><stop offset="100%" style="stop-color:#FF4500"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><ellipse cx="650" cy="150" rx="90" ry="50" fill="rgba(255,69,0,0.08)"/><ellipse cx="660" cy="130" rx="60" ry="80" fill="rgba(255,0,0,0.05)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF4500" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sicily, Italy · Mt. Etna DOC</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF4500" filter="url(#g)">🌋</text><rect x="20" y="130" width="500" height="2" fill="#FF4500"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF4500">埃特纳火山葡萄酒</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">西西里 · 火山风土 · 全球最热门产区</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"从火焰中诞生的优雅"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">火山熔岩之上生长的顶级佳酿</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF4500" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','etna_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B0000;margin:0 0 8px 0;font-size:16px}h3{color:#8B0000;border-bottom:2px solid #FF4500;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B0000;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B0000;">🌋 ${date.chinese} 埃特纳火山葡萄酒完全指南</h2>
<p style="text-align:center;color:#666;">西西里 · 火山风土 · 马斯卡斯奈莱洛 · 全球追捧</p>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a0a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">埃特纳（Etna）是近年来<strong style="color:#FF4500">全球最受瞩目的葡萄酒产区之一</strong>。这片位于欧洲最高活火山——埃特纳火山山坡上的葡萄园，以其独特的火山风土、古老的葡萄藤和优雅脱俗的葡萄酒风格，征服了世界各地的葡萄酒爱好者。<strong style="color:#FF4500">这里的葡萄酒拥有无与伦比的矿物感和火山能量</strong>。</p>
</section>
<h3>🌋 一、火山风土</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>火山土壤</h4><p style="color:#333;line-height:1.8;margin:0">埃特纳的葡萄园生长在历经千年火山喷发形成的<strong>黑色火山岩、火山灰和浮石</strong>之上。这种土壤排水性极佳，富含矿物质（特别是钾和铁），赋予葡萄酒独特的烟熏矿物感和优雅的酸度。葡萄藤必须深深扎根以寻找水分，这造就了葡萄酒的复杂度和集中度。</p></div>
<div class="region-item"><h4>海拔与气候</h4><p style="color:#333;line-height:1.8;margin:0">葡萄园海拔在400-1000米之间，是欧洲最高的葡萄园之一。高海拔带来巨大的昼夜温差（可达20°C），加上地中海海风的影响，使得葡萄在保持酸度的同时缓慢成熟，发展出极其细腻的风味。</p></div>
</section>
<h3>🍇 二、主要葡萄品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>马斯卡斯奈莱洛（Nerello Mascalese）</h4><p style="color:#333;line-height:1.8;margin:0">埃特纳的<strong>旗舰红葡萄品种</strong>，常被称为"火山上的内比奥罗"。酒体中等，单宁细腻，酸度明亮，带有红樱桃、覆盆子、干花、烟熏和矿物的复杂香气。优质陈年后可发展出松露、皮革和焦油的风味。代表酒款：Benanti、Passopisciaro、Giuseppe Mascarello。</p></div>
<div class="region-item"><h4>内雷洛·卡普奇奥（Nerello Cappuccio）</h4><p style="color:#333;line-height:1.8;margin:0">通常与马斯卡斯奈莱洛混酿，占比较小。它为葡萄酒增添更多的色泽、酒体和柔和的单宁，使口感更加圆润。</p></div>
<div class="region-item"><h4>卡里坎特（Carricante）</h4><p style="color:#333;line-height:1.8;margin:0">埃特纳的<strong>旗舰白葡萄品种</strong>，酿造出意大利最卓越的白葡萄酒之一。带有柠檬皮、海盐、草本和燧石的香气，酸度极高，拥有惊人的陈年潜力。优质版本在瓶中陈年后会发展出蜂蜜和蜜蜡的香气。</p></div>
</section>
<h3>🏆 三、DOC与产区等级</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<table>
<tr><th>等级</th><th>要求</th><th>风格特点</th></tr>
<tr><td>Etna DOC</td><td>基本等级，红/白/桃红</td><td>新鲜易饮，展现火山风土</td></tr>
<tr><td>Etna Rosso DOC</td><td>至少80% Nerello Mascalese</td><td>优雅红果，矿物感</td></tr>
<tr><td>Etna Bianco DOC</td><td>至少60% Carricante</td><td>清爽矿物，柠檬柑橘</td></tr>
<tr><td>Etna Rosso Riserva</td><td>至少陈酿4年</td><td>复杂多层，陈年潜力</td></tr>
<tr><td>Etna Bianco Superiore</td><td>来自Milo村，至少1年陈酿</td><td>顶级白葡萄酒，集中浓郁</td></tr>
</table>
<div class="region-item" style="margin-top:12px"><h4>著名子产区（Contrade）</h4><p style="color:#333;line-height:1.8;margin:0">埃特纳的单一园被称为"Contrada"，类似于勃艮第的"Climats"：<br/><strong>• Guardiola：</strong>海拔最高(1000m)，最新鲜优雅<br/><strong>• Monte Serra：</strong>以Nerello Mascalese闻名<br/><strong>• Santo Spirito：</strong>经典产区，结构平衡<br/><strong>• Arcurìa：</strong>老藤集中，酒体饱满</p></div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>Etna Rosso 品鉴</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>宝石红，边缘渐变为石榴红<br/><strong>香气：</strong>红樱桃、覆盆子、紫罗兰、干玫瑰花瓣、烟熏、火山岩、草本<br/><strong>口感：</strong>中等酒体，高酸度，细腻单宁，纯净果味，矿物感贯穿始终<br/><strong>陈年潜力：</strong>优质酒款可陈年10-20年</p></div>
<div class="region-item"><h4>Etna Bianco 品鉴</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>淡稻草黄，略带绿色光泽<br/><strong>香气：</strong>柠檬皮、青苹果、白花、海盐、燧石、草药<br/><strong>口感：</strong>酒体轻盈至中等，高酸度，矿物感强烈，余味带有咸鲜感<br/><strong>陈年潜力：</strong>优质Carricante可陈年5-15年</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>Etna Rosso 搭配</h4><p style="color:#333;line-height:1.8;margin:0">• 西西里烤剑鱼（搭配番茄和橄榄）<br/>• 烤羊肉配迷迭香<br/>• 意式炖小牛膝（Ossobuco）<br/>• 陈年佩科里诺奶酪<br/>• 野生蘑菇烩饭</p></div>
<div class="region-item"><h4>Etna Bianco 搭配</h4><p style="color:#333;line-height:1.8;margin:0">• 西西里炸海鲜<br/>• 生鱼片和寿司<br/>• 柠檬腌制的剑鱼生鱼片<br/>• 新鲜马苏里拉配番茄<br/>• 蔬菜沙拉配柑橘酱汁</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a0a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">埃特纳火山葡萄酒是当下意大利最令人兴奋的葡萄酒之一。<strong style="color:#FF4500">每一瓶埃特纳葡萄酒都蕴含着火山的力量、阳光的温度和地中海的微风</strong>。如果你还没有尝试过来自埃特纳的葡萄酒，现在就是最好的时机。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌋 生成埃特纳火山葡萄酒完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌋 ${date.chinese} 埃特纳火山葡萄酒完全指南`,author:'红酒顾问',digest:'埃特纳是当下全球最热门的葡萄酒产区之一，火山土壤赋予葡萄酒独特的矿物感与优雅气质。',content:generateContent(),coverImage:'etna_cover_ai.png',category:'wine-knowledge',tags:['埃特纳','西西里','火山葡萄酒','意大利葡萄酒','Etna'],publishDate:date.full};
    const op = path.join(__dirname,'output',`etna_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
