const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfkanigI3wn4y+IOWls+aAp+mFv+mFkuW4iO+8muiiq+W/veinhueahOiRoeiQhOmFkuWKm+mHjzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4mI3g3ZWEyOyYjeDkxNTI7JiN4OTg3ZTsmI3g5NWVlOzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">👩‍🌾 女性酿酒师</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">被忽视的葡萄酒力量 | 她们重新定义风土</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒世界长期由男性主导叙事，但女性的身影从一开始就不可或缺。从19世纪独自撑起酒庄的寡妇，到当代改变行业格局的传奇酿酒师，她们的贡献长期被低估。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👑 传奇人物</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">人物</th><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">贡献</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">拉露·比兹-勒桦</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">勃艮第</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Leroy庄主，生物动力法先驱，缔造传奇车库酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">巴罗洛姐妹</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">应对根瘤蚜危机，奠定巴罗洛现代格局</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">海伦·特利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">加州</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">"纳帕谷第一夫人"，霞多丽酿造标杆</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">安·克劳德·勒弗莱</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">勃艮第</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">_domaine Leflaive，白葡萄酒女王</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;"> Sarah Morphew Stephen</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">纳帕</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">Sparkling酒 pioneer</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌸 女性酿酒的"风格标签"？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">是否存在"女性风格"？这是一个有争议的话题。一些评论家认为女性酿酒师更倾向于优雅、细腻、强调风土而非力量。但更多声音指出：优秀酿酒师首先是"好酿酒师"，性别不应成为风味的标签。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📈 正在改变的行业</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">近二十年来，女性酿酒师比例显著上升。从酿酒学校到顶级酒庄，越来越多女性走上技术核心岗位。她们也推动了可持续种植、自然酒等更注重"长期主义"的酿酒理念。</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🌍 新世界产区女性酿酒师比例更高、更受认可</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 女性主导的酒庄在生物动力法、有机领域尤为活跃</li><li style="margin:6px 0;color:#333;line-height:1.7;">🤝 全球女性酿酒师社群（如"Women in Wine"）互助成长</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 想探索女性酿酒师作品？可以从勃艮第Leroy（顶级）、Leflaive（白葡萄酒标杆）、美国Helen Turley的作品，以及澳洲、新西兰众多女性主导的新锐酒庄入手，往往能感受到与众不同的细腻表达。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒的故事里，女性从未缺席。她们用耐心、敏感与坚持，把土地的低语酿成了杯中的诗。下一个改变你味蕾的酒，或许就出自一位女性酿酒师之手。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '👩‍🌾 女性酿酒师：被忽视的葡萄酒力量',
      author: '红酒顾问',
      digest: '从勃艮第的拉露·比兹到加州传奇，女性在葡萄酒世界的贡献长期被低估。如今她们正重新定义"风土"二字。',
      content: gen(),
      coverImage: 'women_winemakers_cover_ai.png',
      category: 'wine-culture',
      tags: ["女性酿酒师", "拉露比兹", "勃艮第", "Leroy", "性别", "行业", "传奇"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'women_winemakers_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK women_winemakers, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL women_winemakers:', e.message);
    process.exit(1);
  }
}

main();
