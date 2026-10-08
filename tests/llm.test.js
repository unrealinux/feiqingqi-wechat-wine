/**
 * engine/llm.js 测试
 *
 * 这一层的价值全在「选对 provider」和「失败要炸」。测试不打网络：
 * axios 用注入的假实现，环境变量用字面量对象。
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

const {
  LLMUnavailableError,
  AUTO_ORDER,
  PROVIDERS,
  NO_PROVIDER_MSG,
  resolveProvider,
  pickProvider,
  buildPayload,
  extractContent,
  describeError,
  chat,
} = require('../engine/llm');

describe('provider 解析', () => {
  test('zhipu 只认 GLM_API_KEY（缺 key 返回 null，不当成可用）', () => {
    expect(resolveProvider('zhipu', {})).toBeNull();
    const p = resolveProvider('zhipu', { GLM_API_KEY: 'k' });
    expect(p.name).toBe('zhipu');
    expect(p.model).toBe('glm-4-flash-250414');
    expect(p.fallbackModel).toBe('glm-4.5-flash');
  });

  test('env 可以覆盖模型与 baseUrl', () => {
    const p = resolveProvider('zhipu', {
      GLM_API_KEY: 'k',
      GLM_TEXT_MODEL: 'glm-x',
      GLM_BASE_URL: 'http://local/v1',
    });
    expect(p.model).toBe('glm-x');
    expect(p.baseUrl).toBe('http://local/v1');
  });

  test('未知 provider 名返回 null', () => {
    expect(resolveProvider('nope', { GLM_API_KEY: 'k' })).toBeNull();
  });

  test('auto 模式按 AUTO_ORDER 选第一个有 key 的', () => {
    // 只有 deepseek 有 key -> 即使排位靠后也要选中它
    const p = pickProvider('auto', { DEEPSEEK_API_KEY: 'd' });
    expect(p.name).toBe('deepseek');
  });

  test('指定 provider 但缺 key 时不回退到别人（避免偷偷换模型/计费）', () => {
    expect(pickProvider('deepseek', { GLM_API_KEY: 'k' })).toBeNull();
  });

  test('没有任何 key 时返回 null', () => {
    expect(pickProvider('', {})).toBeNull();
  });

  test('AUTO_ORDER 与 PROVIDERS 表保持同步（防止加了 provider 忘了排序）', () => {
    for (const name of AUTO_ORDER) {expect(PROVIDERS[name]).toBeDefined();}
  });
});

describe('请求体与响应解析', () => {
  test('buildPayload 固定 stream=false 并带 model/max_tokens', () => {
    const p = buildPayload({ model: 'm', messages: [{ role: 'user', content: 'x' }], maxTokens: 10 });
    expect(p).toMatchObject({ model: 'm', max_tokens: 10, stream: false });
    expect(p.temperature).toBe(0.85);
  });

  test('extractContent 兼容 message.content / choice.text', () => {
    expect(extractContent({ choices: [{ message: { content: '  hi  ' } }] })).toBe('hi');
    expect(extractContent({ choices: [{ text: 'legacy' }] })).toBe('legacy');
    expect(extractContent({})).toBe('');
  });

  test('describeError 优先展示服务端 message，并带上 HTTP 状态码', () => {
    expect(describeError({ response: { status: 401, data: { error: { message: 'bad token' } } } }))
      .toBe('401 bad token');
    expect(describeError({ message: 'timeout of 100ms exceeded' })).toContain('timeout');
  });
});

/** 造一个假的 axios（记录调用、按序返回预设响应） */
function fakeAxios(responses) {
  const calls = [];
  return {
    calls,
    post: (url, payload, config) => {
      calls.push({ url, payload, config });
      const next = responses[Math.min(calls.length - 1, responses.length - 1)];
      if (next instanceof Error) {return Promise.reject(next);}
      return Promise.resolve({ data: next });
    },
  };
}

const chatOpts = (axios, extra = {}) => ({
  provider: 'zhipu',
  messages: [{ role: 'user', content: '写一篇' }],
  env: { GLM_API_KEY: 'k' },
  deps: { axios, getAxiosProxyConfig: () => ({}) },
  retries: 0,
  ...extra,
});

