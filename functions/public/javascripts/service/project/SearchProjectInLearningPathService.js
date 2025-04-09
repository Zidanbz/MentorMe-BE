const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus")
const {search} = require("../../helper/SearchConfig");
const {getProjectByLearningPath} = require("../../repo/ProjectRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getFileMetadata} = require("../../config/BusboyConfig");

async function mappingResponse(id){
    const data = [];
    try {
        const list = await getProjectByLearningPath(id);
        for (const item of list) {
            const file = await getFileMetadata(item.picture);
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

async function searchProjectInLearningPath(req) {
    try {
        const list = await mappingResponse(req.params.id);
        const data = await search(list,
            {keyword: req.body.search, sortBy: 'student'});
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
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

module.exports = {searchProjectInLearningPath}


