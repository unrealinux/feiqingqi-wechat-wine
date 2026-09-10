#!/usr/bin/env python3
"""Build wine storage guide article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#2e7d32',
        ['葡萄酒储存指南', '如何保存好酒'],
        '让你的好酒保持最佳状态',
        '红樽坊 | 实用指南')

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
    console.log('Storage, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Storage:', e.message);
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
    build_article('wine_storage_real',
        title='葡萄酒储存指南：如何保存好酒',
        digest='买了很多酒却不知道怎么储存？从温度到湿度，从光照到震动，这篇指南教你正确储存葡萄酒。',
        category='practical-guide',
        tags=['储存','保存','酒柜','温度','湿度'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒储存指南：如何保存好酒"},
            {"type": "subtitle", "text": "让你的好酒保持最佳状态"},
            {"type": "lead", "text": "买了很多酒却不知道怎么储存？从温度到湿度，从光照到震动，这篇指南教你正确储存葡萄酒，让你的好酒保持最佳状态。"},

            {"type": "h2", "text": "🌡️ 温度：最重要的因素"},
            {"type": "p", "text": "温度是储存葡萄酒最重要的因素："},
            {"type": "list", "items": [
                "<strong>最佳温度</strong>——12-14°C",
                "<strong>可接受范围</strong>——10-18°C",
                "<strong>避免</strong>——温度波动大、高于20°C、低于5°C",
                "<strong>原因</strong>——温度过高加速陈年，过低冻裂酒瓶"
            ]},

            {"type": "h2", "text": "💧 湿度：保持软木塞"},
            {"type": "p", "text": "湿度也很重要："},
            {"type": "list", "items": [
                "<strong>最佳湿度</strong>——60-70%",
                "<strong>避免</strong>——湿度过低导致软木塞干裂，过高导致酒标发霉",
                "<strong>方法</strong>——在酒柜中放一碗水，保持湿度"
            ]},

            {"type": "h2", "text": "🌑 光照：避免紫外线"},
            {"type": "p", "text": "光照会损害酒质："},
            {"type": "list", "items": [
                "<strong>避免</strong>——阳光直射、荧光灯",
                "<strong>原因</strong>——紫外线会分解酒中的有机化合物",
                "<strong>方法</strong>——存放在阴暗处，或使用防紫外线酒柜"
            ]},

            {"type": "h2", "text": "📳 震动：减少晃动"},
            {"type": "p", "text": "震动会影响酒质："},
            {"type": "list", "items": [
                "<strong>避免</strong>——频繁移动、放在冰箱门上",
                "<strong>原因</strong>——震动会加速陈年，破坏酒液结构",
                "<strong>方法</strong>——存放在稳定的地方，不要频繁移动"
            ]},

            {"type": "h2", "text": "🍷 摆放方式"},
            {"type": "p", "text": "正确的摆放方式："},
            {"type": "ri", "heading":"软木塞酒", "text":"<strong>方式：</strong>横放或斜放\n<strong>原因：</strong>保持软木塞湿润，防止空气进入\n<strong>注意：</strong>长期储存必须横放"},
            {"type": "ri", "heading":"螺旋盖酒", "text":"<strong>方式：</strong>可以直立存放\n<strong>原因：</strong>螺旋盖不需要保持湿润\n<strong>注意：</strong>直立存放更节省空间"},

            {"type": "h2", "text": "📊 不同场景的储存方案"},
            {"type": "table", "headers": ["场景", "方案", "预算"],
             "rows": [
                 ["有酒柜", "专业恒温酒柜", "已有"],
                 ["无酒柜", "阴暗角落+横放", "0元"],
                 ["少量存酒", "冰箱冷藏层（临时）", "0元"],
                 ["长期存酒", "专业酒窖或高端酒柜", "2000元+"],
                 ["旅行携带", "便携酒袋+保温", "50-100元"]
             ]},

            {"type": "h2", "text": "🚫 储存禁忌"},
            {"type": "p", "text": "储存葡萄酒时，这些禁忌要避免："},
            {"type": "list", "items": [
                "<strong>不要放在厨房</strong>——温度变化大",
                "<strong>不要放在阳台</strong>——阳光直射",
                "<strong>不要放在冰箱门上</strong>——震动大",
                "<strong>不要竖放软木塞酒</strong>——软木塞会干裂",
                "<strong>不要频繁移动</strong>——震动影响酒质"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'储存是保存好酒的关键。'"},
            {"type": "p", "text": "正确的储存方式可以让你的好酒保持最佳状态。记住温度、湿度、光照、震动这四个关键因素。"},

            {"type": "end", "text": "你平时怎么储存葡萄酒？<br/>你有什么储存小技巧？<br/>欢迎在评论区分享！"}
        ])
