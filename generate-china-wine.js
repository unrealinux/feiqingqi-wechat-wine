/**
 * 中国葡萄酒崛起完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0000"/><stop offset="50%" style="stop-color:#3a0a0a"/><stop offset="100%" style="stop-color:#1a0a00"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#B71C1C"/><stop offset="100%" style="stop-color:#F44336"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(244,67,54,0.08)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#F44336" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">中国 · 宁夏 · 新疆 · 云南 · 山东</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#F44336" filter="url(#g)">🇨🇳</text><rect x="20" y="130" width="500" height="2" fill="#F44336"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#F44336">中国葡萄酒崛起</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">宁夏 · 新疆 · 云南 · 山东——国产酒的高光时刻</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"世界葡萄酒版图上的中国力量"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">贺兰山·天山·香格里拉·蓬莱——四大产区深度解析</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#F44336" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','china_wine_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#B71C1C;margin:0 0 8px 0;font-size:16px}h3{color:#B71C1C;border-bottom:2px solid #F44336;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#B71C1C;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#B71C1C;">🇨🇳 ${date.chinese} 中国葡萄酒崛起：从贺兰山到香格里拉</h2>
<p style="text-align:center;color:#666;">宁夏 · 新疆 · 云南 · 山东——世界葡萄酒版图上的中国力量</p>
<section style="background:linear-gradient(135deg,#1a0000,#3a0a0a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">在短短二十年间，中国葡萄酒从默默无闻到<strong style="color:#F44336">在世界舞台赢得一席之地</strong>。从贺兰山东麓的戈壁荒滩到香格里拉的雪山脚下，从新疆的千年葡萄之乡到山东的海滨葡萄园，<strong style="color:#F44336">中国正以惊人的速度成为全球葡萄酒世界无法忽视的力量</strong>。</p>
</section>
<h3>🗺️ 一、中国四大葡萄酒产区</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>🏜️ 宁夏贺兰山东麓——中国的波尔多</h4><p style="color:#333;line-height:1.8;margin:0"><strong>位置：</strong>北纬37-39度，与波尔多同纬度<br/><strong>气候：</strong>大陆性气候，干燥少雨，日照充足，昼夜温差大<br/><strong>土壤：</strong>灰钙土、沙质土、砾石，排水性极佳<br/><strong>代表品种：</strong>赤霞珠、梅洛、马瑟兰、蛇龙珠<br/><strong>代表酒庄：</strong>怡园酒庄、贺兰晴雪（加贝兰2011年获得Decanter国际金奖）、银色高地、迦南美地、西鸽酒庄<br/><strong>评价：</strong>中国最受国际认可的葡萄酒产区。贺兰晴雪的加贝兰在2011年Decanter世界葡萄酒大赛中获得<strong>国际金奖</strong>，是中国葡萄酒的里程碑事件。宁夏目前拥有超过<strong>200家酒庄</strong>。</p></div>
<div class="region-item"><h4>❄️ 云南香格里拉——世界上海拔最高的葡萄园</h4><p style="color:#333;line-height:1.8;margin:0"><strong>位置：</strong>滇川藏交界处的金沙江畔，海拔1800-2800米<br/><strong>气候：</strong>高山气候，日照极其强烈，紫外线丰富<br/><strong>土壤：</strong>岩石和沙质土壤，排水性极佳<br/><strong>代表品种：</strong>赤霞珠、品丽珠、西拉<br/><strong>代表酒庄：</strong>敖云（LVMH旗下，中国第一款膜拜酒）、霄岭、香格里拉酒庄<br/><strong>评价：</strong>敖云（Ao Yun）是LVMH集团于2013年推出的顶级中国葡萄酒，年产量仅2万瓶，<strong>单瓶售价超过3000元</strong>，是中国的第一款"膜拜酒"。香格里拉产区的潜力在近年被全球葡萄酒圈高度关注。</p></div>
<div class="region-item"><h4>🍇 新疆天山北麓——中国的加州</h4><p style="color:#333;line-height:1.8;margin:0"><strong>位置：</strong>天山山脉北坡，北纬44度<br/><strong>气候：</strong>极端的干旱气候，依赖高山雪水灌溉，日照时数全国之最<br/><strong>土壤：</strong>富含矿物质的冲积土和沙质土<br/><strong>代表品种：</strong>赤霞珠、西拉、霞多丽、雷司令<br/><strong>代表酒庄：</strong>中信国安葡萄酒业（尼雅）、中菲酒庄、乡都酒庄<br/><strong>评价：</strong>新疆是中国最大的葡萄酒产区（按产量计），这里的葡萄含糖量极高，酿造出的葡萄酒酒精度高、果味浓郁。近年来精品酒庄的崛起令人惊喜。</p></div>
<div class="region-item"><h4>🌊 山东蓬莱——中国的勃艮第？</h4><p style="color:#333;line-height:1.8;margin:0"><strong>位置：</strong>山东半岛东部，黄渤海之滨<br/><strong>气候：</strong>温带季风气候，受海洋影响，温和湿润<br/><strong>土壤：</strong>花岗岩风化的沙质土壤<br/><strong>代表品种：</strong>霞多丽、小芒森、品丽珠、马瑟兰<br/><strong>代表酒庄：</strong>拉菲蓬莱（瓏岱酒庄）、君顶酒庄、瑞枫奥塞斯<br/><strong>评价：</strong>拉菲集团2018年在蓬莱推出了瓏岱（Long Dai），这是<strong>拉菲在亚洲唯一的自有酒庄</strong>，单瓶售价超过2000元。山东产区以白葡萄酒见长，小芒森（Petit Manseng）酿造的甜白尤其出色。</p></div>
</section>
<h3>🏆 二、中国葡萄酒的高光时刻</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<table>
<tr><th>年份</th><th>事件</th><th>意义</th></tr>
<tr><td>2011</td><td>贺兰晴雪加贝兰获Decanter国际金奖</td><td>中国葡萄酒首次在国际顶级赛事中夺冠</td></tr>
<tr><td>2013</td><td>LVMH推出敖云（Ao Yun）</td><td>全球奢侈品巨头押注中国顶级葡萄酒</td></tr>
<tr><td>2018</td><td>拉菲推出瓏岱（Long Dai）</td><td>波尔多一级庄在中国建立酒庄</td></tr>
<tr><td>2020</td><td>宁夏被列入《世界葡萄酒地图》</td><td>中国产区首次被国际权威收录</td></tr>
<tr><td>2023</td><td>中国成为全球第八大葡萄酒生产国</td><td>产量和品质的持续增长获得全球认可</td></tr>
</table>
</section>
<h3>🚧 三、挑战与机遇</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>面临的挑战</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>冬季埋土：</strong>宁夏和新疆冬季气温过低，葡萄藤需要埋土过冬，增加成本且限制老藤发展<br/>• <strong>消费者认知：</strong>很多中国人仍认为"进口酒＞国产酒"，国产酒需要证明自己<br/>• <strong>人才短缺：</strong>优秀的酿酒师和葡萄种植专家仍然稀缺<br/>• <strong>品牌溢价不足：</strong>国产酒难以支撑高价，除了敖云和瓏岱之外</p></div>
<div class="region-item"><h4>崛起中的机遇</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>马瑟兰（Marselan）：</strong>中国正在将马瑟兰打造成"国宝品种"——赤霞珠和歌海娜的杂交品种在中国表现极其出色<br/>• <strong>精品酒庄运动：</strong>大量中外投资涌入精品酒庄，品质提升迅速<br/>• <strong>国产替代趋势：</strong>年轻一代对中国品牌的认同感增强<br/>• <strong>酒庄旅游：</strong>宁夏和蓬莱的酒庄旅游正在蓬勃发展</p></div>
</section>
<h3>🍷 四、必试国产酒清单</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>入门级（100-200元）</h4><p style="color:#333;line-height:1.8;margin:0">• 怡园酒庄 深蓝/庄主珍藏 — 山西/宁夏<br/>• 西鸽酒庄 玉鸽/S系列 — 宁夏<br/>• 中信国安 尼雅赤霞珠 — 新疆</p></div>
<div class="region-item"><h4>进阶级（200-500元）</h4><p style="color:#333;line-height:1.8;margin:0">• 贺兰晴雪 加贝兰珍藏 — 宁夏<br/>• 银色高地 家族珍藏/爱玛 — 宁夏<br/>• 中菲酒庄 马瑟兰 — 新疆<br/>• 君顶酒庄 小芒森甜白 — 山东</p></div>
<div class="region-item"><h4>收藏级（500元+）</h4><p style="color:#333;line-height:1.8;margin:0">• 敖云 Ao Yun — 云南香格里拉（3000元+）<br/>• 瓏岱 Long Dai — 山东蓬莱（2000元+）<br/>• 银色高地 阙歌 — 宁夏<br/>• 迦南美地 小马驹/雷司令 — 宁夏</p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0000,#3a0a0a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFCDD2;font-size:16px;line-height:1.9">中国葡萄酒的崛起不是未来时，而是进行时。<strong style="color:#F44336">从贺兰山的戈壁到香格里拉的雪山，从敖云的传奇到瓏岱的匠心，中国正在书写属于自己的葡萄酒新篇章</strong>。下次选购葡萄酒时，不妨给国产酒一个机会——你可能会惊喜。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🇨🇳 生成中国葡萄酒崛起完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🇨🇳 ${date.chinese} 中国葡萄酒崛起：从贺兰山到香格里拉，国产酒的高光时刻`,author:'红酒顾问',digest:'从宁夏到香格里拉，中国葡萄酒正以惊人的速度崛起。敖云、瓏岱、加贝兰……一文读懂四大产区的前世今生。',content:generateContent(),coverImage:'china_wine_cover_ai.png',category:'wine-knowledge',tags:['中国葡萄酒','宁夏','贺兰山','敖云','瓏岱','国产酒','马瑟兰'],publishDate:date.full};
    const op = path.join(__dirname,'output',`china_wine_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
