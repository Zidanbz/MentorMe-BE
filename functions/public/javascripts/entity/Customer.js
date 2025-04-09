class Customer{
    constructor(ID, email, status, job, coin) {
        this.ID = ID;
        this.email = email;
        this.status = status;
        this.job = job;
        this.coin = coin;
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


    getCoin() {
        return this.coin;
    }

    setCoin(value) {
        this.coin = value;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            status: this.status,
            job: this.job,
            coin: this.coin,
        }
    }
}

module.exports = Customer