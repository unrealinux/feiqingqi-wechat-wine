const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDU8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+UqSDonrrml4vnm5Y95L2O56uv6YWS77yf5a6D5YW25a6e5q+U6L2vPC90ZXh0Pjx0ZXh0IHg9IjgwIiB5PSI0MDgiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iNTgiIGZvbnQtZmFtaWx5PSInTWljcm9zb2Z0IFlhSGVpJywnUGluZ0ZhbmcgU0MnLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj7mnKjloZ7mm7TpnaDosLE8L3RleHQ+CjxyZWN0IHg9IjAiIHk9IjU2MCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNzAiIGZpbGw9IiNmZmQ1NGYiIG9wYWNpdHk9IjAuOTIiLz4KPHRleHQgeD0iODAiIHk9IjYwNCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIzMCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj7nuqLphZLpob7pl64gwrcg5q+P5pel6YG/5Z2RPC90ZXh0Pgo8dGV4dCB4PSIxMTIwIiB5PSI2MDQiIHRleHQtYW5jaG9yPSJlbmQiIGZpbGw9IiMxYTEyMDYiIGZvbnQtc2l6ZT0iMjYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBvcGFjaXR5PSIwLjgiPmZlaXFpbmdxaTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🔩 螺旋盖=低端酒？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第5期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">看到螺旋盖就皱眉？很多人潜意识里把"软木塞=高级、螺旋盖=廉价"画了等号。这个偏见，连很多酒庄都想纠正。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍾 螺旋盖的真实身份</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">螺旋盖（金属旋盖）是20世纪末成熟的封装技术。它密封性极好、几乎零氧气渗入，能完美保留酒的果香和新鲜度。澳洲、新西兰的顶级酒庄，清一色用它。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⚖️ 螺旋盖 vs 软木塞</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">维度</th><th style="padding:10px;text-align:left;">螺旋盖</th><th style="padding:10px;text-align:left;">软木塞</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">密封稳定性</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极高，每瓶一致</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">有差异，看单宁</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">木塞污染风险</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">几乎为零</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">约2-5%有TCA污染</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">陈年能力</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">适合早-中期饮用</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统认为更利长期陈年</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">开瓶便利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">一拧即开</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">需开瓶器</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">☠️ 软木塞的隐形坑：木塞污染</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">软木塞最大的隐患是TCA污染——约每20-50瓶就有1瓶带霉味、湿纸板味，完全毁掉一瓶好酒。螺旋盖从根上消灭了这个问题。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❌ 为什么偏见还在</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🎩 "拔塞仪式感"让人误以为软木=高级</li><li style="margin:6px 0;color:#333;line-height:1.7;">📜 旧世界传统酒庄长期用软木，形成心理锚定</li><li style="margin:6px 0;color:#333;line-height:1.7;">📰 早期廉价餐酒多用螺旋盖，留下低端印象</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">封装方式只关乎"怎么保存酒"，不关乎"酒本身好不好"。一瓶新西兰顶级长相思用螺旋盖，恰恰是对品质的自信——它要确保你喝到的，和酒庄装瓶时一模一样。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 判断酒质看酒标上的产区、酒庄、年份，而不是看它是拧开还是拔开。下次别因为螺旋盖就放下那瓶好酒。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">螺旋盖不是退步，而是封装技术的一次进化。放下偏见，你的酒柜会少几瓶"被木塞毁掉的好酒"。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你是软木党还是螺旋盖党？评论区见 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🔩 螺旋盖=低端酒？它其实比软木塞更靠谱',
      author: '红酒顾问',
      digest: '螺旋盖早就是澳洲名庄的标配，密封稳定、不怕木塞污染。把封装方式当品质标准，是过时的偏见。',
      content: gen(),
      coverImage: 'myth_screwcap_cover_ai.png',
      category: 'wine-myth',
      tags: ["螺旋盖", "软木塞", "误区", "封装", "木塞污染"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_screwcap_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_screwcap, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_screwcap:', e.message);
    process.exit(1);
  }
}

main();
