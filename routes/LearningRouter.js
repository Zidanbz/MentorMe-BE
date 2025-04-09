const express = require('express');
const router = express.Router();

const {getLearningsUser} = require("../public/javascripts/service/learning/GetLerningUser");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/* GET home page. */
router.get('/api/my/learning', authorizeRole("USER"),
    async function(req,
             res, next) {
    res.send(await getLearningsUser(req));
});

module.exports = router;
