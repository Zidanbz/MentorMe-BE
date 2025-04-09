const {updateActivity, getActivityBySyllabus, getActivityById} = require("../../repo/ActivityRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {saveFiles, handleMultipleFilesAndBodyUpload} = require("../../config/MulterConfig");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getLearningById} = require("../../repo/LearningRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");

async function mappingActivity(body, files){
    try{
        const file = await saveFiles(files);
        const fileName = file.fileName;
        return {
            task: fileName,
            status: true,
            criticism: body.criticism
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function mappingResponses(req, idLearning){
    try{
        const emailUser = await getUserByUid(req);
        const activity = await getActivityById(req.params.id);
        console.log(activity);
        const learning = await getLearningById(activity[0].learning);
        console.log(learning);
        const user = await getUsersByEmail(emailUser.email);
        const project = await getProjectById(learning[0].project);
        console.log(project);
        const syllabus = await getSyllabusByProject(project.ID);
        const data = {
            fullName: user[0]?.fullName || null,
            materialName: project.materialName || null,
            train: []
        };
        for (const item of syllabus) {
            const activities = await getActivityBySyllabus(item.ID);
            if (activities.length > 0) {
                data.train.push({
                    trainActivity: {
                        meeting: item.Meeting,
                        materialNameSyllabus: item.MaterialNameSyllabus,
                        status: activities[0].status,
                        IDActivity: activities[0].ID
                    }
                });
            }
        }
        return data;
    }catch (error){
        throw new Error(error.message);
    }
}

async function uploadActivity(req){
    try{
        const {files, body} = await handleMultipleFilesAndBodyUpload(req);
        const dataResponse = await mappingResponses(req);
        const data = await mappingActivity(body, files[0]);
        await updateActivity(data, req.params.id);
        return new APIResponse (
            HttpStatus.CREATED.code,
            null,
            dataResponse,
            HttpStatus.CREATED.message,
        );
    }catch (error){
        return new APIResponse (
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    uploadActivity
};
