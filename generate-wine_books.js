const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjM3ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuWFpemXqOS5puWNleaOqOiNkDwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5LuO5YWl6Zeo5Yiw57K+6YCaPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjEw5pys5b+F6K+76JGh6JCE6YWS5Lmm57GNPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNDAwIiB4Mj0iMTAwMCIgeTI9IjQwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjEzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+57qi5qi95Z2KIHwg55+l6K+G5YiG5LqrPC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1a237e; border-bottom: 2px solid #5c6bc0; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1a237e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1a237e;">葡萄酒入门书单推荐：从入门到精通</h2>' +
  '<p style="text-align:center;color:#666;">10本必读葡萄酒书籍</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">想学葡萄酒却不知道从哪里开始？葡萄酒的世界博大精深，选对书可以事半功倍。这10本必读葡萄酒书籍，帮你从入门到精通。</p></section>' +
  '<h3>📚 选书原则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">选择葡萄酒书籍，遵循这几个原则：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>权威性</strong>——选择知名作者或机构出版的书籍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>实用性</strong>——选择有实际操作指导的书籍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>趣味性</strong>——选择读起来有趣的书籍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>时效性</strong>——选择近期出版的书籍</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>个人需求</strong>——根据自己的水平和需求选择</li></ul></section>' +
  '<h3>📖 入门级书籍</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你是葡萄酒新手，从这些书开始：</p>' +
  '<h3>📖 进阶级书籍</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你想深入了解葡萄酒，读这些书：</p>' +
  '<h3>📖 专业级书籍</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你想成为葡萄酒专家，读这些书：</p>' +
  '<h3>📊 书籍选择速查表</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>水平</th><th>推荐书籍</th><th>理由</th></tr><tr><td>完全零基础</td><td>《葡萄酒入门》</td><td>通俗易懂，图文并茂</td></tr><tr><td>有点基础</td><td>《世界葡萄酒地图》</td><td>了解产区，开阔视野</td></tr><tr><td>想全面了解</td><td>《葡萄酒圣经》</td><td>内容全面，权威</td></tr><tr><td>想提升品酒</td><td>《品酒：葡萄酒的味道》</td><td>实用性强</td></tr><tr><td>想深入了解</td><td>《葡萄酒的科学》</td><td>科学性强</td></tr></table></section>' +
  '<h3>💡 读书小贴士</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个小贴士，让你的葡萄酒学习更高效：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>边读边喝</strong>——读书时搭配喝酒，理论联系实践</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>做笔记</strong>——记录重要的知识点</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>参加品酒会</strong>——参加品酒会可以实践所学知识</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>与人交流</strong>——与其他葡萄酒爱好者交流</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>持续学习</strong>——葡萄酒的世界博大精深，要持续学习</li></ul></section>' +
  '<h3>🚫 读书禁忌</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">读书时，这些禁忌要注意：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要贪多</strong>——不要同时读太多书，一本一本读</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要死记硬背</strong>——理解比记忆更重要</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要脱离实践</strong>——读书要结合实践</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要盲目相信</strong>——要有自己的判断</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要放弃</strong>——学习葡萄酒需要时间和耐心</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#5c6bc0,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'读书破万卷，下笔如有神。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒的世界博大精深，选对书，持续学习，你也可以成为葡萄酒专家。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你读过哪些葡萄酒书籍？<br/>你觉得哪本书最好？<br/>欢迎在评论区分享你的读书经验！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒入门书单推荐：从入门到精通',
      author: '红樽坊',
      digest: '想学葡萄酒却不知道从哪里开始？这10本必读葡萄酒书籍，帮你从入门到精通。',
      content: gen(),
      coverImage: 'wine_books_cover_ai.png',
      category: 'education',
      tags: ["书籍", "入门", "学习", "知识", "推荐"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_books_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Books, media_id:', d.data.media_id);
  }catch(e){
    console.error('Books:', e.message);
    process.exit(1);
  }
}

main();
