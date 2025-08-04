// OTPRepo.js
const admin = require('firebase-admin'); // Asumsi sudah diinisialisasi
const db = admin.firestore();
const otpCollection = db.collection('otps');

async function saveOTP(otpData) {
    try {
        console.log("Saving OTP for", otpData.email);
        await deleteOTP(otpData.email);
        await otpCollection.doc(otpData.email).set({
            otp: otpData.otp,
            expiryTime: admin.firestore.Timestamp.fromDate(otpData.expiryTime),
            userData: otpData.userData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("OTP saved for", otpData.email);
        return true;
    }catch (error) {
        console.error("ERROR saving OTP:", error);
        throw new Error(`Failed to save OTP: ${error.message}`);
    }
}


async function getOTPByEmail(email) {
    try {
        const doc = await otpCollection.doc(email).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        return {
            email: email,
            otp: data.otp,
            expiryTime: data.expiryTime.toDate(),
            userData: data.userData,
        };
    }catch (error) {
        throw new Error(`Failed to get OTP: ${error.message}`);
    }
}

async function deleteOTP(email) {
    try {
        await otpCollection.doc(email).delete();
        return true;
    }catch (error) {
        // Jika dokumen tidak ditemukan, abaikan error
        return true;
    }
}

module.exports = {
    saveOTP,
    getOTPByEmail,
    deleteOTP,
};