/**
 * engine/ai-cover.js 测试
 *
 * 用假的 axios + 真实 sharp，验证：提示词构造、提供商/模型选择与回退、
 * 封面尺寸合成，以及全失败时的错误聚合。不发起任何真实网络请求。
 */

const sharp = require('sharp');

const {
  buildCoverPrompt,
  availableProviders,
  modelsFor,
  hasImageProvider,
  buildOverlaySvg,
  composeCover,
  generateAiCover,
  NO_PROVIDER_MSG
} = require('../engine/ai-cover');

const SPEC = { title: '🍇 采收季：葡萄从枝头到酒窖的 72 小时', category: 'wine-knowledge', digest: '九月的酒庄' };

let tinyPng;

beforeAll(async () => {
  tinyPng = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#7B1E3B' } })
    .png()
    .toBuffer();
});

describe('buildCoverPrompt', () => {
  test('按分类选用写实场景，并带上标题与“无文字”约束', () => {
    const prompt = buildCoverPrompt(SPEC);
    expect(prompt).toMatch(/wine glass/i);
    expect(prompt).toContain('采收季');
    expect(prompt).toContain('不要出现任何文字');
  });

  test('不同分类得到不同场景', () => {
    const a = buildCoverPrompt({ category: 'wine-food', title: 'x' });
    const b = buildCoverPrompt({ category: 'wine-culture', title: 'x' });
    expect(a).not.toBe(b);
    expect(a).toMatch(/dish|food/i);
    expect(b).toMatch(/cellar|barrel/i);
  });

  test('未知分类回退到默认场景', () => {
    expect(buildCoverPrompt({ category: 'nope', title: 'x' })).toMatch(/wine glass/i);
  });
});

describe('availableProviders / modelsFor / hasImageProvider', () => {
  test('按已配置的 Key 过滤并按固定顺序返回', () => {
    expect(availableProviders({ GEMINI_API_KEY: 'k' })).toEqual(['gemini']);
    expect(availableProviders({ GLM_API_KEY: 'k', GEMINI_API_KEY: 'k' })).toEqual(['glm', 'gemini']);
    expect(availableProviders({})).toEqual([]);
  });

  test('COVER_AI_PROVIDER 可强制指定（未配 Key 则为空）', () => {
    expect(availableProviders({ COVER_AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'k' })).toEqual(['gemini']);
    expect(availableProviders({ COVER_AI_PROVIDER: 'gemini' })).toEqual([]);
    expect(availableProviders({ COVER_AI_PROVIDER: 'auto', GLM_API_KEY: 'k' })).toEqual(['glm']);
  });

  test('glm 默认依次尝试 cogview-4 -> cogview-3-flash', () => {
    expect(modelsFor('glm', {})).toEqual(['cogview-4', 'cogview-3-flash']);
    expect(modelsFor('glm', { GLM_IMAGE_MODEL: 'cogview-4' })).toEqual(['cogview-4']);
  });

  test('hasImageProvider 反映是否有可用 Key', () => {
    expect(hasImageProvider({})).toBe(false);
    expect(hasImageProvider({ ZIMAGE_API_KEY: 'k' })).toBe(true);
  });
});

describe('buildOverlaySvg', () => {
  test('包含标题、分类（大写）与底部渐变', () => {
    const svg = buildOverlaySvg(SPEC, { width: 1200, height: 630 });
    expect(svg).toContain('采收季');
    expect(svg).toContain('WINE-KNOWLEDGE');
    expect(svg).toContain('linearGradient');
  });

  test('标题中的 XML 特殊字符被转义', () => {
    const svg = buildOverlaySvg({ title: 'A & B <tag>', category: 'x' }, {});
    expect(svg).toContain('A &amp; B &lt;tag&gt;');
  });
});

describe('composeCover', () => {
  test('裁剪为目标尺寸并输出 PNG', async () => {
    const out = await composeCover(tinyPng, SPEC, { width: 1200, height: 630, sharp });
    const meta = await sharp(out).metadata();
    expect(meta.format).toBe('png');
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});

describe('generateAiCover（假 axios + 真实 sharp）', () => {
  const makeAxios = () => ({ post: jest.fn(), get: jest.fn() });

  test('cogview-4 失败后自动回退到 cogview-3-flash', async () => {
    const axios = makeAxios();
    axios.post
      .mockRejectedValueOnce({ response: { status: 429 }, message: 'Request failed with status code 429' })
      .mockResolvedValueOnce({ data: { data: [{ url: 'https://img.example/x.png' }] } });
    axios.get.mockResolvedValue({ data: tinyPng });

    const r = await generateAiCover(SPEC, { env: { GLM_API_KEY: 'k' }, axios, sharp });

    expect(r.provider).toBe('glm');
    expect(r.model).toBe('cogview-3-flash');
    expect(r.buffer.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    const meta = await sharp(r.buffer).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);
  });

  test('Gemini 从 inlineData 提取 base64 图片', async () => {
    const axios = makeAxios();
    axios.post.mockResolvedValue({
      data: { candidates: [{ content: { parts: [{ inlineData: { data: tinyPng.toString('base64') } }] } }] }
    });

    const r = await generateAiCover(SPEC, { env: { GEMINI_API_KEY: 'k' }, axios, sharp });
    expect(r.provider).toBe('gemini');
    expect(axios.get).not.toHaveBeenCalled(); // 内联 base64 无需再下载
  });

  test('所有模型都失败时抛出聚合错误', async () => {
    const axios = makeAxios();
    axios.post.mockRejectedValue({ message: 'boom' });

    await expect(generateAiCover(SPEC, { env: { GLM_API_KEY: 'k' }, axios, sharp }))
      .rejects.toThrow(/cogview-4.*cogview-3-flash/s);
  });

  test('未配置任何 Key 时给出明确提示', async () => {
    await expect(generateAiCover(SPEC, { env: {}, axios: makeAxios(), sharp }))
      .rejects.toThrow(NO_PROVIDER_MSG);
  });

  test('提供的 URL 会以 arraybuffer 下载', async () => {
    const axios = makeAxios();
    axios.post.mockResolvedValue({ data: { data: [{ url: 'https://img.example/y.png' }] } });
    axios.get.mockResolvedValue({ data: tinyPng });

    await generateAiCover(SPEC, { env: { GLM_API_KEY: 'k' }, axios, sharp, provider: 'glm' });

    expect(axios.get).toHaveBeenCalledWith('https://img.example/y.png',
      expect.objectContaining({ responseType: 'arraybuffer' }));
  });
});
