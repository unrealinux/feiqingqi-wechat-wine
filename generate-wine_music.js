const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjrUg6JGh6JCE6YWS5LiO6Z+z5LmQ77ya5ZCs5LuA5LmI5bCx5Zad5LuA5LmIPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🎵 葡萄酒与音乐</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">听什么就喝什么 | 声音如何"调味"杯中酒</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">你相信吗？同一杯酒，配不同的背景音乐，喝起来竟然会不一样。这不是玄学——多项感官心理学研究证实：音乐能显著影响人对葡萄酒香气、单宁、酒体的感知。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔬 科学怎么说</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">英国心理学家 Charles Spence 等的研究发现：高音调、轻快的音乐让人觉得酒更轻盈、果味更突出；低沉、厚重的音乐则让人觉得酒体更饱满、单宁更强。音乐成了"看不见的调味料"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎼 音乐 × 葡萄酒 搭配表</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">音乐类型</th><th style="padding:10px;text-align:left;">适合酒款</th><th style="padding:10px;text-align:left;">原因</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">古典（弦乐四重奏）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">黑皮诺、勃艮第</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">优雅细腻，互相成就</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">爵士（钢琴/萨克斯）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">霞多丽、雷司令</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">即兴与酸度共舞</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">电子/浩室</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">起泡酒、桃红</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">节奏轻快，欢乐氛围</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">摇滚/布鲁斯</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西拉、赤霞珠</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">力量感匹配厚重的酒体</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">民谣/原声</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">自然酒、橙酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">质朴呼应野性风格</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">环境/冥想</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜酒、冰酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">宁静衬托甜美余韵</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎧 品鉴场景建议</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🕯️ 约会微醺：爵士 + 黑皮诺，浪漫指数翻倍</li><li style="margin:6px 0;color:#333;line-height:1.7;">🎉 派对开场：电子 + 起泡酒，气氛瞬间点燃</li><li style="margin:6px 0;color:#333;line-height:1.7;">📚 独处阅读：民谣 + 雷司令，安静而惬意</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 严肃品鉴：古典 + 波尔多，专注风味细节</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 实用玩法：下次朋友来家里喝酒，别只准备酒，也准备一份"酒单歌单"。把音乐作为配酒的一部分，你会发现同样的酒有了不同的层次——这是零成本提升品酒体验的妙招。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒是感官的艺术，而音乐是感官的翅膀。当杯中的酒遇上耳边的旋律，味觉便不再孤立——它们共同编织出一段属于你的、独一无二的饮酒时光。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🎵 葡萄酒与音乐：听什么就喝什么',
      author: '红酒顾问',
      digest: '研究表明音乐能改变你对葡萄酒的感知！古典、爵士、电子——不同曲风竟能"调"出不同的酒。声音配酒指南。',
      content: gen(),
      coverImage: 'wine_music_cover_ai.png',
      category: 'wine-culture',
      tags: ["音乐", "葡萄酒", "感官", "搭配", "古典", "爵士", "氛围", "体验"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_music_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK wine_music, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL wine_music:', e.message);
    process.exit(1);
  }
}

main();
