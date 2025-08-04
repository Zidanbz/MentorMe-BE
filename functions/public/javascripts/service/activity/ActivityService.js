const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getActivitiesByLearning, report} = require("../../repo/ActivityRepo");
const {getLearningById} = require("../../repo/LearningRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
const {parseMultipartForm} = require("../../config/BusboyConfig");

class ActivityService{
    async extractLearning(req){
        try {
            const learningTemp = await getLearningById(req.params.id);
            return await Promise.all(learningTemp.map(async data => {
                const user = await getUsersByEmail(data.email);
                const tempUser = user.map(value => ({
                    "fullName": value.fullName,
                }));
                return {
                    ID: data.ID,
                    email: data.email,
                    project: data.project,
                    user: tempUser[0].fullName,
                };
            }));
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async responseForReport(req){
        try {
            const learning = await this.extractLearning(req);
            const learn = learning[0];
            const nameProject = await getProjectById(learn.project);
            console.log(nameProject.materialName);
            const data = {
                "fullName": learn.user,
                "materialName": nameProject.materialName,
                "train": [],
            }
            const activities = await getActivitiesByLearning(learn.ID);
            let i = 0;
            for (const activity of activities) {
                i++;
                data.train.push({
                    "meeting": "Pertemuan " + i,
                    "statusReport": activity.statusReport,
                    "IDActivity": activity.ID,
                    "documentasi": activity.documentasi,
                    "activity": activity.activity,
                });
            }
            return data;
        }catch (err){
            throw new Error(err.message);
        }
    }

    // Fungsi Utama
    async getActivitiForReport(req){
        try {
            const data = await this.responseForReport(req);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                err.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }

    // Fungsi Utama
    async doReport(req){
        try {
            const { fields, files} = await parseMultipartForm(req);
            const data = {
                "documentasi": files.documentasi,
                "activity": fields.activity,
            }
            await report(data, req.params.id);
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                "Success",
                HttpStatus.OK.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                err.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }
}

module.exports = ActivityService;