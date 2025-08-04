const {db} = require("../config/FirebaseConfig")

class WithdrawalRepo{
async save(object){
    try {
        const id = object.ID || require('uuid').v4(); // gunakan ID yang sudah ada atau buat baru
        const docRef = db.collection('withdrawal').doc(id);
        const dataToSave = {
            ...object.toObject(),
            ID: id, // pastikan ID field sama dengan document ID
        };
        await docRef.set(dataToSave);
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

async getAllTransaction() {
    try {
        const snapshot = await db.collection('withdrawal').get();
        return snapshot.docs.map(doc => ({
            ID: doc.ID,
            ...doc.data(),
        }));
    }catch (err) {
        throw new Error(`Error retrieving all transactions: ${err.message}`);
    }
}

async updateStatus(ID, status) {
    try {
         const docRef = db.collection('withdrawal').doc(ID);
         const docSnapshot = await docRef.get();

         if (!docSnapshot.exists) {
             console.log(`Document with ID ${ID} does not exist.`);
             throw new Error(`Document with ID ${ID} not found`);
         }

         // Update the document status
         await docRef.update({ status });
         console.log(`Successfully updated status for document with ID: ${ID}`);
     }catch (err) {
         throw new Error(`Error updating status: ${err.message}`);
     }
}

async printAllWithdrawalIDs() {
    const snapshot = await db.collection('withdrawal').get();
    console.log("Daftar ID Withdrawal di Firestore:");
    snapshot.docs.forEach(doc => {
        console.log(`- ${doc.id}`);
    });
}
}

module.exports = WithdrawalRepo;