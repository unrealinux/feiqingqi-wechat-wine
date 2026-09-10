const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2M2MjgyOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4reWbveiRoeiQhOmFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LuO56yR6K+d5Yiw5oOK5ZacPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWbveS6p+mFkuato+WcqOmAhuiirTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #c62828; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #c62828; border-bottom: 2px solid #ef5350; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #c62828; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#c62828;">中国葡萄酒：从笑话到惊喜</h2>' +
  '<p style="text-align:center;color:#666;">国产酒正在逆袭</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">曾经被嘲笑的中国葡萄酒，现在能让法国酒庄紧张了？从宁夏到新疆，中国葡萄酒正在逆袭。这篇指南带你了解中国葡萄酒的过去、现在和未来。</p></section>' +
  '<h3>🤣 过去：中国葡萄酒的笑话</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒曾经被嘲笑：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质差</strong>——很多中国葡萄酒被戏称为\'葡萄汁\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格低</strong>——10块钱一瓶，没人当真</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌弱</strong>——没有知名品牌，没人认可</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>技术落后</strong>——酿造技术不如法国、意大利</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>形象差</strong>——送人中国酒会被嫌弃</li></ul></section>' +
  '<h3>🌟 现在：中国葡萄酒的逆袭</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">现在，中国葡萄酒正在逆袭：</p>' +
  '<h3>📈 中国葡萄酒的进步</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒的进步体现在这些方面：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>技术提升</strong>——引进法国酿造设备和技术</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>人才引进</strong>——聘请法国酿酒师</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质提升</strong>——品质不断提升，获得国际认可</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌建设</strong>——打造自己的知名品牌</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>国际获奖</strong>——在国际大赛中屡获大奖</li></ul></section>' +
  '<h3>🌍 国际评价</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">国际葡萄酒界对中国葡萄酒的评价：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>杰西斯·罗宾逊</strong>——\'中国葡萄酒的进步令人印象深刻\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>罗伯特·帕克</strong>——\'中国葡萄酒有潜力成为世界顶级\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Decanter杂志</strong>——\'中国是未来葡萄酒的重要产区\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>国际大赛</strong>——中国葡萄酒多次获得金奖</li></ul></section>' +
  '<h3>🤔 中国葡萄酒的问题</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒还有这些问题：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格虚高</strong>——有些中国酒价格比法国酒还贵</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌认知度低</strong>——很多人还不认可中国酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场混乱</strong>——假酒、劣质酒充斥市场</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>缺乏标准</strong>——葡萄酒标准不如法国严格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>消费习惯</strong>——很多人还是习惯喝进口酒</li></ul></section>' +
  '<h3>💡 如何选择中国葡萄酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想尝试中国葡萄酒，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择宁夏产区</strong>——宁夏是中国最好的产区</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择知名酒庄</strong>——张裕、贺兰晴雪等知名酒庄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择赤霞珠</strong>——赤霞珠是中国最成功的品种</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择中等价位</strong>——100-300元的中国酒性价比最高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参加品酒会</strong>——参加品酒会可以快速了解</li></ul></section>' +
  '<h3>📊 中国葡萄酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>特点</th><th>推荐酒庄</th><th>价位</th></tr><tr><td>宁夏</td><td>品质最好</td><td>张裕、贺兰晴雪</td><td>200-500元</td></tr><tr><td>新疆</td><td>产量最大</td><td>中信国安、新天</td><td>50-200元</td></tr><tr><td>云南</td><td>最独特</td><td>香格里拉</td><td>300-800元</td></tr><tr><td>山东</td><td>历史最久</td><td>张裕、长城</td><td>50-300元</td></tr><tr><td>河北</td><td>产量较大</td><td>长城、中粮</td><td>50-200元</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'中国葡萄酒的未来，不可限量。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒正在从笑话变成惊喜。从宁夏到新疆，中国葡萄酒正在逆袭。给国产酒一个机会，你可能会惊喜。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你喝过中国葡萄酒吗？<br/>你觉得中国葡萄酒怎么样？<br/>欢迎在评论区分享你的体验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '中国葡萄酒：从笑话到惊喜，国产酒正在逆袭',
      author: '红樽坊',
      digest: '曾经被嘲笑的中国葡萄酒，现在能让法国酒庄紧张了？从宁夏到新疆，中国葡萄酒正在逆袭。',
      content: gen(),
      coverImage: 'china_wine_cover_ai.png',
      category: 'opinion',
      tags: ["中国", "国产酒", "宁夏", "逆袭", "惊喜"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'china_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('China Wine, media_id:', d.data.media_id);
  }catch(e){
    console.error('China Wine:', e.message);
    process.exit(1);
  }
}

main();
