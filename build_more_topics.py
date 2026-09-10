import os, json

CONFIG_CODE = "require('./config')"
DATE = '20260616'

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

def build_article(name, title, digest, category, tags, content_blocks):
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

    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
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

    # ======================== 风格与类型 ========================

    build_article('orange_wine', title='🍊 橙酒入门：被误解的"橙色浪漫"',
        digest='橙酒不是橙子酿的酒！它是带皮发酵的白葡萄酒，古老又时髦。从格鲁吉亚陶罐到自然酒圈宠儿，一篇读懂橙酒。',
        category='wine-style', tags=['橙酒','Orange Wine','自然酒','带皮发酵','格鲁吉亚','陶罐','小众葡萄酒'],
        content_blocks=[
            {'type':'title','text':'🍊 橙酒入门'},
            {'type':'subtitle','text':'被误解的橙色浪漫 | 古老酿造法的现代复兴'},
            {'type':'p','text':'橙酒（Orange Wine）是近年来葡萄酒圈最热门的话题之一。但很多人第一次听到"橙酒"都会疑惑：是用橙子酿的酒吗？答案是否定的。'},
            {'type':'p','text':'橙酒本质上是一种"带皮发酵的白葡萄酒"。传统白葡萄酒在压榨后会立刻将葡萄皮和籽分离，而橙酒则让白葡萄汁与皮、籽一起浸渍发酵数周甚至数月。葡萄皮中的色素和单宁溶入酒液，赋予酒液独特的橙黄色泽和质感。'},
            {'type':'h2','text':'🏺 起源：6000年的古法'},
            {'type':'p','text':'橙酒绝非新发明。它的酿造方法可以追溯到6000年前的格鲁吉亚，当地人用埋在地下的大陶罐（Qvevri）发酵葡萄，连皮带籽一起，这与橙酒的原理完全一致。现代橙酒的复兴始于20世纪90年代斯洛文尼亚的酿酒师，随后在意大利、法国自然酒圈掀起热潮。'},
            {'type':'h2','text':'🍷 橙酒的风味特征'},
            {'type':'table','headers':['特征','表现'],
            'rows':[
                ['颜色','琥珀色、橙黄色、铜色，而非传统白酒的浅黄'],
                ['口感','单宁感明显（来自果皮），比白葡萄酒更"有嚼劲"'],
                ['香气','橙皮、杏干、坚果、蜂蜜、红茶、香料'],
                ['酸度','通常偏高，结构感强'],
                ['侍酒温度','略高于白葡萄酒，10-12°C最佳'],
            ]},
            {'type':'h2','text':'🆚 橙酒 vs 白葡萄酒 vs 红葡萄酒'},
            {'type':'p','text':'橙酒可以理解为"白葡萄做的红酒"——它拥有白葡萄酒的果香和品种特色，却具备红葡萄酒的单宁结构和陈年潜力。这种跨界特质让它在餐酒搭配上极具灵活性。'},
            {'type':'h2','text':'🌍 主要产区'},
            {'type':'list','items':[
                '🇬🇪 格鲁吉亚：陶罐（Qvevri）橙酒的发源地，风格最原始',
                '🇮🇹 意大利弗留利：现代橙酒运动的核心，酒庄密集',
                '🇸🇮 斯洛文尼亚：橙色革命发源地，Josko Gravner是先驱',
                '🇫🇷 法国卢瓦尔、汝拉：自然酒酿酒师的实验场',
                '🇺🇸 美国俄勒冈、加州：新世界橙酒新势力',
            ]},
            {'type':'h2','text':'🍽️ 配餐建议'},
            {'type':'p','text':'橙酒的单宁和氧化风味让它成为"最难配餐的酒"和"最美味的配餐酒"的双重存在。它特别适合搭配传统白葡萄酒hold不住、红葡萄酒又太重的食物：'},
            {'type':'list','items':[
                '🧀 发酵奶酪、蓝纹奶酪——橙酒的氧化风味与奶酪是绝配',
                '🥘 印度咖喱、中东香料菜——单宁与香料互相成就',
                '🐟 油浸罐头鱼（沙丁鱼、凤尾鱼）——咸鲜与单宁碰撞',
                '🥗 朝鲜蓟——传统白葡萄酒的克星，橙酒却游刃有余',
                '🍜 中餐：醉鸡、卤味、凉拌菜都能搭',
            ]},
            {'type':'tip','text':'💡 入门建议：橙酒风味独特，初次尝试可能不习惯。建议从意大利弗留利的现代风格（果味更明显、单宁更柔和）入手，而不是一上来就挑战格鲁吉亚重陶罐风格的"重口味"橙酒。预算¥150-300即可买到不错的入门款。'},
            {'type':'sep','text':''},
            {'type':'p','text':'橙酒代表了一种回归自然的酿酒哲学——少干预、少添加、顺其自然。它不是适合所有人的酒，但对于追求个性和探索精神的饮者来说，橙酒打开了一扇通往葡萄酒另一维度的大门。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('sparkling_guide', title='🥂 起泡酒全指南：不止香槟的欢庆之选',
        digest='香槟、普罗塞克、卡瓦、克雷芒、塞克特……起泡酒世界远比你想象的丰富。气泡从哪来？怎么选才不踩坑？',
        category='wine-style', tags=['起泡酒','香槟','普罗塞克','卡瓦','克雷芒','气泡酒','庆祝'],
        content_blocks=[
            {'type':'title','text':'🥂 起泡酒全指南'},
            {'type':'subtitle','text':'不止香槟的欢庆之选 | 气泡背后的秘密'},
            {'type':'p','text':'提起起泡酒，大多数人第一反应就是香槟。但香槟只是起泡酒的冰山一角。从意大利的普罗塞克到西班牙的卡瓦，从法国的克雷芒到德国的塞克特，起泡酒的世界精彩纷呈。'},
            {'type':'h2','text':'🫧 气泡从哪来？'},
            {'type':'p','text':'起泡酒的气泡来自二次发酵产生的二氧化碳。主要有三种方法：传统法（香槟法）成本最高、气泡最细腻；罐式法（夏尔马法）成本低、果味清新；自然起泡法（ Ancestral）最原始。'},
            {'type':'h2','text':'🌍 主要起泡酒类型'},
            {'type':'table','headers':['名称','产地','方法','特点','价位'],
            'rows':[
                ['香槟 Champagne','法国香槟区','传统法','复杂酵母香、细腻气泡','高（¥300+）'],
                ['卡瓦 Cava','西班牙','传统法','性价比高、偏干型','低（¥80-200）'],
                ['普罗塞克 Prosecco','意大利','罐式法','果味清新、甜美易饮','低（¥80-200）'],
                ['克雷芒 Crémant','法国其他产区','传统法','香槟平替、品质好','中（¥120-300）'],
                ['塞克特 Sekt','德国/奥地利','混合','清爽高酸、风格多样','低-中'],
                ['阿斯蒂 Asti','意大利','罐式法','低酒精甜型、花香','低（¥80-150）'],
                ['Franciacorta','意大利','传统法','意大利香槟、高品质','中-高'],
            ]},
            {'type':'h2','text':'🍬 甜度分级'},
            {'type':'p','text':'起泡酒的甜度从干到甜有明确分级（以香槟为例）：天然干（Brut Nature，0-3g/L）、超天然（Extra Brut）、天然（Brut，最经典）、极干（Extra Dry）、干（Sec）、半干（Demi-Sec）、甜（Doux）。日常佐餐推荐Brut级别。'},
            {'type':'h2','text':'🥂 如何选择？'},
            {'type':'list','items':[
                '🎉 纯庆祝、不配餐 → 香槟Brut或卡瓦，仪式感拉满',
                '🍓 新手入门、喜欢果味 → 普罗塞克，甜美好喝零门槛',
                '💰 预算有限又要品质 → 法国克雷芒，香槟工艺平替',
                '🍽️ 配餐（海鲜、炸物）→ 香槟Blanc de Blancs或夏布利起泡',
                '🍰 配甜品 → 半干香槟或阿斯蒂',
            ]},
            {'type':'tip','text':'💡 常见误区：只有香槟区产的起泡酒才能叫香槟！其他地区用同样工艺生产的只能叫"传统法起泡酒"。买香槟认准酒标上的"Champagne"字样，而不是看瓶子形状。'},
            {'type':'h2','text':'🎯 开瓶与侍酒'},
            {'type':'p','text':'起泡酒最佳侍酒温度6-8°C。开瓶时切勿对着人，缓慢旋转瓶身让木塞自然弹出。倒酒时先倒1/3，等气泡稳定后再续杯，避免溢出。用 flute 细长杯能聚香，用 tulip 郁金香杯更利于香气展开。'},
            {'type':'sep','text':''},
            {'type':'p','text':'起泡酒是葡萄酒世界里最"民主"的一类——它既能是几百块的庆典之王，也能是几十块的日常小确幸。别被香槟的光环吓到，找到适合自己口味和预算的那一瓶，才是真正的快乐。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('sweet_wines', title='🍯 甜酒图鉴：贵腐、冰酒与波特的天堂指南',
        digest='甜葡萄酒不是"糖水"！贵腐菌、冰葡萄、加强酒精——三种截然不同的甜，三种截然不同的美。甜酒爱好者必读。',
        category='wine-style', tags=['甜酒','贵腐','冰酒','波特','托卡伊','迟摘','甜型葡萄酒'],
        content_blocks=[
            {'type':'title','text':'🍯 甜酒图鉴'},
            {'type':'subtitle','text':'贵腐、冰酒与波特的天堂指南 | 甜不是原罪'},
            {'type':'p','text':'很多初学者误以为甜葡萄酒是"低端糖水"，这其实是大错特错。世界上最贵、最稀有、最值得收藏的葡萄酒中，甜酒占了相当比例。'},
            {'type':'p','text':'甜葡萄酒的甜来自"浓缩的糖分"——通过不同方式让葡萄积累远超发酵所需的糖，再在酵母无法全部转化时停止发酵，保留残糖。三种主流工艺各具魅力。'},
            {'type':'h2','text':'🍄 贵腐甜酒（Noble Rot）'},
            {'type':'p','text':'贵腐菌（Botrytis cinerea）是一种真菌，在特定的晨雾+午后阳光环境下感染葡萄，刺破果皮让水分蒸发，浓缩糖分和风味。这种"被真菌宠幸"的葡萄酿出的酒带有蜂蜜、杏脯、柑橘酱的复杂香气。'},
            {'type':'table','headers':['代表酒款','产地','特点'],
            'rows':[
                ['苏玳 Sauternes','法国波尔多','贵腐之王，贵腐菌+赛美蓉/长相思'],
                ['托卡伊 Tokaji Aszú','匈牙利','"王者之酒"，贵腐+福尔民特'],
                ['逐粒精选 TBA','德国/奥地利','Beerenauslese级别，极稀有'],
                ['贵腐甜白','世界各国','如法国阿尔萨斯、卢瓦尔'],
            ]},
            {'type':'h2','text':'❄️ 冰酒（Ice Wine / Eiswein）'},
            {'type':'p','text':'冰酒要求葡萄在-7°C以下的自然冰冻状态下采摘和压榨，冰晶留下、浓缩的果汁流出，得到极高糖度和酸度的酒液。加拿大、德国、奥地利是主要产区。'},
            {'type':'list','items':[
                '🇨🇦 加拿大冰酒：全球最大产量，威代尔（Vidal）为主',
                '🇩🇪 德国/奥地利 Eiswein：雷司令冰酒，高贵优雅',
                '🌡️ 关键：必须是自然冰冻，人工冷冻不合法（欧盟）',
            ]},
            {'type':'h2','text':'🥃 加强甜酒（Fortified）'},
            {'type':'p','text':'在发酵过程中加入葡萄蒸馏酒（白兰地）中止发酵，既保留糖分又提高酒精度。波特、雪莉、马德拉是三大加强酒，其中甜型波特最适合作为甜酒饮用。'},
            {'type':'table','headers':['类型','产地','风格'],
            'rows':[
                ['红宝石/晚装瓶波特','葡萄牙','果味年轻、甜美易饮'],
                ['茶色波特 Tawny','葡萄牙','氧化风格、坚果焦糖'],
                ['年份波特 Vintage','葡萄牙','顶级收藏、单宁强劲'],
                ['PX雪莉','西班牙','极甜、葡萄干蜜饯味'],
            ]},
            {'type':'h2','text':'🍽️ 甜酒配餐'},
            {'type':'list','items':[
                '🍰 蓝纹奶酪 + 贵腐甜酒 = 经典"咸甜配"',
                '🥧 水果挞、柠檬派 + 冰酒 = 清新收尾',
                '🍫 黑巧克力 + 年份波特 = 力量对力量',
                '🥧 焦糖布丁 + 茶色波特 = 温暖满足',
                '🌶️ 川湘辣菜 + 半甜酒 = 甜解辣',
            ]},
            {'type':'tip','text':'💡 甜酒侍酒：温度很低（6-8°C），用量杯（50ml左右），用小甜酒杯。甜酒糖分高易腻，少量慢饮才是正道。贵腐和冰酒开后冷藏可保存数天，波特因高酒精更易保存。'},
            {'type':'sep','text':''},
            {'type':'p','text':'甜酒是葡萄酒金字塔尖的明珠。它不代表"简单"或"低端"，而是代表了酿酒师与自然博弈的最高技艺——把"腐烂""冰冻""中断"这些看似负面的元素，转化为杯中极致的美味。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('old_vine', title='🌳 老藤之谜：为什么老藤葡萄酒更珍贵？',
        digest='"老藤"二字为何自带光环？根系更深、产量更低、风味更浓缩——但老藤真的更好喝吗？老藤葡萄酒完全指南。',
        category='wine-knowledge', tags=['老藤','Old Vine','低产量','根系','风土','珍贵葡萄酒','葡萄树龄'],
        content_blocks=[
            {'type':'title','text':'🌳 老藤之谜'},
            {'type':'subtitle','text':'为什么老藤葡萄酒更珍贵？ | 时间酿造的价值'},
            {'type':'p','text':'在葡萄酒酒标上，你常会看到"Old Vine"（老藤）、"Vielles Vignes"（老葡萄藤）、"Vieilles Vignes"等字样。它们不是法定等级，却自带一种光环。但老藤真的更好喝吗？'},
            {'type':'h2','text':'📏 多老才算"老藤"？'},
            {'type':'p','text':'这是一个没有统一标准的问题。一般来说：25-30年可称为老藤，50年以上是公认的老藤，100年以上的"百年老藤"则极为稀有。'}
,            {'type':'p','text':'南非的"老藤项目"（Old Vine Project）提出35年作为认证门槛，是目前较权威的民间标准。但法律层面，各国都没有强制规定，所以"老藤"字样更多靠酒庄自律。'},
            {'type':'h2','text':'🌱 老藤为什么珍贵？'},
            {'type':'table','headers':['特征','年轻藤（<10年）','老藤（>50年）'],
            'rows':[
                ['根系深度','浅，表层吸收','深达数米，吸收矿物'],
                ['产量','高（2-3倍）','低（浓缩风味）'],
                ['风味','直接、果味为主','复杂、集中、矿物感'],
                ['稳定性','易受年份影响','更稳，抗旱抗灾'],
                ['单宁/结构','较轻','更紧实有层次'],
            ]},
            {'type':'h2','text':'🧬 老藤的"浓缩效应"'},
            {'type':'p','text':'老藤产量低的原因是其活力下降、光合作用产物少。但正因如此，有限的养分集中输送给少量果实，风味物质和糖分高度浓缩。同时，深根系让老藤能触及年轻藤够不到的地下水层和矿物质，带来独特的"风土印记"。'},
            {'type':'h2','text':'🌍 著名老藤产区'},
            {'type':'list','items':[
                '🇦🇺 澳大利亚巴罗萨谷：拥有世界上最古老的西拉老藤（1860年代种）',
                '🇿🇦 南非老藤项目：白诗南、神索等百年老藤',
                '🇪🇸 西班牙普里奥拉托：百年歌海娜老藤，成就顶级酒',
                '🇫🇷 法国朗格多克：很多被遗忘的古老佳丽酿藤',
                '🇺🇸 加州老藤仙粉黛：19世纪末的遗产',
            ]},
            {'type':'h2','text':'⚠️ 老藤不等于绝对好'},
            {'type':'p','text':'需要澄清的是：老藤是一个加分项，而非品质保证。一棵老藤如果管理不当、藤龄虽老但活力紊乱，酒质也可能平庸。真正的好酒是老藤+好风土+好酿酒师的三重叠加。'},
            {'type':'tip','text':'💡 选购建议：看到"Old Vine"标签不必盲目加价，先看产区——巴罗萨老藤西拉、普里奥拉托老藤歌海娜、南非老藤白诗南，这些才是公认的高性价比老藤之选。年轻产区的"老藤"营销噱头需警惕。'},
            {'type':'sep','text':''},
            {'type':'p','text':'老藤葡萄酒喝的是时间。每一瓶都凝聚着几十年风风雨雨里葡萄藤与土地的对话。当你品尝老藤的复杂层次时，你其实是在品尝一段被封存在酒液里的岁月。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('organic_bio_natural', title='🌿 有机、生物动力与自然酒：三者到底差在哪？',
        digest='酒标上的"有机""生物动力法""自然酒"让人眼花缭乱。它们是一回事吗？谁更健康？谁更好喝？一篇厘清三大概念。',
        category='wine-knowledge', tags=['有机','生物动力法','自然酒','Biodynamic','可持续','健康葡萄酒','认证'],
        content_blocks=[
            {'type':'title','text':'🌿 有机、生物动力与自然酒'},
            {'type':'subtitle','text':'三者到底差在哪？ | 从田间到酒窖的三种哲学'},
            {'type':'p','text':'走进葡萄酒专卖店，你一定见过"有机葡萄酒""生物动力法葡萄酒""自然酒"这些标签。它们听起来都很"绿色健康"，但实际上是三个完全不同的概念，覆盖从葡萄种植到酿造的不同环节。'},
            {'type':'h2','text':'🟢 有机葡萄酒（Organic）'},
            {'type':'p','text':'有机关注"种植环节"：禁止使用人工合成农药、化肥、除草剂，改用天然堆肥和生物防治。欧盟、美国、中国都有有机认证。注意：有机认证只管种植，对酿造（是否加硫）没有严格要求。'},
            {'type':'h2','text':'🌙 生物动力法（Biodynamic）'},
            {'type':'p','text':'生物动力法由奥地利哲学家鲁道夫·斯坦纳在1924年提出，是有机的"升级+玄学"版。除了有机要求外，还强调：'},
            {'type':'list','items':[
                '🌟 把葡萄园视为一个完整"有机生命体"，自给自足',
                '🌙 按日月星辰的宇宙节律安排耕作、采摘（生物动力日历）',
                '🦌 使用特殊的"牛角粪制剂"（Horn Manure）等九种制剂',
                '📜 德米特（Demeter）是最权威的生物动力认证',
            ]},
            {'type':'h2','text':'🍇 自然酒（Natural Wine）'},
            {'type':'p','text':'自然酒关注"酿造环节"：minimal intervention（最少干预）。它通常要求有机种植，但核心在于酿造时不加酵母、不加糖、极少或不加硫、不滤过。结果往往风格野性、不稳定、有"农艺味"。'},
            {'type':'h2','text':'🆚 三者对比'},
            {'type':'table','headers':['维度','有机','生物动力','自然酒'],
            'rows':[
                ['关注环节','种植','种植+理念','酿造'],
                ['认证','有（各国）','Demeter等','无统一认证'],
                ['化学农药','禁止','禁止','禁止（通常有机）'],
                ['添加硫','允许','允许（少）','极少/不添加'],
                ['加酵母','允许','允许','禁止（野生酵母）'],
                ['风格','接近常规','接近常规','野性、不稳定'],
            ]},
            {'type':'h2','text':'❓ 谁更健康？谁更好喝？'},
            {'type':'p','text':'健康角度：三者都减少化学残留，但"自然酒"因不加硫，对亚硫酸盐敏感者反而可能更友好（不过也可能是雷区）。好喝角度：有机和生物动力法酒通常更稳定、更易饮；自然酒则是"高风险高回报"，可能惊艳也可能"翻车"。'},
            {'type':'tip','text':'💡 给新手的建议：想尝试绿色葡萄酒，从"有机"入门最稳妥；想体验哲学与风土，选"生物动力法"名庄（如勃艮第乐桦Leroy）；想追求个性与冒险，再尝试"自然酒"，并选择有口碑的自然酒酒商降低踩雷率。'},
            {'type':'sep','text':''},
            {'type':'p','text':'这三种理念代表了葡萄酒从"工业品"回归"农产品"的趋势。无论你认同哪种哲学，背后都是酿酒师对土地和自然的尊重——这本身就是一杯好酒的重要底色。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('wine_scores', title='📊 葡萄酒评分真相：RP、JS说了算吗？',
        digest='罗伯特·帕克100分制如何影响全球酒价？高分酒一定好喝吗？评分体系背后的商业逻辑与避坑指南。',
        category='wine-knowledge', tags=['评分','罗伯特帕克','RP','詹姆斯萨克林','JS','葡萄酒倡导家','避坑'],
        content_blocks=[
            {'type':'title','text':'📊 葡萄酒评分真相'},
            {'type':'subtitle','text':'RP、JS说了算吗？ | 分数背后的真相'},
            {'type':'p','text':'当你选购葡萄酒时，是否会被酒标或电商页面上的"RP 95""JS 98"所吸引？这些分数确实能简化选择，但它们真的代表你的口味吗？'},
            {'type':'h2','text':'🏆 主要评分体系'},
            {'type':'table','headers':['评分人/机构','体系','风格倾向'],
            'rows':[
                ['罗伯特·帕克 RP','100分制','重酒体、浓果味、高酒精（曾主导波尔多）'],
                ['葡萄酒倡导家 WA','100分制','帕克创办，团队评分'],
                ['詹姆斯·萨克林 JS','100分制','偏好宏大、果味奔放的酒'],
                ['葡萄酒观察家 WS','100分制','综合评分+年度百强'],
                ['酒评家 Jancis Robinson','20分制','偏优雅、欧洲传统风格'],
                ['Decanter','20分制+五星','英国媒体视角的全面评价'],
            ]},
            {'type':'h2','text':'💥 帕克效应'},
            {'type':'p','text':'罗伯特·帕克在1982年波尔多期酒评级中一鸣惊人，此后他的分数直接影响酒庄定价。一瓶酒从"RP 89"升到"RP 90"，价格可能跳涨30%。这种"帕克效应"让全世界酿酒师一度趋同于酿造他喜欢的"大酒"风格。'},
            {'type':'h2','text':'⚠️ 评分的局限'},
            {'type':'list','items':[
                '👤 个人偏好：评论家口味≠你的口味，喜欢轻盈酒的人可能被高分"重酒"劝退',
                '📈 通胀现象：如今95分已成常态，100分不再稀缺',
                '💰 商业绑定：高分常与涨价同步，未必等值',
                '🍷 适饮期：评分多针对"巅峰状态"，年轻时不代表当下好喝',
                '🌍 风格趋同：为迎合评分，部分酒庄丧失个性',
            ]},
            {'type':'h2','text':'🎯 如何聪明地使用评分？'},
            {'type':'p','text':'评分是工具而非圣经。建议：找一位与你口味相近的评论家长期关注；把分数当"筛选器"而非"判决书"；结合产区、品种、年份综合判断；最重要的是——自己的舌头才是最终的裁判。'},
            {'type':'tip','text':'💡 实用策略：如果你是新手，参考评分能快速避开明显的差酒（85分以下慎选）；但当你有了一定经验，就该学会"背叛"分数，去探索那些评论家可能低估的、风格独特的小众酒款。'},
            {'type':'sep','text':''},
            {'type':'p','text':'分数可以帮你打开一扇门，但不能替你走完一段路。真正的好酒，是那个让你忍不住再倒一杯、忘记去查分数的酒。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('climate_wine', title='🌡️ 葡萄酒与气候变暖：产区正在北移',
        digest='全球变暖正在改写葡萄酒地图。英国开始酿香槟，加拿大冰酒受威胁，传统产区面临生死考验。气候如何重塑杯中世界？',
        category='wine-knowledge', tags=['气候变暖','气候变化','产区北移','英国起泡酒','早熟','可持续','未来'],
        content_blocks=[
            {'type':'title','text':'🌡️ 葡萄酒与气候变暖'},
            {'type':'subtitle','text':'产区正在北移 | 气候如何重塑杯中世界'},
            {'type':'p','text':'葡萄酒是"气候的日记"——葡萄对温度变化极其敏感，全球变暖正在以前所未有的速度改写这张写了几千年的葡萄酒地图。'},
            {'type':'h2','text':'🗺️ 产区北移（或上移）'},
            {'type':'p','text':'传统顶级产区多位于葡萄种植的"边缘地带"（气候凉爽，才能保持酸度与平衡）。气候变暖让这些产区变得过热，却让原本太冷的地区焕发新生：'},
            {'type':'table','headers':['变化','表现'],
            'rows':[
                ['英国南部','气候变暖使英国成功酿造"英式香槟"，品质惊艳'],
                ['加拿大','气温上升威胁冰酒所需的自然冰冻条件'],
                ['香槟/勃艮第','采收期提前2-3周，酸度下降风险'],
                ['高山/高纬产区','德国、奥地利、 Tasmania 潜力上升'],
                ['温暖产区','西班牙、澳大利亚面临极端高温与干旱'],
            ]},
            {'type':'h2','text':'🌡️ 具体冲击'},
            {'type':'list','items':[
                '📅 采收提前：全球葡萄酒采收期比30年前平均提前约2周',
                '🍷 酒精度上升：更成熟的葡萄=更高糖度=更高酒精（常见14.5%+）',
                '⚖️ 失去平衡：酸度下降、果味过熟，优雅感受损',
                '🏜️ 极端天气：霜冻、冰雹、干旱、森林火灾频次增加',
                '🍇 品种迁移：黑皮诺北移，耐热品种（如歌海娜）更受青睐',
            ]},
            {'type':'h2','text':'🛡️ 行业的应对'},
            {'type':'p','text':'酿酒师并非坐以待毙。他们通过提早采收、选择抗性砧木、混种耐热的本地品种、向高海拔迁移葡萄园等方式积极应对。一些前瞻酒庄甚至开始在挪威、丹麦等"新边疆"试种葡萄。'},
            {'type':'tip','text':'💡 给消费者的启示：关注"凉爽产区"的崛起——英国起泡酒、德国传统产区的红葡萄酒、高海拔的阿根廷萨尔塔，这些因气候变暖而受益的产区，往往性价比突出且风格清新，是未来十年的宝藏。'},
            {'type':'sep','text':''},
            {'type':'p','text':'气候变暖是葡萄酒界最严肃的议题之一。它提醒我们：每一杯酒都依赖于微妙而脆弱的生态平衡。珍惜杯中物，也是珍惜我们共同的地球。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('women_winemakers', title='👩‍🌾 女性酿酒师：被忽视的葡萄酒力量',
        digest='从勃艮第的拉露·比兹到加州传奇，女性在葡萄酒世界的贡献长期被低估。如今她们正重新定义"风土"二字。',
        category='wine-culture', tags=['女性酿酒师','拉露比兹','勃艮第','Leroy','性别','行业','传奇'],
        content_blocks=[
            {'type':'title','text':'👩‍🌾 女性酿酒师'},
            {'type':'subtitle','text':'被忽视的葡萄酒力量 | 她们重新定义风土'},
            {'type':'p','text':'葡萄酒世界长期由男性主导叙事，但女性的身影从一开始就不可或缺。从19世纪独自撑起酒庄的寡妇，到当代改变行业格局的传奇酿酒师，她们的贡献长期被低估。'},
            {'type':'h2','text':'👑 传奇人物'},
            {'type':'table','headers':['人物','产区','贡献'],
            'rows':[
                ['拉露·比兹-勒桦','勃艮第','Leroy庄主，生物动力法先驱，缔造传奇车库酒'],
                ['巴罗洛姐妹','意大利','应对根瘤蚜危机，奠定巴罗洛现代格局'],
                ['海伦·特利','加州','"纳帕谷第一夫人"，霞多丽酿造标杆'],
                ['安·克劳德·勒弗莱','勃艮第','_domaine Leflaive，白葡萄酒女王'],
                [' Sarah Morphew Stephen','纳帕','Sparkling酒 pioneer'],
            ]},
            {'type':'h2','text':'🌸 女性酿酒的"风格标签"？'},
            {'type':'p','text':'是否存在"女性风格"？这是一个有争议的话题。一些评论家认为女性酿酒师更倾向于优雅、细腻、强调风土而非力量。但更多声音指出：优秀酿酒师首先是"好酿酒师"，性别不应成为风味的标签。'},
            {'type':'h2','text':'📈 正在改变的行业'},
            {'type':'p','text':'近二十年来，女性酿酒师比例显著上升。从酿酒学校到顶级酒庄，越来越多女性走上技术核心岗位。她们也推动了可持续种植、自然酒等更注重"长期主义"的酿酒理念。'},
            {'type':'list','items':[
                '🌍 新世界产区女性酿酒师比例更高、更受认可',
                '🍇 女性主导的酒庄在生物动力法、有机领域尤为活跃',
                '🤝 全球女性酿酒师社群（如"Women in Wine"）互助成长',
            ]},
            {'type':'tip','text':'💡 想探索女性酿酒师作品？可以从勃艮第Leroy（顶级）、Leflaive（白葡萄酒标杆）、美国Helen Turley的作品，以及澳洲、新西兰众多女性主导的新锐酒庄入手，往往能感受到与众不同的细腻表达。'},
            {'type':'sep','text':''},
            {'type':'p','text':'葡萄酒的故事里，女性从未缺席。她们用耐心、敏感与坚持，把土地的低语酿成了杯中的诗。下一个改变你味蕾的酒，或许就出自一位女性酿酒师之手。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('wine_music', title='🎵 葡萄酒与音乐：听什么就喝什么',
        digest='研究表明音乐能改变你对葡萄酒的感知！古典、爵士、电子——不同曲风竟能"调"出不同的酒。声音配酒指南。',
        category='wine-culture', tags=['音乐','葡萄酒','感官','搭配','古典','爵士','氛围','体验'],
        content_blocks=[
            {'type':'title','text':'🎵 葡萄酒与音乐'},
            {'type':'subtitle','text':'听什么就喝什么 | 声音如何"调味"杯中酒'},
            {'type':'p','text':'你相信吗？同一杯酒，配不同的背景音乐，喝起来竟然会不一样。这不是玄学——多项感官心理学研究证实：音乐能显著影响人对葡萄酒香气、单宁、酒体的感知。'},
            {'type':'h2','text':'🔬 科学怎么说'},
            {'type':'p','text':'英国心理学家 Charles Spence 等的研究发现：高音调、轻快的音乐让人觉得酒更轻盈、果味更突出；低沉、厚重的音乐则让人觉得酒体更饱满、单宁更强。音乐成了"看不见的调味料"。'},
            {'type':'h2','text':'🎼 音乐 × 葡萄酒 搭配表'},
            {'type':'table','headers':['音乐类型','适合酒款','原因'],
            'rows':[
                ['古典（弦乐四重奏）','黑皮诺、勃艮第','优雅细腻，互相成就'],
                ['爵士（钢琴/萨克斯）','霞多丽、雷司令','即兴与酸度共舞'],
                ['电子/浩室','起泡酒、桃红','节奏轻快，欢乐氛围'],
                ['摇滚/布鲁斯','西拉、赤霞珠','力量感匹配厚重的酒体'],
                ['民谣/原声','自然酒、橙酒','质朴呼应野性风格'],
                ['环境/冥想','甜酒、冰酒','宁静衬托甜美余韵'],
            ]},
            {'type':'h2','text':'🎧 品鉴场景建议'},
            {'type':'list','items':[
                '🕯️ 约会微醺：爵士 + 黑皮诺，浪漫指数翻倍',
                '🎉 派对开场：电子 + 起泡酒，气氛瞬间点燃',
                '📚 独处阅读：民谣 + 雷司令，安静而惬意',
                '🍷 严肃品鉴：古典 + 波尔多，专注风味细节',
            ]},
            {'type':'tip','text':'💡 实用玩法：下次朋友来家里喝酒，别只准备酒，也准备一份"酒单歌单"。把音乐作为配酒的一部分，你会发现同样的酒有了不同的层次——这是零成本提升品酒体验的妙招。'},
            {'type':'sep','text':''},
            {'type':'p','text':'葡萄酒是感官的艺术，而音乐是感官的翅膀。当杯中的酒遇上耳边的旋律，味觉便不再孤立——它们共同编织出一段属于你的、独一无二的饮酒时光。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )

    build_article('wine_movies', title='🎬 葡萄酒与电影：银幕上的杯中景',
        digest='从《杯酒人生》到《云中漫步》，电影如何把葡萄酒浪漫化？盘点那些因一部电影而爆红的酒，以及酒背后的故事。',
        category='wine-culture', tags=['电影','杯酒人生','葡萄酒','银幕','文化','Sideways','云中漫步'],
        content_blocks=[
            {'type':'title','text':'🎬 葡萄酒与电影'},
            {'type':'subtitle','text':'银幕上的杯中景 | 当酒成为主角'},
            {'type':'p','text':'葡萄酒与电影有着天然的契合——它象征着品味、浪漫、松弛与人生况味。许多经典电影用一杯酒讲尽了爱恨与岁月，也无意中改写了真实的葡萄酒市场。'},
            {'type':'h2','text':'🍷 改变市场的电影'},
            {'type':'table','headers':['电影','年份','对葡萄酒的影响'],
            'rows':[
                ['《杯酒人生》Sideways','2004','主角贬低梅洛、盛赞黑皮诺，导致美国梅洛销量下滑、黑皮诺暴涨'],
                ['《云中漫步》A Walk in the Clouds','1995','让纳帕谷成为爱情与美酒的代名词'],
                ['《美食总动员》Ratatouille','2007','强化"配餐即生活"的法式葡萄酒哲学'],
                ['《007》系列','多部','马丁尼"摇匀不要搅拌"成标志，香槟出境频繁'],
                ['《了不起的盖茨比》','2013','复古奢华，香槟与爵士时代画上等号'],
            ]},
            {'type':'h2','text':'🎭 电影里的"酒格"'},
            {'type':'p','text':'不同电影用不同的酒塑造人物与氛围：文艺片偏爱黑皮诺的敏感，黑帮片钟情威士忌与红葡萄酒的力量，浪漫喜剧用起泡酒点缀欢乐，悬疑片则让一杯红酒成为气氛的注脚。'},
            {'type':'h2','text':'📽️ 葡萄酒主题必看片单'},
            {'type':'list','items':[
                '🍇 《杯酒人生》——葡萄酒爱好者的"圣经"，笑中带泪',
                '🌿 《云中漫步》——纳帕谷的葡萄园爱情童话',
                '🇮🇹 《托斯卡纳艳阳下》——vineyard + 生活重建',
                '🍷 《酒业风云》Bottle Shock——1976巴黎审判的真实故事',
                '🇫🇷 《红侏儒》/ 法国乡村酒农题材纪录片',
            ]},
            {'type':'tip','text':'💡 观影配酒建议：看《杯酒人生》时开一瓶黑皮诺（致敬主角Miles）；看《云中漫步》配纳帕赤霞珠；看《007》当然要来杯马丁尼。让电影与杯中物互相注解，周末夜晚的顶级享受。'},
            {'type':'sep','text':''},
            {'type':'p','text':'电影把葡萄酒从"饮品"变成了"叙事"——它承载记忆、情绪与关系。下次举起酒杯时，或许你也会想起某部电影里的某个镜头：那一刻，酒不只是一杯酒，而是一段被放映过的人生。'},
            {'type':'end','text':'— 感谢阅读 —'},
        ]
    )
