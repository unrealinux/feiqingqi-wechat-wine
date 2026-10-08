#!/usr/bin/env node
'use strict';

/**
 * 自动写稿（红酒号）
 * ==================
 * 把 tools/fetch-news.js 存下来的素材，交给文本大模型写成一篇**符合引擎契约**的文章，
 * 落成 articles/<name>.json —— 之后走的是同一条既有链路：
 *   engine/article.js 校验 -> 引擎渲染 -> 封面 -> 建草稿（tools/publish-pending.js）
 *
 * 为什么不让模型直接吐 HTML：
 *   engine 是「数据即内容」的架构，排版由 themes/* 确定性渲染。
 *   让模型写 HTML 会导致每篇观感漂移、微信又把外部样式剥掉，且无法回归比对。
 *   所以模型只写**内容字段**，排版一概由本地模板决定。
 *
 * 与已有环节的关系：
 *   tools/fetch-news.js        素材入库（articles/_incoming/，人工可编辑）
 *   tools/generate-article.js  本工具：素材 -> 模型 -> articles/<name>.json（只写文件）
 *   tools/publish-pending.js   建草稿（幂等，每天 09:00 兜底）
 *
 * 红线：
 *   1. 只建草稿，绝不群发（沿用 processOne 的既有行为）。
 *   2. fail-closed：模型不可用 / 输出不合格时**不写文件、不建草稿**，退出码 1。
 *      宁可今天不出稿，也不往草稿箱塞低质或编造内容的稿子。
 *   3. 数字与译名过守门（engine/wine-writer.js）：素材里没有的数字不写，
 *      表格行无出处整行删掉。
 *
 * 用法
 * ----
 *   node tools/generate-article.js                      # 用最新未用素材生成一篇
 *   node tools/generate-article.js --dry-run            # 只打印，不写文件
 *   node tools/generate-article.js --review             # 写到 articles/_review/ 供人工过目
 *   node tools/generate-article.js --publish            # 生成后立即建草稿（不进 09:00 队列）
 *   node tools/generate-article.js --fetch              # 先抓最新素材再写
 *   node tools/generate-article.js --material articles/_incoming/x.json [--material ...]
 *   node tools/generate-article.js --category wine-food --provider zhipu --limit 4
 *   node tools/generate-article.js --allow-reuse        # 允许重复使用已用过的素材
 *   node tools/generate-article.js --json               # 机器可读结果
 *
 * 退出码：0 正常（含「无新素材」）｜ 1 生成/发布失败 ｜ 2 参数或环境错误
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

try {
  require('dotenv').config();
} catch (err) {
  // dotenv 缺失不阻塞：没有 Key 时 llm.js 会给出明确报错
}

const { validateSpec, buildArticle, articleStats } = require('../engine/article');
const { parseArgs, processOne } = require('../engine/cli');
const { LLMUnavailableError, chat, pickProvider } = require('../engine/llm');
const {
  buildSystemPrompt,
  buildUserPrompt,
  extractJson,
  formatMaterials,
  finalizeSpec,
  guardSpec,
  slugify,
  todayString,
} = require('../engine/wine-writer');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const INCOMING_DIR = path.join(ARTICLES_DIR, '_incoming');
const REVIEW_DIR = path.join(ARTICLES_DIR, '_review');
const STATE_PATH = path.join(ROOT, 'logs', 'generate-state.json');

const MAX_ATTEMPTS = 3;

/** 读取生成状态（哪些素材已用过、生成了哪些稿） */
function loadState(statePath = STATE_PATH) {
  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      materials: parsed.materials && typeof parsed.materials === 'object' ? parsed.materials : {},
      articles: parsed.articles && typeof parsed.articles === 'object' ? parsed.articles : {},
    };
  } catch (err) {
    return { materials: {}, articles: {} };
  }
}

function saveState(state, statePath = STATE_PATH) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

/** 素材候选：_incoming 里的 json，按发布时间/修改时间倒序 */
function listIncoming(dir = INCOMING_DIR) {
  if (!fs.existsSync(dir)) {return [];}
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const full = path.join(dir, f);
      let mtime = 0;
      try {mtime = fs.statSync(full).mtimeMs;} catch (err) {mtime = 0;}
      return { file: full, name: path.basename(f, '.json'), mtime };
    })
    .sort((a, b) => (b.name.localeCompare(a.name) || b.mtime - a.mtime));
}

