const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMxMWI5MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkumFkuadr+mAieaLqeaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LiN5ZCM6YWS5qy+6YWN5LiN5ZCM5p2v5a2QPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumAieWvueadr+WtkO+8jOWWnemFkuabtOS6q+WPlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWZqOWFt+aMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #311b92; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #311b92; border-bottom: 2px solid #7c4dff; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #311b92; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#311b92;">葡萄酒酒杯选择指南</h2>' +
  '<p style="text-align:center;color:#666;">不同酒款配不同杯子 | 选对杯子，喝酒更享受</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人以为，喝酒用什么杯子都一样。但其实，酒杯的形状会直接影响葡萄酒的香气和口感。选对酒杯，能让葡萄酒的风味提升30%。这篇指南，帮你选对杯子。</p></section>' +
  '<h3>🍷 为什么酒杯很重要？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒杯的形状会影响葡萄酒的三个关键因素：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>香气集中</strong>——杯口的形状决定了香气是否能集中到鼻尖</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒液流动</strong>——杯壁的角度决定了酒液流入口腔的位置</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>视觉体验</strong>——透明度好的酒杯能让你更好地观察酒的颜色</li></ul></section>' +
  '<h3>🏆 基础酒杯类型</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">每个葡萄酒爱好者，至少应该拥有这四种基础酒杯：</p>' +
  '<h3>📊 酒杯选择速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款类型</th><th>推荐酒杯</th><th>杯身特点</th><th>作用</th></tr><tr><td>赤霞珠/西拉</td><td>波尔多杯</td><td>长身窄口</td><td>突出单宁</td></tr><tr><td>黑皮诺/佳美</td><td>勃艮第杯</td><td>矮身宽口</td><td>突出果香</td></tr><tr><td>霞多丽/长相思</td><td>白葡萄酒杯</td><td>小身窄口</td><td>保持酒温</td></tr><tr><td>香槟/起泡酒</td><td>香槟杯</td><td>细长窄口</td><td>保持气泡</td></tr><tr><td>波特酒/雪莉</td><td>波特酒杯</td><td>小身短脚</td><td>控制酒量</td></tr><tr><td>日常饮用</td><td>万能杯</td><td>中等大小</td><td>通用性强</td></tr></table></section>' +
  '<h3>💡 酒杯选购建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你是入门者，这里有几个选购建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>从万能杯开始</strong>——一款好的万能杯，可以应付大多数场合</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选透明玻璃</strong>——能更好地观察酒的颜色</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选薄壁酒杯</strong>——薄壁酒杯口感更好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选无铅水晶</strong>——比普通玻璃更透明、更耐用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要买太贵</strong>——入门者先买100-300元的酒杯即可</li></ul></section>' +
  '<h3>🚫 酒杯使用禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">使用酒杯时，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要握杯身</strong>——手的温度会影响酒温，应该握杯脚</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要倒太满</strong>——酒液应该倒到杯身最宽处，约1/3</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要用洗碗机</strong>——手洗更安全，避免划痕</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要共用酒杯</strong>——卫生问题，也影响品鉴体验</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要用纸杯</strong>——纸杯会影响酒的香气和口感</li></ul></section>' +
  '<h3>🔧 酒杯保养技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">好的酒杯需要正确保养：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>手洗</strong>——用温水和中性洗涤剂手洗</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>自然晾干</strong>——不要用毛巾擦，让其自然晾干</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>存放得当</strong>——倒挂或平放，避免杯口朝上</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免碰撞</strong>——水晶酒杯很脆弱，小心轻放</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>定期检查</strong>——有划痕的酒杯应该更换</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#7c4dff,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'好马配好鞍，好酒配好杯。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒杯是葡萄酒的舞台，选对酒杯，能让葡萄酒展现出最佳状态。不要忽视酒杯的选择，它会让你的饮酒体验更上一层楼。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你平时用什么酒杯喝酒？<br/>你最喜欢哪个品牌的酒杯？<br/>欢迎在评论区分享你的酒杯选择！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒酒杯选择指南：不同酒款配不同杯子',
      author: '红樽坊',
      digest: '选对酒杯，能让葡萄酒的风味提升30%。从波尔多杯到勃艮第杯，从白葡萄酒杯到香槟杯，这篇指南帮你选对杯子。',
      content: gen(),
      coverImage: 'wine_glass_guide_cover_ai.png',
      category: 'practical-guide',
      tags: ["酒杯", "器具", "选购", "品酒", "入门"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_glass_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Glass, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Glass:', e.message);
    process.exit(1);
  }
}

main();
