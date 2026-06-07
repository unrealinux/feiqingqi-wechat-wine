import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
f = 'generate-sichuan_pairing.js'
c = open(f,'r',encoding='utf-8').read()
# Find title and digest
ti = c.find("title:'")
te = c.find("'",ti+7)
t = c[ti+7:te]
di = c.find("digest:'")
de = c.find("'",di+8)
d = c[di+8:de]
ai = c.find("author:'")
ae = c.find("'",ai+8)
a = c[ai+8:ae]
print('Title:', repr(t), 'len:', len(t))
print('Digest:', repr(d), 'len:', len(d))
print('Author:', repr(a), 'len:', len(a))

# Check the whole art definition for the draft call pattern
# Look for the entire async main function to see the upload/draft flow
idx = c.find('async function main()')
end = c.find('main();', idx)
art_block = c[idx:end]
# Find the draft call
didx = art_block.find('draft/add')
print('\nDraft call context:')
print(art_block[max(0,didx-200):didx+200])
