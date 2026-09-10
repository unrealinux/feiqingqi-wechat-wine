#!/usr/bin/env python3
"""Build overrated wines article generator."""
import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260615'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#e65100',
        ['那些被高估的葡萄酒', '你还在为名气买单吗？'],
        '别再被营销忽悠了',
        '红樽坊 | 深度观点')

    html = rich_article(content_blocks, primary='#e65100', secondary='#ff9800')
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
    console.log('Overrated, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('Overrated:', e.message);
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
    build_article('overrated_wines',
        title='那些被高估的葡萄酒：你还在为名气买单吗？',
        digest='拉菲真的值1万块吗？82年拉菲真的那么好喝？揭秘那些被高估的葡萄酒，别再被营销忽悠了。',
        category='opinion',
        tags=['高估','真相','营销','性价比','避坑'],
        content_blocks=[
            {"type": "title", "text": "那些被高估的葡萄酒"},
            {"type": "subtitle", "text": "你还在为名气买单吗？"},
            {"type": "lead", "text": "拉菲真的值1万块吗？82年拉菲真的那么好喝？揭秘那些被高估的葡萄酒，别再被营销忽悠了。"},

            {"type": "h2", "text": "🤔 什么是被高估？"},
            {"type": "p", "text": "被高估的酒有这些特点："},
            {"type": "list", "items": [
                "<strong>价格虚高</strong>——实际品质不值这个价",
                "<strong>名气大于实力</strong>——名气响，但品质一般",
                "<strong>营销驱动</strong>——靠营销炒作，不是靠品质",
                "<strong>稀缺性炒作</strong>——人为制造稀缺，抬高价格",
                "<strong>跟风消费</strong>——大家都说好，你也跟着买"
            ]},

            {"type": "h2", "text": "🍷 被高估的酒款"},
            {"type": "p", "text": "这些酒款被高估了："},
            {"type": "ri", "heading":"拉菲（Lafite）", "text":"<strong>价格：</strong>5000-50000元\n<strong>实际品质：</strong>优秀，但不值这个价\n<strong>为什么被高估：</strong>品牌溢价、中国市场炒作、假酒泛滥\n<strong>替代选择：</strong>波尔多中级庄，品质相当，价格只有1/10"},
            {"type": "ri", "heading":"82年拉菲", "text":"<strong>价格：</strong>5万-20万元\n<strong>实际品质：</strong>优秀，但已经过了最佳适饮期\n<strong>为什么被高估：</strong>电影炒作、稀缺性、身份象征\n<strong>真相：</strong>82年拉菲已经40多年了，很多已经过了适饮期"},
            {"type": "ri", "heading":"奔富Bin 389", "text":"<strong>价格：</strong>300-500元\n<strong>实际品质：</strong>良好，但性价比一般\n<strong>为什么被高估：</strong>品牌知名度高、中国市场热捧\n<strong>替代选择：</strong>澳洲其他酒庄的赤霞珠，品质相当，价格更低"},
            {"type": "ri", "heading":"张裕解百纳", "text":"<strong>价格：</strong>100-300元\n<strong>实际品质：</strong>一般，但品牌知名度高\n<strong>为什么被高估：</strong>国产老品牌、广告投入大\n<strong>替代选择：</strong>宁夏贺兰山东麓赤霞珠，品质更好"},

            {"type": "h2", "text": "📊 被高估的原因"},
            {"type": "p", "text": "这些酒为什么被高估？"},
            {"type": "list", "items": [
                "<strong>品牌溢价</strong>——品牌知名度高，价格自然高",
                "<strong>中国市场</strong>——中国市场热捧，价格被炒高",
                "<strong>稀缺性</strong>——人为制造稀缺，抬高价格",
                "<strong>电影效应</strong>——电影中出现，被追捧",
                "<strong>跟风消费</strong>——大家都说好，你也跟着买"
            ]},

            {"type": "h2", "text": "💡 不被高估的好酒"},
            {"type": "p", "text": "这些酒性价比高，不被高估："},
            {"type": "ri", "heading":"波尔多中级庄", "text":"<strong>价格：</strong>100-300元\n<strong>品质：</strong>优秀，性价比高\n<strong>推荐酒庄：</strong>杜夫、力士金\n<strong>理由：</strong>品质不输列级庄，价格只有1/10"},
            {"type": "ri", "heading":"智利赤霞珠", "text":"<strong>价格：</strong>50-150元\n<strong>品质：</strong>良好，性价比极高\n<strong>推荐酒庄：</strong>干露、蒙特斯\n<strong>理由：</strong>果味浓郁，易饮顺口"},
            {"type": "ri", "heading":"宁夏赤霞珠", "text":"<strong>价格：</strong>100-300元\n<strong>品质：</strong>优秀，潜力巨大\n<strong>推荐酒庄：</strong>张裕摩塞尔、贺兰晴雪\n<strong>理由：</strong>品质不输法国酒，价格更低"},

            {"type": "h2", "text": "🎯 如何避免被高估？"},
            {"type": "p", "text": "想避免被高估，试试这些方法："},
            {"type": "list", "items": [
                "<strong>忽略品牌</strong>——不要只看品牌，关注酒质",
                "<strong>盲品</strong>——不看酒标，只看酒液",
                "<strong>关注性价比</strong>——不要只看价格，关注性价比",
                "<strong>尝试新酒</strong>——不要只喝熟悉的酒",
                "<strong>相信自己的舌头</strong>——自己的感受最重要"
            ]},

            {"type": "h2", "text": "🚫 被高估的误区"},
            {"type": "p", "text": "这些误区要避免："},
            {"type": "list", "items": [
                "<strong>贵的不一定好</strong>——价格不代表品质",
                "<strong>名牌不一定好</strong>——品牌不代表一切",
                "<strong>老酒不一定好</strong>——年份不代表一切",
                "<strong>专家不一定对</strong>——专家的推荐不一定适合你",
                "<strong>大家都说好不一定好</strong>——跟风消费要谨慎"
            ]},

            {"type": "sep"},
            {"type": "quote", "text": "'买酒不买名气，买的是品质和心情。'"},
            {"type": "p", "text": "被高估的酒很多，但好酒也很多。不要被名气和营销忽悠，找到真正适合自己的好酒。"},

            {"type": "end", "text": "你觉得哪些酒被高估了？<br/>你有没有被高估的酒坑过？<br/>欢迎在评论区分享你的经历！"}
        ])
