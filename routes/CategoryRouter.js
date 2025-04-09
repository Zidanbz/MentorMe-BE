var express = require('express');
var router = express.Router();
const { createCategory } = require('../public/javascripts/service/category/CategoryService');
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/**
 * Digunakan untuk menambahkan category
 * menerima request dalam bentuk form-data
 */
router.post('/api/categories/new', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
    res.send(await createCategory(req));
});

module.exports = router;