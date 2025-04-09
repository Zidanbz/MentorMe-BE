const {db} = require("../config/FirebaseConfig");

class MentorRepos{
    async getMentorByEmail(email) {
        try {
            const docRef =
                await db.collection("mentor").where("email", "==", email)
                    .get();
            return docRef.docs.map(doc => ({
                ...doc.data(),
            }));
        }catch (error){
            throw new Error(error.message)
        }
    }
}

module.exports = MentorRepos;