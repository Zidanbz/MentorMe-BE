const NodeCache = require("node-cache");

// Cache instances dengan TTL yang berbeda
const shortCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const longCache = new NodeCache({ stdTTL: 1800 }); // 30 minutes
const staticCache = new NodeCache({ stdTTL: 3600 }); // 1 hour

class CacheUtil {
  // Cache untuk data yang sering berubah (5 menit)
  static setShortCache(key, data) {
    shortCache.set(key, data);
  }

  static getShortCache(key) {
    return shortCache.get(key);
  }

  // Cache untuk data yang jarang berubah (30 menit)
  static setLongCache(key, data) {
    longCache.set(key, data);
  }

  static getLongCache(key) {
    return longCache.get(key);
  }

  // Cache untuk data static (1 jam)
  static setStaticCache(key, data) {
    staticCache.set(key, data);
  }

  static getStaticCache(key) {
    return staticCache.get(key);
  }

  // Clear specific cache
  static clearCache(key) {
    shortCache.del(key);
    longCache.del(key);
    staticCache.del(key);
  }

  // Clear all caches
  static clearAllCache() {
    shortCache.flushAll();
    longCache.flushAll();
    staticCache.flushAll();
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      shortCache: {
        keys: shortCache.keys().length,
        stats: shortCache.getStats(),
      },
      longCache: {
        keys: longCache.keys().length,
        stats: longCache.getStats(),
      },
      staticCache: {
        keys: staticCache.keys().length,
        stats: staticCache.getStats(),
      },
    };
  }
}

module.exports = CacheUtil;
