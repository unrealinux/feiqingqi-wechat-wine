const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNmYwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPueUn+aXpea0vuWvuemFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55Sf5pel5b+r5LmQPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4gOi1t+S4vuadr+W6huelnTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOiKguaXpeeJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #ff6f00; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #ff6f00; border-bottom: 2px solid #ffb74d; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #ff6f00; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#ff6f00;">生日派对配酒指南：生日快乐，一起举杯庆祝</h2>' +
  '<p style="text-align:center;color:#666;">一起举杯庆祝</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">生日派对，怎么能没有酒？一起举杯庆祝，祝福寿星生日快乐。这篇指南帮你选对生日酒，让生日派对更精彩。</p></section>' +
  '<h3>🎂 生日派对的特点</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">生日派对有这些特点，配酒要考虑：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>庆祝氛围</strong>——要热闹、喜庆</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>人群多样</strong>——可能有老人、小孩、年轻人</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>食物多样</strong>——蛋糕、水果、大餐</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>拍照需求</strong>——要发朋友圈，颜值很重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>时间较长</strong>——从开始到结束，可能要喝几个小时</li></ul></section>' +
  '<h3>🍷 生日派对推荐酒款</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据生日派对的特点，推荐这些酒款：</p>' +
  '<h3>🎂 不同年龄段的配酒建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不同年龄段的人，对酒的喜好不同：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>年龄段</th><th>推荐酒款</th><th>理由</th></tr><tr><td>年轻人（20-30）</td><td>起泡酒、桃红</td><td>颜值高，易饮</td></tr><tr><td>中年人（30-50）</td><td>香槟、黑皮诺</td><td>有档次，口感好</td></tr><tr><td>老年人（50+）</td><td>甜酒、白葡萄酒</td><td>温和，不刺激</td></tr><tr><td>小孩</td><td>无酒精起泡</td><td>参与感，安全</td></tr></table></section>' +
  '<h3>🎉 生日派对配酒场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">生日派对有不同场景，配酒也不同：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>吹蜡烛</strong>——香槟或起泡酒，庆祝氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>切蛋糕</strong>——甜酒或桃红，搭配蛋糕</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>大餐时间</strong>——红酒或白葡萄酒，配餐</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>自由时间</strong>——起泡酒或桃红，轻松随意</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>结束时</strong>——香槟或起泡酒，完美收尾</li></ul></section>' +
  '<h3>📸 生日派对拍照技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">生日派对要发朋友圈，这些拍照技巧要记住：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>举杯拍照</strong>——大家举杯，一起拍照</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒杯角度</strong>——45度角拍照最好看</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>光线</strong>——利用自然光，避免直射</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>背景</strong>——以蛋糕或装饰为背景</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>滤镜</strong>——选择温暖自然的滤镜</li></ul></section>' +
  '<h3>💡 生日派对小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的生日派对更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前准备</strong>——不要等到最后一刻才买酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——酒要冰镇，保持低温</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意安全</strong>——喝酒后不要开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——最重要的是开心</li></ul></section>' +
  '<h3>🚫 生日派对禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">生日派对，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要强迫别人喝酒</strong>——尊重每个人的选择</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略安全</strong>——喝酒后不要开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略寿星</strong>——寿星是主角，要关注他/她</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略氛围</strong>——氛围比酒更重要</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ffb74d,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'生日快乐，一起举杯庆祝！\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">生日派对，是一种庆祝和祝福。选对酒，享受派对，让寿星感受到大家的爱和祝福。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你生日喜欢喝什么酒？<br/>你有什么生日派对的经验？<br/>欢迎在评论区分享你的生日故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '生日派对配酒指南：生日快乐，一起举杯庆祝',
      author: '红樽坊',
      digest: '生日派对，怎么能没有酒？从香槟到起泡酒，从桃红到甜酒，这篇指南帮你选对生日酒。',
      content: gen(),
      coverImage: 'birthday_wine_cover_ai.png',
      category: 'holiday',
      tags: ["生日", "派对", "庆祝", "快乐", "礼物"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'birthday_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Birthday, media_id:', d.data.media_id);
  }catch(e){
    console.error('Birthday:', e.message);
    process.exit(1);
  }
}

main();
