var express = require('express');
var router = express.Router();
const { createCategory } = require('../public/javascripts/service/category/CategoryService');
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const CategoryServices = require("../public/javascripts/service/category/CategoryServices");

/**
 * Digunakan untuk menambahkan category
 * menerima request dalam bentuk form-data
 */
router.post('/api/categories/new', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
    res.send(await createCategory(req));
});

router.get('/api/categories', authorizeRole("ADMIN", "MENTOR", "USER"),
    async function(req,
                   res, next) {
    const object = new CategoryServices();
    const response = await object.getAllCategories();
        res.send(response);
    });

module.exports = router;