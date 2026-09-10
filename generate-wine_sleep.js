const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjM3ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuedoeWJjeWWneiRoeiQhOmFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55yf55qE5Yqp55yg5ZCX77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuenkeWtpuino+ivu+iRoeiQhOmFkuS4juedoeecoOeahOWFs+ezuzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWBpeW6t+aPreenmDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1a237e; border-bottom: 2px solid #3f51b5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1a237e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1a237e;">睡前喝葡萄酒真的助眠吗？</h2>' +
  '<p style="text-align:center;color:#666;">科学解读葡萄酒与睡眠的关系</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人认为睡前喝一杯葡萄酒能帮助睡眠。但科学研究表明，这个说法可能是个误区。真相到底是什么？这篇指南帮你搞清楚。</p></section>' +
  '<h3>🍷 为什么很多人觉得喝酒助眠？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">喝酒后确实会感到困倦，这是因为酒精有镇静作用。酒精会抑制中枢神经系统，让人感到放松和困倦。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">但这种\'助眠\'是假象。酒精虽然能让你更快入睡，但会严重影响睡眠质量。</p>' +
  '<h3>🔬 科学研究怎么说？</h3>' +
  '<h3>📊 喝酒 vs 不喝酒的睡眠对比</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>指标</th><th>喝酒后</th><th>不喝酒</th></tr><tr><td>入睡速度</td><td>更快</td><td>正常</td></tr><tr><td>睡眠深度</td><td>变浅</td><td>正常</td></tr><tr><td>REM睡眠</td><td>减少30-40%</td><td>正常</td></tr><tr><td>夜间醒来</td><td>频繁</td><td>偶尔</td></tr><tr><td>打鼾</td><td>加重</td><td>正常</td></tr><tr><td>第二天状态</td><td>疲惫</td><td>精力充沛</td></tr></table></section>' +
  '<h3>⏰ 如果一定要喝，什么时候喝？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你一定要在睡前喝酒，最好遵循以下原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前2-3小时喝</strong>——给身体足够的时间代谢酒精</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制量</strong>——不超过1杯（150ml葡萄酒）</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择低度酒</strong>——酒精度低于13%的酒款</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐饮用</strong>——食物可以减缓酒精吸收</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要天天喝</strong>——最多每周2-3次</li></ul></section>' +
  '<h3>💤 更好的助眠方法</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">与其喝酒助眠，不如试试这些更健康的方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持规律作息</strong>——每天固定时间睡觉和起床</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>睡前放松</strong>——泡个热水澡、听轻音乐、冥想</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免咖啡因</strong>——下午2点后不喝咖啡和茶</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制屏幕时间</strong>——睡前1小时不看手机</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保持卧室舒适</strong>——温度、光线、噪音都要适宜</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量运动</strong>——但不要在睡前3小时内运动</li></ul></section>' +
  '<h3>🍷 如果你想喝葡萄酒放松</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你想喝葡萄酒来放松身心，而不是为了助眠，这里有几个建议：</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#3f51b5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'葡萄酒是用来享受的，不是用来助眠的。与其依赖酒精入睡，不如培养健康的睡眠习惯。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">睡前喝葡萄酒助眠，是一个流传很广的误区。虽然酒精确实能让你更快入睡，但它会严重影响睡眠质量。如果你有睡眠问题，建议从改善睡眠习惯入手，而不是依赖酒精。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有睡前喝葡萄酒的习惯吗？<br/>你觉得喝酒后睡眠质量怎么样？<br/>欢迎在评论区分享你的体验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '睡前喝葡萄酒真的助眠吗？',
      author: '红樽坊',
      digest: '很多人认为睡前喝一杯葡萄酒能帮助睡眠。但科学研究表明，这个说法可能是个误区。真相到底是什么？',
      content: gen(),
      coverImage: 'wine_sleep_cover_ai.png',
      category: 'health',
      tags: ["睡眠", "助眠", "健康", "科学", "睡前酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_sleep_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Sleep, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Sleep:', e.message);
    process.exit(1);
  }
}

main();
