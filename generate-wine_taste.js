const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I3MWMxYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4uuS7gOS5iOS9oOWWneS4jeWHuuWlvemFku+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55yf55u45Y+v6IO95omO5b+D5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjk5JeeahOS6uumDveW/veeVpeS6hui/meS4gOeCuTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#b71c1c;">为什么你喝不出好酒？</h2>' +
  '<p style="text-align:center;color:#666;">真相可能扎心了</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">花了大价钱买好酒，却喝不出区别？不是你的味觉有问题，而是你忽略了这些关键因素。这篇指南告诉你为什么你喝不出好酒，以及如何提升品酒能力。</p></section>' +
  '<h3>🤔 你真的喝不出好酒吗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人觉得自己喝不出好酒，其实是因为：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>没有对比</strong>——没有同时喝过好酒和差酒，无法分辨</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>没有训练</strong>——味觉没有经过训练，不够敏感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>期望过高</strong>——期望越高，失望越大</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>环境干扰</strong>——喝酒的环境影响了感受</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>心态问题</strong>——带着偏见喝酒，无法客观评价</li></ul></section>' +
  '<h3>🧠 味觉的真相</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">味觉的真相是什么？</p>' +
  '<h3>🍷 为什么好酒贵？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">好酒为什么贵？不只是因为好喝：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>产量有限</strong>——好酒的产量通常很少，物以稀为贵</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>陈年潜力</strong>——好酒可以陈年，越老越值钱</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌溢价</strong>——名庄酒有品牌溢价</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>营销成本</strong>——酒商的营销成本最终转嫁给消费者</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性</strong>——好酒越来越稀缺，价格自然上涨</li></ul></section>' +
  '<h3>💡 如何提升品酒能力？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想提升品酒能力，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝多比较</strong>——同时喝几款酒，对比差异</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录感受</strong>——每次喝酒后记录感受，积累经验</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>学习知识</strong>——了解葡萄酒的酿造过程和风味特点</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参加品酒会</strong>——参加品酒会可以快速提升</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>找老师指导</strong>——找有经验的人指导，进步更快</li></ul></section>' +
  '<h3>🎯 品酒的正确方式</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒有正确的方式，按这个步骤来：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看</strong>——观察酒的颜色和清澈度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>闻</strong>——闻酒的香气，分辨不同的气味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品</strong>——小口品尝，感受酒的口感和余味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>评</strong>——综合评价酒的品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记</strong>——记录品酒感受，积累经验</li></ul></section>' +
  '<h3>🚫 品酒的常见误区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒时，这些误区要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信专家</strong>——专家的评价不一定适合你</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信评分</strong>——评分只是参考，不代表一切</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信价格</strong>——价格不代表品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信品牌</strong>——品牌不代表一切</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li></ul></section>' +
  '<h3>📊 品酒能力提升路径</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>阶段</th><th>目标</th><th>方法</th></tr><tr><td>入门</td><td>能分辨好坏</td><td>多喝多比较</td></tr><tr><td>进阶</td><td>能分辨产区</td><td>学习产区知识</td></tr><tr><td>高级</td><td>能分辨年份</td><td>学习年份知识</td></tr><tr><td>专家</td><td>能分辨酒庄</td><td>深入学习酒庄知识</td></tr><tr><td>大师</td><td>能盲品</td><td>长期训练和实践</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'品酒不是天赋，而是训练。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">喝不出好酒，不是你的错。味觉是可以训练的，只要多喝多比较，你也能成为品酒高手。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你觉得自己喝得出好酒吗？<br/>你有什么提升品酒能力的方法？<br/>欢迎在评论区分享你的经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '为什么你喝不出好酒？真相可能扎心了',
      author: '红樽坊',
      digest: '花了大价钱买好酒，却喝不出区别？不是你的味觉有问题，而是你忽略了这些关键因素。',
      content: gen(),
      coverImage: 'wine_taste_cover_ai.png',
      category: 'opinion',
      tags: ["品酒", "味觉", "真相", "扎心", "深度"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_taste_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Taste, media_id:', d.data.media_id);
  }catch(e){
    console.error('Taste:', e.message);
    process.exit(1);
  }
}

main();
