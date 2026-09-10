#!/usr/bin/env python3
"""Build Chinese wine revolution article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#c62828',
        ['中国葡萄酒', '从笑话到惊喜'],
        '国产酒正在逆袭',
        '红樽坊 | 深度观点')

    html = rich_article(content_blocks, primary='#c62828', secondary='#ef5350')
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
    console.log('China Wine, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('China Wine:', e.message);
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
    build_article('china_wine',
        title='中国葡萄酒：从笑话到惊喜，国产酒正在逆袭',
        digest='曾经被嘲笑的中国葡萄酒，现在能让法国酒庄紧张了？从宁夏到新疆，中国葡萄酒正在逆袭。',
        category='opinion',
        tags=['中国','国产酒','宁夏','逆袭','惊喜'],
        content_blocks=[
            {"type": "title", "text": "中国葡萄酒：从笑话到惊喜"},
            {"type": "subtitle", "text": "国产酒正在逆袭"},
            {"type": "lead", "text": "曾经被嘲笑的中国葡萄酒，现在能让法国酒庄紧张了？从宁夏到新疆，中国葡萄酒正在逆袭。这篇指南带你了解中国葡萄酒的过去、现在和未来。"},

            {"type": "h2", "text": "🤣 过去：中国葡萄酒的笑话"},
            {"type": "p", "text": "中国葡萄酒曾经被嘲笑："},
            {"type": "list", "items": [
                "<strong>品质差</strong>——很多中国葡萄酒被戏称为'葡萄汁'",
                "<strong>价格低</strong>——10块钱一瓶，没人当真",
                "<strong>品牌弱</strong>——没有知名品牌，没人认可",
                "<strong>技术落后</strong>——酿造技术不如法国、意大利",
                "<strong>形象差</strong>——送人中国酒会被嫌弃"
            ]},

            {"type": "h2", "text": "🌟 现在：中国葡萄酒的逆袭"},
            {"type": "p", "text": "现在，中国葡萄酒正在逆袭："},
            {"type": "ri", "heading":"宁夏贺兰山东麓", "text":"<strong>地位：</strong>中国最著名的葡萄酒产区\n<strong>特点：</strong>干燥气候、充足阳光、昼夜温差大\n<strong>代表酒庄：</strong>张裕摩塞尔十五世、贺兰晴雪、西鸽\n<strong>成就：</strong>多次在国际大赛中获奖\n\n<strong>评价：</strong>品质不输法国中级庄"},
            {"type": "ri", "heading":"新疆产区", "text":"<strong>地位：</strong>中国最大的葡萄酒产区\n<strong>特点：</strong>干燥气候、充足阳光、灌溉条件好\n<strong>代表酒庄：</strong>中信国安、新天\n<strong>成就：</strong>产量大，品质稳定\n\n<strong>评价：</strong>性价比很高"},
            {"type": "ri", "heading":"云南产区", "text":"<strong>地位：</strong>中国最独特的葡萄酒产区\n<strong>特点：</strong>高海拔、低纬度、独特微气候\n<strong>代表酒庄：</strong>香格里拉、太阳之泪\n<strong>成就：</strong>独特风格，国际关注\n\n<strong>评价：</strong>潜力巨大"},

            {"type": "h2", "text": "📈 中国葡萄酒的进步"},
            {"type": "p", "text": "中国葡萄酒的进步体现在这些方面："},
            {"type": "list", "items": [
                "<strong>技术提升</strong>——引进法国酿造设备和技术",
                "<strong>人才引进</strong>——聘请法国酿酒师",
                "<strong>品质提升</strong>——品质不断提升，获得国际认可",
                "<strong>品牌建设</strong>——打造自己的知名品牌",
                "<strong>国际获奖</strong>——在国际大赛中屡获大奖"
            ]},

            {"type": "h2", "text": "🌍 国际评价"},
            {"type": "p", "text": "国际葡萄酒界对中国葡萄酒的评价："},
            {"type": "list", "items": [
                "<strong>杰西斯·罗宾逊</strong>——'中国葡萄酒的进步令人印象深刻'",
                "<strong>罗伯特·帕克</strong>——'中国葡萄酒有潜力成为世界顶级'",
                "<strong>Decanter杂志</strong>——'中国是未来葡萄酒的重要产区'",
                "<strong>国际大赛</strong>——中国葡萄酒多次获得金奖"
            ]},

            {"type": "h2", "text": "🤔 中国葡萄酒的问题"},
            {"type": "p", "text": "中国葡萄酒还有这些问题："},
            {"type": "list", "items": [
                "<strong>价格虚高</strong>——有些中国酒价格比法国酒还贵",
                "<strong>品牌认知度低</strong>——很多人还不认可中国酒",
                "<strong>市场混乱</strong>——假酒、劣质酒充斥市场",
                "<strong>缺乏标准</strong>——葡萄酒标准不如法国严格",
                "<strong>消费习惯</strong>——很多人还是习惯喝进口酒"
            ]},

            {"type": "h2", "text": "💡 如何选择中国葡萄酒？"},
            {"type": "p", "text": "想尝试中国葡萄酒，试试这些方法："},
            {"type": "list", "items": [
                "<strong>选择宁夏产区</strong>——宁夏是中国最好的产区",
                "<strong>选择知名酒庄</strong>——张裕、贺兰晴雪等知名酒庄",
                "<strong>选择赤霞珠</strong>——赤霞珠是中国最成功的品种",
                "<strong>选择中等价位</strong>——100-300元的中国酒性价比最高",
                "<strong>参加品酒会</strong>——参加品酒会可以快速了解"
            ]},

            {"type": "h2", "text": "📊 中国葡萄酒速查表"},
            {"type": "table", "headers": ["产区", "特点", "推荐酒庄", "价位"],
             "rows": [
                 ["宁夏", "品质最好", "张裕、贺兰晴雪", "200-500元"],
                 ["新疆", "产量最大", "中信国安、新天", "50-200元"],
                 ["云南", "最独特", "香格里拉", "300-800元"],
                 ["山东", "历史最久", "张裕、长城", "50-300元"],
                 ["河北", "产量较大", "长城、中粮", "50-200元"]
             ]},

            {"type": "sep"},
            {"type": "quote", "text": "'中国葡萄酒的未来，不可限量。'"},
            {"type": "p", "text": "中国葡萄酒正在从笑话变成惊喜。从宁夏到新疆，中国葡萄酒正在逆袭。给国产酒一个机会，你可能会惊喜。"},

            {"type": "end", "text": "你喝过中国葡萄酒吗？<br/>你觉得中国葡萄酒怎么样？<br/>欢迎在评论区分享你的体验！"}
        ])
