class CoinTransaction {
    constructor(ID, email, amount, status) {
        // Tambahkan field payment_type dan transaction_time
        this.ID = ID;
        this.email = email;
        this.amount = amount;
        this.status = status;
        this.createdAt = new Date();
    }


    getID() {
        return this.ID;
    }

    setID(value) {
        this.ID = value;
    }

    getEmail() {
        return this.email;
    }

    setEmail(value) {
        this.email = value;
    }

    getAmount() {
        return this.amount;
    }

    setAmount(value) {
        this.amount = value;
    }

    getStatus() {
        return this.status;
    }

    setStatus(value) {
        this.status = value;
    }

    toObject() {
        return {
            ID: this.ID,
            email: this.email,
            amount: this.amount,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}

module.exports = CoinTransaction;