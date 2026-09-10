const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNlMjcyMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPumCo+S6m+aUueWPmOWOhuWPsueahOiRoeiQhOmFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5p2v5Lit55qE5Y6G5Y+yPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuavj+S4gOeTtumDveacieaVheS6izwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWOhuWPsuaVheS6izwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #3e2723; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #3e2723; border-bottom: 2px solid #8d6e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #3e2723; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#3e2723;">那些改变历史的葡萄酒</h2>' +
  '<p style="text-align:center;color:#666;">杯中的历史</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">82年拉菲为什么这么出名？巴黎审判是怎么回事？这些改变历史的葡萄酒，每一瓶都有故事。这篇指南带你了解葡萄酒历史上的传奇故事。</p></section>' +
  '<h3>📜 巴黎审判：1976年</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">1976年的巴黎审判，改变了葡萄酒的历史：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>背景</strong>——法国酒和美国酒的对决</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结果</strong>——美国酒击败了法国酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>影响</strong>——新世界酒崛起，法国酒衰落</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>意义</strong>——证明了好酒不只在法国</li></ul></section>' +
  '<h3>🍷 82年拉菲：传奇年份</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">82年拉菲为什么这么出名？</p>' +
  '<h3>👑 玛歌酒庄：皇室之酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">玛歌酒庄为什么是皇室之酒？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>历史</strong>——玛歌酒庄有400年历史</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>皇室</strong>——曾是法国皇室的御用酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质</strong>——品质一直很稳定</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>地位</strong>——是波尔多五大名庄之一</li></ul></section>' +
  '<h3>🏛️ 拉图尔酒庄：国王之酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">拉图尔酒庄为什么是国王之酒？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>历史</strong>——拉图尔酒庄有400年历史</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>国王</strong>——曾是英国国王的御用酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质</strong>——品质一直很稳定</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>地位</strong>——是波尔多五大名庄之一</li></ul></section>' +
  '<h3>🌟 木桐酒庄：艺术之酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">木桐酒庄为什么是艺术之酒？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>艺术</strong>——每年邀请艺术家设计酒标</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>收藏</strong>——酒标具有收藏价值</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>创新</strong>——木桐酒庄是五大名庄中最具创新精神的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>故事</strong>——创始人罗斯柴尔德男爵的故事很传奇</li></ul></section>' +
  '<h3>📖 葡萄酒历史大事记</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>年份</th><th>事件</th><th>影响</th></tr><tr><td>公元前6000年</td><td>格鲁吉亚发现最早葡萄酒</td><td>葡萄酒起源</td></tr><tr><td>公元前3000年</td><td>埃及开始酿造葡萄酒</td><td>葡萄酒传播</td></tr><tr><td>公元前500年</td><td>希腊开始种植葡萄</td><td>葡萄酒文化</td></tr><tr><td>公元1世纪</td><td>罗马帝国推广葡萄酒</td><td>葡萄酒普及</td></tr><tr><td>1855年</td><td>波尔多分级制度建立</td><td>葡萄酒分级</td></tr><tr><td>1976年</td><td>巴黎审判</td><td>新世界酒崛起</td></tr><tr><td>1982年</td><td>波尔多传奇年份</td><td>名庄酒炒作</td></tr><tr><td>2000年</td><td>中国葡萄酒崛起</td><td>中国葡萄酒发展</td></tr></table></section>' +
  '<h3>💡 这些故事的启示</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些故事告诉我们什么？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>好酒不只在法国</strong>——新世界酒也有好酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质很重要</strong>——品质是酒庄立足之本</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>故事很重要</strong>——好故事可以提升酒的价值</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>营销很重要</strong>——营销可以让酒更出名</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性很重要</strong>——稀缺性可以提升酒的价值</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#8d6e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'每一瓶酒，都有一个故事。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的历史就是人类的历史。每一瓶酒都有故事，了解这些故事，可以让你更懂酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你知道哪些葡萄酒的历史故事？<br/>你最喜欢的葡萄酒故事是什么？<br/>欢迎在评论区分享你的故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '那些改变历史的葡萄酒：杯中的历史',
      author: '红樽坊',
      digest: '82年拉菲为什么这么出名？巴黎审判是怎么回事？这些改变历史的葡萄酒，每一瓶都有故事。',
      content: gen(),
      coverImage: 'wine_history_cover_ai.png',
      category: 'culture',
      tags: ["历史", "故事", "82年拉菲", "巴黎审判", "传奇"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_history_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('History, media_id:', d.data.media_id);
  }catch(e){
    console.error('History:', e.message);
    process.exit(1);
  }
}

main();
