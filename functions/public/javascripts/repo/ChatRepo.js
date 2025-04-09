const {db} = require("../config/FirebaseConfig");

class ChatRepo{
    async saveChat(data){
        try {
            const docRef = await db.collection("chat").doc();
            await docRef.set(data.toObject());
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async getChat(email){
        try {
            let docRef = await db.collection("chat")
                .where("emailCustomer", "==", email)
                .get();

            if (docRef.empty) {
                docRef = await db.collection("chat")
                    .where("emailMentor", "==", email)
                    .get();
            }
            return docRef.docs.map(value => ({
                idRoom: value.data().idRoom,
                nameCustomer: value.data().nameCustomer,
                nameMentor: value.data().nameMentor,
                emailCustomer: value.data().emailCustomer,
                emailMentor: value.data().emailMentor,
            }));
        }catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = ChatRepo;