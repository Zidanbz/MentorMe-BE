var express = require('express');
var router = express.Router();

const {createProject} = require('../public/javascripts/service/project/ProjectServiceService');
const {getDescriptionInLearningPath} = require("../public/javascripts/service/project/ProjectDescriptionInLearningPathService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const {updateProject} = require("../public/javascripts/service/project/UpdateProjectService");
const {deleteProjectService} = require("../public/javascripts/service/project/DeleteProjectSerivce");
const {getProjectPendings} = require("../public/javascripts/service/project/GetProjectPending");
const {acceptedProject} = require("../public/javascripts/service/project/AccptedProject");
const {getAllProjectService} = require("../public/javascripts/service/project/GetAllProject");
const ProjectService = require("../public/javascripts/service/project/ProjectService");

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

router.get('/api/learn/project/:id', authorizeRole("USER", "MENTOR"),
    async function(req, res, next) {
    res.send(await getDescriptionInLearningPath(req));
});

router.put('/api/project/update/:id', authorizeRole("MENTOR"),
    async function(req, res, next) {
    res.send(await updateProject(req));
    });

router.delete('/api/project/delete/:id', authorizeRole("MENTOR"),
    async function(req, res, next) {
        res.send(await deleteProjectService(req));
    });

router.get('/api/project/pending', authorizeRole("ADMIN"),
    async function(req, res, next) {
    res.send(await getProjectPendings());
    });

router.put('/api/project/accepted/:id', authorizeRole("ADMIN"),
    async function(req, res, next) {
    res.send(await acceptedProject(req.params.id, req.body.reason, req.body.email));
    });

router.get('/api/project/all',
    async function(req, res, next) {
    res.send(await getAllProjectService());
    });

router.get('/api/project/accepted', authorizeRole("MENTOR", "MENTOR"),
    async function(req, res, next) {
    const object = new ProjectService();
    const response = await object.getLearningAccepted(req);
        res.send(response);
    });

router.get('/api/project/reject', authorizeRole("ADMIN"),
    async function(req, res, next) {
        const object = new ProjectService();
        const response = await object.getProjectRejected();
        res.send(response);
    });

router.get('/api/pending/mentor', authorizeRole("MENTOR"),
    async function(req, res, next) {
        const object = new ProjectService();
        const response = await object.getProjectPendingByMentor(req);
        res.send(response);
    });

router.get('/api/reject/mentor', authorizeRole("MENTOR"),
    async function(req, res, next) {
        const object = new ProjectService();
        const response = await object.getProjectRejectedForMentor(req);
        res.send(response);
    });

module.exports = router;