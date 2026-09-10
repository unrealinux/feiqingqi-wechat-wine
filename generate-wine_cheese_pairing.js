const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2JmMzYwYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juiKneWjq+aQremFjTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5pyA57uP5YW455qE57uE5ZCIPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juWFpemXqOWIsOi/m+mYtueahOWujOe+juaQremFjeaMh+WNlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe+jumjn+aQremFjTwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#bf360c;">葡萄酒与芝士搭配：最经典的组合</h2>' +
  '<p style="text-align:center;color:#666;">从入门到进阶的完美搭配指南</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">葡萄酒与芝士，是西方饮食文化中最经典的搭配之一。但很多人不知道该如何搭配——是红葡萄酒配硬芝士，还是白葡萄酒配软芝士？这篇指南帮你理清所有搭配逻辑。</p></section>' +
  '<h3>🧀 搭配的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与芝士的搭配，遵循几个基本原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>重量匹配</strong>——重口味配重口味，轻口味配轻口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>风味互补</strong>——选择能互相增强风味的搭配</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>产地匹配</strong>——同一产区的酒和芝士通常最搭配</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜度平衡</strong>——甜酒配甜芝士，干酒配咸芝士</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免冲突</strong>——不要让一方的味道盖过另一方</li></ul></section>' +
  '<h3>🍷 经典搭配推荐</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下是一些经过时间考验的经典搭配：</p>' +
  '<h3>📊 芝士类型与葡萄酒搭配表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>芝士类型</th><th>代表芝士</th><th>推荐葡萄酒</th><th>搭配要点</th></tr><tr><td>软质白霉芝士</td><td>布里、卡芒贝尔</td><td>黑皮诺、香槟</td><td>柔滑配柔滑</td></tr><tr><td>蓝纹芝士</td><td>洛克福、戈贡佐拉</td><td>甜酒、波特酒</td><td>咸甜对比</td></tr><tr><td>硬质芝士</td><td>切达、帕玛森</td><td>赤霞珠、巴罗洛</td><td>重配重</td></tr><tr><td>半硬质芝士</td><td>格鲁耶尔、孔泰</td><td>黑皮诺、霞多丽</td><td>风味互补</td></tr><tr><td>新鲜芝士</td><td>马苏里拉、山羊奶酪</td><td>长相思、桑娇维塞</td><td>清爽配清爽</td></tr><tr><td>意大利芝士</td><td>莫扎瑞拉、帕尔马干酪</td><td>基安蒂、巴罗洛</td><td>产地匹配</td></tr></table></section>' +
  '<h3>🚫 搭配雷区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下这些搭配，可能会让你大失所望：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>蓝纹芝士 + 单宁重的红酒</strong>——两者都很强烈，会互相打架</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>新鲜芝士 + 重口味红酒</strong>——红酒会盖住芝士的清新风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜芝士 + 干型红酒</strong>——甜度不平衡，口感怪异</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>重口味芝士 + 轻盈红酒</strong>——酒会被芝士的味道淹没</li></ul></section>' +
  '<h3>💡 搭配小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的搭配更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先尝芝士，再喝酒</strong>——让味蕾先感受芝士的风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度要对</strong>——芝士室温，葡萄酒按类型侍酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量就好</strong>——搭配是为了享受，不是为了吃饱</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多尝试</strong>——没有绝对的对错，只有喜不喜欢</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录搭配</strong>——记下你喜欢的搭配，方便下次参考</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff7043,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'葡萄酒与芝士的搭配，就像一场浪漫的约会——需要平衡、和谐，还有那么一点惊喜。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与芝士的搭配，是一门艺术，也是一场冒险。不要害怕尝试，也许你会发现意想不到的完美组合。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么葡萄酒与芝士的搭配心得？<br/>欢迎在评论区分享你的推荐！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与芝士搭配：最经典的组合',
      author: '红樽坊',
      digest: '从入门到进阶的完美搭配指南。波尔多配切达？勃艮第配布里？这篇指南帮你搞定所有葡萄酒与芝士的搭配难题。',
      content: gen(),
      coverImage: 'wine_cheese_pairing_cover_ai.png',
      category: 'food-pairing',
      tags: ["芝士", "奶酪", "搭配", "美食", "经典"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_cheese_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Cheese, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Cheese:', e.message);
    process.exit(1);
  }
}

main();
