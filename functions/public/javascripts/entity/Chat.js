
class Chat {
    constructor(emailMentor, emailCustomer, nameCustomer, nameMentor) {
        this.idRoom = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        this.emailMentor = emailMentor;
        this.emailCustomer = emailCustomer;
        this.nameCustomer = nameCustomer;
        this.nameMentor = nameMentor;
    }

    toObject(){
        return {
            idRoom: this.idRoom,
            emailMentor: this.emailMentor,
            emailCustomer: this.emailCustomer,
            nameCustomer: this.nameCustomer,
            nameMentor: this.nameMentor,
        }
    }
}

module.exports = Chat;