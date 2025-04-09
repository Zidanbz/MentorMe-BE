const {acceptedMentor} = require("../../repo/MentorRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {sendEmail} = require("../../config/MailConfig");

async function acceptedMentors(email, reason){
    const Subject = "PEMBERITAHUAN KONFIRMASI PROJECT";
    try {
        let data;
        if (reason != null) {
            try {
                await acceptedMentor(email, "REJECT");
                const text = "Maaf Permintaan Anda Menjadi Mentor Kami Tolak Dengan Alasan : " + reason;
                sendEmail(email, Subject, text);
                data = "Success";
            }catch (error){
                throw new Error(error.message);
            }
        }else {
            try {
                await acceptedMentor(email, "ACCEPTED");
                const text = "Selamat Permintaan Anda Menjadi Mentor Kami Terima";
                sendEmail(email, Subject, text);
                data = "Success";
            }catch (error) {
                throw new Error(error.message);
            }
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

module.exports = {
    acceptedMentors,
};