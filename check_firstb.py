import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
with open('sichuan_preview.txt','w',encoding='utf-8') as out:
    out.write(data[:2000].decode('utf-8', errors='replace'))
print('Written to sichuan_preview.txt')
