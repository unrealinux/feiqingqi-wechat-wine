const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzIxMjEyMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkumEmeinhumTvjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5L2g5Zyo5ZOq5LiA5bGC77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueci+WujOaJjuW/g+S6hjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #212121; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #212121; border-bottom: 2px solid #616161; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #212121; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#212121;">葡萄酒鄙视链：你在哪一层？</h2>' +
  '<p style="text-align:center;color:#666;">看完扎心了</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">喝法国的看不起喝美国的，喝勃艮第的看不起喝波尔多的，喝名庄的看不起喝普通酒的……葡萄酒圈的鄙视链，比你想象的更真实。你在哪一层？</p></section>' +
  '<h3>🔗 鄙视链大揭秘</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒圈的鄙视链，真实存在：</p>' +
  '<h3>🤔 为什么会有鄙视链？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">鄙视链的背后，是这些原因：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>面子文化</strong>——喝贵酒有面子，喝便宜酒没面子</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>知识优越感</strong>——懂酒的人看不起不懂酒的人</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>从众心理</strong>——大家都说好，我也说好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>营销洗脑</strong>——酒商的营销让你觉得贵的就是好的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交需求</strong>——喝名庄酒可以炫耀</li></ul></section>' +
  '<h3>💀 鄙视链的真相</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">鄙视链的真相是什么？</p>' +
  '<h3>🎯 如何跳出鄙视链？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想跳出鄙视链，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>盲品</strong>——不看酒标，只看酒液，你会发现很多惊喜</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>尝试新酒</strong>——不要只喝熟悉的酒，尝试新的产区和品种</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>关注性价比</strong>——不要只看价格，关注性价比</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——喝酒是为了开心，不是为了炫耀</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>尊重他人</strong>——每个人的口味不同，尊重他人的选择</li></ul></section>' +
  '<h3>🚫 鄙视链的坏处</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">鄙视链有什么坏处？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>限制视野</strong>——只喝\'高级\'酒，错过很多好酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>增加压力</strong>——为了面子喝贵酒，增加经济压力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>破坏乐趣</strong>——喝酒变成了攀比，失去了乐趣</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>伤害感情</strong>——因为酒的不同看法，伤害朋友感情</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>误导新人</strong>——让新人觉得喝酒必须喝贵酒</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#616161,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'喝酒是为了开心，不是为了鄙视别人。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的世界很大，好酒很多。不要被鄙视链限制，找到自己喜欢的酒，享受喝酒的乐趣。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你在鄙视链的哪一层？<br/>你有没有被鄙视过？<br/>欢迎在评论区分享你的故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒鄙视链：你在哪一层？看完扎心了',
      author: '红樽坊',
      digest: '喝法国的看不起喝美国的，喝勃艮第的看不起喝波尔多的……葡萄酒圈的鄙视链，你在哪一层？',
      content: gen(),
      coverImage: 'wine_snob_cover_ai.png',
      category: 'opinion',
      tags: ["鄙视链", "观点", "争议", "吐槽", "扎心"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_snob_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Snob, media_id:', d.data.media_id);
  }catch(e){
    console.error('Snob:', e.message);
    process.exit(1);
  }
}

main();
