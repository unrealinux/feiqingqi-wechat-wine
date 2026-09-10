#!/usr/bin/env python3
"""Build wine storage after opening guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#2e7d32',
        ['葡萄酒开瓶后', '能放多久？'],
        '超实用指南 · 延长保鲜的秘诀',
        '红樽坊 | 实用干货')

    html = rich_article(content_blocks, primary='#2e7d32', secondary='#66bb6a')
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
    console.log('Wine Storage After Opening, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Storage After Opening:', e.message);
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
    build_article('wine_after_opening',
        title='葡萄酒开瓶后能放多久？超实用指南',
        digest='白葡萄酒3天，红葡萄酒5天？错！不同酒款的保鲜时间差异巨大。这篇指南教你如何延长开瓶后的保鲜期。',
        category='practical-guide',
        tags=['开瓶','储存','保鲜','保存','实用技巧'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒开瓶后能放多久？"},
            {"type": "subtitle", "text": "超实用指南 | 延长保鲜的秘诀"},
            {"type": "lead", "text": "很多人以为葡萄酒开瓶后只能放几天，其实不同酒款的保鲜时间差异很大。白葡萄酒、红葡萄酒、起泡酒、加强酒……每种酒的保鲜方法都不一样。这篇指南，帮你搞清楚所有细节。"},

            {"type": "h2", "text": "⏱️ 不同酒款的保鲜时间"},
            {"type": "p", "text": "开瓶后的葡萄酒，保鲜时间取决于酒的类型、储存条件和是否使用保鲜工具。以下是各种酒款的参考保鲜时间："},
            {"type": "table", "headers": ["酒款类型", "常温保存", "冰箱保存", "使用真空泵"],
             "rows": [
                 ["白葡萄酒", "1-2天", "3-5天", "5-7天"],
                 ["红葡萄酒", "2-3天", "3-5天", "5-7天"],
                 ["起泡酒", "1天", "1-2天", "2-3天"],
                 ["加强酒（波特/雪莉）", "7-14天", "14-21天", "21-30天"],
                 ["自然酒", "1天", "2-3天", "3-5天"]
             ]},
            {"type": "tip", "heading":"💡 关键发现", "text":"<strong>冰箱是开瓶葡萄酒最好的朋友。</strong>低温可以显著延缓氧化过程，将保鲜时间延长2-3倍。即使是红葡萄酒，开瓶后放入冰箱也能多保存2-3天。"},

            {"type": "h2", "text": "🔍 为什么葡萄酒开瓶后会变质？"},
            {"type": "p", "text": "葡萄酒开瓶后变质的根本原因是<strong>氧化</strong>。当酒液与空气接触，氧气会加速酒中化学物质的反应，导致香气流失、口感变酸、颜色变深。"},
            {"type": "p", "text": "此外，醋酸菌（Acetobacter）会在有氧环境下繁殖，将酒精转化为醋酸，让酒变酸。温度越高，醋酸菌繁殖越快。这就是为什么低温保存如此重要。"},
            {"type": "ri", "heading":"🔬 科学解释", "text":"<strong>氧化反应的速率与温度成正比。</strong>温度每升高10°C，氧化速率增加2-3倍。这就是为什么冰箱（4°C）比室温（20°C）能保存更久的原因。"},

            {"type": "h2", "text": "🍷 如何延长开瓶后的保鲜期？"},
            {"type": "p", "text": "以下是一些实用的技巧，帮助你延长开瓶后葡萄酒的保鲜期："},

            {"type": "h3", "text": "方法一：使用真空泵"},
            {"type": "p", "text": "真空泵可以抽出瓶中的空气，减少氧化。这是最简单有效的保鲜方法。市面上的真空泵价格从几十元到几百元不等，推荐购买带有真空塞的套装。"},
            {"type": "ri", "heading":"使用步骤", "text":"1. 将真空塞插入酒瓶\n2. 用真空泵抽出空气（通常需要抽15-20下）\n3. 听到泵自动停止的声音，说明已经达到真空状态\n4. 放入冰箱保存"},

            {"type": "h3", "text": "方法二：换瓶保存"},
            {"type": "p", "text": "将剩余的酒倒入一个小酒瓶中，尽量装满，然后密封保存。这样可以减少瓶中空气的体积，延缓氧化。"},
            {"type": "ri", "heading":"换瓶技巧", "text":"<strong>选择与剩余酒量匹配的小酒瓶。</strong>例如，如果你只剩半瓶酒，就用半瓶容量的容器保存。瓶中空气越少，保鲜时间越长。"},

            {"type": "h3", "text": "方法三：使用惰性气体"},
            {"type": "p", "text": "惰性气体（如氩气或氮气）可以覆盖在酒液表面，隔绝氧气。专业酒吧常用这种方法，家用版本也可以买到。"},

            {"type": "h3", "text": "方法四：低温保存"},
            {"type": "p", "text": "无论使用哪种方法，低温保存都是基础。将开瓶的葡萄酒放入冰箱（4-8°C），可以显著延长保鲜时间。"},
            {"type": "tip", "heading":"⚠️ 注意事项", "text":"<strong>红葡萄酒开瓶后放入冰箱前，不需要回温。</strong>直接放入冰箱，饮用前提前15-30分钟取出即可。低温不会损害红葡萄酒的品质，反而能保持其新鲜度。"},

            {"type": "sep"},
            {"type": "h2", "text": "🚫 如何判断酒是否变质？"},
            {"type": "p", "text": "即使采取了保鲜措施，葡萄酒最终还是会变质。以下是一些判断酒是否变质的方法："},
            {"type": "list", "items": [
                "<strong>闻起来像醋或指甲油</strong>——这是醋酸菌繁殖的标志，酒已经变质",
                "<strong>颜色变深或变棕</strong>——严重氧化的迹象",
                "<strong>口感变得尖锐、酸涩</strong>——酒的平衡已被破坏",
                "<strong>失去果香，只有酒精味</strong>——香气已经流失",
                "<strong>出现霉味或湿纸板味</strong>——软木塞污染（虽然开瓶后较少见）"
            ]},
            {"type": "tip", "heading":"💡 小贴士", "text":"<strong>不确定是否变质？闻一下。</strong>如果闻起来有任何不愉快的气味，就不要喝了。变质的酒虽然不会对健康造成危害，但口感会很差。"},

            {"type": "h2", "text": "📅 各类酒款的最佳饮用时间"},
            {"type": "p", "text": "以下是一些常见酒款开瓶后的最佳饮用时间窗口："},
            {"type": "item", "text": "清爽型白葡萄酒（长相思、雷司令）", "info": "开瓶后1-3天内饮用最佳。这些酒以新鲜果香为特色，放置太久会失去活力。", "price": "最佳：当天-3天", "tag": "趁新鲜"},
            {"type": "item", "text": "饱满型白葡萄酒（霞多丽）", "info": "开瓶后3-5天内饮用。经过橡木桶陈年的霞多丽，结构更稳定，可以保存更久。", "price": "最佳：1-5天", "tag": "较稳定"},
            {"type": "item", "text": "轻盈型红葡萄酒（黑皮诺、佳美）", "info": "开瓶后2-3天内饮用。这些酒的单宁较少，更容易氧化。", "price": "最佳：1-3天", "tag": "尽快饮用"},
            {"type": "item", "text": "饱满型红葡萄酒（赤霞珠、西拉）", "info": "开瓶后3-5天内饮用。高单宁和高酒精度提供了更好的抗氧化能力。", "price": "最佳：2-5天", "tag": "较耐放"},
            {"type": "item", "text": "起泡酒（香槟、Prosecco）", "info": "开瓶后1天内饮用。气泡流失后，口感会大打折扣。使用起泡酒塞可以延长到2-3天。", "price": "最佳：当天", "tag": "气泡是关键"},
            {"type": "item", "text": "加强酒（波特、雪莉）", "info": "开瓶后可以保存2-4周。高酒精度和糖分提供了天然的防腐能力。", "price": "最佳：1-4周", "tag": "最耐放"},

            {"type": "sep"},
            {"type": "h2", "text": "🎯 总结：开瓶后的黄金法则"},
            {"type": "p", "text": "记住这几个简单的原则，就能让开瓶后的葡萄酒保持最佳状态："},
            {"type": "list", "items": [
                "<strong>冰箱是你最好的朋友</strong>——无论红白，开瓶后都放入冰箱",
                "<strong>真空泵是必备工具</strong>——投资一个真空泵，能省下很多酒",
                "<strong>尽快饮用</strong>——开瓶后的酒，最好在3天内喝完",
                "<strong>相信你的鼻子</strong>——闻到不愉快的气味，就不要喝了",
                "<strong>小瓶分装</strong>——如果喝不完，分成小瓶保存"
            ]},

            {"type": "end", "text": "你有什么保存开瓶葡萄酒的独门秘诀？<br/>欢迎在评论区分享你的经验和推荐工具！"}
        ])
