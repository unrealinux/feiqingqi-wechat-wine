#!/usr/bin/env python3
"""Build wine cost breakdown article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1b5e20',
        ['一瓶酒的成本', '揭秘酒价真相'],
        '你喝的酒值这个价吗',
        '红樽坊 | 深度揭秘')

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
    console.log('Cost, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Cost:', e.message);
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
    build_article('wine_cost',
        title='一瓶酒的成本到底是多少？揭秘酒价背后的真相',
        digest='100块的酒和1000块的酒，成本到底差多少？揭秘酒价背后的真相，让你买酒不再被坑。',
        category='deep-dive',
        tags=['成本','价格','性价比','揭秘','真相'],
        content_blocks=[
            {"type": "title", "text": "一瓶酒的成本到底是多少？"},
            {"type": "subtitle", "text": "揭秘酒价背后的真相"},
            {"type": "lead", "text": "100块的酒和1000块的酒，成本到底差多少？你喝的酒，值这个价吗？这篇指南揭秘酒价背后的真相，让你买酒不再被坑。"},

            {"type": "h2", "text": "💰 一瓶酒的成本构成"},
            {"type": "p", "text": "一瓶酒的成本，主要由这些部分构成："},
            {"type": "table", "headers": ["成本项目", "占比", "说明"],
             "rows": [
                 ["葡萄种植", "15-25%", "葡萄园管理、采摘"],
                 ["酿造成本", "10-15%", "酿造、陈年、装瓶"],
                 ["包装成本", "5-10%", "酒瓶、酒标、木塞"],
                 ["税费", "10-20%", "消费税、增值税"],
                 ["运输成本", "5-10%", "国际运输、国内运输"],
                 ["营销成本", "15-25%", "广告、推广、渠道"],
                 ["利润", "10-30%", "酒商、零售商利润"]
             ]},

            {"type": "h2", "text": "📊 不同价位酒的成本对比"},
            {"type": "ri", "heading":"100元以下的酒", "text":"<strong>葡萄成本：</strong>10-20元\n<strong>酿造成本：</strong>5-10元\n<strong>包装成本：</strong>5-10元\n<strong>税费：</strong>10-15元\n<strong>营销+利润：</strong>20-40元\n\n<strong>结论：</strong>实际成本只有30-50元。"},
            {"type": "ri", "heading":"300元的酒", "text":"<strong>葡萄成本：</strong>50-80元\n<strong>酿造成本：</strong>20-30元\n<strong>包装成本：</strong>15-25元\n<strong>税费：</strong>30-50元\n<strong>营销+利润：</strong>60-100元\n\n<strong>结论：</strong>实际成本只有100-150元。"},
            {"type": "ri", "heading":"1000元的酒", "text":"<strong>葡萄成本：</strong>150-250元\n<strong>酿造成本：</strong>50-80元\n<strong>包装成本：</strong>30-50元\n<strong>税费：</strong>100-150元\n<strong>营销+利润：</strong>200-400元\n\n<strong>结论：</strong>实际成本只有300-500元。"},

            {"type": "h2", "text": "🤔 为什么酒价这么高？"},
            {"type": "list", "items": [
                "<strong>品牌溢价</strong>——名庄酒有品牌溢价，价格自然高",
                "<strong>稀缺性</strong>——好酒产量有限，物以稀为贵",
                "<strong>陈年潜力</strong>——好酒可以陈年，越老越值钱",
                "<strong>营销成本</strong>——酒商的营销成本最终转嫁给消费者",
                "<strong>渠道利润</strong>——每个渠道都要利润，层层加价"
            ]},

            {"type": "h2", "text": "💡 如何买到性价比高的酒？"},
            {"type": "list", "items": [
                "<strong>忽略品牌</strong>——不要只看品牌，关注酒质",
                "<strong>尝试新产区</strong>——新产区的酒性价比通常更高",
                "<strong>选择中级庄</strong>——波尔多中级庄性价比很高",
                "<strong>关注年份</strong>——差年份的酒价格更低，但品质不一定差",
                "<strong>直接购买</strong>——从酒商直接购买，省去中间环节"
            ]},

            {"type": "h2", "text": "🚫 买酒的常见陷阱"},
            {"type": "list", "items": [
                "<strong>不要相信低价好酒</strong>——太便宜的酒，品质通常不好",
                "<strong>不要迷信名庄酒</strong>——名庄酒有假货，要谨慎购买",
                "<strong>不要迷信评分</strong>——评分只是参考，不代表一切",
                "<strong>不要迷信专家</strong>——专家的推荐不一定适合你",
                "<strong>相信自己的舌头</strong>——自己的感受最重要"
            ]},

            {"type": "h2", "text": "📊 酒价真相速查表"},
            {"type": "table", "headers": ["价位", "实际成本", "溢价倍数", "建议"],
             "rows": [
                 ["50元", "15-25元", "2-3倍", "日常饮用"],
                 ["100元", "30-50元", "2-3倍", "朋友聚会"],
                 ["300元", "100-150元", "2-3倍", "重要场合"],
                 ["1000元", "300-500元", "2-3倍", "特殊场合"],
                 ["10000元", "3000-5000元", "2-3倍", "收藏投资"]
             ]},

            {"type": "sep"},
            {"type": "quote", "text": "'买酒不看价格看品质，这才是真正的懂酒人。'"},
            {"type": "p", "text": "酒价的真相是：你买的不只是酒，还有品牌、渠道、税费。了解成本构成，才能买到真正适合自己的好酒。"},

            {"type": "end", "text": "你觉得一瓶酒值多少钱？<br/>你买过最划算的酒是什么？<br/>欢迎在评论区分享你的买酒经验！"}
        ])
