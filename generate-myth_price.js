const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDg8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+SsCDnuqLphZLotorotLXotorlpb3llp3vvJ/ku7fmoLzlkozlj6PmhJ88L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuW4uOW4uOiEseiKgjwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">💰 红酒越贵越好喝？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第8期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">"这瓶贵，肯定好喝"——价格常常被当成品质的代名词。但红酒的"好喝"极度主观，贵和合你口味之间，往往隔着一条不小的沟。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">💸 贵酒的钱花在哪了</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">高价来自稀缺性、名庄声誉、陈年成本、评分炒作，而不全是"口感更好"。一瓶2000元的列级庄，可能复杂有余、亲和力不足，新手喝着反而觉得"又酸又涩"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📊 价格与好喝的关系</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">价位</th><th style="padding:10px;text-align:left;">典型体验</th><th style="padding:10px;text-align:left;">适合谁</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">50-150</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味直接、简单易饮</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">日常佐餐、新手</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">150-500</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">有结构、有层次</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">进阶爱好者</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">500-2000</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">复杂、需细品</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">资深饮家</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">2000+</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">名庄/陈年，风土表达</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">收藏、特殊场合</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🙅 价格陷阱</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🏷️ 礼盒装虚高：包装成本算进酒价</li><li style="margin:6px 0;color:#333;line-height:1.7;">⭐ 盲目追高分：评分高≠对你胃口</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 产区溢价：为"法国/波尔多"名头买单</li><li style="margin:6px 0;color:#333;line-height:1.7;">📈 炒作酒：网红款价格虚高</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">好喝是唯一标准，而好喝由你的舌头定义，不由价签定义。一瓶200块的果味黑皮诺，可能比2000块的严肃波尔多更让你想再倒一杯——那它就是对你而言"更好喝"的酒。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 建立自己的"价格甜蜜点"：在100-300元区间多尝试不同品种产区，找到最对胃口的类型，比盲目追贵有效得多。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">贵酒值得尊重，但不必迷信。让舌头做主，而不是让钱包替你尝味。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你喝过最值/最坑的一瓶是多少钱？评论区晒 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '💰 红酒越贵越好喝？价格和口感常常脱节',
      author: '红酒顾问',
      digest: '贵酒有贵的道理，但"好喝"是主观的。很多200块的酒比2000块的更对你的胃口。别让价格绑架舌头。',
      content: gen(),
      coverImage: 'myth_price_cover_ai.png',
      category: 'wine-myth',
      tags: ["价格", "性价比", "误区", "选购", "新手"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_price_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_price, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_price:', e.message);
    process.exit(1);
  }
}

main();
