const {getAllProject} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getFileMetadata} = require("../../config/BusboyConfig");
const {getUsersByEmail} = require("../../repo/UserRepo");

async function transformData(listProject, listLearning) {
    const results = [];
    for (const item of listProject) {
        if (item.status !== 'ACCEPTED')continue; // hanya terima status "ACCEPTED"
        const filePicture = await getFileMetadata(item.picture);
        const mentor = await getUsersByEmail(item.mentor);
            results.push({
                ID: item.ID,
                materialName: item.materialName,
                student: 0,
                price: item.price,
                mentor: mentor[0].fullName,
                picture: filePicture,
                status: item.status ? item.status : "ACCEPTED",
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
async function getAllProjectService() {
    try {
        const list = await getAllProject();
        const data = await transformData(list);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data,
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
    getAllProjectService,
}