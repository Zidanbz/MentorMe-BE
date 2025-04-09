const {createNewVoucher, getVoucherActive} = require('../../repo/VoucherRepo');
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus");
const Voucher = require("../../entity/Voucher")
const {ID} = require("../../util/UUID")

function calculateDate(baseTime, offsetDays) {
    const date = new Date(baseTime);
    date.setDate(date.getDate() + offsetDays);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

function validateVoucherDates(startDate, durationDate) {
    if (startDate > durationDate) {
        throw new Error("Create new voucher failed");
    }
}

function checkDate(startTimeOffset, durationOffset) {
    const startDate = calculateDate(new Date(), startTimeOffset);
    const durationDate = calculateDate(startDate, durationOffset);

    validateVoucherDates(startDate, durationDate);

    return { startDate, durationDate };
}

function mapVoucherData(request) {
    const { startTime, endTime, name, piece, info } = request;
    const { startDate, durationDate } = checkDate(startTime, endTime);

    return new Voucher(
        ID(),
        name,
        piece,
        startDate,
        durationDate,
        true, // Active by default
        info
    );
}

function formatVoucherResponse(vouchers) {
    return vouchers
        .filter(voucher => voucher.status === true)
        .map(({ status, dateStart, dateEnd, ...rest }) => ({
            ...rest,
            dateStart: new Date(dateStart._seconds * 1000).toISOString(),
            dateEnd: new Date(dateEnd._seconds * 1000).toISOString(),
        }));
}

async function createVoucher(req) {
    try {
        const voucher = mapVoucherData(req.body);
        await createNewVoucher(voucher);
        const activeVouchers = await getVoucherActive();
        const formattedResponse = formatVoucherResponse(activeVouchers);

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            formattedResponse,
            HttpStatus.CREATED.message
        );
    } catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message
        );
    }
}
module.exports = {
    createVoucher,
    checkDate,
    formatVoucherResponse
}