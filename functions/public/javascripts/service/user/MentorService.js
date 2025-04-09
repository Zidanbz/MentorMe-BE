const HttpStatus = require("../../util/HttpStatus");
const APIResponse = require("../../DTO/response/APIResponse");
const {editUserMentor} = require("../../repo/UserRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const { parseMultipartForm } = require("../../config/BusboyConfig");
const { updateProfile } = require("../../repo/MentorRepo");

class MentorService{
    async extractRequest(req){
        try {
            const dataBodyReq = req.body;
            const dataFile = {
                "cv": dataBodyReq.cv,
                "ktp": dataBodyReq.ktp,
                "picture": dataBodyReq.picture,
            };
            const dataField = {
                "fullName": dataBodyReq.fullName,
                "ability": dataBodyReq.ability,
                "portfolio": dataBodyReq.portfolio,
            };
            return {dataFile, dataField};
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi Utama
    async updateProfile(req){
        try {
            const user = await getUserByUid(req);
            const {fields, files} = await parseMultipartForm(req);
            await updateProfile(user.email, files, fields.ability, fields.portfolio);
            await editUserMentor(user.email, fields.fullName, files.picture);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                "Success",
                HttpStatus.OK.message,
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                error.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }
    }
}

module.exports = MentorService;