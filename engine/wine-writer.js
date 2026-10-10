'use strict';

/**
 * 红酒号写稿规则（提示词 + 守门）
 * ==============================
 * 全部是纯函数，不碰网络 —— 网络调用在 engine/llm.js，编排在 tools/generate-article.js。
 * 这样「提示词怎么写」「什么样的稿子算不合格」可以被 jest 直接测，不需要真的调模型。
 *
 * 为什么守门要这么严（对比 AI 号那套 src/editorial_template.py 的做法）：
 *   红酒稿里的年份、价格、评分、产区、酒庄名都是**可被读者核实**的硬事实，
 *   编错一次就是公开的信任损失。所以：
 *     1. 提示词里明确「素材里没有的数字一律不写」；
 *     2. 生成后做数字溯源，素材里查不到的数字逐个告警；
 *     3. 表格（数字图表）里的数字查不到出处时**整行删掉**，不上图；
 *     4. 译名雷区命中则整篇重生成（body=身体、nose=鼻子 这类错译比空稿更伤号）。
 *
 * 与 engine/blocks.js 的契约：
 *   生成的 content 只能使用 blocks.js 支持的类型，否则 validateSpec 会直接拒稿。
 *   这里把允许的类型与「推荐用法」写进提示词，减少无效重试。
 */

const { CATEGORIES, DEFAULT_AUTHOR } = require('./article');

/** 渲染主题：rich 是第二代模板（有主题色、丢块问题已修），新稿一律用它。 */
const DEFAULT_THEME = 'rich';

/** 允许的内容块类型 + 用途说明（喂给模型，避免它发明 block） */
const BLOCK_GUIDE = [
  'title     —— 正文大标题（必填，通常 1 个）',
  'subtitle  —— 副标题/一句话导语（1 个）',
  'lead      —— 开篇导语段（1 个，比 p 更醒目）',
  'h2        —— 一级小标题（3~6 个，构成文章骨架）',
  'h3        —— 二级小标题（可选）',
  'p         —— 正文段落（主力，每段 80~180 字）',
  'tip       —— 实用提示框（可选 heading）',
  'box       —— 重点提示框（可选 heading）',
  'info      —— 补充信息框（可选 heading）',
  'card      —— 要点卡片（可选 heading）',
  'quote     —— 引用/金句（1 个以内）',
  'list      —— 无序清单（items 为字符串数组）',
  'table     —— 表格（headers: string[]，rows: string[][]，最多 5 行）',
  'item      —— 酒款条目（text，可选 info/price/tag）',
  'ri        —— 推荐条目（text，可选 heading）',
  'sep       —— 分隔符（可空）',
  'end       —— 结尾落款句（1 个，放最后）',
].join('\n  ');

/** 译名雷区：命中即整篇重生成（pattern 用中文语境锁定，避免误伤正常用词） */
const TERM_GUARD = [
  { pattern: /酒的身体|身体的?单宁|身体(?:很|较)?饱满/, term: 'body', suggest: '酒体' },
  { pattern: /酒的鼻子|用鼻子(?:闻|嗅)/, term: 'nose', suggest: '香气' },
  { pattern: /(?:酒|葡萄)(?:的)?腿(?!部)/, term: 'legs/tears', suggest: '酒泪（挂杯）' },
  { pattern: /上(?:颚|腭)(?:的)?(?:感觉|风味)/, term: 'palate', suggest: '口感 / 口腔' },
  { pattern: /葡萄的?皮肤/, term: 'skin', suggest: '葡萄皮' },
  { pattern: /酒的?骨架(?!感)/, term: 'structure', suggest: '结构 / 骨架感' },
  { pattern: /软木(?:塞)?(?:的)?味道/, term: 'corked', suggest: '软木塞污染（corked）' },
];

/** 分类白名单（来自 engine/article.js，新增类别请先去那边登记） */
const ALLOWED_CATEGORIES = CATEGORIES;

/** 期望的篇幅区间（字符数，按纯文本算） */
const LENGTH = { min: 1200, max: 4000 };

function todayString(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return { iso: `${y}-${m}-${d}`, compact: `${y}${m}${d}`, cn: `${y}年${m}月${d}日` };
}

/** 素材文本（fetch-news 产出的草稿：title + content[].text） */
function materialToText(material) {
  if (!material) {return '';}
  if (typeof material === 'string') {return material;}
  const parts = [];
  if (material.title) {parts.push(`标题：${material.title}`);}
  if (material.source) {parts.push(`来源：${material.source}`);}
  if (material.digest) {parts.push(`摘要：${material.digest}`);}
  for (const block of material.content || []) {
    const t = typeof block === 'string' ? block : block && block.text;
    if (t) {parts.push(String(t));}
  }
  return parts.join('\n');
}

