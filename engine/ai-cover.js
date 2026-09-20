'use strict';

/**
 * AI 封面生成（写实图像）
 * ======================
 * 用图像大模型生成写实的葡萄酒主题封面，再合成为公众号封面尺寸（默认 1200x630）。
 *
 * 与 engine/cover.js 的关系：
 *   cover.js 是「矢量兜底」——无 API Key、调用失败或显式 --no-cover-ai 时使用；
 *   本模块负责真正调用大模型。cli.js 会优先尝试这里，失败自动回退。
 *
 * 提供商（按此顺序自动选择，可用 COVER_AI_PROVIDER 指定其一）：
 *   glm     智谱 CogView（国内，cogview-4）
 *   zimage  ModelScope Z-Image（国内，z-image-turbo）
 *   gemini  Google Gemini（国际）
 *
 * 为什么国内优先：本机为直连（无代理）时，open.bigmodel.cn / modelscope 可达，
 * Gemini 往往不可达；顺序让默认情况下一次就成功。
 */

const { wrapByWidth, escapeXml, DEFAULTS } = require('./cover');

const NO_PROVIDER_MSG =
  '未配置任何图像 API Key（GLM_API_KEY / ZIMAGE_API_KEY / GEMINI_API_KEY），无法生成 AI 封面';

/** 负向提示：避免模型在封面里画出文字/水印 */
const NEGATIVE_PROMPT =
  '文字, 字母, 水印, logo, 签名, 模糊, 低质量, 卡通, 变形, 过曝, text, watermark, letters, signature, blurry, low quality, cartoon, deformed';

/**
 * 分类 -> 写实场景（英文提示对多数模型更稳定）。
 *
 * 每个分类给多个变体：只按分类出图会让同一分类的文章「千人一面」
 * —— 之前两篇 wine-knowledge 的封面都是「暗背景上一杯红酒 + 葡萄」。
 * 变体按文章 name 稳定挑选（同一篇每次生成结果一致，不同篇大概率不同）。
 */
const SCENES = {
  'wine-knowledge': [
    'an elegant crystal wine glass filled with deep red wine on a dark wooden table, soft rim lighting, professional product photography, shallow depth of field, dark moody background',
    'a close-up of ripe dark grapes still on the vine among green leaves, morning dew, backlit by soft sunlight, vineyard bokeh in the background, macro photography',
    'a rustic oak barrel and a glass of red wine inside a dim stone cellar, warm lamp light, fine dust in the air, cinematic photography',
    'a winemaker holding a tasting glass beside stainless steel tanks in a modern winery, cool clean daylight, documentary photography'
  ],
  'wine-food': [
    'a glass of red wine beside a beautifully plated gourmet dish on a rustic wooden table, warm ambient light, food and wine pairing, professional food photography, shallow depth of field',
    'overhead flat lay of a cheese and charcuterie board with a glass of red wine, linen napkin, natural window light, food magazine style photography',
    'a summer table seen from above with grilled dishes, fresh herbs and two glasses of wine, warm sunlight, lifestyle food photography'
  ],
  'wine-culture': [
    'an old stone wine cellar with oak barrels and dusty bottles, warm candlelight, atmospheric haze, cinematic photography, rich textures',
    'a historic chateau facade with vineyards in the foreground at golden hour, dramatic clouds, architectural travel photography',
    'hands of an elderly winemaker sorting grapes on a wooden table, warm workshop light, reportage photography, shallow depth of field'
  ],
  'market-trends': [
    'premium wine bottles and a crystal decanter on a mahogany desk, elegant dark office, moody lighting, professional still life photography',
    'an auction catalogue, a gavel and a bottle of fine wine on a dark table, dramatic side light, editorial still life photography',
    'stacked wooden wine cases inside a climate controlled wine storage room, rows of bottles behind, cool precise lighting, documentary photography'
  ],
  'practical-guide': [
    'a wine corkscrew, decanter and two wine glasses arranged on a clean table, soft studio lighting, elegant minimal still life, professional photography',
    'a wine bottle lying in a temperature controlled wine fridge with a digital thermometer, clean product photography, soft light',
    'a hand pouring red wine from a decanter into a glass, dark background, motion of the pour frozen, studio photography'
  ],
  'wine-health': [
    'a single glass of red wine with fresh grapes on a bright table, clean natural light, minimal still life, professional photography',
    'a glass of red wine beside a bowl of berries and olive oil on a light kitchen counter, healthy Mediterranean still life, soft daylight'
  ],
  'wine-myth': [
    'dramatic chiaroscuro still life of a wine glass and bottle, deep shadows, fine art photography, dark background',
    'two wine glasses side by side on a dark reflective surface, one backlit, strong contrast, conceptual fine art photography'
  ],
  lifestyle: [
    'a wine picnic at golden hour with a vineyard in the background, warm sunset light, lifestyle photography, shallow depth of field',
    'two friends toasting with red wine on a terrace overlooking vineyards, warm evening light, candid lifestyle photography',
    'a travel scene of a wine route through rolling hills, a bottle and glasses on a stone wall, late afternoon light, landscape photography'
  ]
};

