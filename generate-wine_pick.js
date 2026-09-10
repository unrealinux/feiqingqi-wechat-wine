const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzE1NjVjMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4uuS7gOS5iOS9oOaAu+mAieS4jeWIsOWlvemFku+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6YCJ6YWS55qE55yf55u4PC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPui/meS6m+mUmeivr+S9oOeKr+S6huWQlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1565c0; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1565c0; border-bottom: 2px solid #42a5f5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1565c0; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1565c0;">为什么你总选不到好酒？</h2>' +
  '<p style="text-align:center;color:#666;">选酒的真相</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">每次买酒都踩坑？不是你运气差，而是你犯了这些选酒错误。这篇指南帮你避开选酒陷阱，找到真正适合自己的好酒。</p></section>' +
  '<h3>🤔 你犯了这些错误吗？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选酒时，很多人会犯这些错误：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只看品牌</strong>——只买名牌酒，不看酒质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只看价格</strong>——认为贵的就是好的</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只看评分</strong>——迷信专家评分</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只看年份</strong>——认为老年份的酒一定好</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>只看产区</strong>——认为法国酒一定好</li></ul></section>' +
  '<h3>📊 选酒的真相</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选酒的真相是什么？</p>' +
  '<h3>💡 正确的选酒方法</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">正确的选酒方法是什么？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多尝试</strong>——不要只喝一种酒，多尝试不同的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>做记录</strong>——记录自己喝过的酒，找到自己喜欢的风格</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>问朋友</strong>——问问朋友喜欢什么酒，参考他们的意见</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参加品酒会</strong>——参加品酒会可以快速了解不同的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信自己的舌头</strong>——自己的感受最重要</li></ul></section>' +
  '<h3>🎯 选酒的实用技巧</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选酒的实用技巧：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看酒标</strong>——酒标上有产区、品种、年份等信息</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看价格</strong>——不要只看价格，关注性价比</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>看评价</strong>——看看其他人的评价，但不要迷信</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>问店员</strong>——问问店员的推荐，但不要完全相信</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>买小瓶装</strong>——先买小瓶装试试，好喝再买大瓶</li></ul></section>' +
  '<h3>🚫 选酒的禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选酒时，这些禁忌要避免：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要跟风</strong>——不要因为别人买你也买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要冲动</strong>——不要因为促销就冲动购买</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要迷信</strong>——不要迷信品牌、评分、年份</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要忽视</strong>——不要忽视自己的口味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要放弃</strong>——选酒需要时间和经验，不要放弃</li></ul></section>' +
  '<h3>📊 选酒速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>推荐酒款</th><th>价格范围</th></tr><tr><td>日常饮用</td><td>智利赤霞珠、澳洲西拉</td><td>50-150元</td></tr><tr><td>朋友聚会</td><td>波尔多中级庄、意大利基安蒂</td><td>100-300元</td></tr><tr><td>重要场合</td><td>勃艮第黑皮诺、纳帕谷赤霞珠</td><td>300-800元</td></tr><tr><td>特殊场合</td><td>波尔多列级庄、勃艮第特级园</td><td>800元以上</td></tr><tr><td>送礼</td><td>奔富、拉菲传说</td><td>200-500元</td></tr></table></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#42a5f5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'选酒没有标准答案，适合你的才是最好的。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选酒的关键是找到适合自己的酒。不要被品牌、价格、评分迷惑，相信自己的舌头，多尝试，你一定能找到自己喜欢的酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你选酒时犯过什么错误？<br/>你有什么选酒技巧？<br/>欢迎在评论区分享你的经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '为什么你总选不到好酒？选酒的真相',
      author: '红樽坊',
      digest: '每次买酒都踩坑？不是你运气差，而是你犯了这些选酒错误。这篇指南帮你避开选酒陷阱。',
      content: gen(),
      coverImage: 'wine_pick_cover_ai.png',
      category: 'opinion',
      tags: ["选酒", "避坑", "错误", "真相", "实用"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_pick_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Pick, media_id:', d.data.media_id);
  }catch(e){
    console.error('Pick:', e.message);
    process.exit(1);
  }
}

main();
