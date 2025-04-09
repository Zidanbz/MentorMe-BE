const {authentications} = require("../config/FirebaseConfig")

function checkUser(userRecord) {
    if ( userRecord === null || userRecord === undefined ) {
        throw new Error("Authorization token is missing");
    }
    return true;
}
async function getUserByUid(req){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    try {
        const userRecord = await authentications.getUser(token);

        if (checkUser(userRecord)) {
            return userRecord;
        }
        return null;
    }catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {getUserByUid};
