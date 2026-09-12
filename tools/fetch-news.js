#!/usr/bin/env node
'use strict';

/**
 * 新闻抓取 -> 引擎草稿
 * ====================
 * 把第一代流水线的「抓取能力」重新接入当前主线的数据结构：
 * 抓 RSS 信息源，转成 engine/ 可直接校验/渲染的 `articles/_incoming/*.json` 草稿，
 * 由人补充/编辑后再走 `engine/cli.js` 渲染发布。
 *
 * 为什么不直接发布：
 *   新闻原文不适合直接发公众号（版权、事实核对、文风）。本工具只做「素材入库」，
 *   产出的是合法草稿，人工编辑后再渲染 —— 与 engine「数据即内容」的模型一致。
 *
 * 与 archive/first-gen 的关系：
 *   这里是**重新实现**的窄接口（只做 RSS -> 草稿），不复活旧流水线的
 *   aggregator/generator/publisher。信息源清单在 tools/news-sources.js。
 *
 * 用法
 * ----
 *   node tools/fetch-news.js                     # 抓取全部源，最多 5 条草稿
 *   node tools/fetch-news.js --source Decanter   # 只抓名称含 Decanter 的源
 *   node tools/fetch-news.js --limit 10          # 最多写 10 条
 *   node tools/fetch-news.js --dry-run           # 只打印，不写文件
 *   node tools/fetch-news.js --json              # 机器可读输出
 *
 * 草稿目录 articles/_incoming/ 是子目录，`engine/cli.js --all` 不会扫描，
 * 因此不会误发布未编辑的草稿。
 *
 * 退出码：0 正常 ｜ 1 所有信息源均失败 ｜ 2 参数错误
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { getAxiosProxyConfig } = require('../proxy');
const { SOURCES, selectSources } = require('./news-sources');
const { validateSpec } = require('../engine/article');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const DEFAULT_OUT = path.join(ARTICLES_DIR, '_incoming');
const DEFAULT_LIMIT = 5;
const MAX_DIGEST = 120;
const UA = 'Mozilla/5.0 (compatible; wine-article-fetcher/1.0)';

/**
 * 分类推断规则。按顺序命中，默认 wine-knowledge。
 * 关键词中英混排，覆盖两类信息源。
 */
const CATEGORY_RULES = [
  {
    category: 'market-trends',
    keywords: ['market', 'investment', 'auction', 'price', 'index', 'liv-ex', 'trend',
      'business', 'company', 'acquisition', 'merger', 'lawsuit', 'bribery', 'doj',
      'distribution', 'tariff', 'sales', 'revenue', 'retailer',
      '投资', '市场', '拍卖', '价格', '行情', '指数', '涨幅', '交易', '收藏', '关税',
      '集团', '收购', '并购', '诉讼', '上市', '经销商']
  },
  {
    category: 'wine-food',
    keywords: ['food', 'pairing', 'recipe', 'cheese', 'bbq', 'dish', 'menu',
      '配餐', '搭配', '美食', '餐', '菜', '烧烤', '奶酪', '甜点', '下酒']
  },
  {
    category: 'wine-health',
    keywords: ['health', 'healthy', 'resveratrol', 'heart', 'moderation',
      '健康', '养生', '适量', '心脏', '抗氧化']
  },
  {
    category: 'practical-guide',
    keywords: ['guide', 'how to', 'tips', 'storage', 'decant', 'glassware', 'gift', 'beginners',
      '入门', '指南', '选购', '储存', '保存', '开瓶', '醒酒', '器具', '送礼', '温度', '技巧']
  },
  {
    category: 'wine-myth',
    keywords: ['myth', 'mistake', 'misconception', 'debunk', 'wrong',
      '误区', '谣言', '真相', '误解', '别再', '辟谣']
  },
  {
    category: 'lifestyle',
    keywords: ['travel', 'holiday', 'festival', 'season', 'summer', 'winter', 'party', 'wedding',
      '旅行', '节日', '季节', '生活', '度假', '场景', '圣诞', '新年', '婚礼', '派对']
  },
  {
    category: 'wine-culture',
    keywords: ['culture', 'history', 'story', 'tradition', 'chateau', 'estate', 'terroir',
      '文化', '历史', '故事', '传统', '酒庄', '产区', '传奇', '风土', '酿造']
  }
];

