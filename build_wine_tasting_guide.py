#!/usr/bin/env python3
"""Build wine tasting guide article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#6a1b9a',
        ['如何品出好酒', '品酒的正确姿势'],
        '从新手到高手',
        '红樽坊 | 品酒指南')

    html = rich_article(content_blocks, primary='#6a1b9a', secondary='#ab47bc')
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
    console.log('Tasting, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Tasting:', e.message);
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
    build_article('wine_tasting_guide',
        title='如何品出好酒：品酒的正确姿势',
        digest='拿起酒杯就喝？太浪费了！学会正确的品酒姿势，让你从新手变成品酒高手。',
        category='education',
        tags=['品酒','姿势','技巧','入门','提升'],
        content_blocks=[
            {"type": "title", "text": "如何品出好酒：品酒的正确姿势"},
            {"type": "subtitle", "text": "从新手到高手"},
            {"type": "lead", "text": "拿起酒杯就喝？太浪费了！学会正确的品酒姿势，让你从新手变成品酒高手。"},

            {"type": "h2", "text": "🍷 品酒前的准备"},
            {"type": "p", "text": "品酒前要做这些准备："},
            {"type": "list", "items": [
                "<strong>选择合适的酒杯</strong>——红酒用大杯，白酒用小杯",
                "<strong>保持口腔清洁</strong>——品酒前不要吃味道重的东西",
                "<strong>准备水和面包</strong>——用来清洁口腔",
                "<strong>保持安静</strong>——品酒需要专注"
            ]},

            {"type": "h2", "text": "👁️ 第一步：看"},
            {"type": "p", "text": "观察酒的外观："},
            {"type": "list", "items": [
                "<strong>颜色</strong>——红葡萄酒从紫红到砖红，白葡萄酒从浅黄到金黄",
                "<strong>清澈度</strong>——好酒应该是清澈的，没有浑浊",
                "<strong>挂杯</strong>——挂杯说明酒精度或糖分高，不代表品质"
            ]},

            {"type": "h2", "text": "👃 第二步：闻"},
            {"type": "p", "text": "闻酒的香气："},
            {"type": "ri", "heading":"一类香气（来自葡萄）", "text":"<strong>水果香：</strong>樱桃、草莓、黑莓、柑橘\n<strong>花香：</strong>玫瑰、紫罗兰、茉莉\n<strong>草本香：</strong>薄荷、青椒、百里香"},
            {"type": "ri", "heading":"二类香气（来自发酵）", "text":"<strong>酵母香：</strong>面包、饼干、黄油\n<strong>发酵香：</strong>香蕉、梨、菠萝\n<strong>乳酸香：</strong>奶油、酸奶"},
            {"type": "ri", "heading":"三类香气（来自陈年）", "text":"<strong>橡木香：</strong>香草、烟草、巧克力\n<strong>陈年香：</strong>皮革、蘑菇、松露\n<strong>氧化香：</strong>焦糖、坚果、太妃糖"},

            {"type": "h2", "text": "👅 第三步：品"},
            {"type": "p", "text": "品尝酒的口感："},
            {"type": "list", "items": [
                "<strong>甜度</strong>——酒入口时的甜味",
                "<strong>酸度</strong>——酒的清爽感",
                "<strong>单宁</strong>——酒的涩感",
                "<strong>酒体</strong>——酒在口中的重量感",
                "<strong>余味</strong>——咽下后口中残留的味道"
            ]},

            {"type": "h2", "text": "📝 第四步：评"},
            {"type": "p", "text": "综合评价酒的品质："},
            {"type": "list", "items": [
                "<strong>平衡</strong>——各种味道是否和谐",
                "<strong>复杂度</strong>——是否有丰富的层次",
                "<strong>余味</strong>——余味是否持久",
                "<strong>个性</strong>——是否有独特的风格",
                "<strong>整体印象</strong>——你是否喜欢这款酒"
            ]},

            {"type": "h2", "text": "📊 品酒速查表"},
            {"type": "table", "headers": ["步骤", "要点", "注意"],
             "rows": [
                 ["看", "颜色、清澈度", "在白色背景下观察"],
                 ["闻", "一类、二类、三类香气", "先静止闻，再摇杯闻"],
                 ["品", "甜、酸、单宁、酒体", "小口品尝，让酒在口中停留"],
                 ["评", "平衡、复杂度、余味", "综合评价，记录感受"]
             ]},

            {"type": "h2", "text": "💡 品酒小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的品酒更专业："},
            {"type": "list", "items": [
                "<strong>每次品酒后记录</strong>——积累经验",
                "<strong>多喝多比较</strong>——提升味觉敏感度",
                "<strong>不要迷信专家</strong>——相信自己的感受",
                "<strong>享受过程</strong>——品酒是为了开心"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'品酒不是天赋，而是训练。'"},
            {"type": "p", "text": "品酒是可以训练的。多喝多比较，你也能成为品酒高手。"},

            {"type": "end", "text": "你平时怎么品酒？<br/>你有什么品酒技巧？<br/>欢迎在评论区分享！"}
        ])
