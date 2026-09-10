const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzZhMWI5YSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWmguS9leWTgeWHuuWlvemFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5ZOB6YWS55qE5q2j56Gu5ae/5Yq/PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juaWsOaJi+WIsOmrmOaJizwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWTgemFkuaMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #6a1b9a; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #6a1b9a; border-bottom: 2px solid #ab47bc; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #6a1b9a; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#6a1b9a;">如何品出好酒：品酒的正确姿势</h2>' +
  '<p style="text-align:center;color:#666;">从新手到高手</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">拿起酒杯就喝？太浪费了！学会正确的品酒姿势，让你从新手变成品酒高手。</p></section>' +
  '<h3>🍷 品酒前的准备</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒前要做这些准备：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择合适的酒杯</strong>——红酒用大杯，白酒用小杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持口腔清洁</strong>——品酒前不要吃味道重的东西</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>准备水和面包</strong>——用来清洁口腔</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持安静</strong>——品酒需要专注</li></ul></section>' +
  '<h3>👁️ 第一步：看</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">观察酒的外观：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>颜色</strong>——红葡萄酒从紫红到砖红，白葡萄酒从浅黄到金黄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>清澈度</strong>——好酒应该是清澈的，没有浑浊</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>挂杯</strong>——挂杯说明酒精度或糖分高，不代表品质</li></ul></section>' +
  '<h3>👃 第二步：闻</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">闻酒的香气：</p>' +
  '<h3>👅 第三步：品</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品尝酒的口感：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜度</strong>——酒入口时的甜味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酸度</strong>——酒的清爽感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>单宁</strong>——酒的涩感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒体</strong>——酒在口中的重量感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>余味</strong>——咽下后口中残留的味道</li></ul></section>' +
  '<h3>📝 第四步：评</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">综合评价酒的品质：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>平衡</strong>——各种味道是否和谐</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>复杂度</strong>——是否有丰富的层次</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>余味</strong>——余味是否持久</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>个性</strong>——是否有独特的风格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>整体印象</strong>——你是否喜欢这款酒</li></ul></section>' +
  '<h3>📊 品酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>步骤</th><th>要点</th><th>注意</th></tr><tr><td>看</td><td>颜色、清澈度</td><td>在白色背景下观察</td></tr><tr><td>闻</td><td>一类、二类、三类香气</td><td>先静止闻，再摇杯闻</td></tr><tr><td>品</td><td>甜、酸、单宁、酒体</td><td>小口品尝，让酒在口中停留</td></tr><tr><td>评</td><td>平衡、复杂度、余味</td><td>综合评价，记录感受</td></tr></table></section>' +
  '<h3>💡 品酒小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的品酒更专业：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>每次品酒后记录</strong>——积累经验</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝多比较</strong>——提升味觉敏感度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要迷信专家</strong>——相信自己的感受</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——品酒是为了开心</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ab47bc,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'品酒不是天赋，而是训练。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">品酒是可以训练的。多喝多比较，你也能成为品酒高手。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你平时怎么品酒？<br/>你有什么品酒技巧？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '如何品出好酒：品酒的正确姿势',
      author: '红樽坊',
      digest: '拿起酒杯就喝？太浪费了！学会正确的品酒姿势，让你从新手变成品酒高手。',
      content: gen(),
      coverImage: 'wine_tasting_guide_cover_ai.png',
      category: 'education',
      tags: ["品酒", "姿势", "技巧", "入门", "提升"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_tasting_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Tasting, media_id:', d.data.media_id);
  }catch(e){
    console.error('Tasting:', e.message);
    process.exit(1);
  }
}

main();
