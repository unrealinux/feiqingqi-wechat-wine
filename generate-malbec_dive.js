const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjYcg6ams5bCU6LSd5YWLIE1hbGJlY++8muS7juazleWbveW8g+WEv+WIsDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7pmL/moLnlu7fkuYvmmJ88L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+ZmVpcWluZ3FpIFdlQ2hhdCBNUDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍇 马尔贝克 Malbec</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">从法国弃儿到阿根廷之星 | 高海拔的魅力</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">马尔贝克（Malbec）是葡萄酒世界最具传奇色彩的"移民"品种。它原产法国西南部，在波尔多曾是六大法定品种之一，但因容易受病害和霜冻影响，地位逐渐被梅洛取代。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">19世纪中期，阿根廷总统Domingo Faustino Sarmiento委托法国农学家将马尔贝克枝条带到阿根廷。没想到，安第斯山脉脚下高海拔、充沛阳光、贫瘠土壤的条件（尤其是门多萨产区，海拔600-1100米），让马尔贝克焕发了第二春！</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📍 主要产区</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">产区</th><th style="padding:10px;text-align:left;">国家</th><th style="padding:10px;text-align:left;">风格特点</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">门多萨 Mendoza</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿根廷</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">最核心产区，浓郁黑莓、紫罗兰风味，全球标杆</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">萨尔塔 Salta</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿根廷</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">海拔最高（1700m+），酸度更高，花香更明显</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">巴塔哥尼亚 Patagonia</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">阿根廷</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">凉爽气候，风格更优雅细腻</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">卡奥尔 Cahors</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">法国</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">"黑酒"（Black Wine），单宁更强，风格更紧涩</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 香气特征</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🍇 果香：黑莓、黑樱桃、李子——阿根廷马尔贝克的标志</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌸 花香：紫罗兰——凉爽气候的标志</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍫 桶香：可可粉、咖啡、摩卡——常见于桶陈风格</li><li style="margin:6px 0;color:#333;line-height:1.7;">🌿 草本：青椒、薄荷——凉爽年份的特征</li><li style="margin:6px 0;color:#333;line-height:1.7;">🪨 矿物：石墨、碎石——高海拔产区的特色</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍷 阿根廷 vs 法国风格对比</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">特征</th><th style="padding:10px;text-align:left;">阿根廷马尔贝克</th><th style="padding:10px;text-align:left;">法国卡奥尔马尔贝克</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒体</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">饱满</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中等偏饱满</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">单宁</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">柔顺丝滑</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">强劲粗犷</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">果味</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">成熟浓郁的黑莓、黑樱桃</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">更紧致的黑李子、黑醋栗</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中等偏低</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中等偏高</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒精度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">13.5-15%</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">12-13.5%</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">陈年潜力</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">中等（5-8年）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">长（10-20年）</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🍽️ 美食搭配</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🥩 阿根廷烤肉（Asado）——经典中的经典搭配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍔 汉堡、牛排——马尔贝克的单宁与红肉是绝配</li><li style="margin:6px 0;color:#333;line-height:1.7;">🍫 黑巧克力——浓郁的巧克力风味与马尔贝克相得益彰</li><li style="margin:6px 0;color:#333;line-height:1.7;">🧀 蓝纹奶酪——力量对力量的较量</li><li style="margin:6px 0;color:#333;line-height:1.7;">🥟 中餐搭配：红烧牛腩、酱骨架、烤鸭、腊味合蒸</li></ul>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 入门建议：阿根廷马尔贝克性价比极高，入门级（¥80-150）就能喝到相当不错的品质。从门多萨的入门马尔贝克开始，感受紫罗兰+黑莓的经典风味；进阶可以尝试高海拔的Lujan de Cuyo或Uco Valley。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🏆 推荐入门酒款</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇷 Catena Zapata Malbec — 阿根廷马尔贝克标杆名庄</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇷 Bodega Norton Malbec — 入门级性价比之王</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇷 Trapiche Malbec — 全球最畅销的马尔贝克之一</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇦🇷 Achaval Ferrer Malbec — 高海拔精品代表</li><li style="margin:6px 0;color:#333;line-height:1.7;">🇫🇷 Château de Chambert Cahors — 法国风格入门</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">马尔贝克的故事告诉我们：有时候失败只是因为没找到对的地方。这款在法国被边缘化的品种，在安第斯山脉脚下找到了属于自己的天地，成为新世界葡萄酒最闪亮的名片之一。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍇 马尔贝克 Malbec：从法国弃儿到阿根廷之星',
      author: '红酒顾问',
      digest: '马尔贝克在法国卡奥尔是"黑酒"，在阿根廷却成为国宝。从高海拔到阳光充沛，它如何完成华丽逆袭？阿根廷马尔贝克全面指南。',
      content: gen(),
      coverImage: 'malbec_dive_cover_ai.png',
      category: 'wine-grape',
      tags: ["马尔贝克", "Malbec", "阿根廷", "门多萨", "卡奥尔", "红葡萄"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'malbec_dive_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const f = new FormData();
    f.append('media', cb, {filename: 'cover.png', contentType: 'image/png'});
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
    console.log('✅ malbec_dive, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ malbec_dive:', e.message);
    process.exit(1);
  }
}

main();
