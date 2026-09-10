const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjqwg6JGh6JCE6YWS5LiO55S15b2x77ya6ZO25bmV5LiK55qE5p2v5Lit5pmvPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🎬 葡萄酒与电影</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">银幕上的杯中景 | 当酒成为主角</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒与电影有着天然的契合——它象征着品味、浪漫、松弛与人生况味。许多经典电影用一杯酒讲尽了爱恨与岁月，也无意中改写了真实的葡萄酒市场。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 改变市场的电影</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">电影</th><th style="padding:10px;text-align:left;">年份</th><th style="padding:10px;text-align:left;">对葡萄酒的影响</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">《杯酒人生》Sideways</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">2004</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">主角贬低梅洛、盛赞黑皮诺，导致美国梅洛销量下滑、黑皮诺暴涨</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">《云中漫步》A Walk in the Clouds</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">1995</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">让纳帕谷成为爱情与美酒的代名词</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">《美食总动员》Ratatouille</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">2007</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">强化"配餐即生活"的法式葡萄酒哲学</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">《007》系列</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">多部</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">马丁尼"摇匀不要搅拌"成标志，香槟出境频繁</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">《了不起的盖茨比》</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">2013</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">复古奢华，香槟与爵士时代画上等号</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎭 电影里的"酒格"</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">不同电影用不同的酒塑造人物与氛围：文艺片偏爱黑皮诺的敏感，黑帮片钟情威士忌与红葡萄酒的力量，浪漫喜剧用起泡酒点缀欢乐，悬疑片则让一杯红酒成为气氛的注脚。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📽️ 葡萄酒主题必看片单</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 《杯酒人生》——葡萄酒爱好者的"圣经"，笑中带泪</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 《云中漫步》——纳帕谷的葡萄园爱情童话</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 《托斯卡纳艳阳下》——vineyard + 生活重建</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 《酒业风云》Bottle Shock——1976巴黎审判的真实故事</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 《红侏儒》/ 法国乡村酒农题材纪录片</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 观影配酒建议：看《杯酒人生》时开一瓶黑皮诺（致敬主角Miles）；看《云中漫步》配纳帕赤霞珠；看《007》当然要来杯马丁尼。让电影与杯中物互相注解，周末夜晚的顶级享受。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">电影把葡萄酒从"饮品"变成了"叙事"——它承载记忆、情绪与关系。下次举起酒杯时，或许你也会想起某部电影里的某个镜头：那一刻，酒不只是一杯酒，而是一段被放映过的人生。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🎬 葡萄酒与电影：银幕上的杯中景',
      author: '红酒顾问',
      digest: '从《杯酒人生》到《云中漫步》，电影如何把葡萄酒浪漫化？盘点那些因一部电影而爆红的酒，以及酒背后的故事。',
      content: gen(),
      coverImage: 'wine_movies_cover_ai.png',
      category: 'wine-culture',
      tags: ["电影", "杯酒人生", "葡萄酒", "银幕", "文化", "Sideways", "云中漫步"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_movies_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK wine_movies, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL wine_movies:', e.message);
    process.exit(1);
  }
}

main();
