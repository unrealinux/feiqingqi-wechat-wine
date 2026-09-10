const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDQ8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+Hq/Cfh7cg5rOV5Zu96YWS5LiA5a6a5q+U5paw5LiW55WM5aW977yf5YirPC90ZXh0Pjx0ZXh0IHg9IjgwIiB5PSI0MDgiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iNTgiIGZvbnQtZmFtaWx5PSInTWljcm9zb2Z0IFlhSGVpJywnUGluZ0ZhbmcgU0MnLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj7ooqvkuqfljLrlhYnnjq/pqpfkuoY8L3RleHQ+CjxyZWN0IHg9IjAiIHk9IjU2MCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNzAiIGZpbGw9IiNmZmQ1NGYiIG9wYWNpdHk9IjAuOTIiLz4KPHRleHQgeD0iODAiIHk9IjYwNCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIzMCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj7nuqLphZLpob7pl64gwrcg5q+P5pel6YG/5Z2RPC90ZXh0Pgo8dGV4dCB4PSIxMTIwIiB5PSI2MDQiIHRleHQtYW5jaG9yPSJlbmQiIGZpbGw9IiMxYTEyMDYiIGZvbnQtc2l6ZT0iMjYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBvcGFjaXR5PSIwLjgiPmZlaXFpbmdxaTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🇫🇷 法国酒一定比新世界好？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第4期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">"要喝就喝法国酒"是很多人的执念。法国酒当然有顶级货，但把"法国"当成品质保证，往往会为品牌溢价多花冤枉钱。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌍 新世界早就不是"便宜货"</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">智利、阿根廷、澳洲、新西兰、美国——这些"新世界"产区的酿酒技术、设备、葡萄园管理早已世界一流。很多酒的精度和平衡度，不输同价位法国酒。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">同价位对比</th><th style="padding:10px;text-align:left;">法国酒</th><th style="padding:10px;text-align:left;">新世界酒</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">100元档</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">入门餐酒，果味普通</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">智利赤霞珠/澳洲西拉更饱满好喝</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">300元档</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">大区级，性价比一般</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿根廷马尔贝克/新西兰黑皮诺更出彩</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">千元以上</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">列级庄有底蕴</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">纳帕/勃艮第新锐同样精彩</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔎 法国酒的真实优势</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">法国酒的优势在"顶级段"：波尔多列级、勃艮第特级园，风土的复杂度和陈年潜力确实难以复制。但日常饮用，这个优势并不明显。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❌ 盲目追法国的代价</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">💸 为"法国"二字支付品牌溢价</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏷️ 买到贴牌/大流通货，品质平平</li><li style="margin:6px 0;color:#333;line-height:1.7;">😵 被复杂分级（AOC/AOP）绕晕，反而选错</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌱 错过新世界高性价比宝藏</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">产区是参考不是标签。一瓶好喝、适合你口味和预算的酒，是法国还是智利并不重要。把"法国=好"换成"这瓶本身好不好喝"，你会在酒架上少交很多学费。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 新手进阶路线：先用新世界酒把"果味、酒体、单宁"基础味觉建立起来，再回头喝法国，才品得出风土的门道。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">尊重法国酒的底蕴，但不必神化它。葡萄酒的世界是平的，好喝才是唯一的国籍。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你更爱法国还是新世界？评论区站队 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🇫🇷 法国酒一定比新世界好？别被产区光环骗了',
      author: '红酒顾问',
      digest: '法国酒有底蕴，但新世界的智利、阿根廷、澳洲早就能打。同价位下，盲目追法国往往亏了性价比。',
      content: gen(),
      coverImage: 'myth_france_cover_ai.png',
      category: 'wine-myth',
      tags: ["法国酒", "新世界", "误区", "性价比", "产区"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_france_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_france, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_france:', e.message);
    process.exit(1);
  }
}

main();
