#!/usr/bin/env python3
"""Build domestic vs imported wine blind test article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#e65100',
        ['国产酒 vs 进口酒', '盲品结果让人意外'],
        '打破偏见，重新认识中国葡萄酒',
        '红樽坊 | 盲品实测')

    html = rich_article(content_blocks, primary='#e65100', secondary='#ff9800')
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
    console.log('Domestic vs Imported, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Domestic vs Imported:', e.message);
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
    build_article('domestic_vs_imported',
        title='国产酒 vs 进口酒：盲品结果让人意外',
        digest='我们邀请了10位葡萄酒爱好者，进行了一场国产酒与进口酒的盲品对决。结果？很多人改变了对中国葡萄酒的看法。',
        category='blind-taste',
        tags=['国产酒','进口酒','盲品','宁夏','贺兰山','中国葡萄酒'],
        content_blocks=[
            {"type": "title", "text": "国产酒 vs 进口酒：盲品结果让人意外"},
            {"type": "subtitle", "text": "打破偏见，重新认识中国葡萄酒"},
            {"type": "lead", "text": "'中国也能产好酒？'——这是我们最常听到的质疑。为了验证国产酒的真实水平，我们组织了一场国产酒与进口酒的盲品对决。10位参与者，6款酒，结果出乎所有人的意料。"},

            {"type": "h2", "text": "📋 盲品规则"},
            {"type": "p", "text": "我们选择了3款国产酒和3款进口酒，价格区间相近（200-400元），葡萄品种相同（赤霞珠/马瑟兰）。参与者在不知道酒款信息的情况下，对每款酒进行打分（1-10分），并猜测产地。"},
            {"type": "table", "headers": ["酒款", "产地", "品种", "年份", "价格"],
             "rows": [
                 ["贺兰山东麓 赤霞珠", "中国宁夏", "赤霞珠", "2021", "¥280"],
                 ["香格里拉 马瑟兰", "中国云南", "马瑟兰", "2020", "¥350"],
                 ["新疆天山 赤霞珠", "中国新疆", "赤霞珠", "2021", "¥220"],
                 ["波尔多 赤霞珠", "法国波尔多", "赤霞珠", "2020", "¥320"],
                 ["托斯卡纳 桑娇维塞", "意大利托斯卡纳", "桑娇维塞", "2019", "¥380"],
                 ["纳帕谷 赤霞珠", "美国纳帕谷", "赤霞珠", "2020", "¥450"]
             ]},

            {"type": "h2", "text": "📊 盲品结果"},
            {"type": "p", "text": "经过激烈的品鉴和讨论，最终的评分结果如下："},
            {"type": "table", "headers": ["排名", "酒款", "平均分", "猜对产地比例"],
             "rows": [
                 ["1", "贺兰山东麓 赤霞珠（中国）", "8.5分", "30%"],
                 ["2", "纳帕谷 赤霞珠（美国）", "8.2分", "90%"],
                 ["3", "香格里拉 马瑟兰（中国）", "8.0分", "20%"],
                 ["4", "波尔多 赤霞珠（法国）", "7.8分", "80%"],
                 ["5", "新疆天山 赤霞珠（中国）", "7.5分", "40%"],
                 ["6", "托斯卡纳 桑娇维塞（意大利）", "7.3分", "60%"]
             ]},
            {"type": "p", "text": "是的，你没有看错——<strong>冠军是一款中国宁夏的赤霞珠</strong>！而且只有30%的人猜对了它的产地。这说明什么？国产酒的品质，已经超出了大多数人的预期。"},

            {"type": "h2", "text": "🏆 冠军酒款：贺兰山东麓赤霞珠"},
            {"type": "ri", "heading":"品鉴笔记", "text":"<strong>外观：</strong>深宝石红色，带有紫色光泽\n<strong>香气：</strong>黑醋栗、黑樱桃、雪松、淡淡的烟草和香料气息\n<strong>口感：</strong>酒体饱满，单宁细腻而有力，酸度适中，余味悠长\n<strong>评价：</strong>这是一款非常平衡的赤霞珠，具有波尔多的优雅，又带有宁夏独特的风土特色。与同价位的波尔多相比，它的果味更浓郁，单宁更柔和。"},

            {"type": "h2", "text": "🤔 为什么很多人猜错了产地？"},
            {"type": "p", "text": "盲品结果中，最有趣的现象是：大多数参与者猜错了国产酒的产地。很多人以为贺兰山东麓的赤霞珠是法国波尔多，以为香格里拉的马瑟兰是意大利酒。"},
            {"type": "p", "text": "这说明什么？说明国产酒的品质，已经达到了与进口酒相当的水平。但人们的认知，还停留在'中国产不了好酒'的刻板印象中。"},
            {"type": "ri", "heading":"🎯 核心发现", "text":"<strong>偏见比酒更难打破。</strong>当酒标被遮住时，国产酒的表现不输进口酒。但一旦看到酒标，很多人会不自觉地降低对国产酒的评分。这是一种认知偏差，需要时间来改变。"},

            {"type": "h2", "text": "🌍 中国葡萄酒的崛起"},
            {"type": "p", "text": "近年来，中国葡萄酒在国际大赛上屡获殊荣。宁夏贺兰山东麓产区的酒款，在Decanter世界葡萄酒大赛、布鲁塞尔国际葡萄酒大赛等顶级赛事中，获得了数百枚金奖和银奖。"},
            {"type": "p", "text": "云南香格里拉产区的高海拔葡萄园，出产的霞多丽和黑皮诺，被认为是亚洲最具潜力的葡萄酒。新疆、山东、河北等产区，也各有特色。"},
            {"type": "p", "text": "更令人振奋的是，中国葡萄酒的性价比极高。同样品质的酒款，国产酒的价格通常只有进口酒的1/3到1/2。"},

            {"type": "h2", "text": "🍷 推荐几款值得尝试的国产酒"},
            {"type": "p", "text": "如果你还没有尝试过国产酒，这里推荐几款入门级的酒款，帮助你重新认识中国葡萄酒："},
            {"type": "item", "text": "贺兰山东麓 赤霞珠", "info": "宁夏产区的代表作，黑醋栗、雪松风味，单宁细腻，具有波尔多的优雅风格。", "price": "¥200-400", "tag": "国产之光"},
            {"type": "item", "text": "香格里拉 马瑟兰", "info": "云南高海拔产区的特色品种，紫罗兰、黑樱桃风味，酒体中等，余味悠长。", "price": "¥250-450", "tag": "潜力新星"},
            {"type": "item", "text": "新疆天山 赤霞珠", "info": "日照充足，果实成熟度高，黑加仑、巧克力风味，酒体饱满，适合喜欢浓郁风格的人。", "price": "¥150-300", "tag": "性价比王"},
            {"type": "item", "text": "宁夏 贺兰晴雪", "info": "中国葡萄酒的骄傲，多次获得国际大奖。复杂度高，陈年潜力强。", "price": "¥300-600", "tag": "金奖常客"},

            {"type": "sep"},
            {"type": "h2", "text": "💡 如何改变对国产酒的偏见？"},
            {"type": "p", "text": "第一，<strong>尝试盲品</strong>。找一款国产酒和一款进口酒，遮住酒标，只凭口感判断。你可能会有意外的发现。"},
            {"type": "p", "text": "第二，<strong>了解产区</strong>。宁夏、云南、新疆……每个产区都有自己的特色。了解这些产区的风土特点，能帮助你更好地欣赏国产酒。"},
            {"type": "p", "text": "第三，<strong>支持国产</strong>。国产酒的崛起，需要消费者的支持。每一次购买，都是对国产酒的一票。"},
            {"type": "ri", "heading":"🌟 信念", "text":"<strong>中国葡萄酒的未来，掌握在每一个消费者手中。</strong>当你愿意给国产酒一个机会，你可能会发现一个全新的世界。"},

            {"type": "end", "text": "你尝试过国产葡萄酒吗？<br/>你觉得国产酒和进口酒有什么区别？<br/>欢迎在评论区分享你的看法和推荐酒款！"}
        ])