/**
 * 选出这一篇要用的素材。
 * @returns {{picked: string[], skippedUsed: number}}
 */
function pickMaterials({ state = { materials: {} }, limit = 3, files = [], allowReuse = false, dir = INCOMING_DIR }) {
  if (files.length) {
    return { picked: files.map((f) => path.resolve(ROOT, f)), skippedUsed: 0 };
  }
  const used = (state && state.materials) || {};
  const all = listIncoming(dir);
  const fresh = allowReuse ? all : all.filter((m) => !used[m.name]);
  return {
    picked: fresh.slice(0, limit).map((m) => m.file),
    skippedUsed: all.length - fresh.length + Math.max(0, fresh.length - limit),
  };
}

/** 已发过/生成过的标题（喂给提示词，避免重复选题） */
function recentTitles({ state, dir = ARTICLES_DIR, max = 40 }) {
  const titles = [];
  for (const name of Object.keys(state.articles || {})) {
    if (state.articles[name] && state.articles[name].title) {titles.push(state.articles[name].title);}
  }
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().reverse().slice(0, max);
    for (const f of files) {
      try {
        const spec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        if (spec.title) {titles.push(spec.title);}
      } catch (err) { /* 单篇读坏不影响选题列表 */ }
    }
  } catch (err) { /* 目录不存在时忽略 */ }
  return [...new Set(titles)].slice(0, max);
}

/** 文章 name：ASCII，避免中文文件名在 cmd/VBS 链路上出问题 */
function buildName({ title = '', category = '', now = new Date() } = {}) {
  const hash = crypto.createHash('sha1').update(String(title)).digest('hex').slice(0, 4);
  const cat = slugify(category || 'wine', 'wine');
  return `ai_wine_${todayString(now).compact}_${cat}_${hash}`;
}

/**
 * 重试策略（这是质量的真正来源）：
 *   第 1~2 次用主力模型（glm-4-flash-250414，快），不合格就把**具体原因**回填给模型重写；
 *   第 3 次直接换成升档模型（glm-4.5-flash，更会写长文）—— 实测主力模型会稳定卡在 1200 字门槛下。
 *
 * 素材 -> 合格 spec。失败抛错（fail-closed）。
 * @param {object} deps 注入 { chat } 便于测试
 */
async function generateSpec({
  materials,
  category = '',
  avoidTitles = [],
  provider = '',
  now = new Date(),
  deps = {},
  log = () => {},
}) {
  const callChat = deps.chat || chat;
  const materialText = formatMaterials(materials);
  const userPrompt = buildUserPrompt({ materials, category, now, avoidTitles });
  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: userPrompt },
  ];

  let lastErr = null;
  let lastRaw = '';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await callChat({
        provider,
        messages: attempt === 1 ? messages : [
          messages[0],
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: '(上一次输出不合格，已丢弃)' },
          { role: 'user', content: `上一次输出不合格，原因：${lastErr}\n请修正后重新输出**完整**的 JSON 对象。` },
        ],
        temperature: attempt === 1 ? 0.85 : 0.6,
        fallbackModel: attempt === MAX_ATTEMPTS,
        maxTokens: 8000,
        timeout: 300000,
        retries: attempt === 1 ? 1 : 0,
      });
      log(`   🤖 第 ${attempt} 次生成 · ${res.provider}/${res.model} · ${res.text.length} 字符`);
      lastRaw = res.text;

      const raw = extractJson(res.text);
      const guarded = guardSpec(raw, { material: materialText });
      guarded.warnings.forEach((w) => log(`   ⚠️  ${w}`));

      if (guarded.errors.length) {
        throw new Error(guarded.errors.join('; '));
      }

      const spec = finalizeSpec(guarded.spec, {
        name: buildName({ title: guarded.spec.title, category: guarded.spec.category, now }),
        now,
      });
      const errors = validateSpec(spec);
      if (errors.length) {
        throw new Error(`引擎校验不通过: ${errors.join('; ')}`);
      }
      return { spec, warnings: guarded.warnings, provider: res.provider, model: res.model };
    } catch (err) {
      if (err instanceof LLMUnavailableError && attempt === MAX_ATTEMPTS) {throw err;}
      lastErr = String(err.message).split('\n')[0];
      log(`   ⚠️  第 ${attempt} 次不合格：${lastErr}`);
    }
  }

  const err = new Error(`连续 ${MAX_ATTEMPTS} 次生成均不合格，最后一次原因：${lastErr}`);
  err.rawText = lastRaw;
  throw err;
}

