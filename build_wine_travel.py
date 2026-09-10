#!/usr/bin/env python3
"""Build wine travel map article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260616'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#00838f',
        ['全球葡萄酒地图', '葡萄酒旅行指南'],
        '去产区朝圣',
        '红樽坊 | 旅行指南')

    html = rich_article(content_blocks, primary='#00838f', secondary='#26c6da')
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
    console.log('Travel, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Travel:', e.message);
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
    build_article('wine_travel',
        title='全球葡萄酒地图：葡萄酒旅行指南',
        digest='从波尔多到纳帕谷，从勃艮第到巴罗萨，全球最值得去的葡萄酒产区。',
        category='travel',
        tags=['旅行','产区','全球','地图','朝圣'],
        content_blocks=[
            {"type": "title", "text": "全球葡萄酒地图：葡萄酒旅行指南"},
            {"type": "subtitle", "text": "去产区朝圣"},
            {"type": "lead", "text": "从波尔多到纳帕谷，从勃艮第到巴罗萨，全球最值得去的葡萄酒产区。这篇指南帮你规划葡萄酒之旅。"},

            {"type": "h2", "text": "🌍 欧洲：葡萄酒的故乡"},
            {"type": "p", "text": "欧洲是葡萄酒的故乡，最值得去的产区："},

            {"type": "ri", "heading":"法国波尔多", "text":"<strong>特色：</strong>五大名庄、左岸右岸\n<strong>最佳时间：</strong>9-10月（葡萄采摘季）\n<strong>必去：</strong>拉菲、拉图、玛歌酒庄\n<strong>体验：</strong>酒庄参观、品酒、美食"},
            {"type": "ri", "heading":"法国勃艮第", "text":"<strong>特色：</strong>黑皮诺、霞多丽、特级园\n<strong>最佳时间：</strong>9-10月\n<strong>必去：</strong>罗曼尼康帝、蒙哈榭\n<strong>体验：</strong>酒庄参观、品酒、美食"},
            {"type": "ri", "heading":"意大利托斯卡纳", "text":"<strong>特色：</strong>基安蒂、布鲁内洛、超级托斯卡纳\n<strong>最佳时间：</strong>5-10月\n<strong>必去：</strong>安东尼世家、西施佳雅\n<strong>体验：</strong>酒庄参观、品酒、美食"},

            {"type": "h2", "text": "🌎 新世界：创新与传统"},
            {"type": "p", "text": "新世界国家的葡萄酒产区："},

            {"type": "ri", "heading":"美国纳帕谷", "text":"<strong>特色：</strong>赤霞珠、创新精神\n<strong>最佳时间：</strong>9-10月\n<strong>必去：</strong>作品一号、啸鹰\n<strong>体验：</strong>酒庄参观、品酒、美食"},
            {"type": "ri", "heading":"澳大利亚巴罗萨", "text":"<strong>特色：</strong>西拉、老藤\n<strong>最佳时间：</strong>3-5月\n<strong>必去：</strong>奔富、禾富\n<strong>体验：</strong>酒庄参观、品酒、美食"},
            {"type": "ri", "heading":"智利中央山谷", "text":"<strong>特色：</strong>赤霞珠、性价比高\n<strong>最佳时间：</strong>3-5月\n<strong>必去：</strong>干露、蒙特斯\n<strong>体验：</strong>酒庄参观、品酒、美食"},

            {"type": "h2", "text": "🇨🇳 中国：新兴产区"},
            {"type": "p", "text": "中国最值得去的葡萄酒产区："},

            {"type": "ri", "heading":"宁夏贺兰山东麓", "text":"<strong>特色：</strong>赤霞珠、国际获奖\n<strong>最佳时间：</strong>9-10月\n<strong>必去：</strong>张裕摩塞尔、贺兰晴雪\n<strong>体验：</strong>酒庄参观、品酒、沙漠"},
            {"type": "ri", "heading":"新疆产区", "text":"<strong>特色：</strong>产量大、性价比高\n<strong>最佳时间：</strong>9-10月\n<strong>必去：</strong>中信国安、新天\n<strong>体验：</strong>酒庄参观、品酒、风光"},

            {"type": "h2", "text": "📊 旅行速查表"},
            {"type": "table", "headers": ["产区", "最佳时间", "预算", "亮点"],
             "rows": [
                 ["波尔多", "9-10月", "高", "五大名庄"],
                 ["勃艮第", "9-10月", "高", "特级园"],
                 ["纳帕谷", "9-10月", "高", "赤霞珠"],
                 ["巴罗萨", "3-5月", "中", "西拉"],
                 ["宁夏", "9-10月", "中", "国际获奖"]
             ]},

            {"type": "h2", "text": "💡 旅行小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的葡萄酒之旅更完美："},
            {"type": "list", "items": [
                "<strong>提前预约</strong>——酒庄需要提前预约参观",
                "<strong>选择合适的交通</strong>——租车或包车更方便",
                "<strong>控制品酒量</strong>——品酒不要喝太多",
                "<strong>记录感受</strong>——记录品酒感受",
                "<strong>购买纪念品</strong>——买几瓶酒作为纪念"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'葡萄酒之旅，是一次味觉的冒险。'"},
            {"type": "p", "text": "葡萄酒旅行可以让你更深入地了解葡萄酒。去产区朝圣，体验葡萄酒的魅力。"},

            {"type": "end", "text": "你去过哪些葡萄酒产区？<br/>你最想去哪个产区？<br/>欢迎在评论区分享！"}
        ])
