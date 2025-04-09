const {getVoucherActive} = require("../../repo/VoucherRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

function formatVoucherResponse(vouchers) {
    return vouchers
        .filter(voucher => voucher.status === true)
        .map(({ status, dateStart, dateEnd, ...rest }) => ({
            ...rest,
            dateStart: new Date(dateStart._seconds * 1000).toISOString(),
            dateEnd: new Date(dateEnd._seconds * 1000).toISOString(),
        }));
}

async function listVoucherActive(){
    try{
        const formatedResponse = formatVoucherResponse(await getVoucherActive());
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            formatedResponse,
            HttpStatus.CREATED.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        )
    }
}

module.exports = {
    listVoucherActive
}