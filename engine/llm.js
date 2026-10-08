'use strict';

/**
 * 文本大模型客户端（OpenAI 兼容 /chat/completions）
 * ==================================================
 * 为什么需要这个模块：
 *   红酒号此前只有「人写 articles/*.json -> 引擎渲染」这一条链，没有任何写正文的代码
 *   （唯一的模型调用是 engine/ai-cover.js 的**封面图**生成）。本模块把「写稿」这一环补上，
 *   让 tools/generate-article.js 能自动产出符合 engine/article.js 校验的文章数据文件。
 *
 * 与 engine/ai-cover.js 的分工：
 *   ai-cover   只负责图（GLM / Z-Image / Gemini / Agnes 图像接口）
 *   本模块     只负责文（任何兼容 OpenAI /chat/completions 的服务）
 *   两张表刻意分开维护：图像 key 拿去聊天会直接报 invalid token，混用会产出「看起来很对、
 *   实际一直 401」的配置。
 *
 * 已实测（2026-09-27，本机直连、无代理）：
 *   zhipu  glm-4-flash        ✅ 961ms  —— 免费额度可用，默认首选
 *   zai    glm-4.5-flash      ⚠️ 返回空内容（可用性待定，仅作备选）
 *   dashscope qwen-turbo      ❌ Incorrect API key
 *   agnes  agnes-3.0-flash    ❌ Invalid token（项目里的 AGNES_API_KEY 是**图片** key）
 *   minimax abab6.5s-chat     ❌ insufficient balance
 *   openai gpt-4o-mini        ❌ 直连超时（需代理）
 * 因此 AUTO_ORDER 把 zhipu 放第一位；其余保留是为了「换个 key 就能用」而不必改代码。
 *
 * fail-closed：拿不到可用 provider 或调用失败时**抛错**，绝不返回模板拼贴的假稿。
 *   （红线同 archive/first-gen 的教训：宁可今天不出稿，也不往草稿箱塞低质内容。）
 */

const LLMUnavailableError = class LLMUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LLMUnavailableError';
  }
};

/**
 * provider 表。
 *   envKeys  —— 按顺序找第一个非空的环境变量作为 key
 *   baseUrl  —— OpenAI 兼容根地址（不带 /chat/completions）
 *   model    —— 默认文本模型
 *   keyEnv/baseUrlEnv/modelEnv —— 允许用环境变量覆盖
 */
const PROVIDERS = {
  zhipu: {
    label: '智谱 GLM',
    envKeys: ['GLM_API_KEY', 'ZHIPU_API_KEY', 'ZAI_API_KEY'],
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash-250414',
    // 降级/升档模型：同一家 key 下换一个更能写长文的模型。
    // 实测（2026-09-27，同一份 3 条素材的写稿提示词）：
    //   glm-4-flash        530~896 字，连续 3 次都不足 1200 字 -> 不合格
    //   glm-4-flash-250414 1258 字 / 24s  -> 通过，作主力
    //   glm-4.5-flash      2114 字 / 140s -> 通过，作写不出长度时的升档
    fallbackModel: 'glm-4.5-flash',
    baseUrlEnv: 'GLM_BASE_URL',
    modelEnv: 'GLM_TEXT_MODEL',
  },
  zai: {
    label: 'Z.ai GLM',
    envKeys: ['ZAI_API_KEY'],
    baseUrl: 'https://api.z.ai/api/paas/v4',
    model: 'glm-4.5-flash',
    baseUrlEnv: 'ZAI_BASE_URL',
    modelEnv: 'ZAI_TEXT_MODEL',
  },
  deepseek: {
    label: 'DeepSeek',
    envKeys: ['DEEPSEEK_API_KEY'],
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    modelEnv: 'DEEPSEEK_TEXT_MODEL',
  },
  siliconflow: {
    label: 'SiliconFlow',
    envKeys: ['SILICONFLOW_API_KEY'],
    baseUrl: 'https://api.siliconflow.cn/v1',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    baseUrlEnv: 'SILICONFLOW_BASE_URL',
    modelEnv: 'SILICONFLOW_TEXT_MODEL',
  },
  dashscope: {
    label: '阿里百炼（Qwen）',
    envKeys: ['DASHSCOPE_API_KEY'],
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-turbo',
    baseUrlEnv: 'DASHSCOPE_BASE_URL',
    modelEnv: 'DASHSCOPE_TEXT_MODEL',
  },
  agnes: {
    label: 'Agnes（文本）',
    // 注意：项目现有的 AGNES_API_KEY 是图片 key，聊天会 Invalid token。
    // 真要接 Agnes 文本，另配一个 AGNES_TEXT_API_KEY（见 AGNES_TEXT_BASE_URL）。
    envKeys: ['AGNES_TEXT_API_KEY'],
    baseUrl: 'https://apihub.agnes-ai.com/v1',
    model: 'agnes-3.0-flash',
    baseUrlEnv: 'AGNES_TEXT_BASE_URL',
    modelEnv: 'AGNES_TEXT_MODEL',
  },
  openai: {
    label: 'OpenAI 兼容',
    envKeys: ['OPENAI_API_KEY'],
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    baseUrlEnv: 'OPENAI_BASE_URL',
    modelEnv: 'OPENAI_TEXT_MODEL',
  },
};

