'use strict';

/**
 * 内容块渲染主分发器
 * ==================
 * 把结构化内容块渲染成「微信兼容」的内联样式 HTML，并按主题分发到具体渲染器。
 *
 * 为什么必须内联样式：
 *   微信公众号会剥离 <style>、class 等外部样式引用，只保留标签上的 style 属性。
 *
 * 主题
 * ----
 *   classic  第一代模板风格（暗金配色），输出与项目历史产物字节一致
 *   rich     第二代模板风格（primary/secondary 主题色），修复了旧实现的丢块问题
 *
 * 支持的块类型（17 种，覆盖全仓库实际使用情况）：
 *   title / subtitle / h2 / h3 / p / lead / tip / quote
 *   box / ri / card / info / item
 *   table / list / sep / end
 */

const classic = require('./themes/classic');
const rich = require('./themes/rich');

const THEMES = { classic, rich };
const DEFAULT_THEME = 'classic';

/**
 * 各块类型的字段契约。
 * 与 tools/extract_articles.py 的 BLOCK_SPEC 保持一致，两侧都会做校验。
 */
const BLOCK_SPEC = {
  title: { required: ['text'] },
  subtitle: { required: ['text'] },
  h2: { required: ['text'] },
  h3: { required: ['text'] },
  p: { required: ['text'] },
  lead: { required: ['text'] },
  tip: { required: ['text'], optional: ['heading'] },
  quote: { required: ['text'] },
  box: { required: ['text'], optional: ['heading'] },
  ri: { required: ['text'], optional: ['heading'] },
  card: { required: ['text'], optional: ['heading'] },
  info: { required: ['text'], optional: ['heading'] },
  item: { required: ['text'], optional: ['info', 'price', 'tag'] },
  table: { required: ['headers', 'rows'] },
  list: { required: ['items'] },
  sep: { required: [], optional: ['text'] },
  end: { required: ['text'] },
};

const SUPPORTED_TYPES = Object.keys(BLOCK_SPEC);

/**
 * 校验内容块数组。
 * @param {Array} blocks
 * @returns {string[]} 问题描述列表，空数组表示通过
 */
function validateBlocks(blocks) {
  const errors = [];
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return ['content 为空或不是数组'];
  }

  blocks.forEach((block, i) => {
    if (!block || typeof block !== 'object') {
      errors.push(`第 ${i} 个内容块不是对象`);
      return;
    }
    const spec = BLOCK_SPEC[block.type];
    if (!spec) {
      errors.push(
        `第 ${i} 个内容块类型未知 -> ${JSON.stringify(block.type)}` +
          `（支持：${SUPPORTED_TYPES.join(' / ')}）`
      );
      return;
    }
    const optional = spec.optional || [];
    for (const field of spec.required) {
      if (block[field] === undefined) {
        errors.push(`第 ${i} 个 ${block.type} 块缺少必填字段 "${field}"`);
      }
    }
    const allowed = new Set([...spec.required, ...optional, 'type']);
    for (const field of Object.keys(block)) {
      if (!allowed.has(field)) {
        errors.push(`第 ${i} 个 ${block.type} 块含多余字段 "${field}"`);
      }
    }

    if (block.type === 'table') {
      const cols = Array.isArray(block.headers) ? block.headers.length : -1;
      if (Array.isArray(block.rows)) {
        block.rows.forEach((row, r) => {
          const len = Array.isArray(row) ? row.length : '?';
          if (len !== cols) {
            errors.push(`第 ${i} 个 table 块第 ${r} 行有 ${len} 列，与表头 ${cols} 列不符`);
          }
        });
      }
    }

    if (!Array.isArray(block.items) && block.type === 'list') {
      errors.push(`第 ${i} 个 list 块的 items 不是数组`);
    }
  });

  return errors;
}

/**
 * 把主题参数归一化为 { name, primary, secondary, ... }
 * @param {string|object} [theme]
 * @returns {object}
 */
function resolveThemeConfig(theme) {
  if (!theme) {return { name: DEFAULT_THEME };}

  if (typeof theme === 'string') {
    if (THEMES[theme]) {return { name: theme };}
    if (rich.PRESETS[theme]) {return { name: 'rich', preset: theme };}
    throw new Error(
      `未知主题 "${theme}"（可用：${Object.keys(THEMES).join(' / ')} / ${Object.keys(rich.PRESETS).join(' / ')}）`
    );
  }

  return { name: theme.name || 'rich', ...theme };
}

/**
 * 解析主题渲染器。
 * @param {string|object} theme 主题名、预设名或自定义主题对象
 */
function resolveRenderers(theme) {
  const config = resolveThemeConfig(theme);
  if (config.name === 'rich') {return rich.buildRenderers(rich.resolveTheme(config));}
  return THEMES[config.name].RENDERERS;
}

/**
 * 渲染内容块数组为完整 HTML。
 * @param {Array} blocks 内容块数组
 * @param {object} [options]
 * @param {string} [options.theme='classic'] 主题名（classic / rich）
 * @param {string} [options.primary] rich 主题主色
 * @param {string} [options.secondary] rich 主题辅色
 * @returns {string} 内联样式的 <section> HTML
 * @throws {Error} 内容块非法或主题不支持时抛出
 */
function renderBlocks(blocks, options = {}) {
  const errors = validateBlocks(blocks);
  if (errors.length) {
    throw new Error(`内容块校验失败:\n  - ${errors.join('\n  - ')}`);
  }

  const themeConfig = resolveThemeConfig(options.theme || DEFAULT_THEME);
  const mod = THEMES[themeConfig.name];
  const renderers = resolveRenderers(themeConfig);

  const parts = [mod.SECTION_OPEN];
  for (const block of blocks) {
    const render = renderers[block.type];
    if (!render) {
      throw new Error(`主题 "${themeConfig.name}" 尚未实现内容块类型 "${block.type}"`);
    }
    parts.push(render(block));
  }
  parts.push('</section>');

  // 与历史产物一致：块与块之间不插入任何分隔符
  return parts.join('');
}

/** 提取纯文本，用于统计字数、校验发布长度等。 */
function blocksToPlainText(blocks) {
  const chunks = [];
  for (const b of blocks || []) {
    if (typeof b.text === 'string') {chunks.push(b.text);}
    if (typeof b.heading === 'string') {chunks.push(b.heading);}
    if (typeof b.info === 'string') {chunks.push(b.info);}
    if (Array.isArray(b.items)) {chunks.push(...b.items);}
    if (Array.isArray(b.headers)) {chunks.push(...b.headers);}
    if (Array.isArray(b.rows)) {b.rows.forEach((r) => chunks.push(...r));}
  }
  return chunks.join(' ').replace(/\s+/g, ' ').trim();
}

/** 统计各块类型数量，便于报告与排查。 */
function countBlockTypes(blocks) {
  return (blocks || []).reduce((acc, b) => {
    const key = b && b.type ? b.type : 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

module.exports = {
  renderBlocks,
  validateBlocks,
  blocksToPlainText,
  countBlockTypes,
  resolveThemeConfig,
  BLOCK_SPEC,
  SUPPORTED_TYPES,
  THEMES: Object.keys(THEMES),
  DEFAULT_THEME,
};
