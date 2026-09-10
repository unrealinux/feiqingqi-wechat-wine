const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzMmYyZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkueahOivr+WMujwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+OTkl55qE5Lq66YO955CG6Kej6ZSZ5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWIq+WGjeiiq+i/meS6m+iwjuiogOmql+S6hjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puaPreenmDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #d32f2f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #d32f2f; border-bottom: 2px solid #ef5350; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #d32f2f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#d32f2f;">葡萄酒的误区：99%的人都理解错了</h2>' +
  '<p style="text-align:center;color:#666;">别再被这些谎言骗了</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">挂杯就是好酒？红酒配雪碧更好喝？这些葡萄酒误区，99%的人都理解错了。这篇指南帮你纠正这些错误观念。</p></section>' +
  '<h3>🤥 误区一：挂杯就是好酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为挂杯就是好酒，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>挂杯是什么</strong>——挂杯是酒液的粘稠度，与酒精和糖分有关</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——挂杯只说明酒精度或糖分高，不代表品质好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——便宜的甜酒挂杯很好，但品质一般</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——挂杯不是判断酒质的标准</li></ul></section>' +
  '<h3>🤥 误区二：红酒配雪碧更好喝</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人喜欢红酒配雪碧，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>问题</strong>——雪碧的甜味会掩盖红酒的风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——好酒不需要加任何东西</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——加雪碧的红酒，喝不到酒的原味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——红酒应该纯饮，不要加任何东西</li></ul></section>' +
  '<h3>🤥 误区三：酒越老越好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为酒越老越好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——大部分酒不适合陈年，应该趁新鲜喝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——100块的酒陈年5年，可能还不如新鲜喝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——只有好酒才值得陈年</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不是所有酒都值得陈年</li></ul></section>' +
  '<h3>🤥 误区四：红酒要醒酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为红酒都要醒酒，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——只有需要醒的酒才要醒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——年轻的黑皮诺不需要醒酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——醒酒是为了让酒与空气接触，软化单宁</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不是所有酒都需要醒酒</li></ul></section>' +
  '<h3>🤥 误区五：法国酒最好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为法国酒最好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——新世界国家的酒性价比更高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——智利赤霞珠的性价比比波尔多高很多</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——法国酒有品牌溢价</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不要只看产区，关注酒质</li></ul></section>' +
  '<h3>🤥 误区六：螺旋盖的酒不好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为螺旋盖的酒不好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——螺旋盖的酒品质也可以很好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——澳大利亚很多好酒用螺旋盖</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——螺旋盖只是封装方式，不影响酒质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不要以封装方式判断酒质</li></ul></section>' +
  '<h3>🤥 误区七：红酒要倒满杯</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人喜欢倒满杯红酒，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——红酒应该倒1/3杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——留出空间让酒与空气接触，释放香气</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——倒满杯的红酒，香气无法释放</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——红酒应该倒1/3杯</li></ul></section>' +
  '<h3>📊 误区 vs 真相</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>误区</th><th>真相</th></tr><tr><td>挂杯就是好酒</td><td>挂杯只说明酒精度或糖分高</td></tr><tr><td>红酒配雪碧更好喝</td><td>好酒不需要加任何东西</td></tr><tr><td>酒越老越好</td><td>大部分酒应该趁新鲜喝</td></tr><tr><td>红酒都要醒酒</td><td>只有需要醒的酒才要醒</td></tr><tr><td>法国酒最好</td><td>新世界酒性价比更高</td></tr><tr><td>螺旋盖的酒不好</td><td>螺旋盖不影响酒质</td></tr><tr><td>红酒要倒满杯</td><td>红酒应该倒1/3杯</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'纠正误区，才能真正懂酒。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的误区很多，但只要你知道这些误区，就能更懂酒。纠正误区，享受喝酒的乐趣。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你被哪些葡萄酒误区骗过？<br/>你知道哪些葡萄酒真相？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒的误区：99%的人都理解错了',
      author: '红樽坊',
      digest: '挂杯就是好酒？红酒配雪碧更好喝？这些葡萄酒误区，99%的人都理解错了。',
      content: gen(),
      coverImage: 'wine_myths_real_cover_ai.png',
      category: 'opinion',
      tags: ["误区", "真相", "避坑", "科普", "纠正"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_myths_real_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Myths, media_id:', d.data.media_id);
  }catch(e){
    console.error('Myths:', e.message);
    process.exit(1);
  }
}

main();
