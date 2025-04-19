class Notif {
    constructor(ID, title, message) {
        this.ID = ID;
        this.title = title;
        this.message = message;
    }

    // Getter and Setter for ID
    getID() {
        return this.ID;
    }

    setID(value) {
        this.ID = value;
    }

    // Getter and Setter for title
    getTitle() {
        return this.title;
    }

    setTitle(value) {
        this.title = value;
    }

    // Getter and Setter for message
    getMessage() {
        return this.message;
    }

    setMessage(value) {
        this.message = value;
    }

    // Convert the object to a plain object
    toObject() {
        return {
            ID: this.ID,
            title: this.title,
            message: this.message,
        };
    }
}

module.exports = Notif;
