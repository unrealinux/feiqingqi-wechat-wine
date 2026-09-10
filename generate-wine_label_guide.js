const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjk1YyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuWmguS9leeci+aHguiRoeiQhOmFkuagh+etvjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+M+WIhumSn+WtpuS8mjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiYmIiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7kubDphZLkuI3lho3ooqvlv73mgqA8L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7nuqLmqL3lnYogfCDlrp7nlKjmioDog708L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #00695c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #00695c; border-bottom: 2px solid #26a69a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #00695c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#00695c;">如何看懂葡萄酒标签？3分钟学会</h2>' +
  '<p style="text-align:center;color:#666;">买酒不再被忽悠</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">面对酒标上密密麻麻的外文，你是不是一脸懵？什么\'Grand Cru\'、\'Reserva\'、\'Mis en bouteille\'……这些词到底是什么意思？这篇指南教你3分钟看懂任何葡萄酒标签。</p></section>' +
  '<h3>📋 酒标上的关键信息</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一瓶葡萄酒的标签上，通常包含以下几个关键信息：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>信息</th><th>位置</th><th>含义</th></tr><tr><td>酒名</td><td>最显眼的位置</td><td>酒庄或品牌名称</td></tr><tr><td>产地</td><td>酒名下方或侧面</td><td>葡萄酒的来源地</td></tr><tr><td>年份</td><td>通常在酒名附近</td><td>葡萄采摘的年份</td></tr><tr><td>品种</td><td>新世界酒常见</td><td>酿造所用的葡萄品种</td></tr><tr><td>酒精度</td><td>通常在背面</td><td>酒精含量百分比</td></tr><tr><td>容量</td><td>通常在底部</td><td>酒瓶的容量</td></tr></table></section>' +
  '<h3>🌍 新旧世界酒标的区别</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒分为旧世界（欧洲）和新世界（其他地区），它们的酒标风格截然不同：</p>' +
  '<h3>🔑 必须认识的关键词</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">无论新旧世界，这些关键词一定要认识：</p>' +
  '<h3>🏷️ 酒标上的等级制度</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国波尔多的等级制度是最复杂的，也是最常见的：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>等级</th><th>含义</th><th>价格区间</th></tr><tr><td>Grand Cru Classé</td><td>列级庄（1855年评定）</td><td>¥2000-10000+</td></tr><tr><td>Cru Bourgeois</td><td>中级庄</td><td>¥300-1000</td></tr><tr><td>Cru Artisan</td><td>手工匠人庄</td><td>¥200-500</td></tr><tr><td>AOC/AOP</td><td>法定产区酒</td><td>¥100-500</td></tr><tr><td>Vin de Pays</td><td>地区餐酒</td><td>¥50-150</td></tr><tr><td>Vin de Table</td><td>日常餐酒</td><td>¥30-80</td></tr></table></section>' +
  '<h3>💡 实用解读技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">掌握这几个技巧，你就能快速判断一瓶酒的品质：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看产区</strong>——产区越小越具体，酒通常越好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看酒庄名</strong>——名庄酒的品质有保障</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看装瓶信息</strong>——酒庄装瓶（Mis en bouteille）比工厂装瓶好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看年份</strong>——好年份的酒品质更好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看等级</strong>——Grand Cru > Premier Cru > AOC > Vin de Pays</li></ul></section>' +
  '<h3>📱 实用工具推荐</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果还是看不懂，这些工具可以帮你：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Vivino App</strong>——扫描酒标，查看评分和价格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>Wine-Searcher</strong>——查询全球价格和评分</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒标翻译器</strong>——微信小程序，扫描酒标自动翻译</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>红酒世界</strong>——中文葡萄酒百科，查询酒款信息</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26a69a,transparent);margin:25px 0;"></div>' +
  '<h3>📊 常见酒标解读示例</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这里举几个常见酒标的解读示例：</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你看酒标时最困惑的是什么？<br/>欢迎在评论区分享你的疑问！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '如何看懂葡萄酒标签？3分钟学会',
      author: '红樽坊',
      digest: '面对酒标上密密麻麻的外文，你是不是一脸懵？这篇指南教你3分钟看懂任何葡萄酒标签，买酒不再被忽悠。',
      content: gen(),
      coverImage: 'wine_label_guide_cover_ai.png',
      category: 'practical-guide',
      tags: ["酒标", "标签", "入门", "选购", "技能"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_label_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Label, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Label:', e.message);
    process.exit(1);
  }
}

main();
