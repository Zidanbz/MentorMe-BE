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
            // Support both 'email' and 'mentorEmail' parameters for backward compatibility
            const mentorEmail = req.body.mentorEmail || req.body.email;

            // Validasi parameter
            if (!mentorEmail) {
                throw new Error("Parameter 'mentorEmail' atau 'email' harus diisi");
            }

            const customer = await getUsersByEmail(user.email);
            const mentor = await getUsersByEmail(mentorEmail);

            // Validasi hasil query
            if (!customer || customer.length === 0) {
                throw new Error(`Customer dengan email ${user.email} tidak ditemukan`);
            }
            if (!mentor || mentor.length === 0) {
                throw new Error(`Mentor dengan email ${mentorEmail} tidak ditemukan`);
            }

            const pictureCustomer = customer[0].picture;
            const pictureMentor = mentor[0].picture;
            return new Chat(mentorEmail, user.email, customer[0].fullName, mentor[0].fullName, pictureCustomer, pictureMentor);
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi untuk menyimpan chat
    async saveChat(req) {
        try {
            const object = await this.mappingChat(req); // Mapping chat object
            console.log('📝 Chat object created:', object);

            // Cek apakah chat room sudah ada antara emailCustomer dan emailMentor
            const existingChat = await this.chatRepo.getChatByUsers(object.emailCustomer, object.emailMentor);

            let chatRoomId;
            let chatRoomData;

            if (existingChat) {
                // Jika sudah ada, gunakan chat room yang lama
                console.log('✅ Existing chat room found:', existingChat.idRoom);
                chatRoomId = existingChat.idRoom;
                chatRoomData = existingChat;
            }else {
                // Jika belum ada, simpan chat baru dan buat ID chat baru
                console.log('🆕 Creating new chat room...');
                await this.chatRepo.saveChat(object);
                chatRoomId = object.idRoom;
                chatRoomData = {
                    idRoom: object.idRoom,
                    nameCustomer: object.nameCustomer,
                    nameMentor: object.nameMentor,
                    emailCustomer: object.emailCustomer,
                    emailMentor: object.emailMentor,
                    pictureCustomer: object.pictureCustomer,
                    pictureMentor: object.pictureMentor,
                };
                console.log('✅ New chat room created:', chatRoomId);
            }

            // Ambil token FCM penerima
            const receiver = await getUsersByEmail(object.emailMentor);
            const fcmToken = receiver[0].fcmToken; // pastikan field ini ada di data user

            if (fcmToken) {
                const message = {
                    notification: {
                        title: `${object.nameCustomer} mengirim pesan`,
                        body: 'Buka chat untuk membaca pesan baru',
                    },
                    token: fcmToken,
                    data: {
                        // Optional: bisa digunakan untuk navigate ke halaman chat di client
                        chatRoomId: String(chatRoomId),
                        senderEmail: String(object.emailCustomer),
                    },
                };

                // Kirim notifikasi menggunakan Firebase Cloud Messaging
                messaging.send(message)
                    .then(response => {
                        console.log('📨 FCM Message sent:', response);
                    })
                    .catch(error => {
                        console.error('❌ FCM Error:', error);
                    });
            }

            // Return full chat room data instead of just ID
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                chatRoomData,
                HttpStatus.OK.message,
            );
        }catch (error) {
            console.error('❌ Error in saveChat:', error.message);
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
