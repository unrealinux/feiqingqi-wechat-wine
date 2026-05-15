/**
 * 阿利亚尼科葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="50%" style="stop-color:#3a1a00"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#D2691E"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(210,105,30,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#D2691E" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Campania, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#D2691E" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#D2691E"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#D2691E">阿利亚尼科</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利南部 · 坎帕尼亚 · 古老品种</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利南部的巴罗洛"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">古希腊人留下的葡萄酒遗产</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D2691E" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','aglianico_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B4513;margin:0 0 8px 0;font-size:16px}h3{color:#8B4513;border-bottom:2px solid #D2691E;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B4513;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B4513;">🍷 ${date.chinese} 阿利亚尼科完全指南：南方雄狮</h2>
<p style="text-align:center;color:#666;">坎帕尼亚 · 巴西利卡塔 · 古老品种 · 浓郁深邃</p>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">阿利亚尼科（Aglianico）是<strong style="color:#D2691E">意大利南部最伟大的红葡萄品种</strong>，被誉为"意大利南部的巴罗洛"。这款由古希腊人传入意大利的古老品种，在坎帕尼亚和巴西利卡塔的火山土壤中展现出惊人的深度和力量。如果说巴罗洛代表了意大利北部的优雅，阿利亚尼科则是南部热情与力量的化身。本文将带你探索<strong style="color:#D2691E">这头"南方雄狮"</strong>。</p>
</section>
<h3>🍇 一、古老起源</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>希腊遗产</h4><p style="color:#333;line-height:1.8;margin:0">阿利亚尼科的名称来源于古希腊语的"Ellenico"（意为希腊的）。公元前7世纪，希腊殖民者将这种葡萄带到意大利南部。数千年来，它一直在这片充满阳光和火山的土地上生长，成为意大利最古老的本土葡萄品种之一。</p></div>
<div class="region-item"><h4>品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>果皮：</strong>厚实，富含单宁和色素<br/>• <strong>成熟期：</strong>晚熟，需要充足的阳光才能完全成熟<br/>• <strong>酸度：</strong>天然高酸度<br/>• <strong>单宁：</strong>强劲但优质<br/>• <strong>陈年潜力：</strong>10-20年以上</p></div>
</section>
<h3>🏛️ 二、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Taurasi DOCG - 陶拉西</h4><p style="color:#333;line-height:1.8;margin:0">坎帕尼亚大区的顶级产区，被称为"南方的巴罗洛"。位于海拔400-600米的丘陵地带，土壤富含石灰岩和火山岩。法规要求陈酿至少3年（珍藏4年）。酿造出力量和优雅兼具的葡萄酒。</p></div>
<div class="region-item"><h4>Aglianico del Vulture DOCG</h4><p style="color:#333;line-height:1.8;margin:0">巴西利卡塔大区的火山产区，葡萄园种植在休眠的武尔图雷火山山坡上。火山土壤赋予葡萄酒独特的矿物感和烟熏气息。</p></div>
<div class="region-item"><h4>Irpinia DOC</h4><p style="color:#333;line-height:1.8;margin:0">Taurasi所在的大区DOC，出产风格更亲民的阿利亚尼科，果味更新鲜，陈年时间更短。</p></div>
</section>
<h3>🍷 三、品鉴要点</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>典型特征</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>颜色：</strong>深宝石红色到石榴红，色泽浓郁<br/>• <strong>香气：</strong>黑莓、黑樱桃、黑李子、紫罗兰、巧克力、烟草、皮革<br/>• <strong>口感：</strong>酒体饱满，单宁强劲但细腻，酸度明亮<br/>• <strong>陈年：</strong>年轻时单宁紧涩，需要5-10年柔化，陈年后发展出松露、菌菇的迷人香气<br/>• <strong>优质年份：</strong>2015、2012、2010、2006</p></div>
</section>
<h3>🍽️ 四、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>南部烤肉：</strong>烤羊肉、烤野猪肉、炭烤香肠<br/>• <strong>意大利炖菜：</strong>那不勒斯炖牛尾、意式炖肉<br/>• <strong>陈年奶酪：</strong>陈年帕尔马干酪、佩科里诺<br/>• <strong>野味：</strong>烤鹿肉、红酒炖兔肉</p>
</section>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">阿利亚尼科是意大利南部葡萄酒的骄傲。它证明了意大利的顶级葡萄酒不仅来自皮埃蒙特和托斯卡纳，<strong style="color:#D2691E">南部的火山土壤也能孕育出世界级的佳酿</strong>。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成阿利亚尼科完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 阿利亚尼科完全指南：南方雄狮`,author:'红酒顾问',digest:'阿利亚尼科被誉为"意大利南部的巴罗洛"，由古希腊人传入意大利。本文详解古老起源、两大DOCG核心产区及品鉴要点。',content:generateContent(),coverImage:'aglianico_cover_ai.png',category:'wine-knowledge',tags:['阿利亚尼科','坎帕尼亚','意大利葡萄酒','Aglianico','Taurasi'],publishDate:date.full};
    const op = path.join(__dirname,'output',`aglianico_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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