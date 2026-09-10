const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjk1YyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkueahOWMluWtpjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5L2g5Zad55qE5Yiw5bqV5piv5LuA5LmI77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuS7juWIhuWtkOinkuW6puaHgumFkjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOefpeivhuenkeaZrjwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #00695c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #00695c; border-bottom: 2px solid #26a69a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #00695c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#00695c;">葡萄酒的化学：你喝的到底是什么？</h2>' +
  '<p style="text-align:center;color:#666;">从分子角度懂酒</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">从分子角度懂酒。单宁、酸度、酒精、风味物质，这些化学成分决定了葡萄酒的口感。了解这些，你就能更懂酒。</p></section>' +
  '<h3>🔬 葡萄酒的成分</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒主要由这些成分构成：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>成分</th><th>占比</th><th>作用</th></tr><tr><td>水</td><td>85-90%</td><td>基础成分</td></tr><tr><td>酒精</td><td>10-15%</td><td>提供酒体和灼热感</td></tr><tr><td>糖分</td><td>0-10%</td><td>提供甜味</td></tr><tr><td>酸</td><td>0.5-1%</td><td>提供清爽感</td></tr><tr><td>单宁</td><td>0-0.5%</td><td>提供涩感和结构</td></tr><tr><td>风味物质</td><td>微量</td><td>提供香气和风味</td></tr></table></section>' +
  '<h3>🧪 单宁：红酒的灵魂</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">单宁是红酒的灵魂：</p>' +
  '<h3>🍋 酸度：清爽的来源</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酸度是清爽的来源：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酒石酸</strong>——葡萄中的主要酸</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>苹果酸</strong>——提供清爽感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>乳酸</strong>——发酵产生的酸，更柔和</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>柠檬酸</strong>——提供柑橘类香气</li></ul></section>' +
  '<h3>🍷 酒精：力量的来源</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">酒精是力量的来源：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>来源</strong>——葡萄中的糖分发酵产生</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>作用</strong>——提供酒体和灼热感</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>范围</strong>——通常在10-15%之间</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>影响</strong>——酒精度越高，酒体越饱满</li></ul></section>' +
  '<h3>🌸 风味物质：香气的来源</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">风味物质是香气的来源：</p>' +
  '<h3>📊 化学成分与口感的关系</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>化学成分</th><th>口感</th><th>例子</th></tr><tr><td>高单宁</td><td>涩感强</td><td>赤霞珠、内比奥罗</td></tr><tr><td>低单宁</td><td>柔顺</td><td>黑皮诺、佳美</td></tr><tr><td>高酸度</td><td>清爽</td><td>长相思、雷司令</td></tr><tr><td>低酸度</td><td>圆润</td><td>霞多丽、维欧尼</td></tr><tr><td>高酒精</td><td>饱满</td><td>西拉、仙粉黛</td></tr><tr><td>低酒精</td><td>轻盈</td><td>莫斯卡托、雷司令</td></tr></table></section>' +
  '<h3>💡 了解化学的好处</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">了解葡萄酒化学有什么好处？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更懂酒</strong>——了解酒的构成，更懂酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更会选</strong>——根据化学成分选酒，更精准</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更会品</strong>——了解化学成分，更能品味细节</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更会配</strong>——根据化学成分配餐，更和谐</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>更会存</strong>——了解化学变化，更会储存</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26a69a,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'了解化学，才能真正懂酒。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的化学是葡萄酒知识的基础。了解单宁、酸度、酒精、风味物质，你就能更懂酒，更会喝酒。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你知道葡萄酒的化学成分吗？<br/>你最在意酒的哪个化学成分？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒的化学：你喝的到底是什么？',
      author: '红樽坊',
      digest: '从分子角度懂酒。单宁、酸度、酒精、风味物质，这些化学成分决定了葡萄酒的口感。',
      content: gen(),
      coverImage: 'wine_chemistry_cover_ai.png',
      category: 'education',
      tags: ["化学", "科学", "分子", "成分", "知识"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_chemistry_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Chemistry, media_id:', d.data.media_id);
  }catch(e){
    console.error('Chemistry:', e.message);
    process.exit(1);
  }
}

main();
