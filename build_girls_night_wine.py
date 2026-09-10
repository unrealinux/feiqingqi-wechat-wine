#!/usr/bin/env python3
"""Build girls night wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#e91e63',
        ['闺蜜聚会配酒指南', '姐妹们的微醺时光'],
        '一起喝杯好的',
        '红樽坊 | 闺蜜特辑')

    html = rich_article(content_blocks, primary='#e91e63', secondary='#f48fb1')
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
    console.log('Girls Night, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Girls Night:', e.message);
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
    build_article('girls_night_wine',
        title='闺蜜聚会配酒指南：姐妹们的微醺时光',
        digest='闺蜜聚会，怎么能没有酒？从桃红到起泡，从甜酒到轻盈红酒，这篇指南帮你选对酒。',
        category='lifestyle',
        tags=['闺蜜','聚会','姐妹','社交','微醺'],
        content_blocks=[
            {"type": "title", "text": "闺蜜聚会配酒指南：姐妹们的微醺时光"},
            {"type": "subtitle", "text": "一起喝杯好的"},
            {"type": "lead", "text": "闺蜜聚会，怎么能没有酒？一起吐槽、一起八卦、一起微醺，这才是姐妹们的正确打开方式。这篇指南帮你选对酒，让闺蜜聚会更精彩。"},

            {"type": "h2", "text": "👯 闺蜜聚会的特点"},
            {"type": "p", "text": "闺蜜聚会和普通聚会不一样，有这些特点："},
            {"type": "list", "items": [
                "<strong>氛围轻松</strong>——不需要太正式，轻松自在",
                "<strong>话题多样</strong>——八卦、吐槽、分享、规划",
                "<strong>时间较长</strong>——一聊就是几个小时",
                "<strong>拍照需求</strong>——要发朋友圈，颜值很重要",
                "<strong>微醺最好</strong>——喝醉了就没法聊天了"
            ]},

            {"type": "h2", "text": "🍷 闺蜜聚会推荐酒款"},
            {"type": "p", "text": "根据闺蜜聚会的特点，推荐这些酒款："},

            {"type": "ri", "heading":"颜值担当：桃红（Rosé）", "text":"<strong>推荐酒款：</strong>普罗旺斯桃红、西班牙桃红\n<strong>理由：</strong>桃红的颜值超高，拍照很好看，口感清爽易饮。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>沙拉、甜点、水果\n\n<strong>小贴士：</strong>桃红颜色浪漫，适合发朋友圈。"},
            {"type": "ri", "heading":"气氛担当：起泡酒（Sparkling）", "text":"<strong>推荐酒款：</strong>Prosecco、Cava、桃红起泡\n<strong>理由：</strong>起泡酒的气泡可以让人心情愉悦，适合热闹氛围。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>甜点、水果、轻食\n\n<strong>小贴士：</strong>开起泡酒时注意安全，不要对着人。"},
            {"type": "ri", "heading":"甜蜜担当：甜酒（Dessert Wine）", "text":"<strong>推荐酒款：</strong>莫斯卡托、冰酒、贵腐酒\n<strong>理由：</strong>甜酒的甜美口感可以让人心情愉悦，适合喜欢甜食的闺蜜。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>甜点、水果、巧克力\n\n<strong>小贴士：</strong>甜酒酒精度低，适合不常喝酒的闺蜜。"},
            {"type": "ri", "heading":"清爽担当：白葡萄酒", "text":"<strong>推荐酒款：</strong>长相思、雷司令、灰皮诺\n<strong>理由：</strong>白葡萄酒的清爽口感可以解腻，适合吃大餐时饮用。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>海鲜、沙拉、轻食\n\n<strong>小贴士：</strong>白葡萄酒适合夏天，清爽解暑。"},

            {"type": "h2", "text": "🥂 闺蜜聚会配酒速查表"},
            {"type": "table", "headers": ["场景", "推荐酒款", "理由"],
             "rows": [
                 ["在家聊天", "桃红、莫斯卡托", "轻松易饮，颜值高"],
                 ["出去吃饭", "白葡萄酒、起泡酒", "清爽解腻，气氛好"],
                 ["生日派对", "香槟、桃红起泡", "庆祝氛围，有仪式感"],
                 ["失恋疗伤", "甜酒、桃红", "甜蜜治愈，心情好"],
                 ["八卦时间", "桃红、白葡萄酒", "轻松易饮，不影响聊天"]
             ]},

            {"type": "h2", "text": "📸 闺蜜聚会拍照技巧"},
            {"type": "p", "text": "闺蜜聚会要发朋友圈，这些拍照技巧要记住："},
            {"type": "list", "items": [
                "<strong>酒杯角度</strong>——45度角拍照最好看",
                "<strong>光线</strong>——自然光最好，避免直射",
                "<strong>背景</strong>——简洁背景，突出酒杯",
                "<strong>构图</strong>——三分法构图，酒杯放在交叉点",
                "<strong>滤镜</strong>——选择清新自然的滤镜"
            ]},

            {"type": "h2", "text": "💡 闺蜜聚会小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的闺蜜聚会更完美："},
            {"type": "list", "items": [
                "<strong>提前准备</strong>——不要等到最后一刻才买酒",
                "<strong>适量饮酒</strong>——微醺最好，喝醉伤身",
                "<strong>轮流请客</strong>——不要让一个人一直请客",
                "<strong>注意安全</strong>——喝酒后不要开车",
                "<strong>享受过程</strong>——最重要的是开心"
            ]},

            {"type": "h2", "text": "🚫 闺蜜聚会禁忌"},
            {"type": "p", "text": "闺蜜聚会，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要比较</strong>——不要比较谁喝得多，谁喝得少",
                "<strong>不要强迫</strong>——不要强迫不喝酒的闺蜜喝酒",
                "<strong>不要八卦过度</strong>——八卦要适度，不要伤害别人",
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤身",
                "<strong>不要忽略安全</strong>——喝酒后不要开车"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'闺蜜聚会，喝的不是酒，是感情。'"},
            {"type": "p", "text": "闺蜜聚会，是一种情感的交流。选对酒，享受微醺时光，让姐妹们的感情更深。"},

            {"type": "end", "text": "你和闺蜜聚会时喝什么酒？<br/>你有什么闺蜜聚会的经验？<br/>欢迎在评论区分享你的闺蜜故事！"}
        ])
