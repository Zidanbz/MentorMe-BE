const {db} = require("../config/FirebaseConfig");

async function saveCustomerNew(body){
    try{
        const customer = await body;
        const docRef = await db.collection("customer")
            .doc();
        await docRef.set(customer.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCustomerByEmail(email){
    try{
        const docRef = await db.collection("customer")
            .where("email", "==", email)
            .get();
        return docRef.docs.map((doc) => ({
            ...doc.data()
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    saveCustomerNew,
    getCustomerByEmail
}