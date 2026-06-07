const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg5qGR5aiH57u05aGeIFNhbmdpb3Zlc2XvvJrmhI/lpKc8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZGRkIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5Yip55qE6aqE5YKy5LmL5YWJPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 桑娇维塞 Sangiovese</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">意大利的骄傲之光 | 从基安蒂到布鲁奈罗的托斯卡纳灵魂</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">桑娇维塞（Sangiovese）是意大利种植面积最广的红葡萄品种，也是托斯卡纳产区无可争议的主角。它的名字源自拉丁语"sanguis Jovis"——"朱庇特之血"。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">桑娇维塞是一个基因不稳定的品种，存在数十个克隆变种。最著名的是Sangiovese Grosso（用于布鲁奈罗）和Sangiovese Piccolo（用于基安蒂）。这个特点使得它可以在不同的风土中展现出截然不同的风貌。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区与等级</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">等级</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">基安蒂 Chianti DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Chianti / Chianti Classico</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸樱桃、紫罗兰，Classico更浓郁</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">基安蒂经典 Chianti Classico DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Gran Selezione/Riserva</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最高品质基安蒂，陈年潜力强</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">布鲁奈罗 Brunello di Montalcino DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Brunello / Riserva</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浓郁饱满，需陈年5年以上</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">蒙塔奇诺 Rosso di Montalcino DOC</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Rosso di Montalcino</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">布鲁奈罗的年轻版，适合早饮</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">蒙特普尔恰诺贵族酒 Vino Nobile di Montepulciano DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Nobile / Riserva</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">介于基安蒂和布鲁奈罗之间</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">超级托斯卡纳 Super Tuscan IGT</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Tignanello/Sassicaia等</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">国际品种混酿，风格现代</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍒 标志性：酸樱桃——这是桑娇维塞最容易被辨认的特征</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌸 花香：紫罗兰、鸢尾花</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 草本：番茄叶、干草药、牛至</li><li style="margin:6px 0;color:#333;line-height:1.7;">🪵 陈年：烟草、皮革、雪松、焦油</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌍 泥土：托斯卡纳土壤特有的碎石和矿物感</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 品鉴要点</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">桑娇维塞的核心特征是酸度高、单宁中等到高、酒体中到饱满。年轻的基安蒂通常充满活力，果味新鲜；而陈年的布鲁奈罗则展现出层次丰富的第三类香气。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">品质最好的桑娇维塞往往带有一丝"咸鲜感"（savory），这种独特的口感让它与食物搭配时格外出色。这也是为什么意大利人几乎餐餐离不开基安蒂。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍝 番茄酱意面——经典的番茄酱+桑娇维塞是天生一对</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍕 披萨——尤其是玛格丽特披萨</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥩 佛罗伦萨T骨牛排（Bistecca alla Fiorentina）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 托斯卡纳 Pecorino奶酪</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐搭配：番茄牛腩、意式肉酱面、烤羊排</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 推荐入门酒款</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Felsina Chianti Classico Rancia Riserva — 经典标杆</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Castello di Monsanto Chianti Classico Riserva — 传统风格</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Altesino Brunello di Montalcino — 布鲁奈罗入门</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Argiano Rosso di Montalcino — 性价比之选</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Avignonesi Vino Nobile di Montepulciano — 贵族酒的典范</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：从Chianti Classico开始（¥150-300），感受桑娇维塞的酸樱桃特色；进阶尝试Rosso di Montalcino（¥200-400）；终极挑战是陈年Brunello（¥400-上不封顶）。记住：桑娇维塞永远需要配餐，单独喝会感觉酸涩。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">如果说勃艮第是黑皮诺的天下，那托斯卡纳就是桑娇维塞的王国。没有桑娇维塞，就没有基安蒂、布鲁奈罗、蒙特普尔恰诺贵族酒——意大利葡萄酒的半壁江山将黯然失色。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 桑娇维塞 Sangiovese：意大利的骄傲之光',
      author: '红酒顾问',
      digest: '从基安蒂到布鲁奈罗，桑娇维塞是意大利种植最广的红葡萄。酸樱桃和大地气息是它的标志，托斯卡纳的阳光是它的灵魂。',
      content: gen(),
      coverImage: 'sangiovese_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["桑娇维塞", "Sangiovese", "基安蒂", "布鲁奈罗", "意大利", "托斯卡纳", "红葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'sangiovese_dive_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ sangiovese_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ sangiovese_dive:', e.message);
    process.exit(1);
  }
}

main();
