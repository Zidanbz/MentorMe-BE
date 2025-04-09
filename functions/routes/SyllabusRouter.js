const express = require('express');
const router = express.Router();

const {createNewSyllabus, updateSyllabus } = require("../public/javascripts/service/syllabus/CreateNewSyllabusService");
const {getSyllabusByProjects, getDetailSyllabus} = require("../public/javascripts/service/syllabus/GetSyllabusService")
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

router.post('/api/syllabus/new/:id', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
    res.send(await createNewSyllabus(req));
});

router.get('/api/syllabus/:id', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        res.send(await getSyllabusByProjects(req));
});

router.get('/api/syllabus/detail/:id', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        res.send(await getDetailSyllabus(req));
});

router.put('/api/syllabus/update/:id', authorizeRole("MENTOR"), async(req, res) => {
    res.send(await updateSyllabus(req));
});


module.exports = router;
