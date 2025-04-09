const CoinTransaction = require('../../entity/CoinTransaction');
const HttpStatus = require('../../util/HttpStatus');
const APIResponse = require('../../DTO/response/APIResponse');
const {ID} = require("../../util/UUID");
const {getUserByUid} = require("../../util/AutenticationUtil");
const axios = require("axios");
const {encodeKeyTrans} = require("../../config/MidtransConfig");
const {doToUp} = require("../../repo/TopUpRepo");

async function mapping(req) {
    try {
        const idTransaction = "TopUp_" + ID();
        const user = await getUserByUid(req);
        return new CoinTransaction(
            idTransaction,
            user.email,
            req.body.amount,
            "PEDDING",
        )
    }catch (error) {
        throw new Error(error.message);
    }
}

// DO do TopUp coin customer
async function createTopUpTransaction(req) {
    try {
        const transaction = await mapping(req);
        const price = transaction.amount;
        const data = {
            "transaction_details": {
                order_id: transaction.ID,
                gross_amount: price,
            },
            "item_details": {
                "id": ID(),
                "price": price,
                "quantity": 1,
                "name": "Top Up",
            },
            "customer_details": {
                "email": transaction.email,
            },
        };
        await doToUp(transaction);
        const response = await axios.post(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            data,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Basic ${encodeKeyTrans()}`,
                    "Content-Type": "application/json",
                },
            },
        );
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            response.data,
            HttpStatus.CREATED.message,
        );
    }catch (error) {
        // console.error(error.response.data);
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    createTopUpTransaction,
};