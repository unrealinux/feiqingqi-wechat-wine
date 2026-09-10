const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRhMTQ4YyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4lueVjDXlpKflkI3luoTnmoTmlYXkuos8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZGRkIiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0ic2VyaWYiPuavj+S4gOeTtumDveaYr+S8oOWlhzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiYmIiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7mi4noj7LjgIHmnKjmoZDjgIHnjpvmrYzjgIHkvq/kvK/njovjgIHmi4nlm748L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7nuqLmqL3lnYogfCDlk4HniYzmlYXkuos8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #4a148c; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #4a148c; border-bottom: 2px solid #ce93d8; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #4a148c; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#4a148c;">世界5大名庄的故事</h2>' +
  '<p style="text-align:center;color:#666;">每一瓶都是传奇 | 拉菲 · 木桐 · 玛歌 · 侯伯王 · 拉图</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">1855年，巴黎世博会期间，法国皇帝拿破仑三世下令对波尔多葡萄酒进行分级。经过激烈讨论，5家酒庄被评定为\'一级庄\'（Premier Grand Cru Classé），从此改变了波尔多的历史。</p></section>' +
  '<h3>👑 1855年列级庄评定</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">1855年的列级庄评定，是基于酒庄的声誉和酒价进行的。当时，波尔多有数千家酒庄，但只有5家被评为一级庄。这个名单从那时起几乎没有变化，成为波尔多最权威的分级制度。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">170年过去了，这五家酒庄依然是波尔多的巅峰代表。它们的酒，一瓶难求，价格昂贵，但品质始终如一。</p>' +
  '<h3>🏰 拉菲古堡（Château Lafite Rothschild）</h3>' +
  '<h3>🍷 木桐酒庄（Château Mouton Rothschild）</h3>' +
  '<h3>🌹 玛歌酒庄（Château Margaux）</h3>' +
  '<h3>🏰 侯伯王酒庄（Château Haut-Brion）</h3>' +
  '<h3>🏰 拉图酒庄（Château Latour）</h3>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#ce93d8,transparent);margin:25px 0;"></div>' +
  '<h3>📊 五大名庄对比</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒庄</th><th>创立时间</th><th>主要品种</th><th>风格特点</th><th>参考价格</th></tr><tr><td>拉菲</td><td>1234年</td><td>赤霞珠70%</td><td>优雅细腻</td><td>¥5000-10000</td></tr><tr><td>木桐</td><td>1853年</td><td>赤霞珠85%</td><td>浓郁强劲</td><td>¥5000-8000</td></tr><tr><td>玛歌</td><td>16世纪</td><td>赤霞珠75%</td><td>丝滑优雅</td><td>¥4000-7000</td></tr><tr><td>侯伯王</td><td>1525年</td><td>赤霞珠45%</td><td>复杂深邃</td><td>¥4000-6000</td></tr><tr><td>拉图</td><td>14世纪</td><td>赤霞珠75%</td><td>强劲持久</td><td>¥5000-9000</td></tr></table></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你最想尝试哪一家名庄的酒？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '世界5大名庄的故事：每一瓶都是传奇',
      author: '红樽坊',
      digest: '从1855年列级庄评定到今天，这五家酒庄代表了波尔多的最高水准。每一瓶酒的背后，都有一段传奇故事。',
      content: gen(),
      coverImage: 'five_great_estates_cover_ai.png',
      category: 'brand-story',
      tags: ["名庄", "波尔多", "拉菲", "木桐", "玛歌", "侯伯王", "拉图"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'five_great_estates_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('5 Great Estates, media_id:', d.data.media_id);
  }catch(e){
    console.error('5 Great Estates:', e.message);
    process.exit(1);
  }
}

main();
