const { CacheManager, LockedCache, CacheEntry } = require('../cache-manager');

describe('CacheManager', () => {
  let cache;

  beforeEach(() => {
    cache = new CacheManager({
      maxSize: 3,
      defaultTtl: 1000,
      enableStats: true
    });
  });

  describe('basic operations', () => {
    test('should set and get cache', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    test('should return null for missing key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    test('should return default value when key missing', () => {
      expect(cache.get('missing', { defaultValue: 'default' })).toBe('default');
    });

    test('should delete cache entry', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeNull();
    });

    test('should clear all cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.clear()).toBe(2);
      expect(cache.size).toBe(0);
    });
  });

  describe('TTL', () => {
    test('should expire entries after TTL', async () => {
      cache = new CacheManager({ defaultTtl: 50 });
      cache.set('key1', 'value1');
      
      await new Promise(r => setTimeout(r, 60));
      
      expect(cache.get('key1')).toBeNull();
    });

    test('should support custom TTL per entry', () => {
      cache.set('key1', 'value1', { ttl: 5000 });
      expect(cache.get('key1')).toBe('value1');
    });

    test('should not expire when ttl is 0', () => {
      cache = new CacheManager({ defaultTtl: 0 });
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('LRU eviction', () => {
    test('should evict oldest entry when max size reached', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // should evict key1
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key4')).toBe('value4');
    });

    test('should update access time on get', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.get('key1'); // access key1 to update LRU
      cache.set('key3', 'value3');
      cache.set('key4', 'value4');
      
      // key2 should be evicted (oldest after key1 was accessed)
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('stats', () => {
    test('should track hits and misses', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    test('should calculate hit rate', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key1');
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0.667);
    });

    test('should reset stats', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('nonexistent');
      
      cache.resetStats();
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('cleanup', () => {
    test('should cleanup expired entries', async () => {
      cache = new CacheManager({ defaultTtl: 50 });
      cache.set('key1', 'value1');
      
      await new Promise(r => setTimeout(r, 60));
      
      const cleaned = cache.cleanup();
      expect(cleaned).toBe(1);
      expect(cache.size).toBe(0);
    });
  });

  describe('batch operations', () => {
    test('should mget multiple keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const results = cache.mget(['key1', 'key2', 'key3']);
      expect(results).toEqual(['value1', 'value2', null]);
    });

    test('should mset multiple entries', () => {
      cache.mset([
        ['key1', 'value1'],
        ['key2', 'value2']
      ]);
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
    });
  });
});

describe('LockedCache', () => {
  test('should prevent cache stampede', async () => {
    const lockedCache = new LockedCache({ defaultTtl: 1000 });
    let callCount = 0;
    
    const loader = async () => {
      callCount++;
      return `value_${callCount}`;
    };
    
    // First call
    const result1 = await lockedCache.getOrSet('key', loader);
    expect(result1).toBe('value_1');
    expect(callCount).toBe(1);
    
    // Second call should use cache
    const result2 = await lockedCache.getOrSet('key', loader);
    expect(result2).toBe('value_1');
    expect(callCount).toBe(1); // loader should not be called again
  });
});
