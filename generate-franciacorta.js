/**
 * 弗朗齐亚柯达起泡酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#FFFDE7"/><stop offset="50%" style="stop-color:#FFF8E1"/><stop offset="100%" style="stop-color:#FFF3E0"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#FFD700"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(212,175,55,0.1)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.05)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#D4AF37" stroke-width="2" opacity="0.2"/><text x="700" y="375" font-family="serif" font-size="12" fill="#888" text-anchor="middle">Lombardy, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#D4AF37" filter="url(#g)">🥂</text><rect x="20" y="130" width="500" height="2" fill="#D4AF37"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="36" font-weight="bold" fill="#B8860B">弗朗齐亚柯达</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="#555">意大利伦巴第 · 传统法起泡酒 · 精致优雅</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="#888">"意大利最顶级的传统法起泡酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="#aaa">媲美香槟的品质 · 更亲民的价格</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','franciacorta_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}h3{color:#B8860B;border-bottom:2px solid #D4AF37;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B8860B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B8860B;">🥂 ${date.chinese} 弗朗齐亚柯达完全指南：意大利的香槟</h2>
<p style="text-align:center;color:#666;">伦巴第 · 传统法 · 精致起泡 · 意大利骄傲</p>
<section style="background:linear-gradient(135deg,#FFFDE7,#FFF8E1);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#333;font-size:16px;line-height:1.9">弗朗齐亚柯达（Franciacorta）是<strong style="color:#D4AF37">意大利最顶级的传统法起泡酒</strong>，产自伦巴第大区。与香槟一样，它采用瓶内二次发酵法（Méthode Traditionnelle）酿造，但在意大利独特的风土条件下展现出别样的魅力。许多人将其誉为<strong style="color:#D4AF37">"意大利的香槟"</strong>，但弗朗齐亚柯达本身就是一个卓越的传奇。本文将带你全面探索这款意大利顶级起泡酒。</p>
</section>
<h3>🥂 一、弗朗齐亚柯达 vs 香槟 vs 普罗塞克</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<table><tr><th>对比项</th><th>弗朗齐亚柯达</th><th>香槟</th><th>普罗塞克</th></tr><tr><td>酿造法</td><td>传统法（瓶内二次发酵）</td><td>传统法</td><td>罐式法（Charmat）</td></tr><tr><td>陈酿要求</td><td>至少18个月（珍藏60个月）</td><td>至少15个月</td><td>无强制要求</td></tr><tr><td>主要葡萄</td><td>霞多丽、黑皮诺、白皮诺</td><td>霞多丽、黑皮诺、莫尼耶</td><td>格蕾拉</td></tr><tr><td>气泡</td><td>细腻持久</td><td>细腻持久</td><td>活泼，消散较快</td></tr><tr><td>风味</td><td>面包、杏仁、柑橘、矿物</td><td>饼干、酵母、青苹果</td><td>青苹果、梨、白花</td></tr><tr><td>价格区间</td><td>200-500元+</td><td>300-2000元+</td><td>80-200元</td></tr></table>
</section>
<h3>🍇 二、葡萄品种与风土</h3>
<section style="background:#FFF0F0;padding:18px;border-radius:8px">
<div class="region-item"><h4>法定葡萄品种</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>霞多丽（Chardonnay）：</strong>主角品种，提供优雅和结构感，通常占混酿的70%以上<br/>• <strong>黑皮诺（Pinot Nero）：</strong>增加饱满度和陈年潜力<br/>• <strong>白皮诺（Pinot Bianco）：</strong>增添清新果香和柔和口感</p></div>
<div class="region-item"><h4>风土特点</h4><p style="color:#333;line-height:1.8;margin:0">弗朗齐亚柯达产区位于伊塞奥湖（Lago d'Iseo）南岸的冰碛丘陵地带。土壤由冰河时代形成的石灰岩、砂岩和黏土构成，排水性极佳，富含矿物元素。湖区气候温和，为葡萄提供了理想的成熟条件。</p></div>
</section>
<h3>🏛️ 三、分级体系</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Franciacorta DOCG（非年份）</h4><p style="color:#333;line-height:1.8;margin:0">弗朗齐亚柯达的标杆产品，瓶陈至少18个月。产量最大，品质稳定。分为Brut（天然极干）、Extra Brut（特干）、Brut Nature（自然干）等不同甜度。</p></div>
<div class="region-item"><h4>Franciacorta Saten</h4><p style="color:#333;line-height:1.8;margin:0">弗朗齐亚柯达的特色风格——100%白葡萄酿造（霞多丽和/或白皮诺），瓶内气压更低，气泡更加柔滑细腻，口感如丝绸般顺滑。必须为Brut甜度。</p></div>
<div class="region-item"><h4>Franciacorta Rosé</h4><p style="color:#333;line-height:1.8;margin:0">桃红风格，要求至少35%黑皮诺。带有红浆果和玫瑰花瓣的香气，结构更丰富。</p></div>
<div class="region-item"><h4>Franciacorta Riserva</h4><p style="color:#333;line-height:1.8;margin:0">珍藏级，瓶陈至少60个月（5年）。只有最好的年份才能酿造，产量极少，是弗朗齐亚柯达的巅峰之作。</p></div>
</section>
<h3>🍷 四、酿造工艺</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">弗朗齐亚柯达与香槟采用相同的瓶内二次发酵工艺：</p>
<div class="region-item"><h4>工艺步骤</h4><p style="color:#333;line-height:1.8;margin:0">1. <strong>基酒酿造：</strong>葡萄轻柔压榨，不锈钢桶发酵成干型基酒<br/>2. <strong>装瓶加糖：</strong>装瓶时加入糖和酵母（Tirage）<br/>3. <strong>瓶内二次发酵：</strong>瓶内发酵产生气泡，持续2-3个月<br/>4. <strong>酒泥陈酿：</strong>与酒泥共同陈酿数月乃至数年，发展面包和饼干香气<br/>5. <strong>转瓶除渣：</strong>通过转瓶（Remuage）将沉淀集中到瓶口，冷冻后去除<br/>6. <strong>加糖装瓶：</strong>添加调味液（Dosage）调整甜度，最终封瓶</p></div>
</section>
<h3>👃 五、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>视觉</h4><p style="color:#333;line-height:1.8;margin:0">浅稻草黄色到浅金色，气泡细腻持久，形成漂亮的珍珠链。</p></div>
<div class="region-item"><h4>嗅觉</h4><p style="color:#333;line-height:1.8;margin:0">精致的白面包、杏仁、烤榛子的香气，混合着柑橘、白花和矿物的清新气息。陈年酒款发展出蜂蜜、饼干和坚果的复杂芳香。</p></div>
<div class="region-item"><h4>味觉</h4><p style="color:#333;line-height:1.8;margin:0">入口活跃细腻的气泡带来愉悦的口感。酸度清爽明亮，结构优雅。余味悠长，带有矿物感和杏仁的微苦，让人回味无穷。</p></div>
</section>
<h3>🍽️ 六、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>开胃菜：</strong>生蚝、鱼子酱、龙虾——弗朗齐亚柯达是这些珍馐的最佳搭档<br/>• <strong>前餐：</strong>意大利火腿、炸海鲜、蔬菜天妇罗<br/>• <strong>主菜：</strong>清蒸鱼、白肉、烤鸡——Saten风格尤为适合<br/>• <strong>奶酪：</strong>帕尔马干酪、芳提娜<br/>• <strong>节日庆典：</strong>弗朗齐亚柯达是意大利人庆祝的首选起泡酒</p>
</section>
<section style="background:linear-gradient(135deg,#FFFDE7,#FFF8E1);padding:22px;border-radius:10px;text-align:center">
<p style="color:#333;font-size:16px;line-height:1.9">弗朗齐亚柯达证明了意大利不仅能酿造日常美酒，更能打造<strong style="color:#D4AF37">媲美香槟的顶级起泡酒</strong>。它代表了意大利起泡酒的尊严与骄傲。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成弗朗齐亚柯达完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🥂 ${date.chinese} 弗朗齐亚柯达完全指南：意大利的香槟`,author:'红酒顾问',digest:'弗朗齐亚柯达是意大利最顶级的传统法起泡酒，采用与香槟相同的瓶内二次发酵法酿造。本文详解酿造工艺、分级体系、与香槟普罗塞克对比。',content:generateContent(),coverImage:'franciacorta_cover_ai.png',category:'wine-knowledge',tags:['弗朗齐亚柯达','意大利起泡酒','伦巴第','传统法','Franciacorta'],publishDate:date.full};
    const op = path.join(__dirname,'output',`franciacorta_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
    const w = config.publish; const t = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${w.appId}&secret=${w.appSecret}`);
    const a = t.data.access_token; console.log('📤 发布到微信公众号草稿箱...');
    const f = new FormData(); f.append('media',cb,{filename:'cover.png',contentType:'image/png'});
    const m = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${a}&type=image`,f,{headers:f.getHeaders()});
    console.log('   ✅ 封面已上传');
    const d = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${a}`,{articles:[{title:article.title,thumb_media_id:m.data.media_id,author:article.author,digest:article.digest,content:article.content,show_cover_pic:1,need_open_comment:0,only_fans_can_comment:0}]});
    console.log('   ✅ 草稿创建成功, media_id:',d.data.media_id);
    console.log('============================================================\n✅ 发布成功！\n============================================================');
  } catch(e){console.error('❌ 错误:',e.message); process.exit(1);}
}
main();