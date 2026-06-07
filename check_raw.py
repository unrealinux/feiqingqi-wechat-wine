import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
# Find title field
idx = data.find(b"title: '")
if idx < 0:
    idx = data.find(b"title:")
end = data.find(b"'", idx+7)
title = data[idx+7:end]
print('Title bytes:', repr(title))
print('Has HTML entities:', b'&#' in title)

idx = data.find(b"digest:")
end = data.find(b"'", idx+8)
digest = data[idx+8:end]
print('Digest bytes:', repr(digest[:150]))
print('Has HTML entities:', b'&#' in digest)
