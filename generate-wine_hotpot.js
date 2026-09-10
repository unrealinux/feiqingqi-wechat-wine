const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzMmYyZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumFjeeBq+mUhTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5oSP5oOz5LiN5Yiw55qEPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWujOe+juaQremFjeaMh+WNlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe+jumjn+aQremFjTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #d32f2f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #d32f2f; border-bottom: 2px solid #ef5350; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #d32f2f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#d32f2f;">红酒配火锅：意想不到的完美搭配</h2>' +
  '<p style="text-align:center;color:#666;">解锁火锅新吃法</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">谁说红酒不能配火锅？火锅是中国最受欢迎的美食之一，而红酒是世界上最受欢迎的饮品之一。当火锅遇上红酒，会碰撞出怎样的火花？这篇指南告诉你如何用红酒配火锅，解锁火锅新吃法。</p></section>' +
  '<h3>🍲 火锅配酒的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">火锅配酒，遵循这几个原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>锅底决定酒款</strong>——不同锅底配不同酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>辣配甜</strong>——麻辣锅配甜型或微甜型葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>清淡配清淡</strong>——清汤锅配轻盈型葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>油腻配酸</strong>——油腻锅底配高酸度葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度要适中</strong>——葡萄酒不要太冰，12-16°C最佳</li></ul></section>' +
  '<h3>🌶️ 麻辣锅配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">麻辣锅是最受欢迎的火锅类型，也是最难配酒的。但只要选对酒，麻辣锅也能配出美味：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配高单宁的赤霞珠，会加重辣味。</p>' +
  '<h3>🍖 清汤锅配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">清汤锅口味清淡，适合搭配轻盈型葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>避雷：</strong>不要配浓郁型葡萄酒，会掩盖清汤锅的原味。</p>' +
  '<h3>🍄 菌菇锅配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">菌菇锅鲜味十足，适合搭配能提升鲜味的葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>小贴士：</strong>菌菇锅的鲜味很重，建议选择过桶的霞多丽，口感更丰富。</p>' +
  '<h3>🥩 牛肉锅配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">牛肉锅浓郁厚重，适合搭配浓郁型葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>小贴士：</strong>牛肉锅的油腻感很重，建议选择高酸度的赤霞珠，可以解腻。</p>' +
  '<h3>🍲 海鲜锅配酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海鲜锅鲜美无比，适合搭配清爽型白葡萄酒：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>小贴士：</strong>海鲜锅的鲜味很重，建议选择干型雷司令，不会掩盖海鲜的原味。</p>' +
  '<h3>🎯 火锅配酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>火锅类型</th><th>推荐酒款</th><th>避雷</th></tr><tr><td>麻辣锅</td><td>西拉、仙粉黛、桃红</td><td>赤霞珠、黑皮诺</td></tr><tr><td>清汤锅</td><td>黑皮诺、长相思、佳美</td><td>浓郁型葡萄酒</td></tr><tr><td>菌菇锅</td><td>霞多丽、维欧尼</td><td>轻盈型葡萄酒</td></tr><tr><td>牛肉锅</td><td>赤霞珠、马尔贝克</td><td>轻盈型葡萄酒</td></tr><tr><td>海鲜锅</td><td>雷司令、琼瑶浆</td><td>浓郁型红葡萄酒</td></tr><tr><td>鸳鸯锅</td><td>西拉（辣）+黑皮诺（清）</td><td>单一酒款</td></tr></table></section>' +
  '<h3>💡 火锅配酒小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的火锅配酒更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先喝酒再吃辣</strong>——先喝一口酒，再吃辣锅，可以缓解辣味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝水</strong>——吃辣锅时多喝水，可以帮助缓解辣味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要空腹吃辣</strong>——空腹吃辣容易伤胃</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——吃火锅时容易喝多，要注意控制</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——火锅配酒最重要的是享受过程</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'火锅配酒，越喝越有。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">火锅配酒是一种新的尝试，也是一种享受。选对酒，配对锅，让你的火锅体验更上一层楼。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你喜欢什么火锅？<br/>你平时配什么酒？<br/>欢迎在评论区分享你的火锅配酒经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '红酒配火锅：意想不到的完美搭配',
      author: '红樽坊',
      digest: '谁说红酒不能配火锅？麻辣锅配西拉，清汤锅配黑皮诺，解锁火锅新吃法！',
      content: gen(),
      coverImage: 'wine_hotpot_cover_ai.png',
      category: 'food-pairing',
      tags: ["火锅", "搭配", "麻辣", "川菜", "配餐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_hotpot_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Hotpot, media_id:', d.data.media_id);
  }catch(e){
    console.error('Hotpot:', e.message);
    process.exit(1);
  }
}

main();
