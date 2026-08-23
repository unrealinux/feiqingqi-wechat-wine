/**
 * 维尔迪基奥白葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a2a1a"/><stop offset="50%" style="stop-color:#1a4a3a"/><stop offset="100%" style="stop-color:#0a1a2a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#C0C0C0"/><stop offset="100%" style="stop-color:#E8E8D0"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="80" r="170" fill="rgba(192,192,192,0.06)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#C0C0C0" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Marche, Italy · Verdicchio DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#C0C0C0" filter="url(#g)">🌿</text><rect x="20" y="130" width="500" height="2" fill="#C0C0C0"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#C0C0C0">维尔迪基奥</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">马尔凯 · 意大利最佳白葡萄酒之一</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"海鲜的完美伴侣，陈年潜力惊人"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">亚得里亚海畔的明珠</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#C0C0C0" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','verdicchio_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#2F4F4F;margin:0 0 8px 0;font-size:16px}h3{color:#2F4F4F;border-bottom:2px solid #C0C0C0;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#2F4F4F;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#2F4F4F;">🌿 ${date.chinese} 维尔迪基奥完全指南</h2>
<p style="text-align:center;color:#666;">马尔凯 · 意大利顶级白葡萄酒 · 海鲜绝配 · 惊人的陈年潜力</p>
<section style="background:linear-gradient(135deg,#0a2a1a,#1a4a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E0F0E0;font-size:16px;line-height:1.9">维尔迪基奥（Verdicchio）被公认为<strong style="color:#C0C0C0">意大利最伟大的白葡萄品种之一</strong>，名字源自意大利语"verde"（绿色），象征着它标志性的绿色光泽。来自意大利中部马尔凯大区的维尔迪基奥，以其<strong style="color:#C0C0C0">清爽的酸度、迷人的杏仁尾韵和惊人的陈年潜力</strong>在国际上赢得了极高声誉。</p>
</section>
<h3>🗺️ 一、产区分级</h3>
<section style="background:#F0FFF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>Verdicchio dei Castelli di Jesi DOCG</h4><p style="color:#333;line-height:1.8;margin:0">耶西城堡的维尔迪基奥是<strong>最具代表性的子产区</strong>，也是第一个获得DOCG地位的维尔迪基奥产区。这里的土壤以石灰岩和黏土为主，葡萄酒展现出柑橘、白花和典型的杏仁苦味。分为Classico（经典）和Superiore（超级）两种级别。产量占维尔迪基奥总产量的80%以上。</p></div>
<div class="region-item"><h4>Verdicchio di Matelica DOCG</h4><p style="color:#333;line-height:1.8;margin:0">马泰利卡的维尔迪基奥产量更小，海拔更高（250-400米），气候更为凉爽。这里的葡萄酒<strong>酸度更高、结构更紧致</strong>，陈年潜力更加出色，被认为是意大利陈年能力最强的白葡萄酒之一。优质酒款可陈年10-20年甚至更久。</p></div>
</section>
<h3>🍇 二、维尔迪基奥品种特点</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>特点</th><th>描述</th></tr>
<tr><td>色泽</td><td>淡稻草黄色，带有绿色光泽</td></tr>
<tr><td>香气</td><td>柠檬、青苹果、白花、杏仁、草本、矿物</td></tr>
<tr><td>酸度</td><td>高酸度，清爽爽脆</td></tr>
<tr><td>酒体</td><td>轻盈至中等</td></tr>
<tr><td>标志性风味</td><td>独特的杏仁苦味（mandorla amara）</td></tr>
<tr><td>陈年潜力</td><td>普通级：2-4年；Riserva：5-15年+</td></tr>
<tr><td>酒精度</td><td>12.5%-14%</td></tr>
</table>
</section>
<h3>🏆 三、酒款风格</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>年轻维尔迪基奥（当年-2年）</h4><p style="color:#333;line-height:1.8;margin:0">这是最常见的风格。不锈钢罐发酵和短期陈酿，保持了葡萄的原始果香和酸度。适合作为开胃酒或搭配海鲜。香气以柠檬、青苹果和白色花朵为主，口感清爽活泼。</p></div>
<div class="region-item"><h4>陈年维尔迪基奥（4年+）</h4><p style="color:#333;line-height:1.8;margin:0">经过橡木桶或瓶中陈年后，酒体变得更加饱满，发展出蜂蜜、烤杏仁、蜜蜡和白蘑菇的复杂香气。酸度依然坚挺，但口感更加圆润。这是意大利最被低估的陈年白葡萄酒之一。</p></div>
<div class="region-item"><h4>维尔迪基奥 Passito</h4><p style="color:#333;line-height:1.8;margin:0">使用风干葡萄酿造的甜型版本，产量极低。带有杏干、蜂蜜、橙花和蜜饯的浓郁风味，酸甜平衡出众，适合搭配蓝纹奶酪或水果甜点。</p></div>
</section>
<h3>🍽️ 四、美食搭配</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<table>
<tr><th>食物</th><th>推荐搭配</th></tr>
<tr><td>生蚝/海鲜拼盘</td><td>入门级Verdicchio，冰镇饮用</td></tr>
<tr><td>炸海鲜（Frittura）</td><td>Verdicchio Classico，清爽酸度</td></tr>
<tr><td>青酱意面（Pesto）</td><td>马泰利卡Verdicchio，草本香气呼应</td></tr>
<tr><td>白肉沙拉</td><td>年轻Verdicchio</td></tr>
<tr><td>烤鱼配柠檬黄油酱</td><td>陈年橡木桶Verdicchio</td></tr>
<tr><td>陈年佩科里诺奶酪</td><td>陈年Riserva风格</td></tr>
</table>
</section>
<section style="background:linear-gradient(135deg,#0a2a1a,#1a4a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E0F0E0;font-size:16px;line-height:1.9">维尔迪基奥是意大利白葡萄酒中的一颗明珠。<strong style="color:#C0C0C0">它不仅能完美搭配各类海鲜，更有着不输顶级红葡萄酒的陈年能力</strong>。如果你只认识灰皮诺和长相思，那么现在就来探索这款来自亚得里亚海畔的惊喜吧。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌿 生成维尔迪基奥完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌿 ${date.chinese} 维尔迪基奥完全指南：意大利最被低估的白葡萄酒`,author:'红酒顾问',digest:'维尔迪基奥被公认为意大利最伟大的白葡萄品种之一，拥有惊人的陈年潜力和完美的海鲜搭配能力。',content:generateContent(),coverImage:'verdicchio_cover_ai.png',category:'wine-knowledge',tags:['维尔迪基奥','马尔凯','意大利白葡萄酒','Verdicchio','耶西城堡'],publishDate:date.full};
    const op = path.join(__dirname,'output',`verdicchio_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
