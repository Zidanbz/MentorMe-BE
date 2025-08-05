const {getVoucherByCode, updateVoucherClaimCount} = require('../../repo/VoucherRepo');
const {createUserVoucher, checkUserAlreadyClaimedVoucher} = require('../../repo/UserVoucherRepo');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const UserVoucher = require("../../entity/UserVoucher");
const {ID} = require("../../util/UUID");

/**
 * Validasi apakah voucher code valid dan bisa diklaim
 */
async function validateVoucherCode(voucherCode, userEmail) {
    // 1. Cek apakah voucher code exists
    const voucher = await getVoucherByCode(voucherCode);
    if (!voucher) {
        throw new Error(`Voucher code "${voucherCode}" tidak ditemukan`);
    }

    // 2. Cek apakah voucher masih aktif
    if (!voucher.status) {
        throw new Error("Voucher sudah tidak aktif");
    }

    // 3. Cek apakah voucher belum expired
    const currentTime = Date.now();
    const endTime = new Date(voucher.dateEnd._seconds * 1000).getTime();
    if (currentTime > endTime) {
        throw new Error("Voucher sudah expired");
    }

    // 4. Cek apakah voucher belum mencapai batas maksimal claim
    if (voucher.maxClaims !== null && voucher.currentClaims >= voucher.maxClaims) {
        throw new Error("Voucher sudah mencapai batas maksimal penggunaan");
    }

    // 5. Cek apakah user sudah pernah claim voucher ini
    const alreadyClaimed = await checkUserAlreadyClaimedVoucher(userEmail, voucher.ID);
    if (alreadyClaimed) {
        throw new Error("Anda sudah pernah mengklaim voucher ini");
    }

    return voucher;
}

/**
 * Generate voucher code unik
 */
function generateVoucherCode(prefix = "SAVE") {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
    return `${prefix}${timestamp}${random}`;
}

/**
 * Claim voucher menggunakan kode unik
 */
async function claimVoucherByCode(userEmail, voucherCode) {
    try {
        // 1. Validasi voucher code
        const voucher = await validateVoucherCode(voucherCode, userEmail);

        // 2. Buat user voucher record
        const userVoucher = new UserVoucher(
            ID(), // userVoucherId
            userEmail,
            voucher.ID, // voucherId
            voucher.name,
            voucher.piece,
            voucher.info,
            voucher.dateStart,
            voucher.dateEnd,
            new Date(), // claimedAt
            false, // isUsed
            null, // usedAt
            'AVAILABLE', // status
        );

        // 3. Simpan user voucher ke database
        await createUserVoucher(userVoucher);

        // 4. Update claim count di voucher
        await updateVoucherClaimCount(voucher.ID, voucher.currentClaims + 1);

        // 5. Return success response
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            {
                message: "Voucher berhasil diklaim!",
                voucher: {
                    userVoucherId: userVoucher.userVoucherId,
                    voucherId: userVoucher.voucherId,
                    name: userVoucher.name,
                    piece: userVoucher.piece,
                    info: userVoucher.info,
                    claimedAt: userVoucher.claimedAt,
                    status: userVoucher.status,
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

/**
 * Validasi format voucher code
 */
function validateVoucherCodeFormat(voucherCode) {
    if (!voucherCode || typeof voucherCode !== 'string') {
        throw new Error("Voucher code harus berupa string");
    }

    if (voucherCode.length < 3 || voucherCode.length > 20) {
        throw new Error("Voucher code harus antara 3-20 karakter");
    }

    // Allow alphanumeric and some special characters
    const validPattern = /^[A-Za-z0-9_-]+$/;
    if (!validPattern.test(voucherCode)) {
        throw new Error("Voucher code hanya boleh mengandung huruf, angka, underscore, dan dash");
    }

    return true;
}

module.exports = {
    claimVoucherByCode,
    generateVoucherCode,
    validateVoucherCodeFormat,
    validateVoucherCode,
};
