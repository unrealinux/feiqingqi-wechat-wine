const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfpYIg6LW35rOh6YWS5YWo5oyH5Y2X77ya5LiN5q2i6aaZ5qef55qE5qyi5bqG5LmL6YCJPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🥂 起泡酒全指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">不止香槟的欢庆之选 | 气泡背后的秘密</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">提起起泡酒，大多数人第一反应就是香槟。但香槟只是起泡酒的冰山一角。从意大利的普罗塞克到西班牙的卡瓦，从法国的克雷芒到德国的塞克特，起泡酒的世界精彩纷呈。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🫧 气泡从哪来？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">起泡酒的气泡来自二次发酵产生的二氧化碳。主要有三种方法：传统法（香槟法）成本最高、气泡最细腻；罐式法（夏尔马法）成本低、果味清新；自然起泡法（ Ancestral）最原始。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌍 主要起泡酒类型</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">名称</th><th style="padding:10px;text-align:left;">产地</th><th style="padding:10px;text-align:left;">方法</th><th style="padding:10px;text-align:left;">特点</th><th style="padding:10px;text-align:left;">价位</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟 Champagne</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国香槟区</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">复杂酵母香、细腻气泡</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">高（¥300+）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">卡瓦 Cava</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">西班牙</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">性价比高、偏干型</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低（¥80-200）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">普罗塞克 Prosecco</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">罐式法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味清新、甜美易饮</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低（¥80-200）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">克雷芒 Crémant</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国其他产区</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟平替、品质好</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中（¥120-300）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">塞克特 Sekt</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">德国/奥地利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">混合</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">清爽高酸、风格多样</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低-中</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿斯蒂 Asti</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">罐式法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低酒精甜型、花香</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低（¥80-150）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Franciacorta</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">传统法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利香槟、高品质</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中-高</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍬 甜度分级</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">起泡酒的甜度从干到甜有明确分级（以香槟为例）：天然干（Brut Nature，0-3g/L）、超天然（Extra Brut）、天然（Brut，最经典）、极干（Extra Dry）、干（Sec）、半干（Demi-Sec）、甜（Doux）。日常佐餐推荐Brut级别。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥂 如何选择？</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🎉 纯庆祝、不配餐 → 香槟Brut或卡瓦，仪式感拉满</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍓 新手入门、喜欢果味 → 普罗塞克，甜美好喝零门槛</li><li style="margin:6px 0;color:#333;line-height:1.7;">💰 预算有限又要品质 → 法国克雷芒，香槟工艺平替</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍽️ 配餐（海鲜、炸物）→ 香槟Blanc de Blancs或夏布利起泡</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍰 配甜品 → 半干香槟或阿斯蒂</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 常见误区：只有香槟区产的起泡酒才能叫香槟！其他地区用同样工艺生产的只能叫"传统法起泡酒"。买香槟认准酒标上的"Champagne"字样，而不是看瓶子形状。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 开瓶与侍酒</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">起泡酒最佳侍酒温度6-8°C。开瓶时切勿对着人，缓慢旋转瓶身让木塞自然弹出。倒酒时先倒1/3，等气泡稳定后再续杯，避免溢出。用 flute 细长杯能聚香，用 tulip 郁金香杯更利于香气展开。</p>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">起泡酒是葡萄酒世界里最"民主"的一类——它既能是几百块的庆典之王，也能是几十块的日常小确幸。别被香槟的光环吓到，找到适合自己口味和预算的那一瓶，才是真正的快乐。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🥂 起泡酒全指南：不止香槟的欢庆之选',
      author: '红酒顾问',
      digest: '香槟、普罗塞克、卡瓦、克雷芒、塞克特……起泡酒世界远比你想象的丰富。气泡从哪来？怎么选才不踩坑？',
      content: gen(),
      coverImage: 'sparkling_guide_cover_ai.png',
      category: 'wine-style',
      tags: ["起泡酒", "香槟", "普罗塞克", "卡瓦", "克雷芒", "气泡酒", "庆祝"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'sparkling_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK sparkling_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL sparkling_guide:', e.message);
    process.exit(1);
  }
}

main();
