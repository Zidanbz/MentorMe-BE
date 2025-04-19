const { notifCreated } = require("../../repo/NotifRepo");
const { ID } = require("../../util/UUID");
const Notif = require("../../entity/Notif");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const { getEmailCustomer } = require("../../repo/CustomerRepo");
const { sendEmail } = require("../../config/MailConfig");
const { user } = require("firebase-functions/v1/auth");
const { db } = require("../../config/FirebaseConfig");

// Fungsi untuk memetakan data dari request body menjadi objek Notifikasi
async function mapToNotif(req) {
    try {
        // Membuat objek Notif dengan ID unik yang dihasilkan dan data dari request body
        const objectNotif = new Notif(ID(), req.body.title, req.body.message);
        return objectNotif;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Fungsi untuk mengirim email ke semua pelanggan
async function sendEmailToCustomer(subject, message) {
    try {
        // Mendapatkan semua email pelanggan
        const listEmail = await getEmailCustomer();
        // Mengirim email ke setiap pelanggan
        listEmail.forEach(element => {
            sendEmail(element.email, subject, message);
        });
    }catch (error) {
       throw new Error(error.message);
    }
}

async function sendFCM(token, title, message) {
    const payload = {
        notification: { title, body: message }
    };
    try {
        await admin.messaging().sendToDevice(token, payload);
    } catch (err) {
        console.error("FCM error:", err);
    }
}

// Fungsi utama untuk membuat notifikasi
async function createNotif(req) {
    try {
        const { role } = req.body;
        if (!role) {
            throw new Error("Role is required");
        }

        // Pastikan role yang valid, misalnya hanya 'mentor' atau 'trainee'
        if (role !== "MENTOR" && role !== "USER") {
            throw new Error("Invalid role. Only 'mentor' or 'trainee' are allowed.");
        }

        const notif = await mapToNotif(req);

        // Mengambil pengguna berdasarkan role yang sesuai
        const userQuery = await db.collection("user")
            .where("role", "==", role) // Pastikan ini hanya mengambil pengguna dengan role yang tepat
            .get();

        if (userQuery.empty) {
            throw new Error(`No users found with role: ${role}`);
        }

        const batch = db.batch();
        const fcmTokens = new Set(); // Set untuk menghindari token duplikat
        const userIdsNotified = new Set(); // Set untuk memastikan pengguna tidak menerima lebih dari 1 notif

        userQuery.forEach((doc) => {
            const userId = doc.id;
            
            // Pastikan pengguna belum menerima notifikasi sebelumnya
            if (!userIdsNotified.has(userId)) {
                const notifRef = db.collection("notif").doc();
                batch.set(notifRef, {
                    ...notif.toObject(),
                    userId: userId,
                    timestamp: new Date().toISOString(),
                });

                const token = doc.data().fcmToken;
                if (token && !fcmTokens.has(token)) {
                    fcmTokens.add(token); // Tambahkan token ke set jika belum ada
                }

                // Tandai bahwa pengguna ini sudah diberi notifikasi
                userIdsNotified.add(userId);
            }
        });

        // Kirim FCM ke setiap token unik
        const fcmPromises = [];
        fcmTokens.forEach(token => {
            fcmPromises.push(sendFCM(token, notif.title, notif.message));
        });

        await batch.commit();
        await Promise.all(fcmPromises);
        await sendEmailToCustomer(notif.title, notif.message);

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            "Notifikasi berhasil dikirim.",
            HttpStatus.CREATED.message,
        );

    } catch (error) {
        console.error("Create Notif Error:", error);
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}

module.exports = {
    createNotif,
};
