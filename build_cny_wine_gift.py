#!/usr/bin/env python3
"""Build Chinese New Year wine gift guide generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260614'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#b71c1c',
        ['春节送酒指南', '送礼送到心坎上'],
        '不同对象、不同预算的完美选酒方案',
        '红樽坊 | 节日特辑')

    html = rich_article(content_blocks, primary='#b71c1c', secondary='#ef5350')
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
    console.log('CNY Gift, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('CNY Gift:', e.message);
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
    build_article('cny_wine_gift',
        title='春节送酒指南：送礼送到心坎上',
        digest='送长辈、送领导、送朋友、送客户……春节送酒是一门学问。不同对象、不同预算，这篇指南帮你选对酒。',
        category='holiday',
        tags=['春节','送礼','节日','礼物','新年'],
        content_blocks=[
            {"type": "title", "text": "春节送酒指南：送礼送到心坎上"},
            {"type": "subtitle", "text": "不同对象、不同预算的完美选酒方案"},
            {"type": "lead", "text": "春节快到了，你准备好送什么酒了吗？送长辈、送领导、送朋友、送客户……不同对象，送不同的酒。这篇指南帮你选对酒，送礼送到心坎上。"},

            {"type": "h2", "text": "🍷 送礼的基本原则"},
            {"type": "p", "text": "春节送酒，遵循这几个原则："},
            {"type": "list", "items": [
                "<strong>了解对方喜好</strong>——投其所好最重要",
                "<strong>预算适中</strong>——不要太便宜显得敷衍，也不要太贵让人有压力",
                "<strong>包装精美</strong>——送礼要有仪式感",
                "<strong>品牌有保障</strong>——选择知名品牌，品质有保障",
                "<strong>避免敏感话题</strong>——不要送'4'瓶，不要送白色包装"
            ]},

            {"type": "h2", "text": "👨‍👩‍👧‍👦 不同对象的送酒建议"},
            {"type": "p", "text": "根据不同的送礼对象，推荐不同的酒款："},

            {"type": "ri", "heading":"送长辈（父母、岳父母）", "text":"<strong>预算：</strong>¥200-500\n<strong>推荐酒款：</strong>张裕解百纳、长城五星、宁夏贺兰山东麓赤霞珠\n<strong>理由：</strong>长辈通常喜欢国产酒，品牌知名度高，口感醇厚\n<strong>包装：</strong>选择红色或金色包装，喜庆吉利\n\n<strong>避雷：</strong>不要送太洋气的酒，长辈可能不习惯"},
            {"type": "ri", "heading":"送领导/客户", "text":"<strong>预算：</strong>¥500-2000\n<strong>推荐酒款：</strong>拉菲传说、奔富Bin系列、波尔多中级庄\n<strong>理由：</strong>品牌知名度高，有面子，品质有保障\n<strong>包装：</strong>选择原木箱或礼盒装，显得高档\n\n<strong>避雷：</strong>不要送太便宜的酒，显得不重视"},
            {"type": "ri", "heading":"送朋友/同事", "text":"<strong>预算：</strong>¥100-300\n<strong>推荐酒款：</strong>黄尾袋鼠、桃乐丝公牛血、智利赤霞珠\n<strong>理由：</strong>性价比高，易饮顺口，适合日常饮用\n<strong>包装：</strong>可以选择双瓶装，实惠又体面\n\n<strong>避雷：</strong>不要送太贵的酒，朋友会有压力"},
            {"type": "ri", "heading":"送年轻朋友", "text":"<strong>预算：</strong>¥100-300\n<strong>推荐酒款：</strong>桃红葡萄酒、莫斯卡托、起泡酒\n<strong>理由：</strong>颜值高，易饮，适合年轻人\n<strong>包装：</strong>选择时尚设计的酒标，符合年轻人审美\n\n<strong>避雷：</strong>不要送太传统的酒，年轻人可能不喜欢"},

            {"type": "h2", "text": "💰 不同预算的推荐方案"},
            {"type": "table", "headers": ["预算", "推荐酒款", "适合对象", "理由"],
             "rows": [
                 ["¥100-200", "黄尾袋鼠、桃乐丝", "朋友/同事", "性价比高，易饮"],
                 ["¥200-500", "张裕解百纳、长城五星", "长辈", "国产名牌，口感醇厚"],
                 ["¥500-1000", "拉菲传说、奔富Bin", "领导/客户", "品牌知名，有面子"],
                 ["¥1000-2000", "波尔多中级庄、巴罗萨西拉", "重要客户", "品质高端，有档次"],
                 ["¥2000+", "波尔多列级庄、勃艮第", "特殊场合", "顶级名酒，诚意满满"]
             ]},

            {"type": "h2", "text": "🎁 送酒的包装技巧"},
            {"type": "p", "text": "送酒时，包装很重要："},
            {"type": "list", "items": [
                "<strong>选择礼盒装</strong>——显得更正式、更有档次",
                "<strong>加一条丝带</strong>——红色或金色丝带，增加喜庆感",
                "<strong>附一张贺卡</strong>——写上祝福语，更有心意",
                "<strong>搭配酒杯</strong>——送酒配酒杯，实用又贴心",
                "<strong>注意颜色</strong>——红色、金色最吉利，避免白色"
            ]},

            {"type": "h2", "text": "🚫 送酒的禁忌"},
            {"type": "p", "text": "春节送酒，这些禁忌要注意："},
            {"type": "list", "items": [
                "<strong>不要送4瓶</strong>——'4'谐音'死'，不吉利",
                "<strong>不要送白色包装</strong>——白色在中国文化中与丧事相关",
                "<strong>不要送过期酒</strong>——检查保质期，确保酒的品质",
                "<strong>不要送假酒</strong>——从正规渠道购买，确保正品",
                "<strong>不要送对方忌酒</strong>——如果对方不喝酒，不要勉强送酒"
            ]},

            {"type": "h2", "text": "💡 送酒的小贴士"},
            {"type": "p", "text": "记住这几个小贴士，让你的送礼更完美："},
            {"type": "list", "items": [
                "<strong>提前购买</strong>——不要等到最后一刻才买",
                "<strong>检查包装</strong>——确保包装完好无损",
                "<strong>保留小票</strong>——万一对方需要退换",
                "<strong>附上酒单</strong>——告诉对方酒的饮用方法",
                "<strong>表达心意</strong>——送礼最重要的是心意"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'送礼不在贵，而在对。选对酒，送到心坎上。'"},
            {"type": "p", "text": "春节送酒，是一门学问，也是一种心意。选对酒，送到心坎上，让对方感受到你的用心和祝福。"},

            {"type": "end", "text": "你春节打算送什么酒？<br/>你有什么送酒的经验？<br/>欢迎在评论区分享你的送酒故事！"}
        ])
