#!/usr/bin/env python3
"""Build wine opener guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#880e4f',
        ['葡萄酒开瓶器使用指南', '别再用牙咬了'],
        '从海马刀到电动开瓶器，一文搞定',
        '红樽坊 | 器具指南')

    html = rich_article(content_blocks, primary='#880e4f', secondary='#f06292')
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
    console.log('Wine Opener, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Wine Opener:', e.message);
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
    build_article('wine_opener_guide',
        title='葡萄酒开瓶器使用指南：别再用牙咬了',
        digest='从海马刀到电动开瓶器，从传统开瓶到真空保鲜，这篇指南帮你搞定所有葡萄酒开瓶难题。',
        category='practical-guide',
        tags=['开瓶器','开瓶','器具','实用技巧','入门'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒开瓶器使用指南"},
            {"type": "subtitle", "text": "别再用牙咬了 | 从海马刀到电动开瓶器"},
            {"type": "lead", "text": "很多人以为开瓶很简单，结果不是软木塞断了，就是酒洒了一地。选对开瓶器，掌握正确方法，开瓶其实很简单。这篇指南，帮你搞定所有葡萄酒开瓶难题。"},

            {"type": "h2", "text": "🔧 常见开瓶器类型"},
            {"type": "p", "text": "市面上的开瓶器种类繁多，主要有以下几种："},

            {"type": "ri", "heading":"1. 海马刀（Waiter's Corkscrew）", "text":"<strong>特点：</strong>最经典、最便携的开瓶器\n<strong>优点：</strong>价格便宜、便于携带、功能多样\n<strong>缺点：</strong>需要一定技巧\n<strong>适合人群：</strong>葡萄酒爱好者、侍酒师\n<strong>价格：</strong>¥20-100\n\n海马刀是专业人士的首选，也是最经典的开瓶器。它由螺旋钻、杠杆和小刀组成，功能多样。"},
            {"type": "ri", "heading":"2. 蝶形开瓶器（Winged Corkscrew）", "text":"<strong>特点：</strong>有两翼辅助，操作简单\n<strong>优点：</strong>省力、易操作\n<strong>缺点：</strong>体积较大、不够便携\n<strong>适合人群：</strong>初学者、家庭使用\n<strong>价格：</strong>¥30-80\n\n蝶形开瓶器是最适合初学者的选择，两翼辅助让开瓶变得轻松。"},
            {"type": "ri", "heading":"3. 电动开瓶器（Electric Wine Opener）", "text":"<strong>特点：</strong>全自动操作，省力省时\n<strong>优点：</strong>无需用力、速度快\n<strong>缺点：</strong>需要充电、体积大\n<strong>适合人群：</strong>追求便利的人、手力不足的人\n<strong>价格：</strong>¥100-300\n\n电动开瓶器是最省力的选择，一键操作即可开瓶。"},
            {"type": "ri", "heading":"4. 兔耳开瓶器（Rabbit Corkscrew）", "text":"<strong>特点：</strong>模仿兔耳形状，操作优雅\n<strong>优点：</strong>省力、优雅、速度快\n<strong>缺点：</strong>价格较高、体积大\n<strong>适合人群：</strong>追求仪式感的人\n<strong>价格：</strong>¥200-500\n\n兔耳开瓶器是最优雅的选择，开瓶过程充满仪式感。"},
            {"type": "ri", "heading":"5. 气压开瓶器（Air Pressure Corkscrew）", "text":"<strong>特点：</strong>利用气压将软木塞顶出\n<strong>优点：</strong>无需旋转、速度快\n<strong>缺点：</strong>可能破坏软木塞\n<strong>适合人群：</strong>追求速度的人\n<strong>价格：</strong>¥50-150\n\n气压开瓶器是最快速的选择，但可能破坏软木塞。"},

            {"type": "h2", "text": "📝 海马刀使用教程"},
            {"type": "p", "text": "海马刀是最经典的开瓶器，这里详细讲解使用方法："},

            {"type": "ri", "heading":"步骤一：割开酒帽", "text":"<strong>操作：</strong>用海马刀的小刀，沿瓶口下方1-2厘米处切割酒帽\n<strong>注意：</strong>只割一圈，不要割到软木塞\n<strong>技巧：</strong>刀刃朝外，旋转瓶子而不是旋转刀"},
            {"type": "ri", "heading":"步骤二：插入螺旋钻", "text":"<strong>操作：</strong>将螺旋钻对准软木塞中心，顺时针旋转\n<strong>注意：</strong>保持垂直，不要歪斜\n<strong>技巧：</strong>旋入约1.5圈即可，不要旋到底"},
            {"type": "ri", "heading":"步骤三：拔出软木塞", "text":"<strong>操作：</strong>将杠杆第一级卡住瓶口，向上拔起\n<strong>注意：</strong>保持稳定，不要晃动\n<strong>技巧：</strong>如果软木塞太长，可以分两次拔出"},
            {"type": "ri", "heading":"步骤四：取出软木塞", "text":"<strong>操作：</strong>用杠杆第二级将软木塞从螺旋钻上取出\n<strong>注意：</strong>不要用手直接拔，以免伤手\n<strong>技巧：</strong>轻轻旋转即可取出"},

            {"type": "h2", "text": "🚫 开瓶常见错误"},
            {"type": "p", "text": "开瓶时，这些错误要避免："},
            {"type": "list", "items": [
                "<strong>螺旋钻旋入太深</strong>——可能把软木塞旋断",
                "<strong>螺旋钻歪斜</strong>——可能导致软木塞断裂",
                "<strong>用力过猛</strong>——可能把软木塞拔断",
                "<strong>没有割开酒帽</strong>——可能导致酒液污染",
                "<strong>开瓶后不醒酒</strong>——可能影响口感"
            ]},

            {"type": "h2", "text": "💡 开瓶小技巧"},
            {"type": "p", "text": "记住这几个小技巧，让你开瓶更顺利："},
            {"type": "list", "items": [
                "<strong>先旋转瓶子</strong>——而不是旋转开瓶器",
                "<strong>保持垂直</strong>——螺旋钻要垂直插入",
                "<strong>控制力度</strong>——不要用蛮力",
                "<strong>分步操作</strong>——不要急于求成",
                "<strong>练习多次</strong>——熟能生巧"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'开瓶是喝酒的第一步，也是最重要的一步。开得好，喝酒才有好心情。'"},
            {"type": "p", "text": "选对开瓶器，掌握正确方法，开瓶其实很简单。不要害怕开瓶，多练习几次，你也能成为开瓶高手。"},

            {"type": "end", "text": "你平时用什么开瓶器？<br/>你有什么开瓶的小技巧？<br/>欢迎在评论区分享你的开瓶经验！"}
        ])
