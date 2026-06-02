process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0505"/><stop offset="50%" style="stop-color:#3a1010"/><stop offset="100%" style="stop-color:#2a0505"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B0000"/><stop offset="100%" style="stop-color:#DC143C"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(220,20,60,0.07)"/><path d="M620 200 Q680 180 740 200 Q750 280 720 340 Q680 350 640 340 Q610 280 620 200" fill="url(#og)" stroke="#DC143C" stroke-width="1.5" opacity="0.4"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">红酒中的林黛玉 · 最娇贵最优雅的葡萄</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DC143C" filter="url(#g)">🍇</text><rect x="20" y="130" width="500" height="2" fill="#DC143C"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DC143C">黑皮诺完全手册</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Pinot Noir 从入门到精通</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"最娇贵的葡萄，酿出最优雅的酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">勃艮第 · 新西兰 · 加州 · 俄勒冈 · 配餐</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DC143C" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','pinot_noir_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#8B0000;margin:0 0 8px 0;font-size:16px}h3{color:#8B0000;border-bottom:2px solid #DC143C;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B0000;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B0000;">🍇 黑皮诺完全手册 Pinot Noir</h2>
<p style="text-align:center;color:#666;">葡萄酒世界的林黛玉——最娇贵、最优雅、也最令人着迷的红葡萄</p>
<section style="background:linear-gradient(135deg,#1a0505,#3a1010);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#FFCDD2;font-size:16px;line-height:1.9">如果赤霞珠是红酒之王，那<strong style="color:#DC143C">黑皮诺就是红酒中的皇后</strong>——它没有赤霞珠的力量，却有着无与伦比的优雅。丝绸般的单宁、覆盆子和玫瑰花的香气、在舌尖上轻盈起舞的感觉……当一瓶顶级黑皮诺流淌进杯中，全世界的喧嚣都安静了。</p></section>
<h3>🌱 一、起源与历史</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">黑皮诺的起源地是法国勃艮第——事实上，<strong>黑皮诺和勃艮第是一回事</strong>。人类早在公元1世纪就开始在勃艮第种植黑皮诺，DNA分析表明它是非常古老的品种。<br/><br/>黑皮诺以"娇贵"著称：<strong>皮薄（易烂）、易感染霉菌、对气候极度敏感</strong>。它只适合凉爽到温和的气候，太热会失去优雅的酸度，太冷则无法成熟。<br/><br/>但正是这种脆弱，让顶级黑皮诺有了无与伦比的<strong>风土表达能力</strong>——同一块田的不同地块，酿出的黑皮诺可以完全不同。</p>
</section>
<h3>🌍 二、核心产区</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>风格标签</th><th>等级参考</th><th>入门价</th></tr>
<tr><td>🇫🇷 勃艮第</td><td>优雅 · 红果 · 泥土 · 矿物</td><td>大区级→村级→一级园→特级园</td><td>¥200-500</td></tr>
<tr><td>🇳🇿 新西兰</td><td>纯净 · 红樱桃 · 香料 · 丝滑</td><td>中奥塔哥、马尔堡</td><td>¥150-400</td></tr>
<tr><td>🇺🇸 加州索诺玛</td><td>成熟 · 黑樱桃 · 饱满</td><td>Russian River、Sonoma Coast</td><td>¥200-500</td></tr>
<tr><td>🇺🇸 俄勒冈</td><td>旧世界风格 · 酸度好 · 红果</td><td>Willamette Valley AVA</td><td>¥200-500</td></tr>
<tr><td>🇩🇪 德国</td><td>轻盈 · 花香 · 辛辣（Spätburgunder）</td><td>QbA、GG</td><td>¥120-300</td></tr>
<tr><td>🇦🇺 澳洲</td><td>果味浓郁 · 饱满</td><td>雅拉谷、塔斯马尼亚</td><td>¥120-300</td></tr></table>
</section>
<h3>👃 三、风味特征</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<div class="ri"><h4>年轻时的香气（1-5年）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>红果：</strong>覆盆子、草莓、红樱桃——经典的黑皮诺果味<br/><strong>花香：</strong>玫瑰花瓣、紫罗兰<br/><strong>香料：</strong>肉桂、丁香（尤其是来自优质勃艮第和俄勒冈）<br/><strong>土壤：</strong>森林地表、蘑菇、湿树叶——勃艮第黑皮诺的灵魂</p></div>
<div class="ri"><h4>陈年后的香气（5-15年+）</h4><p style="color:#333;line-height:1.8;margin:0">顶级黑皮诺陈年后会出现令人惊叹的第三层香气：<strong>松露、皮革、野味、干蘑菇、肉桂、陈皮</strong>——酒体变得更复杂、更 earthy，和年轻的果味形成美妙对比。</p></div>
<div class="ri"><h4>口感结构</h4><p style="color:#333;line-height:1.8;margin:0"><strong>单宁：</strong>低到中——很细腻，几乎像丝绸。这是黑皮诺最迷人口感<br/><strong>酸度：</strong>中高到高——清爽的酸度是黑皮诺的标志<br/><strong>酒体：</strong>轻盈到中等——不要指望黑皮诺有赤霞珠的重量<br/><strong>酒精度：</strong>12.5%-14.5%（勃艮第常在13%左右，新世界略高）</p></div>
</section>
<h3>🍽️ 四、配餐指南</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px"><table><tr><th>食物</th><th>搭配原理</th><th>推荐指数</th></tr>
<tr><td>烤鸭/北京烤鸭</td><td>黑皮诺的优雅和烤鸭的油脂——经典中的经典</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>三文鱼（煎或烤）</td><td>黑皮诺的酸度和鱼的肥美完美平衡</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>烤鸡/鸡胸肉</td><td>轻淡的酒体不压白肉，红果味配酱汁</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>蘑菇烩饭/松露意面</td><td>黑皮诺的"泥土味"和蘑菇是天作之合</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>日式照烧</td><td>甜咸酱汁呼应黑皮诺的果味</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>烤牛排</td><td>黑皮诺单宁不够，容易被牛肉压过</td><td>⭐⭐</td></tr></table>
</section>
<h3>🛒 五、选酒指南</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="ri"><h4>入门级（¥100-200）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>新西兰：</strong>Oyster Bay、Nautilus——果味纯净，入门首选<br/><strong>德国：</strong>Dr. Loosen、J.J. Prüm的Spätburgunder——德版黑皮诺性价比超高<br/><strong>智利：</strong>智利黑皮诺少见但性价比好</p></div>
<div class="ri"><h4>进阶级（¥200-500）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>新西兰中奥塔哥：</strong>Felton Road、Mount Difficulty<br/><strong>俄勒冈：</strong>Domaine Drouhin、Lange Estate<br/><strong>勃艮第大区级/村级：</strong>Faiveley、Joseph Drouhin</p></div>
<div class="ri"><h4>发烧级（¥500-1500）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>勃艮第一级园：</strong>从Volnay、Chambolle-Musigny、Gevrey-Chambertin等名村的一级园入手<br/><strong>加州：</strong>Kistler、Hirsch Vineyards</p></div>
<div class="ri"><h4>收藏级（¥1500+）</h4><p style="color:#333;line-height:1.8;margin:0">勃艮第特级园（Romanée-Conti、La Tâche——但价格在5万+）、Domaine Leroy、Armand Rousseau</p></div>
</section>
<h3>💡 六、黑皮诺冷知识</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 黑皮诺是香槟中唯一允许使用的红葡萄（与霞多丽和莫尼耶皮诺混合）<br/>• 黑皮诺的DNA极不稳定——它在历史上发生过数百次变异，产生了灰皮诺、白皮诺等多种变种<br/>• 勃艮第的一级园和特级园<strong>仅占产区总产量的不到10%</strong>——这就是它们永远供不应求的原因<br/>• 电影《杯酒人生》让黑皮诺在美国一夜爆红：片中主角Miles的独白"黑皮诺非常娇贵，需要不断的照顾和关注"打动了无数人<br/>• 勃艮第最近N个年份（2015、2018、2019、2020）都被认为"极佳"——对于气候敏感的勃艮第来说，这非常罕见</p></section>
<section style="background:linear-gradient(135deg,#1a0505,#3a1010);padding:22px;border-radius:10px;text-align:center"><p style="color:#FFCDD2;font-size:16px;line-height:1.9"><strong style="color:#DC143C">黑皮诺的魔力在于它的"脆弱"</strong>——它从不为任何人妥协。它只在它喜欢的地方生长，只在它满意的年份里绽放。当你遇到一瓶好的黑皮诺时，那不是一瓶酒，那是某个地方、某片土地、某个人一整年的心血和运气。<br/>喝它的时候，慢一点。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:`🍇 黑皮诺完全手册：红酒中最高贵的优雅`,author:'红酒顾问',digest:'黑皮诺为什么如此珍贵？从勃艮第到新西兰，从红果花香到松露皮革——一篇读懂红酒中的林黛玉。',content:gen(),coverImage:'pinot_noir_cover_ai.png',category:'wine-grape',tags:['黑皮诺','Pinot Noir','勃艮第','新西兰黑皮诺','红酒推荐','葡萄品种'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`pinot_noir_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 黑皮诺, media_id:',d.data.media_id);}catch(e){console.error('❌ 黑皮诺:',e.message);process.exit(1);}}
main();
