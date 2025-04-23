const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../../../mentorme-aaa37-firebase-adminsdk-u4jwm-d5e55bda6f.json');

const configFireApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: 'gs://mentorme-aaa37.firebasestorage.app',
    });

// Menambahkan Firebase Messaging
const messaging = configFireApp.messaging();

const db = configFireApp.firestore();
const authentications = configFireApp.auth();
const storageBucket = configFireApp.storage().bucket();
// // punya oranng
// const storage = getStorage();

module.exports = {
    db,
    authentications,
    storageBucket,
    // storage,
    messaging,
};
