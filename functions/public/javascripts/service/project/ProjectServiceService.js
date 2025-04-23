const {createNewProject} = require("../../repo/ProjectRepo");
const Project = require("../../entity/Project");
const {ID} = require("../../util/UUID");
const {getUserByUid} = require("../../util/AutenticationUtil")
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getLearningPathByName} = require("../../repo/LearningPathRepo")
const {parseMultipartForm, generatePublicUrl} = require("../../config/BusboyConfig");

function cekLearningPath(learningPath) {
    if (learningPath == null || learningPath.length === 0) {
        throw new Error("LearningPath doesn't exist");
    }
    return true;
}

// async function mappingProject(request) {
//     try {
//         const handlingRequest = await handleFileAndBodyUpload(request);
//         const objectProject = new Project();
//         const req = handlingRequest.data;
//         const learningPath = await getLearningPathByName(req.learningPath);
//         cekLearningPath(learningPath);
//         const email = await getUserByUid(request);
//         const filename = await saveFile(handlingRequest.tempFile);
//
//         objectProject.setID(ID());
//         objectProject.setCoinFree(500);
//         objectProject.setMaterialName(req.materialName);
//         objectProject.setInfo(req.info);
//         objectProject.setLinkVideo(req.linkVideo);
//         objectProject.setPrice(req.price);
//         objectProject.setPicture(filename);
//         objectProject.setLearningPath(learningPath.ID);
//         objectProject.setMentor(email.email);
//
//         return objectProject;
//     }catch (error) {
//         throw new Error(error.message);
//     }
// }

async function mappingProject(fields, files, req) {
    try {
        // const handlingRequest = await handleFileAndBodyUpload(request);
        const objectProject = new Project();
        // const req = handlingRequest.data;
        const learningPath = await getLearningPathByName(fields.learningPath);
        cekLearningPath(learningPath);
        const email = await getUserByUid(req);
        // const filename = await saveFile(handlingRequest.tempFile);

        objectProject.setID(ID());
        objectProject.setCoinFree(500);
        objectProject.setMaterialName(fields.materialName);
        objectProject.setInfo(fields.info);
        objectProject.setLinkVideo(fields.linkVideo);
        objectProject.setPrice(fields.price);
        objectProject.setPicture(files.picture);
        objectProject.setLearningPath(learningPath.ID);
        objectProject.setMentor(email.email);
        objectProject.setStatus("PENDING");

        return objectProject;
    }catch (error) {
        throw new Error(error.message);
    }
}

// async function transformData(listProject, listLearning) {
//     return await Promise.all(
//         listProject.map(async item => {
//             const filePicture = await getFile(item.picture);
//             return {
//                 id: item.ID,
//                 materialName: item.materialName,
//                 student: 0,
//                 price: filePicture,
//                 picture: item.picture,
//             }; // Tidak perlu trailing comma pada objek karena ini adalah objek satu baris.
//         }) // Koma ini ditambahkan setelah elemen terakhir dalam array.
//     );
// }

// async function transformData(listProject, listLearning) {
//     const results = [];
//     for (const item of listProject) {
//         const filePicture = await getFile(item.picture);
//         results.push({
//             id: item.ID,
//             materialName: item.materialName,
//             student: 0,
//             price: filePicture,
//             picture: item.picture,
//         });
//     }
//     return results;
// }

async function transformData(listProject) {
    const results = [];
    for (const item of listProject) {
        const filePicture = generatePublicUrl(item.picture);
        results.push({
            id: item.ID,
            materialName: item.materialName,
            student: 0,
            price: item.price,
            learningPath: item.learningPath,
            picture: filePicture,
        });
    }
    return results;
}

/**
 *
 * @param req request dari frond end yang ber isi object dan header
 * @returns {Promise<APIResponse>}
 * fungsi utama untuk menambahkan project
 */
async function createProject(req) {
    try {
        const { fields, files} = await parseMultipartForm(req);
        const mapProject = await mappingProject(fields, files, req);

        await createNewProject(mapProject);
        // const user = await getUserByUid(req);
        // const temp = await getProjectsByMentor(mapProject.mentor);
        const data = await transformData([mapProject]);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data[0],
            HttpStatus.CREATED.message,
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.CREATED.message,
        );
    }
}

module.exports = {
    createProject,
};