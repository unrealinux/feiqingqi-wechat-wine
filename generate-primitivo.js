/**
 * 普里米蒂沃葡萄酒完全指南（普利亚）
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2d0a1a"/><stop offset="50%" style="stop-color:#4a1a2a"/><stop offset="100%" style="stop-color:#1a0a2e"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#4B0082"/><stop offset="100%" style="stop-color:#DC143C"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(220,20,60,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DC143C" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Puglia, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF69B4" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#DC143C"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF69B4">普里米蒂沃</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利普利亚 · 普里米蒂沃 · 阳光之酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"仙粉黛的意大利双胞胎"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">意大利靴跟上的明珠</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DC143C" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','primitivo_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>
  .region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}
  .region-item h4{color:#DC143C;margin:0 0 8px 0;font-size:16px}
  h3{color:#DC143C;border-bottom:2px solid #FF69B4;padding-bottom:8px;margin-top:25px}
  table{width:100%;border-collapse:collapse;margin:10px 0}
  table th{background:#DC143C;color:#fff;padding:10px;text-align:left}
  table td{padding:10px;border-bottom:1px solid #ddd;color:#333}
</style>
<h2 style="text-align:center;color:#DC143C;">🍷 ${date.chinese} 普里米蒂沃完全指南：意大利靴跟上的明珠</h2>
<p style="text-align:center;color:#666;">普利亚 · 普里米蒂沃 · 阳光之味 · 热情奔放</p>
<section style="background:linear-gradient(135deg,#2d0a1a,#4a1a2a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">普里米蒂沃（Primitivo）是<strong style="color:#FF69B4">意大利普利亚大区（Puglia）</strong>最引以为傲的红葡萄品种。你可能更熟悉它的美国名字"仙粉黛（Zinfandel）"——没错，它们其实是同一个葡萄品种！在意大利靴跟形状的普利亚半岛上，普里米蒂沃沐浴着地中海的阳光，酿造出酒体饱满、果味浓郁、热情奔放的红葡萄酒。本文将带你全方位领略<strong style="color:#FF69B4">普里米蒂沃的魅力</strong>。</p>
</section>

<h3>🍇 一、普里米蒂沃与仙粉黛的秘密</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>跨越大陆的DNA联系</h4><p style="color:#333;line-height:1.8;margin:0">经过DNA鉴定，普里米蒂沃与美国加州的仙粉黛（Zinfandel）是同一个葡萄品种。它最早起源于克罗地亚，后传入意大利普利亚，再经移民带到美国。今天的加州仙粉黛就是以19世纪从意大利进口的普里米蒂沃葡萄发展而来。</p></div>
<div class="region-item"><h4>风格差异</h4><p style="color:#333;line-height:1.8;margin:0"><strong>意大利普里米蒂沃：</strong>更注重结构感，单宁更明显，酸度更清爽，常有矿物的咸鲜味<br/><strong>加州仙粉黛：</strong>果味更浓郁成熟，酒精度更高，风格更奔放</p></div>
</section>

<h3>🏛️ 二、核心产区</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>Primitivo di Manduria DOCG</h4><p style="color:#333;line-height:1.8;margin:0">普里米蒂沃的最高级别产区。位于塔兰托省（Taranto），土壤富含铁元素的红色黏土和石灰岩。这里出产的葡萄酒颜色深邃，酒体饱满，单宁丰富，陈年潜力强。</p></div>
<div class="region-item"><h4>Gioia del Colle DOC</h4><p style="color:#333;line-height:1.8;margin:0">海拔较高（300-500米），昼夜温差大，葡萄成熟更缓慢。出产的普里米蒂沃更加优雅精致，酸度更高，花香更明显。</p></div>
<div class="region-item"><h4>Salento IGT</h4><p style="color:#333;line-height:1.8;margin:0">最基础和广阔的产区，覆盖整个萨伦托半岛。这里炎热干燥，葡萄成熟度高，出产果味浓郁、性价比极高的普里米蒂沃。</p></div>
</section>

<h3>🍷 三、酿造风格</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>年轻风格（Primitivo）</h4><p style="color:#333;line-height:1.8;margin:0">不锈钢桶或水泥罐陈酿，不经橡木桶。突出新鲜的黑莓、黑樱桃和李子的果香，口感活泼，适合日常饮用，价格通常在80-150元。</p></div>
<div class="region-item"><h4>橡木桶陈酿</h4><p style="color:#333;line-height:1.8;margin:0">在法国或美国橡木桶中陈酿6-12个月。发展出香草、巧克力、烟草和咖啡的香气，单宁更加圆润。价格在150-300元。</p></div>
<div class="region-item"><h4>珍藏级（Riserva）</h4><p style="color:#333;line-height:1.8;margin:0">Manduria DOCG的珍藏级要求至少陈酿2年。这些酒更具结构和深度，陈年潜力可达10-15年。价格在300-800元。</p></div>
</section>

<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>视觉</h4><p style="color:#333;line-height:1.8;margin:0">深宝石红到石榴红，色泽浓郁不透明，年轻的酒边缘常带有紫色调。</p></div>
<div class="region-item"><h4>嗅觉</h4><p style="color:#333;line-height:1.8;margin:0">浓郁的黑莓、黑樱桃、李子果香，伴随着紫罗兰、甘草和地中海香草的气息。陈年后发展出皮革、烟草、巧克力和甜香料的风味。</p></div>
<div class="region-item"><h4>味觉</h4><p style="color:#333;line-height:1.8;margin:0">入口甜美饱满（甜美的果味，并非甜酒），酒精度较高（通常14-15%），单宁丰富但柔顺。酸度适中，余味悠长，带有一丝独特的苦甜感。</p></div>
<div class="region-item"><h4>最佳饮用温度</h4><p style="color:#333;line-height:1.8;margin:0">16-18°C。年轻酒款开瓶即可享用，陈年酒款建议醒酒30-60分钟。</p></div>
</section>

<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table>
<tr><th>菜品</th><th>推荐</th><th>说明</th></tr>
<tr><td>烤肉</td><td>烤猪排、BBQ烤肉、烤香肠</td><td>果味与烟熏味完美融合</td></tr>
<tr><td>意大利面</td><td>番茄肉酱面、辣味番茄面</td><td>酸度匹配番茄酱汁</td></tr>
<tr><td>披萨</td><td>辣味香肠披萨、四季披萨</td><td>最平民的葡萄酒披萨搭配</td></tr>
<tr><td>奶酪</td><td>陈年帕尔马干酪、米莫莱特</td><td>咸香与果味的碰撞</td></tr>
<tr><td>中式菜肴</td><td>红烧肉、糖醋排骨、烤鸭</td><td>甜感与中式酱汁相得益彰</td></tr>
</table>
</section>

<h3>💰 六、知名酒庄推荐</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>Produttori di Manduria</h4><p style="color:#333;line-height:1.8;margin:0">Manduria产区的合作社，集合了数百个农户的葡萄园，出产的普里米蒂沃品质稳定，性价比极高。</p></div>
<div class="region-item"><h4>Gianfranco Fino - 吉安弗兰科·菲诺</h4><p style="color:#333;line-height:1.8;margin:0">普利亚的"膜拜酒"生产者，其Es酒款多次获得《葡萄酒观察家》90+高分，被誉为"意大利最伟大的普里米蒂沃"。</p></div>
<div class="region-item"><h4>A Mano - 阿马诺</h4><p style="color:#333;line-height:1.8;margin:0">美意合资的精品酒庄，他们普里米蒂沃多次入选《葡萄酒观察家》百大葡萄酒榜单。</p></div>
<div class="region-item"><h4>Feudi di San Marzano</h4><p style="color:#333;line-height:1.8;margin:0">入门级普里米蒂沃的标杆，价格亲民（60-120元），果香出色，是探索普里米蒂沃的绝佳起点。</p></div>
</section>

<h3>🌞 七、普里米蒂沃年份推荐</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">普利亚地区的气候较为稳定，每年都能出产优质普里米蒂沃。以下是一些推荐年份：</p>
<table>
<tr><th>年份</th><th>评分</th><th>特点</th></tr>
<tr><td>2021</td><td>★★★★★</td><td>接近完美的一年，成熟度与酸度平衡极佳</td></tr>
<tr><td>2020</td><td>★★★★</td><td>温暖干燥，果味成熟集中</td></tr>
<tr><td>2019</td><td>★★★★★</td><td>经典年份，结构出色，陈年潜力最强</td></tr>
<tr><td>2018</td><td>★★★★</td><td>凉爽年份，风格优雅，酸度明亮</td></tr>
<tr><td>2017</td><td>★★★★</td><td>炎热年份，酒精度高，果味浓郁</td></tr>
</table>
</section>

<section style="background:linear-gradient(135deg,#2d0a1a,#4a1a2a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">普里米蒂沃就像普利亚的阳光，<strong style="color:#FF69B4">热情、浓郁、令人难忘</strong>。它不需要高深的知识就能欣赏，开瓶即是享受。从入门到进阶，从日常佐餐到特殊场合，普里米蒂沃都能完美胜任。这就是意大利靴跟之上的明珠，这就是普里米蒂沃。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成普里米蒂沃完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 普里米蒂沃完全指南：意大利靴跟上的明珠`,author:'红酒顾问',digest:'普里米蒂沃是意大利普利亚大区最引以为傲的红葡萄品种，也是加州仙粉黛的孪生兄弟。本文详解品种起源、核心产区、酿造风格及美食搭配。',content:generateContent(),coverImage:'primitivo_cover_ai.png',category:'wine-knowledge',tags:['普里米蒂沃','普利亚','意大利葡萄酒','仙粉黛','Primitivo','Zinfandel'],publishDate:date.full};
    const op = path.join(__dirname,'output',`primitivo_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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