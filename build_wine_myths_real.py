#!/usr/bin/env python3
"""Build wine myths article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#d32f2f',
        ['葡萄酒的误区', '99%的人都理解错了'],
        '别再被这些谎言骗了',
        '红樽坊 | 深度揭秘')

    html = rich_article(content_blocks, primary='#d32f2f', secondary='#ef5350')
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
    console.log('Myths, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Myths:', e.message);
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
    build_article('wine_myths_real',
        title='葡萄酒的误区：99%的人都理解错了',
        digest='挂杯就是好酒？红酒配雪碧更好喝？这些葡萄酒误区，99%的人都理解错了。',
        category='opinion',
        tags=['误区','真相','避坑','科普','纠正'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒的误区：99%的人都理解错了"},
            {"type": "subtitle", "text": "别再被这些谎言骗了"},
            {"type": "lead", "text": "挂杯就是好酒？红酒配雪碧更好喝？这些葡萄酒误区，99%的人都理解错了。这篇指南帮你纠正这些错误观念。"},

            {"type": "h2", "text": "🤥 误区一：挂杯就是好酒"},
            {"type": "p", "text": "很多人认为挂杯就是好酒，这是错的："},
            {"type": "list", "items": [
                "<strong>挂杯是什么</strong>——挂杯是酒液的粘稠度，与酒精和糖分有关",
                "<strong>真相</strong>——挂杯只说明酒精度或糖分高，不代表品质好",
                "<strong>例子</strong>——便宜的甜酒挂杯很好，但品质一般",
                "<strong>结论</strong>——挂杯不是判断酒质的标准"
            ]},

            {"type": "h2", "text": "🤥 误区二：红酒配雪碧更好喝"},
            {"type": "p", "text": "很多人喜欢红酒配雪碧，这是错的："},
            {"type": "list", "items": [
                "<strong>问题</strong>——雪碧的甜味会掩盖红酒的风味",
                "<strong>真相</strong>——好酒不需要加任何东西",
                "<strong>例子</strong>——加雪碧的红酒，喝不到酒的原味",
                "<strong>结论</strong>——红酒应该纯饮，不要加任何东西"
            ]},

            {"type": "h2", "text": "🤥 误区三：酒越老越好"},
            {"type": "p", "text": "很多人认为酒越老越好，这是错的："},
            {"type": "list", "items": [
                "<strong>真相</strong>——大部分酒不适合陈年，应该趁新鲜喝",
                "<strong>例子</strong>——100块的酒陈年5年，可能还不如新鲜喝",
                "<strong>原因</strong>——只有好酒才值得陈年",
                "<strong>结论</strong>——不是所有酒都值得陈年"
            ]},

            {"type": "h2", "text": "🤥 误区四：红酒要醒酒"},
            {"type": "p", "text": "很多人认为红酒都要醒酒，这是错的："},
            {"type": "list", "items": [
                "<strong>真相</strong>——只有需要醒的酒才要醒",
                "<strong>例子</strong>——年轻的黑皮诺不需要醒酒",
                "<strong>原因</strong>——醒酒是为了让酒与空气接触，软化单宁",
                "<strong>结论</strong>——不是所有酒都需要醒酒"
            ]},

            {"type": "h2", "text": "🤥 误区五：法国酒最好"},
            {"type": "p", "text": "很多人认为法国酒最好，这是错的："},
            {"type": "list", "items": [
                "<strong>真相</strong>——新世界国家的酒性价比更高",
                "<strong>例子</strong>——智利赤霞珠的性价比比波尔多高很多",
                "<strong>原因</strong>——法国酒有品牌溢价",
                "<strong>结论</strong>——不要只看产区，关注酒质"
            ]},

            {"type": "h2", "text": "🤥 误区六：螺旋盖的酒不好"},
            {"type": "p", "text": "很多人认为螺旋盖的酒不好，这是错的："},
            {"type": "list", "items": [
                "<strong>真相</strong>——螺旋盖的酒品质也可以很好",
                "<strong>例子</strong>——澳大利亚很多好酒用螺旋盖",
                "<strong>原因</strong>——螺旋盖只是封装方式，不影响酒质",
                "<strong>结论</strong>——不要以封装方式判断酒质"
            ]},

            {"type": "h2", "text": "🤥 误区七：红酒要倒满杯"},
            {"type": "p", "text": "很多人喜欢倒满杯红酒，这是错的："},
            {"type": "list", "items": [
                "<strong>真相</strong>——红酒应该倒1/3杯",
                "<strong>原因</strong>——留出空间让酒与空气接触，释放香气",
                "<strong>例子</strong>——倒满杯的红酒，香气无法释放",
                "<strong>结论</strong>——红酒应该倒1/3杯"
            ]},

            {"type": "h2", "text": "📊 误区 vs 真相"},
            {"type": "table", "headers": ["误区", "真相"],
             "rows": [
                 ["挂杯就是好酒", "挂杯只说明酒精度或糖分高"],
                 ["红酒配雪碧更好喝", "好酒不需要加任何东西"],
                 ["酒越老越好", "大部分酒应该趁新鲜喝"],
                 ["红酒都要醒酒", "只有需要醒的酒才要醒"],
                 ["法国酒最好", "新世界酒性价比更高"],
                 ["螺旋盖的酒不好", "螺旋盖不影响酒质"],
                 ["红酒要倒满杯", "红酒应该倒1/3杯"]
             ]},

            {"type": "sep"},
            {"type": "quote", "text": "'纠正误区，才能真正懂酒。'"},
            {"type": "p", "text": "葡萄酒的误区很多，但只要你知道这些误区，就能更懂酒。纠正误区，享受喝酒的乐趣。"},

            {"type": "end", "text": "你被哪些葡萄酒误区骗过？<br/>你知道哪些葡萄酒真相？<br/>欢迎在评论区分享你的看法！"}
        ])
