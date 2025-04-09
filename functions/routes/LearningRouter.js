const express = require('express');
const router = express.Router();

const {getLearningsUser} = require("../public/javascripts/service/learning/GetLerningUser");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const GetProjectByCustomers = require("../public/javascripts/service/learning/GetProjectByCustomers");

/* GET home page. */
router.get('/api/my/learning', authorizeRole("USER"),
    async function(req,
             res, next) {
    res.send(await getLearningsUser(req));
});

router.get('/api/project/buy', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        const object = new GetProjectByCustomers();
        const response = await object.getLearning(req);
        res.send(response);
    });

router.get('/api/project/completed', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        const object = new GetProjectByCustomers();
        const response = await object.getLearningComplete(req);
        res.send(response);
    });

module.exports = router;
