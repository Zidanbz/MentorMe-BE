const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getActivityBySyllabus} = require("../../repo/ActivityRepo");
const {getLearningById} = require("../../repo/LearningRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getProjectById} = require("../../repo/ProjectRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");

async function mappingResponse(req){
    try{
        const emailUser = await getUserByUid(req);
        const learning = await getLearningById(req.params.id);
        const user = await getUsersByEmail(emailUser.email);
        const project = await getProjectById(learning[0].project);
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

async function getMyActivity(req){
    try {
        const data = await mappingResponse(req);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message
        );
    }
}

module.exports = {
    getMyActivity
}