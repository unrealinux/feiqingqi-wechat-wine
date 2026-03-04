/**
 * AI 提示词模板管理器
 * 支持模板变量、动态生成、多语言
 */

const fs = require('fs');
const path = require('path');

class PromptManager {
  constructor(options = {}) {
    this.promptsDir = options.promptsDir || path.join(__dirname, 'prompts');
    this.defaults = options.defaults || {};
    this.cache = new Map();
  }

  /**
   * 加载模板
   * @param {string} name - 模板名称
   * @param {Object} vars - 模板变量
   */
  get(name, vars = {}) {
    // 检查缓存
    const cacheKey = `${name}:${JSON.stringify(vars)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 加载模板
    let template = this.loadTemplate(name);
    
    // 替换变量
    const rendered = this.render(template, vars);
    
    // 缓存结果
    this.cache.set(cacheKey, rendered);
    
    return rendered;
  }

  /**
   * 加载模板文件
   */
  loadTemplate(name) {
    // 尝试多种扩展名
    const extensions = ['.txt', '.md', '.hbs', ''];
    
    for (const ext of extensions) {
      const filePath = path.join(this.promptsDir, name + ext);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    }

    // 尝试内置模板
    if (this.defaults[name]) {
      return this.defaults[name];
    }

    throw new Error(`模板不存在: ${name}`);
  }

  /**
   * 渲染模板
   * @param {string} template - 模板内容
   * @param {Object} vars - 变量
   */
  render(template, vars) {
    let result = template;

    // 替换 {{variable}} 格式
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }

    // 替换 {{#if condition}}...{{/if}} 格式
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      return vars[condition] ? content : '';
    });

    // 替换 {{#each items}}...{{/each}} 格式
    result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, itemTemplate) => {
      const items = vars[arrayName];
      if (!Array.isArray(items)) return '';
      
      return items.map(item => {
        let itemResult = itemTemplate;
        for (const [key, value] of Object.entries(item)) {
          itemResult = itemResult.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
        return itemResult;
      }).join('');
    });

    return result;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取所有可用模板
   */
  listTemplates() {
    if (!fs.existsSync(this.promptsDir)) {
      return Object.keys(this.defaults);
    }
    
    return fs.readdirSync(this.promptsDir)
      .filter(f => f.endsWith('.txt') || f.endsWith('.md'))
      .map(f => path.basename(f, path.extname(f)));
  }
}

/**
 * 内置提示词模板
 */
const builtInPrompts = {
  // 文章生成模板
  article: `
你是一位专业的红酒行业专栏作家。请根据以下素材生成一篇微信公众号文章。

## 要求
- 语言风格：{{style}}
- 目标长度：约{{length}}字
- 格式：微信公众号风格

## 素材
{{#each articles}}
### {{title}}
{{content}}
---
{{/each}}

## 输出格式
请生成以下内容：
1. 吸引眼球的标题
2. 核心摘要（100字内）
3. 正文内容（分3-4个章节）
4. 总结与建议
`,

  // 摘要生成模板
  summary: `
请为以下文章生成一个简洁的摘要：

标题：{{title}}
内容：{{content}}

要求：
- 不超过100字
- 突出核心信息
- 语言简洁有力
`,

  // 标题生成模板
  title: `
请为以下文章内容生成3个吸引眼球的标题：

{{content}}

要求：
- 每个标题20字以内
- 符合微信公众号风格
- 具有吸引力
`,

  // 封面描述模板
  cover: `
请为以下文章生成一个封面图描述（用于AI生成图片）：

标题：{{title}}
摘要：{{summary}}

要求：
- 描述画面元素和风格
- 适合红酒主题
- 简洁明了
`,

  // 文章润色模板
  polish: `
请润色以下文章，提升可读性和专业性：

{{content}}

要求：
- 保持原意
- 优化表达
- 检查语法错误
`
};

/**
 * 创建提示词管理器
 */
function createPromptManager(options) {
  return new PromptManager({
    ...options,
    defaults: builtInPrompts
  });
}

module.exports = {
  PromptManager,
  builtInPrompts,
  createPromptManager
};
