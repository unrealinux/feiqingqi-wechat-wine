#!/usr/bin/env python3
"""Build birthday party wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#ff6f00',
        ['生日派对配酒指南', '生日快乐'],
        '一起举杯庆祝',
        '红樽坊 | 节日特辑')

    html = rich_article(content_blocks, primary='#ff6f00', secondary='#ffb74d')
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
    console.log('Birthday, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Birthday:', e.message);
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
    build_article('birthday_wine',
        title='生日派对配酒指南：生日快乐，一起举杯庆祝',
        digest='生日派对，怎么能没有酒？从香槟到起泡酒，从桃红到甜酒，这篇指南帮你选对生日酒。',
        category='holiday',
        tags=['生日','派对','庆祝','快乐','礼物'],
        content_blocks=[
            {"type": "title", "text": "生日派对配酒指南：生日快乐，一起举杯庆祝"},
            {"type": "subtitle", "text": "一起举杯庆祝"},
            {"type": "lead", "text": "生日派对，怎么能没有酒？一起举杯庆祝，祝福寿星生日快乐。这篇指南帮你选对生日酒，让生日派对更精彩。"},

            {"type": "h2", "text": "🎂 生日派对的特点"},
            {"type": "p", "text": "生日派对有这些特点，配酒要考虑："},
            {"type": "list", "items": [
                "<strong>庆祝氛围</strong>——要热闹、喜庆",
                "<strong>人群多样</strong>——可能有老人、小孩、年轻人",
                "<strong>食物多样</strong>——蛋糕、水果、大餐",
                "<strong>拍照需求</strong>——要发朋友圈，颜值很重要",
                "<strong>时间较长</strong>——从开始到结束，可能要喝几个小时"
            ]},

            {"type": "h2", "text": "🍷 生日派对推荐酒款"},
            {"type": "p", "text": "根据生日派对的特点，推荐这些酒款："},

            {"type": "ri", "heading":"庆祝担当：香槟（Champagne）", "text":"<strong>推荐酒款：</strong>酩悦、巴黎之花、唐培里侬\n<strong>理由：</strong>香槟的气泡象征着庆祝，是生日派对最经典的酒款。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>蛋糕、甜点、水果\n\n<strong>小贴士：</strong>开香槟时不要对着人，注意安全。"},
            {"type": "ri", "heading":"气氛担当：起泡酒（Sparkling）", "text":"<strong>推荐酒款：</strong>Prosecco、Cava、桃红起泡\n<strong>理由：</strong>起泡酒的气泡可以让人心情愉悦，适合热闹氛围。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>甜点、水果、轻食\n\n<strong>小贴士：</strong>开起泡酒时注意安全，不要对着人。"},
            {"type": "ri", "heading":"甜蜜担当：甜酒（Dessert Wine）", "text":"<strong>推荐酒款：</strong>莫斯卡托、冰酒、贵腐酒\n<strong>理由：</strong>甜酒的甜美口感可以搭配蛋糕，适合喜欢甜食的人。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>蛋糕、甜点、巧克力\n\n<strong>小贴士：</strong>甜酒酒精度低，适合不常喝酒的人。"},
            {"type": "ri", "heading":"颜值担当：桃红（Rosé）", "text":"<strong>推荐酒款：</strong>普罗旺斯桃红、西班牙桃红\n<strong>理由：</strong>桃红的颜值超高，拍照很好看，口感清爽易饮。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>沙拉、甜点、水果\n\n<strong>小贴士：</strong>桃红颜色浪漫，适合发朋友圈。"},

            {"type": "h2", "text": "🎂 不同年龄段的配酒建议"},
            {"type": "p", "text": "不同年龄段的人，对酒的喜好不同："},
            {"type": "table", "headers": ["年龄段", "推荐酒款", "理由"],
             "rows": [
                 ["年轻人（20-30）", "起泡酒、桃红", "颜值高，易饮"],
                 ["中年人（30-50）", "香槟、黑皮诺", "有档次，口感好"],
                 ["老年人（50+）", "甜酒、白葡萄酒", "温和，不刺激"],
                 ["小孩", "无酒精起泡", "参与感，安全"]
             ]},

            {"type": "h2", "text": "🎉 生日派对配酒场景"},
            {"type": "p", "text": "生日派对有不同场景，配酒也不同："},
            {"type": "list", "items": [
                "<strong>吹蜡烛</strong>——香槟或起泡酒，庆祝氛围",
                "<strong>切蛋糕</strong>——甜酒或桃红，搭配蛋糕",
                "<strong>大餐时间</strong>——红酒或白葡萄酒，配餐",
                "<strong>自由时间</strong>——起泡酒或桃红，轻松随意",
                "<strong>结束时</strong>——香槟或起泡酒，完美收尾"
            ]},

            {"type": "h2", "text": "📸 生日派对拍照技巧"},
            {"type": "p", "text": "生日派对要发朋友圈，这些拍照技巧要记住："},
            {"type": "list", "items": [
                "<strong>举杯拍照</strong>——大家举杯，一起拍照",
                "<strong>酒杯角度</strong>——45度角拍照最好看",
                "<strong>光线</strong>——利用自然光，避免直射",
                "<strong>背景</strong>——以蛋糕或装饰为背景",
                "<strong>滤镜</strong>——选择温暖自然的滤镜"
            ]},

            {"type": "h2", "text": "💡 生日派对小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的生日派对更完美："},
            {"type": "list", "items": [
                "<strong>提前准备</strong>——不要等到最后一刻才买酒",
                "<strong>注意温度</strong>——酒要冰镇，保持低温",
                "<strong>适量饮酒</strong>——微醺最好，喝醉伤身",
                "<strong>注意安全</strong>——喝酒后不要开车",
                "<strong>享受过程</strong>——最重要的是开心"
            ]},

            {"type": "h2", "text": "🚫 生日派对禁忌"},
            {"type": "p", "text": "生日派对，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤身",
                "<strong>不要强迫别人喝酒</strong>——尊重每个人的选择",
                "<strong>不要忽略安全</strong>——喝酒后不要开车",
                "<strong>不要忽略寿星</strong>——寿星是主角，要关注他/她",
                "<strong>不要忽略氛围</strong>——氛围比酒更重要"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'生日快乐，一起举杯庆祝！'"},
            {"type": "p", "text": "生日派对，是一种庆祝和祝福。选对酒，享受派对，让寿星感受到大家的爱和祝福。"},

            {"type": "end", "text": "你生日喜欢喝什么酒？<br/>你有什么生日派对的经验？<br/>欢迎在评论区分享你的生日故事！"}
        ])
