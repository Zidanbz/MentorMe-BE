const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { authorizeRole } = require('../public/javascripts/config/SecurityConfig');
const HTTPStatus = require('../public/javascripts/util/HttpStatus');
const APIResponse = require('../public/javascripts/DTO/response/APIResponse');
const {createConsultation, getAvailableConsultations, acceptConsultation, rejectConsultation, completeConsultation,
} = require('../public/javascripts/service/Consultation/ConsultationService');

const { getConsultationMessages } = require('../public/javascripts/service/chat/ChatService'); // Tambahan

// Punya Orang

router.post('/api/consultation/create',
    authorizeRole("USER"),
    upload.single('materialFile'),
    async function(req, res) {
        const response = await createConsultation(req.user.uid, req.body, req.file);
        res.status(response.code).json(response);
    });

router.get('/api/consultation/available',
    authorizeRole("MENTOR"),
    async function(req, res) {
        const response = await getAvailableConsultations(req.user.uid);
        res.status(response.code).json(response);
    });

router.post('/api/consultation/:consultationId/accept',
    authorizeRole("MENTOR"),
    async function(req, res) {
        const response = await acceptConsultation(req.params.consultationId, req.user.uid);
        res.status(response.code).json(response);
    });

router.post('/api/consultation/:consultationId/reject',
    authorizeRole("MENTOR"),
    async function(req, res) {
        const response = await rejectConsultation(req.params.consultationId, req.user.uid);
        res.status(response.code).json(response);
    });

router.post('/api/consultation/:consultationId/complete',
    authorizeRole("MENTOR"),
    async function(req, res) {
        const response = await completeConsultation(req.params.consultationId);
        res.status(response.code).json(response);
    });

router.get('/api/consultation/:consultationId/messages',
    authorizeRole(["USER", "MENTOR"]),
    async function(req, res) {
        try {
            const messages = await getConsultationMessages(req.params.consultationId);
            res.status(200).json(new APIResponse(
                HTTPStatus.OK.code,
                null,
                messages,
                HTTPStatus.OK.message,
            ));
        }catch (error) {
            res.status(500).json(new APIResponse(
                HTTPStatus.INTERNAL_SERVER_ERROR.code,
                error.message,
                null,
                HTTPStatus.INTERNAL_SERVER_ERROR.message,
            ));
        }
    });

module.exports = router;