const {getLearningPathByCategory} = require("../../repo/LearningPathRepo");
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus");
const {getFile} = require("../../config/MulterConfig")

function checkEmpty(data){
    if(data === undefined || data === null){
        throw new Error(`Data not found: ${data}`);
    }
}

async function mappingResponse(data){
    checkEmpty(data);
    const objectResponse = [];
    for (const item of data) {
        const picture = await getFile(item.picture);
        const dataItem = {
            ID: item.ID,
            name: item.name,
            student: 20,
            picture: picture,
        }
        objectResponse.push(dataItem);
    }
    return objectResponse;
}

async function getLearningPathByCategories(req){
    try{
        const tempData = await getLearningPathByCategory(req.params.id);
        const data = await mappingResponse(tempData);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message
        )
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        );
    }
}

module.exports = {getLearningPathByCategories}