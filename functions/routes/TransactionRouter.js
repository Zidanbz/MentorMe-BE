const express = require('express');
const router = express.Router();

const {notificationService} = require("../public/javascripts/service/transaction/TransactionNotificationService")
const {newTransaction} = require("../public/javascripts/service/transaction/TransactionService");
const {getHistoryTransactionService} = require("../public/javascripts/service/user/GetHistoryTransactionLearningService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const {getProjectPraTransaction} = require("../public/javascripts/service/transaction/GetProjectPraTransaction");
const WithdrawalService = require("../public/javascripts/service/transaction/WithdrawalService")

router.post('/api/payment/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await newTransaction(req));
});

router.get('/api/pay/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await getProjectPraTransaction(req));
    });

/* GET home page. */
router.post('/notification',
    async function(req,
             res, next) {
    res.send(await notificationService(req));
});

router.get('/api/profile/history', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await getHistoryTransactionService(req));
});

router.post('/api/change/coin', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
    const object = new WithdrawalService();
    const response = await object.doChangeCoin(req);
        res.send(response);
    });

router.post('/api/change/money', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        const object = new WithdrawalService();
        const response = await object.doChangeMoney(req);
        res.send(response);
    });

router.get('/api/history/transaction/mentor', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        const object = new WithdrawalService();
        const response = await object.getTransaction(req);
        res.send(response);
    });


module.exports = router;