function parseCliArgs(argv) {
  const files = [];
  let limit = 3;
  let provider = '';
  let category = '';
  let name = '';
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--material' || a === '--file') {files.push(argv[++i]);}
    else if (a === '--limit') {limit = Number(argv[++i]);}
    else if (a === '--provider') {provider = argv[++i];}
    else if (a === '--category') {category = argv[++i];}
    else if (a === '--name') {name = argv[++i];}
  }
  return {
    files: files.filter(Boolean),
    limit: Number.isFinite(limit) && limit > 0 ? limit : 3,
    provider,
    category,
    name,
    dryRun: argv.includes('--dry-run'),
    review: argv.includes('--review'),
    publish: argv.includes('--publish'),
    fetch: argv.includes('--fetch'),
    allowReuse: argv.includes('--allow-reuse'),
    json: argv.includes('--json'),
    quiet: argv.includes('--quiet'),
    help: argv.includes('-h') || argv.includes('--help'),
  };
}

function usage() {
  const src = fs.readFileSync(__filename, 'utf8');
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  console.log(m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)');
}

/**
 * 先跑一次素材抓取。
 *
 * 为什么用子进程而不是 require：fetch-news.js 的 main() 里带 process.exit()
 * （它是个独立 CLI）。同进程 require 会在抓取失败时把本进程一起杀掉，
 * 而这里希望「抓取失败也要用现有素材继续写稿」。子进程还能天然隔离它的日志与退出码。
 */
