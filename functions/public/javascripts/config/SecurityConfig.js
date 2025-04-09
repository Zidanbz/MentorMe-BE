const HttpStatus = require("../util/HttpStatus");
const APIResponse = require("../DTO/response/APIResponse")
const {authentications} = require("./FirebaseConfig");
const {getUserByUid} = require("../util/AutenticationUtil");

async function verifyFirebaseToken(req, role) {
    try {
        return await getUserByUid(req);
    }catch (error){
        throw new Error("Forbidden: Insufficient permissions")
    }
}

// function authorizeRole(requiredRole) {
//     return async(req, res, next) => {
//         try {
//             const user = await verifyFirebaseToken(req); // Verifikasi token
//             const roleUser = user.customClaims.role;
//             if (!roleUser || roleUser !== requiredRole) {
//                 return res.status(HttpStatus.FORBIDDEN.code).json(
//                     new APIResponse(
//                         HttpStatus.FORBIDDEN.code,
//                         "Forbidden: Insufficient permissions",
//                         null,
//                         "Access Denied",
//                     ));
//             }
//             next(); // Lanjutkan ke middleware berikutnya jika lolos validasi
//         }catch (error) {
//             return res.status(HttpStatus.UNAUTHORIZED.code).json(
//                 new APIResponse(
//                     HttpStatus.UNAUTHORIZED.code,
//                     error.message,
//                     null,
//                     HttpStatus.UNAUTHORIZED.message,
//                 ));
//         }
//     };
// }

function authorizeRole(requiredRole, role2, role3) {
    return async(req, res, next) => {
        try {
            const user = await verifyFirebaseToken(req); // Verifikasi token
            const roleUser = user.customClaims.role;
            if ((!roleUser) || ((roleUser !== requiredRole) && (roleUser !== role2) && (roleUser !== role3))) {
                return res.status(HttpStatus.FORBIDDEN.code).json(
                    new APIResponse(
                        HttpStatus.FORBIDDEN.code,
                        "Forbidden: Insufficient permissions",
                        null,
                        "Access Denied",
                    ));
            }
            next(); // Lanjutkan ke middleware berikutnya jika lolos validasi
        }catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED.code).json(
                new APIResponse(
                    HttpStatus.UNAUTHORIZED.code,
                    error.message,
                    null,
                    HttpStatus.UNAUTHORIZED.message,
                ));
        }
    };
}

/**
 *
 * @param uid
 * @param role
 * @returns {Promise<void>}
 */
async function setCustomUserClaims(uid, role) {
    try {
        await authentications.setCustomUserClaims(uid, {role});
    }catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    verifyFirebaseToken,
    authorizeRole,
    setCustomUserClaims,
};