#!/usr/bin/env python3
"""Build wine love stories article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#ad1457',
        ['葡萄酒的爱情故事', '杯中的浪漫'],
        '每一杯都是爱情',
        '红樽坊 | 浪漫故事')

    html = rich_article(content_blocks, primary='#ad1457', secondary='#e91e63')
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
    console.log('Love, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Love:', e.message);
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
    build_article('wine_love',
        title='葡萄酒的爱情故事：杯中的浪漫',
        digest='从香槟到勃艮第，这些葡萄酒背后的爱情故事，让你更懂浪漫。',
        category='culture',
        tags=['爱情','浪漫','故事','婚姻','约会'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒的爱情故事：杯中的浪漫"},
            {"type": "subtitle", "text": "每一杯都是爱情"},
            {"type": "lead", "text": "从香槟到勃艮第，这些葡萄酒背后的爱情故事，让你更懂浪漫。每一杯酒，都可能是一个爱情故事。"},

            {"type": "h2", "text": "💕 香槟与爱情"},
            {"type": "p", "text": "香槟与爱情的关系："},
            {"type": "list", "items": [
                "<strong>庆祝爱情</strong>——香槟是庆祝爱情的最佳选择",
                "<strong>婚礼必备</strong>——婚礼上一定要有香槟",
                "<strong>求婚必备</strong>——求婚时开香槟，更有仪式感",
                "<strong>纪念日</strong>——纪念日喝香槟，回忆美好时光"
            ]},

            {"type": "h2", "text": "🌹 葡萄酒的浪漫故事"},
            {"type": "p", "text": "这些葡萄酒背后的浪漫故事："},

            {"type": "ri", "heading":"唐·培里侬：香槟的发明者", "text":"<strong>故事：</strong>唐·培里侬是修道士，他发现了香槟的酿造方法\n<strong>浪漫：</strong>他说：'快来！我在喝星星！'\n<strong>意义：</strong>香槟从此成为浪漫的象征"},
            {"type": "ri", "heading":"凯歌夫人：香槟的女强人", "text":"<strong>故事：</strong>凯歌夫人的丈夫去世后，她继承了香槟酒庄\n<strong>浪漫：</strong>她用丈夫的名字命名香槟，永远纪念他\n<strong>意义：</strong>爱情可以超越生死"},
            {"type": "ri", "heading":"路易王妃：为爱人酿造的酒", "text":"<strong>故事：</strong>路易王妃为他的爱人酿造了最好的香槟\n<strong>浪漫：</strong>这款香槟以他爱人的名字命名\n<strong>意义：</strong>爱情可以成为酿酒的动力"},

            {"type": "h2", "text": "🍷 中国葡萄酒的爱情故事"},
            {"type": "p", "text": "中国葡萄酒背后的爱情故事："},
            {"type": "list", "items": [
                "<strong>张裕</strong>——张弼仕为妻子酿造葡萄酒",
                "<strong>长城</strong>——长城葡萄酒见证了无数爱情",
                "<strong>贺兰晴雪</strong>——贺兰晴雪葡萄酒代表纯洁的爱情"
            ]},

            {"type": "h2", "text": "💑 如何用葡萄酒表达爱意"},
            {"type": "p", "text": "如何用葡萄酒表达爱意？"},
            {"type": "list", "items": [
                "<strong>选对酒</strong>——选择对方喜欢的酒",
                "<strong>选对时机</strong>——在特别的时刻开酒",
                "<strong>选对氛围</strong>——营造浪漫的氛围",
                "<strong>说对话</strong>——用酒表达你的心意",
                "<strong>享受过程</strong>——一起享受喝酒的时光"
            ]},

            {"type": "h2", "text": "🥂 爱情与葡萄酒的搭配"},
            {"type": "p", "text": "不同爱情阶段，配不同的酒："},
            {"type": "table", "headers": ["爱情阶段", "推荐酒款", "理由"],
             "rows": [
                 ["初恋", "莫斯卡托、桃红", "甜美、浪漫"],
                 ["热恋", "香槟、起泡酒", "庆祝、兴奋"],
                 ["稳定期", "黑皮诺、霞多丽", "优雅、舒适"],
                 ["婚姻", "波尔多、勃艮第", "深厚、持久"],
                 ["纪念日", "年份香槟、名庄酒", "珍贵、难忘"]
             ]},

            {"type": "h2", "text": "💕 爱情葡萄酒语"},
            {"type": "p", "text": "用葡萄酒表达爱意："},
            {"type": "list", "items": [
                "<strong>香槟</strong>——'我爱你，让我们庆祝！'",
                "<strong>桃红</strong>——'你是我生命中的浪漫！'",
                "<strong>黑皮诺</strong>——'你是我生命中的优雅！'",
                "<strong>赤霞珠</strong>——'你是我生命中的力量！'",
                "<strong>甜酒</strong>——'你是我生命中的甜蜜！'"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'爱情如酒，越陈越香。'"},
            {"type": "p", "text": "葡萄酒与爱情的关系，是人类最美好的关系之一。每一杯酒，都可能是一个爱情故事。"},

            {"type": "end", "text": "你有什么葡萄酒的爱情故事？<br/>你如何用葡萄酒表达爱意？<br/>欢迎在评论区分享你的浪漫故事！"}
        ])
