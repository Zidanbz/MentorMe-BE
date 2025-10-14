const {db} = require("../config/FirebaseConfig");

// Enum untuk status voucher
const VOUCHER_STATUS = {
    AVAILABLE: 'AVAILABLE',
    USED: 'USED',
    EXPIRED: 'EXPIRED',
    CLAIMED: 'CLAIMED',
};

// Helper functions untuk status voucher
function isValidStatus(status) {
    return Object.values(VOUCHER_STATUS).includes(status);
}

function canTransitionStatus(currentStatus, newStatus) {
    const validTransitions = {
        [VOUCHER_STATUS.CLAIMED]: [VOUCHER_STATUS.AVAILABLE, VOUCHER_STATUS.EXPIRED],
        [VOUCHER_STATUS.AVAILABLE]: [VOUCHER_STATUS.USED, VOUCHER_STATUS.EXPIRED, VOUCHER_STATUS.CLAIMED],
        [VOUCHER_STATUS.USED]: [], // Status final, tidak bisa berubah
        [VOUCHER_STATUS.EXPIRED]: [], // Status final, tidak bisa berubah
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

function getStatusColor(status) {
    const colors = {
        [VOUCHER_STATUS.AVAILABLE]: '#4CAF50', // Green
        [VOUCHER_STATUS.USED]: '#9E9E9E', // Grey
        [VOUCHER_STATUS.EXPIRED]: '#F44336', // Red
        [VOUCHER_STATUS.CLAIMED]: '#FF9800', // Orange
    };
    return colors[status] || '#9E9E9E';
}

function getStatusLabel(status) {
    const labels = {
        [VOUCHER_STATUS.AVAILABLE]: 'Tersedia',
        [VOUCHER_STATUS.USED]: 'Sudah Digunakan',
        [VOUCHER_STATUS.EXPIRED]: 'Kedaluwarsa',
        [VOUCHER_STATUS.CLAIMED]: 'Sudah Diklaim',
    };
    return labels[status] || 'Unknown';
}

function checkIsReady(snapshot) {
    if (snapshot.empty) {
        throw new Error("Data Is Not Found");
    }
}

async function createUserVoucher(userVoucher) {
    try {
        const docRef = await db.collection('user_vouchers').doc();
        const data = (userVoucher && typeof userVoucher.toObject === 'function') ? userVoucher.toObject() : userVoucher;
        await docRef.set(data);
        return docRef.id;
    }catch (error) {
        throw new Error(`Failed to create user voucher: ${error.message}`);
    }
}

async function getUserVouchersByUserId(userId) {
    try {
        // Primary: query by userId
        const q1 = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .get();
        // Legacy fallback: some docs used userEmail field
        const q2 = await db.collection('user_vouchers')
            .where("userEmail", "==", userId)
            .get();

        const allDocs = [...q1.docs, ...q2.docs];
        const seen = new Set();
        const merged = [];

        for (const d of allDocs) {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                merged.push({
                    id: d.id,
                    ...d.data(),
                });
            }
        }
        return merged;
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
        // Query by userId and legacy userEmail, merge results
        const q1 = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .get();
        const q2 = await db.collection('user_vouchers')
            .where("userEmail", "==", userId)
            .get();

        const allDocs = [...q1.docs, ...q2.docs];
        const seen = new Set();
        const vouchers = [];

        for (const d of allDocs) {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                vouchers.push({
                    id: d.id,
                    ...d.data(),
                });
            }
        }

        // Only those not used
        return vouchers.filter(voucher => !voucher.isUsed || voucher.isUsed === 0);
    }catch (error) {
        throw new Error(`Failed to get available user vouchers: ${error.message}`);
    }
}

async function markVoucherAsUsed(userId, voucherId) {
    try {
        // Use the new status update function for consistency
        return await updateVoucherStatus(userId, voucherId, VOUCHER_STATUS.USED);
    }catch (error) {
        throw new Error(`Failed to mark voucher as used: ${error.message}`);
    }
}

