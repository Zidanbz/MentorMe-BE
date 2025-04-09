const {getSyllabusByProject} = require("../../repo/SyllabusRepo");
const APIResponse =require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");


async function mappingResponse(data){
    try{
        return data.map(({ Meeting, MaterialNameSyllabus, Description, Task }) => ({
            Meeting,
            MaterialNameSyllabus,
            Description,
            Task
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getSyllabusByProjects(req){
    try{
        const temp = await getSyllabusByProject(req.params.id);
        const data = await mappingResponse(temp);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        )
    }
}

module.exports = {
    getSyllabusByProjects
};

