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

async function checkStatus(req){
    try {
        const orderId = req.body.order_id;
        const transactionStatus = req.body.transaction_status; // Status transaksi dari Midtrans
        // Hanya lanjutkan jika statusnya settlement atau success
        if (transactionStatus === 'settlement' || transactionStatus === 'success') {
            const isAccept = req.body.fraud_status;
            const topUp = await checkNotificationTopUp(orderId, req);
            const transaction = await getTransactionById(orderId);

            await updateTransactionAccepted(isAccept, orderId); // Update status transaksi sebagai diterima
            if (!topUp) {
                const existingLearning = await getLearningByEmailAndProject(transaction[0].email, transaction[0].course);
                if (existingLearning && existingLearning.length > 0) {
                    console.log(`Learning already exists for email: ${transaction[0].email}`);
                    return;
                }
                const learning = await mappingToLearning(transaction[0]);
                await createNewLearning(learning); // Hanya create learning setelah pembayaran sukses
                await createActivity(learning); // Create activity setelah learning selesai dibuat
            }
        }else {
            console.log(`Transaction with order_id ${orderId} is not successful. Skipping creation.`);
            await updateTransactionAccepted('failed', orderId); // Update status transaksi jika gagal
        }
    }catch (error) {
        throw new Error(error.message);
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