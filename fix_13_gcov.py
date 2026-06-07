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
    
    # 1. Add sharp require if not present
    if 'require(\'sharp\')' not in c and 'require("sharp")' not in c:
        c = c.replace('require(\'fs\')', "require('sharp');const fs=require('fs')")
        # or handle the other format
        c = c.replace("require('axios')", "require('sharp');const axios=require('axios')")
    
    # 2. Replace gCov to decode base64 SVG and use sharp
    old_gcov = re.search(r'function gCov\(\)\{.*?return svg;\s*\}', c, re.DOTALL)
    if old_gcov:
        # Extract the base64 string
        b64_match = re.search(r'base64,([A-Za-z0-9+/=]+)', old_gcov.group())
        if b64_match:
            b64_data = b64_match.group(1)
            new_gcov = f'''function gCov(){{const sharp=require('sharp');const svg=Buffer.from("{b64_data}",'base64').toString();return sharp(Buffer.from(svg)).png().toBuffer().then(b=>{{const p=require('path'),fs2=require('fs');fs2.writeFileSync(p.join(__dirname,'output','{fname.replace("generate-","").replace(".js","_cover_ai.png")}'),b);return b;}});}}'''
            c = c.replace(old_gcov.group(), new_gcov)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)
    print(fname, 'fixed')

print('All done')
