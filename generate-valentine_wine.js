const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izg4MGU0ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuaDheS6uuiKgumFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6K6p54ix5oSP5Y2H5ripPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuavj+S4gOadr+mDveaYr+a1qua8qzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOiKguaXpeeJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #880e4f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #880e4f; border-bottom: 2px solid #e91e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #880e4f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#880e4f;">情人节配酒指南：让爱意升温</h2>' +
  '<p style="text-align:center;color:#666;">每一杯都是浪漫</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">情人节快到了，你准备好和另一半共度浪漫时光了吗？一瓶好酒，可以让爱意升温。这篇指南告诉你如何在不同的情人节场景中配酒，让每一杯都充满浪漫。</p></section>' +
  '<h3>💕 情人节配酒的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">情人节配酒，遵循这几个原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选对氛围</strong>——浪漫的氛围需要浪漫的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>了解对方喜好</strong>——投其所好最重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——不同酒款不同温度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——喝酒是享受，不是任务</li></ul></section>' +
  '<h3>🕯️ 浪漫晚餐场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">浪漫晚餐是情人节的经典场景，配酒很重要：</p>' +
  '<h3>🏠 居家约会场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">居家约会更轻松，配酒也可以更随意：</p>' +
  '<h3>🌹 户外约会场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">户外约会更轻松，配酒也可以更随意：</p>' +
  '<h3>🥂 情人节配酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>推荐酒款</th><th>避雷</th></tr><tr><td>浪漫晚餐</td><td>香槟、勃艮第黑皮诺</td><td>浓郁型红葡萄酒</td></tr><tr><td>居家约会</td><td>莫斯卡托、桃红</td><td>高单宁红葡萄酒</td></tr><tr><td>户外约会</td><td>起泡酒、白葡萄酒</td><td>浓郁型红葡萄酒</td></tr><tr><td>朋友聚会</td><td>起泡酒、桃红</td><td>昂贵名酒</td></tr><tr><td>独自享受</td><td>黑皮诺、雷司令</td><td>太多酒</td></tr></table></section>' +
  '<h3>💡 情人节配酒小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的情人节配酒更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前准备</strong>——不要等到最后一刻才买酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——不同酒款不同温度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——微醺最好，喝醉伤氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——喝酒是享受，不是任务</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>表达心意</strong>——送酒最重要的是心意</li></ul></section>' +
  '<h3>🚫 情人节配酒禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">情人节配酒，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要开车</strong>——喝酒后绝对不能开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要选错酒</strong>——了解对方喜好，投其所好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略氛围</strong>——氛围比酒更重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要勉强对方</strong>——如果对方不喝酒，不要勉强</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#e91e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'情人节的酒，不在于贵，而在于心意。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">情人节配酒，是一种浪漫的仪式感。选对酒，配对场景，让每一杯都充满爱意。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你情人节打算喝什么酒？<br/>你有什么情人节配酒的经验？<br/>欢迎在评论区分享你的浪漫故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '情人节配酒指南：让爱意升温',
      author: '红樽坊',
      digest: '香槟、黑皮诺、桃红……不同的情人节场景，配不同的酒。让每一杯都充满浪漫。',
      content: gen(),
      coverImage: 'valentine_wine_cover_ai.png',
      category: 'holiday',
      tags: ["情人节", "浪漫", "约会", "爱情", "节日"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'valentine_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Valentine, media_id:', d.data.media_id);
  }catch(e){
    console.error('Valentine:', e.message);
    process.exit(1);
  }
}

main();
