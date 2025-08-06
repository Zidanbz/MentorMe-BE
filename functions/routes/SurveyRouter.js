const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../public/javascripts/config/SecurityConfig');

// Import services
const CreateSurveyService = require('../public/javascripts/service/survey/CreateSurveyService');
const GetSurveysService = require('../public/javascripts/service/survey/GetSurveysService');
const SubmitSurveyResponseService = require('../public/javascripts/service/survey/SubmitSurveyResponseService');
const GetSurveyTrackingService = require('../public/javascripts/service/survey/GetSurveyTrackingService');
const GetMentorSurveyResponsesService = require('../public/javascripts/service/survey/GetMentorSurveyResponsesService');

// Import utilities
const { updateSurvey, deleteSurvey } = require('../public/javascripts/repo/SurveyRepo');
const APIResponse = require('../public/javascripts/DTO/response/APIResponse');
const HttpStatus = require('../public/javascripts/util/HttpStatus');

// Admin endpoints - Create and manage surveys
router.post('/api/admin/survey', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const service = new CreateSurveyService();
        const response = await service.createSurvey(req);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.get('/api/admin/surveys', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const service = new GetSurveysService();
        const response = await service.getAllSurveys();
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.get('/api/admin/survey/:id', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const service = new GetSurveysService();
        const response = await service.getSurveyById(req.params.id);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.get('/api/admin/survey/tracking/:surveyId', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const service = new GetSurveyTrackingService();
        const response = await service.getSurveyTracking(req.params.surveyId);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.get('/api/admin/surveys/tracking', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const service = new GetSurveyTrackingService();
        const response = await service.getAllSurveyTracking();
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.put('/api/admin/survey/:id', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        const { title, description, questions, status, deadline } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (questions !== undefined) updateData.questions = questions;
        if (status !== undefined) updateData.status = status;
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send(new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                true,
                null,
                "No update data provided",
            ));
        }

        const updatedSurvey = await updateSurvey(req.params.id, updateData);

        res.status(200).send(new APIResponse(
            HttpStatus.OK.code,
            false,
            updatedSurvey,
            "Survey updated successfully",
        ));
        }catch (error) {
        if (error.message === "Survey not found") {
            res.status(404).send(new APIResponse(
                HttpStatus.NOT_FOUND.code,
                true,
                null,
                "Survey not found",
            ));
        }else {
            next(error);
        }
    }
});

router.delete('/api/admin/survey/:id', authorizeRole("ADMIN"), async(req, res, next) => {
    try {
        await deleteSurvey(req.params.id);

        res.status(200).send(new APIResponse(
            HttpStatus.OK.code,
            false,
            null,
            "Survey deleted successfully",
        ));
        }catch (error) {
        if (error.message === "Survey not found") {
            res.status(404).send(new APIResponse(
                HttpStatus.NOT_FOUND.code,
                true,
                null,
                "Survey not found",
            ));
        }else {
            next(error);
        }
    }
});

// Mentor endpoints - View and respond to surveys
router.get('/api/mentor/surveys', authorizeRole("MENTOR"), async(req, res, next) => {
    try {
        const service = new GetMentorSurveyResponsesService();
        const response = await service.getAvailableSurveysForMentor(req);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.post('/api/mentor/survey/:surveyId/response', authorizeRole("MENTOR"), async(req, res, next) => {
    try {
        const service = new SubmitSurveyResponseService();
        const response = await service.submitSurveyResponse(req);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

router.get('/api/mentor/survey/responses', authorizeRole("MENTOR"), async(req, res, next) => {
    try {
        const service = new GetMentorSurveyResponsesService();
        const response = await service.getMentorSurveyResponses(req);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

// General endpoint for getting survey details (accessible by both admin and mentor)
router.get('/api/survey/:id', authorizeRole("ADMIN", "MENTOR"), async(req, res, next) => {
    try {
        const service = new GetSurveysService();
        const response = await service.getSurveyById(req.params.id);
        res.status(response.code).send(response);
    }catch (error) {
        next(error);
    }
});

module.exports = router;
