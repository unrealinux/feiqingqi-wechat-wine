const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2JmMzYwYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4jue+jumjn+aQremFjTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+57uI5p6B5pCt6YWN5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuiuqeavj+S4gOmkkOmDveWujOe+jjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe+jumjn+aQremFjTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #bf360c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #bf360c; border-bottom: 2px solid #ff7043; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #bf360c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#bf360c;">葡萄酒与美食搭配：终极搭配指南</h2>' +
  '<p style="text-align:center;color:#666;">让每一餐都完美</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">中餐配什么酒？西餐配什么酒？这篇终极搭配指南，让你的每一餐都完美。</p></section>' +
  '<h3>🎯 搭配的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒配餐的基本原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>红酒配红肉</strong>——赤霞珠配牛排</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>白酒配白肉</strong>——霞多丽配鱼</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>起泡酒配海鲜</strong>——香槟配生蚝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜酒配甜点</strong>——莫斯卡托配蛋糕</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>地域搭配</strong>——当地酒配当地菜</li></ul></section>' +
  '<h3>🥢 中餐搭配</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中餐如何配酒？</p>' +
  '<h3>🍝 西餐搭配</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">西餐如何配酒？</p>' +
  '<h3>📊 搭配速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>食材</th><th>推荐酒款</th><th>理由</th></tr><tr><td>牛排</td><td>赤霞珠、马尔贝克</td><td>高单宁软化肉质</td></tr><tr><td>鱼</td><td>长相思、霞多丽</td><td>清爽提升鲜味</td></tr><tr><td>鸡肉</td><td>黑皮诺、霞多丽</td><td>轻盈不抢味</td></tr><tr><td>海鲜</td><td>香槟、雷司令</td><td>清爽解腻</td></tr><tr><td>甜点</td><td>莫斯卡托、冰酒</td><td>甜配甜</td></tr></table></section>' +
  '<h3>🚫 搭配禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">搭配时，这些禁忌要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要红酒配海鲜</strong>——单宁会加重腥味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要白酒配牛排</strong>——酒体太轻，撑不住</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要甜酒配咸菜</strong>——味道冲突</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要高单宁配辣菜</strong>——会加重辣味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略个人口味</strong>——自己喜欢最重要</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff7043,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'搭配没有标准答案，适合你的才是最好的。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒配餐是一门艺术，没有绝对的标准。多尝试，找到最适合自己的搭配。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么搭配经验？<br/>你最喜欢的搭配是什么？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与美食搭配：终极搭配指南',
      author: '红樽坊',
      digest: '中餐配什么酒？西餐配什么酒？这篇终极搭配指南，让你的每一餐都完美。',
      content: gen(),
      coverImage: 'wine_food_pairing_cover_ai.png',
      category: 'food-pairing',
      tags: ["搭配", "美食", "中餐", "西餐", "配餐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_food_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('Pairing:', e.message);
    process.exit(1);
  }
}

main();
