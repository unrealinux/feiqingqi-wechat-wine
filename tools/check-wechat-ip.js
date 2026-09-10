#!/usr/bin/env node
'use strict';

/**
 * 微信发布前置自检
 * ================
 * 在真正发布之前，确认当前网络环境**能**调用微信接口。
 *
 * 为什么需要它
 * ------------
 * 微信要求调用方 IP 在公众号后台的「IP 白名单」内，否则接口返回 40164。
 * 这个错误在发布流程走到一半时才会暴露（封面已上传、草稿没建成），
 * 排查成本高。本脚本把这件事提前到最前面，并直接给出要添加的那个 IP。
 *
 * 关键点：脚本走的是**和发布完全相同的出口路径**（含代理）。
 * 配了代理时，需要加进白名单的是**代理的出口 IP**，而不是本机 IP。
 *
 * 用法
 * ----
 *   node tools/check-wechat-ip.js          # 人类可读报告
 *   node tools/check-wechat-ip.js --json   # 机器可读（供 CI / 脚本调用）
 *   node tools/check-wechat-ip.js --no-ip  # 跳过出口 IP 探测
 *
 * 退出码
 * ------
 *   0  可以发布
 *   1  无法发布（白名单/凭据/网络问题）
 *   2  配置缺失（.env 未配置凭据）
 */

try {
  require('dotenv').config();
} catch {
  // dotenv 缺失时不阻塞：仍可从真实环境变量读取
}

const axios = require('axios');
const { getProxyConfig, getAxiosProxyConfig } = require('../proxy');

const TOKEN_URL = process.env.WECHAT_TOKEN_URL || 'https://api.weixin.qq.com/cgi-bin/token';
const TIMEOUT = Number(process.env.WECHAT_CHECK_TIMEOUT || 15000);

/**
 * 出口 IP 探测服务，按顺序回退。
 *
 * 全部使用 IPv4 专用端点：微信 IP 白名单面向 IPv4，而本机可能同时具备 v4/v6，
 * 通用端点会优先返回 IPv6，导致给出的 IP 根本不是微信看到的那个。
 */
const IP_PROVIDERS = [
  { name: 'ipify', url: 'https://api.ipify.org?format=json', pick: (d) => d && d.ip },
  { name: 'icanhazip', url: 'https://ipv4.icanhazip.com', pick: (d) => String(d).trim() },
  { name: 'ifconfig.me', url: 'https://ipv4.ifconfig.me/ip', pick: (d) => String(d).trim() },
  { name: 'ident.me', url: 'https://ipv4.ident.me', pick: (d) => String(d).trim() }
];

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

/**
 * 从微信 40164 的 errmsg 中提取它实际看到的 IP。
 *
 * 这是**最权威**的白名单依据 —— 微信会直接告诉你它看到了什么，
 * 例如："invalid ip 120.208.99.249 ipv6 ::ffff:120.208.99.249, not in whitelist"
 * 这比任何外部回声服务都可靠，因为它就是真实请求的出口。
 * @param {string} errmsg
 * @returns {{ip: string, family: number}|null}
 */
function extractReportedIp(errmsg) {
  if (!errmsg) {return null;}
  const v4 = String(errmsg).match(/invalid ip\s+((?:\d{1,3}\.){3}\d{1,3})/i);
  if (v4) {return { ip: v4[1], family: 4 };}
  return null;
}

/** 微信错误码 -> 修复建议（与 engine/wechat.js 保持一致） */
const HINTS = {
  40001: '凭据无效或已过期。若刚重置过 AppSecret，请同步更新 .env 的 WECHAT_SECRET。',
  40013: 'AppID 无效。请核对 .env 的 WECHAT_APPID。',
  40125: 'AppSecret 无效。请在公众平台重置后更新 .env。',
  40164: '当前出口 IP 不在公众号的 IP 白名单中。',
  41002: 'appid 缺失。请检查 .env 的 WECHAT_APPID。',
  45009: '接口调用超过每日上限（token 接口 2000 次/天）。请稍后重试。',
  48001: '接口未授权。草稿箱/发布接口需要已认证的服务号。'
};

/** 掩码显示，避免把凭据写进日志 */
function mask(value) {
  if (!value) {return '(未配置)';}
  return value.length <= 10 ? `${value.slice(0, 3)}…` : `${value.slice(0, 10)}…`;
}

function parseArgs(argv) {
  return {
    json: argv.includes('--json'),
    skipIp: argv.includes('--no-ip'),
    quiet: argv.includes('--quiet'),
    help: argv.includes('-h') || argv.includes('--help')
  };
}

