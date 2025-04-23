const {deleteProject, getProjectsByMentor} = require("../../repo/ProjectRepo");
const {getUserByUid} = require("../../util/AutenticationUtil")
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const { generatePublicUrl} = require("../../config/BusboyConfig");

async function transformData(listProject, listLearning) {
    const results = [];
    for (const item of listProject) {
        const filePicture = generatePublicUrl(item.picture);
        results.push({
            id: item.ID,
            materialName: item.materialName,
            student: 0,
            price: item.price,
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
async function deleteProjectService(req) {
    try {
        await deleteProject( req.params.id);
        const user = await getUserByUid(req);
        const temp = await getProjectsByMentor(user.email);
        let data;
        if (temp == null){
            data = "Project Is Empty";
        }else {
            data = await transformData(temp);
        }
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
    deleteProjectService,
}