const {db} = require("../config/FirebaseConfig");

async function doToUp(req){
    try {
        const docRef = db.collection("transactional").doc();
        return await docRef.set(req.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

async function getTransactionsToUp(req){
    try {
        const docRef =
            await db.collection("transactional")
                .where("ID", "==", req)
                .get();
        return docRef.docs.map(doc => ({
            ID: doc.data().ID,
            email: doc.data().email,
        }));
    }catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    doToUp,
    getTransactionsToUp,
};