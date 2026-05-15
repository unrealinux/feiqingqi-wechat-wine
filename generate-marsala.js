/**
 * 马萨拉加强型葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2d1a0a"/><stop offset="50%" style="stop-color:#4a2a1a"/><stop offset="100%" style="stop-color:#1a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#D2691E"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(210,105,30,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#D2691E" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sicily, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#D2691E" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#D2691E"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#D2691E">马萨拉</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利西西里 · 加强型葡萄酒 · 传奇历史</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"英国人在西西里创造的意大利经典"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">从餐后酒到提拉米苏的必备之选</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D2691E" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','marsala_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B4513;margin:0 0 8px 0;font-size:16px}h3{color:#8B4513;border-bottom:2px solid #D2691E;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B4513;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B4513;">🍷 ${date.chinese} 马萨拉完全指南：西西里的传奇加强酒</h2>
<p style="text-align:center;color:#666;">西西里 · 加强型 · 英国人的遗产 · 提拉米苏的灵魂</p>
<section style="background:linear-gradient(135deg,#2d1a0a,#4a2a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">马萨拉（Marsala）是<strong style="color:#D2691E">西西里岛最著名的加强型葡萄酒</strong>，有着一段传奇的历史——由18世纪的英国商人约翰·伍德豪斯（John Woodhouse）在偶然中发现并推广至全球。与雪莉酒和波特酒并称为世界三大加强型葡萄酒，马萨拉也是意大利烹饪中的灵魂食材——<strong style="color:#D2691E">提拉米苏的核心配料</strong>。本文将带你探索马萨拉的精彩世界。</p>
</section>
<h3>📜 一、传奇历史</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>英国人的发现</h4><p style="color:#333;line-height:1.8;margin:0">1773年，英国商人约翰·伍德豪斯在航行中经过西西里马萨拉港，品尝到当地的葡萄酒后深受震撼。他意识到这种酒经过加强和运输后会变得更加美味。1776年，他回到马萨拉建立了第一个马萨拉酒庄，开始向英国出口。</p></div>
<div class="region-item"><h4>加里波第的选择</h4><p style="color:#333;line-height:1.8;margin:0">1860年，意大利统一英雄加里波第率领千人军团登陆西西里时，选择马萨拉作为军队的日常饮品。这一事件极大提升了马萨拉在意大利的声望。</p></div>
</section>
<h3>🍇 二、酿造与分类体系</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">马萨拉采用格里洛（Grillo）、卡塔拉托（Catarratto）和英佐利亚（Inzolia）等白葡萄酿造，通过加入中性葡萄烈酒（加强）来终止发酵，保留天然糖分。</p>
<div class="region-item"><h4>按颜色分类</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Oro（金色）：</strong>使用白葡萄酿造，颜色金黄<br/>• <strong>Ambra（琥珀色）：</strong>添加了浓缩葡萄汁，颜色呈琥珀色<br/>• <strong>Rubino（宝石红）：</strong>使用红葡萄品种如黑达沃拉，颜色呈红色</p></div>
<div class="region-item"><h4>按甜度分类</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Secco（干型）：</strong>含糖量低于40g/L<br/>• <strong>Semi-Secco（半干）：</strong>含糖量40-100g/L<br/>• <strong>Dolce（甜型）：</strong>含糖量超过100g/L</p></div>
<div class="region-item"><h4>按陈年分类</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Fine（普通）：</strong>至少陈酿1年<br/>• <strong>Superiore（超级）：</strong>至少陈酿2年<br/>• <strong>Superiore Riserva（超级珍藏）：</strong>至少陈酿4年<br/>• <strong>Vergine/Soleras（索雷拉）：</strong>至少陈酿5年，使用索雷拉系统陈酿<br/>• <strong>Vergine Stravecchio（特陈）：</strong>至少陈酿10年</p></div>
</section>
<h3>👃 三、品鉴要点</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>典型香气</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>干型：</strong>杏仁、核桃、干果、烟草、皮革<br/>• <strong>甜型：</strong>杏干、无花果、蜂蜜、焦糖、巧克力<br/>• <strong>陈年：</strong>更复杂的雪茄盒、咖啡、黑巧克力和陈年香脂的风味</p></div>
<div class="region-item"><h4>口感特点</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>酒体：</strong>中等到饱满<br/>• <strong>酸度：</strong>清爽，平衡甜味<br/>• <strong>酒精度：</strong>通常17-20%<br/>• <strong>余味：</strong>持久，带有坚果和焦糖的风味</p></div>
</section>
<h3>🍽️ 四、用餐与烹饪</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>饮用建议</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>开胃酒：</strong>干型马萨拉冰镇后饮用，搭配坚果和橄榄<br/>• <strong>餐后酒：</strong>甜型马萨拉搭配奶酪或巧克力甜点<br/>• <strong>搭配雪茄：</strong>Vergine风格的陈年马萨拉是雪茄的最佳伴侣</p></div>
<div class="region-item"><h4>烹饪用途</h4><p style="color:#333;line-height:1.8;margin:0">马萨拉是意大利厨房的必备食材：<br/>• <strong>提拉米苏：</strong>正宗提拉米苏的秘密配料<br/>• <strong>马萨拉鸡肉：</strong>经典的西西里菜肴<br/>• <strong>酱汁：</strong>为蘑菇酱和肉酱增添深度<br/>• <strong>甜点：</strong>搭配意式奶冻和烤水果</p></div>
</section>
<section style="background:linear-gradient(135deg,#2d1a0a,#4a2a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">马萨拉是西西里岛献给世界的美酒。无论作为餐前开胃、餐后享用还是烹饪调料，<strong style="color:#D2691E">这款来自地中海的琥珀色佳酿都能为生活增添一抹西西里的阳光</strong>。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成马萨拉完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 马萨拉完全指南：西西里的传奇加强酒`,author:'红酒顾问',digest:'马萨拉与雪莉和波特并称世界三大加强型葡萄酒，也是提拉米苏的灵魂配料。本文详解传奇历史、分类体系及烹饪用途。',content:generateContent(),coverImage:'marsala_cover_ai.png',category:'wine-knowledge',tags:['马萨拉','西西里','意大利葡萄酒','加强型葡萄酒','Marsala'],publishDate:date.full};
    const op = path.join(__dirname,'output',`marsala_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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