var express = require('express');
var router = express.Router();

const {registerUser} = require('../public/javascripts/service/registration/RegistrationUserService');
const {newMentor} = require("../public/javascripts/service/registration/RegistrationMentorService");
const {newAdmin} = require("../public/javascripts/service/registration/RegistrationAdmin");

/* Post users listing. */
router.post('/api/registration/user',
    async function(req,
                   res, next) {
    const registerUsers = registerUser(req.body, {});
    res.send(await registerUsers);
});

router.post('/api/registration/mentor',
    async function(req,
                   res, next) {
    res.send(await newMentor(req));
});

router.post('/api/registration/admin',
    async function(req,
                   res, next) {
        res.send(await newAdmin(req));
    });

module.exports = router;