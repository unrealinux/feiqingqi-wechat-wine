"""
Premium HTML generation matching Italian series (Barolo) style.
Produces WeChat-compatible HTML with rich CSS classes.
"""
import base64

def js_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def cover_svg(base_color, title_lines, subtitle, bottom_text):
    """Generate a cover SVG with given color theme."""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:{base_color}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="600" cy="315" r="200" fill="none" stroke="#ffd700" stroke-width="1.5" opacity="0.15"/>
<circle cx="350" cy="200" r="80" fill="none" stroke="#ffd700" stroke-width="0.5" opacity="0.1"/>
<circle cx="850" cy="430" r="100" fill="none" stroke="#ffd700" stroke-width="0.5" opacity="0.1"/>
<text x="600" y="260" text-anchor="middle" fill="#fff" font-size="36" font-family="serif" font-weight="bold">{title_lines[0]}</text>
{f'<text x="600" y="310" text-anchor="middle" fill="#ddd" font-size="28" font-family="serif">{title_lines[1]}</text>' if len(title_lines)>1 else ''}
<text x="600" y="370" text-anchor="middle" fill="#bbb" font-size="18" font-family="sans-serif">{subtitle}</text>
<line x1="200" y1="400" x2="1000" y2="400" stroke="#ffd700" stroke-width="0.5" opacity="0.3"/>
<text x="600" y="440" text-anchor="middle" fill="#888" font-size="13" font-family="sans-serif">{bottom_text}</text>
</svg>'''
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()

def premium_html(content_blocks, theme_color='#8B0000', accent_color='#DC143C'):
    """
    Build rich HTML matching Italian series style.
    theme_color: dark base color for cards/headers (e.g. '#8B0000' dark red)
    accent_color: highlight color (e.g. '#DC143C' crimson)
    """
    style = f'''<style>
  .highlight-box {{ background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:20px;border-radius:10px;margin:15px 0; }}
  .highlight-box p {{ color:#FFE4E1;font-size:16px;line-height:1.8;margin:0; }}
  .highlight-box strong {{ color:{accent_color}; }}
  h3 {{ color:{theme_color};border-bottom:2px solid {accent_color};padding-bottom:8px;margin-top:25px;font-size:18px; }}
  .info-box {{ background:#fff5f5;padding:15px;border-radius:8px;margin:10px 0; }}
  .info-box h4 {{ color:{accent_color};margin:0 0 10px 0;font-size:15px; }}
  .info-box p {{ margin:5px 0;color:#333;line-height:1.7;font-size:14px; }}
  .card {{ background:#fff;border-left:4px solid {theme_color};padding:15px;margin:10px 0;border-radius:0 8px 8px 0; }}
  .card h4 {{ color:{theme_color};margin:0 0 8px 0;font-size:15px; }}
  .card p {{ color:#555;margin:0;line-height:1.7;font-size:14px; }}
  .tip-box {{ background:#f0f8ff;border:1px solid #4682B4;border-radius:8px;padding:15px;margin:15px 0; }}
  .tip-box h4 {{ color:#4682B4;margin:0 0 10px 0;font-size:15px; }}
  .tip-box p {{ color:#333;margin:0;line-height:1.7;font-size:14px; }}
  .price-tag {{ display:inline-block;background:{accent_color};color:#fff;padding:3px 10px;border-radius:15px;font-size:13px;margin:5px 0; }}
  .table-wrap {{ overflow-x:auto;margin:15px 0; }}
  .table-wrap table {{ width:100%;border-collapse:collapse; }}
  .table-wrap th {{ padding:10px;text-align:left;background:{theme_color};color:#fff;font-size:14px; }}
  .table-wrap td {{ padding:8px 12px;border-bottom:1px solid #eee;color:#333;font-size:14px;line-height:1.6; }}
  .list {{ padding-left:20px; }}
  .list li {{ margin:8px 0;color:#333;line-height:1.7;font-size:14px; }}
  .quote-box {{ background:#f5f5f5;border-left:4px solid {theme_color};padding:12px 18px;margin:15px 0;border-radius:0 6px 6px 0; }}
  .quote-box p {{ color:#555;font-style:italic;margin:0;line-height:1.7;font-size:14px; }}
  .subtitle {{ text-align:center;color:#888;font-size:14px;margin-bottom:20px; }}
  .title {{ text-align:center;color:{theme_color};font-size:20px;margin-bottom:5px; }}
  .sep {{ text-align:center;color:#ddd;margin:25px 0;font-size:14px; }}
  .end {{ text-align:center;color:#888;font-size:14px;margin-top:30px;padding-bottom:15px; }}
</style>'''

    parts = ['<section>', style]

    for b in content_blocks:
        t = b['type']

        if t == 'title':
            parts.append(f'<h2 class="title">{b["text"]}</h2>')

        elif t == 'subtitle':
            parts.append(f'<p class="subtitle">{b["text"]}</p>')

        elif t == 'h2':
            parts.append(f'<h3>{b["text"]}</h3>')

        elif t == 'p':
            parts.append(f'<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">{b["text"]}</p>')

        elif t == 'h3':
            parts.append(f'<p style="color:{theme_color};font-weight:bold;font-size:16px;margin:18px 0 8px 0;">{b["text"]}</p>')

        elif t == 'lead':
            parts.append(f'<div class="highlight-box"><p>{b["text"]}</p></div>')

        elif t == 'tip':
            parts.append(f'<div class="tip-box"><h4>{b.get("heading","💡 小贴士")}</h4><p>{b["text"]}</p></div>')

        elif t == 'info':
            parts.append(f'<div class="info-box"><h4>{b.get("heading","")}</h4><p>{b["text"]}</p></div>')

        elif t == 'card':
            parts.append(f'<div class="card"><h4>{b.get("heading","")}</h4><p>{b["text"]}</p></div>')

        elif t == 'table':
            sep = '</td><td>'
            rows = ''.join('<tr><td>' + sep.join(r) + '</td></tr>' for r in b['rows'])
            ths = ''.join('<th>' + h + '</th>' for h in b['headers'])
            parts.append(f'<div class="table-wrap"><table><thead><tr>{ths}</tr></thead><tbody>{rows}</tbody></table></div>')

        elif t == 'list':
            items = ''.join(f'<li>{i}</li>' for i in b['items'])
            parts.append(f'<ul class="list">{items}</ul>')

        elif t == 'quote':
            parts.append(f'<div class="quote-box"><p>{b["text"]}</p></div>')

        elif t == 'sep':
            parts.append(f'<p class="sep">✧ ✧ ✧</p>')

        elif t == 'end':
            parts.append(f'<p class="end">{b["text"]}</p>')

    parts.append('</section>')
    return '\n'.join(parts)