/** 未知分类时的兜底分类 */
const DEFAULT_CATEGORY = 'wine-knowledge';

/** 提供商注册表 */
const PROVIDERS = {
  glm: {
    label: '智谱 CogView',
    keyEnv: 'GLM_API_KEY',
    modelEnv: 'GLM_IMAGE_MODEL',
    defaultModel: 'cogview-4',
    // cogview-4 需付费余额；余额不足时回退到免费但带「AI生成」水印的 cogview-3-flash
    models: ['cogview-4', 'cogview-3-flash'],
    size: '1344x768'
  },
  zimage: {
    label: 'ModelScope Z-Image',
    keyEnv: 'ZIMAGE_API_KEY',
    modelEnv: 'ZIMAGE_IMAGE_MODEL',
    defaultModel: 'z-image-turbo',
    size: '1024x576'
  },
  gemini: {
    label: 'Google Gemini',
    keyEnv: 'GEMINI_API_KEY',
    modelEnv: 'GEMINI_IMAGE_MODEL',
    defaultModel: 'gemini-2.0-flash-exp-image-generation'
  },
  // 自定义 / 兼容 OpenAI 风格的图像 API（含 Agnes）。
  // 只需环境变量即可接入，无需改代码：
  //   <PREFIX>API_URL（必填）/ <PREFIX>API_KEY / <PREFIX>MODEL
  //   <PREFIX>SIZE / <PREFIX>AUTH_HEADER / <PREFIX>AUTH_PREFIX / <PREFIX>EXTRA_JSON
  agnes: {
    label: 'Agnes',
    keyEnv: 'AGNES_API_KEY',
    urlEnv: 'AGNES_API_URL',
    modelEnv: 'AGNES_MODEL',
    defaultModel: '',
    prefix: 'AGNES_'
  },
  custom: {
    label: '自定义图像 API',
    keyEnv: 'CUSTOM_IMAGE_API_KEY',
    urlEnv: 'CUSTOM_IMAGE_API_URL',
    modelEnv: 'CUSTOM_IMAGE_MODEL',
    defaultModel: '',
    prefix: 'CUSTOM_IMAGE_'
  }
};

const DEFAULT_ORDER = ['glm', 'zimage', 'gemini', 'agnes', 'custom'];

