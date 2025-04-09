class Notif {
    constructor(ID, title, message) {
        this.ID = ID;
        this.title = title;
        this.message = message;
    }

    getID() {
        return this._ID;
    }

    setID(value) {
        this._ID = value;
    }

    gettitle() {
        return this._title;
    }

    settitle(value) {
        this._title = value;
    }

    getmessage() {
        return this._message;
    }

    setmessage(value) {
        this._message = value;
    }
    toObject() {
        return {
            ID: this.ID,
            title: this.title,
            message: this.message,
        }
    }
}

module.exports = Notif;