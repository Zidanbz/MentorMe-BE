const {db} = require("../config/FirebaseConfig");

async function createActivity(data) {
    try {
        const docRef = await db.collection("activity")
            .doc();
        await docRef.set(data.toObject());
    }catch (error) {
        throw new Error(error.message);
    }
}

function check(data){
    if (!data || data.empty) {
        throw new Error("Data not found");
    }
}

async function getActivityBySyllabus(syllabus) {
    try {
        const docRef =
            await db.collection("activity")
                .where("syllabus","==",syllabus)
                .get();
        check(docRef);
        return docRef.docs.map(doc => (doc.data()));
    }catch (error) {
        throw new Error(error.message);
    }
}

async function updateActivity(data, ID) {
    try {
        const docRef =
            await db.collection("activity")
                .where("ID","==",ID)
                .get();

        const updateActivity = docRef.docs.map( async doc => {
            try {
                const activity = {...doc.data(), id: doc.id};
                await db.collection("activity").doc(activity.id).update(
                    {
                        task: data.task,
                        status: data.status,
                        criticism: data.criticism,
                    });
            }catch (error){
                throw new Error(error.message);
            }
        });
        await Promise.all(updateActivity);
    }catch (error){
        throw new Error(error.message);
    }
}

async function getActivityById(activityId) {
    try {
        const docRef =
            await db.collection("activity")
                .where("ID","==", activityId)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

async function getActivitiesByLearning(idLearning){
    try {
        const docRef =
            await db.collection("activity")
                .where("learning","==", idLearning)
                .get();
        return docRef.docs.map(doc => (doc.data()));
    }catch (error){
        throw new Error(error.message);
    }
}

async function report(data, ID) {
    try {
        const docRef =
            await db.collection("activity")
                .where("ID","==",ID)
                .get();

        const updateActivity = docRef.docs.map( async doc => {
            try {
                const activity = {...doc.data(), id: doc.id};
                await db.collection("activity").doc(activity.id).update(
                    {
                        documentasi: data.documentasi,
                        statusReport: true,
                        activity: data.activity,
                    });
            }catch (error){
                throw new Error(error.message);
            }
        });
        await Promise.all(updateActivity);
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    createActivity,
    getActivityBySyllabus,
    updateActivity,
    getActivityById,
    getActivitiesByLearning,
    report,
}