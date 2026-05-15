/**
 * 巴贝拉葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="100%" y2="100%"><stop offset="0" style="stop-color:#1a0a1a"/><stop offset="50%" style="stop-color:#3a1a3a"/><stop offset="100%" style="stop-color:#0a1a2e"/></linearGradient><linearGradient id="og" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:#6A0DAD"/><stop offset="100%" style="stop-color:#BA55D3"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="383" fill="url(#bg)"/><circle cx="650" cy="100" r="180" fill="rgba(186,85,211,0.12)"/><ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/><rect x="620" y="200" width="160" height="200" rx="5" fill="url(#og)" stroke="#BA55D3" stroke-width="2"/><text x="700" y="375" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Piedmont, Italy</text><text x="30" y="80" font-family="Microsoft YaHei,serif" font-size="48" font-weight="bold" fill="#BA55D3" filter="url(#g)">🍷</text><rect x="20" y="130" width="500" height="2" fill="#BA55D3"/><text x="30" y="165" font-family="Microsoft YaHei,PingFang SC" font-size="38" font-weight="bold" fill="#BA55D3">巴贝拉</text><text x="30" y="200" font-family="Microsoft YaHei,PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">意大利皮埃蒙特 · 巴贝拉 · 日常红葡萄酒</text><text x="30" y="235" font-family="Microsoft YaHei,PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"意大利最受欢迎的日常红葡萄酒"</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">酸度明亮 · 果香充沛 · 配餐百搭</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#BA55D3" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(path.join(__dirname,'output','barbera_cover_ai.png'),b);console.log('📁 封面已保存');return b;});
}

function generateContent() { return `
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#8B008B;margin:0 0 8px 0;font-size:16px}h3{color:#8B008B;border-bottom:2px solid #BA55D3;padding-bottom:8px;margin-top:25px}table{width:100%;border-collapse:collapse;margin:10px 0}table th{background:#8B008B;color:#fff;padding:10px;text-align:left}table td{padding:10px;border-bottom:1px solid #ddd;color:#333}</style>
<h2 style="text-align:center;color:#8B008B;">🍷 ${date.chinese} 巴贝拉完全指南：意大利人的日常红葡萄酒</h2>
<p style="text-align:center;color:#666;">皮埃蒙特 · 巴贝拉 · 酸度明亮 · 配餐百搭</p>
<section style="background:linear-gradient(135deg,#1a0a1a,#3a1a3a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">巴贝拉（Barbera）是<strong style="color:#BA55D3">意大利种植最广泛的红葡萄品种之一</strong>，尤其在皮埃蒙特地区，巴贝拉是每家每户餐桌上的日常葡萄酒。如果说内比奥罗（Nebbiolo）为贵族而生，那么巴贝拉就是为大众而酿——它果香充沛、酸度明亮、单宁柔和，无需漫长等待即可享用。本文将带你全面了解<strong style="color:#BA55D3">这款亲切的意大利红葡萄酒</strong>。</p>
</section>
<h3>🍇 一、认识巴贝拉葡萄</h3>
<section style="background:#FFF0F5;padding:18px;border-radius:8px">
<div class="region-item"><h4>品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>起源：</strong>皮埃蒙特地区的古老品种，可追溯至13世纪<br/>• <strong>酸度：</strong>显著特点——天然高酸度，清新爽口<br/>• <strong>单宁：</strong>柔和，远低于内比奥罗，更适合早期饮用<br/>• <strong>果香：</strong>红樱桃、草莓、覆盆子、红醋栗<br/>• <strong>适应性：</strong>对土壤适应性强，产量高</p></div>
<div class="region-item"><h4>巴贝拉 vs 内比奥罗</h4><p style="color:#333;line-height:1.8;margin:0"><strong>巴贝拉：</strong>酸度高，单宁低，果香充沛，适合日常饮用，价格亲民<br/><strong>内比奥罗：</strong>酸度中等，单宁高，香气复杂，需要长时间陈年，价格高贵</p></div>
</section>
<h3>🏛️ 二、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Barbera d'Asti DOCG</h4><p style="color:#333;line-height:1.8;margin:0">巴贝拉的最高级别，产自Asti地区。这里的巴贝拉口感饱满，结构出色，既有果香又有陈年潜力。价格从80-300元不等。</p></div>
<div class="region-item"><h4>Barbera del Monferrato</h4><p style="color:#333;line-height:1.8;margin:0">Monferrato丘陵的巴贝拉风格优雅，酸度活泼。超级版本（Superiore）要求更高陈酿时间。</p></div>
<div class="region-item"><h4>Barbera d'Alba</h4><p style="color:#333;line-height:1.8;margin:0">产自Alba地区，土壤更复杂，出产的巴贝拉风格更加浓郁，带有矿物感。</p></div>
</section>
<h3>🍷 三、酿造风格</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>不锈钢桶风格</h4><p style="color:#333;line-height:1.8;margin:0">最普遍的酿造方式。突出巴贝拉新鲜的红果香气和清爽酸度，年轻活泼，适合在1-2年内饮用。</p></div>
<div class="region-item"><h4>橡木桶陈酿</h4><p style="color:#333;line-height:1.8;margin:0">在法国或美国橡木桶中陈酿6-12个月。发展出香草、巧克力和甜香料的风味。单宁更加圆润，结构更丰富。</p></div>
<div class="region-item"><h4>Superiore（超级）</h4><p style="color:#333;line-height:1.8;margin:0">要求更低产量、更高酒精度和至少14个月陈酿。这些酒更适合陈年，品质更高。</p></div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>视觉</h4><p style="color:#333;line-height:1.8;margin:0">深宝石红色到石榴红，色泽明亮。</p></div>
<div class="region-item"><h4>嗅觉</h4><p style="color:#333;line-height:1.8;margin:0">明显的红樱桃、草莓和覆盆子香气，带有紫罗兰和淡淡的花香。陈年后发展出巧克力、烟草和皮革的复杂气息。</p></div>
<div class="region-item"><h4>味觉</h4><p style="color:#333;line-height:1.8;margin:0">入口酸度明亮清爽，果味充沛。单宁柔和不涩，酒体中等。余味干净，带有红果干的甜美。建议饮用温度14-16°C。</p></div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>意大利面：</strong>番茄肉酱面、千层面——巴贝拉的酸度完美匹配番茄的酸度<br/>• <strong>披萨：</strong>任何款式的披萨都是绝配<br/>• <strong>冷盘：</strong>意大利火腿、萨拉米香肠<br/>• <strong>中式菜肴：</strong>宫保鸡丁、鱼香肉丝、番茄炒蛋<br/>• <strong>奶酪：</strong>中等陈年奶酪</p>
</section>
<section style="background:linear-gradient(135deg,#1a0a1a,#3a1a3a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">巴贝拉是意大利人生活中最亲切的葡萄酒。它不需要仪式感，不需要长时间的醒酒，<strong style="color:#BA55D3">打开即饮，快乐随之而来</strong>。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`; }

async function main() {
  console.log('============================================================\n🥂 生成巴贝拉完全指南文章\n日期:',date.display,'\n============================================================');
  try {
    const cb = await gCov();
    const article = {title:`🍷 ${date.chinese} 巴贝拉完全指南：意大利人的日常红葡萄酒`,author:'红酒顾问',digest:'巴贝拉是意大利种植最广泛的红葡萄品种之一。本文详解巴贝拉葡萄特性、三大核心产区、酿造风格及最全配餐指南。',content:generateContent(),coverImage:'barbera_cover_ai.png',category:'wine-knowledge',tags:['巴贝拉','意大利葡萄酒','皮埃蒙特','日常红葡萄酒','Barbera'],publishDate:date.full};
    const op = path.join(__dirname,'output',`barbera_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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