#!/usr/bin/env python3
"""Build beach vacation wine guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#006064',
        ['海边度假配酒指南', '阳光、沙滩、美酒'],
        '海边度假的完美搭配',
        '红樽坊 | 度假特辑')

    html = rich_article(content_blocks, primary='#006064', secondary='#26c6da')
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
    console.log('Beach, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Beach:', e.message);
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
    build_article('beach_wine',
        title='海边度假配酒指南：阳光、沙滩、美酒',
        digest='在海边度假，怎么能没有酒？从白葡萄酒到起泡酒，从桃红到轻盈红酒，这篇指南帮你选对酒。',
        category='lifestyle',
        tags=['海边','度假','沙滩','夏天','清爽'],
        content_blocks=[
            {"type": "title", "text": "海边度假配酒指南：阳光、沙滩、美酒"},
            {"type": "subtitle", "text": "海边度假的完美搭配"},
            {"type": "lead", "text": "在海边度假，怎么能没有酒？阳光、沙滩、海浪，再配上一杯冰镇葡萄酒，这才是度假的正确打开方式。这篇指南帮你选对酒，让海边度假更完美。"},

            {"type": "h2", "text": "🏖️ 海边度假的特点"},
            {"type": "p", "text": "海边度假有这些特点，配酒要考虑："},
            {"type": "list", "items": [
                "<strong>温度高</strong>——海边温度高，酒要冰镇",
                "<strong>阳光强</strong>——紫外线强，要避免光照",
                "<strong>海鲜多</strong>——海边海鲜多，要搭配海鲜",
                "<strong>氛围轻松</strong>——度假氛围轻松，酒要易饮",
                "<strong>拍照需求</strong>——要发朋友圈，颜值很重要"
            ]},

            {"type": "h2", "text": "🍷 海边度假推荐酒款"},
            {"type": "p", "text": "根据海边度假的特点，推荐这些酒款："},

            {"type": "ri", "heading":"清爽担当：白葡萄酒", "text":"<strong>推荐酒款：</strong>长相思、雷司令、灰皮诺\n<strong>理由：</strong>白葡萄酒的清爽口感可以解暑，适合海边高温环境。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>海鲜、沙拉、轻食\n\n<strong>小贴士：</strong>白葡萄酒要冰镇，用冰桶保持低温。"},
            {"type": "ri", "heading":"浪漫担当：桃红（Rosé）", "text":"<strong>推荐酒款：</strong>普罗旺斯桃红、西班牙桃红\n<strong>理由：</strong>桃红的颜值超高，拍照很好看，口感清爽易饮。\n<strong>饮用温度：</strong>8-10°C\n<strong>推荐搭配：</strong>海鲜、沙拉、甜点\n\n<strong>小贴士：</strong>桃红颜色浪漫，适合发朋友圈。"},
            {"type": "ri", "heading":"气氛担当：起泡酒（Sparkling）", "text":"<strong>推荐酒款：</strong>Prosecco、Cava、桃红起泡\n<strong>理由：</strong>起泡酒的气泡可以让人心情愉悦，适合海边热闹氛围。\n<strong>饮用温度：</strong>6-8°C\n<strong>推荐搭配：</strong>甜点、水果、轻食\n\n<strong>小贴士：</strong>开起泡酒时注意安全，不要对着人。"},
            {"type": "ri", "heading":"冒险担当：轻盈红酒", "text":"<strong>推荐酒款：</strong>黑皮诺、佳美、歌海娜\n<strong>理由：</strong>轻盈红酒的果味清新，适合喜欢红酒的人。\n<strong>饮用温度：</strong>14-16°C\n<strong>推荐搭配：</strong>烤肉、海鲜、奶酪\n\n<strong>小贴士：</strong>海边温度高，红酒要稍微冰镇。"},

            {"type": "h2", "text": "🦞 海边度假配餐指南"},
            {"type": "p", "text": "海边度假，海鲜是主角，如何配酒？"},
            {"type": "table", "headers": ["海鲜类型", "推荐酒款", "理由"],
             "rows": [
                 ["生蚝", "长相思、夏布利", "清爽酸度提升鲜味"],
                 ["龙虾", "霞多丽、白诗南", "圆润口感配龙虾肉"],
                 ["烤鱼", "桃红、灰皮诺", "清爽解腻"],
                 ["虾蟹", "雷司令、莫斯卡托", "微甜口感配海鲜甜味"],
                 ["贝类", "长相思、阿尔巴利诺", "清爽酸度提升鲜味"]
             ]},

            {"type": "h2", "text": "🌴 海边度假配酒场景"},
            {"type": "p", "text": "海边度假有不同场景，配酒也不同："},
            {"type": "list", "items": [
                "<strong>沙滩日光浴</strong>——冰镇白葡萄酒或桃红，清爽解暑",
                "<strong>海边晚餐</strong>——霞多丽或黑皮诺，配海鲜或烤肉",
                "<strong>日落时分</strong>——起泡酒或桃红，浪漫氛围",
                "<strong>夜晚派对</strong>——起泡酒或甜酒，热闹氛围",
                "<strong>清晨早餐</strong>——起泡酒或白葡萄酒，清爽开始"
            ]},

            {"type": "h2", "text": "📸 海边度假拍照技巧"},
            {"type": "p", "text": "海边度假要发朋友圈，这些拍照技巧要记住："},
            {"type": "list", "items": [
                "<strong>酒杯角度</strong>——45度角拍照最好看",
                "<strong>光线</strong>——利用自然光，避免直射",
                "<strong>背景</strong>——以大海为背景，突出酒杯",
                "<strong>构图</strong>——三分法构图，酒杯放在交叉点",
                "<strong>滤镜</strong>——选择清新自然的滤镜"
            ]},

            {"type": "h2", "text": "💡 海边度假小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的海边度假更完美："},
            {"type": "list", "items": [
                "<strong>提前准备</strong>——不要等到最后一刻才买酒",
                "<strong>注意温度</strong>——酒要冰镇，保持低温",
                "<strong>适量饮酒</strong>——微醺最好，喝醉伤身",
                "<strong>注意安全</strong>——喝酒后不要下水",
                "<strong>享受过程</strong>——最重要的是开心"
            ]},

            {"type": "h2", "text": "🚫 海边度假禁忌"},
            {"type": "p", "text": "海边度假，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要喝太多</strong>——微醺最好，喝醉伤身",
                "<strong>不要下水</strong>——喝酒后不要下水游泳",
                "<strong>不要暴晒</strong>——暴晒伤身，要注意防晒",
                "<strong>不要忽略安全</strong>——海边有危险，要注意安全",
                "<strong>不要忽略环保</strong>——不要乱扔垃圾"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'海边度假，喝的不是酒，是心情。'"},
            {"type": "p", "text": "海边度假，是一种放松和享受。选对酒，享受阳光、沙滩、美酒，让度假更完美。"},

            {"type": "end", "text": "你喜欢在海边喝什么酒？<br/>你有什么海边度假的经验？<br/>欢迎在评论区分享你的海边故事！"}
        ])
