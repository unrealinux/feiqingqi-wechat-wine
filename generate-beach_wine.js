const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjA2NCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPua1t+i+ueW6puWBh+mFjemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6Ziz5YWJ44CB5rKZ5rup44CB576O6YWSPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPua1t+i+ueW6puWBh+eahOWujOe+juaQremFjTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOW6puWBh+eJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #006064; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #006064; border-bottom: 2px solid #26c6da; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #006064; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#006064;">海边度假配酒指南：阳光、沙滩、美酒</h2>' +
  '<p style="text-align:center;color:#666;">海边度假的完美搭配</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">在海边度假，怎么能没有酒？阳光、沙滩、海浪，再配上一杯冰镇葡萄酒，这才是度假的正确打开方式。这篇指南帮你选对酒，让海边度假更完美。</p></section>' +
  '<h3>🏖️ 海边度假的特点</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假有这些特点，配酒要考虑：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度高</strong>——海边温度高，酒要冰镇</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>阳光强</strong>——紫外线强，要避免光照</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>海鲜多</strong>——海边海鲜多，要搭配海鲜</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>氛围轻松</strong>——度假氛围轻松，酒要易饮</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>拍照需求</strong>——要发朋友圈，颜值很重要</li></ul></section>' +
  '<h3>🍷 海边度假推荐酒款</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据海边度假的特点，推荐这些酒款：</p>' +
  '<h3>🦞 海边度假配餐指南</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假，海鲜是主角，如何配酒？</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>海鲜类型</th><th>推荐酒款</th><th>理由</th></tr><tr><td>生蚝</td><td>长相思、夏布利</td><td>清爽酸度提升鲜味</td></tr><tr><td>龙虾</td><td>霞多丽、白诗南</td><td>圆润口感配龙虾肉</td></tr><tr><td>烤鱼</td><td>桃红、灰皮诺</td><td>清爽解腻</td></tr><tr><td>虾蟹</td><td>雷司令、莫斯卡托</td><td>微甜口感配海鲜甜味</td></tr><tr><td>贝类</td><td>长相思、阿尔巴利诺</td><td>清爽酸度提升鲜味</td></tr></table></section>' +
  '<h3>🌴 海边度假配酒场景</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假有不同场景，配酒也不同：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>沙滩日光浴</strong>——冰镇白葡萄酒或桃红，清爽解暑</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>海边晚餐</strong>——霞多丽或黑皮诺，配海鲜或烤肉</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>日落时分</strong>——起泡酒或桃红，浪漫氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>夜晚派对</strong>——起泡酒或甜酒，热闹氛围</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>清晨早餐</strong>——起泡酒或白葡萄酒，清爽开始</li></ul></section>' +
  '<h3>📸 海边度假拍照技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假要发朋友圈，这些拍照技巧要记住：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒杯角度</strong>——45度角拍照最好看</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>光线</strong>——利用自然光，避免直射</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>背景</strong>——以大海为背景，突出酒杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>构图</strong>——三分法构图，酒杯放在交叉点</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>滤镜</strong>——选择清新自然的滤镜</li></ul></section>' +
  '<h3>💡 海边度假小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的海边度假更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前准备</strong>——不要等到最后一刻才买酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意温度</strong>——酒要冰镇，保持低温</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>适量饮酒</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意安全</strong>——喝酒后不要下水</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>享受过程</strong>——最重要的是开心</li></ul></section>' +
  '<h3>🚫 海边度假禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要下水</strong>——喝酒后不要下水游泳</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要暴晒</strong>——暴晒伤身，要注意防晒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略安全</strong>——海边有危险，要注意安全</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽略环保</strong>——不要乱扔垃圾</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26c6da,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'海边度假，喝的不是酒，是心情。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">海边度假，是一种放松和享受。选对酒，享受阳光、沙滩、美酒，让度假更完美。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你喜欢在海边喝什么酒？<br/>你有什么海边度假的经验？<br/>欢迎在评论区分享你的海边故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '海边度假配酒指南：阳光、沙滩、美酒',
      author: '红樽坊',
      digest: '在海边度假，怎么能没有酒？从白葡萄酒到起泡酒，从桃红到轻盈红酒，这篇指南帮你选对酒。',
      content: gen(),
      coverImage: 'beach_wine_cover_ai.png',
      category: 'lifestyle',
      tags: ["海边", "度假", "沙滩", "夏天", "清爽"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'beach_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Beach, media_id:', d.data.media_id);
  }catch(e){
    console.error('Beach:', e.message);
    process.exit(1);
  }
}

main();
