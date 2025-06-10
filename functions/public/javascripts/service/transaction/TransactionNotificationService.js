const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {createNewLearning, getLearningByEmailAndProject} = require("../../repo/LearningRepo");
const {getTransactionById, updateTransactionAccepted} = require("../../repo/TransactionalRepo");
const Learning = require("../../entity/Learning");
const {ID} = require("../../util/UUID");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");
const {newActivity} = require("../activity/CreateNewActivityService");
const {getTransactionsToUp} = require("../../repo/TopUpRepo");
const {getCoinCustomerByEmail, addCoint} = require("../../repo/CustomerRepo");

async function mappingToLearning(transaction){
    try {
        return new Learning(
            ID(),
            transaction.email,
            false,
            transaction.course,
        );
    }catch (error){
        throw new Error(error.message);
    }
}

async function createActivity(learning){
    try {
        const syllabus = await getSyllabusByProject(learning.project);
        const learningId = learning.ID;
        if (!syllabus || syllabus.length === 0) {
            return 0;
        }
        for (const value of syllabus){
            const syllabusId = value.ID;
            await newActivity(learningId, syllabusId);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function checkNotificationTopUp(orderId, req){
    if (orderId.startsWith('TopUp')) {
        const detailsTransaction = await getTransactionsToUp(orderId);
        const manyCoint = req.body.gross_amount / 1000;
        const email = detailsTransaction[0].email;
        const customer = await getCoinCustomerByEmail(email);
        const coinCustomer = customer[0].coin;
        const coint = parseInt(coinCustomer) + parseInt(manyCoint);
        await addCoint(email, coint);
        return true;
    }
    return false;
}

/**
 * Memproses notifikasi dari Midtrans dengan logika yang benar.
 * Fungsi ini memastikan status transaksi diperbarui secara akurat berdasarkan
 * `transaction_status` dan `fraud_status`.
 * * @param {object} req - Objek request dari webhook Midtrans.
 */
async function checkStatus(req) {
    try {
        const orderId = req.body.order_id;
        const transactionStatus = req.body.transaction_status;
        const fraudStatus = req.body.fraud_status;

        // Normalisasi status ke huruf kecil agar perbandingan konsisten
        const normalizedStatus = transactionStatus.toLowerCase();
        const normalizedFraudStatus = fraudStatus ? fraudStatus.toLowerCase() : '';

        // 1. KONDISI UTAMA: Transaksi SUKSES
        // Hanya jalankan jika pembayaran sudah 'settlement' (lunas) DAN status fraud 'accept' (aman).
        if (normalizedStatus === 'settlement' && normalizedFraudStatus === 'accept') {
            console.log(`Transaksi ${orderId} berhasil dan aman.`);
            // Update status di database menjadi 'accept' atau 'success'
            await updateTransactionAccepted('accept', orderId);
            // Periksa apakah ini transaksi TopUp
            const isTopUp = await checkNotificationTopUp(orderId, req);

            // Jika bukan TopUp, lanjutkan membuat data 'Learning'
            if (!isTopUp) {
                const transaction = await getTransactionById(orderId);
                if (!transaction || transaction.length === 0) {
                    console.error(`Transaksi dengan order_id ${orderId} tidak ditemukan.`);
                    return;
                }

                // Mencegah duplikasi data learning jika notifikasi datang berkali-kali
                const existingLearning = await getLearningByEmailAndProject(transaction[0].email, transaction[0].course);
                if (existingLearning && existingLearning.length > 0) {
                    console.log(`Learning untuk email ${transaction[0].email} sudah ada. Proses dilewati.`);
                    return;
                }

                // Buat data learning dan activity baru
                const learning = await mappingToLearning(transaction[0]);
                await createNewLearning(learning);
                await createActivity(learning);
            }
        // 2. KONDISI GAGAL: Transaksi GAGAL secara final
        // Ini terjadi jika waktu pembayaran habis (expire) atau dibatalkan (cancel/deny).
        }else if (['cancel', 'deny', 'expire'].includes(normalizedStatus)) {
            console.log(`Transaksi ${orderId} gagal dengan status: ${normalizedStatus}.`);
            await updateTransactionAccepted('failed', orderId); // Update status di DB menjadi 'failed'
        // 3. KONDISI MENUNGGU: Transaksi masih menunggu pembayaran
        // Ini adalah status saat pelanggan memilih metode pembayaran tapi belum membayar.
        }else if (normalizedStatus === 'pending') {
            console.log(`Transaksi ${orderId} sedang menunggu pembayaran.`);
            await updateTransactionAccepted('pending', orderId); // Update status di DB menjadi 'pending'
        // 4. Kondisi lainnya (misal: 'challenge' dari sistem fraud)
        }else {
            console.log(`Menerima status belum ditangani: '${normalizedStatus}' untuk order_id ${orderId}.`);
            // Anda bisa menambahkan status 'challenge' jika perlu
            if (normalizedFraudStatus === 'challenge') {
                await updateTransactionAccepted('challenge', orderId);
            }
        }
    }catch (error) {
        console.error("Terjadi error di fungsi checkStatus:", error.message);
        // Penting: Jangan throw error lagi agar server Midtrans tidak terus-menerus mengirim ulang notifikasi
    }
}


async function notificationService(req){
    try {
        await checkStatus(req);
        console.log("Webhook Body dari Midtrans:", req.body);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            "null",
            HttpStatus.CREATED.message,
        )
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        )
    }
}

module.exports = {
    notificationService,
};