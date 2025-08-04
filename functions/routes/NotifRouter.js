var express = require('express');
const router = express.Router();

const {createNotif} = require("../public/javascripts/service/notif/CreateNewNotifService");
const {getAllNotifService} = require("../public/javascripts/service/notif/GetAllNotifService");
const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");

// Membuat notifikasi baru
router.post("/api/notif/new", authorizeRole("ADMIN"), async function(req, res) {
    try {
        // Kirim notifikasi berdasarkan role
        const result = await createNotif(req); // Tidak perlu targetUserId lagi jika createNotif menggunakan role
        res.status(result.code).send(result);
    }catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).send({ message: "Failed to create notification" });
    }
});

router.get("/api/notif/all",
    async function(req, res) {
    res.send(await getAllNotifService());
    })

module.exports = router;