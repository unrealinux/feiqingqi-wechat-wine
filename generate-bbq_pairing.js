const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjZYg54On54Ok6YWN6YWS5oyH5Y2X77ya5Lq66Ze054Of54Gr5rCU55qE576O5aaZ5pCt6YWNPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPiYjeDdlYTI7JiN4OTE1MjsmI3g5ODdlOyYjeDk1ZWU7PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPmZlaXFpbmdxaSBXZUNoYXQgTVA8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍖 烧烤配酒指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">人间烟火气的美妙搭配 | 路边摊到韩式烤肉的完全攻略</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">烧烤——最原始、最有烟火气的烹饪方式。炭火炙烤、油脂滴落、焦香四溢……这种刻在人类DNA里的美味，与葡萄酒的搭配其实大有文章可做。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥩 中式烧烤（烤串）搭配</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">羊肉串/牛肉串</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">孜然和辣椒面是羊肉串的灵魂。推荐南法GSM混酿（歌海娜-西拉-慕合怀特）或澳洲西拉，香料味的红酒与孜然相得益彰，饱满的酒体撑得住羊肉的浓郁。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">烤鸡翅/烤鸡腿</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">蜜汁或奥尔良风味的烤鸡翅，推荐博若莱特级村或黑皮诺。果味清爽、单宁柔和，不会压过鸡肉的细腻风味，微凉的温度还能解腻。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">烤生蚝/烤扇贝</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">蒜蓉是烤海鲜的灵魂伴侣。推荐长相思或夏布利，高酸度搭配蒜香和海鲜是绝配。如果想尝试更有趣的搭配，可以试试西班牙Albariño。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">烤韭菜/烤茄子</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">蔬菜类烧烤适合搭配灰皮诺或意大利Verdicchio，清爽简单，不抢蔬菜的本味。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🇰🇷 韩式烤肉搭配</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">韩式烤肉的特色是生菜包肉、蘸酱、配泡菜，味道层次丰富。推荐黑皮诺或歌海娜，果味充足可以呼应蘸酱的甜辣，单宁轻柔不会和泡菜的酸味产生不愉快的反应。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🇯🇵 日式烧肉搭配</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">日式烧肉注重肉质的原味，尤其是高等级的和牛。推荐成熟的黑皮诺（勃艮第或新西兰），优雅的花果香与和牛的油脂融合，仿佛牛油融化在酒中。也可尝试德国黑皮诺（Spatburgunder），更加细腻。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍖 西式BBQ搭配</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">烤肉类型</th><th style="padding:10px;text-align:left;">推荐酒</th><th style="padding:10px;text-align:left;">理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">烤猪肋排（甜酱）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">澳洲西拉/仙粉黛</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果酱般的风味匹配甜酱</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">烤牛排（原味）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">赤霞珠/马尔贝克</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">饱满单宁匹配肉质纤维</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">烤鸡（香草）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">长相思/赛美蓉</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">草本香气呼应香草腌料</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">烤羊排（迷迭香）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">波尔多混酿</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">结构感匹配羊排的浓郁</td></tr></tbody></table></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 烧烤配酒的核心原则：焦香配饱满，香料配香料，甜酱配果味。烧烤的炭烤风味本身就非常强大，配酒太弱会被淹没，太强又会抢戏——要找到那个"门当户对"的平衡点。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 最佳性价比搭配推荐</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">烧烤配酒不一定要名庄。以下几点建议让你的每一分钱都花在刀刃上：</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇺 澳洲西拉（Hunter Valley/Clare Valley）¥100-200，羊肉串最佳搭档</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 南罗讷GSM混酿 ¥100-300，万能烧烤酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇳🇿 新西兰黑皮诺 ¥150-300，韩式烤肉、鸡翅首选</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇨🇱 智利佳美娜 ¥80-150，性价比之选</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇪🇸 西班牙Cava起泡酒 ¥80-150，烤海鲜最佳搭档</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">烧烤最美妙的地方在于它的随意与自由。不需要太讲究，不需要太拘束——打开的肉串，倒上的酒，这就是生活最美好的样子。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍖 烧烤配酒指南：人间烟火气的美妙搭配',
      author: '红酒顾问',
      digest: '烧烤配什么酒最过瘾？羊肉串配什么？烤生蚝配什么？从路边摊到烤肉店，从孜然到蜜汁，烧烤配酒全攻略。',
      content: gen(),
      coverImage: 'bbq_pairing_cover_ai.png',
      category: 'wine-food',
      tags: ["烧烤", "配酒", "羊肉串", "烤肉", "BBQ", "博若莱", "中餐配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'bbq_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ bbq_pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ bbq_pairing:', e.message);
    process.exit(1);
  }
}

main();
