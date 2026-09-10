const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfja8g55Sc6YWS5Zu+6Ym077ya6LS16IWQ44CB5Yaw6YWS5LiO5rOi54m555qE5aSp5aCC5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍯 甜酒图鉴</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">贵腐、冰酒与波特的天堂指南 | 甜不是原罪</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">很多初学者误以为甜葡萄酒是"低端糖水"，这其实是大错特错。世界上最贵、最稀有、最值得收藏的葡萄酒中，甜酒占了相当比例。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">甜葡萄酒的甜来自"浓缩的糖分"——通过不同方式让葡萄积累远超发酵所需的糖，再在酵母无法全部转化时停止发酵，保留残糖。三种主流工艺各具魅力。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍄 贵腐甜酒（Noble Rot）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">贵腐菌（Botrytis cinerea）是一种真菌，在特定的晨雾+午后阳光环境下感染葡萄，刺破果皮让水分蒸发，浓缩糖分和风味。这种"被真菌宠幸"的葡萄酿出的酒带有蜂蜜、杏脯、柑橘酱的复杂香气。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">代表酒款</th><th style="padding:10px;text-align:left;">产地</th><th style="padding:10px;text-align:left;">特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">苏玳 Sauternes</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国波尔多</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">贵腐之王，贵腐菌+赛美蓉/长相思</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">托卡伊 Tokaji Aszú</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">匈牙利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">"王者之酒"，贵腐+福尔民特</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">逐粒精选 TBA</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">德国/奥地利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Beerenauslese级别，极稀有</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">贵腐甜白</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">世界各国</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">如法国阿尔萨斯、卢瓦尔</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❄️ 冰酒（Ice Wine / Eiswein）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">冰酒要求葡萄在-7°C以下的自然冰冻状态下采摘和压榨，冰晶留下、浓缩的果汁流出，得到极高糖度和酸度的酒液。加拿大、德国、奥地利是主要产区。</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇨🇦 加拿大冰酒：全球最大产量，威代尔（Vidal）为主</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇩🇪 德国/奥地利 Eiswein：雷司令冰酒，高贵优雅</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌡️ 关键：必须是自然冰冻，人工冷冻不合法（欧盟）</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥃 加强甜酒（Fortified）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">在发酵过程中加入葡萄蒸馏酒（白兰地）中止发酵，既保留糖分又提高酒精度。波特、雪莉、马德拉是三大加强酒，其中甜型波特最适合作为甜酒饮用。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">类型</th><th style="padding:10px;text-align:left;">产地</th><th style="padding:10px;text-align:left;">风格</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">红宝石/晚装瓶波特</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味年轻、甜美易饮</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">茶色波特 Tawny</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">氧化风格、坚果焦糖</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">年份波特 Vintage</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">顶级收藏、单宁强劲</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">PX雪莉</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极甜、葡萄干蜜饯味</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 甜酒配餐</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍰 蓝纹奶酪 + 贵腐甜酒 = 经典"咸甜配"</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥧 水果挞、柠檬派 + 冰酒 = 清新收尾</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍫 黑巧克力 + 年份波特 = 力量对力量</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥧 焦糖布丁 + 茶色波特 = 温暖满足</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌶️ 川湘辣菜 + 半甜酒 = 甜解辣</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 甜酒侍酒：温度很低（6-8°C），用量杯（50ml左右），用小甜酒杯。甜酒糖分高易腻，少量慢饮才是正道。贵腐和冰酒开后冷藏可保存数天，波特因高酒精更易保存。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">甜酒是葡萄酒金字塔尖的明珠。它不代表"简单"或"低端"，而是代表了酿酒师与自然博弈的最高技艺——把"腐烂""冰冻""中断"这些看似负面的元素，转化为杯中极致的美味。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍯 甜酒图鉴：贵腐、冰酒与波特的天堂指南',
      author: '红酒顾问',
      digest: '甜葡萄酒不是"糖水"！贵腐菌、冰葡萄、加强酒精——三种截然不同的甜，三种截然不同的美。甜酒爱好者必读。',
      content: gen(),
      coverImage: 'sweet_wines_cover_ai.png',
      category: 'wine-style',
      tags: ["甜酒", "贵腐", "冰酒", "波特", "托卡伊", "迟摘", "甜型葡萄酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'sweet_wines_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK sweet_wines, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL sweet_wines:', e.message);
    process.exit(1);
  }
}

main();
