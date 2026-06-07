import os, json, textwrap

CONFIG_CODE = "require('./config')"
DATE = '20260607'  

def js_str(s):
    """Escape for JS single-quoted string"""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def html_body(content_blocks):
    """Build HTML sections from a list of dicts: type, heading, body."""
    parts = ['<section style="padding:10px 0;">']
    for b in content_blocks:
        t = b['type']
        if t == 'title':
            parts.append(f'<h2 style="text-align:center;color:#b8860b;">{b["text"]}</h2>')
        elif t == 'subtitle':
            parts.append(f'<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">{b["text"]}</p>')
        elif t == 'h2':
            parts.append(f'<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">{b["text"]}</h2>')
        elif t == 'h3':
            parts.append(f'<h3 style="color:#b8860b;margin-top:20px;">{b["text"]}</h3>')
        elif t == 'p':
            parts.append(f'<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">{b["text"]}</p>')
        elif t == 'tip':
            parts.append(f'<div style="background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;"><p style="color:#795548;margin:0;font-size:14px;line-height:1.7;">{b["text"]}</p></div>')
        elif t == 'table':
            sep = '</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">'
            rows = ''.join('<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">' + sep.join(r) + '</td></tr>' for r in b['rows'])
            ths = ''.join('<th style="padding:10px;text-align:left;">' + h + '</th>' for h in b['headers'])
            thead = '<thead><tr style="background:#b8860b;color:#fff;">' + ths + '</tr></thead>'
            parts.append('<div style="overflow-x:auto;margin:15px 0;"><table style="width:100%;border-collapse:collapse;">' + thead + '<tbody>' + rows + '</tbody></table></div>')
        elif t == 'list':
            items = ''.join(f'<li style="margin:6px 0;color:#333;line-height:1.7;">{i}</li>' for i in b['items'])
            parts.append(f'<ul style="padding-left:20px;">{items}</ul>')
        elif t == 'box':
            parts.append(f'<div style="background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;"><h4 style="color:#b8860b;margin:0 0 8px 0;">{b.get("heading","")}</h4><p style="color:#333;margin:0;line-height:1.7;font-size:14px;">{b["text"]}</p></div>')
        elif t == 'sep':
            parts.append('<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>')
        elif t == 'end':
            parts.append(f'<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">{b["text"]}</p>')
    parts.append('</section>')
    return '\n'.join(parts)

def build_article(name, title, digest, category, tags, content_blocks):
    """Generate a JS file for one article"""
    # Cover SVG
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:#b8860b"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="600" cy="315" r="200" fill="none" stroke="#ffd54f" stroke-width="2" opacity="0.3"/>
<text x="600" y="280" text-anchor="middle" fill="#ffd54f" font-size="40" font-family="serif" font-weight="bold">{title[:20]}</text>
<text x="600" y="340" text-anchor="middle" fill="#ddd" font-size="20" font-family="sans-serif">{title[20:40] if len(title)>20 else '&#x7ea2;&#x9152;&#x987e;&#x95ee;'}</text>
<text x="600" y="380" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">feiqingqi WeChat MP</text>
</svg>'''
    svg_b64 = f'data:image/svg+xml;base64,{__import__("base64").b64encode(svg.encode()).decode()}'

    html = html_body(content_blocks)

    # Build gen() using a template literal with .join() to avoid backtick issues in content
    # Actually, let's use a regex-based approach: write content as a function that returns 
    # using regular quotes and .join for any problematic chars
    
    # The simplest reliable approach: put the HTML content as a JS string with +
    # No template literals at all
    html_lines = html.split('\n')
    html_js = '\n'.join(f"  '{js_str(line)}' +" for line in html_lines)
    html_js = html_js.rstrip('+').rstrip('\n')
    # Ensure it ends properly as a return statement
    gen_code = f'''function gen(){{
  return {html_js};
}}'''

    js = f'''const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = {CONFIG_CODE};

const date={{full:'{DATE}'}};

function gCov(){{
  const svg="{js_str(svg_b64)}";
  return svg;
}}

{gen_code}

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
    const f = new FormData();
    f.append('media', cb, {{filename: 'cover.png', contentType: 'image/png'}});
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

# ============================================================
# ARTICLE DEFINITIONS
# ============================================================

