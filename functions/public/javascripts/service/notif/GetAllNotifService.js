const { getAllNotifs } = require("../../repo/NotifRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function getAllNotifService(userId) {
    try {
        const data = await getAllNotifs(userId);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (err) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            err.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}

module.exports = {
    getAllNotifService,
}