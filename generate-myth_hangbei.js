const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMTIwNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhMjQwNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPHRleHQgeD0iODAiIHk9IjI1MCIgZmlsbD0iI2ZmZDU0ZiIgZm9udC1zaXplPSIxOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgb3BhY2l0eT0iMC4yMiI+MDE8L3RleHQ+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg4MCw5MCkgc2NhbGUoMS4xKSIgb3BhY2l0eT0iMC4xNiIgZmlsbD0iI2ZmZDU0ZiI+CjxwYXRoIGQ9Ik0wLDAgTDcwLDAgTDU4LDkwIEw0Niw5MCBMNDAsMTQwIEwzMCwxNDAgTDI0LDkwIEwxMiw5MCBaIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNCIgcng9IjQiLz4KPHJlY3QgeD0iMCIgeT0iMTU0IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHJ4PSI1Ii8+CjwvZz4KPHRleHQgeD0iODAiIHk9IjEwMCIgZm9udC1zaXplPSI0NiI+JiN4Mjc1Mzs8L3RleHQ+Cjx0ZXh0IHg9IjgwIiB5PSIzMzAiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iNTgiIGZvbnQtZmFtaWx5PSInTWljcm9zb2Z0IFlhSGVpJywnUGluZ0ZhbmcgU0MnLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj7wn423IOaMguadr+WwseaYr+WlvemFku+8n+WIq+WGjeiiq+i/meS4quivrzwvdGV4dD48dGV4dCB4PSI4MCIgeT0iNDA4IiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjU4IiBmb250LWZhbWlseT0iJ01pY3Jvc29mdCBZYUhlaScsJ1BpbmdGYW5nIFNDJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+5Yy66aqX5LqGPC90ZXh0Pgo8cmVjdCB4PSIwIiB5PSI1NjAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZmZkNTRmIiBvcGFjaXR5PSIwLjkyIi8+Cjx0ZXh0IHg9IjgwIiB5PSI2MDQiIGZpbGw9IiMxYTEyMDYiIGZvbnQtc2l6ZT0iMzAiIGZvbnQtZmFtaWx5PSInTWljcm9zb2Z0IFlhSGVpJyxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCI+57qi6YWS6aG+6ZeuIMK3IOavj+aXpemBv+WdkTwvdGV4dD4KPHRleHQgeD0iMTEyMCIgeT0iNjA0IiB0ZXh0LWFuY2hvcj0iZW5kIiBmaWxsPSIjMWExMjA2IiBmb250LXNpemU9IjI2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgb3BhY2l0eT0iMC44Ij5mZWlxaW5ncWk8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍷 挂杯就是好酒？</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">红酒顾问每日避坑 | 第1期</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">去饭局或酒展，常听人指着杯壁上的"酒泪"说："你看这挂杯，多漂亮，肯定是好酒！"</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">挂杯确实好看，但它和"好酒"之间，其实没有因果关系。今天就用一分钟，把这个流传最广的误区讲清楚。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍶 挂杯到底是什么？</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">挂杯（俗称"酒泪""酒腿"）是酒液在杯壁留下的一道道痕迹。它的物理学原理叫"马伦哥尼效应"：酒精比水挥发得快，杯壁上的酒精浓度下降后，表面张力变化，把酒液拉成一道痕迹往下滑。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🔬 挂杯只说明两件事</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">挂杯越强</th><th style="padding:10px;text-align:left;">说明什么</th><th style="padding:10px;text-align:left;">与品质关系</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒精度高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">残糖或酒精多，挥发更明显</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无关好坏</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒体厚重</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">甘油、糖分含量高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无关好坏</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">温度/杯型</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">杯壁光滑、酒温低更易挂</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">无关品质</td></tr></tbody></table></div>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">换句话说：一款 15 度的甜型廉价酒，挂杯可能比顶级勃艮第还漂亮。挂杯浓，只能证明"这酒酒精或糖分不低"，证明不了任何关于风味、平衡、陈年潜力的东西。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">❌ 为什么这个误区这么顽固</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">👀 视觉直观：晃动酒杯看到"泪痕"很有仪式感，容易误读为"浓郁=好"</li><li style="margin:6px 0;color:#333;line-height:1.7;">📺 影视误导：电影里摇晃红酒+挂杯特写，被当成"懂酒"的符号</li><li style="margin:6px 0;color:#333;line-height:1.7;">💬 口口相传：饭局上谁先说"挂杯好"，别人懒得反驳</li></ul>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">红酒顾问说</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">判断好酒，看的是香气复杂度、口感平衡、余味长度，而不是杯壁上的水痕。下次有人拿挂杯炫耀，你可以微笑着说："挂杯只说明这酒不淡。"</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">✅ 真正该看什么</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">👃 香气：是否纯净、有层次，有没有异味</li><li style="margin:6px 0;color:#333;line-height:1.7;">👅 口感：酸、甜、单宁、酒精是否平衡</li><li style="margin:6px 0;color:#333;line-height:1.7;">⏳ 余味：咽下后香气在口中停留多久（越长越好）</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 品种/产区：了解背景比看挂杯有用得多</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 一个小实验：倒一杯廉价甜酒和一杯普通干红，摇一摇对比挂杯——你会发现贵的未必挂得更厉害。眼见为实，误区自破。</p></div>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">挂杯是葡萄酒最无辜的"背锅侠"：它只是物理现象，却被硬安上了品质裁判的头衔。忘了挂杯吧，把注意力放回杯中的味道本身。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 你被挂杯骗过吗？评论区聊聊 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const art = {
      title: '🍷 挂杯就是好酒？别再被这个误区骗了',
      author: '红酒顾问',
      digest: '看红酒挂杯就说是好酒？其实挂杯只说明酒精或糖分高，和品质半点关系都没有。一篇讲清挂杯的真相。',
      content: gen(),
      coverImage: 'myth_hangbei_cover_ai.png',
      category: 'wine-myth',
      tags: ["挂杯", "误区", "避坑", "红酒常识", "新手"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'myth_hangbei_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

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
    console.log('OK myth_hangbei, media_id:', d.data.media_id);
  }catch(e){
    console.error('FAIL myth_hangbei:', e.message);
    process.exit(1);
  }
}

main();
