const {ID} = require("../util/UUID");

class Withdrawal{
    constructor(coin, accountNumber, totalMoney, moneyMe, mentor, bank) {
        this.ID = ID();
        this.coin = coin;
        this.date = new Date();
        this.status = "PENDING";
        this.accountNumber = accountNumber;
        this.totalMoney = totalMoney;
        this.moneyMe = moneyMe;
        this.mentor = mentor;
        this.bank = bank;
    }

    toObject(){
        return {
            ID: this.ID,
            coin: this.coin,
            date: this.date,
            status: this.status,
            accountNumber: this.accountNumber,
            totalMoney: this.totalMoney,
            moneyMe: this.moneyMe,
            mentor: this.mentor,
            bank: this.bank,
        }
    }
}

module.exports = Withdrawal;