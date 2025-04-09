const express = require('express');
const router = express.Router();
const { createTopUpTransaction} = require('../public/javascripts/service/topup/TopUpService');
const {handlePaymentNotification} = require('../public/javascripts/service/topup/ToUpNotificationService');
const { authorizeRole } = require('../public/javascripts/config/SecurityConfig');
const {getHistoryTopUpService} = require('../public/javascripts/service/topup/GetHistoryTopUpService');
// const HTTPStatus = require('../public/javascripts/util/HttpStatus')
// const APIResponse = require('../public/javascripts/util/APIResponse');

router.post('/api/coin/topUp',
    authorizeRole("USER"),
    async function(req, res) {
    res.send(await createTopUpTransaction(req));
    });

router.post('/api/topup/notification',
    async function(req, res) {
        const response = await handlePaymentNotification(req.body);
        res.status(response.code).json(response);
    });

router.get('/api/coin/get',
    async function(req, res) {
        res.send(await getHistoryTopUpService(req));
    });

// router.get('/api/topup/history/:userId',
//     authorizeRole("USER"),
//     async function(req, res) {
//     const userId = req.params.userId;
//     // Validate if requesting user is the same as userId
//         if (req.user.uid !== userId) {
//             return res.status(403).json(new APIResponse(
//                 HTTPStatus.FORBIDDEN.code,
//                 "Unauthorized access",
//                 null,
//                 HTTPStatus.FORBIDDEN.message
//             ));
//         }
//
//         try {
//             const transactions = await db.collection('transactions')
//                 .where('userId', '==', userId)
//                 .orderBy('createdAt', 'desc')
//                 .get();
//
//             const transactionHistory = transactions.docs.map(doc => doc.data());
//
//             return res.status(200).json(new APIResponse(
//                 HTTPStatus.OK.code,
//                 null,
//                 transactionHistory,
//                 HTTPStatus.OK.message,
//             ));
//             }catch (error) {
//                 return res.status(500).json(new APIResponse(
//                     HTTPStatus.INTERNAL_SERVER_ERROR.code,
//                     error.message,
//                     null,
//                     HTTPStatus.INTERNAL_SERVER_ERROR.message,
//                 ));
//             }
//     });

module.exports = router;