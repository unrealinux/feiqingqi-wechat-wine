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
 *   node tools/publish-pending.js                      # 发布全部待发布（单次最多 5 篇）
 *   node tools/publish-pending.js --limit 8            # 改单次上限
 *   node tools/publish-pending.js --include-existing   # 连现有文章一起发
 *   node tools/publish-pending.js --file articles/x.json [--file ...]
 *   node tools/publish-pending.js --force              # 忽略状态与安全阀，全部重发
 *
 * 安全阀（为什么不是「有几篇发几篇」）：
 *   logs/publish-state.json 一旦丢失/被重置，所有历史文章都会变成「待发布」。
 *   一次给草稿箱灌 100+ 篇的代价远大于晚发几天，因此：
 *     · 待发 > 10 篇且没有 --force → 直接拒绝，提示先核对状态文件；
 *     · 正常情况单次只发 5 篇，剩下的下一次继续。
 *
 * 退出码：0 正常（含「无待发布」）｜ 1 有失败 ｜ 2 参数/环境错误（含撞安全阀）
 */

const fs = require('fs');
const path = require('path');

const { parseArgs, processOne } = require('../engine/cli');
const { resolveStatePath, loadState, saveState, recordPublished } = require('../engine/publish-state');
const { alert } = require('./notifier');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');

/** 正常情况单次最多发几篇（防止一次给草稿箱灌一堆） */
const DEFAULT_LIMIT = 5;
/** 待发超过这个数量且没有 --force，视为状态文件异常，直接拒绝 */
const MAX_UNGUARDED = 10;

// loadState / saveState 由 engine/publish-state.js 统一提供（引擎侧 --publish 也要写同一个
// 文件，两份实现会漂移）；这里重新导出，保持本模块对外的既有接口不变。

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
        // 条目形状统一由 engine/publish-state.js 决定（引擎侧 --publish 也写同一份文件）
        state[name] = recordPublished(
          statePath,
          name,
          { mediaId: r.draftMediaId || null, status: r.status },
          now
        );
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
  let limit = DEFAULT_LIMIT;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--file') {files.push(argv[++i]);}
    if (argv[i] === '--limit') {
      const n = Number(argv[++i]);
      if (Number.isFinite(n) && n > 0) {limit = Math.floor(n);}
    }
  }
  return {
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force'),
    includeExisting: argv.includes('--include-existing'),
    quiet: argv.includes('--quiet'),
    help: argv.includes('-h') || argv.includes('--help'),
    limit,
    files: files.filter(Boolean)
  };
}

/**
 * 本轮到底发哪几篇（安全阀）。
 * @returns {{ok: boolean, batch: string[], rest: string[], reason?: string}}
 */
function planBatch({ pending = [], limit = DEFAULT_LIMIT, force = false } = {}) {
  if (force) {return { ok: true, batch: pending.slice(), rest: [] };}
  if (pending.length > MAX_UNGUARDED) {
    return {
      ok: false,
      batch: [],
      rest: pending.slice(),
      reason: `待发布 ${pending.length} 篇，超过安全上限 ${MAX_UNGUARDED} 篇`
    };
  }
  return { ok: true, batch: pending.slice(0, limit), rest: pending.slice(limit) };
}

function usage() {
  const src = fs.readFileSync(__filename, 'utf8');
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  console.log(m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)');
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (cli.help) {usage(); return 0;}

  const statePath = resolveStatePath();
  const state = loadState(statePath);
  const { baseline, pending } = planPublishing({
    articlesDir: ARTICLES_DIR,
    state,
    files: cli.files,
    includeExisting: cli.includeExisting,
    force: cli.force
  });

  const say = cli.quiet ? () => {} : (...a) => console.log(...a);

  const plan = planBatch({ pending, limit: cli.limit, force: cli.force });

  if (cli.dryRun) {
    say(`🧪 dry-run：待发布 ${pending.length} 篇（本次会发 ${plan.batch.length} 篇），基线 ${baseline.length} 篇`);
    plan.batch.forEach((f) => say(`   将发布  ${nameOf(f)}`));
    plan.rest.forEach((f) => say(`   留待下次 ${nameOf(f)}`));
    baseline.forEach((f) => say(`   记基线  ${nameOf(f)}`));
    if (!pending.length && baseline.length) {
      say('   （首次运行：只会记录基线，不建草稿）');
    }
    if (!plan.ok) {say(`   ⛔ ${plan.reason}`);}
    return 0;
  }

  if (!plan.ok) {
    say(`⛔ ${plan.reason}，已中止（未建任何草稿）。`);
    say(`   多半是 ${path.relative(ROOT, statePath)} 丢了或被重置。先核对状态：`);
    say('     node tools/publish-pending.js --dry-run');
    say('   确认无误要一次发完，请加 --force；只想发某几篇用 --file。');
    return 2;
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

  say(`🚀 发布待发布文章 · ${plan.batch.length} 篇${plan.rest.length ? `（另有 ${plan.rest.length} 篇留待下次）` : ''}`);
  const results = await publishPending({
    pending: plan.batch,
    state,
    statePath,
    opts,
    processOne,
    log: say
  });

  const failed = results.filter((r) => r.status === 'failed');
  say(`\n${'─'.repeat(46)}`);
  say(`完成：成功 ${results.length - failed.length} ｜ 失败 ${failed.length}`);
  if (failed.length) {
    // 定时任务里没人盯日志，失败必须能叫到人
    await alert({
      title: '补发失败',
      level: 'error',
      lines: failed.map((r) => `${r.name}：${String(r.error || '').split('\n')[0]}`)
    });
  }
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
  planBatch,
  publishPending,
  parseCliArgs,
  DEFAULT_LIMIT,
  MAX_UNGUARDED
};
