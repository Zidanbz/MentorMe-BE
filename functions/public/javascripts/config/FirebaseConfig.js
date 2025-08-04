const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../../serviceAccountKey.json");

const configFireApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "mentorme-aaa37.firebasestorage.app",
});

// Menambahkan Firebase Messaging
const messaging = configFireApp.messaging();

const db = configFireApp.firestore();
const authentications = configFireApp.auth();
const storageBucket = configFireApp.storage().bucket();

// OPTIMASI: Firestore settings untuk better performance
db.settings({
  ignoreUndefinedProperties: true,
  merge: true,
  // Connection pooling settings
  maxIdleChannels: 10,
  keepAliveTimeout: 30000,
  // Performance settings
  timestampsInSnapshots: true,
  // Batch settings
  maxWritesPerBatch: 500,
});

// OPTIMASI: Connection health monitoring
let connectionHealthy = true;
let lastHealthCheck = Date.now();

const checkConnectionHealth = async() => {
  try {
    // Simple health check query
    await db.collection("_health").limit(1).get();
    connectionHealthy = true;
    lastHealthCheck = Date.now();
  }catch (error) {
    console.error("Firebase connection health check failed:", error);
    connectionHealthy = false;
  }
};

// Health check setiap 5 menit
setInterval(checkConnectionHealth, 5 * 60 * 1000);

// OPTIMASI: Batch operations utility
const batchOperations = {
  // Batch write dengan automatic chunking
  async batchWrite(operations) {
    const chunks = [];
    const chunkSize = 500; // Firestore limit

    for (let i = 0; i < operations.length; i += chunkSize) {
      chunks.push(operations.slice(i, i + chunkSize));
    }

    const promises = chunks.map(async chunk => {
      const batch = db.batch();
      chunk.forEach(op => {
        switch (op.type) {
          case "set":
            batch.set(op.ref, op.data);
            break;
          case "update":
            batch.update(op.ref, op.data);
            break;
          case "delete":
            batch.delete(op.ref);
            break;
        }
      });
      return batch.commit();
    });

    return Promise.all(promises);
  },

  // Batch read dengan automatic chunking untuk 'in' queries
  async batchRead(collection, field, values) {
    if (values.length === 0)return [];

    const chunks = [];
    const chunkSize = 10; // Firestore 'in' query limit

    for (let i = 0; i < values.length; i += chunkSize) {
      chunks.push(values.slice(i, i + chunkSize));
    }

    const promises = chunks.map(chunk =>
      db.collection(collection).where(field, "in", chunk).get(),
    );

    const results = await Promise.all(promises);
    return results.flatMap(snap =>
      snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  },
};

// OPTIMASI: Query performance monitoring
const queryPerformanceMonitor = {
  queries: new Map(),

  startQuery(queryId) {
    this.queries.set(queryId, Date.now());
  },

  endQuery(queryId) {
    const startTime = this.queries.get(queryId);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.queries.delete(queryId);

      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryId} took ${duration}ms`);
      }

      return duration;
    }
    return 0;
  },
};

console.log("Using bucket:", storageBucket.name);

module.exports = {
  db,
  authentications,
  storageBucket,
  messaging,
  configFireApp,
  batchOperations,
  queryPerformanceMonitor,
  getConnectionHealth: () => ({
    healthy: connectionHealthy,
    lastCheck: lastHealthCheck,
  }),
};
