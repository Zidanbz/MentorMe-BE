const {getProjectByLearningPath} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getFile} = require("../../config/MulterConfig");
const {getUsersByEmail} = require("../../repo/UserRepo")

async function mappingResponse(id){
    const  data = [];
    try{
        const list = await getProjectByLearningPath(id);
        for (const item of list) {
            const file = await getFile(item.picture);
            const user = await getUsersByEmail(item.mentor);
            const fullName = user.map(users => users.fullName)[0];
            data.push({
                ID: item.ID,
                materialName: item.materialName,
                fullName: fullName,
                picture: file,
                student: 0,
                price: item.price,
            })
        }
        return data
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectInLearningPath(req){
    try{
        const data = await mappingResponse(req.params.id);
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
            HttpStatus.BAD_REQUEST.message
        )
    }
}

module.exports = {
    getProjectInLearningPath,
    mappingResponse,
};