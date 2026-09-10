const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFiNWUyMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfj6Ag6JGh6JCE6YWS5YKo5a2Y5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7liKvorqnkvaDnmoTlpb3phZLlj5jphos8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5rip5bqmIMK3IOa5v+W6piDCtyDlhYnnur8gwrcg6ZyH5YqoIMK3IOaRhuaUviDCtyDplb/mnJ/lgqjlrZg8L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7lgqjlrZjmjIfljZcgwrcg57qi6YWS6aG+6ZeuPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1b5e20; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1b5e20; border-bottom: 2px solid #4caf50; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1b5e20; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1b5e20;">🏠 葡萄酒储存指南</h2>' +
  '<p style="text-align:center;color:#666;">别让你的好酒变醋 | 温度 · 湿度 · 光线 · 震动 · 摆放</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人买了好酒却不知道怎么储存，结果开瓶时发现酒已经变质。葡萄酒储存其实不难，掌握5个关键要素，就能让你的好酒保持最佳状态。</p></section>' +
  '<h3>🌡️ 要素一：温度</h3>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 没有酒柜怎么办？</h4><p style="color:#333;line-height:1.8;margin:0">冰箱只能短期存放（1-2周），长期存放会太冷太干燥。空调房的温度波动太大。最佳方案是买一个恒温酒柜（¥1,000-5,000），或者找一个阴凉、恒温的角落（比如衣柜深处）。</p></div></section>' +
  '<h3>💧 要素二：湿度</h3>' +
  '<h3>🌑 要素三：光线</h3>' +
  '<h3>📳 要素四：震动</h3>' +
  '<h3>🍷 要素五：摆放</h3>' +
  '<h3>⏰ 不同酒款的储存时间</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款类型</th><th>最佳储存时间</th><th>说明</th></tr><tr><td>日常白葡萄酒</td><td>1-2年</td><td>越新鲜越好喝</td></tr><tr><td>日常红葡萄酒</td><td>2-3年</td><td>果味型为主</td></tr><tr><td>优质白葡萄酒</td><td>5-10年</td><td>勃艮第白、雷司令</td></tr><tr><td>优质红葡萄酒</td><td>10-20年</td><td>波尔多、巴罗洛</td></tr><tr><td>顶级陈年酒</td><td>20-50年</td><td>拉菲、罗曼尼康帝</td></tr><tr><td>甜酒/贵腐</td><td>20-30年</td><td>苏玳、托卡伊</td></tr><tr><td>起泡酒/香槟</td><td>3-5年</td><td>年份香槟可更长</td></tr></table></section>' +
  '<h3>❌ 常见储存误区</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 放在厨房——温度波动大，有异味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 放在客厅展示柜——光线太强，温度太高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 放在车里——温度波动致命</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 竖放软木塞酒——软木塞会干裂</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 和食物混放——异味会渗透酒瓶</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 放在地下室但不控温——温度波动仍然危险</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 简易储存方案</h4><p style="color:#333;line-height:1.8;margin:0">如果没有专业酒柜，找一个阴凉、恒温、避光、无震动的角落（比如衣柜深处、书房角落），用纸箱或木箱装好酒瓶，横放存放。这样可以保存1-2年。</p></div></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">好酒需要好储存。一瓶¥1,000的名庄酒，如果储存不当，开瓶时可能只值¥100。</p></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#4caf50,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 好酒配好储存 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🏠 葡萄酒储存指南：别让你的好酒变醋',
      author: '红酒顾问',
      digest: '温度、湿度、光线、震动、摆放——5个维度教你正确储存葡萄酒，避免好酒变质。',
      content: gen(),
      coverImage: 'wine_storage_guide_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["储存", "保存", "酒柜", "温度", "湿度", "长期储存"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_storage_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ wine_storage_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ wine_storage_guide:', e.message);
    process.exit(1);
  }
}

main();
