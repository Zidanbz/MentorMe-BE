const {db} = require("../config/FirebaseConfig")


async function createNewCategory(category){
    try {
        const docRef =
            await db.collection("category").doc();
        await docRef.set(category.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

async function getAllCategory(){
    try{
        const docRef =
            await db.collection("category")
                .get();
        return docRef.docs.map(doc =>({
            ...doc.data()
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCategoryByName(name){
    try{
        const docRef =
            await db.collection("category")
                .where("name", "==", name)
                .get();
        return docRef.docs.map(doc =>({
            ...doc.data()
        }))
    }catch (error){
        throw new Error(error.message);
    }
}

async function getCategoryById(id){
    try{
        const docRef = await db.collection("category")
            .where("id", "==", id)
            .get();

    }catch(error){
        throw new Error(error.message);
    }
}

module.exports = {
    createNewCategory,
    getAllCategory,
    getCategoryByName
}