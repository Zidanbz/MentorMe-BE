const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getLearningByProject} = require("../../repo/LearningRepo");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getProjectsByMentor} = require("../../repo/ProjectRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getActivitiesByLearning} = require("../../repo/ActivityRepo");
const {getFileMetadata} = require("../../config/BusboyConfig");

class GetProjectByCustomers{
    async project(user){
        const data = await getProjectsByMentor(user.email);
        const projects = data.map(project => ({
            "picture": project.picture,
                "materialName": project.materialName,
                "ID": project.ID,
        }));
        return projects;
    }

    async extractLearningByProject(project){
        try {
            const learningUser = await getLearningByProject(project);
                return learningUser.map(learning => ({
                    "ID": learning.ID,
                    "email": learning.email,
                }));
        }catch (err){
            throw new Error(err.message);
        }
    }

    async extractActivitiesByLearning(learningUser){
        try {
            const data = await getActivitiesByLearning(learningUser);
            return data.map(activities => ({
                "status": activities.status,
            }));
        }catch (err){
            throw new Error(err.message);
        }
    }

    async extractUser(email){
        try {
            const customer = await getUsersByEmail(email);
            return customer.map(user => ({
                "name": user.fullName,
            }));
        }catch (err) {
            throw new Error(err.message);
        }
    }
    async getDetailsLearn(req){
        try {
            const user = await getUserByUid(req);
            const projects = await this.project(user);
            const data = [];
            for (const value of projects){
                const file = await getFileMetadata(value.picture);
                const learnings = await this.extractLearningByProject(value.ID);
                for (const valueLearning of learnings){
                    const activities = await this.extractActivitiesByLearning(valueLearning.ID);
                    let lessonComplete = 0;
                    let lessonNotComplete = 0;
                    for (const valueActivities of activities){
                        if (valueActivities.status == false) {
                            lessonNotComplete++;
                        }else {
                            lessonComplete++;
                        }
                    }
                    const users = await this.extractUser(valueLearning.email);
                    for (const valueUser of users) {
                        data.push({
                            "ID": valueLearning.ID,
                            "picture": file,
                            "materialName": value.materialName,
                            "fullName": valueUser.name,
                            "lessonComplete": lessonComplete,
                            "lessonNotComplete": lessonNotComplete,
                        });
                    }
                }
            }
            return data;
        }catch (err){
            throw new Error(err.message);
        }
    }

    async getLearning(req){
         try {
             const learn = await this.getDetailsLearn(req);
             return new APIResponse(
                 HttpStatus.OK.code,
                 null,
                 learn,
                 HttpStatus.OK.message,
             );
         }catch (err){
             return new APIResponse(
                 HttpStatus.INTERNAL_SERVER_ERROR.code,
                 err.message,
                 null,
                 HttpStatus.INTERNAL_SERVER_ERROR.message,
             );
         }
    }

    async extractLearningCompleteByProject(project){
        try {
            const learningUser = await getLearningByProject(project);
            // console.log(learningUser);
            return learningUser
                .filter(learning => learning.progress == true)
                .map(learning => ({
                    "ID": learning.ID,
                    "email": learning.email,
                    "progress": learning.progress,
                }));
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async getDetailsLearnComplete(req){
        try {
            const user = await getUserByUid(req);
            const projects = await this.project(user);
            const data = [];
            for (const value of projects){
                const file = await getFileMetadata(value.picture);
                const learnings = await this.extractLearningCompleteByProject(value.ID);
                    for (const valueLearning of learnings){
                        const users = await this.extractUser(valueLearning.email);
                        console.log(valueLearning);
                        for (const valueUser of users) {
                            data.push({
                                "ID": valueLearning.ID,
                                "picture": file,
                                "materialName": value.materialName,
                                "fullName": valueUser.name,
                                "progress": valueLearning.progress,
                            });
                        }
                    }
            }
            return data;
        }catch (err){
            throw new Error(err.message);
        }
    }

    async getLearningComplete(req){
        try {
            const data = await this.getDetailsLearnComplete(req)
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            );
        }catch (err){
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                err.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }
}

module.exports = GetProjectByCustomers;