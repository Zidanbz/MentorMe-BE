const { getMentorRejected } = require("../../repo/MentorRepo");
const { getUsersByEmail } = require("../../repo/UserRepo");
const { getFileMetadata } = require("../../config/BusboyConfig");
const { getFCMTokenByUserId } = require("../../repo/UserRepo");
const { messaging } = require("../../config/FirebaseConfig");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

class UserService {
    // Mapping file dan user ke response object
    async mappingResponse(user, mentor) {
        try {
            const fileCV = await getFileMetadata(mentor.cv);
            const fileKtp = await getFileMetadata(mentor.ktp);
            const filePicture = await getFileMetadata(user[0].picture);

            return {
                ID: mentor.ID,
                fullName: user.fullName,
                email: mentor.email,
                cv: fileCV,
                ktp: fileKtp,
                picture: filePicture,
                portfolio: mentor.linkPortfolio,
                ability: mentor.about,
                status: mentor.status,
            };
        }catch (error) {
            throw new Error(error.message);
        }
    }

    // Kirim notifikasi push ke user tertentu
    async sendPushNotification(userIds, title, body) {
        try {
            const fcmTokens = [];

            for (const userId of userIds) {
                const fcmToken = await getFCMTokenByUserId(userId);
                if (fcmToken) fcmTokens.push(fcmToken);
            }

            if (fcmTokens.length > 0) {
                const message = {
                    notification: {
                        title,
                        body,
                    },
                    tokens: fcmTokens,
                };

                const response = await messaging.sendMulticast(message);
                console.log('Notifikasi berhasil dikirim:', response);
            }
        }catch (error) {
            console.error('Gagal mengirim notifikasi:', error);
        }
    }

    // Fungsi utama untuk ambil mentor yang ditolak
    async getMentorReject() {
        try {
            const mentorList = await getMentorRejected();
            const data = [];

            for (const mentor of mentorList) {
                const user = await getUsersByEmail(mentor.email);
                const mapped = await this.mappingResponse(user, mentor);
                data.push(mapped);

                // Kirim notifikasi push ke mentor & trainee
                await this.sendPushNotification(
                    [mentor.mentorId, mentor.traineeId], // Ganti ini sesuai struktur datamu
                    'Pengajuan Ditolak',
                    `${user.fullName || 'Akun Anda'} telah ditolak. Silakan periksa kembali data Anda.`,
                );
            }

            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
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
}

module.exports = UserService;
