#!/usr/bin/env python3
"""Build AI winemaker article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#0d47a1',
        ['葡萄酒的未来', 'AI酿酒师时代'],
        '机器能酿出好酒吗',
        '红樽坊 | 未来趋势')

    html = rich_article(content_blocks, primary='#0d47a1', secondary='#42a5f5')
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
    console.log('AI, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('AI:', e.message);
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
    build_article('ai_winemaker',
        title='葡萄酒的未来：AI酿酒师时代来了',
        digest='机器能酿出好酒吗？AI正在改变葡萄酒行业，从葡萄种植到酿造，AI无处不在。',
        category='trends',
        tags=['AI','科技','未来','趋势','创新'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒的未来：AI酿酒师时代"},
            {"type": "subtitle", "text": "机器能酿出好酒吗"},
            {"type": "lead", "text": "机器能酿出好酒吗？AI正在改变葡萄酒行业，从葡萄种植到酿造，AI无处不在。这篇指南带你了解AI如何改变葡萄酒的未来。"},

            {"type": "h2", "text": "🤖 AI在葡萄酒行业的应用"},
            {"type": "p", "text": "AI正在改变葡萄酒行业的方方面面："},
            {"type": "list", "items": [
                "<strong>葡萄种植</strong>——AI可以监测葡萄园，预测病虫害",
                "<strong>采摘决策</strong>——AI可以分析葡萄成熟度，决定最佳采摘时间",
                "<strong>酿造过程</strong>——AI可以控制发酵过程，优化酿造参数",
                "<strong>品质检测</strong>——AI可以检测酒质，预测酒的风味",
                "<strong>市场预测</strong>——AI可以预测市场需求，优化定价"
            ]},

            {"type": "h2", "text": "🍷 AI酿酒师的优势"},
            {"type": "p", "text": "AI酿酒师有什么优势？"},
            {"type": "ri", "heading":"优势一：精准控制", "text":"<strong>优势：</strong>AI可以精准控制温度、湿度、发酵时间\n<strong>例子：</strong>AI可以将发酵温度控制在0.1度以内\n<strong>好处：</strong>酒质更稳定，品质更一致"},
            {"type": "ri", "heading":"优势二：数据分析", "text":"<strong>优势：</strong>AI可以分析大量数据，做出最优决策\n<strong>例子：</strong>AI可以分析历史数据，预测最佳酿造参数\n<strong>好处：</strong>减少人为错误，提高效率"},
            {"type": "ri", "heading":"优势三：24小时监控", "text":"<strong>优势：</strong>AI可以24小时监控，不会疲劳\n<strong>例子：</strong>AI可以连续监控发酵过程\n<strong>好处：</strong>及时发现问题，避免损失"},

            {"type": "h2", "text": "🤔 AI酿酒师的劣势"},
            {"type": "p", "text": "AI酿酒师有什么劣势？"},
            {"type": "list", "items": [
                "<strong>缺乏创造力</strong>——AI只能按程序运行，缺乏创造力",
                "<strong>缺乏经验</strong>——AI没有人类的经验和直觉",
                "<strong>成本高</strong>——AI系统的成本很高",
                "<strong>依赖数据</strong>——AI需要大量数据才能工作",
                "<strong>缺乏人情味</strong>——AI酿的酒缺乏人情味"
            ]},

            {"type": "h2", "text": "🌍 AI酿酒师的案例"},
            {"type": "p", "text": "AI酿酒师已经在实际应用中："},
            {"type": "list", "items": [
                "<strong>波尔多</strong>——有些酒庄已经开始使用AI监控葡萄园",
                "<strong>纳帕谷</strong>——有些酒庄使用AI优化酿造过程",
                "<strong>澳大利亚</strong>——有些酒庄使用AI预测市场需求",
                "<strong>中国</strong>——有些酒庄开始尝试AI酿酒"
            ]},

            {"type": "h2", "text": "📊 AI vs 人类酿酒师"},
            {"type": "table", "headers": ["方面", "AI酿酒师", "人类酿酒师"],
             "rows": [
                 ["精准度", "★★★★★", "★★★☆☆"],
                 ["创造力", "★☆☆☆☆", "★★★★★"],
                 ["经验", "★★☆☆☆", "★★★★★"],
                 ["成本", "★★☆☆☆", "★★★★☆"],
                 ["效率", "★★★★★", "★★★☆☆"],
                 ["人情味", "★☆☆☆☆", "★★★★★"]
             ]},

            {"type": "h2", "text": "💡 AI酿酒的未来"},
            {"type": "p", "text": "AI酿酒的未来会怎样？"},
            {"type": "list", "items": [
                "<strong>人机协作</strong>——AI辅助人类酿酒师，而不是取代",
                "<strong>个性化酿造</strong>——AI可以根据个人口味定制酒款",
                "<strong>智能葡萄园</strong>——AI可以完全自动化管理葡萄园",
                "<strong>品质预测</strong>——AI可以预测酒的品质和风味",
                "<strong>市场预测</strong>——AI可以预测市场需求，优化生产"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'AI不会取代人类酿酒师，但会改变酿酒的方式。'"},
            {"type": "p", "text": "AI正在改变葡萄酒行业，但人类酿酒师的经验和创造力仍然不可替代。未来的葡萄酒行业，将是人机协作的时代。"},

            {"type": "end", "text": "你愿意喝AI酿的酒吗？<br/>你觉得AI会取代人类酿酒师吗？<br/>欢迎在评论区分享你的看法！"}
        ])
