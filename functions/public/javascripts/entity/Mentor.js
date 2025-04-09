class Mentor {
    constructor(ID, email, ktp, cv, linkPortfolio, about, status) {
        this.ID = ID;
        this.email = email;
        this.ktp = ktp;
        this.cv = cv;
        this.linkPortfolio = linkPortfolio;
        this.about = about;
        this.status = status;
        this.coint = 0;
        this.money = 0;
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

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            ktp: this.ktp,
            cv: this.cv,
            linkPortfolio: this.linkPortfolio,
            about: this.about,
            status: this.status,
            coint: this.coint,
            money: this.money,
        }
    }
}

module.exports = Mentor;