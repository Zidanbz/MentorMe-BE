const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('../../../mentorme-aaa37-firebase-adminsdk-u4jwm-4a14aef62d.json');

const configFireApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount)
    }
);

const db = configFireApp.firestore();
const authentications = configFireApp.auth();

module.exports = {db, authentications};
