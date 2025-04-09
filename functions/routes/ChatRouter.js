const express = require('express');
const router = express.Router();

const {authorizeRole} = require("../public/javascripts/config/SecurityConfig");
const ChatService = require("../public/javascripts/service/chat/ChatService");

router.post('/api/chat', authorizeRole("USER", "MENTOR", "ADMIN"),
    async function(req,
                   res, next) {
        const object = new ChatService();
        const response = await object.saveChat(req);
        res.send(response);
    });

router.get('/api/chat', authorizeRole("USER", "MENTOR", "ADMIN"),
    async function(req,
                   res, next) {
        const object = new ChatService();
        const response = await object.getChatCustomer(req);
        res.send(response);
    });

module.exports = router;