const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I3MWMxYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuW5tOi9u+S6ujwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5Li65LuA5LmI5LiN54ix5Zad57qi6YWS5LqG77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4gOWcuuWFs+S6juWPo+WRs+OAgeaWh+WMluS4jua2iOi0ueS5oOaDr+eahOWPmOmdqTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puinguWvnzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #b71c1c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #b71c1c; border-bottom: 2px solid #ef5350; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #b71c1c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#b71c1c;">年轻人为什么不爱喝红酒了？</h2>' +
  '<p style="text-align:center;color:#666;">涩味太重？仪式感太强？价格不透明？</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">曾几何时，红酒是\'高端\' \'品位\' \'成熟\'的代名词。但如今，越来越多的年轻人对红酒敬而远之。他们宁愿喝一杯清爽的白葡萄酒，或者一瓶精酿啤酒，也不愿意端起那杯\'深红色的液体\'。这到底是为什么？</p></section>' +
  '<h3>❌ 原因一：涩味是最大的门槛</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">对于很多年轻人来说，第一次喝红酒的体验并不愉快。那股强烈的涩味（单宁），让很多人直接把红酒拉入了\'不好喝\'的黑名单。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">单宁是红葡萄酒中天然存在的多酚物质，它给口腔带来干涩、紧绷的感觉。对于没有喝过红酒的人来说，这种感觉非常陌生，甚至令人不悦。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">相比之下，白葡萄酒几乎没有单宁，口感清爽易入口。精酿啤酒有丰富的果香和麦芽味，调酒更是千变万化。红酒的\'涩\'，在年轻人的口味选择中，变成了一个巨大的门槛。</p>' +
  '<h3>🎭 原因二：仪式感太强，压力太大</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒文化中充满了各种\'仪式\'：醒酒、摇杯、闻香、品味……这些步骤对于爱好者来说是享受，但对于年轻人来说，却像是一场考试。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">\'我不会醒酒，是不是很土？\'\'我不知道怎么描述香气，是不是显得很low？\'——这些焦虑让年轻人对红酒望而却步。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">年轻人喝酒，追求的是轻松、自在、无压力。他们不想在喝酒的时候还要担心自己\'懂不懂\'。白葡萄酒、啤酒、调酒，都没有这种\'知识门槛\'。</p>' +
  '<h3>💰 原因三：价格不透明，水太深</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒市场的价格混乱，是年轻人诟病最多的问题之一。同一款酒，在不同的渠道，价格可能相差3-5倍。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">\'这瓶酒标价800，但成本可能只有80块。\'\'这个年份的酒，真的比上一年的好吗？还是只是营销噱头？\'——年轻人对红酒的信任度，正在被这些疑问侵蚀。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">相比之下，白酒、啤酒、调酒的价格相对透明。年轻人知道一瓶啤酒值多少钱，一杯调酒的成本是多少。但红酒？他们完全看不懂。</p>' +
  '<h3>📱 原因四：社交媒体的\'去红酒化\'</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">在小红书、抖音上，白葡萄酒、精酿啤酒、自然酒的内容远比红酒受欢迎。原因很简单：白葡萄酒更\'上镜\'，精酿啤酒更\'有趣\'，自然酒更\'有故事\'。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒在社交媒体上的形象，往往与\'商务宴请\' \'中年成功人士\' \'正式场合\'挂钩。这些标签，与年轻人追求的\'轻松\'\'悦己\'\'个性化\'背道而驰。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">更有趣的是，白葡萄酒的\'清爽感\'和\'轻盈感\'，天然符合社交媒体上的\'轻奢\'\'氛围感\'等标签，更容易引发分享和讨论。</p>' +
  '<h3>🍷 原因五：选择太多，红酒不再是唯一</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">十年前，喝酒的选择相对有限：白酒、啤酒、红酒。但如今，年轻人的选择太多了：精酿啤酒、果酒、低度酒、调酒、白葡萄酒、自然酒、起泡酒……</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">在这么多选择中，红酒凭什么脱颖而出？它的\'高端\'\'品位\'标签，在年轻人眼中，反而成了一种负担。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">年轻人不想被定义，不想被标签化。他们喝酒，是为了享受，不是为了证明什么。</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<h3>🤔 那么，红酒还有未来吗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">答案是肯定的。红酒不会消失，但它需要改变。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一些酒庄已经开始行动：推出低单宁、易饮型的红酒；简化酒标设计，让年轻人更容易理解；在社交媒体上打造\'轻松喝酒\'的内容。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">更重要的是，红酒行业需要放下\'身段\'，不要再用\'教育者\'的姿态面对年轻人。年轻人不需要被教育，他们需要被理解。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你身边有不爱喝红酒的年轻人吗？<br/>你觉得红酒应该如何改变才能吸引年轻人？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '年轻人为什么不爱喝红酒了？',
      author: '红樽坊',
      digest: '涩味太重？仪式感太强？价格不透明？深度剖析年轻人"逃离"红酒的5个真实原因，以及酒行业的应对之道。',
      content: gen(),
      coverImage: 'gen_z_red_wine_cover_ai.png',
      category: 'trend-analysis',
      tags: ["年轻人", "红酒", "消费趋势", "葡萄酒文化", "口味变化"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'gen_z_red_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('GenZ Red Wine, media_id:', d.data.media_id);
  }catch(e){
    console.error('GenZ Red Wine:', e.message);
    process.exit(1);
  }
}

main();
