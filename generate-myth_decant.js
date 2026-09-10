const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDM8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+NtyDnuqLphZLkuIDlrpropoHphpLphZLvvJ/kubHphpLlj43ogIzmr4E8L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS6huS4gOeTtuWlvemFkjwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍷 红酒一定要醒酒？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第3期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">打开一瓶红酒，先倒进醒酒器——这成了很多人的"仪式感"。但醒酒用错了，不仅没帮助，还会把好酒醒"死"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌬️ 醒酒到底在干嘛</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">醒酒的核心是让酒接触氧气：一是挥发刺鼻的硫化物、还原味；二是让封闭的香气打开；三是柔化年轻酒粗糙的单宁。但它不是魔法，过犹不及。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">✅ 这些酒才需要醒</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">酒的类型</th><th style="padding:10px;text-align:left;">建议</th><th style="padding:10px;text-align:left;">原因</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">年轻重单宁红（赤霞珠/西拉）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">醒30-60分</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">柔化单宁、打开香气</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">顶级陈年潜力红</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">醒1-2小时</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">唤醒沉睡的复杂层次</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">有还原味/臭鸡蛋味的酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">醒15-30分</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">挥发硫化物</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">老年份波尔多</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">小心醒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">短时滗酒去沉淀即可</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❌ 这些酒别醒</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍒 黑皮诺/佳美：香气娇贵，醒久了果味散尽</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥂 老酒（20年以上）：一接触空气迅速衰败</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 芳香型白酒（雷司令/长相思）：喝的就是清新，别醒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍾 起泡酒：气泡全跑光</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">判断要不要醒，记住一句话：单宁重、还年轻、有怪味——才需要醒。轻盈、老、芬芳的酒，开瓶即饮最好。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🛠️ 没有醒酒器怎么办</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">其实不用专门买醒酒器。倒杯里多晃几下、或用"瓶醒"（开瓶后静置）也能达到类似效果。普通餐酒根本不必折腾。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 一个实用招：倒一杯先尝，觉得紧涩封闭再决定醒。让舌头告诉你，而不是让"规矩"告诉你。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">醒酒是工具不是教条。用对了锦上添花，用错了画蛇添足。下次开瓶前，先问问这酒"需不需要被叫醒"。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你醒错过酒吗？评论区聊聊 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🍷 红酒一定要醒酒？乱醒反而毁了一瓶好酒',
      author: '红酒顾问',
      digest: '醒酒不是红酒的标配。年轻重酒才需要醒，轻盈老酒一醒就散。一文讲清什么该醒、什么别碰。',
      content: gen(),
      coverImage: 'myth_decant_cover_ai.png',
      category: 'wine-myth',
      tags: ["醒酒", "误区", "侍酒", "新手", "黑皮诺"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_decant_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_decant, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_decant:', e.message);
    process.exit(1);
  }
}

main();
