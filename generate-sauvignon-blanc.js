process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a2005"/><stop offset="50%" style="stop-color:#1a3a10"/><stop offset="100%" style="stop-color:#0a2005"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#7CB342"/><stop offset="100%" style="stop-color:#9CCC65"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(156,204,101,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#9CCC65" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">清新小辣椒 · 百香果 · 青草 · 全世界最爽口的白葡萄酒</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#9CCC65" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#9CCC65"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#9CCC65">长相思完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Sauvignon Blanc 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"世界最爽口的白葡萄酒——喝一口就精神了"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">新西兰 · 卢瓦尔 · 智利 · 配餐 · 名庄</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#9CCC65" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','sauvignon_blanc_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#558B2F;margin:0 0 8px 0;font-size:16px}h3{color:#558B2F;border-bottom:2px solid #9CCC65;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#558B2F;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#558B2F;">🍇 长相思完全手册 Sauvignon Blanc</h2>
<p style="text-align:center;color:#666;">清新小辣椒——全世界最爽口、最容易辨认的白葡萄酒</p>
<section style="background:linear-gradient(135deg,#0a2005,#1a3a10);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#DCEDC8;font-size:16px;line-height:1.9">有些酒需要你专心品，慢慢想——但长相思不是。<strong style="color:#9CCC65">它像一杯冰镇柠檬水，直接、爽快、让人精神一振。</strong>如果你闻到一款白葡萄酒里有百香果、青草和柑橘的味道——不用怀疑，那就是长相思。</p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">长相思起源于法国卢瓦尔河谷——名字"Sauvignon"源自法语"sauvage"（野生），暗示这个品种的"野性"风味。它是赤霞珠的母亲（赤霞珠 = 品丽珠 × 长相思）。<br/><br/>长相思以<strong>极其强烈的品种个性</strong>著称——它不像霞多丽那样"中性"，也不像雷司令那样"百变"。你闻到一款长相思，你就知道这是长相思。<br/><br/>长相思的"本命"香气来自一种叫<strong>甲氧基吡嗪（Methoxypyrazine）</strong>的化合物——也是赤霞珠"青椒味"的来源。冷凉产区的长相思中吡嗪含量更高，表现为青草和芦笋味；温暖产区则更偏向热带水果。</p>
</section>
<h3>🌍 二、核心产区——新西兰vs法国</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>风格标签</th><th>过桶？</th><th>入门价</th></tr>
<tr><td>🇳🇿 马尔堡（新西兰）</td><td>百香果 · 青草 · 矿物 · 炸弹级果味</td><td>基本不过桶</td><td>¥100-250</td></tr>
<tr><td>🇫🇷 桑塞尔（卢瓦尔）</td><td>矿石 · 白花 · 柠檬 · 优雅</td><td>不过桶</td><td>¥200-500</td></tr>
<tr><td>🇫🇷 普伊-富美</td><td>燧石 · 烟熏 · 矿物 · 紧致</td><td>不过桶</td><td>¥200-500</td></tr>
<tr><td>🇨🇱 智利</td><td>性价比之王 · 清爽果味</td><td>不过桶</td><td>¥50-120</td></tr>
<tr><td>🇺🇸 加州</td><td>饱满 · 有时过桶（"白富美"）</td><td>部分过桶</td><td>¥100-300</td></tr>
<tr><td>🇿🇦 南非</td><td>草本 · 烟熏 · 独特</td><td>混合风格</td><td>¥80-200</td></tr>
<tr><td>🇦🇺 澳洲</td><td>热带水果 · 爽口</td><td>不过桶</td><td>¥80-200</td></tr></table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>一个重要概念：</strong>新西兰马尔堡定义了"现代长相思的标杆"——百香果炸弹级果味、清脆的酸度、让人喝了一口就停不下来。法国卢瓦尔河的桑塞尔和普伊-富美则更内敛、矿物感更强、更"严肃"。</p>
</section>
<h3>👃 三、风味特征</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<div class="ri"><h4>新西兰马尔堡风格</h4><p style="color:#333;line-height:1.8;margin:0"><strong>香气：</strong>百香果（最标志性）、青草、西柚、醋栗、番茄叶<br/><strong>口感：</strong>酸度高、清爽、干净、几乎没有单宁感<br/><strong>记忆点：</strong>"像把鼻子埋进一把刚剪下来的青草里，接着咬了一口百香果"</p></div>
<div class="ri"><h4>法国卢瓦尔风格</h4><p style="color:#333;line-height:1.8;margin:0"><strong>桑塞尔：</strong>白花、柠檬皮、矿石、烟熏——更"咸鲜"的矿物感<br/><strong>普伊-富美：</strong>燧石（火石）、烟熏、矿物——名字"Fumé"意为"烟熏"<br/><strong>口感：</strong>更高的酸度、更紧致、酒体更轻盈——像一把锋利的小刀</p></div>
<div class="ri"><h4>为何有人不喜欢长相思？</h4><p style="color:#333;line-height:1.8;margin:0">长相思的香气太过"直白"——有人形容为"猫尿味"（特别是新西兰马尔堡的长相思）或"硫磺味"。确实，长相思的芳香化合物中含有导致"猫尿味"的4-巯基-4-甲基戊-2-酮（4MMP）。有些人爱死了这个味道，有些人觉得难以接受。</p></div>
</section>
<h3>🍽️ 四、配餐指南</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">长相思是<strong>海鲜和沙拉的最佳搭档</strong>：</p>
<table><tr><th>食物</th><th>搭配原理</th><th>推荐指数</th></tr>
<tr><td>生蚝/扇贝/海鲜拼盘</td><td>长相思的酸度去腥提鲜——绝配</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>清蒸鱼/白灼虾</td><td>清爽不压，突出鲜味</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>凯撒沙拉/希腊沙拉</td><td>酸度配沙拉酱汁</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>芦笋/青豆/青酱意面</td><td>"草味配草味"——意外的和谐</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>山羊奶酪</td><td>桑塞尔长相思 + 山羊奶酪——法国经典</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>泰式/越南春卷</td><td>搭配东南亚的香草和酸味</td><td>⭐⭐⭐⭐</td></tr></table>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥50-120）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>智利：</strong>Concha y Toro、Santa Rita——全球长相思性价比之王<br/><strong>新西兰：</strong>Oyster Bay、Villa Maria——马尔堡长相思的表身份<br/><strong>澳洲：</strong>Lindeman's、Jacob's Creek</p></div>
<div class="ri"><h4>进阶级（¥120-250）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>新西兰：</strong>Cloudy Bay（云雾之湾——新西兰长相思的标杆）、Dog Point、Greystone<br/><strong>法国桑塞尔入门：</strong>Pascal Jolivet、Henri Bourgeois——感受卢瓦尔风格<br/><strong>澳洲：</strong>Vasse Felix</p></div>
<div class="ri"><h4>发烧级（¥250-600）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>桑塞尔/普伊-富美一级酒庄：</strong>Edmond Vatan、Didier Dagueneau——全球最贵的长相思之一<br/><strong>加州白富美：</strong>未过桶的Cakebread、过桶的Robert Mondavi Fumé Blanc——"白富美"是加州版本</p></div>
</section>
<h3>💡 六、长相思冷知识</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 长相思的"白富美"（Fumé Blanc）是个营销创造——1970年代Robert Mondavi为了把加州长相思卖出好价钱，给它起了个法国名字"Fumé Blanc"，大获成功<br/>• Cloudy Bay（云雾之湾）是<strong>全球最出名的长相思品牌之一</strong>——它定义了"马尔堡风格"<br/>• 新西兰长相思在全球的成功是20世纪晚期新世界葡萄酒最伟大的营销案例之一——一个没有酿酒传统的小国，用20年时间让全世界爱上了它的长相思<br/>• 长相思是<strong>赤霞珠的母本</strong>——没有长相思就没有红酒之王<br/>• 长相思在波尔多也被广泛种植——用于酿造波尔多白葡萄酒（往往加入赛美蓉混酿）和贵腐甜酒苏玳</p></section>
<section style="background:linear-gradient(135deg,#0a2005,#1a3a10);padding:22px;border-radius:10px;text-align:center"><p style="color:#DCEDC8;font-size:16px;line-height:1.9"><strong style="color:#9CCC65">长相思是葡萄酒世界的"一口惊艳"。</strong>它不复杂，不需要你花半小时去解构它的风味——第一口你就会喜欢或者不喜欢。在这个意义上，它是最诚实的葡萄酒。如果你还没试过新西兰马尔堡长相思——去买一瓶Cloudy Bay或者Oyster Bay，配一盘海鲜，你会在第一口就明白为什么全世界都爱它。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 长相思完全手册：全世界最爽口的白葡萄酒`,author:'红酒顾问',digest:'百香果、青草、矿物——长相思为什么是全世界最易识别的白葡萄酒？从马尔堡到桑塞尔一篇说清楚。',content:gen(),coverImage:'sauvignon_blanc_cover_ai.png',category:'wine-grape',tags:['长相思','Sauvignon Blanc','新西兰','Cloudy Bay','桑塞尔','白葡萄酒','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`sauvignon_blanc_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 长相思, media_id:',d.data.media_id);}catch(e){console.error('❌ 长相思:',e.message);process.exit(1);}}
main();
