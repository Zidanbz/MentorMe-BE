const {db} = require("../config/FirebaseConfig")

async function createReview(data){
    try{
        const docRef = await db.collection("review")
            .doc();
        await docRef.set(data.toObject());
        return "Success";
    }catch (error){
        throw new Error(error.message)
    }
}

module.exports = {
    createReview,
}