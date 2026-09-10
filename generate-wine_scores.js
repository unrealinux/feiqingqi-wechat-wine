const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfk4og6JGh6JCE6YWS6K+E5YiG55yf55u477yaUlDjgIFKU+ivtOS6hueul+WQl++8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4mI3g3ZWEyOyYjeDkxNTI7JiN4OTg3ZTsmI3g5NWVlOzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">📊 葡萄酒评分真相</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">RP、JS说了算吗？ | 分数背后的真相</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">当你选购葡萄酒时，是否会被酒标或电商页面上的"RP 95""JS 98"所吸引？这些分数确实能简化选择，但它们真的代表你的口味吗？</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 主要评分体系</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">评分人/机构</th><th style="padding:10px;text-align:left;">体系</th><th style="padding:10px;text-align:left;">风格倾向</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">罗伯特·帕克 RP</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">100分制</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">重酒体、浓果味、高酒精（曾主导波尔多）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄酒倡导家 WA</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">100分制</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">帕克创办，团队评分</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">詹姆斯·萨克林 JS</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">100分制</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">偏好宏大、果味奔放的酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄酒观察家 WS</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">100分制</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">综合评分+年度百强</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒评家 Jancis Robinson</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">20分制</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">偏优雅、欧洲传统风格</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Decanter</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">20分制+五星</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">英国媒体视角的全面评价</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">💥 帕克效应</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">罗伯特·帕克在1982年波尔多期酒评级中一鸣惊人，此后他的分数直接影响酒庄定价。一瓶酒从"RP 89"升到"RP 90"，价格可能跳涨30%。这种"帕克效应"让全世界酿酒师一度趋同于酿造他喜欢的"大酒"风格。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⚠️ 评分的局限</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">👤 个人偏好：评论家口味≠你的口味，喜欢轻盈酒的人可能被高分"重酒"劝退</li><li style="margin:6px 0;color:#333;line-height:1.7;">📈 通胀现象：如今95分已成常态，100分不再稀缺</li><li style="margin:6px 0;color:#333;line-height:1.7;">💰 商业绑定：高分常与涨价同步，未必等值</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 适饮期：评分多针对"巅峰状态"，年轻时不代表当下好喝</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌍 风格趋同：为迎合评分，部分酒庄丧失个性</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 如何聪明地使用评分？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">评分是工具而非圣经。建议：找一位与你口味相近的评论家长期关注；把分数当"筛选器"而非"判决书"；结合产区、品种、年份综合判断；最重要的是——自己的舌头才是最终的裁判。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 实用策略：如果你是新手，参考评分能快速避开明显的差酒（85分以下慎选）；但当你有了一定经验，就该学会"背叛"分数，去探索那些评论家可能低估的、风格独特的小众酒款。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">分数可以帮你打开一扇门，但不能替你走完一段路。真正的好酒，是那个让你忍不住再倒一杯、忘记去查分数的酒。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '📊 葡萄酒评分真相：RP、JS说了算吗？',
      author: '红酒顾问',
      digest: '罗伯特·帕克100分制如何影响全球酒价？高分酒一定好喝吗？评分体系背后的商业逻辑与避坑指南。',
      content: gen(),
      coverImage: 'wine_scores_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["评分", "罗伯特帕克", "RP", "詹姆斯萨克林", "JS", "葡萄酒倡导家", "避坑"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_scores_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK wine_scores, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL wine_scores:', e.message);
    process.exit(1);
  }
}

main();
