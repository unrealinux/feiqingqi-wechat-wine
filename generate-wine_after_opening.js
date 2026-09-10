const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260614'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJlN2QzMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuiRoeiQhOmFkuW8gOeTtuWQjjwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6IO95pS+5aSa5LmF77yfPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPui2heWunueUqOaMh+WNlyDCtyDlu7bplb/kv53pspznmoTnp5jor4A8L3RleHQ+CjxsaW5lIHgxPSIyMDAiIHkxPSI0MDAiIHgyPSIxMDAwIiB5Mj0iNDAwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiLz4KPHRleHQgeD0iNjAwIiB5PSI0NDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7nuqLmqL3lnYogfCDlrp7nlKjlubLotKc8L3RleHQ+Cjwvc3ZnPg==";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #2e7d32; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #2e7d32; border-bottom: 2px solid #66bb6a; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #2e7d32; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#2e7d32;">葡萄酒开瓶后能放多久？</h2>' +
  '<p style="text-align:center;color:#666;">超实用指南 | 延长保鲜的秘诀</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">很多人以为葡萄酒开瓶后只能放几天，其实不同酒款的保鲜时间差异很大。白葡萄酒、红葡萄酒、起泡酒、加强酒……每种酒的保鲜方法都不一样。这篇指南，帮你搞清楚所有细节。</p></section>' +
  '<h3>⏱️ 不同酒款的保鲜时间</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">开瓶后的葡萄酒，保鲜时间取决于酒的类型、储存条件和是否使用保鲜工具。以下是各种酒款的参考保鲜时间：</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>酒款类型</th><th>常温保存</th><th>冰箱保存</th><th>使用真空泵</th></tr><tr><td>白葡萄酒</td><td>1-2天</td><td>3-5天</td><td>5-7天</td></tr><tr><td>红葡萄酒</td><td>2-3天</td><td>3-5天</td><td>5-7天</td></tr><tr><td>起泡酒</td><td>1天</td><td>1-2天</td><td>2-3天</td></tr><tr><td>加强酒（波特/雪莉）</td><td>7-14天</td><td>14-21天</td><td>21-30天</td></tr><tr><td>自然酒</td><td>1天</td><td>2-3天</td><td>3-5天</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 关键发现</h4><p style="color:#333;line-height:1.8;margin:0"><strong>冰箱是开瓶葡萄酒最好的朋友。</strong>低温可以显著延缓氧化过程，将保鲜时间延长2-3倍。即使是红葡萄酒，开瓶后放入冰箱也能多保存2-3天。</p></div></section>' +
  '<h3>🔍 为什么葡萄酒开瓶后会变质？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">葡萄酒开瓶后变质的根本原因是<strong>氧化</strong>。当酒液与空气接触，氧气会加速酒中化学物质的反应，导致香气流失、口感变酸、颜色变深。</p>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">此外，醋酸菌（Acetobacter）会在有氧环境下繁殖，将酒精转化为醋酸，让酒变酸。温度越高，醋酸菌繁殖越快。这就是为什么低温保存如此重要。</p>' +
  '<h3>🍷 如何延长开瓶后的保鲜期？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下是一些实用的技巧，帮助你延长开瓶后葡萄酒的保鲜期：</p>' +
  '<h3 style="border-bottom:none;">方法一：使用真空泵</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">真空泵可以抽出瓶中的空气，减少氧化。这是最简单有效的保鲜方法。市面上的真空泵价格从几十元到几百元不等，推荐购买带有真空塞的套装。</p>' +
  '<h3 style="border-bottom:none;">方法二：换瓶保存</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">将剩余的酒倒入一个小酒瓶中，尽量装满，然后密封保存。这样可以减少瓶中空气的体积，延缓氧化。</p>' +
  '<h3 style="border-bottom:none;">方法三：使用惰性气体</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">惰性气体（如氩气或氮气）可以覆盖在酒液表面，隔绝氧气。专业酒吧常用这种方法，家用版本也可以买到。</p>' +
  '<h3 style="border-bottom:none;">方法四：低温保存</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">无论使用哪种方法，低温保存都是基础。将开瓶的葡萄酒放入冰箱（4-8°C），可以显著延长保鲜时间。</p>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>⚠️ 注意事项</h4><p style="color:#333;line-height:1.8;margin:0"><strong>红葡萄酒开瓶后放入冰箱前，不需要回温。</strong>直接放入冰箱，饮用前提前15-30分钟取出即可。低温不会损害红葡萄酒的品质，反而能保持其新鲜度。</p></div></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<h3>🚫 如何判断酒是否变质？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">即使采取了保鲜措施，葡萄酒最终还是会变质。以下是一些判断酒是否变质的方法：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>闻起来像醋或指甲油</strong>——这是醋酸菌繁殖的标志，酒已经变质</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>颜色变深或变棕</strong>——严重氧化的迹象</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>口感变得尖锐、酸涩</strong>——酒的平衡已被破坏</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>失去果香，只有酒精味</strong>——香气已经流失</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>出现霉味或湿纸板味</strong>——软木塞污染（虽然开瓶后较少见）</li></ul></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>💡 小贴士</h4><p style="color:#333;line-height:1.8;margin:0"><strong>不确定是否变质？闻一下。</strong>如果闻起来有任何不愉快的气味，就不要喝了。变质的酒虽然不会对健康造成危害，但口感会很差。</p></div></section>' +
  '<h3>📅 各类酒款的最佳饮用时间</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下是一些常见酒款开瓶后的最佳饮用时间窗口：</p>' +
  '<div class="ri"><h4>清爽型白葡萄酒（长相思、雷司令） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">趁新鲜</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后1-3天内饮用最佳。这些酒以新鲜果香为特色，放置太久会失去活力。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：当天-3天</p></div>' +
  '<div class="ri"><h4>饱满型白葡萄酒（霞多丽） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">较稳定</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后3-5天内饮用。经过橡木桶陈年的霞多丽，结构更稳定，可以保存更久。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：1-5天</p></div>' +
  '<div class="ri"><h4>轻盈型红葡萄酒（黑皮诺、佳美） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">尽快饮用</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后2-3天内饮用。这些酒的单宁较少，更容易氧化。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：1-3天</p></div>' +
  '<div class="ri"><h4>饱满型红葡萄酒（赤霞珠、西拉） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">较耐放</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后3-5天内饮用。高单宁和高酒精度提供了更好的抗氧化能力。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：2-5天</p></div>' +
  '<div class="ri"><h4>起泡酒（香槟、Prosecco） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">气泡是关键</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后1天内饮用。气泡流失后，口感会大打折扣。使用起泡酒塞可以延长到2-3天。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：当天</p></div>' +
  '<div class="ri"><h4>加强酒（波特、雪莉） <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">最耐放</span></h4><p style="color:#333;line-height:1.8;margin:0">开瓶后可以保存2-4周。高酒精度和糖分提供了天然的防腐能力。</p><p style="color:#66bb6a;font-weight:bold;margin:5px 0 0 0;">最佳：1-4周</p></div>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#66bb6a,transparent);margin:25px 0;"></div>' +
  '<h3>🎯 总结：开瓶后的黄金法则</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">记住这几个简单的原则，就能让开瓶后的葡萄酒保持最佳状态：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>冰箱是你最好的朋友</strong>——无论红白，开瓶后都放入冰箱</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>真空泵是必备工具</strong>——投资一个真空泵，能省下很多酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>尽快饮用</strong>——开瓶后的酒，最好在3天内喝完</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>相信你的鼻子</strong>——闻到不愉快的气味，就不要喝了</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>小瓶分装</strong>——如果喝不完，分成小瓶保存</li></ul></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你有什么保存开瓶葡萄酒的独门秘诀？<br/>欢迎在评论区分享你的经验和推荐工具！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '葡萄酒开瓶后能放多久？超实用指南',
      author: '红樽坊',
      digest: '白葡萄酒3天，红葡萄酒5天？错！不同酒款的保鲜时间差异巨大。这篇指南教你如何延长开瓶后的保鲜期。',
      content: gen(),
      coverImage: 'wine_after_opening_cover_ai.png',
      category: 'practical-guide',
      tags: ["开瓶", "储存", "保鲜", "保存", "实用技巧"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'wine_after_opening_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('Wine Storage After Opening, media_id:', d.data.media_id);
  }catch(e){
    console.error('Wine Storage After Opening:', e.message);
    process.exit(1);
  }
}

main();
