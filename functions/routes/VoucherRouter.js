const express = require('express');
const router = express.Router();

const {createVoucher} = require("../public/javascripts/service/voucher/CreateVoucherService");
const {listVoucherActive} = require("../public/javascripts/service/voucher/GetVoucherActive");
const {deleteVouchers} = require("../public/javascripts/service/voucher/DeleteVoucherService");
const {updateVouchers} = require("../public/javascripts/service/voucher/UpdateVoucherService");
const {claimVoucher} = require("../public/javascripts/service/voucher/ClaimVoucherService");
const {getUserVouchers, getAvailableUserVouchersForPayment} = require("../public/javascripts/service/voucher/GetUserVouchersService");
const {getAvailableVouchersToClaim} = require("../public/javascripts/service/voucher/GetAvailableVouchersService");
const {claimVoucherByCode} = require("../public/javascripts/service/voucher/ClaimVoucherByCodeService");
const {authorizeRole, verifyFirebaseToken} = require("../public/javascripts/config/SecurityConfig");

// ADMIN
router.post('/api/voucher/created', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
    res.send(await createVoucher(req));
});

// ADMIN DAN USER
router.get('/api/voucher/get', authorizeRole("USER" , "ADMIN"),
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

// USER - Claim voucher menggunakan kode unik
router.post('/api/voucher/claim-by-code', authorizeRole("USER"),
    async function(req, res, next) {
        try {
            const user = await verifyFirebaseToken(req);
            const { voucherCode } = req.body;

            if (!voucherCode) {
                return res.status(400).json({
                    code: 400,
                    error: "Voucher code is required",
                    data: null,
                    message: "Bad Request",
                });
            }

            const result = await claimVoucherByCode(user.email, voucherCode);
            res.status(result.code).json(result);
        }catch (error) {
            res.status(500).json({
                code: 500,
                error: error.message,
                data: null,
                message: "Internal Server Error",
            });
        }
    });

// USER - Claim voucher
router.post('/api/voucher/claim/:voucherId', authorizeRole("USER"),
    async function(req, res, next) {
        res.send(await claimVoucher(req));
});

// USER - Get user's claimed vouchers
router.get('/api/voucher/my-vouchers', authorizeRole("USER"),
    async function(req, res, next) {
        res.send(await getUserVouchers(req));
});

// USER - Get available vouchers for payment (claimed and unused)
router.get('/api/voucher/my-available', authorizeRole("USER"),
    async function(req, res, next) {
        res.send(await getAvailableUserVouchersForPayment(req));
});

// USER - Get available vouchers to claim
router.get('/api/voucher/available-to-claim', authorizeRole("USER"),
    async function(req, res, next) {
        res.send(await getAvailableVouchersToClaim(req));
});

module.exports = router;