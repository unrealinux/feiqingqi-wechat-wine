import os, json, base64
from rich_article import rich_article, js_str, cover_svg

CONFIG_CODE = "require('./config')"
DATE = '20260610'

def build_article(name, title, digest, category, tags, content_blocks):
    svg_b64 = cover_svg('#2e7d32',
        ['德国雷司令深度指南', '从摩泽尔到莱茵高'],
        '从干型到贵腐 · 一篇读懂德国最伟大的白葡萄品种',
        '摩泽尔 · 莱茵高 · 法尔兹 · 纳赫 · 莱茵黑森')

    html = rich_article(content_blocks, primary='#2e7d32', secondary='#81c784')
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
    build_article('german_riesling',
        title='🇩🇪 德国雷司令深度指南：从摩泽尔到莱茵高',
        digest='雷司令是德国最伟大的白葡萄品种。从干型到贵腐甜酒，从摩泽尔陡坡到莱茵高台地，一篇文章带你全看懂。',
        category='wine-knowledge',
        tags=['德国','雷司令','Riesling','摩泽尔','莱茵高','白葡萄酒','甜酒','产区分级'],
        content_blocks=[
            {'type':'title','text':'🇩🇪 德国雷司令深度指南'},
            {'type':'subtitle','text':'从摩泽尔到莱茵高 · 从干型到贵腐 | 一篇读懂德国最伟大的白葡萄品种'},

            {'type':'lead','text':'雷司令（Riesling）是德国最伟大的白葡萄品种，没有之一。它做到了其他白葡萄几乎无法实现的事情：从极干到极甜，从清爽到浓郁，从日常佐餐到收藏级陈年，全都能用同一个品种完成。更惊人的是，好的雷司令可以陈年50年以上——在白葡萄酒中极为罕见。'},

            {'type':'p','text':'本文从葡萄特性、产区分级、风格类型到购买推荐，带你完整了解这个"白葡萄酒之王"。'},

            {'type':'h2','text':'🍇 雷司令：为什么它如此特别？'},

            {'type':'info','heading':'🍇 品种核心特性','text':'雷司令有几个其他白葡萄无法比拟的特点：\n\n极强的风土表达力——雷司令像"味觉地图"，同一品种在不同土壤上呈现出截然不同的风味：板岩带来矿物感和青苹果香气、石灰岩带来花香和柑橘、黏土带来饱满的桃子香\n\n完美的酸度骨架——天然高酸度是雷司令的DNA，这让它既可以酿成清爽的干型，也可以支撑甜酒的甜度而不腻\n\n惊人的陈年能力——顶级的德国雷司令（如Egon Müller）可以陈年50-100年，且越陈越复杂\n\n从极干到极甜的全覆盖——同一个品种，可以酿成Trocken（干型）到TBA（贵腐甜酒）的全谱系\n\n低酒精度优雅——大部分雷司令只有8-12%，比霞多丽（13-15%）轻很多，更适合轻松饮用'},

            {'type':'p','text':'雷司令的经典香气：青苹果、柠檬、柑橘、白桃、蜂蜜、汽油（陈年后）。"汽油味"是雷司令陈年后的标志性香气，听起来奇怪但尝过就知道——非常迷人。'},

            {'type':'h2','text':'🗺️ 德国六大核心雷司令产区'},

            {'type':'table','headers':['产区','位置','特色','典型风格','标杆酒庄'],
            'rows':[
                ['摩泽尔 Mosel','莱茵河支流河谷','最陡的葡萄园坡度（60°+）\n蓝色/红色板岩土壤','轻盈优雅，酒精度低\n青苹果+矿物感','Egon Müller, Dr. Loosen, Joh. Jos. Prüm'],
                ['莱茵高 Rheingau','莱茵河北岸','雷司令的诞生地\n黄土+板岩混合','优雅平衡，结构紧实\n柑橘+花香','Georg Breuer, Robert Weil, Schloss Johannisberg'],
                ['法尔兹 Pfalz','德国南部','温暖干燥，产量最大\n多样土壤类型','饱满浓郁，果味成熟\n桃子+杏子','Bassermann-Jordan, Dr. Bürklin-Wolf'],
                ['纳赫 Nahe','莱茵河支流','土壤类型最丰富\n火山岩+板岩+黏土','兼具优雅与力量\n矿物感突出','Dönnhoff, Schlossgut Diel'],
                ['莱茵黑森 Rheinhessen','莱茵河中游','德国最大葡萄酒产区\n石灰岩+黏土','果味充沛，平易近人\n柑橘+杏子','Keller, Wittmann'],
                ['弗兰肯 Franken','德国中部','以Bocksbeutel扁瓶闻名\n石灰岩+粘土','干型为主，厚实饱满\n矿物感强','Juliusspital, Hans Wirsching'],
            ]},

            {'type':'card','heading':'摩泽尔 Mosel — 雷司令的精神故乡','text':'摩泽尔是德国最著名的雷司令产区。蓝色和红色板岩土壤富含矿物，赋予葡萄酒独特的"矿石气息"。葡萄园坡度极陡（有些超过60°），葡萄必须手工采摘。风格：轻盈酒体（8-10%酒精）、高酸度、精緻的矿物感。这里的甜型雷司令是全世界公认的标杆。'},

            {'type':'card','heading':'莱茵高 Rheingau — 雷司令的诞生地','text':'历史记载最早的雷司令种植出现在莱茵高。1435年3月13日，莱茵高一个伯爵的库存清单上首次出现了"Riesling"这个名字。这里相比摩泽尔气候更温暖，雷司令也更饱满、更有结构，兼具优雅与力量。'},

            {'type':'card','heading':'法尔兹 & 纳赫 — 多元化的魅力','text':'法尔兹是德国最温暖、阳光最充足的产区，雷司令风格饱满圆润，果味成熟。纳赫面积虽小，但土壤类型之丰富冠绝德国——从火山岩到板岩到石灰岩，每种土壤都带来截然不同的味道。'},

            {'type':'h2','text':'🏅 德国葡萄酒分级：读懂酒标是关键'},

            {'type':'p','text':'德国的葡萄酒分级体系让很多人望而生畏，其实核心就三个维度：'},

            {'type':'h3','text':'维度一：按产区（VDP 分级）'},
            {'type':'p','text':'VDP（德国名庄联盟）是德国最权威的酒庄协会，酒瓶上的"雄鹰徽章"就是品质的保证：'},

            {'type':'table','headers':['VDP级别','含义','占比'],
            'rows':[
                ['VDP Gutswein','大区级——入门款','约50%'],
                ['VDP Ortswein','村庄级——风土初现','约25%'],
                ['VDP Erste Lage','一级园——该村最好的葡萄园','约15%'],
                ['VDP Grosse Lage','特级园——德国最高级别','约10%'],
            ]},

            {'type':'tip','heading':'💡 VDP 关键术语','text':'Grosse Lage 相当于德国的"特级园"，产量仅占10%左右。Groses Gewächs（缩写GG）是特级园酿造的干型雷司令，品质极高，是雷司令爱好者的终极追求。酒瓶上的"雄鹰徽章"就是VDP的品质保证。'},

            {'type':'h3','text':'维度二：按成熟度（Prädikat 分级）'},
            {'type':'p','text':'这是德国最著名的分级——根据葡萄采摘时的含糖量来划分。越高意味着葡萄越成熟、酒体越饱满、甜度越高：'},

            {'type':'table','headers':['级别','含义','典型风格'],
            'rows':[
                ['Kabinett','逐串精选·最低成熟度','最轻盈，干型或微甜，7-9度'],
                ['Spätlese','晚摘·更成熟的葡萄','中等酒体，半干到甜型'],
                ['Auslese','逐串精选·选成熟果串','酒体饱满，甜型为主'],
                ['Beerenauslese (BA)','逐粒精选·贵腐菌感染','浓郁甜酒，产量极低'],
                ['Trockenbeerenauslese (TBA)','干粒精选·完全贵腐化','最顶级甜酒，极其稀有'],
                ['Eiswein','冰酒·零下7°C冰冻采摘','浓缩甜酒，纯净的酸度'],
            ]},

            {'type':'tip','heading':'⚠️ 常见误解','text':'要特别注意：如果酒标上写着"Trocken"意味着干型（不甜），"Feinherb"是半干，"Lieblich"是半甜，"Süß"是甜型。但Prädikat级别（Kabinett/Spätlese等）本身只表示葡萄成熟度，不直接等于甜度！同一个Spätlese可以酿成干型也可以酿成甜型。'},

            {'type':'h2','text':'🥂 雷司令风格全谱系'},

            {'type':'table','headers':['风格','酒精度','残糖','适合场景'],
            'rows':[
                ['干型 GG 雷司令','12-13%','<9g/L','高级配餐（海鲜、白肉）'],
                ['干型 村庄级','11-12%','<9g/L','日常晚餐、沙拉、寿司'],
                ['半干 Spätlese','8-10%','9-35g/L','亚洲菜、川菜、泰国菜'],
                ['甜型 Auslese','7-9%','35-80g/L','甜品、蓝纹奶酪、坚果'],
                ['贵腐 BA/TBA','6-8%','80-250g/L','鹅肝、水果甜点、独饮'],
                ['冰酒 Eiswein','6-8%','100-200g/L','餐后甜点、奶酪拼盘'],
            ]},

            {'type':'h2','text':'🍽️ 雷司令配餐：白葡萄酒万能王'},

            {'type':'p','text':'雷司令可能是配餐最灵活的白葡萄酒——从高级法餐到街头小吃都能找到对应风格。关键秘诀：你只需要根据菜的口味选择雷司令的甜度级别。'},

            {'type':'table','headers':['菜品','推荐雷司令风格','理由'],
            'rows':[
                ['清蒸鱼/白灼虾','干型或半干摩泽尔','高酸度去腥，矿物感提鲜'],
                ['寿司/刺身','干型GG或村庄级','清爽干净，不抢鱼生本味'],
                ['川菜/湘菜','半干Spätlese','微甜中和辣感，花果香呼应'],
                ['泰国菜/越南菜','半干Auslese','甜辣搭配完美，香气浓郁'],
                ['烤鸭/叉烧','干型GG莱茵高','饱满酒体搭配风味肉类'],
                ['蓝纹奶酪','甜型Auslese/BA','甜咸碰撞，经典搭配'],
                ['水果甜点','冰酒/TBA','浓缩果香，甜度匹配'],
            ]},

            {'type':'quote','text':'雷司令配餐的黄金法则：菜的辣度越高、调味越丰富，就选越甜的雷司令。反之，菜越清淡、越追求食材本味，就选越干的雷司令。'},

            {'type':'h2','text':'💎 必喝酒庄推荐'},

            {'type':'card','heading':'入门级（¥100-250）第一次尝试德国雷司令','text':'Dr. Loosen "Dr. L" —— 摩泽尔的经典入门款，半甜风格，干净清爽\nJ.J. Prüm "Prüm Green Cap" —— 摩泽尔的标杆，果味充沛\nDönnhoff "Crusius" —— 纳赫精品酒庄，品质极其稳定'},
            {'type':'card','heading':'进阶级（¥250-600）追求品质，深入了解','text':'Robert Weil "Kiedrich" —— 莱茵高代表性酒庄，干型和甜型都出色\nDr. Bürklin-Wolf —— 法尔兹的GG标杆，饱满有力度\nGeorg Breuer "Rüdesheimer" —— 莱茵高精品，矿物感出彩'},
            {'type':'card','heading':'收藏级（¥600+）雷司令发烧友的终极追求','text':'Egon Müller-Scharzhof —— 摩泽尔的"雷司令之王"，全球最贵雷司令\nJoh. Jos. Prüm "Wehlener Sonnenuhr" —— 传奇葡萄园，陈年潜力极强\nKeller "G-Max" —— 莱茵黑森的传奇GG干型，一瓶难求'},

            {'type':'h2','text':'❌ 常见误区'},

            {'type':'list','items':[
                '❌ "雷司令都是甜的"——错！德国雷司令有大量干型（Trocken）选择，GG干型雷司令在世界顶级餐厅备受追捧',
                '❌ "蓝仙姑是德国好酒"——蓝仙姑（Blue Nun）是大众化商业品牌，不代表德国雷司令的真实水平',
                '❌ "雷司令不能陈年"——恰恰相反，顶级雷司令的陈年能力堪比波尔多列级庄',
                '❌ "雷司令只能配甜食"——干型雷司令配海鲜是一绝，半干配亚洲菜更是教科书级别',
                '❌ "便宜的雷司令不好喝"——100元出头也能买到Dr. Loosen这样的品质，德国雷司令的性价比极高',
            ]},

            {'type':'tip','heading':'🥇 入门推荐','text':'买一瓶Dr. Loosen "Dr. L"（约¥120），配一份白灼虾或清蒸鲈鱼——喝完你就会理解为什么雷司令被公认为世界上最优雅的白葡萄酒之一。'},

            {'type':'sep','text':''},
            {'type':'end','text':'— 雷司令不会辜负每一个认真对待它的人 —'},
        ]
    )
    print('\nGerman Riesling Guide created!')
