/**
 * 寒凉vs温暖气候葡萄酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a2a"/><stop offset="50%" style="stop-color:#1a2a3a"/><stop offset="100%" style="stop-color:#2a1a0a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#1565C0"/><stop offset="100%" style="stop-color:#D84315"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="620" cy="100" r="80" fill="rgba(21,101,192,0.12)"/><circle cx="730" cy="100" r="80" fill="rgba(216,67,21,0.12)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#D84315" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Cool Climate vs Warm Climate</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#FFF" filter="url(#g)">🌡️</text><rect x="20" y="130" width="500" height="2" fill="#FFF"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#FFF">寒凉 vs 温暖气候</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">同一品种的天壤之别</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"气候塑造的风格，比品种更加深刻"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">夏布利 vs 加州霞多丽 · 巴罗洛 vs 巴罗莎 · 一瓶酒的基因和后天</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#FFF" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','climate_styles_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#1565C0;margin:0 0 8px 0;font-size:16px}h3{color:#1565C0;border-bottom:2px solid #D84315;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#D84315;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#1565C0;">🌡️ ${date.chinese} 寒凉 vs 温暖气候：同一品种的天壤之别</h2>
<p style="text-align:center;color:#666;">夏布利 vs 加州 · 巴罗洛 vs 巴罗莎 · 香槟 vs 普洛赛克——气候如何塑造每一瓶酒的灵魂</p>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">最被低估的葡萄酒知识：<strong style="color:#42A5F5">气候对葡萄酒风格的影响，有时比葡萄品种本身还要大</strong>。同样是霞多丽，夏布利清瘦如刀锋，加州霞多丽饱满如奶油。同样是黑皮诺，香槟清新优雅，加州俄勒冈浓郁甜美。<strong style="color:#D84315">学会识别气候风格，你就掌握了选酒的核心密码。</strong></p>
</section>
<h3>🌡️ 一、气候如何影响葡萄酒？</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>温度与葡萄成熟的化学</h4><p style="color:#333;line-height:1.8;margin:0"><strong>寒凉气候（Cool Climate）</strong>：平均生长季温度14-17°C。葡萄缓慢成熟，保留高酸度，糖分积累较慢，酒精度低（通常12-13%）。风味偏向绿色水果、草本和矿物。<br/><strong>温和气候（Moderate Climate）</strong>：17-19°C。平衡的酸甜度，经典产区多属此类。<br/><strong>温暖气候（Warm Climate）</strong>：19-24°C。葡萄快速成熟，酸度迅速下降，糖分大量积累，酒精度高（13.5-15.5%+）。风味偏向深色水果、果酱和香料。</p></div>
<div class="region-item"><h4>气候不是唯一的因素</h4><p style="color:#333;line-height:1.8;margin:0">除气候类型外，以下因素同样重要：<strong>海拔</strong>（每升高100米温度下降0.6°C）、<strong>朝向</strong>（向阳 vs 背阳）、<strong>土壤</strong>（反射热量、排水性）、<strong>水源</strong>（海洋调节）、<strong>云层覆盖</strong>（减少日照）。这就是为什么一个产区内部可以有截然不同的风格。</p></div>
</section>
<h3>🍇 二、同品种·不同气候的经典对比</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>🍏 霞多丽（Chardonnay）— 最极端的对比</h4><p style="color:#333;line-height:1.8;margin:0"><strong>❄️ 寒凉（法国夏布利 Chablis）：</strong>青苹果、柠檬皮、燧石、海盐。几乎没有橡木味，高酸清瘦如钢铁。入门级酒精度11.5-12.5%。<br/><strong>☀️ 温暖（加州纳帕/索诺玛）：</strong>菠萝、芒果、香草、黄油、烤橡木。饱满圆润，经过苹果酸乳酸发酵和橡木桶陈酿。酒精度14-15%。<br/><strong>🟡 中间（法国普利尼-蒙哈榭）：</strong>柑橘、白桃、榛子、杏仁。恰到好处的平衡——酸度与饱满度的完美结合。勃艮第白是霞多丽的中庸之道。</p></div>
<div class="region-item"><h4>🍒 黑皮诺（Pinot Noir）— 最娇贵的品种</h4><p style="color:#333;line-height:1.8;margin:0"><strong>❄️ 寒凉（法国勃艮第/香槟）：</strong>红樱桃、覆盆子、玫瑰花瓣、泥土、蘑菇。单宁细腻如丝，酸度明亮，酒体轻盈。香槟的黑皮诺用于起泡酒基酒。<br/><strong>☀️ 温暖（美国加州/新西兰中部奥塔哥）：</strong>黑樱桃、草莓果酱、摩卡、甜香料。酒体更加丰满，单宁更成熟，酒精感更强。<br/><strong>🔑 关键：</strong>黑皮诺在温暖气候下容易失去品种标志性的优雅花香和精致感。因此<strong>勃艮第仍然是黑皮诺的终极标准</strong>。</p></div>
<div class="region-item"><h4>🌶️ 赤霞珠（Cabernet Sauvignon）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>❄️ 寒凉（法国波尔多左岸/美国华盛顿州）：</strong>黑加仑、青椒、雪松、铅笔芯、烟草。单宁紧致，酸度清爽，结构感强。需要长时间陈年才能绽放。<br/><strong>☀️ 温暖（加州纳帕/澳大利亚库纳瓦拉）：</strong>黑莓、黑樱桃、薄荷、巧克力、香草。饱满圆润，单宁成熟圆滑，可年轻饮用。<br/><strong>💡 注意：</strong>"青椒味"是赤霞珠在寒凉气候下特有的吡嗪（Pyrazine）化合物风味，有人爱有人恨。</p></div>
<div class="region-item"><h4>🍇 西拉/设拉子（Syrah/Shiraz）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>❄️ 寒凉（法国北罗讷河谷）：</strong>紫罗兰、黑橄榄、胡椒、培根、熏肉。优雅辛辣，单宁细腻，酸度突出。<br/><strong>☀️ 温暖（澳大利亚巴罗莎/麦克拉伦谷）：</strong>黑莓果酱、甘草、巧克力、甜香料。饱满浓郁，酒精度高，口感甜美。巴罗莎的设拉子有时被称为"果酱炸弹"。</p></div>
</section>
<h3>🗺️ 三、全球气候风格速查表</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<table>
<tr><th>风格</th><th>典型产区</th><th>典型品种</th><th>酒精度</th><th>酸度</th><th>风味特征</th></tr>
<tr><td>❄️ 寒凉</td><td>德国摩泽尔、法国香槟、新西兰马尔堡、奥地利瓦豪</td><td>雷司令、黑皮诺、长相思、绿维特利纳</td><td>11-12.5%</td><td>🔺高</td><td>青苹果、青柠、白花、燧石、草本</td></tr>
<tr><td>🟡 温和</td><td>波尔多、勃艮第、皮埃蒙特、里奥哈、托斯卡纳</td><td>赤霞珠、黑皮诺、内比奥罗、桑娇维塞</td><td>12.5-14%</td><td>适中</td><td>红果、黑果、香料、泥土、皮革</td></tr>
<tr><td>☀️ 温暖</td><td>加州纳帕、南澳巴罗莎、西班牙普里奥拉托、西西里</td><td>赤霞珠、西拉、歌海娜、仙粉黛</td><td>14-16%</td><td>🔻低</td><td>黑莓果酱、黑巧克力、甜香料、果干</td></tr>
</table>
</section>
<h3>💡 四、消费者实用指南</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>如何通过气候风格选酒</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>喜欢清爽高酸的风格？</strong>→ 找寒凉产区：夏布利、桑塞尔、摩泽尔雷司令、香槟、新西兰马尔堡<br/>• <strong>喜欢饱满浓郁的风格？</strong>→ 找温暖产区：纳帕赤霞珠、巴罗莎设拉子、教皇新堡、普里奥拉托<br/>• <strong>想体验"真正"的黑皮诺？</strong>→ 勃艮第（寒凉）是标准答案<br/>• <strong>想买性价比高的霞多丽？</strong>→ 智利最便宜的霞多丽是温暖风格，法国南部奥克地区的霞多丽更偏凉爽<br/>• <strong>配中餐最重要的指标？</strong>→ 酸度比浓郁度更重要——寒凉风格的酒更适合中餐</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#B0C4DE;font-size:16px;line-height:1.9">气候是葡萄酒的第一风土。<strong style="color:#42A5F5">当你理解了一瓶酒来自寒凉还是温暖产区，你就已经读懂了一半的品鉴密码</strong>。下次选酒时，别只看品种——看看这瓶酒来自哪儿，它的气候在告诉你什么。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌡️ 生成寒凉vs温暖气候指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌡️ ${date.chinese} 寒凉 vs 温暖气候：同一葡萄品种的天壤之别`,author:'红酒顾问',digest:'夏布利vs加州霞多丽，勃艮第vs巴罗莎黑皮诺——气候对葡萄酒风格的影响有时大于品种本身。',content:generateContent(),coverImage:'climate_styles_cover_ai.png',category:'wine-knowledge',tags:['寒凉气候','温暖气候','葡萄酒气候','夏布利','纳帕谷','选酒指南','产区分辨'],publishDate:date.full};
    const op = path.join(__dirname,'output',`climate_styles_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
