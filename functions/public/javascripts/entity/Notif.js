class Notif {
    constructor(ID, title, message) {
        this.ID = ID;
        this.title = title;
        this.message = message;
        this.timestamp = new Date();
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

    setTimestamp(value) {
        this.timestamp = value;
    }

    getTimestamp() {
        return this.timestamp;
    }

    // Convert the object to a plain object
    toObject() {
        return {
            ID: this.ID,
            title: this.title,
            message: this.message,
            timestamp: this.timestamp,
        };
    }
}

module.exports = Notif;