describe('chat', () => {
  test('没有可用 provider 时抛 LLMUnavailableError（fail-closed，不返回假稿）', async () => {
    const axios = fakeAxios([]);
    await expect(chat(chatOpts(axios, { env: {} }))).rejects.toThrow(LLMUnavailableError);
    await expect(chat(chatOpts(axios, { env: {} }))).rejects.toThrow(NO_PROVIDER_MSG);
    expect(axios.calls).toHaveLength(0);
  });

  test('成功时返回文本、provider 与实际使用的模型', async () => {
    const axios = fakeAxios([{ choices: [{ message: { content: '正文' } }] }]);
    const r = await chat(chatOpts(axios));
    expect(r.text).toBe('正文');
    expect(r.provider).toBe('zhipu');
    expect(r.model).toBe('glm-4-flash-250414');
    expect(axios.calls[0].url).toBe('https://open.bigmodel.cn/api/paas/v4/chat/completions');
    expect(axios.calls[0].config.headers.Authorization).toBe('Bearer k');
  });

  test('fallbackModel=true 时改用升档模型（写不出长度时的补救）', async () => {
    const axios = fakeAxios([{ choices: [{ message: { content: 'ok' } }] }]);
    const r = await chat(chatOpts(axios, { fallbackModel: true }));
    expect(axios.calls[0].payload.model).toBe('glm-4.5-flash');
    expect(r.model).toBe('glm-4.5-flash');
  });

  test('model 覆盖优先于 provider 表', async () => {
    const axios = fakeAxios([{ choices: [{ message: { content: 'ok' } }] }]);
    await chat(chatOpts(axios, { model: 'glm-custom' }));
    expect(axios.calls[0].payload.model).toBe('glm-custom');
  });

  test('返回空内容视为失败（不能把空稿当成功）', async () => {
    const axios = fakeAxios([{ choices: [{ message: { content: '   ' } }] }]);
    await expect(chat(chatOpts(axios))).rejects.toThrow(/空内容/);
  });

  test('失败会按 retries 重试，并把 onRetry 回调打出来', async () => {
    const axios = fakeAxios([
      new Error('boom'),
      { choices: [{ message: { content: '第二次成功' } }] },
    ]);
    const seen = [];
    const r = await chat(chatOpts(axios, { retries: 1, onRetry: (a, e) => seen.push([a, e.message]) }));
    expect(r.text).toBe('第二次成功');
    expect(axios.calls).toHaveLength(2);
    expect(seen).toEqual([[1, 'boom']]);
  });

  test('重试耗尽后错误信息里带 provider 标签与模型名（便于对账）', async () => {
    const axios = fakeAxios([new Error('boom')]);
    await expect(chat(chatOpts(axios))).rejects.toThrow(/智谱 GLM（glm-4-flash-250414）调用失败：boom/);
  });
});

describe('env 真实读取（不联网）', () => {
  test('从 process.env 里能读到一个 provider 的 key 时不抛错路径', () => {
    const key = 'GLM_API_KEY';
    const backup = process.env[key];
    process.env[key] = 'test-key';
    try {
      expect(pickProvider('', process.env).name).toBe('zhipu');
    } finally {
      if (backup === undefined) {delete process.env[key];} else {process.env[key] = backup;}
    }
  });

  test('dotenv 文件里确实配了 GLM_API_KEY（否则定时任务会静默不出稿）', () => {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {return;}   // CI / 新克隆的仓库没有 .env
    const text = fs.readFileSync(envPath, 'utf8');
    if (!/^GLM_API_KEY=.+/m.test(text)) {
      // 只在真的缺 key 时给出可执行提示
      expect(text).toMatch(/^GLM_API_KEY=.+/m);
    }
  });
});

describe('临时目录工具函数自检', () => {
  test('测试自身用的 tmp 目录可写（失败时能定位到环境问题）', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'llm-test-'));
    fs.writeFileSync(path.join(dir, 'x'), 'x');
    expect(fs.readdirSync(dir)).toEqual(['x']);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
