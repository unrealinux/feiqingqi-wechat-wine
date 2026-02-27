const OpenAI = require('openai');
const axios = require('axios');
const config = require('./config');
const { Redis, Logger } = require('./utils');
const { 
  withRetry, 
  createAppError, 
  AppError, 
  ErrorTypes,
  CircuitBreaker 
} = require('./errors');

class ArticleGenerator {
  constructor() {
    this.config = config.generate;
    this.redis = new Redis();
    this.logger = new Logger();
  }

  async callLLM(messages, options = {}) {
    const { provider, apiKey, baseUrl, model, temperature, maxTokens, endpoints } = this.config;
    
    // 如果没有配置API Key，使用模拟模式
    if (!apiKey || apiKey === 'your_api_key_here' || apiKey.startsWith('your_')) {
      console.log(`使用模拟模式 (${provider || 'default'})...`);
      return this.mockLLMResponse(messages);
    }
    
    const requestOptions = {
      model: model || 'gpt-4',
      messages,
      temperature: options.temperature || temperature,
      max_tokens: options.maxTokens || maxTokens,
    };

    try {
      if (provider === 'openai' || !provider || (baseUrl && baseUrl.includes('openai'))) {
        const client = new OpenAI({ apiKey, baseUrl });
        const completion = await client.chat.completions.create(requestOptions);
        return completion.choices[0].message.content;
      }
      
      if (provider === 'minimax') {
        const endpoint = endpoints?.minimax || 'https://api.minimax.chat/v1/text/chatcompletion_v2';
        const response = await axios.post(
          endpoint,
          {
            model: 'abab6.5s-chat',
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: requestOptions.temperature,
            max_output_tokens: requestOptions.max_tokens,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          }
        );
        if (response.data?.base_resp?.status_code === 0 && response.data?.choices?.[0]?.message?.content) {
          return response.data.choices[0].message.content;
        }
        if (response.data?.choices?.[0]?.message) {
          return response.data.choices[0].message;
        }
        if (response.data?.text) {
          return response.data.text;
        }
        throw new Error('MiniMax响应异常: ' + JSON.stringify(response.data));
      }

      if (provider === 'deepseek') {
        const endpoint = endpoints?.deepseek || 'https://api.deepseek.com/chat/completions';
        const response = await axios.post(
          endpoint,
          requestOptions,
          {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            timeout: 60000,
          }
        );
        return response.data.choices[0].message.content;
      }

      if (provider === 'zhipu') {
        const endpoint = endpoints?.zhipu || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        const response = await axios.post(
          endpoint,
          requestOptions,
          {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            timeout: 60000,
          }
        );
        return response.data.choices[0].message.content;
      }

      throw new Error(`不支持的提供商: ${provider}`);
    } catch (error) {
      const appError = createAppError(error, { provider });
      console.error(`LLM调用失败 (${provider}):`, appError.message);
      // 失败时降级到模拟模式
      console.log('降级到模拟模式...');
      return this.mockLLMResponse(messages);
    }
  }

  mockLLMResponse(messages) {
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    if (userMessage.includes('outline') || userMessage.includes('结构')) {
      return JSON.stringify({
        mainTitle: '🍷 2026红酒新趋势：这一年的变化太大了',
        subtitle: '从产区动态到市场变化，一篇文章全解析',
        intro: '2026年的红酒行业充满了变化与机遇。从全球产量下降，到新产区的崛起，再到消费者偏好的转变...让我们一起深入了解。',
        chapters: [
          { title: '🌍 全球产量下滑，价格何去何从', points: ['产量下降', '气候影响', '价格走势'], estimatedLength: 600 },
          { title: '🏆 波尔多年份酒评新鲜出炉', points: ['2025年份评价', '五大酒庄表现', '投资建议'], estimatedLength: 600 },
          { title: '🇨🇳 宁夏产区崛起，国货之光', points: ['贺兰山东麓', '国际获奖', '国产高端'], estimatedLength: 600 },
          { title: '👨‍🍳 品酒新手入门指南', points: ['观色闻香', '品尝技巧', '常见误区'], estimatedLength: 500 },
        ],
        conclusion: '红酒的世界千姿百态，无论是收藏投资还是日常品饮，都有无限的乐趣等待探索。',
        callToAction: '你最喜欢哪个产区的红酒？欢迎在评论区分享你的看法！',
      });
    }

    if (userMessage.includes('章节') || userMessage.includes('chapter')) {
      return `🍷 在品鉴红酒的过程中，我们需要关注几个关键要素：首先是观色，将酒杯倾斜45度观察酒液的色泽；其次是闻香，轻轻摇晃酒杯，让酒液与空气接触，释放更多香气；最后是品尝，让酒液在口中停留片刻，感受单宁、酸度和酒体之间的平衡。

不同产区的红酒有着截然不同的风格特征。法国波尔多以优雅复杂著称，而澳洲设拉子则以果香浓郁见长。了解这些差异，能帮助我们更好地选择适合自己的酒款。`;
    }

    if (userMessage.includes('标题') || userMessage.includes('title')) {
      return JSON.stringify({
        mainTitle: '🍷 2026年红酒行业大事件：这5个变化每个人都应该知道',
        subtitle: '从全球产量到宁夏崛起，一文看懂红酒圈新趋势',
        abstract: '2026年全球葡萄酒产量下降，价格面临上涨压力；法国波尔多2025年份获得高度评价；中国宁夏产区异军突起...本文深入分析红酒行业的最新动态。',
        tags: ['红酒', '葡萄酒', '行业动态', '品酒', '宁夏', '波尔多'],
      });
    }

    return '模拟响应内容...';
  }

