const {registerUser} = require("./RegistrationUserService");
const {createNewMentor} = require("../../repo/MentorRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus  = require("../../util/HttpStatus")
const {handleMultipleFilesAndBodyUpload, saveFiles} = require("../../config/MulterConfig");
const Mentor = require("../../entity/Mentor")
const {ID} = require("../../util/UUID")
const {setPictureUser} = require("../../repo/UserRepo")

async function saveFile(file){
    const results = [];
    for (const fileKey in file) {
        const result = await saveFiles(file[fileKey]);
        results.push(result.fileName);
    }
    return results;
}

async function mappingData(req, file){
    try{
        return new Mentor(
            ID(),
            req.email,
            file[1],
            file[0],
            req.portfolio,
            req.ability,
        );
    }catch (error){
        throw new Error(error.message);
    }
}

function cekError(cek){
    if(cek.code === HttpStatus.INTERNAL_SERVER_ERROR.code){
        throw new Error(cek.error);
    }
}

async function newMentor(req){
    try{
        const request = await handleMultipleFilesAndBodyUpload(req);
        const user = await registerUser(request.body, {roles: 3});
        cekError(user);
        const file = await saveFile(request.files);
        await setPictureUser(request.body.email, file[2]);
        const data = await mappingData(request.body, file);
        await createNewMentor(data);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            null,
            HttpStatus.CREATED.message,
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        );
    }
}

module.exports = {
    newMentor
};

