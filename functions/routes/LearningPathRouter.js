var express = require('express');
var router = express.Router();
const {createNewLearningPath} = require('../public/javascripts/service/learnpath/CreateNewLearningPathService');
const {getProjectInLearningPath} = require("../public/javascripts/service/project/GetProjectInLerningPathService")
const {searchProjectInLearningPath} = require("../public/javascripts/service/project/SearchProjectInLearningPathService")
const {getLearningPathByCategories, getAllLearningPath} = require("../public/javascripts/service/learnpath/GetLearningPathByCategory")
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/**
 * API yang digunakan untuk menambahan Learning Path
 * Menerima Request dalam dalam bentuk form-data
 */
router.post('/api/learn/new', authorizeRole("ADMIN"),
    async function(req,
                   res, next) {
        res.send(await createNewLearningPath(req));
    });

/**
 * API digunakan untuk mengembalikan data project berdaarkan dengan learning pathnya
 * Menangkap id yang di kirim lewat url :id untuk kemudian diproses. :id adalah
 * id dari learning path
 */
router.get('/api/learn/:id', authorizeRole("USER"),
    async function(req,
                   res){
    res.send(await getProjectInLearningPath(req));
});

/**
 * API ini digunakan ketika ingin mencari project yang berada pada learning path yang di pilih
 * Menerima dua request sekaligus. Pertama adalah :id yang digunakan untuk menangkap ID dari
 * learning path. Kedua adalah Body request dengan nama variable {search} yang digunakan untuk
 * mengirimakan data yang ingin dicari
 */
router.get('/api/learn/project/search/:id', authorizeRole("USER"),
    async function(req,
                   res){
        res.send(await searchProjectInLearningPath(req));
});

router.get('/api/learn/categories/:id', authorizeRole("USER", "MENTOR"),
    async function(req,
                   res){
        res.send(await getLearningPathByCategories(req));
});

router.get('/api/all/learnpath', authorizeRole("USER", "MENTOR"),
    async function(req,
                   res){
        res.send(await getAllLearningPath(req));
});

module.exports = router;
