/**
 * 维多利亚切拉索罗完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2a0a1a"/><stop offset="50%" style="stop-color:#4a1a2a"/><stop offset="100%" style="stop-color:#1a0a0a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#DB7093"/><stop offset="100%" style="stop-color:#FF69B4"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(255,105,180,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF69B4" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sicily, Italy · Cerasuolo di Vittoria DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF69B4" filter="url(#g)">🌸</text><rect x="20" y="130" width="500" height="2" fill="#FF69B4"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF69B4">维多利亚切拉索罗</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">西西里 · 唯一的DOCG · 樱花般的红葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"西西里唯一DOCG产区的迷人樱花红"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">黑达沃拉与弗拉帕托的完美混酿</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF69B4" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','cerasuolo_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#DB7093;margin:0 0 8px 0;font-size:16px}h3{color:#DB7093;border-bottom:2px solid #FF69B4;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#DB7093;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#DB7093;">🌸 ${date.chinese} 维多利亚切拉索罗完全指南</h2>
<p style="text-align:center;color:#666;">西西里 · 唯一DOCG · 黑达沃拉×弗拉帕托 · 迷人的樱花红色</p>
<section style="background:linear-gradient(135deg,#2a0a1a,#4a1a2a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">切拉索罗·迪·维多利亚（Cerasuolo di Vittoria）是<strong style="color:#FF69B4">西西里岛唯一的DOCG级葡萄酒</strong>。"Cerasuolo"在意大利语中意为"樱桃红"，恰如其分地描述了这款葡萄酒迷人的浅红色泽。它是<strong style="color:#FF69B4">西西里两大本土品种——黑达沃拉（Nero d'Avola）和弗拉帕托（Frappato）的完美联姻</strong>。</p>
</section>
<h3>🌸 一、命名与历史</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>名字的含义</h4><p style="color:#333;line-height:1.8;margin:0">"Cerasuolo"源自意大利语"ciliegia"（樱桃），指葡萄酒明亮的樱桃红色。这与名称中带有"Rosato"的桃红酒不同——切拉索罗是真正的红葡萄酒，只是颜色较浅。它位于红葡萄酒和桃红葡萄酒之间，是西西里特有的风格。</p></div>
<div class="region-item"><h4>维多利亚市</h4><p style="color:#333;line-height:1.8;margin:0">维多利亚（Vittoria）是位于西西里东南部拉古萨省的城市，是该产区的核心。这里是西西里葡萄种植历史最悠久的地区之一，拥有理想的地中海气候和富含石灰岩的土壤。2005年获得DOCG认证。</p></div>
</section>
<h3>🍇 二、混酿品种</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>品种</th><th>比例</th><th>贡献</th></tr>
<tr><td>黑达沃拉（Nero d'Avola）</td><td>50-70%</td><td>结构、颜色、酒体、黑果风味</td></tr>
<tr><td>弗拉帕托（Frappato）</td><td>30-50%</td><td>香气优雅、红果风味、酸度、轻盈感</td></tr>
</table>
<div class="region-item"><h4>弗拉帕托的特殊地位</h4><p style="color:#333;line-height:1.8;margin:0">弗拉帕托是切拉索罗的灵魂。这个西西里本土品种酿造出极为芳香、轻盈优雅的葡萄酒，带有草莓、覆盆子和紫罗兰的迷人香气。正是弗拉帕托赋予了这款酒独特的飘逸感和花香，让它成为意大利最迷人的红葡萄酒之一。</p></div>
</section>
<h3>👃 三、品鉴特征</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>品鉴笔记</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>明亮的浅宝石红色，边缘带有樱桃粉色调<br/><strong>香气：</strong>红樱桃、草莓、覆盆子、紫罗兰、玫瑰花瓣、地中海草本、石榴<br/><strong>口感：</strong>酒体轻盈至中等，酸度清爽鲜活，单宁柔和细腻，果味纯净，余味欢快<br/><strong>酒精度：</strong>12.5-13.5%，轻盈可口<br/><strong>侍酒温度：</strong>14-16°C，稍微冰镇口感更佳</p></div>
</section>
<h3>🏆 四、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>西西里美食搭配</h4><p style="color:#333;line-height:1.8;margin:0">切拉索罗是西西里最具食物友好性的葡萄酒：<br/>• <strong>意大利面：</strong>番茄酱意面、西西里香蒜酱意面<br/>• <strong>海鲜：</strong>金枪鱼、剑鱼、烤章鱼<br/>• <strong>披萨：</strong>玛格丽特披萨、海鲜披萨<br/>• <strong>冷切肉：</strong>意大利火腿、萨拉米<br/>• <strong>奶酪：</strong>新鲜马苏里拉、里科塔奶酪<br/>• <strong>中餐：</strong>清淡的中式菜肴非常搭配</p></div>
</section>
<section style="background:linear-gradient(135deg,#2a0a1a,#4a1a2a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">切拉索罗·迪·维多利亚是西西里葡萄酒的一颗宝石。<strong style="color:#FF69B4">它的迷人之处在于轻盈与浓郁之间的完美平衡——既有黑达沃拉的结构，又有弗拉帕托的优雅花香</strong>。无论搭配美食还是独自享用，这款樱花红色的葡萄酒总能带来惊喜。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌸 生成维多利亚切拉索罗完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌸 ${date.chinese} 维多利亚切拉索罗完全指南：西西里唯一的DOCG`,author:'红酒顾问',digest:'切拉索罗是西西里岛唯一的DOCG葡萄酒，以迷人的樱桃红色和优雅的花香著称，是黑达沃拉与弗拉帕托的完美混酿。',content:generateContent(),coverImage:'cerasuolo_cover_ai.png',category:'wine-knowledge',tags:['切拉索罗','维多利亚','西西里','意大利DOCG','Cerasuolo'],publishDate:date.full};
    const op = path.join(__dirname,'output',`cerasuolo_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
