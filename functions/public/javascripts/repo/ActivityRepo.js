const { db } = require("../config/FirebaseConfig");

async function createActivity(data) {
  try {
    const docRef = await db.collection("activity").doc(); // generate random document id
    const newData = {
      ...data.toObject(), // ambil semua field dari data
      ID: docRef.id, // tambahkan ID baru dari docRef.id
    };
    await docRef.set(newData); // set dengan data baru
  }catch (error) {
    throw new Error(error.message);
  }
}

function check(data) {
  if (!data || data.empty) {
    throw new Error("Data not found");
  }
}

async function getActivityBySyllabus(syllabus, learningId) {
  try {
    const docRef = await db
      .collection("activity")
      .where("syllabus", "==", syllabus) // Memfilter berdasarkan syllabus
      .where("learning", "==", learningId) // Memfilter berdasarkan learningId
      .get();
    check(docRef); // Pastikan query berhasil
    return docRef.docs.map(doc => doc.data()); // Mengembalikan data aktivitas yang ditemukan
  }catch (error) {
    throw new Error(error.message);
  }
}

async function updateActivity(data, ID) {
  try {
    const docRef = await db.collection("activity").where("ID", "==", ID).get();

    const updateActivity = docRef.docs.map(async doc => {
      try {
        const activity = { ...doc.data(), id: doc.id };
        await db.collection("activity").doc(activity.id).update({
          task: data.task,
          status: data.status,
          criticism: data.criticism,
        });
      }catch (error) {
        throw new Error(error.message);
      }
    });
    await Promise.all(updateActivity);
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getActivityById(activityId) {
  try {
    const docRef = await db
      .collection("activity")
      .where("ID", "==", activityId)
      .get();
    return docRef.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getActivitiesByLearning(idLearning) {
  try {
    const docRef = await db
      .collection("activity")
      .where("learning", "==", idLearning)
      .get();
    return docRef.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function report(data, ID) {
  try {
    const docRef = await db.collection("activity").where("ID", "==", ID).get();

    const updateActivity = docRef.docs.map(async doc => {
      try {
        const activity = { ...doc.data(), id: doc.id };
        await db.collection("activity").doc(activity.id).update({
          documentasi: data.documentasi,
          statusReport: true,
          activity: data.activity,
        });
      }catch (error) {
        throw new Error(error.message);
      }
    });
    await Promise.all(updateActivity);
  }catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Memeriksa apakah semua aktivitas untuk sebuah sesi pembelajaran (learning) sudah selesai.
 * @param {string} learningId - ID dari sesi pembelajaran.
 * @returns {Promise<boolean>} - Mengembalikan true jika semua tugas selesai, false jika tidak.
 */
async function checkAllActivitiesComplete(learningId) {
  try {
    const activities = await getActivitiesByLearning(learningId);
    if (activities.length === 0) {
      // Jika tidak ada aktivitas sama sekali, dianggap belum selesai.
      return false;
    }
    // Menggunakan metode .every() untuk mengecek apakah SEMUA elemen memiliki status === true
    return activities.every(activity => activity.status === true);
  }catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createActivity,
  getActivityBySyllabus,
  updateActivity,
  getActivityById,
  getActivitiesByLearning,
  report,
  checkAllActivitiesComplete,
};
