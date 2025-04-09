const {db} = require("../config/FirebaseConfig")

class WithdrawalRepo{
    async save(object){
        try {
            const docRef = await db.collection('withdrawal')
                .doc();
            await docRef.set(object.toObject());
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async getTransaction(user){
        try {
            const docRef = await
            db.collection("withdrawal")
                .where("mentor" , "==", user)
                .get();
            if (docRef.empty) {
                throw new Error("Data Is Not Found");
            }
            return docRef.docs.map(doc => ({
                ...doc.data(),
            }));
        }catch (error){
            throw new Error(error.message);
        }
    }
}

module.exports = WithdrawalRepo;