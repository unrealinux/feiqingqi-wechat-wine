/**
 * 蒙特普尔恰诺葡萄酒完全指南
 */

process.env.HTTP_PROXY = ''; process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios'); axios.defaults.proxy = false;
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const FormData = require('form-data'); const config = require('./config');
const { exec } = require('child_process'); const util = require('util'); const execPromise = util.promisify(exec);

const today = new Date();
const date = { full: today.toISOString().slice(0, 10), display: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`, chinese: `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日` };

function gCov(p,pr) {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tg" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:${pr.c1}"/><stop offset="100%" style="stop-color:${pr.c2}"/></linearGradient><filter id="sh"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/></filter></defs><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/><text x="30" y="290" font-family="Microsoft YaHei,PingFang SC,sans-serif" font-size="34" font-weight="bold" fill="url(#tg)" filter="url(#sh)">🍷 ${pr.t}</text><text x="30" y="335" font-family="Microsoft YaHei,PingFang SC,sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">${pr.s}</text><text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="${pr.c2}" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{fs.writeFileSync(p,b); return b;});
}

async function run(theme) {
  console.log(`============================================================\n🥂 生成${theme.name}文章\n日期: ${date.display}\n============================================================`);
  try {
    const coverPath = path.join(__dirname,'output',`${theme.id}_cover_real.png`);
    const cPath = path.join(__dirname,'output',`${theme.id}_cover_ai.png`);
    console.log(`🎨 使用 baoyu-imagine 生成写实${theme.name}封面...`);
    try {
      const sp = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
      const {stdout} = await execPromise(`npx -y bun "${sp}" --prompt "${theme.prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`,{timeout:180000});
      if(!!stdout.match(/cover\.png/)||fs.existsSync(coverPath)){
        const rb = await sharp(coverPath).resize(900,383,{fit:'cover',position:'center'}).png().toBuffer();
        const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tg" x1="0" y1="0" x2="100%" y2="0"><stop offset="0" style="stop-color:${theme.c1}"/><stop offset="100%" style="stop-color:${theme.c2}"/></linearGradient><filter id="sh"><feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/></filter></defs><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/><text x="30" y="290" font-family="Microsoft YaHei,PingFang SC,sans-serif" font-size="34" font-weight="bold" fill="url(#tg)" filter="url(#sh)">🍷 ${theme.coverTitle}</text><text x="30" y="335" font-family="Microsoft YaHei,PingFang SC,sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">${theme.subtitle}</text><text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="${theme.c2}" text-anchor="end">${date.display}</text></svg>`;
        const fb = await sharp(rb).composite([{input:Buffer.from(svg),top:0,left:0}]).png().toBuffer();
        fs.writeFileSync(cPath, fb); console.log('   ✅ AI图片生成成功'); var cb = fb;
      }
    } catch(e){console.log('   ⚠️ AI 生成失败:', e.message);}
    if(!cb) cb = await gCov(cPath,{c1:theme.c1,c2:theme.c2,t:theme.coverTitle,s:theme.subtitle});
    const article = {title:theme.title,author:'红酒顾问',digest:theme.digest,content:theme.content(),coverImage:`${theme.id}_cover_ai.png`,category:'wine-knowledge',tags:theme.tags,publishDate:date.full};
    const op = path.join(__dirname,'output',`${theme.id}_${date.full.replace(/-/g,'')}.json`); fs.writeFileSync(op,JSON.stringify(article,null,2)); console.log('📁 文章已保存:',op);
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

// 蒙特普尔恰诺 d'Abruzzo
run({
  id:'montepulciano',name:'蒙特普尔恰诺',c1:'#800020',c2:'#B22222',
  coverTitle:'蒙特普尔恰诺完全指南',
  subtitle:'意大利阿布鲁佐 · 蒙特普尔恰诺 · 浓郁醇厚',
  title:`🍷 ${date.chinese} 蒙特普尔恰诺完全指南：阿布鲁佐的骄傲`,
  digest:'蒙特普尔恰诺（Montepulciano d\'Abruzzo）是意大利中部最著名的红葡萄酒之一。本文详解蒙特普尔恰诺葡萄品种、产区风土及品鉴特点。',
  tags:['蒙特普尔恰诺','意大利葡萄酒','阿布鲁佐','意大利红酒'],
  prompt:'Photorealistic Italian Montepulciano d\'Abruzzo wine, deep ruby red in glass, Abruzzo hillside vineyards, Adriatic coast landscape, old wine cellar with barrels, Montepulciano grapes on vine, professional photography, 8K ultra-detailed',
  content:()=>`
<style>.region-item{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0}.region-item h4{color:#800020;margin:0 0 8px 0;font-size:16px}h3{color:#800020;border-bottom:2px solid #B22222;padding-bottom:8px;margin-top:25px}</style>
<h2 style="text-align:center;color:#800020;">🍷 ${date.chinese} 蒙特普尔恰诺完全指南：阿布鲁佐的骄傲</h2>
<p style="text-align:center;color:#666;">阿布鲁佐 · 蒙特普尔恰诺 · 浓郁醇厚</p>
<section style="background:linear-gradient(135deg,#2d0a0a,#4a1a1a);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFC0C0;font-size:16px;line-height:1.9">蒙特普尔恰诺（Montepulciano d'Abruzzo）是<strong style="color:#FF6347">意大利中部最具代表性的红葡萄酒</strong>之一。这款酒以同名葡萄品种酿造，以其深邃的颜色、饱满的酒体和出色的性价比，成为意大利最受欢迎的红葡萄酒之一。本文将带你了解<strong style="color:#FF6347">蒙特普尔恰诺的魅力</strong>。</p>
</section>
<h3>🍇 一、认识蒙特普尔恰诺葡萄</h3>
<section style="background:#fff0f0;padding:18px;border-radius:8px">
<div class="region-item"><h4>葡萄品种特性</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>颜色深：</strong>具有极高的色素含量，酒色深红带紫<br/>• <strong>单宁：</strong>柔顺但结构完整<br/>• <strong>酸度：</strong>中等到中高<br/>• <strong>香气：</strong>黑樱桃、李子和黑莓</p></div>
</section>
<h3>🏛️ 二、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">
<div class="region-item"><h4>Montepulciano d'Abruzzo DOC</h4><p style="color:#333;line-height:1.8;margin:0">法定产区，覆盖整个阿布鲁佐大区。要求使用至少85%蒙特普尔恰诺葡萄，产量大，风格广泛。</p></div>
<div class="region-item"><h4>Montepulciano d'Abruzzo Colline Teramane DOCG</h4><p style="color:#333;line-height:1.8;margin:0">最高级别的DOCG产区，位于Teramo省的丘陵地带。品质更高，陈年潜力更强。</p></div>
<div class="region-item"><h4>Rosso Piceno DOC / Rosso Conero DOC</h4><p style="color:#333;line-height:1.8;margin:0">相邻马尔凯大区的知名产区，同样使用蒙特普尔恰诺葡萄酿造。</p></div>
</section>
<h3>🍷 三、酿造工艺</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">
<div class="region-item"><h4>风格差异</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>年轻风格：</strong>不锈钢桶陈酿，果味新鲜，适合日常饮用<br/>• <strong>陈年风格：</strong>橡木桶6-12个月，增加香草和香料气息<br/>• <strong>珍藏级（Riserva）：</strong>至少陈酿2年，其中橡木桶至少1年</p></div>
</section>
<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<div class="region-item"><h4>典型特征</h4><p style="color:#333;line-height:1.8;margin:0">• <strong>颜色：</strong>深宝石红至石榴红<br/>• <strong>香气：</strong>黑樱桃、黑莓、紫罗兰、巧克力、烟草<br/>• <strong>酒体：</strong>中等到饱满<br/>• <strong>单宁：</strong>柔顺<br/>• <strong>余味：</strong>持久，带有淡淡的苦甜感</p></div>
</section>
<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">• <strong>面食：</strong>番茄肉酱面、千层面<br/>• <strong>烤肉：</strong>烤猪排、烤香肠、炭烤羊肉<br/>• <strong>奶酪：</strong>佩科里诺、卡乔卡瓦洛</p>
</section>
<section style="background:linear-gradient(135deg,#2d0a0a,#4a1a1a);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFC0C0;font-size:16px;line-height:1.9">蒙特普尔恰诺是意大利葡萄酒的<strong style="color:#FF6347">性价比之王</strong>，以亲民的价格提供优异的品质。</p>
</section>
<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`
});