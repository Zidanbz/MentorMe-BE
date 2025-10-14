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
    object.setLearningMethod(data.learningMethod);
}

function check(data) {
    if (!data || data.empty) {
        throw new Error("Data Not Found Disini!");
    }
}

async function getProjectById(projectId){
    try {
        const docRef = await db.collection("project")
            .where("ID", "==", projectId)
            .get();
        check(docRef);
        const objectProject = new Project();
        docRef.forEach(docRef => {
           mapProjectDataToObject(docRef.data(), objectProject);
        });
        return objectProject;
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectsByMentor(email){
    try {
        const docRef = await
            db.collection("project")
                .where("mentor" , "==", email)
                .get();
        if (docRef.empty) {
            return null;
        }
        return docRef.docs.map(doc => ({
            ...doc.data(),
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectByLearningPath(learningPath){
    try {
        const docRef = await db.collection("project")
            .where("learningPath", "==", learningPath)
            .get();
        return docRef.docs.map(doc => ({
            ...doc.data(),
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectBySyllabus(project){
    try {
        const docRef =
            await db.collection("project")
                .where("ID", "==", project)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

function checkIsReady(snapshot){
    if (snapshot.empty) {
        throw new Error("Data Is Not Found");
    }
}

async function udpateProject(id, project){
    try {
        const docRef = await db.collection('project').where("ID", "==", id).get();
        checkIsReady(docRef);
        const updatePromises = docRef.docs.map(async doc => {
            try {
                const data = { ...doc.data(), id: doc.id };
                await db.collection('project').doc(data.id).update({
                    info: project.info,
                    learningPath: project.learningPath,
                    linkVideo: project.linkVideo,
                    materialName: project.materialName,
                    picture: project.picture,
                    price: project.price,
                });
                return project;
            }catch (error) {
                throw new Error(`Failed to update voucher with ID ${doc.id}: ${error.message}`);
            }
        });
        await Promise.all(updatePromises);
    }catch (error){
        throw new Error(error.message);
    }
}

async function deleteProject(id){
    try {
        const docRef = await db.collection("project")
            .where("ID", "==", id)
            .get();
        checkIsReady(docRef);
        const updatePromises = docRef.docs.map(async doc => {
            try {
                const data = { ...doc.data(), id: doc.id };
                await db.collection('project').doc(data.id).delete();
                return "Success Deleted";
            }catch (error) {
                throw new Error(`Failed to update voucher with ID ${doc.id}: ${error.message}`);
            }
        });
        await Promise.all(updatePromises);
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectPending(){
    try {
        try {
            const docRef = await db.collection("project")
                .where("status", "==", "PENDING")
                .get();
            return docRef.docs.map(doc => ({
                ...doc.data(),
            }));
        }catch (error){
            throw new Error(error.message);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function updateProjectAccpted(id, status){
    try {
        const docRef = await db.collection('project').where("ID", "==", id).get();
        checkIsReady(docRef);
        docRef.docs.map(async doc => {
            try {
                const data = { ...doc.data(), id: doc.id };
                await db.collection('project').doc(data.id).update({
                    status: status,
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

async function getAllProject(){
    try {
        try {
            const docRef = await db.collection("project")
                .get();
            checkIsReady(docRef);
            return docRef.docs.map(doc => ({
                ...doc.data(),
            }));
        }catch (error){
            throw new Error(error.message);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

// OPTIMASI: Add paginated version untuk performa yang lebih baik
async function getAllProjectPaginated(limit = 50, offset = 0, statusFilter = null, sortBy = 'createdAt', sortOrder = 'desc'){
    try {
        let query = db.collection("project");

        // Add status filter if provided
        if (statusFilter) {
            query = query.where("status", "==", statusFilter);
        }

        // Add sorting
        if (sortBy === 'createdAt') {
            query = query.orderBy("createdAt", sortOrder === 'desc' ? 'desc' : 'asc');
        }else if (sortBy === 'status') {
            query = query.orderBy("status", sortOrder === 'desc' ? 'desc' : 'asc');
        }

        // Add limit and offset for pagination
        query = query.limit(limit);

        if (offset > 0) {
            // For offset, we need to get the document at offset position
            // This is a simplified approach - in production, consider using cursor-based pagination
            const offsetQuery = query.limit(offset);
            const offsetSnapshot = await offsetQuery.get();

            if (!offsetSnapshot.empty) {
                const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
                query = query.startAfter(lastDoc);
            }
        }

        const docRef = await query.get();

        return {
            data: docRef.docs.map(doc => ({
                ...doc.data(),
            })),
            total: docRef.size, // This is approximate, for exact count use separate query
            hasMore: docRef.size === limit,
        };
    }catch (error){
        throw new Error(error.message);
    }
}

async function getProjectReject(){
    try {
        const docRef = await
            db.collection("project")
                .where("status" , "==", "REJECT")
                .get();
        if (docRef.empty) {
            throw new Error("Data Is Not Found");
        }
        return docRef.docs.map(doc => ({
            ...doc.data(),
        }));
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
    udpateProject,
    deleteProject,
    getProjectPending,
    updateProjectAccpted,
    getAllProject,
    getAllProjectPaginated,
    getProjectReject,
};
