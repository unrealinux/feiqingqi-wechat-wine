import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260610'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1b5e20',
        ['🏠 葡萄酒储存指南', '别让你的好酒变醋'],
        '温度 · 湿度 · 光线 · 震动 · 摆放 · 长期储存',
        '储存指南 · 红酒顾问')

    html = rich_article(content_blocks, primary='#1b5e20', secondary='#4caf50')
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
      author: '红酒顾问',
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
    console.log('✅ {name}, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('❌ {name}:', e.message);
    process.exit(1);
  }}
}}

main();
'''
    os.makedirs('output', exist_ok=True)
    with open(f'generate-{name}.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'  Created generate-{name}.js')

if __name__ == '__main__':
    build_article('wine_storage_guide',
        title='🏠 葡萄酒储存指南：别让你的好酒变醋',
        digest='温度、湿度、光线、震动、摆放——5个维度教你正确储存葡萄酒，避免好酒变质。',
        category='wine-knowledge',
        tags=['储存','保存','酒柜','温度','湿度','长期储存'],
        content_blocks=[
            {'type':'title','text':'🏠 葡萄酒储存指南'},
            {'type':'subtitle','text':'别让你的好酒变醋 | 温度 · 湿度 · 光线 · 震动 · 摆放'},

            {'type':'lead','text':'很多人买了好酒却不知道怎么储存，结果开瓶时发现酒已经变质。葡萄酒储存其实不难，掌握5个关键要素，就能让你的好酒保持最佳状态。'},

            {'type':'h2','text':'🌡️ 要素一：温度'},

            {'type':'ri','heading':'理想储存温度','text':'<strong>最佳温度：12-14°C（恒温）</strong>\n\n温度是储存葡萄酒最重要的因素。温度过高会加速陈年，温度过低会减缓陈年。最关键的是<strong>恒温</strong>——温度波动比温度本身更危险。\n\n<strong>短期储存（1-6个月）：</strong>15-18°C可以接受\n<strong>长期储存（6个月以上）：</strong>必须12-14°C恒温\n<strong>绝对禁区：</strong>超过25°C会加速氧化，低于5°C会冻裂酒瓶'},

            {'type':'tip','heading':'💡 没有酒柜怎么办？','text':'冰箱只能短期存放（1-2周），长期存放会太冷太干燥。空调房的温度波动太大。最佳方案是买一个恒温酒柜（¥1,000-5,000），或者找一个阴凉、恒温的角落（比如衣柜深处）。'},

            {'type':'h2','text':'💧 要素二：湿度'},

            {'type':'ri','heading':'理想储存湿度','text':'<strong>最佳湿度：60-70%</strong>\n\n湿度过低会导致软木塞干裂，空气进入酒瓶氧化酒液。湿度过高会导致酒标发霉脱落。\n\n<strong>如何保持湿度：</strong>\n• 在酒柜/酒架旁放一碗水\n• 定期用湿布擦拭酒瓶\n• 避免放在空调出风口附近（会太干燥）'},

            {'type':'h2','text':'🌑 要素三：光线'},

            {'type':'ri','heading':'避光储存','text':'<strong>紫外线是葡萄酒的天敌</strong>——它会分解酒中的有机化合物，产生不愉快的气味（"光臭"）。\n\n<strong>储存要求：</strong>\n• 避免阳光直射\n• 避免荧光灯照射\n• 用深色酒柜或遮光布\n• 绿色/棕色酒瓶比透明瓶更能防紫外线'},

            {'type':'h2','text':'📳 要素四：震动'},

            {'type':'ri','heading':'避免震动','text':'<strong>震动会加速陈年，破坏酒液结构。</strong>\n\n<strong>储存要求：</strong>\n• 远离洗衣机、冰箱等震动源\n• 不要频繁移动酒瓶\n• 长期储存的酒最好静置不动\n• 搬运时轻拿轻放'},

            {'type':'h2','text':'🍷 要素五：摆放'},

            {'type':'ri','heading':'正确的摆放方式','text':'<strong>横放或倾斜存放</strong>——让酒液接触软木塞，保持软木塞湿润膨胀，防止空气进入。\n\n<strong>不同酒款的摆放：</strong>\n• 软木塞封瓶的酒：必须横放\n• 螺旋盖封瓶的酒：横放或竖放都可以\n• 起泡酒：最好竖放（减少压力）\n• 长期储存：横放或倾斜15-30°'},

            {'type':'h2','text':'⏰ 不同酒款的储存时间'},

            {'type':'table','headers':['酒款类型','最佳储存时间','说明'],
            'rows':[
                ['日常白葡萄酒','1-2年','越新鲜越好喝'],
                ['日常红葡萄酒','2-3年','果味型为主'],
                ['优质白葡萄酒','5-10年','勃艮第白、雷司令'],
                ['优质红葡萄酒','10-20年','波尔多、巴罗洛'],
                ['顶级陈年酒','20-50年','拉菲、罗曼尼康帝'],
                ['甜酒/贵腐','20-30年','苏玳、托卡伊'],
                ['起泡酒/香槟','3-5年','年份香槟可更长'],
            ]},

            {'type':'h2','text':'❌ 常见储存误区'},

            {'type':'list','items':[
                '❌ 放在厨房——温度波动大，有异味',
                '❌ 放在客厅展示柜——光线太强，温度太高',
                '❌ 放在车里——温度波动致命',
                '❌ 竖放软木塞酒——软木塞会干裂',
                '❌ 和食物混放——异味会渗透酒瓶',
                '❌ 放在地下室但不控温——温度波动仍然危险',
            ]},

            {'type':'tip','heading':'💡 简易储存方案','text':'如果没有专业酒柜，找一个阴凉、恒温、避光、无震动的角落（比如衣柜深处、书房角落），用纸箱或木箱装好酒瓶，横放存放。这样可以保存1-2年。'},

            {'type':'quote','text':'好酒需要好储存。一瓶¥1,000的名庄酒，如果储存不当，开瓶时可能只值¥100。'},

            {'type':'sep','text':''},
            {'type':'end','text':'— 好酒配好储存 —'},
        ]
    )
    print('\nWine Storage Guide created!')
