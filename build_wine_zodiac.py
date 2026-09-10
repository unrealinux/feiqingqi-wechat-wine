#!/usr/bin/env python3
"""Build wine zodiac article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#4a148c',
        ['葡萄酒与星座', '你是什么星座'],
        '就喝什么酒',
        '红樽坊 | 星座特辑')

    html = rich_article(content_blocks, primary='#4a148c', secondary='#9c27b0')
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
    console.log('Zodiac, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Zodiac:', e.message);
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
    build_article('wine_zodiac',
        title='葡萄酒与星座：你是什么星座，就喝什么酒',
        digest='白羊座适合起泡酒，天蝎座适合黑皮诺？12星座的专属葡萄酒，快来找你的星座酒！',
        category='lifestyle',
        tags=['星座','性格','匹配','趣味','12星座'],
        content_blocks=[
            {"type": "title", "text": "葡萄酒与星座：你是什么星座，就喝什么酒"},
            {"type": "subtitle", "text": "12星座的专属葡萄酒"},
            {"type": "lead", "text": "你相信星座吗？每个星座都有独特的性格特点，而葡萄酒也有丰富的风味特征。当星座遇上葡萄酒，会碰撞出怎样的火花？快来找你的星座酒！"},

            {"type": "h2", "text": "♈ 白羊座（3.21-4.19）"},
            {"type": "p", "text": "<strong>性格特点：</strong>热情、冲动、直率、爱冒险"},
            {"type": "ri", "heading":"专属酒款：起泡酒（Prosecco）", "text":"<strong>推荐酒款：</strong>意大利Prosecco、西班牙Cava\n<strong>理由：</strong>白羊座热情奔放，需要一款充满活力的酒。起泡酒的气泡就像白羊座的热情，不断向上迸发。\n<strong>饮用场景：</strong>派对、庆祝、冒险之旅\n<strong>推荐年份：</strong>NV（非年份）"},
            {"type": "p", "text": "<strong>星座搭配：</strong>狮子座、射手座"},

            {"type": "h2", "text": "♉ 金牛座（4.20-5.20）"},
            {"type": "p", "text": "<strong>性格特点：</strong>稳重、务实、享受、固执"},
            {"type": "ri", "heading":"专属酒款：赤霞珠（Cabernet Sauvignon）", "text":"<strong>推荐酒款：</strong>纳帕谷赤霞珠、波尔多左岸\n<strong>理由：</strong>金牛座喜欢高品质的东西，赤霞珠的浓郁复杂正好满足他们的品味。\n<strong>饮用场景：</strong>牛排晚餐、家庭聚会\n<strong>推荐年份：</strong>2018、2019"},
            {"type": "p", "text": "<strong>星座搭配：</strong>处女座、摩羯座"},

            {"type": "h2", "text": "♊ 双子座（5.21-6.21）"},
            {"type": "p", "text": "<strong>性格特点：</strong>聪明、多变、好奇、爱社交"},
            {"type": "ri", "heading":"专属酒款：雷司令（Riesling）", "text":"<strong>推荐酒款：</strong>德国雷司令、澳大利亚雷司令\n<strong>理由：</strong>双子座喜欢新鲜感，雷司令的多变风格（从干型到甜型）正好满足他们的好奇心。\n<strong>饮用场景：</strong>朋友聚会、下午茶\n<strong>推荐年份：</strong>2020、2021"},
            {"type": "p", "text": "<strong>星座搭配：</strong>天秤座、水瓶座"},

            {"type": "h2", "text": "♋ 巨蟹座（6.22-7.22）"},
            {"type": "p", "text": "<strong>性格特点：</strong>温柔、顾家、敏感、念旧"},
            {"type": "ri", "heading":"专属酒款：黑皮诺（Pinot Noir）", "text":"<strong>推荐酒款：</strong>勃艮第黑皮诺、俄勒冈黑皮诺\n<strong>理由：</strong>巨蟹座温柔细腻，黑皮诺的优雅柔和正好符合他们的气质。\n<strong>饮用场景：</strong>家庭晚餐、温馨时刻\n<strong>推荐年份：</strong>2019、2020"},
            {"type": "p", "text": "<strong>星座搭配：</strong>天蝎座、双鱼座"},

            {"type": "h2", "text": "♌ 狮子座（7.23-8.22）"},
            {"type": "p", "text": "<strong>性格特点：</strong>自信、大方、爱面子、有领导力"},
            {"type": "ri", "heading":"专属酒款：波尔多（Bordeaux）", "text":"<strong>推荐酒款：</strong>波尔多列级庄、波尔多优质酒\n<strong>理由：</strong>狮子座喜欢有面子的东西，波尔多的名望和品质正好满足他们的需求。\n<strong>饮用场景：</strong>重要场合、展示品味\n<strong>推荐年份：</strong>2015、2016"},
            {"type": "p", "text": "<strong>星座搭配：</strong>白羊座、射手座"},

            {"type": "h2", "text": "♍ 处女座（8.23-9.22）"},
            {"type": "p", "text": "<strong>性格特点：</strong>完美主义、细致、挑剔、务实"},
            {"type": "ri", "heading":"专属酒款：长相思（Sauvignon Blanc）", "text":"<strong>推荐酒款：</strong>马尔堡长相思、卢瓦尔河谷长相思\n<strong>理由：</strong>处女座追求完美，长相思的清新纯净正好符合他们的标准。\n<strong>饮用场景：</strong>海鲜晚餐、品酒会\n<strong>推荐年份：</strong>2021、2022"},
            {"type": "p", "text": "<strong>星座搭配：</strong>金牛座、摩羯座"},

            {"type": "h2", "text": "♎ 天秤座（9.23-10.23）"},
            {"type": "p", "text": "<strong>性格特点：</strong>优雅、平衡、爱社交、犹豫不决"},
            {"type": "ri", "heading":"专属酒款：霞多丽（Chardonnay）", "text":"<strong>推荐酒款：</strong>勃艮第霞多丽、加州霞多丽\n<strong>理由：</strong>天秤座追求优雅平衡，霞多丽的圆润复杂正好满足他们的品味。\n<strong>饮用场景：</strong>商务宴请、优雅聚会\n<strong>推荐年份：</strong>2019、2020"},
            {"type": "p", "text": "<strong>星座搭配：</strong>双子座、水瓶座"},

            {"type": "h2", "text": "♏ 天蝎座（10.24-11.22）"},
            {"type": "p", "text": "<strong>性格特点：</strong>神秘、深沉、强烈、有魅力"},
            {"type": "ri", "heading":"专属酒款：内比奥罗（Nebbiolo）", "text":"<strong>推荐酒款：</strong>巴罗洛、巴巴莱斯科\n<strong>理由：</strong>天蝎座神秘深沉，内比奥罗的浓郁复杂正好符合他们的气质。\n<strong>饮用场景：</strong>浪漫晚餐、深度对话\n<strong>推荐年份：</strong>2016、2017"},
            {"type": "p", "text": "<strong>星座搭配：</strong>巨蟹座、双鱼座"},

            {"type": "h2", "text": "♐ 射手座（11.23-12.21）"},
            {"type": "p", "text": "<strong>性格特点：</strong>乐观、自由、爱冒险、直率"},
            {"type": "ri", "heading":"专属酒款：西拉（Syrah）", "text":"<strong>推荐酒款：</strong>巴罗萨西拉、罗讷河谷西拉\n<strong>理由：</strong>射手座热情奔放，西拉的浓郁果味正好满足他们的冒险精神。\n<strong>饮用场景：</strong>户外烧烤、冒险旅行\n<strong>推荐年份：</strong>2019、2020"},
            {"type": "p", "text": "<strong>星座搭配：</strong>白羊座、狮子座"},

            {"type": "h2", "text": "♑ 摩羯座（12.22-1.19）"},
            {"type": "p", "text": "<strong>性格特点：</strong>务实、有野心、传统、有责任感"},
            {"type": "ri", "heading":"专属酒款：丹魄（Tempranillo）", "text":"<strong>推荐酒款：</strong>里奥哈陈酿、杜罗河丹魄\n<strong>理由：</strong>摩羯座务实有野心，丹魄的陈年潜力正好符合他们的长远眼光。\n<strong>饮用场景：</strong>商务宴请、重要场合\n<strong>推荐年份：</strong>2015、2016"},
            {"type": "p", "text": "<strong>星座搭配：</strong>金牛座、处女座"},

            {"type": "h2", "text": "♒ 水瓶座（1.20-2.18）"},
            {"type": "p", "text": "<strong>性格特点：</strong>独立、创新、叛逆、有个性"},
            {"type": "ri", "heading":"专属酒款：自然酒（Natural Wine）", "text":"<strong>推荐酒款：</strong>法国自然酒、意大利橙酒\n<strong>理由：</strong>水瓶座追求独特，自然酒的创新风格正好满足他们的个性需求。\n<strong>饮用场景：</strong>艺术展览、独立空间\n<strong>推荐年份：</strong>2020、2021"},
            {"type": "p", "text": "<strong>星座搭配：</strong>双子座、天秤座"},

            {"type": "h2", "text": "♓ 双鱼座（2.19-3.20）"},
            {"type": "p", "text": "<strong>性格特点：</strong>浪漫、敏感、富有想象力、爱做梦"},
            {"type": "ri", "heading":"专属酒款：莫斯卡托（Moscato）", "text":"<strong>推荐酒款：</strong>意大利莫斯卡托、法国微甜起泡\n<strong>理由：</strong>双鱼座浪漫多情，莫斯卡托的甜美花香正好满足他们的幻想。\n<strong>饮用场景：</strong>浪漫约会、闺蜜聚会\n<strong>推荐年份：</strong>2021、2022"},
            {"type": "p", "text": "<strong>星座搭配：</strong>巨蟹座、天蝎座"},

            {"type": "sep"},
            {"type": "quote", "text": "'星座只是参考，最重要的是找到自己喜欢的酒。'"},
            {"type": "p", "text": "星座配酒是一种有趣的尝试，但每个人的口味都不同。最重要的是找到自己喜欢的酒，享受喝酒的乐趣。"},

            {"type": "end", "text": "你是什么星座？<br/>你觉得你的星座酒准吗？<br/>欢迎在评论区分享你的星座酒！"}
        ])
