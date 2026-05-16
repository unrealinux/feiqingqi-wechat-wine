/**
 * 撒丁岛卡诺娜完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a0a"/><stop offset="50%" style="stop-color:#3a1a1a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#B22222"/><stop offset="100%" style="stop-color:#FF6347"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="120" r="160" fill="rgba(255,99,71,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#FF6347" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Sardinia, Italy · Cannonau di Sardegna DOCG</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FF6347" filter="url(#g)">🏝️</text><rect x="20" y="130" width="500" height="2" fill="#FF6347"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FF6347">撒丁岛卡诺娜</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">撒丁岛 · 长寿之乡的红宝石</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"世界上最长寿人群日常饮用的葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">地中海的阳光与热情</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FF6347" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','cannonau_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B22222;margin:0 0 8px 0;font-size:16px}h3{color:#B22222;border-bottom:2px solid #FF6347;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B22222;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B22222;">🏝️ ${date.chinese} 撒丁岛卡诺娜完全指南</h2>
<p style="text-align:center;color:#666;">撒丁岛 · 歌海娜的表亲 · 蓝色地带的长寿秘诀 · 地中海阳光</p>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">卡诺娜（Cannonau）是<strong style="color:#FF6347">撒丁岛最引以为傲的红葡萄品种</strong>，基因上与法国的歌海娜（Grenache）有着密切的亲戚关系。这款葡萄酒与撒丁岛的<strong style="color:#FF6347">"蓝色地带"（Blue Zone）</strong>长寿现象紧密相关——这里居住着世界上最高比例百岁老人的地区之一，当地人几乎每天都会饮用卡诺娜葡萄酒。</p>
</section>
<h3>🏝️ 一、历史与风土</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>古老起源</h4><p style="color:#333;line-height:1.8;margin:0">卡诺娜在撒丁岛的种植历史可以追溯到3000年前，由腓尼基人引入。一些古老的葡萄藤树龄超过100年，根系深深扎入撒丁岛的花岗岩和石灰岩土壤中，产出极为浓缩的果实。</p></div>
<div class="region-item"><h4>撒丁岛风土</h4><p style="color:#333;line-height:1.8;margin:0">撒丁岛拥有独特的地中海气候——炎热干燥的夏季、温和的冬季，加上持续不断的海风。葡萄园多位于山坡上的梯田，土壤以花岗岩、石灰岩和火山岩为主。这种环境使得卡诺娜葡萄酒拥有浓郁的果味、高酒精度和独特的矿物感。</p></div>
</section>
<h3>🍇 二、主要产区分级</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<table>
<tr><th>产区</th><th>风格特点</th></tr>
<tr><td>Cannonau di Sardegna DOCG</td><td>基本等级，覆盖全岛，果味浓郁，酒体饱满</td></tr>
<tr><td>Cannonau di Sardegna Classico</td><td>来自传统核心种植区，更加优雅细腻</td></tr>
<tr><td>Cannonau di Sardegna Riserva</td><td>至少陈酿2年，更加复杂，单宁圆润</td></tr>
<tr><td>Jerzu DOCG</td><td>来自东海岸，是卡诺娜最著名的子产区之一，风格强劲</td></tr>
<tr><td>Ogliastra DOC</td><td>来自"蓝色地带"核心区域，当地百岁老人的日常饮品</td></tr>
</table>
</section>
<h3>🏆 三、品鉴特征</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>卡诺娜品鉴</h4><p style="color:#333;line-height:1.8;margin:0"><strong>色泽：</strong>深宝石红色，带有紫色光泽<br/><strong>香气：</strong>黑莓、黑樱桃、覆盆子、地中海草本（迷迭香、百里香）、甘草、黑胡椒<br/><strong>口感：</strong>酒体饱满，酸度适中，单宁柔顺，酒精度高（通常14-16%），果味浓郁</p></div>
<div class="region-item"><h4>与歌海娜的对比</h4><p style="color:#333;line-height:1.8;margin:0">相比法国南部的歌海娜，撒丁岛的卡诺娜通常更加浓郁、酒精度更高、单宁结构更强，带有更多地中海草本植物的香气。陈年后的卡诺娜会发展出皮革、焦油和干果的复杂风味。</p></div>
</section>
<h3>🍽️ 四、美食搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<div class="region-item"><h4>撒丁岛特色搭配</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>Porceddu（烤乳猪）：</strong>撒丁岛最著名的传统菜肴，卡诺娜的完美搭档<br/>• <strong>帕尔玛火腿和萨拉米：</strong>经典搭配<br/>• <strong>烤羊肉：</strong>撒丁岛的山羊和绵羊肉，用香草烤制<br/>• <strong>陈年奶酪：</strong>撒丁岛的Pecorino Romano奶酪</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a0a,#3a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFB6C1;font-size:16px;line-height:1.9">卡诺娜不仅是一款美味的葡萄酒，更是撒丁岛文化和长寿传统的象征。<strong style="color:#FF6347">每一杯卡诺娜都蕴含着地中海的阳光、花岗岩风土和三千年的种植历史</strong>。当你品尝卡诺娜时，你品尝的是撒丁岛的整个灵魂。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏝️ 生成撒丁岛卡诺娜完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏝️ ${date.chinese} 撒丁岛卡诺娜完全指南：蓝色地带的长寿之酒`,author:'红酒顾问',digest:'卡诺娜是撒丁岛最著名的红葡萄酒，与长寿之乡撒丁岛蓝色地带紧密相关，是歌海娜的近亲。',content:generateContent(),coverImage:'cannonau_cover_ai.png',category:'wine-knowledge',tags:['卡诺娜','撒丁岛','歌海娜','意大利葡萄酒','蓝色地带','Cannonau'],publishDate:date.full};
    const op = path.join(__dirname,'output',`cannonau_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
