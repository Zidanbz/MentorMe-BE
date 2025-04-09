var express = require('express');
var router = express.Router();

const {createProject} = require('../public/javascripts/service/project/ProjectServiceService');
const {getDescriptionInLearningPath} = require("../public/javascripts/service/project/ProjectDescriptionInLearningPathService")
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/**
 * API yang digunakan untuk menambahkan project ke dalam aplikasi yang
 * dilakukan oleh mentor
 * Mengembalikan semua project dari mentor yang menambahkan project
 * @req menerima request dalam bentuk form-data
 */
router.post('/api/project/new', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
    res.send(await createProject(req));
});

router.get('/api/learn/project/:id', authorizeRole("USER"),
    async function(req, res, next) {
    res.send(await getDescriptionInLearningPath(req));
});


module.exports = router;