process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a1505"/><stop offset="50%" style="stop-color:#3a2a10"/><stop offset="100%" style="stop-color:#1a1505"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#DAA520"/><stop offset="100%" style="stop-color:#F0C040"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(240,192,64,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DAA520" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">白葡萄之王 · 百变女王 · 可清纯可性感</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DAA520" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#DAA520"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DAA520">霞多丽完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Chardonnay 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"白葡萄之王——没有人不爱霞多丽"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">勃艮第 · 智利 · 加州 · 过桶不过桶 · 配餐</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','chardonnay_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}h3{color:#B8860B;border-bottom:2px solid #DAA520;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B8860B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B8860B;">🍇 霞多丽完全手册 Chardonnay</h2>
<p style="text-align:center;color:#666;">白葡萄之王——百变女王，可清纯可性感，全世界种植最广的白葡萄</p>
<section style="background:linear-gradient(135deg,#1a1505,#3a2a10);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#FFF8E1;font-size:16px;line-height:1.9">如果有人问你"全世界最受欢迎的白葡萄酒是什么"，答案只有两个字：<strong style="color:#DAA520">霞多丽</strong>。它的伟大之处不在于"单一的风格"，而在于<strong style="color:#DAA520">它的百变</strong>——从法国夏布利的矿石清冽到加州纳帕的黄油爆米花，霞多丽在不同酿酒师手中展现出截然不同的面貌。</p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">霞多丽起源于法国勃艮第——名字来源于勃艮第马贡内区的一个小村庄"Chardonnay"。它是黑皮诺和白皮诺（Gouais Blanc）自然杂交的后代。<br/><br/>霞多丽的成功在于它的<strong>适应性和中性</strong>——它能适应各种气候，而且本身风味中性，不像长相思那样有强烈的品种个性。这种"中性"使得霞多丽成为<strong>酿酒的完美画布</strong>：酿酒师可以通过橡木桶、苹果酸乳酸发酵、酒泥陈酿等技术创作出截然不同的风格。<br/><br/>霞多丽也是<strong>香槟的主要品种</strong>——白中白香槟（Blanc de Blancs）是100%霞多丽酿造。</p>
</section>
<h3>🌍 二、核心产区与风格</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>风格标签</th><th>过桶？</th><th>入门价</th></tr>
<tr><td>🇫🇷 夏布利 Chablis</td><td>清冽 · 矿石 · 柠檬 · 海风</td><td>基本不过桶</td><td>¥150-400</td></tr>
<tr><td>🇫🇷 勃艮第白</td><td>黄油 · 烤面包 · 坚果 · 饱满</td><td>过桶（顶级酒庄）</td><td>¥200-800</td></tr>
<tr><td>🇺🇸 纳帕/索诺玛</td><td>黄油 · 香草 · 热带水果 · 饱满</td><td>重过桶（新美桶）</td><td>¥150-500</td></tr>
<tr><td>🇦🇺 澳洲</td><td>果味奔放 · 白桃 · 清爽</td><td>部分过桶</td><td>¥80-200</td></tr>
<tr><td>🇨🇱 智利</td><td>性价比之王 · 清爽果味</td><td>混合风格</td><td>¥60-150</td></tr>
<tr><td>🇳🇿 新西兰</td><td>纯净 · 酸度鲜明</td><td>部分过桶</td><td>¥100-250</td></tr>
<tr><td>🇿🇦 南非</td><td>烟熏 · 蜂蜜 · 成熟</td><td>混合风格</td><td>¥80-200</td></tr></table>
</section>
<h3>👃 三、过桶vs不过桶——两种截然不同</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="ri"><h4>不过桶的霞多丽（清爽派）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>代表产区：</strong>夏布利、智利入门级、澳洲入门级<br/><strong>香气：</strong>柠檬、青苹果、白花、矿石、湿石头<br/><strong>口感：</strong>清爽、酸度高、酒体轻盈到中等<br/><strong>适合人群：</strong>不喜欢"黄油感"的人——你一定喝过"我只要不甜的干白"然后其实你要的就是不过桶的霞多丽</p></div>
<div class="ri"><h4>过桶的霞多丽（饱满派）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>代表产区：</strong>勃艮第白（普利尼-蒙哈榭、默尔索）、纳帕、玛格丽特河<br/><strong>香气：</strong>黄油、烤面包、香草、椰子、焦糖、爆米花——没错，就是爆米花的味道<br/><strong>口感：</strong>饱满、圆润、油脂感强（来自苹果酸-乳酸发酵）、余味悠长<br/><strong>适合人群：</strong>想喝"有重量感"的白葡萄酒的人——喝过桶霞多丽的人经常说"这酒喝起来像在嚼黄油"——这是赞美</p></div>
</section>
<h3>🍽️ 四、配餐指南</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px"><table><tr><th>霞多丽风格</th><th>食物搭配</th><th>推荐指数</th></tr>
<tr><td>不过桶夏布利</td><td>生蚝、清蒸鱼、海鲜拼盘</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>不过桶入门级</td><td>沙拉、白灼虾、鸡肉沙拉</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>过桶勃艮第白</td><td>龙虾、黄油烤鱼、奶油蘑菇意面</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>过桶纳帕风格</td><td>烤猪排、烤鸡、奶油浓汤</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>白中白香槟</td><td>鱼子酱、炸鸡、寿司——百搭</td><td>⭐⭐⭐⭐⭐</td></tr></table>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥60-150）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>智利：</strong>Concha y Toro Casillero del Diablo、Montes Classic<br/><strong>澳洲：</strong>Jacob's Creek、Lindeman's<br/><strong>南非：</strong>Kumala</p></div>
<div class="ri"><h4>进阶级（¥150-400）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>夏布利：</strong>William Fèvre、Chablisienne<br/><strong>澳洲：</strong>Leeuwin Estate Art Series、Cullen<br/><strong>智利：</strong>Concha y Toro Amelia——智利高端霞多丽的标杆</p></div>
<div class="ri"><h4>发烧级（¥400-1200）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>勃艮第村级/一级园：</strong>默尔索、普利尼-蒙哈榭、普利尼的村级酒；Domaine Roulot、Coche-Dury（顶级但极贵）<br/><strong>加州：</strong>Kistler、Aubert</p></div>
</section>
<h3>💡 六、霞多丽冷知识</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 上世纪90年代，美国掀起了一场"ABC运动"（Anything But Chardonnay——除了霞多丽什么都行）——因为当时美国市场被过桶过重的霞多丽淹没了。但今天霞多丽仍然是美国最畅销的白葡萄酒<br/>• 霞多丽是<strong>世界上最容易种植的白葡萄之一</strong>——它几乎适应任何气候，这解释了为什么它种植最广<br/>• 香槟中的"白中白"（Blanc de Blancs）必须100%使用霞多丽——而"黑中白"必须使用红葡萄<br/>• 夏布利有一种特殊的"夏布利风味"——来源于启莫里阶（Kimmeridgian）土壤中远古牡蛎化石的矿物味。喝夏布利就像"舔了一块湿润的石头"<br/>• 霞多丽的"黄油味"不是橡木桶带来的，而是来自<strong>苹果酸-乳酸发酵（MLF）</strong>——酿酒师将尖锐的苹果酸转化为温和的乳酸，同时产生双乙酰——就是丁香的黄油味</p></section>
<section style="background:linear-gradient(135deg,#1a1505,#3a2a10);padding:22px;border-radius:10px;text-align:center"><p style="color:#FFF8E1;font-size:16px;line-height:1.9"><strong style="color:#DAA520">霞多丽的伟大之处：它是一张白纸。</strong>在夏布利它是一块矿石，在勃艮第它是一块黄油，在香槟里它是优雅的气泡。它不一定是你最爱的白葡萄酒（有些人就是喜欢长相思的清新），但它是理解白葡萄酒世界最好的起点。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 霞多丽完全手册：白葡萄之王的百变魅力`,author:'红酒顾问',digest:'霞多丽为什么能成为白葡萄之王？从夏布利的矿石到纳帕的黄油——一篇读懂全世界种植最广的白葡萄。',content:gen(),coverImage:'chardonnay_cover_ai.png',category:'wine-grape',tags:['霞多丽','Chardonnay','勃艮第白','夏布利','白葡萄酒','香槟','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`chardonnay_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 霞多丽, media_id:',d.data.media_id);}catch(e){console.error('❌ 霞多丽:',e.message);process.exit(1);}}
main();
