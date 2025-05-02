const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const Withdrawal = require("../../entity/Withdrawal");
const WithrawalRepo = require("../../repo/WithdrawalRepo");
const MentorRepos = require("../../repo/MentorRepos");
const {getUserByUid} = require("../../util/AutenticationUtil");

class WithdrawalService{
    MESSAGE_REDEMPTION_LIMIT_COINS= "Batas Penukaran Coin Adalah 10";
    MESSAGE_LESS_COINS = "Coin anda tidak mencukupi";
    MESSAGE_REDEMPTION_LIMIT_MONEY = "Batas Penukaran Money Adalah 10";
    MESSAGE_LESS_MONEY = "Money anda tidak mencukupi";

    CONVERSION_RATES = {
        coin: 1000, // 1 coin = Rp 1,000
        moneypoint: 1500, // 1 moneypoint = Rp 1,500
    };

    objectRepo;
    mentorRepo;

    constructor() {
        this.objectRepo = new WithrawalRepo();
        this.mentorRepo = new MentorRepos();
    }

    async changeCoin(coin, req){
        try {
            const coints = await this.extractUser(req);
            if (coin < 10){
                throw new Error(this.MESSAGE_REDEMPTION_LIMIT_COINS);
            }
            if (coin > coints) {
                throw new Error(this.MESSAGE_LESS_COINS);
            }
            return (coin * this.CONVERSION_RATES.coin);
        }catch (e) {
            throw new Error(e.message);
        }
    }

    async extractUser(req){
        try {
            const user = await getUserByUid(req);
            const mentor = await this.mentorRepo.getMentorByEmail(user.email);
            return mentor[0].coint;
        }catch (e) {
            throw new Error(e.message);
        }
    }

    // Fungsi Utama
    async doChangeCoin(req){
        try {
            const coin = req.body.coin;
            const accountNumber = req.body.accountNumber;
            const money = await this.changeCoin(coin, req);
            const user = await getUserByUid(req);
            const object = new Withdrawal(coin, accountNumber, money, null, user.email);
            await this.objectRepo.save(object);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                "Success",
                HttpStatus.OK.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                err.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }
    }

    async getMoneyMe(req){
        try {
            const user = await getUserByUid(req);
            const mentor = await this.mentorRepo.getMentorByEmail(user.email);
            return mentor[0].money;
        }catch (e) {
            throw new Error(e.message);
        }
    }

    async changeMoneyMe(money, req){
        try {
            const moneyMe = await this.getMoneyMe(req);
            if (money < 10){
                throw new Error(this.MESSAGE_REDEMPTION_LIMIT_MONEY);
            }
            if (money > moneyMe) {
                throw new Error(this.MESSAGE_LESS_MONEY);
            }
            return (money * this.CONVERSION_RATES.moneypoint);
        }catch (e) {
            throw new Error(e.message);
        }
    }

    // Fungsi Utama
    async doChangeMoney(req){
        try {
            const user = await getUserByUid(req);
            const money = req.body.money;
            const bank = req.body.bank;
            const accountNumber = req.body.accountNumber;
            const moneys = await this.changeMoneyMe(money, req);
            const object = new Withdrawal(null, accountNumber, moneys, money, user.email, bank);
            await this.objectRepo.save(object);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                "Success",
                HttpStatus.OK.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                err.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }
    }

    async mappingResponseGetTransaction(req){
        try {
            const user = await getUserByUid(req);
            const listData = await this.objectRepo.getTransaction(user.email);
            return listData.map(transaction => ({
                "coin": transaction.coin,
                "time": new Date(transaction.date._seconds * 1000).toISOString(),
                "status": transaction.status,
                "moneyMe": transaction.moneyMe,
                "totalMoney": transaction.totalMoney,
            }));
        }catch (err){
            throw new Error(err.message);
        }
    }

    // Fungsi Utama
    async getTransaction(req){
        const data = await this.mappingResponseGetTransaction(req);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    } catch(err) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            err.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }

    async getAllTransactions() {
    try {
        const listData = await this.objectRepo.getAllTransaction();
        console.log("=== TRANSACTION RAW DATA ===", listData);
        return listData.map(transaction => ({
            "ID": transaction.ID,
            "coin": transaction.coin,
            "time": new Date(transaction.date._seconds * 1000).toISOString(),
            "status": transaction.status,
            "moneyMe": transaction.moneyMe,
            "totalMoney": transaction.totalMoney,
            "email": transaction.email, // tambahkan ini agar admin tahu milik siapa
            "accountNumber": transaction.account_number,
            "bank": transaction.bank,
            "mentor": transaction.mentor,
        }));
    }catch (err) {
        throw new Error(err.message);
    }
}

// Fungsi utama untuk admin
async getAllTransactionAdmin() {
    try {
        const data = await this.getAllTransactions();
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (err) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            err.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}

// Fungsi utama untuk admin
async updateStatusByAdmin(req) {
    try {
        const id = req.params.id; // Ambil ID dari parameter URL
        const newStatus = req.body.status; // Ambil status dari body request

        if (!id || !newStatus) {
            throw new Error("ID dan status wajib diisi");
        }
        await this.objectRepo.printAllWithdrawalIDs(); // debug
        // Update status transaksi di database
        await this.objectRepo.updateStatus(id, newStatus);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            `Berhasil mengubah status menjadi ${newStatus}`,
            HttpStatus.OK.message,
        );
    }catch (err) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            err.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}
}

module.exports = WithdrawalService;