#!/usr/bin/env node
'use strict';

/**
 * 出口 IP 变化监控 + 发布可用性预警
 * ==================================
 * 定位问题：家用宽带多为动态 IP，换网或运营商重分配后 IP 会变，
 * 公众号 IP 白名单随即失效，**下一次发布才会失败**（且失败发生在流程中途）。
 *
 * 本工具定时跑一遍发布前置自检，把「IP 变了」这件事提前告诉你。
 *
 * 行为
 * ----
 *   · 被白名单阻断      → 立即告警（附要添加的 IP）
 *   · 从阻断恢复        → 告知已恢复
 *   · IP 变了但仍可用   → 提醒（换网后下次可能就失效）
 *   · 一切正常且无变化  → 静默（避免噪音）
 *
 * 为避免重复告警，同一个「结论 + IP」在冷却期内只发一次；
 * IP 变化与状态恢复不受冷却期限制。
 *
 * 用法
 * ----
 *   node tools/ip-watch.js                  # 检查一次，必要时通知
 *   node tools/ip-watch.js --daemon         # 常驻，按 IP_WATCH_CRON 定时检查
 *   node tools/ip-watch.js --interval 60    # 常驻，每 60 分钟检查一次
 *   node tools/ip-watch.js --force          # 无论是否有变化都通知
 *   node tools/ip-watch.js --dry-run        # 只判断并打印，不发通知、不写状态
 *
 * 环境变量
 * --------
 *   IP_WATCH_CRON           默认 0 8 * * *（每天 8:00）
 *   IP_WATCH_COOLDOWN_HOURS 同类告警冷却小时数，默认 6
 *   IP_WATCH_STATE          状态文件路径，默认 logs/ip-watch-state.json
 *   NOTIFY_WEBHOOK_* / SMTP_* / MAIL_*  通知渠道配置（见 tools/notifier.js）
 *
 * 退出码：0 可发布 ｜ 1 被阻断 ｜ 2 凭据未配置
 */

try {
  require('dotenv').config();
} catch {
  // dotenv 可选
}

const fs = require('fs');
const path = require('path');

const { runPreflight, extractDocComment } = require('./check-wechat-ip');
const { Notifier } = require('./notifier');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_STATE_PATH = path.join(ROOT, 'logs', 'ip-watch-state.json');

