const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNlMjcyMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPueItuS6suiKgumFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+54i454i46YKj5LiA6L6I55qE6JGh6JCE6YWS6K6w5b+GPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueUqOS4gOadr+mFku+8jOiHtOaVrOeItueIsTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOeItuS6suiKgueJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #3e2723; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #3e2723; border-bottom: 2px solid #8d6e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #3e2723; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#3e2723;">父亲节配酒指南</h2>' +
  '<p style="text-align:center;color:#666;">爸爸那一辈的葡萄酒记忆 | 用一杯酒，致敬父爱</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">父爱如山，深沉而内敛。父亲节这一天，也许你不擅长说\'我爱你\'，但可以陪爸爸喝一杯酒。从80年代的中国葡萄酒到今天的宁夏贺兰山，每一杯酒都承载着一段记忆。</p></section>' +
  '<h3>🍷 爸爸的葡萄酒记忆</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">对于很多爸爸来说，葡萄酒的记忆可能停留在80年代的\'中国红\'——那种甜甜的、酒精度不高的国产葡萄酒。那时候，葡萄酒是奢侈品，只有过年过节才能喝上一口。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">90年代，随着洋酒进入中国，爸爸们开始接触到真正的干红葡萄酒。但那时候的干红酒，很多人喝不惯——太涩、太酸、不够甜。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如今，中国葡萄酒的品质已经有了翻天覆地的变化。宁夏贺兰山东麓、云南香格里拉等产区的酒款，在国际大赛上屡获殊荣。用一杯国产好酒，陪爸爸聊聊这些年的生活变化。</p>' +
  '<h3>👨‍👦 不同类型的爸爸，配不同的酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">每个爸爸都是独特的，他们有不同的性格、不同的口味、不同的饮酒习惯。这里根据爸爸的类型，推荐不同的酒款：</p>' +
  '<h3>🎁 父亲节送酒攻略</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果父亲节不知道送什么酒，这里有几个建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算100-200元</strong>——黄尾袋鼠赤霞珠、桃乐丝公牛血、蒙特斯经典</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算200-400元</strong>——拉菲传说、禾富黄标西拉、宁夏贺兰山东麓赤霞珠</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算400-800元</strong>——波尔多中级庄、勃艮第大区级、澳洲巴罗萨西拉</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算800元以上</strong>——波尔多列级庄、勃艮第一级园、意大利巴罗洛</li></ul></section>' +
  '<h3>🥂 陪爸爸喝酒的正确方式</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">父亲节这一天，陪爸爸喝酒，不仅仅是喝酒本身。这里有几个建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>放慢节奏</strong>——不要急着干杯，慢慢品味，边喝边聊</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>倾听故事</strong>——让爸爸讲讲他年轻时的故事，你可能从来没听过</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要评判</strong>——即使爸爸的饮酒习惯不健康，也不要批评，先陪伴</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>拍照留念</strong>——用手机记录下这个温馨的时刻</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>送个小礼物</strong>——一瓶好酒，一个酒杯，或者一张手写的卡片</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#8d6e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'父爱如酒，初尝时或许苦涩，回味时才知甘甜。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这一天，放下手机，关掉电视，倒上两杯酒，和爸爸好好聊聊。你会发现，那个沉默寡言的父亲，其实有很多话想对你说。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你和爸爸有什么关于酒的故事？<br/>欢迎在评论区分享你的父亲节计划！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '父亲节配酒指南：爸爸那一辈的葡萄酒记忆',
      author: '红樽坊',
      digest: '从80年代的中国葡萄酒到今天的宁夏贺兰山，用一杯酒致敬父爱。不同类型的爸爸，配不同的酒。',
      content: gen(),
      coverImage: 'fathers_day_wine_cover_ai.png',
      category: 'holiday',
      tags: ["父亲节", "节日", "爸爸", "情怀", "配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'fathers_day_wine_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
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
    console.log('Father Day, media_id:', d.data.media_id);
  }catch(e){
    console.error('Father Day:', e.message);
    process.exit(1);
  }
}

main();
