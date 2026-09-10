import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260610'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#8b0000',
        ['🗺️ 中国葡萄酒产区地理指南', '从贺兰山到香格里拉'],
        '一张图看懂国产酒的格局与未来',
        '宁夏 · 新疆 · 云南 · 山东 · 河北 · 甘肃 · 怀来 · 山西')

    html = rich_article(content_blocks, primary='#8b0000', secondary='#DC143C')
    html_lines = html.split('\n')
    hlines = []
    for line in html_lines:
        escaped = js_str(line)
        if escaped:
            hlines.append(f"  '{escaped}' +")
    if hlines:
        hlines[-1] = hlines[-1].rstrip('+').rstrip()
    html_js = '\n'.join(hlines)

    gen_func = f'''function gen(){{
  return {html_js};
}}'''

    js = f'''const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = {CONFIG_CODE};

const date={{full:'{DATE}'}};

function gCov(){{
  const svg="{js_str(svg_b64)}";
  return svg;
}}

{gen_func}

async function main(){{
  try{{
    const cb = await gCov();
    const art = {{
      title: '{js_str(title)}',
      author: '红酒顾问',
      digest: '{js_str(digest)}',
      content: gen(),
      coverImage: '{name}_cover_ai.png',
      category: '{category}',
      tags: {json.dumps(tags, ensure_ascii=False)},
      publishDate: date.full
    }};
    fs.writeFileSync(
      path.join(__dirname, 'output', '{name}_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const f = new FormData();
    f.append('media', png, {{filename: 'cover.png', contentType: 'image/png'}});
    const m = await axios.post('https://api.weixin.qq.com/cgi-bin/material/add_material?access_token='+a+'&type=image', f, {{headers: f.getHeaders()}});
    const d = await axios.post('https://api.weixin.qq.com/cgi-bin/draft/add?access_token='+a, {{
      articles: [{{
        title: art.title,
        thumb_media_id: m.data.media_id,
        author: art.author,
        digest: art.digest,
        content: art.content,
        show_cover_pic: 1,
        need_open_comment: 0,
        only_fans_can_comment: 0
      }}]
    }});
    console.log('✅ {name}, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('❌ {name}:', e.message);
    process.exit(1);
  }}
}}

main();
'''
    os.makedirs('output', exist_ok=True)
    with open(f'generate-{name}.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'  Created generate-{name}.js')

if __name__ == '__main__':
    build_article('china_wine_map',
        title='🗺️ 中国葡萄酒产区地理指南：从贺兰山到香格里拉',
        digest='宁夏、新疆、云南、山东、河北——中国五大葡萄酒产区全解析，一张图看懂国产酒的格局与未来。',
        category='wine-knowledge',
        tags=['中国葡萄酒','产区','宁夏贺兰山','新疆','云南香格里拉','山东','河北怀来','国产酒'],
        content_blocks=[
            {'type':'title','text':'🗺️ 中国葡萄酒产区地理指南'},

            {'type':'subtitle','text':'从贺兰山到香格里拉 | 一张图看懂国产酒的格局与未来'},

            {'type':'lead','text':'十年前的送礼清单里，国产葡萄酒还上不了台面。今天，贺兰山东麓的酒款已经在Decanter大赛上拿奖拿到手软，云南香格里拉的藏语酒标成为米其林餐厅的宠儿，新疆的天山北麓产区正在被LVMH看中。'},
            {'type':'p','text':'中国已经是世界第二大葡萄种植国（仅次于西班牙），但国产葡萄酒的产量只占全球的不到3%——这意味着巨大的品质提升空间。这篇文章带你走遍中国的核心葡萄酒产区，每一片土地都在酝酿令人惊喜的风味。'},

            {'type':'h2','text':'🇨🇳 中国葡萄酒产区总览'},

            {'type':'table','headers':['产区','位置','气候','代表品种','标志酒庄'],
            'rows':[
                ['宁夏贺兰山','宁夏北部','大陆性·干旱','赤霞珠·蛇龙珠·霞多丽','贺兰晴雪·银色高地·迦南美地'],
                ['新疆天山北麓','天山北麓','大陆性·干燥','赤霞珠·梅洛·雷司令','中信国安·乡都·天塞'],
                ['云南香格里拉','横断山脉','高原·冷凉','赤霞珠·品丽珠·西拉','敖云·香格里拉酒业'],
                ['山东烟台','胶东半岛','海洋性·温润','蛇龙珠·霞多丽·雷司令','张裕·长城·君顶'],
                ['河北怀来','张家口怀来','大陆性·半干旱','赤霞珠·马瑟兰·霞多丽','长城桑干·中法庄园'],
                ['甘肃河西走廊','甘肃西部','大陆性·干燥','黑比诺·赤霞珠','莫高·国风'],
                ['山西太谷','山西中部','大陆性','赤霞珠·梅洛','怡园酒庄'],
            ]},

            {'type':'h2','text':'🏔️ 宁夏贺兰山东麓：中国的波尔多'},

            {'type':'p','text':'贺兰山是中国最成功的葡萄酒产区，没有之一。北纬37°-39°，与波尔多同纬度。海拔1100-1200米的高原，昼夜温差大，葡萄成熟期长，风味物质积累充分。冬季寒冷干燥，天然抑制病虫害——这里几乎不需要使用农药。'},
            {'type':'p','text':'贺兰山东麓的土壤以砾石和沙质土壤为主，通透性好，类似波尔多的格拉夫产区。产区目前有超过50家酒庄，年产量约1.2亿瓶，占据中国精品葡萄酒的半壁江山。'},
            {'type':'box','heading':'🏅 贺兰山·必喝推荐','text':'银色高地·家族珍藏——中国首款进入帕克评分体系的红酒\n贺兰晴雪·加贝兰——Decanter亚洲金奖，国产酒的里程碑\n迦南美地·小马驹——被誉为"国产波尔多右岸风格"\n留世·赤霞珠——老藤赤霞珠，贺兰山的标志性风土表现'},
            {'type':'p','text':'贺兰山的关键词：赤霞珠、蛇龙珠（Carménère的亲戚）、霞多丽。风格偏向浓郁饱满，黑醋栗、薄荷、甘草的香气典型。'},

            {'type':'h2','text':'🏜️ 新疆天山北麓：中国最大的葡萄酒产区'},

            {'type':'p','text':'新疆产区占中国葡萄种植面积的近四分之一，是中国最大的葡萄酒产区。天山北麓——沿着天山山脉的北坡延伸，包括昌吉、石河子、伊犁河谷等多个子产区。年降雨量仅200mm左右，必须依靠天山雪水灌溉。'},
            {'type':'p','text':'极端的大陆性气候——夏季酷热、冬季严寒（-30°C以下），葡萄藤需要埋土越冬。这种严苛条件反而造就了集中度极高的果实。'},
            {'type':'box','heading':'🏅 新疆·产区特点','text':'面积最大——占全国近1/4产量，以大型酒庄为主\n赤霞珠为主力——浓郁的黑果香气，单宁结构强劲\n伊犁河谷——冷凉小气候，雷司令和霞多丽表现出色\n部分产区面临挑战——冬季埋土成本高，机械化程度低'},

            {'type':'h2','text':'🏔️ 云南香格里拉：海拔最高的葡萄酒'},

            {'type':'p','text':'香格里拉产区是中国最具话题性的葡萄酒产区。葡萄园分布在海拔1800-2800米的横断山脉河谷中——这可能是世界上海拔最高的酿酒葡萄种植区。LVMH旗下的敖云（Ao Yun）酒庄就在这里，国际均价超过2000元。'},
            {'type':'p','text':'云南产区的独特之处在于高原冷凉气候和漫射光条件——强烈的紫外线配合厚实的云层，让葡萄既获得充足光照，又不会暴晒过度。加之昼夜温差极大，葡萄的酸度和风味物质都达到了惊人的平衡。'},
            {'type':'table','headers':['维度','云南香格里拉','对比参照'],
            'rows':[
                ['海拔','1800-2800米','波尔多约50米'],
                ['年降雨量','600-800mm','集中夏季，需排水'],
                ['土壤','石灰岩+砾石','类似阿尔萨斯'],
                ['主要品种','赤霞珠·品丽珠·西拉','风格更冷凉优雅'],
                ['产量极低','约4000-6000kg/公顷','仅为宁夏的1/3'],
            ]},
            {'type':'p','text':'云南葡萄酒的风格特点是：优雅、冷凉、高酸、单宁细腻。和贺兰山那种浓郁厚重的风格完全不同。如果你喜欢勃艮第式的优雅，云南产区值得关注。'},

            {'type':'h2','text':'🌊 山东烟台：中国葡萄酒的摇篮'},

            {'type':'p','text':'烟台是中国现代葡萄酒产业的起点。1892年张裕在这里创办了中国第一家葡萄酒厂。产区位于北纬37°，胶东半岛，受海洋性气候影响显著。'},
            {'type':'p','text':'烟台的问题在于夏季降雨量较大（年降雨量约800mm），容易导致葡萄病害。近年来通过改良栽培方式和引进抗病品种，品质有了显著提升。蛇龙珠（Cabernet Gernischt）是烟台/山东的特色品种——DNA鉴定显示它就是Carménère。'},
            {'type':'box','heading':'🏅 烟台·推荐酒款','text':'张裕·解百纳——中国最畅销的葡萄酒品牌，年销3000万瓶\n长城·海岸——海洋风格霞多丽，清爽矿物感\n君顶酒庄·雷司令——山东雷司令的代表性酒款'},

            {'type':'h2','text':'⛰️ 河北怀来及其他潜力产区'},

            {'type':'h3','text':'怀来产区'},
            {'type':'p','text':'怀来（包括沙城和官厅湖区域）距离北京仅100公里，是中国最早引进欧洲酿酒葡萄品种的产区之一。长城桑干酒庄是国家级的接待用酒。怀来的马瑟兰（Marselan）品种表现极为出色——马瑟兰是赤霞珠和歌海娜的杂交品种，在这里展现出了极其复杂的芳香层次。'},

            {'type':'h3','text':'甘肃河西走廊'},
            {'type':'p','text':'甘肃产区以黑比诺闻名——在冷凉干燥的河西走廊，黑比诺表现出了令人意外的优雅和复杂度。莫高酒庄的黑比诺是这里的标杆。'},

            {'type':'h3','text':'山西太谷'},
            {'type':'p','text':'山西太谷的怡园酒庄是精品酒庄的先驱。1997年由香港企业家创办，以波尔多混酿著称。"庄主珍藏"系列是国产酒的经典之作。'},

            {'type':'h2','text':'📊 产区对比速览'},

            {'type':'table','headers':['对比维度','宁夏贺兰山','新疆','云南','山东','河北'],
            'rows':[
                ['风格定位','浓郁饱满','强劲厚重','优雅冷凉','中等到饱满','中等到优雅'],
                ['核心品种','赤霞珠/蛇龙珠','赤霞珠','品丽珠/西拉','蛇龙珠/雷司令','马瑟兰/赤霞珠'],
                ['国际关注度','⭐⭐⭐⭐⭐','⭐⭐⭐','⭐⭐⭐⭐⭐','⭐⭐⭐','⭐⭐⭐⭐'],
                ['入门价位','¥80-150','¥60-120','¥150-300','¥60-100','¥80-200'],
                ['收藏价值','高','中','极高','中','中高'],
            ]},

            {'type':'h2','text':'🍷 选购指南：入门不踩雷'},

            {'type':'p','text':'第一次尝试国产葡萄酒，建议这样选：'},
            {'type':'list','items':[
                '入门体验宁夏（¥80-150）——贺兰山是国产酒最稳的选择，随便选口碑酒庄不踩雷',
                '想尝鲜云南（¥150-300）——适合已经喝了一些进口酒、想体验不同风格的人',
                '好奇蛇龙珠（¥60-120）——山东烟台的蛇龙珠，Carménère的"中国分身"，很有趣的话题酒',
                '送人买敖云或银色高地——既有国际名声，又有中国故事，送礼有深度',
                '日常口粮选张裕或长城——大品牌品控稳定，性价比不错',
            ]},

            {'type':'h2','text':'🌏 中国葡萄酒的未来'},

            {'type':'p','text':'中国葡萄酒正处于"黄金转折点"。过去十年间：'},
            {'type':'list','items':[
                'Decanter亚洲大奖中，中国酒庄获奖数量增长了近10倍',
                'LVMH、拉菲罗斯柴尔德集团纷纷在中国投建酒庄',
                '中国葡萄酒出口量每年增长超过20%',
                '国产酒在国际盲品中屡次击败法国名庄',
                '新一代酿酒师（很多在波尔多/勃艮第受过训练）正在改变"中国葡萄酒"的刻板印象',
            ]},

            {'type':'tip','text':'💡 下一个值得关注的趋势：宁夏马瑟兰、云南高海拔西拉、山东精品雷司令——这三个方向可能是未来三年中国葡萄酒的热门赛道。'},
            {'type':'p','text':'下次朋友说"国产酒不行"的时候，开一瓶银色高地或敖云，让酒说话就够了。'},

            {'type':'sep','text':''},
            {'type':'end','text':'— 中国葡萄酒的时代正在到来 —'},
        ]
    )
    print('\nChina Wine Map created!')
