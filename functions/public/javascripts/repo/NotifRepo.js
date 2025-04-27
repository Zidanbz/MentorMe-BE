const {db} = require("../config/FirebaseConfig");

async function notifCreated(data) {
    try {
        const docRef = await db.collection("notif")
            .doc();
        await docRef.set(data.toObject());
    }catch (error) {
        throw new Error(error.message);
    }
}


async function getAllNotifs(){
    try {
        const docRef = await db.collection("notif")
            .get();
        check(docRef);
        return docRef.docs.map(doc => ({
            ID: doc.data().ID,
            title: doc.data().title,
            message: doc.data().message,
            timestamp: doc.data().timestamp,
        }))
    }catch (error){
        throw new Error(error.message);
    }
}

function check(data){
    if (!data || data.empty) {
        throw new Error("Data not found");
    }
}

module.exports = {
    notifCreated,
    getAllNotifs,
}