const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDI8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+4p2TPC90ZXh0Pgo8dGV4dCB4PSI4MCIgeT0iMzMwIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+8J+NtyDnuqLphZLotorpmYjotorlpb3vvJ/lpKfpg6jliIbphZLmoLnmnKw8L3RleHQ+PHRleHQgeD0iODAiIHk9IjQwOCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1OCIgZm9udC1mYW1pbHk9IidNaWNyb3NvZnQgWWFIZWknLCdQaW5nRmFuZyBTQycsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4jeWAvOW+l+etiTwvdGV4dD4KPHJlY3QgeD0iMCIgeT0iNTYwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2ZmZDU0ZiIgb3BhY2l0eT0iMC45MiIvPgo8dGV4dCB4PSI4MCIgeT0iNjA0IiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjMwIiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPue6oumFkumhvumXriDCtyDmr4/ml6Xpgb/lnZE8L3RleHQ+Cjx0ZXh0IHg9IjExMjAiIHk9IjYwNCIgdGV4dC1hbmNob3I9ImVuZCIgZmlsbD0iIzFhMTIwNiIgZm9udC1zaXplPSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIG9wYWNpdHk9IjAuOCI+ZmVpcWluZ3FpPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍷 红酒越陈越好？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第2期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">"这瓶酒放几年更好喝"——这句话坑了无数人。真相是：市面上绝大多数红酒，出厂时就是适饮巅峰，放久了只会变差。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⏳ 为什么大部分酒不宜陈年</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">红酒的陈年潜力取决于单宁、酸度、糖分和风味浓度。普通餐酒这些元素薄弱，没有"陈年资本"，放三年五年，果香散尽、氧化加重，反而变得寡淡。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">酒的类型</th><th style="padding:10px;text-align:left;">适饮期</th><th style="padding:10px;text-align:left;">说明</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">百元内餐酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">出厂1-3年内</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果香型，趁新鲜喝</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">中端酒（200-500）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">3-8年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">部分有短期陈年价值</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">顶级波尔多/勃艮第</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">10-30年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">真正值得收藏的少数</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">加强酒/贵腐甜酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">数十年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">糖分和酒精是天然防腐剂</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔍 怎么判断该不该等</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">💰 价格：100块以内的酒，基本不用考虑陈年</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 品种：黑皮诺、佳美不耐存；赤霞珠、内比奥罗更耐放</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏷️ 产区：大区级餐酒即饮；列级庄/特级园才值得等</li><li style="margin:6px 0;color:#333;line-height:1.7;">📅 年份：差年份的酒更该早喝</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">一个粗暴的判断：你在超市货架上随手拿的酒，99%都该在一年内喝掉。把"越陈越好"当成买贵酒的理由，是最大的消费误区之一。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">✅ 真正该陈年的信号</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍷 高单宁、高酸、酒体饱满的红葡萄酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🏆 知名产区列级/特级园等有权威背书的酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍯 贵腐甜酒、波特等加强/甜型酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌡️ 且存放在恒温（12-15°C）、避光、湿度适宜的环境</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 家里没酒柜又想存几年？与其赌一瓶餐酒变好，不如把预算加到一瓶本来就适饮的好酒上，体验差距立判。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">陈年不是红酒的必选项，而是少数酒的特权。放过那些普通酒吧，它们最好的样子，就是被你尽快喝掉的那一刻。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你家里有"放了很久"的酒吗？评论区说说 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🍷 红酒越陈越好？大部分酒根本不值得等',
      author: '红酒顾问',
      digest: '只有少数顶级酒适合陈年，99%的餐酒趁新鲜喝最好。教你判断一瓶酒到底该现在喝还是再等等。',
      content: gen(),
      coverImage: 'myth_aging_cover_ai.png',
      category: 'wine-myth',
      tags: ["陈年", "误区", "适饮期", "储藏", "新手"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_aging_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('OK myth_aging, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_aging:', e.message);
    process.exit(1);
  }
}

main();
