const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhiMDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfl7rvuI8g5Lit5Zu96JGh6JCE6YWS5Lqn5Yy65Zyw55CG5oyH5Y2XPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjMxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2RkZCIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9InNlcmlmIj7ku47otLrlhbDlsbHliLDpppnmoLzph4zmi4k8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5LiA5byg5Zu+55yL5oeC5Zu95Lqn6YWS55qE5qC85bGA5LiO5pyq5p2lPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNDAwIiB4Mj0iMTAwMCIgeTI9IjQwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjEzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5a6B5aSPIMK3IOaWsOeWhiDCtyDkupHljZcgwrcg5bGx5LicIMK3IOays+WMlyDCtyDnlJjogoMgwrcg5oCA5p2lIMK3IOWxseilvzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #8b0000; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #8b0000; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #8b0000; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#8b0000;">🗺️ 中国葡萄酒产区地理指南</h2>' +
  '<p style="text-align:center;color:#666;">从贺兰山到香格里拉 | 一张图看懂国产酒的格局与未来</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">十年前的送礼清单里，国产葡萄酒还上不了台面。今天，贺兰山东麓的酒款已经在Decanter大赛上拿奖拿到手软，云南香格里拉的藏语酒标成为米其林餐厅的宠儿，新疆的天山北麓产区正在被LVMH看中。</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国已经是世界第二大葡萄种植国（仅次于西班牙），但国产葡萄酒的产量只占全球的不到3%——这意味着巨大的品质提升空间。这篇文章带你走遍中国的核心葡萄酒产区，每一片土地都在酝酿令人惊喜的风味。</p>' +
  '<h3>🇨🇳 中国葡萄酒产区总览</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>产区</th><th>位置</th><th>气候</th><th>代表品种</th><th>标志酒庄</th></tr><tr><td>宁夏贺兰山</td><td>宁夏北部</td><td>大陆性·干旱</td><td>赤霞珠·蛇龙珠·霞多丽</td><td>贺兰晴雪·银色高地·迦南美地</td></tr><tr><td>新疆天山北麓</td><td>天山北麓</td><td>大陆性·干燥</td><td>赤霞珠·梅洛·雷司令</td><td>中信国安·乡都·天塞</td></tr><tr><td>云南香格里拉</td><td>横断山脉</td><td>高原·冷凉</td><td>赤霞珠·品丽珠·西拉</td><td>敖云·香格里拉酒业</td></tr><tr><td>山东烟台</td><td>胶东半岛</td><td>海洋性·温润</td><td>蛇龙珠·霞多丽·雷司令</td><td>张裕·长城·君顶</td></tr><tr><td>河北怀来</td><td>张家口怀来</td><td>大陆性·半干旱</td><td>赤霞珠·马瑟兰·霞多丽</td><td>长城桑干·中法庄园</td></tr><tr><td>甘肃河西走廊</td><td>甘肃西部</td><td>大陆性·干燥</td><td>黑比诺·赤霞珠</td><td>莫高·国风</td></tr><tr><td>山西太谷</td><td>山西中部</td><td>大陆性</td><td>赤霞珠·梅洛</td><td>怡园酒庄</td></tr></table></section>' +
  '<h3>🏔️ 宁夏贺兰山东麓：中国的波尔多</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">贺兰山是中国最成功的葡萄酒产区，没有之一。北纬37°-39°，与波尔多同纬度。海拔1100-1200米的高原，昼夜温差大，葡萄成熟期长，风味物质积累充分。冬季寒冷干燥，天然抑制病虫害——这里几乎不需要使用农药。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">贺兰山东麓的土壤以砾石和沙质土壤为主，通透性好，类似波尔多的格拉夫产区。产区目前有超过50家酒庄，年产量约1.2亿瓶，占据中国精品葡萄酒的半壁江山。</p>' +
  '<div class="ri"><h4>🏅 贺兰山·必喝推荐</h4><p style="color:#333;line-height:1.8;margin:0">银色高地·家族珍藏——中国首款进入帕克评分体系的红酒<br/>贺兰晴雪·加贝兰——Decanter亚洲金奖，国产酒的里程碑<br/>迦南美地·小马驹——被誉为"国产波尔多右岸风格"<br/>留世·赤霞珠——老藤赤霞珠，贺兰山的标志性风土表现</p></div>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">贺兰山的关键词：赤霞珠、蛇龙珠（Carménère的亲戚）、霞多丽。风格偏向浓郁饱满，黑醋栗、薄荷、甘草的香气典型。</p>' +
  '<h3>🏜️ 新疆天山北麓：中国最大的葡萄酒产区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">新疆产区占中国葡萄种植面积的近四分之一，是中国最大的葡萄酒产区。天山北麓——沿着天山山脉的北坡延伸，包括昌吉、石河子、伊犁河谷等多个子产区。年降雨量仅200mm左右，必须依靠天山雪水灌溉。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">极端的大陆性气候——夏季酷热、冬季严寒（-30°C以下），葡萄藤需要埋土越冬。这种严苛条件反而造就了集中度极高的果实。</p>' +
  '<div class="ri"><h4>🏅 新疆·产区特点</h4><p style="color:#333;line-height:1.8;margin:0">面积最大——占全国近1/4产量，以大型酒庄为主<br/>赤霞珠为主力——浓郁的黑果香气，单宁结构强劲<br/>伊犁河谷——冷凉小气候，雷司令和霞多丽表现出色<br/>部分产区面临挑战——冬季埋土成本高，机械化程度低</p></div>' +
  '<h3>🏔️ 云南香格里拉：海拔最高的葡萄酒</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">香格里拉产区是中国最具话题性的葡萄酒产区。葡萄园分布在海拔1800-2800米的横断山脉河谷中——这可能是世界上海拔最高的酿酒葡萄种植区。LVMH旗下的敖云（Ao Yun）酒庄就在这里，国际均价超过2000元。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">云南产区的独特之处在于高原冷凉气候和漫射光条件——强烈的紫外线配合厚实的云层，让葡萄既获得充足光照，又不会暴晒过度。加之昼夜温差极大，葡萄的酸度和风味物质都达到了惊人的平衡。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>维度</th><th>云南香格里拉</th><th>对比参照</th></tr><tr><td>海拔</td><td>1800-2800米</td><td>波尔多约50米</td></tr><tr><td>年降雨量</td><td>600-800mm</td><td>集中夏季，需排水</td></tr><tr><td>土壤</td><td>石灰岩+砾石</td><td>类似阿尔萨斯</td></tr><tr><td>主要品种</td><td>赤霞珠·品丽珠·西拉</td><td>风格更冷凉优雅</td></tr><tr><td>产量极低</td><td>约4000-6000kg/公顷</td><td>仅为宁夏的1/3</td></tr></table></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">云南葡萄酒的风格特点是：优雅、冷凉、高酸、单宁细腻。和贺兰山那种浓郁厚重的风格完全不同。如果你喜欢勃艮第式的优雅，云南产区值得关注。</p>' +
  '<h3>🌊 山东烟台：中国葡萄酒的摇篮</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">烟台是中国现代葡萄酒产业的起点。1892年张裕在这里创办了中国第一家葡萄酒厂。产区位于北纬37°，胶东半岛，受海洋性气候影响显著。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">烟台的问题在于夏季降雨量较大（年降雨量约800mm），容易导致葡萄病害。近年来通过改良栽培方式和引进抗病品种，品质有了显著提升。蛇龙珠（Cabernet Gernischt）是烟台/山东的特色品种——DNA鉴定显示它就是Carménère。</p>' +
  '<div class="ri"><h4>🏅 烟台·推荐酒款</h4><p style="color:#333;line-height:1.8;margin:0">张裕·解百纳——中国最畅销的葡萄酒品牌，年销3000万瓶<br/>长城·海岸——海洋风格霞多丽，清爽矿物感<br/>君顶酒庄·雷司令——山东雷司令的代表性酒款</p></div>' +
  '<h3>⛰️ 河北怀来及其他潜力产区</h3>' +
  '<h3 style="border-bottom:none;">怀来产区</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">怀来（包括沙城和官厅湖区域）距离北京仅100公里，是中国最早引进欧洲酿酒葡萄品种的产区之一。长城桑干酒庄是国家级的接待用酒。怀来的马瑟兰（Marselan）品种表现极为出色——马瑟兰是赤霞珠和歌海娜的杂交品种，在这里展现出了极其复杂的芳香层次。</p>' +
  '<h3 style="border-bottom:none;">甘肃河西走廊</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">甘肃产区以黑比诺闻名——在冷凉干燥的河西走廊，黑比诺表现出了令人意外的优雅和复杂度。莫高酒庄的黑比诺是这里的标杆。</p>' +
  '<h3 style="border-bottom:none;">山西太谷</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">山西太谷的怡园酒庄是精品酒庄的先驱。1997年由香港企业家创办，以波尔多混酿著称。"庄主珍藏"系列是国产酒的经典之作。</p>' +
  '<h3>📊 产区对比速览</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>对比维度</th><th>宁夏贺兰山</th><th>新疆</th><th>云南</th><th>山东</th><th>河北</th></tr><tr><td>风格定位</td><td>浓郁饱满</td><td>强劲厚重</td><td>优雅冷凉</td><td>中等到饱满</td><td>中等到优雅</td></tr><tr><td>核心品种</td><td>赤霞珠/蛇龙珠</td><td>赤霞珠</td><td>品丽珠/西拉</td><td>蛇龙珠/雷司令</td><td>马瑟兰/赤霞珠</td></tr><tr><td>国际关注度</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐</td><td>⭐⭐⭐⭐</td></tr><tr><td>入门价位</td><td>¥80-150</td><td>¥60-120</td><td>¥150-300</td><td>¥60-100</td><td>¥80-200</td></tr><tr><td>收藏价值</td><td>高</td><td>中</td><td>极高</td><td>中</td><td>中高</td></tr></table></section>' +
  '<h3>🍷 选购指南：入门不踩雷</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">第一次尝试国产葡萄酒，建议这样选：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">入门体验宁夏（¥80-150）——贺兰山是国产酒最稳的选择，随便选口碑酒庄不踩雷</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">想尝鲜云南（¥150-300）——适合已经喝了一些进口酒、想体验不同风格的人</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">好奇蛇龙珠（¥60-120）——山东烟台的蛇龙珠，Carménère的"中国分身"，很有趣的话题酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">送人买敖云或银色高地——既有国际名声，又有中国故事，送礼有深度</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">日常口粮选张裕或长城——大品牌品控稳定，性价比不错</li></ul></section>' +
  '<h3>🌏 中国葡萄酒的未来</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">中国葡萄酒正处于"黄金转折点"。过去十年间：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">Decanter亚洲大奖中，中国酒庄获奖数量增长了近10倍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">LVMH、拉菲罗斯柴尔德集团纷纷在中国投建酒庄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">中国葡萄酒出口量每年增长超过20%</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">国产酒在国际盲品中屡次击败法国名庄</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">新一代酿酒师（很多在波尔多/勃艮第受过训练）正在改变"中国葡萄酒"的刻板印象</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 小贴士</h4><p style="color:#333;line-height:1.8;margin:0">💡 下一个值得关注的趋势：宁夏马瑟兰、云南高海拔西拉、山东精品雷司令——这三个方向可能是未来三年中国葡萄酒的热门赛道。</p></div></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">下次朋友说"国产酒不行"的时候，开一瓶银色高地或敖云，让酒说话就够了。</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#DC143C,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 中国葡萄酒的时代正在到来 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🗺️ 中国葡萄酒产区地理指南：从贺兰山到香格里拉',
      author: '红酒顾问',
      digest: '宁夏、新疆、云南、山东、河北——中国五大葡萄酒产区全解析，一张图看懂国产酒的格局与未来。',
      content: gen(),
      coverImage: 'china_wine_map_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["中国葡萄酒", "产区", "宁夏贺兰山", "新疆", "云南香格里拉", "山东", "河北怀来", "国产酒"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'china_wine_map_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ china_wine_map, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ china_wine_map:', e.message);
    process.exit(1);
  }
}

main();
