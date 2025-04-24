const {getProjectPending} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUsersByEmail} = require("../../repo/UserRepo");
const { generatePublicUrl} = require("../../config/BusboyConfig");
const { getMentorByEmail } = require("../../repo/MentorRepo");

async function mappingResponse(){
    const data = [];
    try {
        const list = await getProjectPending();
        for (const item of list) {
            const filePicture = generatePublicUrl(item.picture);
            const user = await getUsersByEmail(item.mentor);
            const mentor = await getMentorByEmail(item.mentor);
            const fullName = user.map(users => users.fullName)[0];
            const about = mentor.map(users => users.about)[0];
            data.push({
                ID: item.ID,
                materialName: item.materialName,
                fullName: fullName,
                about: about,
                picture: filePicture,
                student: 0,
                price: item.price,
                linkVideo: item.linkVideo,
                status: item.status,
                learningMethod: item.learningMethod,
            })
        }
        return data
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectPendings(){
    try {
        const data = await mappingResponse();
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        )
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        )
    }
}

module.exports = {
    getProjectPendings,
}