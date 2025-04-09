const {registerUser} = require("./RegistrationUserService");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {parseMultipartForm} = require("../../config/BusboyConfig");

const MESSAGES_SUCCESS = "Successfully Registered ADMIN";

function cekError(cek) {
    if (cek.code === HttpStatus.INTERNAL_SERVER_ERROR.code) {
        throw new Error(cek.error);
    }
}

async function newAdmin(req){
    try {
        const { fields, files } = await parseMultipartForm(req);
        const user = await registerUser(fields, {roles: 1, picture: files.picture});
        cekError(user);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            MESSAGES_SUCCESS,
            HttpStatus.CREATED.message,
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
    newAdmin,
};

