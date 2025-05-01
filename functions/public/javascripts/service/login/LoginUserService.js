const {authenticationUserByEmail, getUsersByEmail} = require("../../repo/UserRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const bcrypt = require('bcrypt');
const {getAllCategory} = require("../../repo/CategoryRepo");
const {getAllLearningPath} = require("../../repo/LearningPathRepo");
const {generatePublicUrl} = require("../../config/BusboyConfig");
const {getMentorByEmails} = require("../../repo/MentorRepo");
const { db } = require("../../config/FirebaseConfig");

async function comparePassword(inputPassword, hashedPassword){
    const isValid = await bcrypt.compare(inputPassword, hashedPassword);
    if (!isValid) {
        throw new Error("Password is wrong");
    }
    return true;
}

async function checkMentorPending(email){
    await getUsersByEmail(email);
    const mentor = await getMentorByEmails(email);
    if (mentor != false) {
        if (mentor[0].status == "PENDING") {
            throw new Error("Mentor status is pending");
        }
    }
}

async function cekPassword(req){
    try {
        const data = await getUsersByEmail(req.email);
        let tempPassword;
        data.forEach(element => {
            tempPassword = element.password;
        })
        if (await comparePassword(req.password, tempPassword)){
            return true;
        }
        return null;
    }catch (error) {
        throw new Error(error);
    }
}

async function mappingLearningPath(){
    try {
        const allLearningPaths = await getAllLearningPath();
        const mapLearningPaths = () => {
            return allLearningPaths.map(element => ({
                ID: element.ID,
                categoryId: element.categoryId,
                name: element.name,
                picture: generatePublicUrl(element.picture), // 👈 Ubah base64 ke URL
            }));
        };
        const data = mapLearningPaths();
        return data;
    }catch (error) {
        throw new Error(error);
    }
}

async function mappingToDataResponse(users){
    const listAllCategory = await getAllCategory();
    const user = await getUsersByEmail(users.email);
    return {
      categories: listAllCategory,
      learningPath: await mappingLearningPath(),
      token: users.uid,
        role: users.customClaims,
        email: users.email,
        nameUser: user[0].fullName,
        pictureUser: generatePublicUrl(user[0].picture),
    }
}

async function loginUserService(user, fcmToken){
    try {
        await checkMentorPending(user.email);
        const users = await authenticationUserByEmail(user.email);
        await cekPassword(user);
        const data = await mappingToDataResponse(users);

if (fcmToken) {
    const userDb = await getUsersByEmail(user.email);
    if (userDb.length > 0) {
        const docRef = await db.collection("user")
            .where("email", "==", user.email)
            .limit(1)
            .get();

        if (!docRef.empty) {
            const docId = docRef.docs[0].id;
            await db.collection("user").doc(docId).update({
                fcmToken: fcmToken,
            });
        }
    }
}
        // Pastikan fcmToken ditambahkan dalam data response
        data.fcmToken = fcmToken;

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.UNAUTHORIZED.code,
            error.message,
            null,
            HttpStatus.UNAUTHORIZED.message,
        )
    }
}

module.exports = {loginUserService};