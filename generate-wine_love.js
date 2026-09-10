const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2FkMTQ1NyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkueahOeIseaDheaVheS6izwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5p2v5Lit55qE5rWq5ryrPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuavj+S4gOadr+mDveaYr+eIseaDhTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa1qua8q+aVheS6izwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #ad1457; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #ad1457; border-bottom: 2px solid #e91e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #ad1457; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#ad1457;">葡萄酒的爱情故事：杯中的浪漫</h2>' +
  '<p style="text-align:center;color:#666;">每一杯都是爱情</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">从香槟到勃艮第，这些葡萄酒背后的爱情故事，让你更懂浪漫。每一杯酒，都可能是一个爱情故事。</p></section>' +
  '<h3>💕 香槟与爱情</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">香槟与爱情的关系：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>庆祝爱情</strong>——香槟是庆祝爱情的最佳选择</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>婚礼必备</strong>——婚礼上一定要有香槟</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>求婚必备</strong>——求婚时开香槟，更有仪式感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>纪念日</strong>——纪念日喝香槟，回忆美好时光</li></ul></section>' +
  '<h3>🌹 葡萄酒的浪漫故事</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些葡萄酒背后的浪漫故事：</p>' +
  '<h3>🍷 中国葡萄酒的爱情故事</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒背后的爱情故事：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>张裕</strong>——张弼仕为妻子酿造葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>长城</strong>——长城葡萄酒见证了无数爱情</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>贺兰晴雪</strong>——贺兰晴雪葡萄酒代表纯洁的爱情</li></ul></section>' +
  '<h3>💑 如何用葡萄酒表达爱意</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如何用葡萄酒表达爱意？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选对酒</strong>——选择对方喜欢的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选对时机</strong>——在特别的时刻开酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选对氛围</strong>——营造浪漫的氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>说对话</strong>——用酒表达你的心意</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——一起享受喝酒的时光</li></ul></section>' +
  '<h3>🥂 爱情与葡萄酒的搭配</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不同爱情阶段，配不同的酒：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>爱情阶段</th><th>推荐酒款</th><th>理由</th></tr><tr><td>初恋</td><td>莫斯卡托、桃红</td><td>甜美、浪漫</td></tr><tr><td>热恋</td><td>香槟、起泡酒</td><td>庆祝、兴奋</td></tr><tr><td>稳定期</td><td>黑皮诺、霞多丽</td><td>优雅、舒适</td></tr><tr><td>婚姻</td><td>波尔多、勃艮第</td><td>深厚、持久</td></tr><tr><td>纪念日</td><td>年份香槟、名庄酒</td><td>珍贵、难忘</td></tr></table></section>' +
  '<h3>💕 爱情葡萄酒语</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">用葡萄酒表达爱意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>香槟</strong>——\'我爱你，让我们庆祝！\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>桃红</strong>——\'你是我生命中的浪漫！\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>黑皮诺</strong>——\'你是我生命中的优雅！\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>赤霞珠</strong>——\'你是我生命中的力量！\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜酒</strong>——\'你是我生命中的甜蜜！\'</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#e91e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'爱情如酒，越陈越香。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与爱情的关系，是人类最美好的关系之一。每一杯酒，都可能是一个爱情故事。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么葡萄酒的爱情故事？<br/>你如何用葡萄酒表达爱意？<br/>欢迎在评论区分享你的浪漫故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒的爱情故事：杯中的浪漫',
      author: '红樽坊',
      digest: '从香槟到勃艮第，这些葡萄酒背后的爱情故事，让你更懂浪漫。',
      content: gen(),
      coverImage: 'wine_love_cover_ai.png',
      category: 'culture',
      tags: ["爱情", "浪漫", "故事", "婚姻", "约会"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_love_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Love, media_id:', d.data.media_id);
  }catch(e){
    console.error('Love:', e.message);
    process.exit(1);
  }
}

main();
