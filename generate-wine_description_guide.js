const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjM3ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWmguS9leaPj+i/sOS4gOasvumFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5ZOB6YWS6K+N6YCf5oiQ5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juWFpemXqOWIsOijhemAvOeahOWTgemFkuivjeaxhzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWTgemFkuWFpemXqDwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#1a237e;">如何描述一款酒？品酒词速成指南</h2>' +
  '<p style="text-align:center;color:#666;">从入门到装逼的品酒词汇</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">品酒时，你是不是只会说\'好喝\'或\'不好喝\'？看着别人侃侃而谈\'黑醋栗、雪松、矿物质\'，你是不是一脸羡慕？这篇指南，帮你快速掌握品酒词汇，让你也能像专业人士一样描述葡萄酒。</p></section>' +
  '<h3>🍷 品酒的基本步骤</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒有三个基本步骤：看、闻、尝。</p>' +
  '<h3>🍇 常见香气词汇</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不同葡萄品种有不同的典型香气：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>葡萄品种</th><th>典型香气</th><th>描述示例</th></tr><tr><td>赤霞珠</td><td>黑醋栗、雪松、烟草、黑胡椒</td><td>黑醋栗、雪松、淡淡的烟草和黑胡椒气息</td></tr><tr><td>梅洛</td><td>李子、巧克力、樱桃、香草</td><td>成熟的李子、黑巧克力、樱桃和香草风味</td></tr><tr><td>黑皮诺</td><td>红樱桃、草莓、蘑菇、泥土</td><td>精致的红樱桃、草莓，伴有泥土和蘑菇的气息</td></tr><tr><td>霞多丽</td><td>柠檬、苹果、黄油、烤面包</td><td>清新的柠檬、苹果，带有黄油和烤面包的香气</td></tr><tr><td>长相思</td><td>百香果、青草、柑橘、矿物质</td><td>百香果、青草、柑橘风味，矿物质感明显</td></tr><tr><td>雷司令</td><td>柠檬、青苹果、蜂蜜、矿物质</td><td>柠檬、青苹果，陈年后发展出蜂蜜风味</td></tr></table></section>' +
  '<h3>📝 品酒词模板</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这里提供几个品酒词模板，帮你快速组织语言：</p>' +
  '<h3>🚫 品酒常见错误</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒时，这些错误要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只说\'好喝\'</strong>——太笼统，没有描述具体特点</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>用太多专业术语</strong>——让人听不懂，显得装逼</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>描述不准确</strong>——说错了更尴尬</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只说缺点</strong>——不礼貌，也不全面</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>照搬别人的描述</strong>——没有自己的感受</li></ul></section>' +
  '<h3>💡 品酒练习建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如何提高品酒描述能力？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝多练</strong>——品酒能力是练出来的，不是学出来的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>边喝边记</strong>——记下每次品酒的感受</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>对比品鉴</strong>——同时品两款酒，找出差异</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参考专业描述</strong>——看看专业品酒师是怎么描述的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要害怕说错</strong>——品酒没有标准答案</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#5c6bc0,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'品酒的最高境界，不是说出多少专业术语，而是真实地表达自己的感受。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒描述是一种技能，需要时间和练习。不要急于求成，慢慢来，你会发现品酒的乐趣远不止\'好喝\'二字。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你品酒时最喜欢用什么词汇？<br/>你有什么品酒的小技巧？<br/>欢迎在评论区分享你的品酒经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '如何描述一款酒？品酒词速成指南',
      author: '红樽坊',
      digest: '从入门到装逼的品酒词汇。看完这篇，你也能像专业人士一样描述葡萄酒。',
      content: gen(),
      coverImage: 'wine_description_guide_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["品酒", "描述", "词汇", "入门", "品鉴"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_description_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Description, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Description:', e.message);
    process.exit(1);
  }
}

main();
