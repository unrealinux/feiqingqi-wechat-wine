import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
c = open('generate-sichuan_pairing.js','r',encoding='utf-8').read()
i = c.find('const art')
# Find the full art definition
j = c.find('\n', i)
# print the first 300 chars of art block
print(repr(c[i:j+400][:400]))
if len(c[i:j+400]) > 400:
    print('...(truncated)')
