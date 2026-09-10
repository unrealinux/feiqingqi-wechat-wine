const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjKHvuI8g6JGh6JCE6YWS5LiO5rCU5YCZ5Y+Y5pqW77ya5Lqn5Yy65q2j5Zyo5YyX56e7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🌡️ 葡萄酒与气候变暖</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">产区正在北移 | 气候如何重塑杯中世界</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒是"气候的日记"——葡萄对温度变化极其敏感，全球变暖正在以前所未有的速度改写这张写了几千年的葡萄酒地图。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🗺️ 产区北移（或上移）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">传统顶级产区多位于葡萄种植的"边缘地带"（气候凉爽，才能保持酸度与平衡）。气候变暖让这些产区变得过热，却让原本太冷的地区焕发新生：</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">变化</th><th style="padding:10px;text-align:left;">表现</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">英国南部</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气候变暖使英国成功酿造"英式香槟"，品质惊艳</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">加拿大</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气温上升威胁冰酒所需的自然冰冻条件</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟/勃艮第</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">采收期提前2-3周，酸度下降风险</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">高山/高纬产区</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">德国、奥地利、 Tasmania 潜力上升</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">温暖产区</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙、澳大利亚面临极端高温与干旱</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌡️ 具体冲击</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">📅 采收提前：全球葡萄酒采收期比30年前平均提前约2周</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 酒精度上升：更成熟的葡萄=更高糖度=更高酒精（常见14.5%+）</li><li style="margin:6px 0;color:#333;line-height:1.7;">⚖️ 失去平衡：酸度下降、果味过熟，优雅感受损</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏜️ 极端天气：霜冻、冰雹、干旱、森林火灾频次增加</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 品种迁移：黑皮诺北移，耐热品种（如歌海娜）更受青睐</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🛡️ 行业的应对</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">酿酒师并非坐以待毙。他们通过提早采收、选择抗性砧木、混种耐热的本地品种、向高海拔迁移葡萄园等方式积极应对。一些前瞻酒庄甚至开始在挪威、丹麦等"新边疆"试种葡萄。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 给消费者的启示：关注"凉爽产区"的崛起——英国起泡酒、德国传统产区的红葡萄酒、高海拔的阿根廷萨尔塔，这些因气候变暖而受益的产区，往往性价比突出且风格清新，是未来十年的宝藏。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">气候变暖是葡萄酒界最严肃的议题之一。它提醒我们：每一杯酒都依赖于微妙而脆弱的生态平衡。珍惜杯中物，也是珍惜我们共同的地球。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🌡️ 葡萄酒与气候变暖：产区正在北移',
      author: '红酒顾问',
      digest: '全球变暖正在改写葡萄酒地图。英国开始酿香槟，加拿大冰酒受威胁，传统产区面临生死考验。气候如何重塑杯中世界？',
      content: gen(),
      coverImage: 'climate_wine_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["气候变暖", "气候变化", "产区北移", "英国起泡酒", "早熟", "可持续", "未来"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'climate_wine_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
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
    console.log('OK climate_wine, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL climate_wine:', e.message);
    process.exit(1);
  }
}

main();
