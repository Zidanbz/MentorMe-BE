/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");

// const server = require("./app");

// exports.widgets = onRequest(server);


const { onRequest } = require("firebase-functions/v2/https");
const server = require("./app");

exports.widgets22 = onRequest(
  {
    region: "asia-southeast2",
    minInstances: 1, // menjaga 1 instance tetap hangat
    memory: "1024MiB", // optional: tingkatkan jika proses berat
    timeoutSeconds: 60, // optional: atur sesuai kebutuhan
  },
  server,
);

// exports.widgets = functions.onRequest((req, res) => {
//     server(req, res);
// });