const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MTE8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+Pt++4jyDphZLmoIfotorljY7kuL3phZLotorlpb3vvJ/mvILkuq7nmoQ8L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWMheijheS4jeetieS6juWlvemFkjwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🏷️ 酒标越华丽酒越好？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第11期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">货架上金色浮雕礼盒装的酒，和旁边朴素小瓶，你会选哪个？很多人下意识选包装漂亮的——毕竟"看着贵"。但包装和酒质，往往是两回事。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎭 包装的"障眼法"</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">酒的包装成本：一个浮雕木盒¥10-30，一个绒布内衬礼盒¥20-50，再配上手提袋，包装成本可能已经超过了瓶中酒本身的价值。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📊 包装 vs 酒质的真实关系</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">包装类型</th><th style="padding:10px;text-align:left;">真实含义</th><th style="padding:10px;text-align:left;">警惕信号</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">华丽木盒/礼盒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">提升送礼仪式感</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒本身可能只是入门餐酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">金色浮雕/烫金</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">营销包装，吸引眼球</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒质与包装不成正比</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">法文密集酒标</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">营造"进口高级"感</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">可能是贴牌或灌装酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">简洁小瓶/无盒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒庄注重酒本身</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">往往是精品小众酒</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔍 酒标上该看什么信息</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">📍 产区：具体到村庄/地块比"法国进口"更有价值</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏰 酒庄名：搜索酒庄口碑比看图案有用</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 品种：知道喝的是什么葡萄比知道图案是什么重要</li><li style="margin:6px 0;color:#333;line-height:1.7;">📅 年份：新鲜还是陈年，一眼可判</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏷️ 等级：AOC/AOP/DOCG等法定等级是底线保障</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">真正的好酒庄，往往把预算花在酿酒上而不是包装上。那些酒标简洁但产区、酒庄信息清晰的酒，反而更可能是有底蕴的好酒。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 一个判断技巧：包装成本超过酒本身价值的酒，酒质通常不会太高。¥100以内的酒，有盒子的往往没盒子的好喝。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">酒是喝的，不是看的。下次面对华丽礼盒时，先看一眼盒子里那瓶酒的产区和酒庄——答案可能让你惊喜，也可能让你放下它。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你买过最"华而不实"的酒是哪瓶？评论区吐槽 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🏷️ 酒标越华丽酒越好？漂亮的包装不等于好酒',
      author: '红酒顾问',
      digest: '华丽礼盒、金色浮雕、法文酒标，这些包装手段常被用来给低价酒"抬咖"。真正的品质藏在酒标信息里，而不是图案上。',
      content: gen(),
      coverImage: 'myth_label_cover_ai.png',
      category: 'wine-myth',
      tags: ["酒标", "包装", "误区", "选购", "避坑"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_label_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_label, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_label:', e.message);
    process.exit(1);
  }
}

main();
