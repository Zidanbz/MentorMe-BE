const { db } = require("../config/FirebaseConfig");
const CacheUtil = require("../util/CacheUtil");

async function saveLearningPath(req) {
  try {
    const docRef = await db.collection("learning_path").doc();
    await docRef.set(req.toObject());

    // Clear cache setelah create
    CacheUtil.clearCache("all_learning_paths");

    return await getAllLearningPath();
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getAllLearningPath
async function getAllLearningPath() {
  try {
    // Check cache terlebih dahulu
    const cachedLearningPaths = CacheUtil.getStaticCache("all_learning_paths");
    if (cachedLearningPaths) {
      return cachedLearningPaths;
    }

    // Jika tidak ada di cache, query database
    const docRef = await db.collection("learning_path").get();
    const learningPaths = docRef.docs.map(doc => ({
      ...doc.data(),
    }));

    // Simpan ke cache (1 jam karena learning paths jarang berubah)
    CacheUtil.setStaticCache("all_learning_paths", learningPaths);

    return learningPaths;
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getLearningPathByName
async function getLearningPathByName(materialName) {
  try {
    const cacheKey = `learning_path_by_name_${materialName}`;

    // Check cache terlebih dahulu
    const cachedLearningPath = CacheUtil.getLongCache(cacheKey);
    if (cachedLearningPath) {
      return cachedLearningPath;
    }

    const docRef = await db
      .collection("learning_path")
      .where("name", "==", materialName)
      .get();

    if (docRef.empty) {
      // Cache null result juga untuk menghindari repeated queries
      CacheUtil.setLongCache(cacheKey, null);
      return null;
    }

    // Ambil dokumen pertama yang cocok
    const targetDoc = docRef.docs[0];
    const data = targetDoc.data();

    const result = {
      ID: data.ID,
      name: data.name,
      categoryId: data.categoryId,
      picture: data.picture,
    };

    // Simpan ke cache (30 menit)
    CacheUtil.setLongCache(cacheKey, result);

    return result;
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getLearningPathByCategory
async function getLearningPathByCategory(id) {
  try {
    const cacheKey = `learning_path_by_category_${id}`;

    // Check cache terlebih dahulu
    const cachedLearningPaths = CacheUtil.getLongCache(cacheKey);
    if (cachedLearningPaths) {
      return cachedLearningPaths;
    }

    const docRef = await db
      .collection("learning_path")
      .where("categoryId", "==", id)
      .get();
    const learningPaths = docRef.docs.map(doc => ({
      ...doc.data(),
    }));

    // Simpan ke cache (30 menit)
    CacheUtil.setLongCache(cacheKey, learningPaths);

    return learningPaths;
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getAllLearningPaths (duplicate function)
async function getAllLearningPaths() {
  try {
    // Check cache terlebih dahulu
    const cachedLearningPaths = CacheUtil.getStaticCache(
      "all_learning_paths_with_id",
    );
    if (cachedLearningPaths) {
      return cachedLearningPaths;
    }

    const snapshot = await db.collection("learning_path").get();
    const learningPaths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Simpan ke cache (1 jam)
    CacheUtil.setStaticCache("all_learning_paths_with_id", learningPaths);

    return learningPaths;
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getLearningPathById
async function getLearningPathById(id) {
  try {
    const cacheKey = `learning_path_by_id_${id}`;

    // Check cache terlebih dahulu
    const cachedLearningPath = CacheUtil.getLongCache(cacheKey);
    if (cachedLearningPath) {
      return cachedLearningPath;
    }

    const docRef = await db
      .collection("learning_path")
      .where("ID", "==", id)
      .get();
    const learningPaths = docRef.docs.map(doc => doc.data());

    // Simpan ke cache (30 menit)
    CacheUtil.setLongCache(cacheKey, learningPaths);

    return learningPaths;
  }catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  saveLearningPath,
  getAllLearningPath,
  getLearningPathByName,
  getLearningPathByCategory,
  getLearningPathById,
  getAllLearningPaths,
};
