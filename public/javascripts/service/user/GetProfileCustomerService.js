const {getCustomerByEmail} = require("../../repo/CustomerRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus")
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getFile} = require("../../config/MulterConfig")

async function mappingResponse(dataUser, dataCustomer){
    try{
        const objectDataUser = dataUser.length ? dataUser[0] : null;
        const objectDataCustomer = dataCustomer.length ? dataCustomer[0] : null;
        const file = objectDataUser.picture ? await getFile(objectDataUser.picture) : "No Picture";
        return {
            fullName: objectDataUser.fullName,
            picture: file,
            phone: objectDataUser.phone,
            email: objectDataUser.email,
            status: objectDataCustomer.status,
            job: objectDataCustomer.job,
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCustomer(req){
    try{
        const tempUser = await getUserByUid(req);
        const customer = await getCustomerByEmail(tempUser.email);
        const user = await getUsersByEmail(tempUser.email);
        const data = await mappingResponse(user, customer);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message
        )
    }catch(error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        )
    }
}

module.exports = {
    getCustomer,
    mappingResponse
}