const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U5MWU2MyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuKYgO+4jyDlpI/ml6XmuIXniL3nmb3okaHokITphZIv5qGD57qi5o6o6I2QPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7orqnov5nkuKrlpI/lpKnmm7TmuIXlh4k8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+55m96JGh6JCE6YWSIMK3IOahg+e6oiDCtyDmuIXniL0gwrcg5Yaw6ZWHIMK3IOWkj+aXpeeJuei+kTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWkj+aXpea4heeIvSDCtyDnuqLphZLpob7pl648L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #e91e63; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #e91e63; border-bottom: 2px solid #f48fb1; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #e91e63; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#e91e63;">☀️ 夏日清爽白葡萄酒/桃红推荐</h2>' +
  '<p style="text-align:center;color:#666;">让这个夏天更清凉 | 白葡萄酒 · 桃红 · 清爽 · 冰镇</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">35°C的夏天，红葡萄酒太重了。你需要的是冰镇后清爽解暑的白葡萄酒或桃红。这篇文章推荐10款白葡萄酒+5款桃红，全部适合冰镇饮用，解暑又解馋。</p></section>' +
  '<h3>🌡️ 夏天喝酒的三个原则</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">温度要低——白葡萄酒/桃红冰镇到8-10°C，起泡酒冰镇到6-8°C，喝起来才清爽</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">酸度要高——高酸度的酒喝起来更爽口，解腻解暑</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">酒精度要低——12%以下的酒，喝起来没负担，适合夏天轻松饮用</li></ul></section>' +
  '<h3>🥂 10款夏日清爽白葡萄酒推荐</h3>' +
  '<h3 style="border-bottom:none;">🏆 入门级（¥80-150）——随便买不踩雷</h3>' +
  '<div class="ri"><h4>1. 长相思 Sauvignon Blanc · 新西兰马尔堡</h4><p style="color:#333;line-height:1.8;margin:0">清爽的青草和百香果香气，酸度高，入口像喝了一口冰镇青柠水。配海鲜、沙拉、寿司绝配。<br/>参考价：¥88-128</p></div>' +
  '<div class="ri"><h4>2. 灰皮诺 Pinot Grigio · 意大利</h4><p style="color:#333;line-height:1.8;margin:0">几乎没有香气，但口感极其清爽干净，像喝冰镇矿泉水。最适合不想动脑选酒的时候。<br/>参考价：¥78-118</p></div>' +
  '<div class="ri"><h4>3. 阿尔巴利诺 Albariño · 西班牙下海湾</h4><p style="color:#333;line-height:1.8;margin:0">自带海盐气息的白葡萄酒，配海鲜天作之合。酸度脆爽，果味清新，夏天喝太舒服了。<br/>参考价：¥98-138</p></div>' +
  '<div class="ri"><h4>4. 绿维特利纳 Grüner Veltliner · 奥地利</h4><p style="color:#333;line-height:1.8;margin:0">白胡椒+青豆的独特香气，口感清爽带点微辣，配沙拉、清淡中餐都很棒。小众但好喝。<br/>参考价：¥98-148</p></div>' +
  '<h3 style="border-bottom:none;">💎 进阶级（¥150-300）——有点追求</h3>' +
  '<div class="ri"><h4>5. 夏布利 Chablis · 法国勃艮第</h4><p style="color:#333;line-height:1.8;margin:0">纯净的矿物感+柑橘香气，像喝了一口冰镇矿泉水+柠檬汁。配生蚝、白灼虾绝配。<br/>参考价：¥168-258</p></div>' +
  '<div class="ri"><h4>6. 雷司令 Riesling · 德国摩泽尔</h4><p style="color:#333;line-height:1.8;margin:0">半干型雷司令，微甜+高酸度，白桃+柠檬+蜂蜜香气。配川菜、泰国菜完美。<br/>参考价：¥128-228</p></div>' +
  '<div class="ri"><h4>7. 长相思 Sancerre · 法国卢瓦尔河谷</h4><p style="color:#333;line-height:1.8;margin:0">顶级长相思标杆，矿物感+柑橘+青草，优雅又清爽。配海鲜、 goat cheese 绝配。<br/>参考价：¥198-298</p></div>' +
  '<div class="ri"><h4>8. 琼瑶浆 Gewürztraminer · 阿尔萨斯</h4><p style="color:#333;line-height:1.8;margin:0">荔枝+玫瑰香气炸弹，口感圆润，微甜。配泰国菜、越南菜、重口味中餐。<br/>参考价：¥158-258</p></div>' +
  '<h3 style="border-bottom:none;">👑 收藏级（¥300+）——夏天也要有格调</h3>' +
  '<div class="ri"><h4>9. 普里尼-蒙哈榭 Puligny-Montrachet · 勃艮第</h4><p style="color:#333;line-height:1.8;margin:0">勃艮第白葡萄酒的巅峰，矿物感+柑橘+坚果，复杂度极高。夏天配龙虾、扇贝。<br/>参考价：¥388-588</p></div>' +
  '<div class="ri"><h4>10. 长相思+赛美蓉混酿 · 澳洲猎人谷</h4><p style="color:#333;line-height:1.8;margin:0">猎人谷的赛美龄陈年后有独特的蜂蜜焦糖味，配烤鱼、烤虾很搭。<br/>参考价：¥288-488</p></div>' +
  '<h3>🌸 5款夏日桃红推荐</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">桃红（Rosé）是夏天的完美选择——颜值高、口感清爽、配餐灵活。</p>' +
  '<div class="ri"><h4>1. 普罗旺斯桃红 · 法国</h4><p style="color:#333;line-height:1.8;margin:0">全世界桃红的标杆，三文鱼色，干型，草莓+柑橘香气，清爽优雅。配沙拉、海鲜、烧烤。<br/>参考价：¥128-228</p></div>' +
  '<div class="ri"><h4>2. 桃红起泡酒 · 意大利</h4><p style="color:#333;line-height:1.8;margin:0">微气泡，低酒精度，甜型，荔枝+草莓香气。女生最爱，派对必备。<br/>参考价：¥88-138</p></div>' +
  '<div class="ri"><h4>3. 白仙粉黛 White Zinfandel · 美国</h4><p style="color:#333;line-height:1.8;margin:0">甜型桃红，草莓+西瓜香气，清爽好喝。入门桃红首选。<br/>参考价：¥68-108</p></div>' +
  '<div class="ri"><h4>4. 歌海娜桃红 · 西班牙</h4><p style="color:#333;line-height:1.8;margin:0">干型桃红，红色浆果香气，口感圆润。配西班牙小吃、烤肉。<br/>参考价：¥98-168</p></div>' +
  '<div class="ri"><h4>5. 黑皮诺桃红 · 新西兰</h4><p style="color:#333;line-height:1.8;margin:0">精致的桃红，草莓+樱桃香气，酸度清爽。配海鲜、轻食。<br/>参考价：¥128-218</p></div>' +
  '<h3>🧊 夏天喝酒小贴士</h3>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>🧊 冰镇方法</h4><p style="color:#333;line-height:1.8;margin:0">白葡萄酒/桃红：冰镇到8-10°C（冰箱冷藏2-3小时）<br/>起泡酒：冰镇到6-8°C（冰箱冷藏3-4小时）<br/>没有冰桶？用湿毛巾包裹酒瓶放冰箱，30分钟速冷</p></div></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>🍽️ 配餐建议</h4><p style="color:#333;line-height:1.8;margin:0">海鲜/寿司 → 长相思、灰皮诺、夏布利<br/>川菜/泰国菜 → 半干雷司令、琼瑶浆<br/>烧烤/烤肉 → 桃红、歌海娜桃红<br/>沙拉/轻食 → 灰皮诺、阿尔巴利诺</p></div></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#f48fb1,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 夏天快乐，冰镇万岁 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '☀️ 夏日清爽白葡萄酒/桃红推荐：让这个夏天更清凉',
      author: '红酒顾问',
      digest: '35°C的夏天，红葡萄酒太重了。10款清爽白葡萄酒+5款桃红，冰镇后开瓶，解暑又解馋。',
      content: gen(),
      coverImage: 'summer_wine_guide_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["夏天", "白葡萄酒", "桃红", "清爽", "冰镇", "解暑", "推荐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'summer_wine_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ summer_wine_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ summer_wine_guide:', e.message);
    process.exit(1);
  }
}

main();
