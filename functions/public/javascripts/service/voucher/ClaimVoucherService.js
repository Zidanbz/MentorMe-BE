const {getUserByUid} = require('../../util/AutenticationUtil');
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {db} = require('../../config/FirebaseConfig');
const { Timestamp } = require('firebase-admin').firestore;

const {updateVoucherStatus} = require('../../repo/UserVoucherRepo');

async function claimVoucher(req) {
    try {
        const user = await getUserByUid(req);
        const voucherId = req.params.voucherId;
        const userId = user.email; // Using email as userId

        // Check if voucher requires code or not
        let voucherSnapshot = await db.collection('vouchers').doc(voucherId).get();
        if (!voucherSnapshot.exists) {
            const vouchersQuery = await db.collection('vouchers').get();
            voucherSnapshot = vouchersQuery.docs.find(doc => doc.id.toLowerCase() === voucherId.toLowerCase());
            if (!voucherSnapshot) {
                throw new Error("Voucher tidak ditemukan");
            }
        }
        const voucherData = voucherSnapshot.data();

        // If voucher has no voucherCode (admin-created), allow multiple claims per user for different vouchers
        if (voucherData.voucherCode == null) {
            // Check if user already claimed this voucher
            const userVoucherDocId = `${userId}_${voucherId}`;
            const userVoucherRef = db.collection('user_vouchers').doc(userVoucherDocId);
            const userVoucherSnapshot = await userVoucherRef.get();

            if (userVoucherSnapshot.exists) {
                throw new Error("Voucher sudah pernah diklaim");
            }

            // Check voucher status and expiry
            const currentTime = Date.now();
            const dateEnd = voucherData.dateEnd._seconds * 1000;
            if (currentTime > dateEnd) {
                throw new Error("Voucher sudah expired");
            }
            if (!voucherData.status) {
                throw new Error("Voucher tidak aktif");
            }
            if (voucherData.maxClaims !== null && voucherData.currentClaims >= voucherData.maxClaims) {
                throw new Error("Voucher sudah mencapai batas maksimal penggunaan");
            }

            // Use Firestore transaction to claim voucher
            const result = await db.runTransaction(async transaction => {
                transaction.set(userVoucherRef, {
                    ID: userVoucherDocId,
                    userId: userId,
                    voucherId: voucherId,
                    name: voucherData.name,
                    piece: voucherData.piece,
                    info: voucherData.info,
                    dateStart: voucherData.dateStart,
                    dateEnd: voucherData.dateEnd,
                    claimedAt: new Date(),
                    isUsed: false,
                    usedAt: null,
                    status: 'AVAILABLE',
                });

                const voucherRef = db.collection('vouchers').doc(voucherId);
                transaction.update(voucherRef, {
                    currentClaims: voucherData.currentClaims + 1,
                });

                return {
                    ID: userVoucherDocId,
                    userId: userId,
                    voucherId: voucherId,
                    name: voucherData.name,
                    piece: voucherData.piece,
                    info: voucherData.info,
                    dateStart: voucherData.dateStart,
                    dateEnd: voucherData.dateEnd,
                    claimedAt: new Date(),
                    isUsed: false,
                    usedAt: null,
                    status: 'AVAILABLE',
                };
            });

            return new APIResponse(
                HttpStatus.CREATED.code,
                null,
                {
                    message: "Voucher berhasil diklaim!",
                    voucher: result,
                },
                HttpStatus.CREATED.message,
            );
        }else {
            // Voucher requires code, enforce one voucher per user
            const existingClaims = await db.collection('user_vouchers').where('userId', '==', userId).limit(1).get();
            if (!existingClaims.empty) {
                throw new Error("You can only claim one voucher per user");
            }

            // Use Firestore transaction to ensure atomic check and create
            const result = await db.runTransaction(async transaction => {
                const userVoucherDocId = `${userId}_${voucherId}`;
                const userVoucherRef = db.collection('user_vouchers').doc(userVoucherDocId);
                const userVoucherSnapshot = await transaction.get(userVoucherRef);

                if (userVoucherSnapshot.exists) {
                    throw new Error("Voucher sudah pernah diklaim");
                }

                // Check voucher status and expiry
                const currentTime = Date.now();
                const dateEnd = voucherData.dateEnd._seconds * 1000;
                if (currentTime > dateEnd) {
                    throw new Error("Voucher sudah expired");
                }
                if (!voucherData.status) {
                    throw new Error("Voucher tidak aktif");
                }
                if (voucherData.maxClaims !== null && voucherData.currentClaims >= voucherData.maxClaims) {
                    throw new Error("Voucher sudah mencapai batas maksimal penggunaan");
                }

                transaction.set(userVoucherRef, {
                    ID: userVoucherDocId,
                    userId: userId,
                    voucherId: voucherId,
                    name: voucherData.name,
                    piece: voucherData.piece,
                    info: voucherData.info,
                    dateStart: voucherData.dateStart,
                    dateEnd: voucherData.dateEnd,
                    claimedAt: new Date(),
                    isUsed: false,
                    usedAt: null,
                    status: 'AVAILABLE',
                });

                const voucherRef = db.collection('vouchers').doc(voucherId);
                transaction.update(voucherRef, {
                    currentClaims: voucherData.currentClaims + 1,
                });

                return {
                    ID: userVoucherDocId,
                    userId: userId,
                    voucherId: voucherId,
                    name: voucherData.name,
                    piece: voucherData.piece,
                    info: voucherData.info,
                    dateStart: voucherData.dateStart,
                    dateEnd: voucherData.dateEnd,
                    claimedAt: new Date(),
                    isUsed: false,
                    usedAt: null,
                    status: 'AVAILABLE',
                };
            });

            return new APIResponse(
                HttpStatus.CREATED.code,
                null,
                {
                    message: "Voucher berhasil diklaim!",
                    voucher: result,
                },
                HttpStatus.CREATED.message,
            );
        }
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
