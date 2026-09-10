const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MTA8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+NviDmqaHmnKjloZ7mr5Tonrrml4vnm5bpq5jnuqfvvJ/lsIHoo4Xmlrk8L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuW8j+S4jeetieS6juetiee6pzwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍾 橡木塞比螺旋盖高级？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第10期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这期是第5期"螺旋盖"的延伸版：很多人不仅觉得螺旋盖=低端，还反过来认为"橡木塞=高级"。两种判断，其实都掉进了同一个坑——用封口方式给酒分等级。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🪵 橡木塞为什么被神化</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">软木塞有上千年的历史，开瓶的"啵"声、闻塞的习惯、陈年传统都让它自带仪式感。旧世界名庄长期沿用，更强化了"好酒用软木"的心理暗示。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔧 但封装只是技术选择</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">考量</th><th style="padding:10px;text-align:left;">橡木塞</th><th style="padding:10px;text-align:left;">螺旋盖</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统/仪式感</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">强</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">弱</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">保鲜一致性</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">有波动</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极强</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">陈年适配</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统认为更优</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中短期更稳</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">适用酒款</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">旧世界/名庄</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">新世界/日常+部分名庄</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🚩 关键认知</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">越来越多顶级酒庄（尤其澳洲、新西兰，乃至部分勃艮第新锐）主动选用螺旋盖，恰恰是对品质负责——他们不想要任何一瓶因木塞污染而报废。</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🏆 用螺旋盖的，可能是严谨的名庄</li><li style="margin:6px 0;color:#333;line-height:1.7;">🪵 用软木塞的，也可能只是贴牌餐酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🔑 决定等级的是酒本身，不是那块塞子</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">把"橡木塞=高级"翻过来，同样不成立。封装是手段不是标签。真正分高低的，永远是杯中的酒——产区、年份、酿造，而不是你怎么把它打开。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 买酒时直接忽略封口方式，把注意力放在酒标信息和你的真实品尝上。这一条，能帮你省掉大量被"仪式感"收割的溢价。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">无论是"啵"地一声拔开，还是一拧即开，好酒的好，从来不在那声闷响里。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你更享受拔塞还是拧盖？评论区聊聊 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🍾 橡木塞比螺旋盖高级？封装方式不等于等级',
      author: '红酒顾问',
      digest: '软木塞有传统仪式感，但旋盖在保鲜稳定性上更胜一筹。用封口方式评判酒的高低，是典型的外行判断。',
      content: gen(),
      coverImage: 'myth_corkgrade_cover_ai.png',
      category: 'wine-myth',
      tags: ["软木塞", "螺旋盖", "误区", "封装", "等级"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_corkgrade_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
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
    console.log('OK myth_corkgrade, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_corkgrade:', e.message);
    process.exit(1);
  }
}

main();
