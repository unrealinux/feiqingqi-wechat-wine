'use strict';

/**
 * 富文本主题渲染器（第二代模板）
 * ==============================
 * 对应 build_beach_wine.py / build_after_work_wine.py 等使用 rich_article.py 的模板。
 * 特点是可传入 primary / secondary 主题色。
 *
 * 相对旧实现 (rich_article.py) 的三个修复：
 *   1. 【内容丢失】旧实现定义了 .ri 的 CSS 却漏写 `ri` 分支 —— 全局 57 个文件、
 *      290 处 ri 块被静默丢弃（占这些文章内容块的 15%）。此处补齐 ri / card / info。
 *   2. 【样式被剥离】旧实现把样式写在 <style> + class 中，微信编辑器会剥离 <style>，
 *      导致卡片、表格、列表全部失去样式。此处全部改为内联 style。
 *   3. 【换行丢失】保留 \n -> <br/> 转换，避免多行正文被压成一行。
 */

const DEFAULT_THEME = {
  primary: '#8b2252',
  secondary: '#d4af37',
  // 深色渐变块（lead / quote / end）
  gradientFrom: '#1a0005',
  gradientTo: '#3a000a',
  gradientText: '#ffccbc',
};

/** 把正文换行转成 <br/>。 */
const nl2br = (text) => String(text ?? '').replace(/\n/g, '<br/>');

/** 深色渐变强调块，供 lead / quote / end 复用。 */
function gradientBlock(inner, theme) {
  return (
    `<section style="background:linear-gradient(135deg,${theme.gradientFrom},${theme.gradientTo});` +
    `padding:25px;border-radius:10px;margin-bottom:25px">${inner}</section>`
  );
}

/**
 * 构建渲染器集合。
 * @param {object} theme 已解析的主题（primary/secondary/...）
 */
