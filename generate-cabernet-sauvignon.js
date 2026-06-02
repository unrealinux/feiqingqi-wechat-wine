process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0505"/><stop offset="50%" style="stop-color:#3a1515"/><stop offset="100%" style="stop-color:#1a0505"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#722F37"/><stop offset="100%" style="stop-color:#C41E3A"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(196,30,58,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#C41E3A" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">红酒之王 · 全球种植面积最大的红葡萄</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#C41E3A" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#C41E3A"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#C41E3A">赤霞珠完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Cabernet Sauvignon 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"红酒之王，稳重有力——它定义了现代葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">起源 · 产区 · 风味 · 配餐 · 选酒 · 名庄</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#C41E3A" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','cabernet_sauvignon_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#722F37;margin:0 0 8px 0;font-size:16px}h3{color:#722F37;border-bottom:2px solid #C41E3A;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#722F37;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#722F37;">🍇 赤霞珠完全手册 Cabernet Sauvignon</h2>
<p style="text-align:center;color:#666;">红酒之王——全球种植面积最大的红葡萄品种，从波尔多走出的全球巨星</p>
<section style="background:linear-gradient(135deg,#1a0505,#3a1515);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#FFCDD2;font-size:16px;line-height:1.9">如果世界上只能剩下一个葡萄品种，那一定是<strong style="color:#C41E3A">赤霞珠</strong>。它定义了"好红酒"的标准——深邃的颜色、强劲的单宁、黑加仑的香气、陈年的潜力。从波尔多到纳帕，从智利到宁夏，<strong style="color:#C41E3A">赤霞珠是当之无愧的红酒之王</strong>。</p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">赤霞珠是18世纪在法国波尔多<strong>偶然杂交</strong>的产物——品丽珠（Cabernet Franc）× 长相思（Sauvignon Blanc）。它的名字"Sauvignon"和长相思同源，意为"野生"，暗示其旺盛的生命力。<br/><br/>赤霞珠的成功得益于三个特性：<strong>皮厚（单宁多）、晚熟（积累风味）、抗病性强</strong>。它特别适合波尔多左岸的砾石土壤——白天吸热、夜晚放热，帮助晚熟的赤霞珠完美成熟。<br/><br/>今天，赤霞珠是<strong>全球种植面积最广的红葡萄品种</strong>，几乎每个葡萄酒产国都能找到它的身影。</p></div>
</section>
<h3>🌍 二、核心产区</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>风格标签</th><th>等级参考</th><th>入门价</th></tr>
<tr><td>🇫🇷 波尔多左岸</td><td>经典 · 雪松 · 黑加仑 · 铅笔芯</td><td>AOC、中级庄、列级庄</td><td>¥150-500</td></tr>
<tr><td>🇺🇸 纳帕谷</td><td>浓郁 · 黑莓 · 香草 · 饱满</td><td>AVA、膜拜酒</td><td>¥200-800</td></tr>
<tr><td>🇨🇱 智利</td><td>果味奔放 · 柔和 · 性价比之王</td><td>D.O.、Gran Reserva</td><td>¥60-200</td></tr>
<tr><td>🇦🇺 库纳瓦拉/玛格丽特河</td><td>薄荷 · 桉树 · 黑果</td><td>澳大利亚GI</td><td>¥100-300</td></tr>
<tr><td>🇮🇹 托斯卡纳</td><td>超级托斯卡纳 · 优雅力量并存</td><td>IGT、Bolgheri DOC</td><td>¥150-500</td></tr>
<tr><td>🇨🇳 宁夏/河北</td><td>青椒味突出 · 正在崛起</td><td>中国GI</td><td>¥80-300</td></tr>
<tr><td>🇿🇦 南非斯泰伦博斯</td><td>黑果 · 烟熏 · 结构感</td><td>WO</td><td>¥80-250</td></tr></table>
</section>
<h3>👃 三、风味特征</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<div class="ri"><h4>核心果香（来自葡萄本身）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>黑果：</strong>黑加仑（黑醋栗）——这是赤霞珠最标志性的味道。黑莓、黑樱桃<br/><strong>草本：</strong>青椒、薄荷、桉树——未完全成熟的赤霞珠会有"青味"，这在凉爽产区更为突出</p></div>
<div class="ri"><h4>陈年香气（来自橡木桶和瓶陈）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>橡木桶赋予：</strong>香草、烘烤、椰子（美桶）、雪松、烟熏（法桶）<br/><strong>瓶陈演化：</strong>皮革、雪茄盒、松露、森林地表、干果——顶级赤霞珠陈年20-30年后的标志性香气</p></div>
<div class="ri"><h4>典型口感结构</h4><p style="color:#333;line-height:1.8;margin:0"><strong>单宁：</strong>中高到高。年轻时有明显的收敛感——这正是陈年潜力的来源<br/><strong>酸度：</strong>中等到高。不会过酸，但足够支撑陈年<br/><strong>酒体：</strong>饱满到浓郁<br/><strong>酒精度：</strong>13.5%-15%（新世界通常更高，达14-15%）</p></div>
</section>
<h3>🍽️ 四、配餐指南</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">赤霞珠的强劲单宁和高酒精度需要<strong>蛋白质和脂肪</strong>来平衡：</p>
<table><tr><th>食物</th><th>搭配原理</th><th>推荐指数</th></tr>
<tr><td>烤牛排/炭烤肉眼</td><td>单宁软化脂肪，蛋白质柔化单宁——天作之合</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>红烧牛腩/炖牛肉</td><td>浓郁酱汁呼应浓郁酒体</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>烤羊排</td><td>羊肉的油脂和赤霞珠完美配搭</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>硬质奶酪（切达、格鲁耶尔）</td><td>脂肪和盐分平衡单宁</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>黑巧克力（70%+）</td><td>苦甜呼应赤霞珠的黑色水果和单宁</td><td>⭐⭐⭐</td></tr>
<tr><td>清蒸鱼/白肉</td><td>单宁会让海鲜产生金属味——不推荐</td><td>⭐</td></tr></table>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥60-150）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>智利：</strong>Concha y Toro、Santa Rita、Montes——全球赤霞珠性价比最高<br/><strong>澳洲：</strong>Lindeman's Bin 45、Yellow Tail<br/><strong>南非：</strong>Kumala、Two Oceans</p></div>
<div class="ri"><h4>进阶级（¥150-400）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>智利：</strong>Montes Alpha、Cousiño Macul Antiguas Reservas<br/><strong>法国：</strong>波尔多中级庄（Cru Bourgeois）——性价比之选<br/><strong>澳洲：</strong>Wynns Coonawarra、Vasse Felix<br/><strong>中国：</strong>怡园酒庄、银色高地</p></div>
<div class="ri"><h4>发烧级（¥400-1500）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>纳帕：</strong>Stag's Leap、Heitz Cellar、Caymus<br/><strong>波尔多：</strong>列级庄（五级到二级）如Pontet-Canet、Léoville Barton<br/><strong>超级托斯卡纳：</strong>Guado al Tasso、Sassicaia（超预算但值得）</p></div>
<div class="ri"><h4>收藏级（¥1500+）</h4><p style="color:#333;line-height:1.8;margin:0">波尔多一级庄（拉菲、拉图、玛歌）、纳帕膜拜酒（Screaming Eagle、Harlan）、意大利西施佳雅</p></div>
</section>
<h3>💡 六、赤霞珠冷知识</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• 赤霞珠和品丽珠、佳美娜在基因上非常接近——DNA分析显示它们是"一家族"<br/>• 著名的"青椒味"来自一种叫做<strong>吡嗪（Pyrazine）</strong>的化合物——凉爽产区的赤霞珠中含量更高<br/>• 拉菲在中国的成功是全球葡萄酒市场的一个奇妙故事——中国人对"拉菲"的追捧，使波尔多一级庄的价格在2000-2010年间翻了10倍<br/>• 宁夏贺兰山东麓是中国最成功的赤霞珠产区，被《世界葡萄酒地图》收录<br/>• 赤霞珠是<strong>最晚熟的红葡萄之一</strong>——在波尔多通常在10月中下旬才采收</p>
</section>
<section style="background:linear-gradient(135deg,#1a0505,#3a1515);padding:22px;border-radius:10px;text-align:center"><p style="color:#FFCDD2;font-size:16px;line-height:1.9"><strong style="color:#C41E3A">赤霞珠为什么能成为"红酒之王"？</strong>——不是因为它最优雅（黑皮诺更优雅），不是因为它最奔放（西拉更奔放），而是因为它<strong>最全面</strong>。它能在任何气候下表现出色，能陈年数十年，能搭配各种美食。一瓶好的赤霞珠，是葡萄酒世界最可靠的承诺。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 赤霞珠完全手册：红酒之王的全面解读`,author:'红酒顾问',digest:'赤霞珠为什么是红酒之王？从波尔多的雪松到智利的果味，从入门到名庄——一篇读懂全世界最重要的红葡萄。',content:gen(),coverImage:'cabernet_sauvignon_cover_ai.png',category:'wine-grape',tags:['赤霞珠','Cabernet Sauvignon','波尔多','纳帕谷','红酒之王','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`cabernet_sauvignon_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 赤霞珠, media_id:',d.data.media_id);}catch(e){console.error('❌ 赤霞珠:',e.message);process.exit(1);}}
main();
