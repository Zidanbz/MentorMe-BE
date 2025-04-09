const dateTimeFormat = require('../../util/DateTime');
const {idRequest} = require('../../util/UUID');

class APIResponse {
    // code;
    // error;
    // data;
    // message;
    constructor(code, error, data, message) {
        this.code = code;
        this.error = error;
        this.data = data;
        this.message = message;
        this.time = dateTimeFormat;
        this.idRequest = idRequest();
    }

    setCode(code) {
        this.code = code;
    }

    getCode() {
        return this.code;
    }

    setError(error) {
        this.error = error;
    }

    getError() {
        return this.error;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setMessage(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }

    setTime(time) {
        this.time = time;
    }

    getTime() {
        return this._time;
    }

    setIdRequest(request) {
        this.idRequest = request;
    }

    getIdRequest() {
        return this.idRequest;
    }
}

module.exports = APIResponse;