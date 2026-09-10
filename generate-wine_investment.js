const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzI2MzIzOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuaKlei1hOWFpemXqDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5ZOq5Lqb6YWS5YC85b6X5Lmw5p2l5Y2H5YC877yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4jeWPquaYr+WWne+8jOi/mOiDvei1mumSsTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaKlei1hOaMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #263238; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #263238; border-bottom: 2px solid #78909c; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #263238; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#263238;">葡萄酒投资入门：哪些酒值得买来升值？</h2>' +
  '<p style="text-align:center;color:#666;">不只是喝，还能赚钱</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">你知道吗？一瓶1982年的拉菲，当年售价不到100美元，如今市场价超过5000美元。葡萄酒不只是饮品，更是一种另类投资。普通人如何入门？这篇指南告诉你。</p></section>' +
  '<h3>📈 葡萄酒投资的潜力</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据伦敦国际葡萄酒交易所（Liv-ex）的数据，顶级葡萄酒指数在过去20年里的年化收益率约为8-12%，跑赢了同期的黄金和部分股票指数。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资的魅力在于：它同时具备使用价值和投资价值。你可以喝掉它，也可以储存它等升值。即使不升值，你也享受了美酒。</p>' +
  '<h3>🍷 哪些酒值得投资？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不是所有葡萄酒都适合投资。只有那些具有陈年潜力、品牌价值高、产量有限的酒款，才有可能升值。</p>' +
  '<h3>📊 如何判断酒的升值潜力？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">判断一款酒是否值得投资，需要考虑以下几个因素：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌价值</strong>——名庄酒的升值潜力远大于普通酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>年份质量</strong>——好年份的酒才值得陈年和投资</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>产量稀缺</strong>——产量越少，升值空间越大</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>陈年潜力</strong>——能陈年10年以上的酒才有投资价值</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场认可度</strong>——在国际市场上有交易记录的酒款更安全</li></ul></section>' +
  '<h3>💰 普通人如何入门？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资并不只是富豪的游戏。普通人也可以从以下几个方面入手：</p>' +
  '<h3>⚠️ 投资风险提醒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资虽然有潜力，但也存在风险：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>储存风险</strong>——温度、湿度、光线都会影响酒的品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>流动性风险</strong>——葡萄酒不像股票，不能随时卖出</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>假酒风险</strong>——市场上存在大量假酒，需要从正规渠道购买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场风险</strong>——葡萄酒市场也会波动，不是只涨不跌</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>政策风险</strong>——进口关税、税收政策变化会影响价格</li></ul></section>' +
  '<h3>🔧 投资必备工具</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你想认真做葡萄酒投资，这些工具是必备的：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Liv-ex交易平台</strong>——全球最大的葡萄酒交易平台，可以实时查看市场价格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Wine-Searcher</strong>——全球葡萄酒价格比较网站</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Vivino</strong>——葡萄酒评分和社区</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>专业酒柜</strong>——恒温恒湿的储存环境是基础</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保险</strong>——高价值的酒款需要购买保险</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#78909c,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'葡萄酒投资的最高境界，是喝掉最贵的那瓶，剩下的留给时间。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒投资不是一夜暴富的工具，而是一种长期的、有乐趣的投资方式。如果你热爱葡萄酒，不妨从今天开始，为你的酒柜增加一些\'资产\'。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有葡萄酒投资的经验吗？<br/>你觉得哪些酒值得投资？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒投资入门：哪些酒值得买来升值？',
      author: '红樽坊',
      digest: '葡萄酒不只是喝，还能投资增值。从拉菲到康帝，哪些酒值得买来升值？普通人如何入门葡萄酒投资？',
      content: gen(),
      coverImage: 'wine_investment_cover_ai.png',
      category: 'investment',
      tags: ["投资", "升值", "收藏", "理财", "名庄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_investment_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Investment, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Investment:', e.message);
    process.exit(1);
  }
}

main();
