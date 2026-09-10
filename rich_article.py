"""
Ultra-rich HTML matching Rhône Valley article style exactly.
Dark gradient boxes, colored sections, .ri info boxes, specific table styling.
"""
import base64

def js_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def cover_svg(base_color, title_lines, subtitle, bottom_text):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:{base_color}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="600" cy="315" r="200" fill="none" stroke="#ffd700" stroke-width="1.5" opacity="0.15"/>
<text x="600" y="260" text-anchor="middle" fill="#fff" font-size="36" font-family="serif" font-weight="bold">{title_lines[0]}</text>
{f'<text x="600" y="310" text-anchor="middle" fill="#ddd" font-size="28" font-family="serif">{title_lines[1]}</text>' if len(title_lines)>1 else ''}
<text x="600" y="370" text-anchor="middle" fill="#bbb" font-size="18" font-family="sans-serif">{subtitle}</text>
<line x1="200" y1="400" x2="1000" y2="400" stroke="#ffd700" stroke-width="0.5" opacity="0.3"/>
<text x="600" y="440" text-anchor="middle" fill="#888" font-size="13" font-family="sans-serif">{bottom_text}</text>
</svg>'''
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()

def rich_article(content_blocks, primary='#8b2252', secondary='#d4af37'):
    style = '''<style>
  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .ri h4 { color: ''' + primary + '''; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: ''' + primary + '''; border-bottom: 2px solid ''' + secondary + '''; padding-bottom: 8px; margin-top: 25px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table th { background: ''' + primary + '''; color: #fff; padding: 10px; text-align: left; }
  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }
</style>'''

    parts = ['<section>', style]

    for b in content_blocks:
        t = b['type']

        if t == 'title':
            parts.append(f'<h2 style="text-align:center;color:{primary};">{b["text"]}</h2>')
        elif t == 'subtitle':
            parts.append(f'<p style="text-align:center;color:#666;">{b["text"]}</p>')
        elif t == 'h2':
            parts.append(f'<h3>{b["text"]}</h3>')
        elif t == 'h3':
            parts.append(f'<h3 style="border-bottom:none;">{b["text"]}</h3>')
        elif t == 'p':
            parts.append(f'<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">{b["text"]}</p>')
        elif t == 'lead':
            parts.append(f'<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">{b["text"]}</p></section>')
        elif t == 'box':
            heading = b.get('heading', '')
            body = b['text'].replace('\n', '<br/>')
            parts.append(f'<div class="ri"><h4>{heading}</h4><p style="color:#333;line-height:1.8;margin:0">{body}</p></div>')
        elif t == 'item':
            tag = f' <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">{b["tag"]}</span>' if b.get('tag') else ''
            parts.append(f'<div class="ri"><h4>{b["text"]}{tag}</h4><p style="color:#333;line-height:1.8;margin:0">{b.get("info","")}</p><p style="color:{secondary};font-weight:bold;margin:5px 0 0 0;">{b.get("price","")}</p></div>')
        elif t == 'table':
            sep = '</td><td>'
            rows = ''.join('<tr><td>' + sep.join(r) + '</td></tr>' for r in b['rows'])
            ths = ''.join('<th>' + h + '</th>' for h in b['headers'])
            parts.append(f'<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr>{ths}</tr>{rows}</table></section>')
        elif t == 'list':
            items = ''.join(f'<li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">{i}</li>' for i in b['items'])
            parts.append(f'<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;">{items}</ul></section>')
        elif t == 'tip':
            heading = b.get('heading', '💡 小贴士')
            body = b['text'].replace('\n', '<br/>')
            parts.append(f'<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>{heading}</h4><p style="color:#333;line-height:1.8;margin:0">{body}</p></div></section>')
        elif t == 'quote':
            parts.append(f'<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">{b["text"]}</p></section>')
        elif t == 'sep':
            parts.append(f'<div style="height:2px;background:linear-gradient(90deg,transparent,{secondary},transparent);margin:25px 0;"></div>')
        elif t == 'end':
            parts.append(f'<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">{b["text"]}</p></section>')

    parts.append('</section>')
    return '\n'.join(parts)
