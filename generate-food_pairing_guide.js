const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2NTEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjb3vuI8g6JGh6JCE6YWS5LiO576O6aOf5pCt6YWN5YWo5pS755WlPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7kuIDmlofmkJ7lrprmiYDmnInphY3ppJDpmr7popg8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5Lit6aSQIMK3IOilv+mkkCDCtyDml6Xmlpkgwrcg54Gr6ZSFIMK3IOeUnOWTgSDCtyDkuIfog73lhazlvI88L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7nvo7po5/phY3phZIgwrcg57qi6YWS6aG+6ZeuPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #e65100; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #e65100; border-bottom: 2px solid #ff9800; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #e65100; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#e65100;">🍽️ 葡萄酒与美食搭配全攻略</h2>' +
  '<p style="text-align:center;color:#666;">一文搞定所有配餐难题 | 中餐 · 西餐 · 日料 · 火锅 · 甜品</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人觉得葡萄酒配餐很难，其实只要掌握一个万能公式：清淡配清淡，浓郁配浓郁。本文整理了50种常见食物的葡萄酒搭配方案，收藏这篇就够了。</p></section>' +
  '<h3>📏 万能搭配公式</h3>' +
  '<h3>🥩 中餐搭配方案</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>菜品</th><th>推荐酒款</th><th>搭配逻辑</th></tr><tr><td>红烧肉/东坡肉</td><td>巴罗洛/基安蒂</td><td>高单宁解腻，酒体压得住浓油赤酱</td></tr><tr><td>清蒸鱼/白灼虾</td><td>夏布利/长相思</td><td>高酸度去腥，清爽不压味</td></tr><tr><td>麻婆豆腐/水煮鱼</td><td>半干雷司令/琼瑶浆</td><td>微甜中和辣感，花果香呼应</td></tr><tr><td>北京烤鸭</td><td>黑皮诺/博若莱</td><td>果香呼应鸭肉，单宁适中</td></tr><tr><td>粤式烧鹅/叉烧</td><td>里奥哈/GSM混酿</td><td>中等酒体，香料味呼应烤肉</td></tr><tr><td>火锅（麻辣）</td><td>半甜雷司令/莫斯卡托</td><td>甜+辣=完美，气泡解腻</td></tr><tr><td>饺子/包子</td><td>起泡酒/灰皮诺</td><td>清爽干净，配面食百搭</td></tr><tr><td>炒饭/炒面</td><td>博若莱/佳美</td><td>轻盈不压味，果香提鲜</td></tr></table></section>' +
  '<h3>🍝 西餐搭配方案</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>菜品</th><th>推荐酒款</th><th>搭配逻辑</th></tr><tr><td>牛排</td><td>赤霞珠/马尔贝克</td><td>高单宁+高蛋白=完美平衡</td></tr><tr><td>烤羊排</td><td>西拉/歌海娜</td><td>香料味呼应羊肉风味</td></tr><tr><td>意面（番茄酱）</td><td>基安蒂/桑娇维塞</td><td>高酸度对应番茄酸度</td></tr><tr><td>意面（奶油酱）</td><td>霞多丽/灰皮诺</td><td>饱满酒体配奶油</td></tr><tr><td>烤鸡</td><td>黑皮诺/白诗南</td><td>中等酒体，果香提鲜</td></tr><tr><td>海鲜拼盘</td><td>香槟/长相思</td><td>气泡+高酸度=清爽解腻</td></tr><tr><td>奶酪拼盘</td><td>苏玳贵腐/波特酒</td><td>甜+咸=经典搭配</td></tr></table></section>' +
  '<h3>🍣 日料搭配方案</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>菜品</th><th>推荐酒款</th><th>搭配逻辑</th></tr><tr><td>刺身/生鱼片</td><td>干型雷司令/清酒</td><td>清爽不抢味，矿物感提鲜</td></tr><tr><td>寿司（鱼类）</td><td>夏布利/长相思</td><td>高酸度对应酱油咸鲜</td></tr><tr><td>寿司（甜虾）</td><td>莫斯卡托/半干雷司令</td><td>微甜呼应甜虾鲜味</td></tr><tr><td>天妇罗</td><td>灰皮诺/普罗塞克</td><td>气泡解腻，清爽干净</td></tr><tr><td>烤鳗鱼</td><td>雷司令/琼瑶浆</td><td>甜味呼应鳗鱼酱汁</td></tr><tr><td>味噌汤/拉面</td><td>清酒/雷司令</td><td>风味呼应，清爽解腻</td></tr></table></section>' +
  '<h3>🍲 其他场景搭配</h3>' +
  '<h3>❌ 常见搭配误区</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 甜酒配咸菜——会变酸变苦</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 高单宁红酒配海鲜——会产生金属味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 高酸度酒配甜食——酒会变酸</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 浓郁红酒配清淡菜——酒会盖过菜味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 起泡酒配辣菜——气泡会加剧辣感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 便宜酒配昂贵菜——酒会显得更便宜</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 速查口诀</h4><p style="color:#333;line-height:1.8;margin:0">白酒配白肉，红酒配红肉<br/>甜酒配甜食，酸酒配酸菜<br/>清淡配清淡，浓郁配浓郁<br/>不知道配什么？选雷司令/黑皮诺/桃红——万能百搭</p></div></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">最好的配酒，是你喜欢喝的酒。规则是死的，人是活的。开心就好。</p></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff9800,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 干杯，享受每一餐 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍽️ 葡萄酒与美食搭配全攻略：一文搞定所有配餐难题',
      author: '红酒顾问',
      digest: '中餐、西餐、日料、火锅、甜品——50种常见食物的葡萄酒搭配方案，收藏这篇就够了。',
      content: gen(),
      coverImage: 'food_pairing_guide_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["配餐", "美食", "中餐", "西餐", "日料", "火锅", "搭配"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'food_pairing_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ food_pairing_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ food_pairing_guide:', e.message);
    process.exit(1);
  }
}

main();
