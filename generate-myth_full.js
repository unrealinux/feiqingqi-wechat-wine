const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDc8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+NtyDnuqLphZLlgJLmu6Hmna/miY3osarniL3vvJ/nlZnnmb3miY3mmK88L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuato+ehruWWneazlTwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍷 红酒倒满杯才豪爽？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第7期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">白酒杯倒满、啤酒杯倒满，于是很多人顺手把红酒也倒到杯口。但红酒是最怕"满"的酒——倒太满，香气、温度、体验全打折。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 红酒为什么不能满</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">闻香是喝红酒的一半乐趣。酒杯留出空间，摇杯时酒液旋转、香气聚集在杯口，你才能闻到。倒满了，香气散不出去，摇杯还会洒一身。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📏 倒多少才对</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">酒杯类型</th><th style="padding:10px;text-align:left;">建议倒量</th><th style="padding:10px;text-align:left;">理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">红酒杯（波尔多杯）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">约1/3杯</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">留空间聚香、控温</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">勃艮第杯（大肚）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">更少，1/4</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">大肚本身聚香</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">白酒杯</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">约1/2</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无需大力摇香</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">起泡酒杯</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">约2/3</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">看气泡升腾</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌡️ 满杯的隐藏代价</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🌡️ 酒液大面积接触空气，温度快速升高（红酒适饮12-18°C）</li><li style="margin:6px 0;color:#333;line-height:1.7;">👅 入口太满，无法在口中感受酒体层次</li><li style="margin:6px 0;color:#333;line-height:1.7;">💦 摇杯即溢，社交场合尴尬</li><li style="margin:6px 0;color:#333;line-height:1.7;">👃 香气无法在杯口聚集，闻不到</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">倒酒留白不是矫情，是物理规律。1/3杯量是全球品鉴师的最大公约数——既给香气留舞台，也给你留体面。</p></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 一个小技巧：倒酒后轻轻晃杯，把鼻子探进杯口深吸一口。你会发现，同一瓶酒，"满杯"和"三分之一杯"闻起来像两瓶。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">红酒是慢饮的酒，倒满杯的急切与它格格不入。留三分空，盛的是香气，也是从容。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你习惯倒满还是留白？评论区聊聊 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🍷 红酒倒满杯才豪爽？留白才是正确喝法',
      author: '红酒顾问',
      digest: '红酒倒满杯，香气无处释放、温度易升、还容易洒。正确喝法是倒1/3，留足空间让酒"呼吸"。',
      content: gen(),
      coverImage: 'myth_full_cover_ai.png',
      category: 'wine-myth',
      tags: ["倒酒", "杯量", "误区", "品鉴", "新手"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_full_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_full, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_full:', e.message);
    process.exit(1);
  }
}

main();
