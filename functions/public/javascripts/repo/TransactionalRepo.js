const {db} = require("../config/FirebaseConfig");

async function createNewTransaction(req){
    try {
        const docRef = db.collection("transactional").doc();
        return await docRef.set(req.toObject());
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getTransactionById(req){
    try {
        const docRef =
            await db.collection("transactional")
                .where("ID", "==", req)
                .get();
        return docRef.docs.map(doc => ({
            ID: doc.data().ID,
            email: doc.data().email,
            course: doc.data().course,
        }));
    }catch (error) {
        throw new Error(error.message);
    }
}

async function updateTransactionAccepted(status, ID){
    try {
        const docRef = await db.collection("transactional")
            .where("ID", "==", ID)
            .get();
        const id = docRef.docs.map(doc => ({id: doc.id}));
        await db.collection("transactional").doc(id[0].id).update({
            status: status,
        });
    }catch (error) {
        throw new Error(error.message);
    }
}

function check(data){
    if (!data || data.empty) {
        throw new Error("Data not found");
    }
}

async function getHistoryTransactionByEmailCustomer(email){
    try {
        const docRef =
            await db.collection("transactional")
                .where("email", "==", email)
                .get();
        check(docRef);
        return docRef.docs.map(doc => doc.data());
    }catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createNewTransaction,
    getTransactionById,
    updateTransactionAccepted,
    getHistoryTransactionByEmailCustomer,
};