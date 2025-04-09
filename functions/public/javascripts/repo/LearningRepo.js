const {db} = require("../config/FirebaseConfig");

async function createNewLearning(learning){
    try {
        const docRef = db.collection("learning").doc();
        await docRef.set(learning.toObject());
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getLearningByUser(email){
    try {
        const docRef =
            await db.collection("learning")
                .where("email","==", email)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getLearningByProject(ID){
    try {
        const docRef =
            await db.collection("learning")
                .where("project","==", ID)
                .get();

        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getLearningById(ID){
    try {
        const docRef =
            await db.collection("learning")
                .where("ID","==", ID)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    createNewLearning,
    getLearningByUser,
    getLearningByProject,
    getLearningById,
}