/** FNV-1a：把文章名映射成一个稳定的数字，用于挑选场景变体 */
function hashKey(str) {
  let h = 2166136261;
  const s = String(str || '');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * 按分类挑一个场景变体。key 用文章 name（回退 title），保证同一篇稳定、不同篇分散。
 * @param {string} category
 * @param {string} [key]
 */
function pickScene(category, key = '') {
  const list = SCENES[category] || SCENES[DEFAULT_CATEGORY];
  return list[hashKey(key) % list.length];
}

/**
 * 从 slug 与英文 tag 里取「画面内容关键词」。
 *
 * 为什么不用中文标题：多数图像模型会把提示词里的文字画进画面（中文更容易被画成
 * 乱码字），而 slug（balkan_native_grapes）与英文 tag（DWWA / Plavac Mali）
 * 本来就是英文，既能给模型有效线索，又没有画字的副作用。
 */
function topicHint(spec = {}) {
  const parts = [];
  const slug = String(spec.name || '').trim();
  if (slug) {parts.push(slug.replace(/[_-]+/g, ' '));}
  const asciiTags = (Array.isArray(spec.tags) ? spec.tags : [])
    .filter((t) => typeof t === 'string' && /^[\x20-\x7E]{2,}$/.test(t));
  parts.push(...asciiTags.slice(0, 3));
  return parts.join(', ');
}

/**
 * 由分类 + 文章信息构造写实场景提示词。
 *
 * 优先级：文章自带的 spec.cover.prompt（完全自定义）> 分类场景变体 + 关键词。
 */
function buildCoverPrompt(spec = {}, options = {}) {
  const custom = (spec.cover && typeof spec.cover === 'object' && spec.cover.prompt)
    || spec.coverPrompt;
  if (custom) {return String(custom).trim();}

  const key = spec.name || spec.title || '';
  const scene = options.scene || pickScene(spec.category, key);
  const hint = topicHint(spec);
  const topic = hint ? `。画面内容：${hint}（不要把文字写进画面）` : '';
  const style = '。写实摄影，真实光影，专业布光，高清细节，浅景深，画面中不要出现任何文字、字母或水印';
  return `${scene}${topic}${style}`;
}

/**
 * 计算可用的提供商顺序。
 * @param {object} env 环境变量（默认 process.env）
 * @param {string} [requested] 显式指定（COVER_AI_PROVIDER 或 options.provider）
 */
function availableProviders(env = process.env, requested = '') {
  const usable = (name) => {
    const meta = PROVIDERS[name];
    if (!env[meta.keyEnv]) {return false;}
    // 自定义类提供商必须同时给出 API_URL，否则选中也只会失败
    return !meta.urlEnv || Boolean(env[meta.urlEnv]);
  };
  const want = String(requested || env.COVER_AI_PROVIDER || '').trim().toLowerCase();
  if (want && want !== 'auto') {
    return PROVIDERS[want] && usable(want) ? [want] : [];
  }
  return DEFAULT_ORDER.filter(usable);
}

/** 从 URL 或 base64 取出图片 Buffer */
async function fetchImageBuffer(axios, ref, timeout) {
  if (!ref) {throw new Error('提供商未返回图片数据');}
  if (/^https?:\/\//i.test(ref)) {
    const res = await axios.get(ref, { responseType: 'arraybuffer', timeout });
    return Buffer.from(res.data);
  }
  return Buffer.from(ref, 'base64');
}

/** 某提供商要尝试的模型列表（env 指定时只用指定值） */
function modelsFor(name, env = process.env) {
  const meta = PROVIDERS[name];
  const custom = env[meta.modelEnv];
  if (custom) {return [custom];}
  return meta.models || [meta.defaultModel];
}

async function callGlm(prompt, { axios, env, timeout, model }) {
  const res = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/images/generations',
    { model, prompt, size: env.COVER_AI_SIZE || PROVIDERS.glm.size, watermark_enabled: false },
    { headers: { Authorization: `Bearer ${env.GLM_API_KEY}`, 'Content-Type': 'application/json' }, timeout }
  );
  const item = res.data && res.data.data && res.data.data[0];
  return fetchImageBuffer(axios, item && (item.url || item.b64_json), timeout);
}

async function callZImage(prompt, { axios, env, timeout, model }) {
  const [w, h] = String(env.COVER_AI_SIZE || PROVIDERS.zimage.size).split('x').map(Number);
  const res = await axios.post(
    'https://api-inference.modelscope.cn/v1/images/generations',
    { model, prompt, negative_prompt: NEGATIVE_PROMPT, steps: 8, width: w || 1024, height: h || 576 },
    { headers: { Authorization: `Bearer ${env.ZIMAGE_API_KEY}`, 'Content-Type': 'application/json' }, timeout }
  );
  const item = res.data && res.data.data && res.data.data[0];
  return fetchImageBuffer(axios, item && (item.image || item.b64_json || item.url), timeout);
}

async function callGemini(prompt, { axios, env, timeout, model }) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: `${prompt}。Negative prompt: ${NEGATIVE_PROMPT}` }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    },
    { headers: { 'Content-Type': 'application/json' }, timeout }
  );
  const parts = (res.data && res.data.candidates && res.data.candidates[0]
    && res.data.candidates[0].content && res.data.candidates[0].content.parts) || [];
  const part = parts.find((p) => p.inlineData || p.inline_data);
  const b64 = part && (part.inlineData ? part.inlineData.data : part.inline_data.data);
  return fetchImageBuffer(axios, b64, timeout);
}

const CALLERS = { glm: callGlm, zimage: callZImage, gemini: callGemini };

/**
 * 从各种常见响应结构中取出图片引用（URL 或 base64）。
 * 覆盖 OpenAI（data[].url / data[].b64_json）、部分平台（data[].image / images[] / output[]）。
 */
