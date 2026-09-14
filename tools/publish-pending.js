#!/usr/bin/env node
'use strict';

/**
 * 发布未发布的文章（幂等）
 * ==========================
 * 扫描 articles/ 顶层，把「尚未建过草稿」的文章渲染 + 封面 + 建草稿，
 * 并把结果写入 logs/publish-state.json。重复运行不会重复建草稿 ——
 * 这样定时任务才能安全地「每天检查有没有新文章要发」。
 *
 * 为什么不直接定时跑 `engine/cli.js --all --publish`：
 *   那会每天为同一批文章重复创建草稿，草稿箱很快就被塞满。
 *
 * 首次运行的语义（重要）：
 *   状态文件不存在时，只把当前 articles/ 里的文章记为「基线」，**不建任何草稿**，
 *   避免第一次定时执行就把全部历史文章发成草稿。
 *   若确实要把现有文章全部建库，显式加 --include-existing。
 *
 * 用法：
 *   node tools/publish-pending.js --dry-run            # 只列出会发什么
 *   node tools/publish-pending.js                      # 发布全部待发布
 *   node tools/publish-pending.js --include-existing   # 连现有文章一起发
 *   node tools/publish-pending.js --file articles/x.json [--file ...]
 *   node tools/publish-pending.js --force              # 忽略状态，全部重发
 *
 * 退出码：0 正常（含「无待发布」）｜ 1 有失败 ｜ 2 参数/环境错误
 */

const fs = require('fs');
const path = require('path');

const { parseArgs, processOne } = require('../engine/cli');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const DEFAULT_STATE_PATH = path.join(ROOT, 'logs', 'publish-state.json');

/** 读取发布状态（损坏/缺失都视为空） */
function loadState(statePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** 写入发布状态（自动建目录） */
function saveState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  return true;
}

/** 列出 articles/ 顶层的文章文件（与 engine --all 一致：不递归） */
function listArticleFiles(articlesDir = ARTICLES_DIR) {
  if (!fs.existsSync(articlesDir)) {return [];}
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(articlesDir, f));
}

const nameOf = (file) => path.basename(file, '.json');

/**
 * 计算本轮要处理的文章。
 * @returns {{baseline: string[], pending: string[]}}
 *   baseline —— 首次运行时要记为基线（不发布）的文件
 *   pending  —— 要真正发布的文件
 */
function planPublishing({ articlesDir = ARTICLES_DIR, state = {}, files = [], includeExisting = false, force = false } = {}) {
  // 显式指定文件时，语义就是「发这篇」，不做首次运行的基线处理
  if (files.length) {
    const targets = files.map((f) => path.resolve(ROOT, f));
    return { baseline: [], pending: force ? targets : targets.filter((f) => !state[nameOf(f)]) };
  }

  const all = listArticleFiles(articlesDir);
  if (force) {return { baseline: [], pending: all };}

  const isFirstRun = Object.keys(state).length === 0;
  if (isFirstRun && !includeExisting) {
    return { baseline: all, pending: [] };
  }
  return { baseline: [], pending: all.filter((f) => !state[nameOf(f)]) };
}

/**
 * 逐篇发布并记录状态（可注入 processOne 以便测试）。
 * 失败的篇目不会写入状态，因此下次运行会自动重试。
 */
async function publishPending({ pending, state, statePath, opts, processOne: run, log = () => {}, now = () => new Date().toISOString() }) {
  const results = [];

  for (const file of pending) {
    const name = nameOf(file);
    try {
      const r = await run(file, opts);
      results.push({ name, status: r.status, mediaId: r.draftMediaId || null });
      if (r.status === 'published' || r.status === 'updated') {
        state[name] = { mediaId: r.draftMediaId || null, publishedAt: now() };
        saveState(statePath, state);
        log(`   ✅ ${name} -> 草稿 ${r.draftMediaId}`);
      } else {
        results[results.length - 1].status = 'unexpected';
        log(`   ⚠️  ${name} 返回了非预期状态：${r.status}`);
      }
    } catch (err) {
      results.push({ name, status: 'failed', error: err.message });
      log(`   ❌ ${name} 失败：${String(err.message).split('\n')[0]}`);
    }
  }

  return results;
}

function parseCliArgs(argv) {
  const files = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--file') {files.push(argv[++i]);}
  }
  return {
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force'),
    includeExisting: argv.includes('--include-existing'),
    quiet: argv.includes('--quiet'),
    help: argv.includes('-h') || argv.includes('--help'),
    files: files.filter(Boolean)
  };
}

function usage() {
  const src = fs.readFileSync(__filename, 'utf8');
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  console.log(m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)');
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (cli.help) {usage(); return 0;}

  const statePath = process.env.PUBLISH_STATE || DEFAULT_STATE_PATH;
  const state = loadState(statePath);
  const { baseline, pending } = planPublishing({
    articlesDir: ARTICLES_DIR,
    state,
    files: cli.files,
    includeExisting: cli.includeExisting,
    force: cli.force
  });

  const say = cli.quiet ? () => {} : (...a) => console.log(...a);

  if (cli.dryRun) {
    say(`🧪 dry-run：待发布 ${pending.length} 篇，基线 ${baseline.length} 篇`);
    pending.forEach((f) => say(`   将发布  ${nameOf(f)}`));
    baseline.forEach((f) => say(`   记基线  ${nameOf(f)}`));
    if (!pending.length && baseline.length) {
      say('   （首次运行：只会记录基线，不建草稿）');
    }
    return 0;
  }

  if (!pending.length && baseline.length) {
    baseline.forEach((f) => {
      state[nameOf(f)] = { baseline: true, recordedAt: new Date().toISOString() };
    });
    saveState(statePath, state);
    say(`📌 首次运行：已把 ${baseline.length} 篇现有文章记为基线（未创建草稿）。`);
    say(`   状态文件：${path.relative(ROOT, statePath)}`);
    say('   如需把现有文章全部建为草稿，请加 --include-existing');
    return 0;
  }

  if (!pending.length) {
    say('✅ 没有待发布的新文章');
    return 0;
  }

  const opts = parseArgs([]);   // 取引擎默认值（输出目录等）
  opts.publish = true;
  opts.quiet = cli.quiet;

  say(`🚀 发布待发布文章 · ${pending.length} 篇`);
  const results = await publishPending({
    pending,
    state,
    statePath,
    opts,
    processOne,
    log: say
  });

  const failed = results.filter((r) => r.status === 'failed');
  say(`\n${'─'.repeat(46)}`);
  say(`完成：成功 ${results.length - failed.length} ｜ 失败 ${failed.length}`);
  return failed.length ? 1 : 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error('❌ publish-pending 异常:', err && err.message ? err.message : err);
      process.exit(2);
    });
}

module.exports = {
  loadState,
  saveState,
  listArticleFiles,
  planPublishing,
  publishPending,
  parseCliArgs
};
