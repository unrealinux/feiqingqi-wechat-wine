const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izg4MGU0ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuS4gOS4quS6uuWWnemFkueahDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+MTDkuKrnkIbnlLE8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+54us6aWu77yM5piv5LiO6Ieq5bex5a+56K+d55qE5pyA5aW95pa55byPPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNDAwIiB4Mj0iMTAwMCIgeTI9IjQwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjEzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+57qi5qi95Z2KIHwg5oKm5bex5pe25Yi7PC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #880e4f; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #880e4f; border-bottom: 2px solid #e91e63; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #880e4f; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#880e4f;">一个人喝酒的10个理由</h2>' +
  '<p style="text-align:center;color:#666;">不是孤独，是自由</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">在这个喧嚣的世界里，我们总是在扮演各种角色：员工、子女、伴侣、朋友……但有时候，我们只想做回自己。一个人喝酒，不是孤独，而是与自己对话的最好方式。</p></section>' +
  '<h3>🍷 理由一：不需要迁就别人的口味</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">和朋友喝酒，总要照顾大家的口味：有人不喝红的，有人不喝白的，有人不喝甜的……但一个人喝酒，你想喝什么就喝什么。想尝尝那瓶觊觎已久的勃艮第？开！想试试那款新到的自然酒？开！</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不用解释，不用商量，不用妥协。这一刻，酒是为你一个人存在的。</p>' +
  '<h3>🍷 理由二：放慢节奏，感受当下</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一个人喝酒时，没有人会催促你\'干杯\'。你可以慢慢品味每一口酒的变化，感受香气在口腔中的层次，观察酒液在杯中的挂杯。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这种放慢的节奏，在快节奏的生活中，是一种奢侈的享受。</p>' +
  '<h3>🍷 理由三：与自己对话</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">独饮是最好的自我反思时刻。没有外界的干扰，你可以诚实地面对自己的内心：今天过得怎么样？有什么收获？有什么遗憾？</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一杯酒，一段独处的时间，往往能带来意想不到的清醒和洞察。</p>' +
  '<h3>🍷 理由四：释放压力，但不依赖酒精</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一个人喝酒，不是为了借酒消愁，而是为了释放一天的压力。有节制的独饮，是一种健康的解压方式。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">关键在于\'有节制\'——一杯就好，享受那份微醺的感觉，但不依赖酒精来解决问题。</p>' +
  '<h3>🍷 理由五：享受仪式感</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一个人喝酒，也可以很有仪式感：选一只喜欢的酒杯，点一支蜡烛，放一首喜欢的音乐，配一份精致的小食。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这种仪式感，不是做给别人看的，而是对自己的尊重和爱护。</p>' +
  '<h3>🍷 理由六：探索味蕾的无限可能</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一个人喝酒时，可以更专注地探索酒的风味。没有人在旁边分散注意力，你可以细细品味每一款酒的独特之处。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">也许你会发现，原来这款酒有那么多层次的香气；原来那个产区的酒是这个风格；原来这个葡萄品种这么有趣。</p>' +
  '<h3>🍷 理由七：随心所欲的时间</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">想在下午三点喝一杯？可以。想在深夜独自小酌？也可以。一个人喝酒，时间完全由你掌控。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不用迁就别人的时间表，不用赶着赴约，不用在意\'现在喝酒是不是太早了\'。</p>' +
  '<h3>🍷 理由八：培养独立人格</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">学会独处，是成熟的标志之一。一个人喝酒，是练习独处的绝佳方式。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">当你能够享受一个人的时光，你就不再需要依赖他人来获得快乐。这种独立，是真正的自由。</p>' +
  '<h3>🍷 理由九：记录生活，沉淀思考</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">独饮时，常常会有灵感的闪现。很多人在独饮时写下了日记、文章，甚至完成了重要的创作。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">一杯酒，一本笔记，一个安静的夜晚——这是最好的创作时光。</p>' +
  '<h3>🍷 理由十：这是一种选择</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">最重要的一点：一个人喝酒，是一种选择，不是被迫。你不是因为没人陪才喝酒，而是因为你选择了与自己相处。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这种选择的权力，本身就是一种奢侈。</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#e91e63,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'独处不是孤独，而是与自己相遇的最好时机。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">在这个总是要求我们\'合群\'的社会里，一个人喝酒是一种小小的叛逆。它提醒我们：我们有权选择如何度过自己的时光，有权与自己相处，有权享受一个人的自由。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">所以下次当你想一个人喝一杯时，不要犹豫。打开那瓶你喜欢的酒，倒上一杯，敬自己。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有过一个人喝酒的时刻吗？<br/>那是什么样的体验？<br/>欢迎在评论区分享你的独饮故事。</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '一个人喝酒的10个理由',
      author: '红樽坊',
      digest: '不是孤独，是自由。不是借酒消愁，是与自己对话。在这个喧嚣的世界里，独饮是一种奢侈的自我关怀。',
      content: gen(),
      coverImage: 'solo_drinking_cover_ai.png',
      category: 'lifestyle',
      tags: ["独饮", "一个人喝酒", "悦己", "自由", "自我关怀"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'solo_drinking_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Solo Drinking, media_id:', d.data.media_id);
  }catch(e){
    console.error('Solo Drinking:', e.message);
    process.exit(1);
  }
}

main();
