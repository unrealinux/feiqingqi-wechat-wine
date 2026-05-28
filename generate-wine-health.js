/**
 * 葡萄酒与健康
 */
process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#052010"/><stop offset="50%" style="stop-color:#0a3a1a"/><stop offset="100%" style="stop-color:#052010"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#2E7D32"/><stop offset="100%" style="stop-color:#4CAF50"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="170" fill="rgba(76,175,80,0.07)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#4CAF50" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">法国悖论 · 白藜芦醇 · 真相</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#4CAF50" filter="url(#g)">❤️</text><rect x="20" y="130" width="500" height="2" fill="#4CAF50"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#4CAF50">葡萄酒与健康</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">红酒到底对身体好不好？</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"每天一杯红酒，医生远离我？"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">科学解读 · 数据说话 · 理性饮酒</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#4CAF50" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','wine_health_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#2E7D32;margin:0 0 8px 0;font-size:16px}h3{color:#2E7D32;border-bottom:2px solid #4CAF50;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#2E7D32;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#2E7D32;">❤️ ${date.chinese} 葡萄酒与健康：每天一杯红酒到底好不好？</h2>
<p style="text-align:center;color:#666;">法国悖论、白藜芦醇、抗氧化——科学数据告诉你真相</p>
<section style="background:linear-gradient(135deg,#052010,#0a3a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">"每天一杯红酒，医生远离我"——这句话你可能听过无数次。但<strong style="color:#4CAF50">它到底是科学真理，还是葡萄酒商精心包装的营销话术？</strong>今天我们不站队、不带货，只摆数据和事实，聊一聊葡萄酒和健康的关系。</p>
</section>
<h3>🇫🇷 一、法国悖论：一切的起点</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">1991年，美国CBS电视台《60分钟》栏目播出了一期震惊世界的节目——<strong>法国悖论（French Paradox）</strong>。<br/><br/>数据显示：法国人日常饮食中含有大量黄油、奶酪、鹅肝等饱和脂肪，但心血管疾病的发病率却远低于美国。研究者认为，"关键区别"在于法国人每天随餐饮用红酒。<br/><br/>这个节目播出后，美国红酒销量在几周内<strong>暴涨了44%</strong>。白藜芦醇（Reveratrol）——红葡萄皮中的一种天然化合物——从此成为"健康圣物"。<br/><br/><strong>但是……</strong>近年越来越多的研究发现，这个"悖论"可能并没有那么简单。</p>
</section>
<h3>🔬 二、白藜芦醇：被夸大的明星分子</h3>
<section style="background:#FFF8E1;padding:18px;border-radius:8px">
<div class="region-item"><h4>白藜芦醇的实验室证据</h4><p style="color:#333;line-height:1.8;margin:0">• 体外实验：白藜芦醇具有<strong>抗氧化、抗炎、抗癌</strong>活性<br/>• 动物实验：高剂量白藜芦醇可延长小鼠寿命，模拟"热量限制"的效果<br/>• 人体实验：结果<strong>令人失望</strong>——要达到动物实验中的有效剂量，一个人每天需要喝<strong>500-5000瓶</strong>红酒<br/>因此，<strong>靠喝红酒补充足够剂量的白藜芦醇，是不可能的</strong>。<br/>"红酒抗氧化"的概念在科学界已不流行——人体有自己复杂的抗氧化系统，靠食物中的抗氧化剂影响有限。</p></div>
<div class="region-item"><h4>那法国悖论到底怎么解释？</h4><p style="color:#333;line-height:1.8;margin:0">现代研究认为，法国人心血管疾病低的原因更可能是：<br/>• 法国人<strong>总体食量较小</strong>（份量控制）<br/>• 法国人<strong>吃饭节奏慢</strong>，不暴饮暴食<br/>• 法国<strong>医疗体系</strong>更完善<br/>• 法国人吃大量<strong>新鲜的蔬菜水果</strong><br/>• <strong>生活方式差异</strong>：走路多、压力水平不同<br/>换句话说，红酒可能只是"健康生活方式"的一部分，而不是原因。</p></div>
</section>
<h3>📊 三、科学界的最新共识</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px">
<div class="region-item"><h4>2023年WHO警告</h4><p style="color:#333;line-height:1.8;margin:0">世界卫生组织（WHO）发布的<a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)32794-2/fulltext" target="_blank" rel="noopener">《柳叶刀》研究</a>明确指出：<strong>任何剂量的酒精摄入都会增加健康风险</strong>。所谓"安全饮酒量"并不存在——每多喝一口，风险就增加一分。<br/>这与过去"适量饮酒有益健康"的说法完全相反，引起了巨大争议。</p></div>
<div class="region-item"><h4>J-型曲线的争议</h4><p style="color:#333;line-height:1.8;margin:0">支持适量饮酒的人引用"J-型曲线"研究：完全不喝酒的人心脏病风险略高于每天喝1杯的人，但每天喝超过2杯的人风险急剧上升。<br/><br/><strong>批评者认为：</strong>J-型曲线是统计偏差造成的——很多"不喝酒"的人是因为健康问题才戒酒的，把原本不健康的人算进了对照组。<br/><br/>目前的主流医学界态度是：<strong>现有证据不足以证明"适量饮酒有益健康"，但大量饮酒无疑有害。</strong></p></div>
<div class="region-item"><h4>核心结论</h4><p style="color:#333;line-height:1.8;margin:0"><strong>如果你不喝酒：</strong>不要为了"健康"开始喝。益处微乎其微，不值得。<br/><strong>如果你偶尔喝：</strong>每天不超过1杯（红酒约150ml），风险可接受。<br/><strong>如果你每天喝：</strong>控制在1杯以内，且最好随餐饮用。<br/><strong>谁应该完全避免：</strong>孕妇、肝病患者、有酒精依赖史的人、某些药物使用者。</p></div>
</section>
<h3>🍷 四、红酒vs其他酒类：有区别吗</h3>
<section style="background:#FCE4EC;padding:18px;border-radius:8px">
<table>
<tr><th>酒类</th><th>酒精含量</th><th>健康关注点</th><th>注</th></tr>
<tr><td>红酒</td><td>12-15%</td><td>含白藜芦醇和原花青素</td><td>有效剂量太低，意义有限</td></tr>
<tr><td>白酒/烈酒</td><td>40%+</td><td>纯酒精，无其他有益物质</td><td>热量高，风险最高</td></tr>
<tr><td>啤酒</td><td>3-6%</td><td>有一定的硅（利骨骼）</td><td>热量高，"啤酒肚"真实存在</td></tr>
<tr><td>清酒</td><td>12-16%</td><td>含有氨基酸和多肽</td><td>研究较少</td></tr>
</table>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>结论：</strong>理论上红酒因为有白藜芦醇等物质，"可能"比其他酒类健康一点点。但差异微乎其微，不足以成为选择红酒的主要理由。</p>
</section>
<h3>⚖️ 五、理性饮酒的八个原则</h3>
<section style="background:#E8F5E9;padding:18px;border-radius:8px">
<ol style="color:#333;line-height:2.2;padding-left:20px">
<li><strong>限制总量：</strong>男性每天不超过2杯，女性不超过1杯。1杯=150ml红酒</li>
<li><strong>随餐饮用：</strong>空腹饮酒伤胃，食物减缓酒精吸收</li>
<li><strong>不屯酒：</strong>不要为"健康"而喝，想喝就喝，不想喝就不喝</li>
<li><strong>远离"睡前一杯酒助眠"：</strong>酒精确实能帮助入睡，但会破坏深度睡眠质量</li>
<li><strong>每周至少2天不饮酒：</strong>给肝脏"放个假"</li>
<li><strong>酒后不驾驶：</strong>零容忍</li>
<li><strong>不要用"健康"劝酒：</strong>别人喝不喝是别人的事</li>
<li><strong>关注自己的感受：</strong>如果每次喝酒后都不舒服，那就减少或停止</li>
</ol>
</section>
<section style="background:linear-gradient(135deg,#052010,#0a3a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#C8E6C9;font-size:16px;line-height:1.9">葡萄酒最大的价值不是"抗氧化"或"治百病"，而是<strong style="color:#4CAF50">让一餐饭变得更美好，让一次相聚变得更温暖</strong>。与其把它当作保健品的替代品，不如把它当作生活品质的调味剂。<strong style="color:#4CAF50">适量、理性、愉悦</strong>——这才是葡萄酒和健康之间最真实的关系。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;
}

async function main() {
  console.log('============================================================\n❤️ 生成葡萄酒与健康\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`❤️ ${date.chinese} 葡萄酒与健康：每天一杯红酒到底好不好？科学数据告诉你真相`,author:'红酒顾问',digest:'法国悖论、白藜芦醇、抗氧化——红酒健康神话是科学还是营销？WHO最新研究怎么说？',content:generateContent(),coverImage:'wine_health_cover_ai.png',category:'wine-knowledge',tags:['葡萄酒健康','白藜芦醇','法国悖论','红酒养生','理性饮酒','WHO'],publishDate:date.full};
    const op = path.join(__dirname,'output',`wine_health_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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
