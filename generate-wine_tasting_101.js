const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260607'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDU0ZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSIyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ1NGYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjbcg6JGh6JCE6YWS5ZOB6Ym05YWl6Zeo77ya55yL44CB6Ze744CB5bCd4oCU4oCU5LuO6Zu25byAPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWni+WtpuWTgemFkjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5mZWlxaW5ncWkgV2VDaGF0IE1QPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section style="padding:10px 0;">' +
  '<h2 style="text-align:center;color:#b8860b;">🍷 葡萄酒品鉴入门</h2>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">看、闻、尝——从零开始学品酒 | 三步法全解析</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">品酒听起来好像很深奥，其实它就像学做饭一样，掌握了基本方法，人人都能成为品酒达人。葡萄酒品鉴的核心就是三个步骤：看（Look）、闻（Smell）、尝（Taste）。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">最重要的是：品酒没有"正确答案"。只要你认真感受、诚实记录，你的品鉴就是有效的。不要被那些"品酒大师"的术语吓到——每个人对气味的感知都是独特的。</p>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👀 第一步：看（Look）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">将酒杯举到白色背景前（白纸或白色桌布就可以），观察酒液的外观。你不需要品酒师的专业光圈，肉眼观察就能获取很多信息。</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">观察点</th><th style="padding:10px;text-align:left;">白葡萄酒</th><th style="padding:10px;text-align:left;">红葡萄酒</th><th style="padding:10px;text-align:left;">含义</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">颜色深度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浅稻草→深金黄→琥珀</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浅宝石红→深紫红→砖红</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">颜色越深，酒体越饱满/越成熟</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">边缘色调</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">年轻=青绿色</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">年轻=紫色边缘</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">边缘泛砖红=陈年迹象</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">清澈度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">清澈/浑浊</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">清澈/浑浊</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">浑浊可能表示无过滤或已变质</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">挂杯/酒泪</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">多/少</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">多/少</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">挂杯越多=酒精度或糖分越高</td></tr></tbody></table></div>' +
  '<h3 style="color:#b8860b;margin-top:20px;">颜色透露的秘密：</h3>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">年轻白葡萄酒：浅稻草色、淡黄绿色 → 清爽型，如长相思、灰皮诺</li><li style="margin:6px 0;color:#333;line-height:1.7;">陈年白葡萄酒：深金黄色、琥珀色 → 受过橡木桶或陈年，如霞多丽</li><li style="margin:6px 0;color:#333;line-height:1.7;">年轻红葡萄酒：深紫色、宝石红色 → 果味充沛，如赤霞珠、西拉</li><li style="margin:6px 0;color:#333;line-height:1.7;">陈年红葡萄酒：砖红色、石榴红色 → 已经陈年，单宁柔化</li><li style="margin:6px 0;color:#333;line-height:1.7;">桃红葡萄酒：浅粉色、三文鱼色 → 短期浸皮酿造</li></ul>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👃 第二步：闻（Smell）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">闻香是品酒中最关键也最享受的步骤。人的嗅觉可以识别数千种气味，远远超过味觉能够分辨的味道种类。</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">首先静止闻一次——感受酒的"第一印象"。然后轻轻摇杯（让酒与空气接触释放香气），再深吸一口。你可能会闻到三类香气：</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">香气类别</th><th style="padding:10px;text-align:left;">来源</th><th style="padding:10px;text-align:left;">例子</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">一类香气（果香/花香）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">葡萄本身</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">黑莓、樱桃、玫瑰、荔枝</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">二类香气（发酵/桶香）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酿酒工艺</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">香草、烤面包、黄油、酵母</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">三类香气（陈年香）</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">瓶中陈年</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">皮革、松露、蜂蜜、干果</td></tr></tbody></table></div>' +
  '<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">💡 闻香小技巧：不要害怕用你的生活经验——"这闻起来像我家花园的玫瑰"比"这有玫瑰多酚的芳香"要真实得多。越个人化的描述，越能帮助你记住这款酒。</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">👅 第三步：尝（Taste）</h2>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">终于到了最期待的一步！喝一小口（不要太多），让酒液覆盖整个舌面，像漱口一样让酒在口中停留3-5秒。注意感受以下维度：</p>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">维度</th><th style="padding:10px;text-align:left;">描述</th><th style="padding:10px;text-align:left;">如何判断</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">干→半干→半甜→甜</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">舌尖前端的甜味感知</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酸度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低→中→高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">口水分泌量（越多=酸度越高）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">单宁</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低→中→高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">口腔的干燥/收敛感（像喝浓茶）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒体</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">轻盈→中等→饱满</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒液在口中的"重量感"</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">酒精度</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">低→中→高</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">喉咙的温热感</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">余味</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">短→中→长</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">咽下后风味持续的时间</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">📝 品酒笔记模板（初学者版）</h2>' +
  '<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">简易品酒笔记</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">酒名：________________' +
  '年份：____  产区：________________' +
  '颜色：□浅 □中 □深  色调：__________' +
  '香气（写3个词）：________、________、________' +
  '口感（打勾）：□干 □半干 □甜' +
  '喜欢吗？：□很喜欢 □还行 □一般' +
  '一句话评价：_______________________' +
  '评分（满分10分）：____/10</p></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🌡️ 侍酒温度速查表</h2>' +
  '<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">酒的类型</th><th style="padding:10px;text-align:left;">侍酒温度</th><th style="padding:10px;text-align:left;">简单判断</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">起泡酒/香槟</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">6-8°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冰镇2小时</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">清爽白葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">8-10°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冰镇1.5小时</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">饱满白葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">10-12°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冰镇1小时</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">桃红葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">8-10°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冰镇1.5小时</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">轻盈红葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">12-14°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">冰箱20分钟</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">饱满红葡萄酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">16-18°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">室温（夏季可稍凉）</td></tr><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">甜酒</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">6-8°C</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">充分冰镇</td></tr></tbody></table></div>' +
  '<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">🎯 品酒入门避坑指南</h2>' +
  '<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 不要在品酒前吃辛辣、酸涩的食物或喝咖啡——会破坏味觉</li><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 不要在喷香水或气味浓烈的环境品酒——香气干扰</li><li style="margin:6px 0;color:#333;line-height:1.7;">❌ 不要迷信昂贵的酒杯——普通的ISO酒杯就足够好</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 品酒前喝点水，保持口腔干净</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 同一款酒在不同温度下品尝，味道可能完全不同——试试冷藏20分钟后的红酒</li><li style="margin:6px 0;color:#333;line-height:1.7;">✅ 多喝多比较——品酒能力唯一的提升方法就是大量品鉴</li></ul>' +
  '<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>' +
  '<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">品酒不是考试，没有标准答案。最顶级的品酒师也可能会把一款酒误认为是另一款。品酒真正的意义不在于"猜对"，而在于"感受"——打开感官、专注当下、享受每一杯酒带来的独特体验。</p>' +
  '<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍷 葡萄酒品鉴入门：看、闻、尝——从零开始学品酒',
      author: '红酒顾问',
      digest: '如何像专家一样品酒？看颜色、闻香气、尝味道——三步法详细拆解。附赠品酒词大全和品酒笔记模板。',
      content: gen(),
      coverImage: 'wine_tasting_101_cover_ai.png',
      category: 'wine-practical',
      tags: ["品酒", "品鉴", "初学者", "看闻尝", "品酒笔记", "入门"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_tasting_101_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ wine_tasting_101, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ wine_tasting_101:', e.message);
    process.exit(1);
  }
}

main();
