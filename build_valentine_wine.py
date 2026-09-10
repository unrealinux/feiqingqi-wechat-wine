#!/usr/bin/env python3
"""Build Valentine's Day wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#880e4f',
        ['情人节配酒指南', '让爱意升温'],
        '每一杯都是浪漫',
        '红樽坊 | 节日特辑')

    html = rich_article(content_blocks, primary='#880e4f', secondary='#e91e63')
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
    console.log('Valentine, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Valentine:', e.message);
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
    build_article('valentine_wine',
        title='情人节配酒指南：让爱意升温',
        digest='香槟、黑皮诺、桃红……不同的情人节场景，配不同的酒。让每一杯都充满浪漫。',
        category='holiday',
        tags=['情人节','浪漫','约会','爱情','节日'],
        content_blocks=[
            {"type": "title", "text": "情人节配酒指南：让爱意升温"},
            {"type": "subtitle", "text": "每一杯都是浪漫"},
            {"type": "lead", "text": "情人节快到了，你准备好和另一半共度浪漫时光了吗？一瓶好酒，可以让爱意升温。这篇指南告诉你如何在不同的情人节场景中配酒，让每一杯都充满浪漫。"},

            {"type": "h2", "text": "💕 情人节配酒的基本原则"},
            {"type": "p", "text": "情人节配酒，遵循这几个原则："},
            {"type": "list", "items": [
                "<strong>选对氛围</strong>——浪漫的氛围需要浪漫的酒",
                "<strong>了解对方喜好</strong>——投其所好最重要",
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤氛围",
                "<strong>注意温度</strong>——不同酒款不同温度",
                "<strong>享受过程</strong>——喝酒是享受，不是任务"
            ]},

            {"type": "h2", "text": "🕯️ 浪漫晚餐场景"},
            {"type": "p", "text": "浪漫晚餐是情人节的经典场景，配酒很重要："},
            {"type": "ri", "heading":"推荐酒款：香槟（Champagne）", "text":"<strong>推荐酒款：</strong>酩悦、巴黎之花、唐培里侬\n<strong>理由：</strong>香槟的气泡象征着爱情的甜蜜，是情人节最经典的酒款。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>海鲜、鹅肝、奶酪\n\n<strong>小贴士：</strong>开香槟时不要对着人，注意安全。"},
            {"type": "ri", "heading":"推荐酒款：勃艮第黑皮诺", "text":"<strong>推荐酒款：</strong>夜圣乔治、沃恩-罗曼尼\n<strong>理由：</strong>黑皮诺的优雅柔和可以增添浪漫氛围，适合喜欢红酒的情侣。\n<strong>饮用温度：</strong>14-16°C\n<strong>推荐搭配：</strong>牛排、羊肉、奶酪\n\n<strong>小贴士：</strong>选择年份较新的黑皮诺，口感更清新。"},

            {"type": "h2", "text": "🏠 居家约会场景"},
            {"type": "p", "text": "居家约会更轻松，配酒也可以更随意："},
            {"type": "ri", "heading":"推荐酒款：莫斯卡托（Moscato）", "text":"<strong>推荐酒款：</strong>意大利莫斯卡托、法国微甜起泡\n<strong>理由：</strong>莫斯卡托的甜美花香可以增添浪漫氛围，适合喜欢甜酒的情侣。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>甜点、水果、轻食\n\n<strong>小贴士：</strong>莫斯卡托酒精度低，适合不常喝酒的情侣。"},
            {"type": "ri", "heading":"推荐酒款：桃红（Rosé）", "text":"<strong>推荐酒款：</strong>普罗旺斯桃红、西班牙桃红\n<strong>理由：</strong>桃红的颜值和口感都很浪漫，适合喜欢清爽口感的情侣。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>沙拉、海鲜、轻食\n\n<strong>小贴士：</strong>桃红颜色浪漫，适合拍照发朋友圈。"},

            {"type": "h2", "text": "🌹 户外约会场景"},
            {"type": "p", "text": "户外约会更轻松，配酒也可以更随意："},
            {"type": "ri", "heading":"推荐酒款：起泡酒（Sparkling）", "text":"<strong>推荐酒款：</strong>Prosecco、Cava\n<strong>理由：</strong>起泡酒的气泡可以让人心情愉悦，适合户外轻松氛围。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>水果、沙拉、轻食\n\n<strong>小贴士：</strong>户外温度高，记得用冰桶冰镇。"},
            {"type": "ri", "heading":"推荐酒款：白葡萄酒", "text":"<strong>推荐酒款：</strong>长相思、雷司令\n<strong>理由：</strong>白葡萄酒的清爽口感可以解腻，适合户外烧烤或野餐。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>烧烤、沙拉、海鲜\n\n<strong>小贴士：</strong>户外温度高，记得用冰桶冰镇。"},

            {"type": "h2", "text": "🥂 情人节配酒速查表"},
            {"type": "table", "headers": ["场景", "推荐酒款", "避雷"],
             "rows": [
                 ["浪漫晚餐", "香槟、勃艮第黑皮诺", "浓郁型红葡萄酒"],
                 ["居家约会", "莫斯卡托、桃红", "高单宁红葡萄酒"],
                 ["户外约会", "起泡酒、白葡萄酒", "浓郁型红葡萄酒"],
                 ["朋友聚会", "起泡酒、桃红", "昂贵名酒"],
                 ["独自享受", "黑皮诺、雷司令", "太多酒"]
             ]},

            {"type": "h2", "text": "💡 情人节配酒小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的情人节配酒更完美："},
            {"type": "list", "items": [
                "<strong>提前准备</strong>——不要等到最后一刻才买酒",
                "<strong>注意温度</strong>——不同酒款不同温度",
                "<strong>适量饮酒</strong>——微醺最好，喝醉伤氛围",
                "<strong>享受过程</strong>——喝酒是享受，不是任务",
                "<strong>表达心意</strong>——送酒最重要的是心意"
            ]},

            {"type": "h2", "text": "🚫 情人节配酒禁忌"},
            {"type": "p", "text": "情人节配酒，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤氛围",
                "<strong>不要开车</strong>——喝酒后绝对不能开车",
                "<strong>不要选错酒</strong>——了解对方喜好，投其所好",
                "<strong>不要忽略氛围</strong>——氛围比酒更重要",
                "<strong>不要勉强对方</strong>——如果对方不喝酒，不要勉强"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'情人节的酒，不在于贵，而在于心意。'"},
            {"type": "p", "text": "情人节配酒，是一种浪漫的仪式感。选对酒，配对场景，让每一杯都充满爱意。"},

            {"type": "end", "text": "你情人节打算喝什么酒？<br/>你有什么情人节配酒的经验？<br/>欢迎在评论区分享你的浪漫故事！"}
        ])
