const {ID} = require('../util/UUID');

class Survey {
    constructor(title, description, questions, status = 'ACTIVE', createdBy, deadline = null) {
        this.ID = ID();
        this.title = title;
        this.description = description;
        this.questions = questions; // Array of question objects
        this.status = status; // ACTIVE, INACTIVE
        this.createdBy = createdBy; // Admin email who created the survey
        this.createdAt = new Date();
        this.deadline = deadline;
    }

    setID(ID) {
        this.ID = ID;
    }

    getID() {
        return this.ID;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setDescription(description) {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    setQuestions(questions) {
        this.questions = questions;
    }

    getQuestions() {
        return this.questions;
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    getCreatedBy() {
        return this.createdBy;
    }

    setDeadline(deadline) {
        this.deadline = deadline;
    }

    getDeadline() {
        return this.deadline;
    }

    toObject() {
        return {
            ID: this.ID,
            title: this.title,
            description: this.description,
            questions: this.questions,
            status: this.status,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            deadline: this.deadline,
        };
    }
}

module.exports = Survey;
