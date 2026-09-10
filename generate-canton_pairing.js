const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfppAg57Kk6I+c6YWN6YWS5oyH5Y2X77ya6Iez6bKc6Iez566A55qE5a6M576O5pCt6YWNPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🦐 粤菜配酒指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">至鲜至简的完美搭配 | 认识粤菜与葡萄酒的微妙平衡</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">粤菜讲究"清、鲜、嫩、滑、爽"，以保留食材原味为最高准则。与川菜的浓烈不同，粤菜的精髓在于"鲜"——这恰恰是葡萄酒搭配中最需要呵护的味觉元素。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">搭配不当，酒的橡木味会盖过鱼鲜；酸度太高，会破坏虾的甜嫩；单宁太重，会让白切鸡变得苦涩。粤菜配酒的关键是：温柔的才是最好的。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥟 早茶/点心配酒</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">早茶是粤菜最亲民的形式。虾饺、烧卖、肠粉、凤爪——每一样都精致而鲜美。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">点心</th><th style="padding:10px;text-align:left;">推荐酒</th><th style="padding:10px;text-align:left;">理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">虾饺</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利Prosecco起泡酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">细腻气泡不抢虾味，酸度刚好</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">烧卖/干蒸</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">夏布利（Chablis）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">矿物感与猪肉鲜味呼应</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">肠粉</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">长相思（Sauvignon Blanc）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">清爽草本香搭配酱油味</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">凤爪</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">德国半干雷司令</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">微甜解腻，百搭之选</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">叉烧包</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">博若莱新酒（Beaujolais）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味轻盈，与甜叉烧相得益彰</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">萝卜糕</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">灰皮诺（Pinot Grigio）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中性干净，不干扰食材原味</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🐟 海鲜类搭配</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">清蒸鱼</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">粤菜的灵魂菜式，讲究鱼肉"一挞就开"的完美火候。葱丝姜丝铺面，热油淋上，激发出最纯粹的鲜。推荐夏布利一级园，冷凉气候赋予的高酸度能像柠檬汁一样提鲜，而独特的矿物感与海鱼鲜味浑然天成。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">白灼虾/白灼菜心</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">白灼是最极简的烹饪手法，对食材新鲜度要求最高。推荐新西兰马尔堡长相思，其标志性的百香果和青草香气不会掩盖虾的甜美，高酸度用来蘸料也恰到好处。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">避风塘炒蟹</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">蒜香酥脆的炒蟹是粤菜中的"重口味"。推荐教皇新堡白葡萄酒（Chateauneuf-du-Pape Blanc），饱满的酒体可以撑住蒜酥的冲击，核果香气与蟹肉相得益彰。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🐔 烧腊/白切类搭配</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">白切鸡</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">白切鸡讲求鸡味纯粹，皮爽肉滑，蘸姜葱酱食用。推荐勃艮第黑皮诺，优雅的红果香气不会压过鸡味，柔和的单宁与滑嫩的肉质形成美妙对比。注意：不要选果味太浓或桶味太重的新世界黑皮诺。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">烧鹅/叉烧</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">烧鹅皮脆肉嫩，油脂丰富；叉烧甜蜜焦香。推荐半干型德国雷司令（Spatlese），微甜的口感与叉烧的蜜糖味完美衔接，酸度又恰到好处地切开烧鹅的油腻。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍜 老火靓汤 & 煲仔菜</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">广东人不可一日无汤。老火靓汤推荐搭配陈年里奥哈白（Rioja Blanco Crianza），轻微的氧化风味与汤的醇厚感匹配。煲仔菜如啫啫煲、煲仔饭，则推荐南罗讷的GSM混酿，香料味与煲仔的锅气香相得益彰。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 重要原则：粤菜配酒的核心是"不抢风头"。一款好的配酒不是最出彩的那一个，而是让菜更好吃的那一个。中性、清爽、优雅——这是粤菜配酒的三个关键词。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 粤菜配酒快速指南</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍾 香槟/起泡酒 → 万能开场，搭配虾饺、烧卖、炸春卷</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥂 夏布利 → 清蒸鱼、白灼海鲜、生蚝</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 德国雷司令 → 烧腊、叉烧、甜豉油类菜肴</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 黑皮诺 → 白切鸡、烧鹅、乳猪</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥂 长相思 → 白灼虾、清炒时蔬、海鲜</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 博若莱 → 叉烧包、烧肉、点心类</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">粤菜配酒的哲学与粤菜本身一脉相承——大道至简。不需要昂贵的名庄酒，不需要复杂的陈年风味，一款清新、精准、平衡的葡萄酒，就是粤菜最好的搭档。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🦐 粤菜配酒指南：至鲜至简的完美搭配',
      author: '红酒顾问',
      digest: '白切鸡配什么酒？清蒸鱼的最佳搭档是谁？虾饺烧卖又该如何搭配？粤菜讲究"鲜"字，选对酒才能相得益彰。',
      content: gen(),
      coverImage: 'canton_pairing_cover_ai.png',
      category: 'wine-food',
      tags: ["粤菜", "配酒", "清蒸", "海鲜", "白切鸡", "香槟", "中餐配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'canton_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ canton_pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ canton_pairing:', e.message);
    process.exit(1);
  }
}

main();
