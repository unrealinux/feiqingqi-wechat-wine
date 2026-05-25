/**
 * 生物动力法完全指南
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a0a"/><stop offset="50%" style="stop-color:#1a3a1a"/><stop offset="100%" style="stop-color:#0a2a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#33691E"/><stop offset="100%" style="stop-color:#689F38"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><path d="M550,60 Q600,20 650,60 Q700,100 750,60" fill="none" stroke="rgba(104,159,56,0.15)" stroke-width="3"/><path d="M570,90 Q620,50 670,90 Q720,130 770,90" fill="none" stroke="rgba(104,159,56,0.1)" stroke-width="2"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#689F38" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Biodynamic Wine · 月球 · 星辰 · 大地</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#689F38" filter="url(#g)">🌙</text><rect x="20" y="130" width="500" height="2" fill="#689F38"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#689F38">生物动力法完全指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">牛角埋粪 · 月相种植 · 葡萄酒的玄学？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"全球最顶级酒庄都在用的神秘农法"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">罗曼尼康帝、勒桦、路易王妃的酿酒秘密</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#689F38" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','biodynamic_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#33691E;margin:0 0 8px 0;font-size:16px}h3{color:#33691E;border-bottom:2px solid #689F38;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#33691E;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#33691E;">🌙 ${date.chinese} 生物动力法完全指南</h2>
<p style="text-align:center;color:#666;">牛角埋粪 · 月相种植 · 葡萄酒的玄学还是科学？全球最贵酒庄都在用的农法</p>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">生物动力法（Biodynamic）是葡萄酒世界<strong style="color:#689F38">最引人争议的种植哲学</strong>。支持者认为它是风土表达的极致——罗曼尼康帝、勒桦和路易王妃等全球最顶级的酒庄都采用此法。批评者则称其为"在牛角里埋牛粪的玄学"。真相究竟如何？<strong style="color:#689F38">本文带你客观了解生物动力法的前世今生</strong>。</p>
</section>
<h3>🌱 一、从何而来？</h3>
<section style="background:#F1F8E9;padding:18px;border-radius:8px">
<div class="region-item"><h4>鲁道夫·施泰纳的农学演讲</h4><p style="color:#333;line-height:1.8;margin:0">1924年，奥地利哲学家鲁道夫·施泰纳（Rudolf Steiner）在德国科贝维茨做了一系列题为<strong>"农业课程"</strong>的演讲，这成为生物动力农业的理论基础。施泰纳认为，农场应该被视为一个"自给自足的有机体"——土壤、植物、动物和宇宙力量共同构成一个整体。这一理念与当时兴起的化学农业形成鲜明对比。</p></div>
<div class="region-item"><h4>从农业到葡萄酒</h4><p style="color:#333;line-height:1.8;margin:0">1970年代，法国著名酒庄如Château de Chassagne-Montrachet和Domaine Leroy开始实践生物动力法。真正让生物动力法在葡萄酒世界"封神"的，是Leroy女主人Lalou Bize-Leroy——她<strong>严格执行生物动力法，酿造出勃艮第最昂贵的葡萄酒</strong>。此后，罗曼尼康帝、Pontet-Canet、Coulée de Serrant等顶级名庄纷纷加入。</p></div>
</section>
<h3>🐄 二、核心实践</h3>
<section style="background:#FFFAF0;padding:18px;border-radius:8px">
<div class="region-item"><h4>BD500（牛角粪）</h4><p style="color:#333;line-height:1.8;margin:0">最著名的生物动力制剂。将<strong>牛粪填入母牛角中</strong>，在秋季埋入土壤过冬，春天挖出后制成的溶液，喷洒在葡萄园中。其"理论"是：牛角具有接收宇宙能量的能力，而牛粪则是土壤生命力的催化剂。生物学角度：牛粪富含微生物，对土壤有机质的改善确实有帮助。</p></div>
<div class="region-item"><h4>BD501（牛角硅石）</h4><p style="color:#333;line-height:1.8;margin:0">将石英粉末（二氧化硅）填入牛角中，在春季埋入土壤，秋季挖出。制成的溶液喷洒在葡萄叶片上，据称能<strong>增强光合作用和植株的光能量接收能力</strong>。实践效果：喷洒后的叶片确实在阳光下闪闪发光，反射更多光线。</p></div>
<div class="region-item"><h4>草药制剂（502-507）</h4><p style="color:#333;line-height:1.8;margin:0">六种植物材料制成的制剂，分别添加在堆肥中：<br/>• 西洋蓍草（502）— 调节钾和硫<br/>• 甘菊花（503）— 稳定氮<br/>• 荨麻（504）— 活化铁和土壤<br/>• 橡树皮（505）— 抗病<br/>• 蒲公英（506）— 调节硅酸<br/>• 缬草（507）— 促进磷循环</p></div>
<div class="region-item"><h4>月相日历</h4><p style="color:#333;line-height:1.8;margin:0">生物动力法遵循<strong>玛丽亚·图恩（Maria Thun）的种植日历</strong>，将每天分为：<br/>• <strong>果日（Fruit）：</strong>采收果实的最佳时间<br/>• <strong>花日（Flower）：</strong>植物生长旺盛<br/>• <strong>根日（Root）：</strong>适合修剪和翻土<br/>• <strong>叶日（Leaf）：</strong>适合浇水施肥<br/>许多顶级酒庄的采收和装瓶都会参考这个日历。</p></div>
</section>
<h3>🔬 三、科学界的看法</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<table>
<tr><th>观点立场</th><th>核心论点</th></tr>
<tr><td>✅ 支持方</td><td>生物动力法酒庄出产的葡萄酒确实品质更高、风土表达更纯净；强制有机种植消除了化学污染；土壤健康度显著优于常规种植</td></tr>
<tr><td>⚠️ 中立研究</td><td>部分研究显示生物动力法葡萄酒的感官品质略高于有机和常规葡萄酒；但BD500等"宇宙能量"理论没有科学依据；改良效果可能与严格有机管理有关，而非"月相力量"</td></tr>
<tr><td>❌ 反对派</td><td>"牛角埋粪"这一套在21世纪来看荒谬可笑；没有严格对照实验证明生物动力法优于标准有机种植；成功案例有强烈的幸存者偏差——顶级酒庄本身就有最好的风土和酿酒师</td></tr>
</table>
</section>
<h3>🏆 四、采用生物动力法的顶级名庄</h3>
<section style="background:#FFF3E0;padding:18px;border-radius:8px">
<div class="region-item"><h4>法国</h4><p style="color:#333;line-height:1.8;margin:0">• Domaine de la Romanée-Conti（罗曼尼康帝）— 勃艮第之王<br/>• Domaine Leroy（勒桦）— 勃艮第女王的绝对信仰<br/>• Château Pontet-Canet（庞特卡奈）— 波尔多1855列级中的先行者<br/>• Clos de la Coulée de Serrant（萨旺涅尔）— 卢瓦尔河谷的传奇<br/>• Domaine Leflaive（勒弗莱）— 勃艮第白葡萄酒的标杆</p></div>
<div class="region-item"><h4>世界其他地区</h4><p style="color:#333;line-height:1.8;margin:0">• Emilio Rojo（西班牙）— 下海湾的顶级白葡萄酒<br/>• Alois Lageder（意大利上阿迪杰）— 生物动力法先驱<br/>• Coturri（美国加州）— 美国最早的生物动力法酒庄<br/>• Cullen（澳大利亚玛格丽特河）— 澳洲生物动力法的标杆</p></div>
</section>
<h3>💭 五、结论：玄学还是科学？</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<div class="region-item"><h4>理性的选择</h4><p style="color:#333;line-height:1.8;margin:0">最理性的看法是：<strong>生物动力法的"理论"可能很玄，但实践效果往往很好</strong>。原因在于：<br/>• 生物动力法酒庄必然采用严格有机种植，杜绝化学物质<br/>• 对土壤健康的极致关注带来更优质的葡萄<br/>• 酿酒师的整体哲学态度（注重细节、耐心、尊重自然）<br/>• 生态系统的多样性增加了葡萄园的韧性</p></div>
<div class="region-item"><h4>给消费者的话</h4><p style="color:#333;line-height:1.8;margin:0">不需要"相信"牛角的力量。你只需要知道：<strong>一瓶来自优质生物动力法酒庄的葡萄酒，几乎肯定是一瓶精心酿造的好酒</strong>。如果你喜欢纯净、真实、能够反映风土的葡萄酒，生物动力法酒庄是一个值得信赖的选择。至于那些月相和宇宙能量——就让哲学家们去争论吧。</p></div>
</section>
<section style="background:linear-gradient(135deg,#0a1a0a,#1a3a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">生物动力法可以是种神秘的信仰体系，也可以是一套注重细节的耕作方法。<strong style="color:#689F38">无论你如何看待它的理论，实践结果已经证明了它的价值——全球最贵也最受尊敬的酒庄们都在用</strong>。也许下次喝到一瓶罗曼尼康帝时，你可以想一想：那瓶酒里的秘密，可能就藏在勃艮第山坡下埋着的一只牛角里。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🌙 生成生物动力法完全指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🌙 ${date.chinese} 生物动力法完全指南：牛角埋粪、月相种植——顶级酒庄的玄学还是科学？`,author:'红酒顾问',digest:'罗曼尼康帝和勒桦都在用的神秘农法，到底是玄学还是真功夫？深度解析生物动力法的理论与实践。',content:generateContent(),coverImage:'biodynamic_cover_ai.png',category:'wine-knowledge',tags:['生物动力法','Biodynamic','月相种植','有机葡萄酒','罗曼尼康帝','自然农法'],publishDate:date.full};
    const op = path.join(__dirname,'output',`biodynamic_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
