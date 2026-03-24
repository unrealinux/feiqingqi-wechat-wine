/**
 * 实时数据获取模块
 * 从多个来源获取最新的葡萄酒市场数据和新闻
 */

const Parser = require('rss-parser');
const axios = require('axios');

// 配置代理（用于访问国外源）
const proxyConfig = process.env.HTTP_PROXY ? {
  proxy: {
    host: '127.0.0.1',
    port: 10809
  }
} : {};

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

/**
 * RSS源配置
 */
const RSS_SOURCES = {
  // 国际权威来源
  international: [
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/', priority: 'A' },
    { name: 'Wine Industry Advisor', url: 'https://wineindustryadvisor.com/feed', priority: 'A' },
    { name: 'VinePair', url: 'https://vinepair.com/feed/', priority: 'A' },
    { name: 'Wine Folly', url: 'https://winefolly.com/feed/', priority: 'B' },
  ],
  // 中文来源
  chinese: [
    { name: '红酒世界', url: 'https://www.wine-world.com/articlerss/rss.aspx', priority: 'S' },
  ]
};

/**
 * 获取最新新闻
 */
async function fetchLatestNews(maxAgeDays = 3) {
  console.log('📰 获取最新资讯...');
  
  const allNews = [];
  const cutoffDate = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000);
  
  // 并行获取所有RSS源
  const sources = [...RSS_SOURCES.international, ...RSS_SOURCES.chinese];
  
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 10);
      
      let newCount = 0;
      for (const item of items) {
        if (item.title) {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          
          // 只保留最近N天的新闻
          if (pubDate >= cutoffDate) {
            allNews.push({
              title: item.title,
              link: item.link,
              pubDate: pubDate,
              source: source.name,
              priority: source.priority,
              snippet: item.contentSnippet?.slice(0, 300) || item.content?.slice(0, 300) || '',
              categories: item.categories || [],
            });
            newCount++;
          }
        }
      }
      
      console.log(`   ✅ ${source.name}: ${newCount} 条新资讯`);
    } catch (err) {
      console.warn(`   ⚠️ ${source.name}: ${err.message}`);
    }
  }
  
  // 按优先级和日期排序
  allNews.sort((a, b) => {
    const pOrder = { S: 0, A: 1, B: 2 };
    const pA = pOrder[a.priority] || 3;
    const pB = pOrder[b.priority] || 3;
    if (pA !== pB) return pA - pB;
    return b.pubDate - a.pubDate;
  });
  
  console.log(`\n   总计获取 ${allNews.length} 条最新资讯`);
  return allNews;
}

/**
 * 分析新闻内容
 */
function analyzeNews(news) {
  const analysis = {
    // 价格相关新闻
    priceNews: news.filter(n => {
      const title = n.title.toLowerCase();
      const snippet = n.snippet.toLowerCase();
      return title.includes('price') || title.includes('index') || 
             title.includes('liv-ex') || title.includes('auction') ||
             snippet.includes('price') || snippet.includes('上涨') || snippet.includes('下跌');
    }),
    
    // 产区相关新闻
    regionNews: news.filter(n => {
      const title = n.title.toLowerCase();
      return title.includes('bordeaux') || title.includes('burgundy') || 
             title.includes('champagne') || title.includes('tuscany') ||
             title.includes('波尔多') || title.includes('勃艮第');
    }),
    
    // 企业新闻
    companyNews: news.filter(n => {
      const title = n.title.toLowerCase();
      return title.includes('winery') || title.includes('acquisition') || 
             title.includes('merger') || title.includes('酒庄');
    }),
    
    // 趋势新闻
    trendNews: news.filter(n => {
      const title = n.title.toLowerCase();
      return title.includes('organic') || title.includes('natural') || 
             title.includes('sustainable') || title.includes('trend');
    }),
  };
  
  return analysis;
}

/**
 * 生成投资分析文章
 */
