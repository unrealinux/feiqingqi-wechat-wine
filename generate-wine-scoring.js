/**
 * 葡萄酒评分揭秘
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a2a"/><stop offset="50%" style="stop-color:#1a1a4a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#FFD700"/><stop offset="100%" style="stop-color:#FFA000"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="160" fill="rgba(255,215,0,0.08)"/><text x="620" y="160" font-family="serif" font-size="160" font-weight="bold" fill="rgba(255,215,0,0.06)">100</text><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FFD700" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Wine Scores · Robert Parker · Wine Spectator</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FFD700" filter="url(#g)">📊</text><rect x="20" y="130" width="500" height="2" fill="#FFD700"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FFD700">葡萄酒评分揭秘</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">帕克100分是怎么打出来的？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"葡萄酒世界最有权势的数字"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">RP · WS · JS · AG · WE · 看懂所有评分体系</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_scoring_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#FF8F00;margin:0 0 8px 0;font-size:16px}h3{color:#FF8F00;border-bottom:2px solid #FFD700;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#FF8F00;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#FF8F00;">📊 ${date.chinese} 葡萄酒评分揭秘：帕克100分是怎么打出来的？</h2>
<p style="text-align:center;color:#666;">罗伯特·帕克 · Wine Spectator · 詹姆士·萨克林 · 各大评分体系一网打尽</p>
<section style="background:linear-gradient(135deg,#0a0a2a,#1a1a4a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">一瓶酒获得罗伯特·帕克100分满分，价格能在24小时内翻倍。一个数字，<strong style="color:#FFD700">足以决定一款葡萄酒的命运、整个产区的兴衰</strong>。这就是葡萄酒评分的威力。但你知道这些分数是怎么打出来的吗？不同的评分体系之间有什么区别？<strong style="color:#FFD700">本文带你彻底读懂葡萄酒评分体系。</strong></p>
</section>
<h3>👨‍⚖️ 一、帕克评分体系（RP/WA）</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>罗伯特·帕克：改变葡萄酒世界的男人</h4><p style="color:#333;line-height:1.8;margin:0">罗伯特·帕克（Robert Parker）是<strong>现代葡萄酒评分体系的创造者</strong>。1978年他创办了《葡萄酒倡导家》（Wine Advocate），开创性地使用了50-100分的评分体系，打破了葡萄酒评论依赖文绉绉的描述而非量化比较的传统。帕克的影响力在1990-2010年间达到顶峰——<strong>被葡萄酒界称为"帕克效应"</strong>。</p></div>
<div class="region-item"><h4>帕克评分标准</h4><p style="color:#333;line-height:1.8;margin:0">帕克使用<strong>50-100分制</strong>（不是百分制，起评是50分）：<br/><strong>96-100分：</strong> extraordinaire（非凡之作）— 葡萄酒世界的巅峰<br/><strong>90-95分：</strong> outstanding（杰出）— 品质卓越，极力推荐<br/><strong>80-89分：</strong> above average（优良以上）— 值得购买的优质酒<br/><strong>70-79分：</strong> average（普通）— 日常饮用，没有缺陷<br/><strong>60-69分：</strong> below average（低于平均）— 有明显缺陷<br/><strong>50-59分：</strong> unacceptable（不可接受）— 有严重缺陷<br/><br/>关键：帕克评分偏爱<strong>果味浓郁、酒体饱满、酒精度高</strong>的风格，带有帕克本人明显的口味偏好，这也是他备受争议的原因。</p></div>
</section>
<h3>🏛️ 二、主流评分体系对比</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<table>
<tr><th>评分体系</th><th>评分者</th><th>采用制</th><th>偏好风格</th><th>影响力</th></tr>
<tr><td>RP / WA</td><td>Robert Parker / Wine Advocate</td><td>50-100分</td><td>浓郁饱满型（帕克风格）</td><td>★★★★★</td></tr>
<tr><td>WS</td><td>Wine Spectator 编辑团队</td><td>50-100分</td><td>相对平衡，果味优先</td><td>★★★★★</td></tr>
<tr><td>JS</td><td>James Suckling</td><td>50-100分</td><td>极偏爱果味集中和高成熟度</td><td>★★★★</td></tr>
<tr><td>WE</td><td>Wine Enthusiast 编辑团队</td><td>50-100分</td><td>较为客观，注重性价比</td><td>★★★</td></tr>
<tr><td>AG / Vinous</td><td>Antonio Galloni / Vinous</td><td>50-100分</td><td>更注重风土和优雅感</td><td>★★★★</td></tr>
<tr><td>JR</td><td>Jancis Robinson</td><td>20分制</td><td>偏向欧洲传统风格，高酸克制</td><td>★★★★</td></tr>
<tr><td>Decanter</td><td>Decanter编辑团队</td><td>五星制/100分</td><td>较为平衡，品种多样</td><td>★★★★</td></tr>
<tr><td>Falstaff</td><td>Falstaff编辑团队</td><td>100分制</td><td>偏向欧洲风格</td><td>★★★</td></tr>
</table>
</section>
<h3>🔍 三、评分的秘密：怎么打的？</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>盲品还是非盲品？</h4><p style="color:#333;line-height:1.8;margin:0">这是一个争议焦点。<strong>大多数评分机构采用非盲品或"半盲品"方式</strong>——品鉴者知道自己在喝什么酒。支持者认为这样能更好地判断"这支酒是否达到了它应有的水准"；批评者则认为这引入了先入为主的偏见。少数机构（如Decanter的一些赛事）使用严格盲品。</p></div>
<div class="region-item"><h4>打分流程</h4><p style="color:#333;line-height:1.8;margin:0">1. <strong>集中品鉴：</strong>通常一天品鉴40-100款酒，每款酒在口中停留不超过30秒<br/>2. <strong>即时打分：</strong>在品鉴现场给出分数，不做前后对比<br/>3. <strong>写品酒词：</strong>回顾品鉴笔记，撰写公开发布的品酒词<br/>4. <strong>二次确认：</strong>同一批次的酒可能由不同品鉴师再次确认</p></div>
<div class="region-item"><h4>争议与批评</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>分数通胀：</strong>1990年代90分是"杰出"，如今90分比比皆是，95分以上才算"优秀"<br/>• <strong>风格窄化：</strong>酿酒师们开始"为帕克酿酒"——追求浓郁饱满而非风土个性<br/>• <strong>利益冲突：</strong>评分者与酒庄之间可能存在复杂的利益关系<br/>• <strong>主观偏差：</strong>一个分数可能决定一款酒的生死，但它终究只是一个人的Opinion</p></div>
</section>
<h3>💡 四、消费者如何看评分？</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>正确使用评分的姿势</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>看平均分，不看单次评分：</strong>同一款酒，RP可能给95分，JS给92分，WS给90分。看多家评分的平均值比单个分数更有参考价值<br/>• <strong>找到口味相似的评分者：</strong>如果你喜欢优雅克制的风格，Jancis Robinson的评分比Parker的评分更适合你<br/>• <strong>90分不是"优秀"而是"不错"：</strong>今天的90分约等于十年前的85分<br/>• <strong>评分买酒法：</strong>最聪明的策略是买那些<strong>被评分但尚未涨价</strong>的酒<br/>• <strong>信评分，但不迷信：</strong>评分是参考，你自己的舌头才是最终的裁判<br/>• <strong>关注品酒词的描述，而非数字：</strong>"黑莓、雪松、烟草"比"95分"提供了更多信息</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a0a2a,#1a1a4a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">葡萄酒评分是一个有用的工具，但仅此而已。<strong style="color:#FFD700">它的价值在于提供参考，而非代替你品尝。最好的葡萄酒不是帕克评100分的那瓶，而是让你最享受的那瓶</strong>。记住：评分是别人的日记，品鉴才是你自己的故事。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n📊 生成葡萄酒评分揭秘\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`📊 ${date.chinese} 葡萄酒评分揭秘：帕克100分是怎么打出来的？`,author:'红酒顾问',digest:'一个100分能让酒价翻倍。揭秘罗伯特·帕克、Wine Spectator、詹姆士·萨克林的评分内幕，学会用评分而不是被评分忽悠。',content:generateContent(),coverImage:'wine_scoring_cover_ai.png',category:'wine-knowledge',tags:['葡萄酒评分','罗伯特·帕克','Wine Spectator','100分','品酒体系','RP评分'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_scoring_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
