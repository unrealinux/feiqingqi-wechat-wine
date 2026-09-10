const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2I3MWMxYyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuaYpeiKgumAgemFkuaMh+WNlzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6YCB56S86YCB5Yiw5b+D5Z2O5LiKPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS4jeWQjOWvueixoeOAgeS4jeWQjOmihOeul+eahOWujOe+jumAiemFkuaWueahiDwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOiKguaXpeeJuei+kTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #b71c1c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #b71c1c; border-bottom: 2px solid #ef5350; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #b71c1c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#b71c1c;">春节送酒指南：送礼送到心坎上</h2>' +
  '<p style="text-align:center;color:#666;">不同对象、不同预算的完美选酒方案</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">春节快到了，你准备好送什么酒了吗？送长辈、送领导、送朋友、送客户……不同对象，送不同的酒。这篇指南帮你选对酒，送礼送到心坎上。</p></section>' +
  '<h3>🍷 送礼的基本原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春节送酒，遵循这几个原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>了解对方喜好</strong>——投其所好最重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>预算适中</strong>——不要太便宜显得敷衍，也不要太贵让人有压力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>包装精美</strong>——送礼要有仪式感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌有保障</strong>——选择知名品牌，品质有保障</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>避免敏感话题</strong>——不要送\'4\'瓶，不要送白色包装</li></ul></section>' +
  '<h3>👨‍👩‍👧‍👦 不同对象的送酒建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">根据不同的送礼对象，推荐不同的酒款：</p>' +
  '<h3>💰 不同预算的推荐方案</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>预算</th><th>推荐酒款</th><th>适合对象</th><th>理由</th></tr><tr><td>¥100-200</td><td>黄尾袋鼠、桃乐丝</td><td>朋友/同事</td><td>性价比高，易饮</td></tr><tr><td>¥200-500</td><td>张裕解百纳、长城五星</td><td>长辈</td><td>国产名牌，口感醇厚</td></tr><tr><td>¥500-1000</td><td>拉菲传说、奔富Bin</td><td>领导/客户</td><td>品牌知名，有面子</td></tr><tr><td>¥1000-2000</td><td>波尔多中级庄、巴罗萨西拉</td><td>重要客户</td><td>品质高端，有档次</td></tr><tr><td>¥2000+</td><td>波尔多列级庄、勃艮第</td><td>特殊场合</td><td>顶级名酒，诚意满满</td></tr></table></section>' +
  '<h3>🎁 送酒的包装技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">送酒时，包装很重要：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择礼盒装</strong>——显得更正式、更有档次</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>加一条丝带</strong>——红色或金色丝带，增加喜庆感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>附一张贺卡</strong>——写上祝福语，更有心意</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>搭配酒杯</strong>——送酒配酒杯，实用又贴心</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>注意颜色</strong>——红色、金色最吉利，避免白色</li></ul></section>' +
  '<h3>🚫 送酒的禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春节送酒，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送4瓶</strong>——\'4\'谐音\'死\'，不吉利</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送白色包装</strong>——白色在中国文化中与丧事相关</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送过期酒</strong>——检查保质期，确保酒的品质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送假酒</strong>——从正规渠道购买，确保正品</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要送对方忌酒</strong>——如果对方不喝酒，不要勉强送酒</li></ul></section>' +
  '<h3>💡 送酒的小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的送礼更完美：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>提前购买</strong>——不要等到最后一刻才买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>检查包装</strong>——确保包装完好无损</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>保留小票</strong>——万一对方需要退换</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>附上酒单</strong>——告诉对方酒的饮用方法</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>表达心意</strong>——送礼最重要的是心意</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ef5350,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'送礼不在贵，而在对。选对酒，送到心坎上。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">春节送酒，是一门学问，也是一种心意。选对酒，送到心坎上，让对方感受到你的用心和祝福。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你春节打算送什么酒？<br/>你有什么送酒的经验？<br/>欢迎在评论区分享你的送酒故事！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '春节送酒指南：送礼送到心坎上',
      author: '红樽坊',
      digest: '送长辈、送领导、送朋友、送客户……春节送酒是一门学问。不同对象、不同预算，这篇指南帮你选对酒。',
      content: gen(),
      coverImage: 'cny_wine_gift_cover_ai.png',
      category: 'holiday',
      tags: ["春节", "送礼", "节日", "礼物", "新年"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'cny_wine_gift_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('CNY Gift, media_id:', d.data.media_id);
  }catch(e){
    console.error('CNY Gift:', e.message);
    process.exit(1);
  }
}

main();
