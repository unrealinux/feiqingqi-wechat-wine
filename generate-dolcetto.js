/**
 * 杜切托葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0520"/><stop offset="50%" style="stop-color:#2d0a35"/><stop offset="100%" style="stop-color:#0a0520"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#4B0082"/><stop offset="100%" style="stop-color:#9370DB"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(147,112,219,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#9370DB" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Piedmont, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#9370DB" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#9370DB"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#9370DB">杜切托</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利皮埃蒙特 · 杜切托 · 日常红葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"皮埃蒙特最平易近人的红葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">柔和单宁 · 果香充沛 · 日常百搭</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#9370DB" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','dolcetto_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#6A0DAD;margin:0 0 8px 0;font-size:16px}h3{color:#6A0DAD;border-bottom:2px solid #9370DB;padding-bottom:8px;margin-top:25px}</style>
<h2 style="text-align:center;color:#6A0DAD;">🍷 ${date.chinese} 杜切托完全指南：皮埃蒙特的快乐红酒</h2>
<p style="text-align:center;color:#666;">皮埃蒙特 · 杜切托 · 柔和单宁 · 日常百搭</p>
<section style="background:linear-gradient(135deg,#1a0520,#2d0a35);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">杜切托（Dolcetto）是<strong style="color:#9370DB">皮埃蒙特第三大红葡萄品种</strong>，紧随内比奥罗和巴贝拉之后。它的名字在意大利语中意为"小甜心"——尽管酿造出的葡萄酒是干型的，但其柔和的口感和充沛的果香确实令人愉悦。如果说巴罗洛是皮埃蒙特的国王，巴贝拉是农民，那么杜切托就是<strong style="color:#9370DB">每个人都能享受的快乐之酒</strong>。</p>
</section>
<h3>🍇 一、杜切托葡萄</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>品种特点</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>名称由来：</strong>"Dolcetto"意为"小甜心"，指葡萄本身含糖量高<br/>• <strong>单宁：</strong>低到中等，柔和易饮<br/>• <strong>酸度：</strong>适中<br/>• <strong>香气：</strong>黑樱桃、蓝莓、紫罗兰、甘草<br/>• <strong>早熟：</strong>比内比奥罗早熟2-3周<br/>• <strong>风格：</strong>年轻活泼，适合在1-3年内饮用</p></div>
</section>
<h3>🏛️ 二、主要产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Dolcetto d'Alba DOC</h4><p style="color:#333;line-height:1.8;margin:0">最著名的杜切托产区，产自Alba周边。风格优雅，果香精致，品质最高。</p></div>
<div class="region-item"><h4>Dolcetto di Dogliani DOCG</h4><p style="color:#333;line-height:1.8;margin:0">唯一的DOCG级别杜切托，风格更加饱满浓郁。</p></div>
<div class="region-item"><h4>Dolcetto di Diano d'Alba DOC</h4><p style="color:#333;line-height:1.8;margin:0">以优雅和矿物感著称，性价比高。</p></div>
</section>
<h3>🍷 三、品鉴与配餐</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>品鉴要点</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>颜色：</strong>深宝石红到紫红色<br/>• <strong>香气：</strong>黑樱桃、蓝莓、紫罗兰、甘草、杏仁<br/>• <strong>口感：</strong>柔软顺滑，单宁低，果味浓郁<br/>• <strong>余味：</strong>带有标志性的苦甜味<br/>• <strong>适饮温度：</strong>14-16°C</p></div>
<div class="region-item"><h4>配餐建议</h4><p style="color:#333;line-height:1.8;margin:0">杜切托的低单宁和高果香使其成为许多中式菜肴的绝配：<br/>• <strong>中式：</strong>烤鸭、叉烧、红烧肉、宫保鸡丁<br/>• <strong>意式：</strong>披萨、意大利面、冷切肉盘<br/>• <strong>日常：</strong>各类BBQ、台式卤肉饭</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0520,#2d0a35);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">杜切托是皮埃蒙特最平易近人的红葡萄酒。<strong style="color:#9370DB">简单快乐，不需要复杂的技巧来欣赏</strong>——开瓶即饮，就是与朋友分享的美好时光。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成杜切托完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 杜切托完全指南：皮埃蒙特的快乐红酒`,author:'红酒顾问',digest:'杜切托是皮埃蒙特的第三大红葡萄品种，以柔和单宁和充沛果香著称。本文详解品种特点、核心产区及日常配餐。',content:generateContent(),coverImage:'dolcetto_cover_ai.png',category:'wine-knowledge',tags:['杜切托','皮埃蒙特','意大利葡萄酒','Dolcetto'],publishDate:date.full};
    const op = path.join(__dirname,'output',`dolcetto_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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