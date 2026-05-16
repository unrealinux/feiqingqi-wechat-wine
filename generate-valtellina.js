/**
 * 瓦尔泰利纳完全指南（阿尔卑斯山的内比奥罗）
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a0a"/><stop offset="50%" style="stop-color:#1a3a1a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#006400"/><stop offset="100%" style="stop-color:#32CD32"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><polygon points="550,50 750,50 700,150 600,150" fill="rgba(50,205,50,0.06)"/><polygon points="600,50 800,50 750,150 650,150" fill="rgba(0,100,0,0.04)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#32CD32" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Lombardy, Italy · Valtellina DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#32CD32" filter="url(#g)">🏔️</text><rect x="20" y="130" width="500" height="2" fill="#32CD32"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#32CD32">瓦尔泰利纳</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">伦巴第 · 阿尔卑斯山的内比奥罗</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"世界上最陡峭的葡萄园"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">阿尔卑斯山坡上的风土奇迹</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#32CD32" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','valtellina_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#006400;margin:0 0 8px 0;font-size:16px}h3{color:#006400;border-bottom:2px solid #32CD32;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#006400;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#006400;">🏔️ ${date.chinese} 瓦尔泰利纳完全指南：阿尔卑斯山坡上的内比奥罗</h2>
<p style="text-align:center;color:#666;">伦巴第 · 阿尔卑斯山 · 内比奥罗（Chiavennasca） · 世界上最陡峭的葡萄园</p>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#90EE90;font-size:16px;line-height:1.9">瓦尔泰利纳（Valtellina）是<strong style="color:#32CD32">意大利最壮观的葡萄酒产区之一</strong>，位于伦巴第大区北部的阿尔卑斯山谷中。这里的葡萄园沿着阿达河（Adda River）河谷修建在陡峭的山坡上，坡度可达60度以上——是<strong style="color:#32CD32">联合国教科文组织世界遗产</strong>。当地的Nebbiolo被称为Chiavennasca，酿造的葡萄酒以优雅的芳香和矿物感著称。</p>
</section>
<h3>🏔️ 一、独特风土</h3>
<section style="background:#F0FFF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>阿尔卑斯山的气候</h4><p style="color:#333;line-height:1.8;margin:0">瓦尔泰利纳位于阿尔卑斯山南麓，享受充足的日照但气温凉爽。大幅的昼夜温差（可达15°C）使得葡萄缓慢成熟，保留了酸度的同时发展出精妙的芳香。冬季寒冷，葡萄藤需要在冬季进行覆土保护。</p></div>
<div class="region-item"><h4>石墙梯田（Terrazzamenti / Fasce）</h4><p style="color:#333;line-height:1.8;margin:0">数百年来，当地人用石头修建了绵延数百公里的干石墙梯田，将陡峭的山坡变为可耕种的葡萄园。这些石墙不仅防止水土流失，还能在白天吸收热量并在夜间释放，为葡萄生长创造微气候。这是<strong>意大利农业工程的奇迹</strong>。</p></div>
</section>
<h3>🍇 二、葡萄与酒款</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>Chiavennasca（内比奥罗在瓦尔泰利纳的名字）</h4><p style="color:#333;line-height:1.8;margin:0">相比皮埃蒙特的内比奥罗，瓦尔泰利纳版本的风格更加轻盈、优雅和花香，单宁更加细腻。这是由于凉爽的高山气候和片岩土壤共同造就的。DOCG法规要求内比奥罗使用比例超过90%。</p></div>
</section>
<h3>🏆 三、等级与分类</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<table>
<tr><th>等级</th><th>陈酿要求</th><th>风格</th></tr>
<tr><td>Valtellina DOC</td><td>基本等级</td><td>新鲜果味，适合在3-5年内饮用</td></tr>
<tr><td>Valtellina Superiore DOCG</td><td>至少24个月陈酿</td><td>更加浓郁，结构完整，陈年潜力8-15年</td></tr>
<tr><td>Valtellina Superiore Riserva</td><td>至少36个月陈酿</td><td>更加复杂，陈年潜力15-25年</td></tr>
<tr><td>Sforzato di Valtellina DOCG</td><td>使用风干葡萄酿造（类似阿玛罗尼工艺）</td><td>酒体饱满，浓郁集中，酒精度高，陈年潜力15-25年</td></tr>
</table>
<div class="region-item" style="margin-top:12px"><h4>五大子产区（Marche）</h4><p style="color:#333;line-height:1.8;margin:0">瓦尔泰利纳Superiore DOCG下有5个著名的子产区：<br/><strong>• Sassella：</strong>最著名，优雅花香，结构平衡<br/><strong>• Grumello：</strong>更加丰满，果味饱满<br/><strong>• Inferno：</strong>名称来自"炎热"（日照最充足），酒体最饱满<br/><strong>• Valgella：</strong>海拔最高，最新鲜优雅<br/><strong>• Maroggia：</strong>产量最小，极为稀有</p></div>
</section>
<h3>👃 四、品鉴指南</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>品鉴特征</h4><p style="color:#333;line-height:1.8;margin:0"><strong>颜色：</strong>浅至中等宝石红，边缘呈现砖红色（比巴罗洛更淡）<br/><strong>香气：</strong>紫罗兰、玫瑰、红樱桃、覆盆子、石榴、薄荷、茴香、高山草本、矿物<br/><strong>口感：</strong>中等酒体，单宁细腻丝滑，酸度清爽，矿物感突出，尾韵带有苦甜杏仁味<br/><strong>Sforzato：</strong>更加饱满浓郁，带有蜜饯、无花果和巧克力的风味</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>瓦尔泰利纳经典搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Bresaola：</strong>瓦尔泰利纳特产的干腌牛肉，是当地最经典的搭配<br/>• <strong>Pizzoccheri：</strong>荞麦面配卷心菜、土豆和熔融奶酪——当地传统菜肴<br/>• <strong>Sciatt：</strong>炸奶酪球，搭配清爽内比奥罗<br/>• <strong>烤/炖肉：</strong>搭配合适的肉菜<br/>• <strong>Sforzato搭配陈年奶酪：</strong>帕玛森36个月+或是戈贡佐拉</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#90EE90;font-size:16px;line-height:1.9">瓦尔泰利纳是世界上最独特的内比奥罗产区之一。<strong style="color:#32CD32">这里出产的葡萄酒有着无与伦比的花香和矿物感，是内比奥罗最优雅的展现</strong>。对于喜欢巴罗洛但又向往更轻盈风格的爱酒人士，瓦尔泰利纳是不二之选。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏔️ 生成瓦尔泰利纳完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏔️ ${date.chinese} 瓦尔泰利纳完全指南：阿尔卑斯山坡上的内比奥罗`,author:'红酒顾问',digest:'瓦尔泰利纳拥有世界上最陡峭的葡萄园，出产优雅芳香的内比奥罗葡萄酒，是阿尔卑斯山献给世界的佳酿。',content:generateContent(),coverImage:'valtellina_cover_ai.png',category:'wine-knowledge',tags:['瓦尔泰利纳','伦巴第','内比奥罗','意大利葡萄酒','Valtellina'],publishDate:date.full};
    const op = path.join(__dirname,'output',`valtellina_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
