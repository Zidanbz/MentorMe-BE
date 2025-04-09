const {updateVoucher, getVoucherActive} = require('../../repo/VoucherRepo');
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus");
const Voucher = require("../../entity/Voucher")
const {
    checkDate,
    formatVoucherResponse
} = require("./CreateVoucherService");

function mapVoucherData(request, id) {
    const { startTime, endTime, name, piece, info } = request;
    const { startDate, durationDate } = checkDate(startTime, endTime);
    return new Voucher(
        id,
        name,
        piece,
        startDate,
        durationDate,
        true,
        info
    );
}

async function updateVouchers(req){
    try{
        const voucher = mapVoucherData(req.body, req.params.id);
        await updateVoucher(req.params.id, voucher);
        const activeVouchers = await getVoucherActive();
        const formattedResponse = formatVoucherResponse(activeVouchers);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            formattedResponse,
            HttpStatus.OK.message,
        )
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        )
    }
}

module.exports = {
    updateVouchers
};