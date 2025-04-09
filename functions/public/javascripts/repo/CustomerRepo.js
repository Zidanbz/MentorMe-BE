const {db} = require("../config/FirebaseConfig");

async function saveCustomerNew(body){
    try {
        const customer = await body;
        const docRef = await db.collection("customer")
            .doc();
        await docRef.set(customer.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

async function addCoint(email, coint){
    try {
        const docRef =
            await db.collection("customer")
                .where('email', '==', email)
                .get();
        const dataForUpdate =
            docRef.docs.map(doc => ({
                id: doc.id,
            }));
        await db.collection("customer").doc(dataForUpdate[0].id).update({
            coin: coint,
        });
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCustomerByEmail(email){
    try {
        const docRef = await db.collection("customer")
            .where("email", "==", email)
            .get();
        return docRef.docs.map(doc => ({
            ...doc.data(),
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCoinCustomerByEmail(email){
    try {
        const docRef = await db.collection("customer")
            .where("email", "==", email)
            .get();
        return docRef.docs.map(doc => ({
            coin: doc.data().coin,
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getEmailCustomer(email){
    try {
        const docRef = await db.collection("customer")
            .get();
        return docRef.docs.map(doc => ({
            email: doc.data().email,
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    saveCustomerNew,
    getCustomerByEmail,
    addCoint,
    getCoinCustomerByEmail,
    getEmailCustomer,
}