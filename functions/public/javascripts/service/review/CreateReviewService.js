const {getUserByUid} = require("../../util/AutenticationUtil");
const {ID} = require("../../util/UUID");
const {createReview} = require("../../repo/ReviewRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const Review = require("../../entity/Review");
const {getMentorByProject} = require("../../repo/MentorRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
// const {getUsersByEmail} = require("../../repo/UserRepo");

async function mappingReview(data){
    try {
        const {customer, project, mentor} = await getUser(data);
        return new Review(
            ID(),
            customer.email,
            mentor.email,
            project.ID,
            data.body.qualityMentor,
            data.body.criticism,
        )
    }catch (error){
        throw new Error(error.message);
    }
}

async function getUser(req){
    try {
        const customer = await getUserByUid(req);
        const project = await getProjectById(req.params.id);
        const mentor = await getMentorByProject(project.mentor);
        return ({customer, project, mentor});
    }catch (error){
        throw new Error(error.message);
    }
}

async function newReview(req) {
    try {
        const mapping = await mappingReview(req);
        const data = await createReview(mapping);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data,
            HttpStatus.CREATED.message,
        )
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
    newReview,
}