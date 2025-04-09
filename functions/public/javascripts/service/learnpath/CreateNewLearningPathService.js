const {saveLearningPath, getAllLearningPath} = require("../../repo/LearningPathRepo")
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus")
const LearningPath = require("../../entity/LearningPath")
const {ID} = require("../../util/UUID")
const {getCategoryByName} = require("../../repo/CategoryRepo")
const {getFileMetadata, parseMultipartForm} = require("../../config/BusboyConfig");

async function isDuplicates(condition, name) {
    if (condition) {
        throw new Error(`Learning Path With Name ${name} Is Already Existed`)
    }
    return true;
}

async function checkNameDuplicate(name) {
    try {
        const listLearningPath = await getAllLearningPath();
        const isDuplicate = listLearningPath.some(
            learningPath => learningPath.name === name);
        await isDuplicates(isDuplicate, name);
        return true;
    }catch (error){
        throw new Error(error.message);
    }
}

async function mapping(req){
    try {
        const {fields, files} = await parseMultipartForm(req);
        await checkNameDuplicate(fields.name);
        const category = await getCategoryByName(fields.categories);
        const ids = category[0].ID;
        return new LearningPath(
            ID(),
            ids,
            fields.name,
            files.picture,
        );
    }catch (error){
        throw new Error(error.message);
    }
}

async function mappingResponse(){
    const data = [];
    try {
        await getAllLearningPath().then(async learn => {
            for (const item of learn) {
                const file = await getFileMetadata(item.picture);
                data.push({
                    ID: item.ID,
                    name: item.name,
                    students: 500,
                    picture: file,
                });
            }
        });
        return data;
    }catch (error){
        throw new Error(error.message);
    }
}

async function createNewLearningPath(req){
    try {
        const tempLearningPath = await mapping(req);
        console.log(tempLearningPath);
        await saveLearningPath(tempLearningPath);
        console.log("sampai");
        const tempResponse = await mappingResponse();
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            tempResponse,
            HttpStatus.CREATED.message,
        )
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
    createNewLearningPath,
}