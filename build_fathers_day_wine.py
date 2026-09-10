#!/usr/bin/env python3
"""Build Father's Day wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#3e2723',
        ['父亲节配酒指南', '爸爸那一辈的葡萄酒记忆'],
        '用一杯酒，致敬父爱',
        '红樽坊 | 父亲节特辑')

    html = rich_article(content_blocks, primary='#3e2723', secondary='#8d6e63')
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
    console.log('Father Day, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Father Day:', e.message);
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
    build_article('fathers_day_wine',
        title='父亲节配酒指南：爸爸那一辈的葡萄酒记忆',
        digest='从80年代的中国葡萄酒到今天的宁夏贺兰山，用一杯酒致敬父爱。不同类型的爸爸，配不同的酒。',
        category='holiday',
        tags=['父亲节','节日','爸爸','情怀','配酒'],
        content_blocks=[
            {"type": "title", "text": "父亲节配酒指南"},
            {"type": "subtitle", "text": "爸爸那一辈的葡萄酒记忆 | 用一杯酒，致敬父爱"},
            {"type": "lead", "text": "父爱如山，深沉而内敛。父亲节这一天，也许你不擅长说'我爱你'，但可以陪爸爸喝一杯酒。从80年代的中国葡萄酒到今天的宁夏贺兰山，每一杯酒都承载着一段记忆。"},

            {"type": "h2", "text": "🍷 爸爸的葡萄酒记忆"},
            {"type": "p", "text": "对于很多爸爸来说，葡萄酒的记忆可能停留在80年代的'中国红'——那种甜甜的、酒精度不高的国产葡萄酒。那时候，葡萄酒是奢侈品，只有过年过节才能喝上一口。"},
            {"type": "p", "text": "90年代，随着洋酒进入中国，爸爸们开始接触到真正的干红葡萄酒。但那时候的干红酒，很多人喝不惯——太涩、太酸、不够甜。"},
            {"type": "p", "text": "如今，中国葡萄酒的品质已经有了翻天覆地的变化。宁夏贺兰山东麓、云南香格里拉等产区的酒款，在国际大赛上屡获殊荣。用一杯国产好酒，陪爸爸聊聊这些年的生活变化。"},

            {"type": "h2", "text": "👨‍👦 不同类型的爸爸，配不同的酒"},
            {"type": "p", "text": "每个爸爸都是独特的，他们有不同的性格、不同的口味、不同的饮酒习惯。这里根据爸爸的类型，推荐不同的酒款："},

            {"type": "ri", "heading":"类型一：传统型爸爸", "text":"<strong>特点：</strong>喜欢喝白酒，觉得葡萄酒'不够劲'，习惯了高度酒的刺激\n\n<strong>推荐酒款：</strong>赤霞珠、西拉、巴罗洛\n<strong>推荐理由：</strong>这些酒酒体饱满，单宁厚重，酒精度较高（14%+），接近白酒的'力度'\n\n<strong>推荐价格：</strong>150-300元"},

            {"type": "ri", "heading":"类型二：讲究型爸爸", "text":"<strong>特点：</strong>对酒有研究，喜欢品酒，注重产区和年份\n\n<strong>推荐酒款：</strong>波尔多、勃艮第、巴罗洛\n<strong>推荐理由：</strong>这些是经典产区的经典酒款，能满足讲究型爸爸的挑剔口味\n\n<strong>推荐价格：</strong>300-800元"},

            {"type": "ri", "heading":"类型三：随和型爸爸", "text":"<strong>特点：</strong>不挑酒，什么都喝，喝酒主要是为了气氛\n\n<strong>推荐酒款：</strong>黄尾袋鼠、桃乐丝公牛血、智利赤霞珠\n<strong>推荐理由：</strong>这些酒易饮顺口，不会出错，适合随和型爸爸\n\n<strong>推荐价格：</strong>50-150元"},

            {"type": "ri", "heading":"类型四：养生型爸爸", "text":"<strong>特点：</strong>注重健康，喝得少，喝得好，不喜欢太重口味的酒\n\n<strong>推荐酒款：</strong>黑皮诺、佳美、歌海娜\n<strong>推荐理由：</strong>这些酒酒体轻盈，单宁低，酸度适中，对身体负担较小\n\n<strong>推荐价格：</strong>200-500元"},

            {"type": "ri", "heading":"类型五：怀旧型爸爸", "text":"<strong>特点：</strong>喜欢回忆过去，对老事物有感情\n\n<strong>推荐酒款：</strong>中国葡萄酒（张裕、长城、宁夏产区）\n<strong>推荐理由：</strong>用国产酒陪爸爸聊聊过去的时光，是最有情怀的选择\n\n<strong>推荐价格：</strong>100-300元"},

            {"type": "h2", "text": "🎁 父亲节送酒攻略"},
            {"type": "p", "text": "如果父亲节不知道送什么酒，这里有几个建议："},
            {"type": "list", "items": [
                "<strong>预算100-200元</strong>——黄尾袋鼠赤霞珠、桃乐丝公牛血、蒙特斯经典",
                "<strong>预算200-400元</strong>——拉菲传说、禾富黄标西拉、宁夏贺兰山东麓赤霞珠",
                "<strong>预算400-800元</strong>——波尔多中级庄、勃艮第大区级、澳洲巴罗萨西拉",
                "<strong>预算800元以上</strong>——波尔多列级庄、勃艮第一级园、意大利巴罗洛"
            ]},

            {"type": "h2", "text": "🥂 陪爸爸喝酒的正确方式"},
            {"type": "p", "text": "父亲节这一天，陪爸爸喝酒，不仅仅是喝酒本身。这里有几个建议："},
            {"type": "list", "items": [
                "<strong>放慢节奏</strong>——不要急着干杯，慢慢品味，边喝边聊",
                "<strong>倾听故事</strong>——让爸爸讲讲他年轻时的故事，你可能从来没听过",
                "<strong>不要评判</strong>——即使爸爸的饮酒习惯不健康，也不要批评，先陪伴",
                "<strong>拍照留念</strong>——用手机记录下这个温馨的时刻",
                "<strong>送个小礼物</strong>——一瓶好酒，一个酒杯，或者一张手写的卡片"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'父爱如酒，初尝时或许苦涩，回味时才知甘甜。'"},
            {"type": "p", "text": "这一天，放下手机，关掉电视，倒上两杯酒，和爸爸好好聊聊。你会发现，那个沉默寡言的父亲，其实有很多话想对你说。"},

            {"type": "end", "text": "你和爸爸有什么关于酒的故事？<br/>欢迎在评论区分享你的父亲节计划！"}
        ])
