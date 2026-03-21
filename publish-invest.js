/**
 * Publish wine investment article to WeChat
 */
require('dotenv').config();
const WeChatPublisher = require('./publisher');
const EnhancedCoverGenerator = require('./enhanced-cover-generator');
const fs = require('fs');
const path = require('path');

async function main() {
  // 1. Generate cover image
  console.log('Generating cover image...');
  const coverGen = new EnhancedCoverGenerator({ width: 900, height: 383 });
  
  const coverBuffer = await coverGen.generateSmartCover({
    title: '🍷 2026年2月Liv-ex精品葡萄酒市场报告',
    subtitle: '复苏信号明显，投资机会显现',
    date: '2026-02'
  });
  
  // Save cover
  const coverPath = path.join(__dirname, 'output', 'wine_invest_202602_cover.png');
  fs.writeFileSync(coverPath, coverBuffer);
  console.log(`Cover saved to: ${coverPath}`);
  
  // 2. Load article content
  const articlePath = path.join(__dirname, 'output', 'wine_invest_202602.md');
  const articleContent = fs.readFileSync(articlePath, 'utf-8');
  
  // Parse markdown to HTML
  let htmlContent = articleContent
    .replace(/^# .+$/gm, '')  // Remove main title
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')  // H2 headers
    .replace(/^\*\*(.+)\*\*$/gm, '<strong>$1</strong>')  // Bold
    .replace(/^- (.+)$/gm, '<li>$1</li>')  // List items
    .replace(/\n\n/g, '</p><p>');
  
  // 3. Prepare article object
  const article = {
    title: '🍷 2026年2月Liv-ex精品葡萄酒市场报告：复苏信号明显，投资机会显现',
    subtitle: '从Liv-ex指数到全球拍卖市场，一文读懂精品葡萄酒投资新机遇',
    content: `<p>2026年2月，Liv-ex精品葡萄酒市场延续了2025年下半年以来的复苏态势，整体交易指数较上月小幅上涨0.8%。作为全球最大的精品葡萄酒交易平台，Liv-ex的表现被视为行业风向标。</p>
    
    <h2>📈 市场概览</h2>
    <p>本月数据显示，市场信心正在逐步恢复，尤其是波尔多顶级酒庄的表现强劲，带动整体板块企稳。从交易量来看，2月份Liv-ex平台共完成约2,800笔交易，总成交额达到1.2亿英镑，环比增长12%。</p>
    
    <h2>💰 价格快报</h2>
    <p><strong>Liv-ex 50指数</strong>收于385.6点，较年初上涨2.1%。波尔多一级庄表现分化：拉菲微涨0.5%，木桐则上涨1.8%。勃艮第方面，罗曼尼·康帝各酒款价格基本稳定。</p>
    
    <h2>🏛️ 拍卖动态</h2>
    <p>2月全球拍卖市场延续了2025年底的热闹氛围。伦敦苏富比年度首场拍卖会总成交额达890万英镑，成交率高达92%。纽约佳士得拍卖行同样表现不俗，勃艮第专场实现100%成交。</p>
    
    <h2>📊 趋势判断</h2>
    <ul>
    <li><strong>短期震荡上行</strong>：精品葡萄酒作为避险资产的需求将持续上升</li>
    <li><strong>勃艮第持续领涨</strong>：产量有限且需求旺盛</li>
    <li><strong>意大利新兴年份</strong>：2022年份巴罗洛和布鲁奈罗是优选</li>
    <li><strong>亚洲市场扩容</strong>：亚洲买家话语权将进一步提升</li>
    </ul>
    
    <h2>🔗 数据来源</h2>
    <ul>
    <li>Liv-ex官方交易数据（2026年2月）</li>
    <li>苏富比、佳士得拍卖行公开成交记录</li>
    <li>Wine-Searcher全球价格指数</li>
    </ul>
    
    <p><em>免责声明：本文仅供参考，不构成投资建议。葡萄酒投资存在风险，请咨询专业人士后决策。</em></p>`,
    abstract: '2026年2月Liv-ex精品葡萄酒市场延续复苏态势，交易指数上涨0.8%。波尔多顶级酒庄表现强劲，勃艮第交易占比上升至22%。本文深入分析市场概览、价格快报、拍卖动态和投资趋势。',
    tags: ['红酒', '葡萄酒投资', 'Liv-ex', '拍卖', '投资指南'],
    wordCount: 850
  };
  
  // 4. Publish to WeChat
  const publisher = new WeChatPublisher();
  
  // Since we can't upload local images easily, we'll use the default
  // In production, you'd upload the cover to a public URL first
  article.thumbUrl = 'https://mmbiz.qpic.cn/mmbiz_jpg/iczrWQP9piaCicic3ia0pTwliczicz0VJ6iciaLibniaCibibfF9rT2G0icicnN9aG5s5hR7sN7icicnQ8icicicicicf3icib9ib4g/0';
  
  const result = await publisher.publish(article);
  
  console.log('\n=== Publishing Result ===');
  console.log('Success:', result.success);
  if (result.draftId) {
    console.log('Draft ID:', result.draftId);
  }
  if (result.url) {
    console.log('Article URL:', result.url);
  }
  if (result.error) {
    console.log('Error:', result.error);
  }
}

main().catch(console.error);
