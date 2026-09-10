const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y1N2YxNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuW4uOingeivr+WMujwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+OTkl55qE5Lq66YO955CG6Kej6ZSZ5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuaJk+egtOiupOefpe+8jOmHjeaWsOiupOivhuiRoeiQhOmFkjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe6oOmUmeaMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #f57f17; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #f57f17; border-bottom: 2px solid #ffca28; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #f57f17; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#f57f17;">葡萄酒常见误区：99%的人都理解错了</h2>' +
  '<p style="text-align:center;color:#666;">打破认知，重新认识葡萄酒</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">关于葡萄酒，流传着很多\'常识\'。但你有没有想过，这些常识可能是错的？今天我们就来打破这些误区，让你重新认识葡萄酒。</p></section>' +
  '<h3>❌ 误区一：葡萄酒越老越好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为，葡萄酒像白酒一样，越陈越好。这是最大的误区。</p>' +
  '<h3>❌ 误区二：挂杯就是好酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人摇杯后看到酒液沿着杯壁缓慢流下，就认为这是好酒的标志。</p>' +
  '<h3>❌ 误区三：红酒一定要配牛排</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒配牛排是经典搭配，但不是唯一选择。很多人被这个观念限制了想象力。</p>' +
  '<h3>❌ 误区四：开瓶后必须醒酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人买了一瓶酒，第一件事就是醒酒。但醒酒不是万能的。</p>' +
  '<h3>❌ 误区五：红酒要室温饮用</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为红酒要在\'室温\'下饮用，于是把酒放在20多度的房间里。</p>' +
  '<h3>❌ 误区六：便宜没好酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为，几百元以下的酒都不值得喝。</p>' +
  '<h3>❌ 误区七：白葡萄酒比红葡萄酒差</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为，白葡萄酒是\'入门级\'，红葡萄酒才是\'高级\'。</p>' +
  '<h3>❌ 误区八：葡萄酒都要用高脚杯</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人觉得，喝葡萄酒必须用高脚杯，否则就是不讲究。</p>' +
  '<h3>❌ 误区九：葡萄酒要趁热喝</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为，葡萄酒要趁热喝才好。</p>' +
  '<h3>❌ 误区十：年份越老越值钱</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为，年份越老的酒越值钱。</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ffca28,transparent);margin:25px 0;"></div>' +
  '<h3>💡 正确的葡萄酒观念</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">打破误区后，这里有几个正确的葡萄酒观念：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>好喝就是好酒</strong>——不要被分数、评分、价格绑架</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适合自己的才是最好的</strong>——不要盲目追求名庄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>葡萄酒是用来享受的</strong>——不是用来炫耀的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要害怕尝试新酒款</strong>——多喝多试才能找到自己的口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>喝酒最重要的是开心</strong>——不是比谁更懂</li></ul></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你还知道哪些葡萄酒误区？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒常见误区：99%的人都理解错了',
      author: '红樽坊',
      digest: '越老越好？挂杯就是好酒？红酒配牛排？这些你深信不疑的葡萄酒知识，可能全是错的。',
      content: gen(),
      coverImage: 'wine_myths_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["误区", "误解", "科普", "品酒", "知识"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_myths_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Myths, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Myths:', e.message);
    process.exit(1);
  }
}

main();
