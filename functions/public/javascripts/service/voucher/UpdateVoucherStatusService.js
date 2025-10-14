const {updateVoucherStatus, VOUCHER_STATUS} = require('../../repo/UserVoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function updateVoucherStatusService(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;
        const {voucherId, status} = req.body;

        if (!voucherId) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                "voucherId is required",
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }

        if (!status) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                "status is required",
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

        const result = await updateVoucherStatus(userId, voucherId, status);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            {success: result},
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
    updateVoucherStatusService,
};