/** 素材清单 -> 提示词里的素材段落 */
function formatMaterials(materials) {
  return materials
    .map((m, i) => {
      const meta = [m.source ? `来源：${m.source}` : null, m.link ? `链接：${m.link}` : null]
        .filter(Boolean)
        .join(' ｜ ');
      return `【素材 ${i + 1}】${meta ? `\n${meta}` : ''}\n${materialToText(m)}`;
    })
    .join('\n\n');
}

function buildSystemPrompt() {
  return (
    '你是《红酒顾问》公众号的资深葡萄酒编辑，写有观点、有出处、可直接发布的原创文章。' +
    '你只能使用给定的新闻素材里出现过的事实、数字、机构名、酒庄名与人物名，禁止编造。' +
    '禁止模板句式与空话（如「总而言之机遇与挑战并存」「不是……而是……」）。' +
    '禁止把葡萄酒术语按字面硬译（body=酒体，不是身体；nose=香气，不是鼻子）。'
  );
}

/**
 * 生成用户提示词。
 * @param {object} opts
 * @param {Array} opts.materials 素材（fetch-news 草稿对象或纯文本）
 * @param {string} [opts.category] 指定分类（不指定由模型自选）
 * @param {Date}   [opts.now]
 * @param {string[]} [opts.avoidTitles] 已发过的标题（避免重复选题）
 */
function buildUserPrompt({ materials = [], category = '', now = new Date(), avoidTitles = [] } = {}) {
  const today = todayString(now);
  const avoid = avoidTitles.length
    ? `\n\n【已发布过的标题，禁止重复选题】\n${avoidTitles.slice(0, 40).map((t) => `- ${t}`).join('\n')}`
    : '';

  return `基于下面的葡萄酒素材，写一篇中文公众号文章，并**只输出一个 JSON 对象**（不要 Markdown 围栏、不要任何解释文字）。

JSON 结构（字段名与类型必须完全一致）：
{
  "title": "文章标题，不超过 24 个中文字符，不要 emoji 堆砌，不要「盘点/速递/日报」类模板词",
  "digest": "摘要，不超过 100 字，会显示在公众号推送卡片上",
  "category": "${category || `从这些里选一个最贴切的：${ALLOWED_CATEGORIES.join(' / ')}`}",
  "tags": ["3~8 个中文标签"],
  "content": [ { "type": "块类型", "text": "内容" }, ... ]
}

content 只能使用下面这些块类型（type 字段写英文原名）：
  ${BLOCK_GUIDE}

写作要求：
1. 从多条素材中提炼**一条主线**（一个观点或一个实用问题），围绕它展开，绝不逐条罗列新闻。
2. 结构：title -> subtitle -> lead -> 3~6 个 h2（每个 h2 下 2~4 个 p，可用 list/tip/table 增强）-> end。
3. 全文 **不少于 ${LENGTH.min} 字**（硬要求，不足会被打回重写）：3~6 个 h2，每个 h2 下至少 3 个 p，全文 content 数组不少于 20 个块。
4. 内容要写实、写满：每段 80~180 字，讲成因、讲场景、讲怎么选怎么喝，不要用一句话敷衍小节。
5. **素材里没有出现的数字（年份、价格、评分、百分比、销量）一律不要写**；宁少勿编。
6. 涉及产区/酒庄/葡萄品种的表述必须与素材一致；素材用的是英文原名时，中文译名后括注原名。
7. 不要出现「本文」「以上」「作为AI」这类自称，不要在正文里写链接或 Markdown 语法（**加粗** 也不要）。
8. 观点必须前后一致，不得自相矛盾；不确定的地方用「据……报道」限定。
9. 专业但口语化，像一个懂酒的朋友在讲，而不是翻译腔。

今天的日期：${today.cn}（文章发布日期会用系统当天日期，正文里不要写具体日期）${avoid}

葡萄酒素材：

${formatMaterials(materials)}`;
}

/**
 * 给字符串值里的裸双引号补转义。
 * 模型写正文时常把「文化景观」的引号直接写成英文 "，导致 JSON 解析失败。
 * 判断依据：合法的字符串结尾后面只能跟 , } ] :，否则就是正文里的引号。
 */
