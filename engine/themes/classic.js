'use strict';

/**
 * 经典主题渲染器（第一代模板）
 * ============================
 * 对应 build_new_topics.py / build_more_topics.py / build_myth_series.py 等
 * 最早一批模板的输出风格：暗金配色，所有样式完全内联。
 *
 * 本模块的输出与项目历史产物 (output/*.json) 保持字节一致，
 * 由 tools/verify_parity.js 做回归保护。
 */

const STYLE = {
  title: 'text-align:center;color:#b8860b;',
  subtitle: 'text-align:center;color:#888;font-size:14px;margin-bottom:20px;',
  h2: 'color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;',
  h3: 'color:#b8860b;margin-top:20px;',
  p: 'color:#333;line-height:1.8;font-size:15px;margin:10px 0;',
  tipWrap: 'background:#fff8e1;border-left:4px solid #ffd54f;padding:12px 15px;margin:15px 0;border-radius:0 6px 6px 0;',
  tipText: 'color:#795548;margin:0;font-size:14px;line-height:1.7;',
  tableWrap: 'overflow-x:auto;margin:15px 0;',
  table: 'width:100%;border-collapse:collapse;',
  theadRow: 'background:#b8860b;color:#fff;',
  th: 'padding:10px;text-align:left;',
  td: 'padding:8px 12px;border-bottom:1px solid #eee;',
  list: 'padding-left:20px;',
  li: 'margin:6px 0;color:#333;line-height:1.7;',
  boxWrap: 'background:#f5f5f5;border-radius:8px;padding:15px;margin:15px 0;',
  boxHeading: 'color:#b8860b;margin:0 0 8px 0;',
  boxText: 'color:#333;margin:0;line-height:1.7;font-size:14px;',
  sep: 'text-align:center;color:#ddd;margin:20px 0;',
  end: 'text-align:center;color:#888;font-size:14px;margin-top:30px;',
  section: 'padding:10px 0;',
};

/**
 * box 系的卡片结构（经典主题里 box / ri / card / info 视觉一致）。
 * 注意：经典主题不做换行转换，以保持与历史产物字节一致。
 */
function card(block, opts = {}) {
  const heading = block.heading || opts.defaultHeading || '';
  return (
    `<div style="${STYLE.boxWrap}">` +
    `<h4 style="${STYLE.boxHeading}">${heading}</h4>` +
    `<p style="${STYLE.boxText}">${block.text}</p>` +
    '</div>'
  );
}

const RENDERERS = {
  title: (b) => `<h2 style="${STYLE.title}">${b.text}</h2>`,

  subtitle: (b) => `<p style="${STYLE.subtitle}">${b.text}</p>`,

  h2: (b) => `<h2 style="${STYLE.h2}">${b.text}</h2>`,

  h3: (b) => `<h3 style="${STYLE.h3}">${b.text}</h3>`,

  p: (b) => `<p style="${STYLE.p}">${b.text}</p>`,

  lead: (b) => `<p style="${STYLE.p}">${b.text}</p>`,

  tip: (b) =>
    `<div style="${STYLE.tipWrap}"><p style="${STYLE.tipText}">${b.text}</p></div>`,

  quote: (b) =>
    `<div style="${STYLE.tipWrap}"><p style="${STYLE.tipText}"><em>${b.text}</em></p></div>`,

  box: (b) => card(b),

  // ri / card / info 在第一代模板中未出现，这里统一按卡片渲染，
  // 避免像旧流水线那样「静默丢块」。
  ri: (b) => card(b),
  card: (b) => card(b),
  info: (b) => card(b),

  item: (b) => {
    const tag = b.tag
      ? ` <span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:4px;font-size:12px;">${b.tag}</span>`
      : '';
    return (
      `<div style="${STYLE.boxWrap}">` +
      `<h4 style="${STYLE.boxHeading}">${b.text}${tag}</h4>` +
      `<p style="${STYLE.boxText}">${b.info || ''}</p>` +
      (b.price ? `<p style="color:#b8860b;font-weight:bold;margin:5px 0 0 0;">${b.price}</p>` : '') +
      '</div>'
    );
  },

  table: (b) => {
    const tdOpen = `<td style="${STYLE.td}">`;
    const cellSep = `</td>${tdOpen}`;
    const head = b.headers.map((h) => `<th style="${STYLE.th}">${h}</th>`).join('');
    const body = b.rows.map((row) => `<tr>${tdOpen}${row.join(cellSep)}</td></tr>`).join('');
    return (
      `<div style="${STYLE.tableWrap}">` +
      `<table style="${STYLE.table}">` +
      `<thead><tr style="${STYLE.theadRow}">${head}</tr></thead>` +
      `<tbody>${body}</tbody>` +
      '</table></div>'
    );
  },

  list: (b) =>
    `<ul style="${STYLE.list}">` +
    b.items.map((i) => `<li style="${STYLE.li}">${i}</li>`).join('') +
    '</ul>',

  sep: (b) => `<p style="${STYLE.sep}">${b.text || '---'}</p>`,

  end: (b) => `<p style="${STYLE.end}">${b.text}</p>`,
};

const SECTION_OPEN = `<section style="${STYLE.section}">`;

module.exports = { RENDERERS, STYLE, SECTION_OPEN, name: 'classic' };
