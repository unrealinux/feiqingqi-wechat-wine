/**
 * 陶拉西完全指南（南方的巴罗洛）
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a001a"/><stop offset="50%" style="stop-color:#1a003a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#4B0082"/><stop offset="100%" style="stop-color:#8A2BE2"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(138,43,226,0.06)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#8A2BE2" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Campania, Italy · Taurasi DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#8A2BE2" filter="url(#g)">🏺</text><rect x="20" y="130" width="500" height="2" fill="#8A2BE2"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#8A2BE2">陶拉西</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">坎帕尼亚 · 南方的巴罗洛 · 阿利亚尼科之王</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利南部的王者之酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">阿利亚尼科葡萄的巅峰表达</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#8A2BE2" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','taurasi_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#4B0082;margin:0 0 8px 0;font-size:16px}h3{color:#4B0082;border-bottom:2px solid #8A2BE2;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#4B0082;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#4B0082;">🏺 ${date.chinese} 陶拉西完全指南：南方的巴罗洛</h2>
<p style="text-align:center;color:#666;">坎帕尼亚 · 阿利亚尼科 · 意大利南部最伟大的红葡萄酒</p>
<section style="background:linear-gradient(135deg,#0a001a,#1a003a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#D8BFD8;font-size:16px;line-height:1.9">陶拉西（Taurasi）被誉为<strong style="color:#8A2BE2">"南方的巴罗洛"</strong>，是意大利南部最伟大的红葡萄酒之一。它产自坎帕尼亚大区深处的伊尔皮尼亚（Irpinia）山区，由100%阿利亚尼科（Aglianico）葡萄酿造。这款酒拥有<strong style="color:#8A2BE2">惊人的陈年潜力、深邃的颜色和复杂的风味层次</strong>，是意大利南部葡萄酒王冠上的明珠。</p>
</section>
<h3>🏺 一、历史与地位</h3>
<section style="background:#F5F0FF;padding:18px;border-radius:8px">
<div class="region-item"><h4>古老起源</h4><p style="color:#333;line-height:1.8;margin:0">阿利亚尼科葡萄最早由古希腊人在公元前7世纪带到意大利南部，被称为"Hellenico"（希腊的）。陶拉西镇的名字源于古罗马时期的"Taurasia"部落。1993年，陶拉西获得DOCG认证——这是<strong>意大利南部最早的DOCG之一</strong>，奠定了其顶级地位。</p></div>
<div class="region-item"><h4>为何被称为"南方的巴罗洛"</h4><p style="color:#333;line-height:1.8;margin:0">陶拉西与巴罗洛有诸多相似之处：<br/>• 同样拥有惊人的单宁结构和陈年潜力<br/>• 年轻时同样紧涩，需要长时间陈年才能绽放<br/>• 陈年后展现出类似的焦油、玫瑰和松露香气<br/>• 同样拥有复杂的层次感和悠长的余味</p></div>
</section>
<h3>🍇 二、风土与酿造</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>阿利亚尼科品种</h4><p style="color:#333;line-height:1.8;margin:0">阿利亚尼科是意大利南部最伟大的红葡萄品种。在陶拉西产区，葡萄种植在海拔400-600米的山坡上，火山土壤富含矿物质。凉爽的高海拔气候使得酸度保持良好，葡萄缓慢成熟发展出复杂的风味。</p></div>
<div class="region-item"><h4>陈酿要求</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Taurasi DOCG：</strong>至少陈酿36个月，其中至少12个月在橡木桶中<br/>• <strong>Taurasi Riserva DOCG：</strong>至少陈酿48个月，其中至少18个月在橡木桶中<br/>• 许多顶级酒庄会陈酿5-7年才上市</p></div>
</section>
<h3>🏆 三、主要酒庄</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<table>
<tr><th>酒庄</th><th>风格特点</th></tr>
<tr><td>Mastroberardino</td><td>最著名的传统酒庄，RADici Taurasi被誉为标杆</td></tr>
<tr><td>Feudi di San Gregorio</td><td>现代风格，更加果味浓郁，酿制精良</td></tr>
<tr><td>Terredora</td><td>风格平衡，性价比高</td></tr>
<tr><td>Antonio Caggiano</td><td>小产量精品，Beatrice Riserva非常出色</td></tr>
<tr><td>Galardi</td><td>Terra di Lavoro（虽非陶拉西DOCG但来自伊尔皮尼亚，极具特色）</td></tr>
</table>
</section>
<h3>👃 四、品鉴与陈年</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>年轻陶拉西（3-8年）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>深宝石红近紫色<br/><strong>香气：</strong>黑莓、黑樱桃、李子、紫罗兰、黑胡椒、甘草、烟熏<br/><strong>口感：</strong>单宁强劲有力，酸度高，结构宏大，需要充分醒酒（3-4小时）</p></div>
<div class="region-item"><h4>陈年陶拉西（12-25年+）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>石榴红，边缘砖红色<br/><strong>香气：</strong>熟透的黑果、干玫瑰、焦油、松露、皮革、雪茄盒、烟草<br/><strong>口感：</strong>单宁变得丝滑柔顺，层次深邃，酸度依然鲜活，余味极其持久</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>烤羊肉：</strong>香草烤羊腿是陶拉西的终极搭配<br/>• <strong>野味：</strong>炖野猪肉、烤鹿肉<br/>• <strong>陈年奶酪：</strong>帕玛森36个月+、佩科里诺陈年版本<br/>• <strong>坎帕尼亚特色：</strong>那不勒斯肉酱（Ragù Napoletano）、烤宽面条<br/>• <strong>黑巧克力：</strong>高浓度黑巧克力搭配陈年陶拉西是绝妙体验</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a001a,#1a003a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#D8BFD8;font-size:16px;line-height:1.9">陶拉西是意大利南部葡萄酒的骄傲。<strong style="color:#8A2BE2">它证明了意大利南部的葡萄酒同样拥有与巴罗洛和布鲁奈罗相抗衡的品质和陈年潜力</strong>。对于探索意大利葡萄酒深度的爱好者来说，陶拉西是必不可少的一站。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏺 生成陶拉西完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏺 ${date.chinese} 陶拉西完全指南：意大利南方的巴罗洛`,author:'红酒顾问',digest:'陶拉西被誉为南方的巴罗洛，是意大利南部最伟大的红葡萄酒，由阿利亚尼科葡萄酿造，陈年潜力惊人。',content:generateContent(),coverImage:'taurasi_cover_ai.png',category:'wine-knowledge',tags:['陶拉西','坎帕尼亚','阿利亚尼科','意大利葡萄酒','Taurasi'],publishDate:date.full};
    const op = path.join(__dirname,'output',`taurasi_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