/** 分类的中文标签（用作兜底 tag） */
const CATEGORY_LABELS = {
  'wine-knowledge': '葡萄酒知识',
  'wine-myth': '误区',
  'wine-food': '配餐',
  'practical-guide': '实用指南',
  'wine-health': '健康',
  'market-trends': '行业动态',
  lifestyle: '生活方式',
  'wine-culture': '酒文化'
};

/** 信息源 type 的中文标签 */
const TYPE_LABELS = {
  news: '资讯',
  business: '商业',
  education: '科普',
  price: '行情',
  market: '市场',
  industry: '行业',
  blog: '博客',
  rating: '评分'
};

/** 解码常见 HTML 实体（含数字实体） */
function decodeEntities(input) {
  return String(input || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, '\'')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

/** 去标签 + 解码 + 折叠空白 */
function stripHtml(html) {
  return decodeEntities(String(html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** 清理文本：折叠空白、去首尾 */
function cleanText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

/** 截断到 max 长度，超长补省略号 */
function truncate(text, max) {
  const str = String(text ?? '');
  if (str.length <= max) {return str;}
  return `${str.slice(0, Math.max(0, max - 1))}…`;
}

/** 本地日期 YYYYMMDD */
function formatDate(now = Date.now()) {
  const d = new Date(now);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/** 把文件名安全片段（仅 ASCII 字母数字，最长 20） */
function safeSegment(name) {
  const s = String(name || '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return (s || 'src').slice(0, 20);
}

/**
 * 生成草稿 name（同时决定文件名）。含日期、源名与内容哈希，保证稳定且不碰撞。
 */
function slugFor(source, title, now = Date.now()) {
  const hash = crypto.createHash('sha1').update(`${source.name}|${title}`).digest('hex').slice(0, 8);
  return `news_${formatDate(now)}_${safeSegment(source.name)}_${hash}`;
}

/** 把 HTML 正文拆成 { type:'p', text } 内容块 */
function htmlToBlocks(html, options = {}) {
  const maxParagraphs = options.maxParagraphs || 12;
  const maxChars = options.maxChars || 4000;

  let text = String(html || '');
  // 块级闭合标签 -> 换行，避免整段被粘成一句
  text = text.replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/blockquote)\s*\/?\s*>/gi, '\n');
  text = decodeEntities(text.replace(/<[^>]*>/g, ''));

  const lines = text
    .split(/\r?\n+/)
    .map((l) => l.replace(/[ \t\u00a0]+/g, ' ').trim())
    .filter((l) => l.length >= 2);

  const blocks = [];
  let total = 0;
  for (const line of lines) {
    if (blocks.length >= maxParagraphs) {break;}
    if (total + line.length > maxChars) {break;}
    blocks.push({ type: 'p', text: truncate(line, 2000) });
    total += line.length;
  }
  return blocks;
}

/** 关键词 -> 分类（白名单内） */
function inferCategory(text) {
  const t = String(text || '').toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => t.includes(k.toLowerCase()))) {return rule.category;}
  }
  return 'wine-knowledge';
}

/** 由来源与正文推断标签（最多 5 个） */
function inferTags(text, source = {}, category = 'wine-knowledge') {
  const t = String(text || '').toLowerCase();
  const tags = [];
  if (source.name) {tags.push(source.name);}
  if (source.type && TYPE_LABELS[source.type]) {tags.push(TYPE_LABELS[source.type]);}

  for (const rule of CATEGORY_RULES) {
    for (const k of rule.keywords) {
      if (k.length >= 2 && t.includes(k.toLowerCase()) && !tags.includes(k)) {
        tags.push(k);
        if (tags.length >= 5) {break;}
      }
    }
    if (tags.length >= 5) {break;}
  }

  if (tags.length < 2) {tags.push(CATEGORY_LABELS[category] || category);}
  return [...new Set(tags)].slice(0, 5);
}

/**
 * 把一条 RSS item 转成引擎草稿。
 * 返回对象的顶层字段满足 engine/article.js 的 validateSpec；
 * 额外的 source 字段仅用于溯源（buildArticle 只取白名单字段，不会进产物）。
 */
function buildDraft(item, source, options = {}) {
  const now = options.now || Date.now();
  const rawHtml = item['content:encoded'] || item.content || item.summary || item.description || '';
  const title = cleanText(item.title) || '（无标题）';
  const snippet = cleanText(item.contentSnippet || item.summary || stripHtml(rawHtml));

  let blocks = htmlToBlocks(rawHtml, options);
  if (blocks.length === 0) {
    blocks = [{ type: 'p', text: truncate(snippet || title, 2000) }];
  }

  const haystack = `${title} ${snippet}`;
  const category = inferCategory(haystack);
  const plainFromBlocks = blocks.map((b) => b.text).join(' ');

  return {
    name: options.name || slugFor(source, title, now),
    title,
    author: source.author || source.name || '红酒顾问',
    digest: truncate(snippet || plainFromBlocks || title, MAX_DIGEST - 2),
    category,
    tags: inferTags(haystack, source, category),
    publishDate: formatDate(now),
    theme: { name: 'rich' },
    content: blocks,
    source: {
      name: source.name,
      url: item.link || item.guid || source.url,
      publishedAt: item.isoDate || item.pubDate || null,
      fetchedAt: new Date(now).toISOString()
    }
  };
}

/** 抓取单个信息源并解析 RSS */
async function fetchSource(source, deps = {}) {
  const axios = deps.axios || require('axios');
  const timeout = deps.timeout || 15000;
  const Parser = deps.Parser || require('rss-parser');
  const parser = deps.parser || new Parser({ timeout });

  const res = await axios.get(source.url, {
    ...getAxiosProxyConfig(),
    timeout,
    responseType: 'text',
    headers: {
      'User-Agent': UA,
      Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
    }
  });

  const xml = typeof res.data === 'string' ? res.data : String(res.data);
  const feed = await parser.parseString(xml);
  return { source, feedTitle: feed.title || source.name, items: feed.items || [] };
}

/** 收集已存在的标题/链接，用于跨运行去重 */
function collectSeen(dir = ARTICLES_DIR) {
  const urls = new Set();
  const titles = new Set();
  const dirs = [dir, path.join(dir, '_incoming')];

  for (const d of dirs) {
    if (!fs.existsSync(d)) {continue;}
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.json')) {continue;}
      try {
        const spec = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
        if (spec.title) {titles.add(cleanText(spec.title));}
        if (spec.source && spec.source.url) {urls.add(spec.source.url);}
      } catch {
        // 损坏文件不影响抓取
      }
    }
  }
  return { urls, titles };
}