function escapeStrayQuotes(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!inString) {
      out += ch;
      if (ch === '"') {inString = true;}
      continue;
    }
    if (ch === '\\') {
      out += ch + (text[i + 1] || '');
      i++;
      continue;
    }
    if (ch === '"') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) {j++;}
      const next = text[j];
      if (next === ',' || next === '}' || next === ']' || next === ':') {
        out += ch;
        inString = false;
      } else {
        out += '\\"';
      }
      continue;
    }
    out += ch;
  }
  return out;
}

/** 去掉 Markdown 围栏、截取第一个完整 JSON 对象。 */
function extractJson(raw) {
  let text = String(raw || '').trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('模型输出里找不到 JSON 对象');
  }
  const json = text.slice(start, end + 1);
  try {
    return JSON.parse(json);
  } catch (err) {
    // shortcut: 只补裸引号这一种模型高频错误；仍失败就抛原始错误，保持 fail-closed
    try {
      return JSON.parse(escapeStrayQuotes(json));
    } catch {
      throw err;
    }
  }
}

/** 全角数字/字母 -> 半角，便于数字溯源比较。 */
function normalizeDigits(s) {
  return String(s || '').replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

/** 抽出文本里所有数字（含小数、百分比），返回去重数组。 */
function numbersIn(text) {
  const found = normalizeDigits(text).match(/\d+(?:\.\d+)?%?/g) || [];
  return [...new Set(found)];
}

/** 收集 spec 里除 meta 之外的全部可读文本 */
function specTexts(spec, { includeTables = true } = {}) {
  const out = [];
  for (const block of (spec && spec.content) || []) {
    if (!block || typeof block !== 'object') {continue;}
    for (const key of ['text', 'heading']) {
      if (typeof block[key] === 'string' && block[key]) {out.push(block[key]);}
    }
    if (Array.isArray(block.items)) {out.push(...block.items.filter((x) => typeof x === 'string'));}
    if (includeTables && Array.isArray(block.rows)) {
      out.push(...block.rows.flat().filter((x) => typeof x === 'string'));
    }
    if (includeTables && Array.isArray(block.headers)) {
      out.push(...block.headers.filter((x) => typeof x === 'string'));
    }
  }
  return out;
}

/** 命中译名雷区，返回可读描述列表（空数组表示通过）。 */
function checkTerms(spec) {
  const text = (specTexts(spec) || []).join('\n');
  const hits = [];
  for (const rule of TERM_GUARD) {
    if (rule.pattern.test(text)) {
      hits.push(`${rule.term} 被误译（建议：${rule.suggest}）`);
    }
  }
  return hits;
}

/**
 * 表格行的数字溯源：素材里找不到的数字 -> 整行删掉。
 * 与 AI 号 src/editorial_template.ground_numeric_blocks 同思路：数字图表最招质疑，
 * 宁可少一行，也不要上一张查不到出处的表。
 * @returns {string[]} 被删行的描述
 */
function groundTableRows(spec, materialText) {
  const dropped = [];
  const pool = normalizeDigits(materialText);
  for (const block of (spec && spec.content) || []) {
    if (!block || block.type !== 'table' || !Array.isArray(block.rows)) {continue;}
    block.rows = block.rows.filter((row) => {
      const nums = numbersIn((row || []).join(' '));
      const bad = nums.filter((n) => !pool.includes(n));
      if (bad.length) {
        dropped.push(`表格行「${(row || []).join(' / ')}」（素材无此数据：${bad.join('、')}）`);
        return false;
      }
      return true;
    });
  }
  return dropped;
}

/** 正文里素材查不到的数字，只告警不删（可能是常识性年份等） */
function findUngroundedNumbers(spec, materialText) {
  const pool = normalizeDigits(materialText);
  const out = [];
  for (const t of specTexts(spec, { includeTables: false })) {
    for (const n of numbersIn(t)) {
      // 1~2 位小整数（1 杯、30 分钟这类量词）不追究，避免噪音淹没真问题
      if (n.length <= 2 && !n.includes('%')) {continue;}
      if (!pool.includes(n)) {out.push(n);}
    }
  }
  return [...new Set(out)];
}

/** 结构自查：硬门槛进 errors（会触发重生成），其余只告警。 */
function checkStructure(spec) {
  const warnings = [];
  const errors = [];
  const blocks = (spec && spec.content) || [];
  const count = (type) => blocks.filter((b) => b && b.type === type).length;
  const plain = specTexts(spec).join('');

  // 硬门槛：这几条是「机器写出不合格稿」的主要形态，必须重写而不是放行
  if (!blocks.some((b) => b && b.type === 'title')) {errors.push('缺少 title 块（正文大标题）');}
  if (plain.length < LENGTH.min) {
    errors.push(`正文只有 ${plain.length} 字，必须 >=${LENGTH.min} 字（请把每一节写足 3~4 段）`);
  }
  if (count('h2') < 3) {errors.push(`h2 小标题只有 ${count('h2')} 个，必须 >=3 个（文章要有 3~6 节）`);}
  if (spec && spec.category && !ALLOWED_CATEGORIES.includes(spec.category)) {
    errors.push(`category 不在白名单（${spec.category}）；可用：${ALLOWED_CATEGORIES.join(' / ')}`);
  }

  // 以下只告警：偏长、标签少、空表格等不足以拒稿
  if (plain.length > LENGTH.max) {warnings.push(`正文偏长（${plain.length} 字，建议 <=${LENGTH.max}）`);}
  if (spec && spec.title && spec.title.length > 30) {warnings.push(`标题偏长（${spec.title.length} 字，建议 <=24）`);}
  if (spec && spec.digest && spec.digest.length > 100) {warnings.push(`摘要偏长（${spec.digest.length} 字，建议 <=100）`);}
  // 「本文/以上/作为AI」这类自称在提示词里已经禁过，但摘要与标题最容易漏，
  // 只告警不改稿：这是观感问题，不值得为它多跑一轮模型
  const shell = [spec && spec.title, spec && spec.digest].filter(Boolean).join(' ');
  const selfRef = shell.match(/本文|以上|作为AI|作为人工智能/);
  if (selfRef) {warnings.push(`标题/摘要出现自称「${selfRef[0]}」，建议改成人话`);}
  if (spec && (!Array.isArray(spec.tags) || spec.tags.length < 3)) {warnings.push('标签少于 3 个');}
  if (count('table') && blocks.some((b) => b.type === 'table' && (!b.rows || !b.rows.length))) {
    warnings.push('有空的 table 块');
  }
  return { errors, warnings };
}

/** 文件名安全的 slug（ASCII，避免中文文件名在 cmd/VBS 链路上出问题） */
function slugify(input, fallback = 'wine') {
  const s = String(input || '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  return (s || fallback).slice(0, 40);
}

/** 补齐模型不该管的字段（name/theme/cover/source/publishDate/author）。 */
function finalizeSpec(spec, { name, date, source = 'generate-article', author } = {}) {
  const out = { ...spec };
  out.name = name || out.name || `ai_wine_${Date.now()}`;
  out.author = author || out.author || DEFAULT_AUTHOR;
  out.theme = { name: DEFAULT_THEME };
  out.cover = null;
  out.source = source;
  out.publishDate = String(date || out.publishDate || todayString().compact).replace(/-/g, '');
  if (Array.isArray(out.tags)) {
    out.tags = out.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 8);
  }
  return out;
}

/**
 * 完整守门：译名 -> 表格溯源 -> 结构硬门槛。不改判 blocks.js 的格式校验（交给 validateSpec）。
 * @returns {{spec: object, errors: string[], warnings: string[]}}
 */
function guardSpec(spec, { material = '', strict = true } = {}) {
  const materialText = typeof material === 'string' ? material : formatMaterials(material);
  const errors = [];
  const warnings = [];

  const badTerms = checkTerms(spec);
  if (badTerms.length && strict) {errors.push(`译名错误: ${badTerms.join('、')}`);}

  // 复制一份再改，避免调用方拿到的对象被就地修改
  const working = JSON.parse(JSON.stringify(spec));
  const dropped = groundTableRows(working, materialText);
  if (dropped.length) {warnings.push(`剔除无出处的表格行: ${dropped.join('; ')}`);}

  const ungrounded = findUngroundedNumbers(working, materialText);
  if (ungrounded.length) {
    warnings.push(`正文含素材未出现的数字（请人工复核）: ${ungrounded.join('、')}`);
  }

  const struct = checkStructure(working);
  errors.push(...struct.errors);
  warnings.push(...struct.warnings);
  return { spec: working, errors, warnings };
}

module.exports = {
  DEFAULT_THEME,
  BLOCK_GUIDE,
  TERM_GUARD,
  ALLOWED_CATEGORIES,
  LENGTH,
  todayString,
  materialToText,
  formatMaterials,
  buildSystemPrompt,
  buildUserPrompt,
  extractJson,
  normalizeDigits,
  numbersIn,
  specTexts,
  checkTerms,
  groundTableRows,
  findUngroundedNumbers,
  checkStructure,
  slugify,
  finalizeSpec,
  guardSpec,
};
