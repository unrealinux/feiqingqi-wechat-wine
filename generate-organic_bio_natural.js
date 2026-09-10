const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjL8g5pyJ5py644CB55Sf54mp5Yqo5Yqb5LiO6Ieq54S26YWS77ya5LiJ6ICF5Yiw5bqV5beu5ZyoPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWTqu+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🌿 有机、生物动力与自然酒</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">三者到底差在哪？ | 从田间到酒窖的三种哲学</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">走进葡萄酒专卖店，你一定见过"有机葡萄酒""生物动力法葡萄酒""自然酒"这些标签。它们听起来都很"绿色健康"，但实际上是三个完全不同的概念，覆盖从葡萄种植到酿造的不同环节。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🟢 有机葡萄酒（Organic）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">有机关注"种植环节"：禁止使用人工合成农药、化肥、除草剂，改用天然堆肥和生物防治。欧盟、美国、中国都有有机认证。注意：有机认证只管种植，对酿造（是否加硫）没有严格要求。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌙 生物动力法（Biodynamic）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">生物动力法由奥地利哲学家鲁道夫·斯坦纳在1924年提出，是有机的"升级+玄学"版。除了有机要求外，还强调：</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🌟 把葡萄园视为一个完整"有机生命体"，自给自足</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌙 按日月星辰的宇宙节律安排耕作、采摘（生物动力日历）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🦌 使用特殊的"牛角粪制剂"（Horn Manure）等九种制剂</li><li style="margin:6px 0;color:#333;line-height:1.7;">📜 德米特（Demeter）是最权威的生物动力认证</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍇 自然酒（Natural Wine）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">自然酒关注"酿造环节"：minimal intervention（最少干预）。它通常要求有机种植，但核心在于酿造时不加酵母、不加糖、极少或不加硫、不滤过。结果往往风格野性、不稳定、有"农艺味"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🆚 三者对比</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">维度</th><th style="padding:10px;text-align:left;">有机</th><th style="padding:10px;text-align:left;">生物动力</th><th style="padding:10px;text-align:left;">自然酒</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">关注环节</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">种植</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">种植+理念</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酿造</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">认证</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">有（各国）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Demeter等</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无统一认证</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">化学农药</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">禁止</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">禁止</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">禁止（通常有机）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">添加硫</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">允许</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">允许（少）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极少/不添加</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">加酵母</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">允许</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">允许</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">禁止（野生酵母）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">风格</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">接近常规</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">接近常规</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">野性、不稳定</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❓ 谁更健康？谁更好喝？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">健康角度：三者都减少化学残留，但"自然酒"因不加硫，对亚硫酸盐敏感者反而可能更友好（不过也可能是雷区）。好喝角度：有机和生物动力法酒通常更稳定、更易饮；自然酒则是"高风险高回报"，可能惊艳也可能"翻车"。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 给新手的建议：想尝试绿色葡萄酒，从"有机"入门最稳妥；想体验哲学与风土，选"生物动力法"名庄（如勃艮第乐桦Leroy）；想追求个性与冒险，再尝试"自然酒"，并选择有口碑的自然酒酒商降低踩雷率。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这三种理念代表了葡萄酒从"工业品"回归"农产品"的趋势。无论你认同哪种哲学，背后都是酿酒师对土地和自然的尊重——这本身就是一杯好酒的重要底色。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🌿 有机、生物动力与自然酒：三者到底差在哪？',
      author: '红酒顾问',
      digest: '酒标上的"有机""生物动力法""自然酒"让人眼花缭乱。它们是一回事吗？谁更健康？谁更好喝？一篇厘清三大概念。',
      content: gen(),
      coverImage: 'organic_bio_natural_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["有机", "生物动力法", "自然酒", "Biodynamic", "可持续", "健康葡萄酒", "认证"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'organic_bio_natural_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK organic_bio_natural, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL organic_bio_natural:', e.message);
    process.exit(1);
  }
}

main();
