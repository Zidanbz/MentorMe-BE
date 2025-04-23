const { ID } = require("../../util/UUID");
const Notif = require("../../entity/Notif");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const { getEmailCustomer } = require("../../repo/CustomerRepo");
const { sendEmail } = require("../../config/MailConfig");
const { db, admin } = require("../../config/FirebaseConfig");

// Valid roles
const VALID_ROLES = ["MENTOR", "USER"];

async function mapToNotif(req) {
    try {
        return new Notif(ID(), req.body.title, req.body.message);
    }catch (error) {
        throw new Error("Failed to map notification: " + error.message);
    }
}

async function sendEmailToCustomer(subject, message) {
    try {
        const listEmail = await getEmailCustomer();
        const sendEmailPromises = listEmail.map(el => sendEmail(el.email, subject, message));
        await Promise.all(sendEmailPromises);
    }catch (error) {
        throw new Error("Failed to send email: " + error.message);
    }
}

async function sendFCM(token, title, message) {
    const payload = {
        notification: { title, body: message },
    };
    try {
        await admin.messaging().sendToDevice(token, payload);
    }catch (err) {
        console.error("FCM error:", err);
    }
}

async function createNotif(req) {
    try {
        const { role } = req.body;

        if (!role || !VALID_ROLES.includes(role.toUpperCase())) {
            throw new Error("Invalid role. Only 'MENTOR' or 'USER' are allowed.");
        }

        const notif = await mapToNotif(req);

        const userQuery = await db.collection("user")
            .where("role", "==", role.toUpperCase())
            .get();

        if (userQuery.empty) {
            throw new Error(`No users found with role: ${role}`);
        }

        const batch = db.batch();
        const fcmTokens = new Set();

        userQuery.forEach(doc => {
            const userId = doc.id;
            const notifRef = db.collection("notif").doc();

            batch.set(notifRef, {
                ...notif.toObject(),
                userId,
                timestamp: admin.firestore.Timestamp.now(),
            });

            const token = doc.data().fcmToken;
            if (token) fcmTokens.add(token);
        });
        const fcmPromises = Array.from(fcmTokens).map(token =>
    sendFCM(token, notif.title, notif.message),
);

        await batch.commit();
        await Promise.all(fcmPromises);
        await sendEmailToCustomer(notif.title, notif.message);

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            "Notifikasi berhasil dikirim.",
            HttpStatus.CREATED.message,
        );
    }catch (error) {
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
