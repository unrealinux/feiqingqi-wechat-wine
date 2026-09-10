const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRlMzQyZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juW3p+WFi+WKm+aQremFjTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5pyA55Sc6Jyc55qE57uE5ZCIPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juWFpemXqOWIsOi/m+mYtueahOWujOe+juaQremFjeaMh+WNlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe+jumjn+aQremFjTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #4e342e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #4e342e; border-bottom: 2px solid #8d6e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #4e342e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#4e342e;">葡萄酒与巧克力搭配：最甜蜜的组合</h2>' +
  '<p style="text-align:center;color:#666;">从入门到进阶的完美搭配指南</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">葡萄酒与巧克力，是世界上最甜蜜的组合。但很多人不知道该如何搭配——是红葡萄酒配黑巧克力，还是甜酒配白巧克力？这篇指南帮你理清所有搭配逻辑。</p></section>' +
  '<h3>🍫 搭配的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与巧克力的搭配，遵循几个基本原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜度匹配</strong>——酒的甜度要高于巧克力的甜度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>重量匹配</strong>——重口味配重口味，轻口味配轻口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>风味互补</strong>——选择能互相增强风味的搭配</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免冲突</strong>——不要让一方的味道盖过另一方</li></ul></section>' +
  '<h3>🍷 经典搭配推荐</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下是一些经过时间考验的经典搭配：</p>' +
  '<h3>📊 巧克力类型与葡萄酒搭配表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>巧克力类型</th><th>可可含量</th><th>推荐葡萄酒</th><th>搭配要点</th></tr><tr><td>黑巧克力</td><td>70%+</td><td>赤霞珠、巴罗洛</td><td>苦味配单宁</td></tr><tr><td>牛奶巧克力</td><td>30-50%</td><td>黑皮诺、梅洛</td><td>甜度配酸度</td></tr><tr><td>白巧克力</td><td>0%</td><td>莫斯卡托、雷司令</td><td>甜度匹配</td></tr><tr><td>松露巧克力</td><td> varies</td><td>波特酒、马德拉</td><td>浓郁配浓郁</td></tr><tr><td>榛果巧克力</td><td> varies</td><td>巴罗洛、基安蒂</td><td>坚果香互补</td></tr></table></section>' +
  '<h3>🚫 搭配雷区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下这些搭配，可能会让你大失所望：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>黑巧克力 + 甜酒</strong>——甜酒的甜度会盖住巧克力的苦味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>白巧克力 + 单宁重的红酒</strong>——单宁会盖住白巧克力的甜味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>牛奶巧克力 + 重口味红酒</strong>——红酒会盖住牛奶巧克力的甜味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>任何巧克力 + 干型起泡酒</strong>——起泡酒的酸度会与巧克力冲突</li></ul></section>' +
  '<h3>💡 搭配小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的搭配更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先尝巧克力，再喝酒</strong>——让味蕾先感受巧克力的风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度要对</strong>——巧克力室温，葡萄酒按类型侍酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量就好</strong>——搭配是为了享受，不是为了吃饱</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多尝试</strong>——没有绝对的对错，只有喜不喜欢</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录搭配</strong>——记下你喜欢的搭配，方便下次参考</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#8d6e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'葡萄酒与巧克力的搭配，就像一场浪漫的约会——需要平衡、和谐，还有那么一点甜蜜。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与巧克力的搭配，是一门艺术，也是一场冒险。不要害怕尝试，也许你会发现意想不到的完美组合。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么葡萄酒与巧克力的搭配心得？<br/>欢迎在评论区分享你的推荐！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与巧克力搭配：最甜蜜的组合',
      author: '红樽坊',
      digest: '从入门到进阶的完美搭配指南。黑巧克力配赤霞珠？白巧克力配莫斯卡托？这篇指南帮你搞定所有葡萄酒与巧克力的搭配难题。',
      content: gen(),
      coverImage: 'wine_chocolate_pairing_cover_ai.png',
      category: 'food-pairing',
      tags: ["巧克力", "搭配", "美食", "甜点", "浪漫"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_chocolate_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Chocolate, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Chocolate:', e.message);
    process.exit(1);
  }
}

main();
