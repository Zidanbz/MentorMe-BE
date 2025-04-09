const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getHistoryTransactionByEmailCustomer} = require("../../repo/TransactionalRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getCoinCustomerByEmail} = require("../../repo/CustomerRepo");

async function mapping(req) {
    try {
        const user = await getUserByUid(req);
        const listTransaction = await getHistoryTransactionByEmailCustomer(user.email);
        const list = [];

        for (const transaction of listTransaction) {
            if (transaction.ID.startsWith("TopUp")) {
                list.push(transaction);
            }
        }

        const formattedList = list.map(({ createdAt, ...rest }) => ({
            ...rest,
            createdAt: new Date(createdAt._seconds * 1000).toISOString(),
        }));

        return response(user.email, formattedList);
    }catch (error) {
        throw new Error(error.message);
    }
}

async function response(email, list) {
    try {
        const coint = await getCoinCustomerByEmail(email);
        console.log(coint[0].coin);
        const data = [];

        for (const dataTopUp of list) {
            const topUp = {
                amountCoin: dataTopUp.amount * 1000,
                price: dataTopUp.amount,
                date: dataTopUp.createdAt,
            };
            data.push(topUp);
        }
        return {
            coin: coint[0].coin,
            topUp: data,
        }
    }catch (error) {
        throw new Error(error.message);
    }
}

async function getHistoryTopUpService(req) {
    try {
        const data = await mapping(req);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}

module.exports = {
    getHistoryTopUpService,
}