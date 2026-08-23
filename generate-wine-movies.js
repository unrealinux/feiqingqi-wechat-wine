/**
 * 葡萄酒与电影
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a1000"/><stop offset="50%" style="stop-color:#3a2505"/><stop offset="100%" style="stop-color:#1a1000"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#C8A415"/><stop offset="100%" style="stop-color:#F5D742"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(245,215,66,0.07)"/><rect x="600" y="120" width="140" height="200" rx="5" fill="none" stroke="#F5D742" stroke-width="1.5"/><circle cx="670" cy="165" r="18" fill="#F5D742" opacity="0.3"/><polygon points="670,152 670,178 690,165" fill="#F5D742" opacity="0.5"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">10部必看葡萄酒电影 · 片单+品酒笔记</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#F5D742" filter="url(#g)">🎬</text><rect x="20" y="130" width="500" height="2" fill="#F5D742"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#F5D742">葡萄酒与电影</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">杯酒人生、在云端、侍酒师……</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"看完这10部，你比90%的人更懂酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">电影推荐 · 片中名酒 · 观后感悟</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#F5D742" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_movies_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B8860B;margin:0 0 8px 0;font-size:16px}h3{color:#B8860B;border-bottom:2px solid #F5D742;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B8860B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B8860B;">🎬 ${date.chinese} 葡萄酒与电影：10部必看佳片，从入门到爱上葡萄酒</h2>
<p style="text-align:center;color:#666;">没有比看电影更好的学酒方式了——在故事中感受葡萄酒的魅力</p>
<section style="background:linear-gradient(135deg,#1a1000,#3a2505);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFF8E1;font-size:16px;line-height:1.9">想学葡萄酒又觉得工具书太枯燥？最好的方式其实是——<strong style="color:#F5D742">看电影</strong>。好的葡萄酒电影能让你在故事中理解什么叫"风土"、什么叫"年份"、为什么有人为一瓶酒倾家荡产。以下10部，从入门到发烧，总有一部让你爱上葡萄酒。</p>
</section>

<h3>🥇 Top 1：《杯酒人生》Sideways (2004)</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>豆瓣评分：</strong>8.0 | <strong>类型：</strong>剧情/喜剧<br/><br/><strong>一句话简介：</strong>两个中年男人在加州葡萄酒产区的公路之旅。一个失意的作家，一个即将结婚的花花公子。一趟旅行，改变了他们对酒和人生的看法。<br/><br/><strong>片中名酒：</strong>影片中主角Miles对黑皮诺（Pinot Noir）的长篇独白堪称经典——"黑皮诺非常娇贵，需要不断的照顾和关注……只有真正用心的人才能种好它。"这段独白实际上是在说他自己。片中他还偷偷用一次性纸杯喝自己珍藏的1961年份Cheval Blanc（白马庄）。<br/><br/><strong>这部电影的影响有多大？</strong>上映后美国黑皮诺销量暴增，梅洛销量暴跌——因为主角说了一句"我绝不喝该死的美乐"。<strong>一部电影改变了全世界的饮酒趋势。</strong><br/><br/><strong>观前准备：</strong>买一瓶加州或新西兰黑皮诺，边看边喝。</p>
</section>

<h3>🥈 Top 2：《在云端》Up in the Air (2009)</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>豆瓣评分：</strong>7.9 | <strong>类型：</strong>剧情<br/><br/><strong>一句话简介：</strong>乔治·克鲁尼饰演的职场裁员专家常年飞行于美国各地，酒店和机场是他真正的家。他的背包理论——"你背的越重，走得越慢"——和品酒的态度有异曲同工之妙。<br/><br/><strong>和葡萄酒的关系：</strong>电影中有一幕著名对话：在机场酒吧，主角和女主角聊到<strong>葡萄酒的年份</strong>，他说"我不看年份，我只相信我的味蕾。"这部电影的美学就是葡萄酒的美学——活在当下，享受此刻。<br/><br/><strong>适合场景：</strong>一个人出差或旅途中，配一杯酒店房间里的红酒。</p>
</section>

<h3>🥉 Top 3：《侍酒师》Somm (2012)</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>豆瓣评分：</strong>8.5 | <strong>类型：</strong>纪录片<br/><br/><strong>一句话简介：</strong>纪录片跟随四位年轻人备考"侍酒师大师"（Master Sommelier）头衔——全世界仅200多人拥有的终极殊荣。<br/><br/><strong>看点：</strong>看完你才知道什么叫"变态"——他们需要盲品出任何一款酒的品种、产区、年份和酒庄；需要记住全球所有主要产区的每一个村庄和特级园；需要通过口试、理论和实操三轮残酷考试。<strong>这部纪录片会让你对侍酒师这个职业肃然起敬。</strong><br/><br/><strong>特别推荐：</strong>这个系列还有两部续集《Somm: Into the Bottle》和《Somm 3》，分别讲述葡萄酒背后的故事和考试改革。</p>
</section>

<h3>🎬 其他七部必看</h3>
<section style="background:#ECEFF1;padding:18px;border-radius:8px">
<div class="region-item"><h4>4. 《醇美年华》A Good Year (2006)</h4><p style="color:#333;line-height:1.8;margin:0">雷德利·斯科特导演、罗素·克劳主演。伦敦金融精英继承了叔叔在普罗旺斯的酒庄，从对葡萄酒一窍不通到爱上酿酒生活。<strong>适合："逃离城市去种葡萄"的浪漫幻想。画面美到窒息。</strong></p></div>
<div class="region-item"><h4>5. 《红色情结》Red Obsession (2013)</h4><p style="color:#333;line-height:1.8;margin:0">纪录片讲述波尔多葡萄酒如何成为全球奢侈品，以及中国资本如何影响波尔多市场。有着非常震撼的全球葡萄酒市场数据。看完你会理解<strong>为什么拉菲在中国这么贵</strong>。</p></div>
<div class="region-item"><h4>6. 《酒业风云》Bottle Shock (2008)</h4><p style="color:#333;line-height:1.8;margin:0">改编自真实事件——1976年"巴黎评判"（Judgment of Paris），加州葡萄酒在盲品赛中击败法国顶级名庄，一举改变了世界葡萄酒格局。<strong>了解新世界葡萄酒崛起的历史，必看。</strong></p></div>
<div class="region-item"><h4>7. 《酸葡萄》Sour Grapes (2016)</h4><p style="color:#333;line-height:1.8;margin:0">纪录片讲述历史上最大的一起葡萄酒造假案——印度尼西亚富豪Rudy Kurniawan伪造勃艮第和波尔多顶级名庄，骗过了全球最顶尖的收藏家和拍卖行。一个关于<strong>贪婪、虚荣和品酒界如何被一个骗子愚弄</strong>的故事。</p></div>
<div class="region-item"><h4>8. 《开瓶器》Uncorked (2020)</h4><p style="color:#333;line-height:1.8;margin:0">Netflix出品。一个孟菲斯的黑人大男孩梦想成为侍酒师大师，但他的父亲希望他继承家中的烧烤店。家庭、梦想、身份认同——<strong>温暖又好吃的葡萄酒电影。</strong></p></div>
<div class="region-item"><h4>9. 《葡萄酒之路》Wine Road (2023)</h4><p style="color:#333;line-height:1.8;margin:0">轻松幽默的葡萄酒纪录片，主持人走遍全球各大产区。适合<strong>想边吃饭边看</strong>的轻松选择。</p></div>
<div class="region-item"><h4>10. 《勃艮第传奇》The Birth of Burgundy / La RVF (2016-)</h4><p style="color:#333;line-height:1.8;margin:0">法国葡萄酒杂志RVF制作的纪录片系列，深入勃艮第每个特级园。如果看完了上面9部觉得还不够过瘾，<strong>这部是发烧级爱好者的终极盛宴</strong>。</p></div>
</section>

<h3>🎬 附：家庭观影配酒指南</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<table>
<tr><th>看什么电影</th><th>建议配什么酒</th><th>理由</th></tr>
<tr><td>《杯酒人生》</td><td>加州黑皮诺</td><td>主角最爱，致敬经典</td></tr>
<tr><td>《在云端》</td><td>纳帕谷赤霞珠</td><td>美国梦的味道</td></tr>
<tr><td>《醇美年华》</td><td>普罗旺斯桃红</td><td>电影同款产区</td></tr>
<tr><td>《酒业风云》</td><td>加州霞多丽</td><td>巴黎评判中的获胜款</td></tr>
<tr><td>《红色情结》</td><td>波尔多名庄副牌</td><td>感受波尔多的魅力</td></tr>
<tr><td>《酸葡萄》</td><td>勃艮第大区级</td><td>尝尝"造假者最爱"的产区</td></tr>
</table>
</section>
<section style="background:linear-gradient(135deg,#1a1000,#3a2505);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFF8E1;font-size:16px;line-height:1.9">电影和葡萄酒有一种奇妙的共鸣——<strong style="color:#F5D742">都讲究年份、风土和时间的沉淀。</strong>一部好的葡萄酒电影，不仅仅是关于酒，更是关于人生的态度。这个周末，倒一杯酒，选一部电影，享受属于你的时光吧。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🎬 生成葡萄酒与电影\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🎬 ${date.chinese} 葡萄酒与电影：10部必看佳片，从入门到爱上葡萄酒`,author:'红酒顾问',digest:'杯酒人间、在云端、侍酒师……10部必看葡萄酒电影完整片单+品酒笔记+配酒指南。',content:generateContent(),coverImage:'wine_movies_cover_ai.png',category:'wine-culture',tags:['葡萄酒电影','杯酒人生','Sideways','Somm','葡萄酒纪录片','电影推荐'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_movies_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
