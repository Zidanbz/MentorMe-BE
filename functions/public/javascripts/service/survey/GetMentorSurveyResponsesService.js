const { getSurveyResponsesByMentor, getSurveyById } = require('../../repo/SurveyRepo');
const APIResponse = require('../../DTO/response/APIResponse');
const HttpStatus = require('../../util/HttpStatus');
const { getUserByUid } = require('../../util/AutenticationUtil');

class GetMentorSurveyResponsesService {
    async getMentorSurveyResponses(req) {
        try {
            // Get mentor user info
            const mentorUser = await getUserByUid(req);

            // Get all responses by this mentor
            const responses = await getSurveyResponsesByMentor(mentorUser.email);

            // Get survey details for each response
            const responseDetails = [];

            for (const response of responses) {
                try {
                    const survey = await getSurveyById(response.surveyId);

                    responseDetails.push({
                        responseId: response.ID,
                        surveyId: response.surveyId,
                        surveyTitle: survey.title,
                        surveyDescription: survey.description,
                        responses: response.responses,
                        status: response.status,
                        submittedAt: response.submittedAt,
                        surveyCreatedAt: survey.createdAt,
                        surveyDeadline: survey.deadline,
                    });
                }catch (error) {
                    // If survey is deleted, still show the response but with limited info
                    responseDetails.push({
                        responseId: response.ID,
                        surveyId: response.surveyId,
                        surveyTitle: 'Survey Deleted',
                        surveyDescription: 'This survey has been deleted',
                        responses: response.responses,
                        status: response.status,
                        submittedAt: response.submittedAt,
                        surveyCreatedAt: null,
                        surveyDeadline: null,
                    });
                }
            }

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                responseDetails,
                "Mentor survey responses retrieved successfully",
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                true,
                null,
                error.message,
            );
        }
    }

    async getAvailableSurveysForMentor(req) {
        try {
            // Get mentor user info
            const mentorUser = await getUserByUid(req);

            // Get all active surveys
            const { getActiveSurveys, checkMentorSurveyResponse } = require('../../repo/SurveyRepo');
            const activeSurveys = await getActiveSurveys();

            // Filter surveys that are not expired and not yet responded by mentor
            const currentDate = new Date();
            const availableSurveys = [];

            for (const survey of activeSurveys) {
                // Check if survey is not expired
                if (survey.deadline && new Date(survey.deadline) < currentDate) {
                    continue;
                }

                // Check if mentor has not responded yet
                const hasResponded = await checkMentorSurveyResponse(survey.ID, mentorUser.email);
                if (!hasResponded) {
                    availableSurveys.push({
                        id: survey.ID,
                        title: survey.title,
                        description: survey.description,
                        questions: survey.questions,
                        createdAt: survey.createdAt,
                        deadline: survey.deadline,
                        createdBy: survey.createdBy,
                    });
                }
            }

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                availableSurveys,
                "Available surveys for mentor retrieved successfully",
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                true,
                null,
                error.message,
            );
        }
    }
}

module.exports = GetMentorSurveyResponsesService;
