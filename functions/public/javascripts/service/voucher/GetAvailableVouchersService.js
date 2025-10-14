const {getVoucherActive} = require('../../repo/VoucherRepo');
const {checkUserVoucherExists, getUserVouchersByUserId} = require('../../repo/UserVoucherRepo');
const {getVoucherById} = require('../../repo/VoucherRepo');
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

async function getAvailableVouchersToClaim(req) {
    try {
        const user = await getUserByUid(req);
        const userId = user.email;

        // Get user's claimed vouchers
        const userClaimedVouchersRaw = await getUserVouchersByUserId(userId);
        const claimedVouchers = await enrichUserVouchersWithVoucherData(userClaimedVouchersRaw);

        // Get all active vouchers
        const activeVouchers = await getVoucherActive();

        // Exclude vouchers that require code (voucherCode not null) from the "available to claim" list.
        // Vouchers with code should only be claimable via claim-by-code flow, not listed here.
        const claimableByIdVouchers = activeVouchers.filter(v => !v.voucherCode);

        // Filter out vouchers that user has already claimed
        const availableVouchers = [];

        for (const voucher of claimableByIdVouchers) {
            const alreadyClaimed = await checkUserVoucherExists(userId, voucher.ID);
            if (!alreadyClaimed) {
                availableVouchers.push(voucher);
            }
        }

        const formattedVouchers = formatVoucherForClaim(availableVouchers);

        // Return both available vouchers and user's claimed vouchers
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            {
                availableVouchers: formattedVouchers,
                claimedVouchers: claimedVouchers,
            },
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
