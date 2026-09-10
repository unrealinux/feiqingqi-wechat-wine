const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2NTEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWHj+iCpeacn+mXtOiDveWWneiRoeiQhOmFkuWQl++8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55yf55u45Y+v6IO96K6p5L2g5oSP5aSWPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuenkeWtpuino+ivu+iRoeiQhOmFkuS4juWHj+iEgueahOWFs+ezuzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWBpeW6t+aPreenmDwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#e65100;">减肥期间能喝葡萄酒吗？</h2>' +
  '<p style="text-align:center;color:#666;">真相可能让你意外</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">减肥期间想喝酒，又怕发胖？很多人在减肥时完全戒酒，但也有人想知道：葡萄酒真的会导致发胖吗？这篇指南帮你搞清楚葡萄酒与减脂的关系。</p></section>' +
  '<h3>📊 葡萄酒的热量是多少？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">首先，我们来看看葡萄酒的热量：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款类型</th><th>酒精度</th><th>每杯热量（150ml）</th><th>相当于多少食物</th></tr><tr><td>干型白葡萄酒</td><td>12%</td><td>约100大卡</td><td>半个苹果</td></tr><tr><td>干型红葡萄酒</td><td>13%</td><td>约125大卡</td><td>一小碗米饭</td></tr><tr><td>甜型葡萄酒</td><td>10%</td><td>约150大卡</td><td>一块巧克力</td></tr><tr><td>起泡酒</td><td>12%</td><td>约100大卡</td><td>半个苹果</td></tr><tr><td>波特酒</td><td>20%</td><td>约180大卡</td><td>一块蛋糕</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 关键发现</h4><p style="color:#333;line-height:1.8;margin:0"><strong>一杯干型葡萄酒的热量约100-125大卡</strong>，相当于半个苹果或一小碗米饭。这个热量并不算高，但如果你每天喝，累积起来就很可观了。</p></div></section>' +
  '<h3>🍷 喝葡萄酒会发胖吗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">答案是：<strong>适量喝不会，过量喝会。</strong></p>' +
  '<h3>📝 减肥期间喝酒的原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你在减肥期间想喝酒，遵循这些原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制量</strong>——每天不超过1杯（150ml）</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择干型酒</strong>——干型葡萄酒含糖量最低</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐饮用</strong>——不要空腹喝酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>计入热量</strong>——把酒的热量算入每日摄入</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要天天喝</strong>——每周最多3-4次</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免甜酒</strong>——甜型葡萄酒含糖量高</li></ul></section>' +
  '<h3>🏆 最适合减肥期间喝的酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下酒款热量最低，最适合减肥期间饮用：</p>' +
  '<div class="ri"><h4>干型白葡萄酒（长相思、雷司令） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">最推荐</span></h4><p style="color:#333;line-height:1.8;margin:0">热量最低，约100大卡/杯，清爽易饮</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">约100大卡/杯</p></div>' +
  '<div class="ri"><h4>干型桃红葡萄酒 <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">推荐</span></h4><p style="color:#333;line-height:1.8;margin:0">热量适中，约110大卡/杯，颜值高</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">约110大卡/杯</p></div>' +
  '<div class="ri"><h4>轻盈型红葡萄酒（黑皮诺、佳美） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">推荐</span></h4><p style="color:#333;line-height:1.8;margin:0">热量适中，约120大卡/杯，果香浓郁</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">约120大卡/杯</p></div>' +
  '<div class="ri"><h4>起泡酒（干型） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">推荐</span></h4><p style="color:#333;line-height:1.8;margin:0">热量较低，约100大卡/杯，气泡感强</p><p style="color:#ff9800;font-weight:bold;margin:5px 0 0 0;">约100大卡/杯</p></div>' +
  '<h3>🚫 减肥期间应该避免的酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下酒款热量较高，减肥期间应该避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>甜型葡萄酒</strong>——含糖量高，热量高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>波特酒</strong>——酒精度高，热量高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>加强酒</strong>——酒精度高，热量高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>鸡尾酒</strong>——通常含糖量高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>啤酒</strong>——热量高，容易喝多</li></ul></section>' +
  '<h3>💡 减肥期间喝酒的小技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小技巧，让你减肥期间也能享受美酒：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>先喝水</strong>——喝酒前先喝一杯水，增加饱腹感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>慢慢喝</strong>——不要干杯，慢慢品味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配蔬菜</strong>——用蔬菜代替高热量下酒菜</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>记录热量</strong>——把酒的热量记入每日摄入</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择场合</strong>——只在特殊场合喝酒，不要日常饮酒</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff9800,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'减肥不是完全戒酒，而是学会聪明地喝酒。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">减肥期间可以喝酒，但要控制量和选择酒款。一杯干型葡萄酒的热量并不高，关键是不要过量。学会聪明地喝酒，既能享受美酒，又能保持身材。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你减肥期间喝过葡萄酒吗？<br/>你觉得喝酒会影响减肥吗？<br/>欢迎在评论区分享你的经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '减肥期间能喝葡萄酒吗？真相可能让你意外',
      author: '红樽坊',
      digest: '葡萄酒热量高吗？喝葡萄酒会发胖吗？减肥期间到底能不能喝酒？这篇指南帮你搞清楚葡萄酒与减脂的关系。',
      content: gen(),
      coverImage: 'wine_diet_cover_ai.png',
      category: 'health',
      tags: ["减肥", "减脂", "热量", "健康", "饮食"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_diet_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Diet, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Diet:', e.message);
    process.exit(1);
  }
}

main();
