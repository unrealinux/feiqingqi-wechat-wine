import os, json

CONFIG_CODE = "require('./config')"
DATE = '20260616'

# 封面配色：按栏目区分（视觉分类标签）
PALETTE = {
    'wine-myth':    {'bg1':'#1a1206','bg2':'#3a2407','accent':'#ffd54f','icon':'❓'},
    'wine-grape':   {'bg1':'#2a0a10','bg2':'#5a1220','accent':'#ff6b6b','icon':'🍇'},
    'wine-style':   {'bg1':'#0e1a2a','bg2':'#163a5a','accent':'#5bc0eb','icon':'🍵'},
    'wine-knowledge':{'bg1':'#1a1a2e','bg2':'#2e2e4a','accent':'#b388ff','icon':'📚'},
    'wine-culture': {'bg1':'#1a0a1e','bg2':'#3a1240','accent':'#ff8fcf','icon':'🎨'},
}
DEFAULT_PAL = {'bg1':'#1a1a2e','bg2':'#3a2e1a','accent':'#ffd54f','icon':'🍷'}

def build_cover(title, category, seq='01'):
    pal = PALETTE.get(category, DEFAULT_PAL)
    seq_txt = f'<text x="80" y="250" fill="{pal["accent"]}" font-size="190" font-family="Arial Black,Arial,sans-serif" font-weight="bold" opacity="0.22">{seq}</text>'
    glass = f'''<g transform="translate(880,90) scale(1.1)" opacity="0.16" fill="{pal["accent"]}">
<path d="M0,0 L70,0 L58,90 L46,90 L40,140 L30,140 L24,90 L12,90 Z"/>
<rect x="20" y="140" width="20" height="14" rx="4"/>
<rect x="0" y="154" width="60" height="10" rx="5"/>
</g>'''
    icon = f'<text x="80" y="100" font-size="46">{pal["icon"]}</text>'
    segs = [title[i:i+15] for i in range(0, len(title), 15)][:3]
    lines = []
    y = 330
    for seg in segs:
        lines.append(f'<text x="80" y="{y}" fill="#fff" font-size="58" font-family="\'Microsoft YaHei\',\'PingFang SC\',sans-serif" font-weight="bold">{seg}</text>')
        y += 78
    bar = f'''<rect x="0" y="560" width="1200" height="70" fill="{pal["accent"]}" opacity="0.92"/>
<text x="80" y="604" fill="#1a1206" font-size="30" font-family="\'Microsoft YaHei\',sans-serif" font-weight="bold">红酒顾问 · 每日避坑</text>
<text x="1120" y="604" text-anchor="end" fill="#1a1206" font-size="26" font-family="sans-serif" opacity="0.8">feiqingqi</text>'''
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:{pal["bg1"]}"/><stop offset="100%" style="stop-color:{pal["bg2"]}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
{seq_txt}
{glass}
{icon}
{''.join(lines)}
{bar}
</svg>'''
    return svg

def js_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def html_body(content_blocks):
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

def build_article(name, title, digest, category, tags, content_blocks, seq='01'):
    svg = build_cover(title, category, seq)
    svg_b64 = f'data:image/svg+xml;base64,{__import__("base64").b64encode(svg.encode()).decode()}'
    html = html_body(content_blocks)
    html_lines = html.split('\n')
    html_js = '\n'.join(f"  '{js_str(line)}' +" for line in html_lines)
    html_js = html_js.rstrip('+').rstrip('\n')
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
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
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
    console.log('OK {name}, media_id:', d.data.media_id);
  }}catch(e){{
    console.error('FAIL {name}:', e.message);
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

    # ======================== 避坑系列 第2-10期 ========================
    # 第1期（挂杯）已发布，本批从第2期开始

    build_article('myth_aging', title='🍷 红酒越陈越好？大部分酒根本不值得等',
        digest='只有少数顶级酒适合陈年，99%的餐酒趁新鲜喝最好。教你判断一瓶酒到底该现在喝还是再等等。',
        category='wine-myth', tags=['陈年','误区','适饮期','储藏','新手'], seq='02',
        content_blocks=[
            {'type':'title','text':'🍷 红酒越陈越好？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第2期'},
            {'type':'p','text':'"这瓶酒放几年更好喝"——这句话坑了无数人。真相是：市面上绝大多数红酒，出厂时就是适饮巅峰，放久了只会变差。'},
            {'type':'h2','text':'⏳ 为什么大部分酒不宜陈年'},
            {'type':'p','text':'红酒的陈年潜力取决于单宁、酸度、糖分和风味浓度。普通餐酒这些元素薄弱，没有"陈年资本"，放三年五年，果香散尽、氧化加重，反而变得寡淡。'},
            {'type':'table','headers':['酒的类型','适饮期','说明'],
            'rows':[
                ['百元内餐酒','出厂1-3年内','果香型，趁新鲜喝'],
                ['中端酒（200-500）','3-8年','部分有短期陈年价值'],
                ['顶级波尔多/勃艮第','10-30年','真正值得收藏的少数'],
                ['加强酒/贵腐甜酒','数十年','糖分和酒精是天然防腐剂'],
            ]},
            {'type':'h2','text':'🔍 怎么判断该不该等'},
            {'type':'list','items':[
                '💰 价格：100块以内的酒，基本不用考虑陈年',
                '🍇 品种：黑皮诺、佳美不耐存；赤霞珠、内比奥罗更耐放',
                '🏷️ 产区：大区级餐酒即饮；列级庄/特级园才值得等',
                '📅 年份：差年份的酒更该早喝',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'一个粗暴的判断：你在超市货架上随手拿的酒，99%都该在一年内喝掉。把"越陈越好"当成买贵酒的理由，是最大的消费误区之一。'},
            {'type':'h2','text':'✅ 真正该陈年的信号'},
            {'type':'list','items':[
                '🍷 高单宁、高酸、酒体饱满的红葡萄酒',
                '🏆 知名产区列级/特级园等有权威背书的酒',
                '🍯 贵腐甜酒、波特等加强/甜型酒',
                '🌡️ 且存放在恒温（12-15°C）、避光、湿度适宜的环境',
            ]},
            {'type':'tip','text':'💡 家里没酒柜又想存几年？与其赌一瓶餐酒变好，不如把预算加到一瓶本来就适饮的好酒上，体验差距立判。'},
            {'type':'sep','text':''},
            {'type':'p','text':'陈年不是红酒的必选项，而是少数酒的特权。放过那些普通酒吧，它们最好的样子，就是被你尽快喝掉的那一刻。'},
            {'type':'end','text':'— 你家里有"放了很久"的酒吗？评论区说说 —'},
        ]
    )

    build_article('myth_decant', title='🍷 红酒一定要醒酒？乱醒反而毁了一瓶好酒',
        digest='醒酒不是红酒的标配。年轻重酒才需要醒，轻盈老酒一醒就散。一文讲清什么该醒、什么别碰。',
        category='wine-myth', tags=['醒酒','误区','侍酒','新手','黑皮诺'], seq='03',
        content_blocks=[
            {'type':'title','text':'🍷 红酒一定要醒酒？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第3期'},
            {'type':'p','text':'打开一瓶红酒，先倒进醒酒器——这成了很多人的"仪式感"。但醒酒用错了，不仅没帮助，还会把好酒醒"死"。'},
            {'type':'h2','text':'🌬️ 醒酒到底在干嘛'},
            {'type':'p','text':'醒酒的核心是让酒接触氧气：一是挥发刺鼻的硫化物、还原味；二是让封闭的香气打开；三是柔化年轻酒粗糙的单宁。但它不是魔法，过犹不及。'},
            {'type':'h2','text':'✅ 这些酒才需要醒'},
            {'type':'table','headers':['酒的类型','建议','原因'],
            'rows':[
                ['年轻重单宁红（赤霞珠/西拉）','醒30-60分','柔化单宁、打开香气'],
                ['顶级陈年潜力红','醒1-2小时','唤醒沉睡的复杂层次'],
                ['有还原味/臭鸡蛋味的酒','醒15-30分','挥发硫化物'],
                ['老年份波尔多','小心醒','短时滗酒去沉淀即可'],
            ]},
            {'type':'h2','text':'❌ 这些酒别醒'},
            {'type':'list','items':[
                '🍒 黑皮诺/佳美：香气娇贵，醒久了果味散尽',
                '🥂 老酒（20年以上）：一接触空气迅速衰败',
                '🍇 芳香型白酒（雷司令/长相思）：喝的就是清新，别醒',
                '🍾 起泡酒：气泡全跑光',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'判断要不要醒，记住一句话：单宁重、还年轻、有怪味——才需要醒。轻盈、老、芬芳的酒，开瓶即饮最好。'},
            {'type':'h2','text':'🛠️ 没有醒酒器怎么办'},
            {'type':'p','text':'其实不用专门买醒酒器。倒杯里多晃几下、或用"瓶醒"（开瓶后静置）也能达到类似效果。普通餐酒根本不必折腾。'},
            {'type':'tip','text':'💡 一个实用招：倒一杯先尝，觉得紧涩封闭再决定醒。让舌头告诉你，而不是让"规矩"告诉你。'},
            {'type':'sep','text':''},
            {'type':'p','text':'醒酒是工具不是教条。用对了锦上添花，用错了画蛇添足。下次开瓶前，先问问这酒"需不需要被叫醒"。'},
            {'type':'end','text':'— 你醒错过酒吗？评论区聊聊 —'},
        ]
    )

    build_article('myth_france', title='🇫🇷 法国酒一定比新世界好？别被产区光环骗了',
        digest='法国酒有底蕴，但新世界的智利、阿根廷、澳洲早就能打。同价位下，盲目追法国往往亏了性价比。',
        category='wine-myth', tags=['法国酒','新世界','误区','性价比','产区'], seq='04',
        content_blocks=[
            {'type':'title','text':'🇫🇷 法国酒一定比新世界好？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第4期'},
            {'type':'p','text':'"要喝就喝法国酒"是很多人的执念。法国酒当然有顶级货，但把"法国"当成品质保证，往往会为品牌溢价多花冤枉钱。'},
            {'type':'h2','text':'🌍 新世界早就不是"便宜货"'},
            {'type':'p','text':'智利、阿根廷、澳洲、新西兰、美国——这些"新世界"产区的酿酒技术、设备、葡萄园管理早已世界一流。很多酒的精度和平衡度，不输同价位法国酒。'},
            {'type':'table','headers':['同价位对比','法国酒','新世界酒'],
            'rows':[
                ['100元档','入门餐酒，果味普通','智利赤霞珠/澳洲西拉更饱满好喝'],
                ['300元档','大区级，性价比一般','阿根廷马尔贝克/新西兰黑皮诺更出彩'],
                ['千元以上','列级庄有底蕴','纳帕/勃艮第新锐同样精彩'],
            ]},
            {'type':'h2','text':'🔎 法国酒的真实优势'},
            {'type':'p','text':'法国酒的优势在"顶级段"：波尔多列级、勃艮第特级园，风土的复杂度和陈年潜力确实难以复制。但日常饮用，这个优势并不明显。'},
            {'type':'h2','text':'❌ 盲目追法国的代价'},
            {'type':'list','items':[
                '💸 为"法国"二字支付品牌溢价',
                '🏷️ 买到贴牌/大流通货，品质平平',
                '😵 被复杂分级（AOC/AOP）绕晕，反而选错',
                '🌱 错过新世界高性价比宝藏',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'产区是参考不是标签。一瓶好喝、适合你口味和预算的酒，是法国还是智利并不重要。把"法国=好"换成"这瓶本身好不好喝"，你会在酒架上少交很多学费。'},
            {'type':'tip','text':'💡 新手进阶路线：先用新世界酒把"果味、酒体、单宁"基础味觉建立起来，再回头喝法国，才品得出风土的门道。'},
            {'type':'sep','text':''},
            {'type':'p','text':'尊重法国酒的底蕴，但不必神化它。葡萄酒的世界是平的，好喝才是唯一的国籍。'},
            {'type':'end','text':'— 你更爱法国还是新世界？评论区站队 —'},
        ]
    )

    build_article('myth_screwcap', title='🔩 螺旋盖=低端酒？它其实比软木塞更靠谱',
        digest='螺旋盖早就是澳洲名庄的标配，密封稳定、不怕木塞污染。把封装方式当品质标准，是过时的偏见。',
        category='wine-myth', tags=['螺旋盖','软木塞','误区','封装','木塞污染'], seq='05',
        content_blocks=[
            {'type':'title','text':'🔩 螺旋盖=低端酒？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第5期'},
            {'type':'p','text':'看到螺旋盖就皱眉？很多人潜意识里把"软木塞=高级、螺旋盖=廉价"画了等号。这个偏见，连很多酒庄都想纠正。'},
            {'type':'h2','text':'🍾 螺旋盖的真实身份'},
            {'type':'p','text':'螺旋盖（金属旋盖）是20世纪末成熟的封装技术。它密封性极好、几乎零氧气渗入，能完美保留酒的果香和新鲜度。澳洲、新西兰的顶级酒庄，清一色用它。'},
            {'type':'h2','text':'⚖️ 螺旋盖 vs 软木塞'},
            {'type':'table','headers':['维度','螺旋盖','软木塞'],
            'rows':[
                ['密封稳定性','极高，每瓶一致','有差异，看单宁'],
                ['木塞污染风险','几乎为零','约2-5%有TCA污染'],
                ['陈年能力','适合早-中期饮用','传统认为更利长期陈年'],
                ['开瓶便利','一拧即开','需开瓶器'],
            ]},
            {'type':'h2','text':'☠️ 软木塞的隐形坑：木塞污染'},
            {'type':'p','text':'软木塞最大的隐患是TCA污染——约每20-50瓶就有1瓶带霉味、湿纸板味，完全毁掉一瓶好酒。螺旋盖从根上消灭了这个问题。'},
            {'type':'h2','text':'❌ 为什么偏见还在'},
            {'type':'list','items':[
                '🎩 "拔塞仪式感"让人误以为软木=高级',
                '📜 旧世界传统酒庄长期用软木，形成心理锚定',
                '📰 早期廉价餐酒多用螺旋盖，留下低端印象',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'封装方式只关乎"怎么保存酒"，不关乎"酒本身好不好"。一瓶新西兰顶级长相思用螺旋盖，恰恰是对品质的自信——它要确保你喝到的，和酒庄装瓶时一模一样。'},
            {'type':'tip','text':'💡 判断酒质看酒标上的产区、酒庄、年份，而不是看它是拧开还是拔开。下次别因为螺旋盖就放下那瓶好酒。'},
            {'type':'sep','text':''},
            {'type':'p','text':'螺旋盖不是退步，而是封装技术的一次进化。放下偏见，你的酒柜会少几瓶"被木塞毁掉的好酒"。'},
            {'type':'end','text':'— 你是软木党还是螺旋盖党？评论区见 —'},
        ]
    )

    build_article('myth_sprite', title='🥤 红酒配雪碧？好酒真的经不起这么折腾',
        digest='红酒加雪碧是很多人的入门喝法，但好酒的风味会被糖汽水彻底掩盖。偶尔解腻无妨，别当成"懂喝"。',
        category='wine-myth', tags=['雪碧','兑饮','误区','喝法','新手'], seq='06',
        content_blocks=[
            {'type':'title','text':'🥤 红酒配雪碧？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第6期'},
            {'type':'p','text':'红酒里倒进雪碧、可乐，是不少人的"第一口红酒记忆"。甜汽水确实让干涩的红酒变顺口，但代价是：你再也尝不到这瓶酒本来的样子。'},
            {'type':'h2','text':'🥤 为什么有人爱这么喝'},
            {'type':'p','text':'年轻红酒单宁紧涩、酸度明显，对没习惯的人确实"又涩又酸"。雪碧的糖和气泡瞬间中和了这些刺激，入口变甜变柔——本质是"用糖掩盖缺点"。'},
            {'type':'h2','text':'❌ 代价是什么'},
            {'type':'list','items':[
                '🍬 高糖分盖住酒的真实果香和品种特征',
                '🫧 气泡加速酒精吸收，更容易上头',
                '💸 用雪碧泡掉一瓶好酒，等于把钱冲进下水道',
                '👅 长期这么喝，味觉永远建立不起对红酒的感知',
            ]},
            {'type':'h2','text':'🍷 什么情况可以变通'},
            {'type':'p','text':'不是绝对不能兑。极廉价、本身难喝的餐酒，加雪碧当"酒精饮料"解腻无伤大雅；派对场景追求轻松氛围，偶尔为之也没人审判你。但别把这当成"会喝红酒"。'},
            {'type':'table','headers':['场景','建议'],
            'rows':[
                ['品鉴/学习','纯饮，感受真实风味'],
                ['日常佐餐','纯饮或极淡醒酒'],
                ['派对解腻','兑饮无妨，但选便宜酒'],
                ['宴请显专业','纯饮，配醒酒器'],
            ]},
            {'type':'box','heading':'红酒顾问说','text':'红酒的风味是需要被"读"的——单宁的骨架、酸度的线条、果香的层次。雪碧像给黑白电影上了层糖色，热闹却失真。想真正懂酒，从纯饮一杯开始。'},
            {'type':'tip','text':'💡 觉得红酒太涩？与其加雪碧，不如换一瓶低单宁、果味柔的酒（如黑皮诺、佳美），同样顺口，却不浪费酒本身。'},
            {'type':'sep','text':''},
            {'type':'p','text':'雪碧不是红酒的敌人，但它是"懂酒"的减速带。偶尔甜蜜无妨，别让它挡住你通往真正风味的路。'},
            {'type':'end','text':'— 你干过红酒配雪碧吗？评论区坦白 —'},
        ]
    )

    build_article('myth_full', title='🍷 红酒倒满杯才豪爽？留白才是正确喝法',
        digest='红酒倒满杯，香气无处释放、温度易升、还容易洒。正确喝法是倒1/3，留足空间让酒"呼吸"。',
        category='wine-myth', tags=['倒酒','杯量','误区','品鉴','新手'], seq='07',
        content_blocks=[
            {'type':'title','text':'🍷 红酒倒满杯才豪爽？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第7期'},
            {'type':'p','text':'白酒杯倒满、啤酒杯倒满，于是很多人顺手把红酒也倒到杯口。但红酒是最怕"满"的酒——倒太满，香气、温度、体验全打折。'},
            {'type':'h2','text':'👃 红酒为什么不能满'},
            {'type':'p','text':'闻香是喝红酒的一半乐趣。酒杯留出空间，摇杯时酒液旋转、香气聚集在杯口，你才能闻到。倒满了，香气散不出去，摇杯还会洒一身。'},
            {'type':'h2','text':'📏 倒多少才对'},
            {'type':'table','headers':['酒杯类型','建议倒量','理由'],
            'rows':[
                ['红酒杯（波尔多杯）','约1/3杯','留空间聚香、控温'],
                ['勃艮第杯（大肚）','更少，1/4','大肚本身聚香'],
                ['白酒杯','约1/2','无需大力摇香'],
                ['起泡酒杯','约2/3','看气泡升腾'],
            ]},
            {'type':'h2','text':'🌡️ 满杯的隐藏代价'},
            {'type':'list','items':[
                '🌡️ 酒液大面积接触空气，温度快速升高（红酒适饮12-18°C）',
                '👅 入口太满，无法在口中感受酒体层次',
                '💦 摇杯即溢，社交场合尴尬',
                '👃 香气无法在杯口聚集，闻不到',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'倒酒留白不是矫情，是物理规律。1/3杯量是全球品鉴师的最大公约数——既给香气留舞台，也给你留体面。'},
            {'type':'tip','text':'💡 一个小技巧：倒酒后轻轻晃杯，把鼻子探进杯口深吸一口。你会发现，同一瓶酒，"满杯"和"三分之一杯"闻起来像两瓶。'},
            {'type':'sep','text':''},
            {'type':'p','text':'红酒是慢饮的酒，倒满杯的急切与它格格不入。留三分空，盛的是香气，也是从容。'},
            {'type':'end','text':'— 你习惯倒满还是留白？评论区聊聊 —'},
        ]
    )

    build_article('myth_price', title='💰 红酒越贵越好喝？价格和口感常常脱节',
        digest='贵酒有贵的道理，但"好喝"是主观的。很多200块的酒比2000块的更对你的胃口。别让价格绑架舌头。',
        category='wine-myth', tags=['价格','性价比','误区','选购','新手'], seq='08',
        content_blocks=[
            {'type':'title','text':'💰 红酒越贵越好喝？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第8期'},
            {'type':'p','text':'"这瓶贵，肯定好喝"——价格常常被当成品质的代名词。但红酒的"好喝"极度主观，贵和合你口味之间，往往隔着一条不小的沟。'},
            {'type':'h2','text':'💸 贵酒的钱花在哪了'},
            {'type':'p','text':'高价来自稀缺性、名庄声誉、陈年成本、评分炒作，而不全是"口感更好"。一瓶2000元的列级庄，可能复杂有余、亲和力不足，新手喝着反而觉得"又酸又涩"。'},
            {'type':'h2','text':'📊 价格与好喝的关系'},
            {'type':'table','headers':['价位','典型体验','适合谁'],
            'rows':[
                ['50-150','果味直接、简单易饮','日常佐餐、新手'],
                ['150-500','有结构、有层次','进阶爱好者'],
                ['500-2000','复杂、需细品','资深饮家'],
                ['2000+','名庄/陈年，风土表达','收藏、特殊场合'],
            ]},
            {'type':'h2','text':'🙅 价格陷阱'},
            {'type':'list','items':[
                '🏷️ 礼盒装虚高：包装成本算进酒价',
                '⭐ 盲目追高分：评分高≠对你胃口',
                '🇫🇷 产区溢价：为"法国/波尔多"名头买单',
                '📈 炒作酒：网红款价格虚高',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'好喝是唯一标准，而好喝由你的舌头定义，不由价签定义。一瓶200块的果味黑皮诺，可能比2000块的严肃波尔多更让你想再倒一杯——那它就是对你而言"更好喝"的酒。'},
            {'type':'tip','text':'💡 建立自己的"价格甜蜜点"：在100-300元区间多尝试不同品种产区，找到最对胃口的类型，比盲目追贵有效得多。'},
            {'type':'sep','text':''},
            {'type':'p','text':'贵酒值得尊重，但不必迷信。让舌头做主，而不是让钱包替你尝味。'},
            {'type':'end','text':'— 你喝过最值/最坑的一瓶是多少钱？评论区晒 —'},
        ]
    )

    build_article('myth_health', title='🩺 红酒能保健治病？适量是前提，神化是误区',
        digest='少量红酒的抗氧化成分确有研究支持，但绝不等于"喝酒养生"。过量反而伤肝致癌，别拿研究当贪杯借口。',
        category='wine-myth', tags=['健康','保健','误区','适量','科普'], seq='09',
        content_blocks=[
            {'type':'title','text':'🩺 红酒能保健治病？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第9期'},
            {'type':'p','text':'"每天一杯红酒护心养颜"——这句话有研究影子，但被严重神化。把红酒当保健品，是危险又常见的误区。'},
            {'type':'h2','text':'🔬 研究说了什么'},
            {'type':'p','text':'红酒含白藜芦醇、多酚等抗氧化物质，部分观察性研究提示"适量饮酒"与心血管风险略降相关。但注意：这是"相关性"，不是"因果"，且获益阈值极低。'},
            {'type':'h2','text':'⚠️ 被忽略的另一面'},
            {'type':'table','headers':['事实','说明'],
            'rows':[
                ['世界卫生组织','将酒精列为1类致癌物'],
                ['过量饮酒','伤肝、升血压、增多种癌风险'],
                ['孕妇/服药者','应零酒精'],
                ['"养生剂量"','远低于多数人以为的量'],
            ]},
            {'type':'h2','text':'❌ 常见神化话术'},
            {'type':'list','items':[
                '🍷 "每天一杯软化血管"——证据薄弱，且可用运动替代',
                '🍇 "白藜芦醇抗衰老"——实验剂量远超一杯酒的含量',
                '😴 "红酒助眠"——酒精破坏睡眠结构',
                '💊 "红酒当药吃"——本末倒置',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'如果本就不喝酒，绝不要为了"保健"开始喝。如果喝，把它当享受而非药方——适量（男性每日≤2杯、女性≤1杯）是底线，超量所有"好处"都被风险淹没。'},
            {'type':'tip','text':'💡 想获得多酚抗氧化？吃葡萄、蓝莓、坚果同样可行，且零酒精风险。红酒的保健光环，远没有营销说得那么亮。'},
            {'type':'sep','text':''},
            {'type':'p','text':'红酒是生活的点缀，不是健康的保险。理性对待那一点点研究益处，别让它成为贪杯的借口。'},
            {'type':'end','text':'— 你怎么看"红酒养生"？评论区理性讨论 —'},
        ]
    )

    build_article('myth_corkgrade', title='🍾 橡木塞比螺旋盖高级？封装方式不等于等级',
        digest='软木塞有传统仪式感，但旋盖在保鲜稳定性上更胜一筹。用封口方式评判酒的高低，是典型的外行判断。',
        category='wine-myth', tags=['软木塞','螺旋盖','误区','封装','等级'], seq='10',
        content_blocks=[
            {'type':'title','text':'🍾 橡木塞比螺旋盖高级？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第10期'},
            {'type':'p','text':'这期是第5期"螺旋盖"的延伸版：很多人不仅觉得螺旋盖=低端，还反过来认为"橡木塞=高级"。两种判断，其实都掉进了同一个坑——用封口方式给酒分等级。'},
            {'type':'h2','text':'🪵 橡木塞为什么被神化'},
            {'type':'p','text':'软木塞有上千年的历史，开瓶的"啵"声、闻塞的习惯、陈年传统都让它自带仪式感。旧世界名庄长期沿用，更强化了"好酒用软木"的心理暗示。'},
            {'type':'h2','text':'🔧 但封装只是技术选择'},
            {'type':'table','headers':['考量','橡木塞','螺旋盖'],
            'rows':[
                ['传统/仪式感','强','弱'],
                ['保鲜一致性','有波动','极强'],
                ['陈年适配','传统认为更优','中短期更稳'],
                ['适用酒款','旧世界/名庄','新世界/日常+部分名庄'],
            ]},
            {'type':'h2','text':'🚩 关键认知'},
            {'type':'p','text':'越来越多顶级酒庄（尤其澳洲、新西兰，乃至部分勃艮第新锐）主动选用螺旋盖，恰恰是对品质负责——他们不想要任何一瓶因木塞污染而报废。'},
            {'type':'list','items':[
                '🏆 用螺旋盖的，可能是严谨的名庄',
                '🪵 用软木塞的，也可能只是贴牌餐酒',
                '🔑 决定等级的是酒本身，不是那块塞子',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'把"橡木塞=高级"翻过来，同样不成立。封装是手段不是标签。真正分高低的，永远是杯中的酒——产区、年份、酿造，而不是你怎么把它打开。'},
            {'type':'tip','text':'💡 买酒时直接忽略封口方式，把注意力放在酒标信息和你的真实品尝上。这一条，能帮你省掉大量被"仪式感"收割的溢价。'},
            {'type':'sep','text':''},
            {'type':'p','text':'无论是"啵"地一声拔开，还是一拧即开，好酒的好，从来不在那声闷响里。'},
            {'type':'end','text':'— 你更享受拔塞还是拧盖？评论区聊聊 —'},
        ]
    )

    build_article('myth_label', title='🏷️ 酒标越华丽酒越好？漂亮的包装不等于好酒',
        digest='华丽礼盒、金色浮雕、法文酒标，这些包装手段常被用来给低价酒"抬咖"。真正的品质藏在酒标信息里，而不是图案上。',
        category='wine-myth', tags=['酒标','包装','误区','选购','避坑'], seq='11',
        content_blocks=[
            {'type':'title','text':'🏷️ 酒标越华丽酒越好？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第11期'},
            {'type':'p','text':'货架上金色浮雕礼盒装的酒，和旁边朴素小瓶，你会选哪个？很多人下意识选包装漂亮的——毕竟"看着贵"。但包装和酒质，往往是两回事。'},
            {'type':'h2','text':'🎭 包装的"障眼法"'},
            {'type':'p','text':'酒的包装成本：一个浮雕木盒¥10-30，一个绒布内衬礼盒¥20-50，再配上手提袋，包装成本可能已经超过了瓶中酒本身的价值。'},
            {'type':'h2','text':'📊 包装 vs 酒质的真实关系'},
            {'type':'table','headers':['包装类型','真实含义','警惕信号'],
            'rows':[
                ['华丽木盒/礼盒','提升送礼仪式感','酒本身可能只是入门餐酒'],
                ['金色浮雕/烫金','营销包装，吸引眼球','酒质与包装不成正比'],
                ['法文密集酒标','营造"进口高级"感','可能是贴牌或灌装酒'],
                ['简洁小瓶/无盒','酒庄注重酒本身','往往是精品小众酒'],
            ]},
            {'type':'h2','text':'🔍 酒标上该看什么信息'},
            {'type':'list','items':[
                '📍 产区：具体到村庄/地块比"法国进口"更有价值',
                '🏰 酒庄名：搜索酒庄口碑比看图案有用',
                '🍇 品种：知道喝的是什么葡萄比知道图案是什么重要',
                '📅 年份：新鲜还是陈年，一眼可判',
                '🏷️ 等级：AOC/AOP/DOCG等法定等级是底线保障',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'真正的好酒庄，往往把预算花在酿酒上而不是包装上。那些酒标简洁但产区、酒庄信息清晰的酒，反而更可能是有底蕴的好酒。'},
            {'type':'tip','text':'💡 一个判断技巧：包装成本超过酒本身价值的酒，酒质通常不会太高。¥100以内的酒，有盒子的往往没盒子的好喝。'},
            {'type':'sep','text':''},
            {'type':'p','text':'酒是喝的，不是看的。下次面对华丽礼盒时，先看一眼盒子里那瓶酒的产区和酒庄——答案可能让你惊喜，也可能让你放下它。'},
            {'type':'end','text':'— 你买过最"华而不实"的酒是哪瓶？评论区吐槽 —'},
        ]
    )
