const {updateProjectAccpted} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {sendEmail} = require("../../config/MailConfig");

async function acceptedProject(id, reason, email){
    const Subject = "PEMBERITAHUAN KONFIRMASI PROJECT";
    try {
        let data;
        if (reason != null) {
            const project = await updateProjectAccpted(id, "REJECT");
            const text = "Maaf Project Anda Dengan Nama " + project[0].materialName + " Kami Tolak Dengan Alasan : " + reason;
            sendEmail(email, Subject, text);
            data = "Success";
        }else {
            const project = await updateProjectAccpted(id, "ACCEPTED");
            const text = "Selamat Project Anda Dengan Nama " + project[0].materialName + " Kami Terima";
            sendEmail(email, Subject, text);
            data = "Success";
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
    acceptedProject,
};