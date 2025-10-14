const {getVoucherHistory} = require('../../repo/UserVoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function getVoucherHistoryService(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;

        const voucherHistory = await getVoucherHistory(userId);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            voucherHistory,
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
    getVoucherHistoryService,
};
