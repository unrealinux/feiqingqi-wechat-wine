const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjLMg6ICB6Jek5LmL6LCc77ya5Li65LuA5LmI6ICB6Jek6JGh6JCE6YWS5pu054+N6LS177yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🌳 老藤之谜</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">为什么老藤葡萄酒更珍贵？ | 时间酿造的价值</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">在葡萄酒酒标上，你常会看到"Old Vine"（老藤）、"Vielles Vignes"（老葡萄藤）、"Vieilles Vignes"等字样。它们不是法定等级，却自带一种光环。但老藤真的更好喝吗？</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📏 多老才算"老藤"？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这是一个没有统一标准的问题。一般来说：25-30年可称为老藤，50年以上是公认的老藤，100年以上的"百年老藤"则极为稀有。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">南非的"老藤项目"（Old Vine Project）提出35年作为认证门槛，是目前较权威的民间标准。但法律层面，各国都没有强制规定，所以"老藤"字样更多靠酒庄自律。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌱 老藤为什么珍贵？</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">特征</th><th style="padding:10px;text-align:left;">年轻藤（<10年）</th><th style="padding:10px;text-align:left;">老藤（>50年）</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">根系深度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浅，表层吸收</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">深达数米，吸收矿物</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">产量</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">高（2-3倍）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低（浓缩风味）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">风味</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">直接、果味为主</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">复杂、集中、矿物感</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">稳定性</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">易受年份影响</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">更稳，抗旱抗灾</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">单宁/结构</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">较轻</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">更紧实有层次</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🧬 老藤的"浓缩效应"</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">老藤产量低的原因是其活力下降、光合作用产物少。但正因如此，有限的养分集中输送给少量果实，风味物质和糖分高度浓缩。同时，深根系让老藤能触及年轻藤够不到的地下水层和矿物质，带来独特的"风土印记"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌍 著名老藤产区</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇺 澳大利亚巴罗萨谷：拥有世界上最古老的西拉老藤（1860年代种）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇿🇦 南非老藤项目：白诗南、神索等百年老藤</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 西班牙普里奥拉托：百年歌海娜老藤，成就顶级酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 法国朗格多克：很多被遗忘的古老佳丽酿藤</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇺🇸 加州老藤仙粉黛：19世纪末的遗产</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⚠️ 老藤不等于绝对好</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">需要澄清的是：老藤是一个加分项，而非品质保证。一棵老藤如果管理不当、藤龄虽老但活力紊乱，酒质也可能平庸。真正的好酒是老藤+好风土+好酿酒师的三重叠加。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 选购建议：看到"Old Vine"标签不必盲目加价，先看产区——巴罗萨老藤西拉、普里奥拉托老藤歌海娜、南非老藤白诗南，这些才是公认的高性价比老藤之选。年轻产区的"老藤"营销噱头需警惕。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">老藤葡萄酒喝的是时间。每一瓶都凝聚着几十年风风雨雨里葡萄藤与土地的对话。当你品尝老藤的复杂层次时，你其实是在品尝一段被封存在酒液里的岁月。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🌳 老藤之谜：为什么老藤葡萄酒更珍贵？',
      author: '红酒顾问',
      digest: '"老藤"二字为何自带光环？根系更深、产量更低、风味更浓缩——但老藤真的更好喝吗？老藤葡萄酒完全指南。',
      content: gen(),
      coverImage: 'old_vine_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["老藤", "Old Vine", "低产量", "根系", "风土", "珍贵葡萄酒", "葡萄树龄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'old_vine_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const f = new FormData();
    f.append('media', png, {filename: 'cover.png', contentType: 'image/png'});
    const m = await axios.post('https://api.weixin.qq.com/cgi-bin/material/add_material?access_token='+a+'&type=image', f, {headers: f.getHeaders()});
    const d = await axios.post('https://api.weixin.qq.com/cgi-bin/draft/add?access_token='+a, {
      articles: [{
        title: art.title,
        thumb_media_id: m.data.media_id,
        author: art.author,
        digest: art.digest,
        content: art.content,
        show_cover_pic: 1,
        need_open_comment: 0,
        only_fans_can_comment: 0
      }]
    });
    console.log('OK old_vine, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL old_vine:', e.message);
    process.exit(1);
  }
}

main();
