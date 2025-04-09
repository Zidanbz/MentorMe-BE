const bcrypt = require('bcrypt');
const User = require("../../entity/User");
const HttpStatus = require("../../util/HttpStatus");
const APIResponse = require("../../DTO/response/APIResponse");
const {findEmailIsAlready} = require("../../repo/UserRepo");
const {getRole} = require("../../repo/RoleRepo");
const {registerUsers} = require("../../repo/RegistrationRepo");
const {setCustomUserClaims} = require("../../config/SecurityConfig");
const {getAllCategory} = require("../../repo/CategoryRepo")
const {getAllLearningPath} = require("../../repo/LearningPathRepo")
const {saveCustomerNew} = require("../../repo/CustomerRepo")
const Customer = require("../../entity/Customer");
const {ID} = require("../../util/UUID");
// const ROLE_ID_USER = 2; // Constanta untuk ID role

// Fungsi untuk mengecek validitas email
function cekEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
        throw new Error(`${email} is not a valid email address.`);
    }
    return true;
}

// Fungsi untuk mengenkripsi password
async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 12);
    }catch (error) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
}

function confirmationPassword(password, confirmPassword) {
    if (!(password === confirmPassword)) {
        throw new Error(`${password} is not equal to confirm password`);
    }
    return true;
}

// Fungsi untuk memetakan user ke entitas User
function mappingUser(user, role, picture) {
    if (confirmationPassword(user.password, user.confirmPassword)){
        return new User(user.fullName, user.email, user.password, role.getName(), null, picture);
    }
}

async function mappingToDataResponse(token, user){
    const listAllCategory = await getAllCategory();
    const listAllLearningPath = await getAllLearningPath();
    return {
        categories: listAllCategory,
        learningPath: listAllLearningPath,
        token: token,
        fullName: user.fullName,
    }
}

async function mappingToCustomers(req){
    try {
        return new Customer(
            ID(),
            req.email,
            "FREE",
            null,
            0,
        );
    }catch (error){
        throw new Error(`${error.message}`);
    }
}

// Fungsi utama untuk register user
async function registerUser(userInstance, {roles= 2, picture=null}) {
    try {
        cekEmail(userInstance.email);
        await findEmailIsAlready(userInstance.email);
        const role = await getRole(roles);
        const userData = mappingUser(userInstance, role, picture);
        const hashedPassword = await hashPassword(userData.getPassword());
        userData.setPassword(hashedPassword);
        const token = await registerUsers(userData);
        const customerData = mappingToCustomers(userData);
        if (roles === 2){
            await saveCustomerNew(customerData);
        }
        const tempToken = token.uid;
        const data = await mappingToDataResponse(tempToken, userData);
        // Set Claims
        await setCustomUserClaims(tempToken, role.name);

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            data,
            HttpStatus.CREATED.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        )
    }
}

module.exports = {
    registerUser,
};