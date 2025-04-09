// const Message = require('../../entity/Message');
// const uuidv4 = require('uuid');
// const { db, storage } = require('../../config/FirebaseConfig');
//
// async function saveMessage(consultationId, senderId, content, file) {
//     try {
//         let fileUrl = null;
//         if (file) {
//             const fileName = `chats/${consultationId}/${uuidv4()}-${file.originalname}`;
//             const fileRef = storage.file(fileName);
//             await fileRef.save(file.buffer);
//             fileUrl = await fileRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });
//         }
//
//         const message = new Message(
//             uuidv4(),
//             consultationId,
//             senderId,
//             content,
//             fileUrl,
//         );
//
//         await db.collection('messages').add(message.toObject());
//         return message.toObject();
//     }catch (error) {
//         throw new Error(`Failed to save message: ${error.message}`);
//     }
// }
// async function getConsultationMessages(consultationId) {
//     try {
//         const messages = await db.collection('messages')
//             .where('consultationId', '==', consultationId)
//             .orderBy('timestamp', 'asc')
//             .get();
//         return messages.docs.map(doc => doc.data());
//     }catch (error) {
//         throw new Error(`Failed to get messages: ${error.message}`);
//     }
// }
//
// module.exports = {
//     saveMessage,
//     getConsultationMessages,
// };
const ChatRepo = require("../../repo/ChatRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUserByUid} = require("../../util/AutenticationUtil");
const Chat = require("../../entity/Chat");
const {getUsersByEmail} = require("../../repo/UserRepo");

class ChatService{
    chatRepo;

    constructor(){
        this.chatRepo = new ChatRepo();
    }

    async mappingChat(req){
        try {
            const user = await getUserByUid(req);
            const email = await req.body.email;
            const customer = await getUsersByEmail(user.email);
            const mentor = await getUsersByEmail(email);
            return new Chat(email, user.email, customer[0].fullName, mentor[0].fullName);
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async saveChat(req){
        try {
            const object = await this.mappingChat(req);
            console.log(object);
            await this.chatRepo.saveChat(object);
            const data = object.idRoom;
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            )
        }catch (error){
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                error.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }

    async getChatCustomer(req){
        try {
            const user = await getUserByUid(req);
            const data = await this.chatRepo.getChat(user.email);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            )
        }catch (error){
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