#!/usr/bin/env python3
"""Build after work wine article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#004d40',
        ['下班后喝一杯', '的科学依据'],
        '打工人最幸福的时刻',
        '红樽坊 | 生活方式')

    html = rich_article(content_blocks, primary='#004d40', secondary='#26a69a')
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
    console.log('After Work, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('After Work:', e.message);
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
    build_article('after_work_wine',
        title='下班后喝一杯的科学依据：打工人最幸福的时刻',
        digest='忙碌了一天，下班后喝一杯葡萄酒，不仅是一种享受，更有科学依据支持。这篇指南告诉你为什么下班后喝酒是正确的选择。',
        category='lifestyle',
        tags=['下班','放松','解压','科学','打工人'],
        content_blocks=[
            {"type": "title", "text": "下班后喝一杯的科学依据"},
            {"type": "subtitle", "text": "打工人最幸福的时刻"},
            {"type": "lead", "text": "忙碌了一天，下班后喝一杯葡萄酒，不仅是一种享受，更有科学依据支持。这篇指南告诉你为什么下班后喝酒是正确的选择。"},

            {"type": "h2", "text": "🍷 为什么下班后想喝酒？"},
            {"type": "p", "text": "下班后想喝酒，是身体和心理的双重需求："},
            {"type": "list", "items": [
                "<strong>压力释放</strong>——酒精可以暂时缓解压力和焦虑",
                "<strong>社交需求</strong>——与朋友、同事喝酒是重要的社交方式",
                "<strong>仪式感</strong>——喝酒标志着从工作状态切换到休息状态",
                "<strong>奖励机制</strong>——用喝酒奖励自己辛苦工作了一天"
            ]},

            {"type": "h2", "text": "🔬 科学怎么说？"},
            {"type": "ri", "heading":"研究一：适量饮酒可以降低压力水平", "text":"<strong>研究机构：</strong>哈佛大学公共卫生学院\n<strong>研究发现：</strong>适量饮酒（每天1杯）可以降低皮质醇（压力激素）水平\n<strong>结论：</strong>适量饮酒确实可以帮助缓解压力"},
            {"type": "ri", "heading":"研究二：喝酒可以促进社交 bonding", "text":"<strong>研究机构：</strong>牛津大学\n<strong>研究发现：</strong>与朋友一起喝酒可以促进催产素（社交 bonding 激素）的分泌\n<strong>结论：</strong>社交饮酒可以增强人际关系"},
            {"type": "ri", "heading":"研究三：喝酒可以促进放松", "text":"<strong>研究机构：</strong>斯坦福大学\n<strong>研究发现：</strong>酒精可以促进GABA（抑制性神经递质）的分泌，让人感到放松\n<strong>结论：</strong>适量饮酒确实可以帮助放松身心"},

            {"type": "h2", "text": "⏰ 最佳饮酒时间"},
            {"type": "p", "text": "下班后喝酒，什么时候最合适？"},
            {"type": "table", "headers": ["时间", "适合程度", "理由"],
             "rows": [
                 ["下班后立即", "★★★☆☆", "可以放松，但空腹喝酒不好"],
                 ["晚餐时", "★★★★★", "最佳时间，配餐饮用"],
                 ["晚餐后", "★★★★☆", "可以放松，但不要太晚"],
                 ["睡前2小时", "★★★☆☆", "可以放松，但影响睡眠"],
                 ["深夜", "★☆☆☆☆", "不推荐，影响睡眠和健康"]
             ]},

            {"type": "h2", "text": "🍷 怎么喝最科学？"},
            {"type": "p", "text": "下班后喝酒，遵循这些原则最科学："},
            {"type": "list", "items": [
                "<strong>控制量</strong>——每天不超过1-2杯（150-300ml）",
                "<strong>配餐饮用</strong>——不要空腹喝酒",
                "<strong>慢慢喝</strong>——不要干杯，慢慢品味",
                "<strong>选择好酒</strong>——质量比数量更重要",
                "<strong>不要天天喝</strong>——每周最多5天，留2天休息"
            ]},

            {"type": "h2", "text": "💡 下班后喝酒的正确方式"},
            {"type": "p", "text": "下班后喝酒，不只是喝酒本身，更是一种生活方式："},
            {"type": "ri", "heading":"方式一：独饮放松", "text":"<strong>场景：</strong>一个人在家\n<strong>推荐酒款：</strong>黑皮诺、佳美等轻盈型红酒\n<strong>推荐搭配：</strong>音乐、书籍、电影\n<strong>氛围：</strong>安静、放松、自我对话"},
            {"type": "ri", "heading":"方式二：朋友小聚", "text":"<strong>场景：</strong>与朋友在酒吧或家中\n<strong>推荐酒款：</strong>起泡酒、白葡萄酒\n<strong>推荐搭配：</strong>小吃、聊天、游戏\n<strong>氛围：</strong>轻松、愉快、社交"},
            {"type": "ri", "heading":"方式三：浪漫约会", "text":"<strong>场景：</strong>与伴侣\n<strong>推荐酒款：</strong>香槟、勃艮第黑皮诺\n<strong>推荐搭配：</strong>烛光、音乐、晚餐\n<strong>氛围：</strong>浪漫、温馨、亲密"},

            {"type": "h2", "text": "🚫 下班后喝酒的禁忌"},
            {"type": "p", "text": "下班后喝酒，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤身",
                "<strong>不要开车</strong>——喝酒后绝对不能开车",
                "<strong>不要熬夜</strong>——喝酒后早点休息",
                "<strong>不要带情绪喝酒</strong>——心情不好时喝酒会更糟糕",
                "<strong>不要依赖酒精</strong>——喝酒是放松，不是解药"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'下班后喝一杯，是打工人最幸福的时刻。它不是逃避，而是奖励；不是依赖，而是享受。'"},
            {"type": "p", "text": "下班后喝一杯葡萄酒，是对自己辛苦工作的奖励。科学研究支持适量饮酒可以缓解压力、促进社交、帮助放松。关键是适量、科学、享受。"},

            {"type": "end", "text": "你下班后喜欢喝什么酒？<br/>你有什么下班后喝酒的仪式感？<br/>欢迎在评论区分享你的下班后喝酒方式！"}
        ])
