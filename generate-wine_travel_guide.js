const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzBkNDdhMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuaXheihjOaOqOiNkDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5Y675Lqn5Yy65pyd5ZyjPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4lueVjOacgOWAvOW+l+WOu+eahOiRoeiQhOmFkuS6p+WMujwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaXheihjOaUu+eVpTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #0d47a1; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #0d47a1; border-bottom: 2px solid #42a5f5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #0d47a1; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#0d47a1;">葡萄酒旅行推荐：去产区朝圣</h2>' +
  '<p style="text-align:center;color:#666;">世界最值得去的葡萄酒产区</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">对于葡萄酒爱好者来说，去产区旅行是最幸福的事。站在葡萄园里，品尝刚酿出的新酒，与酿酒师面对面交流——这种体验，是任何酒展都无法替代的。</p></section>' +
  '<h3>🌍 欧洲：葡萄酒的圣地</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">欧洲是葡萄酒的发源地，拥有最悠久的酿酒历史和最深厚的文化底蕴。</p>' +
  '<h3>🌏 亚洲：新世界的崛起</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">亚洲的葡萄酒产业正在迅速崛起，尤其是中国和日本。</p>' +
  '<h3>🌎 美洲：新世界的代表</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">美洲是新世界葡萄酒的代表，拥有创新的酿酒理念和多元的文化。</p>' +
  '<h3>🇨🇳 国内：家门口的产区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国有多个优秀的葡萄酒产区，值得去探索：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>宁夏贺兰山东麓</strong>——中国最优秀的产区，被称为\'中国的波尔多\'</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>云南香格里拉</strong>——高海拔产区，风景壮丽</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>新疆天山</strong>——日照充足，果实成熟度高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>山东烟台</strong>——中国最早的葡萄酒产区</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>河北怀来</strong>——长城葡萄酒的故乡</li></ul></section>' +
  '<h3>💡 产区旅行小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">去产区旅行，这里有几个小贴士：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前预约</strong>——大多数酒庄需要提前预约参观</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要空腹</strong>——品酒前吃点东西，避免醉酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>带个吐酒桶</strong>——品酒时可以吐掉，不用每杯都喝完</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>请个司机</strong>——品酒后不要开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>买些酒回来</strong>——产区的价格通常比国内便宜很多</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录感受</strong>——用笔记或拍照记录下每一次品酒体验</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#42a5f5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'旅行的意义，不在于走了多远，而在于看到了什么，品尝了什么，记住了什么。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒产区旅行，不仅是味蕾的盛宴，更是心灵的洗礼。站在葡萄园里，看着阳光洒在葡萄叶上，你会明白：每一瓶酒，都是大自然的馈赠。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你去过哪些葡萄酒产区？<br/>最推荐哪里？<br/>欢迎在评论区分享你的产区旅行故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒旅行推荐：去产区朝圣',
      author: '红樽坊',
      digest: '从法国波尔多到中国宁夏，从意大利托斯卡纳到澳大利亚巴罗萨，世界最值得去的葡萄酒产区，你去过几个？',
      content: gen(),
      coverImage: 'wine_travel_guide_cover_ai.png',
      category: 'travel',
      tags: ["旅行", "产区", "波尔多", "勃艮第", "宁夏", "托斯卡纳"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_travel_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Travel, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Travel:', e.message);
    process.exit(1);
  }
}

main();
