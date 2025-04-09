const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {createNewLearning} = require("../../repo/LearningRepo");
const {getTransactionById, updateTransactionAccepted} = require("../../repo/TransactionalRepo");
const Learning = require("../../entity/Learning");
const {ID} = require("../../util/UUID");
const {getSyllabusByProject} = require("../../repo/SyllabusRepo");
const {newActivity} = require("../activity/CreateNewActivityService")

async function mappingToLearning(transaction){
    try{
        return new Learning(
            ID(),
            transaction.email,
            false,
            transaction.course
        );
    }catch (error){
        throw new Error(error.message);
    }
}

async function createActivity(learning){
    try{
        const syllabus = await getSyllabusByProject(learning.project);
        const learningId = learning.ID;
        if(!syllabus || syllabus.length === 0){
            return 0;
        }
        for (const value of syllabus){
            const syllabusId = value.ID;
            await newActivity(learningId, syllabusId);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function checkStatus(req){
    try{
        const order_id = req.body.order_id;
        const isAccept = req.body.fraud_status;
        const transaction = await getTransactionById(order_id);
        if(isAccept === "accept"){
            await updateTransactionAccepted(isAccept, order_id);
            const learning = await mappingToLearning(transaction[0]);
            // masukkan newActivity
            await createNewLearning(learning);
            await createActivity(learning);
        }else {
            await updateTransactionAccepted(isAccept, order_id);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function notificationService(req){
    try{
        await checkStatus(req);
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        )
    }
}

module.exports = {
    notificationService
};