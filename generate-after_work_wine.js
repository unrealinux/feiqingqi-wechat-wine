const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNGQ0MCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4i+ePreWQjuWWneS4gOadrzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55qE56eR5a2m5L6d5o2uPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuaJk+W3peS6uuacgOW5uOemj+eahOaXtuWIuzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOeUn+a0u+aWueW8jzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #004d40; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #004d40; border-bottom: 2px solid #26a69a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #004d40; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#004d40;">下班后喝一杯的科学依据</h2>' +
  '<p style="text-align:center;color:#666;">打工人最幸福的时刻</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">忙碌了一天，下班后喝一杯葡萄酒，不仅是一种享受，更有科学依据支持。这篇指南告诉你为什么下班后喝酒是正确的选择。</p></section>' +
  '<h3>🍷 为什么下班后想喝酒？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后想喝酒，是身体和心理的双重需求：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>压力释放</strong>——酒精可以暂时缓解压力和焦虑</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>社交需求</strong>——与朋友、同事喝酒是重要的社交方式</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>仪式感</strong>——喝酒标志着从工作状态切换到休息状态</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>奖励机制</strong>——用喝酒奖励自己辛苦工作了一天</li></ul></section>' +
  '<h3>🔬 科学怎么说？</h3>' +
  '<h3>⏰ 最佳饮酒时间</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后喝酒，什么时候最合适？</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>时间</th><th>适合程度</th><th>理由</th></tr><tr><td>下班后立即</td><td>★★★☆☆</td><td>可以放松，但空腹喝酒不好</td></tr><tr><td>晚餐时</td><td>★★★★★</td><td>最佳时间，配餐饮用</td></tr><tr><td>晚餐后</td><td>★★★★☆</td><td>可以放松，但不要太晚</td></tr><tr><td>睡前2小时</td><td>★★★☆☆</td><td>可以放松，但影响睡眠</td></tr><tr><td>深夜</td><td>★☆☆☆☆</td><td>不推荐，影响睡眠和健康</td></tr></table></section>' +
  '<h3>🍷 怎么喝最科学？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后喝酒，遵循这些原则最科学：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制量</strong>——每天不超过1-2杯（150-300ml）</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐饮用</strong>——不要空腹喝酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>慢慢喝</strong>——不要干杯，慢慢品味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择好酒</strong>——质量比数量更重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要天天喝</strong>——每周最多5天，留2天休息</li></ul></section>' +
  '<h3>💡 下班后喝酒的正确方式</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后喝酒，不只是喝酒本身，更是一种生活方式：</p>' +
  '<h3>🚫 下班后喝酒的禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后喝酒，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要喝太多</strong>——微醺最好，喝醉伤身</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要开车</strong>——喝酒后绝对不能开车</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要熬夜</strong>——喝酒后早点休息</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要带情绪喝酒</strong>——心情不好时喝酒会更糟糕</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要依赖酒精</strong>——喝酒是放松，不是解药</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26a69a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'下班后喝一杯，是打工人最幸福的时刻。它不是逃避，而是奖励；不是依赖，而是享受。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下班后喝一杯葡萄酒，是对自己辛苦工作的奖励。科学研究支持适量饮酒可以缓解压力、促进社交、帮助放松。关键是适量、科学、享受。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你下班后喜欢喝什么酒？<br/>你有什么下班后喝酒的仪式感？<br/>欢迎在评论区分享你的下班后喝酒方式！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '下班后喝一杯的科学依据：打工人最幸福的时刻',
      author: '红樽坊',
      digest: '忙碌了一天，下班后喝一杯葡萄酒，不仅是一种享受，更有科学依据支持。这篇指南告诉你为什么下班后喝酒是正确的选择。',
      content: gen(),
      coverImage: 'after_work_wine_cover_ai.png',
      category: 'lifestyle',
      tags: ["下班", "放松", "解压", "科学", "打工人"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'after_work_wine_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('After Work, media_id:', d.data.media_id);
  }catch(e){
    console.error('After Work:', e.message);
    process.exit(1);
  }
}

main();
