const express = require('express');
const router = express.Router();

const {createVoucher} = require("../public/javascripts/service/voucher/CreateVoucherService");
const {listVoucherActive} = require("../public/javascripts/service/voucher/GetVoucherActive");
const {deleteVouchers} = require("../public/javascripts/service/voucher/DeleteVoucherService");
const {updateVouchers} = require("../public/javascripts/service/voucher/UpdateVoucherService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

router.post('/api/voucher/created', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
    res.send(await createVoucher(req));
});

router.get('/api/voucher/get', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await listVoucherActive());
});

router.delete('/api/voucher/delete/:id', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
        res.send(await deleteVouchers(req));
});


router.put('/api/voucher/edit/:id', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
        res.send(await updateVouchers(req));
});

module.exports = router;