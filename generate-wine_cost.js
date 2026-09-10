const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFiNWUyMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4gOeTtumFkueahOaIkOacrDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5o+t56eY6YWS5Lu355yf55u4PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS9oOWWneeahOmFkuWAvOi/meS4quS7t+WQlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puaPreenmDwvdGV4dD4KPC9zdmc+";
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
  '<h2 style="text-align:center;color:#1b5e20;">一瓶酒的成本到底是多少？</h2>' +
  '<p style="text-align:center;color:#666;">揭秘酒价背后的真相</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">100块的酒和1000块的酒，成本到底差多少？你喝的酒，值这个价吗？这篇指南揭秘酒价背后的真相，让你买酒不再被坑。</p></section>' +
  '<h3>💰 一瓶酒的成本构成</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一瓶酒的成本，主要由这些部分构成：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>成本项目</th><th>占比</th><th>说明</th></tr><tr><td>葡萄种植</td><td>15-25%</td><td>葡萄园管理、采摘</td></tr><tr><td>酿造成本</td><td>10-15%</td><td>酿造、陈年、装瓶</td></tr><tr><td>包装成本</td><td>5-10%</td><td>酒瓶、酒标、木塞</td></tr><tr><td>税费</td><td>10-20%</td><td>消费税、增值税</td></tr><tr><td>运输成本</td><td>5-10%</td><td>国际运输、国内运输</td></tr><tr><td>营销成本</td><td>15-25%</td><td>广告、推广、渠道</td></tr><tr><td>利润</td><td>10-30%</td><td>酒商、零售商利润</td></tr></table></section>' +
  '<h3>📊 不同价位酒的成本对比</h3>' +
  '<h3>🤔 为什么酒价这么高？</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌溢价</strong>——名庄酒有品牌溢价，价格自然高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性</strong>——好酒产量有限，物以稀为贵</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>陈年潜力</strong>——好酒可以陈年，越老越值钱</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>营销成本</strong>——酒商的营销成本最终转嫁给消费者</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>渠道利润</strong>——每个渠道都要利润，层层加价</li></ul></section>' +
  '<h3>💡 如何买到性价比高的酒？</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>忽略品牌</strong>——不要只看品牌，关注酒质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>尝试新产区</strong>——新产区的酒性价比通常更高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择中级庄</strong>——波尔多中级庄性价比很高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>关注年份</strong>——差年份的酒价格更低，但品质不一定差</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>直接购买</strong>——从酒商直接购买，省去中间环节</li></ul></section>' +
  '<h3>🚫 买酒的常见陷阱</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要相信低价好酒</strong>——太便宜的酒，品质通常不好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要迷信名庄酒</strong>——名庄酒有假货，要谨慎购买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要迷信评分</strong>——评分只是参考，不代表一切</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要迷信专家</strong>——专家的推荐不一定适合你</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li></ul></section>' +
  '<h3>📊 酒价真相速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>价位</th><th>实际成本</th><th>溢价倍数</th><th>建议</th></tr><tr><td>50元</td><td>15-25元</td><td>2-3倍</td><td>日常饮用</td></tr><tr><td>100元</td><td>30-50元</td><td>2-3倍</td><td>朋友聚会</td></tr><tr><td>300元</td><td>100-150元</td><td>2-3倍</td><td>重要场合</td></tr><tr><td>1000元</td><td>300-500元</td><td>2-3倍</td><td>特殊场合</td></tr><tr><td>10000元</td><td>3000-5000元</td><td>2-3倍</td><td>收藏投资</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'买酒不看价格看品质，这才是真正的懂酒人。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒价的真相是：你买的不只是酒，还有品牌、渠道、税费。了解成本构成，才能买到真正适合自己的好酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你觉得一瓶酒值多少钱？<br/>你买过最划算的酒是什么？<br/>欢迎在评论区分享你的买酒经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '一瓶酒的成本到底是多少？揭秘酒价背后的真相',
      author: '红樽坊',
      digest: '100块的酒和1000块的酒，成本到底差多少？揭秘酒价背后的真相，让你买酒不再被坑。',
      content: gen(),
      coverImage: 'wine_cost_cover_ai.png',
      category: 'deep-dive',
      tags: ["成本", "价格", "性价比", "揭秘", "真相"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_cost_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Cost, media_id:', d.data.media_id);
  }catch(e){
    console.error('Cost:', e.message);
    process.exit(1);
  }
}

main();
