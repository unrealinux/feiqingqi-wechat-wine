/**
 * 醒酒与杯具
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a20"/><stop offset="50%" style="stop-color:#1a3a45"/><stop offset="100%" style="stop-color:#0a1a20"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#546E7A"/><stop offset="100%" style="stop-color:#90A4AE"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(144,164,174,0.07)"/><path d="M660 180 L640 200 L680 200 L660 180 Z" fill="rgba(255,255,255,0.15)"/><ellipse cx="660" cy="210" rx="30" ry="45" fill="none" stroke="#90A4AE" stroke-width="1.5"/><ellipse cx="660" cy="210" rx="20" ry="45" fill="rgba(200,50,50,0.15)"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">什么时候需要醒酒？什么杯型配什么酒？</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#90A4AE" filter="url(#g)">🥂</text><rect x="20" y="130" width="500" height="2" fill="#90A4AE"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#90A4AE">醒酒与杯具指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">什么时候需要醒酒？杯型真的影响口感吗？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"一次说清楚所有和酒杯有关的困惑"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">醒酒时机 · 杯型选择 · 倒酒礼仪 · 保养清洗</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#90A4AE" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','decanting_glasses_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#546E7A;margin:0 0 8px 0;font-size:16px}h3{color:#546E7A;border-bottom:2px solid #90A4AE;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#546E7A;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#546E7A;">🥂 ${date.chinese} 醒酒与杯具指南：什么时候需要醒酒？杯型真的影响口感吗？</h2>
<p style="text-align:center;color:#666;">从醒酒器到高脚杯，从倒酒到清洗——关于饮酒器具的一切</p>
<section style="background:linear-gradient(135deg,#0a1a20,#1a3a45);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0BEC5;font-size:16px;line-height:1.9">打开一瓶好酒，你是不是也会犹豫：<strong style="color:#90A4AE">要不要先倒进醒酒器？用哪种酒杯才对？</strong>有人觉得这是仪式感，有人觉得是玄学。今天我们就来拆解这些"喝酒的规矩"——哪些有科学依据，哪些只是营销话术。</p>
</section>
<h3>🫗 一、醒酒：什么时候必须做？</h3>
<section style="background:#ECEFF1;padding:18px;border-radius:8px">
<div class="region-item"><h4>✅ 必须醒酒的情况</h4><p style="color:#333;line-height:1.8;margin:0"><strong>1. 年轻且单宁厚重的红葡萄酒</strong><br/>如：波尔多列级庄、巴罗洛、巴巴莱斯科、里奥哈Gran Reserva<br/>这些酒刚开瓶时"封闭"——香气没有打开，单宁紧涩。醒酒30分钟到2小时，让酒和氧气充分接触，单宁柔化，香气释放。<br/><br/><strong>2. 有沉淀的老酒</strong><br/>10年以上的红酒瓶底往往有天然色素和单宁沉淀。直接把酒倒入醒酒器的时候，用烛光或手电筒照瓶颈，在沉淀即将流出时停手。醒酒不是为了让它"呼吸"，而是分离沉淀。<br/><strong>注意：老酒醒酒时间要短，15-30分钟即可，太长老酒会迅速氧化失去风味。</strong><br/><br/><strong>3. 有异味的酒</strong><br/>如果一瓶酒开瓶后闻到霉味、还原味（类似臭鸡蛋或火柴味），醒酒可以快速让这些异味挥发。</p></div>
<div class="region-item"><h4>❌ 不需要醒酒的情况</h4><p style="color:#333;line-height:1.8;margin:0">• 绝大多数百元以内的日常酒——已经开瓶即饮，醒酒不会变好<br/>• 白葡萄酒和桃红酒——不需要醒，冷藏直接喝<br/>• 香槟和起泡酒——醒酒会让气泡跑光<br/>• 老酒（超过15年）——醒酒主要用于去沉淀，不是为了让酒"呼吸"<br/>• 薄酒的年轻红酒（如博若莱新酒）——开瓶直接喝</p></div>
<div class="region-item"><h4>没有醒酒器怎么办？</h4><p style="color:#333;line-height:1.8;margin:0">用一个大号的玻璃水壶或凉水壶就能代替。甚至：<strong>倒进一个大口的马克杯</strong>转几圈，效果一样好。醒酒器的真正价值在于<strong>优雅和美观</strong>——而不是功能上的不可替代性。</p></div>
</section>
<h3>🥃 二、酒杯：真的越贵越好吗？</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>杯型对口感有影响吗？答案是：有，但被夸大了</h4><p style="color:#333;line-height:1.8;margin:0">杯型影响两方面：<strong>香气集中度</strong>和<strong>酒液入口的位置</strong>。<br/>• 杯口收窄 → 香气更集中，鼻子能闻到更多<br/>• 大杯肚 → 酒液和空气接触面积大，加速氧化<br/>• 杯口大小 → 决定酒液在口腔中的第一落点<br/><br/>但<strong>这种差异对99%的饮酒者来说，微乎其微</strong>。用一只合适的杯子喝酒vs用茶杯喝酒——有区别。用Riedel vs用宜家9.9元杯——区别极小。</p></div>
<div class="region-item"><h4>日常家庭配置建议</h4><p style="color:#333;line-height:1.8;margin:0">不需要买齐所有专用杯型。三只就够了：<br/><br/><strong>1. 红葡萄酒杯（通用型）</strong>——杯肚较大，杯口微收。赤霞珠、黑皮诺、西拉等红酒通用。<br/><strong>2. 白葡萄酒杯</strong>——杯肚较小，杯口较直。保持白葡萄酒的低温，集中清新香气。<br/><strong>3. 香槟杯/起泡酒杯</strong>——笛型杯（郁金香型），细长，减少酒液和空气接触，保留气泡。<br/><br/>如果想极致精简：<strong>一只ISO标准品酒杯</strong>（标准口杯）能喝所有类型的酒。全世界的专业品酒师都用它。</p></div>
<div class="region-item"><h4>什么杯子不推荐？</h4><p style="color:#333;line-height:1.8;margin:0">• ❌ 古老的"碟形香槟杯"——香槟气泡消失得太快，历史原因才流行（传说以玛丽皇后胸部为模型）<br/>• ❌ 那种底部带球形的"快速醒酒杯"——结构脆弱容易碎，而且醒酒效果不如直接倒进醒酒器<br/>• ❌ 彩色/磨砂酒杯——看不到酒的颜色，无法欣赏葡萄酒最直观的美</p></div>
</section>
<h3>🍷 三、倒酒的标准</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<table>
<tr><th>酒种</th><th>倒酒量</th><th>原因</th></tr>
<tr><td>红葡萄酒</td><td>杯肚最宽处的1/3（约150ml）</td><td>留足空间摇晃，释放香气</td></tr>
<tr><td>白葡萄酒</td><td>1/2杯（约120ml）</td><td>杯肚较小，倒太多手温会加热酒</td></tr>
<tr><td>香槟/起泡</td><td>3/4杯（约180ml）</td><td>笛型杯细长，倒满显得精致且保留气泡</td></tr>
<tr><td>品酒（专业场合）</td><td>约50ml</td><td>标准品酒量，足够评估</td></tr>
</table>
</section>
<h3>🧼 四、酒杯的保养和清洗</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>千万别做的事</h4><p style="color:#333;line-height:1.8;margin:0">• ❌ 用洗碗机洗精致酒杯——高温会损坏玻璃，洗涤剂残留影响口感<br/>• ❌ 洗完后用毛巾擦干——毛巾纤维会留在杯壁，形成"水痕指纹"<br/>• ❌ 一洗一摞放——杯口和杯脚互相磕碰，容易碎</p></div>
<div class="region-item"><h4>正确清洗方法</h4><p style="color:#333;line-height:1.8;margin:0">1️⃣ 温水和中性洗涤剂手洗，用海绵轻擦<br/>2️⃣ 用热水冲净，确保无洗涤剂残留<br/>3️⃣ <strong>倒挂沥干</strong>——不要擦！让水流自然滴干。如果急着用，可以用<strong>亚麻布或专用的无绒擦杯布</strong>轻轻擦干<br/>4️⃣ <strong>挂杯存放</strong>——杯口朝上或杯口朝下挂起来，杯脚朝上放稳，避免杯口积灰</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a20,#1a3a45);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0BEC5;font-size:16px;line-height:1.9">别让"仪式感"成为喝酒的负担。<strong style="color:#90A4AE">醒酒器不买也能喝，用茶杯也能品红酒。</strong>精致的器皿是为了让喝酒的体验更愉悦——如果清洗起来让你不开心，那就用最简单的杯子。记住：<strong style="color:#90A4AE">酒是用来享受的，不是用来焦虑的。</strong></p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成醒酒与杯具指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🥂 ${date.chinese} 醒酒与杯具指南：什么时候需要醒酒？杯型真的影响口感？`,author:'红酒顾问',digest:'关于醒酒器和酒杯的一切——什么时候必须醒酒？杯型有没有区别？如何清洗保养？一次说清楚。',content:generateContent(),coverImage:'decanting_glasses_cover_ai.png',category:'wine-knowledge',tags:['醒酒','酒杯','醒酒器','酒杯清洗','喝酒礼仪','品酒器具'],publishDate:date.full};
    const op = path.join(__dirname,'output',`decanting_glasses_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
