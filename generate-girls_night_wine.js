const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U5MWU2MyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPumXuuicnOiBmuS8mumFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5aeQ5aa55Lus55qE5b6u6Ya65pe25YWJPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4gOi1t+WWneadr+WlveeahDwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOmXuuicnOeJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #e91e63; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #e91e63; border-bottom: 2px solid #f48fb1; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #e91e63; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#e91e63;">闺蜜聚会配酒指南：姐妹们的微醺时光</h2>' +
  '<p style="text-align:center;color:#666;">一起喝杯好的</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">闺蜜聚会，怎么能没有酒？一起吐槽、一起八卦、一起微醺，这才是姐妹们的正确打开方式。这篇指南帮你选对酒，让闺蜜聚会更精彩。</p></section>' +
  '<h3>👯 闺蜜聚会的特点</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">闺蜜聚会和普通聚会不一样，有这些特点：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>氛围轻松</strong>——不需要太正式，轻松自在</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>话题多样</strong>——八卦、吐槽、分享、规划</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>时间较长</strong>——一聊就是几个小时</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>拍照需求</strong>——要发朋友圈，颜值很重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>微醺最好</strong>——喝醉了就没法聊天了</li></ul></section>' +
  '<h3>🍷 闺蜜聚会推荐酒款</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据闺蜜聚会的特点，推荐这些酒款：</p>' +
  '<h3>🥂 闺蜜聚会配酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>推荐酒款</th><th>理由</th></tr><tr><td>在家聊天</td><td>桃红、莫斯卡托</td><td>轻松易饮，颜值高</td></tr><tr><td>出去吃饭</td><td>白葡萄酒、起泡酒</td><td>清爽解腻，气氛好</td></tr><tr><td>生日派对</td><td>香槟、桃红起泡</td><td>庆祝氛围，有仪式感</td></tr><tr><td>失恋疗伤</td><td>甜酒、桃红</td><td>甜蜜治愈，心情好</td></tr><tr><td>八卦时间</td><td>桃红、白葡萄酒</td><td>轻松易饮，不影响聊天</td></tr></table></section>' +
  '<h3>📸 闺蜜聚会拍照技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">闺蜜聚会要发朋友圈，这些拍照技巧要记住：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒杯角度</strong>——45度角拍照最好看</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>光线</strong>——自然光最好，避免直射</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>背景</strong>——简洁背景，突出酒杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>构图</strong>——三分法构图，酒杯放在交叉点</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>滤镜</strong>——选择清新自然的滤镜</li></ul></section>' +
  '<h3>💡 闺蜜聚会小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的闺蜜聚会更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前准备</strong>——不要等到最后一刻才买酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>轮流请客</strong>——不要让一个人一直请客</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意安全</strong>——喝酒后不要开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——最重要的是开心</li></ul></section>' +
  '<h3>🚫 闺蜜聚会禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">闺蜜聚会，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要比较</strong>——不要比较谁喝得多，谁喝得少</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要强迫</strong>——不要强迫不喝酒的闺蜜喝酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要八卦过度</strong>——八卦要适度，不要伤害别人</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略安全</strong>——喝酒后不要开车</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#f48fb1,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'闺蜜聚会，喝的不是酒，是感情。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">闺蜜聚会，是一种情感的交流。选对酒，享受微醺时光，让姐妹们的感情更深。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你和闺蜜聚会时喝什么酒？<br/>你有什么闺蜜聚会的经验？<br/>欢迎在评论区分享你的闺蜜故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '闺蜜聚会配酒指南：姐妹们的微醺时光',
      author: '红樽坊',
      digest: '闺蜜聚会，怎么能没有酒？从桃红到起泡，从甜酒到轻盈红酒，这篇指南帮你选对酒。',
      content: gen(),
      coverImage: 'girls_night_wine_cover_ai.png',
      category: 'lifestyle',
      tags: ["闺蜜", "聚会", "姐妹", "社交", "微醺"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'girls_night_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Girls Night, media_id:', d.data.media_id);
  }catch(e){
    console.error('Girls Night:', e.message);
    process.exit(1);
  }
}

main();
