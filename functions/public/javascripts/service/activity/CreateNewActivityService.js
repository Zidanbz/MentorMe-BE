const {ID} = require("../../util/UUID");
const Activity = require("../../entity/Activity");
const {createActivity} = require("../../repo/ActivityRepo")

function mappingActivity(learning, syllabus){
    try {
        return new Activity(
            ID(),
            learning,
            syllabus,
            false,
            "empty",
            "empty",
            false,
            "empty",
            "empty",
        )
    }catch (error){
        throw new Error(error.message);
    }
}

async function newActivity(learning, syllabus) {
    try {
        const data = mappingActivity(learning, syllabus);
        await createActivity(data);
    }catch (error){
        throw new Error(error.message);
    }
}

module.exports = {
    newActivity,
};