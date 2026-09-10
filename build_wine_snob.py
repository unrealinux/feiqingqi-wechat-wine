#!/usr/bin/env python3
"""Build wine snob hierarchy article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#212121',
        ['葡萄酒鄙视链', '你在哪一层？'],
        '看完扎心了',
        '红樽坊 | 深度观点')

    html = rich_article(content_blocks, primary='#212121', secondary='#616161')
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
    console.log('Snob, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Snob:', e.message);
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
    build_article('wine_snob',
        title='葡萄酒鄙视链：你在哪一层？看完扎心了',
        digest='喝法国的看不起喝美国的，喝勃艮第的看不起喝波尔多的……葡萄酒圈的鄙视链，你在哪一层？',
        category='opinion',
        tags=['鄙视链','观点','争议','吐槽','扎心'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒鄙视链：你在哪一层？"},
            {"type": "subtitle", "text": "看完扎心了"},
            {"type": "lead", "text": "喝法国的看不起喝美国的，喝勃艮第的看不起喝波尔多的，喝名庄的看不起喝普通酒的……葡萄酒圈的鄙视链，比你想象的更真实。你在哪一层？"},

            {"type": "h2", "text": "🔗 鄙视链大揭秘"},
            {"type": "p", "text": "葡萄酒圈的鄙视链，真实存在："},

            {"type": "ri", "heading":"第一层：产区鄙视链", "text":"<strong>法国 > 意大利 > 西班牙 > 美国 > 澳大利亚 > 智利 > 阿根廷 > 中国\n\n<strong>真相：</strong>法国酒真的比其他国家好吗？不一定。但法国酒的历史和名气确实让它站在了鄙视链顶端。\n\n<strong>扎心指数：</strong>⭐⭐⭐⭐⭐"},
            {"type": "ri", "heading":"第二层：子产区鄙视链", "text":"<strong>勃艮第 > 波尔多 > 罗讷河谷 > 卢瓦尔河谷 > 阿尔萨斯\n\n<strong>真相：</strong>勃艮第的黑皮诺和霞多丽确实优雅，但波尔多的赤霞珠和梅洛也很出色。\n\n<strong>扎心指数：</strong>⭐⭐⭐⭐⭐"},
            {"type": "ri", "heading":"第三层：酒庄鄙视链", "text":"<strong>一级庄 > 二级庄 > 列级庄 > 中级庄 > 土豆庄 > 没听过的庄\n\n<strong>真相：</strong>名庄酒确实好，但价格也确实贵。中级庄里也有好酒，只是名气不够。\n\n<strong>扎心指数：</strong>⭐⭐⭐⭐"},
            {"type": "ri", "heading":"第四层：年份鄙视链", "text":"<strong>好年份 > 一般年份 > 差年份 > NV（非年份）\n\n<strong>真相：</strong>年份确实影响酒质，但好年份的差酒不如差年份的好酒。\n\n<strong>扎心指数：</strong>⭐⭐⭐"},
            {"type": "ri", "heading":"第五层：价格鄙视链", "text":"<strong>贵酒 > 便宜酒 > 超市酒 > 网购酒\n\n<strong>真相：</strong>价格不代表一切。100块的酒可能比1000块的酒更适合你。\n\n<strong>扎心指数：</strong>⭐⭐⭐⭐"},

            {"type": "h2", "text": "🤔 为什么会有鄙视链？"},
            {"type": "p", "text": "鄙视链的背后，是这些原因："},
            {"type": "list", "items": [
                "<strong>面子文化</strong>——喝贵酒有面子，喝便宜酒没面子",
                "<strong>知识优越感</strong>——懂酒的人看不起不懂酒的人",
                "<strong>从众心理</strong>——大家都说好，我也说好",
                "<strong>营销洗脑</strong>——酒商的营销让你觉得贵的就是好的",
                "<strong>社交需求</strong>——喝名庄酒可以炫耀"
            ]},

            {"type": "h2", "text": "💀 鄙视链的真相"},
            {"type": "p", "text": "鄙视链的真相是什么？"},
            {"type": "ri", "heading":"真相一：贵的不一定好", "text":"<strong>例子：</strong>1000块的波尔列级庄 vs 100块的智利赤霞珠\n<strong>结果：</strong>很多人喝不出区别\n\n<strong>真相：</strong>价格不代表一切。适合你的才是最好的。"},
            {"type": "ri", "heading":"真相二：名气不代表品质", "text":"<strong>例子：</strong>拉菲 vs 某个不知名的中级庄\n<strong>结果：</strong>中级庄可能更好喝\n\n<strong>真相：</strong>名气是营销出来的，品质才是真实的。"},
            {"type": "ri", "heading":"真相三：个人口味最重要", "text":"<strong>例子：</strong>你觉得好喝 vs 别人觉得好喝\n<strong>结果：</strong>你自己的感受最重要\n\n<strong>真相：</strong>喝酒是为了自己开心，不是为了别人的眼光。"},

            {"type": "h2", "text": "🎯 如何跳出鄙视链？"},
            {"type": "p", "text": "想跳出鄙视链，试试这些方法："},
            {"type": "list", "items": [
                "<strong>盲品</strong>——不看酒标，只看酒液，你会发现很多惊喜",
                "<strong>尝试新酒</strong>——不要只喝熟悉的酒，尝试新的产区和品种",
                "<strong>关注性价比</strong>——不要只看价格，关注性价比",
                "<strong>享受过程</strong>——喝酒是为了开心，不是为了炫耀",
                "<strong>尊重他人</strong>——每个人的口味不同，尊重他人的选择"
            ]},

            {"type": "h2", "text": "🚫 鄙视链的坏处"},
            {"type": "p", "text": "鄙视链有什么坏处？"},
            {"type": "list", "items": [
                "<strong>限制视野</strong>——只喝'高级'酒，错过很多好酒",
                "<strong>增加压力</strong>——为了面子喝贵酒，增加经济压力",
                "<strong>破坏乐趣</strong>——喝酒变成了攀比，失去了乐趣",
                "<strong>伤害感情</strong>——因为酒的不同看法，伤害朋友感情",
                "<strong>误导新人</strong>——让新人觉得喝酒必须喝贵酒"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'喝酒是为了开心，不是为了鄙视别人。'"},
            {"type": "p", "text": "葡萄酒的世界很大，好酒很多。不要被鄙视链限制，找到自己喜欢的酒，享受喝酒的乐趣。"},

            {"type": "end", "text": "你在鄙视链的哪一层？<br/>你有没有被鄙视过？<br/>欢迎在评论区分享你的故事！"}
        ])
