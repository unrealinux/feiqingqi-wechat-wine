"""
Shared rich HTML generation for wine articles.
Produces WeChat-compatible HTML with:
- CSS <style> block for consistent design
- Gradient backgrounds on key sections
- Colored accent borders on tips/boxes
- Proper visual hierarchy
"""

def js_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def rich_html(content_blocks, accent_color='#b8860b', accent_light='#ffd54f'):
    """
    Build rich HTML from content blocks.
    
    accent_color: primary color (e.g. '#b8860b' gold, '#c62828' red)
    accent_light: light variant for highlights
    """
    style = f'''<style>
  .art-section {{ margin:15px 0; padding:18px; border-radius:8px; }}
  .art-card {{ background:#faf8f5; padding:18px; border-radius:8px; margin:15px 0; }}
  .art-box {{ background:#fff; padding:18px; border-radius:8px; margin:15px 0; box-shadow:0 1px 4px rgba(0,0,0,0.06); }}
  .art-tip {{ background:#fff8e1; border-left:4px solid {accent_light}; padding:12px 15px; margin:15px 0; border-radius:0 6px 6px 0; }}
  .art-tip p {{ color:#795548; margin:0; font-size:14px; line-height:1.7; }}
  .art-gradient {{ background:linear-gradient(135deg,{accent_color}, #1a1a2e); padding:22px; border-radius:10px; margin:20px 0; }}
  .art-gradient p {{ color:#fff; line-height:1.8; font-size:15px; margin:0; }}
  .art-gradient strong {{ color:{accent_light}; }}
  .art-table {{ overflow-x:auto; margin:15px 0; }}
  .art-table table {{ width:100%; border-collapse:collapse; }}
  .art-table th {{ padding:10px; text-align:left; background:{accent_color}; color:#fff; }}
  .art-table td {{ padding:8px 12px; border-bottom:1px solid #eee; }}
  .art-quote {{ background:#f0f0f0; border-left:4px solid {accent_color}; padding:12px 18px; margin:15px 0; border-radius:0 6px 6px 0; font-style:italic; }}
  .art-list {{ padding-left:20px; }}
  .art-list li {{ margin:6px 0; color:#333; line-height:1.7; }}
</style>'''

    parts = ['<section>', style]

    for b in content_blocks:
        t = b['type']

        if t == 'title':
            parts.append(f'<h2 style="text-align:center;color:{accent_color};font-size:22px;margin-bottom:5px;">{b["text"]}</h2>')

        elif t == 'subtitle':
            parts.append(f'<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">{b["text"]}</p>')

        elif t == 'h2':
            parts.append(f'<h2 style="color:{accent_color};border-bottom:2px solid {accent_light};padding-bottom:8px;margin-top:28px;font-size:19px;">{b["text"]}</h2>')

        elif t == 'h3':
            parts.append(f'<h3 style="color:{accent_color};margin-top:20px;font-size:17px;border-left:3px solid {accent_light};padding-left:10px;">{b["text"]}</h3>')

        elif t == 'p':
            parts.append(f'<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">{b["text"]}</p>')

        elif t == 'lead':
            parts.append(f'<div class="art-gradient"><p>{b["text"]}</p></div>')

        elif t == 'tip':
            parts.append(f'<div class="art-tip"><p>{b["text"]}</p></div>')

        elif t == 'quote':
            parts.append(f'<div class="art-quote"><p style="color:#555;line-height:1.7;margin:0;">{b["text"]}</p></div>')

        elif t == 'table':
            sep = '</td><td>'
            rows = ''.join('<tr><td>' + sep.join(r) + '</td></tr>' for r in b['rows'])
            ths = ''.join('<th>' + h + '</th>' for h in b['headers'])
            parts.append(f'<div class="art-table"><table><thead><tr>{ths}</tr></thead><tbody>{rows}</tbody></table></div>')

        elif t == 'list':
            items = ''.join(f'<li>{i}</li>' for i in b['items'])
            parts.append(f'<ul class="art-list">{items}</ul>')

        elif t == 'box':
            heading = b.get('heading', '')
            body = b['text'].replace('\n', '<br/>')
            parts.append(f'<div class="art-box"><h4 style="color:{accent_color};margin:0 0 8px 0;font-size:15px;">{heading}</h4><p style="color:#333;margin:0;line-height:1.8;font-size:14px;">{body}</p></div>')

        elif t == 'card':
            parts.append(f'<div class="art-card"><p style="color:#333;line-height:1.8;font-size:14px;margin:0;">{b["text"]}</p></div>')

        elif t == 'sep':
            parts.append(f'<p style="text-align:center;color:#ddd;margin:20px 0;">✦ ✦ ✦</p>')

        elif t == 'end':
            parts.append(f'<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;padding-bottom:15px;">{b["text"]}</p>')

    parts.append('</section>')
    return '\n'.join(parts)
