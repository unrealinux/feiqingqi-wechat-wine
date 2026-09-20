'use strict';

/**
 * 封面生成器
 * ==========
 * 生成 1200x630 的公众号封面（微信推荐的首图比例约为 2.35:1）。
 *
 * 与旧实现的区别：
 *   1. 文本做 XML 转义 —— 旧模板直接拼接 title，标题含 & < > 时会产生非法 SVG；
 *   2. 标题按显示宽度折行（中英文混排），不再像旧模板那样硬切 [:20]/[20:40]；
 *   3. 统一输出 PNG Buffer（微信素材接口不接受 SVG）。
 */

const DEFAULTS = {
  width: 1200,
  height: 630,
  colorFrom: '#1a1a2e',
  colorTo: '#b8860b',
  accent: '#ffd54f',
  footer: 'feiqingqi WeChat MP',
  maxLines: 3,
  titleFontSize: 40,
  subtitleFontSize: 20,
  footerFontSize: 14,
  lineHeight: 60,
  // 默认不把标题/副标题/分类写进封面（保持与 AI 封面一致的「纯图 + 品牌页脚」风格）。
  // 这里保留为矢量封面，是因为没有 AI Key 时它就是一张渐变色卡；
  // 需要旧行为时传 showTitle: true / showCategory: true。
  showTitle: false,
  showCategory: false,
};

/**
 * 懒加载 sharp —— 它是可选依赖，未安装时不应影响纯渲染/校验流程。
 * @returns {typeof import('sharp')}
 */
function getSharp() {
  try {
    return require('sharp');
  } catch (err) {
    throw new Error('生成封面需要 sharp 依赖，请先运行: npm install');
  }
}

/** XML 特殊字符转义，避免标题中的 & < > " ' 破坏 SVG。 */
function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 按「显示宽度」折行：CJK/全角字符算 2，其余算 1。
 * @param {string} text
 * @param {number} maxWidth 每行允许的显示宽度（半角字符数）
 * @param {number} maxLines 最大行数
 * @returns {string[]}
 */
