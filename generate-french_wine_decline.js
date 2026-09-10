const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260615'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjM3ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuazleWbvemFkuS4jeWmguS7juWJjeS6hu+8nzwvdGV4dD4KPHRleHQgeD0iNjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNkZGQiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+55yf55u45Y+v6IO96aKg6KaG6K6k55+lPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuazleWbvemFkueahOi+ieeFjOi/mOWcqOWQlzwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPue6ouaoveWdiiB8IOa3seW6puingueCuTwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1a237e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1a237e; border-bottom: 2px solid #3f51b5; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1a237e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1a237e;">法国酒不如从前了？</h2>' +
  '<p style="text-align:center;color:#666;">真相可能颠覆认知</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">法国酒还是世界第一吗？从波尔多到勃艮第，法国酒的辉煌还在吗？这篇指南带你了解法国酒的真相，颠覆你的认知。</p></section>' +
  '<h3>📉 法国酒的衰落</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国酒确实在衰落：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>市场份额下降</strong>——法国酒在全球市场的份额在下降</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>新世界崛起</strong>——美国、澳大利亚、智利等新世界国家崛起</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>价格虚高</strong>——法国酒价格虚高，性价比下降</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>创新不足</strong>——法国酒传统有余，创新不足</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>年轻消费者流失</strong>——年轻人更喜欢新世界酒</li></ul></section>' +
  '<h3>🤔 为什么法国酒衰落？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国酒衰落的原因：</p>' +
  '<h3>🌟 法国酒的优势</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国酒仍然有这些优势：</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>历史底蕴</strong>——法国酒有千年的历史底蕴</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>风土条件</strong>——法国的风土条件仍然得天独厚</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>酿造传统</strong>——法国的酿造传统仍然世界一流</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品质保证</strong>——法国酒的品质仍然有保证</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌价值</strong>——法国酒的品牌价值仍然很高</li></ul></section>' +
  '<h3>🌍 新世界的崛起</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">新世界国家为什么能崛起？</p>' +
  '<h3>📊 法国酒 vs 新世界酒</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>方面</th><th>法国酒</th><th>新世界酒</th></tr><tr><td>历史</td><td>千年历史</td><td>几百年历史</td></tr><tr><td>传统</td><td>传统深厚</td><td>创新精神</td></tr><tr><td>价格</td><td>价格虚高</td><td>性价比高</td></tr><tr><td>品质</td><td>品质保证</td><td>品质稳定</td></tr><tr><td>创新</td><td>创新不足</td><td>敢于创新</td></tr><tr><td>市场</td><td>份额下降</td><td>份额上升</td></tr></table></section>' +
  '<h3>💡 法国酒的未来</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国酒的未来在哪里？</p>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>创新</strong>——法国酒需要创新，吸引年轻消费者</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>性价比</strong>——法国酒需要提高性价比</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>品牌营销</strong>——法国酒需要加强品牌营销</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>多元化</strong>——法国酒需要多元化发展</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;"><strong>国际化</strong>——法国酒需要更国际化</li></ul></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#3f51b5,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">\'法国酒的辉煌还在，但需要改变。\'</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">法国酒仍然有辉煌的历史和品质，但需要改变才能适应现代市场。创新、性价比、品牌营销是法国酒未来的关键。</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">你觉得法国酒还行吗？<br/>你更喜欢法国酒还是新世界酒？<br/>欢迎在评论区分享你的看法！</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '法国酒不如从前了？真相可能颠覆认知',
      author: '红樽坊',
      digest: '法国酒还是世界第一吗？从波尔多到勃艮第，法国酒的辉煌还在吗？这篇指南带你了解法国酒的真相。',
      content: gen(),
      coverImage: 'french_wine_decline_cover_ai.png',
      category: 'opinion',
      tags: ["法国", "波尔多", "勃艮第", "衰落", "真相"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'french_wine_decline_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('France, media_id:', d.data.media_id);
  }catch(e){
    console.error('France:', e.message);
    process.exit(1);
  }
}

main();
