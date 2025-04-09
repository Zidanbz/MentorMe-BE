const express = require('express');
const router = express.Router();

const {getMyActivity} = require("../public/javascripts/service/activity/GetActivityService");
const {uploadActivity} = require("../public/javascripts/service/activity/UploadActivityService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

/* GET home page. */
router.get('/api/my/activity/:id', authorizeRole("USER"),
    async function(req,
             res, next) {
    res.send(await getMyActivity(req));
});

router.post('/api/my/activity/upload/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await uploadActivity(req));
});

module.exports = router;
