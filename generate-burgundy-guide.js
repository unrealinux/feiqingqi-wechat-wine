process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0005"/><stop offset="50%" style="stop-color:#3a0510"/><stop offset="100%" style="stop-color:#2a0005"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#9e2a2b"/><stop offset="100%" style="stop-color:#e65100"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(230,81,0,0.07)"/><path d="M620 200 Q680 160 740 200 Q750 300 700 360 Q650 300 620 200" fill="url(#og)" stroke="#e65100" stroke-width="1" opacity="0.3"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">全球最复杂的葡萄酒产区 · 黑皮诺和霞多丽的故乡</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#e65100" filter="url(#g)">🏛️</text><rect x="20" y="130" width="500" height="2" fill="#e65100"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#e65100">勃艮第入门指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Bourgogne 从零到懂的最短路径</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"勃艮第为什么这么贵？为什么这么复杂？"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">特级园 · 一级园 · 村庄级 · 大区级 · 名庄</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#e65100" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','burgundy_guide_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#9e2a2b;margin:0 0 8px 0;font-size:16px}h3{color:#9e2a2b;border-bottom:2px solid #e65100;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#9e2a2b;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#9e2a2b;">🏛️ 勃艮第入门指南：全球最复杂的葡萄酒产区</h2>
<p style="text-align:center;color:#666;">黑皮诺和霞多丽的故乡——勃艮第为什么这么贵、这么复杂、这么迷人</p>
<section style="background:linear-gradient(135deg,#1a0005,#3a0510);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">勃艮第——葡萄酒世界的圣殿，也是<strong style="color:#e65100">全球最复杂、最昂贵、最令人困惑的产区</strong>。一块葡萄园能分成上百个地块，每个地块都有自己的名字和等级；一瓶酒的价格可以从¥200到¥20万+。但别担心——你不需要成为一个地质学家才能享受勃艮第。</p></section>
<h3>🏷️ 一、勃艮第的金字塔分级</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">勃艮第的核心逻辑是<strong>风土分级</strong>——不是按酒庄分，而是按地块分：</p>
<table><tr><th>等级</th><th>占比</th><th>酒标写法</th><th>入门价格</th><th>代表</th></tr>
<tr><td>🏔️ 特级园 Grand Cru</td><td>1-2%</td><td>只有葡萄园名（如 "Chambertin"）</td><td>¥1000-50000+</td><td>罗曼尼康帝、香贝丹、蒙哈榭</td></tr>
<tr><td>🌄 一级园 Premier Cru</td><td>约10%</td><td>村庄名+Premier Cru+园名</td><td>¥500-3000</td><td>Volnay 1er Cru、Meursault 1er Cru</td></tr>
<tr><td>🏘️ 村庄级 Village</td><td>约37%</td><td>只有村庄名（如 "Gevrey-Chambertin"）</td><td>¥250-800</td><td>Gevrey、Chambolle、Vosne-Romanée</td></tr>
<tr><td>🌱 大区级 Régionale</td><td>约50%</td><td>"Bourgogne" + 品种或其他</td><td>¥150-350</td><td>Bourgogne Rouge、Bourgogne Blanc</td></tr></table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>重要概念：</strong>勃艮第有33个特级园——全部在夜丘和伯恩丘。没有一个在夏布利（夏布利有"特级园"但属于不同的分类系统）。罗曼尼康帝（Romanée-Conti）是勃艮第最贵的特级园。</p>
</section>
<h3>🗺️ 二、勃艮第五大子产区</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>红/白</th><th>风格</th><th>知名村庄</th></tr>
<tr><td>夏布利 Chablis</td><td>白（霞多丽）</td><td>矿石 · 清冽 · 高酸 · 不过桶</td><td>夏布利特级园（7个）</td></tr>
<tr><td>夜丘 Côte de Nuits</td><td>红（黑皮诺为主）</td><td>力量 · 优雅 · 最贵</td><td>Gevrey-Chambertin、Chambolle、Vosne-Romanée、Nuits-St-Georges</td></tr>
<tr><td>伯恩丘 Côte de Beaune</td><td>红+白</td><td>红优雅 · 白饱满顶级</td><td>Volnay（红）、Puligny-Montrachet（白）、Meursault（白）</td></tr>
<tr><td>夏隆内丘 Côte Chalonnaise</td><td>红+白</td><td>性价比高</td><td>Mercurey、Rully</td></tr>
<tr><td>马贡内 Mâconnais</td><td>白为主</td><td>果味 · 价格亲民</td><td>Pouilly-Fuissé、Mâcon-Villages</td></tr></table>
</section>
<h3>🍷 三、勃艮第红vs白的经典</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">
<div class="ri"><h4>勃艮第红葡萄酒（黑皮诺）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心风格：</strong>和任何其他产区的黑皮诺都不同——更优雅、更矿物、更"咸鲜"<br/><strong>年轻（1-5年）：</strong>红果（草莓、覆盆子）、花香、微妙的香料<br/><strong>陈年（5-15年+）：</strong>松露、森林地表、皮革、干蘑菇——复杂度的巅峰<br/><strong>入门建议：</strong>从夜丘村庄级或者夏隆内丘Mercurey入手</p></div>
<div class="ri"><h4>勃艮第白葡萄酒（霞多丽）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心风格：</strong>全世界霞多丽的标杆——夏布利的矿石和默尔索的黄油是两种极致<br/><strong>夏布利类型：</strong>柠檬、白花、矿石、海风——适合配生蚝<br/><strong>默尔索/普利尼类型：</strong>黄油、榛子、烤面包、蜂蜜——复杂饱满<br/><strong>入门建议：</strong>从夏布利入门级或马贡内村级开始</p></div>
</section>
<h3>🛒 四、入门选酒指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<div class="ri"><h4>¥150-300 入门级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>马贡内Mâcon-Villages：</strong>性价比最高的勃艮第白，¥150左右<br/><strong>勃艮第大区级：</strong>Bourgogne Rouge或Blanc，选择名家的入门款<br/><strong>推荐酒庄：</strong>Joseph Drouhin、Louis Jadot、Faiveley——这三家大酒庄的入门级产品线覆盖全勃艮第</p></div>
<div class="ri"><h4>¥300-600 进阶级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>夏布利村级：</strong>感受矿石风格的最佳起点<br/><strong>夜丘村庄级：</strong>Gevrey-Chambertin村级、Nuits-St-Georges村级<br/><strong>夏隆内丘：</strong>Mercurey红——勃艮第红性价比之选</p></div>
<div class="ri"><h4>¥600-1500 发烧级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>一级园（Premier Cru）：</strong>从Volnay、Chambolle-Musigny、Puligny-Montrachet的一级园入手<br/><strong>推荐酒庄：</strong>Domaine de Montille、Domaine Armand Rousseau（更贵但殿堂级）</p></div>
</section>
<h3>💡 五、勃艮第冷知识</h3>
<section style="background:#fff8e1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 罗曼尼康帝（DRC）是勃艮第最贵的酒庄——一瓶Romanée-Conti特级园均价¥15万+，每年产量仅5000-6000瓶<br/>• 勃艮第是<strong>"风土"（Terroir）概念的发源地</strong>——"一片葡萄园的味道取决于土壤、微气候和人的组合"这个理念来自勃艮第<br/>• 勃艮第的葡萄园从公元6世纪就开始被修道院管理——西多会的僧侣们最早发现"不同地块产的酒味道不同"<br/>• 勃艮第葡萄酒的<strong>价格在过去20年涨了10倍以上</strong>——亚洲需求、产量有限、评分炒作推动<br/>• 勃艮第没有"差酒"——但勃艮第也没有"便宜酒"</p></section>
<section style="background:linear-gradient(135deg,#1a0005,#3a0510);padding:22px;border-radius:10px;text-align:center"><p style="color:#ffccbc;font-size:16px;line-height:1.9"><strong style="color:#e65100">勃艮第不是用来"喝"的，是用来"品"的。</strong>一瓶¥200的勃艮第大区级可能不如一瓶¥200的智利赤霞珠"好喝"——但勃艮第的魅力不在这里。它在于你能在酒中感受到"这是来自哪一个地块"、"这一年雨水多不多"、"酿酒师做了什么样的选择"。理解勃艮第就是理解葡萄酒的终极哲学：风土。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:'🏛️ 勃艮第入门指南：全球最复杂的葡萄酒产区一篇文章看懂',author:'红酒顾问',digest:'勃艮第为什么这么贵又这么复杂？四级金字塔分级、五大子产区、入门选酒指南——一文入坑。',content:gen(),coverImage:'burgundy_guide_cover_ai.png',category:'wine-region',tags:['勃艮第','黑皮诺','霞多丽','特级园','罗曼尼康帝','夜丘','勃艮第入门'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`burgundy_guide_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 勃艮第, media_id:',d.data.media_id);}catch(e){console.error('❌ 勃艮第:',e.message);process.exit(1);}}
main();
