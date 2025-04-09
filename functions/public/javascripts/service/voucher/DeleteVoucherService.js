const {deleteVoucher: deleteVoucherService} = require('../../repo/VoucherRepo');
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus");

async function deleteVouchers(request) {
    try {
        await deleteVoucherService(request.params.id);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            "Delete Success",
            HttpStatus.OK.message,
        );
    }catch (error){
        return new APIResponse(
          HttpStatus.BAD_REQUEST.code,
          error.message,
          null,
          HttpStatus.BAD_REQUEST.message,
        );
    }
}

module.exports = {
    deleteVouchers,
}