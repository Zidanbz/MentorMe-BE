const { db } = require('../config/FirebaseConfig');

async function saveLearningPath(req){
    try {
        const docRef =
            await db.collection('learning_path').doc();
        await docRef.set(req.toObject());
        return await getAllLearningPath();
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getAllLearningPath(){
    try{
        const docRef =
            await db.collection('learning_path').get();
        return docRef.docs.map((doc) => ({
            ...doc.data()
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getLearningPathByName(materialName){
    try {
        const docRef = await db
            .collection("learning_path")
            .where("name", "==", materialName)
            .get();

        if (docRef.empty) {
            // Jika tidak ada dokumen yang cocok
            return null;
        }

        // Ambil dokumen pertama yang cocok
        const targetDoc = docRef.docs[0];
        const data = targetDoc.data();

        return {
            ID: data.ID,
            name: data.name,
            categoryId: data.categoryId,
            picture: data.picture,
        };
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getLearningPathByCategory(id){
    try{
        const docRef = await db.collection("learning_path")
            .where("categoryId", "==", id)
            .get();
        return docRef.docs.map((doc) => ({
            ...doc.data(),
        }))
    }catch (error){
        throw new Error(error.message);
    }
}

async function getLearningPathById(id){
    try{
        const docRef =
            await db.collection("learning_path")
                .where("ID", "==", id)
                .get();
        return docRef.docs.map((doc) => doc.data());
    }catch(error){
        throw new Error(error.message);
    }
}

module.exports = {
    saveLearningPath,
    getAllLearningPath,
    getLearningPathByName,
    getLearningPathByCategory,
    getLearningPathById,
}