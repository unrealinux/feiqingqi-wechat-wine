/**
 * robots_check.js 测试
 *
 * crawler 在每个站点抓取前都会调用 shouldCrawl；策略是「robots 禁止则不抓，
 * 任何异常一律放行」。断言的正是这两条边界，另加 origin 级缓存。
 */

jest.mock('axios');
const axios = require('axios');
const { shouldCrawl } = require('../robots_check');

const ROBOTS_DISALLOW_PRIVATE = 'User-agent: *\nDisallow: /private';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('shouldCrawl', () => {
  test('robots.txt 明确禁止的路径返回 false', async () => {
    axios.get.mockResolvedValue({ data: ROBOTS_DISALLOW_PRIVATE });
    await expect(shouldCrawl('https://rb-a.example.com/private/x')).resolves.toBe(false);
  });

  test('允许的路径返回 true', async () => {
    axios.get.mockResolvedValue({ data: ROBOTS_DISALLOW_PRIVATE });
    await expect(shouldCrawl('https://rb-b.example.com/public')).resolves.toBe(true);
  });

  test('请求 robots.txt 失败时默认放行（不因网络问题阻断抓取）', async () => {
    axios.get.mockRejectedValue(new Error('network down'));
    await expect(shouldCrawl('https://rb-c.example.com/anything')).resolves.toBe(true);
  });

  test('空 robots.txt 视为全部允许', async () => {
    axios.get.mockResolvedValue({ data: '' });
    await expect(shouldCrawl('https://rb-d.example.com/page')).resolves.toBe(true);
  });

  test('按 origin 缓存，重复调用不重复请求', async () => {
    axios.get.mockResolvedValue({ data: ROBOTS_DISALLOW_PRIVATE });
    await shouldCrawl('https://rb-e.example.com/private');
    await shouldCrawl('https://rb-e.example.com/private');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('请求的是 origin 下的 robots.txt，带 5s 超时', async () => {
    axios.get.mockResolvedValue({ data: '' });
    await shouldCrawl('https://rb-f.example.com/a/b?q=1');
    expect(axios.get).toHaveBeenCalledWith('https://rb-f.example.com/robots.txt', { timeout: 5000 });
  });
});
