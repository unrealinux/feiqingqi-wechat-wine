const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjA2NCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuS4juWBpeW6tzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+5Zad5aSa5bCR5omN5ZCI6YCC77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuenkeWtpumlrumFku+8jOS6q+WPl+eUn+a0uzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOWBpeW6t+aMh+WNlzwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #006064; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #006064; border-bottom: 2px solid #26c6da; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #006064; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#006064;">葡萄酒与健康：喝多少才合适？</h2>' +
  '<p style="text-align:center;color:#666;">科学饮酒，享受生活</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">\'适量饮酒有益健康\'——这个说法你一定听过。但事实真的如此吗？从科学角度解读葡萄酒与健康的关系，告诉你每天喝多少最合适。</p></section>' +
  '<h3>🔬 葡萄酒中的健康成分</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒中确实含有一些有益健康的成分：</p>' +
  '<h3>⚠️ 世界卫生组织的最新立场</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">2023年，世界卫生组织（WHO）发布了最新的酒精与健康报告，明确指出：</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这意味着，从健康角度出发，最好的选择是不喝酒。但如果你选择喝酒，应该了解风险并控制饮酒量。</p>' +
  '<h3>📊 不同饮酒量的健康风险</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">不同饮酒量对健康的影响：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>饮酒量</th><th>健康风险</th><th>建议</th></tr><tr><td>不饮酒</td><td>最低风险</td><td>最健康的选择</td></tr><tr><td>少量（女性1杯/天，男性1-2杯/天）</td><td>风险略增</td><td>可以接受，但需注意</td></tr><tr><td>中等（女性2-3杯，男性3-4杯）</td><td>风险明显增加</td><td>建议减少饮酒</td></tr><tr><td>大量（女性4+杯，男性5+杯）</td><td>风险大幅增加</td><td>强烈建议戒酒</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 一杯酒的标准量</h4><p style="color:#333;line-height:1.8;margin:0"><strong>一杯标准量 =</strong><br/>• 150ml 12度葡萄酒<br/>• 35ml 40度烈酒<br/>• 330ml 5度啤酒<br/><br/>很多人不知不觉就喝超了。</p></div></section>' +
  '<h3>🍷 葡萄酒 vs 其他酒精饮品</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果选择喝酒，葡萄酒是否比其他酒精饮品更健康？</p>' +
  '<h3>🏥 特殊人群注意事项</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下人群应该完全避免饮酒：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>孕妇和哺乳期女性</strong>——酒精会影响胎儿和婴儿发育</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>正在服用药物的人</strong>——酒精可能与药物产生相互作用</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>有肝脏疾病的人</strong>——酒精会加重肝脏负担</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>有酒精依赖史的人</strong>——避免触发复饮</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>未成年人</strong>——大脑发育尚未完成</li></ul></section>' +
  '<h3>💡 科学饮酒的建议</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">如果你选择喝酒，这里有几个科学饮酒的建议：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>控制饮酒量</strong>——女性每天不超过1杯，男性不超过2杯</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>不要天天喝</strong>——每周至少有2-3天不喝酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>配餐饮用</strong>——食物可以减缓酒精吸收</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>慢慢喝</strong>——不要干杯，慢慢品味</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多喝水</strong>——每喝一杯酒，喝一杯水</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>选择好酒</strong>——质量比数量更重要</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#26c6da,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'喝酒的最高境界，是享受那一杯的愉悦，而不是追求醉酒的快感。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒是生活的一部分，但不是生活的全部。科学饮酒，享受生活，才是正确的态度。如果你不喝酒，没有必要为了\'健康\'而开始喝酒。如果你喝酒，记得控制量，享受每一杯。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你对葡萄酒与健康有什么看法？<br/>欢迎在评论区分享你的观点！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒与健康：喝多少才合适？',
      author: '红樽坊',
      digest: '适量饮酒有益健康？这个说法靠谱吗？从科学角度解读葡萄酒与健康的关系，告诉你每天喝多少最合适。',
      content: gen(),
      coverImage: 'wine_and_health_cover_ai.png',
      category: 'health',
      tags: ["健康", "养生", "适量饮酒", "科学", "白藜芦醇"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_and_health_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Health, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Health:', e.message);
    process.exit(1);
  }
}

main();
