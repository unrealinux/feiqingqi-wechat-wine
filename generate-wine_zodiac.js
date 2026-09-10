const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRhMTQ4YyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juaYn+W6pzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5L2g5piv5LuA5LmI5pif5bqnPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWwseWWneS7gOS5iOmFkjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOaYn+W6p+eJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #4a148c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #4a148c; border-bottom: 2px solid #9c27b0; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #4a148c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#4a148c;">葡萄酒与星座：你是什么星座，就喝什么酒</h2>' +
  '<p style="text-align:center;color:#666;">12星座的专属葡萄酒</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">你相信星座吗？每个星座都有独特的性格特点，而葡萄酒也有丰富的风味特征。当星座遇上葡萄酒，会碰撞出怎样的火花？快来找你的星座酒！</p></section>' +
  '<h3>♈ 白羊座（3.21-4.19）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>热情、冲动、直率、爱冒险</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>狮子座、射手座</p>' +
  '<h3>♉ 金牛座（4.20-5.20）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>稳重、务实、享受、固执</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>处女座、摩羯座</p>' +
  '<h3>♊ 双子座（5.21-6.21）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>聪明、多变、好奇、爱社交</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>天秤座、水瓶座</p>' +
  '<h3>♋ 巨蟹座（6.22-7.22）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>温柔、顾家、敏感、念旧</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>天蝎座、双鱼座</p>' +
  '<h3>♌ 狮子座（7.23-8.22）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>自信、大方、爱面子、有领导力</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>白羊座、射手座</p>' +
  '<h3>♍ 处女座（8.23-9.22）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>完美主义、细致、挑剔、务实</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>金牛座、摩羯座</p>' +
  '<h3>♎ 天秤座（9.23-10.23）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>优雅、平衡、爱社交、犹豫不决</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>双子座、水瓶座</p>' +
  '<h3>♏ 天蝎座（10.24-11.22）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>神秘、深沉、强烈、有魅力</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>巨蟹座、双鱼座</p>' +
  '<h3>♐ 射手座（11.23-12.21）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>乐观、自由、爱冒险、直率</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>白羊座、狮子座</p>' +
  '<h3>♑ 摩羯座（12.22-1.19）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>务实、有野心、传统、有责任感</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>金牛座、处女座</p>' +
  '<h3>♒ 水瓶座（1.20-2.18）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>独立、创新、叛逆、有个性</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>双子座、天秤座</p>' +
  '<h3>♓ 双鱼座（2.19-3.20）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>性格特点：</strong>浪漫、敏感、富有想象力、爱做梦</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;"><strong>星座搭配：</strong>巨蟹座、天蝎座</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#9c27b0,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'星座只是参考，最重要的是找到自己喜欢的酒。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">星座配酒是一种有趣的尝试，但每个人的口味都不同。最重要的是找到自己喜欢的酒，享受喝酒的乐趣。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你是什么星座？<br/>你觉得你的星座酒准吗？<br/>欢迎在评论区分享你的星座酒！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与星座：你是什么星座，就喝什么酒',
      author: '红樽坊',
      digest: '白羊座适合起泡酒，天蝎座适合黑皮诺？12星座的专属葡萄酒，快来找你的星座酒！',
      content: gen(),
      coverImage: 'wine_zodiac_cover_ai.png',
      category: 'lifestyle',
      tags: ["星座", "性格", "匹配", "趣味", "12星座"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_zodiac_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Zodiac, media_id:', d.data.media_id);
  }catch(e){
    console.error('Zodiac:', e.message);
    process.exit(1);
  }
}

main();
