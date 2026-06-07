const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){const sharp=require("sharp");const svg=Buffer.from("PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg55C855G25rWGIEdld8O8cnp0cmFtaW5lcjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7vvJroirPpppnlpbPnjovnmoTlvILln5/po47mg4U8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+ZmVpcWluZ3FpIFdlQ2hhdCBNUDwvdGV4dD4KPC9zdmc+","base64").toString();return sharp(Buffer.from(svg)).png().toBuffer().then(b=>b);}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 琼瑶浆 Gewürztraminer</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">芳香女王的异域风情 | 玫瑰与荔枝的盛宴</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">琼瑶浆（Gewürztraminer）是世界上最芳香的葡萄品种之一。它的名字在德语中意为"香料味的特拉敏"——Gewürz就是"香料"的意思。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">琼瑶浆的香气极具穿透力：玫瑰花瓣、荔枝、百香果、肉桂、生姜……即使从没喝过葡萄酒的人，闻到琼瑶浆也会惊叹"原来酒可以这么香！"</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">国家</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔萨斯 Alsace</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最经典的产区，干型到贵腐甜型皆可</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">法尔兹 Pfalz</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">德国</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">风格更清爽，酸度略高</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">特伦蒂诺 Trentino-Alto Adige</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">意大利</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">花香浓郁，口感清爽</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">克莱尔谷 Clare Valley</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">澳洲</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浓郁奔放的风格</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🌹 花香：玫瑰花瓣、紫罗兰——最标志性的香气</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍈 热带水果：荔枝、百香果、芒果——这是琼瑶浆的"签名香"</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 香料：肉桂、丁香、生姜、白胡椒——"Gewürz"的体现</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍯 蜂蜜：成熟的琼瑶浆常有蜂蜜和蜂蜡的香气</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍊 柑橘：柚子皮、橘子酱——甜型琼瑶浆常见</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 干型 vs 甜型</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">琼瑶浆一个特别之处在于它可以是干型也可以是甜型——而且两者都有忠实粉丝。由于琼瑶浆本身酸度较低，即使是干型琼瑶浆喝起来也会感觉略带甜味（虽然残糖很低）。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">类型</th><th style="padding:10px;text-align:left;">特点</th><th style="padding:10px;text-align:left;">推荐场合</th><th style="padding:10px;text-align:left;">代表产区</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">干型</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香气爆炸、口感饱满</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">配餐：亚洲菜、辛辣料理</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔萨斯（标"dry"或vendange tardive晚收的干型版本）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">半干</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">微甜、花香更浓</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">开胃酒、闺蜜聚会</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔萨斯经典风格</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">晚收 VT</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浓郁蜜饯味</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">搭配蓝纹奶酪、鹅肝</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔萨斯晚收酒 Vendange Tardive</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">贵腐 SGN</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">极为浓郁、甜度高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">收藏、搭配甜品</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿尔萨斯贵腐 Selection de Grains Nobles</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">琼瑶浆是亚洲菜的绝配——它的异域香气和微甜口感与中式、泰式、印式料理的香料味完美配合。</p>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐：宫保鸡丁、椒盐虾、清蒸鱼、凉拌菜</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍜 泰餐：冬阴功汤、绿咖喱、泰式炒河粉</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍛 印度菜：咖喱鸡、玛萨拉香料菜</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 阿尔萨斯奶酪（Munster）——地方经典搭配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🦆 鹅肝（Foie Gras）——甜型琼瑶浆的经典搭配</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：从阿尔萨斯干型琼瑶浆开始（¥150-300），感受经典的玫瑰荔枝香；如果想体验更丰富的层次，可以试试Vendange Tardive晚收级（¥400+），甜而不腻、香料味十足。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 推荐入门酒款</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 Trimbach Gewürztraminer — 阿尔萨斯经典标杆</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 Domaine Zind-Humbrecht — 生物动力法名家</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 Hugel Gewürztraminer — 历史悠久的酒庄</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇩🇪 Dr. Loosen "Bernkasteler" — 德国风格</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇮🇹 Cantina Terlano Gewürztraminer — 意大利上阿迪杰风格</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">琼瑶浆就像葡萄酒世界里的"异域美人"——浓烈的玫瑰荔枝香气、华丽的酒体、极具辨识度的风格。第一次喝它的人一定会记住它，而爱上它的人则会不断追寻它的不同面貌。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 琼瑶浆 Gewürztraminer：芳香女王的异域风情',
      author: '红酒顾问',
      digest: '玫瑰、荔枝、百香果、肉桂——琼瑶浆的香气让人一闻难忘。阿尔萨斯最特别的品种，甜与干的博弈。',
      content: gen(),
      coverImage: 'gewurztraminer_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["琼瑶浆", "Gewürztraminer", "阿尔萨斯", "芳香型", "白葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'gewurztraminer_dive_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const f = new FormData();
    f.append('media', cb, {filename: 'cover.png', contentType: 'image/png'});
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
    console.log('✅ gewurztraminer_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ gewurztraminer_dive:', e.message);
    process.exit(1);
  }
}

main();
