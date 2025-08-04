/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const server = require("./app");

// OPTIMASI: Main API function dengan optimized settings (NO minInstances to avoid extra cost)
exports.widgets22 = onRequest(
  {
    region: "asia-southeast2",
    // Performance optimizations (adjusted for quota limits)
    memory: "512MiB",
    timeoutSeconds: 60,
    maxInstances: 10, // Reduced to fit quota limit
    // Removed minInstances to avoid $12.92/month extra cost
    concurrency: 80,
  },
  server,
);

// OPTIMASI: Import warmup utilities
const { WarmupUtil } = require("./public/javascripts/util/WarmupUtil");

// OPTIMASI: Health check endpoint
exports.healthCheck = onRequest(
  {
    region: "asia-southeast2",
    memory: "256MiB",
    timeoutSeconds: 10,
  },
  async(req, res) => {
    try {
      const healthResult = await WarmupUtil.healthCheck();
      res.status(200).json(healthResult);
    }catch (error) {
      res.status(500).json({
        status: "error",
        message: "Health check failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
);

// OPTIMASI: Warmup stats endpoint untuk monitoring
exports.warmupStats = onRequest(
  {
    region: "asia-southeast2",
    memory: "256MiB",
    timeoutSeconds: 10,
  },
  async(req, res) => {
    try {
      const stats = WarmupUtil.getWarmupStats();
      res.status(200).json(stats);
    }catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to get warmup stats",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
);
