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
                    status: userVoucher.status,
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
        const userEmail = user.email;

        const userVouchers = await getUserVouchersByUserId(userEmail);
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

        // Filter only active and not expired vouchers.
        // If no dateEnd provided or parse fails, treat as valid (no expiry).
        const currentTime = Date.now();
        const validVouchers = enrichedVouchers.filter(voucher => {
            // Treat missing status as available; exclude only USED or EXPIRED
            const st = voucher.status;
            if (st === 'USED' || st === 'EXPIRED')return false;

            // If voucher has no dateEnd, consider it valid
            if (!voucher.dateEnd)return true;

            let dateEndTime;
            try {
                if (voucher.dateEnd._seconds) {
                    dateEndTime = new Date(voucher.dateEnd._seconds * 1000).getTime();
                }else if (voucher.dateEnd.toDate) {
                    dateEndTime = voucher.dateEnd.toDate().getTime();
                }else if (voucher.dateEnd instanceof Date) {
                    dateEndTime = voucher.dateEnd.getTime();
                }else {
                    dateEndTime = new Date(voucher.dateEnd).getTime();
                }

                // If parsing failed, don't exclude the voucher
                if (isNaN(dateEndTime))return true;
            }catch (e) {
                // On any parsing error, don't exclude
                return true;
            }

            return currentTime <= dateEndTime;
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
