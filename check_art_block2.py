import os, sys, io
os.chdir(r'E:\Project\feiqingqiWechatMP')

# Write to file
with open('art_block_debug.txt','w',encoding='utf-8') as out:
    c = open('generate-sichuan_pairing.js','r',encoding='utf-8').read()
    i = c.find('const art')
    j = c.find('\n', i)
    out.write(c[i:j+400][:400])
    out.write('\n...(truncated)\n')
print('Written to art_block_debug.txt')
