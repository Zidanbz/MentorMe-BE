const {db} = require("../config/FirebaseConfig");
const domain = require("node:domain");


async function createNewTransaction(req){
    try{
        const docRef = db.collection("transactional").doc();
        return await docRef.set(req.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

async function getTransactionById(req){
    try{
        const docRef =
            await db.collection("transactional")
                .where("ID", "==", req)
                .get();
        return docRef.docs.map(doc => ({
            ID: doc.data().ID,
            email: doc.data().email,
            course: doc.data().course,
        }));

    }catch(error){
        throw new Error(error.message);
    }
}

async function updateTransactionAccepted(status, ID){
    try{
        const docRef = await db.collection("transactional")
            .where("ID", "==", ID)
            .get();
        const id = docRef.docs.map(doc => ({id: doc.id}));
        await db.collection("transactional").doc(id[0].id).update({
            status: status,
        });
    }catch(error){
        console.log(error.message)
        throw new Error(error.message);
    }
}

async function getHistoryTransactionByEmailCustomer(email){
    try{
        const docRef =
            await db.collection("transactional")
                .where("email", "==", email)
                .get();

        return docRef.docs.map(doc => doc.data());
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    createNewTransaction,
    getTransactionById,
    updateTransactionAccepted,
    getHistoryTransactionByEmailCustomer
};