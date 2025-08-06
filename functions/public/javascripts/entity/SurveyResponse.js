const {ID} = require('../util/UUID');

class SurveyResponse {
    constructor(surveyId, mentorEmail, responses, status = 'COMPLETED') {
        this.ID = ID();
        this.surveyId = surveyId;
        this.mentorEmail = mentorEmail;
        this.responses = responses; // Array of response objects with questionId and answer
        this.status = status; // COMPLETED, DRAFT
        this.submittedAt = new Date();
    }

    setID(ID) {
        this.ID = ID;
    }

    getID() {
        return this.ID;
    }

    setSurveyId(surveyId) {
        this.surveyId = surveyId;
    }

    getSurveyId() {
        return this.surveyId;
    }

    setMentorEmail(mentorEmail) {
        this.mentorEmail = mentorEmail;
    }

    getMentorEmail() {
        return this.mentorEmail;
    }

    setResponses(responses) {
        this.responses = responses;
    }

    getResponses() {
        return this.responses;
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    setSubmittedAt(submittedAt) {
        this.submittedAt = submittedAt;
    }

    getSubmittedAt() {
        return this.submittedAt;
    }

    toObject() {
        return {
            ID: this.ID,
            surveyId: this.surveyId,
            mentorEmail: this.mentorEmail,
            responses: this.responses,
            status: this.status,
            submittedAt: this.submittedAt,
        };
    }
}

module.exports = SurveyResponse;