/**
 * 构建 axios 配置：显式决定是否走代理，避免 axios 隐式读取环境变量导致
 * 自检与实际发布走了不同的出口。
 */
function buildAxiosConfig({ silent = false } = {}) {
  const proxy = getProxyConfig();
  let config = { proxy: false, timeout: TIMEOUT };

  if (proxy.enabled) {
    // proxy.js 内部会打印一行日志，静默模式下（--json / 被其他脚本调用）不污染输出
    const original = console.log;
    if (silent) {console.log = () => {};}
    try {
      config = { ...getAxiosProxyConfig(), timeout: TIMEOUT };
    } finally {
      console.log = original;
    }
  }

  return { config, proxy };
}

/** 探测出口公网 IP（走与发布相同的出口路径）。 */
async function detectEgressIp(axiosConfig) {
  const failures = [];

  for (const provider of IP_PROVIDERS) {
    try {
      const res = await axios.get(provider.url, { ...axiosConfig, responseType: 'json' });
      const ip = provider.pick(res.data);
      if (ip && IPV4_RE.test(ip)) {
        return { ip, provider: provider.name };
      }
      failures.push(`${provider.name}: 响应不是 IPv4 (${ip || '空'})`);
    } catch (err) {
      failures.push(`${provider.name}: ${err.message}`);
    }
  }

  return { ip: null, provider: null, error: failures.join('; ') };
}

/** 调用 token 接口，判断凭据与白名单是否可用。 */
async function checkWeChat(axiosConfig, appId, appSecret) {
  try {
    const res = await axios.get(TOKEN_URL, {
      ...axiosConfig,
      params: { grant_type: 'client_credential', appid: appId, secret: appSecret }
    });

    if (res.data.errcode) {
      return { ok: false, errcode: res.data.errcode, errmsg: res.data.errmsg };
    }
    return { ok: true, expiresIn: Number(res.data.expires_in || 7200) };
  } catch (err) {
    return { ok: false, networkError: err.message };
  }
}

function printHelp() {
  console.log(extractDocComment(__filename));
}

/**
 * 提取文件开头的块注释内容作为帮助文本。
 * 不能用简单的“截到第一个块注释结束符”的做法：文件开头的块注释起始符本身
 * 并不含结束符，会把 shebang 与 'use strict' 一并带入输出。
 */
