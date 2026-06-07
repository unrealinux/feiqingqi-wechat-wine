const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjb4g5byA55O25ZCO6JGh6JCE6YWS6IO95pS+5aSa5LmF77yf5Y+y5LiK5pyA5YWo5L+d5a2Y5oyHPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍾 开瓶后葡萄酒能放多久？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">史上最全葡萄酒保存指南 | 喝不完怎么办？</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">开了一瓶好酒但没喝完——这是每个葡萄酒爱好者都会遇到的窘境。直接倒掉太可惜，硬喝又怕变质。那么，不同葡萄酒开瓶后到底能放多久？如何延长它们的寿命？</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⏰ 各种葡萄酒的"保质期"（冷藏条件下）</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">酒的类型</th><th style="padding:10px;text-align:left;">开瓶后寿命</th><th style="padding:10px;text-align:left;">关键变化</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">起泡酒（香槟/Cava）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">1-3天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气泡流失后变得平淡</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">轻酒体白葡萄酒（长相思/灰皮诺）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">3-5天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味逐渐消退</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">重酒体白葡萄酒（霞多丽/维欧尼）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">3-5天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">氧化后变坚果味</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">桃红葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">3-5天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味变淡</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">轻酒体红葡萄酒（黑皮诺/博若莱）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">3-5天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味消退</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">重酒体红葡萄酒（赤霞珠/西拉）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">5-7天</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">单宁柔化，仍可饮用</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">加强酒（波特/雪莉/马德拉）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">2-4周</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最耐放的酒</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜酒（苏玳/托卡伊/冰酒）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">2-4周</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">糖分作为天然防腐剂</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥶 核心原则：空气是头号敌人</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">葡萄酒变质的主要原因是氧化——空气中的氧气与酒液接触后，使酒中的酚类物质发生化学反应。氧化的酒会失去新鲜果味，变成酱油味、醋味或烂水果味。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">因此，所有保存方法的核心都是：减少酒液与空气的接触。温度也是关键因素——冰箱冷藏室（4-8°C）能显著减缓氧化速度。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔧 保存工具评测</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">工具</th><th style="padding:10px;text-align:left;">原理</th><th style="padding:10px;text-align:left;">效果</th><th style="padding:10px;text-align:left;">价格</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">原装瓶塞+冰箱</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最简单的方法</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">一般（2-3天）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">免费</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">真空塞（Vacu Vin）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">抽走瓶中空气</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">良好（3-5天）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">¥30-80</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">换小瓶</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">减少瓶中氧气空间</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">很好（5-7天）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">免费（需有瓶）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">惰性气体喷雾</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">喷入氩气防止氧化</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">优秀（7-14天）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">¥80-150</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Coravin取酒器</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">用针管取酒不拔塞</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极佳（数月）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">¥1500+</td></tr></tbody></table></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 最佳性价比方案：买几个100ml和200ml的玻璃小瓶（试剂瓶），将剩余的酒液倒入小瓶几乎装满（不留空气空间），拧紧瓶盖放入冰箱。这比任何昂贵的工具都有效！</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 各种场景的应对策略</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">场景一：只喝了一杯，还剩大半瓶</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">最佳方案：用真空塞抽走空气，放冰箱。红葡萄酒也要放冰箱（喝前提前15-20分钟取出回温即可）。这样可以保质3-5天。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">场景二：只剩瓶底一点点（100ml左右）</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">最佳方案：倒入小瓶中。100ml的酒倒进100ml的小瓶几乎没空气，可以再放一周。第二天直接当餐酒一杯喝掉很完美。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">场景三：名庄好酒，想分几天慢慢品</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">最佳方案：用Coravin取酒器。不拔塞、不氧化，可以分几周甚至几个月慢慢品尝。如果是没有Coravin的情况，用惰性气体喷雾+冰箱冷藏，也能撑5-7天。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">⚠️ 判断变质的标准</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">酒还能不能喝？用"望闻问切"来判断：</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">👃 闻：有没有类似醋、酱油、雪莉酒或烂苹果的刺鼻气味？有→变坏了</li><li style="margin:6px 0;color:#333;line-height:1.7;">👀 看：颜色有没有变成棕色或砖红色（白葡萄酒变成深琥珀色）？有→氧化了</li><li style="margin:6px 0;color:#333;line-height:1.7;">👅 尝：口感是否变得平淡、缺乏果味？有没有令人不快的刺激感？有→不建议喝</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 如果只是果味变淡了一些、单宁柔化了一些——这其实是自然演变，可以放心喝</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍶 红酒到底要不要放冰箱？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">很多人认为红葡萄酒不能放冰箱。这是误区！冷藏只是暂时的保存手段（不是长期陈年）。在冰箱里放3-5天对红酒的品质影响不大，喝前提前取出回温至16-18°C即可。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">但要注意：冰箱温度不能太低（不要低于4°C），而且最好用保鲜膜包好瓶口防止串味——冰箱里的剩菜味道会通过软木塞渗透到酒中！</p>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">记住这条黄金法则：再好的保存方法也比不上找个人一起喝完。所以开好酒的时候，别忘了叫上朋友。独饮虽好，但分享才是葡萄酒最正确的打开方式。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍾 开瓶后葡萄酒能放多久？史上最全保存指南',
      author: '红酒顾问',
      digest: '一瓶酒开了喝不完怎么办？塞回瓶塞能放几天？起泡酒、红酒、白酒、甜酒保存时间各不相同。附赠真空塞、换瓶器、惰性气体等实用工具评测。',
      content: gen(),
      coverImage: 'wine_storage_guide_cover_ai.png',
      category: 'wine-practical',
      tags: ["葡萄酒保存", "开瓶", "醒酒", "真空塞", "保鲜", "实用技巧"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_storage_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ wine_storage_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ wine_storage_guide:', e.message);
    process.exit(1);
  }
}

main();
