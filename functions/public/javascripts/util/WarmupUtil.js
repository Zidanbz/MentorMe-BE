const { db } = require("../config/FirebaseConfig");

// OPTIMASI: Cold Start Mitigation - Keep Functions Warm
class WarmupUtil {
  // Health check endpoint untuk warmup
  static async healthCheck() {
    try {
      const startTime = Date.now();

      // Simple database ping
      await db.collection("_warmup").limit(1).get();

      const responseTime = Date.now() - startTime;

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        message: "Function is warm and ready",
      };
    }catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
        message: "Function warmup failed",
      };
    }
  }

  // Ping critical endpoints untuk keep them warm
  static async pingCriticalEndpoints() {
    const endpoints = [
      "/api/login/user",
      "/api/projects",
      "/api/categories",
      "/api/learning-paths",
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();

        // Simulate light endpoint activity
        await this.simulateEndpointActivity(endpoint);

        const responseTime = Date.now() - startTime;

        results.push({
          endpoint,
          status: "warm",
          responseTime: `${responseTime}ms`,
        });
      }catch (error) {
        results.push({
          endpoint,
          status: "error",
          error: error.message,
        });
      }
    }

    return {
      timestamp: new Date().toISOString(),
      results,
      message: "Critical endpoints warmup completed",
    };
  }

  // Simulate light activity untuk keep functions warm
  static async simulateEndpointActivity(endpoint) {
    switch (endpoint) {
      case "/api/login/user":
        // Light database query untuk user collection
        await db.collection("user").limit(1).get();
        break;

      case "/api/projects":
        // Light database query untuk project collection
        await db.collection("project").limit(1).get();
        break;

      case "/api/categories":
        // Light database query untuk category collection
        await db.collection("category").limit(1).get();
        break;

      case "/api/learning-paths":
        // Light database query untuk learning_path collection
        await db.collection("learning_path").limit(1).get();
        break;

      default:
        // Default light query
        await db.collection("_warmup").limit(1).get();
    }
  }

  // Preload critical data ke cache
  static async preloadCriticalData() {
    try {
      const CacheUtil = require("./CacheUtil");

      // Preload categories jika belum ada di cache
      if (!CacheUtil.getStaticCache("all_categories")) {
        const categories = await db.collection("category").get();
        const categoryData = categories.docs.map(doc => doc.data());
        CacheUtil.setStaticCache("all_categories", categoryData);
      }

      // Preload learning paths jika belum ada di cache
      if (!CacheUtil.getStaticCache("all_learning_paths")) {
        const learningPaths = await db.collection("learning_path").get();
        const learningPathData = learningPaths.docs.map(doc => doc.data());
        CacheUtil.setStaticCache("all_learning_paths", learningPathData);
      }

      return {
        status: "success",
        message: "Critical data preloaded to cache",
        timestamp: new Date().toISOString(),
      };
    }catch (error) {
      return {
        status: "error",
        message: "Failed to preload critical data",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Get warmup statistics
  static getWarmupStats() {
    const CacheUtil = require("./CacheUtil");

    return {
      timestamp: new Date().toISOString(),
      cacheStats: CacheUtil.getCacheStats(),
      functionStatus: "warm",
      message: "Warmup statistics retrieved successfully",
    };
  }
}

module.exports = {
  WarmupUtil,
};
