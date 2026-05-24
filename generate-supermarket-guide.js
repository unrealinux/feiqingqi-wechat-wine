/**
 * 超市买酒指南（百元内高性价比）
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#0a1a2a"/><stop offset="50%" style="stop-color:#1a2a3a"/><stop offset="100%" style="stop-color:#0a0a1a"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#1565C0"/><stop offset="100%" style="stop-color:#42A5F5"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(66,165,245,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#42A5F5" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">超市选购指南</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#42A5F5" filter="url(#g)">🛒</text><rect x="20" y="130" width="500" height="2" fill="#42A5F5"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#42A5F5">超市买酒指南</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">百元内高性价比 · 一看就会 · 闭眼入</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"超市货架上的隐藏宝藏"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">Ole · 盒马 · 山姆 · 酒类专门店选购攻略</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#42A5F5" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','supermarket_wine_guide_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#1565C0;margin:0 0 8px 0;font-size:16px}h3{color:#1565C0;border-bottom:2px solid #42A5F5;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#1565C0;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#1565C0;">🛒 ${date.chinese} 超市买酒指南：百元内高性价比推荐</h2>
<p style="text-align:center;color:#666;">Ole · 盒马 · 山姆 · 便利店的葡萄酒怎么挑？一看就会的超市选酒攻略</p>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#BBDEFB;font-size:16px;line-height:1.9">面对超市货架上琳琅满目的葡萄酒，你是否经常感到无从下手？<strong style="color:#42A5F5">几十到一百元出头的葡萄酒到底能不能喝？怎么挑才不会踩雷？</strong>本文手把手教你成为超市选酒高手，花最少的钱喝到最值的酒。</p>
</section>
<h3>🔑 一、超市选酒黄金法则</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>法则一：看品种，不看品牌</h4><p style="color:#333;line-height:1.8;margin:0">超市里不知名品牌≠不好喝。百元价位段，<strong>关注葡萄品种比品牌重要10倍</strong>。认准这几个不容易踩雷的品种：</p></div>
<div class="region-item"><h4>法则二：看产区，不看广告</h4><p style="color:#333;line-height:1.8;margin:0">百元酒最好的性价比在<strong>新世界产区</strong>——智利、阿根廷、澳大利亚、南非。同等价格下品质碾压旧世界入门酒。</p></div>
<div class="region-item"><h4>法则三：看年份，不是越陈越好</h4><p style="color:#333;line-height:1.8;margin:0">百元级别的酒99%不适合陈年。买<strong>最近2-3年的酒款</strong>，新鲜果味才是最佳状态。</p></div>
</section>
<h3>🍇 二、百元以内闭眼入清单</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<table>
<tr><th>品种/类型</th><th>推荐产区</th><th>推荐理由</th><th>参考价</th></tr>
<tr><td>赤霞珠</td><td>智利中央山谷、澳大利亚库纳瓦拉</td><td>果味浓郁，单宁成熟，百元内最佳选择</td><td>60-100元</td></tr>
<tr><td>梅洛</td><td>智利、法国奥克地区</td><td>口感圆润，不涩口，新手最爱</td><td>50-90元</td></tr>
<tr><td>长相思</td><td>智利、新西兰马尔堡入门级</td><td>清爽百香果味，女性最爱</td><td>60-120元</td></tr>
<tr><td>莫斯卡托</td><td>意大利 Moscato d'Asti</td><td>微甜气泡，人见人爱，聚餐神器</td><td>60-80元</td></tr>
<tr><td>灰皮诺</td><td>意大利北部、法国阿尔萨斯入门</td><td>清爽百搭，几乎不踩雷</td><td>70-120元</td></tr>
<tr><td>西拉/设拉子</td><td>澳大利亚南澳、南非</td><td>浓郁黑果风味，口感饱满</td><td>60-100元</td></tr>
<tr><td>起泡酒</td><td>意大利普洛赛克、西班牙卡瓦</td><td>价格亲民，庆祝首选</td><td>60-100元</td></tr>
</table>
</section>
<h3>🏪 三、各超市选酒攻略</h3>
<section style="background:#F3E5F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>🛍️ Ole / 精品超市</h4><p style="color:#333;line-height:1.8;margin:0"><strong>优势：</strong>选品最专业，常有折扣活动<br/><strong>推荐品牌：</strong>智利的Concha y Toro、澳大利亚的Yellow Tail、意大利的Zonin<br/><strong>Tips：</strong>Ole的自主进口系列性价比最高，尤其智利和澳洲酒。关注促销标签，常能低于80元买到物超所值的酒。</p></div>
<div class="region-item"><h4>🛍️ 盒马 / 河马生鲜</h4><p style="color:#333;line-height:1.8;margin:0"><strong>优势：</strong>价格透明，APP下单方便<br/><strong>推荐品牌：</strong>盒马自有品牌的智利酒、法国Vieux Papes<br/><strong>Tips：</strong>盒马的"价格直降"区域值得关注。挑盒马自有品牌（贴牌酒），品质稳定且去掉了品牌溢价，通常50-80元就能买到不错的日常餐酒。</p></div>
<div class="region-item"><h4>🛍️ 山姆 / Costco</h4><p style="color:#333;line-height:1.8;margin:0"><strong>优势：</strong>量大价优，会员制选品有保障<br/><strong>推荐品牌：</strong>山姆自有品牌Member's Mark、法国波尔多AOC大区<br/><strong>Tips：</strong>山姆的葡萄酒区是宝藏——Member's Mark系列性价比极高，波尔多AOC大区酒常年在80-100元区间。另外山姆的意大利酒区也非常值得探索。</p></div>
<div class="region-item"><h4>🛍️ 便利店（全家/罗森/7-11）</h4><p style="color:#333;line-height:1.8;margin:0"><strong>优势：</strong>随时可买，应急首选<br/><strong>推荐品牌：</strong>Viu Manent（智利）、Barefoot（美国）<br/><strong>Tips：</strong>便利店的选择很少但胜在方便。通常百元以内的选项是智利和澳洲酒。记住不要期望太高——这只是"今晚想喝一杯"的解决方案。</p></div>
</section>
<h3>⚠️ 四、超市买酒避坑指南</h3>
<section style="background:#FFEBEE;padding:18px;border-radius:8px">
<div class="region-item"><h4>🛑 这些酒不要买</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>礼盒装：</strong>超市里的"红酒礼盒"（带两个酒杯那种）几乎都是品质最差的酒<br/>• <strong>扫码价虚高：</strong>货架上贴"扫码价988元"的酒，实际成本可能不到20元<br/>• <strong>无产区标注：</strong>只写"进口葡萄酒"但没有具体产区的酒不要买<br/>• <strong>电商专供：</strong>名字看起来很华丽（"拉菲XX庄园"）但来源不明的酒</p></div>
<div class="region-item"><h4>✅ 值得买的信号</h4><p style="color:#333;line-height:1.8;margin:0">• 酒标上明确标注了<strong>具体品种</strong>（如100% Cabernet Sauvignon）<br/>• 有<strong>具体产区</strong>（如Central Valley而非 Chile）<br/>• 酒精度在 <strong>13-14.5%</strong> 之间（太低的可能葡萄成熟度不够）<br/>• 有<strong>年份</strong>标注（没有年份的酒通常是量产廉价酒）<br/>• 螺旋盖 ≠ 便宜货：澳洲和新西兰中高端酒大量使用螺旋盖</p></div>
</section>
<h3>💰 五、百元内各场景推荐</h3>
<section style="background:#E8EAF6;padding:18px;border-radius:8px">
<table>
<tr><th>场景</th><th>推荐酒款</th><th>价格区间</th></tr>
<tr><td>👫 两人晚餐</td><td>智利赤霞珠或马尔贝克</td><td>60-80元</td></tr>
<tr><td>🎉 朋友聚餐</td><td>莫斯卡托起泡 + 澳洲西拉</td><td>60-100元（各一瓶）</td></tr>
<tr><td>🎁 不太熟的送礼物</td><td>葡萄牙波特酒或西班牙卡瓦</td><td>80-100元</td></tr>
<tr><td>🧘 一个人独饮</td><td>新西兰长相思或智利黑皮诺</td><td>70-100元</td></tr>
<tr><td>🍝 搭配中式外卖</td><td>意大利蓝布鲁斯科或澳洲西拉</td><td>60-80元</td></tr>
<tr><td>🥂 女生聚会</td><td>意大利莫斯卡托或普洛赛克</td><td>50-80元</td></tr>
</table>
</section>
<section style="background:linear-gradient(135deg,#0a1a2a,#1a2a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#BBDEFB;font-size:16px;line-height:1.9">葡萄酒不一定要花大价钱才能享受。<strong style="color:#42A5F5">百元以内的超市葡萄酒中，藏着许多被忽视的宝藏</strong>。掌握了这些选酒技巧，下次逛超市时，你就是朋友圈里的葡萄酒买手了！</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🛒 生成超市买酒指南\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🛒 ${date.chinese} 超市买酒指南：百元内高性价比选酒攻略`,author:'红酒顾问',digest:'Ole、盒马、山姆的葡萄酒怎么挑？百元内闭眼入清单+避坑指南，看完就会选。',content:generateContent(),coverImage:'supermarket_wine_guide_cover_ai.png',category:'wine-knowledge',tags:['超市买酒','百元红酒','性价比','选酒指南','新手必看'],publishDate:date.full};
    const op = path.join(__dirname,'output',`supermarket_wine_guide_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
