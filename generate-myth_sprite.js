const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDY8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+lpCDnuqLphZLphY3pm6rnoqfvvJ/lpb3phZLnnJ/nmoTnu4/kuI3otbc8L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPui/meS5iOaKmOiFvjwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🥤 红酒配雪碧？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第6期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">红酒里倒进雪碧、可乐，是不少人的"第一口红酒记忆"。甜汽水确实让干涩的红酒变顺口，但代价是：你再也尝不到这瓶酒本来的样子。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥤 为什么有人爱这么喝</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">年轻红酒单宁紧涩、酸度明显，对没习惯的人确实"又涩又酸"。雪碧的糖和气泡瞬间中和了这些刺激，入口变甜变柔——本质是"用糖掩盖缺点"。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❌ 代价是什么</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍬 高糖分盖住酒的真实果香和品种特征</li><li style="margin:6px 0;color:#333;line-height:1.7;">🫧 气泡加速酒精吸收，更容易上头</li><li style="margin:6px 0;color:#333;line-height:1.7;">💸 用雪碧泡掉一瓶好酒，等于把钱冲进下水道</li><li style="margin:6px 0;color:#333;line-height:1.7;">👅 长期这么喝，味觉永远建立不起对红酒的感知</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 什么情况可以变通</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">不是绝对不能兑。极廉价、本身难喝的餐酒，加雪碧当"酒精饮料"解腻无伤大雅；派对场景追求轻松氛围，偶尔为之也没人审判你。但别把这当成"会喝红酒"。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">场景</th><th style="padding:10px;text-align:left;">建议</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">品鉴/学习</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">纯饮，感受真实风味</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">日常佐餐</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">纯饮或极淡醒酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">派对解腻</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">兑饮无妨，但选便宜酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">宴请显专业</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">纯饮，配醒酒器</td></tr></tbody></table></div>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">红酒的风味是需要被"读"的——单宁的骨架、酸度的线条、果香的层次。雪碧像给黑白电影上了层糖色，热闹却失真。想真正懂酒，从纯饮一杯开始。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 觉得红酒太涩？与其加雪碧，不如换一瓶低单宁、果味柔的酒（如黑皮诺、佳美），同样顺口，却不浪费酒本身。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">雪碧不是红酒的敌人，但它是"懂酒"的减速带。偶尔甜蜜无妨，别让它挡住你通往真正风味的路。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你干过红酒配雪碧吗？评论区坦白 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🥤 红酒配雪碧？好酒真的经不起这么折腾',
      author: '红酒顾问',
      digest: '红酒加雪碧是很多人的入门喝法，但好酒的风味会被糖汽水彻底掩盖。偶尔解腻无妨，别当成"懂喝"。',
      content: gen(),
      coverImage: 'myth_sprite_cover_ai.png',
      category: 'wine-myth',
      tags: ["雪碧", "兑饮", "误区", "喝法", "新手"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_sprite_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_sprite, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_sprite:', e.message);
    process.exit(1);
  }
}

main();
