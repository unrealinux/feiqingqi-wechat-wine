#!/usr/bin/env python3
"""Build wine and diet article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#e65100',
        ['减肥期间能喝葡萄酒吗？', '真相可能让你意外'],
        '科学解读葡萄酒与减脂的关系',
        '红樽坊 | 健康揭秘')

    html = rich_article(content_blocks, primary='#e65100', secondary='#ff9800')
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
    console.log('Wine Diet, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Diet:', e.message);
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
    build_article('wine_diet',
        title='减肥期间能喝葡萄酒吗？真相可能让你意外',
        digest='葡萄酒热量高吗？喝葡萄酒会发胖吗？减肥期间到底能不能喝酒？这篇指南帮你搞清楚葡萄酒与减脂的关系。',
        category='health',
        tags=['减肥','减脂','热量','健康','饮食'],
        content_blocks=[
            {"type": "title", "text": "减肥期间能喝葡萄酒吗？"},
            {"type": "subtitle", "text": "真相可能让你意外"},
            {"type": "lead", "text": "减肥期间想喝酒，又怕发胖？很多人在减肥时完全戒酒，但也有人想知道：葡萄酒真的会导致发胖吗？这篇指南帮你搞清楚葡萄酒与减脂的关系。"},

            {"type": "h2", "text": "📊 葡萄酒的热量是多少？"},
            {"type": "p", "text": "首先，我们来看看葡萄酒的热量："},
            {"type": "table", "headers": ["酒款类型", "酒精度", "每杯热量（150ml）", "相当于多少食物"],
             "rows": [
                 ["干型白葡萄酒", "12%", "约100大卡", "半个苹果"],
                 ["干型红葡萄酒", "13%", "约125大卡", "一小碗米饭"],
                 ["甜型葡萄酒", "10%", "约150大卡", "一块巧克力"],
                 ["起泡酒", "12%", "约100大卡", "半个苹果"],
                 ["波特酒", "20%", "约180大卡", "一块蛋糕"]
             ]},
            {"type": "tip", "heading":"💡 关键发现", "text":"<strong>一杯干型葡萄酒的热量约100-125大卡</strong>，相当于半个苹果或一小碗米饭。这个热量并不算高，但如果你每天喝，累积起来就很可观了。"},

            {"type": "h2", "text": "🍷 喝葡萄酒会发胖吗？"},
            {"type": "p", "text": "答案是：<strong>适量喝不会，过量喝会。</strong>"},
            {"type": "ri", "heading":"为什么适量喝不会发胖？", "text":"<strong>1. 热量适中</strong>——一杯干型葡萄酒的热量约100-125大卡，在正常饮食范围内\n<strong>2. 促进代谢</strong>——适量饮酒可以促进新陈代谢\n<strong>3. 抑制食欲</strong>——酒精可以暂时抑制食欲，减少进食量\n<strong>4. 心理满足</strong>——满足口腹之欲，避免暴饮暴食"},
            {"type": "ri", "heading":"为什么过量喝会发胖？", "text":"<strong>1. 热量累积</strong>——每天喝3杯以上，额外摄入375+大卡\n<strong>2. 抑制脂肪燃烧</strong>——酒精会抑制身体燃烧脂肪\n<strong>3. 增加食欲</strong>——酒精会刺激食欲，让你吃更多\n<strong>4. 影响睡眠</strong>——睡眠质量下降会影响代谢"},

            {"type": "h2", "text": "📝 减肥期间喝酒的原则"},
            {"type": "p", "text": "如果你在减肥期间想喝酒，遵循这些原则："},
            {"type": "list", "items": [
                "<strong>控制量</strong>——每天不超过1杯（150ml）",
                "<strong>选择干型酒</strong>——干型葡萄酒含糖量最低",
                "<strong>配餐饮用</strong>——不要空腹喝酒",
                "<strong>计入热量</strong>——把酒的热量算入每日摄入",
                "<strong>不要天天喝</strong>——每周最多3-4次",
                "<strong>避免甜酒</strong>——甜型葡萄酒含糖量高"
            ]},

            {"type": "h2", "text": "🏆 最适合减肥期间喝的酒"},
            {"type": "p", "text": "以下酒款热量最低，最适合减肥期间饮用："},
            {"type": "item", "text": "干型白葡萄酒（长相思、雷司令）", "info": "热量最低，约100大卡/杯，清爽易饮", "price": "约100大卡/杯", "tag": "最推荐"},
            {"type": "item", "text": "干型桃红葡萄酒", "info": "热量适中，约110大卡/杯，颜值高", "price": "约110大卡/杯", "tag": "推荐"},
            {"type": "item", "text": "轻盈型红葡萄酒（黑皮诺、佳美）", "info": "热量适中，约120大卡/杯，果香浓郁", "price": "约120大卡/杯", "tag": "推荐"},
            {"type": "item", "text": "起泡酒（干型）", "info": "热量较低，约100大卡/杯，气泡感强", "price": "约100大卡/杯", "tag": "推荐"},

            {"type": "h2", "text": "🚫 减肥期间应该避免的酒"},
            {"type": "p", "text": "以下酒款热量较高，减肥期间应该避免："},
            {"type": "list", "items": [
                "<strong>甜型葡萄酒</strong>——含糖量高，热量高",
                "<strong>波特酒</strong>——酒精度高，热量高",
                "<strong>加强酒</strong>——酒精度高，热量高",
                "<strong>鸡尾酒</strong>——通常含糖量高",
                "<strong>啤酒</strong>——热量高，容易喝多"
            ]},

            {"type": "h2", "text": "💡 减肥期间喝酒的小技巧"},
            {"type": "p", "text": "记住这几个小技巧，让你减肥期间也能享受美酒："},
            {"type": "list", "items": [
                "<strong>先喝水</strong>——喝酒前先喝一杯水，增加饱腹感",
                "<strong>慢慢喝</strong>——不要干杯，慢慢品味",
                "<strong>配蔬菜</strong>——用蔬菜代替高热量下酒菜",
                "<strong>记录热量</strong>——把酒的热量记入每日摄入",
                "<strong>选择场合</strong>——只在特殊场合喝酒，不要日常饮酒"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'减肥不是完全戒酒，而是学会聪明地喝酒。'"},
            {"type": "p", "text": "减肥期间可以喝酒，但要控制量和选择酒款。一杯干型葡萄酒的热量并不高，关键是不要过量。学会聪明地喝酒，既能享受美酒，又能保持身材。"},

            {"type": "end", "text": "你减肥期间喝过葡萄酒吗？<br/>你觉得喝酒会影响减肥吗？<br/>欢迎在评论区分享你的经验！"}
        ])
