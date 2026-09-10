const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzE1NjVjMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuWFpemXqOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LuO6Zu25byA5aeLPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuaIkOS4uuaHgumFkueahOS6ujwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaWsOaJi+aMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1565c0; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1565c0; border-bottom: 2px solid #42a5f5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1565c0; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1565c0;">葡萄酒入门指南：从零开始的完美指南</h2>' +
  '<p style="text-align:center;color:#666;">成为懂酒的人</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">完全不懂葡萄酒？没关系！这篇指南帮你从零开始，快速成为懂酒的人。不需要死记硬背，轻松入门。</p></section>' +
  '<h3>🍷 第一步：认识葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒是什么？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>定义</strong>——葡萄酒是用葡萄发酵酿造的酒精饮品</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒精度</strong>——通常在10-15%之间</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>颜色</strong>——红葡萄酒、白葡萄酒、桃红葡萄酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜度</strong>——干型、半干型、半甜型、甜型</li></ul></section>' +
  '<h3>🍇 第二步：认识葡萄品种</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">常见的葡萄品种：</p>' +
  '<h3>🌍 第三步：认识产区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">世界主要葡萄酒产区：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>特点</th><th>代表酒款</th></tr><tr><td>法国</td><td>传统、优雅</td><td>波尔多、勃艮第</td></tr><tr><td>意大利</td><td>多样、美食搭配</td><td>基安蒂、巴罗洛</td></tr><tr><td>西班牙</td><td>热情、性价比高</td><td>里奥哈、丹魄</td></tr><tr><td>美国</td><td>创新、果味浓</td><td>纳帕谷赤霞珠</td></tr><tr><td>澳大利亚</td><td>易饮、性价比高</td><td>巴罗萨西拉</td></tr><tr><td>智利</td><td>性价比极高</td><td>中央山谷赤霞珠</td></tr></table></section>' +
  '<h3>👃 第四步：学会品酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒四步法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看</strong>——观察酒的颜色和清澈度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>闻</strong>——闻酒的香气，分辨不同的气味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品</strong>——小口品尝，感受酒的口感和余味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>评</strong>——综合评价酒的品质</li></ul></section>' +
  '<h3>🍽️ 第五步：学会配餐</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒配餐的基本原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>红酒配红肉</strong>——赤霞珠配牛排</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>白酒配白肉</strong>——霞多丽配鱼</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>起泡酒配海鲜</strong>——香槟配生蚝</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜酒配甜点</strong>——莫斯卡提配蛋糕</li></ul></section>' +
  '<h3>🛒 第六步：买酒指南</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">新手买酒的建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>从便宜的开始</strong>——50-100元的酒就够了</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择知名产区</strong>——波尔多、纳帕谷等</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>问店员推荐</strong>——告诉店员你的口味偏好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>买小瓶装</strong>——先试试，好喝再买大瓶</li></ul></section>' +
  '<h3>📊 新手入门速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>问题</th><th>答案</th></tr><tr><td>葡萄酒是什么</td><td>用葡萄发酵的酒精饮品</td></tr><tr><td>红葡萄酒和白葡萄酒的区别</td><td>红葡萄酒带皮发酵，白葡萄酒去皮发酵</td></tr><tr><td>什么是干型葡萄酒</td><td>残糖量低于4g/L的葡萄酒</td></tr><tr><td>什么是单宁</td><td>葡萄皮中的涩感物质</td></tr><tr><td>什么是年份</td><td>葡萄采摘的年份</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#42a5f5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'喝酒是最好的学习方式。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒入门不需要死记硬背，多喝多比较，你就能成为懂酒的人。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你对葡萄酒有什么疑问？<br/>你入门时遇到过什么困惑？<br/>欢迎在评论区提问！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒入门指南：从零开始的完美指南',
      author: '红樽坊',
      digest: '完全不懂葡萄酒？没关系！这篇指南帮你从零开始，快速成为懂酒的人。',
      content: gen(),
      coverImage: 'wine_beginner_cover_ai.png',
      category: 'education',
      tags: ["入门", "新手", "基础", "学习", "指南"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_beginner_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Beginner, media_id:', d.data.media_id);
  }catch(e){
    console.error('Beginner:', e.message);
    process.exit(1);
  }
}

main();
