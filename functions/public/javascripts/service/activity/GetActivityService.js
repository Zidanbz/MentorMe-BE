const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getActivityBySyllabus} = require("../../repo/ActivityRepo");
const {getLearningById} = require("../../repo/LearningRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getProjectById} = require("../../repo/ProjectRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");
const {generatePublicUrl} = require("../../config/BusboyConfig");

async function mappingResponse(req) {
    try {
        const emailUser = await getUserByUid(req);
        const learning = await getLearningById(req.params.id);
        const user = await getUsersByEmail(emailUser.email);
        const project = await getProjectById(learning[0].project);
        const syllabus = await getSyllabusByProject(project.ID);
        const mentor = await getUsersByEmail(project.mentor);
        const filePicture = generatePublicUrl(mentor[0].picture);
        const data = {
            fullName: user[0].fullName || null,
            materialName: project.materialName || null,
            mentor: mentor[0].email || null,
            picture: filePicture,
            train: [],
        };
        for (const item of syllabus) {
            // Ambil aktivitas berdasarkan syllabus ID dan learning ID
            const activities = await getActivityBySyllabus(item.ID, learning[0].ID);
            // Jika ada aktivitas yang ditemukan, tambahkan ke array train
            if (activities.length > 0) {
                activities.forEach(activity => {
                    data.train.push({
                        trainActivity: {
                            meeting: item.Meeting, // Pertemuan yang sesuai
                            materialNameSyllabus: item.MaterialNameSyllabus, // Nama materi syllabus
                            status: activity.status, // Status aktivitas
                            IDActivity: activity.ID, // ID aktivitas
                            task: activity.task, // Tugas yang harus dilakukan
                            criticism: activity.criticism, // Kritik dan saran
                        },
                    });
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
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    getMyActivity,
}