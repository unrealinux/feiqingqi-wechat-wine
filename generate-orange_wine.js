const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYog5qmZ6YWS5YWl6Zeo77ya6KKr6K+v6Kej55qEIuapmeiJsua1qua8qyI8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZGRkIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+JiN4N2VhMjsmI3g5MTUyOyYjeDk4N2U7JiN4OTVlZTs8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+ZmVpcWluZ3FpIFdlQ2hhdCBNUDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍊 橙酒入门</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">被误解的橙色浪漫 | 古老酿造法的现代复兴</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒（Orange Wine）是近年来葡萄酒圈最热门的话题之一。但很多人第一次听到"橙酒"都会疑惑：是用橙子酿的酒吗？答案是否定的。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒本质上是一种"带皮发酵的白葡萄酒"。传统白葡萄酒在压榨后会立刻将葡萄皮和籽分离，而橙酒则让白葡萄汁与皮、籽一起浸渍发酵数周甚至数月。葡萄皮中的色素和单宁溶入酒液，赋予酒液独特的橙黄色泽和质感。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏺 起源：6000年的古法</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒绝非新发明。它的酿造方法可以追溯到6000年前的格鲁吉亚，当地人用埋在地下的大陶罐（Qvevri）发酵葡萄，连皮带籽一起，这与橙酒的原理完全一致。现代橙酒的复兴始于20世纪90年代斯洛文尼亚的酿酒师，随后在意大利、法国自然酒圈掀起热潮。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 橙酒的风味特征</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">特征</th><th style="padding:10px;text-align:left;">表现</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">颜色</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">琥珀色、橙黄色、铜色，而非传统白酒的浅黄</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">口感</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">单宁感明显（来自果皮），比白葡萄酒更"有嚼劲"</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">香气</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">橙皮、杏干、坚果、蜂蜜、红茶、香料</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">通常偏高，结构感强</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">侍酒温度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">略高于白葡萄酒，10-12°C最佳</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🆚 橙酒 vs 白葡萄酒 vs 红葡萄酒</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒可以理解为"白葡萄做的红酒"——它拥有白葡萄酒的果香和品种特色，却具备红葡萄酒的单宁结构和陈年潜力。这种跨界特质让它在餐酒搭配上极具灵活性。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌍 主要产区</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇬🇪 格鲁吉亚：陶罐（Qvevri）橙酒的发源地，风格最原始</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 意大利弗留利：现代橙酒运动的核心，酒庄密集</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇸🇮 斯洛文尼亚：橙色革命发源地，Josko Gravner是先驱</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 法国卢瓦尔、汝拉：自然酒酿酒师的实验场</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇺🇸 美国俄勒冈、加州：新世界橙酒新势力</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 配餐建议</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒的单宁和氧化风味让它成为"最难配餐的酒"和"最美味的配餐酒"的双重存在。它特别适合搭配传统白葡萄酒hold不住、红葡萄酒又太重的食物：</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 发酵奶酪、蓝纹奶酪——橙酒的氧化风味与奶酪是绝配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥘 印度咖喱、中东香料菜——单宁与香料互相成就</li><li style="margin:6px 0;color:#333;line-height:1.7;">🐟 油浸罐头鱼（沙丁鱼、凤尾鱼）——咸鲜与单宁碰撞</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥗 朝鲜蓟——传统白葡萄酒的克星，橙酒却游刃有余</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍜 中餐：醉鸡、卤味、凉拌菜都能搭</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：橙酒风味独特，初次尝试可能不习惯。建议从意大利弗留利的现代风格（果味更明显、单宁更柔和）入手，而不是一上来就挑战格鲁吉亚重陶罐风格的"重口味"橙酒。预算¥150-300即可买到不错的入门款。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">橙酒代表了一种回归自然的酿酒哲学——少干预、少添加、顺其自然。它不是适合所有人的酒，但对于追求个性和探索精神的饮者来说，橙酒打开了一扇通往葡萄酒另一维度的大门。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍊 橙酒入门：被误解的"橙色浪漫"',
      author: '红酒顾问',
      digest: '橙酒不是橙子酿的酒！它是带皮发酵的白葡萄酒，古老又时髦。从格鲁吉亚陶罐到自然酒圈宠儿，一篇读懂橙酒。',
      content: gen(),
      coverImage: 'orange_wine_cover_ai.png',
      category: 'wine-style',
      tags: ["橙酒", "Orange Wine", "自然酒", "带皮发酵", "格鲁吉亚", "陶罐", "小众葡萄酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'orange_wine_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
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
    console.log('OK orange_wine, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL orange_wine:', e.message);
    process.exit(1);
  }
}

main();
