const {authenticationUserByEmail, getUsersByEmail} = require("../../repo/UserRepo")
const APIResponse = require("../../DTO/response/APIResponse")
const HttpStatus = require("../../util/HttpStatus")
const bcrypt = require('bcrypt');
const {getAllCategory} = require("../../repo/CategoryRepo")
const {getAllLearningPath} = require("../../repo/LearningPathRepo")

async function comparePassword(inputPassword, hashedPassword){
    const isValid = await bcrypt.compare(inputPassword, hashedPassword);
    if (!isValid) {
        throw new Error("Password is wrong");
    }
    return true;
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

async function mappingToDataResponse(token){
    const listAllCategory = await getAllCategory();
    const listAllLearningPath = await getAllLearningPath();
    return {
      categories: listAllCategory,
      learningPath: listAllLearningPath,
      token: token,
    }
}

async function loginUserService(user){
    try {
        const users = await authenticationUserByEmail(user.email);
        await cekPassword(user);
        const data = await mappingToDataResponse(users.uid);
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            data,
            HttpStatus.OK.message
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.UNAUTHORIZED.code,
            error.message,
            null,
            HttpStatus.UNAUTHORIZED.message
        )
    }
}

module.exports = {loginUserService};
