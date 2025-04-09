const express = require('express');
const router = express.Router();

const {getMyActivity} = require("../public/javascripts/service/activity/GetActivityService");
const {uploadActivity} = require("../public/javascripts/service/activity/UploadActivityService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const ActivityService = require("../public/javascripts/service/activity/ActivityService");

/* GET home page. */
router.get('/api/my/activity/:id', authorizeRole("USER", "MENTOR"),
    async function(req,
             res, next) {
    res.send(await getMyActivity(req));
});

router.post('/api/my/activity/upload/:id', authorizeRole("USER"),
    async function(req,
                   res, next) {
        res.send(await uploadActivity(req));
});

router.get('/api/activity/:id', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
    const object = new ActivityService();
    const response = await object.getActivitiForReport(req);
        res.send(response);
    });

router.put('/api/report/:id', authorizeRole("MENTOR"),
    async function(req,
                   res, next) {
        const object = new ActivityService();
        const response = await object.doReport(req);
        res.send(response);
    });

module.exports = router;
