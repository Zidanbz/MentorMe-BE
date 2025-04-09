const {createNewProject, getProjectsByMentor} = require ("../../repo/ProjectRepo");
const Project = require("../../entity/Project");
const {ID} = require("../../util/UUID");
const {getUserByUid} = require("../../util/AutenticationUtil")
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getFile, handleFileAndBodyUpload, saveFile} = require ("../../config/MulterConfig")
const {getLearningPathByName} = require("../../repo/LearningPathRepo")
const {getUsersByEmail} = require("../../repo/UserRepo");

function cekLearningPath(learningPath) {
    if(learningPath == null || learningPath.length === 0) {
        throw new Error("LearningPath doesn't exist");
    }
    return true;
}

async function mappingProject (request){
    try{
        const handlingRequest = await handleFileAndBodyUpload(request);
        const objectProject = new Project();
        const req = handlingRequest.data;
        const learningPath = await getLearningPathByName(req.learningPath);
        cekLearningPath(learningPath);
        const email = await getUserByUid(request);
        const filename = await saveFile(handlingRequest.tempFile);

        objectProject.setID(ID());
        objectProject.setCoinFree(500);
        objectProject.setMaterialName(req.materialName);
        objectProject.setInfo(req.info);
        objectProject.setLinkVideo(req.linkVideo);
        objectProject.setPrice(req.price);
        objectProject.setPicture(filename);
        objectProject.setLearningPath(learningPath.ID);
        objectProject.setMentor(email.email);

        return objectProject;
    }catch (error) {
        throw new Error(error.message);
    }

}

async function transformData (listProject, listLearning) {
        // return listProject.map(async (item) => {
        //     // Hitung jumlah transaksi untuk setiap project
        //     // const studentCount = listLearning.filter(
        //     //     (transaction) => transaction.project === item.ID
        //     // ).length;
        //     const filePicture = await getFile(item.picture);
        //     // Struktur data sesuai permintaan
        //     return {
        //         id: item.ID,
        //         materialName: item.materialName,
        //         student: 0,
        //         price: filePicture,
        //         picture: item.picture,
        //     };
        // });
    return await Promise.all(
        listProject.map(async (item) => {
            const filePicture = await getFile(item.picture);
            return {
                id: item.ID,
                materialName: item.materialName,
                student: 0,
                price: filePicture,
                picture: item.picture,
            };
        })
    );
}

/**
 *
 * @param req request dari frond end yang ber isi object dan header
 * @returns {Promise<APIResponse>}
 * fungsi utama untuk menambahkan project
 */
async function createProject(req) {
    try{
        const mapProject = await mappingProject(req);
        await createNewProject(await mapProject);

        const user = await getUserByUid(req);
        const temp = await getProjectsByMentor(user.email);
        const data = await transformData(temp);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data,
            HttpStatus.CREATED.message
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.CREATED.message
        );
    }
}

module.exports = {createProject};