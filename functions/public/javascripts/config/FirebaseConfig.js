const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../../../mentorme-aaa37-firebase-adminsdk-u4jwm-4a14aef62d.json');
// punya orang
const { getStorage } = require('firebase-admin/storage');

const configFireApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: 'gs://mentorme-aaa37.firebasestorage.app',
    });

const db = configFireApp.firestore();
const authentications = configFireApp.auth();
const storageBucket = configFireApp.storage().bucket();
// punya oranng
const storage = getStorage();

module.exports = {
    db,
    authentications,
    storageBucket,
    storage,
};
