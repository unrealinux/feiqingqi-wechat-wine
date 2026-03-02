const {
  hash,
  normalizeUrl,
  isValidUrl,
  cleanText,
  formatBytes,
  formatDuration,
  randomChoice,
  groupBy,
  unique
} = require('../helpers');

describe('helpers', () => {
  describe('hash', () => {
    test('should generate consistent hash', () => {
      const hash1 = hash('test string');
      const hash2 = hash('test string');
      expect(hash1).toBe(hash2);
    });

    test('should generate different hash for different input', () => {
      const hash1 = hash('string1');
      const hash2 = hash('string2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('normalizeUrl', () => {
    test('should remove trailing slash', () => {
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com');
    });

    test('should lowercase hostname', () => {
      expect(normalizeUrl('https://EXAMPLE.COM')).toBe('https://example.com');
    });

    test('should remove www prefix', () => {
      expect(normalizeUrl('https://www.example.com')).toBe('https://example.com');
    });

    test('should remove default ports', () => {
      expect(normalizeUrl('https://example.com:443')).toBe('https://example.com');
    });
  });

  describe('isValidUrl', () => {
    test('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
    });
  });

  describe('cleanText', () => {
    test('should remove extra whitespace', () => {
      expect(cleanText('a   b')).toBe('a b');
    });

    test('should trim text', () => {
      expect(cleanText('  test  ')).toBe('test');
    });
  });

  describe('formatBytes', () => {
    test('should format bytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
    });
  });

  describe('randomChoice', () => {
    test('should return element from array', () => {
      const arr = [1, 2, 3];
      const result = randomChoice(arr);
      expect(arr).toContain(result);
    });
  });

  describe('groupBy', () => {
    test('should group by key', () => {
      const arr = [{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}];
      const grouped = groupBy(arr, 'type');
      
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });
});
