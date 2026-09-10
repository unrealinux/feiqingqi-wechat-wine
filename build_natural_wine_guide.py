#!/usr/bin/env python3
"""Build natural wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#33691e',
        ['自然酒入门指南', '最不正常的葡萄酒'],
        '低干预、无添加、有灵魂的酒',
        '红樽坊 | 新趋势')

    html = rich_article(content_blocks, primary='#33691e', secondary='#7cb342')
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
      author: '红樽坊',
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
    console.log('Natural Wine, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Natural Wine:', e.message);
    process.exit(1);
  }}
}}

main();
'''
    os.makedirs('output', exist_ok=True)
    with open(f'generate-{name}.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'Created generate-{name}.js')

if __name__ == '__main__':
    build_article('natural_wine_guide',
        title='自然酒入门指南：最"不正常"的葡萄酒',
        digest='浑浊、有沉淀、闻起来像醋？这不是坏酒，而是自然酒。低干预、无添加、有灵魂——自然酒到底是什么？',
        category='wine-trend',
        tags=['自然酒','有机酒','低干预','新趋势','入门'],
        content_blocks=[
            {"type": "title", "text": "自然酒入门指南"},
            {"type": "subtitle", "text": "最不正常的葡萄酒 | 低干预 · 无添加 · 有灵魂"},
            {"type": "lead", "text": "如果你第一次喝自然酒，可能会觉得：这酒是不是坏了？浑浊、有沉淀、闻起来像醋……但这就是自然酒的魅力——它是最不正常的葡萄酒，也是最有灵魂的酒。"},

            {"type": "h2", "text": "🌿 什么是自然酒？"},
            {"type": "p", "text": "自然酒（Natural Wine）是一种酿造理念，强调最小化人工干预，让葡萄酒回归最自然的状态。"},
            {"type": "ri", "heading":"自然酒的核心原则", "text":"<strong>1. 有机或生物动力法种植</strong>——不使用化学农药和化肥\n<strong>2. 手工采摘</strong>——只选择最健康的葡萄\n<strong>3. 最小化干预</strong>——不添加或去除任何东西\n<strong>4. 天然酵母发酵</strong>——使用葡萄皮上的天然酵母，而非人工酵母\n<strong>5. 低硫或无硫</strong>——不添加或极少添加二氧化硫\n<strong>6. 不过滤不过滤</strong>——保持酒的原始状态"},

            {"type": "h2", "text": "🤔 自然酒 vs 传统酒"},
            {"type": "p", "text": "自然酒和传统葡萄酒有什么区别？"},
            {"type": "table", "headers": ["方面", "传统葡萄酒", "自然酒"],
             "rows": [
                 ["种植", "可能使用化学农药", "有机或生物动力法"],
                 ["发酵", "人工酵母", "天然酵母"],
                 ["添加", "可能添加色素、单宁等", "不添加任何东西"],
                 ["硫化物", "添加二氧化硫防腐", "低硫或无硫"],
                 ["过滤", "通常过滤澄清", "不过滤或轻度过滤"],
                 ["口感", "稳定、一致", "变化多端、有个性"]
             ]},

            {"type": "h2", "text": "🍷 自然酒的味道"},
            {"type": "p", "text": "自然酒的味道，与传统葡萄酒截然不同。这里有几个特点："},
            {"type": "list", "items": [
                "<strong>更酸</strong>——因为没有添加酸度调节剂",
                "<strong>更'活泼'</strong>——可能有轻微气泡，因为仍在发酵",
                "<strong>更'野'</strong>——有独特的'农场'气味（barnyard）",
                "<strong>更浑浊</strong>——因为不过滤",
                "<strong>更'有趣'</strong>——每一瓶都不一样，充满惊喜"
            ]},

            {"type": "h2", "text": "🔍 如何识别自然酒？"},
            {"type": "p", "text": "自然酒没有官方认证，但可以通过以下几个标志来识别："},
            {"type": "list", "items": [
                "<strong>酒标关键词</strong>——Natural, Vin Nature, Raw Wine, 参与VinNatur等组织",
                "<strong>没有'Mis en bouteille'</strong>——自然酒通常不强调装瓶信息",
                "<strong>酒液浑浊</strong>——自然酒通常不过滤，酒液可能浑浊",
                "<strong>瓶底沉淀</strong>——这是正常的，摇匀即可饮用",
                "<strong>酒庄信息</strong>——通常很小众，不容易在超市找到"
            ]},

            {"type": "h2", "text": "🌍 世界各地的自然酒"},
            {"type": "p", "text": "自然酒起源于法国，如今已遍布全球："},
            {"type": "item", "text": "法国（自然酒发源地）", "info": "勃艮第、博若莱、阿尔萨斯是自然酒的重镇。代表酒庄：Marcel Lapierre、Jean Foillard、Pierre Overnoy。", "price": "¥150-500", "tag": "经典产区"},
            {"type": "item", "text": "意大利", "info": "皮埃蒙特、威尼托是自然酒的新兴产区。代表酒庄：Elvio Cogno、Cos、Frank Cornelissen。", "price": "¥120-400", "tag": "性价比高"},
            {"type": "item", "text": "西班牙", "info": "里奥哈、加泰罗尼亚有很多自然酒酒庄。代表酒庄：Envínate、Vinya Giralt、Partida Creus。", "price": "¥100-300", "tag": "小众宝藏"},
            {"type": "item", "text": "美国", "info": "加利福尼亚、俄勒冈是美国自然酒的中心。代表酒庄：Coturri、Arnot-Roberts、Birichino。", "price": "¥150-500", "tag": "创新风格"},
            {"type": "item", "text": "日本", "info": "日本是亚洲自然酒的先锋。代表酒庄：Château Mercian、Grace Wine、十勝。", "price": "¥200-600", "tag": "东方风格"},

            {"type": "h2", "text": "💡 如何品尝自然酒？"},
            {"type": "p", "text": "品尝自然酒，需要调整心态："},
            {"type": "list", "items": [
                "<strong>不要用传统标准评判</strong>——自然酒有自己的美学",
                "<strong>接受'不完美'</strong>——浑浊、沉淀、酸度高，都是正常的",
                "<strong>多尝试</strong>——每一瓶自然酒都是独一无二的",
                "<strong>与酿酒师交流</strong>——了解酒背后的故事",
                "<strong>保持开放心态</strong>——你可能会爱上这种'不正常'"
            ]},

            {"type": "h2", "text": "🛒 哪里买自然酒？"},
            {"type": "p", "text": "自然酒通常不在超市销售，可以通过以下渠道购买："},
            {"type": "list", "items": [
                "<strong>自然酒吧</strong>——一线城市有很多自然酒吧，可以先品尝再购买",
                "<strong>精品葡萄酒店</strong>——专门卖小众酒款的店铺",
                "<strong>线上平台</strong>——淘宝、京东搜索'自然酒'或'Vin Nature'",
                "<strong>进口商网站</strong>——一些进口商有直销渠道",
                "<strong>酒庄直购</strong>——如果你有机会去产区，直接去酒庄购买"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'自然酒不是一种风格，而是一种态度——对自然的尊重，对个性的追求，对完美的反叛。'"},
            {"type": "p", "text": "自然酒可能不是每个人都喜欢，但它代表了一种新的饮酒哲学：不追求完美，而追求真实；不追求一致，而追求个性。如果你厌倦了千篇一律的工业酒，不妨试试自然酒，也许你会发现一个全新的世界。"},

            {"type": "end", "text": "你尝试过自然酒吗？<br/>你觉得自然酒怎么样？<br/>欢迎在评论区分享你的体验！"}
        ])
