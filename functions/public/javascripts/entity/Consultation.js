class Consultation{
    // Punya Orang
    constructor(id, userId, mentorId, institution, major, subject, materialFile, description, coinAmount, status, createdAt) {
        this.id = id;
        this.userId = userId;
        this.mentorId = mentorId;
        this.institution = institution;
        this.major = major;
        this.subject = subject;
        this.materialFile = materialFile;
        this.description = description;
        this.coinAmount = coinAmount;
        this.status = status; // PENDING, ACCEPTED, REJECTED, COMPLETED
        this.createdAt = createdAt || new Date();
    }

    toObject() {
        return {
            id: this.id,
            userId: this.userId,
            mentorId: this.mentorId,
            institution: this.institution,
            major: this.major,
            subject: this.subject,
            materialFile: this.materialFile,
            description: this.description,
            coinAmount: this.coinAmount,
            status: this.status,
            createdAt: this.createdAt,
        };
    }
}

module.exports = Consultation;