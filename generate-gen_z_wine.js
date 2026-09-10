const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzZhMWI5YSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuW5tOi9u+S6uuS4uuS7gOS5iOS4jeeIseWWnee6oumFkuS6hu+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+57qi6YWS55qE5Y2x5py6PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuW5tOi9u+S6uueahOmAieaLqeWPmOS6hjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#6a1b9a;">年轻人为什么不爱喝红酒了？</h2>' +
  '<p style="text-align:center;color:#666;">红酒的危机来了</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">年轻人宁愿喝奶茶也不喝红酒？红酒真的过时了吗？这篇指南分析年轻人不爱喝红酒的原因，以及红酒行业的应对之策。</p></section>' +
  '<h3>📉 红酒的危机</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒确实面临危机：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>消费下降</strong>——年轻人红酒消费量在下降</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>替代品增多</strong>——奶茶、鸡尾酒、精酿啤酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>形象老化</strong>——红酒被认为是中年人的饮品</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格虚高</strong>——年轻人觉得不值</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>门槛太高</strong>——年轻人觉得红酒太复杂</li></ul></section>' +
  '<h3>🤔 年轻人为什么不爱喝红酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">年轻人不爱喝红酒的原因：</p>' +
  '<h3>📊 年轻人的饮酒习惯</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>饮品</th><th>年轻人偏好</th><th>原因</th></tr><tr><td>奶茶</td><td>★★★★★</td><td>甜、便宜、方便</td></tr><tr><td>精酿啤酒</td><td>★★★★☆</td><td>时尚、口味多</td></tr><tr><td>鸡尾酒</td><td>★★★★☆</td><td>颜值高、社交属性</td></tr><tr><td>白酒</td><td>★★★☆☆</td><td>传统、有面子</td></tr><tr><td>红酒</td><td>★★☆☆☆</td><td>贵、老气、复杂</td></tr></table></section>' +
  '<h3>🍷 红酒行业的应对</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒行业如何应对？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>降低价格</strong>——推出更多平价红酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>改变形象</strong>——让红酒更时尚、更年轻</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>简化知识</strong>——让红酒更容易理解</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>创新口味</strong>——推出更多果味、甜味红酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交营销</strong>——通过社交媒体吸引年轻人</li></ul></section>' +
  '<h3>💡 年轻人应该喝红酒吗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">年轻人应该喝红酒吗？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>应该</strong>——红酒有健康益处，可以适量饮用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不应该</strong>——年轻人应该选择自己喜欢的饮品</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>折中</strong>——年轻人可以尝试，但不要强迫</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>关键是</strong>——找到适合自己的饮品</li></ul></section>' +
  '<h3>🎯 红酒的未来</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒的未来在哪里？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>年轻化</strong>——红酒需要年轻化</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>时尚化</strong>——红酒需要更时尚</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>简单化</strong>——红酒需要更简单</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>平价化</strong>——红酒需要更平价</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交化</strong>——红酒需要更强的社交属性</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ab47bc,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'红酒的未来，在于年轻化。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">红酒面临危机，但也有机会。只要红酒行业能够年轻化、时尚化、简单化，就能重新吸引年轻人。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你是年轻人吗？你喝红酒吗？<br/>你觉得红酒过时了吗？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '年轻人为什么不爱喝红酒了？红酒的危机来了',
      author: '红樽坊',
      digest: '年轻人宁愿喝奶茶也不喝红酒？红酒真的过时了吗？这篇指南分析年轻人不爱喝红酒的原因。',
      content: gen(),
      coverImage: 'gen_z_wine_cover_ai.png',
      category: 'opinion',
      tags: ["年轻人", "Z世代", "红酒", "危机", "趋势"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'gen_z_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('GenZ, media_id:', d.data.media_id);
  }catch(e){
    console.error('GenZ:', e.message);
    process.exit(1);
  }
}

main();
