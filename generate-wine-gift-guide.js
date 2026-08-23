/**
 * 葡萄酒送礼指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0000"/><stop offset="50%" style="stop-color:#3a0a0a"/><stop offset="100%" style="stop-color:#1a0a00"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B0000"/><stop offset="100%" style="stop-color:#FF4500"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(255,69,0,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF4500" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">送酒攻略 · 100-3000元全覆盖</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF4500" filter="url(#g)">🎁</text><rect x="20" y="130" width="500" height="2" fill="#FF4500"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF4500">葡萄酒送礼指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">见岳父 · 送领导 · 送客户 · 送朋友</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"送酒不翻车，花小钱办大事"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">预算100-3000元 · 按场景精准推荐</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF4500" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_gift_guide_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B71C1C;margin:0 0 8px 0;font-size:16px}h3{color:#B71C1C;border-bottom:2px solid #FF4500;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B71C1C;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B71C1C;">🎁 ${date.chinese} 葡萄酒送礼指南：见岳父、送领导、送客户、送朋友</h2>
<p style="text-align:center;color:#666;">从100元到3000元，按场景精准推荐。送酒不翻车的终极攻略</p>
<section style="background:linear-gradient(135deg,#1a0000,#3a0a0a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">送礼是一门学问，<strong style="color:#FF4500">送酒更是一门"潜规则"密集的社交艺术</strong>。送错了不如不送，送贵了对方不懂等于白送。本文按场景、按预算、按对象，手把手教你<strong style="color:#FF4500">送酒不翻车，花小钱办大事</strong>。</p>
</section>
<h3>📐 一、送酒黄金法则</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>法则一：看人下酒碟</h4><p style="color:#333;line-height:1.8;margin:0"><strong>对方懂酒吗？</strong><br/>懂酒的人 → 送精品和冷门（意大利BDM、纳帕膜拜、勃艮第村级）<br/>不太懂酒的人 → 送知名品牌和经典产区（拉菲系列、奔富、波尔多列级）<br/><strong>对方喝不喝酒？</strong><br/>不喝酒 → 送甜酒或贵腐（无人不爱甜）<br/>偶尔喝 → 送香槟或起泡（百搭不出错）</p></div>
<div class="region-item"><h4>法则二：场景决定预算</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>普通朋友聚会：</strong>100-200元（智利赤霞珠、西班牙里奥哈）<br/>• <strong>节日聚餐/见家长：</strong>300-500元（香槟入门款、意大利超级托斯卡纳）<br/>• <strong>见岳父/送领导：</strong>500-1000元（波尔多列级庄、勃艮第村级）<br/>• <strong>重要客户/长辈寿辰：</strong>1000-3000元+（罗曼尼康帝旗下酒、名庄大瓶装）</p></div>
</section>
<h3>🎯 二、七大场景精准推荐</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>1️⃣ 第一次见岳父</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>不出错 > 出彩。选择知名产区、有"面子"的酒款。<br/><strong>预算300-500元：</strong>法国波尔多中级庄（Cru Bourgeois）——酒瓶上写着"波尔多"，名字带"Château"，有面子。推荐：Château Chasse-Spleen、Château Phélan Ségur<br/><strong>预算500-800元：</strong>意大利经典基安蒂珍藏（Chianti Classico Riserva）或西班牙里奥哈特级珍藏（Rioja Gran Reserva）<br/><strong>避坑：</strong>不要送太冷门或名字奇怪的酒。岳父没听过=你的酒没选好。</p></div>
<div class="region-item"><h4>2️⃣ 送公司领导/上司</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>既要有品位，又不能贵到让领导不敢收。<br/><strong>预算400-700元：</strong>意大利西施佳雅副牌（Guidalberto）、法国波尔多五级庄（如Château Pontet-Canet、Château Lynch-Bages）<br/><strong>预算700-1000元：</strong>奔富Bin 389（澳洲酒王副牌，知名度极高）、法国波尔多四级庄<br/><strong>避坑：</strong>不要送威士忌（太私人化），不要送甜酒（不够正式）。波尔多列级庄是最安全的选择。</p></div>
<div class="region-item"><h4>3️⃣ 送重要客户/合作伙伴</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>必须有"故事"可讲——价格不是最重要的，背后的品牌和故事才是。<br/><strong>预算1000-1500元：</strong>法国波尔多二级庄（如Château Ducru-Beaucaillou、Château Cos d'Estournel）——送一瓶有故事的酒<br/><strong>预算1500-3000元：</strong>意大利巴罗洛顶级名庄（如Giacomo Conterno、Bruno Giacosa）、法国勃艮第村级或一级园<br/><strong>加分项：</strong>搭配一份精美的手写品酒卡，简述这款酒的背景和特点。对方如果转送给别人也能说得出"这是谁送的"。<br/><strong>避坑：</strong>不要送太便宜的酒给重要客户。宁愿送一瓶好酒，不要送两瓶一般的。</p></div>
<div class="region-item"><h4>4️⃣ 送给懂酒的朋友</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>小众精品 > 知名大牌。懂酒的人收到拉菲会微笑，但收到冷门佳作会感动。<br/><strong>预算200-400元：</strong>葡萄牙B计划（B计划是杜罗河谷的顶级酒庄）、法国北隆河Crozes-Hermitage<br/><strong>预算400-800元：</strong>意大利瓦尔泰利纳Sforzato（风干内比奥罗，罕见且惊艳）、德国摩泽尔GG雷司令、西班牙Priorat<br/><strong>避坑：</strong>不要送超市随处可见的"大路货"。要体现出"我特地为你挑了这个小众宝藏"。</p></div>
<div class="region-item"><h4>5️⃣ 家庭聚餐/节日派对</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>量大管饱 > 一瓶独秀。几瓶好喝不贵的比一瓶天价酒更受欢迎。<br/><strong>预算150-300元×2-3瓶：</strong>智利赤霞珠+新西兰长相思+意大利莫斯卡托——红白起泡各一瓶，覆盖全场需求<br/><strong>安全组合：</strong>两瓶意大利基安蒂+一瓶法国香槟入门款<br/><strong>建议：</strong>莫斯卡托（Moscato d'Asti）是家庭聚会的神器——微甜起泡，男女老少通杀。</p></div>
<div class="region-item"><h4>6️⃣ 婚礼/乔迁/纪念日</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>好看+好寓意 > 好喝。香槟永远是最佳选择。<br/><strong>预算300-600元：</strong>法国香槟（Moët Impérial、Veuve Clicquot Yellow Label）——香槟是庆祝的唯一标准<br/><strong>预算600-1200元：</strong>桃红香槟或年份香槟——更有纪念意义<br/><strong>可选的替代方案：</strong>意大利弗朗齐亚柯达（Franciacorta）——品质不输香槟，价格更友好<br/><strong>避坑：</strong>不要送需要陈年的酒。对方想立刻打开喝，一尝发现又酸又涩，场面尴尬。</p></div>
<div class="region-item"><h4>7️⃣ 送女生/不太熟的朋友</h4><p style="color:#333;line-height:1.8;margin:0"><strong>核心策略：</strong>好看+好喝+不贵。女生和不太喝酒的人最在意酒好不好看、顺不顺口。<br/><strong>预算100-200元：</strong>意大利莫斯卡托（Moscato d'Asti）+ 新西兰云雾之湾长相思（清爽百香果）<br/><strong>预算200-350元：</strong>法国桃红香槟或意大利普罗塞克<br/><strong>避坑：</strong>不要送干红！不要送干红！不要送干红！新手最怕的就是干红的酸涩感。微甜起泡和白葡萄酒才是安全选择。</p></div>
</section>
<h3>🚫 三、送酒禁忌清单</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>❌ 绝对不要做的事</h4><p style="color:#333;line-height:1.8;margin:0">• 送礼盒装超市红酒（带两个高脚杯那种）——品质最差，一眼看穿<br/>• 送没有品牌的裸瓶酒——看起来像三无产品<br/>• 送扫码价虚高的酒——现在人人都会扫码查价<br/>• 送威士忌给不熟的人——威士忌口味太私人化<br/>• 送需要陈年的酒——绝大多数送礼对象想立刻喝掉<br/>• 送白葡萄酒给长辈——老一辈普遍认为"红的才是好酒"<br/>• 送波特酒/雪莉酒——口味太特殊，一般人喝不惯</p></div>
<div class="region-item"><h4>✅ 送礼的安全牌</h4><p style="color:#333;line-height:1.8;margin:0"><strong>香槟永远是安全牌。</strong>如果实在拿不准送什么：200元以内送意大利莫斯卡托；300-500元送法国香槟或波尔多中级庄；500-1000元送意大利超级托斯卡纳；1000元以上送法国波尔多列级庄。<br/><br/><strong>特殊建议：</strong>送酒的同时搭配一个<strong>海马刀开瓶器</strong>（如果对方不常喝酒）。这个细节会让对方觉得你非常贴心。</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0000,#3a0a0a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">送酒不是炫富，而是传递品味和心意。<strong style="color:#FF4500">选对酒比选贵酒重要十倍——一瓶200元的酒，选对了场景、选对了人，比2000元的酒硬塞给对方更有意义。</strong>下次送礼前，先想想对方是谁、什么场合，然后，用心挑一瓶。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🎁 生成葡萄酒送礼指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🎁 ${date.chinese} 葡萄酒送礼指南：见岳父、送领导、送朋友——各场景精准推荐`,author:'红酒顾问',digest:'送酒不翻车的终极攻略。按场景、按预算、按对象精准推荐，100-3000元全覆盖。',content:generateContent(),coverImage:'wine_gift_guide_cover_ai.png',category:'wine-knowledge',tags:['葡萄酒送礼','送领导','见岳父','送礼指南','送酒攻略','香槟送礼'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_gift_guide_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
