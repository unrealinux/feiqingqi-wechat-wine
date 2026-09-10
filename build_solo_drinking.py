#!/usr/bin/env python3
"""Build solo drinking reasons article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#880e4f',
        ['一个人喝酒的', '10个理由'],
        '独饮，是与自己对话的最好方式',
        '红樽坊 | 悦己时刻')

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
    console.log('Solo Drinking, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Solo Drinking:', e.message);
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
    build_article('solo_drinking',
        title='一个人喝酒的10个理由',
        digest='不是孤独，是自由。不是借酒消愁，是与自己对话。在这个喧嚣的世界里，独饮是一种奢侈的自我关怀。',
        category='lifestyle',
        tags=['独饮','一个人喝酒','悦己','自由','自我关怀'],
        content_blocks=[
            {"type": "title", "text": "一个人喝酒的10个理由"},
            {"type": "subtitle", "text": "不是孤独，是自由"},
            {"type": "lead", "text": "在这个喧嚣的世界里，我们总是在扮演各种角色：员工、子女、伴侣、朋友……但有时候，我们只想做回自己。一个人喝酒，不是孤独，而是与自己对话的最好方式。"},

            {"type": "h2", "text": "🍷 理由一：不需要迁就别人的口味"},
            {"type": "p", "text": "和朋友喝酒，总要照顾大家的口味：有人不喝红的，有人不喝白的，有人不喝甜的……但一个人喝酒，你想喝什么就喝什么。想尝尝那瓶觊觎已久的勃艮第？开！想试试那款新到的自然酒？开！"},
            {"type": "p", "text": "不用解释，不用商量，不用妥协。这一刻，酒是为你一个人存在的。"},

            {"type": "h2", "text": "🍷 理由二：放慢节奏，感受当下"},
            {"type": "p", "text": "一个人喝酒时，没有人会催促你'干杯'。你可以慢慢品味每一口酒的变化，感受香气在口腔中的层次，观察酒液在杯中的挂杯。"},
            {"type": "p", "text": "这种放慢的节奏，在快节奏的生活中，是一种奢侈的享受。"},

            {"type": "h2", "text": "🍷 理由三：与自己对话"},
            {"type": "p", "text": "独饮是最好的自我反思时刻。没有外界的干扰，你可以诚实地面对自己的内心：今天过得怎么样？有什么收获？有什么遗憾？"},
            {"type": "p", "text": "一杯酒，一段独处的时间，往往能带来意想不到的清醒和洞察。"},

            {"type": "h2", "text": "🍷 理由四：释放压力，但不依赖酒精"},
            {"type": "p", "text": "一个人喝酒，不是为了借酒消愁，而是为了释放一天的压力。有节制的独饮，是一种健康的解压方式。"},
            {"type": "p", "text": "关键在于'有节制'——一杯就好，享受那份微醺的感觉，但不依赖酒精来解决问题。"},

            {"type": "h2", "text": "🍷 理由五：享受仪式感"},
            {"type": "p", "text": "一个人喝酒，也可以很有仪式感：选一只喜欢的酒杯，点一支蜡烛，放一首喜欢的音乐，配一份精致的小食。"},
            {"type": "p", "text": "这种仪式感，不是做给别人看的，而是对自己的尊重和爱护。"},

            {"type": "h2", "text": "🍷 理由六：探索味蕾的无限可能"},
            {"type": "p", "text": "一个人喝酒时，可以更专注地探索酒的风味。没有人在旁边分散注意力，你可以细细品味每一款酒的独特之处。"},
            {"type": "p", "text": "也许你会发现，原来这款酒有那么多层次的香气；原来那个产区的酒是这个风格；原来这个葡萄品种这么有趣。"},

            {"type": "h2", "text": "🍷 理由七：随心所欲的时间"},
            {"type": "p", "text": "想在下午三点喝一杯？可以。想在深夜独自小酌？也可以。一个人喝酒，时间完全由你掌控。"},
            {"type": "p", "text": "不用迁就别人的时间表，不用赶着赴约，不用在意'现在喝酒是不是太早了'。"},

            {"type": "h2", "text": "🍷 理由八：培养独立人格"},
            {"type": "p", "text": "学会独处，是成熟的标志之一。一个人喝酒，是练习独处的绝佳方式。"},
            {"type": "p", "text": "当你能够享受一个人的时光，你就不再需要依赖他人来获得快乐。这种独立，是真正的自由。"},

            {"type": "h2", "text": "🍷 理由九：记录生活，沉淀思考"},
            {"type": "p", "text": "独饮时，常常会有灵感的闪现。很多人在独饮时写下了日记、文章，甚至完成了重要的创作。"},
            {"type": "p", "text": "一杯酒，一本笔记，一个安静的夜晚——这是最好的创作时光。"},

            {"type": "h2", "text": "🍷 理由十：这是一种选择"},
            {"type": "p", "text": "最重要的一点：一个人喝酒，是一种选择，不是被迫。你不是因为没人陪才喝酒，而是因为你选择了与自己相处。"},
            {"type": "p", "text": "这种选择的权力，本身就是一种奢侈。"},

            {"type": "sep"},
            {"type": "quote", "text": "'独处不是孤独，而是与自己相遇的最好时机。'"},
            {"type": "p", "text": "在这个总是要求我们'合群'的社会里，一个人喝酒是一种小小的叛逆。它提醒我们：我们有权选择如何度过自己的时光，有权与自己相处，有权享受一个人的自由。"},
            {"type": "p", "text": "所以下次当你想一个人喝一杯时，不要犹豫。打开那瓶你喜欢的酒，倒上一杯，敬自己。"},

            {"type": "end", "text": "你有过一个人喝酒的时刻吗？<br/>那是什么样的体验？<br/>欢迎在评论区分享你的独饮故事。"}
        ])
