const {db} = require("../config/FirebaseConfig");
const Project = require("../entity/Project");

async function createNewProject(project){
    try {
        const docRef = await db.collection("project").
            doc();
        return await docRef.set(project.toObject());
    }catch (error) {
        throw new Error(error.message);
    }
}

function mapProjectDataToObject(data, object) {
    object.setID(data.ID);
    object.setLinkVideo(data.linkVideo);
    object.setMaterialName(data.materialName);
    object.setInfo(data.info);
    object.setPrice(data.price);
    object.setPicture(data.picture);
    object.setCoinFree(data.coinFree);
    object.setLearningPath(data.learningPath);
    object.setMentor(data.mentor);
}

function check(data) {
    if (!data || data.empty) {
        throw new Error("Data Not Found!");
    }
}

async function getProjectById(projectId){
    try{
        const docRef = await db.collection("project")
            .where("ID", "==", projectId)
            .get();
        check(docRef);
        const objectProject = new Project();
        docRef.forEach((docRef) => {
           mapProjectDataToObject(docRef.data(), objectProject);
        });
        return objectProject;
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectsByMentor(email){
    try{
        const docRef = await
            db.collection("project")
                .where ("mentor" , "==", email)
                .get();
        return docRef.docs.map(doc => ({
            // id: doc.id,
            ...doc.data()
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectByLearningPath(learningPath){
    try{
        const docRef = await db.collection("project")
            .where("learningPath", "==", learningPath)
            .get();
        return docRef.docs.map(doc  => ({
            ...doc.data()
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectBySyllabus(project){
    try{
        const docRef =
            await db.collection("project")
                .where("ID", "==", project)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    getProjectById,
    createNewProject,
    getProjectsByMentor,
    getProjectByLearningPath,
    getProjectBySyllabus,
};