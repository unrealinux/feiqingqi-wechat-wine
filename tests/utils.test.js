const { LRUCache, Logger, TextProcessor, FileManager } = require('../utils');
const fs = require('fs');
const path = require('path');

describe('Utils Module', () => {
  describe('LRUCache', () => {
    let cache;

    beforeEach(() => {
      cache = new LRUCache({ maxSize: 3, ttl: 1000 });
    });

    test('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    test('should evict oldest entry when full', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');

      expect(cache.get('key1')).toBeNull(); // key1 should be evicted
      expect(cache.get('key4')).toBe('value4');
    });

    test('should update existing key as most recent', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key1', 'newValue1'); // Update key1
      cache.set('key3', 'value3');

      expect(cache.get('key1')).toBe('newValue1');
    });

    test('should respect TTL and expire entries', async () => {
      const shortCache = new LRUCache({ maxSize: 10, ttl: 50 });
      shortCache.set('key1', 'value1');
      
      expect(shortCache.get('key1')).toBe('value1');
      
      await new Promise(r => setTimeout(r, 60));
      
      expect(shortCache.get('key1')).toBeNull();
    });

    test('should track hits and misses', () => {
      cache.set('key1', 'value1');
      cache.get('key1'); // hit
      cache.get('key2'); // miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe('50.00%');
    });

    test('should check existence with has()', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });

    test('should delete specific entries', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
    });

    test('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      
      expect(cache.get('key1')).toBeNull();
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('TextProcessor', () => {
    test('should truncate text correctly', () => {
      const text = 'This is a very long text that needs to be truncated';
      const truncated = TextProcessor.truncate(text, 20);
      expect(truncated).toBe('This is a very lo...');
      expect(truncated.length).toBe(20);
    });

    test('should return original if shorter than max', () => {
      const text = 'Short';
      expect(TextProcessor.truncate(text, 10)).toBe('Short');
    });

    test('should extract first sentence', () => {
      const text = '这是第一句话。这是第二句话！这是第三句话？';
      const sentence = TextProcessor.extractFirstSentence(text);
      expect(sentence).toBe('这是第一句话。');
    });

    test('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong>!</p>';
      const plain = TextProcessor.removeHtmlTags(html);
      expect(plain).toBe('Hello world!');
    });

    test('should count Chinese characters', () => {
      const text = '你好world';
      expect(TextProcessor.countChineseCharacters(text)).toBe(2);
    });

    test('should extract keywords', () => {
      const text = '红酒 葡萄酒 品酒 酒庄 产区 红酒知识 非常重要';
      const keywords = TextProcessor.extractKeywords(text, 3);
      expect(keywords.length).toBeLessThanOrEqual(3);
      expect(keywords).not.toContain('非常'); // stop word
    });

    test('should count words', () => {
      const text = 'Hello world  world';
      expect(TextProcessor.countWords(text)).toBe(3);
    });
  });

  describe('Logger', () => {
    test('should create log directory if not exists', () => {
      const logger = new Logger();
      expect(fs.existsSync(logger.logsDir)).toBe(true);
    });

    test('should log with correct level', () => {
      const logger = new Logger();
      const originalLog = console.log;
      
      let capturedLog = '';
      console.log = jest.fn((msg) => { capturedLog = msg; });
      
      logger.info('Test message', { data: 'test' });
      
      expect(capturedLog).toContain('[INFO] Test message');
      console.log = originalLog;
    });
  });

  describe('FileManager', () => {
    const testDir = path.join(__dirname, 'test_output');
    const testFile = path.join(testDir, 'test.json');

    afterEach(async () => {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      if (fs.existsSync(testDir)) {
        fs.rmdirSync(testDir);
      }
    });

    test('should ensure directory exists', () => {
      FileManager.ensureDir(testDir);
      expect(fs.existsSync(testDir)).toBe(true);
    });

    test('should write and read JSON', async () => {
      const data = { key: 'value', number: 123 };
      
      await FileManager.writeJson(testFile, data);
      const read = await FileManager.readJson(testFile);
      
      expect(read).toEqual(data);
    });

    test('should return null for missing file', async () => {
      const result = await FileManager.readJson('nonexistent.json');
      expect(result).toBeNull();
    });

    test('should backup file', () => {
      // Create test file
      fs.writeFileSync(testFile, 'test content');
      
      const backupPath = FileManager.backupFile(testFile);
      
      expect(fs.existsSync(backupPath)).toBe(true);
      expect(fs.readFileSync(backupPath, 'utf8')).toBe('test content');
      
      // Cleanup backup
      fs.unlinkSync(backupPath);
    });
  });
});
