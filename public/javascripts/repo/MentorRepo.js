const {db} = require("../config/FirebaseConfig")

async function createNewMentor(req){
    try{
        const docRef = db.collection("mentor").doc();
        await docRef.set(req.toObject());
    }catch (error){
        throw new Error(error.message)
    }
}

async function getMentorByProject(mentor){
    try{
        const docRefUser = await db.collection("user")
            .where("email", "==", mentor)
            .get();
        const dockRefMentor = await db.collection("mentor")
            .where("email", "==", mentor)
            .get();
        const dataUser = docRefUser.docs.map(doc => ({
            ...doc.data()
        }));
        const dataMentor = dockRefMentor.docs.map(doc => ({
            ...doc.data()
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
    if(!data || data.empty){
        throw new Error("Mentor not found.");
    }
}
async function getMentorByEmail(email){
    try{
        const docRef =
            await db.collection("mentor").where("email", "==", email)
                .get();
        check(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message)
    }
}

module.exports = {
    createNewMentor,
    getMentorByProject,
    getMentorByEmail
}