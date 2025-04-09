var express = require('express');
const router = express.Router();

const {createNotif} = require("../public/javascripts/service/notif/CreateNewNotifService");
const {getAllNotifService} = require("../public/javascripts/service/notif/GetAllNotifService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

router.post("/api/notif/new", authorizeRole("ADMIN"),
    async function(req, res) {
    res.send(await createNotif(req));
    });

router.get("/api/notif/all",
    async function(req, res) {
    res.send(await getAllNotifService());
    })

module.exports = router;