/**
 * 由抓取结果构建草稿列表（含去重）。
 * @param {Array<{source: object, items: Array}>} fetched
 */
function buildDrafts(fetched, options = {}) {
  const seen = options.seen || { urls: new Set(), titles: new Set() };
  const urls = new Set(seen.urls);
  const titles = new Set(seen.titles);
  const limit = options.limit || DEFAULT_LIMIT;
  const drafts = [];
  const skipped = [];

  for (const entry of fetched) {
    for (const item of entry.items) {
      const title = cleanText(item.title);
      const url = item.link || item.guid || '';

      if (!title) {
        skipped.push({ source: entry.source.name, title: '', reason: 'no-title' });
        continue;
      }
      if (url && urls.has(url)) {
        skipped.push({ source: entry.source.name, title, reason: 'dup-url' });
        continue;
      }
      if (titles.has(title)) {
        skipped.push({ source: entry.source.name, title, reason: 'dup-title' });
        continue;
      }

      drafts.push(buildDraft(item, entry.source, options));
      if (url) {urls.add(url);}
      titles.add(title);

      if (drafts.length >= limit) {return { drafts, skipped };}
    }
  }
  return { drafts, skipped };
}

/** 写出草稿，返回文件路径列表 */
function writeDrafts(drafts, outDir = DEFAULT_OUT) {
  fs.mkdirSync(outDir, { recursive: true });
  const paths = [];
  for (const draft of drafts) {
    const file = path.join(outDir, `${draft.name}.json`);
    fs.writeFileSync(file, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');
    paths.push(file);
  }
  return paths;
}

function parseArgs(argv) {
  const opts = { source: '', limit: DEFAULT_LIMIT, out: DEFAULT_OUT, dryRun: false, json: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
    case '--source': opts.source = argv[++i] || ''; break;
    case '--limit': opts.limit = Math.max(1, Number(argv[++i]) || DEFAULT_LIMIT); break;
    case '--out': opts.out = path.resolve(ROOT, argv[++i] || DEFAULT_OUT); break;
    case '--dry-run': opts.dryRun = true; break;
    case '--json': opts.json = true; break;
    case '-h':
    case '--help': opts.help = true; break;
    default:
      throw new Error(`未知选项: ${arg}`);
    }
  }
  return opts;
}

