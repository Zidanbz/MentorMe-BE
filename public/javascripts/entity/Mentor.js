class Mentor {

    constructor(ID, email, ktp, cv, linkPortfolio, about) {
        this.ID = ID;
        this.email = email;
        this.ktp = ktp;
        this.cv = cv;
        this.linkPortfolio = linkPortfolio;
        this.about = about;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setEmail(email) {
        this.email = email;
    }

    getEmail() {
        return this.email;
    }

    setKtp(ktp) {
        this.ktp = ktp;
    }

    getKtp() {
        return this.ktp;
    }

    setCv(cv){
        this.cv = cv;
    }

    getCv(){
        return this.cv;
    }

    setLinkPortfolio(linkPortfolio) {
        this.linkPortfolio = linkPortfolio;
    }

    getLinkPortfolio() {
        return this.linkPortfolio;
    }

    setAbout(about) {
        this.about = about;
    }

    getAbout() {
        return this.about;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            ktp: this.ktp,
            cv: this.cv,
            linkPortfolio: this.linkPortfolio,
            about: this.about,
        }
    }
}

module.exports = Mentor;