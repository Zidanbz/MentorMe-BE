const {registerUser} = require("./RegistrationUserService");
const {createNewMentor} = require("../../repo/MentorRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const Mentor = require("../../entity/Mentor");
const {ID} = require("../../util/UUID");
const {setPictureUser} = require("../../repo/UserRepo");
const {parseMultipartForm} = require("../../config/BusboyConfig");

// async function saveFile(file){
//     const results = [];
//     for (const fileKey in file) {
//         const result = await saveFiles(file[fileKey]);
//         results.push(result.fileName);
//     }
//     return results;
// }

async function mappingData(req, file){
    try {
        return new Mentor(
            ID(),
            req.email,
            req.fullName,
            file.ktp,
            file.cv,
            req.portfolio,
            req.ability,
            "PENDING",
        );
    }catch (error){
        throw new Error(error.message);
    }
}

function cekError(cek) {
    if (cek.code === HttpStatus.INTERNAL_SERVER_ERROR.code) {
        throw new Error(cek.error);
    }
}

async function newMentor(req){
    try {
        const { fields, files } = await parseMultipartForm(req);
        const user = await registerUser(fields, {roles: 3});
        cekError(user);
        await setPictureUser(fields.email, files.picture);
        const data = await mappingData(fields, files);
        await createNewMentor(data);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
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
    newMentor,
};

