const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const Withdrawal = require("../../entity/Withdrawal");
const WithrawalRepo = require("../../repo/WithdrawalRepo");
const MentorRepos = require("../../repo/MentorRepos");
const { getUserByUid } = require("../../util/AutenticationUtil");
const { db } = require("../../config/FirebaseConfig");
const { updateBalance } = require("../../repo/MentorRepo");

class WithdrawalService {
  MESSAGE_REDEMPTION_LIMIT_COINS = "Batas Penukaran Coin Adalah 10";
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
    this.collection = db.collection("withdrawal");
  }

  async changeCoin(coin, req) {
    try {
      const coints = await this.extractUser(req);
      if (coin < 10) {
        throw new Error(this.MESSAGE_REDEMPTION_LIMIT_COINS);
      }
      if (coin > coints) {
        throw new Error(this.MESSAGE_LESS_COINS);
      }
      return coin * this.CONVERSION_RATES.coin;
    }catch (e) {
      throw new Error(e.message);
    }
  }

  async extractUser(req) {
    try {
      const user = await getUserByUid(req);
      const mentor = await this.mentorRepo.getMentorByEmail(user.email);
      return mentor[0].coint;
    }catch (e) {
      throw new Error(e.message);
    }
  }

  // OPTIMASI: Fungsi Utama dengan parallel operations
  async doChangeCoin(req) {
    try {
      const coin = req.body.coin;
      const accountNumber = req.body.accountNumber;

      // 1. Parallel operations untuk validasi dan mendapatkan data user
      const [user] = await Promise.all([
        getUserByUid(req),
        this.changeCoin(coin, req), // Validasi coin, tapi tidak perlu simpan hasilnya
      ]);

      // 2. Ambil saldo 'money' terbaru dari mentor
      const currentMentorMoney = await this.getMoneyMe(req);

      // 3. Buat objek Withdrawal dengan 'totalMoney' dari saldo mentor
      const object = new Withdrawal(
        coin,
        accountNumber,
        currentMentorMoney,
        null,
        user.email,
      );

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

  async getMoneyMe(req) {
    try {
      const user = await getUserByUid(req);
      const mentor = await this.mentorRepo.getMentorByEmail(user.email);
      return mentor[0].money;
    }catch (e) {
      throw new Error(e.message);
    }
  }

  async changeMoneyMe(money, req) {
    try {
      const moneyMe = await this.getMoneyMe(req);
      if (money < 10) {
        throw new Error(this.MESSAGE_REDEMPTION_LIMIT_MONEY);
      }
      if (money > moneyMe) {
        throw new Error(this.MESSAGE_LESS_MONEY);
      }
      return money * this.CONVERSION_RATES.moneypoint;
    }catch (e) {
      throw new Error(e.message);
    }
  }

  // OPTIMASI: Fungsi Utama dengan parallel operations
  async doChangeMoney(req) {
    try {
      const money = req.body.money;
      const bank = req.body.bank;
      const accountNumber = req.body.accountNumber;

      // 1. Parallel operations untuk validasi dan mendapatkan data user
      const [user] = await Promise.all([
        getUserByUid(req),
        this.changeMoneyMe(money, req), // Validasi money, tapi tidak perlu simpan hasilnya
      ]);

      // 2. Ambil saldo 'money' terbaru dari mentor
      const currentMentorMoney = await this.getMoneyMe(req);

      // 3. Buat objek Withdrawal dengan 'totalMoney' dari saldo mentor
      const object = new Withdrawal(
        null,
        accountNumber,
        currentMentorMoney,
        money,
        user.email,
        bank,
      );

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

  async mappingResponseGetTransaction(req) {
    try {
      const user = await getUserByUid(req);
      const listData = await this.objectRepo.getTransaction(user.email);
      return listData.map(transaction => ({
        coin: transaction.coin,
        time: new Date(transaction.date._seconds * 1000).toISOString(),
        status: transaction.status,
        moneyMe: transaction.moneyMe,
        totalMoney: transaction.totalMoney,
      }));
    }catch (err) {
      throw new Error(err.message);
    }
  }

  // Fungsi Utama
  async getTransaction(req) {
    const data = await this.mappingResponseGetTransaction(req);
    return new APIResponse(
      HttpStatus.OK.code,
      null,
      data,
      HttpStatus.OK.message,
    );
  }
  catch(err) {
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
        ID: transaction.ID,
        coin: transaction.coin,
        time: new Date(transaction.date._seconds * 1000).toISOString(),
        status: transaction.status,
        moneyMe: transaction.moneyMe,
        totalMoney: transaction.totalMoney,
        email: transaction.email, // tambahkan ini agar admin tahu milik siapa
        accountNumber: transaction.accountNumber,
        bank: transaction.bank,
        mentor: transaction.mentor,
      }));
    }catch (err) {
      throw new Error(err.message);
    }
  }

  async getById(id) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log("Transaksi dengan ID tidak ditemukan:", id);
        return null;
      }
      return { ID: doc.id, ...doc.data() };
    }catch (error) {
      throw new Error(error.message);
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

      // --- LOGIKA PENGURANGAN SALDO ---
      // Hanya jalankan jika status baru adalah "ACCEPTED"
      if (newStatus.toUpperCase() === "ACCEPTED") {
        // 1. Ambil data transaksi berdasarkan ID

        const transaction = await this.getById(id);
        console.log("ID dari URL:", id);
        console.log("Hasil getById:", transaction);
        console.log("Email dari transaksi:", transaction?.email);
        if (!transaction) {
          throw new Error("Transaksi tidak ditemukan");
        }

        // 2. Ambil data mentor berdasarkan email dari transaksi
        const mentorData = await this.mentorRepo.getMentorByEmail(
          transaction.mentor,
        );

        if (!mentorData || mentorData.length === 0) {
          throw new Error("Mentor terkait transaksi ini tidak ditemukan");
        }
        const mentor = mentorData[0];

        let newCoinBalance = mentor.coint;
        let newMoneyBalance = mentor.money;

        // 3. Tentukan jenis penarikan (coin atau money) dan kurangi saldo
        if (transaction.coin && transaction.coin > 0) {
          // Penarikan koin
          if (mentor.coint < transaction.coin) {
            throw new Error(
              `Saldo koin mentor tidak mencukupi. Sisa: ${mentor.coint}, butuh: ${transaction.coin}`,
            );
          }
          newCoinBalance -= transaction.coin;
          console.log(
            `Pengurangan koin: ${mentor.coint} - ${transaction.coin} = ${newCoinBalance}`,
          );
        }else if (transaction.moneyMe && transaction.moneyMe > 0) {
          // Penarikan uang (money point)
          if (mentor.money < transaction.moneyMe) {
            throw new Error(
              `Saldo uang mentor tidak mencukupi. Sisa: ${mentor.money}, butuh: ${transaction.moneyMe}`,
            );
          }
          newMoneyBalance -= transaction.moneyMe;
          console.log(
            `Pengurangan uang: ${mentor.money} - ${transaction.moneyMe} = ${newMoneyBalance}`,
          );
        }

        // 4. Perbarui saldo mentor di database
        await updateBalance(
          transaction.mentor,
          newCoinBalance,
          newMoneyBalance,
        );

        const docRef = this.collection.doc(id);
        await docRef.update({
          totalMoney: newMoneyBalance, // atau newCoinBalance jika kamu ingin sesuaikan untuk coin
        });
      }

      // --- AKHIR LOGIKA PENGURANGAN SALDO ---

      // 5. Update status transaksi di database (tetap dijalankan untuk status apa pun)
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
