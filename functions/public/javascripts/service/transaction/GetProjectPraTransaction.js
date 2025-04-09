const {getProjectById} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");

async function totalSyllabus(projectId) {
    try {
        const syllabus = await getSyllabusByProject(projectId);
        return syllabus.length;
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectPraTransaction(req){
    try {
        const project = await getProjectById(req.params.id);
        const syllabus = await totalSyllabus(req.params.id);
        const data = {
            "materialName": project.materialName,
            "syllabus": syllabus,
            "price": project.price,
        }
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
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
    getProjectPraTransaction,
}