  async generate(aggregatedData) {
    console.log('开始生成微信公众号文章...');
    const startTime = Date.now();

    try {
      const outline = await this.createOutline(aggregatedData);
      const chapters = await this.generateChapters(outline, aggregatedData);
      const titleAndMeta = await this.generateTitleAndMeta(outline, aggregatedData);
      const article = await this.assembleArticle(titleAndMeta, chapters, outline);
      const imageSuggestions = await this.suggestImages(aggregatedData);

      await this.saveResult({ ...article, imageSuggestions, generatedAt: new Date(), outline });

      const duration = Date.now() - startTime;
      console.log(`文章生成完成，耗时 ${duration}ms`);

      return { ...article, imageSuggestions, outline, duration };
    } catch (error) {
      console.error('文章生成过程出错:', error);
      throw error;
    }
  }

  async createOutline(aggregatedData) {
    console.log('正在规划文章结构...');

    const { articles, categories, knowledgeGraph } = aggregatedData;
    
    const prompt = `你是一位资深的红酒类微信公众号编辑。现在需要根据以下信息规划一篇原创文章。

【重要】当前时间是2026年，请务必在文章标题和内容中使用2026年相关的表述！

背景信息：
- 本次采集了 ${articles.length} 篇红酒相关文章
- 涉及类别：${Object.keys(categories).join('、')}
- 热点话题：${knowledgeGraph.stats?.topWineTypes?.map(t => t.name).join('、') || '红酒'}
- 热门产区：${knowledgeGraph.stats?.topRegions?.map(r => r.name).join('、') || '主要产区'}

要求：
1. 微信公众号风格 - 标题吸引人，开头抓人眼球
2. 字数要求：${this.config.targetLength} 字左右
3. 内容要原创
4. 包含3-5个章节
5. 【关键】标题和内容必须使用"2026年"或"2026年度"等表述

请以JSON格式输出结构：
{
  "mainTitle": "主标题（必须包含2026）",
  "subtitle": "副标题",
  "intro": "开头引入语",
  "chapters": [{"title": "章节标题", "points": ["要点1", "要点2"], "estimatedLength": 500}],
  "conclusion": "结尾升华语",
  "callToAction": "引导互动语"
}`;

    try {
      const response = await this.callLLM([
        { role: 'system', content: '你是一位资深的红酒类微信公众号编辑，擅长创作既专业又有趣的红酒相关文章。' },
        { role: 'user', content: prompt },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getDefaultOutline();
    } catch (error) {
      console.error('生成outline失败:', error.message);
      return this.getDefaultOutline();
    }
  }

  getDefaultOutline() {
    return {
      mainTitle: '2024年红酒行业新动态，这些变化值得关注',
      subtitle: '从产区到市场趋势，一文读懂红酒圈的最新变化',
      intro: '红酒市场总是在不断变化，每年都有新的趋势和机遇。',
      chapters: [
        { title: '产区动态：风土与创新', points: ['新产区崛起', '传统产区创新', '气候变化影响'], estimatedLength: 500 },
        { title: '市场趋势：消费者偏好的变化', points: ['年轻消费者崛起', '线上购买成主流'], estimatedLength: 500 },
        { title: '品鉴新知：如何选对一瓶好酒', points: ['识别优质酒款', '实用选酒技巧'], estimatedLength: 500 },
      ],
      conclusion: '红酒的世界博大精深，值得我们不断探索。',
      callToAction: '欢迎在评论区分享你最近喝到的好酒！',
    };
  }

  async generateChapters(outline, aggregatedData) {
    console.log('正在生成各章节内容...');

    const chapters = [];
    const { articles, knowledgeGraph } = aggregatedData;

    for (let i = 0; i < outline.chapters.length; i++) {
      const chapter = outline.chapters[i];
      
      const prompt = `请撰写微信公众号文章的一个章节。

标题：${chapter.title}
核心要点：${chapter.points.join('、')}
字数：${chapter.estimatedLength}

写作要求：
1. 微信公众号风格 - 语言生动有趣
2. 内容原创有新意
3. 适当使用emoji增加趣味性（🍷🍇🍾🏰🌍📊）
4. 直接输出内容，无需额外说明。`;

      try {
        const content = await this.callLLM([
          { role: 'system', content: '你是一位资深的红酒类微信公众号编辑。' },
          { role: 'user', content: prompt },
        ], { maxTokens: 2000 });

        chapters.push({ title: chapter.title, content, order: i + 1 });
        console.log(`章节 ${i + 1} 生成完成`);
      } catch (error) {
        console.error(`章节 ${i + 1} 生成失败:`, error.message);
        chapters.push({ title: chapter.title, content: '内容生成中...', order: i + 1 });
      }
    }

    return chapters;
  }

  async generateTitleAndMeta(outline, aggregatedData) {
    console.log('正在生成标题和元数据...');

    const prompt = `请为以下微信公众号文章生成最佳标题和摘要。

大纲：${JSON.stringify(outline)}
背景：${JSON.stringify(aggregatedData.knowledgeGraph?.stats)}

要求：
1. 主标题要吸引眼球（20-30字）
2. 副标题补充说明（15-25字）
3. 摘要80-100字
4. 5个标签

请以JSON格式输出：
{
  "mainTitle": "主标题",
  "subtitle": "副标题",
  "abstract": "摘要",
  "tags": ["标签1","标签2","标签3","标签4","标签5"]
}`;

    try {
      const response = await this.callLLM([
        { role: 'system', content: '你是一位资深的微信公众号运营专家。' },
        { role: 'user', content: prompt },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析JSON');
    } catch (error) {
      console.error('生成标题失败:', error.message);
      return {
        mainTitle: outline.mainTitle,
        subtitle: outline.subtitle,
        abstract: '本文深入分析了红酒行业的最新动态和趋势。',
        tags: ['红酒', '葡萄酒', '行业动态', '品酒', '推荐'],
      };
    }
  }

  async assembleArticle(titleAndMeta, chapters, outline) {
    console.log('正在组装完整文章...');

    let content = `<p>${outline.intro}</p>\n\n`;

    for (const chapter of chapters) {
      content += `<h2>${chapter.title}</h2>\n\n`;
      content += `<p>${chapter.content.replace(/\n\n/g, '</p>\n\n<p>')}</p>\n\n`;
    }

    content += `<p>${outline.conclusion}</p>\n\n`;
    content += `<p>${outline.callToAction}</p>\n\n`;
    content += `<p><strong>参考资料：</strong>本文综合整理自最新红酒资讯。</p>`;

    return {
      title: titleAndMeta.mainTitle,
      subtitle: titleAndMeta.subtitle,
      abstract: titleAndMeta.abstract,
      content,
      tags: titleAndMeta.tags,
      wordCount: content.length,
    };
  }

  async suggestImages(aggregatedData) {
    return [
      { type: 'cover', description: '封面图', suggestedKeywords: ['红酒', '葡萄', '酒杯'] },
      { type: 'section', description: '章节配图', suggestedKeywords: ['产区', '品酒'] },
      { type: 'info', description: '信息图', suggestedKeywords: ['数据', '趋势'] },
    ];
  }

  async saveResult(article) {
    try {
      const cacheKey = `generated:${Date.now()}`;
      await this.redis.set(cacheKey, JSON.stringify(article), 7200);
    } catch (error) {
      console.error('保存生成结果失败:', error.message);
    }
  }
}

module.exports = ArticleGenerator;
