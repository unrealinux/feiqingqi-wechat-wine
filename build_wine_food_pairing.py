#!/usr/bin/env python3
"""Build wine food pairing ultimate article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#bf360c',
        ['葡萄酒与美食搭配', '终极搭配指南'],
        '让每一餐都完美',
        '红樽坊 | 美食搭配')

    html = rich_article(content_blocks, primary='#bf360c', secondary='#ff7043')
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
    console.log('Pairing, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Pairing:', e.message);
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
    build_article('wine_food_pairing',
        title='葡萄酒与美食搭配：终极搭配指南',
        digest='中餐配什么酒？西餐配什么酒？这篇终极搭配指南，让你的每一餐都完美。',
        category='food-pairing',
        tags=['搭配','美食','中餐','西餐','配餐'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒与美食搭配：终极搭配指南"},
            {"type": "subtitle", "text": "让每一餐都完美"},
            {"type": "lead", "text": "中餐配什么酒？西餐配什么酒？这篇终极搭配指南，让你的每一餐都完美。"},

            {"type": "h2", "text": "🎯 搭配的基本原则"},
            {"type": "p", "text": "葡萄酒配餐的基本原则："},
            {"type": "list", "items": [
                "<strong>红酒配红肉</strong>——赤霞珠配牛排",
                "<strong>白酒配白肉</strong>——霞多丽配鱼",
                "<strong>起泡酒配海鲜</strong>——香槟配生蚝",
                "<strong>甜酒配甜点</strong>——莫斯卡托配蛋糕",
                "<strong>地域搭配</strong>——当地酒配当地菜"
            ]},

            {"type": "h2", "text": "🥢 中餐搭配"},
            {"type": "p", "text": "中餐如何配酒？"},
            {"type": "ri", "heading":"川菜", "text":"<strong>特点：</strong>麻辣、油腻\n<strong>推荐：</strong>西拉、仙粉黛、桃红\n<strong>理由：</strong>果味浓郁，可以中和辣味"},
            {"type": "ri", "heading":"粤菜", "text":"<strong>特点：</strong>清淡、鲜美\n<strong>推荐：</strong>长相思、霞多丽、黑皮诺\n<strong>理由：</strong>清爽，不会掩盖食材原味"},
            {"type": "ri", "heading":"鲁菜", "text":"<strong>特点：</strong>咸鲜、浓郁\n<strong>推荐：</strong>赤霞珠、西拉、马尔贝克\n<strong>理由：</strong>酒体饱满，可以搭配浓郁口味"},

            {"type": "h2", "text": "🍝 西餐搭配"},
            {"type": "p", "text": "西餐如何配酒？"},
            {"type": "ri", "heading":"牛排", "text":"<strong>推荐：</strong>赤霞珠、马尔贝克\n<strong>理由：</strong>高单宁可以软化肉质"},
            {"type": "ri", "heading":"海鲜", "text":"<strong>推荐：</strong>长相思、霞多丽、香槟\n<strong>理由：</strong>清爽，提升海鲜鲜味"},
            {"type": "ri", "heading":"意大利面", "text":"<strong>推荐：</strong>基安蒂、黑皮诺\n<strong>理由：</strong>酸度可以解腻"},

            {"type": "h2", "text": "📊 搭配速查表"},
            {"type": "table", "headers": ["食材", "推荐酒款", "理由"],
             "rows": [
                 ["牛排", "赤霞珠、马尔贝克", "高单宁软化肉质"],
                 ["鱼", "长相思、霞多丽", "清爽提升鲜味"],
                 ["鸡肉", "黑皮诺、霞多丽", "轻盈不抢味"],
                 ["海鲜", "香槟、雷司令", "清爽解腻"],
                 ["甜点", "莫斯卡托、冰酒", "甜配甜"]
             ]},

            {"type": "h2", "text": "🚫 搭配禁忌"},
            {"type": "p", "text": "搭配时，这些禁忌要避免："},
            {"type": "list", "items": [
                "<strong>不要红酒配海鲜</strong>——单宁会加重腥味",
                "<strong>不要白酒配牛排</strong>——酒体太轻，撑不住",
                "<strong>不要甜酒配咸菜</strong>——味道冲突",
                "<strong>不要高单宁配辣菜</strong>——会加重辣味",
                "<strong>不要忽略个人口味</strong>——自己喜欢最重要"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'搭配没有标准答案，适合你的才是最好的。'"},
            {"type": "p", "text": "葡萄酒配餐是一门艺术，没有绝对的标准。多尝试，找到最适合自己的搭配。"},

            {"type": "end", "text": "你有什么搭配经验？<br/>你最喜欢的搭配是什么？<br/>欢迎在评论区分享！"}
        ])
