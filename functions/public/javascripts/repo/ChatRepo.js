const { db } = require("../config/FirebaseConfig");

class ChatRepo {
    // Fungsi untuk menyimpan chat
    async saveChat(data) {
        try {
            const docRef = await db.collection("chat").doc();
            await docRef.set(data.toObject());
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi untuk mendapatkan chat berdasarkan email pengirim atau penerima
async getChat(email) {
    try {
        const chatRef = db.collection("chat");
        const [asCustomer, asMentor] = await Promise.all([
            chatRef.where("emailCustomer", "==", email).get(),
            chatRef.where("emailMentor", "==", email).get(),
        ]);
        const allChats = [...asCustomer.docs, ...asMentor.docs];
        return allChats.map(value => ({
            idRoom: value.data().idRoom,
            nameCustomer: value.data().nameCustomer,
            nameMentor: value.data().nameMentor,
            emailCustomer: value.data().emailCustomer,
            emailMentor: value.data().emailMentor,
            pictureCustomer: value.data().pictureCustomer,
            pictureMentor: value.data().pictureMentor,
        }));
    }catch (err) {
        throw new Error(err.message);
    }
}

    // Fungsi untuk mendapatkan chat berdasarkan emailCustomer dan emailMentor
    async getChatByUsers(emailCustomer, emailMentor) {
        try {
            const snapshot = await db.collection("chat")
                .where("emailCustomer", "==", emailCustomer)
                .where("emailMentor", "==", emailMentor)
                .get();

            if (!snapshot.empty) {
                return snapshot.docs[0].data(); // Mengembalikan data chat pertama yang ditemukan
            }else {
                return null; // Tidak ada chat yang ditemukan
            }
        }catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = ChatRepo;
