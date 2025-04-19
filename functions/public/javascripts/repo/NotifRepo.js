const {db, messaging} = require("../config/FirebaseConfig");

async function notifCreated(data, targetUserId) {
    try {
        // Simpan notifikasi ke koleksi notif
        const docRef = await db.collection("notif").doc();
        await docRef.set(data.toObject());

        // Ambil token FCM user berdasarkan ID
        const userSnap = await db.collection("user").doc(targetUserId).get();
        if (!userSnap.exists || !userSnap.data().fcmToken) {
            console.warn("User or FCM token not found:", targetUserId);
            return;
        }

        const fcmToken = userSnap.data().fcmToken;

        // Payload notifikasi
        const payload = {
            notification: {
                title: data.title,
                body: data.message,
            },
            token: fcmToken,
        };

        // Kirim ke FCM
        await messaging.send(payload);
        console.log(`✅ Notification sent to user ${targetUserId}`);
    } catch (error) {
        throw new Error("notifCreated error: " + error.message);
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