class Review{
    constructor(ID, customer, mentor, project, qualityMentor, criticism) {
        this.ID = ID;
        this.customer = customer;
        this.mentor = mentor;
        this.project = project;
        this.qualityMentor = qualityMentor;
        this.criticism = criticism;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setEmail(customer){
        this.customer = customer;
    }

    getEmail(){
        return this.customer;
    }

    setMentor(mentor){
        this.mentor = mentor;
    }

    getMentor(){
        return this.mentor;
    }

    setProject(project){
        this.project = project;
    }

    getProject(){
        return this.project;
    }

    setQualityMentor(qualityMentor){
        this.qualityMentor = qualityMentor;
    }

    getQualityMentor(){
        return this.qualityMentor;
    }

    setCriticism(criticism){
        this.criticism = criticism;
    }

    getCriticism(){
        return this.criticism;
    }

    toObject(){
        return {
            ID: this.ID,
            customer: this.customer,
            mentor: this.mentor,
            project: this.project,
            qualityMentor: this.qualityMentor,
            criticism: this.criticism,
        }
    }
}

module.exports = Review;