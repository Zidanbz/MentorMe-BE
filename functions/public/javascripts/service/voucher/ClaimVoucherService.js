const {getVoucherById} = require('../../repo/VoucherRepo');
const {createUserVoucher, checkUserVoucherExists} = require('../../repo/UserVoucherRepo');
const {getUserByUid} = require('../../util/AutenticationUtil');
const UserVoucher = require('../../entity/UserVoucher');
const {ID} = require('../../util/UUID');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function validateVoucherForClaim(voucherId, userId) {
    // Check if voucher exists and is active
    const voucher = await getVoucherById(voucherId);
    if (!voucher || voucher.length === 0) {
        throw new Error("Voucher not found");
    }

    const voucherData = voucher[0];
    if (!voucherData.status) {
        throw new Error("Voucher is not active");
    }

    // Check if voucher is still valid (not expired)
    const currentTime = Date.now();
    const dateEnd = new Date(voucherData.dateEnd._seconds * 1000).getTime();
    if (currentTime > dateEnd) {
        throw new Error("Voucher has expired");
    }

    // Check if user already claimed this voucher
    const alreadyClaimed = await checkUserVoucherExists(userId, voucherId);
    if (alreadyClaimed) {
        throw new Error("You have already claimed this voucher");
    }

    return voucherData;
}

async function claimVoucher(req) {
    try {
        const user = await getUserByUid(req);
        const voucherId = req.params.voucherId;
        const userId = user.email; // Using email as userId

        // Validate voucher for claim
        const voucherData = await validateVoucherForClaim(voucherId, userId);

        // Create user voucher record
        const userVoucher = new UserVoucher(
            ID(),
            userId,
            voucherId,
            new Date(),
            false,
            null,
        );

        await createUserVoucher(userVoucher);

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            {
                message: "Voucher claimed successfully",
                voucher: {
                    ID: voucherData.ID,
                    name: voucherData.name,
                    piece: voucherData.piece,
                    info: voucherData.info,
                    claimedAt: userVoucher.claimedAt,
                },
            },
            HttpStatus.CREATED.message,
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
    claimVoucher,
};
