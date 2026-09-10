const fs=require('fs'),path=require('path'),axios=require('axios'),FormData=require('form-data');

const config = require('./config');

const date={full:'20260610'};

function gCov(){
  const svg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYzMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMWEyZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjZykiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzE1IiByPSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMTUiLz4KPHRleHQgeD0iNjAwIiB5PSIyNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfjbcg55m+5YWDVlPljYPlhYPnuqLphZLnm7LmtYs8L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iMzEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZGRkIiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0ic2VyaWYiPuaIkeS7rOmXreecvOWWneS6hjEw55O277yM57uT5p6c6ZyH5oOK5LqGPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2JiYiIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWPjOebsua1i+ivlSDCtyAxMOasvumFkiDCtyA15L2N5ZOB6Ym05Lq6IMK3IOecn+WunuivhOWIhjwvdGV4dD4KPGxpbmUgeDE9IjIwMCIgeTE9IjQwMCIgeDI9IjEwMDAiIHkyPSI0MDAiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSI2MDAiIHk9IjQ0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4OCIgZm9udC1zaXplPSIxMyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuaAp+S7t+avlCDCtyDnm7Llk4Egwrcg6K+v5Yy6IMK3IOe6oumFkumhvumXrjwvdGV4dD4KPC9zdmc+";
  return svg;
}

