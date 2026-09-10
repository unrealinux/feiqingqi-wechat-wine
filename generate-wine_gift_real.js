const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260616'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2NTEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkumAgeekvOaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5aaC5L2V6YCJ5a+56YWSPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPumAgeekvOmAgeWIsOW/g+WdjuS4ijwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOmAgeekvOaMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #e65100; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #e65100; border-bottom: 2px solid #ff9800; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #e65100; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#e65100;">葡萄酒送礼指南：如何选对酒</h2>' +
  '<p style="text-align:center;color:#666;">送礼送到心坎上</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">送长辈、送领导、送朋友、送客户，不同对象送不同的酒。这篇指南帮你选对酒，送礼送到心坎上。</p></section>' +
  '<h3>🎁 送礼的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">送酒时，遵循这些原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>了解对方喜好</strong>——投其所好最重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算适中</strong>——不要太便宜显得敷衍，也不要太贵让人有压力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>包装精美</strong>——送礼要有仪式感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌有保障</strong>——选择知名品牌，品质有保障</li></ul></section>' +
  '<h3>👨‍👩‍👧‍👦 不同对象的送酒建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据不同的送礼对象，推荐不同的酒款：</p>' +
  '<h3>💰 不同预算的推荐</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>预算</th><th>推荐酒款</th><th>适合对象</th></tr><tr><td>100-200元</td><td>黄尾袋鼠、桃乐丝</td><td>朋友/同事</td></tr><tr><td>200-500元</td><td>张裕解百纳、长城五星</td><td>长辈</td></tr><tr><td>500-1000元</td><td>拉菲传说、奔富Bin</td><td>领导/客户</td></tr><tr><td>1000-2000元</td><td>波尔多中级庄</td><td>重要客户</td></tr><tr><td>2000元以上</td><td>波尔多列级庄</td><td>特殊场合</td></tr></table></section>' +
  '<h3>🚫 送酒禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">送酒时，这些禁忌要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送4瓶</strong>——不吉利</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送白色包装</strong>——与丧事相关</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送过期酒</strong>——检查保质期</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送假酒</strong>——从正规渠道购买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送对方忌酒</strong>——如果对方不喝酒</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ff9800,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'送礼不在贵，而在对。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">送酒最重要的是心意。选对酒，送到心坎上，让对方感受到你的用心。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你送过什么酒？<br/>你有什么送酒经验？<br/>欢迎在评论区分享！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒送礼指南：如何选对酒',
      author: '红樽坊',
      digest: '送长辈、送领导、送朋友、送客户，不同对象送不同的酒。这篇指南帮你选对酒，送礼送到心坎上。',
      content: gen(),
      coverImage: 'wine_gift_real_cover_ai.png',
      category: 'practical-guide',
      tags: ["送礼", "礼物", "选择", "场合", "技巧"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_gift_real_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Gift, media_id:', d.data.media_id);
  }catch(e){
    console.error('Gift:', e.message);
    process.exit(1);
  }
}

main();
