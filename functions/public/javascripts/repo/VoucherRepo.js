const {db} = require("../config/FirebaseConfig")
const {OK: err} = require("../util/HttpStatus");

async function createNewVoucher(data) {
    try {
        const docRef = await db.collection('vouchers')
            .doc();
        await docRef.set(data.toObject());
    }catch (err) {
        throw new Error(err.message);
    }
}

async function getVoucherActive() {
    try {
        const currentTime = Date.now();
        const docRef = await db.collection('vouchers')
            .where("status", "==", true)
            .get();

        const vouchers = docRef.docs.map(doc => ({ ...doc.data() }));
        const updatePromises = docRef.docs.map(async voucher => {
            if (typeof voucher.id !== 'string' || voucher.id.trim() === '') {
                console.error('Invalid voucher ID:', voucher.id);
                return voucher;
            }
            const dateEnd = new Date(voucher.data().dateEnd._seconds * 1000).getTime();
            if (currentTime > dateEnd) {
                try {
                    await db.collection('vouchers').doc(voucher.id).update({
                        status: false,
                    });
                    voucher.status = false;
                }catch (error) {
                    throw new Error(error.message);
                }
            }
            return voucher;
        });
        await Promise.all(updatePromises);
        return vouchers.filter(voucher => voucher.status === true);
    }catch (error) {
        throw new Error(error.message);
    }
}

function checkIsReady(snapshot){
    if (snapshot.empty) {
        throw new Error("Data Is Not Found");
    }
}

async function deleteVoucher(voucherId) {
    try {
        const snapshot = await db.collection('vouchers')
            .where("ID", "==", voucherId)
            .get();
        checkIsReady(snapshot);
        for (const doc of snapshot.docs) {
            await doc.ref.delete();
        }
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getVoucherById(voucherId) {
    try {
        const docRef = await db.collection("vouchers")
            .where("ID", "==", voucherId)
            .get();
        return docRef.docs.map(doc => doc.data());
    }catch (error){
        throw new Error(err.message);
    }
}

async function updateVoucher(id, data) {
    try {
        const docRef = await db.collection('vouchers').where("ID", "==", id).get();
        checkIsReady(docRef);
        const updatePromises = docRef.docs.map(async doc => {
            try {
                const voucher = { ...doc.data(), id: doc.id };
                await db.collection('vouchers').doc(voucher.id).update({
                    name: data.name,
                    piece: data.piece,
                    dateStart: data.dateStart,
                    dateEnd: data.dateEnd,
                    status: data.status,
                    info: data.info,
                });
                return voucher;
            }catch (error) {
                throw new Error(`Failed to update voucher with ID ${doc.id}: ${error.message}`);
            }
        });
        await Promise.all(updatePromises);
    }catch (error) {
        throw new Error(`Error updating voucher: ${error.message}`);
    }
}

async function getVoucherByCode(voucherCode) {
    try {
        const docRef = await db.collection("vouchers")
            .where("voucherCode", "==", voucherCode)
            .where("status", "==", true)
            .limit(1)
            .get();

        if (docRef.empty) {
            return null;
        }

        const voucherDoc = docRef.docs[0];
        return {
            id: voucherDoc.id,
            ...voucherDoc.data(),
        };
    }catch (error) {
        console.error("Error getting voucher by code:", error);
        throw new Error(`Error getting voucher by code: ${error.message}`);
    }
}

async function updateVoucherClaimCount(voucherId, newClaimCount) {
    try {
        const docRef = await db.collection('vouchers').where("ID", "==", voucherId).get();

        if (docRef.empty) {
            throw new Error(`Voucher with ID ${voucherId} not found`);
        }

        const voucherDoc = docRef.docs[0];
        await db.collection('vouchers').doc(voucherDoc.id).update({
            currentClaims: newClaimCount,
        });

        return true;
    }catch (error) {
        console.error("Error updating voucher claim count:", error);
        throw new Error(`Error updating voucher claim count: ${error.message}`);
    }
}

async function checkVoucherCodeExists(voucherCode) {
    try {
        const docRef = await db.collection("vouchers")
            .where("voucherCode", "==", voucherCode)
            .limit(1)
            .get();

        return !docRef.empty;
    }catch (error) {
        console.error("Error checking voucher code exists:", error);
        throw new Error(`Error checking voucher code: ${error.message}`);
    }
}

module.exports = {
    createNewVoucher,
    getVoucherActive,
    deleteVoucher,
    updateVoucher,
    getVoucherById,
    getVoucherByCode,
    updateVoucherClaimCount,
    checkVoucherCodeExists,
}
