const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzI2MzIzOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuWciOeahOa9nOinhOWImTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5rKh5Lq65ZGK6K+J5L2g55qE56eY5a+GPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPui/meS6m+ecn+ebuOmFkuWVhuS4jeS8muWRiuivieS9oDwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puaPreenmDwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #263238; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #263238; border-bottom: 2px solid #607d8b; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #263238; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#263238;">葡萄酒圈的潜规则：没人告诉你的秘密</h2>' +
  '<p style="text-align:center;color:#666;">这些真相酒商不会告诉你</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">为什么餐厅的酒比外面贵3倍？为什么名庄酒假货这么多？为什么你总买到不适合自己的酒？葡萄酒圈的潜规则，酒商不会告诉你。</p></section>' +
  '<h3>🔒 潜规则一：餐厅酒的加价</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">餐厅的酒为什么比外面贵？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>加价率</strong>——餐厅酒的加价率通常是2-3倍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>原因</strong>——餐厅需要支付租金、人工、税费</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真相</strong>——很多餐厅的酒品质一般，但价格很高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>建议</strong>——自带酒水更划算，但要支付开瓶费</li></ul></section>' +
  '<h3>🔒 潜规则二：假酒泛滥</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">名庄酒为什么假货多？</p>' +
  '<h3>🔒 潜规则三：评分的真相</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒评分的真相是什么？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>评分主观</strong>——评分是主观的，不同的人给不同的分</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>利益关系</strong>——有些评分机构与酒商有利益关系</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>样本偏差</strong>——评分样本可能不代表整体品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参考价值</strong>——评分只是参考，不代表一切</li></ul></section>' +
  '<h3>🔒 潜规则四：年份的炒作</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">年份酒为什么被炒作？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>稀缺性</strong>——好年份的酒产量有限</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>陈年潜力</strong>——好年份的酒可以陈年</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>炒作空间</strong>——年份酒有炒作空间</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>身份象征</strong>——喝年份酒有面子</li></ul></section>' +
  '<h3>🔒 潜规则五：酒商的话术</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒商常用这些话术忽悠你：</p>' +
  '<h3>💡 如何避开潜规则？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想避开潜规则，试试这些方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>从正规渠道购买</strong>——大型超市、专业酒商更可靠</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>忽略品牌和评分</strong>——关注酒质，不看名气</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多尝试多比较</strong>——不要只喝一种酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>学习葡萄酒知识</strong>——知识是最好的防骗工具</li></ul></section>' +
  '<h3>📊 潜规则速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>潜规则</th><th>真相</th><th>应对方法</th></tr><tr><td>餐厅酒贵</td><td>加价率2-3倍</td><td>自带酒水</td></tr><tr><td>假酒多</td><td>名庄酒假货泛滥</td><td>正规渠道购买</td></tr><tr><td>评分主观</td><td>有利益关系</td><td>不迷信评分</td></tr><tr><td>年份炒作</td><td>人为制造稀缺</td><td>关注酒质</td></tr><tr><td>酒商话术</td><td>制造紧迫感</td><td>理性购买</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#607d8b,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'知识是最好的防骗工具。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒圈的潜规则很多，但只要你知道这些潜规则，就不会被忽悠。学习葡萄酒知识，相信自己的舌头，找到真正适合自己的好酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有没有被潜规则坑过？<br/>你知道哪些葡萄酒圈的潜规则？<br/>欢迎在评论区分享你的经历！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒圈的潜规则：没人告诉你的秘密',
      author: '红樽坊',
      digest: '为什么餐厅的酒比外面贵3倍？为什么名庄酒假货这么多？葡萄酒圈的潜规则，酒商不会告诉你。',
      content: gen(),
      coverImage: 'wine_secrets_cover_ai.png',
      category: 'deep-dive',
      tags: ["潜规则", "秘密", "真相", "避坑", "行业"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_secrets_'+date.full.replace(/-/g,'')+'.json'),
      JSON.stringify(art, null, 2)
    );

    const w = config.publish;
    const t = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+w.appId+'&secret='+w.appSecret);
    const a = t.data.access_token;
    const sharp=require('sharp');
    const svgContent=Buffer.from(cb.split(',')[1],'base64').toString();
    const png=await sharp(Buffer.from(svgContent)).png().toBuffer();
    const f = new FormData();
    f.append('media', png, {filename: 'cover.png', contentType: 'image/png'});
    const m = await axios.post('https://api.weixin.qq.com/cgi-bin/material/add_material?access_token='+a+'&type=image', f, {headers: f.getHeaders()});
    const d = await axios.post('https://api.weixin.qq.com/cgi-bin/draft/add?access_token='+a, {
      articles: [{
        title: art.title,
        thumb_media_id: m.data.media_id,
        author: art.author,
        digest: art.digest,
        content: art.content,
        show_cover_pic: 1,
        need_open_comment: 0,
        only_fans_can_comment: 0
      }]
    });
    console.log('Secrets, media_id:', d.data.media_id);
  }catch(e){
    console.error('Secrets:', e.message);
    process.exit(1);
  }
}

main();
