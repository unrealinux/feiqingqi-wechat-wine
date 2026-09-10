const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNGQ0MCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuaKlei1hDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5piv6aqX5bGA6L+Y5piv5py66YGH77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS9oOaVouaKleWQlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #004d40; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #004d40; border-bottom: 2px solid #26a69a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #004d40; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#004d40;">葡萄酒投资：是骗局还是机遇？</h2>' +
  '<p style="text-align:center;color:#666;">你敢投吗</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">买酒能升值？葡萄酒投资是真的赚钱还是割韭菜？有人靠投资葡萄酒赚了大钱，也有人血本无归。这篇指南带你了解葡萄酒投资的真相。</p></section>' +
  '<h3>💰 葡萄酒投资的诱惑</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资的诱惑在哪里？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>升值空间</strong>——好酒可以升值，回报率很高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性</strong>——好酒产量有限，物以稀为贵</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>历史回报</strong>——过去10年，名庄酒升值了3-5倍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>身份象征</strong>——拥有名庄酒有面子</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受与投资兼得</strong>——可以喝，也可以投资</li></ul></section>' +
  '<h3>📊 葡萄酒投资的真实回报</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资的真实回报是多少？</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款</th><th>10年前价格</th><th>现在价格</th><th>升值率</th></tr><tr><td>拉菲2005</td><td>5000元</td><td>15000元</td><td>200%</td></tr><tr><td>拉图2005</td><td>4000元</td><td>12000元</td><td>200%</td></tr><tr><td>玛歌2005</td><td>3500元</td><td>10000元</td><td>186%</td></tr><tr><td>木桐2005</td><td>3000元</td><td>8000元</td><td>167%</td></tr><tr><td>侯伯王2005</td><td>3500元</td><td>9000元</td><td>157%</td></tr></table></section>' +
  '<h3>🤔 葡萄酒投资的风险</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资有什么风险？</p>' +
  '<h3>💡 如何投资葡萄酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想投资葡萄酒，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>从名庄酒开始</strong>——名庄酒升值空间大</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择好年份</strong>——好年份的酒更有升值潜力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>专业储存</strong>——找专业酒窖储存</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>分散投资</strong>——不要把所有钱投在一种酒上</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>长期持有</strong>——葡萄酒投资需要耐心</li></ul></section>' +
  '<h3>🚫 投资陷阱</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">投资葡萄酒，这些陷阱要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信高回报</strong>——高回报通常伴随高风险</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要跟风投资</strong>——不要因为别人投资你也投资</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽视储存</strong>——储存是投资成功的关键</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽视流动性</strong>——变现能力很重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽视假酒</strong>——假酒是投资的最大风险</li></ul></section>' +
  '<h3>📊 投资速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>投资类型</th><th>门槛</th><th>风险</th><th>建议</th></tr><tr><td>名庄酒</td><td>高</td><td>中</td><td>适合有经验的投资者</td></tr><tr><td>中级庄</td><td>中</td><td>低</td><td>适合入门投资者</td></tr><tr><td>期酒</td><td>高</td><td>高</td><td>适合专业投资者</td></tr><tr><td>老年份</td><td>高</td><td>高</td><td>适合收藏家</td></tr><tr><td>新世界酒</td><td>低</td><td>低</td><td>适合新手</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26a69a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'投资葡萄酒，需要眼光和耐心。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资既有机会也有风险。关键是找到适合自己的投资方式，不要被高回报诱惑，理性投资。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你投资过葡萄酒吗？<br/>你觉得葡萄酒投资靠谱吗？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒投资：是骗局还是机遇？你敢投吗',
      author: '红樽坊',
      digest: '买酒能升值？葡萄酒投资是真的赚钱还是割韭菜？这篇指南带你了解葡萄酒投资的真相。',
      content: gen(),
      coverImage: 'wine_invest_cover_ai.png',
      category: 'opinion',
      tags: ["投资", "理财", "升值", "骗局", "机遇"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_invest_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Invest, media_id:', d.data.media_id);
  }catch(e){
    console.error('Invest:', e.message);
    process.exit(1);
  }
}

main();
