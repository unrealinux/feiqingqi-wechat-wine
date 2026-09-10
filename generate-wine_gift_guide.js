const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhiMDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjoEg6JGh6JCE6YWS6YCB56S85oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7pgIHku4DkuYjphZLkuI3kvJrplJnvvJ88L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+6IqC5pelIMK3IOWVhuWKoSDCtyDmnIvlj4sgwrcg6ZW/6L6IIMK3IOS4ieaho+mihOeulzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumAgeekvOaMh+WNlyDCtyDnuqLphZLpob7pl648L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #8b0000; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #8b0000; border-bottom: 2px solid #d4af37; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #8b0000; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#8b0000;">🎁 葡萄酒送礼指南</h2>' +
  '<p style="text-align:center;color:#666;">送什么酒不会错？ | 节日 · 商务 · 朋友 · 长辈 · 三档预算</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">送葡萄酒是最安全的礼物之一——既体面又实用，男女老少皆宜。但面对琳琅满目的酒款，很多人还是不知道怎么选。这篇文章帮你搞定99%的送礼场合。</p></section>' +
  '<h3>🎯 送礼三原则</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">选大品牌不选小众——收礼人认识的牌子，才有"面子"</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">选经典产区不选冷门——波尔多、勃艮第、纳帕谷，中国人最认</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">选适饮年份不选老年份——大部分送礼酒要尽快喝掉，别选需要陈年的</li></ul></section>' +
  '<h3>💰 三档预算推荐</h3>' +
  '<h3 style="border-bottom:none;">🎁 200-500元：实用档</h3>' +
  '<h3 style="border-bottom:none;">🏆 500-1000元：体面档</h3>' +
  '<h3 style="border-bottom:none;">💎 1000元以上：高端档</h3>' +
  '<h3>📅 节日送礼攻略</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>节日</th><th>推荐酒款</th><th>理由</th></tr><tr><td>春节</td><td>奔富 Bin 389 / 拉菲传奇</td><td>红色包装喜庆，品牌认知度高</td></tr><tr><td>中秋节</td><td>香槟/起泡酒 + 月饼礼盒</td><td>起泡酒适合团圆氛围</td></tr><tr><td>情人节</td><td>香槟名庄（唐培里侬/库克）</td><td>浪漫仪式感，女生最爱</td></tr><tr><td>父亲节</td><td>波尔多列级庄 / 纳帕赤霞珠</td><td>父亲辈最认法国酒和美国酒</td></tr><tr><td>中秋节</td><td>张裕解百纳 / 长城桑干</td><td>国产精品，支持国货</td></tr><tr><td>圣诞节</td><td>勃艮第黑皮诺 / 香槟</td><td>西方节日配西方酒</td></tr></table></section>' +
  '<h3>❌ 送礼避坑指南</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送太便宜的酒（¥50以下）——显得没诚意</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送太小众的酒——收礼人不认识，显得"装"</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送需要陈年的酒——收礼人可能不懂保存</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送螺旋盖的酒送长辈——老一辈觉得"不高级"</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送已经过了适饮期的老酒——可能已经变质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送不知名的产区——不如送大品牌的入门款</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 送礼小贴士</h4><p style="color:#333;line-height:1.8;margin:0">如果实在不知道选什么，就送奔富 Bin 389（¥500左右）——这是中国送礼界的"硬通货"，知名度堪比茅台，收礼人一看就知道值多少钱。</p></div></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">送葡萄酒最重要的是心意，不是价格。一瓶¥100的好酒，配上一张手写卡片，比¥1000的名庄酒更让人感动。</p></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 送礼送到心坎里 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🎁 葡萄酒送礼指南：送什么酒不会错？',
      author: '红酒顾问',
      digest: '节日、商务、朋友、长辈——不同场景送什么酒？三档预算帮你搞定99%的送礼场合。',
      content: gen(),
      coverImage: 'wine_gift_guide_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["送礼", "礼物", "节日", "商务", "朋友", "长辈", "推荐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_gift_guide_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
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
    console.log('✅ wine_gift_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ wine_gift_guide:', e.message);
    process.exit(1);
  }
}

main();
