const {getVoucherActive} = require('../../repo/VoucherRepo');
const {checkUserVoucherExists} = require('../../repo/UserVoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

function formatVoucherForClaim(vouchers) {
    return vouchers.map(voucher => ({
        ID: voucher.ID,
        name: voucher.name,
        piece: voucher.piece,
        info: voucher.info,
        dateStart: voucher.dateStart,
        dateEnd: voucher.dateEnd,
    }));
}

async function getAvailableVouchersToClaim(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;

        // Get all active vouchers
        const activeVouchers = await getVoucherActive();

        // Filter out vouchers that user has already claimed
        const availableVouchers = [];

        for (const voucher of activeVouchers) {
            const alreadyClaimed = await checkUserVoucherExists(userId, voucher.ID);
            if (!alreadyClaimed) {
                availableVouchers.push(voucher);
            }
        }

        const formattedVouchers = formatVoucherForClaim(availableVouchers);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            formattedVouchers,
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
    getAvailableVouchersToClaim,
};
