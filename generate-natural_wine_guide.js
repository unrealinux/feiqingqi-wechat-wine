const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzNjkxZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiHqueEtumFkuWFpemXqOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5pyA5LiN5q2j5bi455qE6JGh6JCE6YWSPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS9juW5sumihOOAgeaXoOa3u+WKoOOAgeacieeBtemtgueahOmFkjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaWsOi2i+WKvzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #33691e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #33691e; border-bottom: 2px solid #7cb342; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #33691e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#33691e;">自然酒入门指南</h2>' +
  '<p style="text-align:center;color:#666;">最不正常的葡萄酒 | 低干预 · 无添加 · 有灵魂</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">如果你第一次喝自然酒，可能会觉得：这酒是不是坏了？浑浊、有沉淀、闻起来像醋……但这就是自然酒的魅力——它是最不正常的葡萄酒，也是最有灵魂的酒。</p></section>' +
  '<h3>🌿 什么是自然酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒（Natural Wine）是一种酿造理念，强调最小化人工干预，让葡萄酒回归最自然的状态。</p>' +
  '<h3>🤔 自然酒 vs 传统酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒和传统葡萄酒有什么区别？</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>方面</th><th>传统葡萄酒</th><th>自然酒</th></tr><tr><td>种植</td><td>可能使用化学农药</td><td>有机或生物动力法</td></tr><tr><td>发酵</td><td>人工酵母</td><td>天然酵母</td></tr><tr><td>添加</td><td>可能添加色素、单宁等</td><td>不添加任何东西</td></tr><tr><td>硫化物</td><td>添加二氧化硫防腐</td><td>低硫或无硫</td></tr><tr><td>过滤</td><td>通常过滤澄清</td><td>不过滤或轻度过滤</td></tr><tr><td>口感</td><td>稳定、一致</td><td>变化多端、有个性</td></tr></table></section>' +
  '<h3>🍷 自然酒的味道</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒的味道，与传统葡萄酒截然不同。这里有几个特点：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更酸</strong>——因为没有添加酸度调节剂</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更\'活泼\'</strong>——可能有轻微气泡，因为仍在发酵</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更\'野\'</strong>——有独特的\'农场\'气味（barnyard）</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更浑浊</strong>——因为不过滤</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更\'有趣\'</strong>——每一瓶都不一样，充满惊喜</li></ul></section>' +
  '<h3>🔍 如何识别自然酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒没有官方认证，但可以通过以下几个标志来识别：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒标关键词</strong>——Natural, Vin Nature, Raw Wine, 参与VinNatur等组织</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>没有\'Mis en bouteille\'</strong>——自然酒通常不强调装瓶信息</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒液浑浊</strong>——自然酒通常不过滤，酒液可能浑浊</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>瓶底沉淀</strong>——这是正常的，摇匀即可饮用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒庄信息</strong>——通常很小众，不容易在超市找到</li></ul></section>' +
  '<h3>🌍 世界各地的自然酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒起源于法国，如今已遍布全球：</p>' +
  '<div class="ri"><h4>法国（自然酒发源地） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">经典产区</span></h4><p style="color:#333;line-height:1.8;margin:0">勃艮第、博若莱、阿尔萨斯是自然酒的重镇。代表酒庄：Marcel Lapierre、Jean Foillard、Pierre Overnoy。</p><p style="color:#7cb342;font-weight:bold;margin:5px 0 0 0;">¥150-500</p></div>' +
  '<div class="ri"><h4>意大利 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">性价比高</span></h4><p style="color:#333;line-height:1.8;margin:0">皮埃蒙特、威尼托是自然酒的新兴产区。代表酒庄：Elvio Cogno、Cos、Frank Cornelissen。</p><p style="color:#7cb342;font-weight:bold;margin:5px 0 0 0;">¥120-400</p></div>' +
  '<div class="ri"><h4>西班牙 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">小众宝藏</span></h4><p style="color:#333;line-height:1.8;margin:0">里奥哈、加泰罗尼亚有很多自然酒酒庄。代表酒庄：Envínate、Vinya Giralt、Partida Creus。</p><p style="color:#7cb342;font-weight:bold;margin:5px 0 0 0;">¥100-300</p></div>' +
  '<div class="ri"><h4>美国 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">创新风格</span></h4><p style="color:#333;line-height:1.8;margin:0">加利福尼亚、俄勒冈是美国自然酒的中心。代表酒庄：Coturri、Arnot-Roberts、Birichino。</p><p style="color:#7cb342;font-weight:bold;margin:5px 0 0 0;">¥150-500</p></div>' +
  '<div class="ri"><h4>日本 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">东方风格</span></h4><p style="color:#333;line-height:1.8;margin:0">日本是亚洲自然酒的先锋。代表酒庄：Château Mercian、Grace Wine、十勝。</p><p style="color:#7cb342;font-weight:bold;margin:5px 0 0 0;">¥200-600</p></div>' +
  '<h3>💡 如何品尝自然酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品尝自然酒，需要调整心态：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要用传统标准评判</strong>——自然酒有自己的美学</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>接受\'不完美\'</strong>——浑浊、沉淀、酸度高，都是正常的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多尝试</strong>——每一瓶自然酒都是独一无二的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>与酿酒师交流</strong>——了解酒背后的故事</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持开放心态</strong>——你可能会爱上这种\'不正常\'</li></ul></section>' +
  '<h3>🛒 哪里买自然酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒通常不在超市销售，可以通过以下渠道购买：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>自然酒吧</strong>——一线城市有很多自然酒吧，可以先品尝再购买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>精品葡萄酒店</strong>——专门卖小众酒款的店铺</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>线上平台</strong>——淘宝、京东搜索\'自然酒\'或\'Vin Nature\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>进口商网站</strong>——一些进口商有直销渠道</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒庄直购</strong>——如果你有机会去产区，直接去酒庄购买</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#7cb342,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'自然酒不是一种风格，而是一种态度——对自然的尊重，对个性的追求，对完美的反叛。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">自然酒可能不是每个人都喜欢，但它代表了一种新的饮酒哲学：不追求完美，而追求真实；不追求一致，而追求个性。如果你厌倦了千篇一律的工业酒，不妨试试自然酒，也许你会发现一个全新的世界。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你尝试过自然酒吗？<br/>你觉得自然酒怎么样？<br/>欢迎在评论区分享你的体验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '自然酒入门指南：最"不正常"的葡萄酒',
      author: '红樽坊',
      digest: '浑浊、有沉淀、闻起来像醋？这不是坏酒，而是自然酒。低干预、无添加、有灵魂——自然酒到底是什么？',
      content: gen(),
      coverImage: 'natural_wine_guide_cover_ai.png',
      category: 'wine-trend',
      tags: ["自然酒", "有机酒", "低干预", "新趋势", "入门"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'natural_wine_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Natural Wine, media_id:', d.data.media_id);
  }catch(e){
    console.error('Natural Wine:', e.message);
    process.exit(1);
  }
}

main();
