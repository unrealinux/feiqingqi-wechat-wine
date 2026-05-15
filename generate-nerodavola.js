/**
 * 黑达沃拉葡萄酒完全指南（西西里）
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="40%" style="stop-color:#3a1a0a"/><stop offset="100%" style="stop-color:#0a1a2e"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B0000"/><stop offset="100%" style="stop-color:#FF4500"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(255,69,0,0.15)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF4500" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sicily, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF6347" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#FF4500"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF6347">黑达沃拉</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利西西里 · 黑达沃拉葡萄 · 地中海风情</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"西西里最具代表性的红葡萄"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">阳光、海洋与火山的完美结晶</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF4500" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','nerodavola_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>
  .region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}
  .region-item h4{color:#FF4500;margin:0 0 8px 0;font-size:16px}
  h3{color:#FF4500;border-bottom:2px solid #FF6347;padding-bottom:8px;margin-top:25px}
  table{width:100%;border-collapse:collapse;margin:10px 0}
  table th{background:#FF4500;color:#fff;padding:10px;text-align:left}
  table td{padding:10px;border-bottom:1px solid #ddd}
</style>
<h2 style="text-align:center;color:#FF4500;">🍷 ${date.chinese} 黑达沃拉完全指南：西西里的太阳之酒</h2>
<p style="text-align:center;color:#666;">西西里 · 黑达沃拉 · 地中海风情 · 阳光之味</p>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a0a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">黑达沃拉（Nero d'Avola）是<strong style="color:#FF6347">意大利西西里岛最具代表性的红葡萄品种</strong>，以出产浓郁、果味丰富的红葡萄酒而闻名。这款来自地中海最大岛屿的葡萄酒，就像西西里的阳光一样热情奔放。黑色浆果的香气中夹杂着地中海草本和矿物的气息，让人仿佛置身于埃特纳火山脚下的葡萄园中。本文将带你全面探索<strong style="color:#FF6347">黑达沃拉的魅力世界</strong>。</p>
</section>

<h3>🍇 一、认识黑达沃拉葡萄</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>起源：</strong>得名于西西里岛南部的阿沃拉（Avola）小镇，已有数百年种植历史<br/>• <strong>果皮：</strong>厚实富含色素，酿造出的葡萄酒颜色深邃浓郁<br/>• <strong>单宁：</strong>中等偏高，结构完整<br/>• <strong>适应力：</strong>耐热耐旱，完美适应地中海气候<br/>• <strong>种植面积：</strong>西西里种植最广泛的红葡萄品种，占全岛红葡萄种植的60%以上</p></div>
</section>

<h3>🏛️ 二、主要子产区与风格</h3>
<section style="background:#FFE4E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>西西里东南部（拉古萨、锡拉库萨）</h4><p style="color:#333;line-height:1.8;margin:0">温暖干燥的气候和石灰质土壤出产果味成熟、酒体饱满、单宁丰富的黑达沃拉。风格浓郁强劲，常带有黑莓、李子和可可的香气。</p></div>
<div class="region-item"><h4>埃特纳产区（Etna DOC）</h4><p style="color:#333;line-height:1.8;margin:0">火山土壤带来了独特的矿物感和优雅风格。海拔较高，昼夜温差大，葡萄酒酸度更清新，香气更加复杂精细。</p></div>
<div class="region-item"><h4>西西里中部</h4><p style="color:#333;line-height:1.8;margin:0">丘陵地带种植的黑达沃拉风格介于东南部和埃特纳之间，平衡了果味和结构，性价比极高。</p></div>
<div class="region-item"><h4>西西里 DOC 等级</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Sicilia DOC：</strong>覆盖全岛的法定产区<br/>• <strong>Etna DOC：</strong>火山风土特色产区<br/>• <strong>Cerasuolo di Vittoria DOCG：</strong>唯一DOCG，黑达沃拉与弗拉帕托混酿</p></div>
</section>

<h3>🍷 三、酿造风格多样性</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>年轻风格</h4><p style="color:#333;line-height:1.8;margin:0">不锈钢桶陈酿，不经橡木桶。突出新鲜的黑樱桃、黑莓和紫罗兰香气，果味纯净，适合日常饮用。</p></div>
<div class="region-item"><h4>橡木桶陈酿风格</h4><p style="color:#333;line-height:1.8;margin:0">在法国或美国橡木桶中陈酿6-12个月。发展出香草、可可、烟草和咖啡的香气，口感更圆润复杂。</p></div>
<div class="region-item"><h4>混酿风格</h4><p style="color:#333;line-height:1.8;margin:0">与国际品种赤霞珠、梅洛、西拉混酿，增加酒体的结构和层次感。许多现代西西里酒庄都在探索这种风格。</p></div>
</section>

<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>视觉</h4><p style="color:#333;line-height:1.8;margin:0">深宝石红到石榴红，色泽浓郁，边缘常有紫色调，透明度较低，反映出丰富的色素含量。</p></div>
<div class="region-item"><h4>嗅觉</h4><p style="color:#333;line-height:1.8;margin:0">浓郁的黑莓、黑樱桃和李子果香扑面而来，伴随着紫罗兰、地中海香草（迷迭香、百里香）和甘草的复杂气息。陈年后发展出皮革、烟草和巧克力的香气。</p></div>
<div class="region-item"><h4>味觉</h4><p style="color:#333;line-height:1.8;margin:0">入口酒体饱满，果味浓郁集中。单宁丰富但不粗糙，酸度适中，余味悠长，带有一丝矿物感和地中海特有的咸鲜味。</p></div>
</section>

<h3>🍽️ 五、配餐指南</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table>
<tr><th>菜品类别</th><th>推荐搭配</th><th>搭配原理</th></tr>
<tr><td>西西里面食</td><td>番茄沙丁鱼面、墨鱼汁面</td><td>果香衬托海鲜的鲜甜</td></tr>
<tr><td>烤肉</td><td>烤羊肉排、烤猪肋排</td><td>单宁分解肉类的油脂</td></tr>
<tr><td>意式香肠</td><td>西西里辣香肠、萨拉米</td><td>辛辣与果香的碰撞</td></tr>
<tr><td>野味</td><td>烤兔肉、炖野猪肉</td><td>浓郁风味互相增强</td></tr>
<tr><td>中式菜肴</td><td>红烧牛肉、烤鸭、京酱肉丝</td><td>甜咸风味与果香融合</td></tr>
</table>
</section>

<h3>💰 六、知名酒庄与价格</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>Planeta - 普拉内塔</h4><p style="color:#333;line-height:1.8;margin:0">西西里的先锋酒庄，在多个产区拥有葡萄园。他们的黑达沃拉展现了不同风土的多样性。</p></div>
<div class="region-item"><h4>Feudo Maccari - 费乌多·马卡里</h4><p style="color:#333;line-height:1.8;margin:0">来自西西里东南部的精品酒庄，出产浓郁风格的黑达沃拉，屡获高分评价。</p></div>
<div class="region-item"><h4>Donnafugata - 多娜佳塔</h4><p style="color:#333;line-height:1.8;margin:0">西西里最具代表性的酒庄之一，以艺术酒标和高品质葡萄酒闻名。</p></div>
<div class="region-item"><h4>Cusumano - 库苏马诺</h4><p style="color:#333;line-height:1.8;margin:0">性价比极高的选择，入门级黑达沃拉果香出色，价格亲民（80-150元）。</p></div>
</section>

<h3>🌍 七、黑达沃拉的国际地位</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#333;line-height:1.8">近年来，黑达沃拉在国际葡萄酒市场上迅速崛起，其被公认为可以与澳洲西拉和阿根廷马尔贝克媲美的"新经典"红葡萄品种：</p>
<p style="color:#333;line-height:1.8">• <strong>国际评分：</strong>顶级黑达沃拉获得James Suckling、Wine Spectator等权威媒体90+高分<br/>• <strong>出口增长：</strong>对美国和亚洲市场的出口量年增长超过15%<br/>• <strong>性价比：</strong>相比巴罗洛、布鲁奈罗等意大利名酒，黑达沃拉仅需1/3的价格即可获得同样出色的品质</p>
</section>

<section style="background:linear-gradient(135deg,#1a0a00,#3a1a0a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">黑达沃拉就像西西里的阳光，<strong style="color:#FF6347">热情、直接、充满生命力</strong>。它不需要复杂的醒酒和漫长的等待，打开即饮，每一口都是地中海的馈赠。无论搭配美食还是独自品鉴，这款来自西西里的美酒都不会让你失望。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成黑达沃拉完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 黑达沃拉完全指南：西西里的太阳之酒`,author:'红酒顾问',digest:'黑达沃拉是西西里最具代表性的红葡萄品种。本文全面探索品种特性、子产区风格、酿造多样性、品鉴要点及美食搭配。',content:generateContent(),coverImage:'nerodavola_cover_ai.png',category:'wine-knowledge',tags:['黑达沃拉','西西里','意大利葡萄酒','地中海葡萄酒','Nero d\'Avola'],publishDate:date.full};
    const op = path.join(__dirname,'output',`nerodavola_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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