/** auto 模式下的探测顺序（按实测可用性排序）。 */
const AUTO_ORDER = ['zhipu', 'zai', 'deepseek', 'siliconflow', 'dashscope', 'agnes', 'openai'];

const NO_PROVIDER_MSG =
  '未找到可用的文本大模型 Key。请在 .env 里配置 GLM_API_KEY（智谱，免费额度即可用），' +
  '或用 --provider 指定其它已配置 Key 的提供商。';

/** 解析单个 provider 的实际配置（key 缺失返回 null）。 */
function resolveProvider(name, env = process.env) {
  const spec = PROVIDERS[name];
  if (!spec) {return null;}
  let apiKey = '';
  for (const k of spec.envKeys) {
    if (env[k]) {apiKey = String(env[k]).trim(); break;}
  }
  if (!apiKey) {return null;}
  return {
    name,
    label: spec.label,
    apiKey,
    baseUrl: (spec.baseUrlEnv && env[spec.baseUrlEnv]) || spec.baseUrl,
    model: (spec.modelEnv && env[spec.modelEnv]) || spec.model,
    fallbackModel: spec.fallbackModel || '',
  };
}

/** 按 requested（可空 / 'auto'）选出第一个真正带 key 的 provider。 */
function pickProvider(requested = '', env = process.env) {
  const want = String(requested || '').trim().toLowerCase();
  if (want && want !== 'auto') {
    return resolveProvider(want, env);
  }
  for (const name of AUTO_ORDER) {
    const r = resolveProvider(name, env);
    if (r) {return r;}
  }
  return null;
}

/** 组装 chat/completions 请求体（纯函数，便于测试）。 */
function buildPayload({ model, messages, temperature = 0.85, maxTokens = 6000 }) {
  return {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: false,
  };
}

/**
 * 从响应里取出正文文本。兼容少数服务把内容放在 message.reasoning_content /
 * 顶层 text 的写法（z.ai 的空内容就是这种情况的一种表现）。
 */
function extractContent(data) {
  const choice = (data && data.choices && data.choices[0]) || {};
  const msg = choice.message || {};
  const text = msg.content ?? choice.text ?? '';
  return String(text || '').trim();
}

/**
 * 调一次 chat/completions。
 * @param {object} opts
 * @param {string} [opts.provider] 指定 provider 名，空/'auto' 时自动探测
 * @param {Array}  opts.messages   OpenAI 风格消息数组
 * @param {number} [opts.temperature]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.timeout]  毫秒，默认 180s（长文生成较慢）
 * @param {number} [opts.retries]  失败重试次数，默认 1
 * @param {string} [opts.model]    指定模型（默认用 provider 表里的）
 * @param {boolean}[opts.fallbackModel] true 时用 provider 的 fallbackModel（写不出长度时升档用）
 * @param {object} [opts.env]      环境变量（测试注入）
 * @param {object} [opts.deps]     { axios } 测试注入
 * @param {Function} [opts.onRetry] (attempt, err) => void
 * @returns {Promise<{text: string, provider: string, model: string, raw: object}>}
 */
async function chat(opts = {}) {
  const env = opts.env || process.env;
  const chosen = pickProvider(opts.provider, env);
  if (!chosen) {throw new LLMUnavailableError(NO_PROVIDER_MSG);}

  const axios = (opts.deps && opts.deps.axios) || require('axios');
  const getProxy = opts.deps && opts.deps.getAxiosProxyConfig
    ? opts.deps.getAxiosProxyConfig
    : () => require('../proxy').getAxiosProxyConfig();

  const timeout = opts.timeout || 180000;
  const retries = opts.retries === undefined ? 1 : opts.retries;
  const model = opts.model || (opts.fallbackModel && chosen.fallbackModel) || chosen.model;
  const payload = buildPayload({
    model,
    messages: opts.messages,
    temperature: opts.temperature,
    maxTokens: opts.maxTokens,
  });
  const url = `${String(chosen.baseUrl).replace(/\/+$/, '')}/chat/completions`;

  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axios.post(url, payload, {
        ...getProxy(),
        timeout,
        headers: {
          Authorization: `Bearer ${chosen.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const text = extractContent(res.data);
      if (!text) {
        throw new Error('模型返回空内容');
      }
      return { text, provider: chosen.name, model, raw: res.data };
    } catch (err) {
      lastErr = err;
      if (attempt < retries && typeof opts.onRetry === 'function') {
        opts.onRetry(attempt + 1, err);
      }
    }
  }

  const detail = describeError(lastErr);
  throw new LLMUnavailableError(`${chosen.label}（${model}）调用失败：${detail}`);
}

/** 把 axios 错误翻成一句人话（HTTP 状态码 + 服务端 message）。 */
function describeError(err) {
  if (!err) {return '未知错误';}
  const data = err.response && err.response.data;
  const serverMsg =
    data && (data.error && data.error.message ? data.error.message : data.message || data.msg);
  const status = err.response && err.response.status;
  if (serverMsg) {return `${status ? `${status} ` : ''}${serverMsg}`;}
  return err.message || String(err);
}

module.exports = {
  LLMUnavailableError,
  PROVIDERS,
  AUTO_ORDER,
  NO_PROVIDER_MSG,
  resolveProvider,
  pickProvider,
  buildPayload,
  extractContent,
  describeError,
  chat,
};
