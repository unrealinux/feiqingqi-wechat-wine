const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjZsg5bed6I+c6YWN6YWS57uI5p6B5oyH5Y2X77ya6bq76L6j5LiO6JGh6JCE6YWS55qE5r+A5oOFPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPueisOaSnjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍛 川菜配酒终极指南</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">麻辣与葡萄酒的激情碰撞 | 从此告别啤酒配川菜</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">川菜作为中国八大菜系之首，以"一菜一格，百菜百味"著称。麻、辣、鲜、香、烫——这些独特的味觉体验让无数人着迷，却也让葡萄酒搭配变得极具挑战性。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">很多人觉得川菜只能配啤酒或冰水，其实这是一种误解。选对葡萄酒，非但不会与辣味冲突，反而能巧妙地平衡麻辣、提升鲜味，带来意想不到的味觉体验。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥵 麻辣的核心挑战</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">川菜的辣来自辣椒中的辣椒素，麻来自花椒中的花椒麻素。这两者本身不是"味觉"而是"痛觉"和"触觉"刺激。酒精会加剧这种刺激，所以高酒精度（14%以上）的葡萄酒会放大辣感。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">配川菜的核心策略有三：一是用甜味来中和辣（半干/甜型葡萄酒），二是用低酒精度来减轻刺激（10-12%），三是用果香来呼应川菜的复合香气。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 万能搭配法则</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">川菜类型</th><th style="padding:10px;text-align:left;">推荐酒款</th><th style="padding:10px;text-align:left;">选择理由</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">麻辣类（水煮鱼、麻婆豆腐）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">半干雷司令 / 琼瑶浆</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">微甜中和辣味，芳香型不输菜香</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">香辣类（辣子鸡、干锅）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">黑皮诺 / 佳美</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低单宁、果香足、酒体轻，不抢味</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">鱼香/宫保类</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">灰皮诺 / 绿维特利纳</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸度活泼，平衡酸甜口感</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">泡椒类（泡椒凤爪）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">长相思 / 夏布利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">高酸度切开油腻，清新爽口</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">五香/卤味</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">里奥哈陈酿 / 桑娇维塞</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中等酒体，有香料味呼应</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">火锅（清汤锅）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香槟 / 卡瓦</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">气泡清口，酸度解腻</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">火锅（麻辣锅）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">半甜雷司令 / 冰酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜与辣碰撞，刺激又满足</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🥘 经典川菜 × 酒款推荐</h2>' +
  '<h3 style="color:#b8860b;margin-top:20px;">1. 水煮鱼 / 水煮牛肉</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">这道菜的标志是滚烫的辣椒油和嫩滑的鱼片/牛肉。辣度极高，但鱼肉本身鲜甜。推荐半干雷司令（如德国Kabinett Spatlese级别），微甜的酒液能立刻扑灭口中的辣火，而清爽的酸度又能解油腻。</p>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 小贴士：避免重橡木味的霞多丽或高酒精度的西拉，它们会与辣味产生令人不适的"燃烧感"。</p></div>' +
  '<h3 style="color:#b8860b;margin-top:20px;">2. 麻婆豆腐</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">麻婆豆腐的灵魂是"麻"——花椒的酥麻感布满整个口腔。推荐阿尔萨斯的琼瑶浆，其浓郁的荔枝和玫瑰花香与花椒的芬芳互相交织，微甜的口感能有效缓解麻辣刺激。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">3. 辣子鸡/干锅类</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">香辣酥脆，干锅类的焦香与辣椒香融为一体。推荐新西兰黑皮诺或勃艮第大区级，果味纯净、单宁柔和、酒体轻盈，不会掩盖菜品的本味。</p>' +
  '<h3 style="color:#b8860b;margin-top:20px;">4. 宫保鸡丁</h3>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">酸甜微辣，花生的坚果香增添了复杂度。推荐意大利灰皮诺或新西兰长相思，高酸度平衡酸甜汁，清爽的矿物质感让每一口都干净利落。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍶 大师级搭配口诀</h2>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">记住这四句话</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">辣怕甜，甜怕酸，麻怕芬芳，油怕气。' +
  '' +
  '意思是：辣味用甜酒中和，甜味用酸酒平衡，麻味用芳香型酒呼应，油腻用气泡酒切开。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 避坑指南</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 避免高酒精度的重红酒（如澳洲西拉、加州赤霞珠）——酒精放大辣感</li><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 避免重单宁的红酒（如年轻的巴罗洛）——单宁与辣形成苦涩感</li><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 避免过度橡木桶陈年的酒——桶味与香料味打架</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 首选半干/半甜型白葡萄酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 其次选果味丰富、低单宁的轻盈红葡萄酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 气泡酒永远是安全的选择</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">川菜配酒的魅力不在于"压住辣"，而在于让辣与酒互相成就，创造出单独的菜或酒都无法企及的味觉体验。下次吃川菜，别急着开啤酒——倒一杯半干雷司令，你会发现新世界的大门。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍛 川菜配酒终极指南：麻辣与葡萄酒的激情碰撞',
      author: '红酒顾问',
      digest: '川菜配酒不是只有啤酒！从水煮鱼到麻婆豆腐，从夫妻肺片到辣子鸡，教你用雷司令、琼瑶浆、黑皮诺搞定一切麻辣菜肴。',
      content: gen(),
      coverImage: 'sichuan_pairing_cover_ai.png',
      category: 'wine-food',
      tags: ["川菜", "配酒", "麻辣", "雷司令", "琼瑶浆", "黑皮诺", "中餐配酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'sichuan_pairing_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ sichuan_pairing, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ sichuan_pairing:', e.message);
    process.exit(1);
  }
}

main();
