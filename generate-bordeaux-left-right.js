process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a1a"/><stop offset="50%" style="stop-color:#1a0a30"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#1a237e"/><stop offset="100%" style="stop-color:#b388ff"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(179,136,255,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#b388ff" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">左岸赤霞珠 · 右岸梅洛 · 一张表看懂</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#b388ff" filter="url(#g)">🏰</text><rect x="20" y="130" width="500" height="2" fill="#b388ff"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#b388ff">波尔多左岸vs右岸</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Left Bank vs Right Bank 一篇文章看懂</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"左岸是权力，右岸是温柔"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">列级庄 · 中级庄 · 车库酒 · 1855分级</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#b388ff" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','bordeaux_left_right_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#1a237e;margin:0 0 8px 0;font-size:16px}h3{color:#1a237e;border-bottom:2px solid #b388ff;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#1a237e;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}.col{display:flex;gap:10px;margin:10px 0}.col>div{flex:1;padding:12px;border-radius:6px}@media(max-width:600px){.col{flex-direction:column}}</style>
<h2 style="text-align:center;color:#1a237e;">🏰 波尔多左岸vs右岸：一张表看懂</h2>
<p style="text-align:center;color:#666;">同样是波尔多，左岸和右岸却像是两个世界</p>
<section style="background:linear-gradient(135deg,#0a0a1a,#1a0a30);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#d1c4e9;font-size:16px;line-height:1.9">波尔多可能是中国人最熟悉的法国葡萄酒产区——但<strong style="color:#b388ff">"左岸"和"右岸"到底有什么区别？</strong>同样在波尔多，为什么有些酒以赤霞珠为主，有些以梅洛为主？为什么有些酒要陈20年才能喝？这篇文章从零开始，一篇文章让你成为波尔多专家。</p></section>
<h3>🌊 一、地理决定一切</h3>
<section style="background:#e8eaf6;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">波尔多的核心是吉伦特河（Gironde），它把波尔多分为三个区域：</p>
<div class="col">
<div style="background:#e0e0ff;border:1px solid #1a237e"><h4 style="color:#1a237e;margin:0 0 6px 0">🔵 左岸（Left Bank）</h4><p style="color:#333;margin:0;font-size:14px">河流以西。土壤以<strong>砾石</strong>为主，排水性好，吸热保温。适合晚熟的<strong>赤霞珠</strong>。风格：宏大、强劲、单宁</p></div>
<div style="background:#ffe0e0;border:1px solid #b71c1c"><h4 style="color:#b71c1c;margin:0 0 6px 0">🔴 右岸（Right Bank）</h4><p style="color:#333;margin:0;font-size:14px">河流以东。土壤以<strong>黏土和石灰岩</strong>为主。适合早熟的<strong>梅洛</strong>。风格：柔美、圆润、优雅</p></div>
<div style="background:#e0ffe0;border:1px solid #1b5e20"><h4 style="color:#1b5e20;margin:0 0 6px 0">🟢 两海之间（Entre-Deux-Mers）</h4><p style="color:#333;margin:0;font-size:14px">两条河之间的区域。以白葡萄酒为主。</p></div></div>
</section>
<h3>⚔️ 二、左岸vs右岸：核心对比</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>维度</th><th>左岸 Left Bank</th><th>右岸 Right Bank</th></tr>
<tr><td><strong>主要品种</strong></td><td>赤霞珠（主力）、梅洛、品丽珠、小维多</td><td>梅洛（主力）、品丽珠、赤霞珠（少量）</td></tr>
<tr><td><strong>土壤</strong></td><td>砾石、砂砾</td><td>黏土、石灰岩</td></tr>
<tr><td><strong>风格</strong></td><td>强劲、单宁高、结构感、陈年潜力大</td><td>柔美、圆润、单宁顺滑、更早适饮</td></tr>
<tr><td><strong>酒体</strong></td><td>饱满到浓郁</td><td>中等到饱满</td></tr>
<tr><td><strong>香气</strong></td><td>黑加仑、雪松、铅笔芯、烟草</td><td>红果、李子、巧克力、松露</td></tr>
<tr><td><strong>陈年</strong></td><td>顶级可陈30-50年</td><td>顶级可陈20-30年</td></tr>
<tr><td><strong>名庄</strong></td><td>拉菲、拉图、玛歌、木桐、侯伯王</td><td>柏图斯、里鹏、白马、欧颂</td></tr>
<tr><td><strong>分级系统</strong></td><td>1855列级庄分级（5个等级61家）</td><td>圣埃美隆分级（每10年重评一次）</td></tr>
<tr><td><strong>价格参考</strong></td><td>列级庄¥300-5000+，入门¥100-300</td><td>¥200-30000+（柏图斯极贵）</td></tr></table>
</section>
<h3>🏅 三、左岸：权力与秩序</h3>
<section style="background:#e8eaf6;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">左岸的核心产区包括<strong>梅多克（Médoc）</strong>和<strong>格拉夫（Graves）</strong>。左岸葡萄酒的特点是<strong>严谨、有结构、有条理</strong>。<br/><br/><strong>1855分级</strong>至今仍然是全球葡萄酒界最著名的等级制度——根据当时的市场价格，将梅多克和格拉夫的酒庄分为一级到五级。160多年来基本没变过（只有1973年木桐从二级升为一級）。<br/><br/>左岸顶级名庄的"三甲"：<strong>拉菲（Lafite）、拉图（Latour）、玛歌（Margaux）</strong>——每一瓶的收藏价值都不亚于艺术品。</p></div>
</section>
<h3>🏆 四、右岸：王者与传奇</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">右岸的核心产区是<strong>圣埃美隆（Saint-Émilion）</strong>和<strong>波美侯（Pomerol）</strong>。<br/><br/>右岸没有1855分级，但有<strong>圣埃美隆分级</strong>（每10年重评一次，2022年刚更新过）。波美侯则干脆<strong>没有任何分级</strong>——因为这里太小了（不到800公顷），酒庄们觉得不需要分级。<br/><br/>右岸的两大传奇：<strong>柏图斯（Pétrus）</strong>是波美侯之王，使用95%以上的梅洛，年产量仅2.5万瓶，单瓶价格¥15000+；<strong>里鹏（Le Pin）</strong>更小（2.7公顷），年产量6000瓶，价格和柏图斯相当。<br/><br/>右岸还有一个独特的概念——<strong>"车库酒"（Garage Wine）</strong>：极小产量、极其浓郁、极高分数。里鹏就是车库酒的开创者。</p>
</section>
<h3>🛒 五、入门选购指南</h3>
<section style="background:#fff8e1;padding:18px;border-radius:8px">
<div class="ri"><h4>左岸入门（¥100-300）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>波尔多AOC大区：</strong>最简单的"波尔多"红，通常是梅洛为主，果味柔顺<br/><strong>中级庄（Cru Bourgeois）：</strong>左岸性价比最高——品质远超普通AOC，价格¥150-350。推荐：Château Chasse-Spleen、Château Poujeaux<br/><strong>推荐品牌：</strong>Lurton家族的波尔多AOC系列</p></div>
<div class="ri"><h4>右岸入门（¥120-300）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>圣埃美隆大区：</strong>柔顺的梅洛风格，适合初入波尔多的朋友<br/><strong>波美侯卫星产区：</strong>Lalande-de-Pomerol——价格只有Pomerol的1/3，风格接近<br/><strong>推荐品牌：</strong>Château de Sours、J. de Villebois</p></div>
</section>
<h3>💡 六、波尔多冷知识</h3>
<section style="background:#f3e5f5;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 拉菲是中国最知名的进口葡萄酒品牌——它在1980年代进入中国市场，因为名字喜庆（"拉"有带来的意思，"菲"有芳香意）和香港富豪李嘉诚的厚爱而走红<br/>• 波尔多有<strong>12000多家酒庄</strong>——其中只有61家是1855列级庄<br/>• 波尔多的"中级庄"（Cru Bourgeois）是一个独立的分级——200多家酒庄入选，品质远超普通AOC，是被低估的宝藏<br/>• 波尔多白葡萄酒不输红葡萄酒——佩萨克-雷奥良（Pessac-Léognan）的干白和苏玳（Sauternes）的贵腐甜白是顶级水准<br/>• 2022年圣埃美隆最新分级引发巨大争议——12家酒庄将产区协会告上法庭</p></section>
<section style="background:linear-gradient(135deg,#0a0a1a,#1a0a30);padding:22px;border-radius:10px;text-align:center"><p style="color:#d1c4e9;font-size:16px;line-height:1.9"><strong style="color:#b388ff">左岸是权力，右岸是温柔。</strong>左岸的赤霞珠像一位穿着盔甲的将军，有着不可动摇的结构和力量；右岸的梅洛像一位温柔的诗人，有着丝绸般的质感和温暖的红果香气。两者没有谁更好——只有你喜欢哪种表达方式。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:'🏰 波尔多左岸vs右岸：一张表看懂两大世界的区别',author:'红酒顾问',digest:'波尔多左岸和右岸到底有什么区别？土壤、品种、风格、名庄、价格——这篇文章全部说清楚。',content:gen(),coverImage:'bordeaux_left_right_cover_ai.png',category:'wine-region',tags:['波尔多','左岸','右岸','梅多克','圣埃美隆','赤霞珠','梅洛','1855分级'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`bordeaux_left_right_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 波尔多左岸右岸, media_id:',d.data.media_id);}catch(e){console.error('❌ 波尔多:',e.message);process.exit(1);}}
main();
