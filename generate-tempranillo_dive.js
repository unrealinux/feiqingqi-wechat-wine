const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){const sharp=require("sharp");const svg=Buffer.from("PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg5Li56a2EIFRlbXByYW5pbGxv77ya6KW/54+t54mZPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueahOe6ouminOefpeW3sTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=","base64").toString();return sharp(Buffer.from(svg)).png().toBuffer().then(b=>b);}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 丹魄 Tempranillo</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">西班牙的红颜知己 | 里奥哈与杜埃罗河岸的灵魂</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">丹魄（Tempranillo）是西班牙最伟大的红葡萄品种，名字来源于西班牙语"temprano"（早），因为它比大多数西班牙红葡萄品种早熟。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">丹魄在西班牙不同地区有不同的名字：在里奥哈叫Tempranillo，在杜埃罗河岸叫Tinto Fino，在托罗叫Tinta de Toro，在拉曼查叫Cencibel。它们其实是同一品种的不同克隆适应了不同风土。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">里奥哈 Rioja DOCa</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最经典产区，橡木桶陈年风格闻名，传统派用美国桶（香草、椰子香）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">杜埃罗河岸 Ribera del Duero DO</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">更浓郁饱满，海拔高导致昼夜温差大，颜色更深单宁更强</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">托罗 Toro DO</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒体最饱满，酒精度高，风格粗犷有力</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">纳瓦拉 Navarra DO</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">风格比里奥哈更现代，果味更突出</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">拉曼查 La Mancha DO</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙最大产区，性价比极高，入门级丹魄</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍒 果香：樱桃、黑莓、李子——新鲜年轻时有活力</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 陈年香：皮革、雪松、烟草、雪茄盒——里奥哈陈年标志</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 桶香：香草、椰子、丁香——传统美国桶特征（里奥哈）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍫 发展香：可可粉、咖啡、焦糖——长时间桶陈的结果</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌍 泥土：干树叶、泥土、矿物感</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥃 里奥哈的陈年等级</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">里奥哈有严格的陈年等级制度，这是选择丹魄的重要参考：</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">等级</th><th style="padding:10px;text-align:left;">总陈年</th><th style="padding:10px;text-align:left;">桶陈</th><th style="padding:10px;text-align:left;">瓶陈</th><th style="padding:10px;text-align:left;">风格</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Joven 年轻</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><1年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无/极少</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">—</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味新鲜，适合即饮</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Crianza 陈酿</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥2年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥1年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥1年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味+桶味平衡</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Reserva 珍藏</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥3年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥1年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥2年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">桶味主导，单宁柔化</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Gran Reserva 特级珍藏</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥5年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥2年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">≥3年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">三类香气主导，极为复杂</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥩 烤羊排、烤牛排——西班牙烧烤的经典搭配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🐖 伊比利亚火腿（Jamón Ibérico）——绝配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥘 西班牙海鲜饭（Paella）——尤其是含肉类版本</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 陈年Manchego奶酪</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐搭配：酱牛肉、烤鸭、红烧排骨、腊味</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：从里奥哈Crianza开始（¥100-200），体验美国桶带来的香草椰子味；然后尝试杜埃罗河岸的Reserva（¥200-400），感受更浓郁饱满的风格；最后挑战Gran Reserva（¥400+），领略顶级丹魄的复杂魅力。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 推荐入门酒款</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 La Rioja Alta Viña Alberdi Reserva — 里奥哈经典名庄</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 Muga Crianza — 风格传统价格亲民</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 Marqués de Riscal Reserva — 老牌名庄</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 Vega Sicilia Valbuena 5° — 西班牙酒王入门款</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 Protos Crianza Ribera del Duero — 杜埃罗入门标杆</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">丹魄是那种"越喝越有滋味"的酒。年轻时活泼果味，陈年后优雅复杂——一瓶优质里奥哈Gran Reserva的细腻与层次感，足以让任何葡萄酒爱好者为之倾倒。Tomás: no te olvides de España. Tempranillo es el alma de nuestra tierra.</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 丹魄 Tempranillo：西班牙的红颜知己',
      author: '红酒顾问',
      digest: '里奥哈的灵魂品种，西班牙最伟大的红葡萄。丹魄的皮革和樱桃香气令人着迷，陈年潜力不输波尔多。从里奥哈到杜埃罗河岸。',
      content: gen(),
      coverImage: 'tempranillo_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["丹魄", "Tempranillo", "里奥哈", "西班牙", "杜埃罗河岸", "红葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'tempranillo_dive_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ tempranillo_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ tempranillo_dive:', e.message);
    process.exit(1);
  }
}

main();
