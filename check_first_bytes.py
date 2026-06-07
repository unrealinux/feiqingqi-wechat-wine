import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
# Show first 2000 bytes to understand format
print('First 2000 bytes:')
print(data[:2000].decode('utf-8', errors='replace'))