function wrapByWidth(text, maxWidth, maxLines) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) {return [];}

  const widthOf = (ch) =>
    /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch) ? 2 : 1;

  // 把连续的 ASCII 字母数字视为一个整体，避免把 “72” / “Chardonnay” 从中间折断
  const tokens = clean.match(/[0-9A-Za-z]+(?:[.'’-][0-9A-Za-z]+)*|\s|[\s\S]/g) || [];

  const lines = [];
  let line = '';
  let width = 0;
  let truncated = false;

  for (const token of tokens) {
    const w = [...token].reduce((sum, ch) => sum + widthOf(ch), 0);
    if (width + w > maxWidth && line.trim()) {
      lines.push(line.replace(/\s+$/, ''));
      line = '';
      width = 0;
      if (lines.length === maxLines) {truncated = true; break;}
      if (/^\s+$/.test(token)) {continue;} // 丢弃换行后的行首空白
    }
    line += token;
    width += w;
  }

  if (!truncated && line.trim() && lines.length < maxLines) {
    lines.push(line.replace(/\s+$/, ''));
  }

  // 被截断时补省略号
  if (truncated && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/.$/, '') + '…';
  }
  return lines;
}

/**
 * 构建封面 SVG 字符串。
 * @param {{title: string, subtitle?: string, category?: string}} spec
 * @param {object} [options]
 * @returns {string} SVG 源码
 */
function buildCoverSvg(spec, options = {}) {
  // renderCoverPng 依赖「构造期抛错」的契约：调用完全方传 undefined 时必须
  // 以 rejected Promise 暴露（见 tests/engine-render.test.js）。
  if (!spec || typeof spec !== 'object') {
    throw new Error('封面数据必须是对象（至少包含 title）');
  }

  const opt = { ...DEFAULTS, ...options };
  const { width, height } = opt;

  const showTitle = opt.showTitle === true;
  const titleLines = showTitle ? wrapByWidth(spec.title, 30, opt.maxLines) : [];
  const subtitleLine = showTitle ? (wrapByWidth(spec.subtitle || '', 44, 1)[0] || '') : '';

  // 标题块整体垂直居中，略高于圆心
  const blockHeight = titleLines.length * opt.lineHeight;
  const titleTop = height / 2 - blockHeight / 2 - 10;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${titleTop + i * opt.lineHeight}" ` +
        `text-anchor="middle" fill="${opt.accent}" font-size="${opt.titleFontSize}" ` +
        `font-family="serif" font-weight="bold">${escapeXml(line)}</text>`
    )
    .join('\n');

  const subtitleY = titleTop + blockHeight + 20;
  const subtitleEl = subtitleLine
    ? `<text x="${width / 2}" y="${subtitleY}" text-anchor="middle" fill="#ddd" ` +
      `font-size="${opt.subtitleFontSize}" font-family="sans-serif">${escapeXml(subtitleLine)}</text>`
    : '';

  const categoryEl = opt.showCategory === true && spec.category
    ? `<text x="${width / 2}" y="${height - 72}" text-anchor="middle" fill="#c9a227" ` +
      `font-size="16" font-family="sans-serif" letter-spacing="2">${escapeXml(String(spec.category).toUpperCase())}</text>`
    : '';

  // 居中圆环是为了框住标题文字；不叠标题时改用它右侧的柔光圆点（bokeh）做装饰，
  // 否则中间一个空圈看起来像「文字没渲染出来」。
  const ringEl = showTitle
    ? `<circle cx="${width / 2}" cy="${height / 2}" r="200" fill="none" stroke="${opt.accent}" stroke-width="2" opacity="0.3"/>`
    : '';
  const bokehEl = showTitle
    ? ''
    : [
      { x: 0.76, y: 0.28, r: 150, o: 0.1 },
      { x: 0.9, y: 0.64, r: 92, o: 0.08 },
      { x: 0.64, y: 0.74, r: 58, o: 0.07 },
      { x: 0.16, y: 0.82, r: 74, o: 0.06 }
    ]
      .map((b) => `<circle cx="${Math.round(width * b.x)}" cy="${Math.round(height * b.y)}" `
        + `r="${b.r}" fill="${opt.accent}" opacity="${b.o}"/>`)
      .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${opt.colorFrom}"/><stop offset="100%" style="stop-color:${opt.colorTo}"/></linearGradient></defs>
<rect width="${width}" height="${height}" fill="url(#g)"/>
${ringEl}
${bokehEl}
${titleTspans}
${subtitleEl}
${categoryEl}
<text x="${width / 2}" y="${height - 40}" text-anchor="middle" fill="#999" font-size="${opt.footerFontSize}" font-family="sans-serif">${escapeXml(opt.footer)}</text>
</svg>`;
}

/**
 * 渲染封面为 PNG Buffer。
 * buildCoverSvg 可能因参数异常同步抛错，这里显式转为 rejected Promise，
 * 以保证调用方始终能用统一的方式处理错误。
 * @param {{title: string, subtitle?: string, category?: string}} spec
 * @param {object} [options]
 * @returns {Promise<Buffer>}
 */
function renderCoverPng(spec, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  let svg;
  try {
    svg = buildCoverSvg(spec, opt);
  } catch (err) {
    return Promise.reject(err);
  }
  return getSharp()(Buffer.from(svg), { density: 96 })
    .resize(opt.width, opt.height)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** 渲染封面为 data URI（便于本地预览 / 内联进 HTML）。 */
async function renderCoverDataUri(spec, options = {}) {
  const buf = await renderCoverPng(spec, options);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

module.exports = {
  buildCoverSvg,
  renderCoverPng,
  renderCoverDataUri,
  wrapByWidth,
  escapeXml,
  DEFAULTS,
};
