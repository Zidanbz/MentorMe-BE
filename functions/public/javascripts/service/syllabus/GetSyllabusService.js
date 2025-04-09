const {getSyllabusByProject, getDetailSyllabusById} = require("../../repo/SyllabusRepo");
const APIResponse =require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");


async function mappingResponse(data){
    try {
        return data.map(({ ID, Meeting, MaterialNameSyllabus, Description, Task, MaterialName }) => ({
            SyllabusId: ID,
            MaterialName,
            Meeting,
            MaterialNameSyllabus,
            Description,
            Task,
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getSyllabusByProjects(req){
    try {
        const temp = await getSyllabusByProject(req.params.id);
        const data = await mappingResponse(temp);
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
        )
    }
}

async function mappingResponsee(data) {
    try {
        return {
            // SyllabusId: data.ID,
            Meeting: data.Meeting,
            MaterialNameSyllabus: data.MaterialNameSyllabus,
            Description: data.Description,
            Task: data.Task,
        };
    }catch (error) {
     throw new Error(error.message);
    }
}

async function getDetailSyllabus(req) {
       try {
        const temp = await getDetailSyllabusById(req.params.id);
        const data = await mappingResponsee(temp);
        console.log(temp);
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
        )
    }
}

module.exports = {
    getSyllabusByProjects,
    getDetailSyllabus,
};

