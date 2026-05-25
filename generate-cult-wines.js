/**
 * 膜拜酒完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a00"/><stop offset="50%" style="stop-color:#3a1a00"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#8B4513"/><stop offset="100%" style="stop-color:#DAA520"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(218,165,32,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#DAA520" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Cult Wine · 全球最稀有的葡萄酒</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#DAA520" filter="url(#g)">🏆</text><rect x="20" y="130" width="500" height="2" fill="#DAA520"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#DAA520">膜拜酒完全指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">一瓶酒凭什么卖到几万美元？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"葡萄酒世界的奢侈品逻辑"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">啸鹰 · 罗曼尼康帝 · 平古斯 · 西施佳雅 · 赛奎农</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','cult_wines_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B4513;margin:0 0 8px 0;font-size:16px}h3{color:#8B4513;border-bottom:2px solid #DAA520;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B4513;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B4513;">🏆 ${date.chinese} 膜拜酒完全指南</h2>
<p style="text-align:center;color:#666;">Cult Wine · 稀缺 · 天价 · 收藏 · 全球最令人疯狂的葡萄酒</p>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">一瓶酒，凭什么卖到<strong style="color:#DAA520">几万甚至几十万美元</strong>？膜拜酒（Cult Wine）是葡萄酒世界的奢侈品——<strong style="color:#DAA520">产量极少、评分极高、价格极贵、一瓶难求</strong>。从纳帕谷的啸鹰到勃艮第的罗曼尼康帝，从西班牙的平古斯到意大利的西施佳雅，膜拜酒的故事就是现代葡萄酒世界的欲望与梦想史。</p>
</section>
<h3>🔮 一、膜拜酒的诞生</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>纳帕革命</h4><p style="color:#333;line-height:1.8;margin:0">1976年的"巴黎审判"让加州葡萄酒一举成名，但真正的膜拜酒运动始于1990年代的纳帕谷。1992年，让·菲利普（Jean Phillips）在她的葡萄园中酿造了<strong>第一个年份的啸鹰（Screaming Eagle）</strong>——仅生产了225箱。1995年酒评家罗伯特·帕克给1992年份啸鹰打出了99分，1997年份更是获得100分满分，从此开启了纳帕膜拜酒时代。</p></div>
<div class="region-item"><h4>膜拜酒的三大标准</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>极低的产量：</strong>通常每年不超过500箱（6000瓶），有些甚至只有几十箱<br/>• <strong>分配制销售：</strong>不是想买就能买，而是通过等候名单或配额分配<br/>• <strong>极高的评分：</strong>几乎每一款都获得RP/WS 95分以上，常得100分满分</p></div>
</section>
<h3>🌍 二、全球膜拜酒地图</h3>
<section style="background:#F3E5F5;padding:18px;border-radius:8px">
<table>
<tr><th>产区</th><th>酒款</th><th>年份均价</th><th>年产量</th><th>风格</th></tr>
<tr><td>🇺🇸 纳帕谷</td><td>Screaming Eagle（啸鹰）</td><td>$3,500+</td><td>~500箱</td><td>浓郁赤霞珠，黑果、雪松、矿物</td></tr>
<tr><td>🇺🇸 纳帕谷</td><td>Harlan Estate（哈兰）</td><td>$1,000+</td><td>~2,000箱</td><td>波尔多混酿，优雅复杂</td></tr>
<tr><td>🇺🇸 纳帕谷</td><td>Opus One（作品一号）</td><td>$400+</td><td>~25,000箱</td><td>纳帕×波尔多的经典联姻</td></tr>
<tr><td>🇺🇸 纳帕谷</td><td>Bryant Family（布莱恩家族）</td><td>$1,000+</td><td>~500箱</td><td>极致浓郁集中</td></tr>
<tr><td>🇺🇸 索诺玛</td><td>Marcassin（马卡辛）</td><td>$1,500+</td><td>~250箱</td><td>顶级加州黑皮诺和霞多丽</td></tr>
<tr><td>🇫🇷 勃艮第</td><td>Domaine de la Romanée-Conti</td><td>$15,000+</td><td>~450箱</td><td>黑皮诺的巅峰，极致优雅</td></tr>
<tr><td>🇫🇷 勃艮第</td><td>Leroy Musigny</td><td>$20,000+</td><td>~50箱</td><td>勃艮第女皇的杰作</td></tr>
<tr><td>🇫🇷 波尔多</td><td>Château Pétrus</td><td>$4,000+</td><td>~3,000箱</td><td>梅洛之最，丝滑奢华</td></tr>
<tr><td>🇫🇷 波尔多</td><td>Château Lafite Rothschild</td><td>$600+</td><td>~20,000箱</td><td>中国最爱的波尔多一级庄</td></tr>
<tr><td>🇪🇸 里贝拉</td><td>Pingus（平古斯）</td><td>$1,200+</td><td>~350箱</td><td>西班牙丹魄的现代巅峰</td></tr>
<tr><td>🇮🇹 皮埃蒙特</td><td>Giacomo Conterno Monfortino</td><td>$1,200+</td><td>~500箱</td><td>巴罗洛之王</td></tr>
<tr><td>🇦🇺 巴罗莎</td><td>Penfolds Grange（葛兰许）</td><td>$800+</td><td>~7,500箱</td><td>澳洲酒王，西拉标杆</td></tr>
</table>
</section>
<h3>📈 三、为何如此昂贵？</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>稀缺性经济学</h4><p style="color:#333;line-height:1.8;margin:0">膜拜酒遵循最基础的供需法则：<strong>全球有几百万葡萄酒收藏家，但一款酒只有几百箱</strong>。以啸鹰为例，等候名单上有数千人排队，每年仅放出几百瓶配额。这种"得不到的诱惑"反而推动了价格的飙升。</p></div>
<div class="region-item"><h4>帕克效应</h4><p style="color:#333;line-height:1.8;margin:0">罗伯特·帕克（Robert Parker）的100分评分是膜拜酒价格最强大的催化剂。获得帕克100分满分的酒款，价格通常在评分公布后24-48小时内<strong>翻倍甚至翻三倍</strong>。帕克在巅峰时期的影响力大到可以"创造"一款膜拜酒。</p></div>
<div class="region-item"><h4>投资属性</h4><p style="color:#333;line-height:1.8;margin:0">顶级膜拜酒的年化收益率可达15-30%，远高于股票和黄金。2010年，一箱1990年份罗曼尼康帝在佳士得拍出<strong>$169,000</strong>的天价。2022年，一箱1945年份罗曼尼康帝更是拍出<strong>$558,000</strong>。这让膜拜酒成为富人的另类资产。</p></div>
</section>
<h3>🤔 四、膜拜酒值得买吗？</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>支持者的理由</h4><p style="color:#333;line-height:1.8;margin:0">• "喝一口就知道为什么——那种复杂度和深邃感是普通酒无法企及的"<br/>• "每一瓶都是艺术品，承载着风土、历史和酿酒师的灵魂"<br/>• "收藏和投资价值兼备，越陈越值钱"<br/>• "社交货币——开一瓶啸鹰的场合，永远不会被忘记"</p></div>
<div class="region-item"><h4>反对者的声音</h4><p style="color:#333;line-height:1.8;margin:0">• "价格严重脱离价值，大部分溢价来自营销和稀缺性操纵"<br/>• "许多膜拜酒在盲品中并不比百元级的酒明显更好"<br/>• "一瓶膜拜酒的价格可以买一整个产区的精选酒款"<br/>• "分配制和等候名单本质上是一种饥饿营销"</p></div>
<div class="region-item"><h4>我们的建议</h4><p style="color:#333;line-height:1.8;margin:0">膜拜酒的世界更像<strong>收藏品市场而非日常饮品市场</strong>。如果预算充裕，一辈子至少试一次罗曼尼康帝或啸鹰，那是一种体验。但对于日常享用，性价比远超膜拜酒的酒款多的是——<strong>真正的葡萄酒乐趣不在于价格标签，而在于探索和分享的快乐。</strong></p></div>
</section>
<section style="background:linear-gradient(135deg,#1a0a00,#3a1a00);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFDAB9;font-size:16px;line-height:1.9">膜拜酒是葡萄酒世界的金字塔尖，它们代表着人类酿酒技艺的极致。<strong style="color:#DAA520">了解膜拜酒不是为了追逐天价，而是为了理解葡萄酒的无限可能</strong>——最好的酒不一定是最贵的，但一定是最让你心动的。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🏆 生成膜拜酒完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🏆 ${date.chinese} 膜拜酒完全指南：啸鹰、罗曼尼康帝、平古斯——一瓶酒凭什么卖到天价？`,author:'红酒顾问',digest:'从纳帕谷的啸鹰到勃艮第的罗曼尼康帝，膜拜酒为何一瓶难求又价值连城？深度解析葡萄酒世界的奢侈品逻辑。',content:generateContent(),coverImage:'cult_wines_cover_ai.png',category:'wine-knowledge',tags:['膜拜酒','啸鹰','罗曼尼康帝','平古斯','Cult Wine','收藏级葡萄酒'],publishDate:date.full};
    const op = path.join(__dirname,'output',`cult_wines_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
