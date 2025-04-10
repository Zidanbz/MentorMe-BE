const {getLearningByUser, getLearningByProject} = require("../../repo/LearningRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getFileMetadata} = require("../../config/BusboyConfig");

async function countStudentInLearn(ID){
    try {
        const count = await getLearningByProject(ID);
        return count.length === 0 ? 0 : count.length;
    }catch (error) {
        throw new Error(error.message);
    }
}

async function mappingResponse(req){
    try {
        const email = await getUserByUid(req);
        const learning = await getLearningByUser(email.email);
        const data = {
            learning: [],
        }
        for (const value of learning){
            const project = await getProjectById(value.project);
            const file = await getFileMetadata(project.picture);
            const count = await countStudentInLearn(project.ID);
            data.learning.push({
                // "ID": value.ID,
               "IDProject": project.ID,
                "progress": value.progress,
                "project": {
                   materialName: project.materialName,
                    picture: file,
                    student: count,
                },
            });
        }
        return data;
    }catch (err) {
        throw new Error(err.message);
    }
}

async function getLearningsUser(req){
    try {
        const data = await mappingResponse(req);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        )
    }catch (error){
        return new APIResponse(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          error.message,
          null,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    getLearningsUser,
}
