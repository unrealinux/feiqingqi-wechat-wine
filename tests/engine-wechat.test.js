/**
 * 微信 API 客户端测试
 *
 * 通过 mock axios 覆盖：token 缓存与失效重试、字段长度前置校验、草稿创建。
 * 不发起任何真实网络请求，也不读取 .env（凭据显式注入）。
 */

jest.mock('axios');
// 隔离真实 config/.env：否则空凭据会回退到 .env 中的真实 appId，
// 导致「凭据缺失应报错」无法被测试。
jest.mock('../config', () => ({ publish: {} }));

const axios = require('axios');
const { WeChatClient, WeChatError, validateArticle, LIMITS } = require('../engine/wechat');

const CREDENTIALS = { appId: 'wx-test-appid', appSecret: 'test-appsecret' };

/** 构造一个足够长的正文，避免触发 content 长度校验 */
const longContent = '<p>' + '正文'.repeat(50) + '</p>';

const validArticle = () => ({
  title: '一篇合格的文章标题',
  author: '红酒顾问',
  digest: '摘要内容',
  content: longContent,
  thumbMediaId: 'MEDIA_ID'
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('WeChatClient constructor', () => {
  test('should throw when credentials are missing', () => {
    expect(() => new WeChatClient({ appId: '', appSecret: '' })).toThrow(WeChatError);
  });

  test('should accept explicitly injected credentials', () => {
    const client = new WeChatClient(CREDENTIALS);
    expect(client.appId).toBe(CREDENTIALS.appId);
  });
});

describe('validateArticle', () => {
  test('should pass a valid article', () => {
    expect(validateArticle(validArticle())).toEqual([]);
  });

  test('should reject a missing title', () => {
    const article = { ...validArticle(), title: '' };
    expect(validateArticle(article)).toContain('title 不能为空');
  });

  test('should reject a title longer than the WeChat limit', () => {
    const article = { ...validArticle(), title: '标'.repeat(LIMITS.title + 1) };
    expect(validateArticle(article).some((e) => e.includes('title 超长'))).toBe(true);
  });

  test('should reject a digest longer than the WeChat limit', () => {
    const article = { ...validArticle(), digest: '摘'.repeat(LIMITS.digest + 1) };
    expect(validateArticle(article).some((e) => e.includes('digest 超长'))).toBe(true);
  });

  test('should reject an author longer than the WeChat limit', () => {
    const article = { ...validArticle(), author: '作'.repeat(LIMITS.author + 1) };
    expect(validateArticle(article).some((e) => e.includes('author 超长'))).toBe(true);
  });

  test('should reject empty content', () => {
    const article = { ...validArticle(), content: '' };
    expect(validateArticle(article)).toContain('content 不能为空');
  });

  test('should reject a missing thumb media id', () => {
    const article = { ...validArticle(), thumbMediaId: '' };
    expect(validateArticle(article)).toContain('thumbMediaId 不能为空（需先上传封面）');
  });

  test('should count CJK characters, not bytes, for the title limit', () => {
    const article = { ...validArticle(), title: '标'.repeat(LIMITS.title) };
    expect(validateArticle(article)).toEqual([]);
  });
});

describe('getAccessToken', () => {
  test('should fetch and cache the token', async () => {
    axios.get.mockResolvedValueOnce({ data: { access_token: 'TOKEN', expires_in: 7200 } });
    const client = new WeChatClient(CREDENTIALS);

    expect(await client.getAccessToken()).toBe('TOKEN');
    expect(await client.getAccessToken()).toBe('TOKEN');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('should surface API errors as WeChatError', async () => {
    axios.get.mockResolvedValueOnce({ data: { errcode: 40013, errmsg: 'invalid appid' } });
    const client = new WeChatClient(CREDENTIALS);
    await expect(client.getAccessToken()).rejects.toThrow(/invalid appid/);
  });

  test('should refetch after the token is invalidated', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { access_token: 'T1', expires_in: 7200 } })
      .mockResolvedValueOnce({ data: { access_token: 'T2', expires_in: 7200 } });

    const client = new WeChatClient(CREDENTIALS);
    expect(await client.getAccessToken()).toBe('T1');
    client.invalidateToken();
    expect(await client.getAccessToken()).toBe('T2');
  });

  test('should never log the app secret', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    axios.get.mockResolvedValueOnce({ data: { access_token: 'T', expires_in: 7200 } });
    await new WeChatClient(CREDENTIALS).getAccessToken();

    const logged = spy.mock.calls.flat().join(' ');
    expect(logged).not.toContain(CREDENTIALS.appSecret);
    spy.mockRestore();
  });
});

