/**
 * 上阿迪杰葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#002020"/><stop offset="50%" style="stop-color:#004040"/><stop offset="100%" style="stop-color:#00202a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#008080"/><stop offset="100%" style="stop-color:#20B2AA"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><polygon points="550,40 750,40 800,130 500,130" fill="rgba(0,128,128,0.06)"/><polygon points="600,40 800,40 850,130 550,130" fill="rgba(32,178,170,0.04)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#20B2AA" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Alto Adige, Italy · South Tyrol</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#20B2AA" filter="url(#g)">🏔️</text><rect x="20" y="130" width="500" height="2" fill="#20B2AA"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#20B2AA">上阿迪杰</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">特伦蒂诺-上阿迪杰 · 阿尔卑斯白葡萄酒天堂</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利最被低估的白葡萄酒产区"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">阿尔卑斯山与地中海交汇的奇迹</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#20B2AA" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','altoadige_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#008080;margin:0 0 8px 0;font-size:16px}h3{color:#008080;border-bottom:2px solid #20B2AA;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#008080;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#008080;">🏔️ ${date.chinese} 上阿迪杰完全指南</h2>
<p style="text-align:center;color:#666;">特伦蒂诺-上阿迪杰 · 南蒂罗尔 · 阿尔卑斯白葡萄酒 · 意大利的阿尔萨斯</p>
<section style="background:linear-gradient(135deg,#002020,#004040);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E0FFFF;font-size:16px;line-height:1.9">上阿迪杰（Alto Adige）——也被称为南蒂罗尔（South Tyrol）——是<strong style="color:#20B2AA">意大利最独特、品质最高的白葡萄酒产区之一</strong>。这个位于阿尔卑斯山腹地的地区拥有双重文化（意大利与奥地利），其白葡萄酒以<strong style="color:#20B2AA">纯净的果味、爽脆的酸度和精湛的酿造工艺</strong>闻名于世，被誉为"意大利的阿尔萨斯"。</p>
</section>
<h3>🏔️ 一、独特风土</h3>
<section style="background:#F0FFFF;padding:18px;border-radius:8px">
<div class="region-item"><h4>阿尔卑斯风土</h4><p style="color:#333;line-height:1.8;margin:0">上阿迪杰的葡萄园分布在阿尔卑斯山南麓海拔200-1000米的陡峭山坡上。巨大的昼夜温差、充足的日照和凉爽的气候使得葡萄缓慢成熟，发展出浓郁的香气同时保持清爽的酸度。多洛米蒂山脉的白色岩石背景为葡萄园提供了壮丽的景观。</p></div>
<div class="region-item"><h4>土壤多样性</h4><p style="color:#333;line-height:1.8;margin:0">上阿迪杰的土壤极其多样——从多洛米蒂山脉的白云岩、斑岩、花岗岩到冲积土和黏土，不同的土壤类型赋予不同的葡萄酒独特的风土特征。这也是为什么这里能成功种植如此多种葡萄的原因。</p></div>
</section>
<h3>🍇 二、葡萄品种</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>白葡萄</th><th>特点</th></tr>
<tr><td>灰皮诺（Pinot Grigio）</td><td>上阿迪杰的招牌——比其他产区更浓郁、更复杂</td></tr>
<tr><td>琼瑶浆（Gewürztraminer）</td><td>原产于上阿迪杰的Tramin村，荔枝和玫瑰香气</td></tr>
<tr><td>长相思（Sauvignon Blanc）</td><td>典型的燧石和青草香气，口感清爽</td></tr>
<tr><td>霞多丽（Chardonnay）</td><td>矿感突出，结构优雅</td></tr>
<tr><td>白皮诺（Pinot Bianco）</td><td>清爽果味，完美的开胃酒</td></tr>
<tr><td>米勒-图尔高（Müller-Thurgau）</td><td>阿尔卑斯风格，花香四溢</td></tr>
<tr><td>雷司令（Riesling）</td><td>虽然种植量小但品质极高</td></tr>
</table>
<div class="region-item"><h4>红葡萄品种</h4><p style="color:#333;line-height:1.8;margin:0">上阿迪杰也出产优质的红葡萄酒，包括<strong>黑皮诺（Pinot Nero）</strong>——这里被认为是意大利最优秀的黑皮诺产区之一，以及<strong>拉格林（Lagrein）</strong>——上阿迪杰特有的深色红葡萄，酿造出带有紫罗兰和黑莓风味的浓郁红葡萄酒。</p></div>
</section>
<h3>🏆 三、DOC等级</h3>
<section style="background:#F5F5F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>Alto Adige DOC</h4><p style="color:#333;line-height:1.8;margin:0">覆盖整个产区的通用DOC，共有超过20个获批品种。这个一级DOC涵盖了从日常餐酒到顶级精选的各个层次。许多酒庄使用"Alto Adige"后跟品种名的方式命名（如Alto Adige Sauvignon）。</p></div>
<div class="region-item"><h4>子产区</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Terlano（泰拉诺）：</strong>以白葡萄酒闻名，尤其是长相思和霞多丽<br/>• <strong>Santa Maddalena（圣玛达莱纳）：</strong>以黑皮诺和拉格林闻名<br/>• <strong>Valle Isarco（伊萨尔科河谷）：</strong>最凉爽区域，白葡萄酒清新爽脆<br/>• <strong>Lago di Caldaro（卡尔达罗湖）：</strong>红葡萄酒著名</p></div>
</section>
<h3>👃 四、品鉴亮点</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>推荐酒庄</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Cantina Terlano：</strong>传奇酒庄，白葡萄酒享有盛誉<br/>• <strong>Alois Lageder：</strong>生物动力法先驱，品质卓越<br/>• <strong>Kellerei Tramin：</strong>琼瑶浆大师<br/>• <strong>Nals Margreid：</strong>现代风格，矿感突出<br/>• <strong>Franz Haas：</strong>家族酒庄，以黑皮诺闻名</p></div>
</section>
<h3>🍽️ 五、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>搭配建议</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>南蒂罗尔特色：</strong>苹果馅饼搭配琼瑶浆、Knödel（面团子）搭配灰皮诺<br/>• <strong>海鲜：</strong>清爽长相思搭配生蚝和烤鱼<br/>• <strong>亚洲料理：</strong>琼瑶浆搭配泰国菜和越南菜<br/>• <strong>白肉和沙拉：</strong>白皮诺和米勒-图尔高</p></div>
</section>
<section style="background:linear-gradient(135deg,#002020,#004040);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E0FFFF;font-size:16px;line-height:1.9">上阿迪杰是意大利白葡萄酒的宝藏。<strong style="color:#20B2AA">这里的葡萄酒纯净如阿尔卑斯的空气，每一口都让人感受到多洛米蒂山脉的壮美</strong>。无论你是灰皮诺的爱好者还是白葡萄酒的探索者，上阿迪杰都值得你深入了解。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏔️ 生成上阿迪杰完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏔️ ${date.chinese} 上阿迪杰完全指南：意大利的阿尔萨斯`,author:'红酒顾问',digest:'上阿迪杰是意大利最被低估的白葡萄酒产区，坐落在阿尔卑斯山腹地，以纯净果味和爽脆酸度的白葡萄酒闻名。',content:generateContent(),coverImage:'altoadige_cover_ai.png',category:'wine-knowledge',tags:['上阿迪杰','南蒂罗尔','意大利白葡萄酒','Alto Adige','灰皮诺','琼瑶浆'],publishDate:date.full};
    const op = path.join(__dirname,'output',`altoadige_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