function usage() {
  const src = fs.readFileSync(__filename, 'utf8');
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  console.log(m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)');
}

function log(opts, ...args) {
  if (!opts.json) {console.log(...args);}
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`❌ ${err.message}`);
    usage();
    process.exit(2);
  }

  if (opts.help) {usage(); process.exit(0);}

  const sources = selectSources(opts.source);
  if (sources.length === 0) {
    console.error(`❌ 没有匹配的信息源: "${opts.source}"（可用：${SOURCES.map((s) => s.name).join(' / ')}）`);
    process.exit(2);
  }

  log(opts, `📡 抓取 ${sources.length} 个信息源${opts.dryRun ? '（dry-run）' : ''}`);

  // 并发抓取；单个源失败不影响其它源
  const settled = await Promise.allSettled(sources.map((s) => fetchSource(s, opts)));
  const fetched = [];
  const failures = [];

  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      fetched.push(r.value);
      log(opts, `   ✅ ${sources[i].name}：${r.value.items.length} 条`);
    } else {
      failures.push({ source: sources[i].name, error: r.reason && r.reason.message ? r.reason.message : String(r.reason) });
      log(opts, `   ❌ ${sources[i].name}：${failures[failures.length - 1].error}`);
    }
  });

  if (fetched.length === 0) {
    const msg = `所有信息源均抓取失败（${failures.length} 个）`;
    if (opts.json) {console.log(JSON.stringify({ ok: false, error: msg, failures }, null, 2));}
    else {console.error(`❌ ${msg}`);}
    process.exit(1);
  }

  const seen = opts.dryRun ? { urls: new Set(), titles: new Set() } : collectSeen(ARTICLES_DIR);
  const { drafts, skipped } = buildDrafts(fetched, { limit: opts.limit, seen, ...opts });

  // 生成的草稿必须能过引擎校验，否则说明转换逻辑有 bug
  const invalid = drafts
    .map((d) => ({ name: d.name, errors: validateSpec(d) }))
    .filter((x) => x.errors.length > 0);

  let written = [];
  if (!opts.dryRun) {
    written = writeDrafts(drafts.filter((d) => !invalid.some((x) => x.name === d.name)), opts.out);
  }

  if (opts.json) {
    console.log(JSON.stringify({
      ok: invalid.length === 0,
      fetched: fetched.length,
      failures,
      drafts: drafts.map((d) => ({ name: d.name, title: d.title, category: d.category, blocks: d.content.length })),
      skipped,
      invalid,
      written
    }, null, 2));
  } else {
    log(opts, `\n${'─'.repeat(46)}`);
    log(opts, `草稿 ${drafts.length} 条 ｜ 跳过重复/无效 ${skipped.length} 条 ｜ 失败源 ${failures.length} 个`);
    for (const d of drafts) {
      log(opts, `   📝 ${d.name}  [${d.category}]  ${truncate(d.title, 40)}`);
    }
    if (invalid.length) {
      log(opts, `\n⚠️  ${invalid.length} 条草稿未通过引擎校验（未写出）：`);
      invalid.forEach((x) => log(opts, `   - ${x.name}: ${x.errors.join('; ')}`));
    }
    log(opts, opts.dryRun
      ? '\n（dry-run：未写入任何文件）'
      : `\n💾 已写入 ${written.length} 个草稿到 ${path.relative(ROOT, opts.out)}/`);
    log(opts, '   下一步：编辑草稿后运行 `node engine/cli.js <文件> --check`');
  }

  return invalid.length > 0 ? 1 : 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error('❌ 抓取异常:', err && err.stack ? err.stack : err);
      process.exit(1);
    });
}

module.exports = {
  decodeEntities,
  stripHtml,
  cleanText,
  truncate,
  formatDate,
  safeSegment,
  slugFor,
  htmlToBlocks,
  inferCategory,
  inferTags,
  buildDraft,
  fetchSource,
  collectSeen,
  buildDrafts,
  writeDrafts,
  parseArgs
};
