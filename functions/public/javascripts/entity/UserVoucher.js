class UserVoucher {
    constructor(ID, userId, voucherId, claimedAt, isUsed = false, usedAt = null) {
        this.ID = ID;
        this.userId = userId;
        this.voucherId = voucherId;
        this.claimedAt = claimedAt;
        this.isUsed = isUsed;
        this.usedAt = usedAt;
    }

    setID(ID) {
        this.ID = ID;
    }

    getID() {
        return this.ID;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    getUserId() {
        return this.userId;
    }

    setVoucherId(voucherId) {
        this.voucherId = voucherId;
    }

    getVoucherId() {
        return this.voucherId;
    }

    setClaimedAt(claimedAt) {
        this.claimedAt = claimedAt;
    }

    getClaimedAt() {
        return this.claimedAt;
    }

    setIsUsed(isUsed) {
        this.isUsed = isUsed;
    }

    getIsUsed() {
        return this.isUsed;
    }

    setUsedAt(usedAt) {
        this.usedAt = usedAt;
    }

    getUsedAt() {
        return this.usedAt;
    }

    markAsUsed() {
        this.isUsed = true;
        this.usedAt = new Date();
    }

    toObject() {
        return {
            ID: this.ID,
            userId: this.userId,
            voucherId: this.voucherId,
            claimedAt: this.claimedAt,
            isUsed: this.isUsed,
            usedAt: this.usedAt,
        };
    }
}

module.exports = UserVoucher;
