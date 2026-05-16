/**
 * 蓝布鲁斯科完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a0a"/><stop offset="50%" style="stop-color:#3a1a1a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#DC143C"/><stop offset="100%" style="stop-color:#FF69B4"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="80" r="180" fill="rgba(220,20,60,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DC143C" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Emilia-Romagna, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DC143C" filter="url(#g)">🫧</text><rect x="20" y="130" width="500" height="2" fill="#DC143C"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DC143C">蓝布鲁斯科</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">艾米利亚-罗马涅 · 意大利的快乐气泡</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"被误解多年的意大利国民起泡酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">披萨和帕尔玛火腿的终极搭档</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DC143C" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','lambrusco_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#DC143C;margin:0 0 8px 0;font-size:16px}h3{color:#DC143C;border-bottom:2px solid #FF69B4;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#DC143C;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#DC143C;">🫧 ${date.chinese} 蓝布鲁斯科完全指南</h2>
<p style="text-align:center;color:#666;">艾米利亚-罗马涅 · 红起泡酒 · 披萨绝配 · 复兴的意大利经典</p>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">蓝布鲁斯科（Lambrusco）是<strong style="color:#DC143C">意大利最受欢迎的微起泡红葡萄酒</strong>，产自艾米利亚-罗马涅大区。它拥有悠久的历史——古罗马人就已经在饮用这种带着轻微气泡的红葡萄酒。在20世纪70-80年代，蓝布鲁斯科曾风靡全球，<strong style="color:#DC143C">比任何意大利葡萄酒都畅销</strong>。如今，高品质的蓝布鲁斯科正在经历一场精彩的复兴。</p>
</section>
<h3>🍇 一、蓝布鲁斯科家族</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>七大子品种</h4><p style="color:#333;line-height:1.8;margin:0">蓝布鲁斯科实际上是一个葡萄家族，有7个主要的子品种：<br/>• <strong>Lambrusco Grasparossa：</strong>最优质的单宁结构，色泽最深<br/>• <strong>Lambrusco Salamino：</strong>果味最浓郁，带有红色浆果的风味<br/>• <strong>Lambrusco Sorbara：</strong>最芳香、最优雅，颜色较浅，最为精致<br/>• <strong>Lambrusco Maestri：</strong>经典风格，平衡柔和<br/>• <strong>Lambrusco Marani：</strong>柔和果味，适合日常饮用<br/>• <strong>Lambrusco Montericco：</strong>结构性较强<br/>• <strong>Lambrusco Viadanese：</strong>产量极少</p></div>
</section>
<h3>🏆 二、DOC等级</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>DOCG/DOC</th><th>主要品种</th><th>风格特点</th></tr>
<tr><td>Lambrusco di Sorbara DOCG</td><td>Sorbara</td><td>最优雅，浅色花香，酸度高，气泡细腻</td></tr>
<tr><td>Lambrusco Grasparossa di Castelvetro DOCG</td><td>Grasparossa</td><td>最深色，单宁结构，黑果风味</td></tr>
<tr><td>Lambrusco Salamino di Santa Croce DOCG</td><td>Salamino</td><td>果味充沛，经典蓝布鲁斯科风格</td></tr>
<tr><td>Lambrusco Reggiano DOC</td><td>多种混合</td><td>最常见，适合日常饮用</td></tr>
</table>
</section>
<h3>🫧 三、风格类型</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<div class="region-item"><h4>按甜度</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Secco（干型）：</strong>残糖<15g/L，越来越受欢迎的高端风格<br/>• <strong>Semisecco（半干）：</strong>残糖15-45g/L，最传统和常见的风格<br/>• <strong>Dolce（甜型）：</strong>残糖>45g/L，适合不太喜欢干型葡萄酒的饮用者</p></div>
<div class="region-item"><h4>按气泡</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Frizzante（微起泡）：</strong>使用查马法（Charmat Method）二次发酵，压力较低，约占95%<br/>• <strong>Spumante（全起泡）：</strong>压力更高，气泡更丰富，产量较少但正在增长</p></div>
</section>
<h3>👃 四、品鉴指南</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>品鉴特征</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>从淡宝石红到深紫红色，取决于品种和酿造方式<br/><strong>香气：</strong>紫罗兰、野莓、黑樱桃、覆盆子、草莓（Sorbara品种尤其花香突出）<br/><strong>口感：</strong>活跃的气泡，清爽的酸度，果味纯净，单宁柔和，余味清新<br/><strong>侍酒温度：</strong>8-12°C，充分冰镇</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">蓝布鲁斯科是<strong>美食全能型选手</strong>，尤其适合：<br/>• <strong>意大利美食：</strong>披萨、意大利肉酱面、帕尔玛火腿配蜜瓜<br/>• <strong>艾米利亚特色：</strong>帕尔玛奶酪、博洛尼亚肉酱、Cotechino香肠<br/>• <strong>中日料理：</strong>蓝布鲁斯科的酸度和气泡完美匹配中餐和日料的多样性<br/>• <strong>熟食拼盘：</strong>各种萨拉米和冷切肉<br/>• <strong>烧烤：</strong>清爽的气泡能中和烧烤的油腻感</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">蓝布鲁斯科是意大利人餐桌上的快乐源泉。<strong style="color:#DC143C">不要再把它当成廉价的甜汽水——高品质的蓝布鲁斯科是葡萄酒世界中最有趣、最适合搭配食物的红起泡酒之一</strong>。下一顿披萨或者中餐，试试搭配一瓶冰镇的蓝布鲁斯科吧！</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🫧 生成蓝布鲁斯科完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🫧 ${date.chinese} 蓝布鲁斯科完全指南：意大利国民起泡酒的复兴`,author:'红酒顾问',digest:'蓝布鲁斯科是意大利最受欢迎的红起泡酒，也是被低估的美食搭档。了解这款快乐气泡的真正魅力。',content:generateContent(),coverImage:'lambrusco_cover_ai.png',category:'wine-knowledge',tags:['蓝布鲁斯科','艾米利亚-罗马涅','意大利起泡酒','Lambrusco','红起泡酒'],publishDate:date.full};
    const op = path.join(__dirname,'output',`lambrusco_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
