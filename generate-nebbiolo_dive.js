const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg5YaF5q+U5aWl572XIE5lYmJpb2xv77ya5oSP5aSn5Yip6YWSPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueOi+eahOWCsumqqOaflOaDhTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 内比奥罗 Nebbiolo</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">意大利酒王的傲骨柔情 | 巴罗洛与巴巴莱斯科的灵魂</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">内比奥罗（Nebbiolo）被称为意大利最伟大的红葡萄品种。它的名字来源于意大利语"nebbia"（雾）——因为收获季节的皮埃蒙特山谷常常被晨雾笼罩，也有人说是因为葡萄表面的白雾状果粉。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这个品种有着极高的辨识度：年轻时单宁凌厉、酸度锐利、香气封闭，仿佛一个难以接近的傲娇贵族；但经过时间的陈酿，它会蜕变为拥有丝绒质感、复杂香气和无穷层次感的伟大酒款。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">酒款</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">巴罗洛 Barolo DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Barolo</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">"酒王"：单宁强劲，需陈年5年以上，花香、焦油、玫瑰、皮革</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">巴巴莱斯科 Barbaresco DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Barbaresco</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">"酒后"：比Barolo更优雅柔顺，陈年要求3年以上</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">朗格 Nebbiolo Langhe DOC</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Langhe Nebbiolo</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">入门级：年轻易饮，适合日常品饮</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">罗埃罗 Roero DOCG</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Roero</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">沙质土壤，风格更轻盈芳香</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">瓦尔泰利纳 Valtellina</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Valtellina Superiore</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔卑斯山麓，风格冷峻优雅</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🌸 花香：干玫瑰花瓣、紫罗兰——这是内比奥罗的标志性香气</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍒 果香：酸樱桃、覆盆子、草莓、李子</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 陈年香：焦油、玫瑰、皮革、松露、烟草、甘草</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍄 泥土味：森林地表、蘑菇、干树叶</li></ul>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">品鉴内比奥罗的独特体验在于"变化"——一瓶刚开的巴罗洛可能香气内敛、口感紧涩，但醒酒2-3小时后，它会逐渐释放出迷人的花香和果香，单宁也从坚硬变为柔顺。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 风格定位</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">内比奥罗属于"高单宁、高酸度、中酒体"的红葡萄酒。它的颜色在年轻时是石榴红偏橙色（而非深紫色），这是它的品种特征而非老化的标志。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">巴罗洛需要至少38个月的陈年（其中18个月在桶中），珍藏级（Riserva）需要62个月。巴巴莱斯科需要26个月（9个月在桶中），珍藏级需要50个月。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥩 炖牛肉、红酒炖鸡（意大利经典搭配：Barolo braised beef）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍝 松露意面（Tajarin con tartufo）——皮埃蒙特经典</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 陈年奶酪（Parmigiano-Reggiano、Grana Padano）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐搭配：红烧肉、焖牛腩、烤鸭</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：不必一上来就挑战顶级巴罗洛。从Langhe Nebbiolo开始（¥150-300），感受品种的基础特征；然后尝试巴巴莱斯科（¥300-600），体验优雅的一面；最后再挑战巴罗洛（¥400-上不封顶）。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 推荐入门酒款</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Gaja "Promis" Langhe Nebbiolo — 名家入门款</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Elio Altare "Larigi" Langhe Nebbiolo — 现代派风格</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Vietti "Perbacco" Langhe Nebbiolo — 性价比之王</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Produttori del Barbaresco Barbaresco — 合作社出品，性价比极高</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Renato Ratti Marcenasco Barolo — 传统派入门</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">内比奥罗是一瓶"需要时间"的酒。正如意大利人所说："如果要喝快乐，喝巴罗洛；如果要喝懂的，也要喝巴罗洛。"它让无数葡萄酒爱好者又爱又恨，但一旦尝到了巅峰状态的巴罗洛，你就再也无法回头了。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 内比奥罗 Nebbiolo：意大利酒王的傲骨柔情',
      author: '红酒顾问',
      digest: '巴罗洛和巴巴莱斯科的灵魂品种。为什么内比奥罗被称为"雾葡萄"？单宁如何从凌厉变为丝滑？一篇读懂意大利酒王。',
      content: gen(),
      coverImage: 'nebbiolo_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["内比奥罗", "Nebbiolo", "巴罗洛", "巴巴莱斯科", "意大利", "皮埃蒙特", "红葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'nebbiolo_dive_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ nebbiolo_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ nebbiolo_dive:', e.message);
    process.exit(1);
  }
}

main();
