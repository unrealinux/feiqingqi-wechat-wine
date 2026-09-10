const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODM4ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWFqOeQg+iRoeiQhOmFkuWcsOWbvjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6JGh6JCE6YWS5peF6KGM5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWOu+S6p+WMuuacneWcozwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaXheihjOaMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #00838f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #00838f; border-bottom: 2px solid #26c6da; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #00838f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#00838f;">全球葡萄酒地图：葡萄酒旅行指南</h2>' +
  '<p style="text-align:center;color:#666;">去产区朝圣</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">从波尔多到纳帕谷，从勃艮第到巴罗萨，全球最值得去的葡萄酒产区。这篇指南帮你规划葡萄酒之旅。</p></section>' +
  '<h3>🌍 欧洲：葡萄酒的故乡</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">欧洲是葡萄酒的故乡，最值得去的产区：</p>' +
  '<h3>🌎 新世界：创新与传统</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">新世界国家的葡萄酒产区：</p>' +
  '<h3>🇨🇳 中国：新兴产区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国最值得去的葡萄酒产区：</p>' +
  '<h3>📊 旅行速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>最佳时间</th><th>预算</th><th>亮点</th></tr><tr><td>波尔多</td><td>9-10月</td><td>高</td><td>五大名庄</td></tr><tr><td>勃艮第</td><td>9-10月</td><td>高</td><td>特级园</td></tr><tr><td>纳帕谷</td><td>9-10月</td><td>高</td><td>赤霞珠</td></tr><tr><td>巴罗萨</td><td>3-5月</td><td>中</td><td>西拉</td></tr><tr><td>宁夏</td><td>9-10月</td><td>中</td><td>国际获奖</td></tr></table></section>' +
  '<h3>💡 旅行小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的葡萄酒之旅更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前预约</strong>——酒庄需要提前预约参观</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择合适的交通</strong>——租车或包车更方便</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制品酒量</strong>——品酒不要喝太多</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录感受</strong>——记录品酒感受</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>购买纪念品</strong>——买几瓶酒作为纪念</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26c6da,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'葡萄酒之旅，是一次味觉的冒险。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒旅行可以让你更深入地了解葡萄酒。去产区朝圣，体验葡萄酒的魅力。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你去过哪些葡萄酒产区？<br/>你最想去哪个产区？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '全球葡萄酒地图：葡萄酒旅行指南',
      author: '红樽坊',
      digest: '从波尔多到纳帕谷，从勃艮第到巴罗萨，全球最值得去的葡萄酒产区。',
      content: gen(),
      coverImage: 'wine_travel_cover_ai.png',
      category: 'travel',
      tags: ["旅行", "产区", "全球", "地图", "朝圣"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_travel_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Travel, media_id:', d.data.media_id);
  }catch(e){
    console.error('Travel:', e.message);
    process.exit(1);
  }
}

main();