function extractImageRef(data, responseType = 'auto') {
  const pick = (obj) => {
    if (!obj) {return null;}
    if (typeof obj === 'string') {return obj;}
    return obj.url || obj.b64_json || obj.image || obj.image_url || obj.base64 || null;
  };

  if (responseType === 'url' || responseType === 'b64') {
    // 指定类型时仍然按位置找，只是不做形状猜测
    const item = Array.isArray(data && data.data) ? data.data[0] : null;
    return pick(item) || (responseType === 'url' ? null : pick(data));
  }

  return pick(data && data.data && data.data[0])
    || pick(data && data.images && data.images[0])
    || pick(data && data.output && data.output[0])
    || pick(data && data.result)
    || pick(data);
}

/** 读取自定义提供商的配置 */
function genericConfig(prefix, env) {
  const get = (name) => env[`${prefix}${name}`];
  let extra = {};
  if (get('EXTRA_JSON')) {
    try { extra = JSON.parse(get('EXTRA_JSON')); } catch { extra = {}; }
  }
  return {
    url: get('API_URL') || get('BASE_URL') || '',
    key: get('API_KEY') || '',
    model: get('MODEL') || '',
    size: get('SIZE') || '1024x1024',
    authHeader: get('AUTH_HEADER') || 'Authorization',
    // 显式设为空字符串时不加前缀
    authPrefix: get('AUTH_PREFIX') === undefined ? 'Bearer ' : get('AUTH_PREFIX'),
    responseType: String(get('RESPONSE_TYPE') || 'auto').toLowerCase(),
    extra
  };
}

/** 兼容 OpenAI 风格的通用图像接口 */
async function callGeneric(prompt, { axios, env, timeout, model, prefix }) {
  const cfg = genericConfig(prefix, env);
  if (!cfg.url) {throw new Error(`未配置 ${prefix}API_URL`);}

  const headers = { 'Content-Type': 'application/json' };
  if (cfg.key) {headers[cfg.authHeader] = `${cfg.authPrefix}${cfg.key}`;}

  const body = { prompt, ...cfg.extra };
  const useModel = model || cfg.model;
  if (useModel) {body.model = useModel;}
  if (cfg.size) {body.size = cfg.size;}

  const res = await axios.post(cfg.url, body, { headers, timeout });
  const ref = extractImageRef(res.data, cfg.responseType);
  if (!ref) {throw new Error('响应中未找到图片 URL / base64');}
  return fetchImageBuffer(axios, ref, timeout);
}

CALLERS.agnes = (prompt, ctx) => callGeneric(prompt, { ...ctx, prefix: PROVIDERS.agnes.prefix });
CALLERS.custom = (prompt, ctx) => callGeneric(prompt, { ...ctx, prefix: PROVIDERS.custom.prefix });

/**
 * 合成封面：裁剪到目标尺寸 + 叠加标题/分类/页脚。
 */
async function composeCover(imageBuffer, spec, options = {}) {
  const sharp = options.sharp || require('sharp');
  const width = options.width || DEFAULTS.width;
  const height = options.height || DEFAULTS.height;

  const base = await sharp(imageBuffer)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  const overlay = Buffer.from(buildOverlaySvg(spec, { ...options, width, height }));
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
}

