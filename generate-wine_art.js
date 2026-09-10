const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRhMTQ4YyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juiJuuacrzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5paH5Lq65aKo5a6i55qE5p2v5Lit54mpPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumFkuS4juiJuuacr+eahOWNg+W5tOS5i+e8mDwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaWh+WMluaVheS6izwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #4a148c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #4a148c; border-bottom: 2px solid #9c27b0; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #4a148c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#4a148c;">葡萄酒与艺术：文人墨客的杯中物</h2>' +
  '<p style="text-align:center;color:#666;">酒与艺术的千年之缘</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">从李白到莫奈，从梵高到毕加索，这些艺术大师都爱喝葡萄酒。酒与艺术的千年之缘，你了解多少？</p></section>' +
  '<h3>🎨 艺术家与葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些艺术家都爱喝葡萄酒：</p>' +
  '<h3>📖 诗人与葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些诗人都爱喝葡萄酒：</p>' +
  '<h3>🖼️ 葡萄酒在艺术中的表现</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒在艺术作品中的表现：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>绘画</strong>——葡萄酒是很多画作的主题</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>诗歌</strong>——葡萄酒是很多诗歌的灵感来源</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>音乐</strong>——葡萄酒是很多歌曲的主题</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>文学</strong>——葡萄酒是很多小说的元素</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>电影</strong>——葡萄酒是很多电影的道具</li></ul></section>' +
  '<h3>🍷 艺术酒标</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">有些酒标本身就是艺术品：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>木桐酒庄</strong>——每年邀请艺术家设计酒标</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>艺术家联名</strong>——有些酒庄与艺术家联名</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>限量版</strong>——有些酒标是限量版艺术品</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>收藏价值</strong>——艺术酒标具有收藏价值</li></ul></section>' +
  '<h3>💡 酒与艺术的关系</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒与艺术的关系是什么？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>灵感来源</strong>——酒可以激发艺术家的灵感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交媒介</strong>——酒是艺术家社交的媒介</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>创作工具</strong>——酒是艺术家创作的工具</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>生活态度</strong>——酒代表了一种生活态度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>文化符号</strong>——酒是文化的重要符号</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#9c27b0,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'酒是艺术的燃料，艺术是酒的灵魂。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒与艺术的千年之缘，是人类文明的重要组成部分。了解酒与艺术的关系，可以让你更懂酒，更懂艺术。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你知道哪些艺术家与葡萄酒的故事？<br/>你喜欢在喝酒时欣赏艺术吗？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与艺术：文人墨客的杯中物',
      author: '红樽坊',
      digest: '从李白到莫奈，从梵高到毕加索，这些艺术大师都爱喝葡萄酒。酒与艺术的千年之缘。',
      content: gen(),
      coverImage: 'wine_art_cover_ai.png',
      category: 'culture',
      tags: ["艺术", "文化", "画家", "诗人", "故事"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_art_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Art, media_id:', d.data.media_id);
  }catch(e){
    console.error('Art:', e.message);
    process.exit(1);
  }
}

main();
