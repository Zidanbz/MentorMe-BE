const { db } = require("../config/FirebaseConfig");

async function createSurvey(survey) {
  try {
    const docRef = db.collection("surveys").doc(survey.ID);
    await docRef.set(survey.toObject());
    return survey;
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getAllSurveys() {
  try {
    const docRef = await db.collection("surveys").get();

    if (docRef.empty) {
      return [];
    }

    return docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getActiveSurveys() {
  try {
    const docRef = await db
      .collection("surveys")
      .where("status", "==", "ACTIVE")
      .get();

    if (docRef.empty) {
      return [];
    }

    return docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getSurveyById(surveyId) {
  try {
    const docRef = await db.collection("surveys").doc(surveyId).get();

    if (!docRef.exists) {
      throw new Error("Survey not found");
    }

    return {
      ...docRef.data(),
      id: docRef.id,
    };
  }catch (error) {
    throw new Error(error.message);
  }
}

async function updateSurvey(surveyId, updateData) {
  try {
    const docRef = db.collection("surveys").doc(surveyId);
    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return {
      ...updatedDoc.data(),
      id: updatedDoc.id,
    };
  }catch (error) {
    throw new Error(error.message);
  }
}

async function deleteSurvey(surveyId) {
  try {
    await db.collection("surveys").doc(surveyId).delete();
    return true;
  }catch (error) {
    throw new Error(error.message);
  }
}

async function createSurveyResponse(surveyResponse) {
  try {
    const docRef = db.collection("survey_responses").doc(surveyResponse.ID);
    await docRef.set(surveyResponse.toObject());
    return surveyResponse;
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getSurveyResponsesByMentor(mentorEmail) {
  try {
    const docRef = await db
      .collection("survey_responses")
      .where("mentorEmail", "==", mentorEmail)
      .get();

    if (docRef.empty) {
      return [];
    }

    return docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getSurveyResponsesBySurvey(surveyId) {
  try {
    const docRef = await db
      .collection("survey_responses")
      .where("surveyId", "==", surveyId)
      .get();

    if (docRef.empty) {
      return [];
    }

    return docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  }catch (error) {
    throw new Error(error.message);
  }
}

async function checkMentorSurveyResponse(surveyId, mentorEmail) {
  try {
    const docRef = await db
      .collection("survey_responses")
      .where("surveyId", "==", surveyId)
      .where("mentorEmail", "==", mentorEmail)
      .get();

    return !docRef.empty;
  }catch (error) {
    throw new Error(error.message);
  }
}

async function getAllSurveyResponses() {
  try {
    const docRef = await db.collection("survey_responses").get();

    if (docRef.empty) {
      return [];
    }

    return docRef.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
  }catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createSurvey,
  getAllSurveys,
  getActiveSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  createSurveyResponse,
  getSurveyResponsesByMentor,
  getSurveyResponsesBySurvey,
  checkMentorSurveyResponse,
  getAllSurveyResponses,
};