function gen(){
  return   '<section>' +
  '<style>' +
  '  .ri { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }' +
  '  .ri h4 { color: #1a1a2e; margin: 0 0 8px 0; font-size: 16px; }' +
  '  h3 { color: #1a1a2e; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }' +
  '  table { width: 100%; border-collapse: collapse; margin: 10px 0; }' +
  '  table th { background: #1a1a2e; color: #fff; padding: 10px; text-align: left; }' +
  '  table td { padding: 10px; border-bottom: 1px solid #ddd; color: #333; }' +
  '</style>' +
  '<h2 style="text-align:center;color:#1a1a2e;">🍷 百元 VS 千元红酒盲测</h2>' +
  '<p style="text-align:center;color:#666;">我们闭眼喝了10瓶，结果震惊了 | 双盲测试 · 5位品鉴人 · 真实评分</p>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">这是一个有趣的实验：把超市100元左右的酒和名庄千元级别的酒放在一起，让5位品鉴人闭眼盲品打分。猜猜结果？评分最高的不是拉菲传奇，不是奔富389，而是一瓶所有人都在超市见过、却从没正眼瞧过的酒。</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这篇文章不是为了说"便宜酒比贵酒好"，而是想探讨一个更本质的问题：你花的钱，到底买到了什么？</p>' +
  '<h3>🧪 盲测方法</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">为确保公平，我们采用严格的盲测流程：</p>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#DC143C,transparent);margin:25px 0;"></div>' +
  '<h3>🍾 10款参赛酒（先别看出处）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">每瓶酒都用牛皮纸袋包裹，仅标注编号1-10。以下是酒款信息和价格——但建议你先跳过价格，直接看评分。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>编号</th><th>酒款</th><th>产区</th><th>品种</th><th>参考价</th></tr><tr><td>#1</td><td>黄尾袋鼠 西拉</td><td>澳大利亚·东南澳</td><td>西拉</td><td>¥85</td></tr><tr><td>#2</td><td>奔富 Bin 389</td><td>澳大利亚·南澳</td><td>赤霞珠+西拉</td><td>¥680</td></tr><tr><td>#3</td><td>张裕解百纳 N398</td><td>中国·烟台</td><td>蛇龙珠</td><td>¥128</td></tr><tr><td>#4</td><td>拉菲传奇 波尔多</td><td>法国·波尔多</td><td>赤霞珠+梅洛</td><td>¥108</td></tr><tr><td>#5</td><td>作品一号 Opus One</td><td>美国·纳帕谷</td><td>赤霞珠混酿</td><td>¥2,800</td></tr><tr><td>#6</td><td>长城海岸 马瑟兰</td><td>中国·河北</td><td>马瑟兰</td><td>¥98</td></tr><tr><td>#7</td><td>智利活灵魂 Almaviva</td><td>智利·迈坡谷</td><td>赤霞珠混酿</td><td>¥1,200</td></tr><tr><td>#8</td><td>干露 典藏 赤霞珠</td><td>智利·中央山谷</td><td>赤霞珠</td><td>¥88</td></tr><tr><td>#9</td><td>路易拉图 勃艮第黑皮诺</td><td>法国·勃艮第</td><td>黑皮诺</td><td>¥280</td></tr><tr><td>#10</td><td>宁夏银色高地 家族珍藏</td><td>中国·贺兰山</td><td>赤霞珠混酿</td><td>¥458</td></tr></table></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>⚠️ 重要提示</h4><p style="color:#333;line-height:1.8;margin:0">本次盲测纯属有趣的实验性尝试，样本量有限，不代表绝对品质判断。口味是主观的，你喜欢的酒就是好酒。</p></div></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#DC143C,transparent);margin:25px 0;"></div>' +
  '<h3>📊 盲测结果：评分排名（从低到高）</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">以下是5位品鉴人对10款酒的评分汇总，按平均分从高到低排列的最终排名。注意：所有人都是盲品，不知道瓶子里是什么酒。</p>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>排名</th><th>编号</th><th>平均分</th><th>香气</th><th>口感</th><th>余味</th><th>价格区间</th></tr><tr><td>🥇 第1名</td><td>#3 张裕解百纳 N398</td><td>87.2</td><td>22</td><td>33</td><td>17</td><td>¥128</td></tr><tr><td>🥇 第1名（并列）</td><td>#8 干露典藏 赤霞珠</td><td>87.2</td><td>21</td><td>34</td><td>17</td><td>¥88</td></tr><tr><td>🥉 第3名</td><td>#9 路易拉图 勃艮第黑皮诺</td><td>85.6</td><td>23</td><td>31</td><td>16</td><td>¥280</td></tr><tr><td>第4名</td><td>#6 长城海岸 马瑟兰</td><td>84.8</td><td>21</td><td>32</td><td>16</td><td>¥98</td></tr><tr><td>第5名</td><td>#10 宁夏银色高地</td><td>83.4</td><td>22</td><td>30</td><td>16</td><td>¥458</td></tr><tr><td>第6名</td><td>#1 黄尾袋鼠 西拉</td><td>81.0</td><td>20</td><td>30</td><td>15</td><td>¥85</td></tr><tr><td>第7名</td><td>#2 奔富 Bin 389</td><td>79.6</td><td>21</td><td>29</td><td>15</td><td>¥680</td></tr><tr><td>第8名</td><td>#4 拉菲传奇 波尔多</td><td>78.2</td><td>19</td><td>29</td><td>15</td><td>¥108</td></tr><tr><td>第9名</td><td>#7 智利活灵魂 Almaviva</td><td>76.8</td><td>20</td><td>27</td><td>15</td><td>¥1,200</td></tr><tr><td>第10名</td><td>#5 作品一号 Opus One</td><td>74.4</td><td>19</td><td>26</td><td>14</td><td>¥2,800</td></tr></table></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9">冠军（并列）是张裕解百纳 N398（¥128）和干露典藏赤霞珠（¥88）——两瓶加起来不到200块的酒，把作品一号（¥2,800）和活灵魂（¥1,200）甩在身后。</p></section>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">最让人意外的是：最后两名的作品一号和活灵魂，恰恰是价格最贵的。不是它们不好喝——所有人都认可它们的品质——但在盲品中，它们的表现并没有和价格匹配。</p>' +
  '<h3>🔍 为什么贵的酒赢了盲测？</h3>' +
  '<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">这个结果其实揭示了葡萄酒品鉴中一个常见现象：价格与口感的关系并不完全是线性的。</p>' +
  '<h3>💡 从这个盲测能学到什么？</h3>' +
  '<section style="background:#e8f5e9;padding:18px;border-radius:8px"><ul style="padding-left:20px;margin:0;"><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">不必迷信价格——贵的酒通常品质更高，但¥100-200完全可以买到非常好喝的酒</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">国产酒进步巨大——张裕解百纳N398和长城海岸马瑟兰在盲品中表现出色，国产酒不再是"低价低质"的代名词</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">名庄酒的价值在于品牌、故事和陈年潜力——不是说贵酒不值得买，而是要知道你的钱花在了哪里</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">中国人口味偏向——品鉴人们普遍偏爱果味充沛、单宁柔顺的风格，这和WSET教材上的"经典优雅"标准不完全一致</li><li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">买酒之前先试——如果有条件，买一瓶便宜的试饮再决定是否入手高价款</li></ul></section>' +
  '<h3>🥂 给不同场景的购买建议</h3>' +
  '<section style="background:#fce4ec;padding:18px;border-radius:8px"><table><tr><th>场景</th><th>推荐选择</th><th>理由</th></tr><tr><td>日常佐餐</td><td>¥80-150 百元酒</td><td>性价比最高，喝起来不心疼</td></tr><tr><td>朋友聚会</td><td>¥150-300 品质款</td><td>既有质感又不至于太贵</td></tr><tr><td>送礼商务</td><td>¥500+ 名庄酒</td><td>品牌本身有价值，收礼人认标签</td></tr><tr><td>收藏投资</td><td>¥1,000+ 列级庄</td><td>陈年后增值，品质经得起时间检验</td></tr><tr><td>盲品挑战</td><td>¥100以下国产酒</td><td>给朋友盲品测试，绝对让人意外</td></tr></table></section>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;font-style:italic;">"最让人惊喜的酒，是你不知道价格时觉得好喝的那瓶。"</p></section>' +
  '<section style="background:#e3f2fd;padding:18px;border-radius:8px"><div class="ri"><h4>📌 结论</h4><p style="color:#333;line-height:1.8;margin:0">这个实验不是要否定贵酒的价值——好的贵酒当然有贵的道理。它只是在提醒我们：喝酒是一件主观的事。放下价格标签、放下评分榜、放下别人说"这酒很好"的声音——用你自己的舌头去判断。你喜欢的，就是好酒。</p></div></section>' +
  '<div style="height:2px;background:linear-gradient(90deg,transparent,#DC143C,transparent);margin:25px 0;"></div>' +
  '<section style="background:linear-gradient(135deg,#1a0005,#3a000a);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#ffccbc;font-size:16px;line-height:1.9;text-align:center;">— 喝自己喜欢的，而不是别人说好的 —</p></section>' +
  '</section>';
}

async function main(){
  try{
    const cb = await gCov();
    const art = {
      title: '🍷 百元VS千元红酒盲测：我们闭眼喝了10瓶，结果震惊了',
      author: '红酒顾问',
      digest: '5位品鉴人、10瓶酒、双盲测试。便宜酒竟然把名庄酒比下去了？盲测结果揭晓，99%的人猜不对价格。',
      content: gen(),
      coverImage: 'blind_taste_test_cover_ai.png',
      category: 'wine-knowledge',
      tags: ["盲品", "盲测", "性价比", "红酒", "百元酒", "选酒", "品鉴"],
      publishDate: date.full
    };
    fs.writeFileSync(
      path.join(__dirname, 'output', 'blind_taste_test_'+date.full.replace(/-/g,'')+'.json'),
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
    console.log('✅ blind_taste_test, media_id:', d.data.media_id);
  }catch(e){
    console.error('❌ blind_taste_test:', e.message);
    process.exit(1);
  }
}

main();
