const {mappingResponse} = require("./GetProjectInLerningPathService");
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus")
const {search} = require("../../helper/SearchConfig");

function getHighestStudentData(data) {
    try{
        return data.sort((a, b) => b.student - a.student)[0].student;
    }catch(err){
        throw new Error(err.message);
    }
}

async function searchProjectInLearningPath(req) {
    try{
        console.log(req.params.id + " " + req.body.search);
        const list = await mappingResponse(req.params.id);
        const data = await search(list,
            {keyword : req.body.search, sortBy: 'student'});
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch(error){
        return new APIResponse (
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        );
    }
}

module.exports = {searchProjectInLearningPath}


