const crypto = require('crypto');

function idRequest() {
    return crypto.randomUUID();
}

function ID(){
    return crypto.randomUUID();
}

module.exports = {
    idRequest,
    ID,
};