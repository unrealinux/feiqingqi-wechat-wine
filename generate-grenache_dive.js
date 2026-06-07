const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg5q2M5rW35aicIEdyZW5hY2hl77ya6Ziz5YWJ5LiL55qE54OtPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuaDheiInuiAhTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 歌海娜 Grenache</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">阳光下的热情舞者 | GSM混酿的灵魂</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">歌海娜（Grenache）是世界上种植最广泛的红葡萄品种之一。它喜欢炎热干燥的气候，生命力顽强，酿出的酒往往果味充沛、酒精度高、单宁柔和。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">歌海娜很少单独出现——它通常是混酿中的"甜蜜担当"。在著名的GSM混酿（歌海娜-西拉-慕合怀特）中，歌海娜贡献了果味和酒精感，西拉提供颜色和香料味，慕合怀特则带来单宁结构和深度。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">国家</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">南罗讷 Southern Rhône</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">GSM混酿为主，教皇新堡的旗舰品种</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">普里奥拉托 Priorat</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙最顶级的歌海娜产区，老藤单酿卓越</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">纳瓦拉 Navarra</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">轻盈果味的歌海娜</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">萨丁岛 Sardinia</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">当地称Cannonau，风格饱满粗犷</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">麦克拉伦谷 McLaren Vale</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">澳洲</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">GSM混酿的澳洲典范</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍓 果香：草莓、覆盆子、红樱桃——温暖甜美的果味是歌海娜的标志</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍊 特殊：橙皮、干无花果——老藤歌海娜的特色</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 香料：白胡椒、甘草、普罗旺斯香草</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍫 陈年：焦糖、太妃糖、皮革</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 风格定位</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">歌海娜的特点是：酒精度高（通常14-15.5%）、单宁柔和、酸度中低、酒体饱满。它的颜色偏浅（由于单宁含量低），但风味浓度极高。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">老藤歌海娜（尤其是普里奥拉托的Licorella板岩上种植的）可以酿出极为浓缩、复杂的酒款，兼具力量与优雅，是西班牙最顶级的葡萄酒之一。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥘 普罗旺斯炖菜（Ratatouille）——与歌海娜的草本风味完美呼应</li><li style="margin:6px 0;color:#333;line-height:1.7;">🐑 烤羊排、烤羊肉串——甜美的果味与羊肉相得益彰</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍝 地中海风味的番茄意面</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 Comté、Gouda等硬质奶酪</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐搭配：孜然羊肉、红烧牛尾、五香卤味</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：从南罗讷的Côtes du Rhône入门（¥80-150），感受GSM混酿的基础风格；进阶尝试教皇新堡（Châteauneuf-du-Pape，¥300-1000），体验歌海娜的巅峰；如果追求极致，试试普里奥拉托的老藤歌海娜。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">歌海娜是那种让人"喝起来开心"的酒。它没有赤霞珠的严肃、没有黑皮诺的娇贵——它就像南法阳光下的热情舞者，自由、奔放、甜美。不论是入门新手还是资深爱好者，歌海娜总能在某个时刻打动你。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 歌海娜 Grenache：阳光下的热情舞者',
      author: '红酒顾问',
      digest: '歌海娜是世界上种植最广的红葡萄之一。从南罗讷到普里奥拉托，从GSM混酿到单一品种，它的甜美感人至深。',
      content: gen(),
      coverImage: 'grenache_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["歌海娜", "Grenache", "南罗讷", "教皇新堡", "普里奥拉托", "GSM", "红葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'grenache_dive_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ grenache_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ grenache_dive:', e.message);
    process.exit(1);
  }
}

main();
