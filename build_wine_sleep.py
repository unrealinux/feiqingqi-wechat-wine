#!/usr/bin/env python3
"""Build wine sleep article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1a237e',
        ['睡前喝葡萄酒', '真的助眠吗？'],
        '科学解读葡萄酒与睡眠的关系',
        '红樽坊 | 健康揭秘')

    html = rich_article(content_blocks, primary='#1a237e', secondary='#3f51b5')
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
    console.log('Wine Sleep, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Sleep:', e.message);
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
    build_article('wine_sleep',
        title='睡前喝葡萄酒真的助眠吗？',
        digest='很多人认为睡前喝一杯葡萄酒能帮助睡眠。但科学研究表明，这个说法可能是个误区。真相到底是什么？',
        category='health',
        tags=['睡眠','助眠','健康','科学','睡前酒'],
        content_blocks=[
            {"type": "title", "text": "睡前喝葡萄酒真的助眠吗？"},
            {"type": "subtitle", "text": "科学解读葡萄酒与睡眠的关系"},
            {"type": "lead", "text": "很多人认为睡前喝一杯葡萄酒能帮助睡眠。但科学研究表明，这个说法可能是个误区。真相到底是什么？这篇指南帮你搞清楚。"},

            {"type": "h2", "text": "🍷 为什么很多人觉得喝酒助眠？"},
            {"type": "p", "text": "喝酒后确实会感到困倦，这是因为酒精有镇静作用。酒精会抑制中枢神经系统，让人感到放松和困倦。"},
            {"type": "p", "text": "但这种'助眠'是假象。酒精虽然能让你更快入睡，但会严重影响睡眠质量。"},

            {"type": "h2", "text": "🔬 科学研究怎么说？"},
            {"type": "ri", "heading":"研究一：酒精会破坏睡眠结构", "text":"<strong>研究机构：</strong>哈佛大学医学院\n<strong>研究发现：</strong>酒精会减少快速眼动睡眠（REM睡眠），这是最有助于恢复精力的睡眠阶段\n<strong>结论：</strong>喝酒后虽然睡得快，但睡眠质量差，第二天醒来会感到疲惫"},
            {"type": "ri", "heading":"研究二：酒精会导致夜间醒来", "text":"<strong>研究机构：</strong>加州大学伯克利分校\n<strong>研究发现：</strong>酒精会导致夜间频繁醒来，尤其是在入睡后的前半夜\n<strong>结论：</strong>喝酒后虽然能入睡，但睡眠不连贯，容易醒来"},
            {"type": "ri", "heading":"研究三：酒精会加重打鼾和睡眠呼吸暂停", "text":"<strong>研究机构：</strong>约翰霍普金斯大学\n<strong>研究发现：</strong>酒精会放松喉部肌肉，加重打鼾和睡眠呼吸暂停\n<strong>结论：</strong>喝酒后打鼾会更严重，影响自己和伴侣的睡眠"},

            {"type": "h2", "text": "📊 喝酒 vs 不喝酒的睡眠对比"},
            {"type": "table", "headers": ["指标", "喝酒后", "不喝酒"],
             "rows": [
                 ["入睡速度", "更快", "正常"],
                 ["睡眠深度", "变浅", "正常"],
                 ["REM睡眠", "减少30-40%", "正常"],
                 ["夜间醒来", "频繁", "偶尔"],
                 ["打鼾", "加重", "正常"],
                 ["第二天状态", "疲惫", "精力充沛"]
             ]},

            {"type": "h2", "text": "⏰ 如果一定要喝，什么时候喝？"},
            {"type": "p", "text": "如果你一定要在睡前喝酒，最好遵循以下原则："},
            {"type": "list", "items": [
                "<strong>提前2-3小时喝</strong>——给身体足够的时间代谢酒精",
                "<strong>控制量</strong>——不超过1杯（150ml葡萄酒）",
                "<strong>选择低度酒</strong>——酒精度低于13%的酒款",
                "<strong>配餐饮用</strong>——食物可以减缓酒精吸收",
                "<strong>不要天天喝</strong>——最多每周2-3次"
            ]},

            {"type": "h2", "text": "💤 更好的助眠方法"},
            {"type": "p", "text": "与其喝酒助眠，不如试试这些更健康的方法："},
            {"type": "list", "items": [
                "<strong>保持规律作息</strong>——每天固定时间睡觉和起床",
                "<strong>睡前放松</strong>——泡个热水澡、听轻音乐、冥想",
                "<strong>避免咖啡因</strong>——下午2点后不喝咖啡和茶",
                "<strong>控制屏幕时间</strong>——睡前1小时不看手机",
                "<strong>保持卧室舒适</strong>——温度、光线、噪音都要适宜",
                "<strong>适量运动</strong>——但不要在睡前3小时内运动"
            ]},

            {"type": "h2", "text": "🍷 如果你想喝葡萄酒放松"},
            {"type": "p", "text": "如果你想喝葡萄酒来放松身心，而不是为了助眠，这里有几个建议："},
            {"type": "ri", "heading":"推荐时间：晚餐时", "text":"<strong>最佳时间：</strong>晚餐时或晚餐后1小时内\n<strong>推荐酒款：</strong>黑皮诺、佳美等轻盈型红酒\n<strong>推荐量：</strong>1-2杯（150-300ml）\n\n在晚餐时喝一杯，配着美食，享受放松的时光。不要把喝酒当成助眠工具。"},

            {"type": "sep"},
            {"type": "quote", "text": "'葡萄酒是用来享受的，不是用来助眠的。与其依赖酒精入睡，不如培养健康的睡眠习惯。'"},
            {"type": "p", "text": "睡前喝葡萄酒助眠，是一个流传很广的误区。虽然酒精确实能让你更快入睡，但它会严重影响睡眠质量。如果你有睡眠问题，建议从改善睡眠习惯入手，而不是依赖酒精。"},

            {"type": "end", "text": "你有睡前喝葡萄酒的习惯吗？<br/>你觉得喝酒后睡眠质量怎么样？<br/>欢迎在评论区分享你的体验！"}
        ])
