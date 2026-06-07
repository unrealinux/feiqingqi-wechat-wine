import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
print(data[:200].decode('utf-8'))
