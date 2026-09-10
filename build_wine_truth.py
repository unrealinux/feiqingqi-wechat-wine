#!/usr/bin/env python3
"""Build wine truth article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#880e4f',
        ['葡萄酒的真相', '99%的人都被骗了'],
        '别再被这些谎言骗了',
        '红樽坊 | 终极揭秘')

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
    console.log('Truth, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Truth:', e.message);
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
    build_article('wine_truth',
        title='葡萄酒的真相：99%的人都被骗了',
        digest='挂杯就是好酒？越贵越好喝？这些葡萄酒谎言，99%的人都信了。真相可能颠覆你的认知。',
        category='opinion',
        tags=['真相','谎言','误区','颠覆','认知'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒的真相：99%的人都被骗了"},
            {"type": "subtitle", "text": "别再被这些谎言骗了"},
            {"type": "lead", "text": "挂杯就是好酒？越贵越好喝？这些葡萄酒谎言，99%的人都信了。真相可能颠覆你的认知。"},

            {"type": "h2", "text": "🤥 谎言一：挂杯就是好酒"},
            {"type": "p", "text": "很多人认为挂杯就是好酒，这是错的："},
            {"type": "list", "items": [
                "<strong>挂杯是什么</strong>——挂杯是酒液的粘稠度，与酒精和糖分有关",
                "<strong>真相</strong>——挂杯只说明酒精度或糖分高，不代表品质好",
                "<strong>例子</strong>——便宜的甜酒挂杯很好，但品质一般",
                "<strong>结论</strong>——挂杯不是判断酒质的标准"
            ]},

            {"type": "h2", "text": "🤥 谎言二：越贵越好喝"},
            {"type": "p", "text": "很多人认为越贵越好喝，这是错的："},
            {"type": "list", "items": [
                "<strong>价格构成</strong>——价格包括品牌、渠道、税费等",
                "<strong>真相</strong>——100块的酒可能比1000块的酒更适合你",
                "<strong>例子</strong>——很多人喝不出100块和1000块的区别",
                "<strong>结论</strong>——适合你的才是最好的"
            ]},

            {"type": "h2", "text": "🤥 谎言三：法国酒最好"},
            {"type": "p", "text": "很多人认为法国酒最好，这是错的："},
            {"type": "list", "items": [
                "<strong>法国酒</strong>——确实优秀，但不是唯一选择",
                "<strong>真相</strong>——新世界国家的酒性价比更高",
                "<strong>例子</strong>——智利赤霞珠的性价比比波尔多高很多",
                "<strong>结论</strong>——不要只看产区，关注酒质"
            ]},

            {"type": "h2", "text": "🤥 谎言四：老酒一定好"},
            {"type": "p", "text": "很多人认为老酒一定好，这是错的："},
            {"type": "list", "items": [
                "<strong>陈年</strong>——只有好酒才值得陈年",
                "<strong>真相</strong>——大部分酒不适合陈年，应该趁新鲜喝",
                "<strong>例子</strong>——100块的酒陈年5年，可能还不如新鲜喝",
                "<strong>结论</strong>——不是所有酒都值得陈年"
            ]},

            {"type": "h2", "text": "🤥 谎言五：专家说的就是对的"},
            {"type": "p", "text": "很多人迷信专家，这是错的："},
            {"type": "list", "items": [
                "<strong>专家</strong>——专家的评价是主观的",
                "<strong>真相</strong>——专家的口味不代表你的口味",
                "<strong>例子</strong>——专家说好的酒，你可能不喜欢",
                "<strong>结论</strong>——相信自己的舌头"
            ]},

            {"type": "h2", "text": "🤥 谎言六：红酒配牛排最好"},
            {"type": "p", "text": "很多人认为红酒配牛排最好，这是错的："},
            {"type": "list", "items": [
                "<strong>配餐</strong>——配餐要看个人口味",
                "<strong>真相</strong>——白葡萄酒配牛排也可以很好",
                "<strong>例子</strong>——霞多丽配牛排也很美味",
                "<strong>结论</strong>——配餐没有标准答案"
            ]},

            {"type": "h2", "text": "🤥 谎言七：开瓶后要醒酒"},
            {"type": "p", "text": "很多人认为开瓶后都要醒酒，这是错的："},
            {"type": "list", "items": [
                "<strong>醒酒</strong>——只有需要醒的酒才要醒",
                "<strong>真相</strong>——很多酒不需要醒，直接喝更好",
                "<strong>例子</strong>——年轻的黑皮诺不需要醒酒",
                "<strong>结论</strong>——不是所有酒都需要醒酒"
            ]},

            {"type": "h2", "text": "🤥 谎言八：螺旋盖的酒不好"},
            {"type": "p", "text": "很多人认为螺旋盖的酒不好，这是错的："},
            {"type": "list", "items": [
                "<strong>螺旋盖</strong>——螺旋盖只是封装方式",
                "<strong>真相</strong>——螺旋盖的酒品质也可以很好",
                "<strong>例子</strong>——澳大利亚很多好酒用螺旋盖",
                "<strong>结论</strong>——不要以封装方式判断酒质"
            ]},

            {"type": "h2", "text": "📊 谎言 vs 真相"},
            {"type": "table", "headers": ["谎言", "真相"],
             "rows": [
                 ["挂杯就是好酒", "挂杯只说明酒精度或糖分高"],
                 ["越贵越好喝", "适合你的才是最好的"],
                 ["法国酒最好", "新世界酒性价比更高"],
                 ["老酒一定好", "不是所有酒都值得陈年"],
                 ["专家说的就是对的", "相信自己的舌头"],
                 ["红酒配牛排最好", "配餐没有标准答案"],
                 ["开瓶后都要醒酒", "不是所有酒都需要醒酒"],
                 ["螺旋盖的酒不好", "螺旋盖的酒品质也可以很好"]
             ]},

            {"type": "h2", "text": "💡 如何不被骗？"},
            {"type": "p", "text": "想不被骗，试试这些方法："},
            {"type": "list", "items": [
                "<strong>学习知识</strong>——知识是最好的防骗工具",
                "<strong>多喝多比较</strong>——不要只喝一种酒",
                "<strong>相信自己的舌头</strong>——自己的感受最重要",
                "<strong>忽略品牌和评分</strong>——关注酒质，不看名气",
                "<strong>保持理性</strong>——不要被营销忽悠"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'真相是：适合你的才是最好的。'"},
            {"type": "p", "text": "葡萄酒的真相是：没有绝对的标准，适合你的才是最好的。不要被谎言骗了，相信自己的舌头，找到真正适合自己的好酒。"},

            {"type": "end", "text": "你被哪些葡萄酒谎言骗过？<br/>你知道哪些葡萄酒真相？<br/>欢迎在评论区分享你的看法！"}
        ])
