const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../../serviceAccountKey.json");

const configFireApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "mentorme-aaa37.firebasestorage.app",
});

// Menambahkan Firebase Messaging
const messaging = configFireApp.messaging();

const db = configFireApp.firestore();
const authentications = configFireApp.auth();
const storageBucket = configFireApp.storage().bucket();
// // punya oranng
// const storage = getStorage();
console.log("Using bucket:", storageBucket.name);
module.exports = {
  db,
  authentications,
  storageBucket,
  // storage,
  messaging,
};
