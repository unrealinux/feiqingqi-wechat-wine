import os, json
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260610'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#8b0000',
        ['🎁 葡萄酒送礼指南', '送什么酒不会错？'],
        '节日 · 商务 · 朋友 · 长辈 · 三档预算',
        '送礼指南 · 红酒顾问')

    html = rich_article(content_blocks, primary='#8b0000', secondary='#d4af37')
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
    build_article('wine_gift_guide',
        title='🎁 葡萄酒送礼指南：送什么酒不会错？',
        digest='节日、商务、朋友、长辈——不同场景送什么酒？三档预算帮你搞定99%的送礼场合。',
        category='wine-knowledge',
        tags=['送礼','礼物','节日','商务','朋友','长辈','推荐'],
        content_blocks=[
            {'type':'title','text':'🎁 葡萄酒送礼指南'},
            {'type':'subtitle','text':'送什么酒不会错？ | 节日 · 商务 · 朋友 · 长辈 · 三档预算'},

            {'type':'lead','text':'送葡萄酒是最安全的礼物之一——既体面又实用，男女老少皆宜。但面对琳琅满目的酒款，很多人还是不知道怎么选。这篇文章帮你搞定99%的送礼场合。'},

            {'type':'h2','text':'🎯 送礼三原则'},

            {'type':'list','items':[
                '选大品牌不选小众——收礼人认识的牌子，才有"面子"',
                '选经典产区不选冷门——波尔多、勃艮第、纳帕谷，中国人最认',
                '选适饮年份不选老年份——大部分送礼酒要尽快喝掉，别选需要陈年的',
            ]},

            {'type':'h2','text':'💰 三档预算推荐'},

            {'type':'h3','text':'🎁 200-500元：实用档'},

            {'type':'ri','heading':'送朋友、同事、普通亲戚','text':'<strong>1. 奔富 Bin 389（澳大利亚，¥450-550）</strong>\n澳洲酒王，知名度极高，送出手绝对有面子。\n\n<strong>2. 拉菲传奇 波尔多（法国，¥108-128）</strong>\n拉菲的入门款，品牌价值高，价格亲民。\n\n<strong>3. 干露侯爵 梅洛（智利，¥128-168）</strong>\n智利国民酒，果香浓郁，适合大众口味。\n\n<strong>4. 黄尾袋鼠 西拉（澳大利亚，¥85-108）</strong>\n全球销量冠军，新手友好，不会踩雷。'},

            {'type':'h3','text':'🏆 500-1000元：体面档'},

            {'type':'ri','heading':'送长辈、领导、重要客户','text':'<strong>1. 奔富 Bin 407（澳大利亚，¥680-780）</strong>\nBin 389的升级版，赤霞珠为主，更有深度。\n\n<strong>2. 蒙特布查诺 基安蒂珍藏（意大利，¥388-488）\n意大利经典，酸度清爽，配餐百搭。\n\n<strong>3. 杰卡斯 珍藏 赤霞珠（澳大利亚，¥388-488）</strong>\n澳洲名庄，品质稳定，送礼不会错。\n\n<strong>4. 张裕解百纳 N398（中国，¥128-168）</strong>\n国产精品，支持国货，送长辈有情怀。'},

            {'type':'h3','text':'💎 1000元以上：高端档'},

            {'type':'ri','heading':'送重要客户、未来岳父、重要场合','text':'<strong>1. 奔富 Bin 707（澳大利亚，¥1,200-1,500）</strong>\n澳洲赤霞珠的巅峰，送懂酒的人绝对惊艳。\n\n<strong>2. 作品一号（美国纳帕谷，¥2,800-3,500）</strong>\n美国酒王，波尔多风格，品牌价值极高。\n\n<strong>3. 拉菲古堡（法国波尔多，¥6,500-8,500）</strong>\n波尔多一级庄，送礼的"硬通货"。\n\n<strong>4. 银色高地 家族珍藏（中国宁夏，¥458-588）</strong>\n国产精品，Decanter金奖，送懂酒的人。'},

            {'type':'h2','text':'📅 节日送礼攻略'},

            {'type':'table','headers':['节日','推荐酒款','理由'],
            'rows':[
                ['春节','奔富 Bin 389 / 拉菲传奇','红色包装喜庆，品牌认知度高'],
                ['中秋节','香槟/起泡酒 + 月饼礼盒','起泡酒适合团圆氛围'],
                ['情人节','香槟名庄（唐培里侬/库克）','浪漫仪式感，女生最爱'],
                ['父亲节','波尔多列级庄 / 纳帕赤霞珠','父亲辈最认法国酒和美国酒'],
                ['中秋节','张裕解百纳 / 长城桑干','国产精品，支持国货'],
                ['圣诞节','勃艮第黑皮诺 / 香槟','西方节日配西方酒'],
            ]},

            {'type':'h2','text':'❌ 送礼避坑指南'},

            {'type':'list','items':[
                '❌ 送太便宜的酒（¥50以下）——显得没诚意',
                '❌ 送太小众的酒——收礼人不认识，显得"装"',
                '❌ 送需要陈年的酒——收礼人可能不懂保存',
                '❌ 送螺旋盖的酒送长辈——老一辈觉得"不高级"',
                '❌ 送已经过了适饮期的老酒——可能已经变质',
                '❌ 送不知名的产区——不如送大品牌的入门款',
            ]},

            {'type':'tip','heading':'💡 送礼小贴士','text':'如果实在不知道选什么，就送奔富 Bin 389（¥500左右）——这是中国送礼界的"硬通货"，知名度堪比茅台，收礼人一看就知道值多少钱。'},

            {'type':'quote','text':'送葡萄酒最重要的是心意，不是价格。一瓶¥100的好酒，配上一张手写卡片，比¥1000的名庄酒更让人感动。'},

            {'type':'sep','text':''},
            {'type':'end','text':'— 送礼送到心坎里 —'},
        ]
    )
    print('\nWine Gift Guide created!')
