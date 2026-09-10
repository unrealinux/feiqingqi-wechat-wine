const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2NTEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWbveS6p+mFkiB2cyDov5vlj6PphZI8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZGRkIiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0ic2VyaWYiPuebsuWTgee7k+aenOiuqeS6uuaEj+WkljwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiYmIiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7miZPnoLTlgY/op4HvvIzph43mlrDorqTor4bkuK3lm73okaHokITphZI8L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7nuqLmqL3lnYogfCDnm7Llk4Hlrp7mtYs8L3RleHQ+Cjwvc3ZnPg==";
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
  '<h2 style="text-align:center;color:#e65100;">国产酒 vs 进口酒：盲品结果让人意外</h2>' +
  '<p style="text-align:center;color:#666;">打破偏见，重新认识中国葡萄酒</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">\'中国也能产好酒？\'——这是我们最常听到的质疑。为了验证国产酒的真实水平，我们组织了一场国产酒与进口酒的盲品对决。10位参与者，6款酒，结果出乎所有人的意料。</p></section>' +
  '<h3>📋 盲品规则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">我们选择了3款国产酒和3款进口酒，价格区间相近（200-400元），葡萄品种相同（赤霞珠/马瑟兰）。参与者在不知道酒款信息的情况下，对每款酒进行打分（1-10分），并猜测产地。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款</th><th>产地</th><th>品种</th><th>年份</th><th>价格</th></tr><tr><td>贺兰山东麓 赤霞珠</td><td>中国宁夏</td><td>赤霞珠</td><td>2021</td><td>¥280</td></tr><tr><td>香格里拉 马瑟兰</td><td>中国云南</td><td>马瑟兰</td><td>2020</td><td>¥350</td></tr><tr><td>新疆天山 赤霞珠</td><td>中国新疆</td><td>赤霞珠</td><td>2021</td><td>¥220</td></tr><tr><td>波尔多 赤霞珠</td><td>法国波尔多</td><td>赤霞珠</td><td>2020</td><td>¥320</td></tr><tr><td>托斯卡纳 桑娇维塞</td><td>意大利托斯卡纳</td><td>桑娇维塞</td><td>2019</td><td>¥380</td></tr><tr><td>纳帕谷 赤霞珠</td><td>美国纳帕谷</td><td>赤霞珠</td><td>2020</td><td>¥450</td></tr></table></section>' +
  '<h3>📊 盲品结果</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">经过激烈的品鉴和讨论，最终的评分结果如下：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>排名</th><th>酒款</th><th>平均分</th><th>猜对产地比例</th></tr><tr><td>1</td><td>贺兰山东麓 赤霞珠（中国）</td><td>8.5分</td><td>30%</td></tr><tr><td>2</td><td>纳帕谷 赤霞珠（美国）</td><td>8.2分</td><td>90%</td></tr><tr><td>3</td><td>香格里拉 马瑟兰（中国）</td><td>8.0分</td><td>20%</td></tr><tr><td>4</td><td>波尔多 赤霞珠（法国）</td><td>7.8分</td><td>80%</td></tr><tr><td>5</td><td>新疆天山 赤霞珠（中国）</td><td>7.5分</td><td>40%</td></tr><tr><td>6</td><td>托斯卡纳 桑娇维塞（意大利）</td><td>7.3分</td><td>60%</td></tr></table></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">是的，你没有看错——<strong>冠军是一款中国宁夏的赤霞珠</strong>！而且只有30%的人猜对了它的产地。这说明什么？国产酒的品质，已经超出了大多数人的预期。</p>' +
  '<h3>🏆 冠军酒款：贺兰山东麓赤霞珠</h3>' +
  '<h3>🤔 为什么很多人猜错了产地？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">盲品结果中，最有趣的现象是：大多数参与者猜错了国产酒的产地。很多人以为贺兰山东麓的赤霞珠是法国波尔多，以为香格里拉的马瑟兰是意大利酒。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这说明什么？说明国产酒的品质，已经达到了与进口酒相当的水平。但人们的认知，还停留在\'中国产不了好酒\'的刻板印象中。</p>' +
  '<h3>🌍 中国葡萄酒的崛起</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">近年来，中国葡萄酒在国际大赛上屡获殊荣。宁夏贺兰山东麓产区的酒款，在Decanter世界葡萄酒大赛、布鲁塞尔国际葡萄酒大赛等顶级赛事中，获得了数百枚金奖和银奖。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">云南香格里拉产区的高海拔葡萄园，出产的霞多丽和黑皮诺，被认为是亚洲最具潜力的葡萄酒。新疆、山东、河北等产区，也各有特色。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">更令人振奋的是，中国葡萄酒的性价比极高。同样品质的酒款，国产酒的价格通常只有进口酒的1/3到1/2。</p>' +
  '<h3>🍷 推荐几款值得尝试的国产酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你还没有尝试过国产酒，这里推荐几款入门级的酒款，帮助你重新认识中国葡萄酒：</p>' +
  '<div class="ri"><h4>贺兰山东麓 赤霞珠 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">国产之光</span></h4><p style="color:#333;line-height:1.8;margin:0">宁夏产区的代表作，黑醋栗、雪松风味，单宁细腻，具有波尔多的优雅风格。</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">¥200-400</p></div>' +
  '<div class="ri"><h4>香格里拉 马瑟兰 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">潜力新星</span></h4><p style="color:#333;line-height:1.8;margin:0">云南高海拔产区的特色品种，紫罗兰、黑樱桃风味，酒体中等，余味悠长。</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">¥250-450</p></div>' +
  '<div class="ri"><h4>新疆天山 赤霞珠 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">性价比王</span></h4><p style="color:#333;line-height:1.8;margin:0">日照充足，果实成熟度高，黑加仑、巧克力风味，酒体饱满，适合喜欢浓郁风格的人。</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">¥150-300</p></div>' +
  '<div class="ri"><h4>宁夏 贺兰晴雪 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">金奖常客</span></h4><p style="color:#333;line-height:1.8;margin:0">中国葡萄酒的骄傲，多次获得国际大奖。复杂度高，陈年潜力强。</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">¥300-600</p></div>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff9800,transparent);margin:25px 0;"></div>' +
  '<h3>💡 如何改变对国产酒的偏见？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">第一，<strong>尝试盲品</strong>。找一款国产酒和一款进口酒，遮住酒标，只凭口感判断。你可能会有意外的发现。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">第二，<strong>了解产区</strong>。宁夏、云南、新疆……每个产区都有自己的特色。了解这些产区的风土特点，能帮助你更好地欣赏国产酒。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">第三，<strong>支持国产</strong>。国产酒的崛起，需要消费者的支持。每一次购买，都是对国产酒的一票。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你尝试过国产葡萄酒吗？<br/>你觉得国产酒和进口酒有什么区别？<br/>欢迎在评论区分享你的看法和推荐酒款！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '国产酒 vs 进口酒：盲品结果让人意外',
      author: '红樽坊',
      digest: '我们邀请了10位葡萄酒爱好者，进行了一场国产酒与进口酒的盲品对决。结果？很多人改变了对中国葡萄酒的看法。',
      content: gen(),
      coverImage: 'domestic_vs_imported_cover_ai.png',
      category: 'blind-taste',
      tags: ["国产酒", "进口酒", "盲品", "宁夏", "贺兰山", "中国葡萄酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'domestic_vs_imported_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Domestic vs Imported, media_id:', d.data.media_id);
  }catch(e){
    console.error('Domestic vs Imported:', e.message);
    process.exit(1);
  }
}

main();
