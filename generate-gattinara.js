/**
 * 加蒂纳拉完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#2a0a0a"/><stop offset="50%" style="stop-color:#4a1a1a"/><stop offset="100%" style="stop-color:#1a0a0a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#800000"/><stop offset="100%" style="stop-color:#B22222"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><ellipse cx="650" cy="120" rx="100" ry="60" fill="rgba(178,34,34,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#B22222" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Piedmont, Italy · Gattinara DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#B22222" filter="url(#g)">⛰️</text><rect x="20" y="130" width="500" height="2" fill="#B22222"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#B22222">加蒂纳拉</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">皮埃蒙特 · 内比奥罗高山上的优雅</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"巴罗洛的亲戚，但不逊色于巴罗洛"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">阿尔卑斯山麓的内比奥罗精品</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#B22222" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','gattinara_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#800000;margin:0 0 8px 0;font-size:16px}h3{color:#800000;border-bottom:2px solid #B22222;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#800000;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#800000;">⛰️ ${date.chinese} 加蒂纳拉完全指南</h2>
<p style="text-align:center;color:#666;">皮埃蒙特 · 阿尔卑斯山麓 · 内比奥罗的另一种表达 · DOCG</p>
<section style="background:linear-gradient(135deg,#2a0a0a,#4a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">加蒂纳拉（Gattinara）是<strong style="color:#B22222">皮埃蒙特北部阿尔卑斯山麓的一颗明珠</strong>，与巴罗洛和巴巴莱斯科共享内比奥罗葡萄（当地称为Spanna），却有着完全不同的个性。产量极小、风格更加优雅飘逸的加蒂纳拉，被认为是<strong style="color:#B22222">内比奥罗最细腻的表达之一</strong>。</p>
</section>
<h3>🗺️ 一、产区概况</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>地理位置</h4><p style="color:#333;line-height:1.8;margin:0">加蒂纳拉位于皮埃蒙特北部的瓦莱塞省（Varese），坐落在阿尔卑斯山麓的丘陵地带。这里比巴罗洛更靠北、海拔更高（300-500米），气候更为凉爽，生长季节更长。葡萄园大多位于向阳的山坡上，俯瞰塞西亚河（Sesia River）河谷。</p></div>
<div class="region-item"><h4>土壤特色</h4><p style="color:#333;line-height:1.8;margin:0">加蒂纳拉的土壤以<strong>古老的火山斑岩（Porphyry）</strong>为主，由铁和钾含量丰富的红色岩石构成。这种独特的土壤结构赋予了加蒂纳拉葡萄酒鲜明的矿物感、明亮的酸度和独特的辛辣气息——与巴罗洛的石灰岩土壤形成鲜明对比。</p></div>
</section>
<h3>🍇 二、葡萄与酿造</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>内比奥罗（Spanna）</h4><p style="color:#333;line-height:1.8;margin:0">加蒂纳拉的DOCG法规要求使用至少90%的当地Spanna（即内比奥罗）葡萄。剩余10%可以使用维佐娜（Vespolina）或博纳达（Bonarda）等本地品种进行混酿。这里的Spanna由于凉爽气候和斑岩土壤，呈现出比巴罗洛更加飘逸的芳香和更加细腻的单宁结构。</p></div>
<div class="region-item"><h4>陈酿要求</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Gattinara DOCG：</strong>至少陈酿35个月，其中至少12个月在橡木桶中<br/>• <strong>Gattinara Riserva：</strong>至少陈酿48个月，其中至少24个月在橡木桶中<br/>• 大多生产商会进行更长时间的陈酿，让单宁充分软化</p></div>
</section>
<h3>🏆 三、风格与品鉴</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<table>
<tr><th>维度</th><th>描述</th></tr>
<tr><td>色泽</td><td>石榴红偏淡，边缘渐变为橙色（比巴罗洛更淡）</td></tr>
<tr><td>香气</td><td>紫罗兰、玫瑰花瓣、红樱桃、覆盆子、石榴、肉桂、胡椒、燧石</td></tr>
<tr><td>口感</td><td>中等酒体，酸度清爽，单宁细腻如丝，矿物感突出</td></tr>
<tr><td>陈年潜力</td><td>优质酒款10-25年，顶级酒款可至30-40年</td></tr>
<tr><td>与巴罗洛对比</td><td>更轻盈、更芳香、更早适饮，少一些力量多一些优雅</td></tr>
</table>
<div class="region-item" style="margin-top:12px"><h4>推荐酒庄</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Nervi（内尔维）：</strong>加蒂纳拉最著名的酒庄，现归Rober Voerzio所有<br/>• <strong>Antoniolo（安东尼奥洛）：</strong>家族酒庄，品质稳定<br/>• <strong>Travaglini（特拉瓦利尼）：</strong>加蒂纳拉最古老且最知名的酒庄之一</p></div>
</section>
<h3>🍽️ 四、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>推荐搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>北方皮埃蒙特菜肴：</strong>炖牛肉、烤鸭、野味炖菜<br/>• <strong>奶酪：</strong>Gorgonzola、Taleggio和当地的Toma奶酪<br/>• <strong>松露：</strong>加蒂纳拉的优雅风格与白松露是梦幻组合<br/>• <strong>烤肉：</strong>牛肝菌和香草烤制的红肉</p></div>
</section>
<section style="background:linear-gradient(135deg,#2a0a0a,#4a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">加蒂纳拉是内比奥罗爱好者的必尝之选。<strong style="color:#B22222">它不仅价格比巴罗洛更为亲民，更展现出内比奥罗在阿尔卑斯山风土中独特的优雅一面</strong>。每一次品尝都是一次高山纯净之美的体验。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n⛰️ 生成加蒂纳拉完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`⛰️ ${date.chinese} 加蒂纳拉完全指南：阿尔卑斯山下的内比奥罗精品`,author:'红酒顾问',digest:'加蒂纳拉是内比奥罗在阿尔卑斯山麓的优雅表达，被誉为巴罗洛性价最高的亲戚。品味高山内比奥罗的独特魅力。',content:generateContent(),coverImage:'gattinara_cover_ai.png',category:'wine-knowledge',tags:['加蒂纳拉','皮埃蒙特','内比奥罗','意大利葡萄酒','Gattinara'],publishDate:date.full};
    const op = path.join(__dirname,'output',`gattinara_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
