#!/usr/bin/env python3
"""Build wine label reading guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#00695c',
        ['如何看懂葡萄酒标签', '3分钟学会'],
        '买酒不再被忽悠',
        '红樽坊 | 实用技能')

    html = rich_article(content_blocks, primary='#00695c', secondary='#26a69a')
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
    console.log('Wine Label, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Label:', e.message);
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
    build_article('wine_label_guide',
        title='如何看懂葡萄酒标签？3分钟学会',
        digest='面对酒标上密密麻麻的外文，你是不是一脸懵？这篇指南教你3分钟看懂任何葡萄酒标签，买酒不再被忽悠。',
        category='practical-guide',
        tags=['酒标','标签','入门','选购','技能'],
        content_blocks=[
            {"type": "title", "text": "如何看懂葡萄酒标签？3分钟学会"},
            {"type": "subtitle", "text": "买酒不再被忽悠"},
            {"type": "lead", "text": "面对酒标上密密麻麻的外文，你是不是一脸懵？什么'Grand Cru'、'Reserva'、'Mis en bouteille'……这些词到底是什么意思？这篇指南教你3分钟看懂任何葡萄酒标签。"},

            {"type": "h2", "text": "📋 酒标上的关键信息"},
            {"type": "p", "text": "一瓶葡萄酒的标签上，通常包含以下几个关键信息："},
            {"type": "table", "headers": ["信息", "位置", "含义"],
             "rows": [
                 ["酒名", "最显眼的位置", "酒庄或品牌名称"],
                 ["产地", "酒名下方或侧面", "葡萄酒的来源地"],
                 ["年份", "通常在酒名附近", "葡萄采摘的年份"],
                 ["品种", "新世界酒常见", "酿造所用的葡萄品种"],
                 ["酒精度", "通常在背面", "酒精含量百分比"],
                 ["容量", "通常在底部", "酒瓶的容量"]
             ]},

            {"type": "h2", "text": "🌍 新旧世界酒标的区别"},
            {"type": "p", "text": "葡萄酒分为旧世界（欧洲）和新世界（其他地区），它们的酒标风格截然不同："},

            {"type": "ri", "heading":"旧世界酒标（法国、意大利、西班牙）", "text":"<strong>特点：</strong>信息简洁，注重产区，很少标注品种\n\n<strong>常见词汇：</strong>\n• AOC/AOP——法定产区葡萄酒（法国最高级别）\n• DOCG——保证法定产区葡萄酒（意大利最高级别）\n• Gran Reserva——特级陈酿（西班牙）\n• Cru——特级园/名园\n\n<strong>解读方法：</strong>看到旧世界酒标，首先看产区，再看酒庄名。产区越小越具体，酒通常越好。"},

            {"type": "ri", "heading":"新世界酒标（美国、澳大利亚、智利）", "text":"<strong>特点：</strong>信息丰富，品种突出，容易理解\n\n<strong>常见词汇：</strong>\n• Varietal——品种名称（如Cabernet Sauvignon）\n• Reserve/Reserva——珍藏级\n• Estate——酒庄自有葡萄园\n• Old Vine/Vieilles Vignes——老藤\n\n<strong>解读方法：</strong>新世界酒标通常直接告诉你品种和产区，更容易理解。"},

            {"type": "h2", "text": "🔑 必须认识的关键词"},
            {"type": "p", "text": "无论新旧世界，这些关键词一定要认识："},

            {"type": "ri", "heading":"产区相关", "text":"<strong>Grand Cru/Grand Cru Classé</strong>——特级庄/列级庄（法国最高等级）\n<strong>Premier Cru</strong>——一级园/一级庄\n<strong>Reserva/Reserve</strong>——珍藏级（通常品质更高）\n<strong>Estate Bottled/Mis en bouteille au domaine</strong>——酒庄装瓶（品质有保障）"},

            {"type": "ri", "heading":"品种相关", "text":"<strong>Cabernet Sauvignon</strong>——赤霞珠（红葡萄之王）\n<strong>Merlot</strong>——梅洛（柔顺易饮）\n<strong>Pinot Noir</strong>——黑皮诺（优雅细腻）\n<strong>Chardonnay</strong>——霞多丽（白葡萄之王）\n<strong>Sauvignon Blanc</strong>——长相思（清爽芳香）"},

            {"type": "h2", "text": "🏷️ 酒标上的等级制度"},
            {"type": "p", "text": "法国波尔多的等级制度是最复杂的，也是最常见的："},

            {"type": "table", "headers": ["等级", "含义", "价格区间"],
             "rows": [
                 ["Grand Cru Classé", "列级庄（1855年评定）", "¥2000-10000+"],
                 ["Cru Bourgeois", "中级庄", "¥300-1000"],
                 ["Cru Artisan", "手工匠人庄", "¥200-500"],
                 ["AOC/AOP", "法定产区酒", "¥100-500"],
                 ["Vin de Pays", "地区餐酒", "¥50-150"],
                 ["Vin de Table", "日常餐酒", "¥30-80"]
             ]},

            {"type": "h2", "text": "💡 实用解读技巧"},
            {"type": "p", "text": "掌握这几个技巧，你就能快速判断一瓶酒的品质："},
            {"type": "list", "items": [
                "<strong>看产区</strong>——产区越小越具体，酒通常越好",
                "<strong>看酒庄名</strong>——名庄酒的品质有保障",
                "<strong>看装瓶信息</strong>——酒庄装瓶（Mis en bouteille）比工厂装瓶好",
                "<strong>看年份</strong>——好年份的酒品质更好",
                "<strong>看等级</strong>——Grand Cru > Premier Cru > AOC > Vin de Pays"
            ]},

            {"type": "h2", "text": "📱 实用工具推荐"},
            {"type": "p", "text": "如果还是看不懂，这些工具可以帮你："},
            {"type": "list", "items": [
                "<strong>Vivino App</strong>——扫描酒标，查看评分和价格",
                "<strong>Wine-Searcher</strong>——查询全球价格和评分",
                "<strong>酒标翻译器</strong>——微信小程序，扫描酒标自动翻译",
                "<strong>红酒世界</strong>——中文葡萄酒百科，查询酒款信息"
            ]},

            {"type": "sep"},
            {"type": "h2", "text": "📊 常见酒标解读示例"},
            {"type": "p", "text": "这里举几个常见酒标的解读示例："},

            {"type": "ri", "heading":"示例1：Château Margaux 2015", "text":"<strong>解读：</strong>\n• Château——城堡（法国酒庄的标志）\n• Margaux——玛歌产区（波尔多左岸）\n• 2015——年份（非常好的年份）\n• 这是波尔多五大名庄之一，价格约5000-8000元"},

            {"type": "ri", "heading":"示例2：Penfolds Bin 389", "text":"<strong>解读：</strong>\n• Penfolds——奔富（澳大利亚最著名酒庄）\n• Bin 389——酒款编号\n• 这是澳洲的经典酒款，价格约300-500元"},

            {"type": "ri", "heading":"示例3：Casillero del Diablo Reserva", "text":"<strong>解读：</strong>\n• Casillero del Diablo——魔鬼酒窖（智利品牌）\n• Reserva——珍藏级\n• 这是智利的入门酒款，价格约60-100元"},

            {"type": "end", "text": "你看酒标时最困惑的是什么？<br/>欢迎在评论区分享你的疑问！"}
        ])
