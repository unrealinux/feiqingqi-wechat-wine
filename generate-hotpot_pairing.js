const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjbIg54Gr6ZSF6YWN6YWS5oyH5Y2X77ya5rK46IW+5Lit55qE5ZGz6KeJ6Im65pyvPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍲 火锅配酒指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">沸腾中的味觉艺术 | 麻辣清汤番茄菌菇，一桌火锅三种酒</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">没有什么比一群人围坐吃火锅更有人间烟火气了。火锅的社交属性和食材多样性，让它成为葡萄酒搭配的"终极考场"——既要考虑汤底的味道，又要应对各类涮菜，还要兼顾同桌人的不同口味。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">好消息是：火锅其实没有想象中那么难配酒。掌握了汤底的逻辑，一桌火锅最多只需要三款酒就能搞定。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔥 不同汤底的搭配策略</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">汤底</th><th style="padding:10px;text-align:left;">风味特征</th><th style="padding:10px;text-align:left;">推荐酒</th><th style="padding:10px;text-align:left;">理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">麻辣红油</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">辣、麻、油、烫</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">半干雷司令/琼瑶浆</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜味中和辣，芳香呼应花椒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">清汤/骨汤</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">鲜美、清淡</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟/夏布利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气泡解腻，矿物感提鲜</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">番茄汤</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸甜、浓郁</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">黑皮诺/佳美</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味呼应番茄酸甜，低单宁</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">菌汤</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">醇厚、 earthy</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">陈年霞多丽</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">饱满酒体匹配菌菇风味</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">冬阴功</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸辣、香料</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">灰皮诺/绿维特利纳</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">高酸度匹配酸辣，中性不抢戏</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">咖喱汤</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浓郁、香料</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">琼瑶浆/干型雷司令</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">花香与香料呼应，半干平衡辣</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥩 食材搭配细化</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">牛羊肉卷 → 轻盈红葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">如果涮的是清汤锅，羊肉卷的鲜美需要一款果味活泼的红酒来搭配。推荐博若莱特级村（如Morgon、Fleurie），或者新西兰黑皮诺。如果是麻辣锅，则回归半干雷司令。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">毛肚/黄喉/百叶 → 起泡酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这些口感脆爽的食材最佳的搭配永远是起泡酒。香槟或Cava的细腻气泡能清洁口腔，为下一口做好准备。高酸度搭配香油蒜泥蘸料尤其精彩。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">海鲜类（虾滑、鱼片、鲍鱼）→ 白葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">清淡的汤底中涮煮的海鲜，推荐搭配夏布利或意大利Vermentino。清凉的口感与热腾腾的火锅形成鲜明对比，矿物感提升海鲜的鲜甜。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">蔬菜/豆腐类 → 灰皮诺/长相思</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">蔬菜和豆腐本身味道较淡，需要一款不喧宾夺主的白葡萄酒。意大利上阿迪杰的灰皮诺或卢瓦尔河的长相思是绝佳选择。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥂 火锅配酒的"三部曲"策略</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">如果你想在一顿火锅中体验最佳搭配，推荐以下"三部曲"策略：</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥂 开场：一瓶香槟或Spain Cava，搭配清汤锅涮海鲜、毛肚等脆爽食材</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 中场：一瓶黑皮诺（红）或一瓶雷司令（白），视同桌人的口味选择</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 收尾：如果还有麻辣锅底，上一瓶半干雷司令或冰酒，给辣味一个甜蜜的句号</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 火锅配酒避坑：不要带高单宁、高酒精度的红酒（如赤霞珠、西拉、巴罗洛）到火锅桌上。辣味+酒精=灼烧感，辣味+单宁=苦涩味，双重暴击会让你后悔的。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🧊 温度很重要</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">火锅本身就是滚烫的，所以配酒的侍酒温度应该比平时略低：白葡萄酒和起泡酒建议6-8°C（比常规低1-2度），红葡萄酒建议12-14°C（比常规低2-3度）。低温可以更好地对抗火锅的热度，保持酒的清爽感。</p>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">火锅配酒的核心法则是"以冷制热，以甜克辣，以气解腻"。下次朋友约火锅，别只带啤酒了——带上一瓶半干雷司令，保证成为全桌最懂酒的人。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍲 火锅配酒指南：沸腾中的味觉艺术',
      author: '红酒顾问',
      digest: '火锅配什么酒？清汤锅、麻辣锅、番茄锅、菌汤锅各有最佳搭档。从羊肉卷到毛肚，教你一桌火锅配出三种酒。',
      content: gen(),
      coverImage: 'hotpot_pairing_cover_ai.png',
      category: 'wine-food',
      tags: ["火锅", "配酒", "清汤", "麻辣", "番茄锅", "雷司令", "香槟", "中餐配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'hotpot_pairing_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const f = new FormData();
    f.append('media', cb, {filename: 'cover.png', contentType: 'image/png'});
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
    console.log('✅ hotpot_pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ hotpot_pairing:', e.message);
    process.exit(1);
  }
}

main();
