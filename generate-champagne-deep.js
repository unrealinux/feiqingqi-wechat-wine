process.env.HTTP_PROXY='';process.env.HTTPS_PROXY='';require('dotenv').config();const axios=require('axios');axios.defaults.proxy=false;const sharp=require('sharp');const fs=require('fs');const path=require('path');const FormData=require('form-data');const config=require('./config');
const today=new Date();const date={full:today.toISOString().slice(0,10),display:`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`};
function gCov(){const svg=`<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a1a"/><stop offset="50%" style="stop-color:#1a3a3a"/><stop offset="100%" style="stop-color:#0a1a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#f5d742"/><stop offset="100%" style="stop-color:#ffeb3b"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(255,235,59,0.06)"/><circle cx="670" cy="220" r="12" fill="none" stroke="#f5d742" stroke-width="1"/><circle cx="645" cy="240" r="8" fill="none" stroke="#f5d742" stroke-width="1"/><circle cx="680" cy="260" r="10" fill="none" stroke="#f5d742" stroke-width="1"/><circle cx="660" cy="280" r="6" fill="none" stroke="#f5d742" stroke-width="1"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">气泡的秘密 · 名庄 · 年份香槟 · 白中白vs黑中白</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#f5d742" filter="url(#g)">🍾</text><rect x="20" y="130" width="500" height="2" fill="#f5d742"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#f5d742">香槟深度指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">Champagne 一瓶气泡酒凭什么卖这么贵</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"庆祝的液体——但香槟远不止是派对酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">酿造 · 分级 · 年份 · 名庄 · 白中白 · 配餐</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#f5d742" text-anchor="end">${date.display}</text></svg>`;
return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','champagne_deep_cover_ai.png'),b);return b;});}
function gen(){return`
<style>.ri{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.ri h4{color:#b8860b;margin:0 0 8px 0;font-size:16px}h3{color:#b8860b;border-bottom:2px solid #f5d742;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#b8860b;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#b8860b;">🍾 香槟深度指南：一瓶气泡酒凭什么卖这么贵</h2>
<p style="text-align:center;color:#666;">从酿造到分级，从名庄到配餐——关于香槟你想知道的都在这里</p>
<section style="background:linear-gradient(135deg,#0a1a1a,#1a3a3a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#fff9c4;font-size:16px;line-height:1.9">香槟是世界上最有名的葡萄酒——没有之一。<strong style="color:#f5d742">它是庆祝的代名词、奢华的代表、社交场合的通行证。</strong>但你知道吗？大多数香槟其实不是"年份香槟"；香槟的气泡是人工加进去的（而且有严格的法规）；为什么一瓶最普通的香槟也要¥300+？读完这篇，你就成了朋友圈里的香槟专家。</p></section>
<h3>🍇 一、香槟的三种葡萄</h3>
<section style="background:#fff8e1;padding:18px;border-radius:8px"><table><tr><th>品种</th><th>颜色</th><th>占比</th><th>作用</th></tr>
<tr><td>黑皮诺 Pinot Noir</td><td>红</td><td>~38%</td><td>提供结构、酒体和红果香</td></tr>
<tr><td>莫尼耶皮诺 Pinot Meunier</td><td>红</td><td>~32%</td><td>提供果味、圆润感、早饮</td></tr>
<tr><td>霞多丽 Chardonnay</td><td>白</td><td>~30%</td><td>提供优雅、酸度、陈年潜力</td></tr></table>
<p style="color:#333;line-height:1.8;margin-top:12px">三种葡萄的黄金配比让香槟如此独特——不像其他起泡酒只用一种葡萄。白中白香槟（Blanc de Blancs）只用霞多丽；黑中白香槟（Blanc de Noirs）只用红葡萄（黑皮诺和/或莫尼耶）。</p>
</section>
<h3>🔬 二、传统法（Méthode Traditionnelle）</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">香槟的酿造过程极其复杂——这也是它贵的原因：<br/><br/><strong>第一步：</strong>酿造静态基酒（无气泡）<br/><strong>第二步：</strong>混合——重要！香槟绝大多数都是非年份酒（NV），酿酒师将多个年份的基酒混合，以保持品牌风格的稳定性<br/><strong>第三步：</strong>瓶内二次发酵——加入糖和酵母，密封瓶口。酵母在瓶中消耗糖，产生酒精和二氧化碳——气泡就是这样来的<br/><strong>第四步：</strong>陈年（酒泥接触）——非年份最少15个月，年份最少3年<br/><strong>第五步：</strong>转瓶（Riddling）——将瓶子慢慢旋转至瓶口向下，让酵母沉淀到瓶口<br/><strong>第六步：</strong>除渣（Dégorgement）——冷冻瓶口，瞬间打开瓶盖，冰块塞带着酵母排出<br/><strong>第七步：</strong>补液（Dosage）——加少量糖浆调整甜度：Brut（干型）<12g/L、Extra Brut <6g/L</p>
</section>
<h3>📊 三、香槟的类型</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>类型</th><th>说明</th><th>价格范围</th></tr>
<tr><td>NV（非年份）</td><td>占香槟产量的80%+，每年风格一致</td><td>¥250-500</td></tr>
<tr><td>年份香槟（Vintage）</td><td>单一年份，只在好年份酿，至少陈年3年</td><td>¥500-1500</td></tr>
<tr><td>白中白（Blanc de Blancs）</td><td>纯霞多丽，优雅细腻</td><td>¥300-2000</td></tr>
<tr><td>黑中白（Blanc de Noirs）</td><td>纯红葡萄，浓郁饱满</td><td>¥300-2000</td></tr>
<tr><td>桃红香槟（Rosé）</td><td>混合少量红葡萄酒或短暂浸皮</td><td>¥350-2000</td></tr>
<tr><td>顶级/收藏级（Prestige Cuvée）</td><td>各家最好的香槟，如Dom Pérignon</td><td>¥1000-5000+</td></tr></table>
</section>
<h3>🏺 四、大品牌vs小农香槟</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px"><table><tr><th>类别</th><th>代表</th><th>风格</th></tr>
<tr><td>大品牌（Maison）</td><td>Moët & Chandon、Veuve Clicquot、Taittinger、Ruinart</td><td>稳定、经典、全球统一风格</td></tr>
<tr><td>小农香槟（RM/Récoltant-Manipulant）</td><td>Egly-Ouriet、Jacques Selosse、Pierre Péters</td><td>有地块特色、更个性化</td></tr></table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>重要趋势：</strong>小农香槟（Grower Champagne）在过去10年大热。和工业大牌的稳定风格不同，小农香槟注重风土表达，每一瓶都有自己的个性——就像勃艮第的黑皮诺一样。</p>
</section>
<h3>🍽️ 五、配餐指南</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px"><table><tr><th>香槟类型</th><th>食物搭配</th></tr>
<tr><td>NV Brut（入门）</td><td>炸鸡、薯条、披萨——是的，香槟配快餐是经典</td></tr>
<tr><td>白中白</td><td>生蚝、鱼子酱、清蒸海鲜</td></tr>
<tr><td>黑中白</td><td>烤鸭、烤鸡、蘑菇烩饭</td></tr>
<tr><td>年份香槟</td><td>龙虾、鹅肝、陈年奶酪</td></tr>
<tr><td>桃红香槟</td><td>三文鱼、西班牙火腿、草莓甜点</td></tr>
<tr><td>半干（Demi-Sec）</td><td>甜点、蛋糕、水果挞</td></tr></table>
</section>
<h3>🛒 六、入门推荐</h3>
<section style="background:#eceff1;padding:18px;border-radius:8px">
<div class="ri"><h4>¥250-400 入门级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>Moët Impérial：</strong>全球最畅销香槟。风格经典，果味柔和<br/><strong>Taittinger Brut Réserve：</strong>品质稳定，性价比高<br/><strong>Veuve Clicquot Yellow Label：</strong>知名品牌，风格饱满，被称为"黄牌"<br/><strong>Piper-Heidsieck：</strong>奥斯卡颁奖礼用酒</p></div>
<div class="ri"><h4>¥400-1000 进阶级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>Billecart-Salmon Brut Réserve：</strong>以优雅细腻著称<br/><strong>Ruinart Blanc de Blancs：</strong>最古老的香槟酒庄，白中白标杆<br/><strong>Pol Roger：</strong>丘吉尔最爱的香槟<br/><strong>小农入门：</strong>Pierre Péters Blanc de Blancs、Egly-Ouriet Brut Tradition</p></div>
<div class="ri"><h4>收藏级</h4><p style="color:#333;line-height:1.8;margin:0"><strong>Dom Pérignon（唐培里侬）：</strong>香槟之王，年份香槟¥1500+<br/><strong>Krug Grande Cuvée：</strong>全球最独特的香槟之一，¥2000+<br/><strong>Salon：</strong>白中白的极致——只用单一年份霞多丽，¥4000+<br/><strong>Cristal（水晶香槟）：</strong>Louis Roederer的顶级款，¥2000+</p></div>
</section>
<h3>💡 七、香槟冷知识</h3>
<section style="background:#fff8e1;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8">• 香槟中的气泡数量约<strong>4900万个</strong>——每瓶香槟大约有4.9亿个微气泡<br/>• 只有法国香槟产区出产的起泡酒才能叫"Champagne"——其他地方的只能叫"起泡酒"<br/>• "香槟"是一个受原产地保护（AOC）的名称——中国市场上那些叫"XX香槟"的低端气泡酒都是侵权的<br/>• 唐培里侬（Dom Pérignon）修士是香槟之父——但传说他发明香槟的故事可能是假的：他其实一直在努力<strong>消除</strong>气泡（当时气泡被认为是酿酒缺陷）<br/>• 香槟瓶承受的压力相当于<strong>汽车轮胎的两倍</strong>——所以开瓶时瓶子可能飞出伤人</p></section>
<section style="background:linear-gradient(135deg,#0a1a1a,#1a3a3a);padding:22px;border-radius:10px;text-align:center"><p style="color:#fff9c4;font-size:16px;line-height:1.9"><strong style="color:#f5d742">香槟是葡萄酒界最伟大的"人造奇迹"</strong>——它的气泡、它的平衡、它的复杂，不是大自然赐予的，而是人类几百年来不断优化工艺的结果。下次开香槟的时候，不要急着碰杯——先听一听气泡升腾的声音，那就是成千上万个小时辛勤劳动的结晶。</p></section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;}
async function main(){try{const cb=await gCov();const art={title:'🍾 香槟深度指南：一瓶气泡酒凭什么卖这么贵',author:'红酒顾问',digest:'从酿造工艺到分级体系，从大品牌到小农香槟——关于香槟的一切，一篇说清楚。',content:gen(),coverImage:'champagne_deep_cover_ai.png',category:'wine-region',tags:['香槟','起泡酒','白中白','唐培里侬','黑中白','小农香槟','法国葡萄酒'],publishDate:date.full};fs.writeFileSync(path.join(__dirname,'output',`champagne_deep_${date.full.replace(/-/g,'')}.json`),JSON.stringify(art,null,2));
const w=config.publish;const t=await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);const a=t.data.access_token;const f=new FormData();f.append('media',cb,{filename:'cover.png',contentType:'image/png'});const m=await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});const d=await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:art.title,thumb_media_id:m.data.media_id,author:art.author,digest:art.digest,content:art.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});console.log('✅ 香槟, media_id:',d.data.media_id);}catch(e){console.error('❌ 香槟:',e.message);process.exit(1);}}
main();
