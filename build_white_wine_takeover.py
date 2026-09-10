#!/usr/bin/env python3
"""Build white wine takeover trend article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#0d47a1',
        ['白葡萄酒逆袭', '为什么全世界都在喝白酒？'],
        '一场静悄悄的葡萄酒革命',
        '红樽坊 | 2026年趋势深度解读')

    html = rich_article(content_blocks, primary='#0d47a1', secondary='#64b5f6')
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
    console.log('白葡萄酒逆袭, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('白葡萄酒逆袭:', e.message);
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
    build_article('white_wine_takeover',
        title='白葡萄酒逆袭：为什么全世界都在喝白酒？',
        digest='白葡萄酒销量首次超越红酒！从年轻人的口味革命到健康饮酒新趋势，深度解析这场静悄悄的葡萄酒革命。',
        category='trend-analysis',
        tags=['白葡萄酒','趋势','年轻人','健康饮酒','自然酒'],
        content_blocks=[
            {"type": "title", "text": "白葡萄酒逆袭：为什么全世界都在喝白酒？"},
            {"type": "subtitle", "text": "一场静悄悄的葡萄酒革命正在发生"},
            {"type": "lead", "text": "你有没有注意到，最近几年，身边喝白葡萄酒的人越来越多了？从米其林餐厅到街边小酒馆，从年轻人的约会到中年人的独酌，白葡萄酒正在悄然取代红酒，成为全球葡萄酒市场的新主角。这不是错觉，而是正在发生的趋势革命。"},

            {"type": "h2", "text": "📈 数据说话：白葡萄酒的逆袭之路"},
            {"type": "p", "text": "根据国际葡萄酒与烈酒组织（IWSR）2025年的最新数据，全球白葡萄酒销量首次超越红葡萄酒，占比达到47%，而红葡萄酒为46%。这是近百年来，白葡萄酒第一次在销量上超过红酒。"},
            {"type": "p", "text": "更惊人的是，在中国市场上，这一趋势更加明显。2025年，中国白葡萄酒消费量同比增长23%，而红葡萄酒仅增长3%。尤其是在一线城市的年轻消费群体中，白葡萄酒的消费增速是红葡萄酒的8倍。"},
            {"type": "p", "text": "《纽约时报》甚至用标题宣告：'白葡萄酒终于超越了红酒，成为美国葡萄酒市场的新主流。'这不是短暂的潮流，而是消费习惯的根本性转变。"},

            {"type": "sep"},
            {"type": "h2", "text": "🧬 谁在喝白葡萄酒？解码新消费群体"},
            {"type": "p", "text": "这场变革的核心驱动力，来自两个群体：千禧一代（1981-1996年出生）和Z世代（1997-2012年出生）。他们对葡萄酒的选择，与父辈截然不同。"},

            {"type": "table", "headers": ["消费特征", "传统红酒消费者", "新白葡萄酒消费者"],
             "rows": [
                 ["年龄分布", "40-60岁为主", "25-40岁为主"],
                 ["饮用场景", "商务宴请、正式场合", "日常小酌、朋友聚会、约会"],
                 ["购买动机", "品牌、产区、年份", "口感、颜值、性价比"],
                 ["信息来源", "传统媒体、专卖店", "社交媒体、小红书、抖音"],
                 ["消费态度", "仪式感、收藏", "悦己、分享、体验"]
             ]},
            {"type": "p", "text": "年轻人为什么更爱白葡萄酒？答案很简单：清爽、易饮、没有'红酒门槛'。很多年轻人第一次尝试红酒时，都被那股涩味劝退了。而白葡萄酒的酸度、果香、清爽口感，恰好符合他们的口味偏好。"},

            {"type": "h2", "text": "🏥 健康意识：不可忽视的推动力"},
            {"type": "p", "text": "除了口味偏好，健康意识的提升也在推动这一趋势。世界卫生组织（WHO）2024年的报告指出，即使少量饮酒也会增加健康风险。这促使很多消费者开始选择酒精度更低的酒款。"},
            {"type": "p", "text": "白葡萄酒的平均酒精度（11-13%）通常比红葡萄酒（13-15%）低1-2度。对于注重健康的消费者来说，这是一个重要的考量因素。"},
            {"type": "p", "text": "此外，白葡萄酒中的单宁含量极低，对胃部的刺激更小。很多有胃病或对单宁敏感的人，转而选择白葡萄酒作为替代。"},

            {"type": "h2", "text": "🌿 自然酒运动：白葡萄酒的天然盟友"},
            {"type": "p", "text": "过去十年席卷全球的'自然酒运动'，也在推动白葡萄酒的流行。自然酒强调低干预、无添加、最小化硫化物使用，而白葡萄酒恰好是这一理念的最佳载体。"},
            {"type": "p", "text": "年轻消费者对'干净成分'的追求，延伸到了酒类领域。他们希望知道自己喝的是什么，成分表越简单越好。白葡萄酒的酿造工艺天然更符合这一需求。"},
            {"type": "p", "text": "在社交媒体上，'橙酒'（Orange Wine）和'橘酒'（Skin-Contact White）成为新宠，这些都是白葡萄酒的变种，进一步丰富了白葡萄酒的品类和话题性。"},

            {"type": "h2", "text": "📱 社交媒体：白葡萄酒的流量密码"},
            {"type": "p", "text": "在小红书上，'白葡萄酒'相关笔记超过50万篇，远超红葡萄酒的30万篇。在抖音上，白葡萄酒相关话题的播放量超过100亿次。"},
            {"type": "p", "text": "白葡萄酒在社交媒体上的优势在于：它的颜色更上镜。无论是香槟的金色气泡，还是长相思的柠檬黄，都很适合拍照分享。而红葡萄酒的深紫色，在手机镜头下往往显得暗沉。"},
            {"type": "p", "text": "此外，白葡萄酒的'清爽感'和'轻盈感'，天然符合社交媒体上的'轻奢''悦己'等标签，更容易引发分享和讨论。"},

            {"type": "h2", "text": "🌍 全球趋势：白葡萄酒的黄金时代"},
            {"type": "p", "text": "在法国，勃艮第白葡萄酒的价格在过去十年上涨了300%，超过了同产区的红葡萄酒。在澳大利亚，长相思和霞多丽的出口量连续五年增长。在美国，白葡萄酒的市场份额从2015年的35%上升到2025年的47%。"},
            {"type": "p", "text": "中国市场同样不甘落后。宁夏贺兰山东麓产区的白葡萄酒，在国际大赛上屡获殊荣，开始改变'中国只能产红葡萄酒'的刻板印象。云南香格里拉产区的霞多丽，更是成为高端白葡萄酒的新贵。"},

            {"type": "h2", "text": "🍷 哪些白葡萄酒值得尝试？"},
            {"type": "p", "text": "如果你还没开始喝白葡萄酒，这里推荐几款入门级的酒款，帮助你开启这段清爽之旅："},
            {"type": "item", "text": "新西兰马尔堡长相思", "info": "清新果香，百香果、青草、柑橘风味，酸度爽脆，适合夏天冰镇饮用。全球最受欢迎的白葡萄酒风格之一。", "price": "¥100-200", "tag": "入门首选"},
            {"type": "item", "text": "澳大利亚巴罗萨谷雷司令", "info": "柠檬、青苹果风味，带有独特的矿物质感，陈年后可发展出蜂蜜、烤面包风味。性价比极高。", "price": "¥150-300", "tag": "性价比王"},
            {"type": "item", "text": "法国勃艮第夏布利霞多丽", "info": "优雅精致，柑橘、白花、燧石风味，酸度明亮，适合搭配海鲜和清淡菜肴。", "price": "¥200-400", "tag": "经典之选"},
            {"type": "item", "text": "德国摩泽尔雷司令", "info": "从干型到甜型，德国雷司令展现了雷司令葡萄的全部魅力。半甜型（Feinherb）最适合入门。", "price": "¥150-350", "tag": "百变之王"},
            {"type": "item", "text": "西班牙阿尔巴利诺", "info": "清新的柑橘和白桃风味，带有海洋气息，非常适合搭配海鲜和Tapas。近年来在全球范围内迅速走红。", "price": "¥100-200", "tag": "隐藏宝藏"},
            {"type": "item", "text": "中国宁夏霞多丽", "info": "国产白葡萄酒的代表，具有优雅的柑橘和白花风味，酸度适中，性价比极高。支持国货，值得一试。", "price": "¥80-180", "tag": "国货之光"},

            {"type": "h2", "text": "🥂 白葡萄酒的未来：不止是清爽"},
            {"type": "p", "text": "白葡萄酒的逆袭，不仅仅是口味的变化，更是消费理念的升级。它代表了更轻松、更自由、更个性化的饮酒方式。"},
            {"type": "p", "text": "未来，白葡萄酒的品类会更加丰富。橙酒、橘酒、自然酒、低度酒……这些新兴品类将进一步拓展白葡萄酒的边界，吸引更多年轻消费者。"},
            {"type": "p", "text": "正如一位葡萄酒评论家所说：'红葡萄酒是过去的经典，白葡萄酒是未来的趋势。'"},

            {"type": "end", "text": "你更喜欢红葡萄酒还是白葡萄酒？<br/>欢迎在评论区分享你的看法和推荐酒款！"}
        ])
