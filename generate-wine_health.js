const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFiNWUyMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juWBpeW6tzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5Zad5aSa5bCR5omN5ZCI6YCC77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuenkeWtpumlrumFkuaMh+WNlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWBpeW6t+aMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1b5e20; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1b5e20; border-bottom: 2px solid #66bb6a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1b5e20; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1b5e20;">葡萄酒与健康：喝多少才合适？</h2>' +
  '<p style="text-align:center;color:#666;">科学饮酒指南</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">适量饮酒有益健康？喝多少才算适量？科学告诉你答案。这篇指南帮你了解葡萄酒与健康的关系。</p></section>' +
  '<h3>🍷 葡萄酒的健康益处</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">适量饮酒确实有益健康：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>心血管健康</strong>——适量饮酒可以降低心脏病风险</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>抗氧化</strong>——葡萄酒中的多酚有抗氧化作用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>延长寿命</strong>——研究表明适量饮酒可以延长寿命</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交健康</strong>——适量饮酒可以促进社交</li></ul></section>' +
  '<h3>📏 多少才算适量？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">科学定义的适量饮酒：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>性别</th><th>适量标准</th><th>说明</th></tr><tr><td>男性</td><td>每天不超过2杯</td><td>1杯约150ml</td></tr><tr><td>女性</td><td>每天不超过1杯</td><td>1杯约150ml</td></tr><tr><td>老年人</td><td>每天不超过1杯</td><td>身体机能下降</td></tr><tr><td>孕妇</td><td>零</td><td>绝对不能饮酒</td></tr></table></section>' +
  '<h3>⚠️ 过量饮酒的危害</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">过量饮酒的危害：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>肝脏损伤</strong>——过量饮酒会损伤肝脏</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>心血管疾病</strong>——过量饮酒会增加心脏病风险</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>癌症风险</strong>——过量饮酒会增加癌症风险</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>精神健康</strong>——过量饮酒会影响精神健康</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交问题</strong>——过量饮酒会导致社交问题</li></ul></section>' +
  '<h3>💡 科学饮酒的建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">科学饮酒的建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制量</strong>——每天不超过1-2杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐饮用</strong>——不要空腹喝酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>慢慢喝</strong>——不要干杯，慢慢品味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择好酒</strong>——质量比数量更重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要天天喝</strong>——每周最多5天，留2天休息</li></ul></section>' +
  '<h3>🚫 这些人不能喝酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这些人绝对不能喝酒：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>孕妇</strong>——酒精会影响胎儿发育</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>哺乳期</strong>——酒精会通过母乳传递给婴儿</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>肝病患者</strong>——酒精会加重肝脏负担</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>服药期间</strong>——酒精可能与药物相互作用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒精过敏者</strong>——酒精会引起过敏反应</li></ul></section>' +
  '<h3>📊 饮酒量速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>建议量</th><th>注意</th></tr><tr><td>日常饮用</td><td>1杯/天</td><td>配餐饮用</td></tr><tr><td>聚会</td><td>2-3杯</td><td>不要过量</td></tr><tr><td>庆祝</td><td>3-4杯</td><td>注意安全</td></tr><tr><td>独自</td><td>1杯</td><td>适量即可</td></tr><tr><td>驾车</td><td>零</td><td>喝酒不开车</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'适量饮酒，享受生活。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒与健康的关系是复杂的。适量饮酒有益健康，但过量饮酒有害。关键是控制量，享受喝酒的乐趣。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你平时喝多少酒？<br/>你有什么饮酒习惯？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与健康：喝多少才合适？',
      author: '红樽坊',
      digest: '适量饮酒有益健康？喝多少才算适量？科学告诉你答案。',
      content: gen(),
      coverImage: 'wine_health_cover_ai.png',
      category: 'health',
      tags: ["健康", "适量", "科学", "饮酒", "养生"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_health_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Health, media_id:', d.data.media_id);
  }catch(e){
    console.error('Health:', e.message);
    process.exit(1);
  }
}

main();
