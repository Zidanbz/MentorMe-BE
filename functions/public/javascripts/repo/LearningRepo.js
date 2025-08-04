const { db } = require("../config/FirebaseConfig");

async function createNewLearning(learning) {
  try {
    const docRef = db.collection("learning").doc();
    await docRef.set(learning.toObject());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getLearningByUser(email) {
  try {
    const docRef = await db
      .collection("learning")
      .where("email", "==", email)
      .get();
    return docRef.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getLearningByProject(ID) {
  try {
    const docRef = await db
      .collection("learning")
      .where("project", "==", ID)
      .get();

    return docRef.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getLearningById(ID) {
  try {
    const docRef = await db.collection("learning").where("ID", "==", ID).get();
    return docRef.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getLearningByEmailAndProject(email, projectId) {
  try {
    const snapshot = await db
      .collection("learning")
      .where("email", "==", email)
      .where("project", "==", projectId)
      .get();
    if (snapshot.empty) {
      return null; // Tidak ada
    }

    return snapshot.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getAllLearnings() {
  try {
    const snapshot = await db.collection("learning").get();
    return snapshot.docs.map(doc => doc.data());
  }catch (error) {
    throw new Error(error.message);
  }
}

async function updateLearningProgress(learningId, isComplete) {
  try {
    const learningQuery = await db
      .collection("learning")
      .where("ID", "==", learningId)
      .get();
    if (learningQuery.empty) {
      throw new Error("Learning data not found.");
    }
    const docId = learningQuery.docs[0].id;
    await db.collection("learning").doc(docId).update({
      progress: isComplete,
    });
  }catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createNewLearning,
  getLearningByUser,
  getLearningByProject,
  getLearningById,
  getLearningByEmailAndProject,
  getAllLearnings,
  updateLearningProgress,
};
