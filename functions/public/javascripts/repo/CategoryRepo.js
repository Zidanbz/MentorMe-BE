const { db } = require("../config/FirebaseConfig");
const CacheUtil = require("../util/CacheUtil");

async function createNewCategory(category) {
  try {
    const docRef = await db.collection("category").doc();
    await docRef.set(category.toObject());

    // Clear cache setelah create
    CacheUtil.clearCache("all_categories");
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getAllCategory
async function getAllCategory() {
  try {
    // Check cache terlebih dahulu
    const cachedCategories = CacheUtil.getStaticCache("all_categories");
    if (cachedCategories) {
      return cachedCategories;
    }

    // Jika tidak ada di cache, query database
    const docRef = await db.collection("category").get();
    const categories = docRef.docs.map(doc => ({
      ...doc.data(),
    }));

    // Simpan ke cache (1 jam karena categories jarang berubah)
    CacheUtil.setStaticCache("all_categories", categories);

    return categories;
  }catch (error) {
    throw new Error(error.message);
  }
}

// OPTIMASI: Implementasi caching untuk getCategoryByName
async function getCategoryByName(name) {
  try {
    const cacheKey = `category_by_name_${name}`;

    // Check cache terlebih dahulu
    const cachedCategory = CacheUtil.getLongCache(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    // Jika tidak ada di cache, query database
    const docRef = await db
      .collection("category")
      .where("name", "==", name)
      .get();
    const categories = docRef.docs.map(doc => ({
      ...doc.data(),
    }));

    // Simpan ke cache (30 menit)
    CacheUtil.setLongCache(cacheKey, categories);

    return categories;
  }catch (error) {
    throw new Error(error.message);
  }
}

// async function getCategoryById(id) {
//     try {
//         const docRef = await db.collection("category")
//             .where("id", "==", id)
//             .get();
//     }catch (error) {
//         throw new Error(error.message);
//     }
// }

module.exports = {
  createNewCategory,
  getAllCategory,
  getCategoryByName,
};