/** 生成底部渐变 + 文字的 SVG 叠加层 */
function buildOverlaySvg(spec = {}, options = {}) {
  const width = options.width || DEFAULTS.width;
  const height = options.height || DEFAULTS.height;
  const accent = options.accent || DEFAULTS.accent;
  const footer = options.footer || DEFAULTS.footer;
  const pad = options.pad || 56;
  const titleFontSize = options.titleFontSize || 46;
  const lineHeight = Math.round(titleFontSize * 1.28);

  // 默认不把标题/分类烧进封面：标题在公众号正文列表里本就显示，
  // 图上再叠一次既冗余、又容易被裁切。
  // 需要旧行为时传 { showTitle: true } / { showCategory: true }
  // （CLI: --cover-title / --cover-category）。
  const showTitle = options.showTitle === true;
  const showCategory = options.showCategory === true;
  const hasText = showTitle || showCategory;

  // 每行允许的半角宽度。旧算法按 fontSize/2 估算（假定半角恰好 0.5em），
  // 对加粗大写英文明显偏窄，长标题会溢出画布右侧被裁掉；这里留足余量。
  const maxUnits = Math.max(8, Math.floor((width - pad * 2) / (titleFontSize * 0.58)));
  const titleLines = showTitle ? wrapByWidth(spec.title || '', maxUnits, 2) : [];

  const footerY = height - 30;
  const categoryY = footerY - 34;
  const titleBaseline = categoryY - 28 - (titleLines.length - 1) * lineHeight;

  const titleTspans = titleLines
    .map((line, i) => `<text x="${pad}" y="${titleBaseline + i * lineHeight}" `
      + `font-size="${titleFontSize}" font-weight="bold" fill="#ffffff" `
      + `font-family="Microsoft YaHei, PingFang SC, sans-serif">${escapeXml(line)}</text>`)
    .join('\n  ');

  const category = escapeXml(String(spec.category || '').toUpperCase());
  const footerText = escapeXml(footer);

  // 底部渐变只为文字可读性服务；没有任何叠加文字时不画，封面保持干净。
  const scrimTop = showTitle ? 0.42 : 0.7;
  const scrim = hasText
    ? `<rect x="0" y="${Math.round(height * scrimTop)}" width="${width}" height="${Math.round(height * (1 - scrimTop))}" fill="url(#shade)"/>`
    : '';
  const accentBar = hasText
    ? `<rect x="${pad}" y="${categoryY - 18}" width="56" height="4" fill="${escapeXml(accent)}"/>`
    : '';
  const categoryEl = showCategory
    ? `<text x="${pad}" y="${categoryY + 14}" font-size="18" letter-spacing="2" fill="${escapeXml(accent)}"
        font-family="Microsoft YaHei, PingFang SC, sans-serif">${category}</text>`
    : '';

  // 页脚叠在照片上，先用深色描边打底再填色，保证在亮背景上也能看清
  const footerAttrs = `x="${width - pad}" y="${footerY}" font-size="14" text-anchor="end"`
    + ' font-family="sans-serif"';
  const footerEl = `<text ${footerAttrs} fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="3">${footerText}</text>
  <text ${footerAttrs} fill="rgba(255,255,255,0.88)">${footerText}</text>`;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  ${scrim}
  ${accentBar}
  ${titleTspans}
  ${categoryEl}
  ${footerEl}
</svg>`;
}

/**
 * 调用图像大模型生成封面。
 * @param {object} spec {name, title, category, tags?, digest?}
 * @param {object} [options]
 * @param {object} [options.env] 环境变量（默认 process.env）
 * @param {string} [options.provider] 指定提供商
 * @param {boolean} [options.showTitle] 是否把标题叠在封面上（默认 false）
 * @param {number} [options.timeout] 单次请求超时（毫秒）
 * @returns {Promise<{buffer: Buffer, provider: string, model: string, prompt: string}>}
 */
async function generateAiCover(spec, options = {}) {
  const env = options.env || process.env;
  const axios = options.axios || require('axios');
  const timeout = options.timeout || Number(env.COVER_AI_TIMEOUT) || 60000;
  const order = options.providers || availableProviders(env, options.provider);

  if (order.length === 0) {throw new Error(NO_PROVIDER_MSG);}

  const prompt = options.prompt || buildCoverPrompt(spec);
  const errors = [];

  for (const name of order) {
    const meta = PROVIDERS[name];
    for (const model of modelsFor(name, env)) {
      try {
        const raw = await CALLERS[name](prompt, { axios, env, timeout, model });
        const buffer = await composeCover(raw, spec, { ...options, sharp: options.sharp });
        return { buffer, provider: name, model, prompt };
      } catch (err) {
        errors.push(`${meta.label}${model ? ` [${model}]` : ''}: ${err.message}`);
      }
    }
  }

  throw new Error(`AI 封面生成失败（已尝试 ${errors.length} 个模型）:\n  - ${errors.join('\n  - ')}`);
}

/** 是否存在可用的图像提供商（供 CLI 决定是否尝试 AI） */
function hasImageProvider(env = process.env) {
  return availableProviders(env).length > 0;
}

module.exports = {
  SCENES,
  DEFAULT_CATEGORY,
  pickScene,
  topicHint,
  hashKey,
  PROVIDERS,
  DEFAULT_ORDER,
  NEGATIVE_PROMPT,
  NO_PROVIDER_MSG,
  buildCoverPrompt,
  availableProviders,
  modelsFor,
  extractImageRef,
  buildOverlaySvg,
  composeCover,
  generateAiCover,
  hasImageProvider
};
