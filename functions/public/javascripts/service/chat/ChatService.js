const ChatRepo = require("../../repo/ChatRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const { getUserByUid } = require("../../util/AutenticationUtil");
const Chat = require("../../entity/Chat");
const { getUsersByEmail } = require("../../repo/UserRepo");
const { messaging } = require("../../config/FirebaseConfig");

class ChatService {
    chatRepo;

    constructor() {
        this.chatRepo = new ChatRepo();
    }

    // Fungsi untuk mapping chat (mencocokkan data)
    async mappingChat(req) {
        try {
            const user = await getUserByUid(req);
            const email = req.body.email; // Ambil email penerima dari request body
            const customer = await getUsersByEmail(user.email);
            const mentor = await getUsersByEmail(email);
            return new Chat(email, user.email, customer[0].fullName, mentor[0].fullName);
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi untuk menyimpan chat
    async saveChat(req) {
        try {
            const object = await this.mappingChat(req); // Mapping chat object
            console.log(object);

            // Cek apakah chat room sudah ada antara emailCustomer dan emailMentor
            const existingChat = await this.chatRepo.getChatByUsers(object.emailCustomer, object.emailMentor);

            let chatRoomId;
            if (existingChat) {
                // Jika sudah ada, gunakan chat room yang lama
                chatRoomId = existingChat.idRoom;
            }else {
                // Jika belum ada, simpan chat baru dan buat ID chat baru
                await this.chatRepo.saveChat(object);
                chatRoomId = object.idRoom;
            }

            // Ambil token FCM penerima
            const receiver = await getUsersByEmail(object.emailMentor);
            const fcmToken = receiver[0].fcmToken; // pastikan field ini ada di data user

            if (fcmToken) {
                const message = {
                    notification: {
                        title: `${object.senderName} mengirim pesan`,
                        body: 'Buka chat untuk membaca pesan baru',
                    },
                    token: fcmToken,
                    data: {
                        // Optional: bisa digunakan untuk navigate ke halaman chat di client
                        chatRoomId: String(chatRoomId),
                        senderEmail: String(object.senderEmail),
                    }};

                // Kirim notifikasi menggunakan Firebase Cloud Messaging
                messaging.send(message)
                    .then(response => {
                        console.log('FCM Message sent:', response);
                    })
                    .catch(error => {
                        console.error('FCM Error:', error);
                    });
            }

            return new APIResponse(
                HttpStatus.OK.code,
                null,
                chatRoomId,
                HttpStatus.OK.message,
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                error.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }

    // Fungsi untuk mendapatkan chat customer
    async getChatCustomer(req) {
        try {
            const user = await getUserByUid(req);
            const data = await this.chatRepo.getChat(user.email);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                error.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }
}

module.exports = ChatService;
