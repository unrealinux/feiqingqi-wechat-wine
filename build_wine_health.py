#!/usr/bin/env python3
"""Build wine health article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1b5e20',
        ['葡萄酒与健康', '喝多少才合适？'],
        '科学饮酒指南',
        '红樽坊 | 健康指南')

    html = rich_article(content_blocks, primary='#1b5e20', secondary='#66bb6a')
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
    console.log('Health, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Health:', e.message);
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
    build_article('wine_health',
        title='葡萄酒与健康：喝多少才合适？',
        digest='适量饮酒有益健康？喝多少才算适量？科学告诉你答案。',
        category='health',
        tags=['健康','适量','科学','饮酒','养生'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒与健康：喝多少才合适？"},
            {"type": "subtitle", "text": "科学饮酒指南"},
            {"type": "lead", "text": "适量饮酒有益健康？喝多少才算适量？科学告诉你答案。这篇指南帮你了解葡萄酒与健康的关系。"},

            {"type": "h2", "text": "🍷 葡萄酒的健康益处"},
            {"type": "p", "text": "适量饮酒确实有益健康："},
            {"type": "list", "items": [
                "<strong>心血管健康</strong>——适量饮酒可以降低心脏病风险",
                "<strong>抗氧化</strong>——葡萄酒中的多酚有抗氧化作用",
                "<strong>延长寿命</strong>——研究表明适量饮酒可以延长寿命",
                "<strong>社交健康</strong>——适量饮酒可以促进社交"
            ]},

            {"type": "h2", "text": "📏 多少才算适量？"},
            {"type": "p", "text": "科学定义的适量饮酒："},
            {"type": "table", "headers": ["性别", "适量标准", "说明"],
             "rows": [
                 ["男性", "每天不超过2杯", "1杯约150ml"],
                 ["女性", "每天不超过1杯", "1杯约150ml"],
                 ["老年人", "每天不超过1杯", "身体机能下降"],
                 ["孕妇", "零", "绝对不能饮酒"]
             ]},

            {"type": "h2", "text": "⚠️ 过量饮酒的危害"},
            {"type": "p", "text": "过量饮酒的危害："},
            {"type": "list", "items": [
                "<strong>肝脏损伤</strong>——过量饮酒会损伤肝脏",
                "<strong>心血管疾病</strong>——过量饮酒会增加心脏病风险",
                "<strong>癌症风险</strong>——过量饮酒会增加癌症风险",
                "<strong>精神健康</strong>——过量饮酒会影响精神健康",
                "<strong>社交问题</strong>——过量饮酒会导致社交问题"
            ]},

            {"type": "h2", "text": "💡 科学饮酒的建议"},
            {"type": "p", "text": "科学饮酒的建议："},
            {"type": "list", "items": [
                "<strong>控制量</strong>——每天不超过1-2杯",
                "<strong>配餐饮用</strong>——不要空腹喝酒",
                "<strong>慢慢喝</strong>——不要干杯，慢慢品味",
                "<strong>选择好酒</strong>——质量比数量更重要",
                "<strong>不要天天喝</strong>——每周最多5天，留2天休息"
            ]},

            {"type": "h2", "text": "🚫 这些人不能喝酒"},
            {"type": "p", "text": "这些人绝对不能喝酒："},
            {"type": "list", "items": [
                "<strong>孕妇</strong>——酒精会影响胎儿发育",
                "<strong>哺乳期</strong>——酒精会通过母乳传递给婴儿",
                "<strong>肝病患者</strong>——酒精会加重肝脏负担",
                "<strong>服药期间</strong>——酒精可能与药物相互作用",
                "<strong>酒精过敏者</strong>——酒精会引起过敏反应"
            ]},

            {"type": "h2", "text": "📊 饮酒量速查表"},
            {"type": "table", "headers": ["场景", "建议量", "注意"],
             "rows": [
                 ["日常饮用", "1杯/天", "配餐饮用"],
                 ["聚会", "2-3杯", "不要过量"],
                 ["庆祝", "3-4杯", "注意安全"],
                 ["独自", "1杯", "适量即可"],
                 ["驾车", "零", "喝酒不开车"]
             ]},

            {"type": "sep"},
            {"type": "quote", "text": "'适量饮酒，享受生活。'"},
            {"type": "p", "text": "葡萄酒与健康的关系是复杂的。适量饮酒有益健康，但过量饮酒有害。关键是控制量，享受喝酒的乐趣。"},

            {"type": "end", "text": "你平时喝多少酒？<br/>你有什么饮酒习惯？<br/>欢迎在评论区分享！"}
        ])
