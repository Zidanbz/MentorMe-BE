const {authentications} = require("../../config/FirebaseConfig")
const {token} = require("morgan");

function decodeToken(token) {
    authentications.
    authentications
        .verifyIdToken(token)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log(uid)
            // ...
        })
        .catch((error) => {
            // Handle error
            console.log(error);
        });
}

async function createToken(token){
    try{
        return await authentications.createCustomToken(token);
    }catch (error){
        console.log(error);
    }
}

async function verifyIdToken(token){
    try {
        // Verifikasi token dengan Firebase Admin SDK
        const decodedToken = await authentications.verifyIdToken(token);

        // Menyimpan informasi pengguna yang diverifikasi ke dalam req.user
        // req.user = {
        //     uid: decodedToken.uid,
        //     email: decodedToken.email,
        //     role: decodedToken.role || null, // Custom claims jika tersedia
        // };

        // next(); // Melanjutkan ke middleware berikutnya
    } catch (error) {
        console.error("Token verification error:", error);
        // res.status(403).send('Unauthorized: Invalid or expired token.');
    }
}
// verifyIdToken("EIfwBJzasGffU15AdeIN1jP4yaa2")
//     .then((decodedToken) => {
//         console.log(decodedToken);
//     })
createToken("EIfwBJzasGffU15AdeIN1jP4yaa2")
    .then((p) => {
        console.log(p);
        verifyIdToken(p).then((decodedToken) => {
            console.log(decodedToken);
        })
    });

// decodeToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczMjkzODMzOSwiZXhwIjoxNzMyOTQxOTM5LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay11NGp3bUBtZW50b3JtZS1hYWEzNy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXU0andtQG1lbnRvcm1lLWFhYTM3LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiRUlmd0JKemFzR2ZmVTE1QWRlSU4xalA0eWFhMiIsImNsYWltcyI6eyJVU0VSIjp0cnVlfX0.RNTXoSLiq0upufDRoDC-d71nPa-SrokHuotYX-DrIlaqe5_A6ppKBUVm739dlulYh5vwnVRfi3N7vPK87wFtIrpkbkQvJeTpNy9cm-2X0YjkgsgGHgsihkfrXq9Spr6JxexoV4BIQ9qO_3P_ffSfeF9-oZb7eDuUHNAtcvsbgF0FwVFOz8aaVIQbxcysfSMfALdc_DrRNv1xeRtz4J8qo1eUQa7GqOSv8rBYVj8YwkNR3sLKRytpC5ifMNZlkhpXSfdzX5-X_nejzkUH78s8gjVmiQB0zvK_Qjir8854o2WcZEdNRbn2-x1SR-RMwMbvIEGxYZFLTxwt2eDVQYsXcQ");