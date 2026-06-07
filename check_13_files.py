import os
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

for f in files:
    if os.path.exists(f):
        print(f'{f}: OK')
    else:
        print(f'{f}: MISSING')
