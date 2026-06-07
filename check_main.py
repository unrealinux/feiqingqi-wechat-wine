import os
os.chdir(r'E:\Project\feiqingqiWechatMP')
with open('generate-sichuan_pairing.js','rb') as f:
    data = f.read()
# Find main function
idx = data.find(b"async function main()")
if idx < 0:
    idx = data.find(b"function main()")
with open('main_debug.txt','w',encoding='utf-8') as out:
    # show from main() to end of file
    out.write(data[idx:].decode('utf-8', errors='replace'))
print('Written to main_debug.txt')
