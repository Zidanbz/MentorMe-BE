const {db} = require("../config/FirebaseConfig")

async function createNewMentor(req){
    try {
        const docRef = db.collection("mentor").doc();
        await docRef.set(req.toObject());
    }catch (error){
        throw new Error(error.message)
    }
}

async function getMentorByProject(mentor){
    try {
        const docRefUser = await db.collection("user")
            .where("email", "==", mentor)
            .get();
        const dockRefMentor = await db.collection("mentor")
            .where("email", "==", mentor)
            .get();
        const dataUser = docRefUser.docs.map(doc => ({
            ...doc.data(),
        }));
        const dataMentor = dockRefMentor.docs.map(doc => ({
            ...doc.data(),
        }));
        return {
            email: dataMentor[0].email,
            about: dataMentor[0].about,
            fullName: dataUser[0].fullName,
            picture: dataUser[0].picture,
        }
    }catch (error){
        throw new Error(error.message);
    }
}

function check(data){
    if (!data || data.empty) {
        throw new Error("Mentor not found.");
    }
}
async function getMentorByEmail(email) {
    try {
        const docRef =
            await db.collection("mentor").where("email", "==", email)
                .get();
        check(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message)
    }
}

function checkIsNull(data){
    if (!data || data.empty) {
        return false;
    }
}

async function getMentorByEmails(email) {
    try {
        const docRef =
            await db.collection("mentor").where("email", "==", email)
                .get();
        checkIsNull(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message)
    }
}

async function getMentorPending() {
    try {
        const docRef =
            await db.collection("mentor").where("status", "==", "PENDING")
                .get();
        check(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message)
    }
}

function checkIsReady(req){
    if (req.empty) {
        throw new Error("Mentor not found.");
    }
}

async function acceptedMentor(email, status){
    try {
        const docRef = await db.collection('mentor').where("email", "==", email).get();
        checkIsReady(docRef);
        docRef.docs.map(async doc => {
            try {
                const data = { ...doc.data(), id: doc.id };
                await db.collection('mentor').doc(data.id).update({
                    status: status,
                });
            }catch (error) {
                throw new Error(`Failed to update voucher with ID ${doc.id}: ${error.message}`);
            }
        });
    }catch (error){
        throw new Error(error.message);
    }
}

async function getMentorRejected() {
    try {
        const docRef =
            await db.collection("mentor").where("status", "==", "REJECT")
                .get();
        check(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message)
    }
}

async function updateProfile(email, file, ability, portfolio){
    try {
        const docRef = await db.collection('mentor').where("email", "==", email).get();
        docRef.docs.map(async doc => {
            try {
                const data = { id: doc.id };
                await db.collection('mentor').doc(data.id).update({
                    about: ability,
                    ktp: file.ktp,
                    cv: file.cv,
                    linkPortfolio: portfolio,
                });
            }catch (error) {
                throw new Error(`Failed to update voucher with ID ${doc.id}: ${error.message}`);
            }
        });
        return docRef.docs.map(doc => ({
            ...doc.data(),
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

    async function getMentorProfile(email) {
    try {
        // Ambil data dari koleksi 'mentor'
        const mentorSnap = await db.collection("mentor").where("email", "==", email).get();
        if (mentorSnap.empty)throw new Error("Mentor profile not found.");

        // Ambil data dari koleksi 'user'
        const userSnap = await db.collection("user").where("email", "==", email).get();
        if (userSnap.empty)throw new Error("User data not found.");

        const mentorData = mentorSnap.docs[0].data();
        const userData = userSnap.docs[0].data();

        // Gabungkan dan kembalikan
        return {
            email: mentorData.email,
            fullName: userData.fullName,
            picture: userData.picture,
            about: mentorData.about,
            ktp: mentorData.ktp,
            cv: mentorData.cv,
            linkPortfolio: mentorData.linkPortfolio,
            status: mentorData.status || "UNKNOWN",
        };
    }catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createNewMentor,
    getMentorByProject,
    getMentorByEmail,
    getMentorPending,
    acceptedMentor,
    getMentorByEmails,
    getMentorRejected,
    updateProfile,
    getMentorProfile,
}