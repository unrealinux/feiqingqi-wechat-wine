const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2MyMTg1YiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6puS8mumFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6K6p5aW55a+55L2g5Yqg5YiGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumAieWvuemFku+8jOe6puS8muaIkOWKn+S4gOWNijwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe6puS8muaUu+eVpTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #c2185b; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #c2185b; border-bottom: 2px solid #f06292; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #c2185b; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#c2185b;">约会配酒指南：让她对你加分</h2>' +
  '<p style="text-align:center;color:#666;">选对酒，约会成功一半</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">约会时点错酒，可能让气氛瞬间尴尬。但选对酒，却能让她对你加分不少。这份指南，帮你搞定从餐厅点酒到家中小酌的所有场景。</p></section>' +
  '<h3>🍷 餐厅约会：点酒的艺术</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">在餐厅约会时，点酒是一门学问。点太贵显得刻意，点太便宜显得小气，点错了可能直接翻车。</p>' +
  '<h3>🏠 家中约会：小酌的浪漫</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">家中约会比餐厅更私密，也更考验你的准备功夫。提前准备好酒和小食，能让气氛更加温馨。</p>' +
  '<h3>💡 约会点酒的黄金法则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个原则，你就不会出错：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前了解对方的口味</strong>——如果她不喝红酒，就不要点红酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格适中</strong>——300-600元的酒足够体面，不需要上千元</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择易饮的酒款</strong>——约会不是品酒会，不要选太复杂的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——白葡萄酒和起泡酒要冰镇，红葡萄酒室温即可</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉就尴尬了</li></ul></section>' +
  '<h3>🚫 约会点酒的雷区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下这些行为，会让她对你大打折扣：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>炫耀性点酒</strong>——\'给我来一瓶82年的拉菲\'——这是电影情节，不是现实</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>过度纠结</strong>——在酒单上犹豫10分钟，显得不够果断</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不懂装懂</strong>——乱说一通品酒词，不如诚实说\'我不太懂酒\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>强迫对方喝酒</strong>——她不想喝就不要勉强</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>喝太快</strong>——微醺是浪漫，喝醉是灾难</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#f06292,transparent);margin:25px 0;"></div>' +
  '<h3>💑 不同约会阶段的配酒建议</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>约会阶段</th><th>推荐酒款</th><th>理由</th></tr><tr><td>初次约会</td><td>桃红葡萄酒/莫斯卡托</td><td>颜值高、易饮、不会喝醉</td></tr><tr><td>热恋期</td><td>香槟/勃艮第</td><td>浪漫、有仪式感</td></tr><tr><td>稳定期</td><td>自然酒/橙酒</td><td>轻松、有话题</td></tr><tr><td>老夫老妻</td><td>任何她喜欢的酒</td><td>最重要的是陪伴</td></tr></table></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么约会配酒的独门秘诀？<br/>欢迎在评论区分享你的约会故事和推荐酒款！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '约会配酒指南：让她对你加分',
      author: '红樽坊',
      digest: '选对酒，约会成功一半。从餐厅点酒到家中小酌，这份指南帮你搞定所有约会场景的配酒难题。',
      content: gen(),
      coverImage: 'date_night_wine_cover_ai.png',
      category: 'lifestyle',
      tags: ["约会", "恋爱", "配酒", "浪漫", "社交"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'date_night_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Date Night, media_id:', d.data.media_id);
  }catch(e){
    console.error('Date Night:', e.message);
    process.exit(1);
  }
}

main();
