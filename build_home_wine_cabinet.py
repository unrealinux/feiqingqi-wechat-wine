#!/usr/bin/env python3
"""Build home wine cabinet guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#3e2723',
        ['如何建立家庭酒柜？', '从零开始的存酒指南'],
        '让你的好酒保持最佳状态',
        '红樽坊 | 实用指南')

    html = rich_article(content_blocks, primary='#3e2723', secondary='#8d6e63')
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
    console.log('Home Cabinet, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Home Cabinet:', e.message);
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
    build_article('home_wine_cabinet',
        title='如何建立家庭酒柜？从零开始的存酒指南',
        digest='买了很多酒却不知道怎么储存？从恒温酒柜到简易存酒方案，这篇指南帮你建立完美的家庭酒柜。',
        category='practical-guide',
        tags=['酒柜','储存','收藏','家庭','实用'],
        content_blocks=[
            {"type": "title", "text": "如何建立家庭酒柜？"},
            {"type": "subtitle", "text": "从零开始的存酒指南"},
            {"type": "lead", "text": "买了很多酒却不知道怎么储存？随意放在厨房或阳台，结果好酒变质了？这篇指南帮你从零开始建立完美的家庭酒柜，让你的好酒保持最佳状态。"},

            {"type": "h2", "text": "🍷 为什么需要酒柜？"},
            {"type": "p", "text": "葡萄酒对储存环境非常敏感，不当的储存会导致酒变质："},
            {"type": "list", "items": [
                "<strong>温度</strong>——温度过高会加速陈年，过低会冻裂酒瓶",
                "<strong>湿度</strong>——湿度过低会导致软木塞干裂，过高会导致酒标发霉",
                "<strong>光线</strong>——紫外线会分解酒中的有机化合物",
                "<strong>震动</strong>——震动会加速陈年，破坏酒液结构"
            ]},

            {"type": "h2", "text": "🏆 酒柜类型选择"},
            {"type": "p", "text": "根据你的需求和预算，选择合适的酒柜类型："},

            {"type": "ri", "heading":"类型一：恒温酒柜（专业级）", "text":"<strong>价格：</strong>¥2000-20000+\n<strong>容量：</strong>12-200瓶\n<strong>特点：</strong>恒温恒湿、避光防震、专业储存\n<strong>适合人群：</strong>葡萄酒收藏爱好者、有大量存酒需求的人\n\n<strong>推荐品牌：</strong>海尔、美的、维诺卡夫、EuroCave"},
            {"type": "ri", "heading":"类型二：半导体酒柜（入门级）", "text":"<strong>价格：</strong>¥500-2000\n<strong>容量：</strong>8-24瓶\n<strong>特点：</strong>无压缩机、静音、省电\n<strong>缺点：</strong>制冷效果一般、受环境温度影响\n<strong>适合人群：</strong>入门者、存酒量少的人"},
            {"type": "ri", "heading":"类型三：冰箱替代方案（简易级）", "text":"<strong>价格：</strong>¥0（利用现有冰箱）\n<strong>容量：</strong>取决于冰箱空间\n<strong>特点：</strong>无需额外投资\n<strong>缺点：</strong>温度太低、湿度不够、有异味\n<strong>适合人群：</strong>临时储存、预算有限的人"},

            {"type": "h2", "text": "📊 酒柜选购参数"},
            {"type": "table", "headers": ["参数", "推荐值", "说明"],
             "rows": [
                 ["温度范围", "5-20°C", "可调节温度范围"],
                 ["温度稳定性", "+/-1°C", "温度波动越小越好"],
                 ["湿度范围", "50-80%", "保持软木塞湿润"],
                 ["紫外线防护", "防紫外线玻璃", "保护酒液不受光照"],
                 ["减震系统", "压缩机减震", "减少震动对酒的影响"],
                 ["噪音水平", "<40dB", "静音运行"]
             ]},

            {"type": "h2", "text": "💰 不同预算的推荐方案"},
            {"type": "p", "text": "根据你的预算，这里有几个推荐方案："},
            {"type": "list", "items": [
                "<strong>预算500元以下</strong>——用冰箱临时储存，或买一个简单的酒架",
                "<strong>预算500-2000元</strong>——买一个半导体酒柜，适合入门者",
                "<strong>预算2000-5000元</strong>——买一个入门级恒温酒柜，适合家庭使用",
                "<strong>预算5000-10000元</strong>——买一个中端恒温酒柜，适合收藏爱好者",
                "<strong>预算10000元以上</strong>——买一个高端恒温酒柜，适合专业收藏"
            ]},

            {"type": "h2", "text": "📝 酒柜使用技巧"},
            {"type": "p", "text": "有了酒柜，还要正确使用："},
            {"type": "list", "items": [
                "<strong>提前预热</strong>——新酒柜买回来后，提前24小时开机运行",
                "<strong>不要塞太满</strong>——留出空间让空气流通",
                "<strong>分类存放</strong>——按类型、产区、年份分类",
                "<strong>定期检查</strong>——每周检查一次温度和湿度",
                "<strong>避免频繁开门</strong>——开门次数越少越好"
            ]},

            {"type": "h2", "text": "🚫 常见错误"},
            {"type": "p", "text": "使用酒柜时，这些错误要避免："},
            {"type": "list", "items": [
                "<strong>放在厨房</strong>——厨房温度变化大，不适合存酒",
                "<strong>放在阳台</strong>——阳光直射会损害酒质",
                "<strong>放在冰箱</strong>——温度太低，湿度不够",
                "<strong>横放所有酒</strong>——起泡酒和螺旋盖的酒应该直立存放",
                "<strong>长期不动</strong>——长期存放的酒要定期检查"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'好马配好鞍，好酒配好柜。'"},
            {"type": "p", "text": "建立家庭酒柜，是每个葡萄酒爱好者的必修课。选对酒柜，正确使用，才能让你的好酒保持最佳状态。"},

            {"type": "end", "text": "你有家庭酒柜吗？<br/>你平时怎么储存葡萄酒？<br/>欢迎在评论区分享你的存酒经验！"}
        ])
