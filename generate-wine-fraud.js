/**
 * 葡萄酒史上惊天骗局
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a0a0a"/><stop offset="50%" style="stop-color:#2a1a1a"/><stop offset="100%" style="stop-color:#1a0a0a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#B71C1C"/><stop offset="100%" style="stop-color:#D32F2F"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="160" fill="rgba(211,47,47,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#D32F2F" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">The Greatest Wine Fraud in History</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#D32F2F" filter="url(#g)">🎭</text><rect x="20" y="130" width="500" height="2" fill="#D32F2F"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#D32F2F">葡萄酒史上惊天骗局</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">卢迪·库尔尼亚万的千万美元假酒帝国</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"一瓶假酒拍出300万美元的天价"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">华尔街精英 · 葡萄酒界 · 十亿美元骗局</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D32F2F" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_fraud_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B71C1C;margin:0 0 8px 0;font-size:16px}h3{color:#B71C1C;border-bottom:2px solid #D32F2F;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B71C1C;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B71C1C;">🎭 ${date.chinese} 葡萄酒史上惊天骗局</h2>
<p style="text-align:center;color:#666;">卢迪·库尔尼亚万 · 亿万假酒帝国 · 华尔街精英的噩梦 · Netflix纪录片的原型</p>
<section style="background:linear-gradient(135deg,#0a0a0a,#2a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">他出生于印尼一个普通家庭，30岁时却坐拥<strong style="color:#D32F2F">超过30亿美元的假酒帝国</strong>。他骗过了全球最富有的葡萄酒收藏家、骗过了拍卖行佳士得和苏富比、骗过了罗伯特·帕克的品鉴团队。他的假酒被拍卖到<strong style="color:#D32F2F">单瓶300万美元</strong>的天价。他是葡萄酒世界最臭名昭著的骗子——<strong style="color:#D32F2F">卢迪·库尔尼亚万（Rudy Kurniawan）</strong>。</p>
</section>
<h3>🎭 一、神秘富二代的崛起</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>身份疑云</h4><p style="color:#333;line-height:1.8;margin:0">2000年代初，卢迪突然出现在洛杉矶的葡萄酒圈。他自称是印尼某亿万华人家族的继承人，拥有庞大的老酒收藏。他出手阔绰——在拍卖会上以创纪录价格拍下整批稀世珍酿，在顶级餐厅一掷千金。他很快就赢得了美国葡萄酒收藏圈的信任。</p></div>
<div class="region-item"><h4>完美的伪装</h4><p style="color:#333;line-height:1.8;margin:0">卢迪对葡萄酒的知识令人叹服——他能在盲品中准确说出酒款、年份和产区，记忆力惊人。他的品酒笔记详尽到让专业人士都自愧不如。这些天赋让顶尖收藏家们对这位"神童"深信不疑。实际上，这些能力正是他造假的核心武器——他太了解收藏家们想要什么了。</p></div>
</section>
<h3>🔬 二、惊人的造假手段</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<div class="region-item"><h4>厨房里的"酒庄"</h4><p style="color:#333;line-height:1.8;margin:0">2008年FBI突袭卢迪位于洛杉矶的家时，发现了一个惊人的事实：<strong>这位"亿万富豪"的厨房就是一个完整的地下假酒工厂</strong>。没有豪华酒窖，只有一些廉价的勃艮第大区酒、一堆空酒瓶、标签打印机、铝箔、封帽和化学药剂。他的"酿造工艺"极其简单：把几十美元的勃艮第大区酒倒入罗曼尼·康帝的空瓶中，贴上自制的标签，售价就是几十万美元。</p></div>
<div class="region-item"><h4>假酒销售的障眼法</h4><p style="color:#333;line-height:1.8;margin:0">为了让假酒看起来更真实，卢迪发展了一套精密的验真体系：<br/>1. 他只卖"自己收藏的酒"——声称来自已故祖父的亚洲藏品，无法追溯来源<br/>2. 他制造了"完美的 provenance（传承记录）"——手写酒窖记录，包括购酒日期、品鉴笔记、酒标照片<br/>3. 他甚至会在拍卖前主动安排"第三方鉴定"，让买家放松警惕<br/>4. 他的酒在多个拍卖行间转卖，制造出"来源可追溯"的假象</p></div>
</section>
<h3>💰 三、那些被波及的冤大头</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<table>
<tr><th>受害者</th><th>身份</th><th>损失估算</th><th>细节</th></tr>
<tr><td>William Koch</td><td>亿万富翁、石油大亨</td><td>超过400万美元</td><td>买了4瓶卢迪的"罗曼尼·康帝"，其中一瓶他后来才知道是他自己之前已经喝掉的</td></tr>
<tr><td>Michel Rocafort</td><td>比利时收藏家</td><td>数百万美元</td><td>从卢迪手中购买了数百瓶"稀世珍酿"</td></tr>
<tr><td>佳士得/苏富比</td><td>顶级拍卖行</td><td>声誉受损</td><td>两家拍卖行都经手了卢迪的大量假酒</td></tr>
<tr><td>匿名富豪们</td><td>全球顶级收藏家</td><td>不计其数</td><td>许多受害者选择沉默以避免丢脸</td></tr>
</table>
</section>
<h3>🔍 四、如何暴露的？</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>破绽一：标签错误</h4><p style="color:#333;line-height:1.8;margin:0">2006年，亿万富翁William Koch在品鉴一瓶1947年的Château Lafleur时发现了问题。他找了一位研究酒标的历史学家进行鉴定，发现酒标上的字体和纸张都与原版不符。更关键的是——<strong>1947年Lafleur的酒精度标注方式与卢迪伪造的完全不同</strong>。</p></div>
<div class="region-item"><h4>破绽二：品酒师的直觉</h4><p style="color:#333;line-height:1.8;margin:0">2007年的一次盲品会上，几位顶级品酒师注意到卢迪提供的"1929年Romanée-Conti"口感与预期不符。虽然喝酒的人都是行业精英，但因为是卢迪提供的酒，大多数人选择了相信而非质疑。</p></div>
<div class="region-item"><h4>破绽三：警方的介入</h4><p style="color:#333;line-height:1.8;margin:0">2008年，FBI突袭了卢迪的家。他们发现了大量的制假工具、空白标签和未贴标的酒瓶。<strong>铁证如山</strong>。2013年，卢迪被判处10年联邦监禁。</p></div>
</section>
<h3>💡 五、给葡萄酒消费者的警示</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>如何避免买到假酒</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>购买渠道：</strong>只从酒庄官方代理或信誉良好的零售商购买<br/>• <strong>价格异常：</strong>某款酒价格显著低于市场均价时保持警惕<br/>• <strong>来源追溯：</strong>要求完整的保管记录（provenance）<br/>• <strong>酒标查验：</strong>检查酒标的印刷质量、字体、背标是否与正品一致<br/>• <strong>酒液水平面：</strong>陈年老酒的水平面应在标准范围内（过高或过低都是危险信号）<br/>• <strong>封口和瓶塞：</strong>检查封帽是否完好，瓶塞是否有二次压入的痕迹</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a0a0a,#2a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">卢迪的假酒案<strong style="color:#D32F2F">揭露了葡萄酒收藏界的阴暗面</strong>——虚荣、贪婪和盲从让最富有、最懂行的人成为了最容易被骗的猎物。即使你不收藏天价酒，这个故事也值得记住：<strong style="color:#D32F2F">葡萄酒的价值最终在于它的味道，而非它的标签</strong>。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🎭 生成葡萄酒史上惊天骗局文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🎭 ${date.chinese} 葡萄酒史上惊天骗局：一瓶假酒拍出300万美元`,author:'红酒顾问',digest:'Netflix纪录片原型！鲁迪·库尔尼亚万的30亿美元假酒帝国如何骗过全球最富有的收藏家？',content:generateContent(),coverImage:'wine_fraud_cover_ai.png',category:'wine-stories',tags:['假酒','葡萄酒骗局','鲁迪·库尔尼亚万','Rudy Kurniawan','葡萄酒收藏'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_fraud_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
