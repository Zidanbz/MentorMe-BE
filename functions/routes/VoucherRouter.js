const express = require('express');
const router = express.Router();

const {createVoucher} = require("../public/javascripts/service/voucher/CreateVoucherService");
const {listVoucherActive} = require("../public/javascripts/service/voucher/GetVoucherActive");
const {deleteVouchers} = require("../public/javascripts/service/voucher/DeleteVoucherService");
const {updateVouchers} = require("../public/javascripts/service/voucher/UpdateVoucherService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

// ADMIN
router.post('/api/voucher/created', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
    res.send(await createVoucher(req));
});

// ADMIN DAN USER
router.get('/api/voucher/get', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await listVoucherActive());
});

// ADMIN
router.delete('/api/voucher/delete/:id', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
        res.send(await deleteVouchers(req));
});

// ADMIN
router.put('/api/voucher/edit/:id', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
        res.send(await updateVouchers(req));
});

module.exports = router;