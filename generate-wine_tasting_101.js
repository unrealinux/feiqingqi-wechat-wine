const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjM3ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjbcg6JGh6JCE6YWS5ZOB6Ym05YWl6ZeoPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7ku47pm7blvIDlp4vnmoTlk4HphZLkuYvml4U8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+6KeC6ImyIMK3IOmXu+mmmSDCtyDlk4HlkbMgwrcg6K+E6Ym0IMK3IOaWsOaJi+W/heivuzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWTgemJtOWFpemXqCDCtyDnuqLphZLpob7pl648L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1a237e; border-bottom: 2px solid #5c6bc0; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1a237e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1a237e;">🍷 葡萄酒品鉴入门</h2>' +
  '<p style="text-align:center;color:#666;">从零开始的品酒之旅 | 观色 · 闻香 · 品味 · 评鉴</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人觉得品酒是专业人士的事，普通人只需要"好喝就行"。但其实，学会基本的品鉴方法，能让你喝酒时多出10倍的乐趣。就像喝咖啡一样——一旦你开始注意风味层次，就再也回不去了。</p></section>' +
  '<h3>👁️ 第一步：观色</h3>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 新手技巧</h4><p style="color:#333;line-height:1.8;margin:0">观色不是越深越好。颜色深浅主要反映葡萄品种和酿造工艺，和品质没有直接关系。黑皮诺颜色浅但可以是世界上最贵的葡萄酒。</p></div></section>' +
  '<h3>👃 第二步：闻香</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>香气类型</th><th>闻到什么</th><th>说明什么</th></tr><tr><td>红色水果</td><td>草莓、樱桃、覆盆子</td><td>黑皮诺、佳美、歌海娜</td></tr><tr><td>黑色水果</td><td>黑莓、黑醋栗、蓝莓</td><td>赤霞珠、西拉、梅洛</td></tr><tr><td>花香</td><td>紫罗兰、玫瑰、茉莉</td><td>歌海娜、维欧尼、雷司令</td></tr><tr><td>香草/奶油</td><td>香草、黄油、奶油</td><td>橡木桶陈年，霞多丽</td></tr><tr><td>香料</td><td>胡椒、肉桂、丁香</td><td>西拉、歌海娜、桑娇维塞</td></tr><tr><td>矿物/泥土</td><td>湿石头、蘑菇、皮革</td><td>老藤、陈年酒、板岩土壤</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 闻香技巧</h4><p style="color:#333;line-height:1.8;margin:0">先静止闻一次，再摇杯后闻一次。摇杯会释放更多香气。如果闻不到香气，可能是酒太冷（白葡萄酒）或太热（红葡萄酒）。最佳温度：红16-18°C，白8-10°C。</p></div></section>' +
  '<h3>👅 第三步：品味</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>维度</th><th>低</th><th>中</th><th>高</th></tr><tr><td>甜度</td><td>干型（Trocken/Dry）</td><td>半干（Halbtrocken）</td><td>甜型（Süß/Sweet）</td></tr><tr><td>酸度</td><td>圆润柔和</td><td>清爽适中</td><td>尖锐刺激</td></tr><tr><td>单宁</td><td>丝滑如天鹅绒</td><td>中等涩感</td><td>干涩收敛</td></tr><tr><td>酒体</td><td>轻盈如水</td><td>中等饱满</td><td>浓郁厚重</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 品味技巧</h4><p style="color:#333;line-height:1.8;margin:0">喝一小口，让酒在口中停留5-10秒，用舌头不同部位感受：舌尖感受甜度，两侧感受酸度，舌根感受苦味。然后咽下，感受余味长度。好酒的余味应该持续10秒以上。</p></div></section>' +
  '<h3>📝 第四步：评鉴</h3>' +
  '<h3>🍷 实战练习：5款入门酒推荐</h3>' +
  '<h3>📊 品鉴记录模板</h3>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">品酒不是考试，没有标准答案。每个人的舌头不同，喜好也不同。学会品鉴是为了更好地享受葡萄酒，而不是为了显得专业。</p></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#5c6bc0,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 干杯，享受每一口 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍷 葡萄酒品鉴入门：从零开始的品酒之旅',
      author: '红酒顾问',
      digest: '观色、闻香、品味、评鉴——四个步骤，带你从葡萄酒小白变成品酒达人。',
      content: gen(),
      coverImage: 'wine_tasting_101_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["品鉴", "入门", "品酒", "葡萄酒知识", "新手", "观色", "闻香", "品味"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_tasting_101_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ wine_tasting_101, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ wine_tasting_101:', e.message);
    process.exit(1);
  }
}

main();
