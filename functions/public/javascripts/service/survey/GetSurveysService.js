const { getAllSurveys, getActiveSurveys, getSurveyById } = require('../../repo/SurveyRepo');
const APIResponse = require('../../DTO/response/APIResponse');
const HttpStatus = require('../../util/HttpStatus');

class GetSurveysService {
    async getAllSurveys() {
        try {
            const surveys = await getAllSurveys();

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                surveys,
                "Surveys retrieved successfully",
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

    async getActiveSurveysForMentor() {
        try {
            const surveys = await getActiveSurveys();

            // Filter surveys that are not expired
            const currentDate = new Date();
            const activeSurveys = surveys.filter(survey => {
                if (!survey.deadline)return true;
                return new Date(survey.deadline) > currentDate;
            });

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                activeSurveys,
                "Active surveys retrieved successfully",
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

    async getSurveyById(surveyId) {
        try {
            if (!surveyId) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Survey ID is required",
                );
            }

            const survey = await getSurveyById(surveyId);

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                survey,
                "Survey retrieved successfully",
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

module.exports = GetSurveysService;
