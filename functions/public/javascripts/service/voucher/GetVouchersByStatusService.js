const {getVouchersByStatus, VOUCHER_STATUS} = require('../../repo/UserVoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function getVouchersByStatusService(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;
        const {status} = req.query;

        if (!status) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                "Status parameter is required",
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }

        if (!Object.values(VOUCHER_STATUS).includes(status)) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                `Invalid status. Valid statuses: ${Object.values(VOUCHER_STATUS).join(', ')}`,
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }

        const vouchers = await getVouchersByStatus(userId, status);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            vouchers,
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
    getVouchersByStatusService,
};
