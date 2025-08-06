const { getSurveyById, getSurveyResponsesBySurvey, getAllSurveyResponses } = require('../../repo/SurveyRepo');
const { getAllMentors } = require('../../repo/MentorRepo');
const { getUsersByEmails } = require('../../repo/UserRepo');
const APIResponse = require('../../DTO/response/APIResponse');
const HttpStatus = require('../../util/HttpStatus');

class GetSurveyTrackingService {
    async getSurveyTracking(surveyId) {
        try {
            if (!surveyId) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Survey ID is required",
                );
            }

            // Get survey details
            const survey = await getSurveyById(surveyId);

            // Get all responses for this survey
            const responses = await getSurveyResponsesBySurvey(surveyId);

            // Get all mentors
            const allMentors = await getAllMentors();
            const activeMentors = allMentors.filter(mentor => mentor.status === 'ACCEPTED');

            // Get mentor emails who have responded
            const respondedMentorEmails = responses.map(response => response.mentorEmail);

            // Get mentor emails who haven't responded
            const notRespondedMentorEmails = activeMentors
                .map(mentor => mentor.email)
                .filter(email => !respondedMentorEmails.includes(email));

            // Get user details for mentors who responded
            const respondedMentorDetails = [];
            if (respondedMentorEmails.length > 0) {
                const respondedUsers = await getUsersByEmails(respondedMentorEmails);
                const userMap = new Map(respondedUsers.map(user => [user.email, user]));

                for (const response of responses) {
                    const user = userMap.get(response.mentorEmail);
                    const mentor = activeMentors.find(m => m.email === response.mentorEmail);

                    respondedMentorDetails.push({
                        email: response.mentorEmail,
                        fullName: user ? user.fullName : 'Unknown',
                        submittedAt: response.submittedAt,
                        responseId: response.ID,
                        mentorStatus: mentor ? mentor.status : 'Unknown',
                    });
                }
            }

            // Get user details for mentors who haven't responded
            const notRespondedMentorDetails = [];
            if (notRespondedMentorEmails.length > 0) {
                const notRespondedUsers = await getUsersByEmails(notRespondedMentorEmails);
                const userMap = new Map(notRespondedUsers.map(user => [user.email, user]));

                for (const email of notRespondedMentorEmails) {
                    const user = userMap.get(email);
                    const mentor = activeMentors.find(m => m.email === email);

                    notRespondedMentorDetails.push({
                        email: email,
                        fullName: user ? user.fullName : 'Unknown',
                        mentorStatus: mentor ? mentor.status : 'Unknown',
                    });
                }
            }

            // Calculate statistics
            const totalMentors = activeMentors.length;
            const totalResponses = responses.length;
            const responseRate = totalMentors > 0 ? ((totalResponses / totalMentors) * 100).toFixed(2) : 0;

            const trackingData = {
                survey: {
                    id: survey.ID,
                    title: survey.title,
                    description: survey.description,
                    status: survey.status,
                    createdAt: survey.createdAt,
                    deadline: survey.deadline,
                    createdBy: survey.createdBy,
                },
                statistics: {
                    totalMentors: totalMentors,
                    totalResponses: totalResponses,
                    notRespondedCount: totalMentors - totalResponses,
                    responseRate: `${responseRate}%`,
                },
                respondedMentors: respondedMentorDetails,
                notRespondedMentors: notRespondedMentorDetails,
            };

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                trackingData,
                "Survey tracking data retrieved successfully",
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

    async getAllSurveyTracking() {
        try {
            // Get all survey responses
            const allResponses = await getAllSurveyResponses();

            // Get all mentors
            const allMentors = await getAllMentors();
            const activeMentors = allMentors.filter(mentor => mentor.status === 'ACCEPTED');

            // Group responses by survey
            const responsesBySurvey = {};
            allResponses.forEach(response => {
                if (!responsesBySurvey[response.surveyId]) {
                    responsesBySurvey[response.surveyId] = [];
                }
                responsesBySurvey[response.surveyId].push(response);
            });

            // Get all surveys and calculate tracking for each
            const { getAllSurveys } = require('../../repo/SurveyRepo');
            const allSurveys = await getAllSurveys();

            const trackingData = [];

            for (const survey of allSurveys) {
                const surveyResponses = responsesBySurvey[survey.ID] || [];
                const totalResponses = surveyResponses.length;
                const totalMentors = activeMentors.length;
                const responseRate = totalMentors > 0 ? ((totalResponses / totalMentors) * 100).toFixed(2) : 0;

                trackingData.push({
                    surveyId: survey.ID,
                    title: survey.title,
                    status: survey.status,
                    createdAt: survey.createdAt,
                    deadline: survey.deadline,
                    totalResponses: totalResponses,
                    totalMentors: totalMentors,
                    responseRate: `${responseRate}%`,
                });
            }

            return new APIResponse(
                HttpStatus.OK.code,
                false,
                trackingData,
                "All survey tracking data retrieved successfully",
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

module.exports = GetSurveyTrackingService;
