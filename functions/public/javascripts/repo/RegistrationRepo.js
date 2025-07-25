const { db, authentications} = require('../config/FirebaseConfig');

async function registerUsers(req){
    try {
        const docRef = db.collection('user').doc();
        await docRef.set(req.toObject());
        return await authentications.createUser({
            email: req.getEmail(),
            password: req.getPassword(),
        });
    }catch (error) {
       throw new Error(error.message);
    }
}


module.exports = {registerUsers}
