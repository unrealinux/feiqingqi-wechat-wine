#!/usr/bin/env python3
"""Build wine chemistry article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#00695c',
        ['葡萄酒的化学', '你喝的到底是什么？'],
        '从分子角度懂酒',
        '红樽坊 | 知识科普')

    html = rich_article(content_blocks, primary='#00695c', secondary='#26a69a')
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
    console.log('Chemistry, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Chemistry:', e.message);
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
    build_article('wine_chemistry',
        title='葡萄酒的化学：你喝的到底是什么？',
        digest='从分子角度懂酒。单宁、酸度、酒精、风味物质，这些化学成分决定了葡萄酒的口感。',
        category='education',
        tags=['化学','科学','分子','成分','知识'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒的化学：你喝的到底是什么？"},
            {"type": "subtitle", "text": "从分子角度懂酒"},
            {"type": "lead", "text": "从分子角度懂酒。单宁、酸度、酒精、风味物质，这些化学成分决定了葡萄酒的口感。了解这些，你就能更懂酒。"},

            {"type": "h2", "text": "🔬 葡萄酒的成分"},
            {"type": "p", "text": "葡萄酒主要由这些成分构成："},
            {"type": "table", "headers": ["成分", "占比", "作用"],
             "rows": [
                 ["水", "85-90%", "基础成分"],
                 ["酒精", "10-15%", "提供酒体和灼热感"],
                 ["糖分", "0-10%", "提供甜味"],
                 ["酸", "0.5-1%", "提供清爽感"],
                 ["单宁", "0-0.5%", "提供涩感和结构"],
                 ["风味物质", "微量", "提供香气和风味"]
             ]},

            {"type": "h2", "text": "🧪 单宁：红酒的灵魂"},
            {"type": "p", "text": "单宁是红酒的灵魂："},
            {"type": "ri", "heading":"什么是单宁", "text":"<strong>来源：</strong>葡萄皮、葡萄籽、橡木桶\n<strong>作用：</strong>提供涩感和结构\n<strong>感觉：</strong>让你的口腔感到干涩\n\n<strong>比喻：</strong>单宁就像红酒的骨架，支撑起整款酒"},
            {"type": "ri", "heading":"单宁的作用", "text":"<strong>抗氧化：</strong>单宁有抗氧化作用，可以帮助酒陈年\n<strong>结构：</strong>单宁提供酒的结构和平衡\n<strong>口感：</strong>单宁让酒更有层次感\n\n<strong>注意：</strong>单宁太多会太涩，太少会太薄"},

            {"type": "h2", "text": "🍋 酸度：清爽的来源"},
            {"type": "p", "text": "酸度是清爽的来源："},
            {"type": "list", "items": [
                "<strong>酒石酸</strong>——葡萄中的主要酸",
                "<strong>苹果酸</strong>——提供清爽感",
                "<strong>乳酸</strong>——发酵产生的酸，更柔和",
                "<strong>柠檬酸</strong>——提供柑橘类香气"
            ]},

            {"type": "h2", "text": "🍷 酒精：力量的来源"},
            {"type": "p", "text": "酒精是力量的来源："},
            {"type": "list", "items": [
                "<strong>来源</strong>——葡萄中的糖分发酵产生",
                "<strong>作用</strong>——提供酒体和灼热感",
                "<strong>范围</strong>——通常在10-15%之间",
                "<strong>影响</strong>——酒精度越高，酒体越饱满"
            ]},

            {"type": "h2", "text": "🌸 风味物质：香气的来源"},
            {"type": "p", "text": "风味物质是香气的来源："},
            {"type": "ri", "heading":"一类香气（来自葡萄）", "text":"<strong>水果香：</strong>樱桃、草莓、黑莓、柑橘\n<strong>花香：</strong>玫瑰、紫罗兰、茉莉\n<strong>草本香：</strong>薄荷、青椒、百里香"},
            {"type": "ri", "heading":"二类香气（来自发酵）", "text":"<strong>酵母香：</strong>面包、饼干、黄油\n<strong>发酵香：</strong>香蕉、梨、菠萝\n<strong>乳酸香：</strong>奶油、酸奶"},
            {"type": "ri", "heading":"三类香气（来自陈年）", "text":"<strong>橡木香：</strong>香草、烟草、巧克力\n<strong>陈年香：</strong>皮革、蘑菇、松露\n<strong>氧化香：</strong>焦糖、坚果、太妃糖"},

            {"type": "h2", "text": "📊 化学成分与口感的关系"},
            {"type": "table", "headers": ["化学成分", "口感", "例子"],
             "rows": [
                 ["高单宁", "涩感强", "赤霞珠、内比奥罗"],
                 ["低单宁", "柔顺", "黑皮诺、佳美"],
                 ["高酸度", "清爽", "长相思、雷司令"],
                 ["低酸度", "圆润", "霞多丽、维欧尼"],
                 ["高酒精", "饱满", "西拉、仙粉黛"],
                 ["低酒精", "轻盈", "莫斯卡托、雷司令"]
             ]},

            {"type": "h2", "text": "💡 了解化学的好处"},
            {"type": "p", "text": "了解葡萄酒化学有什么好处？"},
            {"type": "list", "items": [
                "<strong>更懂酒</strong>——了解酒的构成，更懂酒",
                "<strong>更会选</strong>——根据化学成分选酒，更精准",
                "<strong>更会品</strong>——了解化学成分，更能品味细节",
                "<strong>更会配</strong>——根据化学成分配餐，更和谐",
                "<strong>更会存</strong>——了解化学变化，更会储存"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'了解化学，才能真正懂酒。'"},
            {"type": "p", "text": "葡萄酒的化学是葡萄酒知识的基础。了解单宁、酸度、酒精、风味物质，你就能更懂酒，更会喝酒。"},

            {"type": "end", "text": "你知道葡萄酒的化学成分吗？<br/>你最在意酒的哪个化学成分？<br/>欢迎在评论区分享你的看法！"}
        ])
