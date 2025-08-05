const {db} = require("../config/FirebaseConfig");

function checkIsReady(snapshot) {
    if (snapshot.empty) {
        throw new Error("Data Is Not Found");
    }
}

async function createUserVoucher(userVoucher) {
    try {
        const docRef = await db.collection('user_vouchers').doc();
        await docRef.set(userVoucher.toObject());
        return docRef.id;
    }catch (error) {
        throw new Error(`Failed to create user voucher: ${error.message}`);
    }
}

async function getUserVouchersByUserId(userId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get user vouchers: ${error.message}`);
    }
}

async function checkUserVoucherExists(userId, voucherId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("voucherId", "==", voucherId)
            .get();

        return !docRef.empty;
    }catch (error) {
        throw new Error(`Failed to check user voucher: ${error.message}`);
    }
}

async function getAvailableUserVouchers(userId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("isUsed", "==", false)
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get available user vouchers: ${error.message}`);
    }
}

async function markVoucherAsUsed(userId, voucherId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("voucherId", "==", voucherId)
            .where("isUsed", "==", false)
            .get();

        checkIsReady(docRef);

        const updatePromises = docRef.docs.map(async doc => {
            await db.collection('user_vouchers').doc(doc.id).update({
                isUsed: true,
                usedAt: new Date(),
            });
        });

        await Promise.all(updatePromises);
        return true;
    }catch (error) {
        throw new Error(`Failed to mark voucher as used: ${error.message}`);
    }
}

async function getUserVoucherByVoucherId(userId, voucherId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("voucherId", "==", voucherId)
            .where("isUsed", "==", false)
            .get();

        if (docRef.empty) {
            return null;
        }

        return {
            id: docRef.docs[0].id,
            ...docRef.docs[0].data(),
        };
    }catch (error) {
        throw new Error(`Failed to get user voucher by voucher ID: ${error.message}`);
    }
}

async function checkUserAlreadyClaimedVoucher(userEmail, voucherId) {
    try {
        const docRef = await db.collection("user_vouchers")
            .where("userEmail", "==", userEmail)
            .where("voucherId", "==", voucherId)
            .limit(1)
            .get();

        return !docRef.empty;
    }catch (error) {
        console.error("Error checking user already claimed voucher:", error);
        throw new Error(`Error checking user voucher claim: ${error.message}`);
    }
}

async function getUserVouchers(userEmail) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userEmail", "==", userEmail)
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get user vouchers: ${error.message}`);
    }
}

async function getUserAvailableVouchers(userEmail) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userEmail", "==", userEmail)
            .where("isUsed", "==", false)
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get available user vouchers: ${error.message}`);
    }
}

module.exports = {
    createUserVoucher,
    getUserVouchersByUserId,
    checkUserVoucherExists,
    getAvailableUserVouchers,
    markVoucherAsUsed,
    getUserVoucherByVoucherId,
    checkUserAlreadyClaimedVoucher,
    getUserVouchers,
    getUserAvailableVouchers,
};
