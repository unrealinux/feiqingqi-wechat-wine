const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2NTEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPumCo+S6m+iiq+mrmOS8sOeahOiRoeiQhOmFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5L2g6L+Y5Zyo5Li65ZCN5rCU5Lmw5Y2V5ZCX77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWIq+WGjeiiq+iQpemUgOW/veaCoOS6hjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #e65100; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #e65100; border-bottom: 2px solid #ff9800; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #e65100; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#e65100;">那些被高估的葡萄酒</h2>' +
  '<p style="text-align:center;color:#666;">你还在为名气买单吗？</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">拉菲真的值1万块吗？82年拉菲真的那么好喝？揭秘那些被高估的葡萄酒，别再被营销忽悠了。</p></section>' +
  '<h3>🤔 什么是被高估？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">被高估的酒有这些特点：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格虚高</strong>——实际品质不值这个价</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>名气大于实力</strong>——名气响，但品质一般</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>营销驱动</strong>——靠营销炒作，不是靠品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性炒作</strong>——人为制造稀缺，抬高价格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>跟风消费</strong>——大家都说好，你也跟着买</li></ul></section>' +
  '<h3>🍷 被高估的酒款</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些酒款被高估了：</p>' +
  '<h3>📊 被高估的原因</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些酒为什么被高估？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌溢价</strong>——品牌知名度高，价格自然高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>中国市场</strong>——中国市场热捧，价格被炒高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性</strong>——人为制造稀缺，抬高价格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>电影效应</strong>——电影中出现，被追捧</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>跟风消费</strong>——大家都说好，你也跟着买</li></ul></section>' +
  '<h3>💡 不被高估的好酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些酒性价比高，不被高估：</p>' +
  '<h3>🎯 如何避免被高估？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想避免被高估，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>忽略品牌</strong>——不要只看品牌，关注酒质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>盲品</strong>——不看酒标，只看酒液</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>关注性价比</strong>——不要只看价格，关注性价比</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>尝试新酒</strong>——不要只喝熟悉的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li></ul></section>' +
  '<h3>🚫 被高估的误区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些误区要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>贵的不一定好</strong>——价格不代表品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>名牌不一定好</strong>——品牌不代表一切</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>老酒不一定好</strong>——年份不代表一切</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>专家不一定对</strong>——专家的推荐不一定适合你</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>大家都说好不一定好</strong>——跟风消费要谨慎</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff9800,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'买酒不买名气，买的是品质和心情。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">被高估的酒很多，但好酒也很多。不要被名气和营销忽悠，找到真正适合自己的好酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你觉得哪些酒被高估了？<br/>你有没有被高估的酒坑过？<br/>欢迎在评论区分享你的经历！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '那些被高估的葡萄酒：你还在为名气买单吗？',
      author: '红樽坊',
      digest: '拉菲真的值1万块吗？82年拉菲真的那么好喝？揭秘那些被高估的葡萄酒，别再被营销忽悠了。',
      content: gen(),
      coverImage: 'overrated_wines_cover_ai.png',
      category: 'opinion',
      tags: ["高估", "真相", "营销", "性价比", "避坑"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'overrated_wines_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Overrated, media_id:', d.data.media_id);
  }catch(e){
    console.error('Overrated:', e.message);
    process.exit(1);
  }
}

main();
