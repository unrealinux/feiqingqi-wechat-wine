const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjo4g5Lit6aSQ5a605bit6YWN6YWS5oyH5Y2X77ya5LuO5YeJ6I+c5Yiw55Sc5ZOB55qE5a6M576OPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumFjemFkuaWueahiDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🎎 中餐宴席配酒指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">从凉菜到甜品的完美配酒方案 | 商务宴请·年夜饭·婚宴</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">中国式宴席通常有完整的上菜顺序：先冷盘、后热菜、再主菜、最后甜品或水果。一桌宴席覆盖了各种味型和食材，只用一款酒很难满足全程需求。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">最理想的做法是准备2-3款酒，随菜品的推进而变换。以下是宴席配酒的"标准版"和"进阶版"方案。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍶 标准版：三道酒打天下</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">阶段</th><th style="padding:10px;text-align:left;">菜品</th><th style="padding:10px;text-align:left;">推荐酒</th><th style="padding:10px;text-align:left;">选择理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">开场</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冷盘：凉拌黄瓜、酱牛肉、皮蛋豆腐</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟/起泡酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气泡开胃，百搭所有凉菜</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">热菜</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">炒菜、烧菜、蒸菜</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">黑皮诺/雷司令</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">不挑菜，红白皆可的中场主力</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">主菜</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">整鱼、大虾、扣肉、全鸡</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">赤霞珠/西拉/夏布利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">结构感强的重头戏酒款</td></tr></tbody></table></div>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">在标准版方案中，起泡酒+黑皮诺+一款重头酒的单品组合已经可以覆盖大部分宴席场景。要点是不要只带一款红酒撑全程——前半场的凉菜配红酒往往不理想。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 进阶版：五道菜的完美配酒</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">第一轮：冷盘/凉菜 → 起泡酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">凉菜通常涉及醋、酱油、辣椒油、蒜泥等多种调味。推荐Franciacorta或Cava，细腻的气泡能平衡各种调味汁，酸度提振食欲。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">第二轮：热菜（清炒/清蒸类）→ 白葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">清炒时蔬、清蒸鱼、白灼虾等清淡热菜上桌时，推荐夏布利或新西兰长相思。高酸度提鲜，矿物感与蒸菜的原味完美配合。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">第三轮：热菜（红烧/焖炖类）→ 轻盈红葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">红烧肉、东坡肉、焖牛腩等浓郁菜肴上桌时，推荐黑皮诺或桑娇维塞。中等单宁可以中和脂肪，果味不会被浓郁的酱汁淹没。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">第四轮：主菜（整鱼/大虾/全鸡）→ 重头酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">宴席的高潮部分，推荐波尔多混酿或巴罗洛等具有陈年潜力的名庄酒。这一道酒既是配菜，也是宴席的话题焦点。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">第五轮：甜品/水果 → 甜酒</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">传统中式甜品如红豆沙、八宝饭、拔丝地瓜等，推荐匈牙利托卡伊Aszú或德国冰酒。如果甜品甜度不高，也可以用半干雷司令过渡。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🧧 特殊宴席场景建议</h2>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">年夜饭</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">建议以香槟开场（庆祝氛围），主菜用波尔多/勃艮第一级（丰盛感），收尾用甜酒搭配年糕/汤圆（团圆甜蜜）。预算允许的话可以开一瓶年份香槟作为惊喜。</p></div>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">商务宴请</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">以已开瓶的成熟波尔多或勃艮第为主，配一白一红的组合。中餐配酒选经典产区的经典酒款最稳妥，避免过于小众或风格极端的酒。建议提前醒酒1-2小时。</p></div>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">婚宴</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">起泡酒是最佳的开场酒（仪式感），主桌配波尔多或里奥哈（气派），大众桌则选果味充沛的智利或澳洲酒（性价比）。建议每桌至少放一瓶白葡萄酒供女士选择。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 宴席配酒黄金法则：中国人的宴席是"以菜为纲"而不是"以酒为纲"——酒是锦上添花，不是主角。所以选酒的首要原则是"不犯错"，而不是追求惊艳。经典产区、经典酒款、经典搭配——任何宴席都不会出错。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">中餐宴席配酒的终极秘诀其实很简单：备好起泡酒、白葡萄酒、红葡萄酒三种，随着菜品从清淡到浓郁的推进依次登场，你的客人一定会感受到你的用心与专业。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🎎 中餐宴席配酒指南：从凉菜到甜品的完美配酒方案',
      author: '红酒顾问',
      digest: '商务宴请、年夜饭、婚宴……中国人最重要的饭桌上，如何从头到尾配好酒？凉菜、热菜、主菜、甜品，一篇全搞定。',
      content: gen(),
      coverImage: 'chinese_banquet_pairing_cover_ai.png',
      category: 'wine-food',
      tags: ["中餐", "宴席", "配酒", "商务宴请", "年夜饭", "婚宴", "配餐", "中餐配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'chinese_banquet_pairing_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const f = new FormData();
    f.append('media', cb, {filename: 'cover.png', contentType: 'image/png'});
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
    console.log('✅ chinese_banquet_pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ chinese_banquet_pairing:', e.message);
    process.exit(1);
  }
}

main();
