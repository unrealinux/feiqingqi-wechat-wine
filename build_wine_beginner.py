#!/usr/bin/env python3
"""Build wine beginner guide article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1565c0',
        ['葡萄酒入门指南', '从零开始'],
        '成为懂酒的人',
        '红樽坊 | 新手指南')

    html = rich_article(content_blocks, primary='#1565c0', secondary='#42a5f5')
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
    console.log('Beginner, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Beginner:', e.message);
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
    build_article('wine_beginner',
        title='葡萄酒入门指南：从零开始的完美指南',
        digest='完全不懂葡萄酒？没关系！这篇指南帮你从零开始，快速成为懂酒的人。',
        category='education',
        tags=['入门','新手','基础','学习','指南'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒入门指南：从零开始的完美指南"},
            {"type": "subtitle", "text": "成为懂酒的人"},
            {"type": "lead", "text": "完全不懂葡萄酒？没关系！这篇指南帮你从零开始，快速成为懂酒的人。不需要死记硬背，轻松入门。"},

            {"type": "h2", "text": "🍷 第一步：认识葡萄酒"},
            {"type": "p", "text": "葡萄酒是什么？"},
            {"type": "list", "items": [
                "<strong>定义</strong>——葡萄酒是用葡萄发酵酿造的酒精饮品",
                "<strong>酒精度</strong>——通常在10-15%之间",
                "<strong>颜色</strong>——红葡萄酒、白葡萄酒、桃红葡萄酒",
                "<strong>甜度</strong>——干型、半干型、半甜型、甜型"
            ]},

            {"type": "h2", "text": "🍇 第二步：认识葡萄品种"},
            {"type": "p", "text": "常见的葡萄品种："},
            {"type": "ri", "heading":"红葡萄品种", "text":"<strong>赤霞珠：</strong>浓郁、强劲，适合搭配牛排\n<strong>黑皮诺：</strong>优雅、柔和，适合搭配鸡肉\n<strong>梅洛：</strong>圆润、易饮，适合入门者\n<strong>西拉：</strong>辛辣、浓郁，适合搭配烧烤"},
            {"type": "ri", "heading":"白葡萄品种", "text":"<strong>霞多丽：</strong>圆润、复杂，适合搭配海鲜\n<strong>长相思：</strong>清爽、酸度高，适合搭配沙拉\n<strong>雷司令：</strong>芳香、多变，适合搭配甜点\n<strong>灰皮诺：</strong>清爽、易饮，适合入门者"},

            {"type": "h2", "text": "🌍 第三步：认识产区"},
            {"type": "p", "text": "世界主要葡萄酒产区："},
            {"type": "table", "headers": ["产区", "特点", "代表酒款"],
             "rows": [
                 ["法国", "传统、优雅", "波尔多、勃艮第"],
                 ["意大利", "多样、美食搭配", "基安蒂、巴罗洛"],
                 ["西班牙", "热情、性价比高", "里奥哈、丹魄"],
                 ["美国", "创新、果味浓", "纳帕谷赤霞珠"],
                 ["澳大利亚", "易饮、性价比高", "巴罗萨西拉"],
                 ["智利", "性价比极高", "中央山谷赤霞珠"]
             ]},

            {"type": "h2", "text": "👃 第四步：学会品酒"},
            {"type": "p", "text": "品酒四步法："},
            {"type": "list", "items": [
                "<strong>看</strong>——观察酒的颜色和清澈度",
                "<strong>闻</strong>——闻酒的香气，分辨不同的气味",
                "<strong>品</strong>——小口品尝，感受酒的口感和余味",
                "<strong>评</strong>——综合评价酒的品质"
            ]},

            {"type": "h2", "text": "🍽️ 第五步：学会配餐"},
            {"type": "p", "text": "葡萄酒配餐的基本原则："},
            {"type": "list", "items": [
                "<strong>红酒配红肉</strong>——赤霞珠配牛排",
                "<strong>白酒配白肉</strong>——霞多丽配鱼",
                "<strong>起泡酒配海鲜</strong>——香槟配生蚝",
                "<strong>甜酒配甜点</strong>——莫斯卡提配蛋糕"
            ]},

            {"type": "h2", "text": "🛒 第六步：买酒指南"},
            {"type": "p", "text": "新手买酒的建议："},
            {"type": "list", "items": [
                "<strong>从便宜的开始</strong>——50-100元的酒就够了",
                "<strong>选择知名产区</strong>——波尔多、纳帕谷等",
                "<strong>问店员推荐</strong>——告诉店员你的口味偏好",
                "<strong>买小瓶装</strong>——先试试，好喝再买大瓶"
            ]},

            {"type": "h2", "text": "📊 新手入门速查表"},
            {"type": "table", "headers": ["问题", "答案"],
             "rows": [
                 ["葡萄酒是什么", "用葡萄发酵的酒精饮品"],
                 ["红葡萄酒和白葡萄酒的区别", "红葡萄酒带皮发酵，白葡萄酒去皮发酵"],
                 ["什么是干型葡萄酒", "残糖量低于4g/L的葡萄酒"],
                 ["什么是单宁", "葡萄皮中的涩感物质"],
                 ["什么是年份", "葡萄采摘的年份"]
             ]},

            {"type": "sep"},
            {"type": "quote", "text": "'喝酒是最好的学习方式。'"},
            {"type": "p", "text": "葡萄酒入门不需要死记硬背，多喝多比较，你就能成为懂酒的人。"},

            {"type": "end", "text": "你对葡萄酒有什么疑问？<br/>你入门时遇到过什么困惑？<br/>欢迎在评论区提问！"}
        ])
