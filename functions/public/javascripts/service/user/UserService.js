const {getMentorRejected} = require("../../repo/MentorRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getFileMetadata} = require("../../config/BusboyConfig");

class UserService {
    async mappingResponse(user, mentor) {
        try {
            const fileCV = await getFileMetadata(mentor.cv);
            const fileKtp = await getFileMetadata(mentor.ktp);
            const filePicture = await getFileMetadata(user[0].picture);

            return {
                ID: mentor.ID,
                fullName: user.fullName,
                email: mentor.email,
                cv: fileCV,
                ktp: fileKtp,
                picture: filePicture,
                portfolio: mentor.linkPortfolio,
                ability: mentor.about,
                status: mentor.status,
            };
        }catch (error){
            throw new Error(error.message);
        }
    }

    // Fungsi Utama
    async getMentorReject() {
        try {
            const mentor = await getMentorRejected();
            const data = [];
            for (const value of mentor){
                const user = await getUsersByEmail(value.email);
                const dataTemp = await this.mappingResponse(user, value);
                data.push(dataTemp);
            }
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            )
        }catch (error) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                error.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            )
        }
    }
}

module.exports = UserService;