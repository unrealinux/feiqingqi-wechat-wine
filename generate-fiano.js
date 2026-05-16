/**
 * 菲亚诺白葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2a1a00"/><stop offset="50%" style="stop-color:#4a3a10"/><stop offset="100%" style="stop-color:#1a1a00"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#DAA520"/><stop offset="100%" style="stop-color:#FFD700"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(218,165,32,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DAA520" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Campania, Italy · Fiano di Avellino DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DAA520" filter="url(#g)">🏺</text><rect x="20" y="130" width="500" height="2" fill="#DAA520"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DAA520">菲亚诺·迪·阿韦利诺</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">坎帕尼亚 · 古罗马白葡萄酒的传承</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"古罗马人最爱的葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">蜂蜜、香料和矿物的完美融合</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','fiano_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}h3{color:#B8860B;border-bottom:2px solid #DAA520;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B8860B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B8860B;">🏺 ${date.chinese} 菲亚诺完全指南</h2>
<p style="text-align:center;color:#666;">坎帕尼亚 · 古罗马的遗产 · 蜂蜜香料 · 意大利南部最佳白葡萄酒</p>
<section style="background:linear-gradient(135deg,#2a1a00,#4a3a10);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4B5;font-size:16px;line-height:1.9">菲亚诺（Fiano）是一种<strong style="color:#DAA520">拥有超过2000年历史的古老白葡萄品种</strong>，早在古罗马时期就被誉为"Vitis Apiana"（蜜蜂之葡萄），因为它的果实甜度极高，总能吸引蜜蜂。如今，来自坎帕尼亚大区阿韦利诺的<strong style="color:#DAA520">Fiano di Avellino DOCG</strong>被誉为意大利南部最卓越的白葡萄酒之一。</p>
</section>
<h3>🏺 一、历史传承</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>古罗马时代</h4><p style="color:#333;line-height:1.8;margin:0">老普林尼（Pliny the Elder）在公元1世纪的著作《自然史》中详细记载了这种葡萄酒。古罗马作家科卢梅拉（Columella）也提到"Vitis Apiana"是当时最受推崇的葡萄品种之一。这些文献表明，菲亚诺的种植历史至少可以追溯到2000年前。</p></div>
<div class="region-item"><h4>现代复兴</h4><p style="color:#333;line-height:1.8;margin:0">20世纪初，菲亚诺几乎被遗忘，仅在坎帕尼亚的一些家庭农场中零星种植。1960年代，安东尼奥·马斯特罗贝拉迪诺（Antonio Mastroberardino）等先驱开始复兴这一品种。1990年代获得DOCG地位后，菲亚诺重新进入国际视野，如今成为意大利南部白葡萄酒的标杆。</p></div>
</section>
<h3>🍇 二、品种与风土</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>菲亚诺品种特性</h4><p style="color:#333;line-height:1.8;margin:0">菲亚诺是一个芳香型品种，拥有独特的香气组合：<br/>• <strong>标志性香气：</strong>蜂蜜、洋甘菊、柠檬皮、榛子<br/>• <strong>次要香气：</strong>鼠尾草、迷迭香、薄荷、番红花<br/>• <strong>口感特点：</strong>中等酒体，酸度清爽，口感饱满丝滑<br/>• <strong>独特风味：</strong>尾韵带有微妙的香料和矿物感</p></div>
<div class="region-item"><h4>火山风土</h4><p style="color:#333;line-height:1.8;margin:0">Fiano di Avellino的葡萄园大多种植在海拔400-700米的<strong>火山土壤</strong>上（维苏威火山和坎皮佛莱格瑞火山的历史喷发沉积）。这些富含矿物质的土壤赋予葡萄酒独特的烟熏矿物感，是高酸度和陈年潜力的秘密所在。</p></div>
</section>
<h3>🏆 三、酒款类型</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<table>
<tr><th>类型</th><th>陈酿方式</th><th>风格描述</th></tr>
<tr><td>年轻Fiano</td><td>不锈钢罐</td><td>清新果味，柠檬、青苹果和蜂蜜，适合1-3年内饮用</td></tr>
<tr><td>橡木桶Fiano</td><td>法式或斯拉沃尼亚橡木桶</td><td>更加饱满，香草、榛子和蜂蜜风味，陈年潜力5-8年</td></tr>
<tr><td>Fiano di Avellino DOCG</td><td>至少12个月陈酿</td><td>最经典的风格，平衡果味与矿物感</td></tr>
<tr><td>Fiano Passito</td><td>风干葡萄</td><td>甜型，蜂蜜、杏干和蜜饯的浓郁风味</td></tr>
</table>
</section>
<h3>👃 四、品鉴与陈年</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>品鉴步骤</h4><p style="color:#333;line-height:1.8;margin:0"><strong>看：</strong>深邃的金黄色，略带琥珀光泽（陈年颜色加深）<br/><strong>闻：</strong>蜂蜜、洋甘菊、柠檬皮、鼠尾草、燧石、榛子<br/><strong>品：</strong>入口饱满丝滑，酸度清爽，蜂蜜和柑橘风味层层展开，尾韵带有杏仁和香料的苦甜感。优质Fiano的余味可持续30秒以上。</p></div>
<div class="region-item"><h4>陈年潜力</h4><p style="color:#333;line-height:1.8;margin:0">Fiano的抗氧化性强，陈年潜力在意大利白葡萄酒中出类拔萃：<br/>• <strong>入门级：</strong>1-3年<br/>• <strong>优质DOCG：</strong>5-10年<br/>• <strong>顶级酒款：</strong>10-15年甚至更久（陈年后发展出蜂蜜、蜜蜡和矿物的复杂层次）</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>那不勒斯海鲜：</strong>烤龙虾、蒜香蛤蜊、海鲜炖菜<br/>• <strong>坎帕尼亚特色菜：</strong>意大利面配香蒜酱和土豆、炸小牛肉排（Saltimbocca）<br/>• <strong>南瓜和蘑菇：</strong>菲亚诺的蜂蜜风味与南瓜的甜味完美呼应<br/>• <strong>陈年菲亚诺：</strong>搭配帕玛森奶酪36个月+或烤鸡</p></div>
</section>
<section style="background:linear-gradient(135deg,#2a1a00,#4a3a10);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFE4B5;font-size:16px;line-height:1.9">菲亚诺是意大利南部白葡萄酒的骄傲。<strong style="color:#DAA520">从古罗马的蜂蜜美酒到现代DOCG的标杆，它穿越两千年时光，依然保持着那份独特的魅力</strong>。如果你想探索意大利葡萄酒的深度与多样性，菲亚诺绝对不容错过。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏺 生成菲亚诺完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏺 ${date.chinese} 菲亚诺完全指南：古罗马的白葡萄酒遗产`,author:'红酒顾问',digest:'菲亚诺是拥有两千年历史的古老白葡萄品种，来自坎帕尼亚的Fiano di Avellino DOCG，被誉为意大利南部最佳白葡萄酒。',content:generateContent(),coverImage:'fiano_cover_ai.png',category:'wine-knowledge',tags:['菲亚诺','坎帕尼亚','意大利白葡萄酒','Fiano','阿韦利诺'],publishDate:date.full};
    const op = path.join(__dirname,'output',`fiano_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
