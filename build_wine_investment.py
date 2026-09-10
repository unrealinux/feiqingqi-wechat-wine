#!/usr/bin/env python3
"""Build wine investment guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#263238',
        ['葡萄酒投资入门', '哪些酒值得买来升值？'],
        '不只是喝，还能赚钱',
        '红樽坊 | 投资指南')

    html = rich_article(content_blocks, primary='#263238', secondary='#78909c')
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
    console.log('Wine Investment, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Investment:', e.message);
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
    build_article('wine_investment',
        title='葡萄酒投资入门：哪些酒值得买来升值？',
        digest='葡萄酒不只是喝，还能投资增值。从拉菲到康帝，哪些酒值得买来升值？普通人如何入门葡萄酒投资？',
        category='investment',
        tags=['投资','升值','收藏','理财','名庄'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒投资入门：哪些酒值得买来升值？"},
            {"type": "subtitle", "text": "不只是喝，还能赚钱"},
            {"type": "lead", "text": "你知道吗？一瓶1982年的拉菲，当年售价不到100美元，如今市场价超过5000美元。葡萄酒不只是饮品，更是一种另类投资。普通人如何入门？这篇指南告诉你。"},

            {"type": "h2", "text": "📈 葡萄酒投资的潜力"},
            {"type": "p", "text": "根据伦敦国际葡萄酒交易所（Liv-ex）的数据，顶级葡萄酒指数在过去20年里的年化收益率约为8-12%，跑赢了同期的黄金和部分股票指数。"},
            {"type": "p", "text": "葡萄酒投资的魅力在于：它同时具备使用价值和投资价值。你可以喝掉它，也可以储存它等升值。即使不升值，你也享受了美酒。"},

            {"type": "h2", "text": "🍷 哪些酒值得投资？"},
            {"type": "p", "text": "不是所有葡萄酒都适合投资。只有那些具有陈年潜力、品牌价值高、产量有限的酒款，才有可能升值。"},

            {"type": "ri", "heading":"第一梯队：波尔多五大名庄", "text":"<strong>拉菲（Lafite）、木桐（Mouton）、玛歌（Margaux）、侯伯王（Haut-Brion）、拉图（Latour）</strong>\n\n这五家酒庄是波尔多的顶级名庄，也是全球最具投资价值的酒款。尤其是好年份的酒，升值潜力巨大。\n\n<strong>投资门槛：</strong>单瓶3000-10000元"},

            {"type": "ri", "heading":"第二梯队：勃艮第特级园", "text":"<strong>罗曼尼·康帝（Romanée-Conti）、李奇堡（Richebourg）、香贝丹（Chambertin）等</strong>\n\n勃艮第的特级园葡萄酒，是全球最贵的酒款。罗曼尼·康帝的年产量只有6000瓶，价格可达数万美元。\n\n<strong>投资门槛：</strong>单瓶10000元以上"},

            {"type": "ri", "heading":"第三梯队：意大利超级托斯卡纳", "text":"<strong>西施佳雅（Sassicaia）、天娜（Tignanello）、奥纳亚（Ornellaia）等</strong>\n\n这些是意大利的顶级酒款，品质极高，价格相对波尔多和勃艮第更亲民。\n\n<strong>投资门槛：</strong>单瓶1000-5000元"},

            {"type": "ri", "heading":"第四梯队：美国膜拜酒", "text":"<strong>作品一号（Opus One）、啸鹰（Screaming Eagle）、哈兰（Harlan）等</strong>\n\n这些是美国的顶级酒款，产量极小，价格极高，是收藏家的最爱。\n\n<strong>投资门槛：</strong>单瓶3000-20000元"},

            {"type": "h2", "text": "📊 如何判断酒的升值潜力？"},
            {"type": "p", "text": "判断一款酒是否值得投资，需要考虑以下几个因素："},
            {"type": "list", "items": [
                "<strong>品牌价值</strong>——名庄酒的升值潜力远大于普通酒",
                "<strong>年份质量</strong>——好年份的酒才值得陈年和投资",
                "<strong>产量稀缺</strong>——产量越少，升值空间越大",
                "<strong>陈年潜力</strong>——能陈年10年以上的酒才有投资价值",
                "<strong>市场认可度</strong>——在国际市场上有交易记录的酒款更安全"
            ]},

            {"type": "h2", "text": "💰 普通人如何入门？"},
            {"type": "p", "text": "葡萄酒投资并不只是富豪的游戏。普通人也可以从以下几个方面入手："},

            {"type": "ri", "heading":"入门策略一：从百元酒开始", "text":"<strong>投资门槛：¥100-500/瓶</strong>\n\n不需要一开始就买名庄。可以从一些有升值潜力的百元酒开始，积累经验和信心。\n\n<strong>推荐酒款：</strong>\n• 宁夏贺兰山东麓的顶级酒款\n• 智利的高端酒款（如活灵魂）\n• 澳大利亚的高端西拉"},

            {"type": "ri", "heading":"入门策略二：投资期酒", "text":"<strong>投资门槛：¥2000-10000/箱</strong>\n\n期酒（En Primeur）是在葡萄酒装瓶前购买的制度。价格通常比装瓶后低30-50%，但需要等待2-3年才能拿到酒。\n\n<strong>优点：</strong>价格低，升值空间大\n<strong>缺点：</strong>需要等待，有风险"},

            {"type": "ri", "heading":"入门策略三：购买名庄副牌", "text":"<strong>投资门槛：¥500-2000/瓶</strong>\n\n名庄的副牌酒（Second Wine）价格比正牌低很多，但品质也有保障，具有一定的升值潜力。\n\n<strong>推荐酒款：</strong>\n• 小拉菲（Carruades de Lafite）\n• 小木桐（Le Petit Mouton）\n• 小玛歌（Pavillon Rouge）"},

            {"type": "h2", "text": "⚠️ 投资风险提醒"},
            {"type": "p", "text": "葡萄酒投资虽然有潜力，但也存在风险："},
            {"type": "list", "items": [
                "<strong>储存风险</strong>——温度、湿度、光线都会影响酒的品质",
                "<strong>流动性风险</strong>——葡萄酒不像股票，不能随时卖出",
                "<strong>假酒风险</strong>——市场上存在大量假酒，需要从正规渠道购买",
                "<strong>市场风险</strong>——葡萄酒市场也会波动，不是只涨不跌",
                "<strong>政策风险</strong>——进口关税、税收政策变化会影响价格"
            ]},

            {"type": "h2", "text": "🔧 投资必备工具"},
            {"type": "p", "text": "如果你想认真做葡萄酒投资，这些工具是必备的："},
            {"type": "list", "items": [
                "<strong>Liv-ex交易平台</strong>——全球最大的葡萄酒交易平台，可以实时查看市场价格",
                "<strong>Wine-Searcher</strong>——全球葡萄酒价格比较网站",
                "<strong>Vivino</strong>——葡萄酒评分和社区",
                "<strong>专业酒柜</strong>——恒温恒湿的储存环境是基础",
                "<strong>保险</strong>——高价值的酒款需要购买保险"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'葡萄酒投资的最高境界，是喝掉最贵的那瓶，剩下的留给时间。'"},
            {"type": "p", "text": "葡萄酒投资不是一夜暴富的工具，而是一种长期的、有乐趣的投资方式。如果你热爱葡萄酒，不妨从今天开始，为你的酒柜增加一些'资产'。"},

            {"type": "end", "text": "你有葡萄酒投资的经验吗？<br/>你觉得哪些酒值得投资？<br/>欢迎在评论区分享你的看法！"}
        ])
