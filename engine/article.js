'use strict';

/**
 * 文章组装
 * ========
 * 把「数据文件」(articles/*.json) 组装成可直接投递微信的成品文章对象。
 *
 * 输出字段与项目历史产物 (output/*.json) 完全一致，便于逐字节比对回归：
 *   title / author / digest / content / coverImage / category / tags / publishDate
 */

const { renderBlocks, validateBlocks, blocksToPlainText, countBlockTypes } = require('./blocks');

const DEFAULT_AUTHOR = '红酒顾问';
const DEFAULT_THEME = 'classic';

/**
 * 允许的文章分类（收敛后的 8 类）。
 *
 * 为什么做成白名单：此前 24 个分类中有 8 个仅含 1 篇文章，等于没有分类体系，
 * 而 category 会显示在封面标签上。新增类别请先在此登记，避免再次碎片化。
 */
const CATEGORIES = [
  'wine-knowledge',   // 知识科普：品种 / 产区 / 风格 / 品鉴 / 盲测
  'wine-myth',        // 误区与观点
  'wine-food',        // 配餐
  'practical-guide',  // 实用指南：选购 / 储存 / 开瓶 / 器具 / 送礼
  'wine-health',      // 健康
  'market-trends',    // 行业趋势与投资
  'lifestyle',        // 生活方式与场景：节日 / 季节 / 旅行
  'wine-culture'      // 文化与故事
];
/** 输出对象字段顺序，需与历史产物保持一致。 */
const ARTICLE_FIELDS = [
  'title',
  'author',
  'digest',
  'content',
  'coverImage',
  'category',
  'tags',
  'publishDate',
];

/**
 * 校验文章数据文件，返回问题列表。
 * @param {object} spec
 * @returns {string[]}
 */
function validateSpec(spec) {
  const errors = [];
  if (!spec || typeof spec !== 'object') {return ['文章数据不是对象'];}
  if (!spec.title) {errors.push('缺少 title');}
  if (!spec.digest) {errors.push('缺少 digest');}
  if (!Array.isArray(spec.tags)) {errors.push('缺少 tags 或不是数组');}
  if (!spec.theme) {errors.push('缺少 theme（未声明渲染主题，将默认使用 classic）');}
  if (!spec.category) {
    errors.push('缺少 category');
  } else if (!CATEGORIES.includes(spec.category)) {
    errors.push(`category 不在允许列表内: "${spec.category}"（可用值: ${CATEGORIES.join(' / ')}）`);
  }
  errors.push(...validateBlocks(spec.content));
  return errors;
}

/**
 * 组装文章。
 * @param {object} spec 数据文件内容（见 articles/*.json）
 * @param {object} [options]
 * @param {string} [options.author] 覆盖作者
 * @param {string} [options.publishDate] 覆盖发布日期（YYYYMMDD）
 * @param {string} [options.date] publishDate 的别名
 * @param {string|object} [options.theme] 覆盖渲染主题
 * @returns {object} 与 output/*.json 同构的文章对象
 */
function buildArticle(spec, options = {}) {
  const errors = validateSpec(spec);
  if (errors.length) {
    throw new Error(`文章数据校验失败 (${spec && spec.name ? spec.name : '未知'}):\n  - ${errors.join('\n  - ')}`);
  }

  const theme = options.theme || spec.theme || DEFAULT_THEME;

  const article = {
    title: spec.title,
    author: options.author || spec.author || DEFAULT_AUTHOR,
    digest: spec.digest,
    content: renderBlocks(spec.content, { theme }),
    coverImage: options.coverImage || spec.coverImage || `${spec.name}_cover_ai.png`,
    category: spec.category || '',
    tags: spec.tags,
    publishDate: String(options.publishDate || options.date || spec.publishDate || '').replace(/-/g, ''),
  };

  // 按固定顺序重建对象，保证 JSON 序列化结果稳定
  return ARTICLE_FIELDS.reduce((acc, key) => {
    acc[key] = article[key];
    return acc;
  }, {});
}

/**
 * 生成文章统计信息（不进入输出 JSON，仅用于日志/报告）。
 * @param {object} spec
 * @param {object} article
 */
function articleStats(spec, article) {
  const plain = blocksToPlainText(spec.content);
  return {
    name: spec.name,
    theme: typeof (spec.theme || DEFAULT_THEME) === 'string' ? spec.theme || DEFAULT_THEME : 'custom',
    blocks: spec.content.length,
    blockTypes: countBlockTypes(spec.content),
    htmlLength: article.content.length,
    plainChars: plain.length,
    tags: article.tags.length,
    approxReadingMinutes: Math.max(1, Math.round(plain.length / 400)),
  };
}

module.exports = {
  buildArticle,
  validateSpec,
  articleStats,
  ARTICLE_FIELDS,
  DEFAULT_AUTHOR,
  DEFAULT_THEME,
  CATEGORIES,
};
