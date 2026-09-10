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

# 封面配色：按栏目区分（视觉分类标签）
PALETTE = {
    'wine-myth':    {'bg1':'#1a1206','bg2':'#3a2407','accent':'#ffd54f','sub':'#e0c068','muted':'#9a8a5a','icon':'&#x2753;'},
    'wine-grape':   {'bg1':'#2a0a10','bg2':'#5a1220','accent':'#ff6b6b','sub':'#e88','muted':'#c99','icon':'&#x1f347;'},
    'wine-style':   {'bg1':'#0e1a2a','bg2':'#163a5a','accent':'#5bc0eb','sub':'#9bd','muted':'#9bd','icon':'&#x1f375;'},
    'wine-knowledge':{'bg1':'#1a1a2e','bg2':'#2e2e4a','accent':'#b388ff','sub':'#c9b6ff','muted':'#9a8ac9','icon':'&#x1f4da;'},
    'wine-culture': {'bg1':'#1a0a1e','bg2':'#3a1240','accent':'#ff8fcf','sub':'#f9c','muted':'#c9a','icon':'&#x1f3a8;'},
}
DEFAULT_PAL = {'bg1':'#1a1a2e','bg2':'#3a2e1a','accent':'#ffd54f','sub':'#e0c068','muted':'#9a8a5a','icon':'&#x1f377;'}

def build_cover(title, category, seq='01'):
    pal = PALETTE.get(category, DEFAULT_PAL)
    # 超大序号
    seq_txt = f'''<text x="80" y="250" fill="{pal['accent']}" font-size="190" font-family="Arial Black,Arial,sans-serif" font-weight="bold" opacity="0.22">{seq}</text>'''
    # 酒杯剪影（极简 path 水印，右侧）
    glass = f'''<g transform="translate(880,90) scale(1.1)" opacity="0.16" fill="{pal['accent']}">
<path d="M0,0 L70,0 L58,90 L46,90 L40,140 L30,140 L24,90 L12,90 Z"/>
<rect x="20" y="140" width="20" height="14" rx="4"/>
<rect x="0" y="154" width="60" height="10" rx="5"/>
</g>'''
    # 品类图标（顶部）
    icon = f'''<text x="80" y="100" font-size="46">{pal['icon']}</text>'''
    # 标题两行：主 + 副
    t1 = title[:15]
    t2 = title[15:30] if len(title) > 15 else ''
    t3 = title[30:45] if len(title) > 30 else ''
    lines = []
    y = 330
    for seg in [t1, t2, t3]:
        if seg:
            lines.append(f'<text x="80" y="{y}" fill="#fff" font-size="58" font-family="\'Microsoft YaHei\',\'PingFang SC\',sans-serif" font-weight="bold">{seg}</text>')
            y += 78
    # 栏目条（底部）
    bar = f'''<rect x="0" y="560" width="1200" height="70" fill="{pal['accent']}" opacity="0.92"/>
<text x="80" y="604" fill="#1a1206" font-size="30" font-family="\'Microsoft YaHei\',sans-serif" font-weight="bold">红酒顾问 · 每日避坑</text>
<text x="1120" y="604" text-anchor="end" fill="#1a1206" font-size="26" font-family="sans-serif" opacity="0.8">feiqingqi</text>'''
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:{pal['bg1']}"/><stop offset="100%" style="stop-color:{pal['bg2']}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
{seq_txt}
{glass}
{icon}
{''.join(lines)}
{bar}
</svg>'''
    return svg

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
    build_article('myth_hangbei', title='🍷 挂杯就是好酒？别再被这个误区骗了',
        digest='看红酒挂杯就说是好酒？其实挂杯只说明酒精或糖分高，和品质半点关系都没有。一篇讲清挂杯的真相。',
        category='wine-myth', tags=['挂杯','误区','避坑','红酒常识','新手'],
        content_blocks=[
            {'type':'title','text':'🍷 挂杯就是好酒？'},
            {'type':'subtitle','text':'红酒顾问每日避坑 | 第1期'},
            {'type':'p','text':'去饭局或酒展，常听人指着杯壁上的"酒泪"说："你看这挂杯，多漂亮，肯定是好酒！"'},
            {'type':'p','text':'挂杯确实好看，但它和"好酒"之间，其实没有因果关系。今天就用一分钟，把这个流传最广的误区讲清楚。'},
            {'type':'h2','text':'🍶 挂杯到底是什么？'},
            {'type':'p','text':'挂杯（俗称"酒泪""酒腿"）是酒液在杯壁留下的一道道痕迹。它的物理学原理叫"马伦哥尼效应"：酒精比水挥发得快，杯壁上的酒精浓度下降后，表面张力变化，把酒液拉成一道痕迹往下滑。'},
            {'type':'h2','text':'🔬 挂杯只说明两件事'},
            {'type':'table','headers':['挂杯越强','说明什么','与品质关系'],
            'rows':[
                ['酒精度高','残糖或酒精多，挥发更明显','无关好坏'],
                ['酒体厚重','甘油、糖分含量高','无关好坏'],
                ['温度/杯型','杯壁光滑、酒温低更易挂','无关品质'],
            ]},
            {'type':'p','text':'换句话说：一款 15 度的甜型廉价酒，挂杯可能比顶级勃艮第还漂亮。挂杯浓，只能证明"这酒酒精或糖分不低"，证明不了任何关于风味、平衡、陈年潜力的东西。'},
            {'type':'h2','text':'❌ 为什么这个误区这么顽固'},
            {'type':'list','items':[
                '👀 视觉直观：晃动酒杯看到"泪痕"很有仪式感，容易误读为"浓郁=好"',
                '📺 影视误导：电影里摇晃红酒+挂杯特写，被当成"懂酒"的符号',
                '💬 口口相传：饭局上谁先说"挂杯好"，别人懒得反驳',
            ]},
            {'type':'box','heading':'红酒顾问说','text':'判断好酒，看的是香气复杂度、口感平衡、余味长度，而不是杯壁上的水痕。下次有人拿挂杯炫耀，你可以微笑着说："挂杯只说明这酒不淡。"'},
            {'type':'h2','text':'✅ 真正该看什么'},
            {'type':'list','items':[
                '👃 香气：是否纯净、有层次，有没有异味',
                '👅 口感：酸、甜、单宁、酒精是否平衡',
                '⏳ 余味：咽下后香气在口中停留多久（越长越好）',
                '🍇 品种/产区：了解背景比看挂杯有用得多',
            ]},
            {'type':'tip','text':'💡 一个小实验：倒一杯廉价甜酒和一杯普通干红，摇一摇对比挂杯——你会发现贵的未必挂得更厉害。眼见为实，误区自破。'},
            {'type':'sep','text':''},
            {'type':'p','text':'挂杯是葡萄酒最无辜的"背锅侠"：它只是物理现象，却被硬安上了品质裁判的头衔。忘了挂杯吧，把注意力放回杯中的味道本身。'},
            {'type':'end','text':'— 你被挂杯骗过吗？评论区聊聊 —'},
        ],
        seq='01'
    )
