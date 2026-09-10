const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJlN2QzMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuWCqOWtmOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5aaC5L2V5L+d5a2Y5aW96YWSPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuiuqeS9oOeahOWlvemFkuS/neaMgeacgOS9s+eKtuaAgTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWunueUqOaMh+WNlzwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#2e7d32;">葡萄酒储存指南：如何保存好酒</h2>' +
  '<p style="text-align:center;color:#666;">让你的好酒保持最佳状态</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">买了很多酒却不知道怎么储存？从温度到湿度，从光照到震动，这篇指南教你正确储存葡萄酒，让你的好酒保持最佳状态。</p></section>' +
  '<h3>🌡️ 温度：最重要的因素</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">温度是储存葡萄酒最重要的因素：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>最佳温度</strong>——12-14°C</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>可接受范围</strong>——10-18°C</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免</strong>——温度波动大、高于20°C、低于5°C</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——温度过高加速陈年，过低冻裂酒瓶</li></ul></section>' +
  '<h3>💧 湿度：保持软木塞</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">湿度也很重要：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>最佳湿度</strong>——60-70%</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免</strong>——湿度过低导致软木塞干裂，过高导致酒标发霉</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>方法</strong>——在酒柜中放一碗水，保持湿度</li></ul></section>' +
  '<h3>🌑 光照：避免紫外线</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">光照会损害酒质：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免</strong>——阳光直射、荧光灯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——紫外线会分解酒中的有机化合物</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>方法</strong>——存放在阴暗处，或使用防紫外线酒柜</li></ul></section>' +
  '<h3>📳 震动：减少晃动</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">震动会影响酒质：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免</strong>——频繁移动、放在冰箱门上</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——震动会加速陈年，破坏酒液结构</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>方法</strong>——存放在稳定的地方，不要频繁移动</li></ul></section>' +
  '<h3>🍷 摆放方式</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">正确的摆放方式：</p>' +
  '<h3>📊 不同场景的储存方案</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>方案</th><th>预算</th></tr><tr><td>有酒柜</td><td>专业恒温酒柜</td><td>已有</td></tr><tr><td>无酒柜</td><td>阴暗角落+横放</td><td>0元</td></tr><tr><td>少量存酒</td><td>冰箱冷藏层（临时）</td><td>0元</td></tr><tr><td>长期存酒</td><td>专业酒窖或高端酒柜</td><td>2000元+</td></tr><tr><td>旅行携带</td><td>便携酒袋+保温</td><td>50-100元</td></tr></table></section>' +
  '<h3>🚫 储存禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">储存葡萄酒时，这些禁忌要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要放在厨房</strong>——温度变化大</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要放在阳台</strong>——阳光直射</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要放在冰箱门上</strong>——震动大</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要竖放软木塞酒</strong>——软木塞会干裂</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要频繁移动</strong>——震动影响酒质</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'储存是保存好酒的关键。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">正确的储存方式可以让你的好酒保持最佳状态。记住温度、湿度、光照、震动这四个关键因素。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你平时怎么储存葡萄酒？<br/>你有什么储存小技巧？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒储存指南：如何保存好酒',
      author: '红樽坊',
      digest: '买了很多酒却不知道怎么储存？从温度到湿度，从光照到震动，这篇指南教你正确储存葡萄酒。',
      content: gen(),
      coverImage: 'wine_storage_real_cover_ai.png',
      category: 'practical-guide',
      tags: ["储存", "保存", "酒柜", "温度", "湿度"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_storage_real_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Storage, media_id:', d.data.media_id);
  }catch(e){
    console.error('Storage:', e.message);
    process.exit(1);
  }
}

main();
