const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJlN2QzMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuaYpeWkqeWWneS7gOS5iOiRoeiQhOmFku+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5pil5pqW6Iqx5byAPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuato+aYr+WTgemFkuWlveaXtuiKgjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWbm+Wto+mFjemFkjwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #2e7d32; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #2e7d32; border-bottom: 2px solid #66bb6a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #2e7d32; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#2e7d32;">春天喝什么葡萄酒？</h2>' +
  '<p style="text-align:center;color:#666;">春暖花开，正是品酒好时节</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">春暖花开，万物复苏，正是品酒的好时节。冬天过去了，厚重的红酒可以暂时放一放，换上清爽的白葡萄酒、浪漫的桃红、轻盈的红酒。这篇指南帮你选对春天的酒。</p></section>' +
  '<h3>🌸 春天的特点</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春天有这些特点，配酒要考虑：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度回升</strong>——从寒冷到温暖，酒要清爽</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>万物复苏</strong>——心情愉悦，酒要易饮</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>户外活动多</strong>——野餐、踏青，酒要便携</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>新鲜食材多</strong>——春笋、草莓、樱桃，要搭配</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>聚会增多</strong>——朋友聚会、家庭聚餐，酒要百搭</li></ul></section>' +
  '<h3>🍷 春天推荐酒款</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据春天的特点，推荐这些酒款：</p>' +
  '<h3>🥬 春天配餐指南</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春天有新鲜的食材，如何配酒？</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>食材</th><th>推荐酒款</th><th>理由</th></tr><tr><td>春笋</td><td>长相思、灰皮诺</td><td>清爽酸度提升鲜味</td></tr><tr><td>草莓</td><td>桃红、莫斯卡托</td><td>甜味配草莓甜味</td></tr><tr><td>樱桃</td><td>黑皮诺、佳美</td><td>果味配樱桃果味</td></tr><tr><td>野菜</td><td>白葡萄酒、桃红</td><td>清爽解腻</td></tr><tr><td>烤肉</td><td>轻盈红酒、桃红</td><td>果味配烤肉香</td></tr></table></section>' +
  '<h3>🌿 春天饮酒场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春天有不同场景，配酒也不同：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>踏青野餐</strong>——冰镇白葡萄酒或桃红，清爽便携</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>家庭聚餐</strong>——霞多丽或黑皮诺，百搭配餐</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>朋友聚会</strong>——起泡酒或桃红，气氛活跃</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>浪漫约会</strong>——香槟或桃红，浪漫氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>独自享受</strong>——雷司令或黑皮诺，放松心情</li></ul></section>' +
  '<h3>📸 春天饮酒小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的春天饮酒更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择清爽型</strong>——春天温度回升，酒要清爽</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——酒要冰镇，保持低温</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>搭配新鲜食材</strong>——春笋、草莓、樱桃是绝配</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——最重要的是开心</li></ul></section>' +
  '<h3>🚫 春天饮酒禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春天饮酒，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太重</strong>——春天适合清爽型，不适合浓郁型</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略温度</strong>——酒要冰镇，保持低温</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略安全</strong>——喝酒后不要开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略健康</strong>——适量饮酒，有益健康</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'春暖花开，正是品酒好时节。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春天是万物复苏的季节，也是品酒的好时节。选对酒，享受春天的温暖和美好。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你春天喜欢喝什么酒？<br/>你有什么春天饮酒的经验？<br/>欢迎在评论区分享你的春天故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '春天喝什么葡萄酒？春暖花开，正是品酒好时节',
      author: '红樽坊',
      digest: '春暖花开，万物复苏，正是品酒的好时节。从白葡萄酒到桃红，从轻盈红酒到起泡酒，这篇指南帮你选对春天的酒。',
      content: gen(),
      coverImage: 'spring_wine_cover_ai.png',
      category: 'seasonal',
      tags: ["春天", "季节", "春暖花开", "清爽", "复苏"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'spring_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Spring, media_id:', d.data.media_id);
  }catch(e){
    console.error('Spring:', e.message);
    process.exit(1);
  }
}

main();
