const {updateActivity, getActivityBySyllabus, getActivityById} = require("../../repo/ActivityRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getLearningById} = require("../../repo/LearningRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");
const {parseMultipartForm} = require("../../config/BusboyConfig");

async function mappingActivity(fields, files) {
    try {
        return {
            task: files.task,
            status: true,
            criticism: fields.criticism,
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function mappingResponses(req, idLearning){
    try {
        const emailUser = await getUserByUid(req);
        const activity = await getActivityById(req.params.id);
        const learning = await getLearningById(activity[0].learning);
        const user = await getUsersByEmail(emailUser.email);
        const project = await getProjectById(learning[0].project);
        const syllabus = await getSyllabusByProject(project.ID);
        const data = {
            fullName: user[0].fullName || null,
            materialName: project.materialName || null,
            train: [],
        };
        for (const item of syllabus) {
            const activities = await getActivityBySyllabus(item.ID);
            if (activities.length > 0) {
                data.train.push({
                    trainActivity: {
                        meeting: item.Meeting,
                        materialNameSyllabus: item.MaterialNameSyllabus,
                        status: activities[0].status,
                        IDActivity: activities[0].ID,
                    }});
            }
        }
        return data;
    }catch (error){
        throw new Error(error.message);
    }
}

async function uploadActivity(req) {
    try {
        const { fields, files} = await parseMultipartForm(req);
        const data = await mappingActivity(fields, files);
        await updateActivity(data, req.params.id);
        const dataResponse = await mappingResponses(req);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
             dataResponse,
            HttpStatus.CREATED.message,
        );
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
    uploadActivity,
};
