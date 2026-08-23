/**
 * 2026葡萄酒消费趋势
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a1a"/><stop offset="50%" style="stop-color:#1a1a3a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#00BCD4"/><stop offset="50%" style="stop-color:#3F51B5"/><stop offset="100%" style="stop-color:#9C27B0"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(0,188,212,0.06)"/><rect x="610" y="190" width="160" height="200" rx="5" fill="url(#og)" stroke="#00BCD4" stroke-width="2" opacity="0.7"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">罐装酒 · 自然酒 · 无酒精 · 线上消费</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#00BCD4" filter="url(#g)">📈</text><rect x="20" y="130" width="500" height="2" fill="#00BCD4"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#00BCD4">2026葡萄酒消费趋势</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">新一代在喝什么？哪些趋势值得关注？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"罐装酒年增40%、自然酒翻倍、无酒精爆发"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">消费数据 · 新生代偏好 · 市场预测 · 趋势解读</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#00BCD4" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_trends_2026_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#1565C0;margin:0 0 8px 0;font-size:16px}h3{color:#1565C0;border-bottom:2px solid #00BCD4;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:linear-gradient(90deg,#00BCD4,#3F51B5);color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#1565C0;">📈 ${date.chinese} 2026葡萄酒消费趋势：新一代在喝什么？</h2>
<p style="text-align:center;color:#666;">罐装酒、自然酒、无酒精酒、线上购酒——全球葡萄酒市场正在被这5个趋势重塑</p>
<section style="background:linear-gradient(135deg,#0a0a1a,#1a1a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B3E5FC;font-size:16px;line-height:1.9">2026年，葡萄酒世界正在经历一场<strong style="color:#00BCD4">代际变革</strong>。Z世代和千禧一代已经成为最大的葡萄酒消费群体，但他们喝酒的方式和父辈完全不同——不迷信名庄、不追求年份、不拘泥于仪式。本文综合全球行业数据，为你解读2026年最值得关注的5大趋势。</p>
</section>

<h3>🥫 趋势一：罐装葡萄酒的爆发式增长</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>数据说话：</strong>2023-2026年，全球罐装葡萄酒市场规模年复合增长率（CAGR）达<strong>40%+</strong>。美国是最大市场，占全球罐装酒销量的70%以上。<br/><br/><strong>为什么罐装酒突然火了？</strong><br/>• <strong>方便：</strong>一罐250ml约等于两杯，户外、野餐、音乐节随手饮<br/>• <strong>无压力：</strong>不开一整瓶，喝不完不浪费，一个人也能喝<br/>• <strong>年轻化：</strong>罐装设计更潮，更符合年轻人的审美<br/>• <strong>环保：</strong>铝罐比玻璃瓶轻很多，运输碳排放低<br/><br/><strong>品质进步：</strong>早期罐装酒给人"劣质"的印象，但如今很多知名酒庄也开始做罐装：比如加州的Bota Box、法国的Château d'Estoublon。<strong>注意：</strong>罐装酒最好在1年内喝掉——铝罐的密封性不如玻璃瓶，长期陈年会出问题。<br/><br/><strong>中国市场：</strong>目前罐装酒在中国渗透率还很低，但增速很快。适合露营、派对场景的品牌正在崛起。</p>
</section>

<h3>🌿 趋势二：自然酒从小众走向主流</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>数据说话：</strong>全球自然酒市场规模过去5年翻了近<strong>3倍</strong>。法国自然酒展（La Dive Bouteille）的参展商从2010年的50家增加到2025年的400+家。<br/><br/><strong>自然酒到底是什么？</strong><br/>简单说就是"尽量不干预的酿酒方式"：有机或生物动力法种植葡萄，天然酵母发酵，不加添加剂（包括不调酸、不加硫或极少量加硫），不过滤、不澄清。<br/><br/><strong>争议在哪？</strong><br/>• 支持者说：这是真正的"风土表达"，每一瓶都是自然的馈赠<br/>• 反对者说：不稳定、容易有异味（还原味、马厩味、泡菜味），品质参差不齐<br/><br/><strong>2026年的趋势：</strong>自然酒正在从"极端派"走向"理性派"。很多酿酒师开始采用"自然的理念+适度的技术干预"——既保留了自然酒的个性，又保证了品质的稳定性。这个趋势被称为<strong>"第三波自然酒"</strong>。<br/><br/><strong>入门建议：</strong>不要从极端自然酒入手（可能口味太怪）。选择"自然派但不过火"的品牌，比如意大利的Elena Walch、法国的Domaine Ponsot。</p>
</section>

<h3>🚫 趋势三：无酒精葡萄酒的崛起</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>数据说话：</strong>2026年全球无酒精葡萄酒市场规模预计将达到<strong>$30亿</strong>。美国"Dry January"（一月不喝酒）参与人数超过3000万，推动了整个无酒精品类的发展。<br/><br/><strong>今天的无酒精酒，已经不是当年的"葡萄汁"了：</strong><br/>• 真空蒸馏技术：在低温低压下蒸发酒精，保留香气物质<br/>• 旋转锥体塔：精确分离酒精和风味物质<br/>• <strong>品质瓶颈：</strong>无酒精红酒依然很难做好——单宁无法保留，口感偏薄<br/>• <strong>表现较好：</strong>无酒精起泡酒和无酒精白葡萄酒（尤其是雷司令和长相思风格）<br/><br/><strong>中国市场的特殊性：</strong>"无酒精"在中国接受度还较低——很多人认为"喝酒就要喝带酒精的"。但<strong>0.0%啤酒已经铺满便利店</strong>，无酒精葡萄酒可能很快跟进。<br/><br/><strong>推荐品牌：</strong>Leitz Eins Zwei Zero（德国雷司令）、Thomson & Scott Noughty、Oddbird。</p>
</section>

<h3>🛒 趋势四：线上购酒成为主流</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>全球数据：</strong>2025年葡萄酒线上销售占比已达到<strong>25-30%</strong>（疫情前不到10%）。中国的比例更高——天猫、京东、抖音、小红书是葡萄酒销售的主要渠道。<br/><br/><strong>线上购酒改变了什么？</strong><br/>• <strong>去中介化：</strong>酒庄直销（DTC）模式爆发，跳过中间商<br/>• <strong>内容的权力：</strong>一条种草视频可能让一款酒一夜爆红<br/>• <strong>直播带货：</strong>中国葡萄酒直播GMV年增长50%+，但问题也很严重——"扫码价"炒作、虚假年份、以次充好<br/><br/><strong>订阅制葡萄酒（Wine Subscription）在2026年面临挑战：</strong>疫情期间爆发的订阅制正在降温——消费者厌倦了"盲盒"开箱，更倾向"知道自己要什么"的精准推荐。<br/><br/><strong>中国特别现象：</strong>小红书上"平价葡萄酒测评"类内容年增长200%+。新一代消费者把买酒当成"内容消费"——好看、好拍、好分享，比好喝更重要。</p>
</section>

<h3>🌍 趋势五：消费的觉醒——新生代喝酒逻辑变了</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<table>
<tr><th>维度</th><th>父辈（45岁+）</th><th>新生代（25-40岁）</th></tr>
<tr><td>选酒逻辑</td><td>"名庄、高分、年份"</td><td>"故事、好看、性价比"</td></tr>
<tr><td>场合</td><td>正式宴会、送礼</td><td>日常配餐、社交分享、独酌</td></tr>
<tr><td>消费渠道</td><td>烟酒店、酒行</td><td>电商、直播、小红书、抖音</td></tr>
<tr><td>偏好风格</td><td>波尔多、勃艮第、巴罗洛</td><td>自然酒、橙酒、罐装酒、冷门产区</td></tr>
<tr><td>价格敏感度</td><td>"越贵越好"</td><td>"百元内喝得开心就行"</td></tr>
<tr><td>环保意识</td><td>不太关注</td><td>关注有机、生物动力法、减碳</td></tr>
<tr><td>饮用方式</td><td>整瓶、醒酒、仪式感</td><td>按杯、罐装、随开随喝</td></tr>
</table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>结论：</strong>葡萄酒消费正在从"奢侈品逻辑"向"消费品逻辑"转变。对从业者来说，最大的挑战不是"怎么做出更好的酒"，而是<strong>"怎么讲出让年轻人想听的故事"</strong>。</p>
</section>

<section style="background:linear-gradient(135deg,#0a0a1a,#1a1a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B3E5FC;font-size:16px;line-height:1.9">2026年的葡萄酒世界，变化比以往任何时候都快。<strong style="color:#00BCD4">罐装酒的便利、自然酒的个性、无酒精的包容、线上渠道的效率、新生代的消费觉醒</strong>——这五个趋势正在重塑一个几千年历史的传统行业。<br/><br/>对我们这些喝酒的人来说，这其实是好事——选择更多了，门槛更低了，葡萄酒不再是精英阶层的专属玩物。说到底，<strong style="color:#00BCD4">酒是用来喝的，不是用来供的。</strong></p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n📈 生成2026葡萄酒消费趋势\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`📈 ${date.chinese} 2026葡萄酒消费趋势：罐装酒、自然酒、无酒精——新一代在喝什么？`,author:'红酒顾问',digest:'罐装酒年增40%、自然酒翻3倍、无酒精酒突破$30亿——2026年葡萄酒市场最值得关注的5大趋势全解析。',content:generateContent(),coverImage:'wine_trends_2026_cover_ai.png',category:'wine-knowledge',tags:['2026葡萄酒趋势','罐装酒','自然酒','无酒精葡萄酒','线上购酒','消费趋势','Z世代'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_trends_2026_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