function buildRenderers(theme) {
  const { primary, secondary } = theme;

  const h3Style = `color:${primary};border-bottom:2px solid ${secondary};padding-bottom:8px;margin-top:25px;`;

  /** .ri 卡片（旧实现中只存在于 CSS，这里补上渲染） */
  const riCard = (heading, body, headingSize = 16) =>
    '<div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0;">' +
    `<h4 style="color:${primary};margin:0 0 8px 0;font-size:${headingSize}px;">${heading}</h4>` +
    `<p style="color:#333;line-height:1.8;margin:0">${body}</p>` +
    '</div>';

  return {
    title: (b) => `<h2 style="text-align:center;color:${primary};">${b.text}</h2>`,

    subtitle: (b) => `<p style="text-align:center;color:#666;">${b.text}</p>`,

    h2: (b) => `<h3 style="${h3Style}">${b.text}</h3>`,

    h3: (b) => `<h3 style="color:${primary};margin-top:15px;">${b.text}</h3>`,

    p: (b) => `<p style="color:#333;line-height:1.9;font-size:15px;margin:10px 0;">${b.text}</p>`,

    lead: (b) =>
      gradientBlock(
        `<p style="color:${theme.gradientText};font-size:16px;line-height:1.9;margin:0">${nl2br(b.text)}</p>`,
        theme
      ),

    // 旧 rich_article.py 的唯一卡片类型：box
    box: (b) => riCard(b.heading || '', nl2br(b.text)),

    // ★ 修复：旧实现完全丢弃 ri 块
    ri: (b) => riCard(b.heading || '', nl2br(b.text)),

    // ★ 补齐：旧实现依赖 <style> 中的 .card / .info-box，这里内联
    card: (b) =>
      `<div style="background:#fff;border-left:4px solid ${primary};padding:15px;margin:10px 0;border-radius:0 8px 8px 0;">` +
      `<h4 style="color:${primary};margin:0 0 8px 0;font-size:15px;">${b.heading || ''}</h4>` +
      `<p style="color:#555;margin:0;line-height:1.7;font-size:14px;">${nl2br(b.text)}</p>` +
      '</div>',

    info: (b) =>
      '<div style="background:#fff5f5;padding:15px;border-radius:8px;margin:10px 0;">' +
      `<h4 style="color:${secondary};margin:0 0 10px 0;font-size:15px;">${b.heading || ''}</h4>` +
      `<p style="margin:5px 0;color:#333;line-height:1.7;font-size:14px;">${nl2br(b.text)}</p>` +
      '</div>',

    item: (b) => {
      const tag = b.tag
        ? ` <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">${b.tag}</span>`
        : '';
      return (
        '<div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px;margin:10px 0;">' +
        `<h4 style="color:${primary};margin:0 0 8px 0;font-size:16px;">${b.text}${tag}</h4>` +
        `<p style="color:#333;line-height:1.8;margin:0">${nl2br(b.info || '')}</p>` +
        (b.price
          ? `<p style="color:${secondary};font-weight:bold;margin:5px 0 0 0;">${b.price}</p>`
          : '') +
        '</div>'
      );
    },

    table: (b) => {
      const th = `style="background:${primary};color:#fff;padding:10px;text-align:left;"`;
      const td = 'style="padding:10px;border-bottom:1px solid #ddd;color:#333;"';
      const head = b.headers.map((h) => `<th ${th}>${h}</th>`).join('');
      const body = b.rows
        .map((row) => `<tr>${row.map((c) => `<td ${td}>${c}</td>`).join('')}</tr>`)
        .join('');
      return (
        '<section style="background:#fce4ec;padding:18px;border-radius:8px">' +
        '<table style="width:100%;border-collapse:collapse;margin:10px 0;">' +
        `<thead><tr>${head}</tr></thead><tbody>${body}</tbody>` +
        '</table></section>'
      );
    },

    list: (b) =>
      '<section style="background:#e8f5e9;padding:18px;border-radius:8px">' +
      '<ul style="padding-left:20px;margin:0;">' +
      b.items
        .map((i) => `<li style="margin:8px 0;color:#333;line-height:1.8;font-size:14px;">${i}</li>`)
        .join('') +
      '</ul></section>',

    tip: (b) =>
      '<section style="background:#e3f2fd;padding:18px;border-radius:8px">' +
      riCard(b.heading || '💡 小贴士', nl2br(b.text)) +
      '</section>',

    quote: (b) =>
      gradientBlock(
        `<p style="color:${theme.gradientText};font-size:16px;line-height:1.9;font-style:italic;margin:0">${nl2br(b.text)}</p>`,
        theme
      ),

    sep: () =>
      `<div style="height:2px;background:linear-gradient(90deg,transparent,${secondary},transparent);margin:25px 0;"></div>`,

    end: (b) =>
      gradientBlock(
        `<p style="color:${theme.gradientText};font-size:16px;line-height:1.9;text-align:center;margin:0">${nl2br(b.text)}</p>`,
        theme
      ),
  };
}

const SECTION_OPEN = '<section>';

/** 已知的主题预设（按文章 primary 色归纳）。 */
const PRESETS = {
  default: { ...DEFAULT_THEME },
  rhone: { ...DEFAULT_THEME, primary: '#8b2252', secondary: '#d4af37' },
  beach: { primary: '#006064', secondary: '#26c6da', ...DEFAULT_THEME, },
  bordeaux: { primary: '#722f37', secondary: '#c9a227' },
  burgundy: { primary: '#8b0000', secondary: '#d4af37' },
};

/** 解析主题配置：接受预设名或自定义对象。 */
function resolveTheme(input) {
  if (!input) {return { ...DEFAULT_THEME };}
  if (typeof input === 'string') {return { ...DEFAULT_THEME, ...(PRESETS[input] || {}) };}
  return { ...DEFAULT_THEME, ...input };
}

module.exports = {
  name: 'rich',
  buildRenderers,
  resolveTheme,
  DEFAULT_THEME,
  PRESETS,
  SECTION_OPEN,
};
