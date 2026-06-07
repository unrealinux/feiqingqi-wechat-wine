import os, re
os.chdir(r'E:\Project\feiqingqiWechatMP')

files = [
    'generate-sichuan_pairing.js', 'generate-canton_pairing.js',
    'generate-hotpot_pairing.js', 'generate-bbq_pairing.js',
    'generate-chinese_banquet_pairing.js',
    'generate-nebbiolo_dive.js', 'generate-sangiovese_dive.js',
    'generate-tempranillo_dive.js', 'generate-malbec_dive.js',
    'generate-grenache_dive.js', 'generate-gewurztraminer_dive.js',
    'generate-wine_storage_guide.js', 'generate-wine_tasting_101.js',
]

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Find gCov function and extract base64 string
    m = re.search(r'function gCov\(\)\{.*?const svg="data:image/svg\+xml;base64,([A-Za-z0-9+/=]+)";.*?return svg;\s*\}', c, re.DOTALL)
    if m:
        b64 = m.group(1)
        new_gcov = f'function gCov(){{const sharp=require("sharp");const svg=Buffer.from("{b64}","base64").toString();return sharp(Buffer.from(svg)).png().toBuffer().then(b=>b);}}'
        c = c.replace(m.group(0), new_gcov)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)
    print(fname, 'fixed')

print('All done')
