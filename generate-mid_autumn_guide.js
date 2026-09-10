const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I4ODYwYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfpa4g5Lit56eL5a625a606YWN6YWS5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7mnIjlnIbkurrlm6LlnIbvvIzpgInlr7nphZLmiY3lnIbmu6E8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5pyI6aW8wrflpKfpl7jon7nCt+WutuW4uOiPnMK36YCB56S85YWo5pS755WlPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNDAwIiB4Mj0iMTAwMCIgeTI9IjQwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjEzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5Lit56eL54m56L6RIMK3IOe6oumFkumhvumXrjwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #b8860b; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #b8860b; border-bottom: 2px solid #ffd54f; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #b8860b; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#b8860b;">🥮 中秋家宴配酒指南</h2>' +
  '<p style="text-align:center;color:#666;">月圆人团圆，选对酒才圆满 | 从月饼到螃蟹，从家宴到送礼</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">中秋是中国人的团圆节。月下把酒，对影成三人——中国人的中秋，从来少不了酒。以前是桂花酒、黄酒，如今更多家庭开始用葡萄酒来搭配中秋家宴。选对了，满桌生辉；选错了，再好的菜也差点意思。</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这篇文章从月饼配酒、大闸蟹配酒、家常菜配酒到送礼推荐，帮你一篇文章搞定中秋所有选酒场景。</p>' +
  '<h3>🥟 一、月饼配酒：甜咸之战，各有所爱</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中秋的核心是月饼。但月饼的馅料五花八门——莲蓉、五仁、冰皮、鲜肉——甜咸不一，配酒策略也完全不同。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>月饼类型</th><th>推荐酒款</th><th>搭配逻辑</th></tr><tr><td>莲蓉蛋黄（甜）</td><td>苏玳贵腐 / 匈牙利Tokaji</td><td>甜度匹配，贵腐的蜂蜜香与莲蓉相得益彰</td></tr><tr><td>五仁（甜加坚果）</td><td>波特酒 / 陈年朗姆</td><td>坚果香呼应，浓郁度匹配</td></tr><tr><td>冰皮（清爽甜）</td><td>莫斯卡托阿斯蒂 / 半甜雷司令</td><td>清爽甜型，气泡感解腻</td></tr><tr><td>鲜肉月饼（咸）</td><td>黑皮诺 / 博若莱新酒</td><td>轻盈果香，不压肉味</td></tr><tr><td>流心奶黄</td><td>晚收雷司令 / 琼瑶浆</td><td>微甜芳香，与奶黄交融</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 小贴士</h4><p style="color:#333;line-height:1.8;margin:0">💡 核心原则：月饼配酒"甜配甜"——酒的甜度不能低于月饼的甜度，否则酒会变酸。莲蓉月饼配干型葡萄酒是大忌！</p></div></section>' +
  '<h3>🦀 二、大闸蟹配酒：秋天的第一口鲜</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">"秋风起，蟹脚痒。"大闸蟹是中秋餐桌上的绝对主角。清蒸大闸蟹的吃法是先品蟹黄、再吃肉、最后吃蟹腿。配酒需要兼顾去腥、提鲜、不抢味。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>螃蟹做法</th><th>推荐酒款</th><th>选择理由</th></tr><tr><td>清蒸大闸蟹</td><td>香槟 / 卡瓦</td><td>气泡清口，酸度解腻，与蟹黄绝配</td></tr><tr><td>清蒸大闸蟹（实惠款）</td><td>干型雷司令 / 长相思</td><td>高酸度对应蟹醋，果香不盖蟹味</td></tr><tr><td>醉蟹</td><td>半干雷司令 / 琼瑶浆</td><td>微甜中和酒醉的烈感，芳香呼应</td></tr><tr><td>蟹粉豆腐</td><td>霞多丽（少桶）</td><td>饱满口感呼应蟹粉的浓郁</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 小贴士</h4><p style="color:#333;line-height:1.8;margin:0">💡 懒人法则：大闸蟹配白葡萄酒基本不会错，避开重橡木味和高单宁红酒。香槟或干型雷司令是永远不会出错的选择。</p></div></section>' +
  '<h3>🍗 三、家宴主菜配酒全攻略</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中秋家宴通常不止一道菜。好的配酒策略是：选一瓶"万能型"酒款打底，再根据主菜做微调。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>家常菜</th><th>推荐酒款</th><th>选择理由</th></tr><tr><td>红烧肉/东坡肉</td><td>巴罗洛 / 基安蒂</td><td>高单宁分解油脂，酒体压得住浓油赤酱</td></tr><tr><td>清蒸鱼/白灼虾</td><td>夏布利 / 桑塞尔</td><td>高酸度对应清淡海鲜，矿物感提鲜</td></tr><tr><td>白切鸡/盐焗鸡</td><td>黑皮诺 / 佳美</td><td>轻盈酒体不压鸡肉本味</td></tr><tr><td>烤鸭</td><td>黑皮诺 / 博若莱</td><td>果香呼应鸭肉，单宁适中</td></tr><tr><td>烧鹅/叉烧</td><td>里奥哈陈酿 / GSM混酿</td><td>中等酒体，香料味呼应烤肉</td></tr><tr><td>清炒时蔬</td><td>灰皮诺 / 绿维特利纳</td><td>清爽干净，不压蔬菜的鲜甜</td></tr><tr><td>全家福大乱炖</td><td>半甜雷司令</td><td>万能百搭，什么菜都能配</td></tr></table></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你只打算开一瓶酒搞定整桌菜，推荐：黑皮诺（红酒）或 半干雷司令（白酒）。这两品种适应性最强，不会和任何菜产生冲突。</p>' +
  '<h3>🎁 四、中秋送礼推荐：三档不踩雷</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中秋送礼是刚需。送长辈、送领导、送朋友，预算和选择逻辑都不同。</p>' +
  '<h3 style="border-bottom:none;">¥200-500 实用档</h3>' +
  '<div class="ri"><h4>适合场景：送朋友、同事、普通亲戚</h4><p style="color:#333;line-height:1.8;margin:0">🥂 香槟/卡瓦——气泡酒天生适合节日，开瓶就有仪式感<br/>🍷 新西兰马尔堡长相思——品质稳定，清爽好喝<br/>🍷 智利干露酒庄高端款——大品牌有保障，性价比高</p></div>' +
  '<h3 style="border-bottom:none;">¥500-1000 体面档</h3>' +
  '<div class="ri"><h4>适合场景：送长辈、合作伙伴</h4><p style="color:#333;line-height:1.8;margin:0">🥂 法国一级园勃艮第白——低调奢华，懂酒的人会心一笑<br/>🍷 意大利巴罗洛——"酒王"名头，送礼有面<br/>🍷 纳帕谷赤霞珠——美国膜拜酒，品质硬核</p></div>' +
  '<h3 style="border-bottom:none;">¥1000+ 高端送礼</h3>' +
  '<div class="ri"><h4>适合场景：送重要客户、未来岳父</h4><p style="color:#333;line-height:1.8;margin:0">🥂 香槟名庄（唐培里侬/库克/Krug）——开瓶就有排面<br/>🍷 波尔多列级庄（拉菲入门/木桐）——中国人最认的牌子<br/>🍷 罗曼尼康帝旗下酒款——懂酒的人收到会流泪</p></div>' +
  '<h3>❌ 五、中秋避坑指南</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 月饼配干红——甜和干涩的结合堪称灾难</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 大闸蟹配重单宁红酒——单宁和蟹肉产生金属味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 送人太冷门的酒款——中秋送礼求稳不求奇</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 买酒不查年份——不好的年份别买，宁可买无年份香槟</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">❌ 忽视饮用温度——红葡萄酒别太热，白葡萄酒别太冰</li></ul></section>' +
  '<h3>🥂 中秋配酒口诀</h3>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 小贴士</h4><p style="color:#333;line-height:1.8;margin:0">月饼配甜酒，螃蟹配气泡；<br/>红烧配单宁，清蒸配高酸；<br/>送礼选名庄，自饮看性价比。</p></div></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中秋的意义不在酒有多贵，而在于和谁一起喝。选一瓶好酒，月下对饮，这就是最好的团圆。如果还是不知道买什么——记住一句话：香槟配万物，莫斯卡托最讨喜。</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ffd54f,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 祝中秋快乐，月圆人圆酒满杯 —</p></section>' +
  '</section>' ;
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🥮 中秋家宴配酒指南：月圆人团圆，选对酒才圆满',
      author: '红酒顾问',
      digest: '月饼配什么酒？大闸蟹的最佳搭档是谁？送礼选什么价位？一篇文章搞定中秋所有选酒场景。',
      content: gen(),
      coverImage: 'mid_autumn_guide_cover_ai.png',
      category: 'wine-food',
      tags: ["中秋", "配酒", "月饼", "大闸蟹", "送礼", "家宴", "节日"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'mid_autumn_guide_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ mid_autumn_guide, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ mid_autumn_guide:', e.message);
    process.exit(1);
  }
}

main();
