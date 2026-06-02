process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#051a10"/><stop offset="50%" style="stop-color:#0a3a20"/><stop offset="100%" style="stop-color:#051a10"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#2E8B57"/><stop offset="100%" style="stop-color:#3CB371"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(60,179,113,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#3CB371" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">德国骄傲 · 干型甜型都能驾驭的全能选手</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#3CB371" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#3CB371"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#3CB371">雷司令完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Riesling 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"白葡萄贵族——它比大多数红葡萄更能陈年"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">德国 · 阿尔萨斯 · 澳洲 · 干型/甜型 · 配餐</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#3CB371" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','riesling_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#2E8B57;margin:0 0 8px 0;font-size:16px}h3{color:#2E8B57;border-bottom:2px solid #3CB371;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#2E8B57;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#2E8B57;">🍇 雷司令完全手册 Riesling</h2>
<p style="text-align:center;color:#666;">白葡萄酒中的贵族——从极干的德国GG到贵腐甜酒，雷司令无所不能</p>
<section style="background:linear-gradient(135deg,#051a10,#0a3a20);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#C8E6C9;font-size:16px;line-height:1.9">如果说霞多丽是白葡萄之王，那<strong style="color:#3CB371">雷司令就是白葡萄酒中的贵族</strong>。它有着白葡萄中最惊人的陈年潜力（顶级雷司令可放50-100年）、最丰富的香气层次、最极致的风土表达。<strong style="color:#3CB371">一瓶顶级雷司令，能让你同时感受到"汽油"和"蜜桃"——这是一种奇妙的体验。</strong></p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">雷司令起源于德国莱茵高产区，最早记载于1435年。它的父母是白高维斯（Gouais Blanc）和一种古老的野生葡萄——和霞多丽的其中一个亲本相同。<br/><br/>雷司令以<strong>极强的风土表现力</strong>著称——它能在不同土壤上表现出完全不同的一面：蓝色板岩上的雷司令有矿石和青苹果味，红色板岩上有杏子和蜂蜜味，花岗岩上则有更多的花香。<br/><br/>历史上，雷司令曾是世界上最贵的葡萄酒之一——在19世纪，德国顶级雷司令的价格甚至超过了拉菲。今天虽然被勃艮第和波尔多超越，但在德国本土，顶级雷司令仍然一瓶难求。</p>
</section>
<h3>🌍 二、核心产区</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>风格标签</th><th>甜度</th><th>入门价</th></tr>
<tr><td>🇩🇪 摩泽尔</td><td>清冽 · 板岩 · 花香 · 高酸</td><td>干型→极甜</td><td>¥100-300</td></tr>
<tr><td>🇩🇪 莱茵高</td><td>饱满 · 桃子 · 矿物</td><td>干型→甜型</td><td>¥120-400</td></tr>
<tr><td>🇩🇪 法尔兹</td><td>热带水果 · 饱满</td><td>干型为主</td><td>¥100-300</td></tr>
<tr><td>🇫🇷 阿尔萨斯</td><td>干型 · 饱满 · 烟熏 · 香料</td><td>干型为主（也有晚收VT）</td><td>¥150-500</td></tr>
<tr><td>🇦🇺 克莱尔谷/伊顿谷</td><td>莱姆 · 青柠 · 矿物 · 极致干型</td><td>几乎全是干型</td><td>¥100-300</td></tr>
<tr><td>🇦🇹 瓦豪/克雷姆斯</td><td>骨感 · 矿物 · 高酸 · 干型（Smaragd）</td><td>干型为主</td><td>¥150-400</td></tr>
<tr><td>🇺🇸 纽约州Finger Lakes</td><td>冷凉 · 青苹果 · 花香</td><td>混合风格</td><td>¥120-300</td></tr></table>
</section>
<h3>👃 三、雷司令的"汽油味"——怎么回事？</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">雷司令最著名的标志性香气是<strong>"汽油味"</strong>（准确说是<strong>TDN</strong>——1,1,6-三甲基-1,2-二氢萘）。<br/><br/>这不是缺陷，而是雷司令陈年后的标志性特征！年轻雷司令有苹果、桃子、花香；陈年5-10年后开始出现"汽油"或"煤油"味，很多爱好者对此痴迷。这个味道越浓，说明雷司令<strong>越老、越成熟</strong>。<br/><br/>除了汽油味，雷司令还有三种风格维度：<br/>• <strong>干型（Trocken）</strong>— 清冽、高酸、矿物感极强<br/>• <strong>半干（Feinherb/Kabinett）</strong>— 微甜，和酸度完美平衡<br/>• <strong>甜型（Auslese→BA→TBA）</strong>— 从晚收到贵腐精选，甜度的皇冠</p>
</section>
<h3>🍽️ 四、配餐的终极优势</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">雷司令是<strong>地球上最百搭的配餐酒</strong>——没有之一。原因在于它的<strong>高酸度</strong>和<strong>甜度可选性</strong>：</p>
<table><tr><th>雷司令类型</th><th>完美搭配</th><th>为什么？</th></tr>
<tr><td>德国干型（GG）</td><td>清蒸鱼、白灼海鲜、沙拉</td><td>高酸解腻，矿味提鲜</td></tr>
<tr><td>阿尔萨斯干型</td><td>烤猪肉、鹅肝、芝士拼盘</td><td>饱满酒体匹配浓郁食物</td></tr>
<tr><td>澳洲干型</td><td>泰式咖喱、越南粉</td><td>青柠味匹配东南亚菜系</td></tr>
<tr><td>半干雷司令</td><td>麻辣火锅、川菜、湘菜</td><td>微甜解辣——经典绝配</td></tr>
<tr><td>甜型雷司令</td><td>甜点、蓝纹奶酪、芒果糯米饭</td><td>甜度匹配，酸度平衡</td></tr></table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>特别推荐：</strong>半干雷司令 + 麻辣火锅——这是中国市场上雷司令最成功的饮用场景。</p>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥80-150）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>德国：</strong>Dr. Loosen、J.J. Prüm、Kunstler——德国名庄入门款<br/><strong>澳洲：</strong>Jacob's Creek Riesling、Grosset（稍贵但品质极佳）<br/><strong>智利：</strong>雷司令少见但便宜</p></div>
<div class="ri"><h4>进阶级（¥150-400）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>德国GG：</strong>Markus Molitor、Wittmann——德国干型雷司令的顶级水准<br/><strong>阿尔萨斯：</strong>Trimbach、Hugel、Zind-Humbrecht<br/><strong>澳洲：</strong>Pewsey Vale、Henschke</p></div>
<div class="ri"><h4>发烧级（¥400-1000）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>德国顶级甜型：</strong>Egon Müller、Joh. Jos. Prüm——全球最贵的白葡萄酒之一<br/><strong>阿尔萨斯特级园：</strong>顶级酒庄的特级园雷司令</p></div>
</section>
<h3>💡 六、雷司令冷知识</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 雷司令是最长寿的白葡萄之一——顶级雷司令可以轻松陈年50-100年，比绝大多数红葡萄酒还长寿<br/>• 德国葡萄酒等级制度极其复杂——Kabinett → Spätlese → Auslese → BA → TBA，甜度递增。但还有一个独立的"VDP"分级（类似勃艮第）针对干型酒<br/>• 阿尔萨斯的雷司令通常不标注"Riesling"之外的任何信息——你只需要知道这是一个阿尔萨斯酒庄，它就是用雷司令酿的<br/>• 澳洲的雷司令和德国完全不同——后者追求矿物感，前者追求纯粹的莱姆和青柠味<br/>• "汽油味"不是所有人都喜欢——如果你第一次喝雷司令，从年轻、果味丰富的入门款开始，不要买陈了10年的</p></section>
<section style="background:linear-gradient(135deg,#051a10,#0a3a20);padding:22px;border-radius:10px;text-align:center"><p style="color:#C8E6C9;font-size:16px;line-height:1.9"><strong style="color:#3CB371">雷司令的伟大之处：它从不讨好任何人。</strong>它不需要橡木桶来增加复杂度和陈年潜力——光靠葡萄本身、土壤和酿酒师的智慧，就能酿造出世界上最复杂、最持久、最令人惊叹的白葡萄酒。配麻辣火锅它行、配顶级鹅肝它也行——这就是雷司令的魔力。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 雷司令完全手册：白葡萄酒中的贵族`,author:'红酒顾问',digest:'雷司令为什么能成为白葡萄贵族？从德国的板岩矿物到澳洲的莱姆青柠——一篇读懂全世界最全能的白葡萄。',content:gen(),coverImage:'riesling_cover_ai.png',category:'wine-grape',tags:['雷司令','Riesling','德国葡萄酒','阿尔萨斯','白葡萄酒','甜酒','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`riesling_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 雷司令, media_id:',d.data.media_id);}catch(e){console.error('❌ 雷司令:',e.message);process.exit(1);}}
main();
