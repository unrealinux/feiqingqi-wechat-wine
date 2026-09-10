const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izg4MGU0ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkueahOecn+ebuDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+OTkl55qE5Lq66YO96KKr6aqX5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWIq+WGjeiiq+i/meS6m+iwjuiogOmql+S6hjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOe7iOaegeaPreenmDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #880e4f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #880e4f; border-bottom: 2px solid #e91e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #880e4f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#880e4f;">葡萄酒的真相：99%的人都被骗了</h2>' +
  '<p style="text-align:center;color:#666;">别再被这些谎言骗了</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">挂杯就是好酒？越贵越好喝？这些葡萄酒谎言，99%的人都信了。真相可能颠覆你的认知。</p></section>' +
  '<h3>🤥 谎言一：挂杯就是好酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为挂杯就是好酒，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>挂杯是什么</strong>——挂杯是酒液的粘稠度，与酒精和糖分有关</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——挂杯只说明酒精度或糖分高，不代表品质好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——便宜的甜酒挂杯很好，但品质一般</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——挂杯不是判断酒质的标准</li></ul></section>' +
  '<h3>🤥 谎言二：越贵越好喝</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为越贵越好喝，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格构成</strong>——价格包括品牌、渠道、税费等</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——100块的酒可能比1000块的酒更适合你</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——很多人喝不出100块和1000块的区别</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——适合你的才是最好的</li></ul></section>' +
  '<h3>🤥 谎言三：法国酒最好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为法国酒最好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>法国酒</strong>——确实优秀，但不是唯一选择</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——新世界国家的酒性价比更高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——智利赤霞珠的性价比比波尔多高很多</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不要只看产区，关注酒质</li></ul></section>' +
  '<h3>🤥 谎言四：老酒一定好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为老酒一定好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>陈年</strong>——只有好酒才值得陈年</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——大部分酒不适合陈年，应该趁新鲜喝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——100块的酒陈年5年，可能还不如新鲜喝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不是所有酒都值得陈年</li></ul></section>' +
  '<h3>🤥 谎言五：专家说的就是对的</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人迷信专家，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>专家</strong>——专家的评价是主观的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——专家的口味不代表你的口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——专家说好的酒，你可能不喜欢</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——相信自己的舌头</li></ul></section>' +
  '<h3>🤥 谎言六：红酒配牛排最好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为红酒配牛排最好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐</strong>——配餐要看个人口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——白葡萄酒配牛排也可以很好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——霞多丽配牛排也很美味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——配餐没有标准答案</li></ul></section>' +
  '<h3>🤥 谎言七：开瓶后要醒酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为开瓶后都要醒酒，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>醒酒</strong>——只有需要醒的酒才要醒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——很多酒不需要醒，直接喝更好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——年轻的黑皮诺不需要醒酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不是所有酒都需要醒酒</li></ul></section>' +
  '<h3>🤥 谎言八：螺旋盖的酒不好</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">很多人认为螺旋盖的酒不好，这是错的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>螺旋盖</strong>——螺旋盖只是封装方式</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——螺旋盖的酒品质也可以很好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>例子</strong>——澳大利亚很多好酒用螺旋盖</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结论</strong>——不要以封装方式判断酒质</li></ul></section>' +
  '<h3>📊 谎言 vs 真相</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>谎言</th><th>真相</th></tr><tr><td>挂杯就是好酒</td><td>挂杯只说明酒精度或糖分高</td></tr><tr><td>越贵越好喝</td><td>适合你的才是最好的</td></tr><tr><td>法国酒最好</td><td>新世界酒性价比更高</td></tr><tr><td>老酒一定好</td><td>不是所有酒都值得陈年</td></tr><tr><td>专家说的就是对的</td><td>相信自己的舌头</td></tr><tr><td>红酒配牛排最好</td><td>配餐没有标准答案</td></tr><tr><td>开瓶后都要醒酒</td><td>不是所有酒都需要醒酒</td></tr><tr><td>螺旋盖的酒不好</td><td>螺旋盖的酒品质也可以很好</td></tr></table></section>' +
  '<h3>💡 如何不被骗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想不被骗，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>学习知识</strong>——知识是最好的防骗工具</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝多比较</strong>——不要只喝一种酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>忽略品牌和评分</strong>——关注酒质，不看名气</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持理性</strong>——不要被营销忽悠</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#e91e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'真相是：适合你的才是最好的。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的真相是：没有绝对的标准，适合你的才是最好的。不要被谎言骗了，相信自己的舌头，找到真正适合自己的好酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你被哪些葡萄酒谎言骗过？<br/>你知道哪些葡萄酒真相？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒的真相：99%的人都被骗了',
      author: '红樽坊',
      digest: '挂杯就是好酒？越贵越好喝？这些葡萄酒谎言，99%的人都信了。真相可能颠覆你的认知。',
      content: gen(),
      coverImage: 'wine_truth_cover_ai.png',
      category: 'opinion',
      tags: ["真相", "谎言", "误区", "颠覆", "认知"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_truth_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Truth, media_id:', d.data.media_id);
  }catch(e){
    console.error('Truth:', e.message);
    process.exit(1);
  }
}

main();
