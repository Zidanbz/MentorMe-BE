const {createNewTransaction} = require("../../repo/TransactionalRepo");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {ID} = require("../../util/UUID");
const Transactional = require("../../entity/Transactional");
const {encodeKeyTrans} = require("../../config/MidtransConfig");
const axios = require("axios");
const {getProjectById} = require("../../repo/ProjectRepo");
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus");
const {getVoucherById} = require("../../repo/VoucherRepo");
const {getUserVoucherByVoucherId, markVoucherAsUsed} = require("../../repo/UserVoucherRepo");
// const { v4: uuidv4 } = require('uuid');


async function mapping(req, idProject, price){
    const user = await getUserByUid(req);
    return new Transactional(
        ID(),
        user.email,
        idProject,
        "pending",
        price,
        req.body.ID,
    );
}

async function dataTransaction(req){
    try {
        const project = await getProjectById(req.params.id);
        const transactional = await mapping(req, project.ID, project.price);
        let price;
        let name;
        if (transactional.voucher != null){
            // Check if user has claimed this voucher and it's not used
            const userVoucher = await getUserVoucherByVoucherId(transactional.email, transactional.voucher);
            if (!userVoucher) {
                throw new Error("Voucher not found in your claimed vouchers or already used");
            }

            const voucher = await getVoucherById(transactional.voucher);
            if (!voucher || voucher.length === 0) {
                throw new Error("Voucher not found");
            }

            let discount;
            discount = (voucher[0].piece / 100) * transactional.price;
            discount = Math.min(discount, transactional.price);
            price = Number(transactional.price - discount);

            // Mark voucher as used after successful payment calculation
            await markVoucherAsUsed(transactional.email, transactional.voucher);
        }else {
            price = Number(transactional.price);
        }
        if (!project.materialName || project.materialName.length > 50) {
    name = "Name Is Not Defined";
}else {
    name = project.materialName;
}
        const data = {
            "transaction_details": {
                order_id: transactional.ID,
                gross_amount: price,
            },
            "item_details": [{
                "id": project.ID,
                "price": price,
                "quantity": 1,
                "name": name,
            }],
            "customer_details": {
                "email": transactional.email,
            },
        };
        return ({data, transactional});
    }catch (error){
        throw new Error(error.message);
    }
}

async function newTransaction(req){
    try {
        const {data, transactional} = await dataTransaction(req);
        await createNewTransaction(transactional);
            const response = await axios.post(
                "https://app.midtrans.com/snap/v1/transactions",
                data,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Basic ${encodeKeyTrans()}`,
                        "Content-Type": "application/json",
                    },
                },
            );

        // Tambahkan transactionID ke dalam response data
        const responseData = {
            ...response.data,
            transactionID: transactional.ID,
        };

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            responseData,
            HttpStatus.CREATED.message,
        )
    }catch (error) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        )
    }
}

module.exports = {
    newTransaction,
};