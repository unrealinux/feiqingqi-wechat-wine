/**
 * 橡木桶的秘密
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0f05"/><stop offset="50%" style="stop-color:#3a2510"/><stop offset="100%" style="stop-color:#2a1a08"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#D2691E"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(210,105,30,0.07)"/><ellipse cx="700" cy="280" rx="60" ry="90" fill="url(#og)" stroke="#D2691E" stroke-width="2" opacity="0.5"/><rect x="645" y="195" width="110" height="170" rx="3" fill="none" stroke="#D2691E" stroke-width="1" opacity="0.3"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">法桶vs美桶 · 新旧桶 · 过桶不过桶</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#D2691E" filter="url(#g)">🪵</text><rect x="20" y="130" width="500" height="2" fill="#D2691E"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#D2691E">橡木桶的秘密</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">那些酒瓶上没写但你必须知道的事</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"为什么有的红酒喝起来有香草味？秘密就在桶里"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">法桶/美桶 · 新旧桶 · 烘烤程度 · 桶中陈年 · 替代方案</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D2691E" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','oak_barrels_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B4513;margin:0 0 8px 0;font-size:16px}h3{color:#8B4513;border-bottom:2px solid #D2691E;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B4513;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B4513;">🪵 ${date.chinese} 橡木桶的秘密：法桶vs美桶、新旧桶、过桶不过桶</h2>
<p style="text-align:center;color:#666;">为什么有的红酒有香草味？有的有椰子味？有的有烟熏味？秘密都在橡木桶里。</p>
<section style="background:linear-gradient(135deg,#1a0f05,#3a2510);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFD5A8;font-size:16px;line-height:1.9">你有没有想过——<strong style="color:#D2691E">同样是红葡萄酒，为什么有的喝起来有香草和椰子的味道，有的却是烟熏和香料？</strong>答案不在葡萄本身，而在酿酒师使用的那只<strong style="color:#D2691E">橡木桶</strong>。今天我们就来聊聊这个葡萄酒世界中最重要、也最容易被忽视的配角。</p>
</section>
<h3>🌳 一、橡木桶的起源：不是装饰品</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">橡木桶的使用最早可以追溯到古罗马时期。最初不是为了风味——而是为了<strong>运输</strong>和<strong>储存</strong>。橡木的纹理致密、防水性好、易于弯曲成型，是制作葡萄酒容器的理想材料。<br/><br/>但酿酒师们很快发现：<strong style="color:#8B4513;">经过橡木桶陈年的酒，比在陶罐或水泥池中的酒更好喝。</strong>于是，橡木桶从实用的储存工具，变成了创造风味的重要手段。</p>
</section>
<h3>🇫🇷🇺🇸 二、法桶vs美桶：风味的核心对决</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<table>
<tr><th>维度</th><th>法国橡木桶 (French Oak)</th><th>美国橡木桶 (American Oak)</th></tr>
<tr><td>木材来源</td><td>法国中部（阿利埃河、特朗歇、纳韦尔）</td><td>美国（密苏里州、俄勒冈州）</td></tr>
<tr><td>木纹密度</td><td>细密（年轮窄）</td><td>疏松（年轮宽）</td></tr>
<tr><td>单宁含量</td><td>高（更涩）</td><td>低（更柔）</td></tr>
<tr><td>主要风味</td><td>香草、丁香、烤面包、雪松、烟熏</td><td>椰子、莳萝、焦糖、甜香料</td></tr>
<tr><td>风味强度</td><td>优雅、内敛（需要更长时间）</td><td>奔放、直接（见效快）</td></tr>
<tr><td>价格</td><td>贵（每桶€600-1200）</td><td>便宜（每桶€300-600）</td></tr>
<tr><td>典型使用区</td><td>波尔多、勃艮第、香槟、意大利巴罗洛</td><td>纳帕谷、澳洲西拉、西班牙</td></tr>
<tr><td>重复使用</td><td>最多3次</td><td>最多2次</td></tr>
</table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>小结：</strong>法桶像一位优雅的法国绅士——含蓄、复杂、需要耐心；美桶像一个热情的美国朋友——直接、热烈、容易亲近。没有好坏之分，只有风格之别。</p>
</section>
<h3>🆕🆚🟫 三、新桶vs旧桶：风味从何而来</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>新桶（第一次使用）</h4><p style="color:#333;line-height:1.8;margin:0">橡木中的风味物质（内酯、香兰素、单宁）最丰富。酒液在全新橡木桶中陈年，会吸收大量的橡木风味。<strong>新桶比例越高，酒的橡木味越重。</strong><br/><strong>典型例子：</strong>很多纳帕谷赤霞珠使用100%新法国橡木桶，喝起来香草味极其浓郁。<br/><strong>价格因素：</strong>一个新法国橡木桶成本约7000-9000元人民币，只能用一次（下次风味减半）。这就是为什么橡木味重的酒往往更贵。</p></div>
<div class="region-item"><h4>旧桶（第二、三次使用）</h4><p style="color:#333;line-height:1.8;margin:0">风味物质已经被前一批酒吸收殆尽。旧桶的作用<strong>不是添加风味，而是让酒慢慢地氧化和呼吸</strong>——让单宁变柔顺，让酒液更圆润。<br/><strong>典型例子：</strong>意大利基安蒂经典（Chianti Classico）常用旧桶陈年，以保有桑娇维塞的果味和酸度。<br/><strong>注意：</strong>超过三次使用的橡木桶基本"无味"，被称为"中性容器"，作用和水泥罐差不多。</p></div>
<div class="region-item"><h4>新旧桶的组合策略</h4><p style="color:#333;line-height:1.8;margin:0">顶级酒庄通常采用<strong>新桶+旧桶混合</strong>的策略：一部分酒液在新桶中获取风味，一部分在旧桶中柔化单宁，最终调配。<br/><strong>为什么这么做？</strong>避免橡木味盖过果味。顶级酿酒师的追求永远是"果味为主，橡木为仆"。</p></div>
</section>
<h3>🔥 四、烘烤程度：决定风味的最后一环</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">橡木桶制作过程中，制桶师傅会用火烘烤桶板内侧。烘烤程度直接决定最终的风味：</p>
<table>
<tr><th>烘烤程度</th><th>温度范围</th><th>主要风味</th><th>常用酒款</th></tr>
<tr><td>轻度烘烤</td><td>120-160°C</td><td>椰子、奶油、新鲜橡木</td><td>霞多丽、长相思</td></tr>
<tr><td>中度烘烤</td><td>160-200°C</td><td>香草、焦糖、烤面包</td><td>赤霞珠、梅洛</td></tr>
<tr><td>重度烘烤</td><td>200-230°C</td><td>咖啡、巧克力、烟熏、烧烤</td><td>西拉、马尔贝克</td></tr>
</table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>有意思的细节：</strong>制桶师傅用一种叫做"烘烤"的传统工艺。桶板在火上弯成弧形的时候，表面会产生一个自然的炭化层。这个炭化层不仅能过滤掉橡木中过于粗犷的单宁，还赋予了葡萄酒复杂的烟熏和香料风味。</p>
</section>
<h3>⏳ 五、桶中陈年时间：长短各有利弊</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<table>
<tr><th>陈年时间</th><th>对酒的影响</th><th>典型范例</th></tr>
<tr><td>6-12个月（短期）</td><td>柔和单宁，微量的橡木风味，保留果味新鲜度</td><td>入门级波尔多、智利赤霞珠</td></tr>
<tr><td>12-24个月（中期）</td><td>橡木风味融合，单宁柔顺，复杂度提升</td><td>里奥哈Reserva、超级托斯卡纳</td></tr>
<tr><td>24个月以上（长期）</td><td>酒体和橡木完全融合，第三层风味（皮革、蘑菇）出现</td><td>巴罗洛、巴巴莱斯科、里奥哈Gran Reserva</td></tr>
</table>
</section>
<h3>🔁 六、橡木桶的替代方案</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">并不是所有酒都用得起昂贵的橡木桶。市场上存在一些"平替"方案：</p>
<div class="region-item"><h4>橡木片 / 橡木粉</h4><p style="color:#333;line-height:1.8;margin:0">将橡木削成薄片或磨成粉末，直接浸泡在酒中。价格便宜，见效快。常见于百元以内的平价酒。缺点是风味单一，缺乏桶陈带来的氧化作用。<strong>怎么看出来的？</strong>这类酒的"橡木味"浮在表面，和酒体没有融合，喝起来像加了香草精的水。</p></div>
<div class="region-item"><h4>不锈钢罐+微氧化</h4><p style="color:#333;line-height:1.8;margin:0">一些现代酒庄用不锈钢罐陈年，同时控制微量的氧气进入。既能柔化单宁，又不会添加橡木风味——适合追求"纯粹果味"风格的酒。</p></div>
<div class="region-item"><h4>水泥罐/陶罐</h4><p style="color:#333;line-height:1.8;margin:0">越来越多自然酒庄回归使用水泥蛋形容器或陶罐。这些材料允许微量氧气交换，但不添加任何木质风味。和橡木桶相比，得到的是一款"更干净"、"更真实"的酒。</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0f05,#3a2510);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD5A8;font-size:16px;line-height:1.9">下次喝到一款让你惊艳的葡萄酒时，别忘了——<strong style="color:#D2691E">那只默默贡献了几个月甚至几年的橡木桶，是真正的幕后英雄。</strong>法桶的优雅、美桶的热情、新桶的浓郁、旧桶的温柔……每一只橡木桶，都在酒里留下了不可复制的印记。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🪵 生成橡木桶的秘密\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🪵 ${date.chinese} 橡木桶的秘密：法桶vs美桶、新旧桶，一次说清楚`,author:'红酒顾问',digest:'为什么有的红酒有香草味？有的有椰子味？橡木桶到底在葡萄酒中扮演了什么角色？看完这篇不再困惑。',content:generateContent(),coverImage:'oak_barrels_cover_ai.png',category:'wine-knowledge',tags:['橡木桶','法桶美桶','葡萄酒酿造','橡木风味','新旧桶','桶陈'],publishDate:date.full};
    const op = path.join(__dirname,'output',`oak_barrels_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
