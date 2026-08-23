/**
 * 全球最怪葡萄酒
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a0a"/><stop offset="50%" style="stop-color:#2a0a1a"/><stop offset="100%" style="stop-color:#0a0010"/></linearGradient><radialGradient id="neon"><stop offset="0" style="stop-color:#FF00FF;stop-opacity:0.3"/><stop offset="100%" style="stop-color:#FF00FF;stop-opacity:0"/></radialGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#9400D3"/><stop offset="50%" style="stop-color:#FF00FF"/><stop offset="100%" style="stop-color:#00BFFF"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="url(#neon)"/><rect x="610" y="190" width="160" height="200" rx="5" fill="#1a0a2a" stroke="#FF00FF" stroke-width="1.5" opacity="0.6"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="middle">树脂酒 · 陶罐酒 · 烟熏酒 · 蚂蚁酒</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF00FF" filter="url(#g)">👽</text><rect x="20" y="130" width="500" height="2" fill="#FF00FF"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF00FF">全球最怪葡萄酒</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">这些酒颠覆你对葡萄酒的所有认知</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"喝过3种算你狠，喝过5种你就是大神"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">希腊树脂 · 格鲁吉亚陶罐 · 烟熏 · 蚂蚁 · 橙酒 · 冰酒</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF00FF" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','weirdest_wines_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#9400D3;margin:0 0 8px 0;font-size:16px}h3{color:#9400D3;border-bottom:2px solid #FF00FF;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#9400D3;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#9400D3;">👽 ${date.chinese} 全球最怪葡萄酒：喝过3种算你狠</h2>
<p style="text-align:center;color:#666;">从树脂到蚂蚁，从烟熏到陶罐——葡萄酒的世界远比你想的狂野</p>
<section style="background:linear-gradient(135deg,#0a0a0a,#2a0a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E1BEE7;font-size:16px;line-height:1.9">你以为葡萄酒就是赤霞珠和黑皮诺？<strong style="color:#FF00FF">那你想得太简单了。</strong>在世界的某个角落，有人在酒里加了松脂、有人把酒埋在地下几千年、有人用烟熏葡萄、甚至有人在酒里泡蚂蚁……<strong style="color:#FF00FF">这不是恶搞，这些都是真实存在的葡萄酒。</strong>今天带你见识全球最怪的10种葡萄酒。</p>
</section>

<h3>🥇 No.1 希腊松脂酒 Retsina</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>怪在哪：</strong>加了松脂的葡萄酒。<br/><br/>Retsina是希腊的传统白葡萄酒，酿造过程中加入了<strong>阿勒颇松树的树脂</strong>。在古代，松脂用来密封陶罐防止空气进入——没想到产生了独特的松木和松针的味道。<br/><br/><strong>喝起来像什么？</strong>你走进一片松树林，空气里都是松脂的清香——但这是酒。初闻像松节油，喝下去却有柑橘和草本的味道。爱的人爱到痴迷，恨的人说像喝漱口水。<br/><br/><strong>哪里买：</strong>希腊餐厅或希腊进口商店。价格极便宜（€5-10）。<br/><strong>配餐建议：</strong>希腊沙拉、烤鱼、羊乳酪——松脂的强烈味道需要同样浓郁的食物来配。</p>
</section>

<h3>🥈 No.2 格鲁吉亚陶罐酒 Qvevri</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>怪在哪：</strong>在埋入地下的巨型陶罐中酿酒——8000年没变过的工艺。<br/><br/>格鲁吉亚人用叫做<strong>Qvevri</strong>的蛋形陶罐酿酒。陶罐埋入地下，只露出颈部。葡萄带皮、带梗、带籽全部放入罐中，自然发酵数月甚至一年。<br/><br/><strong>喝起来像什么？</strong>粗犷、狂野、单宁感强烈。如果是白葡萄带皮发酵（橙酒），你会喝到强烈的茶色、单宁感和坚果味——完全不像你认知中的白葡萄酒。<br/><br/><strong>为什么埋在地下？</strong>地温恒定，不需要温控设备。陶罐的微孔允许微量氧气交换，和橡木桶类似但风味完全不同。<br/><br/><strong>推荐品种：</strong>Saferavi（红）、Rkatsiteli（白/橙）。</p>
</section>

<h3>🥉 No.3 橙酒 Orange Wine</h3>
<section style="background:#ECEFF1;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>怪在哪：</strong>白葡萄像红葡萄酒一样酿——带皮发酵。<br/><br/>这不是用橙子做的酒（别和橙味鸡尾酒搞混）。橙酒是白葡萄酒的一个特殊品类：<strong>白葡萄带皮发酵数周甚至数月</strong>，萃取葡萄皮中的色素、单宁和风味物质。<br/><br/><strong>喝起来像什么？</strong>琥珀色的酒液，有强烈的单宁感（像红酒），味道像干果、橙皮、坚果、蜂蜜。口感是"红酒的结构+白葡萄酒的果味"的合体。<br/><br/><strong>和自然酒的关系：</strong>橙酒是自然酒运动的核心品类。斯洛文尼亚的Gravner、意大利的Radikon是先锋人物。<br/><br/><strong>入门推荐：</strong>意大利弗留利产区的橙酒相对温和，适合入坑。</p>
</section>

<h3>🎭 其他七款怪酒</h3>
<section style="background:#F3E5F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>4. 烟熏葡萄酒 Fumé Blanc / 烟熏萨瓦</h4><p style="color:#333;line-height:1.8;margin:0">法国汝拉产区（Jura）有一种叫做<strong>Vin Jaune</strong>（黄酒）的特殊酒款——在橡木桶中陈年6年以上，表面形成一层酵母膜（flor），类似雪莉酒的酿造方式。风味极度独特：核桃、咖喱、生姜、蜡质。<br/>还有汝拉的<strong>Vin de Paille</strong>（稻草酒）：葡萄在稻草上风干数月后再发酵，浓缩如糖浆。<br/><strong>必试：</strong>Château-Chalon AOC的Vin Jaune。</p></div>
<div class="region-item"><h4>5. 蚂蚁酒 Ant Wine / 虫酒</h4><p style="color:#333;line-height:1.8;margin:0">是的你没看错——有些酿酒师真的在酒里加了蚂蚁。墨西哥瓦哈卡州的传统中，有一种叫做<strong>"蚁酒"</strong>的饮料，将当地特有的蚂蚁加入龙舌兰或葡萄酒中。<br/>更"著名"的是：意大利有酿酒师在实验阶段加入了可食用蚂蚁，声称蚂蚁的酸味能为酒增添<strong>"柑橘和花香"</strong>。<br/><strong>你喝吗？</strong>目前这不是主流产品，但在自然酒的实验派圈子中确实存在。</p></div>
<div class="region-item"><h4>6. 冰冻酒 Ice Wine 冰酒</h4><p style="color:#333;line-height:1.8;margin:0">你可能听说过冰酒是甜的——但你没听过它有多"变态"。<br/>葡萄在藤上<strong>自然结冰</strong>（温度达到-8°C以下）后采摘。结冰的葡萄中水分结成冰晶，去掉冰晶后只留下浓缩的糖分和酸度。一颗冰葡萄的出汁率只有普通葡萄的<strong>1/10</strong>。<br/><strong>喝起来像什么？</strong>液态蜂蜜——极其浓郁的甜，但又有惊人的酸度平衡。一口下去，满嘴都是桃子、杏子和蜂蜜的爆炸感。<br/><strong>产区：</strong>加拿大（最著名）、德国、奥地利。</p></div>
<div class="region-item"><h4>7. 贵腐酒 Noble Rot / Botrytis</h4><p style="color:#333;line-height:1.8;margin:0">让葡萄<strong>"发霉"</strong>后再酿酒——这就是贵腐酒的本质。<br/>一种叫做Botrytis Cinerea的"贵腐菌"在特定气候条件下感染葡萄，菌丝在葡萄皮上钻出微孔，让水分蒸发、糖分和风味物质浓缩。<br/><strong>听起来恶心，喝起来是什么感觉？</strong>上帝的美酒。蜂蜜、杏脯、姜糖、橘子酱——层层叠叠的香气，甜而不腻。<br/><strong>三大产区：</strong>法国苏玳（Sauternes，最著名）、匈牙利托卡伊（Tokaji）、德国BA/TBA贵腐精选。</p></div>
<div class="region-item"><h4>8. 二氧化碳浸渍法酒 Carbonic Maceration</h4><p style="color:#333;line-height:1.8;margin:0">博若莱新酒（Beaujolais Nouveau）的酿造方法——<strong>整串葡萄不破碎、不压榨，直接放入充满二氧化碳的密封罐</strong>。没有酵母参与，葡萄在细胞内进行厌氧发酵。<br/><strong>喝起来什么感觉？</strong>完全不像酒——更像葡萄汁+一点点酒精+香蕉味口香糖。单宁极低，果味爆炸。很多人第一次喝以为是无酒精饮料。<br/><strong>更狂野的版本：</strong>现在很多自然酒酿酒师用二氧化碳浸渍法做"红葡萄汁酒"，喝起来像极度清澈的红果汽水。</p></div>
<div class="region-item"><h4>9. 雪莉酒的老化系统 Solera</h4><p style="color:#333;line-height:1.8;margin:0">西班牙雪莉酒（Sherry）的Solera陈年系统堪称葡萄酒界的"时间机器"。<br/>橡木桶叠成几层金字塔：最底层是最老的酒，最顶层是最新的酒。每年从最底层取出一部分装瓶，然后用上一层的酒补满，以此类推——所以<strong>你喝到的每一瓶雪莉酒，都是过去几十年甚至上百年所有年份的混合</strong>。<br/><strong>最怪的雪莉：</strong>Fino（极干，像海风+杏仁）、Palo Cortado（神秘的意外风格，像上天赐予的奇迹）。</p></div>
<div class="region-item"><h4>10. "地狱"葡萄酒 Hell Wine / 火山葡萄酒</h4><p style="color:#333;line-height:1.8;margin:0">西西里岛的埃特纳火山（Mount Etna）——活火山山坡上酿造的葡萄酒。<br/>火山土壤富含矿物质，白天炎热夜晚寒冷的极端气候，加上微量的火山灰——使得埃特纳的Nerello Mascalese葡萄酒有一种<strong>矿物感和烟熏感</strong>，像是大地的血液。<br/><strong>最怪的部分：</strong>葡萄园在海拔1000米以上的火山斜坡上，采收季时常有火山活动。喝酒时你喝到的每一口，都带着地球深处的力量。<br/><strong>推荐：</strong>Benanti、Passopisciaro等酒庄。</p></div>
</section>

<section style="background:linear-gradient(135deg,#0a0a0a,#2a0a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E1BEE7;font-size:16px;line-height:1.9">葡萄酒的世界远比你想象的大。当你在喝赤霞珠和霞多丽的时候，有人在喝加了松脂的酒、有人在地下陶罐里酿了八千年的酒、有人在活火山上种葡萄……<strong style="color:#FF00FF">别把自己局限在安全区——怪酒虽然奇怪，但它们能打开你一扇通往新世界的门。</strong></p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n👽 生成全球最怪葡萄酒\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`👽 ${date.chinese} 全球最怪葡萄酒：喝过3种算你狠，喝过5种你是大神`,author:'红酒顾问',digest:'从希腊松脂酒到格鲁吉亚陶罐，从蚂蚁酒到活火山葡萄酒——葡萄酒的世界比你想象的狂野一百倍。',content:generateContent(),coverImage:'weirdest_wines_cover_ai.png',category:'wine-culture',tags:['怪酒','橙酒','冰酒','贵腐','陶罐酒','松脂酒','雪莉','火山葡萄酒','自然酒'],publishDate:date.full};
    const op = path.join(__dirname,'output',`weirdest_wines_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
