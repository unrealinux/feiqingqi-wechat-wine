import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
for f in ['generate-sichuan_pairing.js','generate-nebbiolo_dive.js','generate-wine_storage_guide.js']:
    c = open(f,'r',encoding='utf-8').read()
    ti = c.find("title:'"); te = c.find("'",ti+7)
    t = c[ti+7:te]
    di = c.find("digest:'"); de = c.find("'",di+8)
    d = c[di+8:de]
    name = f.split('-')[1].split('.')[0]
    has_entities = '&#' in t or '&#' in d
    print(f'{name}: title={len(t)}ch digest={len(d)}ch entities={has_entities}')
