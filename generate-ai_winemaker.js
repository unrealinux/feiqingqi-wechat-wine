const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzBkNDdhMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkueahOacquadpTwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+QUnphb/phZLluIjml7bku6M8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+5py65Zmo6IO96YW/5Ye65aW96YWS5ZCXPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNDAwIiB4Mj0iMTAwMCIgeTI9IjQwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjODg4IiBmb250LXNpemU9IjEzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+57qi5qi95Z2KIHwg5pyq5p2l6LaL5Yq/PC90ZXh0Pgo8L3N2Zz4=";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #0d47a1; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #0d47a1; border-bottom: 2px solid #42a5f5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #0d47a1; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#0d47a1;">葡萄酒的未来：AI酿酒师时代</h2>' +
  '<p style="text-align:center;color:#666;">机器能酿出好酒吗</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">机器能酿出好酒吗？AI正在改变葡萄酒行业，从葡萄种植到酿造，AI无处不在。这篇指南带你了解AI如何改变葡萄酒的未来。</p></section>' +
  '<h3>🤖 AI在葡萄酒行业的应用</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI正在改变葡萄酒行业的方方面面：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>葡萄种植</strong>——AI可以监测葡萄园，预测病虫害</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>采摘决策</strong>——AI可以分析葡萄成熟度，决定最佳采摘时间</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酿造过程</strong>——AI可以控制发酵过程，优化酿造参数</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质检测</strong>——AI可以检测酒质，预测酒的风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场预测</strong>——AI可以预测市场需求，优化定价</li></ul></section>' +
  '<h3>🍷 AI酿酒师的优势</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI酿酒师有什么优势？</p>' +
  '<h3>🤔 AI酿酒师的劣势</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI酿酒师有什么劣势？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>缺乏创造力</strong>——AI只能按程序运行，缺乏创造力</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>缺乏经验</strong>——AI没有人类的经验和直觉</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>成本高</strong>——AI系统的成本很高</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>依赖数据</strong>——AI需要大量数据才能工作</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>缺乏人情味</strong>——AI酿的酒缺乏人情味</li></ul></section>' +
  '<h3>🌍 AI酿酒师的案例</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI酿酒师已经在实际应用中：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>波尔多</strong>——有些酒庄已经开始使用AI监控葡萄园</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>纳帕谷</strong>——有些酒庄使用AI优化酿造过程</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>澳大利亚</strong>——有些酒庄使用AI预测市场需求</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>中国</strong>——有些酒庄开始尝试AI酿酒</li></ul></section>' +
  '<h3>📊 AI vs 人类酿酒师</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>方面</th><th>AI酿酒师</th><th>人类酿酒师</th></tr><tr><td>精准度</td><td>★★★★★</td><td>★★★☆☆</td></tr><tr><td>创造力</td><td>★☆☆☆☆</td><td>★★★★★</td></tr><tr><td>经验</td><td>★★☆☆☆</td><td>★★★★★</td></tr><tr><td>成本</td><td>★★☆☆☆</td><td>★★★★☆</td></tr><tr><td>效率</td><td>★★★★★</td><td>★★★☆☆</td></tr><tr><td>人情味</td><td>★☆☆☆☆</td><td>★★★★★</td></tr></table></section>' +
  '<h3>💡 AI酿酒的未来</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI酿酒的未来会怎样？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>人机协作</strong>——AI辅助人类酿酒师，而不是取代</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>个性化酿造</strong>——AI可以根据个人口味定制酒款</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>智能葡萄园</strong>——AI可以完全自动化管理葡萄园</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质预测</strong>——AI可以预测酒的品质和风味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场预测</strong>——AI可以预测市场需求，优化生产</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#42a5f5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'AI不会取代人类酿酒师，但会改变酿酒的方式。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">AI正在改变葡萄酒行业，但人类酿酒师的经验和创造力仍然不可替代。未来的葡萄酒行业，将是人机协作的时代。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你愿意喝AI酿的酒吗？<br/>你觉得AI会取代人类酿酒师吗？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒的未来：AI酿酒师时代来了',
      author: '红樽坊',
      digest: '机器能酿出好酒吗？AI正在改变葡萄酒行业，从葡萄种植到酿造，AI无处不在。',
      content: gen(),
      coverImage: 'ai_winemaker_cover_ai.png',
      category: 'trends',
      tags: ["AI", "科技", "未来", "趋势", "创新"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'ai_winemaker_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('AI, media_id:', d.data.media_id);
  }catch(e){
    console.error('AI:', e.message);
    process.exit(1);
  }
}

main();