async function getUserVoucherByVoucherId(userId, voucherId) {
    try {
        // Try by userId
        const q1 = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("voucherId", "==", voucherId)
            .where("isUsed", "==", false)
            .get();

        // Fallback by userEmail
        const q2 = await db.collection('user_vouchers')
            .where("userEmail", "==", userId)
            .where("voucherId", "==", voucherId)
            .where("isUsed", "==", false)
            .get();

        const candidate = q1.empty ? q2 : q1;

        if (candidate.empty) {
            return null;
        }

        return {
            id: candidate.docs[0].id,
            ...candidate.docs[0].data(),
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

// Fungsi baru untuk status enum
async function updateVoucherStatus(userId, voucherId, newStatus) {
    try {
        if (!isValidStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        // Support both userId and legacy userEmail field
        const q1 = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("voucherId", "==", voucherId)
            .get();

        const q2 = await db.collection('user_vouchers')
            .where("userEmail", "==", userId)
            .where("voucherId", "==", voucherId)
            .get();

        const docs = [...q1.docs, ...q2.docs];

        if (docs.length === 0) {
            throw new Error("Data Is Not Found");
        }

        const updatePromises = docs.map(async doc => {
            const currentStatus = doc.data().status || VOUCHER_STATUS.AVAILABLE;

            if (!canTransitionStatus(currentStatus, newStatus)) {
                throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`);
            }

            const updateData = {
                status: newStatus,
                updatedAt: new Date(),
            };

            // Set timestamps based on status
            if (newStatus === VOUCHER_STATUS.USED) {
                updateData.usedAt = new Date();
                updateData.isUsed = true; // Backward compatibility
            }else if (newStatus === VOUCHER_STATUS.CLAIMED) {
                updateData.claimedAt = new Date();
            }

            await db.collection('user_vouchers').doc(doc.id).update(updateData);
        });

        await Promise.all(updatePromises);
        return true;
    }catch (error) {
        throw new Error(`Failed to update voucher status: ${error.message}`);
    }
}

async function getVouchersByStatus(userId, status) {
    try {
        if (!isValidStatus(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .where("status", "==", status)
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get vouchers by status: ${error.message}`);
    }
}

async function getVoucherHistory(userId) {
    try {
        const docRef = await db.collection('user_vouchers')
            .where("userId", "==", userId)
            .orderBy("claimedAt", "desc")
            .get();

        return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }catch (error) {
        throw new Error(`Failed to get voucher history: ${error.message}`);
    }
}

// Fungsi migrasi untuk data existing
async function migrateExistingVouchers() {
    try {
        const batch = db.batch();
        const snapshot = await db.collection('user_vouchers').get();

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            let status = VOUCHER_STATUS.AVAILABLE;

            // Determine status based on existing fields
            if (data.isUsed === true) {
                status = VOUCHER_STATUS.USED;
            }else if (data.isExpired === true) {
                status = VOUCHER_STATUS.EXPIRED;
            }else if (data.claimedAt && !data.isUsed) {
                status = VOUCHER_STATUS.CLAIMED;
            }

            // Only update if status field doesn't exist
            if (!data.status) {
                batch.update(doc.ref, {
                    status: status,
                    updatedAt: new Date(),
                });
            }
        });

        await batch.commit();
        console.log(`Migrated ${snapshot.docs.length} vouchers`);
        return true;
    }catch (error) {
        throw new Error(`Failed to migrate vouchers: ${error.message}`);
    }
}

module.exports = {
    // Existing functions
    createUserVoucher,
    getUserVouchersByUserId,
    checkUserVoucherExists,
    getAvailableUserVouchers,
    markVoucherAsUsed,
    getUserVoucherByVoucherId,
    checkUserAlreadyClaimedVoucher,
    getUserVouchers,
    getUserAvailableVouchers,

    // New status enum functions
    updateVoucherStatus,
    getVouchersByStatus,
    getVoucherHistory,
    migrateExistingVouchers,

    // Constants and helpers
    VOUCHER_STATUS,
    isValidStatus,
    canTransitionStatus,
    getStatusColor,
    getStatusLabel,
};
