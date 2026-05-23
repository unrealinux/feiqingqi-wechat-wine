/**
 * 葡萄酒配中餐完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="50%" style="stop-color:#3a1a00"/><stop offset="100%" style="stop-color:#1a0000"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#CC3300"/><stop offset="100%" style="stop-color:#FF6633"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(255,102,51,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF6633" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">中国 · 八大菜系品酒指南</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF6633" filter="url(#g)">🥢</text><rect x="20" y="130" width="500" height="2" fill="#FF6633"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF6633">葡萄酒配中餐完全指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">八大菜系 × 百款葡萄酒的完美碰撞</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"世界上最难配酒的菜系，有解了"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">打破红酒配红肉的教条，中餐自有法则</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF6633" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_chinese_food_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#CC3300;margin:0 0 8px 0;font-size:16px}h3{color:#CC3300;border-bottom:2px solid #FF6633;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#CC3300;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#CC3300;">🥢 ${date.chinese} 葡萄酒配中餐完全指南</h2>
<p style="text-align:center;color:#666;">八大菜系 × 百款美酒 · 中餐配酒的底层逻辑 · 菜式搭配全攻略</p>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">中餐是<strong style="color:#FF6633">世界上最复杂的饮食体系</strong>——一桌菜里可能有酸甜苦辣咸鲜六种味型同时出现。传统的"红酒配红肉、白酒配白肉"在西餐体系中奏效，但面对中餐的复杂味型往往失灵。本文为你<strong style="color:#FF6633">彻底打通中餐与葡萄酒的味觉桥梁</strong>。</p>
</section>
<h3>🧠 一、中餐配酒三大法则</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>法则一：按烹饪方式，而非食材</h4><p style="color:#333;line-height:1.8;margin:0">中餐的精髓在于烹饪技法——清蒸、红烧、爆炒、油炸、炖煮。同一块鱼，清蒸配雷司令，糖醋配琼瑶浆，红烧配黑皮诺。先看做法，再定酒款。</p></div>
<div class="region-item"><h4>法则二：甜配甜、酸配酸、辣配甜</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>甜味菜</strong>（叉烧、红烧肉）→ 酒不能比菜甜<br/>• <strong>酸味菜</strong>（醋溜、酸辣）→ 酒酸度要更高<br/>• <strong>辣味菜</strong>（川湘）→ 低酒精半甜白或起泡<br/>• <strong>咸鲜菜</strong>（酱烧）→ 饱满果味红/白均可</p></div>
<div class="region-item"><h4>法则三：酱汁定乾坤</h4><p style="color:#333;line-height:1.8;margin:0">中餐的灵魂是酱汁，而非主料。一道菜的最终风味80%由酱汁决定。酱油类菜肴适合饱满红酒，蚝油类适合圆润白酒，糖醋类需要高酸酒来平衡。</p></div>
</section>
<h3>🥟 二、八大菜系配酒方案</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>🌶️ 川菜（麻辣）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>麻辣、鱼香、宫保、椒麻<br/><strong>推荐酒款：</strong>琼瑶浆（Gewürztraminer）半干、莫斯卡托微起泡、雷司令半干<br/><strong>原理：</strong>辣味需要低酒精、微甜、芳香的酒来缓冲。琼瑶浆的荔枝香和甜度能完美对冲麻辣的灼烧感。<br/><strong>经典菜例：</strong>麻婆豆腐 → 雷司令半干；水煮鱼 → 琼瑶浆；宫保鸡丁 → 蓝布鲁斯科</p></div>
<div class="region-item"><h4>🥟 粤菜（清鲜）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>清鲜、原味、蚝油、豉汁<br/><strong>推荐酒款：</strong>长相思、灰皮诺、夏布利、黑皮诺<br/><strong>原理：</strong>粤菜讲究食材本味，适合酸度清爽、不掩盖食物原味的酒款。经典的清蒸鱼搭配夏布利是绝配。<br/><strong>经典菜例：</strong>清蒸石斑 → 夏布利一级园；白切鸡 → 灰皮诺；叉烧 → 黑皮诺</p></div>
<div class="region-item"><h4>🥘 鲁菜（咸鲜）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>咸鲜、酱香、葱烧、芡汁<br/><strong>推荐酒款：</strong>霞多丽（过桶）、教皇新堡、里奥哈珍藏<br/><strong>原理：</strong>鲁菜口味浓郁、酱香突出，需要酒体饱满的葡萄酒来驾驭。葱烧海参搭配过桶霞多丽的奶油质感非常契合。<br/><strong>经典菜例：</strong>葱烧海参 → 勃艮第白；糖醋鲤鱼 → 雷司令晚收；九转大肠 → 教皇新堡</p></div>
<div class="region-item"><h4>🦀 苏菜（甜鲜）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>甜鲜、酒酿、糖醋、清炖<br/><strong>推荐酒款：</strong>武弗雷（半干）、雷司令、香槟<br/><strong>原理：</strong>苏菜口味偏甜，酒款需要足够的酸度来平衡甜度。武弗雷白诗南的蜂蜜香气与苏式菜系的甜鲜感天然契合。<br/><strong>经典菜例：</strong>松鼠桂鱼 → 武弗雷半干；蟹粉豆腐 → 白中白香槟；东坡肉 → 阿玛罗尼</p></div>
<div class="region-item"><h4>🔥 湘菜（香辣）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>香辣、烟熏、腊味、剁椒<br/><strong>推荐酒款：</strong>绿酒（Vinho Verde）、阿尔萨斯灰皮诺、蓝布鲁斯科<br/><strong>原理：</strong>湘菜的烟熏和腊味风味与大自然的绿酒非常契合，微气泡能清洁味蕾。<br/><strong>经典菜例：</strong>剁椒鱼头 → 阿尔萨斯灰皮诺；腊肉炒蒜苗 → 教皇新堡；口味虾 → 蓝布鲁斯科</p></div>
<div class="region-item"><h4>🍗 闽菜（醇厚）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>醇厚、酒香、鲜嫩、红糟<br/><strong>推荐酒款：</strong>里奥哈（陈年）、勃艮第红、意大利巴巴莱斯科<br/><strong>原理：</strong>闽菜以高汤和酒糟著称，需要酒体适中、单宁细腻的红酒。<br/><strong>经典菜例：</strong>佛跳墙 → 巴巴莱斯科；荔枝肉 → 博若莱；红糟鸡 → 里奥哈珍藏</p></div>
<div class="region-item"><h4>🥗 浙菜（清爽）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>清爽、咸鲜、清淡、酒香<br/><strong>推荐酒款：</strong>桑塞尔、维蒙蒂诺、基安蒂<br/><strong>原理：</strong>浙菜是八大菜系中最清淡的之一，需要优雅矿物感的酒款。<br/><strong>经典菜例：</strong>西湖醋鱼 → 桑塞尔长相思；龙井虾仁 → 基安蒂；叫花鸡 → 勃艮第红</p></div>
<div class="region-item"><h4>🍲 徽菜（浓郁）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心味型：</strong>浓郁、咸鲜、酱红、山珍<br/><strong>推荐酒款：</strong>西拉、马尔贝克、巴罗洛<br/><strong>原理：</strong>徽菜重油重色、火候足，需要结构强大的红酒来匹配。<br/><strong>经典菜例：</strong>臭鳜鱼 → 阿尔萨斯灰皮诺；毛豆腐 → 桑塞尔；徽州一品锅 → 西拉</p></div>
</section>
<h3>🔥 三、特殊场景配酒</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<table>
<tr><th>场景</th><th>推荐酒款</th><th>理由</th></tr>
<tr><td>火锅（川渝）</td><td>香槟/起泡酒</td><td>气泡冰镇解辣，清爽味蕾</td></tr>
<tr><td>火锅（潮汕牛肉）</td><td>黑皮诺/桑塞尔</td><td>清鲜牛肉的最佳搭档</td></tr>
<tr><td>烧烤/烤串</td><td>西拉/马尔贝克</td><td>烟熏味与强劲红葡萄酒相得益彰</td></tr>
<tr><td>早茶/点心</td><td>莫斯卡托/香槟</td><td>微甜起泡与多种点心百搭</td></tr>
<tr><td>北京烤鸭</td><td>黑皮诺（勃艮第）</td><td>经典搭配，果味和单宁完美匹配鸭肉</td></tr>
<tr><td>大闸蟹（秋季）</td><td>白中白香槟</td><td>高酸清爽，搭配蟹黄</td></tr>
<tr><td>年夜饭/家宴</td><td>起泡酒开场+红白搭配</td><td>多样菜式需要多样化酒款</td></tr>
</table>
</section>
<h3>⚠️ 四、中餐配酒常见误区</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>误区一：红酒配牛肉就一定对</h4><p style="color:#333;line-height:1.8;margin:0"><strong>事实：</strong>水煮牛肉是牛肉，但麻辣汤底会让大多数干红难以下咽。需要的是半干雷司令或莫斯卡托，而非赤霞珠。</p></div>
<div class="region-item"><h4>误区二：海鲜只能配白葡萄酒</h4><p style="color:#333;line-height:1.8;margin:0"><strong>事实：</strong>蒜蓉粉丝蒸扇贝配黑皮诺非常惊艳。关键在于调味和烹饪方式，而非食材本身。</p></div>
<div class="region-item"><h4>误区三：越贵的酒越好配餐</h4><p style="color:#333;line-height:1.8;margin:0"><strong>事实：</strong>顶级勃艮第更适合单独品鉴。百元级的灰皮诺、雷司令、佳美往往才是配餐王者。中餐讲究的是"化学搭配"，而非价格。</p></div>
<div class="region-item"><h4>误区四：一餐只能喝一款酒</h4><p style="color:#333;line-height:1.8;margin:0"><strong>事实：</strong>中餐是分享式就餐，一桌菜有多个味型。开一瓶起泡酒做开场，搭配白葡萄酒清蒸菜、红葡萄酒烧肉菜，才是正确思路。</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">中餐配葡萄酒不是一个非此即彼的选择题，而是一场味觉探索。<strong style="color:#FF6633">没有绝对的"正确"搭配，只有让你惊喜的味觉发现</strong>。下次聚餐时，不妨带上一瓶琼瑶浆或蓝布鲁斯科，打开你的中餐配酒新世界。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥢 生成葡萄酒配中餐完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🥢 ${date.chinese} 葡萄酒配中餐完全指南：八大菜系搭配全攻略`,author:'红酒顾问',digest:'中餐是世界上最难配酒的菜系之一。本文从八大菜系入手，彻底打通中餐与葡萄酒的味觉桥梁。',content:generateContent(),coverImage:'wine_chinese_food_cover_ai.png',category:'wine-knowledge',tags:['中餐配酒','八大菜系','葡萄酒搭配','美食指南','川菜配酒'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_chinese_food_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
