const express = require('express');
const router = express.Router();

const {createNewSyllabus} = require("../public/javascripts/service/syllabus/CreateNewSyllabusService");
const {getSyllabusByProjects} = require("../public/javascripts/service/syllabus/GetSyllabusService")
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


module.exports = router;
