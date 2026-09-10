const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNlMjcyMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWmguS9leW7uueri+WutuW6remFkuafnO+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LuO6Zu25byA5aeL55qE5a2Y6YWS5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuiuqeS9oOeahOWlvemFkuS/neaMgeacgOS9s+eKtuaAgTwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWunueUqOaMh+WNlzwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#3e2723;">如何建立家庭酒柜？</h2>' +
  '<p style="text-align:center;color:#666;">从零开始的存酒指南</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">买了很多酒却不知道怎么储存？随意放在厨房或阳台，结果好酒变质了？这篇指南帮你从零开始建立完美的家庭酒柜，让你的好酒保持最佳状态。</p></section>' +
  '<h3>🍷 为什么需要酒柜？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒对储存环境非常敏感，不当的储存会导致酒变质：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>温度</strong>——温度过高会加速陈年，过低会冻裂酒瓶</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>湿度</strong>——湿度过低会导致软木塞干裂，过高会导致酒标发霉</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>光线</strong>——紫外线会分解酒中的有机化合物</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>震动</strong>——震动会加速陈年，破坏酒液结构</li></ul></section>' +
  '<h3>🏆 酒柜类型选择</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据你的需求和预算，选择合适的酒柜类型：</p>' +
  '<h3>📊 酒柜选购参数</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>参数</th><th>推荐值</th><th>说明</th></tr><tr><td>温度范围</td><td>5-20°C</td><td>可调节温度范围</td></tr><tr><td>温度稳定性</td><td>+/-1°C</td><td>温度波动越小越好</td></tr><tr><td>湿度范围</td><td>50-80%</td><td>保持软木塞湿润</td></tr><tr><td>紫外线防护</td><td>防紫外线玻璃</td><td>保护酒液不受光照</td></tr><tr><td>减震系统</td><td>压缩机减震</td><td>减少震动对酒的影响</td></tr><tr><td>噪音水平</td><td><40dB</td><td>静音运行</td></tr></table></section>' +
  '<h3>💰 不同预算的推荐方案</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据你的预算，这里有几个推荐方案：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算500元以下</strong>——用冰箱临时储存，或买一个简单的酒架</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算500-2000元</strong>——买一个半导体酒柜，适合入门者</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算2000-5000元</strong>——买一个入门级恒温酒柜，适合家庭使用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算5000-10000元</strong>——买一个中端恒温酒柜，适合收藏爱好者</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算10000元以上</strong>——买一个高端恒温酒柜，适合专业收藏</li></ul></section>' +
  '<h3>📝 酒柜使用技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">有了酒柜，还要正确使用：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前预热</strong>——新酒柜买回来后，提前24小时开机运行</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要塞太满</strong>——留出空间让空气流通</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>分类存放</strong>——按类型、产区、年份分类</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>定期检查</strong>——每周检查一次温度和湿度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免频繁开门</strong>——开门次数越少越好</li></ul></section>' +
  '<h3>🚫 常见错误</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">使用酒柜时，这些错误要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>放在厨房</strong>——厨房温度变化大，不适合存酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>放在阳台</strong>——阳光直射会损害酒质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>放在冰箱</strong>——温度太低，湿度不够</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>横放所有酒</strong>——起泡酒和螺旋盖的酒应该直立存放</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>长期不动</strong>——长期存放的酒要定期检查</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#8d6e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'好马配好鞍，好酒配好柜。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">建立家庭酒柜，是每个葡萄酒爱好者的必修课。选对酒柜，正确使用，才能让你的好酒保持最佳状态。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有家庭酒柜吗？<br/>你平时怎么储存葡萄酒？<br/>欢迎在评论区分享你的存酒经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '如何建立家庭酒柜？从零开始的存酒指南',
      author: '红樽坊',
      digest: '买了很多酒却不知道怎么储存？从恒温酒柜到简易存酒方案，这篇指南帮你建立完美的家庭酒柜。',
      content: gen(),
      coverImage: 'home_wine_cabinet_cover_ai.png',
      category: 'practical-guide',
      tags: ["酒柜", "储存", "收藏", "家庭", "实用"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'home_wine_cabinet_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Home Cabinet, media_id:', d.data.media_id);
  }catch(e){
    console.error('Home Cabinet:', e.message);
    process.exit(1);
  }
}

main();
