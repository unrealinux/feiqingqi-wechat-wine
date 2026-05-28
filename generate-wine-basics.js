/**
 * 葡萄酒入门终极指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a1a"/><stop offset="50%" style="stop-color:#3a1a3a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#6A1B9A"/><stop offset="100%" style="stop-color:#AB47BC"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(171,71,188,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#AB47BC" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Wine 101 · 入门到精通</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#AB47BC" filter="url(#g)">🎓</text><rect x="20" y="130" width="500" height="2" fill="#AB47BC"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#AB47BC">葡萄酒入门终极指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">从零到会喝，看完不再露怯</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"一篇让你在品酒会上像行家"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">品种 · 产区 · 品鉴 · 选酒 · 配餐 一篇搞定</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#AB47BC" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_basics_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#6A1B9A;margin:0 0 8px 0;font-size:16px}h3{color:#6A1B9A;border-bottom:2px solid #AB47BC;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#6A1B9A;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#6A1B9A;">🎓 ${date.chinese} 葡萄酒入门终极指南</h2>
<p style="text-align:center;color:#666;">品种 · 产区 · 品鉴 · 选酒 · 配餐——一篇让你从入门到精通</p>
<section style="background:linear-gradient(135deg,#1a0a1a,#3a1a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E1BEE7;font-size:16px;line-height:1.9">走进葡萄酒的世界，就像打开一扇通往新世界的大门。<strong style="color:#AB47BC">赤霞珠和黑皮诺有什么区别？"单宁"到底是什么味道？</strong>去餐厅怎么点酒不被坑？别担心——这不是一场考试，而是一场味觉的探索之旅。<strong style="color:#AB47BC">读完这篇，你就能自信地和朋友聊酒了。</strong></p>
</section>
<h3>🍇 一、认识六大主流品种</h3>
<section style="background:#F3E5F5;padding:18px;border-radius:8px">
<table>
<tr><th>品种</th><th>颜色</th><th>口感标签</th><th>入门推荐产区</th><th>一句话记忆法</th></tr>
<tr><td>赤霞珠 Cabernet Sauvignon</td><td>🔴 红</td><td>浓郁 · 单宁强劲 · 黑加仑</td><td>智利、波尔多</td><td>"红酒之王，稳重有力"</td></tr>
<tr><td>梅洛 Merlot</td><td>🔴 红</td><td>柔和 · 圆润 · 红果</td><td>法国右岸、智利</td><td>"赤霞珠的温柔女友"</td></tr>
<tr><td>黑皮诺 Pinot Noir</td><td>🔴 红</td><td>优雅 · 丝滑 · 红果花香</td><td>新西兰、勃艮第</td><td>"红酒中的林黛玉，娇贵细腻"</td></tr>
<tr><td>西拉/设拉子 Syrah/Shiraz</td><td>🔴 红</td><td>辛香 · 饱满 · 黑果</td><td>澳洲、法国北隆河</td><td>"香料炸弹，热情奔放"</td></tr>
<tr><td>霞多丽 Chardonnay</td><td>🟡 白</td><td>饱满 · 可过桶 · 黄油感</td><td>智利、法国勃艮第</td><td>"百变女王，可清纯可性感"</td></tr>
<tr><td>长相思 Sauvignon Blanc</td><td>🟡 白</td><td>清爽 · 草本 · 百香果</td><td>新西兰、法国卢瓦尔</td><td>"清新小辣椒，酸爽提神"</td></tr>
</table>
</section>
<h3>🌍 二、新旧世界一分钟分清</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>旧世界（欧洲）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>代表产区：</strong>法国、意大利、西班牙、德国、葡萄牙<br/><strong>风格标签：</strong>优雅、内敛、矿物感、高酸度<br/><strong>酒标特点：</strong>以产地命名（如"波尔多"），需要了解产区才能知道品种<br/><strong>入门推荐：</strong>西班牙里奥哈（Crianza）、意大利基安蒂、法国波尔多AOC大区</p></div>
<div class="region-item"><h4>新世界（非欧洲）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>代表产区：</strong>智利、澳大利亚、新西兰、美国加州、阿根廷、南非<br/><strong>风格标签：</strong>浓郁、果味奔放、高酒精度、直接爽快<br/><strong>酒标特点：</strong>以品种命名（如"赤霞珠"），一看就懂<br/><strong>入门推荐：</strong>智利赤霞珠、澳洲西拉、新西兰长相思</p></div>
</section>
<h3>👅 三、品酒四步法</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>👁️ 1. 看（颜色透露年龄和品种）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>红葡萄酒：</strong>紫红色→年轻；宝石红色→适饮；砖红色/棕色边缘→陈年<br/><strong>白葡萄酒：</strong>淡黄绿→年轻年轻；金黄色→陈年或橡木桶；琥珀色→氧化风格或老酒</p></div>
<div class="region-item"><h4>👃 2. 闻（摇杯前 → 摇杯后）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>第一闻（静止）：</strong>有没有不愉快的味道？（湿纸板=软木塞污染，醋味=氧化）<br/><strong>第二闻（摇杯后）：</strong>果香？花香？草本？香料？橡木？越闻越开放是好酒的标志。</p></div>
<div class="region-item"><h4>👄 3. 品（用整张嘴感受）</h4><p style="color:#333;line-height:1.8;margin:0">吸一小口，让酒液覆盖整个口腔。关注四个维度：<br/><strong>甜度：</strong>舌头前端能感受到——干型 vs 半干 vs 甜型<br/><strong>酸度：</strong>舌侧流口水吗？酸度越高，口水越多<br/><strong>单宁：</strong>口腔有收敛感/干涩感吗？（只有红葡萄酒有单宁）<br/><strong>酒体：</strong>是像水一样轻，还是像全脂牛奶一样饱满？</p></div>
<div class="region-item"><h4>📝 4. 想（给自己一个结论）</h4><p style="color:#333;line-height:1.8;margin:0">不需要华丽的词藻。问自己三个问题：<br/>• 我喜不喜欢？<br/>• 它像什么？（黑莓？柠檬？香草？）<br/>• 我想配什么食物？</p></div>
</section>
<h3>🍽️ 四、入门点餐配酒公式</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<div class="region-item"><h4>万能配酒公式</h4><p style="color:#333;line-height:1.8;margin:0"><strong>红配肉，白配鱼，起泡配一切</strong>（这是底线，不是铁律）<br/><br/><strong>更精准的版本：</strong><br/>• 烤牛排/红烧肉 → 赤霞珠或西拉（单宁配油脂）<br/>• 清蒸鱼/海鲜 → 长相思或灰皮诺（酸度配鲜味）<br/>• 鸡肉/猪肉 → 黑皮诺或霞多丽（百搭）<br/>• 麻辣火锅 → 半干雷司令或蓝布鲁斯科（甜配辣）<br/>• 奶酪拼盘 → 陈年红酒或波特酒</p></div>
</section>
<h3>🛒 五、新手选酒避坑</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>新手100元以内怎么选？</h4><p style="color:#333;line-height:1.8;margin:0"><strong>最佳选择：智利</strong>——赤霞珠、梅洛、佳美娜。同价位下智利酒的品质碾压其他产区。<br/><strong>第二选择：西班牙</strong>——里奥哈Crianza、La Mancha产区。性价比极高。<br/><strong>第三选择：意大利的普洛赛克和蓝布鲁斯科</strong>——起泡酒的入门王者。<br/><strong>不建议新手买的：</strong>法国波尔多AOC大区（百元内品质一般）、勃艮第入门级（太贵）、顶级产区入门款（价格高不划算）</p></div>
<div class="region-item"><h4>品酒会/餐厅点酒不露怯</h4><p style="color:#333;line-height:1.8;margin:0">• 先看酒单的酒款数量——越多说明餐厅重视酒<br/>• 问服务员"有没有杯卖酒"——按杯点酒试错成本最低<br/>• 不想出错的点法：<strong>新西兰长相思（白）或智利赤霞珠（红）</strong><br/>• 侍酒师倒酒给你"试饮"时，轻轻闻一下，小口喝，点头说"好"就行<br/>• 不需要像电影里那样转酒看挂杯——挂杯只和酒精度有关，和品质没有关系</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a1a,#3a1a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E1BEE7;font-size:16px;line-height:1.9">葡萄酒的世界广阔而迷人，但入门没有你想象中那么难。<strong style="color:#AB47BC">记住三个核心：品种决定风格、产区提示气候、你的舌头才是最终裁判</strong>。不要被行话吓到，从一瓶百元智利赤霞珠开始，享受你的探索之旅吧。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🎓 生成葡萄酒入门终极指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🎓 ${date.chinese} 葡萄酒入门终极指南：从零到会喝，一篇就够了`,author:'红酒顾问',digest:'品种、产区、品鉴、选酒、配餐——葡萄酒入门看这一篇就够了。不装腔作势，只说人话。',content:generateContent(),coverImage:'wine_basics_cover_ai.png',category:'wine-knowledge',tags:['葡萄酒入门','新手学酒','品酒教程','选酒指南','红酒知识','Wine 101'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_basics_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