/** 读取上次的检查状态（文件不存在或损坏时视为首次运行） */
function loadState(statePath) {
  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** 写入状态（失败不影响主流程） */
function saveState(statePath, patch) {
  try {
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    const prev = loadState(statePath);
    fs.writeFileSync(statePath, `${JSON.stringify({ ...prev, ...patch }, null, 2)}\n`, 'utf8');
    return true;
  } catch (err) {
    console.warn(`[ip-watch] 状态写入失败（不影响检查）: ${err.message}`);
    return false;
  }
}

function formatTime(iso) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * 判断本次结果是否需要通知。
 *
 * @param {object} result runPreflight 的返回值
 * @param {object} prev   上一轮状态（含 ip / verdict / lastNotifiedAt / lastNotifiedKey）
 * @param {{force?: boolean, cooldownHours?: number, now?: number}} [options]
 * @returns {{notify: boolean, reason: string, level?: string, title?: string, lines?: string[], key?: string}}
 */
function decideNotification(result, prev = {}, options = {}) {
  const prevIp = prev.ip || null;
  const curIp = result.effectiveIp || null;
  const ipChanged = Boolean(curIp && prevIp && curIp !== prevIp);
  const firstRun = !prev.checkedAt;

  const common = () => {
    const lines = [];
    if (curIp) {
      lines.push(`出口 IP：${curIp}`);
      if (ipChanged) {lines.push(`IP 变化：${prevIp} → ${curIp}`);}
    } else {
      lines.push('出口 IP：未能探测到');
    }
    return lines;
  };

  const tail = (extra = []) => [
    ...extra,
    `检查时间：${formatTime(result.checkedAt)}`
  ];

  // ① 白名单阻断 —— 最需要立即行动
  if (result.verdict === 'blocked' && result.errcode === 40164) {
    return {
      notify: true,
      reason: 'whitelist-blocked',
      level: 'error',
      title: '微信发布被阻断：IP 不在白名单',
      key: `whitelist-blocked:${curIp || 'unknown'}`,
      lines: tail([
        ...common(),
        '错误码：40164（不在白名单）',
        `修复步骤：公众平台 → 开发 → 基本配置 → IP白名单 → 添加 ${curIp || '当前出口 IP'}`,
        '验证方式：npm run wechat:check'
      ])
    };
  }

  // ② 从阻断恢复
  if (result.verdict === 'ok' && prev.verdict && prev.verdict !== 'ok') {
    return {
      notify: true,
      reason: 'recovered',
      level: 'ok',
      title: '微信发布已恢复可用',
      key: `recovered:${curIp || 'unknown'}`,
      lines: tail([...common(), '当前状态：✅ 成功获取 access_token'])
    };
  }

  // ③ IP 变化（当前仍可用，但换网后可能失效）
  if (ipChanged && result.verdict === 'ok') {
    return {
      notify: true,
      reason: 'ip-changed',
      level: 'warn',
      title: '出口 IP 已变化（当前仍可发布）',
      key: `ip-changed:${curIp}`,
      lines: tail([
        ...common(),
        '当前状态：✅ 仍可发布',
        '提示：若白名单只加了旧 IP，下次换网可能失败；建议同时保留新旧 IP'
      ])
    };
  }

  // ④ 凭据未配置
  if (result.verdict === 'credentials') {
    return {
      notify: true,
      reason: 'credentials',
      level: 'error',
      title: '微信凭据未配置，无法发布',
      key: 'credentials',
      lines: tail(['缺失：WECHAT_APPID 或 WECHAT_SECRET', '修复：cp .env.example .env 并填写'])
    };
  }

  // ⑤ 网络不可达
  if (result.verdict === 'blocked' && result.networkError) {
    return {
      notify: true,
      reason: 'network',
      level: 'error',
      title: '微信接口不可达（网络问题）',
      key: `network:${result.networkError}`,
      lines: tail([...common(), `错误：${result.networkError}`, '排查：确认能访问 api.weixin.qq.com，必要时在 .env 配置代理'])
    };
  }

  // ⑥ 其它阻断
  if (result.verdict === 'blocked') {
    return {
      notify: true,
      reason: 'blocked',
      level: 'error',
      title: '微信发布自检未通过',
      key: `blocked:${result.errcode}:${curIp || 'unknown'}`,
      lines: tail([...common(), `错误码：${result.errcode} ${result.errmsg || ''}`.trim()])
    };
  }

  // ⑦ 一切正常：首次运行或显式要求时才通知
  if (firstRun || options.force) {
    return {
      notify: true,
      reason: firstRun ? 'first-run' : 'forced',
      level: 'ok',
      title: '微信发布自检通过',
      key: `ok:${curIp || 'unknown'}`,
      lines: tail([...common(), `当前状态：✅ 可发布（token 有效期 ${result.expiresIn} 秒）`])
    };
  }

  return { notify: false, reason: 'unchanged' };
}

/** 冷却期内是否应抑制重复告警 */
function isSuppressed(decision, prev, now, cooldownHours) {
  // IP 变化与恢复属于状态跃迁，不受冷却期限制
  if (decision.reason === 'ip-changed' || decision.reason === 'recovered') {return false;}
  if (decision.key !== prev.lastNotifiedKey) {return false;}
  if (!prev.lastNotifiedAt) {return false;}

  const elapsedHours = (now - new Date(prev.lastNotifiedAt).getTime()) / 3600000;
  return elapsedHours < cooldownHours;
}

function parseArgs(argv) {
  const num = (flag) => {
    const i = argv.indexOf(flag);
    return i === -1 ? null : Number(argv[i + 1]);
  };
  return {
    daemon: argv.includes('--daemon'),
    intervalMinutes: num('--interval'),
    force: argv.includes('--force'),
    dryRun: argv.includes('--dry-run'),
    quiet: argv.includes('--quiet'),
    json: argv.includes('--json'),
    statePath: process.env.IP_WATCH_STATE || DEFAULT_STATE_PATH,
    cooldownHours: Number(process.env.IP_WATCH_COOLDOWN_HOURS || 6),
    help: argv.includes('-h') || argv.includes('--help')
  };
}

/** 执行一轮检查 + 决策 + 通知 */
async function runOnce(opts, notifier) {
  const result = await runPreflight();
  const prev = loadState(opts.statePath);
  const now = Date.now();

  const decision = decideNotification(result, prev, {
    force: opts.force,
    cooldownHours: opts.cooldownHours,
    now
  });

  let suppressed = false;
  let delivery = null;

  if (decision.notify && isSuppressed(decision, prev, now, opts.cooldownHours)) {
    suppressed = true;
  } else if (decision.notify && !opts.dryRun) {
    delivery = await notifier.send({
      title: decision.title,
      lines: decision.lines,
      level: decision.level
    });
  }

  if (!opts.dryRun) {
    saveState(opts.statePath, {
      ip: result.effectiveIp,
      verdict: result.verdict,
      errcode: result.errcode || null,
      checkedAt: result.checkedAt,
      // 只有真的发出去了才更新通知水位
      ...(decision.notify && !suppressed
        ? { lastNotifiedAt: new Date(now).toISOString(), lastNotifiedKey: decision.key, lastNotifiedReason: decision.reason }
        : {})
    });
  }

  return { result, decision, suppressed, delivery };
}

function report(out, opts) {
  const { result, decision, suppressed, delivery } = out;
  if (opts.json) {
    console.log(JSON.stringify({
      verdict: result.verdict,
      ip: result.effectiveIp,
      errcode: result.errcode || null,
      checkedAt: result.checkedAt,
      decision: { notify: decision.notify, reason: decision.reason, suppressed },
      delivery
    }, null, 2));
    return;
  }
  if (opts.quiet) {return;}

  const icon = { ok: '✅', warn: '⚠️', error: '🔴', info: 'ℹ️' }[decision.level] || 'ℹ️';
  const stamp = formatTime(result.checkedAt);

  if (decision.notify) {
    const state = suppressed ? '（冷却期内，已抑制重复通知）' : opts.dryRun ? '（dry-run，未发送）' : '';
    console.log(`${icon} [${stamp}] ${decision.title}${state}`);
    decision.lines.forEach((l) => console.log(`     ${l}`));
    if (delivery && delivery.enabled) {
      console.log(`     通知投递：成功 ${delivery.sent} ｜ 失败 ${delivery.failed}`);
      delivery.results.filter((r) => !r.success).forEach((r) => {
        console.log(`       ❌ ${r.channel}: ${r.error}`);
      });
    }
  } else {
    console.log(`✅ [${stamp}] 自检通过，无变化（IP ${result.effectiveIp || '未知'}）— 不发送通知`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);

  if (opts.help) {
    console.log(extractDocComment(__filename));
    process.exit(0);
  }

  const notifier = new Notifier();

  if (!notifier.enabled && !opts.quiet && !opts.json) {
    console.log('提示：未配置通知渠道，仅做本地检查。');
    console.log('      Webhook：NOTIFY_WEBHOOK_TYPE / NOTIFY_WEBHOOK_URL');
    console.log('      邮件   ：SMTP_HOST / SMTP_USER / SMTP_PASS / MAIL_TO\n');
  }

  // 常驻模式：先立刻检查一次，再按计划重复
  if (opts.daemon || opts.intervalMinutes) {
    const first = await runOnce(opts, notifier);
    report(first, opts);

    if (opts.intervalMinutes) {
      const ms = Math.max(1, opts.intervalMinutes) * 60000;
      console.log(`\n[ip-watch] 常驻模式：每 ${opts.intervalMinutes} 分钟检查一次（Ctrl+C 退出）`);
      setInterval(async () => {
        try {
          report(await runOnce(opts, notifier), opts);
        } catch (err) {
          console.error(`[ip-watch] 检查异常: ${err.message}`);
        }
      }, ms);
      return;
    }

    const cron = require('node-cron');
    const expr = process.env.IP_WATCH_CRON || '0 8 * * *';
    if (!cron.validate(expr)) {
      console.error(`❌ IP_WATCH_CRON 不是合法的 cron 表达式: ${expr}`);
      process.exit(2);
    }
    console.log(`\n[ip-watch] 常驻模式：按 "${expr}" 定时检查（Ctrl+C 退出）`);
    cron.schedule(expr, async () => {
      try {
        report(await runOnce(opts, notifier), opts);
      } catch (err) {
        console.error(`[ip-watch] 检查异常: ${err.message}`);
      }
    });
    return;
  }

  const out = await runOnce(opts, notifier);
  report(out, opts);
  process.exit(out.result.exitCode);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ ip-watch 异常:', err.message);
    process.exit(1);
  });
}

module.exports = {
  loadState,
  saveState,
  decideNotification,
  isSuppressed,
  parseArgs,
  formatTime
};
