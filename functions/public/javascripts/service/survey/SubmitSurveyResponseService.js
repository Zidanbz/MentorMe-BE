const SurveyResponse = require('../../entity/SurveyResponse');
const { createSurveyResponse, getSurveyById, checkMentorSurveyResponse } = require('../../repo/SurveyRepo');
const APIResponse = require('../../DTO/response/APIResponse');
const HttpStatus = require('../../util/HttpStatus');
const { getUserByUid } = require('../../util/AutenticationUtil');

class SubmitSurveyResponseService {
    async submitSurveyResponse(req) {
        try {
            const { surveyId } = req.params;
            const { responses } = req.body;

            // Validate required fields
            if (!surveyId || !responses || !Array.isArray(responses)) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Survey ID and responses are required. Responses must be an array.",
                );
            }

            // Get mentor user info
            const mentorUser = await getUserByUid(req);

            // Check if survey exists and is active
            const survey = await getSurveyById(surveyId);
            if (survey.status !== 'ACTIVE') {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Survey is not active",
                );
            }

            // Check if survey is not expired
            if (survey.deadline && new Date(survey.deadline) < new Date()) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Survey deadline has passed",
                );
            }

            // Check if mentor has already responded to this survey
            const hasResponded = await checkMentorSurveyResponse(surveyId, mentorUser.email);
            if (hasResponded) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "You have already responded to this survey",
                );
            }

            // Validate responses structure
            for (let i = 0; i < responses.length; i++) {
                const response = responses[i];
                if (!response.questionId || response.answer === undefined || response.answer === null) {
                    return new APIResponse(
                        HttpStatus.BAD_REQUEST.code,
                        true,
                        null,
                        `Response ${i + 1} must have questionId and answer fields.`,
                    );
                }
            }

            // Validate that all required questions are answered
            const surveyQuestions = survey.questions;
            const responseQuestionIds = responses.map(r => r.questionId);

            for (const question of surveyQuestions) {
                if (question.required && !responseQuestionIds.includes(question.id)) {
                    return new APIResponse(
                        HttpStatus.BAD_REQUEST.code,
                        true,
                        null,
                        `Required question "${question.text}" must be answered.`,
                    );
                }
            }

            // Create survey response object
            const surveyResponse = new SurveyResponse(
                surveyId,
                mentorUser.email,
                responses,
                'COMPLETED',
            );

            // Save to database
            const createdResponse = await createSurveyResponse(surveyResponse);

            return new APIResponse(
                HttpStatus.CREATED.code,
                false,
                createdResponse.toObject(),
                "Survey response submitted successfully",
            );
        }catch (error) {
            if (error.message === "Survey not found") {
                return new APIResponse(
                    HttpStatus.NOT_FOUND.code,
                    true,
                    null,
                    "Survey not found",
                );
            }

            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                true,
                null,
                error.message,
            );
        }
    }
}

module.exports = SubmitSurveyResponseService;
