process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a001a"/><stop offset="50%" style="stop-color:#1a0a3a"/><stop offset="100%" style="stop-color:#0a0010"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#4A148C"/><stop offset="100%" style="stop-color:#7B1FA2"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(123,31,162,0.07)"/><path d="M620 200 Q680 160 740 200 Q750 300 700 360 Q650 300 620 200" fill="url(#og)" stroke="#7B1FA2" stroke-width="1.5" opacity="0.35"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">香料炸弹 · 北隆河的国王 · 澳洲的国民品种</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#7B1FA2" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#7B1FA2"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#7B1FA2">西拉完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Syrah / Shiraz 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"一个品种，两个名字，两种截然不同的灵魂"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">北隆河 · 澳洲 · 罗蒂丘 · 配餐 · 选酒</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#7B1FA2" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','syrah_shiraz_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#4A148C;margin:0 0 8px 0;font-size:16px}h3{color:#4A148C;border-bottom:2px solid #7B1FA2;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#4A148C;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#4A148C;">🍇 西拉完全手册 Syrah / Shiraz</h2>
<p style="text-align:center;color:#666;">一个品种，两个名字，三种风格——从北隆河的优雅到澳洲的狂野</p>
<section style="background:linear-gradient(135deg,#0a001a,#1a0a3a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#E1BEE7;font-size:16px;line-height:1.9">在世界葡萄酒版图上，西拉是唯一一个<strong style="color:#7B1FA2">用两个名字称呼同一个品种</strong>的葡萄——在法国、新西兰、美国它叫Syrah，在澳大利亚、南非它叫Shiraz。这不是发音差异，而是<strong style="color:#7B1FA2">两种截然不同的酿酒哲学</strong>。</p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#F3E5F5;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">西拉起源于法国北隆河，是冬尼（Mondeuse Blanche）和Dureza（一种几乎灭绝的古老品种）的自然杂交后代。西拉在历史上曾被认为源自波斯古城"设拉子"（Shiraz）——这后来被DNA技术证伪，但澳大利亚保留了"Shiraz"这个名字作为对传说的致敬。<br/><br/>西拉的成功在于：<strong>它既能在凉爽气候中展现优雅和胡椒味（北隆河风格），也能在炎热气候中爆发黑果和巧克力的浓厚风味（澳洲风格）</strong>。这使它成为全球种植范围最广的红葡萄之一，仅次于赤霞珠和梅洛。</p>
</section>
<h3>🌍 二、核心产区——两种灵魂</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px"><table><tr><th>风格</th><th>产区</th><th>风味特征</th><th>入门价</th></tr>
<tr><td rowspan="3"><strong style="color:#4A148C">Syrah 优雅派</strong></td><td>🇫🇷 北隆河罗蒂丘</td><td>紫罗兰 · 熏肉 · 橄榄 · 黑胡椒 · 酸度好</td><td>¥300-1000</td></tr>
<tr><td>🇫🇷 北隆河埃米塔日</td><td>更饱满 · 皮革 · 香料 · 陈年潜力强</td><td>¥400-1500</td></tr>
<tr><td>🇳🇿 霍克斯湾</td><td>胡椒 · 红果 · 优雅</td><td>¥150-350</td></tr>
<tr><td rowspan="3"><strong style="color:#7B1FA2">Shiraz 奔放派</strong></td><td>🇦🇺 巴罗萨谷</td><td>黑莓 · 巧克力 · 甘草 · 饱满高酒精</td><td>¥100-400</td></tr>
<tr><td>🇦🇺 麦克拉伦谷</td><td>果酱 · 香料 · 柔和单宁</td><td>¥100-350</td></tr>
<tr><td>🇿🇦 南非</td><td>烟熏 · 黑果 · 野味</td><td>¥80-250</td></tr></table>
</section>
<h3>👃 三、西拉的标志性风味</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<div class="ri"><h4>香料：西拉的灵魂</h4><p style="color:#333;line-height:1.8;margin:0"><strong>黑胡椒</strong>——西拉最标志性的香气。无论是冷凉还是炎热产区，黑胡椒味永远是西拉的身份证<br/><strong>紫罗兰</strong>——优雅的西拉最迷人的花香<br/><strong>熏肉/培根</strong>——北隆河顶级西拉的标志</p></div>
<div class="ri"><h4>果味特征</h4><p style="color:#333;line-height:1.8;margin:0"><strong>冷凉产区：</strong>黑樱桃、覆盆子、红果<br/><strong>炎热产区：</strong>黑莓、蓝莓、李子酱——近乎果酱般的浓缩</p></div>
<div class="ri"><h4>陈年后的风味</h4><p style="color:#333;line-height:1.8;margin:0">顶级西拉陈年10-20年后出现<strong>皮革、野味、松露、雪茄盒、麝香</strong>等第三层香气。埃米塔日的顶级西拉可以陈年30年以上。</p></div>
</section>
<h3>🍽️ 四、配餐指南</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><table><tr><th>西拉风格</th><th>食物搭配</th><th>推荐指数</th></tr>
<tr><td>北隆河优雅Syrah</td><td>烤鸭、烤羊排、野味、蘑菇烩饭</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>澳洲Shiraz</td><td>烤牛排、烧烤、烟熏肉类</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>澳洲Shiraz</td><td>中式红烧肉、卤味、酱骨架</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>优雅Syrah</td><td>北京烤鸭——完美搭配</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>任何西拉</td><td>黑巧克力和蓝纹奶酪</td><td>⭐⭐⭐⭐</td></tr></table>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥80-150）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>澳洲：</strong>Yellow Tail、McGuigan、Jacob's Creek——典型Shiraz风格<br/><strong>南非：</strong>Kumala、Two Oceans<br/><strong>智利：</strong>Montes Classic Syrah——被低估的高性价比</p></div>
<div class="ri"><h4>进阶级（¥150-400）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>澳洲：</strong>Torbreck、d'Arenberg、Penfolds Bin 28<br/><strong>新西兰：</strong>Trinity Hill、Bilancia<br/><strong>法国：</strong>北隆河Crozes-Hermitage——Syrah入门性价比之王</p></div>
<div class="ri"><h4>发烧级（¥400-1200）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>北隆河：</strong>Guigal（罗蒂丘）、Chapoutier（埃米塔日）<br/><strong>澳洲：</strong>Penfolds Grange（超预算，¥2000+）、Henschke Hill of Grace（更贵）</p></div>
</section>
<h3>💡 六、西拉冷知识</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 西拉和赤霞珠经常被用来做<strong>混酿</strong>——澳洲的GSM混酿（Grenache-Shiraz-Mourvèdre）和北隆河的经典混酿<br/>• 北隆河的罗蒂丘（Côte-Rôtie）意为"烤肉的山坡"——据说因为阳光充足，山坡上的葡萄像被烤过一样<br/>• 澳洲Penfolds Grange是全世界最著名的Shiraz——被认为是"新世界第一个收藏级葡萄酒"<br/>• 西拉在<strong>南非</strong>有着非常重要的地位——被称为"开普的赤霞珠"<br/>• DNA鉴定发现西拉和皮内洛（Pinot）家族有基因关系——难怪它和黑皮诺一样有紫罗兰香气</p></section>
<section style="background:linear-gradient(135deg,#0a001a,#1a0a3a);padding:22px;border-radius:10px;text-align:center"><p style="color:#E1BEE7;font-size:16px;line-height:1.9"><strong style="color:#7B1FA2">Syrah和Shiraz，同一个品种，两种灵魂。</strong>如果你想体验"优雅的力量"，选北隆河的Syrah；如果你想体验"狂野的热情"，选澳洲的Shiraz。它们合在一起，完整地展示了这个品种令人惊叹的可塑性。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 西拉完全手册：Syrah/Shiraz 香料炸弹的双重灵魂`,author:'红酒顾问',digest:'一个品种两个名字——从北隆河的优雅紫罗兰到澳洲的巧克力炸弹，西拉的多面魅力一次说清楚。',content:gen(),coverImage:'syrah_shiraz_cover_ai.png',category:'wine-grape',tags:['西拉','Syrah','Shiraz','北隆河','澳洲西拉','GSM混酿','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`syrah_shiraz_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 西拉, media_id:',d.data.media_id);}catch(e){console.error('❌ 西拉:',e.message);process.exit(1);}}
main();
