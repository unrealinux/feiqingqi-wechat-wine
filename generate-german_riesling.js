const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJlN2QzMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuW+t+Wbvembt+WPuOS7pOa3seW6puaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LuO5pGp5rO95bCU5Yiw6I6x6Iy16auYPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juW5suWei+WIsOi0teiFkCDCtyDkuIDnr4for7vmh4Llvrflm73mnIDkvJ/lpKfnmoTnmb3okaHokITlk4Hnp408L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7mkanms73lsJQgwrcg6I6x6Iy16auYIMK3IOazleWwlOWFuSDCtyDnurPotasgwrcg6I6x6Iy16buR5qOuPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #2e7d32; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #2e7d32; border-bottom: 2px solid #81c784; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #2e7d32; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#2e7d32;">🇩🇪 德国雷司令深度指南</h2>' +
  '<p style="text-align:center;color:#666;">从摩泽尔到莱茵高 · 从干型到贵腐 | 一篇读懂德国最伟大的白葡萄品种</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">雷司令（Riesling）是德国最伟大的白葡萄品种，没有之一。它做到了其他白葡萄几乎无法实现的事情：从极干到极甜，从清爽到浓郁，从日常佐餐到收藏级陈年，全都能用同一个品种完成。更惊人的是，好的雷司令可以陈年50年以上——在白葡萄酒中极为罕见。</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">本文从葡萄特性、产区分级、风格类型到购买推荐，带你完整了解这个"白葡萄酒之王"。</p>' +
  '<h3>🍇 雷司令：为什么它如此特别？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">雷司令的经典香气：青苹果、柠檬、柑橘、白桃、蜂蜜、汽油（陈年后）。"汽油味"是雷司令陈年后的标志性香气，听起来奇怪但尝过就知道——非常迷人。</p>' +
  '<h3>🗺️ 德国六大核心雷司令产区</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>位置</th><th>特色</th><th>典型风格</th><th>标杆酒庄</th></tr><tr><td>摩泽尔 Mosel</td><td>莱茵河支流河谷</td><td>最陡的葡萄园坡度（60°+）' +
  '蓝色/红色板岩土壤</td><td>轻盈优雅，酒精度低' +
  '青苹果+矿物感</td><td>Egon Müller, Dr. Loosen, Joh. Jos. Prüm</td></tr><tr><td>莱茵高 Rheingau</td><td>莱茵河北岸</td><td>雷司令的诞生地' +
  '黄土+板岩混合</td><td>优雅平衡，结构紧实' +
  '柑橘+花香</td><td>Georg Breuer, Robert Weil, Schloss Johannisberg</td></tr><tr><td>法尔兹 Pfalz</td><td>德国南部</td><td>温暖干燥，产量最大' +
  '多样土壤类型</td><td>饱满浓郁，果味成熟' +
  '桃子+杏子</td><td>Bassermann-Jordan, Dr. Bürklin-Wolf</td></tr><tr><td>纳赫 Nahe</td><td>莱茵河支流</td><td>土壤类型最丰富' +
  '火山岩+板岩+黏土</td><td>兼具优雅与力量' +
  '矿物感突出</td><td>Dönnhoff, Schlossgut Diel</td></tr><tr><td>莱茵黑森 Rheinhessen</td><td>莱茵河中游</td><td>德国最大葡萄酒产区' +
  '石灰岩+黏土</td><td>果味充沛，平易近人' +
  '柑橘+杏子</td><td>Keller, Wittmann</td></tr><tr><td>弗兰肯 Franken</td><td>德国中部</td><td>以Bocksbeutel扁瓶闻名' +
  '石灰岩+粘土</td><td>干型为主，厚实饱满' +
  '矿物感强</td><td>Juliusspital, Hans Wirsching</td></tr></table></section>' +
  '<h3>🏅 德国葡萄酒分级：读懂酒标是关键</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">德国的葡萄酒分级体系让很多人望而生畏，其实核心就三个维度：</p>' +
  '<h3 style="border-bottom:none;">维度一：按产区（VDP 分级）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">VDP（德国名庄联盟）是德国最权威的酒庄协会，酒瓶上的"雄鹰徽章"就是品质的保证：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>VDP级别</th><th>含义</th><th>占比</th></tr><tr><td>VDP Gutswein</td><td>大区级——入门款</td><td>约50%</td></tr><tr><td>VDP Ortswein</td><td>村庄级——风土初现</td><td>约25%</td></tr><tr><td>VDP Erste Lage</td><td>一级园——该村最好的葡萄园</td><td>约15%</td></tr><tr><td>VDP Grosse Lage</td><td>特级园——德国最高级别</td><td>约10%</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 VDP 关键术语</h4><p style="color:#333;line-height:1.8;margin:0">Grosse Lage 相当于德国的"特级园"，产量仅占10%左右。Groses Gewächs（缩写GG）是特级园酿造的干型雷司令，品质极高，是雷司令爱好者的终极追求。酒瓶上的"雄鹰徽章"就是VDP的品质保证。</p></div></section>' +
  '<h3 style="border-bottom:none;">维度二：按成熟度（Prädikat 分级）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这是德国最著名的分级——根据葡萄采摘时的含糖量来划分。越高意味着葡萄越成熟、酒体越饱满、甜度越高：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>级别</th><th>含义</th><th>典型风格</th></tr><tr><td>Kabinett</td><td>逐串精选·最低成熟度</td><td>最轻盈，干型或微甜，7-9度</td></tr><tr><td>Spätlese</td><td>晚摘·更成熟的葡萄</td><td>中等酒体，半干到甜型</td></tr><tr><td>Auslese</td><td>逐串精选·选成熟果串</td><td>酒体饱满，甜型为主</td></tr><tr><td>Beerenauslese (BA)</td><td>逐粒精选·贵腐菌感染</td><td>浓郁甜酒，产量极低</td></tr><tr><td>Trockenbeerenauslese (TBA)</td><td>干粒精选·完全贵腐化</td><td>最顶级甜酒，极其稀有</td></tr><tr><td>Eiswein</td><td>冰酒·零下7°C冰冻采摘</td><td>浓缩甜酒，纯净的酸度</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>⚠️ 常见误解</h4><p style="color:#333;line-height:1.8;margin:0">要特别注意：如果酒标上写着"Trocken"意味着干型（不甜），"Feinherb"是半干，"Lieblich"是半甜，"Süß"是甜型。但Prädikat级别（Kabinett/Spätlese等）本身只表示葡萄成熟度，不直接等于甜度！同一个Spätlese可以酿成干型也可以酿成甜型。</p></div></section>' +
  '<h3>🥂 雷司令风格全谱系</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>风格</th><th>酒精度</th><th>残糖</th><th>适合场景</th></tr><tr><td>干型 GG 雷司令</td><td>12-13%</td><td><9g/L</td><td>高级配餐（海鲜、白肉）</td></tr><tr><td>干型 村庄级</td><td>11-12%</td><td><9g/L</td><td>日常晚餐、沙拉、寿司</td></tr><tr><td>半干 Spätlese</td><td>8-10%</td><td>9-35g/L</td><td>亚洲菜、川菜、泰国菜</td></tr><tr><td>甜型 Auslese</td><td>7-9%</td><td>35-80g/L</td><td>甜品、蓝纹奶酪、坚果</td></tr><tr><td>贵腐 BA/TBA</td><td>6-8%</td><td>80-250g/L</td><td>鹅肝、水果甜点、独饮</td></tr><tr><td>冰酒 Eiswein</td><td>6-8%</td><td>100-200g/L</td><td>餐后甜点、奶酪拼盘</td></tr></table></section>' +
  '<h3>🍽️ 雷司令配餐：白葡萄酒万能王</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">雷司令可能是配餐最灵活的白葡萄酒——从高级法餐到街头小吃都能找到对应风格。关键秘诀：你只需要根据菜的口味选择雷司令的甜度级别。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>菜品</th><th>推荐雷司令风格</th><th>理由</th></tr><tr><td>清蒸鱼/白灼虾</td><td>干型或半干摩泽尔</td><td>高酸度去腥，矿物感提鲜</td></tr><tr><td>寿司/刺身</td><td>干型GG或村庄级</td><td>清爽干净，不抢鱼生本味</td></tr><tr><td>川菜/湘菜</td><td>半干Spätlese</td><td>微甜中和辣感，花果香呼应</td></tr><tr><td>泰国菜/越南菜</td><td>半干Auslese</td><td>甜辣搭配完美，香气浓郁</td></tr><tr><td>烤鸭/叉烧</td><td>干型GG莱茵高</td><td>饱满酒体搭配风味肉类</td></tr><tr><td>蓝纹奶酪</td><td>甜型Auslese/BA</td><td>甜咸碰撞，经典搭配</td></tr><tr><td>水果甜点</td><td>冰酒/TBA</td><td>浓缩果香，甜度匹配</td></tr></table></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">雷司令配餐的黄金法则：菜的辣度越高、调味越丰富，就选越甜的雷司令。反之，菜越清淡、越追求食材本味，就选越干的雷司令。</p></section>' +
  '<h3>💎 必喝酒庄推荐</h3>' +
  '<h3>❌ 常见误区</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ "雷司令都是甜的"——错！德国雷司令有大量干型（Trocken）选择，GG干型雷司令在世界顶级餐厅备受追捧</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ "蓝仙姑是德国好酒"——蓝仙姑（Blue Nun）是大众化商业品牌，不代表德国雷司令的真实水平</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ "雷司令不能陈年"——恰恰相反，顶级雷司令的陈年能力堪比波尔多列级庄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ "雷司令只能配甜食"——干型雷司令配海鲜是一绝，半干配亚洲菜更是教科书级别</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ "便宜的雷司令不好喝"——100元出头也能买到Dr. Loosen这样的品质，德国雷司令的性价比极高</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>🥇 入门推荐</h4><p style="color:#333;line-height:1.8;margin:0">买一瓶Dr. Loosen "Dr. L"（约¥120），配一份白灼虾或清蒸鲈鱼——喝完你就会理解为什么雷司令被公认为世界上最优雅的白葡萄酒之一。</p></div></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#81c784,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 雷司令不会辜负每一个认真对待它的人 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🇩🇪 德国雷司令深度指南：从摩泽尔到莱茵高',
      author: '红酒顾问',
      digest: '雷司令是德国最伟大的白葡萄品种。从干型到贵腐甜酒，从摩泽尔陡坡到莱茵高台地，一篇文章带你全看懂。',
      content: gen(),
      coverImage: 'german_riesling_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["德国", "雷司令", "Riesling", "摩泽尔", "莱茵高", "白葡萄酒", "甜酒", "产区分级"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'german_riesling_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ german_riesling, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ german_riesling:', e.message);
    process.exit(1);
  }
}

main();
