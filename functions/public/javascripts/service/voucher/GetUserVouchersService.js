const {getUserVouchersByUserId, getAvailableUserVouchers} = require('../../repo/UserVoucherRepo');
const {getVoucherById} = require('../../repo/VoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function enrichUserVouchersWithVoucherData(userVouchers) {
    const enrichedVouchers = [];

    for (const userVoucher of userVouchers) {
        try {
            const voucherData = await getVoucherById(userVoucher.voucherId);
            if (voucherData && voucherData.length > 0) {
                const voucher = voucherData[0];
                enrichedVouchers.push({
                    userVoucherId: userVoucher.ID,
                    voucherId: voucher.ID,
                    name: voucher.name,
                    piece: voucher.piece,
                    info: voucher.info,
                    dateStart: voucher.dateStart,
                    dateEnd: voucher.dateEnd,
                    claimedAt: userVoucher.claimedAt,
                    isUsed: userVoucher.isUsed,
                    usedAt: userVoucher.usedAt,
                    status: voucher.status,
                });
            }
        }catch (error) {
            console.error(`Error enriching voucher ${userVoucher.voucherId}:`, error.message);
            // Continue with other vouchers even if one fails
        }
    }

    return enrichedVouchers;
}

async function getUserVouchers(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;

        const userVouchers = await getUserVouchersByUserId(userId);
        const enrichedVouchers = await enrichUserVouchersWithVoucherData(userVouchers);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            enrichedVouchers,
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

async function getAvailableUserVouchersForPayment(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;

        const availableUserVouchers = await getAvailableUserVouchers(userId);
        const enrichedVouchers = await enrichUserVouchersWithVoucherData(availableUserVouchers);

        // Filter only active and not expired vouchers
        const currentTime = Date.now();
        const validVouchers = enrichedVouchers.filter(voucher => {
            if (!voucher.status)return false;

            const dateEnd = new Date(voucher.dateEnd._seconds * 1000).getTime();
            return currentTime <= dateEnd;
        });

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            validVouchers,
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
    getUserVouchers,
    getAvailableUserVouchersForPayment,
};
