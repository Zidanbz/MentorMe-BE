const {db} = require("../config/FirebaseConfig");

async function newSyllabus(syllabus) {
    try {
        const docRef = db.collection("syllabus").doc();
        await docRef.set(syllabus.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

function check(data){
    if (!data || data.empty) {
        throw new Error("Syllabus data doesn't exist");
    }
}

async function getSyllabusByProject(projectId) {
    try {
        const docRef = await
            db.collection("syllabus")
                .where("Project", "==", projectId)
                .get();
        check(docRef);
        return docRef.docs.map( data => (data.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getDetailSyllabusById(SyllabusId) {
    try {
        const docRef = await
            db.collection("syllabus")
                 .where("ID", "==", SyllabusId)
                .get();
        check(docRef);

if (docRef.empty) {
  return null;
}

const doc = docRef.docs[0];
const data = doc.data();
return {
  SyllabusId: data.ID || doc.id,
  ...data,
};
    }catch (error){
        throw new Error(error.message);
    }
}

async function updateSyllabusById(syllabusId, updatedData) {
    try {
        const docRef = await db.collection("syllabus")
            .where("ID", "==", syllabusId)
            .get();

        if (docRef.empty) {
            throw new Error("Syllabus not found");
        }

        const docId = docRef.docs[0].id;
        await db.collection("syllabus").doc(docId).update(updatedData);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    newSyllabus,
    getSyllabusByProject,
    getDetailSyllabusById,
    updateSyllabusById,
};