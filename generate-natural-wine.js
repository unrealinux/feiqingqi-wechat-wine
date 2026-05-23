/**
 * 自然酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a0a"/><stop offset="50%" style="stop-color:#1a3a1a"/><stop offset="100%" style="stop-color:#0a2a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#2E7D32"/><stop offset="100%" style="stop-color:#66BB6A"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="90" r="180" fill="rgba(102,187,106,0.06)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#66BB6A" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Natural Wine · 全球风潮</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#66BB6A" filter="url(#g)">🌿</text><rect x="20" y="130" width="500" height="2" fill="#66BB6A"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#66BB6A">自然酒完全指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">返璞归真还是营销噱头？最诚实的葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"葡萄酒世界最富有争议的潮流"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">零添加 · 野生发酵 · 浑浊美学</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#66BB6A" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','natural_wine_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#2E7D32;margin:0 0 8px 0;font-size:16px}h3{color:#2E7D32;border-bottom:2px solid #66BB6A;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#2E7D32;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#2E7D32;">🌿 ${date.chinese} 自然酒完全指南</h2>
<p style="text-align:center;color:#666;">零添加 · 野生发酵 · 浑浊美学 · 葡萄酒世界的返璞归真运动</p>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">自然酒（Natural Wine）是<strong style="color:#66BB6A">当今葡萄酒世界最具争议也最受追捧的潮流</strong>。拥护者说它是"葡萄酒应该有的样子"——纯净、真实、充满生命力。反对者认为它不过是"发酵葡萄汁"，甚至有缺陷的酒。本文带你<strong style="color:#66BB6A">客观认识自然酒运动的来龙去脉</strong>，帮你判断它究竟值不值得尝试。</p>
</section>
<h3>🌱 一、什么是自然酒？</h3>
<section style="background:#F1F8E9;padding:18px;border-radius:8px">
<div class="region-item"><h4>没有法律定义的运动</h4><p style="color:#333;line-height:1.8;margin:0">与有机认证、生物动力法认证不同，自然酒在大多数国家和地区<strong>没有官方法律定义</strong>。但业内普遍认同的自然酒核心原则包括：</p></div>
<div class="region-item"><h4>五大基本原则</h4><p style="color:#333;line-height:1.8;margin:0"><strong>1. 有机/生物动力法种植：</strong>不使用化学农药、除草剂和化肥<br/><strong>2. 手工采收：</strong>不使用机械采收，精细分选<br/><strong>3. 野生酵母发酵：</strong>不添加商业酵母，全靠葡萄皮上的天然酵母<br/><strong>4. 零添加剂：</strong>不调整酸度、不加单宁、不加酶、不加糖<br/><strong>5. 极低二氧化硫：</strong>不添加或极少添加（通常<30mg/L）<br/><strong>6. 不过滤不澄清：</strong>保持酒液最原始的状态，浑浊是常态</p></div>
</section>
<h3>📜 二、自然酒的前世今生</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>葡萄酒本来的样子</h4><p style="color:#333;line-height:1.8;margin:0">严格来说，在20世纪中叶之前，<strong>所有的葡萄酒都是"自然酒"</strong>。化学添加剂、商业酵母、工业澄清技术是20世纪后期才大规模普及的。自然酒运动本质上是"回归传统"。</p></div>
<div class="region-item"><h4>现代自然酒运动</h4><p style="color:#333;line-height:1.8;margin:0">1980年代，法国博若莱的朱利安·特特罗（Jules Chauvet）被誉为自然酒的精神之父。2000年代，巴黎的"自然酒吧"（如Le Verre Volé）推广了这一概念。<strong>关键人物</strong>：皮埃尔·奥维尔（Pierre Overnoy，汝拉产区）、安塞姆·塞罗斯（Anselme Selosse，香槟）、以及格鲁吉亚的传统陶罐酿酒复兴。</p></div>
<div class="region-item"><h4>自然酒的爆发</h4><p style="color:#333;line-height:1.8;margin:0">近十年，自然酒在全球范围内爆炸式增长。在纽约、伦敦、巴黎、东京、上海的时尚酒吧和餐厅，自然酒成为潮流符号。每年在法国南部举办的"自然酒沙龙"（La Renaissance des Appellations）吸引全球数百家自然酒庄参展。</p></div>
</section>
<h3>🏆 三、自然酒的世界版图</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<table>
<tr><th>地区</th><th>代表产区</th><th>代表人物/酒庄</th></tr>
<tr><td>🇫🇷 法国</td><td>博若莱、卢瓦尔河谷、汝拉、香槟、朗格多克</td><td>Pierre Overnoy, Thierry Puzelat, Anselme Selosse</td></tr>
<tr><td>🇮🇹 意大利</td><td>弗留利、托斯卡纳、西西里、伦巴第</td><td>Gravner, Radikon, Emidio Pepe, Frank Cornelissen</td></tr>
<tr><td>🇪🇸 西班牙</td><td>赫雷斯（雪莉）、加泰罗尼亚</td><td>Pérez Barquero, Celler la Salada</td></tr>
<tr><td>🇩🇪 德国/奥地利</td><td>摩泽尔、瓦豪</td><td>Wittmann, Nikolaihof, Christian Tschida</td></tr>
<tr><td>🇺🇸 美国</td><td>加州、俄勒冈</td><td>Coturri, Broc Cellars, Martha Stoumen</td></tr>
<tr><td>🇹🇷 格鲁吉亚</td><td>卡赫季</td><td>传统陶罐（Qvevri）酿酒的发源地</td></tr>
</table>
</section>
<h3>🍷 四、自然酒的味觉世界</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>自然酒的典型特征</h4><p style="color:#333;line-height:1.8;margin:0"><strong>外观：</strong>酒液可能浑浊（未经澄清过滤），颜色可能偏暗或偏氧化<br/><strong>香气：</strong>果味不如传统葡萄酒纯净直接，常有野性气息——如谷仓、马厩、汗味、发酵面团、酸奶、苹果酒（这些所谓"自然酒味"有人爱之入骨，有人避之不及）<br/><strong>口感：</strong>酸度通常更高，单宁更粗粝，酒体更轻，结构上不如传统葡萄酒"工整"<br/><strong>橙酒：</strong>白葡萄带皮浸渍酿造的"橙酒"（Orange Wine）是自然酒中最具辨识度的分支</p></div>
<div class="region-item"><h4>好自然酒 vs 坏自然酒</h4><p style="color:#333;line-height:1.8;margin:0"><strong>好自然酒：</strong>充满生命力的酸度，纯净的果味，复杂有层次，喝起来让人感到"活力"和"真实"<br/><strong>有缺陷的自然酒：</strong>挥发性酸度过高（醋味）、酒香酵母（Brett）过重（创可贴味/马汗味）、过度氧化（雪莉酒味）、鼠味（异味）——这些不是"自然特色"，而是酿造失误</p></div>
</section>
<h3>⚡ 五、争议与讨论</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>支持者的观点</h4><p style="color:#333;line-height:1.8;margin:0">• "自然酒是真正的风土表达——没有添加剂掩盖葡萄的本真"<br/>• "零添加更健康，更环保，符合可持续发展的理念"<br/>• "每一瓶自然酒都独一无二，充满惊喜"<br/>• "自然酒让你喝的不仅仅是酒，更是一个哲学态度"</p></div>
<div class="region-item"><h4>反对者的观点</h4><p style="color:#333;line-height:1.8;margin:0">• "很多自然酒就是有缺陷的酒，用'自然'的名义掩盖工艺不足"<br/>• "零二氧化硫会导致酒的稳定性差，长途运输后品质无法保证"<br/>• "价格虚高——很多质量一般的自然酒卖到天价，纯属营销"<br/>• "自然酒缺乏一致性，消费者无法预期买到的是好酒还是坏酒"</p></div>
<div class="region-item"><h4>我的建议</h4><p style="color:#333;line-height:1.8;margin:0">自然酒不是一种风格，而是一种酿造哲学。它有关天然、低干预、风土表达。尝试自然酒时，<strong>从口碑良好的生产商入手</strong>（名单见上文），而不是随便买一瓶。有些自然酒确实惊艳，但也确实有不少"翻车"案例。最好的方法是：保持开放心态，多做功课，从知名酒庄开始尝试。</p></div>
</section>
<h3>🍽️ 六、自然酒如何配餐</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>自然酒配餐优势</h4><p style="color:#333;line-height:1.8;margin:0">自然酒的高酸度和野性风味让它在配餐上具备独特优势，尤其适合：<br/>• <strong>发酵类食物：</strong>酸菜、泡菜、味噌、酸面包<br/>• <strong>亚洲料理：</strong>日料、泰餐、中餐的复杂味型<br/>• <strong>蔬菜和沙拉：</strong>自然酒的矿物质感与蔬菜特别契合<br/>• <strong>奶酪：</strong>尤其是风味强烈的发酵奶酪</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">自然酒是葡萄酒世界最诚实也最不完美的表达。<strong style="color:#66BB6A">它不像传统大酒那样工整华丽，但每一瓶自然酒都带着酿酒师的个性和风土的印记</strong>。无论你喜欢与否，自然酒都在改变着葡萄酒世界——让更多人开始思考：我们究竟应该喝什么样的葡萄酒？</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌿 生成自然酒完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌿 ${date.chinese} 自然酒完全指南：返璞归真还是营销噱头？`,author:'红酒顾问',digest:'自然酒是当今葡萄酒世界最具争议的潮流。真相究竟是什么？本文客观解析自然酒的定义、历史、世界版图与喝法。',content:generateContent(),coverImage:'natural_wine_cover_ai.png',category:'wine-knowledge',tags:['自然酒','Natural Wine','橙酒','自然酒运动','野生发酵','零添加'],publishDate:date.full};
    const op = path.join(__dirname,'output',`natural_wine_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
