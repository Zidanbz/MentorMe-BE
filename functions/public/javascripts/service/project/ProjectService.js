const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUsersByEmail} = require("../../repo/UserRepo");
const {getProjectsByMentor, getProjectReject, getProjectPending} = require("../../repo/ProjectRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const { generatePublicUrl} = require("../../config/BusboyConfig");

class ProjectService{
    async transformData(listProject, listLearning){
        const results = [];
        for (const item of listProject) {
            const filePicture = generatePublicUrl(item.picture);
            for (const mentor of await getUsersByEmail(item.mentor)) {
                results.push({
                    ID: item.ID,
                    materialName: item.materialName,
                    student: 0,
                    price: item.price,
                    picture: filePicture,
                    mentor: mentor.fullName,
                    status: item.status,
                    learningMethod: item.learningMethod,
                });
            }
        }
        return results;
    }

    async extractProject(req){
        try {
            const user = await getUserByUid(req);
            const listProject = await getProjectsByMentor(user.email);
            return listProject
                .filter(data => data.status.includes("ACCEPTED"))
                .map(item => ({
                    "ID": item.ID,
                    "materialName": item.materialName,
                    "price": item.price,
                    "picture": item.picture,
                    "mentor": item.mentor,
                    "status": item.status,
                    "learningMethod": item.learningMethod,
                }));
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // fungsi Utama
    async getLearningAccepted(req){
        try {
            const list = await this.extractProject(req);
            const data = await this.transformData(list);
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

    async extractProjectRejected(){
        try {
            const listProject = await getProjectReject();
            return listProject
                .map(item => ({
                    "ID": item.ID,
                    "materialName": item.materialName,
                    "price": item.price,
                    "picture": item.picture,
                    "mentor": item.mentor,
                    "status": item.status,
                    "learningMethod": item.learningMethod,
                }));
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi Utama
    async getProjectRejected(){
        try {
            const list = await this.extractProjectRejected();
            const data = await this.transformData(list);
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

    async mappingResponseToProjectPendingByMentor(mentor){
        const data = [];
        try {
            const list = await getProjectPending();
            for (const item of list) {
                if (item.mentor == mentor) {
                    const filePicture = generatePublicUrl(item.picture);
                    const user = await getUsersByEmail(item.mentor);
                    const fullName = user.map(users => users.fullName)[0];
                    data.push({
                        ID: item.ID,
                        materialName: item.materialName,
                        fullName: fullName,
                        picture: filePicture,
                        student: 0,
                        price: item.price,
                        status: item.status,
                        learningMethod: item.learningMethod,
                    })
                }
            }
            return data
        }catch (error){
            throw new Error(error.message);
        }
    }

    async getProjectPendingByMentor(req){
        try {
            const user = await getUserByUid(req);
            let data = await this.mappingResponseToProjectPendingByMentor(user.email);
            if (data == null || data.length == 0) {
                data = "Tidak ada project yang di pending"
            }
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            )
        }catch (error){
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                error.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            )
        }
    }

    async extractProjectRejectedForMentor(mentor){
        try {
            const listProject = await getProjectReject();
            return listProject
                .filter(p => p.mentor == mentor)
                .map(item => ({
                    "ID": item.ID,
                    "materialName": item.materialName,
                    "price": item.price,
                    "picture": item.picture,
                    "mentor": item.mentor,
                    "status": item.status,
                    "learningMethod": item.learningMethod,
                }));
        }catch (err) {
            throw new Error(err.message);
        }
    }

    // Fungsi Utama
    async getProjectRejectedForMentor(req){
        try {
            const user = await getUserByUid(req);
            const list = await this.extractProjectRejectedForMentor(user.email);
            const data = await this.transformData(list);
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
}

module.exports = ProjectService;