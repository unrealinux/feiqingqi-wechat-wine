#!/usr/bin/env python3
"""Build French wine decline article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#1a237e',
        ['法国酒不如从前了？', '真相可能颠覆认知'],
        '法国酒的辉煌还在吗',
        '红樽坊 | 深度观点')

    html = rich_article(content_blocks, primary='#1a237e', secondary='#3f51b5')
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
    console.log('France, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('France:', e.message);
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
    build_article('french_wine_decline',
        title='法国酒不如从前了？真相可能颠覆认知',
        digest='法国酒还是世界第一吗？从波尔多到勃艮第，法国酒的辉煌还在吗？这篇指南带你了解法国酒的真相。',
        category='opinion',
        tags=['法国','波尔多','勃艮第','衰落','真相'],
        content_blocks=[
            {"type": "title", "text": "法国酒不如从前了？"},
            {"type": "subtitle", "text": "真相可能颠覆认知"},
            {"type": "lead", "text": "法国酒还是世界第一吗？从波尔多到勃艮第，法国酒的辉煌还在吗？这篇指南带你了解法国酒的真相，颠覆你的认知。"},

            {"type": "h2", "text": "📉 法国酒的衰落"},
            {"type": "p", "text": "法国酒确实在衰落："},
            {"type": "list", "items": [
                "<strong>市场份额下降</strong>——法国酒在全球市场的份额在下降",
                "<strong>新世界崛起</strong>——美国、澳大利亚、智利等新世界国家崛起",
                "<strong>价格虚高</strong>——法国酒价格虚高，性价比下降",
                "<strong>创新不足</strong>——法国酒传统有余，创新不足",
                "<strong>年轻消费者流失</strong>——年轻人更喜欢新世界酒"
            ]},

            {"type": "h2", "text": "🤔 为什么法国酒衰落？"},
            {"type": "p", "text": "法国酒衰落的原因："},
            {"type": "ri", "heading":"原因一：传统束缚", "text":"<strong>问题：</strong>法国酒太传统，不愿意改变\n<strong>例子：</strong>波尔多仍然坚持传统酿造方法\n<strong>后果：</strong>无法满足现代消费者的需求"},
            {"type": "ri", "heading":"原因二：价格虚高", "text":"<strong>问题：</strong>法国酒价格虚高，性价比下降\n<strong>例子：</strong>波尔多列级庄价格是智利酒的10倍\n<strong>后果：</strong>消费者转向性价比更高的新世界酒"},
            {"type": "ri", "heading":"原因三：创新不足", "text":"<strong>问题：</strong>法国酒创新不足，无法吸引年轻消费者\n<strong>例子：</strong>很少有法国酒尝试新品种或新方法\n<strong>后果：</strong>年轻消费者更喜欢创新的新世界酒"},

            {"type": "h2", "text": "🌟 法国酒的优势"},
            {"type": "p", "text": "法国酒仍然有这些优势："},
            {"type": "list", "items": [
                "<strong>历史底蕴</strong>——法国酒有千年的历史底蕴",
                "<strong>风土条件</strong>——法国的风土条件仍然得天独厚",
                "<strong>酿造传统</strong>——法国的酿造传统仍然世界一流",
                "<strong>品质保证</strong>——法国酒的品质仍然有保证",
                "<strong>品牌价值</strong>——法国酒的品牌价值仍然很高"
            ]},

            {"type": "h2", "text": "🌍 新世界的崛起"},
            {"type": "p", "text": "新世界国家为什么能崛起？"},
            {"type": "ri", "heading":"美国", "text":"<strong>优势：</strong>创新精神、市场化运作\n<strong>代表产区：</strong>纳帕谷\n<strong>成功原因：</strong>敢于创新，敢于挑战法国酒"},
            {"type": "ri", "heading":"澳大利亚", "text":"<strong>优势：</strong>性价比高、品牌营销强\n<strong>代表产区：</strong>巴罗萨谷\n<strong>成功原因：</strong>注重性价比，品牌营销出色"},
            {"type": "ri", "heading":"智利", "text":"<strong>优势：</strong>性价比极高、品质稳定\n<strong>代表产区：</strong>中央山谷\n<strong>成功原因：</strong>性价比极高，品质稳定"},

            {"type": "h2", "text": "📊 法国酒 vs 新世界酒"},
            {"type": "table", "headers": ["方面", "法国酒", "新世界酒"],
             "rows": [
                 ["历史", "千年历史", "几百年历史"],
                 ["传统", "传统深厚", "创新精神"],
                 ["价格", "价格虚高", "性价比高"],
                 ["品质", "品质保证", "品质稳定"],
                 ["创新", "创新不足", "敢于创新"],
                 ["市场", "份额下降", "份额上升"]
             ]},

            {"type": "h2", "text": "💡 法国酒的未来"},
            {"type": "p", "text": "法国酒的未来在哪里？"},
            {"type": "list", "items": [
                "<strong>创新</strong>——法国酒需要创新，吸引年轻消费者",
                "<strong>性价比</strong>——法国酒需要提高性价比",
                "<strong>品牌营销</strong>——法国酒需要加强品牌营销",
                "<strong>多元化</strong>——法国酒需要多元化发展",
                "<strong>国际化</strong>——法国酒需要更国际化"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'法国酒的辉煌还在，但需要改变。'"},
            {"type": "p", "text": "法国酒仍然有辉煌的历史和品质，但需要改变才能适应现代市场。创新、性价比、品牌营销是法国酒未来的关键。"},

            {"type": "end", "text": "你觉得法国酒还行吗？<br/>你更喜欢法国酒还是新世界酒？<br/>欢迎在评论区分享你的看法！"}
        ])
