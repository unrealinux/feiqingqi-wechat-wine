#!/usr/bin/env python3
"""Build wines that changed history article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#3e2723',
        ['那些改变历史的葡萄酒', '杯中的历史'],
        '每一瓶都有故事',
        '红樽坊 | 历史故事')

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
    console.log('History, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('History:', e.message);
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
    build_article('wine_history',
        title='那些改变历史的葡萄酒：杯中的历史',
        digest='82年拉菲为什么这么出名？巴黎审判是怎么回事？这些改变历史的葡萄酒，每一瓶都有故事。',
        category='culture',
        tags=['历史','故事','82年拉菲','巴黎审判','传奇'],
        content_blocks=[
            {"type": "title", "text": "那些改变历史的葡萄酒"},
            {"type": "subtitle", "text": "杯中的历史"},
            {"type": "lead", "text": "82年拉菲为什么这么出名？巴黎审判是怎么回事？这些改变历史的葡萄酒，每一瓶都有故事。这篇指南带你了解葡萄酒历史上的传奇故事。"},

            {"type": "h2", "text": "📜 巴黎审判：1976年"},
            {"type": "p", "text": "1976年的巴黎审判，改变了葡萄酒的历史："},
            {"type": "list", "items": [
                "<strong>背景</strong>——法国酒和美国酒的对决",
                "<strong>结果</strong>——美国酒击败了法国酒",
                "<strong>影响</strong>——新世界酒崛起，法国酒衰落",
                "<strong>意义</strong>——证明了好酒不只在法国"
            ]},

            {"type": "h2", "text": "🍷 82年拉菲：传奇年份"},
            {"type": "p", "text": "82年拉菲为什么这么出名？"},
            {"type": "ri", "heading":"传奇故事", "text":"<strong>年份：</strong>1982年\n<strong>产区：</strong>波尔多波亚克\n<strong>评分：</strong>满分100分\n<strong>价格：</strong>从几百元涨到几万元\n\n<strong>出名原因：</strong>电影《赌神》中周润发喝82年拉菲，让它在中国家喻户晓"},
            {"type": "ri", "heading":"真实品质", "text":"<strong>品质：</strong>确实优秀，但不值这个价\n<strong>适饮期：</strong>已经过了最佳适饮期\n<strong>真相：</strong>82年拉菲的成功更多是营销和稀缺性的结果"},

            {"type": "h2", "text": "👑 玛歌酒庄：皇室之酒"},
            {"type": "p", "text": "玛歌酒庄为什么是皇室之酒？"},
            {"type": "list", "items": [
                "<strong>历史</strong>——玛歌酒庄有400年历史",
                "<strong>皇室</strong>——曾是法国皇室的御用酒",
                "<strong>品质</strong>——品质一直很稳定",
                "<strong>地位</strong>——是波尔多五大名庄之一"
            ]},

            {"type": "h2", "text": "🏛️ 拉图尔酒庄：国王之酒"},
            {"type": "p", "text": "拉图尔酒庄为什么是国王之酒？"},
            {"type": "list", "items": [
                "<strong>历史</strong>——拉图尔酒庄有400年历史",
                "<strong>国王</strong>——曾是英国国王的御用酒",
                "<strong>品质</strong>——品质一直很稳定",
                "<strong>地位</strong>——是波尔多五大名庄之一"
            ]},

            {"type": "h2", "text": "🌟 木桐酒庄：艺术之酒"},
            {"type": "p", "text": "木桐酒庄为什么是艺术之酒？"},
            {"type": "list", "items": [
                "<strong>艺术</strong>——每年邀请艺术家设计酒标",
                "<strong>收藏</strong>——酒标具有收藏价值",
                "<strong>创新</strong>——木桐酒庄是五大名庄中最具创新精神的",
                "<strong>故事</strong>——创始人罗斯柴尔德男爵的故事很传奇"
            ]},

            {"type": "h2", "text": "📖 葡萄酒历史大事记"},
            {"type": "table", "headers": ["年份", "事件", "影响"],
             "rows": [
                 ["公元前6000年", "格鲁吉亚发现最早葡萄酒", "葡萄酒起源"],
                 ["公元前3000年", "埃及开始酿造葡萄酒", "葡萄酒传播"],
                 ["公元前500年", "希腊开始种植葡萄", "葡萄酒文化"],
                 ["公元1世纪", "罗马帝国推广葡萄酒", "葡萄酒普及"],
                 ["1855年", "波尔多分级制度建立", "葡萄酒分级"],
                 ["1976年", "巴黎审判", "新世界酒崛起"],
                 ["1982年", "波尔多传奇年份", "名庄酒炒作"],
                 ["2000年", "中国葡萄酒崛起", "中国葡萄酒发展"]
             ]},

            {"type": "h2", "text": "💡 这些故事的启示"},
            {"type": "p", "text": "这些故事告诉我们什么？"},
            {"type": "list", "items": [
                "<strong>好酒不只在法国</strong>——新世界酒也有好酒",
                "<strong>品质很重要</strong>——品质是酒庄立足之本",
                "<strong>故事很重要</strong>——好故事可以提升酒的价值",
                "<strong>营销很重要</strong>——营销可以让酒更出名",
                "<strong>稀缺性很重要</strong>——稀缺性可以提升酒的价值"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'每一瓶酒，都有一个故事。'"},
            {"type": "p", "text": "葡萄酒的历史就是人类的历史。每一瓶酒都有故事，了解这些故事，可以让你更懂酒。"},

            {"type": "end", "text": "你知道哪些葡萄酒的历史故事？<br/>你最喜欢的葡萄酒故事是什么？<br/>欢迎在评论区分享你的故事！"}
        ])
