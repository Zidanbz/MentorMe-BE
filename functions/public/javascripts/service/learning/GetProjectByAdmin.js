const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const { getAllProject } = require("../../repo/ProjectRepo");
const { getLearningByProject } = require("../../repo/LearningRepo");
const { getUsersByEmail } = require("../../repo/UserRepo");
const { getActivitiesByLearning } = require("../../repo/ActivityRepo");
const { generatePublicUrl } = require("../../config/BusboyConfig");

class GetProjectByAdmin {
    async getAllLearnDetails() {
        try {
            const projects = await getAllProject(); // ambil semua project
            const result = [];

            for (const project of projects) {
                const file = generatePublicUrl(project.picture);
                const learnings = await getLearningByProject(project.ID);

                for (const learning of learnings) {
                    const activities = await getActivitiesByLearning(learning.ID);

                    let lessonComplete = 0;
                    let lessonNotComplete = 0;
                    for (const activity of activities) {
                        if (activity.status === false) {
                            lessonNotComplete++;
                        }else {
                            lessonComplete++;
                        }
                    }

                    const users = await getUsersByEmail(learning.email);
                    for (const user of users) {
                        result.push({
                            "ID": learning.ID,
                            "picture": file,
                            "materialName": project.materialName,
                            "fullName": user.fullName,
                            "lessonComplete": lessonComplete,
                            "lessonNotComplete": lessonNotComplete,
                        });
                    }
                }
            }

            return result;
        }catch (err) {
            throw new Error(err.message);
        }
    }

    async getAllLearning(req) {
        try {
            const data = await this.getAllLearnDetails();
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                data,
                HttpStatus.OK.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                err.message,
                null,
                HttpStatus.INTERNAL_SERVER_ERROR.message,
            );
        }
    }
}

module.exports = GetProjectByAdmin;
