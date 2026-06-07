import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
idx = data.find(b"function gCov()")
end = data.find(b"function gen()")
with open('gcov_debug.txt','w',encoding='utf-8') as out:
    out.write(data[idx:end].decode('utf-8', errors='replace'))
print('Written to gcov_debug.txt')