async function runFetch(log, deps = {}) {
  const execFile = deps.execFile || require('child_process').execFile;
  const script = path.join(__dirname, 'fetch-news.js');
  await new Promise((resolve, reject) => {
    execFile(process.execPath, [script, '--limit', '5'], { cwd: ROOT, timeout: 180000 }, (err, stdout) => {
      const tail = String(stdout || '').trim().split('\n').filter(Boolean).slice(-3);
      tail.forEach((l) => log(`   📥 ${l}`));
      if (err) {reject(new Error(err.message));} else {resolve();}
    });
  });
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (cli.help) {usage(); return 0;}

  const say = cli.quiet ? () => {} : (...a) => console.log(...a);
  const result = { status: 'unknown', warnings: [] };

  const provider = pickProvider(cli.provider, process.env);
  if (!provider) {
    console.error('❌ 没有可用的文本大模型 Key（见 engine/llm.js 的 NO_PROVIDER_MSG）');
    return 2;
  }
  say(`🔑 文本模型：${provider.label} / ${provider.model}`);

  if (cli.fetch) {
    try {
      await runFetch(say);
    } catch (err) {
      say(`   ⚠️  素材抓取失败（继续用现有素材）：${String(err.message).split('\n')[0]}`);
    }
  }

  const state = loadState();
  const { picked } = pickMaterials({
    state,
    limit: cli.limit,
    files: cli.files,
    allowReuse: cli.allowReuse,
  });

  if (!picked.length) {
    say('✅ 没有未使用的新素材（先跑 npm run news:fetch，或加 --allow-reuse）');
    result.status = 'no-material';
    if (cli.json) {console.log(JSON.stringify(result, null, 2));}
    return 0;
  }

  const materials = [];
  for (const f of picked) {
    try {
      const spec = JSON.parse(fs.readFileSync(f, 'utf8'));
      materials.push({ ...spec, link: spec.link || '', source: spec.author || spec.source || '' });
    } catch (err) {
      say(`   ⚠️  素材读取失败，跳过 ${path.basename(f)}：${err.message}`);
    }
  }
  if (!materials.length) {
    console.error('❌ 选中的素材全部无法读取');
    return 1;
  }
  say(`📚 使用素材 ${materials.length} 条：${picked.map((f) => path.basename(f)).join(', ')}`);

  let generated;
  try {
    generated = await generateSpec({
      materials,
      category: cli.category,
      avoidTitles: recentTitles({ state }),
      provider: cli.provider,
      log: say,
    });
  } catch (err) {
    console.error(`❌ 生成失败：${err.message}`);
    // 把模型最后一次的原始输出落盘：调提示词时看不到原文就只能盲猜
    if (err.rawText) {
      const dump = path.join(ROOT, 'logs', 'last-generation.txt');
      try {
        fs.mkdirSync(path.dirname(dump), { recursive: true });
        fs.writeFileSync(dump, err.rawText, 'utf8');
        console.error(`   原始输出已存到 ${path.relative(ROOT, dump)}（排查提示词用）`);
      } catch (writeErr) { /* 落盘失败不影响退出码 */ }
    }
    return 1;
  }

  const spec = cli.name ? { ...generated.spec, name: cli.name } : generated.spec;
  const stats = articleStats(spec, buildArticle(spec));
  say(`📝 ${spec.title}`);
  say(`   分类 ${spec.category} ｜ 标签 ${spec.tags.join('/')} ｜ 内容块 ${stats.blocks} 个 ｜ 正文 ${stats.plainChars} 字（约 ${stats.approxReadingMinutes} 分钟）`);
  say(`   name ${spec.name} ｜ 模型 ${generated.provider}/${generated.model}`);
  result.name = spec.name;
  result.title = spec.title;
  result.category = spec.category;
  result.warnings = generated.warnings;
  result.materials = picked.map((f) => path.basename(f, '.json'));

  const outDir = cli.review ? REVIEW_DIR : ARTICLES_DIR;
  const outFile = path.join(outDir, `${spec.name}.json`);

  if (cli.dryRun) {
    say(`🧪 dry-run：未写文件（否则会写到 ${path.relative(ROOT, outFile)}）`);
    result.status = 'dry-run';
    if (cli.json) {console.log(JSON.stringify(result, null, 2));}
    return 0;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(spec, null, 2)}\n`, 'utf8');
  say(`💾 ${path.relative(ROOT, outFile)}`);
  result.file = path.relative(ROOT, outFile);

  // 登记素材与稿件，避免明天又拿同一条素材写出同一篇。
  // --review 模式**也**要登记：这是每天定时跑的主路径，不登记的话次日会把
  // 同一批素材重写一遍，_review 里堆出一串同题稿。想重写同一批素材：
  // 加 --allow-reuse，或删掉 logs/generate-state.json 里对应的 materials 条目。
  state.materials = state.materials || {};
  for (const f of picked) {
    state.materials[path.basename(f, '.json')] = { usedAt: new Date().toISOString(), article: spec.name };
  }
  state.articles = state.articles || {};
  state.articles[spec.name] = {
    title: spec.title,
    category: spec.category,
    file: path.relative(ROOT, outFile),
    createdAt: new Date().toISOString(),
    provider: generated.provider,
    model: generated.model,
  };
  saveState(state);

  if (cli.review) {
    say('👀 已写入 articles/_review/（不进 --all 扫描）。人工过目满意后 mv 到 articles/ 顶层即可进 09:00 队列');
    result.status = 'review';
    if (cli.json) {console.log(JSON.stringify(result, null, 2));}
    return 0;
  }

  if (cli.publish) {
    const opts = parseArgs([]);
    opts.publish = true;
    opts.quiet = cli.quiet;
    try {
      const r = await processOne(outFile, opts);
      say(`🚀 已建草稿 media_id=${r.draftMediaId}`);
      result.status = 'published';
      result.mediaId = r.draftMediaId || null;
    } catch (err) {
      console.error(`❌ 建草稿失败（文章已落盘，09:00 队列会自动重试）：${String(err.message).split('\n')[0]}`);
      result.status = 'publish-failed';
      if (cli.json) {console.log(JSON.stringify(result, null, 2));}
      return 1;
    }
  } else {
    say('➡️  文章已落盘，将在 09:00 的 publish-pending 任务里建草稿（或加 --publish 立即建）');
    result.status = 'generated';
  }

  if (cli.json) {console.log(JSON.stringify(result, null, 2));}
  return 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error('❌ generate-article 异常:', err && err.message ? err.message : err);
      process.exit(2);
    });
}

module.exports = {
  MAX_ATTEMPTS,
  loadState,
  saveState,
  listIncoming,
  pickMaterials,
  recentTitles,
  buildName,
  generateSpec,
  parseCliArgs,
};
