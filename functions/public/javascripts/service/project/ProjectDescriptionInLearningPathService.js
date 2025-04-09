const {getProjectById} = require("../../repo/ProjectRepo");
const {getMentorByProject} = require("../../repo/MentorRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus")
const {getFileMetadata} = require("../../config/BusboyConfig")

function isEmptyProjectSelected(dataProject){
    if (dataProject === undefined || dataProject === null) {
        throw new Error("No project selected");
    }
}

async function getDescriptionInLearningPath(req){
    try {
        const dataProject = await getProjectById(req.params.id);
        isEmptyProjectSelected(dataProject.ID);
        const dataMentor = await getMentorByProject(dataProject.mentor);
        const file = await getFileMetadata(dataMentor.picture);
        const data = {
            "ID": dataProject.ID,
            "info": dataProject.info,
            "picture": file,
            "fullName": dataMentor.fullName,
            "about": dataMentor.about,
            "linkVideo": dataProject.linkVideo,
            "student": 50,
            "price": dataProject.price,
        }
        return new APIResponse(
            HttpStatus.OK.message,
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

module.exports = {getDescriptionInLearningPath}