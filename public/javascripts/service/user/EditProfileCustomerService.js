const HttpStatus = require("../../util/HttpStatus");
const APIResponse = require("../../DTO/response/APIResponse");
const {editUser, getUsersByEmail} = require ("../../repo/UserRepo");
const {handleMultipleFilesAndBodyUploadUpdate, saveFile} = require("../../config/MulterConfig");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {mappingResponse} = require("./GetProfileCustomerService")
const {getCustomerByEmail} = require("../../repo/CustomerRepo");

async function change(req, data){
    const user = await getUserByUid(req);
    if (data.isPictureChange){
        const file = await saveFile(data.picture);
        await editUser(user.email, data.body, {picture : file});
    }else {
        await editUser(user.email, data.body, {picture : null});
    }
}

async function mappingResponseEdit(req){
    try {
        const tempUser = await getUserByUid(req);
        const customer = await getCustomerByEmail(tempUser.email);
        const user = await getUsersByEmail(tempUser.email);
        return await mappingResponse(user, customer);
    } catch (error) {
        throw new Error(error.message)
    }
}

async function editProfileUser(req){
    try{
        const body = await handleMultipleFilesAndBodyUploadUpdate(req);
        await change(req, body);
        const data = await mappingResponseEdit(req);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    editProfileUser,
}
