// const CoinTransaction = require('../../entity/CoinTransaction');
const HttpStatus = require('../../util/HttpStatus');
const APIResponse = require('../../DTO/response/APIResponse');
// const {getUserByUid} = require("../../util/AutenticationUtil");
// const {doToUp} = require("../../repo/TopUpRepo");

async function handlePaymentNotification(notification) {
    try {
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            notification,
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    handlePaymentNotification,
}