const {db, authentications} = require("../config/FirebaseConfig");

async function findEmailIsAlready(email) {
    const docRef = await db.collection("user")
        .where('email', '==', email)
        .get();

    if (!docRef.empty) {
        throw new Error(`${email} is already in use`);
    }
    return true;
}

async function getUsersByEmail(email){
    const docRef = await db.collection("user")
        .where('email', '==', email)
        .get();

    if (docRef.empty) {
        throw new Error(`${email} Not Found`);
    }
    return docRef.docs.map(doc => ({
        ...doc.data(),
    }));
}

async function authenticationUserByEmail(email) {
    try {
        return await authentications.getUserByEmail(email);
    }catch (error) {
        throw new Error(`${email} Not found`);
    }
}

async function setPictureUser(email, picture){
    try {
        const docDb = await db.collection("user");
        const docRef = await docDb
            .where('email', '==', email)
            .get();
        docRef.forEach(doc => {
            const ref = docDb.doc(doc.id);
            ref.update({ picture: picture });
        })
    }catch (error) {
        throw new Error(error.message);
    }
}

async function editUser(email , dataNew, {picture = null}){
    try {
        const docRef =
            await db.collection("user")
                .where('email', '==', email)
                .get();

        const dataForUpdate =
            docRef.docs.map(doc => ({
                id: doc.id,
            }));

        if (picture != null) {
            await db.collection("user").doc(dataForUpdate[0].id).update({
                picture: picture,
                phone: dataNew.phone,
                fullName: dataNew.fullName,
            });
        }else {
            await db.collection("user").doc(dataForUpdate[0].id).update({
                phone: dataNew.phone,
                fullName: dataNew.fullName,
            });
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function editUserMentor(email , fullName, picture){
    try {
        const docRef =
            await db.collection("user")
                .where('email', '==', email)
                .get();

        const dataForUpdate =
            docRef.docs.map(doc => ({
                id: doc.id,
            }));

        await db.collection("user").doc(dataForUpdate[0].id).update({
            picture: picture,
            fullName: fullName,
        });
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    findEmailIsAlready,
    authenticationUserByEmail,
    getUsersByEmail,
    setPictureUser,
    editUser,
    editUserMentor,
};