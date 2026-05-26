/**
 * 老藤葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="50%" style="stop-color:#2a1a0a"/><stop offset="100%" style="stop-color:#0a1a0a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#5D4037"/><stop offset="100%" style="stop-color:#8D6E63"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><path d="M620 80 Q660 50 700 80 Q740 110 780 80" fill="none" stroke="rgba(141,110,99,0.15)" stroke-width="4"/><path d="M600 120 Q660 80 720 120" fill="none" stroke="rgba(141,110,99,0.1)" stroke-width="3"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#8D6E63" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Old Vines · 百年藤 · 风土之根</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#8D6E63" filter="url(#g)">🌳</text><rect x="20" y="130" width="500" height="2" fill="#8D6E63"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#8D6E63">老藤葡萄酒之谜</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">为什么老藤酿的酒更贵更好喝？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"时间沉淀的不仅是生命，更是风味的深度"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">百年藤 · 产量少 · 风味浓 · 百年传承</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#8D6E63" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','old_vines_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#5D4037;margin:0 0 8px 0;font-size:16px}h3{color:#5D4037;border-bottom:2px solid #8D6E63;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#5D4037;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#5D4037;">🌳 ${date.chinese} 老藤葡萄酒之谜：为什么老藤酿的酒更好？</h2>
<p style="text-align:center;color:#666;">百年藤 · 产量少 · 风味浓 · 价格贵——老藤葡萄酒背后的科学和魅力</p>
<section style="background:linear-gradient(135deg,#1a0a00,#2a1a0a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#D7CCC8;font-size:16px;line-height:1.9">走进酒类专卖店，你经常会看到酒标上写着"Old Vine"、"Vieilles Vignes"或"老藤"——而这些酒通常<strong style="color:#8D6E63">比普通酒贵上不少</strong>。老藤葡萄酒到底有什么特别的？百年的葡萄藤真的比年轻的藤酿出更好的酒吗？<strong style="color:#8D6E63">本文从科学和品鉴的角度，揭开老藤葡萄酒的神秘面纱。</strong></p>
</section>
<h3>🌱 一、什么算"老藤"？</h3>
<section style="background:#EFEBE9;padding:18px;border-radius:8px">
<div class="region-item"><h4>没有统一标准的世界</h4><p style="color:#333;line-height:1.8;margin:0">与大多数葡萄酒术语不同，"老藤"<strong>没有任何法律定义</strong>。不同产区、不同酒庄对"老藤"的理解截然不同。但业内大致有一个共识：</p></div>
<div class="region-item"><h4>国际通行分龄标准</h4><p style="color:#333;line-height:1.8;margin:0">巴罗莎老藤保护协会（Barossa Old Vine Charter）制定了最权威的分类：<br/><strong>• Old Vine（老藤）：</strong>35年以上<br/><strong>• Survivor Vine（幸存藤）：</strong>70年以上<br/><strong>• Centenarian Vine（百年藤）：</strong>100年以上<br/><strong>• Ancestor Vine（先祖藤）：</strong>125年以上<br/><br/>南澳大利亚的巴罗莎谷拥有<strong>世界上最古老的正在生产的葡萄藤</strong>——有些西拉和歌海娜葡萄藤的树龄已超过170年，它们是在19世纪根瘤蚜灾害之前种植的，是真正的"活化石"。</p></div>
</section>
<h3>🔬 二、老藤的科学原理</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>根部深入，吸收更丰富的矿物</h4><p style="color:#333;line-height:1.8;margin:0">随着葡萄藤年龄增长，<strong>根系越来越深</strong>——年轻藤的根系只有1-2米深，而老藤的根系可达5-10米甚至更深。深层土壤中的矿物质、微量元素以及更稳定的水分来源，赋予老藤葡萄酒更加复杂的风味层次和独特的矿物感。</p></div>
<div class="region-item"><h4>天然的产量控制</h4><p style="color:#333;line-height:1.8;margin:0">老藤的产量自然降低。一棵年轻的葡萄藤可以产出5-10公斤果实，而相同品种的老藤可能只有1-2公斤。产量低意味着<strong>每颗葡萄分配到的养分更多</strong>，果实更加浓缩，风味更加精炼。这是老藤葡萄酒通常更浓郁、更集中、颜色更深的主要原因。</p></div>
<div class="region-item"><h4>平衡的生理机能</h4><p style="color:#333;line-height:1.8;margin:0">年轻葡萄藤的"青春期"会让它产生过多的叶片和枝蔓，需要通过修剪来控制。而老藤已经进入<strong>生理上的"成熟期"</strong>，生长更加平衡和稳定，果实和叶片的比例更为理想，成熟过程更加均匀一致。葡萄中的糖分、酸度、单宁等成分的发育更加协调。</p></div>
</section>
<h3>🏆 三、全球著名老藤产区</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<table>
<tr><th>产区</th><th>品种</th><th>老藤树龄</th><th>代表酒款</th></tr>
<tr><td>🇦🇺 巴罗莎（澳大利亚）</td><td>西拉、歌海娜</td><td>80-170年</td><td>Torbreck The Laird, Henschke Hill of Grace</td></tr>
<tr><td>🇪🇸 普里奥拉托（西班牙）</td><td>佳丽酿、歌海娜</td><td>60-100年</td><td>Alvaro Palacios L'Ermita, Mas Doix</td></tr>
<tr><td>🇫🇷 教皇新堡（法国）</td><td>歌海娜、慕合怀特</td><td>60-100年</td><td>Château de Beaucastel Hommage à Jacques Perrin</td></tr>
<tr><td>🇫🇷 勃艮第（法国）</td><td>黑皮诺</td><td>40-80年</td><td>DRC Romanée-Conti（部分藤龄超过80年）</td></tr>
<tr><td>🇮🇹 西西里（意大利）</td><td>黑达沃拉、卡里坎特</td><td>60-120年</td><td>Frank Cornelissen, COS</td></tr>
<tr><td>🇿🇦 斯特兰德（南非）</td><td>白诗南、皮诺塔吉</td><td>50-120年</td><td>Kanonkop, Eben Sadie</td></tr>
<tr><td>🇺🇸 加州洛迪（美国）</td><td>仙粉黛</td><td>80-130年</td><td>Ridge Lytton Springs, Turley</td></tr>
<tr><td>🇵🇹 杜罗河谷（葡萄牙）</td><td>国产多瑞加</td><td>80-100+年</td><td>Quinta do Noval Nacional, Taylor's</td></tr>
</table>
</section>
<h3>👃 四、老藤品鉴特征</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>老藤 vs 年轻藤 品鉴对比</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>老藤通常颜色更深、更浓郁，但也可能更早呈现陈年色泽（砖红色边缘）<br/><strong>香气：</strong>更加深沉、复杂、多层——矿物感、干花、香料气息更为突出，果味更加沉稳内敛而非张扬<br/><strong>口感：</strong>更加集中、精炼、紧致，单宁更细腻更有质感，酸度更线性和平衡，核心风味更加深邃<br/><strong>余味：</strong>老藤酒的余味通常更长、更复杂——这是区分老藤与年轻藤最直接的指标<br/><strong>陈年潜力：</strong>因为更加浓缩和结构化的单宁，老藤葡萄酒通常比同品种的年轻藤酒更耐陈年</p></div>
</section>
<h3>⚠️ 五、"老藤"的陷阱</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>老藤 ≠ 好酒</h4><p style="color:#333;line-height:1.8;margin:0">并不是所有老藤葡萄酒都是好酒：<br/>• <strong>位置决定一切：</strong>如果老藤种在糟糕的地块上，它仍然是糟糕的葡萄<br/>• <strong>酿酒水平：</strong>老藤需要更专业的酿酒师来挖掘其潜力，差的酿酒师会浪费老藤的优势<br/>• <strong>过度提取风险：</strong>有些酿酒师因为老藤浓缩度高而在酿造中过度提取，导致酒苦涩失衡<br/>• <strong>营销噱头：</strong>"Old Vine"这个标签没有被法律保护，任何酒庄都可以在酒标上写"老藤"</p></div>
<div class="region-item"><h4>如何辨别真正的老藤酒</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>看酒庄声誉：</strong>知名产区的知名酒庄更值得信赖<br/>• <strong>看价格：</strong>如果一瓶"百年老藤"只卖100元，很可能只是营销话术<br/>• <strong>看具体信息：</strong>好酒庄通常会具体说明葡萄藤的种植年份或树龄<br/>• <strong>看产区：</strong>巴罗莎、普里奥拉托、教皇新堡的老藤可信度较高</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a00,#2a1a0a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#D7CCC8;font-size:16px;line-height:1.9">老藤葡萄酒是用时间沉淀出来的美味。<strong style="color:#8D6E63">每一瓶真正的老藤酒，都是岁月的见证者——那些葡萄藤经历了数代人的守护，根系深深扎入大地，将最精华的风味浓缩进每一颗果实</strong>。值得为它多花一些钱，但更要为它找一位懂它的酿酒师。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌳 生成老藤葡萄酒完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌳 ${date.chinese} 老藤葡萄酒之谜：为什么百年葡萄藤酿的酒更贵更好？`,author:'红酒顾问',digest:'老藤葡萄酒为什么比普通酒贵几倍？科学解析老藤背后的原理，以及全球最著名的老藤产区。',content:generateContent(),coverImage:'old_vines_cover_ai.png',category:'wine-knowledge',tags:['老藤','Old Vine','百年葡萄藤','葡萄酒知识','巴罗莎老藤','品鉴'],publishDate:date.full};
    const op = path.join(__dirname,'output',`old_vines_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