describe('withToken', () => {
  test('should retry once after a token-expired error', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { access_token: 'STALE', expires_in: 7200 } })
      .mockResolvedValueOnce({ data: { access_token: 'FRESH', expires_in: 7200 } });

    const client = new WeChatClient(CREDENTIALS);
    const fn = jest
      .fn()
      .mockResolvedValueOnce({ errcode: 40001, errmsg: 'invalid credential' })
      .mockResolvedValueOnce({ ok: true });

    const result = await client.withToken(fn);
    expect(result).toEqual({ ok: true });
    expect(fn).toHaveBeenNthCalledWith(1, 'STALE');
    expect(fn).toHaveBeenNthCalledWith(2, 'FRESH');
  });

  test('should not retry on unrelated errors', async () => {
    axios.get.mockResolvedValue({ data: { access_token: 'T', expires_in: 7200 } });
    const client = new WeChatClient(CREDENTIALS);
    const fn = jest.fn().mockResolvedValue({ errcode: 45009, errmsg: 'api freq out of limit' });

    const result = await client.withToken(fn);
    expect(result.errcode).toBe(45009);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('addDraft', () => {
  test('should validate before calling the API', async () => {
    const client = new WeChatClient(CREDENTIALS);
    await expect(client.addDraft({ ...validArticle(), title: '' })).rejects.toThrow('文章字段校验失败');
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('should post the expected draft payload', async () => {
    axios.get.mockResolvedValue({ data: { access_token: 'T', expires_in: 7200 } });
    axios.post.mockResolvedValue({ data: { media_id: 'DRAFT_ID' } });

    const client = new WeChatClient(CREDENTIALS);
    const article = validArticle();
    const result = await client.addDraft(article);

    expect(result.media_id).toBe('DRAFT_ID');
    const [url, payload] = axios.post.mock.calls[0];
    expect(url).toContain('draft/add');
    expect(url).toContain('access_token=T');
    expect(payload.articles[0]).toMatchObject({
      title: article.title,
      thumb_media_id: article.thumbMediaId,
      author: article.author,
      digest: article.digest,
      content: article.content,
      show_cover_pic: 1,
      need_open_comment: 0,
      only_fans_can_comment: 0
    });
  });

  test('should surface API errors as WeChatError', async () => {
    axios.get.mockResolvedValue({ data: { access_token: 'T', expires_in: 7200 } });
    axios.post.mockResolvedValue({ data: { errcode: 40007, errmsg: 'invalid media_id' } });

    const client = new WeChatClient(CREDENTIALS);
    await expect(client.addDraft(validArticle())).rejects.toThrow(/invalid media_id/);
  });
});

describe('uploadThumb', () => {
  test('should upload and return the media id', async () => {
    axios.get.mockResolvedValue({ data: { access_token: 'T', expires_in: 7200 } });
    axios.post.mockResolvedValue({ data: { media_id: 'THUMB_ID', url: 'https://x/y.png' } });

    const client = new WeChatClient(CREDENTIALS);
    const result = await client.uploadThumb(Buffer.from('fake-png'), 'cover.png');

    expect(result.media_id).toBe('THUMB_ID');
    expect(axios.post.mock.calls[0][0]).toContain('material/add_material');
  });

  test('should surface upload failures', async () => {
    axios.get.mockResolvedValue({ data: { access_token: 'T', expires_in: 7200 } });
    axios.post.mockResolvedValue({ data: { errcode: 40005, errmsg: 'invalid file type' } });

    const client = new WeChatClient(CREDENTIALS);
    await expect(client.uploadThumb(Buffer.from('x'))).rejects.toThrow(/invalid file type/);
  });
});
