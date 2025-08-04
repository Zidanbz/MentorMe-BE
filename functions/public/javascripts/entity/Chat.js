class Chat {
    constructor(emailMentor, emailCustomer, nameCustomer, nameMentor, pictureCustomer, pictureMentor) {
        this.idRoom = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        this.emailMentor = emailMentor;
        this.emailCustomer = emailCustomer;
        this.nameCustomer = nameCustomer;
        this.nameMentor = nameMentor;
        this.pictureCustomer = pictureCustomer;
        this.pictureMentor = pictureMentor;
    }

    toObject() {
        return {
            idRoom: this.idRoom,
            emailMentor: this.emailMentor,
            emailCustomer: this.emailCustomer,
            nameCustomer: this.nameCustomer,
            nameMentor: this.nameMentor,
            pictureCustomer: this.pictureCustomer,
            pictureMentor: this.pictureMentor,
        };
    }
}

module.exports = Chat;