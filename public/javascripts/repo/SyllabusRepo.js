const {db} = require("../config/FirebaseConfig");

async function newSyllabus(syllabus) {
    try{
        const docRef = db.collection("syllabus").doc();
        await docRef.set(syllabus.toObject());
    }catch (error){
        throw new Error(error.message);
    }
}

function check(data){
    if(!data || data.empty){
        throw new Error("Syllabus data doesn't exist");
    }
}

async function getSyllabusByProject(projectId) {{
    try{
        const docRef = await
            db.collection("syllabus")
                .where("Project", "==", projectId)
                .get();
        check(docRef);
        return  docRef.docs.map( data => (data.data()));
    }catch (error){
        throw new Error(error.message);
    }
}}

module.exports = {
    newSyllabus,
    getSyllabusByProject,
};