if __name__ == '__main__':

    # ======================== FOOD PAIRING ========================

    build_article('sichuan_pairing', title='🍛 川菜配酒终极指南：麻辣与葡萄酒的激情碰撞',
        digest='川菜配酒不是只有啤酒！从水煮鱼到麻婆豆腐，从夫妻肺片到辣子鸡，教你用雷司令、琼瑶浆、黑皮诺搞定一切麻辣菜肴。',
        category='wine-food', tags=['川菜','配酒','麻辣','雷司令','琼瑶浆','黑皮诺','中餐配酒'],
        content_blocks=[
            {'type':'title','text':'🍛 川菜配酒终极指南'},
            {'type':'subtitle','text':'麻辣与葡萄酒的激情碰撞 | 从此告别啤酒配川菜'},
            {'type':'p','text':'川菜作为中国八大菜系之首，以"一菜一格，百菜百味"著称。麻、辣、鲜、香、烫——这些独特的味觉体验让无数人着迷，却也让葡萄酒搭配变得极具挑战性。'},
            {'type':'p','text':'很多人觉得川菜只能配啤酒或冰水，其实这是一种误解。选对葡萄酒，非但不会与辣味冲突，反而能巧妙地平衡麻辣、提升鲜味，带来意想不到的味觉体验。'},
            {'type':'h2','text':'🥵 麻辣的核心挑战'},
            {'type':'p','text':'川菜的辣来自辣椒中的辣椒素，麻来自花椒中的花椒麻素。这两者本身不是"味觉"而是"痛觉"和"触觉"刺激。酒精会加剧这种刺激，所以高酒精度（14%以上）的葡萄酒会放大辣感。'},
            {'type':'p','text':'配川菜的核心策略有三：一是用甜味来中和辣（半干/甜型葡萄酒），二是用低酒精度来减轻刺激（10-12%），三是用果香来呼应川菜的复合香气。'},
            {'type':'h2','text':'🍷 万能搭配法则'},
            {'type':'table','headers':['川菜类型','推荐酒款','选择理由'],
            'rows':[
                ['麻辣类（水煮鱼、麻婆豆腐）','半干雷司令 / 琼瑶浆','微甜中和辣味，芳香型不输菜香'],
                ['香辣类（辣子鸡、干锅）','黑皮诺 / 佳美','低单宁、果香足、酒体轻，不抢味'],
                ['鱼香/宫保类','灰皮诺 / 绿维特利纳','酸度活泼，平衡酸甜口感'],
                ['泡椒类（泡椒凤爪）','长相思 / 夏布利','高酸度切开油腻，清新爽口'],
                ['五香/卤味','里奥哈陈酿 / 桑娇维塞','中等酒体，有香料味呼应'],
                ['火锅（清汤锅）','香槟 / 卡瓦','气泡清口，酸度解腻'],
                ['火锅（麻辣锅）','半甜雷司令 / 冰酒','甜与辣碰撞，刺激又满足'],
            ]},
            {'type':'h2','text':'🥘 经典川菜 × 酒款推荐'},
            {'type':'h3','text':'1. 水煮鱼 / 水煮牛肉'},
            {'type':'p','text':'这道菜的标志是滚烫的辣椒油和嫩滑的鱼片/牛肉。辣度极高，但鱼肉本身鲜甜。推荐半干雷司令（如德国Kabinett Spatlese级别），微甜的酒液能立刻扑灭口中的辣火，而清爽的酸度又能解油腻。'},
            {'type':'tip','text':'💡 小贴士：避免重橡木味的霞多丽或高酒精度的西拉，它们会与辣味产生令人不适的"燃烧感"。'},
            {'type':'h3','text':'2. 麻婆豆腐'},
            {'type':'p','text':'麻婆豆腐的灵魂是"麻"——花椒的酥麻感布满整个口腔。推荐阿尔萨斯的琼瑶浆，其浓郁的荔枝和玫瑰花香与花椒的芬芳互相交织，微甜的口感能有效缓解麻辣刺激。'},
            {'type':'h3','text':'3. 辣子鸡/干锅类'},
            {'type':'p','text':'香辣酥脆，干锅类的焦香与辣椒香融为一体。推荐新西兰黑皮诺或勃艮第大区级，果味纯净、单宁柔和、酒体轻盈，不会掩盖菜品的本味。'},
            {'type':'h3','text':'4. 宫保鸡丁'},
            {'type':'p','text':'酸甜微辣，花生的坚果香增添了复杂度。推荐意大利灰皮诺或新西兰长相思，高酸度平衡酸甜汁，清爽的矿物质感让每一口都干净利落。'},
            {'type':'h2','text':'🍶 大师级搭配口诀'},
            {'type':'box','heading':'记住这四句话','text':'辣怕甜，甜怕酸，麻怕芬芳，油怕气。\n\n意思是：辣味用甜酒中和，甜味用酸酒平衡，麻味用芳香型酒呼应，油腻用气泡酒切开。'},
            {'type':'h2','text':'🎯 避坑指南'},
            {'type':'list','items':[
                '❌ 避免高酒精度的重红酒（如澳洲西拉、加州赤霞珠）——酒精放大辣感',
                '❌ 避免重单宁的红酒（如年轻的巴罗洛）——单宁与辣形成苦涩感',
                '❌ 避免过度橡木桶陈年的酒——桶味与香料味打架',
                '✅ 首选半干/半甜型白葡萄酒',
                '✅ 其次选果味丰富、低单宁的轻盈红葡萄酒',
                '✅ 气泡酒永远是安全的选择',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'川菜配酒的魅力不在于"压住辣"，而在于让辣与酒互相成就，创造出单独的菜或酒都无法企及的味觉体验。下次吃川菜，别急着开啤酒——倒一杯半干雷司令，你会发现新世界的大门。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('canton_pairing', title='🦐 粤菜配酒指南：至鲜至简的完美搭配',
        digest='白切鸡配什么酒？清蒸鱼的最佳搭档是谁？虾饺烧卖又该如何搭配？粤菜讲究"鲜"字，选对酒才能相得益彰。',
        category='wine-food', tags=['粤菜','配酒','清蒸','海鲜','白切鸡','香槟','中餐配酒'],
        content_blocks=[
            {'type':'title','text':'🦐 粤菜配酒指南'},
            {'type':'subtitle','text':'至鲜至简的完美搭配 | 认识粤菜与葡萄酒的微妙平衡'},
            {'type':'p','text':'粤菜讲究"清、鲜、嫩、滑、爽"，以保留食材原味为最高准则。与川菜的浓烈不同，粤菜的精髓在于"鲜"——这恰恰是葡萄酒搭配中最需要呵护的味觉元素。'},
            {'type':'p','text':'搭配不当，酒的橡木味会盖过鱼鲜；酸度太高，会破坏虾的甜嫩；单宁太重，会让白切鸡变得苦涩。粤菜配酒的关键是：温柔的才是最好的。'},
            {'type':'h2','text':'🥟 早茶/点心配酒'},
            {'type':'p','text':'早茶是粤菜最亲民的形式。虾饺、烧卖、肠粉、凤爪——每一样都精致而鲜美。'},
            {'type':'table','headers':['点心','推荐酒','理由'],
            'rows':[
                ['虾饺','意大利Prosecco起泡酒','细腻气泡不抢虾味，酸度刚好'],
                ['烧卖/干蒸','夏布利（Chablis）','矿物感与猪肉鲜味呼应'],
                ['肠粉','长相思（Sauvignon Blanc）','清爽草本香搭配酱油味'],
                ['凤爪','德国半干雷司令','微甜解腻，百搭之选'],
                ['叉烧包','博若莱新酒（Beaujolais）','果味轻盈，与甜叉烧相得益彰'],
                ['萝卜糕','灰皮诺（Pinot Grigio）','中性干净，不干扰食材原味'],
            ]},
            {'type':'h2','text':'🐟 海鲜类搭配'},
            {'type':'h3','text':'清蒸鱼'},
            {'type':'p','text':'粤菜的灵魂菜式，讲究鱼肉"一挞就开"的完美火候。葱丝姜丝铺面，热油淋上，激发出最纯粹的鲜。推荐夏布利一级园，冷凉气候赋予的高酸度能像柠檬汁一样提鲜，而独特的矿物感与海鱼鲜味浑然天成。'},
            {'type':'h3','text':'白灼虾/白灼菜心'},
            {'type':'p','text':'白灼是最极简的烹饪手法，对食材新鲜度要求最高。推荐新西兰马尔堡长相思，其标志性的百香果和青草香气不会掩盖虾的甜美，高酸度用来蘸料也恰到好处。'},
            {'type':'h3','text':'避风塘炒蟹'},
            {'type':'p','text':'蒜香酥脆的炒蟹是粤菜中的"重口味"。推荐教皇新堡白葡萄酒（Chateauneuf-du-Pape Blanc），饱满的酒体可以撑住蒜酥的冲击，核果香气与蟹肉相得益彰。'},
            {'type':'h2','text':'🐔 烧腊/白切类搭配'},
            {'type':'h3','text':'白切鸡'},
            {'type':'p','text':'白切鸡讲求鸡味纯粹，皮爽肉滑，蘸姜葱酱食用。推荐勃艮第黑皮诺，优雅的红果香气不会压过鸡味，柔和的单宁与滑嫩的肉质形成美妙对比。注意：不要选果味太浓或桶味太重的新世界黑皮诺。'},
            {'type':'h3','text':'烧鹅/叉烧'},
            {'type':'p','text':'烧鹅皮脆肉嫩，油脂丰富；叉烧甜蜜焦香。推荐半干型德国雷司令（Spatlese），微甜的口感与叉烧的蜜糖味完美衔接，酸度又恰到好处地切开烧鹅的油腻。'},
            {'type':'h2','text':'🍜 老火靓汤 & 煲仔菜'},
            {'type':'p','text':'广东人不可一日无汤。老火靓汤推荐搭配陈年里奥哈白（Rioja Blanco Crianza），轻微的氧化风味与汤的醇厚感匹配。煲仔菜如啫啫煲、煲仔饭，则推荐南罗讷的GSM混酿，香料味与煲仔的锅气香相得益彰。'},
            {'type':'tip','text':'💡 重要原则：粤菜配酒的核心是"不抢风头"。一款好的配酒不是最出彩的那一个，而是让菜更好吃的那一个。中性、清爽、优雅——这是粤菜配酒的三个关键词。'},
            {'type':'h2','text':'🎯 粤菜配酒快速指南'},
            {'type':'list','items':[
                '🍾 香槟/起泡酒 → 万能开场，搭配虾饺、烧卖、炸春卷',
                '🥂 夏布利 → 清蒸鱼、白灼海鲜、生蚝',
                '🍷 德国雷司令 → 烧腊、叉烧、甜豉油类菜肴',
                '🍷 黑皮诺 → 白切鸡、烧鹅、乳猪',
                '🥂 长相思 → 白灼虾、清炒时蔬、海鲜',
                '🍷 博若莱 → 叉烧包、烧肉、点心类',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'粤菜配酒的哲学与粤菜本身一脉相承——大道至简。不需要昂贵的名庄酒，不需要复杂的陈年风味，一款清新、精准、平衡的葡萄酒，就是粤菜最好的搭档。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('hotpot_pairing', title='🍲 火锅配酒指南：沸腾中的味觉艺术',
        digest='火锅配什么酒？清汤锅、麻辣锅、番茄锅、菌汤锅各有最佳搭档。从羊肉卷到毛肚，教你一桌火锅配出三种酒。',
        category='wine-food', tags=['火锅','配酒','清汤','麻辣','番茄锅','雷司令','香槟','中餐配酒'],
        content_blocks=[
            {'type':'title','text':'🍲 火锅配酒指南'},
            {'type':'subtitle','text':'沸腾中的味觉艺术 | 麻辣清汤番茄菌菇，一桌火锅三种酒'},
            {'type':'p','text':'没有什么比一群人围坐吃火锅更有人间烟火气了。火锅的社交属性和食材多样性，让它成为葡萄酒搭配的"终极考场"——既要考虑汤底的味道，又要应对各类涮菜，还要兼顾同桌人的不同口味。'},
            {'type':'p','text':'好消息是：火锅其实没有想象中那么难配酒。掌握了汤底的逻辑，一桌火锅最多只需要三款酒就能搞定。'},
            {'type':'h2','text':'🔥 不同汤底的搭配策略'},
            {'type':'table','headers':['汤底','风味特征','推荐酒','理由'],
            'rows':[
                ['麻辣红油','辣、麻、油、烫','半干雷司令/琼瑶浆','甜味中和辣，芳香呼应花椒'],
                ['清汤/骨汤','鲜美、清淡','香槟/夏布利','气泡解腻，矿物感提鲜'],
                ['番茄汤','酸甜、浓郁','黑皮诺/佳美','果味呼应番茄酸甜，低单宁'],
                ['菌汤','醇厚、 earthy','陈年霞多丽','饱满酒体匹配菌菇风味'],
                ['冬阴功','酸辣、香料','灰皮诺/绿维特利纳','高酸度匹配酸辣，中性不抢戏'],
                ['咖喱汤','浓郁、香料','琼瑶浆/干型雷司令','花香与香料呼应，半干平衡辣'],
            ]},
            {'type':'h2','text':'🥩 食材搭配细化'},
            {'type':'h3','text':'牛羊肉卷 → 轻盈红葡萄酒'},
            {'type':'p','text':'如果涮的是清汤锅，羊肉卷的鲜美需要一款果味活泼的红酒来搭配。推荐博若莱特级村（如Morgon、Fleurie），或者新西兰黑皮诺。如果是麻辣锅，则回归半干雷司令。'},
            {'type':'h3','text':'毛肚/黄喉/百叶 → 起泡酒'},
            {'type':'p','text':'这些口感脆爽的食材最佳的搭配永远是起泡酒。香槟或Cava的细腻气泡能清洁口腔，为下一口做好准备。高酸度搭配香油蒜泥蘸料尤其精彩。'},
            {'type':'h3','text':'海鲜类（虾滑、鱼片、鲍鱼）→ 白葡萄酒'},
            {'type':'p','text':'清淡的汤底中涮煮的海鲜，推荐搭配夏布利或意大利Vermentino。清凉的口感与热腾腾的火锅形成鲜明对比，矿物感提升海鲜的鲜甜。'},
            {'type':'h3','text':'蔬菜/豆腐类 → 灰皮诺/长相思'},
            {'type':'p','text':'蔬菜和豆腐本身味道较淡，需要一款不喧宾夺主的白葡萄酒。意大利上阿迪杰的灰皮诺或卢瓦尔河的长相思是绝佳选择。'},
            {'type':'h2','text':'🥂 火锅配酒的"三部曲"策略'},
            {'type':'p','text':'如果你想在一顿火锅中体验最佳搭配，推荐以下"三部曲"策略：'},
            {'type':'list','items':[
                '🥂 开场：一瓶香槟或Spain Cava，搭配清汤锅涮海鲜、毛肚等脆爽食材',
                '🍷 中场：一瓶黑皮诺（红）或一瓶雷司令（白），视同桌人的口味选择',
                '🍇 收尾：如果还有麻辣锅底，上一瓶半干雷司令或冰酒，给辣味一个甜蜜的句号',
            ]},
            {'type':'tip','text':'💡 火锅配酒避坑：不要带高单宁、高酒精度的红酒（如赤霞珠、西拉、巴罗洛）到火锅桌上。辣味+酒精=灼烧感，辣味+单宁=苦涩味，双重暴击会让你后悔的。'},
            {'type':'h2','text':'🧊 温度很重要'},
            {'type':'p','text':'火锅本身就是滚烫的，所以配酒的侍酒温度应该比平时略低：白葡萄酒和起泡酒建议6-8°C（比常规低1-2度），红葡萄酒建议12-14°C（比常规低2-3度）。低温可以更好地对抗火锅的热度，保持酒的清爽感。'},
            {'type':'sep','text':''},
            {'type':'p','text':'火锅配酒的核心法则是"以冷制热，以甜克辣，以气解腻"。下次朋友约火锅，别只带啤酒了——带上一瓶半干雷司令，保证成为全桌最懂酒的人。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('bbq_pairing', title='🍖 烧烤配酒指南：人间烟火气的美妙搭配',
        digest='烧烤配什么酒最过瘾？羊肉串配什么？烤生蚝配什么？从路边摊到烤肉店，从孜然到蜜汁，烧烤配酒全攻略。',
        category='wine-food', tags=['烧烤','配酒','羊肉串','烤肉','BBQ','博若莱','中餐配酒'],
        content_blocks=[
            {'type':'title','text':'🍖 烧烤配酒指南'},
            {'type':'subtitle','text':'人间烟火气的美妙搭配 | 路边摊到韩式烤肉的完全攻略'},
            {'type':'p','text':'烧烤——最原始、最有烟火气的烹饪方式。炭火炙烤、油脂滴落、焦香四溢……这种刻在人类DNA里的美味，与葡萄酒的搭配其实大有文章可做。'},
            {'type':'h2','text':'🥩 中式烧烤（烤串）搭配'},
            {'type':'h3','text':'羊肉串/牛肉串'},
            {'type':'p','text':'孜然和辣椒面是羊肉串的灵魂。推荐南法GSM混酿（歌海娜-西拉-慕合怀特）或澳洲西拉，香料味的红酒与孜然相得益彰，饱满的酒体撑得住羊肉的浓郁。'},
            {'type':'h3','text':'烤鸡翅/烤鸡腿'},
            {'type':'p','text':'蜜汁或奥尔良风味的烤鸡翅，推荐博若莱特级村或黑皮诺。果味清爽、单宁柔和，不会压过鸡肉的细腻风味，微凉的温度还能解腻。'},
            {'type':'h3','text':'烤生蚝/烤扇贝'},
            {'type':'p','text':'蒜蓉是烤海鲜的灵魂伴侣。推荐长相思或夏布利，高酸度搭配蒜香和海鲜是绝配。如果想尝试更有趣的搭配，可以试试西班牙Albariño。'},
            {'type':'h3','text':'烤韭菜/烤茄子'},
            {'type':'p','text':'蔬菜类烧烤适合搭配灰皮诺或意大利Verdicchio，清爽简单，不抢蔬菜的本味。'},
            {'type':'h2','text':'🇰🇷 韩式烤肉搭配'},
            {'type':'p','text':'韩式烤肉的特色是生菜包肉、蘸酱、配泡菜，味道层次丰富。推荐黑皮诺或歌海娜，果味充足可以呼应蘸酱的甜辣，单宁轻柔不会和泡菜的酸味产生不愉快的反应。'},
            {'type':'h2','text':'🇯🇵 日式烧肉搭配'},
            {'type':'p','text':'日式烧肉注重肉质的原味，尤其是高等级的和牛。推荐成熟的黑皮诺（勃艮第或新西兰），优雅的花果香与和牛的油脂融合，仿佛牛油融化在酒中。也可尝试德国黑皮诺（Spatburgunder），更加细腻。'},
            {'type':'h2','text':'🍖 西式BBQ搭配'},
            {'type':'table','headers':['烤肉类型','推荐酒','理由'],
            'rows':[
                ['烤猪肋排（甜酱）','澳洲西拉/仙粉黛','果酱般的风味匹配甜酱'],
                ['烤牛排（原味）','赤霞珠/马尔贝克','饱满单宁匹配肉质纤维'],
                ['烤鸡（香草）','长相思/赛美蓉','草本香气呼应香草腌料'],
                ['烤羊排（迷迭香）','波尔多混酿','结构感匹配羊排的浓郁'],
            ]},
            {'type':'tip','text':'💡 烧烤配酒的核心原则：焦香配饱满，香料配香料，甜酱配果味。烧烤的炭烤风味本身就非常强大，配酒太弱会被淹没，太强又会抢戏——要找到那个"门当户对"的平衡点。'},
            {'type':'h2','text':'🎯 最佳性价比搭配推荐'},
            {'type':'p','text':'烧烤配酒不一定要名庄。以下几点建议让你的每一分钱都花在刀刃上：'},
            {'type':'list','items':[
                '🇦🇺 澳洲西拉（Hunter Valley/Clare Valley）¥100-200，羊肉串最佳搭档',
                '🇫🇷 南罗讷GSM混酿 ¥100-300，万能烧烤酒',
                '🇳🇿 新西兰黑皮诺 ¥150-300，韩式烤肉、鸡翅首选',
                '🇨🇱 智利佳美娜 ¥80-150，性价比之选',
                '🇪🇸 西班牙Cava起泡酒 ¥80-150，烤海鲜最佳搭档',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'烧烤最美妙的地方在于它的随意与自由。不需要太讲究，不需要太拘束——打开的肉串，倒上的酒，这就是生活最美好的样子。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('chinese_banquet_pairing', title='🎎 中餐宴席配酒指南：从凉菜到甜品的完美配酒方案',
        digest='商务宴请、年夜饭、婚宴……中国人最重要的饭桌上，如何从头到尾配好酒？凉菜、热菜、主菜、甜品，一篇全搞定。',
        category='wine-food', tags=['中餐','宴席','配酒','商务宴请','年夜饭','婚宴','配餐','中餐配酒'],
        content_blocks=[
            {'type':'title','text':'🎎 中餐宴席配酒指南'},
            {'type':'subtitle','text':'从凉菜到甜品的完美配酒方案 | 商务宴请·年夜饭·婚宴'},
            {'type':'p','text':'中国式宴席通常有完整的上菜顺序：先冷盘、后热菜、再主菜、最后甜品或水果。一桌宴席覆盖了各种味型和食材，只用一款酒很难满足全程需求。'},
            {'type':'p','text':'最理想的做法是准备2-3款酒，随菜品的推进而变换。以下是宴席配酒的"标准版"和"进阶版"方案。'},
            {'type':'h2','text':'🍶 标准版：三道酒打天下'},
            {'type':'table','headers':['阶段','菜品','推荐酒','选择理由'],
            'rows':[
                ['开场','冷盘：凉拌黄瓜、酱牛肉、皮蛋豆腐','香槟/起泡酒','气泡开胃，百搭所有凉菜'],
                ['热菜','炒菜、烧菜、蒸菜','黑皮诺/雷司令','不挑菜，红白皆可的中场主力'],
                ['主菜','整鱼、大虾、扣肉、全鸡','赤霞珠/西拉/夏布利','结构感强的重头戏酒款'],
            ]},
            {'type':'p','text':'在标准版方案中，起泡酒+黑皮诺+一款重头酒的单品组合已经可以覆盖大部分宴席场景。要点是不要只带一款红酒撑全程——前半场的凉菜配红酒往往不理想。'},
            {'type':'h2','text':'🎯 进阶版：五道菜的完美配酒'},
            {'type':'h3','text':'第一轮：冷盘/凉菜 → 起泡酒'},
            {'type':'p','text':'凉菜通常涉及醋、酱油、辣椒油、蒜泥等多种调味。推荐Franciacorta或Cava，细腻的气泡能平衡各种调味汁，酸度提振食欲。'},
            {'type':'h3','text':'第二轮：热菜（清炒/清蒸类）→ 白葡萄酒'},
            {'type':'p','text':'清炒时蔬、清蒸鱼、白灼虾等清淡热菜上桌时，推荐夏布利或新西兰长相思。高酸度提鲜，矿物感与蒸菜的原味完美配合。'},
            {'type':'h3','text':'第三轮：热菜（红烧/焖炖类）→ 轻盈红葡萄酒'},
            {'type':'p','text':'红烧肉、东坡肉、焖牛腩等浓郁菜肴上桌时，推荐黑皮诺或桑娇维塞。中等单宁可以中和脂肪，果味不会被浓郁的酱汁淹没。'},
            {'type':'h3','text':'第四轮：主菜（整鱼/大虾/全鸡）→ 重头酒'},
            {'type':'p','text':'宴席的高潮部分，推荐波尔多混酿或巴罗洛等具有陈年潜力的名庄酒。这一道酒既是配菜，也是宴席的话题焦点。'},
            {'type':'h3','text':'第五轮：甜品/水果 → 甜酒'},
            {'type':'p','text':'传统中式甜品如红豆沙、八宝饭、拔丝地瓜等，推荐匈牙利托卡伊Aszú或德国冰酒。如果甜品甜度不高，也可以用半干雷司令过渡。'},
            {'type':'h2','text':'🧧 特殊宴席场景建议'},
            {'type':'box','heading':'年夜饭','text':'建议以香槟开场（庆祝氛围），主菜用波尔多/勃艮第一级（丰盛感），收尾用甜酒搭配年糕/汤圆（团圆甜蜜）。预算允许的话可以开一瓶年份香槟作为惊喜。'},
            {'type':'box','heading':'商务宴请','text':'以已开瓶的成熟波尔多或勃艮第为主，配一白一红的组合。中餐配酒选经典产区的经典酒款最稳妥，避免过于小众或风格极端的酒。建议提前醒酒1-2小时。'},
            {'type':'box','heading':'婚宴','text':'起泡酒是最佳的开场酒（仪式感），主桌配波尔多或里奥哈（气派），大众桌则选果味充沛的智利或澳洲酒（性价比）。建议每桌至少放一瓶白葡萄酒供女士选择。'},
            {'type':'tip','text':'💡 宴席配酒黄金法则：中国人的宴席是"以菜为纲"而不是"以酒为纲"——酒是锦上添花，不是主角。所以选酒的首要原则是"不犯错"，而不是追求惊艳。经典产区、经典酒款、经典搭配——任何宴席都不会出错。'},
            {'type':'sep','text':''},
            {'type':'p','text':'中餐宴席配酒的终极秘诀其实很简单：备好起泡酒、白葡萄酒、红葡萄酒三种，随着菜品从清淡到浓郁的推进依次登场，你的客人一定会感受到你的用心与专业。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    # ======================== GRAPE VARIETIES PART 2 ========================

    build_article('nebbiolo_dive', title='🍇 内比奥罗 Nebbiolo：意大利酒王的傲骨柔情',
        digest='巴罗洛和巴巴莱斯科的灵魂品种。为什么内比奥罗被称为"雾葡萄"？单宁如何从凌厉变为丝滑？一篇读懂意大利酒王。',
        category='wine-grape', tags=['内比奥罗','Nebbiolo','巴罗洛','巴巴莱斯科','意大利','皮埃蒙特','红葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 内比奥罗 Nebbiolo'},
            {'type':'subtitle','text':'意大利酒王的傲骨柔情 | 巴罗洛与巴巴莱斯科的灵魂'},
            {'type':'p','text':'内比奥罗（Nebbiolo）被称为意大利最伟大的红葡萄品种。它的名字来源于意大利语"nebbia"（雾）——因为收获季节的皮埃蒙特山谷常常被晨雾笼罩，也有人说是因为葡萄表面的白雾状果粉。'},
            {'type':'p','text':'这个品种有着极高的辨识度：年轻时单宁凌厉、酸度锐利、香气封闭，仿佛一个难以接近的傲娇贵族；但经过时间的陈酿，它会蜕变为拥有丝绒质感、复杂香气和无穷层次感的伟大酒款。'},
            {'type':'h2','text':'📍 主要产区'},
            {'type':'table','headers':['产区','酒款','风格特点'],
            'rows':[
                ['巴罗洛 Barolo DOCG','Barolo','"酒王"：单宁强劲，需陈年5年以上，花香、焦油、玫瑰、皮革'],
                ['巴巴莱斯科 Barbaresco DOCG','Barbaresco','"酒后"：比Barolo更优雅柔顺，陈年要求3年以上'],
                ['朗格 Nebbiolo Langhe DOC','Langhe Nebbiolo','入门级：年轻易饮，适合日常品饮'],
                ['罗埃罗 Roero DOCG','Roero','沙质土壤，风格更轻盈芳香'],
                ['瓦尔泰利纳 Valtellina','Valtellina Superiore','阿尔卑斯山麓，风格冷峻优雅'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🌸 花香：干玫瑰花瓣、紫罗兰——这是内比奥罗的标志性香气',
                '🍒 果香：酸樱桃、覆盆子、草莓、李子',
                '🌿 陈年香：焦油、玫瑰、皮革、松露、烟草、甘草',
                '🍄 泥土味：森林地表、蘑菇、干树叶',
            ]},
            {'type':'p','text':'品鉴内比奥罗的独特体验在于"变化"——一瓶刚开的巴罗洛可能香气内敛、口感紧涩，但醒酒2-3小时后，它会逐渐释放出迷人的花香和果香，单宁也从坚硬变为柔顺。'},
            {'type':'h2','text':'🍷 风格定位'},
            {'type':'p','text':'内比奥罗属于"高单宁、高酸度、中酒体"的红葡萄酒。它的颜色在年轻时是石榴红偏橙色（而非深紫色），这是它的品种特征而非老化的标志。'},
            {'type':'p','text':'巴罗洛需要至少38个月的陈年（其中18个月在桶中），珍藏级（Riserva）需要62个月。巴巴莱斯科需要26个月（9个月在桶中），珍藏级需要50个月。'},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'list','items':[
                '🥩 炖牛肉、红酒炖鸡（意大利经典搭配：Barolo braised beef）',
                '🍝 松露意面（Tajarin con tartufo）——皮埃蒙特经典',
                '🧀 陈年奶酪（Parmigiano-Reggiano、Grana Padano）',
                '🥟 中餐搭配：红烧肉、焖牛腩、烤鸭',
            ]},
            {'type':'tip','text':'💡 入门建议：不必一上来就挑战顶级巴罗洛。从Langhe Nebbiolo开始（¥150-300），感受品种的基础特征；然后尝试巴巴莱斯科（¥300-600），体验优雅的一面；最后再挑战巴罗洛（¥400-上不封顶）。'},
            {'type':'h2','text':'🏆 推荐入门酒款'},
            {'type':'list','items':[
                '🇮🇹 Gaja "Promis" Langhe Nebbiolo — 名家入门款',
                '🇮🇹 Elio Altare "Larigi" Langhe Nebbiolo — 现代派风格',
                '🇮🇹 Vietti "Perbacco" Langhe Nebbiolo — 性价比之王',
                '🇮🇹 Produttori del Barbaresco Barbaresco — 合作社出品，性价比极高',
                '🇮🇹 Renato Ratti Marcenasco Barolo — 传统派入门',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'内比奥罗是一瓶"需要时间"的酒。正如意大利人所说："如果要喝快乐，喝巴罗洛；如果要喝懂的，也要喝巴罗洛。"它让无数葡萄酒爱好者又爱又恨，但一旦尝到了巅峰状态的巴罗洛，你就再也无法回头了。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('sangiovese_dive', title='🍇 桑娇维塞 Sangiovese：意大利的骄傲之光',
        digest='从基安蒂到布鲁奈罗，桑娇维塞是意大利种植最广的红葡萄。酸樱桃和大地气息是它的标志，托斯卡纳的阳光是它的灵魂。',
        category='wine-grape', tags=['桑娇维塞','Sangiovese','基安蒂','布鲁奈罗','意大利','托斯卡纳','红葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 桑娇维塞 Sangiovese'},
            {'type':'subtitle','text':'意大利的骄傲之光 | 从基安蒂到布鲁奈罗的托斯卡纳灵魂'},
            {'type':'p','text':'桑娇维塞（Sangiovese）是意大利种植面积最广的红葡萄品种，也是托斯卡纳产区无可争议的主角。它的名字源自拉丁语"sanguis Jovis"——"朱庇特之血"。'},
            {'type':'p','text':'桑娇维塞是一个基因不稳定的品种，存在数十个克隆变种。最著名的是Sangiovese Grosso（用于布鲁奈罗）和Sangiovese Piccolo（用于基安蒂）。这个特点使得它可以在不同的风土中展现出截然不同的风貌。'},
            {'type':'h2','text':'📍 主要产区与等级'},
            {'type':'table','headers':['产区','等级','风格特点'],
            'rows':[
                ['基安蒂 Chianti DOCG','Chianti / Chianti Classico','酸樱桃、紫罗兰，Classico更浓郁'],
                ['基安蒂经典 Chianti Classico DOCG','Gran Selezione/Riserva','最高品质基安蒂，陈年潜力强'],
                ['布鲁奈罗 Brunello di Montalcino DOCG','Brunello / Riserva','浓郁饱满，需陈年5年以上'],
                ['蒙塔奇诺 Rosso di Montalcino DOC','Rosso di Montalcino','布鲁奈罗的年轻版，适合早饮'],
                ['蒙特普尔恰诺贵族酒 Vino Nobile di Montepulciano DOCG','Nobile / Riserva','介于基安蒂和布鲁奈罗之间'],
                ['超级托斯卡纳 Super Tuscan IGT','Tignanello/Sassicaia等','国际品种混酿，风格现代'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🍒 标志性：酸樱桃——这是桑娇维塞最容易被辨认的特征',
                '🌸 花香：紫罗兰、鸢尾花',
                '🌿 草本：番茄叶、干草药、牛至',
                '🪵 陈年：烟草、皮革、雪松、焦油',
                '🌍 泥土：托斯卡纳土壤特有的碎石和矿物感',
            ]},
            {'type':'h2','text':'🍷 品鉴要点'},
            {'type':'p','text':'桑娇维塞的核心特征是酸度高、单宁中等到高、酒体中到饱满。年轻的基安蒂通常充满活力，果味新鲜；而陈年的布鲁奈罗则展现出层次丰富的第三类香气。'},
            {'type':'p','text':'品质最好的桑娇维塞往往带有一丝"咸鲜感"（savory），这种独特的口感让它与食物搭配时格外出色。这也是为什么意大利人几乎餐餐离不开基安蒂。'},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'list','items':[
                '🍝 番茄酱意面——经典的番茄酱+桑娇维塞是天生一对',
                '🍕 披萨——尤其是玛格丽特披萨',
                '🥩 佛罗伦萨T骨牛排（Bistecca alla Fiorentina）',
                '🧀 托斯卡纳 Pecorino奶酪',
                '🥟 中餐搭配：番茄牛腩、意式肉酱面、烤羊排',
            ]},
            {'type':'h2','text':'🏆 推荐入门酒款'},
            {'type':'list','items':[
                '🇮🇹 Felsina Chianti Classico Rancia Riserva — 经典标杆',
                '🇮🇹 Castello di Monsanto Chianti Classico Riserva — 传统风格',
                '🇮🇹 Altesino Brunello di Montalcino — 布鲁奈罗入门',
                '🇮🇹 Argiano Rosso di Montalcino — 性价比之选',
                '🇮🇹 Avignonesi Vino Nobile di Montepulciano — 贵族酒的典范',
            ]},
            {'type':'tip','text':'💡 入门建议：从Chianti Classico开始（¥150-300），感受桑娇维塞的酸樱桃特色；进阶尝试Rosso di Montalcino（¥200-400）；终极挑战是陈年Brunello（¥400-上不封顶）。记住：桑娇维塞永远需要配餐，单独喝会感觉酸涩。'},
            {'type':'sep','text':''},
            {'type':'p','text':'如果说勃艮第是黑皮诺的天下，那托斯卡纳就是桑娇维塞的王国。没有桑娇维塞，就没有基安蒂、布鲁奈罗、蒙特普尔恰诺贵族酒——意大利葡萄酒的半壁江山将黯然失色。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('tempranillo_dive', title='🍇 丹魄 Tempranillo：西班牙的红颜知己',
        digest='里奥哈的灵魂品种，西班牙最伟大的红葡萄。丹魄的皮革和樱桃香气令人着迷，陈年潜力不输波尔多。从里奥哈到杜埃罗河岸。',
        category='wine-grape', tags=['丹魄','Tempranillo','里奥哈','西班牙','杜埃罗河岸','红葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 丹魄 Tempranillo'},
            {'type':'subtitle','text':'西班牙的红颜知己 | 里奥哈与杜埃罗河岸的灵魂'},
            {'type':'p','text':'丹魄（Tempranillo）是西班牙最伟大的红葡萄品种，名字来源于西班牙语"temprano"（早），因为它比大多数西班牙红葡萄品种早熟。'},
            {'type':'p','text':'丹魄在西班牙不同地区有不同的名字：在里奥哈叫Tempranillo，在杜埃罗河岸叫Tinto Fino，在托罗叫Tinta de Toro，在拉曼查叫Cencibel。它们其实是同一品种的不同克隆适应了不同风土。'},
            {'type':'h2','text':'📍 主要产区'},
            {'type':'table','headers':['产区','风格特点'],
            'rows':[
                ['里奥哈 Rioja DOCa','最经典产区，橡木桶陈年风格闻名，传统派用美国桶（香草、椰子香）'],
                ['杜埃罗河岸 Ribera del Duero DO','更浓郁饱满，海拔高导致昼夜温差大，颜色更深单宁更强'],
                ['托罗 Toro DO','酒体最饱满，酒精度高，风格粗犷有力'],
                ['纳瓦拉 Navarra DO','风格比里奥哈更现代，果味更突出'],
                ['拉曼查 La Mancha DO','西班牙最大产区，性价比极高，入门级丹魄'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🍒 果香：樱桃、黑莓、李子——新鲜年轻时有活力',
                '🧀 陈年香：皮革、雪松、烟草、雪茄盒——里奥哈陈年标志',
                '🌿 桶香：香草、椰子、丁香——传统美国桶特征（里奥哈）',
                '🍫 发展香：可可粉、咖啡、焦糖——长时间桶陈的结果',
                '🌍 泥土：干树叶、泥土、矿物感',
            ]},
            {'type':'h2','text':'🥃 里奥哈的陈年等级'},
            {'type':'p','text':'里奥哈有严格的陈年等级制度，这是选择丹魄的重要参考：'},
            {'type':'table','headers':['等级','总陈年','桶陈','瓶陈','风格'],
            'rows':[
                ['Joven 年轻','<1年','无/极少','—','果味新鲜，适合即饮'],
                ['Crianza 陈酿','≥2年','≥1年','≥1年','果味+桶味平衡'],
                ['Reserva 珍藏','≥3年','≥1年','≥2年','桶味主导，单宁柔化'],
                ['Gran Reserva 特级珍藏','≥5年','≥2年','≥3年','三类香气主导，极为复杂'],
            ]},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'list','items':[
                '🥩 烤羊排、烤牛排——西班牙烧烤的经典搭配',
                '🐖 伊比利亚火腿（Jamón Ibérico）——绝配',
                '🥘 西班牙海鲜饭（Paella）——尤其是含肉类版本',
                '🧀 陈年Manchego奶酪',
                '🥟 中餐搭配：酱牛肉、烤鸭、红烧排骨、腊味',
            ]},
            {'type':'tip','text':'💡 入门建议：从里奥哈Crianza开始（¥100-200），体验美国桶带来的香草椰子味；然后尝试杜埃罗河岸的Reserva（¥200-400），感受更浓郁饱满的风格；最后挑战Gran Reserva（¥400+），领略顶级丹魄的复杂魅力。'},
            {'type':'h2','text':'🏆 推荐入门酒款'},
            {'type':'list','items':[
                '🇪🇸 La Rioja Alta Viña Alberdi Reserva — 里奥哈经典名庄',
                '🇪🇸 Muga Crianza — 风格传统价格亲民',
                '🇪🇸 Marqués de Riscal Reserva — 老牌名庄',
                '🇪🇸 Vega Sicilia Valbuena 5° — 西班牙酒王入门款',
                '🇪🇸 Protos Crianza Ribera del Duero — 杜埃罗入门标杆',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'丹魄是那种"越喝越有滋味"的酒。年轻时活泼果味，陈年后优雅复杂——一瓶优质里奥哈Gran Reserva的细腻与层次感，足以让任何葡萄酒爱好者为之倾倒。Tomás: no te olvides de España. Tempranillo es el alma de nuestra tierra.'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('malbec_dive', title='🍇 马尔贝克 Malbec：从法国弃儿到阿根廷之星',
        digest='马尔贝克在法国卡奥尔是"黑酒"，在阿根廷却成为国宝。从高海拔到阳光充沛，它如何完成华丽逆袭？阿根廷马尔贝克全面指南。',
        category='wine-grape', tags=['马尔贝克','Malbec','阿根廷','门多萨','卡奥尔','红葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 马尔贝克 Malbec'},
            {'type':'subtitle','text':'从法国弃儿到阿根廷之星 | 高海拔的魅力'},
            {'type':'p','text':'马尔贝克（Malbec）是葡萄酒世界最具传奇色彩的"移民"品种。它原产法国西南部，在波尔多曾是六大法定品种之一，但因容易受病害和霜冻影响，地位逐渐被梅洛取代。'},
            {'type':'p','text':'19世纪中期，阿根廷总统Domingo Faustino Sarmiento委托法国农学家将马尔贝克枝条带到阿根廷。没想到，安第斯山脉脚下高海拔、充沛阳光、贫瘠土壤的条件（尤其是门多萨产区，海拔600-1100米），让马尔贝克焕发了第二春！'},
            {'type':'h2','text':'📍 主要产区'},
            {'type':'table','headers':['产区','国家','风格特点'],
            'rows':[
                ['门多萨 Mendoza','阿根廷','最核心产区，浓郁黑莓、紫罗兰风味，全球标杆'],
                ['萨尔塔 Salta','阿根廷','海拔最高（1700m+），酸度更高，花香更明显'],
                ['巴塔哥尼亚 Patagonia','阿根廷','凉爽气候，风格更优雅细腻'],
                ['卡奥尔 Cahors','法国','"黑酒"（Black Wine），单宁更强，风格更紧涩'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🍇 果香：黑莓、黑樱桃、李子——阿根廷马尔贝克的标志',
                '🌸 花香：紫罗兰——凉爽气候的标志',
                '🍫 桶香：可可粉、咖啡、摩卡——常见于桶陈风格',
                '🌿 草本：青椒、薄荷——凉爽年份的特征',
                '🪨 矿物：石墨、碎石——高海拔产区的特色',
            ]},
            {'type':'h2','text':'🍷 阿根廷 vs 法国风格对比'},
            {'type':'table','headers':['特征','阿根廷马尔贝克','法国卡奥尔马尔贝克'],
            'rows':[
                ['酒体','饱满','中等偏饱满'],
                ['单宁','柔顺丝滑','强劲粗犷'],
                ['果味','成熟浓郁的黑莓、黑樱桃','更紧致的黑李子、黑醋栗'],
                ['酸度','中等偏低','中等偏高'],
                ['酒精度','13.5-15%','12-13.5%'],
                ['陈年潜力','中等（5-8年）','长（10-20年）'],
            ]},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'list','items':[
                '🥩 阿根廷烤肉（Asado）——经典中的经典搭配',
                '🍔 汉堡、牛排——马尔贝克的单宁与红肉是绝配',
                '🍫 黑巧克力——浓郁的巧克力风味与马尔贝克相得益彰',
                '🧀 蓝纹奶酪——力量对力量的较量',
                '🥟 中餐搭配：红烧牛腩、酱骨架、烤鸭、腊味合蒸',
            ]},
            {'type':'tip','text':'💡 入门建议：阿根廷马尔贝克性价比极高，入门级（¥80-150）就能喝到相当不错的品质。从门多萨的入门马尔贝克开始，感受紫罗兰+黑莓的经典风味；进阶可以尝试高海拔的Lujan de Cuyo或Uco Valley。'},
            {'type':'h2','text':'🏆 推荐入门酒款'},
            {'type':'list','items':[
                '🇦🇷 Catena Zapata Malbec — 阿根廷马尔贝克标杆名庄',
                '🇦🇷 Bodega Norton Malbec — 入门级性价比之王',
                '🇦🇷 Trapiche Malbec — 全球最畅销的马尔贝克之一',
                '🇦🇷 Achaval Ferrer Malbec — 高海拔精品代表',
                '🇫🇷 Château de Chambert Cahors — 法国风格入门',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'马尔贝克的故事告诉我们：有时候失败只是因为没找到对的地方。这款在法国被边缘化的品种，在安第斯山脉脚下找到了属于自己的天地，成为新世界葡萄酒最闪亮的名片之一。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('grenache_dive', title='🍇 歌海娜 Grenache：阳光下的热情舞者',
        digest='歌海娜是世界上种植最广的红葡萄之一。从南罗讷到普里奥拉托，从GSM混酿到单一品种，它的甜美感人至深。',
        category='wine-grape', tags=['歌海娜','Grenache','南罗讷','教皇新堡','普里奥拉托','GSM','红葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 歌海娜 Grenache'},
            {'type':'subtitle','text':'阳光下的热情舞者 | GSM混酿的灵魂'},
            {'type':'p','text':'歌海娜（Grenache）是世界上种植最广泛的红葡萄品种之一。它喜欢炎热干燥的气候，生命力顽强，酿出的酒往往果味充沛、酒精度高、单宁柔和。'},
            {'type':'p','text':'歌海娜很少单独出现——它通常是混酿中的"甜蜜担当"。在著名的GSM混酿（歌海娜-西拉-慕合怀特）中，歌海娜贡献了果味和酒精感，西拉提供颜色和香料味，慕合怀特则带来单宁结构和深度。'},
            {'type':'h2','text':'📍 主要产区'},
            {'type':'table','headers':['产区','国家','风格特点'],
            'rows':[
                ['南罗讷 Southern Rhône','法国','GSM混酿为主，教皇新堡的旗舰品种'],
                ['普里奥拉托 Priorat','西班牙','西班牙最顶级的歌海娜产区，老藤单酿卓越'],
                ['纳瓦拉 Navarra','西班牙','轻盈果味的歌海娜'],
                ['萨丁岛 Sardinia','意大利','当地称Cannonau，风格饱满粗犷'],
                ['麦克拉伦谷 McLaren Vale','澳洲','GSM混酿的澳洲典范'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🍓 果香：草莓、覆盆子、红樱桃——温暖甜美的果味是歌海娜的标志',
                '🍊 特殊：橙皮、干无花果——老藤歌海娜的特色',
                '🌿 香料：白胡椒、甘草、普罗旺斯香草',
                '🍫 陈年：焦糖、太妃糖、皮革',
            ]},
            {'type':'h2','text':'🍷 风格定位'},
            {'type':'p','text':'歌海娜的特点是：酒精度高（通常14-15.5%）、单宁柔和、酸度中低、酒体饱满。它的颜色偏浅（由于单宁含量低），但风味浓度极高。'},
            {'type':'p','text':'老藤歌海娜（尤其是普里奥拉托的Licorella板岩上种植的）可以酿出极为浓缩、复杂的酒款，兼具力量与优雅，是西班牙最顶级的葡萄酒之一。'},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'list','items':[
                '🥘 普罗旺斯炖菜（Ratatouille）——与歌海娜的草本风味完美呼应',
                '🐑 烤羊排、烤羊肉串——甜美的果味与羊肉相得益彰',
                '🍝 地中海风味的番茄意面',
                '🧀 Comté、Gouda等硬质奶酪',
                '🥟 中餐搭配：孜然羊肉、红烧牛尾、五香卤味',
            ]},
            {'type':'tip','text':'💡 入门建议：从南罗讷的Côtes du Rhône入门（¥80-150），感受GSM混酿的基础风格；进阶尝试教皇新堡（Châteauneuf-du-Pape，¥300-1000），体验歌海娜的巅峰；如果追求极致，试试普里奥拉托的老藤歌海娜。'},
            {'type':'sep','text':''},
            {'type':'p','text':'歌海娜是那种让人"喝起来开心"的酒。它没有赤霞珠的严肃、没有黑皮诺的娇贵——它就像南法阳光下的热情舞者，自由、奔放、甜美。不论是入门新手还是资深爱好者，歌海娜总能在某个时刻打动你。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('gewurztraminer_dive', title='🍇 琼瑶浆 Gewürztraminer：芳香女王的异域风情',
        digest='玫瑰、荔枝、百香果、肉桂——琼瑶浆的香气让人一闻难忘。阿尔萨斯最特别的品种，甜与干的博弈。',
        category='wine-grape', tags=['琼瑶浆','Gewürztraminer','阿尔萨斯','芳香型','白葡萄'],
        content_blocks=[
            {'type':'title','text':'🍇 琼瑶浆 Gewürztraminer'},
            {'type':'subtitle','text':'芳香女王的异域风情 | 玫瑰与荔枝的盛宴'},
            {'type':'p','text':'琼瑶浆（Gewürztraminer）是世界上最芳香的葡萄品种之一。它的名字在德语中意为"香料味的特拉敏"——Gewürz就是"香料"的意思。'},
            {'type':'p','text':'琼瑶浆的香气极具穿透力：玫瑰花瓣、荔枝、百香果、肉桂、生姜……即使从没喝过葡萄酒的人，闻到琼瑶浆也会惊叹"原来酒可以这么香！"'},
            {'type':'h2','text':'📍 主要产区'},
            {'type':'table','headers':['产区','国家','风格特点'],
            'rows':[
                ['阿尔萨斯 Alsace','法国','最经典的产区，干型到贵腐甜型皆可'],
                ['法尔兹 Pfalz','德国','风格更清爽，酸度略高'],
                ['特伦蒂诺 Trentino-Alto Adige','意大利','花香浓郁，口感清爽'],
                ['克莱尔谷 Clare Valley','澳洲','浓郁奔放的风格'],
            ]},
            {'type':'h2','text':'👃 香气特征'},
            {'type':'list','items':[
                '🌹 花香：玫瑰花瓣、紫罗兰——最标志性的香气',
                '🍈 热带水果：荔枝、百香果、芒果——这是琼瑶浆的"签名香"',
                '🌿 香料：肉桂、丁香、生姜、白胡椒——"Gewürz"的体现',
                '🍯 蜂蜜：成熟的琼瑶浆常有蜂蜜和蜂蜡的香气',
                '🍊 柑橘：柚子皮、橘子酱——甜型琼瑶浆常见',
            ]},
            {'type':'h2','text':'🍷 干型 vs 甜型'},
            {'type':'p','text':'琼瑶浆一个特别之处在于它可以是干型也可以是甜型——而且两者都有忠实粉丝。由于琼瑶浆本身酸度较低，即使是干型琼瑶浆喝起来也会感觉略带甜味（虽然残糖很低）。'},
            {'type':'table','headers':['类型','特点','推荐场合','代表产区'],
            'rows':[
                ['干型','香气爆炸、口感饱满','配餐：亚洲菜、辛辣料理','阿尔萨斯（标"dry"或vendange tardive晚收的干型版本）'],
                ['半干','微甜、花香更浓','开胃酒、闺蜜聚会','阿尔萨斯经典风格'],
                ['晚收 VT','浓郁蜜饯味','搭配蓝纹奶酪、鹅肝','阿尔萨斯晚收酒 Vendange Tardive'],
                ['贵腐 SGN','极为浓郁、甜度高','收藏、搭配甜品','阿尔萨斯贵腐 Selection de Grains Nobles'],
            ]},
            {'type':'h2','text':'🍽️ 美食搭配'},
            {'type':'p','text':'琼瑶浆是亚洲菜的绝配——它的异域香气和微甜口感与中式、泰式、印式料理的香料味完美配合。'},
            {'type':'list','items':[
                '🥟 中餐：宫保鸡丁、椒盐虾、清蒸鱼、凉拌菜',
                '🍜 泰餐：冬阴功汤、绿咖喱、泰式炒河粉',
                '🍛 印度菜：咖喱鸡、玛萨拉香料菜',
                '🧀 阿尔萨斯奶酪（Munster）——地方经典搭配',
                '🦆 鹅肝（Foie Gras）——甜型琼瑶浆的经典搭配',
            ]},
            {'type':'tip','text':'💡 入门建议：从阿尔萨斯干型琼瑶浆开始（¥150-300），感受经典的玫瑰荔枝香；如果想体验更丰富的层次，可以试试Vendange Tardive晚收级（¥400+），甜而不腻、香料味十足。'},
            {'type':'h2','text':'🏆 推荐入门酒款'},
            {'type':'list','items':[
                '🇫🇷 Trimbach Gewürztraminer — 阿尔萨斯经典标杆',
                '🇫🇷 Domaine Zind-Humbrecht — 生物动力法名家',
                '🇫🇷 Hugel Gewürztraminer — 历史悠久的酒庄',
                '🇩🇪 Dr. Loosen "Bernkasteler" — 德国风格',
                '🇮🇹 Cantina Terlano Gewürztraminer — 意大利上阿迪杰风格',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'琼瑶浆就像葡萄酒世界里的"异域美人"——浓烈的玫瑰荔枝香气、华丽的酒体、极具辨识度的风格。第一次喝它的人一定会记住它，而爱上它的人则会不断追寻它的不同面貌。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    # ======================== PRACTICAL GUIDES ========================

    build_article('wine_storage_guide', title='🍾 开瓶后葡萄酒能放多久？史上最全保存指南',
        digest='一瓶酒开了喝不完怎么办？塞回瓶塞能放几天？起泡酒、红酒、白酒、甜酒保存时间各不相同。附赠真空塞、换瓶器、惰性气体等实用工具评测。',
        category='wine-practical', tags=['葡萄酒保存','开瓶','醒酒','真空塞','保鲜','实用技巧'],
        content_blocks=[
            {'type':'title','text':'🍾 开瓶后葡萄酒能放多久？'},
            {'type':'subtitle','text':'史上最全葡萄酒保存指南 | 喝不完怎么办？'},
            {'type':'p','text':'开了一瓶好酒但没喝完——这是每个葡萄酒爱好者都会遇到的窘境。直接倒掉太可惜，硬喝又怕变质。那么，不同葡萄酒开瓶后到底能放多久？如何延长它们的寿命？'},
            {'type':'h2','text':'⏰ 各种葡萄酒的"保质期"（冷藏条件下）'},
            {'type':'table','headers':['酒的类型','开瓶后寿命','关键变化'],
            'rows':[
                ['起泡酒（香槟/Cava）','1-3天','气泡流失后变得平淡'],
                ['轻酒体白葡萄酒（长相思/灰皮诺）','3-5天','果味逐渐消退'],
                ['重酒体白葡萄酒（霞多丽/维欧尼）','3-5天','氧化后变坚果味'],
                ['桃红葡萄酒','3-5天','果味变淡'],
                ['轻酒体红葡萄酒（黑皮诺/博若莱）','3-5天','果味消退'],
                ['重酒体红葡萄酒（赤霞珠/西拉）','5-7天','单宁柔化，仍可饮用'],
                ['加强酒（波特/雪莉/马德拉）','2-4周','最耐放的酒'],
                ['甜酒（苏玳/托卡伊/冰酒）','2-4周','糖分作为天然防腐剂'],
            ]},
            {'type':'h2','text':'🥶 核心原则：空气是头号敌人'},
            {'type':'p','text':'葡萄酒变质的主要原因是氧化——空气中的氧气与酒液接触后，使酒中的酚类物质发生化学反应。氧化的酒会失去新鲜果味，变成酱油味、醋味或烂水果味。'},
            {'type':'p','text':'因此，所有保存方法的核心都是：减少酒液与空气的接触。温度也是关键因素——冰箱冷藏室（4-8°C）能显著减缓氧化速度。'},
            {'type':'h2','text':'🔧 保存工具评测'},
            {'type':'table','headers':['工具','原理','效果','价格'],
            'rows':[
                ['原装瓶塞+冰箱','最简单的方法','一般（2-3天）','免费'],
                ['真空塞（Vacu Vin）','抽走瓶中空气','良好（3-5天）','¥30-80'],
                ['换小瓶','减少瓶中氧气空间','很好（5-7天）','免费（需有瓶）'],
                ['惰性气体喷雾','喷入氩气防止氧化','优秀（7-14天）','¥80-150'],
                ['Coravin取酒器','用针管取酒不拔塞','极佳（数月）','¥1500+'],
            ]},
            {'type':'tip','text':'💡 最佳性价比方案：买几个100ml和200ml的玻璃小瓶（试剂瓶），将剩余的酒液倒入小瓶几乎装满（不留空气空间），拧紧瓶盖放入冰箱。这比任何昂贵的工具都有效！'},
            {'type':'h2','text':'🍷 各种场景的应对策略'},
            {'type':'h3','text':'场景一：只喝了一杯，还剩大半瓶'},
            {'type':'p','text':'最佳方案：用真空塞抽走空气，放冰箱。红葡萄酒也要放冰箱（喝前提前15-20分钟取出回温即可）。这样可以保质3-5天。'},
            {'type':'h3','text':'场景二：只剩瓶底一点点（100ml左右）'},
            {'type':'p','text':'最佳方案：倒入小瓶中。100ml的酒倒进100ml的小瓶几乎没空气，可以再放一周。第二天直接当餐酒一杯喝掉很完美。'},
            {'type':'h3','text':'场景三：名庄好酒，想分几天慢慢品'},
            {'type':'p','text':'最佳方案：用Coravin取酒器。不拔塞、不氧化，可以分几周甚至几个月慢慢品尝。如果是没有Coravin的情况，用惰性气体喷雾+冰箱冷藏，也能撑5-7天。'},
            {'type':'h2','text':'⚠️ 判断变质的标准'},
            {'type':'p','text':'酒还能不能喝？用"望闻问切"来判断：'},
            {'type':'list','items':[
                '👃 闻：有没有类似醋、酱油、雪莉酒或烂苹果的刺鼻气味？有→变坏了',
                '👀 看：颜色有没有变成棕色或砖红色（白葡萄酒变成深琥珀色）？有→氧化了',
                '👅 尝：口感是否变得平淡、缺乏果味？有没有令人不快的刺激感？有→不建议喝',
                '✅ 如果只是果味变淡了一些、单宁柔化了一些——这其实是自然演变，可以放心喝',
            ]},
            {'type':'h2','text':'🍶 红酒到底要不要放冰箱？'},
            {'type':'p','text':'很多人认为红葡萄酒不能放冰箱。这是误区！冷藏只是暂时的保存手段（不是长期陈年）。在冰箱里放3-5天对红酒的品质影响不大，喝前提前取出回温至16-18°C即可。'},
            {'type':'p','text':'但要注意：冰箱温度不能太低（不要低于4°C），而且最好用保鲜膜包好瓶口防止串味——冰箱里的剩菜味道会通过软木塞渗透到酒中！'},
            {'type':'sep','text':''},
            {'type':'p','text':'记住这条黄金法则：再好的保存方法也比不上找个人一起喝完。所以开好酒的时候，别忘了叫上朋友。独饮虽好，但分享才是葡萄酒最正确的打开方式。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('wine_tasting_101', title='🍷 葡萄酒品鉴入门：看、闻、尝——从零开始学品酒',
        digest='如何像专家一样品酒？看颜色、闻香气、尝味道——三步法详细拆解。附赠品酒词大全和品酒笔记模板。',
        category='wine-practical', tags=['品酒','品鉴','初学者','看闻尝','品酒笔记','入门'],
        content_blocks=[
            {'type':'title','text':'🍷 葡萄酒品鉴入门'},
            {'type':'subtitle','text':'看、闻、尝——从零开始学品酒 | 三步法全解析'},
            {'type':'p','text':'品酒听起来好像很深奥，其实它就像学做饭一样，掌握了基本方法，人人都能成为品酒达人。葡萄酒品鉴的核心就是三个步骤：看（Look）、闻（Smell）、尝（Taste）。'},
            {'type':'p','text':'最重要的是：品酒没有"正确答案"。只要你认真感受、诚实记录，你的品鉴就是有效的。不要被那些"品酒大师"的术语吓到——每个人对气味的感知都是独特的。'},
            {'type':'h2','text':'👀 第一步：看（Look）'},
            {'type':'p','text':'将酒杯举到白色背景前（白纸或白色桌布就可以），观察酒液的外观。你不需要品酒师的专业光圈，肉眼观察就能获取很多信息。'},
            {'type':'table','headers':['观察点','白葡萄酒','红葡萄酒','含义'],
            'rows':[
                ['颜色深度','浅稻草→深金黄→琥珀','浅宝石红→深紫红→砖红','颜色越深，酒体越饱满/越成熟'],
                ['边缘色调','年轻=青绿色','年轻=紫色边缘','边缘泛砖红=陈年迹象'],
                ['清澈度','清澈/浑浊','清澈/浑浊','浑浊可能表示无过滤或已变质'],
                ['挂杯/酒泪','多/少','多/少','挂杯越多=酒精度或糖分越高'],
            ]},
            {'type':'h3','text':'颜色透露的秘密：'},
            {'type':'list','items':[
                '年轻白葡萄酒：浅稻草色、淡黄绿色 → 清爽型，如长相思、灰皮诺',
                '陈年白葡萄酒：深金黄色、琥珀色 → 受过橡木桶或陈年，如霞多丽',
                '年轻红葡萄酒：深紫色、宝石红色 → 果味充沛，如赤霞珠、西拉',
                '陈年红葡萄酒：砖红色、石榴红色 → 已经陈年，单宁柔化',
                '桃红葡萄酒：浅粉色、三文鱼色 → 短期浸皮酿造',
            ]},
            {'type':'h2','text':'👃 第二步：闻（Smell）'},
            {'type':'p','text':'闻香是品酒中最关键也最享受的步骤。人的嗅觉可以识别数千种气味，远远超过味觉能够分辨的味道种类。'},
            {'type':'p','text':'首先静止闻一次——感受酒的"第一印象"。然后轻轻摇杯（让酒与空气接触释放香气），再深吸一口。你可能会闻到三类香气：'},
            {'type':'table','headers':['香气类别','来源','例子'],
            'rows':[
               ['一类香气（果香/花香）','葡萄本身','黑莓、樱桃、玫瑰、荔枝'],
               ['二类香气（发酵/桶香）','酿酒工艺','香草、烤面包、黄油、酵母'],
               ['三类香气（陈年香）','瓶中陈年','皮革、松露、蜂蜜、干果'],
            ]},
            {'type':'tip','text':'💡 闻香小技巧：不要害怕用你的生活经验——"这闻起来像我家花园的玫瑰"比"这有玫瑰多酚的芳香"要真实得多。越个人化的描述，越能帮助你记住这款酒。'},
            {'type':'h2','text':'👅 第三步：尝（Taste）'},
            {'type':'p','text':'终于到了最期待的一步！喝一小口（不要太多），让酒液覆盖整个舌面，像漱口一样让酒在口中停留3-5秒。注意感受以下维度：'},
            {'type':'table','headers':['维度','描述','如何判断'],
            'rows':[
                ['甜度','干→半干→半甜→甜','舌尖前端的甜味感知'],
                ['酸度','低→中→高','口水分泌量（越多=酸度越高）'],
                ['单宁','低→中→高','口腔的干燥/收敛感（像喝浓茶）'],
                ['酒体','轻盈→中等→饱满','酒液在口中的"重量感"'],
                ['酒精度','低→中→高','喉咙的温热感'],
                ['余味','短→中→长','咽下后风味持续的时间'],
            ]},
            {'type':'h2','text':'📝 品酒笔记模板（初学者版）'},
            {'type':'box','heading':'简易品酒笔记','text':'''酒名：________________
年份：____  产区：________________
颜色：□浅 □中 □深  色调：__________
香气（写3个词）：________、________、________
口感（打勾）：□干 □半干 □甜
喜欢吗？：□很喜欢 □还行 □一般
一句话评价：_______________________
评分（满分10分）：____/10'''},
            {'type':'h2','text':'🌡️ 侍酒温度速查表'},
            {'type':'table','headers':['酒的类型','侍酒温度','简单判断'],
            'rows':[
                ['起泡酒/香槟','6-8°C','冰镇2小时'],
                ['清爽白葡萄酒','8-10°C','冰镇1.5小时'],
                ['饱满白葡萄酒','10-12°C','冰镇1小时'],
                ['桃红葡萄酒','8-10°C','冰镇1.5小时'],
                ['轻盈红葡萄酒','12-14°C','冰箱20分钟'],
                ['饱满红葡萄酒','16-18°C','室温（夏季可稍凉）'],
                ['甜酒','6-8°C','充分冰镇'],
            ]},
            {'type':'h2','text':'🎯 品酒入门避坑指南'},
            {'type':'list','items':[
                '❌ 不要在品酒前吃辛辣、酸涩的食物或喝咖啡——会破坏味觉',
                '❌ 不要在喷香水或气味浓烈的环境品酒——香气干扰',
                '❌ 不要迷信昂贵的酒杯——普通的ISO酒杯就足够好',
                '✅ 品酒前喝点水，保持口腔干净',
                '✅ 同一款酒在不同温度下品尝，味道可能完全不同——试试冷藏20分钟后的红酒',
                '✅ 多喝多比较——品酒能力唯一的提升方法就是大量品鉴',
            ]},
            {'type':'sep','text':''},
            {'type':'p','text':'品酒不是考试，没有标准答案。最顶级的品酒师也可能会把一款酒误认为是另一款。品酒真正的意义不在于"猜对"，而在于"感受"——打开感官、专注当下、享受每一杯酒带来的独特体验。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    print(f'\n=== ALL DONE: {len(os.listdir("output"))} total outputs ===')
