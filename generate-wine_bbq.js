const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2JmMzYwYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumFjeeDp+eDpOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5pyA6L+H55i+55qE5pCt6YWNPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueDpOiCiemFjemFku+8jOi2iuWWnei2iuaciTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe+jumjn+aQremFjTwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#bf360c;">红酒配烧烤指南：最过瘾的搭配</h2>' +
  '<p style="text-align:center;color:#666;">烤肉配酒，越喝越有</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">烧烤配红酒，是夏天最过瘾的搭配。烤肉的香气，配上红酒的果味，简直是人间美味。这篇指南帮你选对烧烤酒，让烧烤体验更上一层楼。</p></section>' +
  '<h3>🔥 烧烤配酒的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">烧烤配酒，遵循这几个原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>肉类决定酒款</strong>——不同肉类配不同酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>重配重</strong>——浓郁的烤肉配浓郁的红酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>轻配轻</strong>——清淡的海鲜配清爽的白酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>辣配甜</strong>——辣味烧烤配甜型葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度要适中</strong>——葡萄酒不要太冰，12-16°C最佳</li></ul></section>' +
  '<h3>🥩 牛肉烧烤配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">牛肉烧烤是最经典的烧烤类型，也是最难配酒的。但只要选对酒，牛肉烧烤也能配出美味：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配轻盈型葡萄酒，会掩盖牛肉的原味。</p>' +
  '<h3>🐑 羊肉烧烤配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">羊肉烧烤有独特的膻味，需要搭配能中和膻味的葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配高酸度的葡萄酒，会加重膻味。</p>' +
  '<h3>🍖 猪肉烧烤配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">猪肉烧烤口味适中，适合搭配中等酒体的葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配浓郁型葡萄酒，会掩盖猪肉的原味。</p>' +
  '<h3>🦞 海鲜烧烤配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海鲜烧烤鲜美无比，适合搭配清爽型白葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配浓郁型红葡萄酒，会掩盖海鲜的鲜味。</p>' +
  '<h3>🎯 烧烤配酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>烧烤类型</th><th>推荐酒款</th><th>避雷</th></tr><tr><td>牛肉烧烤</td><td>赤霞珠、马尔贝克</td><td>轻盈型葡萄酒</td></tr><tr><td>羊肉烧烤</td><td>西拉、歌海娜</td><td>高酸度葡萄酒</td></tr><tr><td>猪肉烧烤</td><td>黑皮诺、佳美</td><td>浓郁型葡萄酒</td></tr><tr><td>海鲜烧烤</td><td>长相思、雷司令</td><td>浓郁型红葡萄酒</td></tr><tr><td>鸡肉烧烤</td><td>桃红、灰皮诺</td><td>高单宁红葡萄酒</td></tr><tr><td>混合烧烤</td><td>西拉、桃红</td><td>单一酒款</td></tr></table></section>' +
  '<h3>💡 烧烤配酒小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的烧烤配酒更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先吃肉再喝酒</strong>——先吃一口肉，再喝一口酒，可以提升口感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝水</strong>——吃烧烤时多喝水，可以帮助解腻</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要空腹吃烧烤</strong>——空腹吃烧烤容易伤胃</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——吃烧烤时容易喝多，要注意控制</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——烧烤配酒最重要的是享受过程</li></ul></section>' +
  '<h3>🚫 烧烤配酒禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">烧烤配酒，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要空腹喝酒</strong>——空腹喝酒伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略安全</strong>——烧烤时注意防火</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略环保</strong>——烧烤后清理垃圾</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略健康</strong>——烧烤要适量，不要天天吃</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff7043,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'烧烤配酒，越喝越有。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">烧烤配酒是一种享受，也是一种生活态度。选对酒，配对肉，让你的烧烤体验更上一层楼。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你喜欢什么烧烤？<br/>你平时配什么酒？<br/>欢迎在评论区分享你的烧烤配酒经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '红酒配烧烤指南：最过瘾的搭配',
      author: '红樽坊',
      digest: '烧烤配红酒，是夏天最过瘾的搭配。从牛肉到羊肉，从猪肉到海鲜，这篇指南帮你选对烧烤酒。',
      content: gen(),
      coverImage: 'wine_bbq_cover_ai.png',
      category: 'food-pairing',
      tags: ["烧烤", "搭配", "夏天", "烤肉", "配餐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_bbq_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('BBQ, media_id:', d.data.media_id);
  }catch(e){
    console.error('BBQ:', e.message);
    process.exit(1);
  }
}

main();
