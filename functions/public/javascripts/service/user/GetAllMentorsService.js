const { getAllMentors } = require("../../repo/MentorRepo");
const { getUsersByEmails } = require("../../repo/UserRepo");
const { generatePublicUrl } = require("../../config/BusboyConfig");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

async function mappingResponse(mentors, users) {
    try {
        const userMap = new Map(users.map(user => [user.email, user]));

        return mentors.map(mentor => {
            const user = userMap.get(mentor.email);

            // Generate public URLs for files - check if file is already a URL or just filename
            let fileCV = null;
            let fileKtp = null;
            let filePicture = null;

            if (mentor.cv) {
                fileCV = mentor.cv.startsWith('http') ? mentor.cv : generatePublicUrl(mentor.cv);
            }

            if (mentor.ktp) {
                fileKtp = mentor.ktp.startsWith('http') ? mentor.ktp : generatePublicUrl(mentor.ktp);
            }

            if (user && user.picture) {
                filePicture = user.picture.startsWith('http') ? user.picture : generatePublicUrl(user.picture);
            }

            return {
                ID: mentor.ID,
                email: mentor.email,
                fullName: user ? user.fullName : "Unknown",
                cv: fileCV,
                ktp: fileKtp,
                picture: filePicture,
                portfolio: mentor.linkPortfolio,
                ability: mentor.about,
                status: mentor.status,
                money: mentor.money || 0,
                coint: mentor.coint || 0,
            };
        });
    }catch (error) {
        throw new Error(`Error mapping response: ${error.message}`);
    }
}

async function getAllMentorsService() {
    try {
        // Get all mentors
        const mentors = await getAllMentors();

        if (mentors.length === 0) {
            return new APIResponse(
                HttpStatus.OK.code,
                null,
                [],
                HttpStatus.OK.message,
            );
        }

        // Get unique mentor emails
        const mentorEmails = [...new Set(mentors.map(mentor => mentor.email))];

        // Batch query for all users
        const users = await getUsersByEmails(mentorEmails);

        // Map response
        const data = await mappingResponse(mentors, users);

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    getAllMentorsService,
};
