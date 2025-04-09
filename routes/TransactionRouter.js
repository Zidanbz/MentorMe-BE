const express = require('express');
const router = express.Router();


const {notificationService} = require("../public/javascripts/service/transaction/TransactionNotificationService")
const {newTransaction} = require("../public/javascripts/service/transaction/TransactionService");
const {getHistoryTransactionService} = require("../public/javascripts/service/user/GetHistoryTransactionLearningService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

router.post('/api/payment/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await newTransaction(req));
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


module.exports = router;
