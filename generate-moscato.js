/**
 * 莫斯卡托阿斯蒂葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');
const { exec } = require('child_process'); const util = require('util'); const execPromise = util.promisify(exec);

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

async function generateCover() {
  console.log('🎨 生成莫斯卡托封面...');
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#FFF8DC"/><stop offset="50%" style="stop-color:#FAFAD2"/><stop offset="100%" style="stop-color:#FFEFD5"/></linearGradient>
      <linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#FFD700"/><stop offset="100%" style="stop-color:#FFA500"/></linearGradient>
      <filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="900" height="383" fill="url(#bg)"/>
    <circle cx="650" cy="100" r="180" fill="rgba(255,215,0,0.15)"/>
    <circle cx="680" cy="120" r="150" fill="rgba(255,165,0,0.1)"/>
    <ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.08)"/>
    <rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DAA520" stroke-width="2" opacity="0.3"/>
    <text x="700" y="375" font-family="serif" font-size="12" fill="#888" text-anchor="middle">Piedmont, Italy</text>
    <text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DAA520" filter="url(#g)">🥂</text>
    <rect x="20" y="130" width="500" height="2" fill="#DAA520"/>
    <text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#8B7500">莫斯卡托阿斯蒂</text>
    <text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="#666">意大利皮埃蒙特 · 麝香葡萄 · 甜蜜起泡</text>
    <text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="#999">"意大利最甜美的微起泡酒"</text>
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="#aaa">低酒精度 · 清新果香 · 甜蜜愉悦</text>
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text>
  </svg>`;
  const b = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(path.join(__dirname,'output','moscato_cover_ai.png'), b);
  console.log('📁 封面已保存');
  return b;
}

function generateContent() { return `
<style>
  .region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}
  .region-item h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}
  h3{color:#B8860B;border-bottom:2px solid #DAA520;padding-bottom:8px;margin-top:25px}
  table{width:100%;border-collapse:collapse;margin:10px 0}
  table th{background:#B8860B;color:#fff;padding:10px;text-align:left}
  table td{padding:10px;border-bottom:1px solid #ddd}
</style>

<h2 style="text-align:center;color:#B8860B;">🥂 ${date.chinese} 莫斯卡托阿斯蒂完全指南：意大利的甜蜜天使</h2>
<p style="text-align:center;color:#666;">皮埃蒙特 · 白麝香 · 微起泡 · 甜蜜诱惑</p>

<section style="background:linear-gradient(135deg,#FFF8DC,#FAFAD2);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#666;font-size:16px;line-height:1.9">莫斯卡托阿斯蒂（Moscato d'Asti）是<strong style="color:#DAA520">来自意大利皮埃蒙特</strong>最令人愉悦的甜型微起泡酒。它以清新的果香、柔和的甜度和低酒精度（仅5-6.5%）成为全世界最受欢迎的餐后甜酒之一。无论是节日庆典、姐妹聚会还是慵懒的午后，一杯冰镇的莫斯卡托都能带来满满幸福感。本文将带你深入了解<strong style="color:#DAA520">这款"意大利甜蜜天使"</strong>的方方面面。</p>
</section>

<h3>🍇 一、白麝香葡萄（Moscato Bianco）</h3>
<section style="background:#FFFACD;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">莫斯卡托阿斯蒂使用<strong>白麝香（Moscato Bianco）</strong>葡萄酿造，这是世界上最古老的葡萄品种之一：</p>
<div class="region-item">
<h4>品种特性</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>香气浓郁：</strong>具有标志性的麝香香气，带有橙花、水蜜桃和蜂蜜的芬芳<br/>
• <strong>低酸高糖：</strong>天然含糖量高，酸度适中，口感甜美柔和<br/>
• <strong>敏感脆弱：</strong>果皮薄，容易受病虫害侵袭，需要精心照料<br/>
• <strong>历史悠久：</strong>早在古罗马时期就被广泛种植，被誉为"葡萄酒之神赋予的礼物"
</p>
</div>
</section>

<h3>🥂 二、莫斯卡托 vs 其他起泡酒</h3>
<section style="background:#f0f0ff;padding:18px;border-radius:8px">
<table>
<tr><th>特征</th><th>莫斯卡托阿斯蒂</th><th>普罗塞克</th><th>香槟</th></tr>
<tr><td>酿造法</td><td>罐式法（中断发酵）</td><td>罐式法</td><td>传统法（瓶内二次发酵）</td></tr>
<tr><td>气泡强度</td><td>微起泡（Frizzante）</td><td>充分起泡（Spumante）</td><td>充分起泡</td></tr>
<tr><td>甜度</td><td>甜型</td><td>Brut/Extra Dry</td><td>Brut/Extra Brut</td></tr>
<tr><td>酒精度</td><td>5-6.5%</td><td>10.5-11.5%</td><td>12-12.5%</td></tr>
<tr><td>主要香气</td><td>水蜜桃、橙花、蜂蜜</td><td>青苹果、梨、白花</td><td>面包、酵母、青苹果</td></tr>
<tr><td>适饮温度</td><td>6-8°C</td><td>6-8°C</td><td>8-10°C</td></tr>
<tr><td>价格区间</td><td>80-200元</td><td>80-300元</td><td>300-2000元+</td></tr>
</table>
</section>

<h3>🏛️ 三、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item">
<h4>Asti DOCG - 阿斯蒂保证法定产区</h4>
<p style="color:#333;line-height:1.8;margin:0">莫斯卡托阿斯蒂的故乡，位于皮埃蒙特东南部的丘陵地带。葡萄园分布在Canelli、Nizza Monferrato和Asti市的周围，土壤以石灰岩和沙质黏土为主，富含矿物元素。</p>
</div>
<div class="region-item">
<h4>Moscato d'Asti DOCG</h4>
<p style="color:#333;line-height:1.8;margin:0">与Asti Spumante不同，莫斯卡托阿斯蒂是微起泡（Frizzante）版本，要求更低的瓶内压力和更低酒精度，保留更多的天然甜味和果香。</p>
</div>
<div class="region-item">
<h4>风土特点</h4>
<p style="color:#333;line-height:1.8;margin:0">皮埃蒙特地区的大陆性气候，冬季寒冷、夏季炎热，昼夜温差大，有利于葡萄积聚糖分和香气。丘陵地带的南向和西南向坡地能获得最佳日照。</p>
</div>
</section>

<h3>🍷 四、独特的酿造工艺</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">莫斯卡托阿斯蒂的酿造工艺与众不同：</p>
<div class="region-item">
<h4>中断发酵法</h4>
<p style="color:#333;line-height:1.8;margin:0">
1. <strong>轻柔压榨：</strong>白麝香葡萄被轻柔压榨，获取纯净的果汁<br/>
2. <strong>低温发酵：</strong>在不锈钢罐中低温发酵，保留香气<br/>
3. <strong>中断发酵：</strong>当酒精度达到5-6.5%时，通过降温至0°C终止发酵<br/>
4. <strong>微过滤：</strong>去除酵母，稳定葡萄酒<br/>
5. <strong>微起泡注入：</strong>在装瓶时注入少量二氧化碳，形成轻柔的微起泡效果
</p>
</div>
<div class="region-item">
<h4>与Asti Spumante的区别</h4>
<p style="color:#333;line-height:1.8;margin:0">
<strong>莫斯卡托阿斯蒂：</strong>微起泡（Frizzante），瓶内压力较低（<2.5 atm），酒精度低，更甜<br/>
<strong>阿斯蒂起泡酒：</strong>充分起泡（Spumante），瓶内压力更高（>3 atm），酒精度略高，甜度略低
</p>
</div>
</section>

<h3>🍑 五、品鉴要点</h3>
<section style="background:#FFF5EE;padding:18px;border-radius:8px">
<div class="region-item">
<h4>视觉</h4>
<p style="color:#333;line-height:1.8;margin:0">浅稻草黄色到金黄色，酒液清澈透亮。倒入杯中后，细小的气泡缓缓升起，形成一层轻盈的泡沫。</p>
</div>
<div class="region-item">
<h4>嗅觉</h4>
<p style="color:#333;line-height:1.8;margin:0">标志性的麝香香气扑面而来，伴随着成熟的水蜜桃、杏子、橙花、蜂蜜和柠檬皮的精緻芳香。清新而富有表现力。</p>
</div>
<div class="region-item">
<h4>味觉</h4>
<p style="color:#333;line-height:1.8;margin:0">入口甜美柔和，酸度恰到好处地平衡了甜味，带来清爽的口感。细腻的微气泡在舌尖轻轻跳跃，余味中带有柑橘和花香的愉悦感。</p>
</div>
<div class="region-item">
<h4>总体评价</h4>
<p style="color:#333;line-height:1.8;margin:0">莫斯卡托阿斯蒂是一款<strong>令人愉悦、毫无负担</strong>的葡萄酒。它的甜美不会让人感到腻味，低酒精度使其成为任何时候都可以享用的饮品。</p>
</div>
</section>

<h3>🍽️ 六、配餐指南</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.9;font-size:16px">莫斯卡托阿斯蒂的甜度和果香使其成为以下美食的<strong>绝佳搭档</strong>：</p>
<table>
<tr><th>搭配类别</th><th>推荐菜品</th><th>搭配原因</th></tr>
<tr><td><strong>甜点</strong></td><td>水果塔、提拉米苏、意式奶冻（Panna Cotta）</td><td>甜味相得益彰，果香相互呼应</td></tr>
<tr><td><strong>水果</strong></td><td>草莓、蜜桃、芒果、柠檬挞</td><td>相同的果味让搭配更加和谐</td></tr>
<tr><td><strong>奶酪</strong></td><td>戈贡佐拉蓝纹、马斯卡彭</td><td>甜味中和咸香，形成美妙反差</td></tr>
<tr><td><strong>中式甜点</strong></td><td>芒果布丁、蛋挞、椰汁西米露</td><td>清爽口感搭配中式甜点相得益彰</td></tr>
<tr><td><strong>节日</strong></td><td>生日蛋糕、结婚喜糖、派对甜点</td><td>低酒度，适合各种喜庆场合</td></tr>
</table>
</section>

<h3>💡 七、饮用建议与选购指南</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<div class="region-item">
<h4>最佳饮用方式</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>温度：</strong>6-8°C 冰镇后饮用（冰箱冷藏2小时后即可）<br/>
• <strong>杯型：</strong>白葡萄酒杯或郁金香杯，便于聚集香气<br/>
• <strong>开瓶后：</strong>最好一次喝完，如需保存请用瓶塞密封冷藏，可保存2-3天<br/>
• <strong>适用场景：</strong>生日派对、闺蜜聚会、情人节、夏日野餐、餐后甜品
</p>
</div>
<div class="region-item">
<h4>知名品牌推荐</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>La Spinetta Bricco Quaglia：</strong>顶级莫斯卡托，品质标杆<br/>
• <strong>Ceretto Moscato d'Asti：</strong>经典之选，果香出色<br/>
• <strong>Michele Chiarlo Nivole：</strong>清新优雅，性价比高<br/>
• <strong>Bersano：</strong>入门优选，价格亲民
</p>
</div>
</section>

<section style="background:linear-gradient(135deg,#FFF8DC,#FAFAD2);padding:22px;border-radius:10px;text-align:center">
<p style="color:#666;font-size:16px;line-height:1.9">在意大利，人们喜欢在午后或餐后享用一杯冰凉的莫斯卡托阿斯蒂。这不仅是一种饮品，更是<strong style="color:#DAA520">一种生活态度</strong>——懂得放慢脚步，享受甜蜜时光。无论你是不常喝酒的初学者还是资深爱好者，莫斯卡托阿斯蒂都能为你带来最简单直接的快乐。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成莫斯卡托阿斯蒂完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await generateCover();
    const article = {title:`🥂 ${date.chinese} 莫斯卡托阿斯蒂完全指南：意大利的甜蜜天使`,author:'红酒顾问',digest:'莫斯卡托阿斯蒂是意大利皮埃蒙特最令人愉悦的甜型微起泡酒。本文详解白麝香葡萄品种、独特酿造工艺、核心产区风土及全方位配餐指南。',content:generateContent(),coverImage:'moscato_cover_ai.png',category:'wine-knowledge',tags:['莫斯卡托','意大利葡萄酒','皮埃蒙特','起泡酒','甜酒','阿斯蒂'],publishDate:date.full};
    const op = path.join(__dirname,'output',`moscato_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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