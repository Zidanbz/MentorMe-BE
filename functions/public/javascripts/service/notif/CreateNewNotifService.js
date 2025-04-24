const { notifCreated} = require("../../repo/NotifRepo");
const {ID} = require("../../util/UUID")
const Notif = require("../../entity/Notif")
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getEmailCustomer} = require("../../repo/CustomerRepo");
const {sendEmail} = require("../../config/MailConfig");

async function mapToNotif(req){
    try {
        const objectNotif = new Notif(ID(), req.body.title, req.body.message);
        return objectNotif;
    }catch (error){
        throw new Error(error.message);
    }
}

async function sendEmailToCustomer(subject, message){
    try {
        const listEmail = await getEmailCustomer();
        listEmail.forEach(element => {
            sendEmail(element.email, subject, message);
        })
    }catch (error){
        throw new Error(error.message);
    }
}

async function createNotif(req){
    try {
        const notif = await mapToNotif(req);
        await notifCreated(notif);
        await sendEmailToCustomer(notif.title, notif.message);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            "Success",
            HttpStatus.CREATED.message,
        );
    }catch (error){
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
}