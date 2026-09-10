const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izg4MGU0ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuW8gOeTtuWZqOS9v+eUqOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5Yir5YaN55So54mZ5ZKs5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7jua1t+mprOWIgOWIsOeUteWKqOW8gOeTtuWZqO+8jOS4gOaWh+aQnuWumjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWZqOWFt+aMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #880e4f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #880e4f; border-bottom: 2px solid #f06292; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #880e4f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#880e4f;">葡萄酒开瓶器使用指南</h2>' +
  '<p style="text-align:center;color:#666;">别再用牙咬了 | 从海马刀到电动开瓶器</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人以为开瓶很简单，结果不是软木塞断了，就是酒洒了一地。选对开瓶器，掌握正确方法，开瓶其实很简单。这篇指南，帮你搞定所有葡萄酒开瓶难题。</p></section>' +
  '<h3>🔧 常见开瓶器类型</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">市面上的开瓶器种类繁多，主要有以下几种：</p>' +
  '<h3>📝 海马刀使用教程</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海马刀是最经典的开瓶器，这里详细讲解使用方法：</p>' +
  '<h3>🚫 开瓶常见错误</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">开瓶时，这些错误要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>螺旋钻旋入太深</strong>——可能把软木塞旋断</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>螺旋钻歪斜</strong>——可能导致软木塞断裂</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>用力过猛</strong>——可能把软木塞拔断</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>没有割开酒帽</strong>——可能导致酒液污染</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>开瓶后不醒酒</strong>——可能影响口感</li></ul></section>' +
  '<h3>💡 开瓶小技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小技巧，让你开瓶更顺利：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先旋转瓶子</strong>——而不是旋转开瓶器</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持垂直</strong>——螺旋钻要垂直插入</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制力度</strong>——不要用蛮力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>分步操作</strong>——不要急于求成</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>练习多次</strong>——熟能生巧</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#f06292,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'开瓶是喝酒的第一步，也是最重要的一步。开得好，喝酒才有好心情。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选对开瓶器，掌握正确方法，开瓶其实很简单。不要害怕开瓶，多练习几次，你也能成为开瓶高手。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你平时用什么开瓶器？<br/>你有什么开瓶的小技巧？<br/>欢迎在评论区分享你的开瓶经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒开瓶器使用指南：别再用牙咬了',
      author: '红樽坊',
      digest: '从海马刀到电动开瓶器，从传统开瓶到真空保鲜，这篇指南帮你搞定所有葡萄酒开瓶难题。',
      content: gen(),
      coverImage: 'wine_opener_guide_cover_ai.png',
      category: 'practical-guide',
      tags: ["开瓶器", "开瓶", "器具", "实用技巧", "入门"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_opener_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Opener, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Opener:', e.message);
    process.exit(1);
  }
}

main();
