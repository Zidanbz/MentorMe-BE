class Customer {

    constructor (ID, email, status, job){
        this.ID = ID;
        this.email = email;
        this.status = status;
        this.job = job;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setEmail(email){
        this.email = email;
    }

    getEmail(){
        return this.email;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            status: this.status,
            job: this.job
        }
    }
}

module.exports = Customer