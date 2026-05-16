/**
 * 潘泰莱里亚帕赛托甜酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2a1a00"/><stop offset="50%" style="stop-color:#4a2a00"/><stop offset="100%" style="stop-color:#1a0a00"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#FF8C00"/><stop offset="100%" style="stop-color:#FFA500"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(255,165,0,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF8C00" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sicily, Italy · Pantelleria DOC</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF8C00" filter="url(#g)">☀️</text><rect x="20" y="130" width="500" height="2" fill="#FF8C00"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF8C00">潘泰莱里亚帕赛托</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">西西里 · 地中海风干的琼浆玉液</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"地中海最甜蜜的拥抱"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">泽比波葡萄酿造的黄金甘露</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF8C00" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','passito_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#FF8C00;margin:0 0 8px 0;font-size:16px}h3{color:#FF8C00;border-bottom:2px solid #FFA500;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#FF8C00;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#FF8C00;">☀️ ${date.chinese} 潘泰莱里亚帕赛托完全指南</h2>
<p style="text-align:center;color:#666;">西西里 · 世界遗产葡萄园 · 泽比波 · 地中海的黄金甘露</p>
<section style="background:linear-gradient(135deg,#2a1a00,#4a2a00);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">潘泰莱里亚帕赛托（Passito di Pantelleria）是<strong style="color:#FFA500">意大利最珍贵的甜葡萄酒之一</strong>，产自西西里岛和突尼斯之间的火山岛——潘泰莱里亚。使用当地称为Zibibbo（即亚历山大麝香葡萄）的葡萄，通过传统风干工艺酿造，这款甜酒拥有<strong style="color:#FFA500">令人陶醉的异域香气和甜蜜口感</strong>。潘泰莱里亚的"矮藤葡萄园"（Vite ad Alberello）是联合国教科文组织世界遗产。</p>
</section>
<h3>🏝️ 一、潘泰莱里亚岛</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>火山岛风土</h4><p style="color:#333;line-height:1.8;margin:0">潘泰莱里亚位于西西里岛和突尼斯之间的地中海中央，距离非洲大陆仅70公里。这座火山岛拥有独特的气候——持续不断的海风、充足的日照和极少的降雨。土壤以火山岩为主，多孔且富含矿物质。葡萄藤在极端条件下生长紧密贴近地面，形成独特的"矮藤"（Alberello）栽培方式。</p></div>
<div class="region-item"><h4>世界遗产</h4><p style="color:#333;line-height:1.8;margin:0">2014年，潘泰莱里亚的"矮藤葡萄园"（Vite ad Alberello di Pantelleria）被联合国教科文组织列为<strong>世界非物质文化遗产</strong>。这种栽培方式中，葡萄藤被修剪成低矮的灌木状（仅20-40厘米高），以抵御地中海强风的侵袭。</p></div>
</section>
<h3>🍇 二、酿造工艺</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>泽比波（Zibibbo）</h4><p style="color:#333;line-height:1.8;margin:0">泽比波是亚历山大麝香葡萄（Muscat of Alexandria）在意大利的名字，是世界上最古老的葡萄品种之一。它拥有浓郁的甜香——橙花、蜂蜜、杏子和热带水果的混合香气。在潘泰莱里亚，它展现出与其他地区截然不同的风味和深度。</p></div>
<div class="region-item"><h4>风干工艺（Passito）</h4><p style="color:#333;line-height:1.8;margin:0">帕赛托酿造的核心工艺是葡萄风干：<br/>1. 采收完全成熟的泽比波葡萄<br/>2. 将葡萄铺在竹席上在阳光下晾晒20-30天<br/>3. 葡萄失去约30-40%的水分，糖分高度浓缩<br/>4. 缓慢发酵至酒精度达到14-15%，保留大量天然残糖<br/>5. 在橡木桶或不锈钢罐中陈酿6-12个月</p></div>
</section>
<h3>🏆 三、酒款等级</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<table>
<tr><th>酒款</th><th>特点</th></tr>
<tr><td>Pantelleria DOC</td><td>干型、半干型或甜型泽比波，新鲜果味</td></tr>
<tr><td>Passito di Pantelleria DOC</td><td>风干甜酒，至少陈酿6个月，售价通常在200-600元</td></tr>
<tr><td>Passito di Pantelleria Liquoroso</td><td>加强型甜酒，酒精度更高（17-20%），更加浓郁</td></tr>
<tr><td>Moscato Passito di Pantelleria</td><td>强调麝香葡萄的品种特性，更加芳香</td></tr>
</table>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>帕赛托品鉴</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>深金黄色至琥珀色，带有金色光泽<br/><strong>香气：</strong>杏干、蜂蜜、橙花、无花果、葡萄干、蜜饯、柑橘、香草、异域香料<br/><strong>口感：</strong>入口甜美醇厚，酸度适中平衡甜味，口感丝滑浓郁，余味悠长<br/><strong>侍酒温度：</strong>12-14°C<br/><strong>陈年潜力：</strong>优质帕赛托可陈年10-20年，发展出更复杂的焦糖和坚果风味</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>搭配建议</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>甜点：</strong>杏仁饼干、意式奶冻、水果挞、奶酪蛋糕<br/>• <strong>奶酪：</strong>蓝纹奶酪（戈贡佐拉）、陈年佩科里诺<br/>• <strong>搭配鹅肝酱：</strong>顶级体验<br/>• <strong>雪茄：</strong>与优质雪茄是绝配<br/>• <strong>单独享用：</strong>作为餐后酒其实是最完美的享用方式</p></div>
</section>
<section style="background:linear-gradient(135deg,#2a1a00,#4a2a00);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">帕赛托·迪·潘泰莱里亚是意大利甜葡萄酒的巅峰之作。<strong style="color:#FFA500">每一滴金黄色的酒液都是地中海阳光、火山土壤和数百年传统的结晶</strong>。无论是搭配甜点还是独自品味，这款来自地中海的黄金甘露都能为你带来无与伦比的甜蜜享受。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n☀️ 生成潘泰莱里亚帕赛托完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`☀️ ${date.chinese} 潘泰莱里亚帕赛托完全指南：地中海的黄金甘露`,author:'红酒顾问',digest:'潘泰莱里亚帕赛托是意大利最珍贵的甜葡萄酒之一，来自西西里附近的火山岛，使用风干泽比波葡萄酿造。',content:generateContent(),coverImage:'passito_cover_ai.png',category:'wine-knowledge',tags:['帕赛托','潘泰莱里亚','甜葡萄酒','意大利甜酒','泽比波','Passito'],publishDate:date.full};
    const op = path.join(__dirname,'output',`passito_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
