const {newSyllabus, getSyllabusByProject, updateSyllabusById} = require("../../repo/SyllabusRepo");
const {ID} = require("../../util/UUID");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const {getUserByUid} = require("../../util/AutenticationUtil");
const {getMentorByEmail} = require("../../repo/MentorRepo")
const {getProjectById, getProjectBySyllabus} = require("../../repo/ProjectRepo");
const Syllabus = require("../../entity/Syllabus");
const {newActivity} = require("../activity/CreateNewActivityService");
// const process = require("node:process");
const {getLearningByProject} = require("../../repo/LearningRepo");
// const {createActivity} = require("../../repo/ActivityRepo");


async function findProject(id) {
    return await getProjectById(id);
}

async function findMentorProject(req){
    try {
        const emailMentor = await getUserByUid(req);
        const mentor = await getMentorByEmail(emailMentor.email);
        const mentors = mentor[0];
        const project = await findProject(req.params.id);
        return {mentors, project};
    }catch (error){
        throw new Error(error.message);
    }
}

async function mappingSyllabus(req){
    try {
        const {mentors, project} = await findMentorProject(req);
        return new Syllabus(
            ID(),
            mentors.ID,
            project.ID,
            req.body.meeting,
            req.body.MaterialNameSyllabus,
            req.body.description,
            req.body.task,
        );
    }catch (error){
        throw new Error(error.message);
    }
}

async function mappingResponse(data){
    try {
        return data.map(({ ID, Meeting, MaterialNameSyllabus, Description, Task }) => ({
            SyllabusId: ID,
            Meeting,
            MaterialNameSyllabus,
            Description,
            Task,
        }));
    }catch (error){
        throw new Error(error.message);
    }
}

async function addActivityBySyllabus(syllabus){
    try {
        const project = await getProjectBySyllabus(syllabus.project);
        const listLearning = await getLearningByProject(project[0].ID);
        for (const value of listLearning) {
            await newActivity(value.ID, syllabus.ID);
        }
    }catch (error){
        throw new Error(error.message);
    }
}

async function createNewSyllabusService(req){
    try {
        const syllabus = await mappingSyllabus(req);
        await newSyllabus(syllabus);
        await addActivityBySyllabus(syllabus);
        const dataTemp = await getSyllabusByProject(syllabus.project);
        const data = await mappingResponse(dataTemp);
        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data,
            HttpStatus.CREATED.message,
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

async function updateSyllabusService(req) {
    try {
        console.log("🔥 Received req.body:", req.body);
        const syllabusId = req.params.id;

        const updatedData = {
            Meeting: req.body.meeting,
            MaterialNameSyllabus: req.body.MaterialNameSyllabus,
            Description: req.body.description,
            Task: req.body.task,
        };

        await updateSyllabusById(syllabusId, updatedData);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            { id: syllabusId, ...updatedData },
            "Syllabus updated successfully",
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message,
        );
    }
}

module.exports = {
    createNewSyllabus: createNewSyllabusService,
    updateSyllabus: updateSyllabusService,
};