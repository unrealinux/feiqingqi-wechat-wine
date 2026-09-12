/**
 * logger.js 测试
 *
 * logger 是全局单例，此前 0% 覆盖；且 init() 定义了却从未被导出/调用（已补导出）。
 * 测试通过「写入临时文件再读回」验证 init 真的生效，而不是只看返回值。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const logger = require('../logger');

let tmpDir;
let logFile;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-test-'));
  logFile = path.join(tmpDir, 'app.log');
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const readLog = () => (fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '');

describe('logger.init', () => {
  test('init 设置级别并写入指定文件', () => {
    logger.init({ level: 'debug', file: logFile });
    logger.debug('hello-debug');
    expect(readLog()).toContain('hello-debug');
  });

  test('每条日志是合法 JSON（含时间戳与级别）', () => {
    logger.init({ level: 'info', file: logFile });
    logger.info('json-check', { extra: 1 });
    const line = readLog().trim().split('\n')[0];
    const parsed = JSON.parse(line);
    expect(parsed.message).toBe('json-check');
    expect(parsed.level).toBe('INFO');
    expect(parsed.extra).toBe(1);
    expect(parsed).toHaveProperty('timestamp');
  });

  test('未指定 file 时不写文件（也不抛错）', () => {
    logger.init({ level: 'info', file: '' });
    expect(() => logger.info('no-file')).not.toThrow();
    expect(readLog()).toBe('');
  });
});

describe('logger.setLevel / Levels', () => {
  test('setLevel 抑制低于阈值的日志', () => {
    logger.init({ level: 'error', file: logFile });
    logger.info('should-not-appear');
    logger.error('should-appear');
    const content = readLog();
    expect(content).not.toContain('should-not-appear');
    expect(content).toContain('should-appear');
  });

  test('未知级别回退到 INFO', () => {
    logger.init({ level: 'nonsense', file: logFile });
    logger.info('info-shown');
    logger.debug('debug-hidden');
    const content = readLog();
    expect(content).toContain('info-shown');
    expect(content).not.toContain('debug-hidden');
  });

  test('Levels 常量按严重程度递增导出', () => {
    expect(logger.Levels).toMatchObject({ DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 });
  });
});

describe('logger.operation', () => {
  test('记录同步函数并返回其结果', () => {
    logger.init({ level: 'error', file: logFile });
    expect(logger.operation('sync', () => 42)).toBe(42);
  });

  test('同步函数抛错时向上抛出', () => {
    logger.init({ level: 'error', file: logFile });
    expect(() => logger.operation('boom', () => { throw new Error('bad'); })).toThrow('bad');
  });

  test('函数返回 Promise 时透传其结果', async () => {
    logger.init({ level: 'error', file: logFile });
    await expect(logger.operation('async-shape', () => Promise.resolve('ok'))).resolves.toBe('ok');
  });

  test('Promise 被拒绝时同样向上抛出', async () => {
    logger.init({ level: 'error', file: logFile });
    await expect(
      logger.operation('reject', () => Promise.reject(new Error('nope')))
    ).rejects.toThrow('nope');
  });
});

describe('logger.operationAsync', () => {
  test('返回异步函数的结果', async () => {
    logger.init({ level: 'error', file: logFile });
    await expect(logger.operationAsync('a', () => Promise.resolve('data'))).resolves.toBe('data');
  });

  test('异步失败时向上抛出', async () => {
    logger.init({ level: 'error', file: logFile });
    await expect(
      logger.operationAsync('b', () => Promise.reject(new Error('async-bad')))
    ).rejects.toThrow('async-bad');
  });
});
