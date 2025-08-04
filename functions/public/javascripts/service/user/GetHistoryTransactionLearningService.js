const {getHistoryTransactionByEmailCustomer} = require("../../repo/TransactionalRepo");
const {getCustomerByEmail} = require("../../repo/CustomerRepo");
const {getProjectById} = require("../../repo/ProjectRepo");
const {getLearningPathById} = require("../../repo/LearningPathRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUserByUid} = require("../../util/AutenticationUtil")


async function history(req){
    try {
        const auth = await getUserByUid(req);
        const email = auth.email;
        const customer = await getCustomerByEmail(email);
        const transactions = await getHistoryTransactionByEmailCustomer(customer[0].email);
        const data = {
            customers: {
                ID: customer[0].ID,
                job: customer[0].job ? customer[0].job : "Non Job",
                status: customer[0].status,
            },
            history: [],
        };

        for (const transaction of transactions) {
            if (!transaction.ID.startsWith("TopUp")){
                const project = await getProjectById(transaction.course);
                const learningPath = await getLearningPathById(project.learningPath);
                for (const learn of learningPath){
                    data.history.push({
                        status: transaction.status,
                        price: transaction.price,
                        transactionID: transaction.ID,
                        project: {
                            ID: project.ID,
                            materialName: project.materialName,
                        },
                        LearningPath: {
                            ID: learn.ID,
                            name: learn.name,
                        },
                    });
                }
            }
        }
        return data;
    }catch (error){
        throw new Error(error.message);
    }
}

async function getHistoryTransactionService(req){
    try {
        const data = await history(req);
        console.log("Data : " + data);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}


module.exports = {
    getHistoryTransactionService,
};