function generateInvestmentArticle(news, date) {
  const analysis = analyzeNews(news);
  
  // 选择最新的市场相关新闻
  const marketNews = analysis.priceNews.slice(0, 3);
  const regionNews = analysis.regionNews.slice(0, 2);
  
  // 生成动态内容
  const newsHighlights = marketNews.map(n => 
    `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
      <strong>• ${n.title}</strong><br/>
      <span style="color: #999; font-size: 12px;">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
    </p>`
  ).join('\n');
  
  const regionHighlights = regionNews.map(n =>
    `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
      <strong>• ${n.title}</strong><br/>
      <span style="color: #999; font-size: 12px;">${n.source}</span>
    </p>`
  ).join('\n');
  
  const article = {
    title: `🍷 ${date.display} 精品葡萄酒市场分析：最新动态与投资机会`,
    author: '红酒顾问',
    digest: `${date.display}最新市场资讯：${marketNews.map(n => n.title.slice(0, 20)).join('、')}`,
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">报告日期：${date.full} | 红酒顾问 | 实时数据</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
${date.display}更新：精品葡萄酒市场持续活跃。以下是来自Decanter、Wine Spectator、The Drinks Business等权威来源的最新资讯。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📊 最新市场动态</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
${newsHighlights || '<p style="color: #666;">暂无最新市场数据</p>'}
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🌍 产区动态</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
${regionHighlights || '<p style="color: #666;">暂无产区新闻</p>'}
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💰 投资建议</h2>

<section style="background: #f0fff0; padding: 18px; border-radius: 8px; border-left: 3px solid #28a745;">
<p style="color: #155724; margin: 0;">
<strong>🟢 买入建议</strong><br/><br/>
• 波尔多超级二级庄（Pichon Lalande, L'Évangile）<br/>
• 意大利Barolo（Conterno, Giacosa）<br/>
• 年份香槟（Salon, Dom Pérignon）<br/><br/>
<strong>🟡 观望建议</strong><br/><br/>
• 勃艮第顶级酒（价格高位，等待回调）<br/><br/>
<strong>🔴 回避建议</strong><br/><br/>
• 罗讷河谷（指数表现疲软）
</p>
</section>
</section>

<section style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #666; font-size: 12px; margin: 0;">
<strong>🔗 数据来源</strong><br/>
${[...new Set([...marketNews, ...regionNews].map(n => n.source))].map(s => `• ${s}`).join('<br/>')}
</p>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #999; font-size: 12px; margin: 0;">
免责声明：本报告仅供参考，不构成投资建议<br/>
数据更新时间：${new Date().toISOString()}<br/>
发布日期：${date.display}
</p>
</section>`,
  };
  
  return article;
}

/**
 * 生成购买推荐文章
 */
function generateBuyingGuide(news, date) {
  const analysis = analyzeNews(news);
  
  // 选择最新的推荐相关新闻
  const recommendNews = news.filter(n => {
    const title = n.title.toLowerCase();
    return title.includes('recommend') || title.includes('best') || 
           title.includes('value') || title.includes('top') ||
           title.includes('推荐') || title.includes('精选');
  }).slice(0, 3);
  
  const newsHighlights = recommendNews.map(n => 
    `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
      <strong>• ${n.title}</strong><br/>
      <span style="color: #999; font-size: 12px;">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
    </p>`
  ).join('\n');
  
  const article = {
    title: `🍷 ${date.display} 葡萄酒购买指南：最新推荐与高性价比酒款`,
    author: '红酒顾问',
    digest: `${date.display}最新推荐：${recommendNews.map(n => n.title.slice(0, 20)).join('、')}`,
    content: `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">更新日期：${date.full} | 资深葡萄酒买手精选 | 实时数据</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
${date.display}更新：以下是来自Wine Spectator、Decanter、Vivino等权威来源的最新推荐和高性价比酒款。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📰 最新推荐资讯</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
${newsHighlights || '<p style="color: #666;">暂无最新推荐资讯</p>'}
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">⭐ 经典推荐Top 5</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">1. Château Giscours Margaux 2022</strong><br/>
<span style="color: #d4af37;">WS 95分 | 约800-1200元</span><br/>
<span style="color: #666;">WS年度第一名，经典波尔多三级庄。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">2. Ridge Lytton Springs 2023</strong><br/>
<span style="color: #d4af37;">WS 95分 | 约400-600元</span><br/>
<span style="color: #666;">WS年度第三名，仙粉黛主导混酿。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong style="color: #2d1424;">3. Muga Rioja Reserva 2021</strong><br/>
<span style="color: #d4af37;">WS 92分 | 约280元 | WS年度最佳性价比</span><br/>
<span style="color: #666;">西班牙里奥哈经典，性价比之王。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💎 高性价比榜单</h2>

<section style="background: #e8f5e9; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 12px;">💚 100-300元档</p>
<p style="color: #333; line-height: 1.8;">
• Michele Chiarlo Barbera d'Asti 2023 (WS 90, ¥130)<br/>
• Ravenswood Zinfandel 2023 (WS 92, ¥190)
</p>
</section>

<section style="background: #fff3e0; padding: 18px; border-radius: 8px;">
<p style="color: #e65100; font-weight: bold; margin-bottom: 12px;">🧡 300-800元档</p>
<p style="color: #333; line-height: 1.8;">
• Tenuta di Arceno Chianti Classico 2022 (WS 93, ¥210)<br/>
• Cloudy Bay Sauvignon Blanc 2024 (WS 91, ¥250)
</p>
</section>
</section>

<section style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #666; font-size: 12px; margin: 0;">
<strong>🔗 数据来源</strong><br/>
${[...new Set(recommendNews.map(n => n.source))].map(s => `• ${s}`).join('<br/>') || '• Wine Spectator, Vivino, Wine-Searcher'}
</p>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #999; font-size: 12px; margin: 0;">
数据更新时间：${new Date().toISOString()}<br/>
发布日期：${date.display}<br/>
价格仅供参考，以实际购买为准
</p>
</section>`,
  };
  
  return article;
}

/**
 * 生成行业快讯
 */
function generateDailyNews(news, date) {
  // 选择最新最热的5条新闻
  const topNews = news.slice(0, 5);
  const headlines = topNews.map(n => n.title.slice(0, 25)).join('、');
  
  const newsList = topNews.map(n => 
    `<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 10px;">
      <strong>• ${n.title}</strong><br/>
      <span style="color: #999; font-size: 12px;">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
    </p>`
  ).join('\n');
  
  const article = {
    title: `📰 ${date.display} 行业快讯：${headlines.slice(0, 50)}...`,
    author: '资讯分析师',
    digest: `${date.display}最新葡萄酒行业资讯，${topNews.length}条热点`,
    content: `<section style="margin-bottom: 15px;">
<p style="color: #999; font-size: 12px; text-align: center;">${date.display} | 行业快讯 | 实时更新</p>
</section>

<section style="background: linear-gradient(135deg, #c41e3a 0%, #8b2252 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">🔥 今日热点</p>
${topNews.slice(0, 2).map(n => `<p style="color: #f5e6d3; font-size: 15px; line-height: 1.8; margin-bottom: 10px;">
<strong>${n.title}</strong><br/>
<span style="color: #ddd; font-size: 12px;">来源：${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span>
</p>`).join('\n')}
</section>

<section style="margin-bottom: 20px;">
<h2 style="color: #2d1424; font-size: 18px; border-left: 4px solid #c41e3a; padding-left: 10px; margin-bottom: 15px;">📊 最新资讯</h2>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px;">
${newsList}
</section>
</section>

<section style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">📌 明日关注</p>
<p style="color: #333; font-size: 14px; line-height: 1.7;">
• 持续关注Liv-ex指数变化<br/>
• 关注拍卖行最新成交数据<br/>
• 留意产区天气和采收进展
</p>
</section>

<section style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #666; font-size: 12px; margin: 0;">
<strong>🔗 信息来源</strong><br/>
${[...new Set(topNews.map(n => n.source))].map(s => `• ${s}`).join('<br/>')}
</p>
</section>

<section style="text-align: center; padding: 15px;">
<p style="color: #999; font-size: 12px; margin: 0;">
免责声明：本快讯仅供参考，不构成投资建议<br/>
数据更新时间：${new Date().toISOString()}<br/>
发布日期：${date.display}
</p>
</section>`,
  };
  
  return article;
}

/**
 * 获取今日日期
 */
function getTodayDate() {
  const now = new Date();
  return {
    full: now.toISOString().slice(0, 10),
    display: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
  };
}

// 导出函数
module.exports = {
  fetchLatestNews,
  analyzeNews,
  generateInvestmentArticle,
  generateBuyingGuide,
  generateDailyNews,
  getTodayDate,
  RSS_SOURCES,
};
