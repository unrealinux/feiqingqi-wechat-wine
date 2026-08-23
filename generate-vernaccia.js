/**
 * 圣吉米尼亚诺维纳恰完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2a2a00"/><stop offset="50%" style="stop-color:#4a4a10"/><stop offset="100%" style="stop-color:#1a1a00"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#DAA520"/><stop offset="100%" style="stop-color:#FFD700"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(255,215,0,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DAA520" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Tuscany, Italy · Vernaccia di San Gimignano DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DAA520" filter="url(#g)">🏰</text><rect x="20" y="130" width="500" height="2" fill="#DAA520"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DAA520">圣吉米尼亚诺维纳恰</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">托斯卡纳 · 但丁赞美的白葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利第一个DOCG白葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">中世纪塔楼之城的白色珍珠</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','vernaccia_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}h3{color:#B8860B;border-bottom:2px solid #DAA520;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B8860B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B8860B;">🏰 ${date.chinese} 圣吉米尼亚诺维纳恰完全指南</h2>
<p style="text-align:center;color:#666;">托斯卡纳 · 意大利第一款DOCG白葡萄酒 · 但丁曾赞美 · 塔楼之城</p>
<section style="background:linear-gradient(135deg,#2a2a00,#4a4a10);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFFACD;font-size:16px;line-height:1.9">维纳恰（Vernaccia di San Gimignano）是<strong style="color:#DAA520">意大利历史上第一款DOCG白葡萄酒</strong>（1966年获得DOC，1993年获得DOCG），也是托斯卡纳唯一一款DOCG级别的白葡萄酒。至今已有<strong style="color:#DAA520">超过800年的历史</strong>——伟大诗人但丁在《神曲》中就曾提到过它。</p>
</section>
<h3>🏰 一、历史传承</h3>
<section style="background:#FFFFF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>但丁的赞美</h4><p style="color:#333;line-height:1.8;margin:0">在但丁·阿利吉耶里的《神曲·炼狱篇》中，他写道："...e la Vernaccia di San Gimignano..."（...还有圣吉米尼亚诺的维纳恰...）。这是意大利文学巨匠对这款白葡萄酒的特别致敬，也证明了维纳恰在中世纪时期就已享有盛誉。</p></div>
<div class="region-item"><h4>教皇与国王的钟爱</h4><p style="color:#333;line-height:1.8;margin:0">几个世纪以来，维纳恰一直是教皇和欧洲皇室的最爱。教皇马丁四世据说对此酒爱不释手。文艺复兴时期，佛罗伦萨的贵族们也将维纳恰作为宴会上的首选白葡萄酒。</p></div>
</section>
<h3>🍇 二、品种与风土</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>维纳恰品种</h4><p style="color:#333;line-height:1.8;margin:0">维纳恰是一种古老的本地白葡萄品种，其名称可能源自拉丁语"vernaculus"（本地的）。品种特征：<br/>• 产量中等，成熟期适中<br/>• 良好的酸度和矿物感<br/>• 标志性的苦杏仁尾韵<br/>• 具有独特的燧石和矿物香气</p></div>
<div class="region-item"><h4>圣吉米尼亚诺风土</h4><p style="color:#333;line-height:1.8;margin:0">圣吉米尼亚诺是托斯卡纳最具标志性的中世纪城镇，以其众多的塔楼而闻名。葡萄园分布在海拔200-350米的丘陵上，土壤由<strong>富含化石的石灰岩和砂质黏土</strong>组成。这种土壤赋予葡萄酒独特的矿物感和优雅的结构。</p></div>
</section>
<h3>👃 三、品鉴指南</h3>
<section style="background:#FAFAD2;padding:18px;border-radius:8px">
<table>
<tr><th>维度</th><th>描述</th></tr>
<tr><td>色泽</td><td>淡稻草黄，带有绿色光泽</td></tr>
<tr><td>香气</td><td>柠檬、金苹果、青杏仁、白花、洋甘菊、燧石、香草</td></tr>
<tr><td>口感</td><td>中等酒体，酸度清爽明快，入口带有水果风味</td></tr>
<tr><td>标志性风味</td><td>尾韵中的苦杏仁味（mandorla amara）——维纳恰的标志</td></tr>
<tr><td>陈年潜力</td><td>普通级2-4年，橡木桶版本5-8年</td></tr>
</table>
</section>
<h3>🏆 四、酒款风格</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<div class="region-item"><h4>传统风格（不锈钢罐）</h4><p style="color:#333;line-height:1.8;margin:0">保留了葡萄最纯粹的果香和矿物感。清爽明快，适合在年轻时期饮用。是圣吉米尼亚诺最具代表性的风格，用于搭配海鲜和开胃菜。</p></div>
<div class="region-item"><h4>现代风格（橡木桶陈酿）</h4><p style="color:#333;line-height:1.8;margin:0">在法式橡木桶中陈酿4-8个月，酒体更加饱满，发展出香草、蜂蜜和烤杏仁的风味。口感更加圆润，适合搭配白肉和烤鱼。</p></div>
<div class="region-item"><h4>Vernaccia di San Gimignano Riserva</h4><p style="color:#333;line-height:1.8;margin:0">DOCG最高等级，至少陈酿12个月。酒体更加复杂，层次丰富，陈年潜力可达8-10年。</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>托斯卡纳海鲜：</strong>烤海鲜、炖鱼、海鲜意大利面<br/>• <strong>白肉：</strong>柠檬鸡、烤兔肉、小牛肉<br/>• <strong>蔬菜：</strong>托斯卡纳著名的ribollita（蔬菜浓汤）<br/>• <strong>奶酪：</strong>新鲜马苏里拉、柔软的羊奶干酪<br/>• <strong>圣吉米尼亚诺特色：</strong>当地产的藏红花菜肴</p></div>
</section>
<section style="background:linear-gradient(135deg,#2a2a00,#4a4a10);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFFACD;font-size:16px;line-height:1.9">维纳恰是意大利白葡萄酒历史的重要篇章。<strong style="color:#DAA520">从但丁的诗句到如今的DOCG荣誉，这款来自中世纪塔楼之城的白葡萄酒一直在书写自己的传奇</strong>。如果你来到托斯卡纳，别忘了在圣吉米尼亚诺的塔楼阴影下品尝一杯正宗的维纳恰。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏰 生成圣吉米尼亚诺维纳恰完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏰 ${date.chinese} 圣吉米尼亚诺维纳恰完全指南：意大利第一款DOCG白葡萄酒`,author:'红酒顾问',digest:'维纳恰是意大利历史上第一款DOCG白葡萄酒，早在但丁时代就已闻名。探索这款古老白葡萄酒的魅力。',content:generateContent(),coverImage:'vernaccia_cover_ai.png',category:'wine-knowledge',tags:['维纳恰','圣吉米尼亚诺','托斯卡纳','意大利白葡萄酒','Vernaccia'],publishDate:date.full};
    const op = path.join(__dirname,'output',`vernaccia_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