function extractDocComment(file) {
  const src = require('fs').readFileSync(file, 'utf8');
  const match = src.match(/\/\*\*([\s\S]*?)\*\//);
  return match ? match[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)';
}

function renderReport(result) {
  const line = '═'.repeat(52);
  const out = [];

  out.push('微信发布前置自检');
  out.push(line);

  // ① 出口网络
  out.push('① 出口网络');

  // 微信错误里直接报了它看到的 IP 时，以它为准（最权威）
  if (result.reportedIp) {
    out.push(`   微信看到的 IP   ${result.reportedIp}   ← 白名单要加这个（来自微信接口返回）`);
    if (result.ip && result.ip !== result.reportedIp) {
      out.push(`   本机探测 IP     ${result.ip}   (来源 ${result.ipProvider}，与微信所见不同)`);
    }
  } else if (result.ip) {
    out.push(`   出口 IP         ${result.ip}   (来源: ${result.ipProvider})`);
  } else if (result.ipSkipped) {
    out.push('   出口 IP         已跳过 (--no-ip)');
  } else {
    out.push(`   出口 IP         探测失败 —— ${result.ipError}`);
    out.push('   提示            全部探测服务均不可达，可能是网络/代理阻断');
  }

  out.push(`   代理            ${result.proxy.enabled ? `已启用 (${result.proxy.https || result.proxy.http})` : '未配置（直连）'}`);
  if (result.reportedIp || result.ip) {
    out.push(`   说明            白名单需要添加的正是 ${result.reportedIp || result.ip}`);
  }
  out.push('');

  // ② 凭据
  out.push('② 凭据 (.env)');
  out.push(`   WECHAT_APPID    ${mask(result.appId).padEnd(16)}${result.appId ? '✅' : '❌ 未配置'}`);
  out.push(`   WECHAT_SECRET   ${(result.appSecretConfigured ? '已配置' : '未配置').padEnd(16)}${result.appSecretConfigured ? '✅' : '❌ 未配置'}`);
  out.push('');

  // ③ 接口连通性
  out.push('③ 微信接口连通性');
  if (result.verdict === 'ok') {
    out.push(`   ✅ 成功获取 access_token（有效期 ${result.expiresIn} 秒）`);
  } else if (result.verdict === 'credentials') {
    out.push('   ⛔ 缺少 WECHAT_APPID / WECHAT_SECRET');
  } else if (result.errcode) {
    out.push(`   ❌ [${result.errcode}] ${result.errmsg}`);
    if (HINTS[result.errcode]) {out.push(`   可能原因：${HINTS[result.errcode]}`);}
  } else {
    out.push(`   ❌ 网络请求失败 —— ${result.networkError}`);
  }
  out.push('');

  // 结论
  out.push(line);
  if (result.verdict === 'ok') {
    out.push('结论：✅ 可以发布');
  } else {
    out.push('结论：⛔ 无法发布');
    out.push('');
    out.push('修复步骤：');
    if (result.verdict === 'credentials') {
      out.push('  1. cp .env.example .env');
      out.push('  2. 填入 WECHAT_APPID 与 WECHAT_SECRET');
    } else if (result.errcode === 40164) {
      const target = result.reportedIp || result.ip || '<当前出口 IP>';
      out.push('  1. 打开 https://mp.weixin.qq.com → 开发 → 基本配置 → IP白名单');
      out.push(`  2. 添加：${target}${result.proxy.enabled ? '（注意：配了代理，要加代理的出口 IP）' : ''}`);
      out.push('  3. 重新运行 npm run wechat:check 确认');
    } else if ([40001, 40013, 40125, 41002].includes(result.errcode)) {
      out.push('  1. 打开 https://mp.weixin.qq.com → 开发 → 基本配置');
      out.push('  2. 核对 AppID；必要时重置 AppSecret');
      out.push('  3. 更新 .env 后重新运行 npm run wechat:check');
    } else if (result.networkError) {
      out.push('  1. 确认能访问 api.weixin.qq.com');
      out.push('  2. 若需要代理，在 .env 配置 HTTP_PROXY / HTTPS_PROXY');
    } else {
      out.push('  1. 按上面的错误码提示处理');
    }
  }

  return out.join('\n');
}

/**
 * 执行一次完整的发布前置检查（供 CLI 与其他工具复用）。
 *
 * 结果对象**绝不含明文凭据**：只给 appSecretConfigured 布尔值。
 * 因为它会被 --json 输出、也可能被写入日志。
 *
 * @param {{skipIp?: boolean, appId?: string, appSecret?: string, silent?: boolean}} [options]
 * @returns {Promise<object>} 含 verdict ('ok'|'blocked'|'credentials') 与 exitCode
 */
async function runPreflight(options = {}) {
  const appId = options.appId !== undefined ? options.appId : process.env.WECHAT_APPID;
  const appSecret = options.appSecret !== undefined ? options.appSecret : process.env.WECHAT_SECRET;

  const { config: axiosConfig, proxy } = buildAxiosConfig({ silent: options.silent !== false });

  const result = {
    appId: appId || '',
    appSecretConfigured: Boolean(appSecret),
    proxy,
    ip: null,
    ipProvider: null,
    reportedIp: null,
    ipSkipped: Boolean(options.skipIp),
    errcode: null,
    errmsg: null,
    networkError: null,
    expiresIn: null,
    checkedAt: new Date().toISOString()
  };

  if (!result.ipSkipped) {
    const ipResult = await detectEgressIp(axiosConfig);
    result.ip = ipResult.ip;
    result.ipProvider = ipResult.provider;
    result.ipError = ipResult.error;
  }

  if (!appId || !appSecret) {
    result.verdict = 'credentials';
  } else {
    const check = await checkWeChat(axiosConfig, appId, appSecret);
    if (check.ok) {
      result.verdict = 'ok';
      result.expiresIn = check.expiresIn;
    } else {
      result.verdict = 'blocked';
      result.errcode = check.errcode || null;
      result.errmsg = check.errmsg || null;
      result.networkError = check.networkError || null;
      // 微信 40164 会直接告知它看到的出口 IP，这是最权威的白名单依据
      const reported = extractReportedIp(result.errmsg);
      result.reportedIp = reported ? reported.ip : null;
    }
  }

  /** 真正需要加进白名单的 IP：优先用微信报出的那一个 */
  result.effectiveIp = result.reportedIp || result.ip || null;
  result.exitCode = result.verdict === 'ok' ? 0 : result.verdict === 'credentials' ? 2 : 1;

  return result;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  const result = await runPreflight({ skipIp: opts.skipIp });

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (!opts.quiet) {
    console.log(renderReport(result));
  }

  process.exit(result.exitCode);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ 自检脚本异常:', err.message);
    process.exit(1);
  });
}

module.exports = {
  mask,
  detectEgressIp,
  checkWeChat,
  renderReport,
  buildAxiosConfig,
  extractReportedIp,
  extractDocComment,
  runPreflight,
  IPV4_RE,
  IP_PROVIDERS,
  HINTS
};
