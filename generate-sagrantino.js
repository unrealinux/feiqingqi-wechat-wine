/**
 * 蒙特法科萨格兰蒂诺完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a2a"/><stop offset="50%" style="stop-color:#1a1a4a"/><stop offset="100%" style="stop-color:#0a001a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#191970"/><stop offset="100%" style="stop-color:#4169E1"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="120" r="160" fill="rgba(65,105,225,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#4169E1" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Umbria, Italy · Montefalco DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#4169E1" filter="url(#g)">🏛️</text><rect x="20" y="130" width="500" height="2" fill="#4169E1"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#4169E1">萨格兰蒂诺</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">翁布里亚 · 单宁之王 · 意大利最强劲的红酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"一杯让你记一辈子的葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">意大利单宁最丰富的红葡萄品种</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#4169E1" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','sagrantino_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#191970;margin:0 0 8px 0;font-size:16px}h3{color:#191970;border-bottom:2px solid #4169E1;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#191970;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#191970;">🏛️ ${date.chinese} 萨格兰蒂诺完全指南</h2>
<p style="text-align:center;color:#666;">翁布里亚 · 蒙特法科 · 单宁之王 · 意大利之最</p>
<section style="background:linear-gradient(135deg,#0a0a2a,#1a1a4a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">萨格兰蒂诺（Sagrantino）是<strong style="color:#4169E1">意大利单宁最丰富、颜色最深邃的红葡萄品种</strong>，生长在翁布里亚大区的蒙特法科（Montefalco）地区。它所酿造的酒拥有难以置信的厚重感、强大的陈年潜力和独特的苦甜交织风味，被誉为<strong style="color:#4169E1">"意大利的隐藏宝石"</strong>。</p>
</section>
<h3>🏛️ 一、历史与传奇</h3>
<section style="background:#F0F0FF;padding:18px;border-radius:8px">
<div class="region-item"><h4>古老起源</h4><p style="color:#333;line-height:1.8;margin:0">萨格兰蒂诺的历史可追溯到中世纪，最初由方济各会修士种植。葡萄名称"Sagrantino"可能与拉丁语"sacer"（神圣）有关，暗示它最初用于宗教仪式。蒙特法科——意为"鹰的山丘"——是翁布里亚的葡萄酒中心，以其中世纪山城和壮丽景色闻名。</p></div>
<div class="region-item"><h4>从濒危到复兴</h4><p style="color:#333;line-height:1.8;margin:0">20世纪中叶，萨格兰蒂诺几乎濒临灭绝。直到1970年代，几位富有远见的酒农开始重新种植这个品种。1992年获得DOCG地位，从此开启复兴之路。如今已成为意大利最具特色的精品葡萄酒之一。</p></div>
</section>
<h3>🍇 二、葡萄与酿制</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>萨格兰蒂诺品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>单宁含量：</strong>意大利所有品种中最高，是赤霞珠的2-3倍<br/>• <strong>花青素：</strong>极高，颜色近乎墨黑<br/>• <strong>产量：</strong>极低，每公顷仅4-5吨<br/>• <strong>成熟期：</strong>晚熟，通常在10月下旬采收</p></div>
<div class="region-item"><h4>酿造工艺</h4><p style="color:#333;line-height:1.8;margin:0">由于单宁极高，需要精心处理：<br/>• <strong>浸渍：</strong>20-30天长时间浸渍以提取风味物质<br/>• <strong>陈酿：</strong>至少在橡木桶中陈酿24-36个月<br/>• <strong>瓶中陈年：</strong>上市前额外瓶中陈年至少6-12个月<br/>• <strong>总陈年：</strong>DOCG要求至少37个月（从采收算起）</p></div>
</section>
<h3>🏆 三、DOCG等级与酒款</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<table>
<tr><th>酒款</th><th>要求</th><th>风格</th></tr>
<tr><td>Montefalco Rosso DOC</td><td>60-70%桑娇维塞，10-15%萨格兰蒂诺，其余为梅洛等</td><td>日常饮用，果味丰富，单宁适中</td></tr>
<tr><td>Montefalco Sagrantino DOCG</td><td>100%萨格兰蒂诺</td><td>浓郁强劲，单宁充沛，陈年潜力15-20年</td></tr>
<tr><td>Sagrantino Passito DOCG</td><td>风干葡萄酿造，100%萨格兰蒂诺</td><td>甜型，浓缩，蜜饯和巧克力风味</td></tr>
<tr><td>Sagrantino Riserva</td><td>至少陈酿4年</td><td>更加复杂柔和，陈年潜力30年+</td></tr>
</table>
</section>
<h3>👃 四、品鉴与陈年</h3>
<section style="background:#FFE4E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>年轻萨格兰蒂诺（3-7年）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>深紫红色，几乎不透明<br/><strong>香气：</strong>黑莓、黑樱桃、李子、紫罗兰、黑胡椒、甘草<br/><strong>口感：</strong>单宁极其强劲（需醒酒2-3小时），酸度中等，酒体饱满<br/></p></div>
<div class="region-item"><h4>陈年萨格兰蒂诺（10年+）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>石榴红，边缘渐变为砖红色<br/><strong>香气：</strong>熟透的黑果、松露、皮革、雪茄盒、焦油、干花<br/><strong>口感：</strong>单宁变得丝滑，层次复杂，余味极其持久（超过60秒）</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>最佳搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>烤野猪/野味：</strong>翁布里亚传统菜肴，完美搭配<br/>• <strong>黑松露意面：</strong>翁布里亚以黑松露闻名，是绝配<br/>• <strong>烤羊肉：</strong>特别是香草腌制的烤羊腿<br/>• <strong>陈年奶酪：</strong>佩科里诺、帕玛森36个月+<br/>• <strong>黑巧克力：</strong>85%以上可可的巧克力</p></div>
<div class="region-item"><h4>警告：避免搭配</h4><p style="color:#333;line-height:1.8;margin:0">萨格兰蒂诺的单宁会与鱼类的鲜味产生金属味。同样，清淡的蔬菜和不含油脂的菜肴也不适合搭配这款浓烈的葡萄酒。</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a0a2a,#1a1a4a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">萨格兰蒂诺是意大利葡萄酒王国中不可忽视的力量。<strong style="color:#4169E1">它是翁布里亚的骄傲，是传统与创新的完美结合</strong>。如果你是一位寻求极致体验的葡萄酒爱好者，萨格兰蒂诺绝对值得你深入了解。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏛️ 生成萨格兰蒂诺完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏛️ ${date.chinese} 萨格兰蒂诺完全指南：意大利单宁之王`,author:'红酒顾问',digest:'萨格兰蒂诺是意大利单宁最丰富的红葡萄品种，来自翁布里亚的蒙特法科。品味这款隐藏宝石的独特魅力。',content:generateContent(),coverImage:'sagrantino_cover_ai.png',category:'wine-knowledge',tags:['萨格兰蒂诺','翁布里亚','意大利葡萄酒','蒙特法科','Sagrantino'],publishDate:date.full};
    const op = path.join(__dirname,'output',`sagrantino_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
